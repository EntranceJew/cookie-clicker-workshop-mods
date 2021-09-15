if(TPCC === undefined) var TPCC = {};
TPCC.name = 'Twitch Plays Cookie Clicker';
TPCC.id = 'TwitchPlaysCookieClicker';
TPCC.version = '1.0';
TPCC.GameVersion = '2.042';

TPCC.moveCursor = function(x, y) {
  let cw = TPCC.vcursorInfo.size;
  if(Game.mouseX >= 0 && Game.mouseX <= Game.Background.canvas.width &&
    Game.mouseY >= 0 && Game.mouseY <= Game.Background.canvas.height) {
    document.elementFromPoint(Game.mouseX, Game.mouseY).dispatchEvent(new MouseEvent('mouseout', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    }));
  }
  if(x >= 0 && x <= Game.Background.canvas.width &&
    y >= 0 && y <= Game.Background.canvas.height) {
      document.elementFromPoint(x, y).dispatchEvent(new MouseEvent('mouseover', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      }));

      let vc = l('vcursor')
      vc.style.width = cw + "px";
      vc.style.height = cw + "px";
      vc.style.inset = y + "px auto auto " + (x - (cw / 2)) + "px";
      Game.mouseX = x;
      Game.mouseY = y;
      Game.mouseMoved = true;
      return true;
  }
  return false;
}

