// Import styles
import './styles/main.css';
import './styles/battle.css';

// Import game modules in dependency order
// Core Systems
import './scripts/assetManager.js';

// Game Data
import './scripts/hero.js';
import './scripts/enemy.js';

// Game Systems
import './scripts/skills.js';
import './scripts/adventureLog.js';
import './scripts/resources.js';
import './scripts/storage.js';

// Managers
import './scripts/battle.js';
import './scripts/ui.js';

// Main Controller
import './scripts/game.js';

// The game.js file already has initialization logic that runs when loaded
// No additional initialization needed here
