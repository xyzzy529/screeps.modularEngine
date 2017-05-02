let usedOnStart = 0;
let enabled = false;
let depth = 0;
let memory;

function setupProfiler() {
  depth = 0; // reset depth, this needs to be done each tick.
  Game.profiler = {
    stream(duration, filter) {
      setupMemory('stream', duration || 10, filter);
    },
    email(duration, filter) {
      setupMemory('email', duration || 100, filter);
    },
    profile(duration, filter) {
      setupMemory('profile', duration || 100, filter);
    },
    background(filter) {
      setupMemory('background', false, filter);
    },
    restart() {
      if (Profiler.isProfiling()) {
        const filter = memory.filter;
        let duration = false;
        if (!!memory.disableTick) {
          // Calculate the original duration, profile is enabled on the tick after the first call,
          // so add 1.
          duration = memory.disableTick - memory.enabledTick + 1;
        }
        const type = memory.type;
        setupMemory(type, duration, filter);
      }
    },
    reset: resetMemory,
    output: Profiler.output,
  };
  overloadCPUCalc();
}

function setupMemory(profileType, duration, filter) {
  resetMemory();
  const disableTick = Number.isInteger(duration) ? Game.time + duration : false;
  if (!memory) {
    memory = {
      map: {},
      totalTime: 0,
      enabledTick: Game.time + 1,
      disableTick,
      type: profileType,
      filter,
    };
  }

  if( memory == null ) RawMemory.segments[1] = '';
  else RawMemory.segments[1] = JSON.stringify(memory);
}

function resetMemory() {
  memory = null;
  RawMemory.segments[1] = '';
}

function overloadCPUCalc() {
  if (Game.rooms.sim) {
    usedOnStart = 0; // This needs to be reset, but only in the sim.
    Game.cpu.getUsed = function getUsed() {
      return performance.now() - usedOnStart;
    };
  }
}

function getFilter() {
  return memory.filter;
}

const functionBlackList = [
  'getUsed', // Let's avoid wrapping this... may lead to recursion issues and should be inexpensive.
  'constructor', // es6 class constructors need to be called with `new`
  'LiteEvent'
];

function wrapFunction(name, originalFunction) {
  return function wrappedFunction() {
    if (Profiler.isProfiling()) {
      const nameMatchesFilter = name === getFilter();
      const start = Game.cpu.getUsed();
      if (nameMatchesFilter) {
        depth++;
      }
      const result = originalFunction.apply(this, arguments);
      if (depth > 0 || !getFilter()) {
        const end = Game.cpu.getUsed();
        Profiler.record(name, end - start);
      }
      if (nameMatchesFilter) {
        depth--;
      }
      return result;
    }

    return originalFunction.apply(this, arguments);
  };
}

function hookUpPrototypes() {
  Profiler.prototypes.forEach(proto => {
    profileObjectFunctions(proto.val, proto.name);
  });
}

function profileObjectFunctions(object, label) {
  Object.getOwnPropertyNames(object).forEach(functionName => {
    const extendedLabel = `${label}.${functionName}`;
    try {
      const isFunction = typeof object[functionName] === 'function';
      const notBlackListed = functionBlackList.indexOf(functionName) === -1;
      if (isFunction && notBlackListed) {
        const originalFunction = object[functionName];
        object[functionName] = profileFunction(originalFunction, extendedLabel);
      }
    } catch (e) { console.log(`Profiler error in profileObjectFunctions for ${extendedLabel}`, e.stack ? e.stack : e)} /* eslint no-empty:0 */
  });

  const objectPrototype = object.prototype;
  if( objectPrototype ) Object.getOwnPropertyNames(objectPrototype).forEach(functionName => {
    const extendedLabel = `${label}.prototype.${functionName}`;
    try {
      const isFunction = typeof objectPrototype[functionName] === 'function';
      const notBlackListed = functionBlackList.indexOf(functionName) === -1;
      if (isFunction && notBlackListed) {
        const originalFunction = objectPrototype[functionName];
        objectPrototype[functionName] = profileFunction(originalFunction, extendedLabel);
      }
    } catch (e) { console.log(`Profiler error in profileObjectFunctions for ${extendedLabel}`, e.stack ? e.stack : e)} /* eslint no-empty:0 */
  });

  return object;
}

