if(TimeBendSpell === undefined) var TimeBendSpell = {};
TimeBendSpell.name = 'Time Bend Spell';
TimeBendSpell.id = 'TimeBendSpell';
TimeBendSpell.version = '1.0';
TimeBendSpell.GameVersion = '2.042';

// TODO: bug on having this mod enabled when beginning a fresh save

TimeBendSpell.launch = function(){
  TimeBendSpell.originalFPS = Game.fps;
  TimeBendSpell.currentTimeRate = 1;
  TimeBendSpell.accelerationFactor = 1;
  TimeBendSpell.decelerationFactor = 1;

  TimeBendSpell.init = function(){
    let dir = CCSE.GetModPath(TimeBendSpell.id);

    TimeBendSpell.ammendTimedThings();

    let locstrs = {
      "Time Bend": "/",
      "Accelerated Time": "/",
      "Decelerated Time": "/",
      "Speed up time, based on time machines owned & level.": "/",
      "Slow down time, based on peak time machines owned & level.": "/",
      "Time accelerated!": "/",
      "Time decelerated!": "/",
      "Time accelerated by %1% for %2": "/",
      "Time decelerated by %1% for %2": "/",
    };
    for (var i in locstrs){
			if (locstrs[i]=='/') locstrs[i]=i;
		}
    AddLanguage('EN', 'english', locstrs, true);

    
    TimeBendSpell.ComputeTime = function(){
      return (TimeBendSpell.accelerationFactor + TimeBendSpell.decelerationFactor)/2;
    }
    TimeBendSpell.SetTimeRates = function(acc,dec){
      TimeBendSpell.accelerationFactor = acc||TimeBendSpell.accelerationFactor;
      TimeBendSpell.decelerationFactor = dec||TimeBendSpell.decelerationFactor;
      TimeBendSpell.RecomputeTimeEffects();
    }
    TimeBendSpell.RecomputeTimeEffects = function(){
      let rate = TimeBendSpell.ComputeTime();
      TimeBendSpell.currentTimeRate = rate;
      Game.fps = (60 * (1/rate)) / 2;
      Game.Objects["Bank"].minigame.secondsPerTick = 60 * rate;
      Game.Objects['Farm'].minigame.secondsPerTick = 60 * rate;
      // TODO: affect the duration of things that capture a timestamp and then check it ater on,
      // instead of a constant fps-based lifetime decaying 
    }
    TimeBendSpell.ResetTimeToNormal = function(){
      TimeBendSpell.currentTimeRate = 1;
      TimeBendSpell.accelerationFactor = 1;
      TimeBendSpell.decelerationFactor = 1;
      TimeBendSpell.RecomputeTimeEffects();
    }
    TimeBendSpell.GetPower = function(peak){
      let amt = Game.Objects["Time machine"].amount
      if(peak) {
        amt = Game.Objects["Time machine"].highest;
      }
      return 1+Math.log(1+amt);
    }
    TimeBendSpell.GetDuration = function(){
      let lvl = Game.Objects["Time machine"].level;
      let base = 2;
      let floor = 60;
      return Math.max(floor/2, floor * (base - Math.pow(base, (1/lvl))));
    }

    // TimeBendSpell.createAchievements();
    Game.customStatsMenu.push(function(){
      CCSE.AppendStatsVersionNumber(TimeBendSpell.name, TimeBendSpell.version);
    });

    CCSE.NewBuff("accelerated time", function(time,pow){
      Game.killBuff("Decelerated Time");
      TimeBendSpell.SetTimeRates(pow,1);
      let reportedPower = TimeBendSpell.ComputeTime();
      return {
				name: 'Accelerated Time',
				desc: loc("Time accelerated by %1% for %2", [Math.round((1/reportedPower) * 100)-100,Game.sayTime(time*Game.fps,-1)]),
				icon:[0,0, dir+'/img/icons.png'],
        time:time*Game.fps,
        aura:1,
				power:pow,
        add: true,
				onDie:function(){
          TimeBendSpell.SetTimeRates(1,1);
        },
			};
    });
    CCSE.NewBuff("decelerated time", function(time,pow){
      Game.killBuff("Accelerated Time");
      TimeBendSpell.SetTimeRates(1,pow);
      let reportedPower = TimeBendSpell.ComputeTime();
      return {
				name: 'Decelerated Time',
				desc: loc("Time decelerated by %1% for %2", [Math.round((1/reportedPower) * 100),Game.sayTime(time*Game.fps,-1)]),
				icon:[1,0, dir+'/img/icons.png'],
				time:time*Game.fps,
        aura:2,
        power:pow,
        add: true,
				onDie:function(){
          TimeBendSpell.SetTimeRates(1,1);
        },
			};
    });
  
    // let dir = CCSE.GetModPath(TimeBendSpell.id);
    CCSE.NewSpell("time bend", {
      name:loc("Time Bend"),
      desc:loc("Speed up time, based on time machines owned & level."),
      failDesc:loc("Slow down time, based on peak time machines owned & level."),
      icon:[0,1, dir + "/img/icons.png"],
      costMin:10,
      costPercent:0.25,
      win:function(){
        let pow = 1/TimeBendSpell.GetPower();
        let duration = TimeBendSpell.GetDuration();
        Game.gainBuff(
          'accelerated time',
          duration,
          pow
        );
        Game.Popup('<div style="font-size:80%;">'+loc("Time accelerated!")+'</div>',Game.mouseX,Game.mouseY);
      },
      fail:function(){
        let pow = TimeBendSpell.GetPower(true);
        let duration = TimeBendSpell.GetDuration();
        Game.gainBuff(
          'decelerated time',
          duration,
          pow
        );
        Game.Popup('<div style="font-size:80%;">'+loc("Backfire!")+'<br>'+loc("Time decelerated!")+'</div>',Game.mouseX,Game.mouseY);
      },
    });

    TimeBendSpell.SetTimeRates(1, 1);
  
    TimeBendSpell.isLoaded = 1;
    if (Game.prefs.popups) Game.Popup(TimeBendSpell.name + ' loaded!');
    else Game.Notify(TimeBendSpell.name + ' loaded!', '', '', 1, 1);
  }

  TimeBendSpell.ammendTimedThings = function(){
    let M = Game.Objects['Farm'].minigame;
    M.secondsPerTick = 1;

    Game.customMinigame["Farm"].computeStepT.push(function() {
      // BUG: we do a max because if it goes under 1 then for some reason
      // the farm calculates this to mean go even slower and I didn't
      // reverse the math very effectively
      M.stepT = Math.max(1, (M.stepT / 60) * M.secondsPerTick);
    });

    // TODO: we also gotta patch the frequency of clicks on wrinklers or they'll be impossible to kill
  }

	if(CCSE.ConfirmGameVersion(TimeBendSpell.name, TimeBendSpell.version, TimeBendSpell.GameVersion)) Game.registerMod(TimeBendSpell.id, TimeBendSpell); // TimeBendSpell.init();
}

if(!TimeBendSpell.isLoaded){
	if(CCSE && CCSE.isLoaded){
		TimeBendSpell.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(TimeBendSpell.launch);
	}
}