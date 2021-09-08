if(RiskyClickSpell === undefined) var RiskyClickSpell = {};
RiskyClickSpell.name = 'Risky Click Spell';
RiskyClickSpell.id = 'RiskyClickSpell';
RiskyClickSpell.version = '1.0';
RiskyClickSpell.GameVersion = '2.042';

RiskyClickSpell.launch = function(){
	RiskyClickSpell.init = function(){
    // TODO: CCSE.GetModPath is misbehaving here
    RiskyClickSpell.modDir = CCSE.GetModPath(RiskyClickSpell.id);

		Game.customStatsMenu.push(function(){
			CCSE.AppendStatsVersionNumber(RiskyClickSpell.name, RiskyClickSpell.version);
		});

    CCSE.NewSpell("risky click", {
      name:loc("Risky Click"),
      desc:loc("Cookie gets clicked a single time."),
      failDesc:loc("You know what? *unclicks your cookie*"),
      // icon:[0,0,RiskyClickSpell.modDir + "/icon.png"],
      icon:[12,27,RiskyClickSpell.modDir + "/icon.png"],
      costMin:1,
      costPercent:0.01,
      win:function()
      {
        Game.ClickCookie({detail:1,preventDefault:()=>{}});
        Game.Popup('<div style="font-size:80%;">'+loc("Cookie clicked!")+'</div>',Game.mouseX,Game.mouseY);
      },
      fail:function()
      {
        Game.ClickCookie({detail:1,preventDefault:()=>{}}, -Game.computedMouseCps);
        Game.Popup('<div style="font-size:80%;">'+loc("Backfire!")+'<br>'+loc("Cookie unclicked!")+'</div>',Game.mouseX,Game.mouseY);
      },
    });

    RiskyClickSpell.isLoaded = 1;
		if (Game.prefs.popups) Game.Popup(RiskyClickSpell.name + ' loaded!');
		else Game.Notify(RiskyClickSpell.name + ' loaded!', '', '', 1, 1);
	}

  if(CCSE.ConfirmGameVersion(RiskyClickSpell.name, RiskyClickSpell.version, RiskyClickSpell.GameVersion)) Game.registerMod(RiskyClickSpell.id, RiskyClickSpell); // RiskyClickSpell.init();
}

if(!RiskyClickSpell.isLoaded){
	if(CCSE && CCSE.isLoaded){
		RiskyClickSpell.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(RiskyClickSpell.launch);
	}
}