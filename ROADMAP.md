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

### What You'll Build
Speed controls so battles aren't boring

### Files You'll Edit
- `scripts/battle.js`
- `index.html`
- `scripts/game.js`

### What To Do
1. Add speed buttons (1x, 2x, 4x) to the HTML
2. Change `attackInterval` in battle.js when buttons are clicked
3. Test: Click 4x, battles should go faster!

### How To Test
- Start a battle
- Click each speed button
- Watch attacks happen faster/slower

### Success = Battles have working speed controls

---

## STEP 2: Better Visual Feedback (Week 1-2)

### What You'll Build
Make damage numbers colorful and exciting

### Files You'll Edit
- `scripts/battle.js`
- `scripts/ui.js`

### What To Do
1. Change damage number colors based on damage amount
   - Small damage = white
   - Medium damage = yellow
   - Big damage = orange
2. Add critical hits (10% chance)
   - Critical damage = red color
   - Critical damage = 1.5x normal damage

### How To Test
- Watch damage numbers during battle
- They should have different colors
- Some should be bigger (critical hits)

### Success = Colorful damage numbers that look cool

---

## STEP 3: Show Your Income (Week 2)

### What You'll Build
See how much gold/gems you earn per second

### Files You'll Edit
- `scripts/ui.js`
- `index.html`
- `styles/main.css`

### What To Do
1. Add text showing "+10 gold/sec" in the top bar
2. Add floating "+50" numbers when you get gold
3. Make the numbers fade out smoothly

### How To Test
- Look at top bar - should show income rate
- Win a battle - should see "+50" float up
- Numbers should disappear after 1 second

### Success = You can see income happening

---

## STEP 4: Save Your Progress Safely (Week 2-3)

### What You'll Build
Better save system that won't break

### Files You'll Edit
- `scripts/storage.js`
- `scripts/game.js`
- `index.html`

### What To Do
1. Add save version number (v1.0, v1.1, etc.)
2. Add "Export Save" button (copy save to clipboard)
3. Add "Import Save" button (paste save from clipboard)
4. Add "Reset Game" button with confirmation

### How To Test
- Play for a bit
- Click "Export Save" - should copy text
- Reset game
- Click "Import Save" - paste the text
- Your progress should come back!

### Success = You can backup and restore your game

---

## STEP 5: Track Your Stats (Week 3)

### What You'll Build
A stats screen showing your achievements

### Files You'll Edit
- `scripts/game.js` (add stats tracking)
- `index.html` (stats modal)
- `styles/main.css` (make it look good)

### What To Do
1. Track these numbers:
   - Total damage dealt
   - Battles won/lost
   - Gold earned
   - Time played
2. Add "Stats" button
3. Show all stats in a modal window

### How To Test
- Play for a while
- Click "Stats" button
- Should see your numbers!

### Success = Working stats screen

---

## STEP 6: Add Character Pictures (Week 4-5)

### What You'll Build
Replace colored rectangles with actual characters

### Files You'll Edit
- `scripts/ui.js`
- `scripts/hero.js`
- `scripts/enemy.js`

### What To Do
1. Find free character sprites OR use emojis
   - Free sprites: opengameart.org
   - Emoji option: Use 🛡️ for tank, ⚔️ for damage, ❤️ for support
2. Load images in the code
3. Draw images instead of rectangles

### How To Test
- Start game
- Should see pictures instead of colored boxes!

### Success = Characters have images/emojis

---

## STEP 7: Add Simple Animations (Week 5-6)

### What You'll Build
Characters move when attacking

### Files You'll Edit
- `scripts/ui.js`
- `scripts/battle.js`

### What To Do
1. When hero attacks:
   - Slide character right 20 pixels
   - Wait 0.2 seconds
   - Slide back to original position
2. When taking damage:
   - Flash character white for 0.1 seconds

### How To Test
- Watch battles
- Characters should move when attacking
- Characters should flash when hit

### Success = Battle has movement!

---

## STEP 8: Make It Work on Phone (Week 6-7)

### What You'll Build
Game that works on mobile devices

### Files You'll Edit
- `styles/main.css`
- `index.html`
- `scripts/ui.js`

### What To Do
1. Make canvas smaller on phone screens
2. Make buttons bigger (easier to tap)
3. Test on your phone using Live Server
   - Find your computer's IP (ipconfig in terminal)
   - Open http://YOUR_IP:5500 on phone

### How To Test
- Open game on phone
- Should fit screen
- Buttons should be easy to tap
- Everything should be readable

### Success = Game works on phone

---

## STEP 9: Add Sound Effects (Week 7)

### What You'll Build
Sound when attacking and winning

### Files You'll Edit
- `scripts/game.js`
- `scripts/battle.js`

### What To Do
1. Download free sounds from freesound.org
   - Attack sound (sword slash)
   - Victory sound (happy chime)
2. Create `assets/audio/` folder
3. Play sounds using HTML5 Audio
4. Add mute button

### How To Test
- Unmute game
- Attack - should hear sound
- Win battle - should hear victory sound
- Mute button - should silence everything

### Success = Working sound effects

---

## STEP 10: Build Equipment System (Week 8-10)

### What You'll Build
Weapons and armor for heroes

### New File You'll Create
- `scripts/equipment.js`

### Files You'll Edit
- `scripts/hero.js`
- `index.html`
- `scripts/storage.js`

### What To Do
1. Create Equipment class
   - Properties: name, type (weapon/armor), attack bonus, defense bonus
2. Give each hero 2 equipment slots
3. Add equipment shop
4. Equipment costs gold to buy

### How To Test
- Open shop
- Buy weapon
- Equip on hero
- Hero stats should increase!

### Success = Heroes can equip items

---

## STEP 11: Add Hero Skills (Week 10-12)

### What You'll Build
Special abilities for each hero

### New File You'll Create
- `scripts/skills.js`

### Files You'll Edit
- `scripts/hero.js`
- `scripts/battle.js`
- `index.html`

### What To Do
1. Create Skill class
   - Properties: name, cooldown, effect
2. Give each hero a special skill:
   - Tank: "Shield Bash" - Stun enemy for 2 seconds
   - Damage: "Power Strike" - Deal 3x damage
   - Support: "Heal All" - Restore 30% HP to all heroes
3. Skills activate automatically in battle

### How To Test
- Start battle
- Watch for skill activations
- Tank should stun enemies
- Damage hero should do big hits sometimes
- Support should heal team

### Success = Heroes use special abilities

---

## STEP 12: Polish and Deploy (Week 13-14)

### What You'll Build
Finished game on the internet!

### What To Do

#### Part A: Tutorial
- Add first-time tutorial
- Show arrows pointing to buttons
- Explain how to play

#### Part B: Balance
- Play to stage 20
- Make sure difficulty feels good
- Adjust gold rewards if needed
- Adjust enemy health if needed

#### Part C: Deploy to GitHub Pages
1. Go to GitHub.com
2. Create new repository
3. Upload all your files
4. Settings → Pages → Enable
5. Your game is live at username.github.io/game-name!

### How To Test
- Ask friends to play
- Watch them play (don't help!)
- See what confuses them
- Fix those things

### Success = Game is online and playable!

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
