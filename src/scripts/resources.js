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

        // Idle generation rates (per second)
        this.goldPerSecond = 0;

        // Tracking for idle rewards
        this.lastUpdateTime = Date.now();
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
     * Get current gold amount
     *
     * @returns {number} Current gold
     */
    getGold() {
        return Math.floor(this.gold);
    }
}
