## Purpose

These short instructions orient AI coding agents to be productive in this repository. Focus on discoverable, actionable knowledge (architecture, important files, run/debug workflow, conventions, and quick edit examples).

## Big picture

- Single-page vanilla JavaScript HTML5 Canvas game. No build step. Open [index.html](index.html) or use Live Server.
- Manager-based architecture coordinated by `src/scripts/game.js`: `BattleManager`, `ResourceManager`, `StorageManager`, `UIManager`.
- Global runtime object: `window.game` (inspectable in console for state and quick edits).

## Critical file map (start here)
- [index.html](index.html) — load order and canvas element
- [src/scripts/game.js](src/scripts/game.js) — main game loop and orchestration
- [src/scripts/hero.js](src/scripts/hero.js) — `Hero` class, `createStartingHeroes()`
- [src/scripts/enemy.js](src/scripts/enemy.js) — `Enemy` class and `createEnemiesForStage()`
- [src/scripts/battle.js](src/scripts/battle.js) — `BattleManager`, `attackInterval` (default 1000ms)
- [src/scripts/resources.js](src/scripts/resources.js) — `ResourceManager`, idle/AFK logic
- [src/scripts/storage.js](src/scripts/storage.js) — `StorageManager`, LocalStorage key `bartimaeus_rpg_save`
- [src/scripts/ui.js](src/scripts/ui.js) — canvas rendering, hardcoded positions and overlays

## Script loading order (must preserve)
Scripts in `index.html` depend on this order. Changing it breaks runtime: `hero.js` → `enemy.js` → `resources.js` → `storage.js` → `battle.js` → `ui.js` → `game.js`.

## Conventions & patterns to follow
- Manager pattern: small single-responsibility managers orchestrated by `game` (do not consolidate logic across files).
- Classes use plain JS `class` syntax; state is saved via `storageManager` to LocalStorage. Use the existing save schema when modifying persistence.
- Canvas coordinates & sizes are fixed (800×400). Character `x,y` positions are hardcoded in `ui.js` — update both canvas and UI positions together.
- Stat formulas and scaling are centralized in `hero.js`/`enemy.js`. Prefer editing those functions for balance changes.

## Developer workflows
- Run locally: open `index.html` or use VS Code Live Server (recommended).
- No npm, build, or test runner in repo. Changes are validated by running the page and using browser console.
- Useful console helpers (open DevTools):
  - `game` — inspect whole runtime
  - `game.resourceManager.addGold(10000)` — grant gold for testing
  - `game.currentStage = 10; game.nextStage()` — jump stages
  - `game.storageManager.deleteSave()` — clear save and reload

## Quick-edit examples
- Add a new hero: update `createStartingHeroes()` in [src/scripts/hero.js](src/scripts/hero.js) and add position in `yPositions` in [src/scripts/ui.js](src/scripts/ui.js).
- Change attack speed: edit `attackInterval` in [src/scripts/battle.js](src/scripts/battle.js).
- Modify AFK cap or idle generation: edit `ResourceManager` in [src/scripts/resources.js](src/scripts/resources.js).

## Integration points / external deps
- No external libraries. Persistence uses browser LocalStorage key `bartimaeus_rpg_save` — keep schema compatible when changing saves.
- Deployment target is static hosting (GitHub Pages). Use README steps to publish.

## Debugging checklist for runtime errors
1. Verify script order in [index.html](index.html).
2. Open DevTools console for stack traces. `window.game` exists if scripts loaded correctly.
3. Check LocalStorage under key `bartimaeus_rpg_save` for malformed data; remove to reset.
4. If canvas overlay or positions appear wrong, update both the `<canvas>` size in [index.html](index.html) and `ui.js` coordinates.

## When editing code for PRs
- Keep changes focused and small (balance, UI, or a single feature). Run the page and validate via console quick-commands.
- If changing save schema, provide a migration path: detect `save.version` and transform on load.

---
If anything here is unclear or you'd like more examples (e.g., typical PR checklist, helper snippets), tell me which area to expand.
