
# ScreepsOCS/screeps.modularEngine

### Intro

Hi folks, 

this is an idea I came across: a fully modular screeps AI. Where every functionality is contained in exchangeable extensions. 
Core is this one, containing grunt deployment & base engine (lazy raw memory partitions, loop phases, feature processing). 

Anything else needs to be developed in additional *features*. 
Each feature should be contained in a separate repository. This way, everyone can combine features as they like to. For example, there could be different alternative (replacing) navigation features, or different tower features, private features, anything... 

Every feature needs to be placed within the features folder (clone to /src/features or create a new sub directory and init a new git repository).
To "use" a feature, you need to register it to your individual main.js (see example.main.js). 

There is a sample feature included in this repository to explain how features work (and I'm already working on real some, in separate repos). 

Much work ahead ^^

Please feel free to [drop me a line](mailto:ocs@cyberblast.org) if you like it or have a question about it, I'm happy about every feedback! :) 

### Installation

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

### Usage

Commands
  * to build (without deployment)  
  `grunt`  
  * to build & deploy  
  `grunt deploy [--branch=<customBranch>]`  
  Default branch is defined in screeps.json
  * commit & push all features  
  `grunt pushAll:"<commit message>"`

## Known existing features

* [cyberblast/screeps.feature.basicTower](https://github.com/cyberblast/screeps.feature.basicTower)  
  Providing simple heal, (urgent) repair & attack functionality

* [cyberblast/screeps.feature.navigation](https://github.com/cyberblast/screeps.feature.navigation)  
  Utilizing PathFinder. Caching costMatrices, cross room paths & local paths.  
  Providing some additional room features (isHighwayRoom, isSKRoom etc...)

* [cyberblast/screeps.feature.foundation](https://github.com/cyberblast/screeps.feature.foundation) *(incomplete)*  
  Basic foundation to get screeps up & running.  
  Analyzes rooms, flags & creeps & triggers events.  
  Serves as basis for higher features.  
