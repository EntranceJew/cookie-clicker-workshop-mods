if(SpoiledMilk === undefined) var SpoiledMilk = {};
SpoiledMilk.name = 'Spoiled Milk';
SpoiledMilk.id = 'SpoiledMilk';
SpoiledMilk.version = '1.0';
SpoiledMilk.GameVersion = '2.042';

SpoiledMilk.launch = function(){
  SpoiledMilk.init = function(){
    let dir = CCSE.GetModPath(SpoiledMilk.id);

    CCSE.NewMilkSelection("Beans milk", [21,23], dir + "/img/milkBeans.png");
  
    SpoiledMilk.isLoaded = 1;
    if (Game.prefs.popups) Game.Popup(SpoiledMilk.name + ' loaded!');
    else Game.Notify(SpoiledMilk.name + ' loaded!', '', '', 1, 1);
  }

	if(CCSE.ConfirmGameVersion(SpoiledMilk.name, SpoiledMilk.version, SpoiledMilk.GameVersion)) Game.registerMod(SpoiledMilk.id, SpoiledMilk); // SpoiledMilk.init();
}

if(!SpoiledMilk.isLoaded){
	if(CCSE && CCSE.isLoaded){
		SpoiledMilk.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(SpoiledMilk.launch);
	}
}