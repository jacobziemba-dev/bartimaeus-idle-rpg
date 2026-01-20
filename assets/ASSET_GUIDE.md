# Asset Guide - Bartimaeus Idle RPG

This guide explains all the SVG assets created for the game.

## Asset Format

All assets are in **SVG format** which provides:
- Scalable graphics (no quality loss at any size)
- Small file sizes
- Embedded animations
- Easy color customization

## Asset Categories

### 1. Skill Icons (`assets/ui/`)

#### Fireball Icon
- **File**: `fireball-icon.svg`
- **Description**: Animated fireball with orange/yellow flames
- **Features**: Flickering flame animation, sparks
- **Usage**: Active skill icon for Fireball ability

#### Cleave Icon
- **File**: `cleave-icon.svg`
- **Description**: Three swords with red slash effect
- **Features**: Pulsing slash animation
- **Usage**: Active skill icon for Cleave ability

#### Heal Icon (Second Wind)
- **File**: `heal-icon.svg`
- **Description**: Green heart with white cross and sparkles
- **Features**: Pulsing heart, animated sparkles, healing aura
- **Usage**: Active skill icon for Second Wind/Heal ability

### 2. Hero Sprites (`assets/heroes/`)

#### Bartimaeus
- **File**: `bartimaeus.svg`
- **Description**: Heavily armored tank hero
- **Features**:
  - Blue plate armor with details
  - Large shield (left hand)
  - Sword (right hand)
  - Helmet with visor
  - Flowing cape
  - Defensive blue aura animation
- **Usage**: Main hero character sprite

### 3. Enemy Sprites (`assets/enemies/`)

#### Goblin
- **File**: `goblin.svg`
- **Description**: Small green goblin with club
- **Features**: Large pointed ears, beady eyes, raggedy clothes
- **Usage**: Low-level enemy (stages 1-3)

#### Orc
- **File**: `orc.svg`
- **Description**: Large muscular red orc
- **Features**: Battle axe, tusks, angry expression, leather armor
- **Usage**: Mid-level enemy (stages 4-6)

#### Skeleton
- **File**: `skeleton.svg`
- **Description**: Undead skeleton warrior
- **Features**: Glowing red eyes (animated), rusty sword, visible bones
- **Usage**: Mid-level enemy (stages 5-8)

#### Demon
- **File**: `demon.svg`
- **Description**: Purple demon with dark magic
- **Features**: Horns, claws, tail, glowing yellow eyes, dark aura animation
- **Usage**: High-level enemy (stages 7-10)

#### Dragon
- **File**: `dragon.svg`
- **Description**: Large orange dragon
- **Features**: Wings, horns, fire breath (animated), scales, spikes
- **Usage**: Boss enemy (stages 10+)

### 4. UI Elements (`assets/ui/`)

#### Button - Upgrade
- **File**: `button-upgrade.svg`
- **Description**: Green upgrade button with shine effect
- **Features**: Gradient fill, up arrow icon
- **Usage**: Upgrade buttons throughout UI

#### Panel Frame
- **File**: `panel-frame.svg`
- **Description**: Ornate metal frame for panels
- **Features**: Stone/metal texture, corner decorations
- **Usage**: Character info panels, stat displays

#### Health Bar Background
- **File**: `healthbar-background.svg`
- **Description**: Dark frame for health bars
- **Usage**: Container for all health bars

#### Health Bar Fill - Green
- **File**: `healthbar-fill-green.svg`
- **Description**: Green gradient health fill
- **Features**: Shine effect on top
- **Usage**: Hero health bars

#### Health Bar Fill - Red
- **File**: `healthbar-fill-red.svg`
- **Description**: Red gradient health fill
- **Features**: Shine effect on top
- **Usage**: Enemy health bars

#### Gold Coin
- **File**: `gold-coin.svg`
- **Description**: Golden coin with $ symbol
- **Features**: Metallic gradient, shine effect
- **Usage**: Gold currency icon

#### Gem Icon
- **File**: `gem-icon.svg`
- **Description**: Purple diamond/gem
- **Features**: Facets, sparkle animations
- **Usage**: Gem currency icon

### 5. Backgrounds (`assets/backgrounds/`)

#### Forest
- **File**: `forest.svg`
- **Description**: Green forest battlefield
- **Features**:
  - Blue sky with clouds
  - Tree line in background
  - Grass ground
  - Falling leaves animation
