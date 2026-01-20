/**
 * Main Game Controller
 *
 * This is the "brain" of the game - it controls everything:
 * - Game loop (updates 60 times per second)
 * - Coordinates all systems (battle, resources, UI, storage)
 * - Handles user input (button clicks)
 *
 * Learning Note: This is where everything comes together!
 */

import { AssetManager } from './assetManager';
import { BattleManager } from './battle';
import { ResourceManager } from './resources';
import { StorageManager, createSaveState, loadHeroesFromSave, loadResourcesFromSave, loadStageFromSave } from './storage';
import { UIManager } from './ui';
import { AdventureLog } from './adventureLog';
import { SkillManager } from './skills';
import { createStartingHeroes } from './hero';
import { getStageGoldReward, getStageGemReward } from './enemy';
import type { Hero } from './hero';

export class Game {
  assetManager: AssetManager;
  battleManager: BattleManager;
  resourceManager: ResourceManager;
  storageManager: StorageManager;
  uiManager: UIManager;
  adventureLog: AdventureLog;
  skillManager: SkillManager | null = null;

  // Game state
  heroes: Hero | null = null; // Single hero in horde mode
  currentStage: number = 1;
  isRunning: boolean = false;

  // Timing
  lastFrameTime: number = Date.now();
  lastSaveTime: number = Date.now();
  saveInterval: number = 30000; // Auto-save every 30 seconds

  // Game speed multiplier (1 = normal, 2 = double, 4 = quad)
  speedMultiplier: number = 1;

  constructor() {
    // Initialize all managers
    this.assetManager = new AssetManager();
    this.battleManager = new BattleManager();
    this.resourceManager = new ResourceManager();
    this.storageManager = new StorageManager();
    this.uiManager = new UIManager('battle-canvas');
    this.adventureLog = new AdventureLog();

    // Don't initialize immediately - wait for assets to load
    this.loadAssets();
  }

  /**
   * Load all game assets before starting
   */
  async loadAssets(): Promise<void> {
    try {
      // Load all assets
      await this.assetManager.loadAll();

      // Assets loaded, now initialize game
      this.init();
    } catch (error) {
      console.error('Failed to load assets:', error);
      // Start game anyway with fallback rendering
      this.init();
    }
  }

  /**
   * Initialize the game
   * Loads save data or creates new game
   */
  init(): void {
    console.log('Initializing Bartimaeus Idle RPG...');

    // Hide loading screen and show main game UI
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.style.display = 'none';
    const gameWrapper = document.getElementById('game-wrapper');
    if (gameWrapper) gameWrapper.style.display = 'grid';
    this.uiManager.resizeCanvas();

    // Initialize adventure log
    this.adventureLog.init();

    // Try to load saved game
    const saveState = this.storageManager.loadGame();

    if (saveState) {
      // Load from save
      this.loadGameState(saveState);

      // Check for offline earnings (AFK rewards)
      this.checkOfflineEarnings(saveState);
    } else {
      // New game - create starting heroes
      this.heroes = createStartingHeroes();
      this.currentStage = 1;
      this.resourceManager.updateIdleRates(this.currentStage);
    }

    // Initialize skill manager for the hero
    if (this.heroes) {
      this.skillManager = new SkillManager(this.heroes);
    }

    // Connect systems
    this.battleManager.adventureLog = this.adventureLog;
    this.battleManager.skillManager = this.skillManager;

    // Set up UI event listeners
    this.setupEventListeners();

    // Update UI
    this.updateUI();

    // Start first battle
    if (this.heroes) {
      this.battleManager.startBattle(this.heroes, this.currentStage);
    }

    // Start game loop
    this.start();

    console.log('Game initialized!');
  }

  /**
   * Load game state from save data
   *
   * @param saveState - Saved game data
   */
  loadGameState(saveState: any): void {
    this.heroes = loadHeroesFromSave(saveState);
    this.currentStage = loadStageFromSave(saveState);
    loadResourcesFromSave(saveState, this.resourceManager);
    this.resourceManager.updateIdleRates(this.currentStage);
  }

