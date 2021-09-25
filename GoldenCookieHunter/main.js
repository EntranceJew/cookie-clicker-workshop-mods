if(GoldenCookieHunter === undefined) var GoldenCookieHunter = {};
GoldenCookieHunter.name = 'Golden Cookie Hunter';
GoldenCookieHunter.id = 'GoldenCookieHunter';
GoldenCookieHunter.version = '1.0';
GoldenCookieHunter.GameVersion = '2.042';

GoldenCookieHunter.launch = function(){
  GoldenCookieHunter.init = function(){
    let dir = CCSE.GetModPath(GoldenCookieHunter.id);

    GoldenCookieHunter.styles = `
      #goldenCookieHunters {
        pointer-events: none; 
        display: block;
        opacity: 1;
        visibility: visible;
        position: absolute;
        left: 0px;
        top: 0px;
        z-index: 10000000009;
        filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.75));
        -webkit-filter: drop-shadow(0px 4px 4px rgba(0,0,0,0.75));
      }

      .goldenCookieHunter {
        background:url(img/santa.png);
        background-position:-1344px 0px;
        position: absolute;
        filter:drop-shadow(0px 3px 2px #000);
        -webkit-filter:drop-shadow(0px 3px 2px #000);
      }
    `;
    CCSE.AddStyles(GoldenCookieHunter.styles);

    l('shimmers').insertAdjacentHTML('afterend',`<div id="goldenCookieHunters"></div>`);
    Game.goldenCookieHuntersL = l('goldenCookieHunters');
    Game.goldenCookieHunters = [];//all goldenCookieHunters currently on the screen
    Game.goldenCookieHuntersN = Math.floor(Math.random()*10000);

    Game.goldenCookieHunter = function (type, obj, noCount) {
      this.type = type;
  
      this.l = document.createElement('div');
      this.l.className = 'goldenCookieHunter';
      if (!Game.touchEvents) { 
        AddEvent(this.l, 'click', function (what) { return function (event) { what.pop(event); }; }(this)); 
      } else {
        //touch events
        AddEvent(this.l, 'touchend', function (what) { return function (event) { what.pop(event); }; }(this)); 
      }
  
      // == HUNTER STATS ==
      // this.x = 0;
      // this.y = 0;
      this.id = Game.goldenCookieHuntersN;
  
      this.force = '';
      this.forceObj = obj || 0;
      if (this.forceObj.type) this.force = this.forceObj.type;
      this.noCount = noCount;
      if (!this.noCount) { 
        Game.goldenCookieHunterTypes[this.type].n++; 
        Game.recalculateGains = 1; 
      }
  
      this.init();
  
      Game.goldenCookieHuntersL.appendChild(this.l);
      Game.goldenCookieHunters.push(this);
      Game.goldenCookieHuntersN++;
    }
    Game.goldenCookieHunter.prototype.init = function () {
      //executed when the goldenCookieHunter is created
      Game.goldenCookieHunterTypes[this.type].initFunc(this);
    }
    Game.goldenCookieHunter.prototype.update = function () {
      //executed every frame
      Game.goldenCookieHunterTypes[this.type].updateFunc(this);
    }
    Game.goldenCookieHunter.prototype.pop = function (event) {
      // executed when the goldenCookieHunter is popped by the player ... which shouldn't happen
      if (event) event.preventDefault();
      Game.Click = 0;
      Game.goldenCookieHunterTypes[this.type].popFunc(this);
    }
    Game.goldenCookieHunter.prototype.die = function () {
      //executed after the goldenCookieHunter disappears (from old age or popping)
      if (this.spawnLead) {
        //if this was the spawn lead for this goldenCookieHunter type, set the goldenCookieHunter type's "spawned" to 0 and restart its spawn timer
        var type = Game.goldenCookieHunterTypes[this.type];
        type.time = 0;
        type.spawned = 0;
        type.minTime = type.getMinTime(this);
        type.maxTime = type.getMaxTime(this);
      }
      Game.goldenCookieHuntersL.removeChild(this.l);
      if (Game.goldenCookieHunters.indexOf(this) != -1) Game.goldenCookieHunters.splice(Game.goldenCookieHunters.indexOf(this), 1);
      if (!this.noCount) { 
        Game.goldenCookieHunterTypes[this.type].n = Math.max(0, Game.goldenCookieHunterTypes[this.type].n - 1); 
        Game.recalculateGains = 1; 
      }
    }
    Game.goldenCookieHunter.prototype.getDistance = function(x1, y1, x2, y2) {
      let a = x1 - x2;
      let b = y1 - y2;
  
      return Math.sqrt( a*a + b*b );
    }
    Game.goldenCookieHunter.prototype.getAngle = function(x1, y1, x2, y2) {
      return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    }
    Game.goldenCookieHunter.prototype.getMove = function(distance, angle_degrees, x, y) {
      return {
        x: x + distance * Math.cos(angle_degrees * Math.PI / 180),
        y: y + distance * Math.sin(angle_degrees * Math.PI / 180)
      }
    }
    Game.goldenCookieHunter.prototype.setPos = function(me, x, y) {
      me.x = x;
      me.y = y;
      me.l.style.left = Math.floor(me.x - (me.size/2)) + 'px';
      me.l.style.top = Math.floor(me.y - (me.size/2)) + 'px';
    }
  
    Game.goldenCookieHunter.prototype.nearestCookies = function(me) {
      let cookies = [...Game.shimmers].filter(cookie => me.getDistance(me.x, me.y, cookie.x, cookie.y) < cookie.life*me.moveDist);
      cookies = [...cookies].sort(function(a, b) {
        return (me.getDistance(me.x, me.y, a.x, a.y) - me.getDistance(me.x, me.y, b.x, b.y))//*(a.life/b.life)
      });

      if (cookies.length > 0) {
        return cookies[0];
      }
    };
  
  
    //run goldenCookieHunter functions, kill overtimed goldenCookieHunters and spawn new ones
    Game.updateGoldenCookieHunters = function () {
      for (var i in Game.goldenCookieHunters) {
        Game.goldenCookieHunters[i].update();
      }
  
      //cookie storm!
      // if (Game.hasBuff('Cookie storm') && Math.random() < 0.5) {
        // var newGoldenCookieHunter = new Game.goldenCookieHunter('golden', { type: 'cookie storm drop' }, 1);
        // newGoldenCookieHunter.dur = Math.ceil(Math.random() * 4 + 1);
        // newGoldenCookieHunter.life = Math.ceil(Game.fps * newGoldenCookieHunter.dur);
        //newGoldenCookieHunter.force='cookie storm drop';
        // newGoldenCookieHunter.sizeMult = Math.random() * 0.75 + 0.25;
      // }
  
      //spawn goldenCookieHunters
      for (var i in Game.goldenCookieHunterTypes) {
        var me = Game.goldenCookieHunterTypes[i];
        if (me.spawnConditions() && !me.spawned){
          //only run on goldenCookieHunter types that work on a timer
          //no goldenCookieHunter spawned for this type? check the timer and try to spawn one
          // me.time++;
          // if (Math.random() < Math.pow(Math.max(0, (me.time - me.minTime) / (me.maxTime - me.minTime)), 5)) {
            var newGoldenCookieHunter = new Game.goldenCookieHunter(i);
            newGoldenCookieHunter.spawnLead = 1;
            // if (Game.Has('Distilled essence of redoubled luck') && Math.random() < 0.01) var newGoldenCookieHunter = new Game.goldenCookieHunter(i);
            me.spawned = 1;
          // }
        }
      }
    }
    //stop and delete all goldenCookieHunters (used on resetting etc)
    Game.killGoldenCookieHunters = function () {
      for (var i = Game.goldenCookieHunters.length - 1; i >= 0; i--) {
        Game.goldenCookieHunters[i].die();
      }
      for (var i in Game.goldenCookieHunterTypes) {
        var me = Game.goldenCookieHunterTypes[i];
        if (me.reset) me.reset();
        me.n = 0;
        me.time = 0;
        me.spawned = 0;
        me.minTime = me.getMinTime(me);
        me.maxTime = me.getMaxTime(me);
      }
    }
  
    Game.goldenCookieHunterTypes = {
      //in these, "me" refers to the goldenCookieHunter itself, and "this" to the goldenCookieHunter's type object
      'hunter': {
        reset: function () {
          // this.chain = 0;
          // this.totalFromChain = 0;
          this.last = '';
        },
        initFunc: function (me) {
          // if (!this.spawned && me.force != 'cookie storm drop' && Game.chimeType == 1 && Game.ascensionMode != 1) PlaySound('snd/chime.mp3');
  
          //set image
          var bgPic = 'img/santa.png';
          var picX = 0; var picY = 0;

          var specialPic = l('specialPic');
          var specialPicRect = specialPic.getBoundingClientRect();
          specialPic.hidden = true;
          
          me.size = 96;
          me.moveDist = 3;
          // me.x = Math.floor(Math.random() * Math.max(0, (Game.bounds.right - 300) - Game.bounds.left - 128) + Game.bounds.left + 64) - 64;
          // me.y = Math.floor(Math.random() * Math.max(0, Game.bounds.bottom - Game.bounds.top - 128) + Game.bounds.top + 64) - 64;
          me.x = specialPicRect.x + (me.size/2);
          me.y = specialPicRect.y + (me.size/2);
          me.l.style.left = me.x + 'px';
          me.l.style.top = me.y + 'px';
          me.l.style.width = me.size+'px';
          me.l.style.height = me.size+'px';
          me.l.style.backgroundImage = 'url(' + bgPic + ')';
          // me.l.style.backgroundPosition = (-picX * 96) + 'px ' + (-picY * 96) + 'px';
          me.l.style.backgroundPosition = "-1344px 0px";
          me.l.style.opacity = '1';
          me.l.style.display = 'absolute';
          // me.l.setAttribute('alt', loc(me.wrath ? "Wrath cookie" : "Golden cookie"));

          Game.SparkleAt(me.x, me.y);
  
          me.life = 1;//the cookie's current progression through its lifespan (in frames)
          me.dur = 13;//duration; the cookie's lifespan in seconds before it despawns
  
          // var dur = 13;
          // if (Game.Has('Lucky day')) dur *= 2;
          // if (Game.Has('Serendipity')) dur *= 2;
          // if (Game.Has('Decisive fate')) dur *= 1.05;
          // if (Game.Has('Lucky digit')) dur *= 1.01;
          // if (Game.Has('Lucky number')) dur *= 1.01;
          // if (Game.Has('Lucky payout')) dur *= 1.01;
          // if (!me.wrath) dur *= Game.eff('goldenCookieDur');
          // else dur *= Game.eff('wrathCookieDur');
          // dur *= Math.pow(0.95, Game.goldenCookieHunterTypes['golden'].n - 1);//5% shorter for every other golden cookie on the screen
          // if (this.chain > 0) dur = Math.max(2, 10 / this.chain);//this is hilarious
          // me.dur = dur;
          me.life = Math.ceil(Game.fps * me.dur);
          me.sizeMult = 1;
        },
        updateFunc: function (me) {
          var curve = 1 - Math.pow((me.life / (Game.fps * me.dur)) * 2 - 1, 4);
          // me.l.style.opacity = curve;
          //this line makes each golden cookie pulse in a unique way
          // if (Game.prefs.fancy) me.l.style.transform = 'rotate(' + (Math.sin(me.id * 0.69) * 24 + Math.sin(Game.T * (0.35 + Math.sin(me.id * 0.97) * 0.15) + me.id/*+Math.sin(Game.T*0.07)*2+2*/) * (3 + Math.sin(me.id * 0.36) * 2)) + 'deg) scale(' + (me.sizeMult * (1 + Math.sin(me.id * 0.53) * 0.2) * curve * (1 + (0.06 + Math.sin(me.id * 0.41) * 0.05) * (Math.sin(Game.T * (0.25 + Math.sin(me.id * 0.73) * 0.15) + me.id)))) + ')';
          let goal = {
            // x: Game.mouseX,
            // y: Game.mouseY,
            x: Game.cookieOriginX,
            y: Game.cookieOriginY,
            isBigCookie: true,
          };
          let cookie = me.nearestCookies(me);
          if (cookie) {
            goal = Object.assign({}, cookie);
            let size = 96;
            goal.x = Math.floor(goal.x + (size/2));
            goal.y = Math.floor(goal.y + (size/2));
          }
          let moveDist = me.moveDist;
          let dist = me.getDistance(me.x, me.y, goal.x, goal.y);
          if (dist < moveDist && cookie) {
            cookie.pop();
          }
          moveDist = Math.min(moveDist, dist);
          
          let ang = me.getAngle(me.x, me.y, goal.x, goal.y);
          let mov = me.getMove(moveDist, ang, me.x, me.y);
          me.setPos(me, mov.x, mov.y);

          if (Game.specialTab !== "santa") {
            me.pop();
          }
          // me.life--;
          // if (me.life <= 0) { this.missFunc(me); me.die(); }
        },
        popFunc: function (me) {
          //get achievs and stats
          
  
          // if (popup == '' && buff && buff.name && buff.desc) popup = buff.dname + '<div style="font-size:65%;">' + buff.desc + '</div>';
          // if (popup != '') Game.Popup(popup, me.x + me.l.offsetWidth / 2, me.y);
  
          // Game.DropEgg(0.9);
  
          //sparkle and kill the goldenCookieHunter
          Game.SparkleAt(me.x + 48, me.y + 48);
          // PlaySound('snd/goldenCookieHunterClick.mp3');
          me.die();
        },
        missFunc: function (me) {
          // if (this.chain > 0 && this.totalFromChain > 0) {
          //   Game.Popup(loc("Cookie chain broken.<br><small>You made %1.</small>", loc("%1 cookie", LBeautify(this.totalFromChain))), me.x + me.l.offsetWidth / 2, me.y);
          //   this.chain = 0; this.totalFromChain = 0;
          // }
          // if (me.spawnLead) Game.missedGoldenClicks++;
        },
        // todo: remove
        spawnsOnTimer: false, 
        spawnConditions: function () {
          return Game.specialTab == "santa" && Game.santaLevel >= Game.santaLevels.length - 1;
        },
        spawned: 0,
        time: 0,
        minTime: 0,
        maxTime: 0,
        getTimeMod: function (me, m) {
          return Math.ceil(Game.fps * 60 * m);
        },
        getMinTime: function (me) {
          var m = 5;
          return this.getTimeMod(me, m);
        },
        getMaxTime: function (me) {
          var m = 15;
          return this.getTimeMod(me, m);
        },
        last: '',
      }
    };

    Game.registerHook("logic", Game.updateGoldenCookieHunters);
    Game.customToggleSpecialMenu.push(function(str){
      for (var i in Game.goldenCookieHunterTypes) {
        var me = Game.goldenCookieHunterTypes[i];
        if (me.spawnConditions() && me.spawned){
          str = str.replace('style="', 'style="display:none;');
        }
      }

			return str;
		});

    // new Game.goldenCookieHunter('hunter');
  
    GoldenCookieHunter.isLoaded = 1;
    if (Game.prefs.popups) Game.Popup(GoldenCookieHunter.name + ' loaded!');
    else Game.Notify(GoldenCookieHunter.name + ' loaded!', '', '', 1, 1);
  }

	if(CCSE.ConfirmGameVersion(GoldenCookieHunter.name, GoldenCookieHunter.version, GoldenCookieHunter.GameVersion)) Game.registerMod(GoldenCookieHunter.id, GoldenCookieHunter); // GoldenCookieHunter.init();
}

if(!GoldenCookieHunter.isLoaded){
	if(CCSE && CCSE.isLoaded){
		GoldenCookieHunter.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(GoldenCookieHunter.launch);
	}
}