TPCC.launch = function(){
	TPCC.init = function(){
    // TODO: CCSE.GetModPath is misbehaving here
    TPCC.modDir = CCSE.GetModPath(TPCC.id);
		TPCC.vcursorURL = TPCC.modDir + '/img/vcursor.png';
    TPCC.vcursorInfo = {
      size: 64,
      color: "rgba(255,160,0,.5)",
      image: TPCC.vcursorURL
    }
    TPCC.styles = `
      .vcursor {
        pointer-events: none; 
        image-rendering: pixelated; 
        position: absolute;
        z-index: 9999;
        display: block;
        opacity: 1;
        visibility: visible;
        
        width: ${TPCC.vcursorInfo.size}px;
        height: ${TPCC.vcursorInfo.size}px;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url('${TPCC.vcursorInfo.image}');
        -webkit-mask-size: cover;
        -webit-mask-repeat: no-repeat;
        -webkit-mask-mode: alpha;
        -webkit-mask-image: url('${TPCC.vcursorInfo.image}');
        
        background-color: ${TPCC.vcursorInfo.color};
        background-blend-mode: multiply;

        inset: ${Game.cookieOriginY}px auto auto ${Game.cookieOriginX-(TPCC.vcursorInfo.size/2)}px;
      }
    `;
    CCSE.AddStyles(TPCC.styles);


    TPCC.vcursor = l('tooltipAnchor').insertAdjacentHTML('afterend',`<div id="vcursor" class="vcursor"></div>`);
		
		// TPCC.config = TPCC.defaultConfig();

		Game.customStatsMenu.push(function(){
			CCSE.AppendStatsVersionNumber(TPCC.name, TPCC.version);
		});

		// Game.customOptionsMenu.push(function(){
		// 	CCSE.AppendCollapsibleOptionsMenu(TPCC.name, TPCC.getMenuString());
		// });

    // the following are overrides to prevent chat from closing the game
    Game.HardReset = function(){
      // i wish everyone a very no
    }
    Game.registerHook('logic', function(){
      if (Game.toQuit) {
        Game.toQuit = false;
      }
    });
		
		TPCC.isLoaded = 1;
		if (Game.prefs.popups) Game.Popup(TPCC.name + ' loaded!');
		else Game.Notify(TPCC.name + ' loaded!', '', '', 1, 1);
	}

  TPCC.attach = function(){
    for (const i in TPCC.commands) {
      // fuck safety checks
      const cmd = TPCC.commands[i];
      if (Object.hasOwnProperty.call(TPCC.commands, i) && (!cmd.prereq || cmd.prereq())) {
        TwitchMod.registerCommand(i, cmd);
      }
    }
  }
	
	// TPCC.getMenuString = function(){
	// 	let m = CCSE.MenuHelper;

	// 	var str = '<div class="listing">' + m.ActionButton("TPCC.config = TPCC.defaultConfig(); Game.UpdateMenu();", 'Restore Default') + '</div>';
	// 	return str;
	// }

	// TPCC.defaultConfig = function(){
	// 	return {
	// 		FREE_HOTDOGS				      : 0,	// anarchy
	// 	}
	// }
	
	// TPCC.save = function(){
	// 	if(CCSE.config.OtherMods.TPCC) delete CCSE.config.OtherMods.TPCC; // no need to keep this, it's now junk data
	// 	return JSON.stringify({
	// 		config : TPCC.config
	// 	});
	// }
	
	TPCC.load = function(str){
		// var obj = JSON.parse(str);
		
		// var config = obj.config;
		// for(var pref in config){
		// 	TPCC.config[pref] = config[pref];
		// }

    TPCC.postLoad();
	}

  TPCC.postLoad = function(){
    TwitchMod.afterScriptLoadHooks.push(() => {
      TPCC.attach();
    });
  }

  /*
  TODO: commands
  - vault upgradename
  - unvault upgradename
  - !research
  - !grow (santa/dragon)
  - !spell [slotID]
  - !commands
  - !gods god1 god2 god3
  - every single chat message passively clicks cookie?
  - spawn golden cookie for channel points
  - farm commands!
  - send an arrow key event 
  - scroll the big legacy screen with Game.Scroll
  - !menu (scrollIntoView minigames this way)
  */
  TPCC.commands = {
    cookie: {
      desc: "Click the cookie, just the once.",
      action: (msg) => {
        Game.ClickCookie({detail:1,preventDefault:()=>{}});
      }
    },
    uncookie: {
      desc: "Unclicks the cookie. Why would you do this?",
      action: (msg) => {
        Game.UnclickCookie({detail:1,preventDefault:()=>{}});
      },
      prereq: () => Game.UnclickCookie,
    },
    goldencookie: {
      // TODO: require an upgrade of some sort
      desc: "Click on one Golden Cookie / Reindeer / etc",
      action: () => {
        if (Game.shimmers.length > 0) Game.shimmers[0].pop();
      }
    },
    spell: {
      usage: "$index_or_name",
      action: (msg, id) => {
        let nid = parseInt(id);
        let M = Game.Objects["Wizard tower"].minigame;
        if (M) {
          let spl = null;
          if (isNaN(nid)) {
            spl = M.spellsById.find((x) => x.name.toLocaleLowerCase().includes(id.toLocaleLowerCase()) && !x.locked);
          } else if(M.spellsById[nid]) {
            spl = Game.ObjectsById[nid];
          }
          if (spl) {
            M.castSpell(spl);
          }
        }
      }
    },
    farm: {
      desc: "Allows managing crop tiles. Reminder: top left to start with is [2,2] with the bottom right being [3,3]",
      usage: () => [
        "sow $xpos $ypos",
        "seed $index_or_name",
        "soil $soil_id",
      ],
      action: (msg, what, xpos, ypos) => {
        let nid = parseInt(xpos);
        let M = Game.Objects["Farm"].minigame;
        if (M){
          if (what == "sow"){
            let x = parseInt(xpos);
            let y = parseInt(ypos);
            if (M.isTileUnlocked(x,y)) {
              M.clickTile(x, y);
            }
          }
          if (what == "seed"){
            let seed = null;
            if (isNaN(nid)) {
              seed = M.plantsById.find((x) => x.name.toLocaleLowerCase().includes(xpos.toLocaleLowerCase()) && x.unlocked);
            } else if(M.plantsById[nid] && M.plantsById[nid].unlocked) {
              seed = M.plantsById[nid];
            }
            if (seed){
              l('gardenSeed-'+seed.id).click();
            }
          }
          // TODO: for some reason this just doesn't work
          if (what == "soil" && M.soilsById[nid] && Game.Objects["Farm"].amount >= M.req ){
            l('gardenSoil-'+nid).click();
          }
        }
      }
    },
    buy: {
      usage: () => [
        "building $index_or_name ($amount?)",
        "level $index_or_name",
        "stock $SYM ($amount?)",
        "upgrade $index_in_store",
        "broker",
      ],
      action: (msg, what, id, amt) => {
        let nid = parseInt(id);
        // TODO: upgrade to allow amounts
        amt = false ? 1 : parseInt(amt);
        if (what == "building") {
          let bld = null;
          if (isNaN(nid)) {
            bld = Game.ObjectsById.find((x) => x.single.toLocaleLowerCase().includes(id.toLocaleLowerCase()) && !x.locked);
          } else if(Game.ObjectsById[nid] && !Game.ObjectsById[nid].locked) {
            bld = Game.ObjectsById[nid];
          }
          if (bld) {
            bld.buy(amt);
          }
        }
        if (what == "level") {
          let bld = null;
          if (isNaN(nid)) {
            bld = Game.ObjectsById.find((x) => x.single.toLocaleLowerCase().includes(id.toLocaleLowerCase()) && !x.locked);
          } else if(Game.ObjectsById[nid] && !Game.ObjectsById[nid].locked) {
            bld = Game.ObjectsById[nid];
          }
          if (bld) {
            bld.levelUp();
          }
        }
        let bank = Game.Objects["Bank"];
        if ((what == "stock" || what == "stonk") && bank.level > 0){
          for (let i = 0; i < bank.minigame.goodsById.length; i++) {
            const good = bank.minigame.goodsById[i];
            if (id == good.symbol) {
              bank.minigame.buyGood(good.id, amt);
            }
          }
        }
        if (what == "broker" && bank.level > 0){
          l('bankBrokersBuy').click();
        }
        if (what == "upgrade" && nid < Game.UpgradesInStore.length ) {
          let reali = 0;
          for (let i = 0; i < Game.UpgradesInStore.length; i++) {
            const upgrade = Game.UpgradesInStore[i];
            if (upgrade.pool != 'toggle'){
              if (nid == reali){
                upgrade.buy();
              }
              reali++;
            }
          }
        }
      }
    },
    sell: {
      usage: () => [
        "building $index_or_name ($amount?)",
        "stock $SYM ($amount?)",
        "upgrade $index_in_stats_page",
      ],
      action: (msg, what, id, amt) => {
        let nid = parseInt(id);
        // TODO: upgrade to allow amounts
        amt = false ? 1 : parseInt(amt);
        if (what == "building") {
          let bld = null;
          if (isNaN(nid)) {
            bld = Game.ObjectsById.find((x) => x.single.toLocaleLowerCase().includes(id.toLocaleLowerCase()) && !x.locked);
          } else if(Game.ObjectsById[nid] && !Game.ObjectsById[nid].locked) {
            bld = Game.ObjectsById[nid];
          }
          if (bld) {
            bld.sell(amt);
          }
        }
        let bank = Game.Objects["Bank"];
        if ((what == "stock" || what == "stonk") && bank.level > 0){
          for (let i = 0; i < bank.minigame.goodsById.length; i++) {
            const good = bank.minigame.goodsById[i];
            if (id == good.symbol) {
              bank.minigame.sellGood(good.id, amt);
            }
          }
        }
        // you absolute madman
        // TODO: please gate this behind an upgrade or god will cry
        if (what == "upgrade") {
          let reali = 0;
          for (var i=0;i<Game.UpgradesN;i++) {
            const upgrade = Game.UpgradesById[i];
            // no selling your permanent toggles
            // it's more chaotic that way
            if (upgrade.pool != 'toggle'){
              if (nid == reali && Game.Has(upgrade.name)){
                upgrade.unearn();
              }
              reali++;
            }
          }
        }
      }
    },
    clickat: {
      usage: () => [
        "$xpos $ypos",
      ],
      action: (msg, x, y) => {
        if (TPCC.moveCursor(x, y)) {
          document.elementFromPoint(x, y).click();
        }
      }
    },
    hoverat: {
      desc: "put the cursor over a position and do nothing",
      usage: () => [
        "$xpos $ypos",
      ],
      action: (msg, x, y) => {
        TPCC.moveCursor(x, y);
      }
    },
    choose: {
      usage: () => [
        "[milk/background/sound/aura1/aura2/destiny] $index",
        "season [american/christmas/easter/fools/halloween/valentines]",
        "bakeryname $new_name",
      ],
      action: (msg, what, id, ...rest) => {
        let nid = parseInt(id);
        if (what == "milk"){
          CCSE.SetSelectedMilk(nid);
        }
        if (what == "background"){
          CCSE.SetSelectedBackground(nid);
        }
        if (what == "sound" && Game.Upgrades['Golden cookie sound selector'].choicesFunction()[id]){
          CCSE.SetSelectedShimmerSound(id);
        }
        if (what == "bakeryname"){
          let newname = (id + " " + rest.join(" ")).trim();
          Game.bakeryNameSet(newname);
        }

        // i really don't like these
        if (what == "aura1" && Game.dragonAuras[id]){
          Game.dragonAura = nid;
        }
        if (what == "aura2" && Game.dragonAuras[id]){
          Game.dragonAura2 = nid;
        }
        if (what == "season" && Game.seasons[id]){
          Game.seasons[id].triggerUpgrade.buy();
        }
        if (what == "destiny" && Game.Has("Destiny decider") && DecideDestiny.AllDestinies[id]){
          Game.Upgrades["Destiny decider"].choicesPick(nid);
        }
      }
    },
    wrinkler: {
      desc: "Does click damage to a random wrinkelr.",
      action: (msg) => {
        // TODO: allow providing an index?
        var wrinklers=[];
        for (var i in Game.wrinklers){
          if (Game.wrinklers[i].phase>0 && Game.wrinklers[i].hp>0) wrinklers.push(Game.wrinklers[i]);
        }
        if (wrinklers.length>0){
          let wrinkler=choose(wrinklers);
          wrinkler.selected = 1;
          wrinkler.hurt=1;
          wrinkler.hp-=0.75;
        }
      }
    },
    trigger: {
      desc: "Triggers miscellaneous events.",
      usage: "[frenzy/randombakeryname/lumplook]",
      action: (msg, what) => {
        if (what == "frenzy" && Game.Has('Sugar craving')){
          Game.Upgrades["Sugar frenzy"].clickFunction();
        }
        if (what == "randombakeryname") {
          Game.bakeryNameSet(Game.RandomBakeryName())
        }
        if (what == "lumplook") {
          // via KU
          var temp = Game.lumpCurrentType;
          var str = 'normal';
          if (temp == 1) str = 'bifurcated';
          else if (temp == 2) str = 'golden';
          else if (temp == 3) str = 'meaty';
          else if (temp == 4) str = 'caramelized';
          Game.Notify('A ' + str + ' sugar lump is growing!', '', [29,14+temp+(temp==4?9:0)]);
        }
        // TODO: pledge
      },
    },
    toggle: {
      usage: "[switch/veil/covenant]",
      action: (msg, what) => {
        if (what == "switch" && Game.Has('Golden switch')){
          if (Game.Has('Golden switch [off]')){
            // for some awful reason this means we have it
            Game.Upgrades["Golden switch [on]"].buy();
          } else if (Game.Has('Golden switch [on]')) {
            Game.Upgrades["Golden switch [off]"].buy();
          }
        }
        if (what == "veil" && Game.Has('Shimmering veil')){
          if (Game.Has('Shimmering veil [off]')){
            // for some awful reason this means we have it
            Game.Upgrades["Shimmering veil [on]"].buy();
          } else if (Game.Has('Shimmering veil [on]')) {
            Game.Upgrades["Shimmering veil [off]"].buy();
          }
        }
        if (what == "covenant" && Game.Has('Shimmering veil')){
          if (Game.Has('Revoke Elder Covenant')){
            // for some awful reason this means we have it
            Game.Upgrades["Elder Covenant"].buy();
          } else if (Game.Has('Elder Covenant')) {
            Game.Upgrades["Revoke Elder Covenant"].buy();
          }
        }
      }
    }
  }
	
	if(CCSE.ConfirmGameVersion(TPCC.name, TPCC.version, TPCC.GameVersion)) Game.registerMod(TPCC.name, TPCC); //TPCC.init();
}


if(!TPCC.isLoaded){
	if(CCSE && CCSE.isLoaded){
		TPCC.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(TPCC.launch);
	}
}