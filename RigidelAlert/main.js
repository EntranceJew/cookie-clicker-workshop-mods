if(RigidelAlert === undefined) var RigidelAlert = {};
RigidelAlert.name = 'Rigidel Alert';
RigidelAlert.id = 'RigidelAlert';
RigidelAlert.version = '1.0';
RigidelAlert.GameVersion = '2.042';

RigidelAlert.launch = function(){
  RigidelAlert.init = function(){
    let dir = CCSE.GetModPath(RigidelAlert.id);
    RigidelAlert.styles = `
    #rigidelAlertHolder {
      position: absolute;
      font-weight: bold;
      top: 24px;
      right: -11px;
      width: 48px;
      text-align: center;
    }

    #rigidelAlertIcon {
      pointer-events: none;
      position: absolute;
      width: 48px;
      height: 48px;
      margin-left: 0;
      margin-right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #rigidelAlertAmount {
      z-index: 10;
      text-shadow: 0px 1px 0px #000, 0px 0px 6px #ff00e4;
      color: #f01700;
      flex: 0 0 48px;
      font-size: 24px;
      font-family: 'Merriweather', Georgia,serif;
    }
    `;
    CCSE.AddStyles(RigidelAlert.styles);
  
    let alertHolder = document.createElement("div");
    alertHolder.setAttribute("id", "rigidelAlertHolder");
    let alertHolderIcon = document.createElement("div");
    alertHolderIcon.setAttribute("id", "rigidelAlertIcon");
    alertHolderIcon.setAttribute("class", "icon");
    let alertHolderAmount = document.createElement("div");
    alertHolderAmount.setAttribute("id", "rigidelAlertAmount");
    alertHolderIcon.append(alertHolderAmount);
    alertHolder.append(alertHolderIcon);
    l("leftBeam").append(alertHolder);
    l("leftBeam").style.zIndex = 9999;

    RigidelAlert.lastValue = -1;
    // RigidelAlert.onIcon = [30,20,'img/icons.png'];
    // RigidelAlert.offIcon = [31,20,'img/icons.png'];
    // RigidelAlert.onIcon = [22,19,'img/icons.png'];
    // RigidelAlert.offIcon = [31,20,'img/icons.png'];
    RigidelAlert.onIcon = [0,0, dir+'/img/icon.png'];
    RigidelAlert.offIcon = [1,0, dir+'/img/icon.png'];

    RigidelAlert.SetIcon = function(icon) {
      let style = (icon[2]?'background-image:url('+icon[2]+');':'')+'background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px;';
      l("rigidelAlertIcon").setAttribute("style", style);
    }

    RigidelAlert.UpdateIcon = function() {
      let isWoke = Game.BuildingsOwned%10 === 0;
      let wasWoke = RigidelAlert.lastValue%10 === 0;
      let icon = isWoke ? RigidelAlert.onIcon : RigidelAlert.offIcon;

      if (Game.BuildingsOwned !== RigidelAlert.lastValue) {
        if ((isWoke && !wasWoke) || (!isWoke && wasWoke)){
          RigidelAlert.SetIcon(icon);
        }
        RigidelAlert.lastValue = Game.BuildingsOwned;
        l("rigidelAlertAmount").innerHTML = isWoke ? '' : RigidelAlert.lastValue%10;
      }
    }

    RigidelAlert.SetIcon(RigidelAlert.offIcon);

    Game.registerHook("logic", RigidelAlert.UpdateIcon);

    RigidelAlert.isLoaded = 1;
    if (Game.prefs.popups) Game.Popup(RigidelAlert.name + ' loaded!');
    else Game.Notify(RigidelAlert.name + ' loaded!', '', '', 1, 1);
  }

  

	if(CCSE.ConfirmGameVersion(RigidelAlert.name, RigidelAlert.version, RigidelAlert.GameVersion)) Game.registerMod(RigidelAlert.id, RigidelAlert); // RigidelAlert.init();
}

if(!RigidelAlert.isLoaded){
	if(CCSE && CCSE.isLoaded){
		RigidelAlert.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(RigidelAlert.launch);
	}
}