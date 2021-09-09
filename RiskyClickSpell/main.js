if(RiskyClickSpell === undefined) var RiskyClickSpell = {};
RiskyClickSpell.name = 'Risky Click Spell';
RiskyClickSpell.id = 'RiskyClickSpell';
RiskyClickSpell.version = '1.0';
RiskyClickSpell.GameVersion = '2.042';

RiskyClickSpell.launch = function(){
  RiskyClickSpell.createAchievements = function(){
    let dir = CCSE.GetModPath(RiskyClickSpell.id);
    let order = Game.Achievements['Uncanny clicker'].order + 0.001;
    let last = CCSE.NewAchievement('Uncanny unclicker', 'Unclick really, really fast?', [12,0, dir+'/img/achievement.png']);
    last.order = order; order += 0.001;
    last.pool='shadow';
    last = CCSE.NewAchievement('Disappearing act', 'Unclick the cookie.'+'<q>How\'d you do that?</q>', [0,0, dir+'/img/icon.png']);
    last.order = order; order += 0.001;
    // last.pool='shadow';
  }

  RiskyClickSpell.init = function(){
    if (!Game.modHooksNames.includes('unclick') || !Game.modHooks.hasOwn('unclick')) {
      Game.modHooksNames.push('unclick');
      Game.modHooks['unclick'] = [];
    }

    RiskyClickSpell.createAchievements();

    Game.playCookieUnclickSound=function(){
      let dir = CCSE.GetModPath(RiskyClickSpell.id);
      if (Game.prefs.cookiesound) PlaySound(dir+'/snd/unclickb'+(Game.cookieClickSound)+'.mp3',0.5);
      else PlaySound(dir+'/snd/unclick'+(Game.cookieClickSound)+'.mp3',0.5);
      Game.cookieClickSound+=Math.floor(Math.random()*4)+1;
      if (Game.cookieClickSound>7) Game.cookieClickSound-=7;
    }
    Game.UnclickCookie=function(e,amount){
      var now=Date.now();
      if (e) e.preventDefault();
      if (Game.OnAscend || Game.AscendTimer>0 || Game.T<3 || now-Game.lastClick<1000/((e?e.detail:1)===0?3:50)) {
        // nothing!
      } else{
        if (now-Game.lastClick<(1000/15)) {
          Game.autoclickerDetected+=Game.fps;
          if (Game.autoclickerDetected>=Game.fps*5) Game.Win('Uncanny unclicker');
        }
        Game.loseShimmeringVeil('click');
        var amount=amount?amount:Game.computedMouseCps;
        Game.Earn(-amount);
        Game.handmadeCookies-=amount;
        if (Game.prefs.particles) {
          Game.particleAdd();
          Game.particleAdd(Game.mouseX,Game.mouseY,Math.random()*4-2,Math.random()*-2-2,Math.random()*0.5+0.75,1,2);
        }
        if (Game.prefs.numbers) {
          Game.particleAdd(Game.mouseX+Math.random()*8-4,Game.mouseY-8+Math.random()*8-4,0,-2,1,4,2,'','+'+Beautify(amount,1));
        }

        Game.runModHook('unclick');

        if (!Game.HasAchiev("Disappearing act")) {
          Game.Win("Disappearing act");
        }
        
        Game.playCookieUnclickSound();
        Game.cookieClicks--;
        
        if (Game.clicksThisSession==0) PlayCue('preplay');
        Game.clicksThisSession--;
        Game.lastClick=now;
      }
      Game.Click=0;
    }
  
    Game.customStatsMenu.push(function(){
      CCSE.AppendStatsVersionNumber(RiskyClickSpell.name, RiskyClickSpell.version);
    });
  
    let dir = CCSE.GetModPath(RiskyClickSpell.id);
    CCSE.NewSpell("risky click", {
      name:loc("Risky Click"),
      desc:loc("Cookie gets clicked a single time."),
      failDesc:loc("You know what? *unclicks your cookie*"),
      icon:[0,0, dir + "/img/icon.png"],
      costMin:1,
      costPercent:0.01,
      win:function()
      {
        Game.ClickCookie({detail:1,preventDefault:()=>{}});
        Game.Popup('<div style="font-size:80%;">'+loc("Cookie clicked!")+'</div>',Game.mouseX,Game.mouseY);
      },
      fail:function()
      {
        Game.UnclickCookie({detail:1,preventDefault:()=>{}});
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