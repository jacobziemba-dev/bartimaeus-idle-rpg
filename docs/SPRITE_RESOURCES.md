# Online Sprite Resources for Bartimaeus Idle RPG

This guide provides curated sources for finding game sprites online that can be used in your idle RPG game.

## 🎨 Best Free Sprite Resources

### 1. **OpenGameArt.org**
- **URL**: https://opengameart.org/
- **License**: Various (CC0, CC-BY, CC-BY-SA, GPL)
- **Best For**: Fantasy RPG characters, enemies, backgrounds
- **Search Tips**:
  - Search: "fantasy character sprite"
  - Search: "RPG enemy sprite"
  - Search: "dungeon background"
  - Filter by license: CC0 (Public Domain) for easiest use
- **Formats**: PNG, SVG, sprite sheets
- **Quality**: High, community-curated

### 2. **Itch.io Free Game Assets**
- **URL**: https://itch.io/game-assets/free
- **License**: Varies by asset pack (check individual licenses)
- **Best For**: Complete sprite packs, UI elements, pixel art
- **Search Tips**:
  - Filter: "Free" + "Sprites"
  - Search: "fantasy sprite pack"
  - Search: "idle game UI"
  - Look for "asset packs" with multiple related sprites
- **Formats**: PNG sprite sheets, individual sprites
- **Quality**: Excellent, often professionally made

### 3. **Kenney.nl**
- **URL**: https://kenney.nl/assets
- **License**: CC0 (Public Domain) - Use anywhere!
- **Best For**: UI elements, simple characters, backgrounds
- **Popular Packs**:
  - "RPG Urban Pack"
  - "UI Pack"
  - "Platformer Art"
- **Formats**: PNG, vector files
- **Quality**: Professional, consistent style

### 4. **Craftpix.net Free Section**
- **URL**: https://craftpix.net/freebies/
- **License**: Free for commercial use (check specific terms)
- **Best For**: High-quality 2D game sprites, animations
- **Search Tips**:
  - Browse categories: "Fantasy", "Characters", "Enemies"
  - Filter: "Free Game Assets"
- **Formats**: PNG sprite sheets with animations
- **Quality**: Very high, professional game-ready

### 5. **Game-Icons.net**
- **URL**: https://game-icons.net/
- **License**: CC-BY 3.0
- **Best For**: Skill icons, UI icons, item icons
- **Search Tips**:
  - Search: "sword", "shield", "magic", "potion"
  - Download as SVG for scalability
- **Formats**: SVG, PNG
- **Quality**: Simple, clean icons perfect for UI

### 6. **Freepik Game Assets**
- **URL**: https://www.freepik.com/
- **License**: Free with attribution (Premium = no attribution)
- **Best For**: Backgrounds, UI elements, character illustrations
- **Search Tips**:
  - Search: "game character sprite"
  - Search: "2d game background"
  - Filter: "Free"
- **Formats**: Vector, PNG
- **Quality**: Professional quality

### 7. **Pixabay**
- **URL**: https://pixabay.com/
- **License**: Free for commercial use, no attribution required
- **Best For**: Backgrounds, textures
- **Search Tips**:
  - Search: "fantasy landscape"
  - Search: "dungeon background"
  - Search: "game texture"
- **Formats**: JPG, PNG
- **Quality**: Good for backgrounds

## 🎯 Specific Sprite Recommendations for Your Game

### Heroes (3 characters needed)
**Recommended Sources:**
1. **Itch.io**: Search "fantasy hero sprite sheet"
   - Look for packs with Tank, Mage, Archer
2. **OpenGameArt**: Search "RPG character"
   - Filter: Side view or front-facing
3. **Craftpix**: "Free 2D Fantasy Hero" packs

**What to Look For:**
- Side-view or 3/4 view sprites
- Idle animations (optional but nice)
- Size: 64x64 to 128x128 pixels
- Transparent background (PNG)

### Enemies (5 types: Goblin, Orc, Skeleton, Demon, Dragon)
**Recommended Sources:**
1. **OpenGameArt**: Search "fantasy enemy sprites"
2. **Itch.io**: Search "monster sprite pack"
3. **Craftpix**: Browse "Enemies" category

**What to Look For:**
- Matching art style with heroes
- Increasing visual size/complexity for harder enemies
- Transparent backgrounds
- Similar perspective to heroes

### Backgrounds (4 environments: Forest, Dungeon, Volcano, Castle)
**Recommended Sources:**
1. **OpenGameArt**: Search "game background"
2. **Itch.io**: Search "parallax background" or "seamless background"
3. **Freepik**: Search "game environment"

**What to Look For:**
- Horizontal format (800x400 or scalable)
- Not too busy (gameplay happens in front)
- Matching color palette
- Can be simple solid colors with details

### UI Elements (Icons, Buttons, Health Bars)
**Recommended Sources:**
1. **Kenney.nl**: UI packs (excellent for consistency)
2. **Game-Icons.net**: Skill icons
3. **Itch.io**: Search "UI pack"

**What to Look For:**
- Consistent style across all UI elements
- Skill icons for: Fireball, Cleave, Heal
- Health bar components
- Button states (normal, hover, pressed)

## 📋 Quick Action Plan

