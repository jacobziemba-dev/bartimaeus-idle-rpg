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
        this.battleManager = new BattleManager();
        this.resourceManager = new ResourceManager();
        this.storageManager = new StorageManager();
        this.uiManager = new UIManager('battle-canvas');

        // Game state
        this.heroes = [];
        this.currentStage = 1;
        this.isRunning = false;

        // Timing
        this.lastFrameTime = Date.now();
        this.lastSaveTime = Date.now();
        this.saveInterval = 30000; // Auto-save every 30 seconds

        // Game speed multiplier (1 = normal, 2 = double, 4 = quad)
        this.speedMultiplier = 1;

        // Initialize game
        this.init();
    }

    /**
     * Initialize the game
     * Loads save data or creates new game
     */
    init() {
        console.log('Initializing Bartimaeus Idle RPG...');

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

        // Start first battle
        this.battleManager.startBattle(this.heroes, this.currentStage);

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
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.battleManager.togglePause();
            const isPaused = this.battleManager.getPauseState();
            document.getElementById('pause-btn').textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
        });

        // Next stage button
        document.getElementById('next-stage-btn').addEventListener('click', () => {
            this.nextStage();
        });

        // Retry button
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.retryStage();
        });

        // Upgrade Heroes button
        document.getElementById('upgrade-btn').addEventListener('click', () => {
            this.openUpgradeModal();
        });

        // Close upgrade modal
        document.getElementById('close-upgrade').addEventListener('click', () => {
            this.closeUpgradeModal();
        });

        // AFK Rewards button (manual check)
        document.getElementById('afk-rewards-btn').addEventListener('click', () => {
            // For now, just show current passive income info
            alert(`Passive Income:\n💰 ${this.resourceManager.goldPerSecond}/sec\n💎 ${this.resourceManager.gemsPerSecond.toFixed(1)}/sec`);
        });

        // Close AFK modal
        document.getElementById('close-afk').addEventListener('click', () => {
            this.uiManager.hideAFKRewards();
        });

        // Speed control buttons (1x, 2x, 4x)
        const speedButtons = document.querySelectorAll('#speed-controls .speed-btn');
        if (speedButtons && speedButtons.length) {
            speedButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const s = Number(e.currentTarget.dataset.speed) || 1;
                    this.speedMultiplier = s;
                    try { localStorage.setItem('gameSpeed', String(s)); } catch (err) {}

                    // Visual active state
                    speedButtons.forEach(b => b.classList.toggle('active', Number(b.dataset.speed) === s));
                });
            });

            // Restore saved speed from localStorage if present
            try {
                const saved = Number(localStorage.getItem('gameSpeed')) || 1;
                if ([1,2,4].includes(saved)) {
                    this.speedMultiplier = saved;
                    const defaultBtn = document.querySelector(`#speed-controls .speed-btn[data-speed="${this.speedMultiplier}"]`);
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

        // Check if battle ended
        const battleResult = this.battleManager.getBattleResult();
        if (battleResult) {
            this.handleBattleEnd(battleResult);
        }

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

        // Draw battle result if battle ended
        const battleResult = this.battleManager.getBattleResult();
        if (battleResult) {
            this.uiManager.drawBattleResult(battleResult);
        }
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

        this.uiManager.updateBattleControls(
            this.battleManager.getBattleResult()
        );
    }

    /**
     * Handle battle end (victory or defeat)
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
        }
    }

    /**
     * Move to next stage
     */
    nextStage() {
        this.currentStage++;
        this.resourceManager.updateIdleRates(this.currentStage);
        this.battleManager.startBattle(this.heroes, this.currentStage);
        this.saveGame();
    }

    /**
     * Retry current stage
     */
    retryStage() {
        this.battleManager.resetBattle();
    }

    /**
     * Open the upgrade modal
     */
    openUpgradeModal() {
        this.uiManager.updateUpgradeModal(this.heroes, (heroId) => {
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
     * Upgrade a specific hero
     *
     * @param {number} heroId - ID of hero to upgrade
     */
    upgradeHero(heroId) {
        const hero = this.heroes.find(h => h.id === heroId);

        if (!hero) {
            console.error('Hero not found!');
            return;
        }

        const cost = hero.getUpgradeCost();

        // Try to spend gold
        if (this.resourceManager.spendGold(cost)) {
            hero.upgrade();
            console.log(`${hero.name} upgraded to level ${hero.level}!`);

            // Update modal to show new stats
            this.uiManager.updateUpgradeModal(this.heroes, (heroId) => {
                this.upgradeHero(heroId);
            });

            // Update resource display
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
