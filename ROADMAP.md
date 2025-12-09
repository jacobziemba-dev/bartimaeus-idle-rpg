# 🎮 Bartimaeus Idle RPG - Simple Step-by-Step Plan

## YOUR GOAL
Build a working 2D idle RPG game - learning as you go!

---

## 🛠️ TOOLS YOU'LL USE

### For Coding
- **VS Code** - Your code editor
- **Live Server Extension** - See changes instantly in browser
  - Right-click index.html → "Open with Live Server"
  - Browser refreshes automatically when you save files

### For Debugging
- **Browser Console** (F12 in Chrome)
  - Type: `game.resourceManager.addGold(10000)` to add gold
  - Type: `game.currentStage = 10` to skip to stage 10
  - Type: `window.game` to see all game data
- **VS Code Debugger** (F5)
  - Click line numbers to set breakpoints
  - See what's happening step-by-step

### For UI Development
- **Browser DevTools** (F12 → Elements tab)
  - Click on buttons/elements to see their CSS
  - Edit CSS live to test changes
- **Canvas** - Drawing game graphics
  - Your game uses HTML5 Canvas (800x400 pixels)
  - Characters and health bars are drawn here

### Helpful Free Tools
- **Figma** (figma.com) - Design UI layouts
- **Coolors** (coolors.co) - Pick color schemes
- **Google Fonts** - Free fonts for your game
- **ScreenToGif** - Record gameplay GIFs
- **Freesound.org** - Free sound effects

---

## 📚 HOW TO LEARN AS YOU GO

### When Stuck
1. Use browser console to test ideas
2. Add `console.log()` to see what's happening
3. Check CLAUDE.md file - it explains the game structure
4. Ask Claude for help with specific features

### Good Learning Habits
- Make ONE small change at a time
- Test after every change (use Live Server)
- Save often (Ctrl+S)
- Use git commits after each working feature

---

## 🎯 YOUR STEP-BY-STEP ROADMAP

Each step is small and doable. Complete one before moving to the next!

---

## STEP 1: Make Battle More Fun (Week 1)

### Goal
Add clickable speed controls so battles run at 1x, 2x, and 4x.

### Files to edit
- `index.html` — add buttons to the UI
- `scripts/battle.js` — use a multiplier on the attack timer
- `scripts/ui.js` or `scripts/game.js` — wire button events

### Step-by-step
1. Open `index.html` and locate the top-bar or controls area. Add:

```html
<div id="speed-controls">
  <button data-speed="1">1x</button>
  <button data-speed="2">2x</button>
  <button data-speed="4">4x</button>
</div>
```

2. In `scripts/game.js` or `scripts/ui.js`, add an event listener to the `#speed-controls` container that reads `data-speed` and stores it on the global `game` object: `game.speedMultiplier = Number(speed)`.

3. In `scripts/battle.js` where the battle loop/timer uses `attackInterval` or `setInterval`/`setTimeout`, multiply the delay by `1 / game.speedMultiplier`. Example:

```javascript
const baseDelay = 1000; // original delay in ms
const delay = baseDelay / (game.speedMultiplier || 1);
setTimeout(nextAttack, delay);
```

4. Update the UI to visually indicate the active speed (add an `active` class).

### Quick test
- Start a battle, click `1x`, `2x`, `4x`. Attacks per second should scale accordingly.
- Use console to set `game.speedMultiplier = 4` and observe faster attacks.

---

## STEP 2: Better Visual Feedback (Week 1-2)

### Goal
Make damage numbers clear and exciting (color, size, crits).

### Files to edit
- `scripts/battle.js` — calculate damage and emit damage events
- `scripts/ui.js` — render floating damage text

### Step-by-step
1. In `battle.js`, when computing damage, return an object: `{value, isCritical}`. Implement a crit check: `isCritical = Math.random() < 0.10` and multiply damage by 1.5 when critical.

2. Emit a UI event or call a function like `ui.showDamage(x, {value, isCritical})`.

