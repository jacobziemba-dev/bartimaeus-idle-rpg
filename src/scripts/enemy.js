/**
 * Enemy Class
 *
 * Represents an enemy that heroes fight against.
 * Enemies are generated based on the current stage level.
 *
 * Learning Note: Very similar to Hero class, but enemies don't level up
 * individually - they scale with the stage number instead.
 */

class Enemy {
    /**
     * Constructor - creates a new enemy
     *
     * @param {number} id - Enemy identifier
     * @param {string} type - Enemy type name (Goblin, Orc, Demon, etc.)
     * @param {number} health - Total health points
     * @param {number} attack - Attack damage
     * @param {number} defense - Defense stat
     */
    constructor(id, type, health, attack, defense) {
        this.id = id;
        this.type = type;

        // Stats
        this.maxHealth = health;
        this.health = health;
        this.attack = attack;
        this.defense = defense;

        // Visual properties
        this.color = this.getColorByType();
        this.x = 0; // Position on canvas (set by UI)
        this.y = 0;
    }

    /**
     * Get enemy color based on type
     * Different enemy types have different colors
     */
    getColorByType() {
        switch(this.type) {
            case 'Goblin': return '#84cc16'; // Lime green
            case 'Orc': return '#dc2626'; // Dark red
            case 'Demon': return '#7c3aed'; // Purple
            case 'Skeleton': return '#d1d5db'; // Gray
            case 'Dragon': return '#f97316'; // Orange
            default: return '#71717a'; // Gray default
        }
    }

    /**
     * Take damage from a hero attack
     *
     * @param {number} damage - Amount of damage to take
     * @returns {number} Actual damage taken (after defense)
     */
    takeDamage(damage) {
        // Defense reduces damage by 50% of defense value
        const reduction = this.defense * 0.5;
        const actualDamage = Math.max(1, damage - reduction); // Minimum 1 damage

        this.health -= actualDamage;

        // Health can't go below 0
        if (this.health < 0) {
            this.health = 0;
        }

        return Math.floor(actualDamage);
    }

    /**
     * Check if enemy is still alive
     *
     * @returns {boolean} True if health > 0
     */
    isAlive() {
        return this.health > 0;
    }

    /**
     * Get health percentage (for health bar display)
     *
     * @returns {number} Value between 0 and 1
     */
    getHealthPercent() {
        return this.health / this.maxHealth;
    }
}

/**
 * Create enemies for a specific stage
 *
 * Enemies get stronger as stage number increases:
 * - Health increases by 20% per stage
 * - Attack increases by 15% per stage
 * - Defense increases by 10% per stage
 *
 * @param {number} stageLevel - Current stage number (1, 2, 3, ...)
 * @returns {Array<Enemy>} Array of 3 enemies
 */
function createEnemiesForStage(stageLevel) {
    // Base stats for stage 1
    const baseHealth = 200;
    const baseAttack = 25;
    const baseDefense = 10;

    // Scale stats based on stage (each stage is 20% harder)
    const healthMultiplier = Math.pow(1.20, stageLevel - 1);
    const attackMultiplier = Math.pow(1.15, stageLevel - 1);
    const defenseMultiplier = Math.pow(1.10, stageLevel - 1);

    // Calculate scaled stats
    const health = Math.floor(baseHealth * healthMultiplier);
    const attack = Math.floor(baseAttack * attackMultiplier);
    const defense = Math.floor(baseDefense * defenseMultiplier);

    // Enemy types based on stage
    const enemyTypes = [
        'Goblin',    // Stages 1-2
        'Orc',       // Stages 3-5
        'Skeleton',  // Stages 6-8
        'Demon',     // Stages 9-12
        'Dragon'     // Stages 13+
    ];

    // Select enemy type based on stage (higher stages = tougher enemies)
    let enemyType;
    if (stageLevel <= 2) {
        enemyType = 'Goblin';
    } else if (stageLevel <= 5) {
        enemyType = 'Orc';
    } else if (stageLevel <= 8) {
        enemyType = 'Skeleton';
    } else if (stageLevel <= 12) {
        enemyType = 'Demon';
    } else {
        enemyType = 'Dragon';
    }

    // Create 3 enemies with the same type and stats
    return [
        new Enemy(0, enemyType, health, attack, defense),
        new Enemy(1, enemyType, health, attack, defense),
        new Enemy(2, enemyType, health, attack, defense)
    ];
}

/**
 * Calculate gold reward for defeating a stage
 *
 * @param {number} stageLevel - Stage that was completed
 * @returns {number} Gold reward amount
 */
function getStageGoldReward(stageLevel) {
    // Formula: 50 * stage * 1.1^stage
    // Stage 1 = 55 gold
    // Stage 5 = 402 gold
    // Stage 10 = 1,297 gold
    return Math.floor(50 * stageLevel * Math.pow(1.1, stageLevel));
}
