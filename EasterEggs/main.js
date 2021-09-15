if(EasterEggs === undefined) var EasterEggs = {};
EasterEggs.name = 'Easter Eggs';
EasterEggs.id = 'EasterEggs';
EasterEggs.version = '1.0';
EasterEggs.GameVersion = '2.042';


EasterEggs.CleanParty = function() {
  Game.l.style.filter='revert';
  Game.l.style.webkitFilter='revert';
  Game.l.style.transform='revert';
  Game.wrapper.style.overflowX='revert';
  Game.wrapper.style.overflowY='revert';
}

EasterEggs.launch = function(){
	EasterEggs.init = function(){
		EasterEggs.config = EasterEggs.defaultConfig();

		Game.customStatsMenu.push(function(){
			CCSE.AppendStatsVersionNumber(EasterEggs.name, EasterEggs.version);
		});

		Game.customOptionsMenu.push(function(){
			CCSE.AppendCollapsibleOptionsMenu(EasterEggs.name, EasterEggs.getMenuString());
		});
		
		EasterEggs.isLoaded = 1;
		if (Game.prefs.popups) Game.Popup(EasterEggs.name + ' loaded!');
		else Game.Notify(EasterEggs.name + ' loaded!', '', '', 1, 1);
	}

	EasterEggs.getMenuString = function(){
		let m = CCSE.MenuHelper;

    let str = "";
    str += '<div class="listing">' + m.CheckBox(EasterEggs.config, 'WINKLERS', "EEGGS_WINKLERS", 'Show those little pink things.', 'You will see horrible creatures.', 'EasterEggs.ToggleCheck') + '</div>';
    str += '<div class="listing">' + m.CheckBox(EasterEggs.config, 'TOYS', "EEGGS_TOYS", 'Little floating things in your milk.', 'Your milk will be normal.', 'EasterEggs.ToggleCheck') + '</div>';
    str += '<div class="listing">' + m.CheckBox(EasterEggs.config, 'PARTY', "EEGGS_PARTY", 'You have disco-vision.', 'Everything is normal. Do not enable if you are prone to photosensitive epilepsy.', 'EasterEggs.ToggleCheck') + '</div>';

		return str;
	}

	EasterEggs.defaultConfig = function(){
		return {
			WINKLERS				: 0,
			TOYS						: 0,
			PARTY						: 0,
		}
	}
	
	EasterEggs.save = function(){
		if(CCSE.config.OtherMods.EasterEggs) delete CCSE.config.OtherMods.EasterEggs; // no need to keep this, it's now junk data
		return JSON.stringify({
			config : EasterEggs.config
		});
	}
	
	EasterEggs.load = function(str){
		var obj = JSON.parse(str);
		
		var config = obj.config;
		for(var pref in config){
			EasterEggs.config[pref] = config[pref];
			Game[pref] = config[pref];
		}
	}

  EasterEggs.ToggleCheck = function(prefName, button, on, off, invert){
		if(EasterEggs.config[prefName]){
			l(button).removeAttribute('checked');
      l(button+'_label').innerHTML = off;
			EasterEggs.config[prefName] = 0;
			Game[prefName] = 0;
      if (prefName == "PARTY"){
        EasterEggs.CleanParty();
      }
		}
		else{
			l(button).setAttribute('checked','checked')
      l(button+'_label').innerHTML = on;
			EasterEggs.config[prefName] = 1;
			Game[prefName] = 1;
		}
	}
	
	if(CCSE.ConfirmGameVersion(EasterEggs.name, EasterEggs.version, EasterEggs.GameVersion)) Game.registerMod(EasterEggs.id, EasterEggs); //EasterEggs.init();
}


if(!EasterEggs.isLoaded){
	if(CCSE && CCSE.isLoaded){
		EasterEggs.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(EasterEggs.launch);
	}
}