- **Usage**: Early stages (1-3)

#### Dungeon
- **File**: `dungeon.svg`
- **Description**: Dark stone dungeon
- **Features**:
  - Stone walls with brick pattern
  - Flickering torches (animated)
  - Cobwebs
  - Stone tile floor
- **Usage**: Mid stages (4-6)

#### Volcano
- **File**: `volcano.svg`
- **Description**: Hellscape with volcano
- **Features**:
  - Dark red sky
  - Active volcano
  - Lava cracks in ground (animated)
  - Rising smoke/ash particles
  - Ambient hellish glow
- **Usage**: High stages (7-9)

#### Castle
- **File**: `castle.svg`
- **Description**: Castle courtyard
- **Features**:
  - Stone walls with battlements
  - Guard towers
  - Waving flags (animated)
  - Stone floor
  - Castle gate
- **Usage**: Boss stages (10+)

## How to Use Assets in Code

### Loading Assets

The `assetManager.js` automatically loads all assets. Access them using:

```javascript
// Get a background
const forestBg = assetManager.get('backgrounds', 'forest');

// Get a hero sprite
const heroSprite = assetManager.get('heroes', 'bartimaeus');

// Get an enemy sprite
const goblinSprite = assetManager.get('enemies', 'goblin');

// Get a skill icon
const fireballIcon = assetManager.get('ui', 'skill_fireball');
```

### Rendering on Canvas

```javascript
// Draw sprite
ctx.drawImage(sprite, x, y, width, height);

// Draw background (full canvas)
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
```

### Using in HTML

```html
<!-- Direct embed -->
<img src="assets/ui/gold-coin.svg" alt="Gold" width="32" height="32">

<!-- As background -->
<div style="background-image: url('assets/backgrounds/forest.svg')"></div>
```

## Animation Features

Many assets include CSS/SVG animations:

- **Skill Icons**: Pulsing effects, sparkles
- **Backgrounds**: Falling leaves, flickering torches, rising smoke
- **Enemies**: Glowing eyes, breathing effects
- **UI**: Shine effects on buttons and health bars

These animations run automatically when the SVG is displayed.

## Color Palette

The assets use a consistent color scheme:

### Heroes (Blue Theme)
- Primary: `#3b82f6` (Blue)
- Highlight: `#60a5fa` (Light Blue)
- Dark: `#2563eb` (Dark Blue)

### Enemies
- Goblin: `#84cc16` (Lime Green)
- Orc: `#dc2626` (Dark Red)
- Skeleton: `#e5e7eb` (Gray)
- Demon: `#7c3aed` (Purple)
- Dragon: `#f97316` (Orange)

### Skills
- Fireball: `#ff6600` (Orange/Red)
- Cleave: `#cc0000` (Red)
- Heal: `#00ff00` (Green)

### UI
- Gold: `#fbbf24` (Yellow/Gold)
- Gems: `#a78bfa` (Purple)
- Upgrade: `#22c55e` (Green)

## Customization

To customize assets:

1. Open the SVG file in a text editor
2. Find the `fill` or `stroke` attributes
3. Change the color hex codes
4. Save and refresh the game

Example:
```xml
<!-- Change from blue to red -->
<rect fill="#3b82f6" />  <!-- Before -->
<rect fill="#dc2626" />  <!-- After -->
```

## File Structure

```
assets/
├── backgrounds/
│   ├── forest.svg
│   ├── dungeon.svg
│   ├── volcano.svg
│   └── castle.svg
├── heroes/
│   └── bartimaeus.svg
├── enemies/
│   ├── goblin.svg
│   ├── orc.svg
│   ├── skeleton.svg
│   ├── demon.svg
│   └── dragon.svg
└── ui/
    ├── fireball-icon.svg
    ├── cleave-icon.svg
    ├── heal-icon.svg
    ├── button-upgrade.svg
    ├── panel-frame.svg
    ├── healthbar-background.svg
    ├── healthbar-fill-green.svg
    ├── healthbar-fill-red.svg
    ├── gold-coin.svg
    └── gem-icon.svg
```

## Performance Notes

- SVG files are very small (typically 2-8KB each)
- Animations are CSS-based and GPU-accelerated
- All assets load asynchronously
- Fallback rendering is available if assets fail to load

## Credits

All assets created specifically for Bartimaeus Idle RPG.
Vector graphics designed for scalability and performance.