3. In `ui.js`, write `showDamage(x, opts)` to create a DOM element positioned over the target:

```javascript
const el = document.createElement('div');
el.className = 'damage-number';
el.textContent = opts.value;
if (opts.isCritical) el.classList.add('crit');
else if (opts.value > 100) el.classList.add('big');
else if (opts.value > 20) el.classList.add('medium');
else el.classList.add('small');
container.appendChild(el);
setTimeout(() => el.remove(), 1000);
```

4. Add CSS classes in `styles/main.css`:

```css
.damage-number.small { color: #fff; font-size: 12px; }
.damage-number.medium { color: #ffea00; font-size: 16px; }
.damage-number.big { color: #ff8a00; font-size: 20px; }
.damage-number.crit { color: #ff4d4d; font-size: 26px; font-weight: 700; }
```

### Quick test
- Start a battle and watch damage numbers. Use `console.log` in `battle.js` to print damage objects.
- Temporarily raise crit chance to 0.5 to see crits more often while testing.

---

## STEP 3: Show Your Income (Week 2)

### Goal
Display gold/sec and floating income numbers when you earn gold.

### Files to edit
- `index.html` — add income display area
- `scripts/ui.js` — update top bar + floating numbers
- `styles/main.css` — style the display and animation

### Step-by-step
1. Add an element in `index.html` near the top bar:

```html
<div id="income-display">+0 gold/sec</div>
```

2. In `game.js`, compute income rate frequently (e.g., each second) and update `document.getElementById('income-display').textContent = `+${income} gold/sec`.

3. Reuse the `showFloatingText()` helper (or implement one) that accepts `{text, x, y, className}` and animates the text upward with CSS transitions.

4. When the player gains gold (battle reward, passive income), call `showFloatingText({text: '+50', className: 'gold-float'})` anchored to the top-right area.

5. Add CSS for fade and translate animations and a short duration (800–1200ms).

### Quick test
- Trigger gold gain (win battle) and verify the top bar updates and a floating `+50` appears and fades.

---

## STEP 4: Save Your Progress Safely (Week 2-3)

### Goal
Add versioned export/import and reset with confirmation.

### Files to edit
- `scripts/storage.js` — serialization & version handling
- `index.html` — add Export / Import / Reset buttons
- `scripts/game.js` — hook import/export into game state

### Step-by-step
1. Add buttons in `index.html`:

```html
<button id="export-save">Export Save</button>
<button id="import-save">Import Save</button>
<button id="reset-save">Reset Game</button>
<textarea id="save-data" style="display:none"></textarea>
```

2. In `storage.js`, create `exportSave()` that returns `JSON.stringify({version: '1.0', data: game.getSaveData()})` and `importSave(json)` that parses, checks `version`, and applies `data` (or migrates if versions differ).

3. Wire buttons in `game.js`:
- `#export-save` copies the string to clipboard via `navigator.clipboard.writeText(exportSave())` and shows a toast.
- `#import-save` prompts/pastes from a visible textarea or `navigator.clipboard.readText()` then calls `importSave()`.
- `#reset-save` shows `confirm('Are you sure? This will erase progress.')` and if confirmed calls `game.reset()` and `storage.save()`.

4. Add a simple migration placeholder: if imported `version` !== current, call `migrate(oldVersion, data)` that returns data in current shape.

### Quick test
- Play, export the save, then reset, then import the string. Your progress should restore.

---

## STEP 5: Track Your Stats (Week 3)

### Goal
Collect and display play statistics in a modal.

### Files to edit
- `scripts/game.js` — increment stat counters
- `index.html` — add a Stats button and modal markup
- `styles/main.css` — style the modal

### Step-by-step
1. In `game.js`, add a `game.stats` object with counters: `totalDamage`, `battlesWon`, `battlesLost`, `goldEarned`, `playSeconds`.

2. Increment stats in appropriate places (e.g., on damage event add to `totalDamage`, on battle end increment `battlesWon`/`battlesLost`). Use a timer to increment `playSeconds` every second.

