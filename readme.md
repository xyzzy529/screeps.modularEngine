
## cyberblast/screeps.engine

### Intro

Hi folks, 

this is my most recent idea: a fully modular screeps repository. 
Core is this one, containing grunt deployment & base engine. 

Anything else needs to be developed in additional *features*. 
Each feature should be a separate repository. This way, everybody can combine features as they like to. For example, there could be different alternative navigation features, or different tower features, anything... 

Every feature needs to be placed within the features folder (create a new subfolder & init the feature git repo there).
To "use" a feature, you need to register it in your individual main.js (see example.main.js). 

There is a sample feature included in this repository to explain how features work (and I'm already working on real some, in separate repos). 

Please feel free to [drop me a line](mailto:ocs@cyberblast.org) if you like it or have a question about it, I'm happy about every feedback! :) 

### Installation

1. Install Node  
  https://nodejs.org/en/

2. Install the grunt CLI (using admin rights/sudo if required)  
  `npm install -g grunt-cli`  

3. Clone repository and submodules  
  * via CLI  
    `git clone https://github.com/cyberblast/screeps.engine.git`  
  * via Github Desktop  
    Click the plus sign (+) at the top left corner, click clone and select `cyberblast`, then `screeps.engine`.  

4. Install dependencies after changing directory into the newly cloned work area  
  `cd screeps.engine`  
  `npm i`

5. Create a screeps.json file (copy example.screeps.json) & enter screeps account login data  
  `cp example.screeps.json screeps.json`

### Usage

Commands
  * to build (without deployment)  
  `grunt`  
  * to build & deploy  
  `grunt deploy [--branch=<customBranch>]`
  