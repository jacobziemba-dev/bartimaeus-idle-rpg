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

class Game {
  constructor() {
    // Initialize all managers
    this.assetManager = new AssetManager();
    this.battleManager = new BattleManager();
    this.resourceManager = new ResourceManager();
    this.storageManager = new StorageManager();
    this.uiManager = new UIManager('battle-canvas');

    // Game state
    this.heroes = null; // Single hero in horde mode
    this.currentStage = 1;
    this.isRunning = false;

    // Timing
    this.lastFrameTime = Date.now();
    this.lastSaveTime = Date.now();
    this.saveInterval = 30000; // Auto-save every 30 seconds

    // Game speed multiplier (1 = normal, 2 = double, 4 = quad)
    this.speedMultiplier = 1;

    // Don't initialize immediately - wait for assets to load
    this.loadAssets();
  }

  /**
   * Load all game assets before starting
   */
  async loadAssets() {
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
  init() {
    console.log('Initializing Bartimaeus Idle RPG...');

    // Hide loading screen and show main game UI
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) loadingScreen.style.display = 'none';
    const gameWrapper = document.getElementById('game-wrapper');
    if (gameWrapper) gameWrapper.style.display = 'grid';

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

    // Set up UI event listeners
    this.setupEventListeners();

    // Update UI
    this.updateUI();

    // Start first battle in IDLE mode
    this.battleManager.startBattle(this.heroes, this.currentStage, 'IDLE');

    // Start game loop
    this.start();

    console.log('Game initialized!');
  }

  /**
   * Load game state from save data
   *
   * @param {object} saveState - Saved game data
   */
  loadGameState(saveState) {
    this.heroes = loadHeroesFromSave(saveState);
    this.currentStage = loadStageFromSave(saveState);
    loadResourcesFromSave(saveState, this.resourceManager);
    this.resourceManager.updateIdleRates(this.currentStage);
  }

  /**
   * Check for offline earnings and show AFK rewards
   *
   * @param {object} saveState - Saved game data
   */
  checkOfflineEarnings(saveState) {
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
  setupEventListeners() {
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
    // Note: The UI element ID 'next-stage-btn' is reused/renamed in UI later
    // or we handle the existing button but treating it as "Challenge Boss"
    const nextStageBtn = document.getElementById('next-stage-btn');
    if (nextStageBtn) {
      nextStageBtn.textContent = '⚔️ Challenge Stage';
      nextStageBtn.addEventListener('click', () => {
        this.startBossFight();
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

    // AFK Rewards button (manual check)
    const afkRewardsBtn = document.getElementById('afk-rewards-btn');
    if (afkRewardsBtn) {
      afkRewardsBtn.addEventListener('click', () => {
        // For now, just show current passive income info
        alert(
          `Passive Income:\n💰 ${this.resourceManager.goldPerSecond}/sec\n💎 ${this.resourceManager.gemsPerSecond.toFixed(1)}/sec`
        );
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
        btn.addEventListener('click', e => {
          const s = Number(e.currentTarget.dataset.speed) || 1;
          this.speedMultiplier = s;
          try {
            localStorage.setItem('gameSpeed', String(s));
          } catch (err) {}

          // Visual active state
          speedButtons.forEach(b =>
            b.classList.toggle('active', Number(b.dataset.speed) === s)
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
        // ignore localStorage errors
      }
    }
  }

  /**
   * Start the game loop
   */
  start() {
    this.isRunning = true;
    this.gameLoop();
  }

  /**
   * Main game loop - runs 60 times per second
   * This is the heart of the game!
   */
  gameLoop() {
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
   * @param {number} deltaTime - Time since last update in milliseconds
   */
  update(deltaTime) {
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
  render() {
    // Render battle canvas
    this.uiManager.render(
      this.heroes,
      this.battleManager.enemies,
      this.battleManager.getDamageNumbers()
    );

    // In horde mode, battles are continuous (no battle result screen)
  }

  /**
   * Update UI elements (gold, gems, stage, etc.)
   */
  updateUI() {
    this.uiManager.updateResourceDisplay(
      this.resourceManager.getGold(),
      this.resourceManager.getGems(),
      this.currentStage
    );

    // In horde mode, we're always in IDLE mode (no boss fights yet)
    this.uiManager.updateBattleControls(null, 'IDLE');
  }

  /**
   * Handle battle end (victory or defeat)
   * Only relevant for BOSS fights
   *
   * @param {string} result - 'victory' or 'defeat'
   */
  handleBattleEnd(result) {
    if (result === 'victory') {
      // Award gold and gems
      const goldReward = getStageGoldReward(this.currentStage);
      const gemReward = getStageGemReward(this.currentStage);

      this.resourceManager.addGold(goldReward);
      this.resourceManager.addGems(gemReward);

      console.log(`Victory! Earned ${goldReward} gold and ${gemReward} gems`);

      // Advance stage
      this.currentStage++;
      this.resourceManager.updateIdleRates(this.currentStage);
      this.saveGame();

      // Return to IDLE mode at new stage
      setTimeout(() => {
        this.battleManager.startBattle(this.heroes, this.currentStage, 'IDLE');
        this.updateUI(); // Reset UI state
      }, 2000); // Show victory screen for 2 seconds
    } else if (result === 'defeat') {
      // Just return to IDLE mode at current stage
      setTimeout(() => {
        this.battleManager.startBattle(this.heroes, this.currentStage, 'IDLE');
        this.updateUI(); // Reset UI state
      }, 2000); // Show defeat screen for 2 seconds
    }
  }

  /**
   * Start a Boss Fight
   */
  startBossFight() {
    this.battleManager.startBattle(this.heroes, this.currentStage, 'BOSS');
    this.updateUI();
  }

  /**
   * Retry current stage - Deprecated in favor of auto-return to IDLE
   */
  retryStage() {
    this.battleManager.resetBattle();
  }

  /**
   * Open the upgrade modal
   */
  openUpgradeModal() {
    this.uiManager.updateUpgradeModal(this.heroes, heroId => {
      this.upgradeHero(heroId);
    });
    this.uiManager.toggleUpgradeModal(true);
  }

  /**
   * Close the upgrade modal
   */
  closeUpgradeModal() {
    this.uiManager.toggleUpgradeModal(false);
  }

  /**
   * Upgrade the hero
   *
   * @param {number} heroId - ID of hero to upgrade (optional, kept for compatibility)
   */
  upgradeHero(heroId) {
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
  saveGame() {
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
  stop() {
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
  window.game = game;

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
