if(BulkBuyModifier === undefined) var BulkBuyModifier = {};
BulkBuyModifier.name = 'Bulk Buy Modifier';
BulkBuyModifier.id = 'BulkBuyModifier';
BulkBuyModifier.version = '1.0';
BulkBuyModifier.GameVersion = '2.042';

BulkBuyModifier.launch = function(){
  BulkBuyModifier.init = function(){
    // let dir = CCSE.GetModPath(BulkBuyModifier.id);
    // BulkBuyModifier.styles = `
    // #BulkBuyModifierHolder {
    //   position: absolute;
    //   font-weight: bold;
    //   top: 24px;
    //   right: -11px;
    //   width: 48px;
    //   text-align: center;
    // }

    // #BulkBuyModifierIcon {
    //   pointer-events: none;
    //   position: absolute;
    //   width: 48px;
    //   height: 48px;
    //   margin-left: 0;
    //   margin-right: 0;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    // }

    // #BulkBuyModifierAmount {
    //   z-index: 10;
    //   text-shadow: 0px 1px 0px #000, 0px 0px 6px #ff00e4;
    //   color: #f01700;
    //   flex: 0 0 48px;
    //   font-size: 24px;
    //   font-family: 'Merriweather', Georgia,serif;
    // }
    // `;
    // CCSE.AddStyles(BulkBuyModifier.styles);

    // it's not easy to replace this code so we're going to snipe it
    eval("Game.Logic=" + Game.Logic.toString().replaceAll("(Game.keys[16] || Game.keys[17])", "false").replaceAll("(!Game.keys[16] && !Game.keys[17])", "false"));
    // Game.BuildStore();
    // Game.storeBulkSetMode(1);
    // Game.storeBulkModifiedButton(0);
    Game.registerHook('logic', BulkBuyModifier.LogicCheck);

    Game.customOptionsMenu.push(BulkBuyModifier.customOptionsMenu);

    BulkBuyModifier.isLoaded = 1;
    if (Game.prefs.popups) Game.Popup(BulkBuyModifier.name + ' loaded!');
    else Game.Notify(BulkBuyModifier.name + ' loaded!', '', '', 1, 1);
  }

  Game.bulkValueIndex = 0;
  // Game.bulkValues = [1, 10, 50, 100, 200, 'Max'];
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
  //create the DOM for the store's buildings
  BulkBuyModifier.OriginalBuildStore = Game.BuildStore;
  Game.BuildStore = function () {
    // console.log("fuck", Error().stack, Game.bulkValueIndex, Game.buyMode, Game.buyBulk, Game.bulkValues);
    //if (typeof showAds!=='undefined') l('store').scrollTop=100;
    var str = '';
    str += '<div id="storeBulk" class="storePre" style="display: flex;" ' + Game.getTooltip(
      '<div style="padding:8px;min-width:200px;text-align:center;font-size:11px;">' + loc("You can also press %1 to bulk-buy or sell %2 of a building at a time, or %3 for %4.", ['<b>' + loc("Ctrl") + '</b>', '<b>10</b>', '<b>' + loc("Shift") + '</b>', '<b>100</b>']) + '</div>'
      , 'store') +
      '>' +
      '<div id="storeBulkBuy" class="storePreButton storeBulkMode" ' + Game.clickStr + '="Game.storeBulkSetMode(1);">' + loc("Buy") + '</div>' +
      '<div id="storeBulkSell" class="storePreButton storeBulkMode" ' + Game.clickStr + '="Game.storeBulkSetMode(-1);">' + loc("Sell") + '</div>';

    for (let i = 0; i < Game.bulkValues.length; i++) {
      const bulkval = Game.bulkValues[i];
      // if (bulkval == "Max"){
        // str += '<div id="storeBulkMax" class="storePreButton storeBulkAmount" ' + Game.clickStr + '="Game.storeBulkSetMode(-1);Game.storeBulkModifiedButton('+i+');">' + loc("all") + '</div>';
      // } else {
        str += '<div id="storeBulk'+ bulkval +'" class="storePreButton storeBulkAmount" ' + Game.clickStr + '="Game.storeBulkModifiedButton('+i+');">'+ bulkval +'</div>';
      // }
    }
      
    str +=  '</div>';
    for (var i in Game.Objects) {
      var me = Game.Objects[i];
      str += (Game.prefs.screenreader ? '<button aria-labelledby="ariaReader-product-' + (me.id) + '"' : '<div') + ' class="product toggledOff" ' + Game.getDynamicTooltip('Game.ObjectsById[' + me.id + '].tooltip', 'store') + ' id="product' + me.id + '"><div class="icon off" id="productIconOff' + me.id + '" style=""></div><div class="icon" id="productIcon' + me.id + '" style=""></div><div class="content"><div class="lockedTitle">???</div><div class="title productName" id="productName' + me.id + '"></div><span class="priceMult" id="productPriceMult' + me.id + '"></span><span class="price" id="productPrice' + me.id + '"></span><div class="title owned" id="productOwned' + me.id + '"></div>' + (Game.prefs.screenreader ? '<label class="srOnly" style="width:64px;left:-64px;" id="ariaReader-product-' + (me.id) + '"></label>' : '') + '</div>' +
        /*'<div class="buySell"><div style="left:0px;" id="buttonBuy10-'+me.id+'">Buy 10</div><div style="left:100px;" id="buttonSell-'+me.id+'">Sell 1</div><div style="left:200px;" id="buttonSellAll-'+me.id+'">Sell all</div></div>'+*/
        (Game.prefs.screenreader ? '</button>' : '</div>');
    }
    l('products').innerHTML = str;

    // Game.storeBulkButton(-1);

    /*var SellAllPrompt=function(id)
    {
      return function(id){Game.Prompt('<div class="block">Do you really want to sell your '+loc("%1 "+Game.ObjectsById[id].bsingle,LBeautify(Game.ObjectsById[id].amount))+'?</div>',[['Yes','Game.ObjectsById['+id+'].sell(-1);Game.ClosePrompt();'],['No','Game.ClosePrompt();']]);}(id);
    }*/

    for (var i in Game.Objects) {
      var me = Game.Objects[i];
      me.l = l('product' + me.id);

      //these are a bit messy but ah well
      if (!Game.touchEvents) {
        AddEvent(me.l, 'click', function (what) { return function (e) { Game.ClickProduct(what); e.preventDefault(); }; }(me.id));
      }
      else {
        AddEvent(me.l, 'touchend', function (what) { return function (e) { Game.ClickProduct(what); e.preventDefault(); }; }(me.id));
      }
    }
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