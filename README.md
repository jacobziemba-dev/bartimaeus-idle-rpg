# Bartimaeus Idle RPG

A simplified AFK Arena-style idle RPG game with auto-battling heroes, idle resource generation, and hero progression. Built with vanilla JavaScript and HTML5 Canvas.

## 🎮 How to Play

1. **Auto-Battle**: Your 3 heroes automatically fight enemies
2. **Earn Resources**: Gain gold and gems from battles and idle generation
3. **Upgrade Heroes**: Spend gold to make your heroes stronger
4. **Progress Stages**: Defeat enemies to unlock harder stages with better rewards
5. **AFK Rewards**: Close the game and return later to collect accumulated resources!

## 🚀 How to Run Locally

1. **Option 1: Double-click `index.html`**
   - Simply open `index.html` in your web browser
   - No server needed!

2. **Option 2: Use Live Server (recommended for development)**
   - Install VS Code extension "Live Server"
   - Right-click `index.html` → "Open with Live Server"
   - Auto-refreshes when you make changes

## 🌐 Deploy to GitHub Pages

The game uses Vite for building and can be deployed to GitHub Pages. You'll need to build the project and deploy the `dist` folder.

### Quick Setup (One-Time)

1. Build the project locally:
   ```bash
   npm ci
   npm run build
   ```
2. Go to your repository on GitHub
3. Click **Settings** → **Pages**
4. Under "Source", select **Deploy from a branch**
5. Under "Branch", select **main** and **/dist** (or deploy dist folder separately)
6. Click **Save**

Note: Since GitHub Pages needs the built files from the `dist` folder, you'll need to either:
- Commit the `dist` folder to your repository after building, OR
- Use a separate gh-pages branch with only the dist contents

That's it! Your game will be live at: `https://YOUR_USERNAME.github.io/bartimaeus-idle-rpg`

### Setup Steps

#### Step 1: Create GitHub Repository

```bash
# In this folder, run:
git init
git add .
git commit -m "Initial commit: Bartimaeus Idle RPG"
```

#### Step 2: Push to GitHub

```bash
# Create a new repository on GitHub (name it "bartimaeus-idle-rpg")
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/bartimaeus-idle-rpg.git
git branch -M main
git push -u origin main
```

#### Step 3: Build and Configure GitHub Pages

1. Build the project:
   ```bash
   npm ci
   npm run build
   ```
2. Commit the dist folder (if not already in .gitignore):
   ```bash
   git add dist
   git commit -m "Add build output"
   git push
   ```
3. Go to your repository on GitHub
4. Click **Settings** → **Pages**
5. Under "Source", select **Deploy from a branch**
6. Under "Branch", select **main** and **/dist**
7. Click **Save**
8. Wait 1-2 minutes for the deployment to complete
9. Your game will be live at: `https://YOUR_USERNAME.github.io/bartimaeus-idle-rpg`

## 📁 Project Structure

```
bartimaeus-idle-rpg/
├── index.html              # Main HTML file
├── src/
│   ├── styles/
│   │   ├── main.css       # Layout and UI styles
│   │   └── battle.css     # Battle-specific styles
│   └── scripts/
│       ├── assetManager.js # Asset loader & cache
│       ├── game.js        # Main game controller & game loop
│       ├── hero.js        # Hero class (your characters)
│       ├── enemy.js       # Enemy class and generation
│       ├── battle.js      # Auto-battle logic
│       ├── resources.js   # Gold/gem management & idle generation
│       ├── ui.js          # Canvas rendering & UI updates
│       └── storage.js     # Save/load to LocalStorage
├── assets/                 # Sprites and images
├── docs/                   # Project docs
├── favicon.ico.svg         # Favicon asset
└── README.md               # This file
```

## 🎯 Game Features

### ✅ Currently Implemented
- **3 Unique Heroes**: Tank, Damage Dealer, Support
- **Auto-Battle System**: Heroes fight automatically every second
- **Idle Progression**: Earn gold/gems while playing
- **Hero Upgrades**: Level up heroes to increase stats
- **Stage Progression**: 10+ stages with increasing difficulty
- **Save System**: Auto-saves every 30 seconds to LocalStorage
- **AFK Rewards**: Earn resources while away (capped at 2 hours)