### Step 1: Choose an Art Style
Pick ONE of these styles for consistency:
- **Pixel Art**: Retro, easy to find, consistent
- **Flat/Vector**: Modern, scalable, clean
- **Hand-Drawn**: Artistic, unique, harder to match

### Step 2: Find a Complete Pack (Recommended!)
Instead of individual sprites, look for complete packs:
- Search Itch.io: "fantasy RPG asset pack"
- Search OpenGameArt: "RPG pack" or "fantasy bundle"
- This ensures consistent art style!

**Example Packs to Look For:**
- "Tiny RPG Character Asset Pack" (pixel art)
- "Fantasy Hero Character Pack" (vector)
- "Dungeon Crawler Asset Pack" (includes everything)

### Step 3: Download and Organize
```
assets/
├── heroes/
│   ├── tank.png
│   ├── mage.png
│   └── archer.png
├── enemies/
│   ├── goblin.png
│   ├── orc.png
│   ├── skeleton.png
│   ├── demon.png
│   └── dragon.png
├── backgrounds/
│   ├── forest.png
│   ├── dungeon.png
│   ├── volcano.png
│   └── castle.png
└── ui/
    ├── skill-fireball.png
    ├── skill-cleave.png
    └── skill-heal.png
```

### Step 4: Update assetManager.js
Change file extensions from `.svg` to `.png` (or whatever format you download):
```javascript
heroes: {
  bartimaeus: 'assets/heroes/tank.png',
  mage: 'assets/heroes/mage.png',
  archer: 'assets/heroes/archer.png'
},
```

## ⚖️ Licensing Best Practices

### Always Check the License!
Before using any asset, verify:
1. **Commercial use allowed?** (Yes for this learning project)
2. **Attribution required?** (Give credit to artist)
3. **Modification allowed?** (Can you resize/recolor?)

### Safe Licenses:
- **CC0 (Public Domain)**: Use anywhere, no attribution needed
- **CC-BY**: Free to use, just credit the artist
- **MIT License**: Similar to CC-BY

### How to Give Attribution:
Create a `CREDITS.md` file in your repo:
```markdown
# Asset Credits

## Character Sprites
- Source: [Artist Name]
- License: CC-BY 3.0
- URL: [link to asset]

## UI Icons
- Source: Kenney.nl
- License: CC0
- URL: https://kenney.nl
```

## 🔍 Advanced Search Tips

### Google Images
- Search: "game sprite transparent background"
- Tools → Color → Transparent
- Tools → Usage Rights → Creative Commons licenses

### Pinterest
- Great for finding inspiration
- Often links back to original sources
- Search: "2d game sprites"

### Reddit Communities
- r/gameassets
- r/gamedev
- Often share free resources

## 🎮 Recommended Starting Point

**For beginners, I recommend:**

1. **Go to Kenney.nl first**
   - Download "RPG Urban Pack" or similar
   - Everything is CC0 (completely free)
   - Consistent art style

2. **Then OpenGameArt.org**
   - Search for additional sprites you need
   - Filter by CC0 license
   - Download matching style

3. **Game-Icons.net for UI**
   - Download skill icons as SVG
   - All icons have consistent style
   - Easy to customize colors

## 💡 Pro Tips

1. **Consistency > Quality**: Better to have matching low-quality sprites than mismatched high-quality ones
2. **Start Small**: Get 1 hero, 1 enemy, 1 background working first
3. **Placeholder First**: Use simple colored squares initially, add art later
4. **Sprite Sheets**: Learn to extract individual frames if downloading animated packs
5. **Resize Tools**: Use tools like Photopea (online) to resize/edit sprites

## 🛠️ Tools for Working with Downloaded Sprites

### Image Editing (Free)
- **GIMP**: Full Photoshop alternative (desktop)
- **Photopea**: Online Photoshop clone (https://www.photopea.com/)
- **Paint.NET**: Simple Windows editor

### Sprite Sheet Tools
- **TexturePacker**: Extract sprites from sheets
- **Leshy SpriteSheet Tool**: Online sprite sheet tool
- **Piskel**: Create/edit pixel art (online)

### Converting Formats
- **CloudConvert**: Online converter (PNG ↔ SVG ↔ JPG)
- **Inkscape**: SVG editor (free, desktop)

## ✅ Checklist for Asset Integration

After downloading sprites:
- [ ] Verify license allows use
- [ ] Add attribution to CREDITS.md
- [ ] Resize to consistent dimensions
- [ ] Remove backgrounds (make transparent if needed)
- [ ] Organize in correct asset folders
- [ ] Update assetManager.js manifest
- [ ] Test loading in game
- [ ] Adjust rendering positions if needed

## 📚 Additional Resources

- **Game Dev Market**: https://www.gamedevmarket.net/ (paid + free)
- **Unity Asset Store**: Has 2D assets (some free)
- **Spriters Resource**: Ripped game sprites (check copyright!)
- **PixelJoint**: Pixel art community with resources

---

## 🚀 Quick Start Command

Once you've downloaded assets, update them with:
```bash
# Place downloaded files in assets folders
mv ~/Downloads/hero-tank.png assets/heroes/tank.png
mv ~/Downloads/enemy-goblin.png assets/enemies/goblin.png
# etc...

# Then test in browser
open index.html
```

**Good luck finding the perfect sprites for your game! 🎮✨**