function profileFunction(fn, functionName) {
  if( fn.profileWrapped ) return fn;
  const fnName = functionName || fn.name;
  if (!fnName) {
    console.log('Couldn\'t find a function name for - ', fn);
    console.log('Will not profile this function.');
    return fn;
  }
  // prevent repeated wrapping
  let wrapped = wrapFunction(fnName, fn);
  wrapped.profileWrapped = true;
  return wrapped;
}

const Profiler = {
  printProfile() {
    console.log(Profiler.output());
  },

  emailProfile() {
    Game.notify(Profiler.output());
  },

  output(numresults) {
    const displayresults = !!numresults ? numresults : 20;
    if (!memory || !memory.enabledTick) {
      return 'Profiler not active.';
    }

    const elapsedTicks = Game.time - memory.enabledTick + 1;
    const header = 'calls\t\ttime\t\tavg\t\tfunction';
    const footer = [
      `Avg: ${(memory.totalTime / elapsedTicks).toFixed(2)}`,
      `Total: ${memory.totalTime.toFixed(2)}`,
      `Ticks: ${elapsedTicks}`,
    ].join('\t');
    return [].concat(header, Profiler.lines().slice(0, displayresults), footer).join('\n');
  },

  lines() {
    const stats = Object.keys(memory.map).map(functionName => {
      const functionCalls = memory.map[functionName];
      return {
        name: functionName,
        calls: functionCalls.calls,
        totalTime: functionCalls.time,
        averageTime: functionCalls.time / functionCalls.calls,
      };
    }).sort((val1, val2) => {
      return val2.totalTime - val1.totalTime;
    });

    const lines = stats.map(data => {
      return [
        data.calls,
        data.totalTime.toFixed(1),
        data.averageTime.toFixed(3),
        data.name,
      ].join('\t\t');
    });

    return lines;
  },

  prototypes: [
    { name: 'Game', val: Game },
    { name: 'Room', val: Room },
    { name: 'Structure', val: Structure },
    { name: 'Spawn', val: Spawn },
    { name: 'Creep', val: Creep },
    { name: 'RoomPosition', val: RoomPosition },
    { name: 'Source', val: Source },
    { name: 'Flag', val: Flag },
  ],

  record(functionName, time) {
    if (!memory.map[functionName]) {
      memory.map[functionName] = {
        time: 0,
        calls: 0,
      };
    }
    memory.map[functionName].calls++;
    memory.map[functionName].time += time;
  },

  endTick() {
    if (Game.time >= memory.enabledTick) {
      const cpuUsed = Game.cpu.getUsed();
      memory.totalTime += cpuUsed;
      Profiler.report();
    }
  },

  report() {
    if (Profiler.shouldPrint()) {
      Profiler.printProfile();
    } else if (Profiler.shouldEmail()) {
      Profiler.emailProfile();
    }
  },

  isProfiling() {
    if (!enabled || !memory) {
      return false;
    }
    return !memory.disableTick || Game.time <= memory.disableTick;
  },

  type() {
    return memory.type;
  },

  shouldPrint() {
    const streaming = Profiler.type() === 'stream';
    const profiling = Profiler.type() === 'profile';
    const onEndingTick = memory.disableTick === Game.time;
    return streaming || (profiling && onEndingTick);
  },

  shouldEmail() {
    return Profiler.type() === 'email' && memory.disableTick === Game.time;
  },
};

module.exports = {
  wrap(callback) {
    if (enabled) {
      setupProfiler();
    }

    if (Profiler.isProfiling()) {
      usedOnStart = Game.cpu.getUsed();
      const returnVal = callback();
      Profiler.endTick();
      return returnVal;
    }

    return callback();
  },

  enable() {
    enabled = true;
    //hookUpPrototypes();
    let segment = RawMemory.segments[1];
    if( segment != null ){
        if( segment.length !== 0 ) memory = JSON.parse(segment);
        else memory = null;
    }
  },

  save(){
    if( memory == null ) RawMemory.segments[1] = '';
    else RawMemory.segments[1] = JSON.stringify(memory);
  },

  output: Profiler.output,

  registerObject: profileObjectFunctions,
  registerFN: profileFunction,
  registerClass: profileObjectFunctions,
};
