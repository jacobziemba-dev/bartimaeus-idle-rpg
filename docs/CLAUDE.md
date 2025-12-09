# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

This is a vanilla JavaScript HTML5 Canvas game with no build step required.

**Development:**
- Simply open [index.html](../index.html) in a browser, or
- Use VS Code's Live Server extension for auto-refresh during development

**Console Debugging:**
The game object is exposed globally as `window.game`. Useful debug commands:
```javascript
game.resourceManager.addGold(10000)
game.resourceManager.addGems(500)
game.currentStage = 10
game.storageManager.deleteSave()  // Reset save
```

## Architecture Overview

### Script Loading Order (CRITICAL)
Scripts must load in this exact order in [index.html](../index.html) due to class dependencies:
1. [hero.js](../src/scripts/hero.js) - `Hero` class and `createStartingHeroes()`
2. [enemy.js](../src/scripts/enemy.js) - `Enemy` class and enemy generation functions
3. [resources.js](../src/scripts/resources.js) - `ResourceManager` singleton
4. [storage.js](../src/scripts/storage.js) - `StorageManager` and save/load utilities
5. [battle.js](../src/scripts/battle.js) - `BattleManager` (depends on Hero/Enemy)
6. [ui.js](../src/scripts/ui.js) - `UIManager` (depends on Hero/Enemy)
7. [game.js](../src/scripts/game.js) - `Game` controller (depends on all above)

### Core Game Loop
The game runs at 60 FPS using `requestAnimationFrame()` in [game.js:169](../src/scripts/game.js#L169):
```
gameLoop() → update(deltaTime) → render()
```

**Update phase** (every frame):
- `battleManager.update()` - Process combat (heroes/enemies attack every 1 second)
- `resourceManager.update()` - Accumulate idle gold/gems
- Check battle end conditions
- Auto-save every 30 seconds

**Render phase**:
- `uiManager.render()` - Draw heroes, enemies, damage numbers to canvas
- `drawBattleResult()` - Show victory/defeat overlay on canvas

### Manager Pattern
The game uses a manager-based architecture where [game.js](../src/scripts/game.js) orchestrates four managers:
- **BattleManager** - Combat logic, attack timing, win/loss detection
- **ResourceManager** - Gold/gems, idle generation, AFK rewards calculation
- **StorageManager** - LocalStorage save/load operations
- **UIManager** - Canvas rendering and DOM updates

### Hero/Enemy System
Both `Hero` and `Enemy` classes share similar structures:
- Stats: `health`, `maxHealth`, `attack`, `defense`
- Damage calculation: `attack - (target.defense * 0.5)` with ±10% variance
- Position tracking: `x`, `y` coordinates set by UI for damage number placement

**Heroes** level up individually via upgrades. Upgrade cost formula: `100 * level^1.5`

**Enemies** scale per stage. Each stage multiplies base stats:
- Health: `×1.20^(stage-1)`
- Attack: `×1.15^(stage-1)`
- Defense: `×1.10^(stage-1)`

### Save System
Uses browser LocalStorage with key `bartimaeus_rpg_save`. Auto-saves every 30 seconds.

Save structure:
```javascript
{
  version: '1.0',
  lastSaveTime: timestamp,
  currentStage: number,
  heroes: [{ id, name, role, level, baseHealth, baseAttack, baseDefense }, ...],
  resources: { gold, gems, goldPerSecond, gemsPerSecond, lastSaveTime }
}
```

**AFK rewards** are calculated on load by comparing `lastSaveTime` to current time, capped at 2 hours.

### Canvas Rendering
The canvas is fixed at 800×400 pixels. Character positions are hardcoded:
- Heroes: x=100, y=[100, 200, 300]
- Enemies: x=600, y=[100, 200, 300]

Battle results (victory/defeat) are drawn as canvas overlays with `drawBattleResult()` in [ui.js:253](../src/scripts/ui.js#L253).

## Key Formulas

**Stat Scaling (Heroes):**
- Max Health: `baseHealth * (1 + (level - 1) * 0.15)` (+15% per level)
- Attack: `baseAttack * (1 + (level - 1) * 0.10)` (+10% per level)
- Defense: `baseDefense * (1 + (level - 1) * 0.08)` (+8% per level)

**Idle Generation:**
- Gold/sec: `stage * 10`
- Gems/sec: `stage * 0.1`

**Battle Rewards:**
- Gold: `50 * stage * 1.1^stage`
- Gems: `stage * 2`

## Common Modifications

**Adding a new hero:**
Edit `createStartingHeroes()` in [hero.js:210](../src/scripts/hero.js#L210). Add to `yPositions` array in [ui.js:32](../src/scripts/ui.js#L32) if more than 3 heroes.

**Changing battle speed:**
Modify `attackInterval` (default 1000ms) in [battle.js:23](../src/scripts/battle.js#L23).

**Adjusting difficulty:**
Edit enemy scaling multipliers in `createEnemiesForStage()` in [enemy.js:103](../src/scripts/enemy.js#L103).

**Canvas size changes:**
Update `<canvas width="800" height="400">` in [index.html:31](../index.html#L31) and adjust character positions in [ui.js](../src/scripts/ui.js) constructor.

## Modal System
All modals use the `.modal` class with `display: flex` when visible, `display: none` when hidden. Modals include:
- `#upgrade-modal` - Hero upgrade panel
- `#afk-modal` - AFK rewards popup

Control visibility via `style.display` in JavaScript (see [ui.js:340-356](../src/scripts/ui.js#L340-L356)).