3. Add a `Stats` button and modal in `index.html`:

```html
<button id="open-stats">Stats</button>
<div id="stats-modal" class="modal">...</div>
```

4. When `open-stats` is clicked, populate the modal with values from `game.stats` and show it.

### Quick test
- Play a few battles, open Stats and verify the numbers match expectations.

---

## STEP 6: Add Character Pictures (Week 4-5)

### Goal
Draw sprites or emojis instead of colored rectangles.

### Files to edit
- `scripts/ui.js`, `scripts/hero.js`, `scripts/enemy.js`

### Step-by-step
1. Choose assets (sprites from OpenGameArt or simple emoji fallback). Add them to `assets/img/`.

2. Load images at startup: `const img = new Image(); img.src = 'assets/img/hero.png'; game.images.hero = img;`.

3. In the canvas draw routine, replace `ctx.fillRect()` for characters with `ctx.drawImage(game.images.hero, x, y, w, h)`.

4. Provide a fallback: if image not loaded, draw the colored rectangle so nothing breaks.

### Quick test
- Reload the page, ensure sprites appear. If sprite missing, verify console for 404 and fallback rectangle shows.

---

## STEP 7: Add Simple Animations (Week 5-6)

### Goal
Add small movement and hit flash effects for clarity.

### Files to edit
- `scripts/ui.js`, `scripts/battle.js`

### Step-by-step
1. Implement a short attack animation: when a hero attacks, set a temporary state `hero.anim = {type: 'attack', t: 0}`.

2. In your draw loop, if `hero.anim.type === 'attack'` translate the sprite by `Math.sin(t*PI)*20` pixels for 0.2s and increment `t` with delta time.

3. For hit flash, render a white overlay rectangle over the sprite for 0.1s when `hero.anim.type === 'hit'`.

4. Ensure animations are frame-rate independent by using the time delta passed to the game loop.

### Quick test
- Watch a battle and verify the attack slide + hit flash. Tune distances/durations as needed.

---

## STEP 8: Make It Work on Phone (Week 6-7)

### Goal
Responsive layout and touch-friendly controls.

### Files to edit
- `styles/main.css`, `index.html`, `scripts/ui.js`

### Step-by-step
1. Add responsive CSS rules (`@media (max-width: 600px)`) to reduce canvas size and enlarge UI buttons (min-height: 44px).

2. Ensure touch events are handled in addition to clicks: add `touchstart` listeners mirroring `click` handlers.

3. Test locally: run Live Server, find your computer IP with `ipconfig` and open `http://YOUR_IP:5500` on phone browser.

### Quick test
- Verify layout, tappable areas, and game responsiveness on a phone. Adjust font sizes and spacing for readability.

---

## STEP 9: Add Sound Effects (Week 7)

### Goal
Add attack and victory sounds with a mute toggle.

### Files to edit
- `scripts/game.js`, `scripts/battle.js`, add `assets/audio/`

### Step-by-step
1. Add audio files to `assets/audio/attack.mp3` and `assets/audio/victory.mp3`.

2. Create a small audio manager: `game.audio.play('attack')` that checks `game.muted` before playing.

3. Call `game.audio.play('attack')` when an attack occurs and `game.audio.play('victory')` on win.

4. Add a mute button that toggles `game.muted = true/false` and saves the preference to localStorage.

### Quick test
- Unmute and trigger sounds; use the mute button to silence them across reloads.

---

## STEP 10: Build Equipment System (Week 8-10)

### Goal
Allow heroes to equip items that modify stats.

### Files to add/edit
- Add `scripts/equipment.js`
- Edit `scripts/hero.js`, `index.html`, `scripts/storage.js`

### Step-by-step
1. Create `scripts/equipment.js` with an `Equipment` class and a factory to generate items.

2. Add `hero.equipment = [{}, {}]` slots. Update hero stat getters to include equipment bonuses (attack, defense).

