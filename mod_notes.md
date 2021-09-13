# Some Notes About Mods

## Making Mods

1. Check out the [Editor Tools](#editor-tools) section below for tools to get started.
2. Reference [this guide by ThEnderYoshi](https://steamcommunity.com/sharedfiles/filedetails/?id=2592299023) to get familiar with the structure and layout of mods.
3. Investigate the structure of mods on your `/local` folder. Make a copy of the `sampleMod` folder to get started.

### Testing Mods

- Add `--enable-logging` to the launch arguments to see silent / non-fatal errors.
- Edit `<yoursteaminstall>\SteamApps\common\Cookie Clicker\resources\app\start.js` and change `let DEV=0;` on line 11 to be `let DEV=1;` to get chrome devtools.
  - _If you do this, then you will not get achievements as of **2.042**._

### Editor Tools

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
- Scope Helpers
  - [Blockman](https://marketplace.visualstudio.com/items?itemName=leodevbro.blockman)
  - [Highlight Matching Tag](https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag)
  - [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)
  - [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)

### Common Problems

- **The "ID" section of `info.txt` must match the name given to `Game.registerMod()`.**
  - If you don't make these match the game just won't load your mod at all.
- **If you ever have an error in your files, the game will fail to load.**
  - If the game never loads, move your mod files outside the `/local` directory until you can get the game to load again.
  - If your game freezes, there is a chance it encountered an error during operation, if you can still effectively enable/disable mods, disable mods until that error stops happening.
- **Importing old browser saves may prevent you from loading mods**.
  - Something about certain old browser saves and the code of **2.042** does not migrate saves, therefore it does not have the data structure where enabled/disabled mods can be stored. You may need to find a save editor to help you migrate the save.
