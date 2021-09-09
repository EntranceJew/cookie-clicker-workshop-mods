if(SkullTrumpetGCSFX === undefined) var SkullTrumpetGCSFX = {};
SkullTrumpetGCSFX.name = 'Skull Trumpet GCSFX';
SkullTrumpetGCSFX.id = 'SkullTrumpetGCSFX';
SkullTrumpetGCSFX.version = '1.0';
SkullTrumpetGCSFX.GameVersion = '2.042';

SkullTrumpetGCSFX.launch = function(){
  SkullTrumpetGCSFX.init = function(){
    let dir = CCSE.GetModPath(SkullTrumpetGCSFX.id);
    CCSE.NewGoldenCookieSound({
      name:"Skull Trumpet",
      icon:[0,0,dir + '/img/icon.png'],
      default: dir + '/snd/skulltrumpet.mp3',
    });
  
    SkullTrumpetGCSFX.isLoaded = 1;
    if (Game.prefs.popups) Game.Popup(SkullTrumpetGCSFX.name + ' loaded!');
    else Game.Notify(SkullTrumpetGCSFX.name + ' loaded!', '', '', 1, 1);
  }

	if(CCSE.ConfirmGameVersion(SkullTrumpetGCSFX.name, SkullTrumpetGCSFX.version, SkullTrumpetGCSFX.GameVersion)) Game.registerMod(SkullTrumpetGCSFX.id, SkullTrumpetGCSFX); // SkullTrumpetGCSFX.init();
}

if(!SkullTrumpetGCSFX.isLoaded){
	if(CCSE && CCSE.isLoaded){
		SkullTrumpetGCSFX.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(SkullTrumpetGCSFX.launch);
	}
}