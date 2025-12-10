/**
 * Resources Management System
 *
 * Handles gold, gems, and idle/AFK resource generation.
 *
 * Learning Note: This manages the "currency" in your game.
 * Resources are earned from battles and passively over time.
 */

/**
 * ResourceManager Class
 * Singleton pattern - only one instance exists in the game
 */
class ResourceManager {
    constructor() {
        // Current resources
        this.gold = 1000; // Starting gold
        this.gems = 50;   // Starting gems

        // Idle generation rates (per second)
        this.goldPerSecond = 0;
        this.gemsPerSecond = 0;

        // Tracking for idle rewards
        this.lastUpdateTime = Date.now();
        this.lastSaveTime = Date.now();

        // Total time away for AFK rewards (in seconds)
        this.timeAwaySeconds = 0;
    }

    /**
     * Calculate idle generation rate based on current stage
     *
     * @param {number} stageLevel - Current stage the player is on
     */
    updateIdleRates(stageLevel) {
        // Gold per second increases with stage level
        // Formula: stage * 0.5 gold/second
        // Stage 1 = 0.5 gold/sec, Stage 10 = 5 gold/sec
        this.goldPerSecond = stageLevel * 0.5;

        // Gems per second (much slower than gold)
        // Formula: stage * 0.01 gems/second
        // Stage 1 = 0.01 gems/sec, Stage 100 = 1 gem/sec
        this.gemsPerSecond = stageLevel * 0.01;
    }

    /**
     * Update idle resources based on time passed
     * Called every frame to accumulate resources
     *
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    update(deltaTime) {
        // Convert milliseconds to seconds
        const seconds = deltaTime / 1000;

        // Generate idle resources
        this.gold += this.goldPerSecond * seconds;
        this.gems += this.gemsPerSecond * seconds;
    }

    /**
     * Add gold to the player's total
     *
     * @param {number} amount - Gold to add
     */
    addGold(amount) {
        this.gold += Math.floor(amount);
    }

    /**
     * Add gems to the player's total
     *
     * @param {number} amount - Gems to add
     */
    addGems(amount) {
        this.gems += Math.floor(amount);
    }

    /**
     * Try to spend gold (for upgrades, etc.)
     *
     * @param {number} amount - Gold to spend
     * @returns {boolean} True if purchase successful, false if not enough gold
     */
    spendGold(amount) {
        if (this.gold >= amount) {
            this.gold -= amount;
            return true;
        }
        return false;
    }

    /**
     * Try to spend gems
     *
     * @param {number} amount - Gems to spend
     * @returns {boolean} True if purchase successful, false if not enough gems
     */
    spendGems(amount) {
        if (this.gems >= amount) {
            this.gems -= amount;
            return true;
        }
        return false;
    }

    /**
     * Calculate offline earnings (AFK rewards)
     * Called when the player returns to the game
     *
     * @param {number} timeAwayMs - Milliseconds the player was away
     * @param {number} currentStage - Current stage (for calculating rates)
     * @returns {object} Object with gold and gems earned { gold, gems, timeAwayFormatted }
     */
    calculateOfflineEarnings(timeAwayMs, currentStage) {
        // Cap offline earnings at 2 hours (7200 seconds)
        const maxOfflineTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        const cappedTime = Math.min(timeAwayMs, maxOfflineTime);

        // Convert to seconds
        const timeAwaySeconds = cappedTime / 1000;
        this.timeAwaySeconds = timeAwaySeconds;

        // Calculate rates for the current stage
        const goldRate = currentStage * 10;
        const gemRate = currentStage * 0.1;

        // Calculate earnings
        const goldEarned = Math.floor(goldRate * timeAwaySeconds);
        const gemsEarned = Math.floor(gemRate * timeAwaySeconds);

        // Format time away for display
        const timeAwayFormatted = this.formatTime(timeAwaySeconds);

        return {
            gold: goldEarned,
            gems: gemsEarned,
            timeAwayFormatted: timeAwayFormatted
        };
    }

    /**
     * Format seconds into readable time (e.g., "5m 30s" or "1h 20m")
     *
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    formatTime(seconds) {
        if (seconds < 60) {
            return `${Math.floor(seconds)}s`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}m ${secs}s`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${minutes}m`;
        }
    }

    /**
     * Get current gold amount
     *
     * @returns {number} Current gold
     */
    getGold() {
        return Math.floor(this.gold);
    }

    /**
     * Get current gems amount
     *
     * @returns {number} Current gems
     */
    getGems() {
        return Math.floor(this.gems);
    }

    /**
     * Serialize resources to object for saving
     *
     * @returns {object} Resources data
     */
    toJSON() {
        return {
            gold: this.gold,
            gems: this.gems,
            goldPerSecond: this.goldPerSecond,
            gemsPerSecond: this.gemsPerSecond,
            lastSaveTime: Date.now() // Update save time
        };
    }

    /**
     * Load resources from saved data
     *
     * @param {object} data - Saved resources data
     */
    fromJSON(data) {
        this.gold = data.gold || 1000;
        this.gems = data.gems || 50;
        this.goldPerSecond = data.goldPerSecond || 0;
        this.gemsPerSecond = data.gemsPerSecond || 0;
        this.lastSaveTime = data.lastSaveTime || Date.now();
    }
}
