Game.registerMod("quickreload",{
  init:function(){
    AddEvent(window,'keydown',function(e){
      //ctrl-r reloads the game
      if (!Game.OnAscend && Game.AscendTimer==0 && e.ctrlKey && e.keyCode==82 ) {
        Game.toReload=true;
        e.preventDefault();
      }
    });
  }
});