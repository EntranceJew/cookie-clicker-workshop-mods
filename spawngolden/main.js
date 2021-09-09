Game.registerMod("spawngolden", {
  init: function () {
    AddEvent(window, 'keydown', function (e) {
      //ctrl-h spanws a golden cookie
      if (!Game.OnAscend && Game.AscendTimer == 0 && e.ctrlKey && e.keyCode == 72) {
        for (var i in Game.shimmerTypes) {
          var me = Game.shimmerTypes[i];
          //no shimmer spawned for this type? check the timer and try to spawn one
          if (me.spawnConditions() && !me.spawned) {
            var newShimmer = new Game.shimmer(i);
            newShimmer.spawnLead = 1;
            if (Game.Has('Distilled essence of redoubled luck') && Math.random() < 0.01) var newShimmer = new Game.shimmer(i);
            me.spawned = 1;
          }
        }
        e.preventDefault();
      }
    });   
  }
});