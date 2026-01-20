# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Last Updated:** January 2026
**Project Status:** Production-ready with active development
**Current Version:** 1.0 (with mobile responsiveness)

## Recent Updates
- **Jan 20, 2026:** Mobile canvas responsiveness added (PR #12) - scaled layout metrics for mobile devices
- **Jan 19, 2026:** Comprehensive technical analysis document added (Research-RPG.md)
- **Jan 19, 2026:** UI assets redesigned and organized (PR #10)
- **Jan 18, 2026:** Initial CLAUDE.md documentation created

## Project Overview

**Bartimaeus Idle RPG** is a vanilla JavaScript HTML5 Canvas game inspired by AFK Arena mechanics. The game features auto-battling heroes, idle resource generation, and progressive difficulty scaling.

**Technology Stack:**
- Pure vanilla JavaScript (ES6+)
- HTML5 Canvas API for rendering
- LocalStorage for save persistence
- CSS3 for UI styling
- SVG assets for graphics
- GitHub Actions for CI/CD

**Key Features:**
- ✅ Horde mode combat (1 hero vs 3-5 enemies)
- ✅ Idle resource generation with AFK rewards (2-hour cap)
- ✅ Hero upgrade system with level-based stat scaling
- ✅ Skills system (Fireball, Cleave, Heal)
- ✅ Auto-save every 30 seconds
- ✅ Adventure log with timestamped events
- ✅ Mobile-responsive canvas layout
- ✅ Asset loading system with fallback rendering
- ✅ Battle speed controls (1x, 2x, 4x)

## Running the Game

This is a vanilla JavaScript HTML5 Canvas game with **no build step required**.

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
game.battleManager.pause()  // Pause battle
game.battleManager.setSpeed(4)  // 4x speed
```

## Architecture Overview

### Script Loading Order (CRITICAL)
Scripts must load in this exact order in [index.html](../index.html) (lines 140-157) due to class dependencies:
1. [assetManager.js](../src/scripts/assetManager.js) - `AssetManager` for loading sprites/images
2. [hero.js](../src/scripts/hero.js) - `Hero` class and `createStartingHeroes()`
3. [enemy.js](../src/scripts/enemy.js) - `Enemy` class and enemy generation functions
4. [skills.js](../src/scripts/skills.js) - `Skill` class and `SkillManager`
5. [adventureLog.js](../src/scripts/adventureLog.js) - `AdventureLog` event feed system
6. [resources.js](../src/scripts/resources.js) - `ResourceManager` singleton
7. [storage.js](../src/scripts/storage.js) - `StorageManager` and save/load utilities
8. [battle.js](../src/scripts/battle.js) - `BattleManager` (depends on Hero/Enemy/Skills)
9. [ui.js](../src/scripts/ui.js) - `UIManager` (depends on Hero/Enemy/Assets)
10. [game.js](../src/scripts/game.js) - `Game` controller (depends on all above)

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
The game uses a manager-based architecture where [game.js](../src/scripts/game.js) orchestrates six managers:
- **AssetManager** - Sprite loading, caching, and fallback rendering
- **BattleManager** - Combat logic, horde mode, attack timing, wave management
- **ResourceManager** - Gold/gems, idle generation, AFK rewards calculation
- **StorageManager** - LocalStorage save/load operations
- **UIManager** - Canvas rendering and DOM updates
- **AdventureLog** - Text-based event feed for combat, loot, and story events

### Three-Panel UI Layout
The game uses a modern three-panel layout in [index.html](../index.html) (lines 24-112):
- **Left Sidebar** (`#left-panel`) - Hero portrait, stats, resources, upgrades, and skill buttons
- **Center Panel** (`#center-panel`) - Battle canvas with stage/wave info and battle controls
- **Right Sidebar** (`#right-panel`) - Adventure log showing timestamped event feed

### Loading Screen
Asset loading uses a progress bar system [index.html:13-21](../index.html#L13-L21):
- Shows during initial asset load via `AssetManager.loadAll()`
- Displays real-time progress percentage
- Automatically hidden when loading completes
- Managed in [game.js](../src/scripts/game.js) init sequence

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
The canvas size is **fully responsive** with mobile support (PR #12, Jan 2026):
- **Desktop:** 800×400px canvas with standard metrics
- **Mobile:** Scaled layout with proportional positioning
- Character positions calculated dynamically based on canvas width/height ratios
- Font sizes and element scaling adjust for screen size
- Heroes positioned on left side of canvas
- Enemies positioned on right side of canvas
- Damage numbers float upward with animation
- Background images loaded from `AssetManager`

Battle results (victory/defeat) are drawn as canvas overlays with dedicated rendering methods.

**Responsive Implementation:**
Character positioning uses canvas-relative ratios rather than fixed pixel values, ensuring proper layout on all screen sizes. See [ui.js](../src/scripts/ui.js) for scaled layout metrics.

## Core Systems

### AssetManager System
**File:** [assetManager.js](../src/scripts/assetManager.js) (210 lines)

Handles loading and caching of SVG sprites with fallback support.

**Asset Manifest Structure:**
```javascript
manifest: {
  backgrounds: { forest, dungeon, volcano, castle },
  heroes: { bartimaeus },
  enemies: { goblin, orc, skeleton, demon, dragon },
  ui: { skill icons, healthbars, buttons, resource icons }
}
```

**Key Methods:**
- `loadAll()` - Load all assets with Promise-based tracking
- `get(category, name)` - Retrieve loaded asset or null
- `getProgress()` - Returns 0-1 loading progress
- `updateLoadingScreen()` - Updates progress bar in real-time

**Fallback Rendering:**
If assets fail to load, the game renders with colored shapes instead of images.

### Skills System
**File:** [skills.js](../src/scripts/skills.js) (293 lines)

Active ability system with cooldown management.

**Predefined Skills:**
1. **FIREBALL** - 200% damage to single target, 5s cooldown
2. **CLEAVE** - 80% damage to all enemies, 8s cooldown
3. **HEAL** (Second Wind) - Restore 30% max health, 15s cooldown

**Skill Class:**
- `baseCooldown` - Cooldown duration in milliseconds
- `currentCooldown` - Time remaining on cooldown
- `effect` - Function: `(caster, targets, battleManager) => void`
- `canUse()` - Returns true if skill is ready
- `use()` - Execute skill effect and trigger cooldown

**SkillManager:**
- Manages hero's unlocked skills
- Updates all cooldowns each frame
- `useSkill(skillId, targets, battleManager)` - Trigger skill by ID
- `unlockSkill(skillId)` - Add new skill to hero's available skills

**Integration:**
Skills are currently defined but not fully integrated into the battle loop. UI buttons exist in left panel but require wiring to `BattleManager`.

### AdventureLog System
**File:** [adventureLog.js](../src/scripts/adventureLog.js) (187 lines)

Text-based event feed displayed in right sidebar.

**Event Categories:**
- `combat` - Damage dealt, enemy defeats (⚔️, 💀)
- `loot` - Resources obtained (💰)
- `stage` - Stage progression, upgrades (🎯, ⬆️)
- `skill` - Skill usage (✨)
- `story` - Narrative events, respawns (💫)

**Key Features:**
- Timestamped entries (HH:MM:SS format)
- Newest entries appear at top
- Max 100 entries with automatic cleanup
- CSS styling by event type

**Convenience Methods:**
- `logCombat(attacker, target, damage)` - Log damage dealt
- `logEnemyDefeated(enemyType)` - Log enemy death
- `logLoot(itemName, quantity)` - Log resource gains
- `logStage(stageNumber)` - Log stage progression
- `logSkill(casterName, skillName, damage)` - Log skill cast

### Battle System (Horde Mode)
**File:** [battle.js](../src/scripts/battle.js) (352 lines)

The battle system operates in **HORDE mode only** - single hero fights waves of enemies.

**Battle Flow:**
1. One hero fights 3-5 enemies (scales with stage)
2. When enemies defeated, new wave spawns
3. When hero defeated, respawns after delay
4. Continuous battle with wave counter

**Speed Controls:**
Battle supports 1x, 2x, and 4x speed multipliers via UI buttons:
- Affects attack intervals
- Affects respawn timers
- Does not affect frame rate (stays 60 FPS)

**Key Methods:**
- `startHordeBattle()` - Initialize horde mode
- `spawnNewWave()` - Generate next enemy wave
- `pause()` / `resume()` - Battle control
- `setSpeed(multiplier)` - Change battle speed (1, 2, or 4)

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

## Asset Management

### Asset Organization
**Total Assets:** 29 SVG files organized by category in `/assets/`:

**Backgrounds (4):** `forest.svg`, `dungeon.svg`, `volcano.svg`, `castle.svg`
**Heroes (8):** `bartimaeus.svg`, `bartimaeus-alt.svg`, `mage.svg`, `archer.svg`, plus 4 downloaded from GDQuest (hero-blue, hero-green, hero-grey, shadow)
**Enemies (5):** `goblin.svg`, `orc.svg`, `skeleton.svg`, `demon.svg`, `dragon.svg`
**UI Elements (10):** Skill icons, health bars, buttons, resource icons (fireball-icon, cleave-icon, heal-icon, gold-coin, gem-icon, healthbars, panel-frame, button-upgrade)
**Downloaded (4):** From GDQuest (CC0 licensed) - 3 hero variants + shadow overlay

### Adding New Assets
1. Add SVG file to appropriate `/assets/` subdirectory
2. Update `AssetManager.manifest` in [assetManager.js:13-45](../src/scripts/assetManager.js#L13-L45)
3. If external asset, add attribution to [CREDITS.md](../CREDITS.md)
4. Use `assetManager.get(category, name)` to retrieve in code

**Asset Guidelines:**
- Prefer SVG format for scalability
- Check license compatibility (CC0, CC-BY, MIT preferred)
- Document external assets in CREDITS.md with source URL
- See [SPRITE_RESOURCES.md](SPRITE_RESOURCES.md) for free sprite sources

## Deployment

### GitHub Pages Auto-Deployment
**File:** [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)

The game automatically deploys to GitHub Pages when pushing to `main` branch:
- **Trigger:** Push to `main` or manual workflow dispatch
- **Build:** None required (vanilla JS, no compilation)
- **Deploy:** Entire repository serves as static site
- **URL:** `https://USERNAME.github.io/bartimaeus-idle-rpg`

**Setup Requirements:**
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Workflow runs automatically on push

**Manual Trigger:**
1. Go to Actions tab
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"

## Common Modifications

**Adding a new hero:**
1. Edit `createStartingHeroes()` in [hero.js](../src/scripts/hero.js)
2. Add hero sprite to `AssetManager.manifest`
3. Update UI positioning if more than one hero (horde mode uses single hero)

**Adding a new skill:**
1. Define skill in `SKILLS` object in [skills.js](../src/scripts/skills.js)
2. Add skill icon to `/assets/ui/` and manifest
3. Update UI to show skill button
4. Wire button to `skillManager.useSkill()`

**Adding a new enemy type:**
1. Create SVG sprite in `/assets/enemies/`
2. Add to `AssetManager.manifest`
3. Update `createEnemiesForStage()` in [enemy.js](../src/scripts/enemy.js)

**Changing battle speed:**
Use speed controls (1x, 2x, 4x) via `BattleManager.setSpeed()`. Default is 1x.

**Adjusting difficulty:**
Edit enemy scaling multipliers in `createEnemiesForStage()` in [enemy.js](../src/scripts/enemy.js).

**Adding background for stage:**
1. Create/obtain SVG background
2. Add to `AssetManager.manifest.backgrounds`
3. Update stage logic to select background based on stage number

## Modal System
All modals use the `.modal` class with `display: flex` when visible, `display: none` when hidden.

**Current Modals:**
- `#afk-modal` - AFK rewards popup (shows offline earnings)
- `#loading-screen` - Asset loading progress

Control visibility via `style.display = 'flex'` (show) or `'none'` (hide).

## Project Documentation

### Documentation Files
- [README.md](../README.md) - User-facing documentation, how to play, deployment
- [CLAUDE.md](CLAUDE.md) - This file, AI assistant guidance
- [CREDITS.md](../CREDITS.md) - Asset attribution and licenses
- [Research-RPG.md](../Research-RPG.md) - Comprehensive 33KB technical analysis of Idle RPG architecture, AFK Arena mechanics, and exponential progression mathematics
- [AFK_ARENA_TECH_STACK.md](../AFK_ARENA_TECH_STACK.md) - Research notes on AFK Arena game mechanics
- [SPRITE_INTEGRATION_GUIDE.md](SPRITE_INTEGRATION_GUIDE.md) - How to add sprites
- [SPRITE_RESOURCES.md](SPRITE_RESOURCES.md) - Free sprite websites
- [DOWNLOADED_ASSETS.md](DOWNLOADED_ASSETS.md) - Downloaded asset summary
- [ROADMAP.md](ROADMAP.md) - Step-by-step development roadmap (12 steps)
- [ASSET_GUIDE.md](../assets/ASSET_GUIDE.md) - Asset organization guide

### Code Statistics
- **JavaScript:** ~2,748 lines across 10 files
  - `game.js`: 470 lines (main controller)
  - `ui.js`: 454 lines (canvas rendering)
  - `battle.js`: 352 lines (combat system)
  - `skills.js`: 293 lines (abilities)
  - `hero.js`: 242 lines (hero system)
  - `assetManager.js`: 210 lines (asset loading)
  - `resources.js`: 210 lines (gold/gems)
  - `adventureLog.js`: 187 lines (event feed)
  - `enemy.js`: 176 lines (enemy creation)
  - `storage.js`: 154 lines (save/load)
- **CSS:** ~843 lines across 2 files
  - `main.css`: 749 lines (layout, colors, animations)
  - `battle.css`: 94 lines (battle overlays)
- **HTML:** 160 lines (single file: `index.html`)
- **Assets:** 29 SVG files
- **Documentation:** 5 files in `/docs/` (~56KB)
- **No build step required** - Pure vanilla JavaScript

## Development Workflow

### Git Branching
- `main` - Production branch (auto-deploys to GitHub Pages)
- Feature branches follow pattern: `claude/feature-name-xxxxx`
- Always create feature branches for new development
- Push to origin with `-u` flag: `git push -u origin branch-name`

### Testing Changes
1. Open `index.html` in browser (or use Live Server)
2. Open browser console (F12) for debugging
3. Use debug commands (see "Console Debugging" section)
4. Test save/load with `localStorage` inspection
5. Test AFK rewards by closing and reopening

### Code Style
- **Formatter:** Prettier configured in `.prettierrc`
- **Quotes:** Single quotes (`'`)
- **Semicolons:** Required (`;`)
- **Tab Width:** 2 spaces
- **Line Width:** 80 characters
- **Trailing Commas:** ES5 style
- **Arrow Parens:** Avoid when possible (`x => x` not `(x) => x`)

**Prettier Configuration (`.prettierrc`):**
```json
{
  "singleQuote": true,
  "semi": true,
  "tabWidth": 2,
  "printWidth": 80,
  "trailingComma": "es5",
  "arrowParens": "avoid"
}
```

### VS Code Configuration
The project includes VS Code settings in `.vscode/` for optimal development experience:

**Recommended Extensions (`.vscode/extensions.json`):**
1. `ritwickdey.liveserver` - Live Server for instant browser refresh
2. `esbenp.prettier-vscode` - Code formatting
3. `dbaeumer.vscode-eslint` - JavaScript linting
4. `formulahendry.auto-close-tag` - HTML tag auto-completion
5. `pranaygp.vscode-css-peek` - CSS utilities
6. `pkief.material-icon-theme` - File icon theme

**Editor Settings (`.vscode/settings.json`):**
- **Auto-format on save:** Enabled with Prettier
- **Auto-save:** Every 1 second after changes
- **Bracket pair colorization:** Enabled
- **Live Server:** Configured to use Chrome browser
- **Auto-imports:** Enabled for JavaScript
- **Indentation:** 2 spaces (enforced)

## Troubleshooting

**Assets not loading:**
- Check browser console for 404 errors
- Verify paths in `AssetManager.manifest`
- Game will render with fallback shapes if assets fail

**Skills not working:**
- Skills defined but not fully integrated into battle loop
- Button UI exists but requires wiring to BattleManager
- This is a known incomplete feature

**Save data corrupted:**
- Use `game.storageManager.deleteSave()` to reset
- Check LocalStorage key: `bartimaeus_rpg_save`
- Game handles missing/invalid saves gracefully

**Battle speed issues:**
- Speed multiplier affects intervals, not frame rate
- Frame rate stays at 60 FPS regardless of speed setting
- Use `game.battleManager.setSpeed(1)` to reset to normal

## Important Notes for AI Assistants

1. **No Build Process:** This is vanilla JavaScript - no webpack, babel, or npm build. Changes are immediately reflected on refresh.

2. **Script Order Matters:** The order in index.html is critical. Classes must be defined before they're referenced.

3. **Asset Loading:** AssetManager loads asynchronously. Game waits for assets before starting via Promise chain.

4. **Horde Mode Only:** Despite code supporting multiple modes, game currently runs in horde mode exclusively (1 hero vs waves).

5. **Skills Partially Integrated:** Skill system exists and is defined in skills.js. Skills have proper cooldown management but may need additional battle loop integration for full functionality.

6. **LocalStorage Only:** No backend or database. All saves are browser LocalStorage. Clearing browser data = lost save.

7. **Single Hero Active:** UI shows multiple heroes but battle uses single active hero. This is intentional for horde mode.

8. **Attribution Required:** External assets (4 from GDQuest) require CREDITS.md maintenance per CC0 guidelines (optional but recommended).

9. **GitHub Actions Deployment:** Pushing to `main` triggers auto-deploy. Test on feature branches first.

10. **Canvas-Based Rendering:** All battle visuals use HTML5 Canvas API, not DOM elements. Damage numbers, characters, backgrounds all drawn to canvas.

11. **Mobile Responsive:** Canvas layout uses ratio-based positioning for mobile compatibility. Test on multiple screen sizes.

12. **Battle Speed Controls:** Game supports 1x, 2x, and 4x speed multipliers affecting attack intervals (not frame rate).

## Quick Reference

### Common Code Patterns

**Adding a new manager:**
```javascript
// In the manager file
class NewManager {
  constructor() {
    // Initialize state
  }

  update(deltaTime) {
    // Update logic called every frame
  }
}

// In game.js
this.newManager = new NewManager();
// Call in game loop: this.newManager.update(deltaTime);
```

**Adding a UI element:**
```javascript
// 1. Add HTML in index.html
<button id="my-button">Click Me</button>

// 2. Add event listener in game.js or ui.js
document.getElementById('my-button').addEventListener('click', () => {
  // Handle click
});

// 3. Style in main.css
#my-button {
  background: #6c5ce7;
  color: white;
  padding: 10px;
}
```

**Adding a new hero stat:**
```javascript
// 1. In hero.js constructor
this.newStat = baseNewStat;

// 2. Add scaling in level-up calculations
get effectiveNewStat() {
  return this.baseNewStat * (1 + (this.level - 1) * 0.10);
}

// 3. Update save/load in storage.js
// Add to save state and load from save
```

**Adding canvas rendering:**
```javascript
// In ui.js render method
drawNewElement(ctx) {
  ctx.save();
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(x, y, width, height);
  // For images:
  const img = this.game.assetManager.get('category', 'name');
  if (img) ctx.drawImage(img, x, y, w, h);
  ctx.restore();
}
```

### File Line Number References

When referencing code locations, use this format for better navigation:
- Game loop: `game.js:252-310`
- Canvas rendering: `ui.js:39-91`
- Script loading order: `index.html:140-157`
- Asset manifest: `assetManager.js:13-45`
- Save system: `storage.js:20-80`
- Battle logic: `battle.js:150-250`

### Testing Checklist

Before committing changes:
- [ ] Open `index.html` in browser (or use Live Server)
- [ ] Check browser console for errors (F12)
- [ ] Test save/load with `game.storageManager.save()` and reload
- [ ] Verify mobile layout if UI changes were made
- [ ] Run through a battle to ensure combat works
- [ ] Check that auto-save triggers (wait 30 seconds)
- [ ] Test with `game.speedMultiplier = 4` for faster testing

### Git Workflow Reminder

```bash
# Always work on feature branches
git checkout -b claude/feature-name-xxxxx

# Make changes, then stage and commit
git add .
git commit -m "Brief description of changes"

# Push to origin with -u flag (CRITICAL: branch must start with 'claude/')
git push -u origin claude/feature-name-xxxxx

# Create PR when ready (use gh CLI or GitHub web UI)
gh pr create --title "Feature: Description" --body "Details..."
```
