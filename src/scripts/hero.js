/**
 * Hero Class
 *
 * Represents a playable hero character in the game.
 * Heroes fight automatically in battles and can be upgraded.
 *
 * Learning Note: This is a JavaScript class - a blueprint for creating hero objects
 */

class Hero {
    /**
     * Constructor - runs when you create a new hero: new Hero(...)
     *
     * @param {number} id - Unique identifier (0, 1, 2 for our 3 heroes)
     * @param {string} name - Hero's name
     * @param {string} role - Tank, Damage, or Support
     * @param {number} baseHealth - Starting health points
     * @param {number} baseAttack - Starting attack damage
     * @param {number} baseDefense - Starting defense (reduces damage taken)
     */
    constructor(id, name, role, baseHealth, baseAttack, baseDefense) {
        this.id = id;
        this.name = name;
        this.role = role;

        // Level system
        this.level = 1;

        // Base stats (never change)
        this.baseHealth = baseHealth;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;

        // Current stats (calculated from base + level)
        this.maxHealth = this.calculateMaxHealth();
        this.health = this.maxHealth; // Start at full health
        this.attack = this.calculateAttack();
        this.defense = this.calculateDefense();

        // Skill system (new for horde mode)
        this.unlockedSkills = ['fireball']; // Default starting skill

        // Visual properties
        this.color = this.getColorByRole();
        this.x = 0; // Position on canvas (set by UI)
        this.y = 0;
    }

    /**
     * Calculate max health based on level
     * Formula: baseHealth * (1 + (level - 1) * 0.15)
     * Each level gives +15% more health
     */
    calculateMaxHealth() {
        return Math.floor(this.baseHealth * (1 + (this.level - 1) * 0.15));
    }

    /**
     * Calculate attack damage based on level
     * Formula: baseAttack * (1 + (level - 1) * 0.10)
     * Each level gives +10% more attack
     */
    calculateAttack() {
        return Math.floor(this.baseAttack * (1 + (this.level - 1) * 0.10));
    }

    /**
     * Calculate defense based on level
     * Formula: baseDefense * (1 + (level - 1) * 0.08)
     * Each level gives +8% more defense
     */
    calculateDefense() {
        return Math.floor(this.baseDefense * (1 + (this.level - 1) * 0.08));
    }

    /**
     * Get hero color based on their role
     * Tank = Blue, Damage = Red, Support = Green
     */
    getColorByRole() {
        switch(this.role) {
            case 'Tank': return '#3b82f6'; // Blue
            case 'Damage': return '#ef4444'; // Red
            case 'Support': return '#10b981'; // Green
            default: return '#6366f1'; // Purple default
        }
    }

    /**
     * Take damage from an enemy attack
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
     * Check if hero is still alive
     *
     * @returns {boolean} True if health > 0
     */
    isAlive() {
        return this.health > 0;
    }

    /**
     * Restore hero to full health
     * Used at the start of each battle
     */
    heal() {
        this.health = this.maxHealth;
    }

    /**
     * Upgrade the hero to the next level
     * Recalculates all stats based on new level
     */
    upgrade() {
        this.level++;

        // Recalculate stats
        const oldMaxHealth = this.maxHealth;
        this.maxHealth = this.calculateMaxHealth();
        this.attack = this.calculateAttack();
        this.defense = this.calculateDefense();

        // Increase current health by the same amount max health increased
        const healthIncrease = this.maxHealth - oldMaxHealth;
        this.health += healthIncrease;
    }

    /**
     * Calculate cost to upgrade this hero
     * Formula: 100 * level^1.5 (gets more expensive each level)
     *
     * @returns {number} Gold cost to upgrade
     */
    getUpgradeCost() {
        return Math.floor(100 * Math.pow(this.level, 1.5));
    }

    /**
     * Get health percentage (for health bar display)
     *
     * @returns {number} Value between 0 and 1
     */
    getHealthPercent() {
        return this.health / this.maxHealth;
    }

    /**
     * Unlock a new skill for the hero
     *
     * @param {string} skillId - The skill ID to unlock
     */
    unlockSkill(skillId) {
        if (!this.unlockedSkills.includes(skillId)) {
            this.unlockedSkills.push(skillId);
        }
    }

    /**
     * Check if hero has a specific skill unlocked
     *
     * @param {string} skillId - The skill ID to check
     * @returns {boolean} True if skill is unlocked
     */
    hasSkill(skillId) {
        return this.unlockedSkills.includes(skillId);
    }

    /**
     * Serialize hero to object for saving
     *
     * @returns {object} Hero data that can be saved to LocalStorage
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            role: this.role,
            level: this.level,
            baseHealth: this.baseHealth,
            baseAttack: this.baseAttack,
            baseDefense: this.baseDefense,
            unlockedSkills: this.unlockedSkills
        };
    }

    /**
     * Create a hero from saved data
     *
     * @param {object} data - Saved hero data
     * @returns {Hero} Reconstructed hero
     */
    static fromJSON(data) {
        const hero = new Hero(
            data.id,
            data.name,
            data.role,
            data.baseHealth,
            data.baseAttack,
            data.baseDefense
        );

        // Restore level and recalculate stats
        hero.level = data.level;
        hero.maxHealth = hero.calculateMaxHealth();
        hero.health = hero.maxHealth;
        hero.attack = hero.calculateAttack();
        hero.defense = hero.calculateDefense();

        // Restore unlocked skills
        hero.unlockedSkills = data.unlockedSkills || ['fireball'];

        return hero;
    }
}

/**
 * Create the starting hero (Bartimaeus)
 * In horde mode, we start with a single hero
 *
 * @returns {Hero} Bartimaeus the Tank
 */
function createStartingHeroes() {
    // Tank: High HP, balanced damage and defense for solo survival
    return new Hero(0, 'Bartimaeus', 'Tank', 500, 30, 25);
}