3. Add a shop UI to buy random or defined equipment. Buying reduces gold and adds item to inventory.

4. Add equip/unequip buttons in the hero panel; when equipped, update displayed stats and persist to save.

### Quick test
- Buy an item, equip it, and verify the hero's damage/defense shown in the UI changes accordingly.

---

## STEP 11: Add Hero Skills (Week 10-12)

### Goal
Give each hero a special ability with cooldowns.

### Files to add/edit
- Add `scripts/skills.js`
- Edit `scripts/hero.js`, `scripts/battle.js`, `index.html`

### Step-by-step
1. Implement a `Skill` class with `name`, `cooldown`, `lastUsed`, and `apply(target)`.

2. Add skill definitions for Tank, Damage, and Support heroes. Trigger skills either automatically or via a UI button.

3. On skill activation set `skill.lastUsed = Date.now()` and prevent reuse until cooldown expires.

4. Ensure skills' effects are applied in `battle.js` (stun, burst damage, heal) and reflected in UI.

### Quick test
- Force-simulate a skill use and confirm effect and cooldown display.

---

## STEP 12: Polish and Deploy (Week 13-14)

### Goal
Add a tutorial, balance gameplay, and deploy to GitHub Pages.

### Step-by-step
1. Tutorial: build a short guided overlay for new users (store `seenTutorial` in localStorage). Highlight controls and explain goals in 3 steps.

2. Balance: Play through the first 20 stages, log gold/reward ratios and adjust numbers in data files until progression feels smooth.

3. Deploy: Create a GitHub repo (or use existing), push changes, and enable GitHub Pages. Use `gh-pages` branch or `main` → Pages settings.

### Quick test
- Share the deployed URL with a friend; get feedback and iterate on polish.

---

## 🎓 LEARNING RESOURCES

### While You Code

**JavaScript Basics**
- Variables: `let gold = 100`
- Functions: `function attack() { ... }`
- Classes: `class Hero { ... }`

**Common Patterns You'll Use**
```javascript
// Change a number
this.gold += 50

// Loop through heroes
for (let hero of this.heroes) {
    hero.attack()
}

// Wait 1 second then do something
setTimeout(() => {
    console.log('1 second passed!')
}, 1000)
```

**CSS for Styling**
```css
.button {
    background-color: blue;
    color: white;
    padding: 10px;
    border-radius: 5px;
}
```

### When Something Breaks

1. Check browser console (F12)
   - Red text = error
   - Click the error to see which line
2. Add console.log to see values
3. Use debugger to step through code

---

## 📋 CHECKLIST FORMAT

After each step, check it off:

- [ ] Step 1: Battle speed controls
- [ ] Step 2: Colorful damage
- [ ] Step 3: Income display
- [ ] Step 4: Save system
- [ ] Step 5: Stats screen
- [ ] Step 6: Character images
- [ ] Step 7: Animations
- [ ] Step 8: Mobile support
- [ ] Step 9: Sound effects
- [ ] Step 10: Equipment
- [ ] Step 11: Skills
- [ ] Step 12: Deploy online

---

## 💡 TIPS FOR SUCCESS

### Stay Motivated
- Do 1 step per week (or slower - that's OK!)
- Each step makes your game better
- Test often to see your progress
- Show friends after each step

### Don't Get Overwhelmed
- Only think about current step
- Don't worry about future steps yet
- If stuck, take a break
- Ask Claude for help anytime

### Good Debugging Habits
- Save before trying new things
- Test in browser console first
- Read error messages carefully
- Google error messages

### Make It Your Own
- Change colors to your favorites
- Add your own ideas
- Skip steps you don't want
- Add extra features you think of

---

## 🚀 YOU'VE GOT THIS!

By the end, you'll have:
- ✅ A working 2D idle RPG
- ✅ Knowledge of JavaScript, HTML, CSS
- ✅ A game online for friends to play
- ✅ Skills to make more games!

Start with Step 1. Take your time. Have fun! 🎮
