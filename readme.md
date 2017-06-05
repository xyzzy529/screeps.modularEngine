
# ScreepsOCS/screeps.modularEngine

[![slack](https://img.shields.io/badge/chat-on%20slack-blue.svg)](https://screeps.slack.com/messages/ocs/)  

This document:  
[Intro](#intro)  
[Installation](#installation)  
[Usage](#usage)  
[Known existing features](#features)  
[About OCS](#ocs)  
Other links:  
[Rough implementation schedule](https://github.com/ScreepsOCS/screeps.modularEngine/issues/3)

## <a name="intro"></a>Intro

The screeps.modularEngine repository implements the core part for a new AI for [Screeps](https://screeps.com/).  
Part of this engine are mainly:
* Grunt Screeps deployment
* Lazy raw memory partitions
* Loop phases
* Feature extension model
* Log system
* "Kind of" events
* Profiler

Everything else needs to be developed in additional *features*. 

Each feature should be contained in a separate repository. This way, everyone can combine features at pleasure.  

While there is a notion which features may be required (=> [rough implementation schedule](https://github.com/ScreepsOCS/screeps.modularEngine/issues/3)), it's absolutely open and up to the community what may exist eventually. There may be different alternative (replacing) navigation features, or different tower features, private features, anything... 

Every feature needs to be placed within the features folder (clone to /src/features or create a new sub directory and init a new git repository).
To "use" a feature, you need to register it to your individual main.js (see example.main.js). 

There is a sample feature included in this repository to explain how features work. 

## <a name="installation"></a>Installation

1. Install Node  
  https://nodejs.org/en/

2. Install the grunt CLI (using admin rights/sudo if required)  
  `npm install -g grunt-cli`  

3. Clone repository
  * via CLI  
    `git clone https://github.com/ScreepsOCS/screeps.modularEngine.git`  
  * via Github Desktop  
    Click the plus sign (+) at the top left corner, click clone and select `ScreepsOCS`, then `screeps.modularEngine`.  

4. Install dependencies after changing directory into the newly cloned work area  
  `cd screeps.modularEngine`  
  `npm i`

5. Create a screeps.json file (copy example.screeps.json) & enter screeps account login data  
  `cp example.screeps.json screeps.json`
  
6. Create a main.js file (copy example.main.js)
  `cd src`  
  `cp example.main.js main.js`

7. Clone features into /src/features and edit main.js code

## <a name="usage"></a>Usage

Commands
  * to build (without deployment)  
  `grunt`  
  * to build & deploy  
  `grunt deploy [--branch=<customBranch>]`  
  Default branch is defined in screeps.json
  * commit & push to all feature repos  
  `grunt pushAll:"<commit message>"`

## <a name="features"></a>Known existing features

* [ScreepsOCS/screeps.feature.foundation](https://github.com/ScreepsOCS/screeps.feature.foundation)  
  Basic foundation to get screeps up & running.  
  Analyzes rooms, flags & creeps & triggers events.  
  Serves as basis for higher features.  

* [ScreepsOCS/screeps.feature.worker](https://github.com/ScreepsOCS/screeps.feature.worker)
  Basic worker feature.  
  Build, repair, fortify, support hauler/upgrader

* [cyberblast/screeps.feature.basicTower](https://github.com/cyberblast/screeps.feature.basicTower)  
  Providing simple heal, (urgent) repair & attack functionality

* [cyberblast/screeps.feature.navigation](https://github.com/cyberblast/screeps.feature.navigation)  
  Utilizing PathFinder. Caching costMatrices, cross room paths & local paths.  
  Providing some additional room features (isHighwayRoom, isSKRoom etc...)

## <a name="ocs"></a>About OCS

The Open Collaboration Society (OCS) is a github organization, focused on development for the game [Screeps](https://screeps.com/), "the world's first MMO sandbox game for programmers".  
For further clarification: we are not an ingame alliance, but a loose bunch of players who like the idea to combine efforts and create something by working on it together. 

If you are interested in participation you are welcome to simply do so.  
You may fork or clone our repos and create a pull request and take part in our issues or slack channel.  
Please note our [contributor license](https://raw.githubusercontent.com/ScreepsOCS/screeps.modularEngine/dev/CONTRIBUTING.txt)!

If you are interested in joining our group please send an email request to [cyberblast](mailto://ocs@cyberblast.org).
