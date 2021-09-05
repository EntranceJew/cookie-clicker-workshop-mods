Game.registerMod("newsfixer",{
  init:function(){
    let MOD = this;
    MOD.OriginalTickerDraw = Game.TickerDraw
    Game.TickerDraw = function() {
        var str='';
        if (Game.Ticker!='') str=Game.Ticker;
        if (str.startsWith("News : ")){
            Game.Ticker = "News: " + str.charAt(7).toUpperCase() + str.slice(8);
        }
        MOD.OriginalTickerDraw();
    }
  }
});