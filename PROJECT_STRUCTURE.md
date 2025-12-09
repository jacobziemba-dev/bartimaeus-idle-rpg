# Project Structure

This document describes the organization of the Bartimaeus Idle RPG project.

```
bartimaeus-idle-rpg/
├── .vscode/                  # VSCode workspace settings
│   ├── settings.json         # Editor configuration (format on save, etc.)
│   └── extensions.json       # Recommended extensions
│
├── docs/                     # Documentation
│   ├── CLAUDE.md            # Claude Code assistant instructions
│   └── ROADMAP.md           # Development roadmap
│
├── src/                      # Source code
│   ├── scripts/             # JavaScript game logic
│   │   ├── battle.js        # BattleManager - combat system
│   │   ├── enemy.js         # Enemy class and generation
│   │   ├── game.js          # Main Game controller
│   │   ├── hero.js          # Hero class and starting heroes
│   │   ├── resources.js     # ResourceManager - gold/gems
│   │   ├── storage.js       # StorageManager - save/load
│   │   └── ui.js            # UIManager - canvas rendering
│   │
│   ├── styles/              # CSS stylesheets
│   │   ├── main.css         # Main UI styles
│   │   └── battle.css       # Battle canvas and modal styles
│   │
│   └── assets/              # Game assets
│       ├── images/          # Sprites, backgrounds, UI elements
│       ├── fonts/           # Custom fonts
│       └── audio/           # Sound effects and music
│
├── tests/                    # Test files (future)
│
├── .editorconfig            # Editor configuration for consistency
├── .prettierrc              # Code formatting rules
├── .gitignore               # Git ignore patterns
├── index.html               # Main entry point
├── README.md                # Project overview
└── PROJECT_STRUCTURE.md     # This file

```

## Key Files

### Entry Point
- **index.html** - Main HTML file, loads all scripts and styles

### Core Game Scripts (Load Order Matters!)
1. **hero.js** - Hero class, must load first
2. **enemy.js** - Enemy class, depends on nothing
3. **resources.js** - ResourceManager singleton
4. **storage.js** - StorageManager for save/load
5. **battle.js** - BattleManager, depends on Hero/Enemy
6. **ui.js** - UIManager, depends on Hero/Enemy
7. **game.js** - Main controller, depends on all managers

### Styles
- **main.css** - Layout, buttons, modals, general UI
- **battle.css** - Canvas, battle controls, animations

## Development Workflow

1. **Running the game**: Open [index.html](../index.html) in a browser or use Live Server
2. **Making changes**: Edit files in `src/`, refresh browser to see changes
3. **Adding assets**: Place images/audio in appropriate `src/assets/` subfolder
4. **Documentation**: Update files in `docs/` folder

## Configuration Files

- **.editorconfig** - Ensures consistent coding style (2 spaces, UTF-8, LF)
- **.prettierrc** - Auto-formatting rules for HTML/CSS/JS
- **.vscode/settings.json** - Format on save, Live Server config
- **.vscode/extensions.json** - Recommended VSCode extensions

## Future Additions

- `tests/` - Unit tests for game logic
- `src/assets/images/` - Character sprites, backgrounds
- `src/assets/audio/` - Sound effects, background music
- `src/components/` - Reusable UI components (if refactoring to modules)
