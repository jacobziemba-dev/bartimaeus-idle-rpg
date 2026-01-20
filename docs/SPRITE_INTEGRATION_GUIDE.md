# How to Download and Integrate Online Sprites

This guide walks you through downloading sprites from online sources and integrating them into your Bartimaeus Idle RPG game.

## 🎯 Method 1: Quick Start with Kenney Assets (Recommended for Beginners)

Kenney.nl provides completely free (CC0) game assets with consistent quality.

### Step 1: Download Assets

1. Visit **https://kenney.nl/assets**
2. Download these packs:
   - **"Tiny Dungeon"** - for enemies and characters
   - **"UI Pack"** - for interface elements
   - **"Background Elements"** - for environments

### Step 2: Extract and Organize

```bash
# After downloading, extract the ZIP files
# Example structure:
unzip kenney-tiny-dungeon.zip
unzip kenney-ui-pack.zip

# Copy sprites to your game folders
cp kenney-tiny-dungeon/Characters/Knight.png assets/heroes/tank.png
cp kenney-tiny-dungeon/Characters/Wizard.png assets/heroes/mage.png
cp kenney-tiny-dungeon/Characters/Archer.png assets/heroes/archer.png

cp kenney-tiny-dungeon/Enemies/Goblin.png assets/enemies/goblin.png
cp kenney-tiny-dungeon/Enemies/Skeleton.png assets/enemies/skeleton.png
# etc...
```

### Step 3: Update assetManager.js

Edit `/src/scripts/assetManager.js` to use PNG instead of SVG:

```javascript
heroes: {
  bartimaeus: 'assets/heroes/tank.png',
  mage: 'assets/heroes/mage.png',
  archer: 'assets/heroes/archer.png'
},
enemies: {
  goblin: 'assets/enemies/goblin.png',
  orc: 'assets/enemies/orc.png',
  skeleton: 'assets/enemies/skeleton.png',
  demon: 'assets/enemies/demon.png',
  dragon: 'assets/enemies/dragon.png'
},
```

### Step 4: Add Attribution

Create `CREDITS.md` in your project root:

```markdown
# Asset Credits

## Game Assets
- **Source**: Kenney.nl
- **License**: CC0 (Public Domain)
- **URL**: https://kenney.nl
- **Packs Used**:
  - Tiny Dungeon
  - UI Pack
  - Background Elements
```

---

## 🎨 Method 2: OpenGameArt for Custom Selection

For more variety and specific art styles.

### Step 1: Search for Assets

1. Go to **https://opengameart.org/**
2. Use the search bar:
   - Search: `"fantasy character sprite side view"`
   - Search: `"RPG enemy transparent"`
   - Search: `"dungeon background"`

### Step 2: Filter by License

- Click **"License"** filter on left sidebar
- Select **"CC0 (Public Domain)"** for easiest use
- Or **"CC-BY 3.0"** (requires attribution)

### Step 3: Download Individual Sprites

For each sprite you want:
1. Click on the preview
2. Check the license and preview
3. Click **"Download"** button
4. Save to appropriate folder:
   ```
   assets/heroes/
   assets/enemies/
   assets/backgrounds/
   ```

### Step 4: Document Attribution

If using CC-BY assets, add to `CREDITS.md`:

```markdown
## Hero Sprites
- **Artist**: [Artist Name from OpenGameArt]
- **License**: CC-BY 3.0
- **URL**: [Direct link to asset page]

## Enemy Sprites
- **Artist**: [Artist Name]
- **License**: CC-BY 3.0
- **URL**: [Direct link]
```

---

## 🎁 Method 3: Complete Asset Pack from Itch.io

Best for getting everything in one consistent style.

### Step 1: Find a Complete Pack

1. Go to **https://itch.io/game-assets/free**
2. Filter by:
   - **Price**: Free
   - **Tags**: "sprites", "fantasy", "rpg"
3. Look for packs labeled:
   - "Complete RPG Pack"
   - "Fantasy Asset Bundle"
   - "Dungeon Crawler Assets"

### Step 2: Example Pack Search

Search for: **"fantasy rpg asset pack free"**

Good starter packs often include:
- Multiple hero characters
- Various enemy types
- UI elements
- Backgrounds/tilesets
- Icons

### Step 3: Download and Extract

1. Click "Download Now" on the asset page
2. Extract the ZIP file
3. Review the folder structure
4. Most packs organize like:
   ```
   AssetPack/
   ├── Characters/
   ├── Enemies/
   ├── Backgrounds/
   ├── UI/
   └── README.txt (check license!)
   ```

### Step 4: Batch Copy to Your Project

```bash
# Navigate to downloaded pack
cd ~/Downloads/FantasyRPGPack/

# Copy all heroes
cp Characters/Hero*.png /path/to/your/game/assets/heroes/

# Copy all enemies
cp Enemies/*.png /path/to/your/game/assets/enemies/

# Copy backgrounds
cp Backgrounds/*.png /path/to/your/game/assets/backgrounds/
```

### Step 5: Update Attribution

Check the pack's `README.txt` or `LICENSE.txt` for requirements:

```markdown
## Complete Asset Pack
- **Pack Name**: Fantasy RPG Asset Pack
- **Artist**: [Creator's itch.io username]
- **License**: [As stated in pack README]
- **URL**: https://itch.io/[link-to-asset]
```

---

## 🔧 Common Integration Issues & Solutions

### Issue 1: Sprites Are Different Sizes

**Problem**: Downloaded sprites are 512x512 but game expects 80x100