### 🔮 Future Expansion Ideas
- More heroes (5+ instead of 3)
- Hero abilities and special skills
- Equipment system (weapons, armor)
- Summon/gacha system
- Prestige/rebirth mechanics
- User accounts with cloud saves
- Leaderboards

## 🛠️ How It Works

### Game Loop (60 FPS)
The game runs at 60 frames per second using `requestAnimationFrame()`:
1. Update battle state (heroes attack enemies)
2. Update resources (idle generation)
3. Render everything to canvas
4. Auto-save every 30 seconds

### Battle System
- Every 1 second, each living hero attacks a random enemy
- Each living enemy attacks a random hero
- Damage formula: `attack - (defense * 0.5)` with ±10% variance
- Battle ends when all heroes or all enemies are defeated

### Idle/AFK System
- **While playing**: Earn `stageLevel * 10` gold/second
- **While away**: Calculate earnings based on time away (max 2 hours)
- Earnings are automatically added when you return

### Save System
- Uses browser's LocalStorage (data persists even after closing browser)
- Auto-saves every 30 seconds
- Saves: heroes, levels, resources, current stage

## 🎨 Customization Ideas

### Easy Tweaks
1. **Change hero names**: Edit `src/scripts/hero.js` → `createStartingHeroes()`
2. **Adjust battle speed**: Change `attackInterval` in `src/scripts/battle.js`
3. **Modify starting resources**: Edit `ResourceManager` constructor in `src/scripts/resources.js`
4. **Change colors**: Edit CSS in `src/styles/main.css`

### Medium Difficulty
1. **Add more heroes**: Create new heroes in `createStartingHeroes()`
2. **New enemy types**: Add to `createEnemiesForStage()` in `src/scripts/enemy.js`
3. **Change upgrade formula**: Modify `getUpgradeCost()` in `src/scripts/hero.js`
4. **Add sound effects**: Use Web Audio API or HTML5 `<audio>` tags

## 🐛 Debugging

### Browser Console
Press `F12` to open browser console. Useful commands:

```javascript
// Inspect game state
game

// Add resources
game.resourceManager.addGold(10000)
game.resourceManager.addGems(500)

// Jump to stage 10
game.currentStage = 10
game.nextStage()

// Delete save (restart)
game.storageManager.deleteSave()
location.reload()

// View hero stats
game.heroes.forEach(h => console.log(h.name, h.level, h.attack))
```

## 📚 Learning Resources

### Key Concepts You'll Learn
- **JavaScript Classes**: Object-oriented programming with `class`
- **Canvas API**: Drawing graphics with HTML5 canvas
- **Game Loops**: Using `requestAnimationFrame()` for smooth animation
- **LocalStorage**: Saving data in the browser
- **Event Listeners**: Handling button clicks and user input
- **Git & GitHub**: Version control and deployment

### Recommended Next Steps
1. **Experiment**: Change numbers, colors, formulas
2. **Add features**: Start with small additions (e.g., more stages)
3. **Learn Canvas**: [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
4. **Study the code**: Read comments in each `.js` file
5. **Break things**: Best way to learn is fixing what you broke!

## 🤝 Contributing

This is your learning project! Ideas for improvements:

1. **Visual Polish**: Add hero/enemy sprites, better animations
2. **Game Balance**: Adjust difficulty curve
3. **New Features**: Abilities, equipment, achievements
4. **Mobile Support**: Add touch controls, responsive design
5. **Backend**: Add user accounts with Firebase/Supabase

## 📝 License

This project is free to use, modify, and learn from. Do whatever you want with it!

## 🎓 Credits

Created as a learning project for understanding:
- Game development fundamentals
- JavaScript and Canvas API
- Git, GitHub, and deployment workflows

Based on the AFK Arena game genre.

---

## 🚨 Troubleshooting

**Game won't start?**
- Check browser console (F12) for errors
- Make sure all files are in correct folders
- Try opening in a different browser

**Save not working?**
- LocalStorage might be disabled (check browser settings)
- Try in Incognito mode to test

**Canvas not showing?**
- Check if `index.html` correctly links to all `.js` files
- Verify canvas element exists with ID `battle-canvas`

**Heroes not attacking?**
- Check console for errors
- Verify battle is not paused
- Make sure all script files loaded correctly

---

**Have fun building and learning! 🎮✨**
