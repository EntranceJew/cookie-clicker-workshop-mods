if(TwitchMod === undefined) var TwitchMod = {};
TwitchMod.name = 'Twitch Mod';
TwitchMod.id = 'TwitchMod';
TwitchMod.version = '1.1';
TwitchMod.GameVersion = '2.042';

// TODO: allow user supplied alises?

// via https://github.com/twitch-js/twitch-js, thanks fellas
TwitchMod.afterScriptLoadHooks = [];
TwitchMod.commandIndexes = [];
TwitchMod.launch = function(){
	TwitchMod.init = function(){
    // TODO: CCSE.GetModPath is misbehaving here
    TwitchMod.modDir = CCSE.GetModPath(TwitchMod.id);
		
    CCSE.AddStyles(`.command-usage {
      font-family: monospace;
      display: block;
      background: none;
      white-space: pre;
      padding: 0.5rem;
      -webkit-box-decoration-break: clone;
      max-width: 100%;
      background: lightgray;
      border-radius: .2rem;
      line-height: 24px;
      font-size: 24px;
      color: purple;
    }
    
    label.command-header {
      color: white;
      opacity: 0.7; 
      font-size: 24px;
      font-family: Kavoon, Georgia, serif;
    }
    `);

		TwitchMod.config = TwitchMod.defaultConfig();

		Game.customStatsMenu.push(function(){
			CCSE.AppendStatsVersionNumber(TwitchMod.name, TwitchMod.version);
		});

		Game.customOptionsMenu.push(function(){
			CCSE.AppendCollapsibleOptionsMenu(TwitchMod.name, TwitchMod.getMenuString());
		});
		
		TwitchMod.isLoaded = 1;
		if (Game.prefs.popups) Game.Popup(TwitchMod.name + ' loaded!');
		else Game.Notify(TwitchMod.name + ' loaded!', '', '', 1, 1);
	}

  /*
    Command Structure:
    - action: (msg, ...) => {}
      - what the command does, variable args, separated by spaces
    - desc: "string"
      - the description of the function
    - usage: "string" / () => ("string" / ["string", ...])
      - generates usage scenarios for the function
    - prereq: () => bool
      - whether or not this function is available for use
    - fuzz: () => []
      - return a vararg array random values that are valid for this command
      - this is useful for stress testing
   */
  TwitchMod.registerCommand = function(cmd, handler) {
    if (!TwitchMod.commandIndexes[cmd]) {
      TwitchMod.commandIndexes[cmd] = [];
    }
    TwitchMod.commandIndexes[cmd].push(handler);
  }

  TwitchMod.handleCommand = function(cmd, message, args){
    let com = TwitchMod.commandIndexes[cmd];
    if (com && TwitchMod.config.CMD_DISABLED[cmd]) {
      TwitchMod.commandIndexes[cmd].forEach(regCmd => {
        regCmd.action(message, ...args);
      });
    }
  }
	
  TwitchMod.create = function(){
		try {
      // if you don't have a token, get one from: https://twitchapps.com/tmi/
      TwitchMod.chat = new window.TwitchJs.Chat({
				token: TwitchMod.config.CHAT_TOKEN,
				username: TwitchMod.config.CHAT_USER,
			});
      // toggle info logging:
      if (!TwitchMod.config.DBG_LOGGING) {
        TwitchMod.chat._log.level = "silent";
        // alternatives:
        // TwitchMod.chat._log.levelVal = Infinity;
      }
    } catch (error) {
			Game.Notify(`Twitch Error!`,`${error}!`,[16,5]);
		}
  }

	TwitchMod.connect = async function(nonotify){
    nonotify = nonotify||0;
		try {
			await TwitchMod.chat.connect();
			await TwitchMod.chat.join(TwitchMod.config.CHAT_CHANNEL);
      if (!nonotify) {
			  Game.Notify(`Twitch Chat Mod`,`Sucessfully joined #${TwitchMod.config.CHAT_CHANNEL}!`,[16,5]);
      }
		} catch (error) {
      if (!nonotify){
			  Game.Notify(`Twitch Error!`,`${error}!`,[16,5]);
      }
		}
	}

  TwitchMod.attach = function(){
    TwitchMod.chat.on("PRIVMSG", (message) => {
      const time = new Date(message.timestamp).toTimeString();
      const event = message.event || message.command;
      const channel = message.channel;
      const msg = message.message || "";
      const username = message.username || "chatter";

      if ("#"+TwitchMod.config.CHAT_CHANNEL == channel) {
        let prefix = TwitchMod.config.CMD_PREFIX
        if (msg.startsWith(prefix)){
          let parts = msg.split(/[ ]+/);
          let cmd = parts.shift();
          cmd = cmd.substring(prefix.length);
          console.log("testing my balls", cmd, parts);
          TwitchMod.handleCommand(cmd, message, parts);
        } else {
          if (TwitchMod.config.MSG_SHOW) {
            Game.Notify(`<strong>${username}:</strong> ${msg}`, '', '', TwitchMod.config.MSG_BASE_TIME + (msg.trim().length * TwitchMod.config.MSG_TIME_PER_CHAR), 1);
          }
        }
      }
    });
  }
	
	TwitchMod.getMenuString = function(){
		let m = CCSE.MenuHelper;1
		
		function inputBoxListing(prefName, prefDisplayName, desc){
			var listing = '<div class="listing">';
			listing += m.InputBox('TwitchMod_' + prefName, 65, TwitchMod.config[prefName], "TwitchMod.UpdatePref('" + prefName + "', this.value)")
			listing += '<label>' + prefDisplayName + (desc ? ' : ' + desc : '') + '</label>';
			listing += '</div>';
			return listing;
		}
		
		function passwordBoxListing(prefName, prefDisplayName, desc){
			var listing = '<div class="listing">';
			listing += m.PasswordBox('TwitchMod_' + prefName, 65, TwitchMod.config[prefName], "TwitchMod.UpdatePref('" + prefName + "', this.value)")
			listing += '<label>' + prefDisplayName + (desc ? ' : ' + desc : '') + '</label>';
			listing += '</div>';
			return listing;
		}

    function spanBox(config, prefName, button, on, off, callback, invert) {
			var invert = invert ? 1 : 0;
			if(!callback) callback = '';
			else callback += "('" + prefName + "', '" + button + "', '" + on.replace("'","\\'") + "', '" + off.replace("'","\\'") + "', '" + invert + "');";
			callback += "PlaySound('snd/tick.mp3');";
			return '<input class="checkbox checkbox' + ((config[prefName]^invert) ? 'on' : ' off') + '" ' + (config[prefName] ? 'checked="checked"' : '') + ' type="checkbox" id="' + button + '" ' + Game.clickStr + '="' + callback + '"><label id="'+button+'_label" for="' + button + '" class="command-header">' + (config[prefName] ? on : off) + '</label>';
		}

		var str = '<div class="listing">' + 
              m.ActionButton("TwitchMod.config = TwitchMod.defaultConfig(); Game.UpdateMenu();", 'Restore Default') + 
              m.ActionButton("TwitchMod.postLoad();", '(re)connect') +
              '</div>';

		str += m.Header('Chat Login');
		str += '<div class="listing"><label>These are secret so don\'t let someone see these.</label></div>';
    str += '<div class="listing">' + m.CheckBox(TwitchMod.config, 'CHAT_AUTOCONNECT', "TM_CHAT_AUTOCONNECT", 'We will autoconnect to twitch chat when the game loads.', 'We will not autoconnect to twitch chat when the game loads.', 'TwitchMod.ToggleCheck') + '</div>';
		str += inputBoxListing('CHAT_USER', 'The bot user username');
		str += passwordBoxListing('CHAT_TOKEN', 'The bot user password/token. Get one here: <a href="https://twitchapps.com/tmi/" class="orangeLink" target="_blank">[TMI]</a>');
		str += inputBoxListing('CHAT_CHANNEL', 'The channel the bot user should visit.');

    str += m.Header('Messages');
    str += '<div class="listing">' + m.CheckBox(TwitchMod.config, 'MSG_SHOW', "TM_MSG_SHOW", 'Show chat messages in notifications.', 'Do not show chat messages in notifications.', 'TwitchMod.ToggleCheck') + '</div>';
    var callback1 = "TwitchMod.config.MSG_BASE_TIME = l('TM_MSG_BASE_TIME').value; l('TM_MSG_BASE_TIMERightText').innerHTML = TwitchMod.config.MSG_BASE_TIME;";
    var callback2 = "TwitchMod.config.MSG_TIME_PER_CHAR = l('TM_MSG_TIME_PER_CHAR').value; l('TM_MSG_TIME_PER_CHARRightText').innerHTML = TwitchMod.config.MSG_TIME_PER_CHAR;";
    str += '<div class="listing">' + 
            m.Slider('TM_MSG_BASE_TIME', 'Message Base Duration', '[$]', () => TwitchMod.config.MSG_BASE_TIME, callback1, 0, 6, 0.1) + 
            m.Slider('TM_MSG_TIME_PER_CHAR', 'Time Per Character', '[$]', () => TwitchMod.config.MSG_TIME_PER_CHAR, callback2, 0, 1, 0.001) +
            '</div>';

    str += m.Header('Debug');
    str += '<div class="listing">' + m.CheckBox(TwitchMod.config, 'DBG_LOGGING', "TM_DBG_LOGGING", 'We will log twitch events to the console.', 'We will not log twitch events to the console.', 'TwitchMod.ToggleCheck') + '</div>';

    str += m.Header('Commands');
		str += inputBoxListing('CMD_PREFIX', 'The prefix every command should begin with.');
    str += '<div class="listing">Note: Most commands can be followed by random numbers to avoid duplicate message detection.</div>';

    for (const cmd in TwitchMod.commandIndexes) {
      if (Object.hasOwnProperty.call(TwitchMod.commandIndexes, cmd) && TwitchMod.commandIndexes[cmd].length > 0) {
        const cmds = TwitchMod.commandIndexes[cmd];

        for (let i = 0; i < cmds.length; i++) {
          const aCmd = cmds[i];
          let en = TwitchMod.config.CMD_PREFIX + cmd + ` [⭕]`;
          let di = TwitchMod.config.CMD_PREFIX + cmd + ` [❌]`;
          let box =  spanBox(TwitchMod.config.CMD_DISABLED, cmd, "TM_CMD_TOGGLE_"+cmd, en, di, 'TwitchMod.ToggleCommand');
          str += '<div class="listing">'
                 + box
                 + '</div>';
          if (TwitchMod.config.CMD_DISABLED[cmd]){
            if (aCmd.desc) {
              let desc = aCmd.desc;
              str += `<div class="listing">`+ desc + `</div>`;
            }
            if (aCmd.usage) {
              let usage = aCmd.usage;
              str += `<div class="listing"><pre><code class="command-usage">`;
              if (typeof usage == "function") {
                usage = aCmd.usage();
              }
              if (typeof usage == "string") {
                usage = [usage];
              }
              usage.forEach(useLine => {
                str += TwitchMod.config.CMD_PREFIX + cmd + " " + useLine + "\n";
              });
              str += `</code></pre></div>`;
            }
          }
        }
      }
    }
		return str;
	}

	TwitchMod.defaultConfig = function(){
		return {
			CHAT_AUTOCONNECT				: 0,	// Connect on start?
			CHAT_USER								: "",	// Bot user username.
			CHAT_TOKEN							: "",	// Bot user password.
			CHAT_CHANNEL						: "",	// Channel to observe chat in.

      MSG_SHOW                : 1,  // Show messages on screen in notifications.
      MSG_BASE_TIME           : 1,  // The number of seconds to display a chat message for, without a character/second modifier.
      MSG_TIME_PER_CHAR       : 1/((((200+250)/2)/60)*5),  // 1 / (([(200+250)/2]english_wpm_comprehension / 60) * [5]avg_english_word_length) = x second/character

			DBG_LOGGING  						: 0,  // Should we enabling logging all events in the console?

			CMD_PREFIX  						: "!", // The prefix for all commands.
      CMD_DISABLED            : {},  // Disabled commands are added here.
		}
	}
	
	TwitchMod.save = function(){
		if(CCSE.config.OtherMods.TwitchMod) delete CCSE.config.OtherMods.TwitchMod; // no need to keep this, it's now junk data
		return JSON.stringify({
			config : TwitchMod.config
		});
	}
	
	TwitchMod.load = function(str){
		var obj = JSON.parse(str);
		
		var config = obj.config;
		for(var pref in config){
			TwitchMod.config[pref] = config[pref];
		}

    TwitchMod.postLoad();
	}

  TwitchMod.postLoad = function(){
    LoadScript(TwitchMod.modDir + '/twitch.js', function(){
      // it works now :)
      TwitchMod.isTwitchScriptLoaded = 1;
      TwitchMod.create();
      TwitchMod.attach();
      if (TwitchMod.config.CHAT_AUTOCONNECT){
        TwitchMod.connect();
      }
      for(var hook in TwitchMod.afterScriptLoadHooks){
        TwitchMod.afterScriptLoadHooks[hook]();
      }
    }, function(){
      // we broke it :(
      TwitchMod.isTwitchScriptLoaded = -1;
      TwitchMod.isTwitchScriptBroken = 1;
    });
  }
	
	TwitchMod.UpdatePref = function(prefName, value){
		var val = parseFloat(value);
		if(!isNaN(val)){
			TwitchMod.config[prefName] = val;
		} else {
			TwitchMod.config[prefName] = value;
		}
		Game.UpdateMenu();
	}
	
	TwitchMod.Toggle = function(prefName, button, on, off, invert){
		if(TwitchMod.config[prefName]){
			l(button).innerHTML = off;
			TwitchMod.config[prefName] = 0;
		}
		else{
			l(button).innerHTML = on;
			TwitchMod.config[prefName] = 1;
		}
		l(button).className = 'option' + ((TwitchMod.config[prefName] ^ invert) ? '' : ' off');
	}

  TwitchMod.ToggleCommand = function(prefName, button, on, off, invert){
    console.log(prefName, button, on, off, invert, TwitchMod.config.CMD_DISABLED[prefName]);
		if(TwitchMod.config.CMD_DISABLED[prefName]){
			l(button).removeAttribute('checked');
      l(button+'_label').innerHTML = off;
			delete TwitchMod.config.CMD_DISABLED[prefName];
		} else {
			l(button).setAttribute('checked','checked')
      l(button+'_label').innerHTML = on;
			TwitchMod.config.CMD_DISABLED[prefName] = 1;
		}
	}

  TwitchMod.ToggleCheck = function(prefName, button, on, off, invert){
    console.log(prefName, button, on, off, invert, TwitchMod.config[prefName]);
		if(TwitchMod.config[prefName]){
			l(button).removeAttribute('checked');
      l(button+'_label').innerHTML = off;
			TwitchMod.config[prefName] = 0;
		}
		else{
			l(button).setAttribute('checked','checked')
      l(button+'_label').innerHTML = on;
			TwitchMod.config[prefName] = 1;
		}
	}
	
	if(CCSE.ConfirmGameVersion(TwitchMod.name, TwitchMod.version, TwitchMod.GameVersion)) Game.registerMod(TwitchMod.id, TwitchMod); //TwitchMod.init();
}


if(!TwitchMod.isLoaded){
	if(CCSE && CCSE.isLoaded){
		TwitchMod.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(TwitchMod.launch);
	}
}