**Solution**: Resize using browser-based Photopea
1. Go to https://www.photopea.com/
2. Open your sprite (File → Open)
3. Image → Image Size
4. Set to desired dimensions (e.g., 80x100)
5. Maintain aspect ratio if possible
6. File → Export As → PNG
7. Save to assets folder

### Issue 2: White Background Instead of Transparent

**Problem**: Sprite has white background, not transparent

**Solution**: Remove background
1. Open in Photopea
2. Click magic wand tool
3. Click white background
4. Press Delete
5. File → Export As → PNG (ensure transparency checked)

### Issue 3: Sprite Sheets Instead of Individual Sprites

**Problem**: Downloaded a sprite sheet, need individual frames

**Solution**: Extract frames
1. Use online tool: https://codeshack.io/images-sprite-sheet-generator/
2. Upload sprite sheet
3. Set frame size (e.g., 64x64)
4. Extract individual frames
5. Save each frame separately

### Issue 4: Wrong File Format

**Problem**: Downloaded PSD, AI, or other format

**Solution**: Convert format
1. Go to https://cloudconvert.com/
2. Upload your file
3. Convert to PNG
4. Download converted file

---

## 📐 Sizing Guidelines for Your Game

Current SVG sizes in the game:
- **Heroes**: 80x100 pixels
- **Enemies**: 60x80 pixels
- **Backgrounds**: 800x400 pixels
- **UI Icons**: 32x32 to 64x64 pixels

When downloading:
1. **Larger is better** - you can always scale down
2. **Keep aspect ratio** - don't distort sprites
3. **Transparent backgrounds** - essential for characters/enemies
4. **Power of 2** - optimal: 64x64, 128x128, 256x256

---

## ✅ Testing Your New Sprites

After integrating new sprites:

1. **Open in Browser**
   ```bash
   # Navigate to project
   cd bartimaeus-idle-rpg
   
   # Open in browser
   open index.html  # Mac
   start index.html # Windows
   ```

2. **Check Browser Console** (F12)
   - Look for loading errors
   - Verify all assets loaded: `✓ Loaded: assets/heroes/tank.png`

3. **Visual Inspection**
   - Do sprites appear correctly?
   - Are they the right size?
   - Do backgrounds fill the canvas?
   - Are UI icons visible?

4. **Fix Common Issues**
   - Sprite too big/small? → Adjust in assetManager or resize file
   - Not appearing? → Check file path matches manifest
   - Wrong colors? → May need to edit sprite

---

## 🎨 Advanced: Customizing Downloaded Sprites

### Recoloring in Photopea

1. Open sprite in https://www.photopea.com/
2. Select → Color Range
3. Click the color you want to change
4. Adjust Fuzziness slider
5. Click OK
6. Image → Adjustments → Hue/Saturation
7. Adjust colors
8. Export as PNG

### Adding Effects

For glowing effects or outlines:
1. In Photopea, open sprite
2. Layer → Layer Style → Stroke (for outline)
3. Layer → Layer Style → Outer Glow (for aura)
4. Adjust colors and size
5. Export as PNG

### Combining Multiple Sprites

Create custom heroes by combining parts:
1. Open base character in Photopea
2. File → Open & Place → Add weapon/armor
3. Position and resize
4. Merge layers
5. Export as new sprite

---

## 📚 Example: Complete Workflow

Let's integrate a full set of sprites step by step:

```bash
# Step 1: Download Kenney's Tiny Dungeon pack
# Visit: https://kenney.nl/assets/tiny-dungeon
# Click "Download" and extract

# Step 2: Navigate to extracted folder
cd ~/Downloads/kenney_tiny-dungeon/

# Step 3: Copy files to your game
# (Replace paths with your actual game location)
cp Characters/Knight_01.png ~/bartimaeus-idle-rpg/assets/heroes/tank.png
cp Characters/Wizard_01.png ~/bartimaeus-idle-rpg/assets/heroes/mage.png
cp Characters/Ranger_01.png ~/bartimaeus-idle-rpg/assets/heroes/archer.png

cp Enemies/Goblin_01.png ~/bartimaeus-idle-rpg/assets/enemies/goblin.png
cp Enemies/Orc_01.png ~/bartimaeus-idle-rpg/assets/enemies/orc.png
cp Enemies/Skeleton_01.png ~/bartimaeus-idle-rpg/assets/enemies/skeleton.png

# Step 4: Update game code
# Edit src/scripts/assetManager.js
# Change .svg to .png for all new sprites

# Step 5: Add attribution
echo "# Credits\n\nSprites from Kenney.nl (CC0)" > ~/bartimaeus-idle-rpg/CREDITS.md

# Step 6: Test
cd ~/bartimaeus-idle-rpg/
open index.html
```

---

## 🚀 Next Steps

After successfully integrating sprites:

1. **Adjust Rendering** - Sprites may need position tweaks in `ui.js`
2. **Add Animations** - If sprites have multiple frames, create animation logic
3. **Optimize Performance** - Compress large PNGs using TinyPNG.com
4. **Add More Variety** - Download additional sprite variations
5. **Share Your Game** - Deploy to GitHub Pages with new assets!

---

## 💡 Pro Tips

1. **Bookmark favorite sites** - You'll return often
2. **Create asset wishlist** - Note what you need before searching
3. **Check recent uploads** - New free assets posted weekly
4. **Join communities** - Reddit r/gameassets for recommendations
5. **Support artists** - Leave comments, share their work
6. **Backup originals** - Keep downloaded files before editing
7. **Version control** - Commit assets to git for history

---

**Happy sprite hunting! 🎮✨**

Need help? Check the main [SPRITE_RESOURCES.md](SPRITE_RESOURCES.md) for more sources!
