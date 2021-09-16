if(BulkBuyModifier === undefined) var BulkBuyModifier = {};
BulkBuyModifier.name = 'Bulk Buy Modifier';
BulkBuyModifier.id = 'BulkBuyModifier';
BulkBuyModifier.version = '1.1';
BulkBuyModifier.GameVersion = '2.042';

BulkBuyModifier.launch = function(){
  BulkBuyModifier.init = function(){
    // let dir = CCSE.GetModPath(BulkBuyModifier.id);

    // it's not easy to replace this code so we're going to snipe it
    eval("Game.Logic=" + Game.Logic.toString().replaceAll("(Game.keys[16] || Game.keys[17])", "false").replaceAll("(!Game.keys[16] && !Game.keys[17])", "false"));
    CCSE.ReplaceCodeIntoFunction(`Game.BuildStore`, `id="storeBulk"`, `id="storeBulk" style="display: flex;"`, 0);
    CCSE.ReplaceCodeIntoFunction(`Game.BuildStore`, `="Game.storeBulkButton(0);"`, `="Game.storeBulkSetMode(1);"`, 0);
    CCSE.ReplaceCodeIntoFunction(`Game.BuildStore`, `="Game.storeBulkButton(1);"`, `="Game.storeBulkSetMode(-1);"`, 0);
    CCSE.ReplaceCodeIntoFunction(`Game.BuildStore`, `				'<div id="storeBulk1" class="storePreButton storeBulkAmount" '+Game.clickStr+'="Game.storeBulkButton(2);">1</div>'+`, '', 0);
    CCSE.ReplaceCodeIntoFunction(`Game.BuildStore`, `				'<div id="storeBulk10" class="storePreButton storeBulkAmount" '+Game.clickStr+'="Game.storeBulkButton(3);">10</div>'+`, '', 0);
    CCSE.ReplaceCodeIntoFunction(`Game.BuildStore`, `				'<div id="storeBulk100" class="storePreButton storeBulkAmount" '+Game.clickStr+'="Game.storeBulkButton(4);">100</div>'+`, '', 0);
    CCSE.ReplaceCodeIntoFunction(`Game.BuildStore`, `				'<div id="storeBulkMax" class="storePreButton storeBulkAmount" '+Game.clickStr+'="Game.storeBulkButton(5);">'+loc("all")+'</div>'+`, '', 0);
    CCSE.ReplaceCodeIntoFunction(`Game.BuildStore`, `				'</div>';`, `'';
    for (let i = 0; i < Game.bulkValues.length; i++) {
      const bulkval = Game.bulkValues[i];
      str += '<div id="storeBulk'+ bulkval +'" class="storePreButton storeBulkAmount" ' + Game.clickStr + '="Game.storeBulkModifiedButton('+i+');">'+ bulkval +'</div>';
    }
    str += '</div>';`, 0);
    // this is causing us problems so kill it
    // it can live if we find a way to restore storeBulkMax without complications
    // maybe call our two methods based on the legacy way of doing things
    Game.storeBulkButton = function() {}
    Game.registerHook('logic', BulkBuyModifier.LogicCheck);

    Game.customOptionsMenu.push(BulkBuyModifier.customOptionsMenu);

    BulkBuyModifier.isLoaded = 1;
    if (Game.prefs.popups) Game.Popup(BulkBuyModifier.name + ' loaded!');
    else Game.Notify(BulkBuyModifier.name + ' loaded!', '', '', 1, 1);
  }

  Game.bulkValueIndex = 0;
  Game.storeBulkSetMode = function(mode){
    // idk why you would call this with an invalid mode
    Game.buyMode = mode;

    let isBuying = Game.buyMode == 1;
    // l('storeBulkMax').style.visibility = (isBuying ? 'hidden' : 'visible');
    l('products').className = (isBuying ? 'storeSection' : 'storeSection selling');
    l('storeBulkBuy').className = (isBuying ? 'storePreButton storeBulkMode selected' : 'storePreButton storeBulkMode');
    l('storeBulkSell').className = (Game.buyMode == -1 ? 'storePreButton storeBulkMode selected' : 'storePreButton storeBulkMode');

    Game.storeToRefresh = 1;
    PlaySound('snd/tick.mp3');
  }
  Game.storeBulkModifiedButton = function(index){
    Game.buyBulk = Game.bulkValues[index];
    Game.bulkValueIndex = index;

    for (let i = 0; i < Game.bulkValues.length; i++) {
      const bulkval = Game.bulkValues[i];
      if(l('storeBulk'+bulkval)) l('storeBulk'+bulkval).className = (i == index ? 'storePreButton storeBulkAmount selected' : 'storePreButton storeBulkAmount');
    }

    Game.storeToRefresh = 1;
    PlaySound('snd/tick.mp3');
  }

  BulkBuyModifier.LogicCheck = function () {
    // press
    if (!Game.promptOn) {
      if ((Game.keys[16] || Game.keys[17] || Game.keys[18]) && !Game.buyBulkShortcut) {
        if (Game.keys[16]) {
          Game.storeBulkModifiedButton(Math.min(Game.bulkValues.length-1, Game.bulkValueIndex+1));
        }
        if (Game.keys[17]) {
          Game.storeBulkModifiedButton(Math.max(0, Game.bulkValueIndex-1));
        }
        if ((Game.keys[16] && Game.keys[17])) {
          Game.storeBulkSetMode(Game.buyMode * -1);
        }
        Game.buyBulkShortcut = 1;
      }
    }
    // release
    if ((!Game.keys[16] && !Game.keys[17]) && Game.buyBulkShortcut) {
      Game.buyBulkShortcut = 0;
    }
  }

  BulkBuyModifier.settings = { // default settings
    bulkValues: [1, 10, 50, 100, 200/* , 'Max' */],
  };
  Game.bulkValues = BulkBuyModifier.settings;
  Game.bulkValueIndex = 0;
  Game.buyMode = 1;
  Game.buyBulk = 1;

  BulkBuyModifier.inputCallback = function(i) {
    let value = document.getElementById('BulkBuyModifierValue' + i).value ?? 2;
    BulkBuyModifier.settings.bulkValues[i] = value;
    Game.BuildStore();
  }
  
  // Makes a slider for index i of BulkBuyModifier.settings.quantilesToDisplay
  BulkBuyModifier.makeInput = function(i) {
    return CCSE.MenuHelper.InputBox(
        'BulkBuyModifierValue' + i,
        '65',
        BulkBuyModifier.settings.bulkValues[i],
        'BulkBuyModifier.inputCallback(' + i + ')'
    );
  }
  
  BulkBuyModifier.eraseInputCallback = function(i) {
    BulkBuyModifier.settings.bulkValues.splice(i, 1);
    Game.UpdateMenu();
    Game.BuildStore();
  }
  
  BulkBuyModifier.customOptionsMenu = function() {
    let menuStr = "";
    let i = 0;
    let biggestValue = 0;
    for(i in BulkBuyModifier.settings.bulkValues) {
        menuStr += '<div class="listing">' +
            BulkBuyModifier.makeInput(i) +
            `<div style="display:inline; vertical-align:top;">
                <a class="option" onclick="BulkBuyModifier.eraseInputCallback(${i});">Remove</a>
            </div>` +
        '</div>';
        let cval = BulkBuyModifier.settings.bulkValues[i];
        if (Number.isInteger(cval) && cval > biggestValue) {
          biggestValue = cval;
        }
    }
  
    let length = BulkBuyModifier.settings.bulkValues.length;
    let onclick = `BulkBuyModifier.settings.bulkValues[${length}] = ${biggestValue * 2}`;
    menuStr += `<div class="listing">
        <a class="option" onclick="${onclick};Game.UpdateMenu();Game.BuildStore();">Add Bulk Value</a>
        </div>`;
    CCSE.AppendCollapsibleOptionsMenu(BulkBuyModifier.name, menuStr);
  }
  
  BulkBuyModifier.save = function() {
    return JSON.stringify({
        version: BulkBuyModifier.version,
        settings: BulkBuyModifier.settings,
    });
  }
  
  BulkBuyModifier.load = function(str) {
    let obj = JSON.parse(str);
    if('bulkValues' in obj.settings ?? {}) {
        BulkBuyModifier.settings.bulkValues = obj.settings.bulkValues;
    }
    Game.bulkValues = BulkBuyModifier.settings.bulkValues;
    Game.bulkValueIndex = 0;
    Game.buyMode = 1;
    Game.storeBulkSetMode(1);
    Game.storeBulkModifiedButton(0);
    Game.BuildStore();
  }

	if(CCSE.ConfirmGameVersion(BulkBuyModifier.name, BulkBuyModifier.version, BulkBuyModifier.GameVersion)) Game.registerMod(BulkBuyModifier.id, BulkBuyModifier); // BulkBuyModifier.init();
}

if(!BulkBuyModifier.isLoaded){
	if(CCSE && CCSE.isLoaded){
		BulkBuyModifier.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(BulkBuyModifier.launch);
	}
}