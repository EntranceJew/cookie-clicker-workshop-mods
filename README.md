# cookie-clicker-workshop-mods

TODO: make a [directory](/directory.md) of mods from other sources, too.

## Vanilla Mods

These don't require anything, they work by themselves.

### [forceopensesame](/forceopensesame)

Enables the developer widget + upgrades shortcut that isn't in the steam version.

![it's back](https://i.imgur.com/Nhvs4Ss.png)

### [GuaranteeToys](/GuaranteeToys)

Enables the `1/10000` chance of spawning toys. Based off of [GuaranteeWinklers](https://github.com/klattmose/klattmose.github.io/tree/master/CookieClicker/SteamMods/GuaranteeWinklers).

![these things](https://i.imgur.com/GLZIwar.gif)
> _These things._

### [newsfixer](/newsfixer)

Fixes the news reading as `News : lowercase headline` and makes it into `News: Uppercase headline`, for those of us that can detect whitespace anomalies.

![example fixed headline](https://i.imgur.com/kjxdx36.png)
> _You love to see it._

### [quickreload](/quickreload)

Press `ctrl-R` to reload the game and your mods instantly.

**(You may want to press `ctrl-S` to save first!)**

![see this whenever you want](https://i.imgur.com/YvmWqyx.png)
> _See this whenever you want!_

### [spawngolden](/spawngolden)

Press `ctrl-G` to spawn a Golden Cookie. Technically it will prompt every shimmer type to spawn, so it will spawn reindeers during christmas.

![do it for him](https://i.imgur.com/WPK5Ua8.png)
> _Do it for him._

## [CCSE](https://klattmose.github.io/CookieClicker/#cookie-clicker-script-extender--steam) Mods

You need to install this first, if you don't then I'll be upset!

### [RiskyClickSpell](/RiskyClickSpell)

Adds a spell that adds the innovative technology of unclicking the cookie, or just clicking on it like normal I guess.

![new spell slot](https://i.imgur.com/9LOcO4q.png)

![new achievement](https://i.imgur.com/Ev6GgEI.png)

![new shadow achievement](https://i.imgur.com/QL23vw4.png)

### [SkullTrumpetGCSFX](/SkullTrumpetGCSFX)

Gives you a new `Skull Trumpet` option for the `Golden cookie sound selector` upgrade.

![selected sound](https://i.imgur.com/2cMP1Zf.png)

![sound selector](https://i.imgur.com/ufx9pPO.png)

### [TimeBendSpell](/TimeBendSpell)

Adds a new spell that temporarily modifies the framerate cap and other events that use time such as the bank and farm minigames. The effect of the spell scales with the number of time machines owned, and the duration scales with the level of your time machines.

![new spell slot](https://i.imgur.com/HjSnL1O.png)

![new buff](https://i.imgur.com/NSqTE38.png)

![new anti-buff](https://i.imgur.com/BFJyCMc.png)

### [TwitchMod](/TwitchMod)

Adds basic Twitch Chat support to the game. Other mods can build off of this one.

![chat message](https://i.imgur.com/3Hil0Dh.png)

![twitch login options](https://i.imgur.com/SCjFfCS.png)

## FYI

- Add `--enable-logging` to the launch arguments to see silent / non-fatal errors.
- Edit `<yoursteaminstall>\SteamApps\common\Cookie Clicker\resources\app\start.js` and change `let DEV=0;` on line 11 to be `let DEV=1;` to get chrome devtools.
  - _If you do this, then you will not get achievements as of **2.042**._

## Installing

1. [Download this repository](https://github.com/EntranceJew/cookie-clicker-workshop-mods/archive/refs/heads/main.zip).
2. Extract the files somewhere.
3. Move the folders of the mods you want into `<yoursteaminstall>\SteamApps\common\Cookie Clicker\resources\app\mods\local`, you can get to this from the mods menu.
4. Enable them in-game with the mods menu.
