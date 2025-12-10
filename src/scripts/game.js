/**
 * Main Game Controller
 *
 * This is the "brain" of the game - it controls everything:
 * - Game loop (updates 60 times per second)
 * - Coordinates all systems (battle, resources, UI)
 * - Handles user input (button clicks)
 *
 * Learning Note: This is where everything comes together!
 */

class Game {
    constructor() {
        // Initialize all managers
        this.battleManager = new BattleManager();
        this.resourceManager = new ResourceManager();
        this.uiManager = new UIManager('battle-canvas');

        // Game state
        this.heroes = [];
        this.currentStage = 1;
        this.isRunning = false;

        // Timing
        this.lastFrameTime = Date.now();

        // Game speed multiplier (1 = normal, 2 = double, 4 = quad)
        this.speedMultiplier = 1;

        // Initialize game
        this.init();
    }

    /**
     * Initialize the game
     * Creates new game
     */
    init() {
        console.log('Initializing Bartimaeus Idle RPG...');

        // New game - create starting heroes
        this.heroes = createStartingHeroes();
        this.currentStage = 1;
        this.resourceManager.updateIdleRates(this.currentStage);

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
     * Set up event listeners for buttons
     */
    setupEventListeners() {
        // Pause button
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.battleManager.togglePause();
            const isPaused = this.battleManager.getPauseState();
            document.getElementById('pause-btn').textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
        });

        // Challenge Stage button
        const nextStageBtn = document.getElementById('next-stage-btn');
        if (nextStageBtn) {
            nextStageBtn.textContent = '⚔️ Challenge Stage';
            nextStageBtn.addEventListener('click', () => {
                this.startBossFight();
            });
        }

        // Upgrade Heroes button
        document.getElementById('upgrade-btn').addEventListener('click', () => {
            this.openUpgradeModal();
        });

        // Close upgrade modal
        document.getElementById('close-upgrade').addEventListener('click', () => {
            this.closeUpgradeModal();
        });

        // Speed control buttons (1x, 2x, 4x)
        const speedButtons = document.querySelectorAll('#speed-controls .speed-btn');
        if (speedButtons && speedButtons.length) {
            speedButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const s = Number(e.currentTarget.dataset.speed) || 1;
                    this.speedMultiplier = s;
                    // No local storage saving

                    // Visual active state
                    speedButtons.forEach(b => b.classList.toggle('active', Number(b.dataset.speed) === s));
                });
            });

            // Set default active
            const defaultBtn = document.querySelector(`#speed-controls .speed-btn[data-speed="1"]`);
            if (defaultBtn) defaultBtn.classList.add('active');
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
     * Update UI elements (gold, stage, etc.)
     */
    updateUI() {
        this.uiManager.updateResourceDisplay(
            this.resourceManager.getGold(),
            this.currentStage
        );

        this.uiManager.updateBattleControls(
            this.battleManager.getBattleResult(),
            this.battleManager.battleMode
        );
    }

    /**
     * Handle battle end (victory or defeat)
     * Only relevant for BOSS fights
     *
     * @param {string} result - 'victory' or 'defeat'
     */
    handleBattleEnd(result) {
        if (result === 'victory') {
            // Award gold
            const goldReward = getStageGoldReward(this.currentStage);

            this.resourceManager.addGold(goldReward);

            console.log(`Victory! Earned ${goldReward} gold`);

            // Advance stage
            this.currentStage++;
            this.resourceManager.updateIdleRates(this.currentStage);

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

        } else {
            alert('Not enough gold!');
        }
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
// - game.currentStage = 5 - Jump to stage 5