  /**
   * Check for offline earnings and show AFK rewards
   *
   * @param saveState - Saved game data
   */
  checkOfflineEarnings(saveState: any): void {
    const lastSaveTime = saveState.lastSaveTime || Date.now();
    const currentTime = Date.now();
    const timeAway = currentTime - lastSaveTime;

    // Only show AFK rewards if player was away for more than 1 minute
    if (timeAway > 60000) {
      const earnings = this.resourceManager.calculateOfflineEarnings(
        timeAway,
        this.currentStage
      );

      // Add earnings to resources
      this.resourceManager.addGold(earnings.gold);
      this.resourceManager.addGems(earnings.gems);

      // Show AFK rewards popup
      this.uiManager.showAFKRewards(
        earnings.gold,
        earnings.gems,
        earnings.timeAwayFormatted
      );
    }
  }

  /**
   * Set up event listeners for buttons
   */
  setupEventListeners(): void {
    // Pause button
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.battleManager.togglePause();
        const isPaused = this.battleManager.getPauseState();
        pauseBtn.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
      });
    }

    // Challenge Stage button
    const nextStageBtn = document.getElementById('next-stage-btn');
    if (nextStageBtn) {
      nextStageBtn.textContent = '⚔️ Next Stage';
      nextStageBtn.addEventListener('click', () => {
        this.advanceStage();
      });
    }

    // Upgrade Heroes button
    const upgradeBtn =
      document.getElementById('upgrade-btn') ||
      document.getElementById('upgrade-stats-btn');
    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        this.upgradeHero();
      });
    }

    // Close upgrade modal
    const closeUpgradeBtn = document.getElementById('close-upgrade');
    if (closeUpgradeBtn) {
      closeUpgradeBtn.addEventListener('click', () => {
        this.closeUpgradeModal();
      });
    }

    // Close AFK modal
    const closeAfkBtn = document.getElementById('close-afk');
    if (closeAfkBtn) {
      closeAfkBtn.addEventListener('click', () => {
        this.uiManager.hideAFKRewards();
      });
    }

    // Speed control buttons (1x, 2x, 4x)
    const speedButtons = document.querySelectorAll(
      '#speed-controls .speed-btn'
    );
    if (speedButtons && speedButtons.length) {
      speedButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget as HTMLElement;
          const s = Number(target.dataset.speed) || 1;
          this.speedMultiplier = s;
          try {
            localStorage.setItem('gameSpeed', String(s));
          } catch (err) {
            // Ignore localStorage errors
          }

          // Visual active state
          speedButtons.forEach(b =>
            b.classList.toggle('active', Number((b as HTMLElement).dataset.speed) === s)
          );
        });
      });

      // Restore saved speed from localStorage if present
      try {
        const saved = Number(localStorage.getItem('gameSpeed')) || 1;
        if ([1, 2, 4].includes(saved)) {
          this.speedMultiplier = saved;
          const defaultBtn = document.querySelector(
            `#speed-controls .speed-btn[data-speed="${this.speedMultiplier}"]`
          );
          if (defaultBtn) defaultBtn.classList.add('active');
        }
      } catch (err) {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Start the game loop
   */
  start(): void {
    this.isRunning = true;
    this.gameLoop();
  }

  /**
   * Main game loop - runs 60 times per second
   * This is the heart of the game!
   */
  gameLoop(): void {
    if (!this.isRunning) {
      return;
    }

    // Calculate delta time (time since last frame)
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Update all systems
    this.update(deltaTime);

    // Render everything
    this.render();

    // Request next frame (creates 60 FPS loop)
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Update game state (called every frame)
   *
   * @param deltaTime - Time since last update in milliseconds
   */
  update(deltaTime: number): void {
    // Update battle
    this.battleManager.update(deltaTime);

    // Update resources (idle generation)
    this.resourceManager.update(deltaTime);

    // In horde mode, battles are continuous (no battle end checks)
    // Hero respawns automatically when defeated

    // Auto-save every 30 seconds
    const currentTime = Date.now();
    if (currentTime - this.lastSaveTime >= this.saveInterval) {
      this.saveGame();
      this.lastSaveTime = currentTime;
    }

    // Update UI displays
    this.updateUI();
  }

  /**
   * Render everything to screen
   */
  render(): void {
    // Render battle canvas
    if (this.heroes) {
      this.uiManager.render(
        this.heroes,
        this.battleManager.enemies,
        this.battleManager.getDamageNumbers()
      );
    }

    // In horde mode, battles are continuous (no battle result screen)
  }

  /**
   * Update UI elements (gold, gems, stage, etc.)
   */
  updateUI(): void {
    this.uiManager.updateResourceDisplay(
      this.resourceManager.getGold(),
      this.resourceManager.getGems(),
      this.currentStage
    );

    // Update battle controls
    this.uiManager.updateBattleControls(null, 'HORDE');
  }

  /**
   * Advance to the next stage
   */
  advanceStage(): void {
    // Award gold and gems
    const goldReward = getStageGoldReward(this.currentStage);
    const gemReward = getStageGemReward(this.currentStage);

    this.resourceManager.addGold(goldReward);
    this.resourceManager.addGems(gemReward);

    console.log(`Completed Stage ${this.currentStage}! Earned ${goldReward} gold and ${gemReward} gems`);

    // Advance stage
    this.currentStage++;
    this.resourceManager.updateIdleRates(this.currentStage);
    this.saveGame();

    // Start battle at new stage
    if (this.heroes) {
      this.battleManager.startBattle(this.heroes, this.currentStage);
    }
    this.updateUI();
  }

  /**
   * Open the upgrade modal
   */
  openUpgradeModal(): void {
    if (this.heroes) {
      this.uiManager.updateUpgradeModal(this.heroes, (heroId) => {
        this.upgradeHero(heroId);
      });
      this.uiManager.toggleUpgradeModal(true);
    }
  }

  /**
   * Close the upgrade modal
   */
  closeUpgradeModal(): void {
    this.uiManager.toggleUpgradeModal(false);
  }

  /**
   * Upgrade the hero
   *
   * @param heroId - ID of hero to upgrade (optional, kept for compatibility)
   */
  upgradeHero(heroId?: number): void {
    const hero = this.heroes;

    if (!hero) {
      console.error('Hero not found!');
      return;
    }

    const cost = hero.getUpgradeCost();

    // Try to spend gold
    if (this.resourceManager.spendGold(cost)) {
      hero.upgrade();
      console.log(`${hero.name} upgraded to level ${hero.level}!`);

      // Log to adventure log
      if (this.adventureLog) {
        this.adventureLog.logUpgrade(hero.name, hero.level);
      }

      // Update UI to show new stats
      this.updateUI();

      // Save game
      this.saveGame();
    } else {
      alert('Not enough gold!');
    }
  }

  /**
   * Save game to LocalStorage
   */
  saveGame(): void {
    if (!this.heroes) return;

    const saveState = createSaveState(
      this.heroes,
      this.resourceManager,
      this.currentStage
    );

    this.storageManager.saveGame(saveState);
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.isRunning = false;
  }
}

// ========================================
// Start the game when page loads
// ========================================

// Wait for page to fully load
window.addEventListener('load', () => {
  console.log('Page loaded! Starting game...');

  // Create and start the game
  const game = new Game();

  // Make game accessible in browser console (for debugging)
  (window as any).game = game;

  console.log('Game started! Type "game" in console to inspect game state.');
});

// ========================================
// Debug commands (for testing)
// ========================================

// You can run these in the browser console:
// - game.resourceManager.addGold(1000) - Add 1000 gold
// - game.resourceManager.addGems(100) - Add 100 gems
// - game.currentStage = 5 - Jump to stage 5
// - game.storageManager.deleteSave() - Delete save (restart)
