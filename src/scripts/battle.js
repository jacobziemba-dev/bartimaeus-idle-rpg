/**
 * Battle System
 *
 * Manages auto-battle mechanics, combat calculations, and win/loss conditions.
 *
 * Learning Note: This is the "game logic" - it runs the battle automatically
 * and determines who wins. The UI just displays what happens here.
 */

class BattleManager {
    constructor() {
        // Battle state
        this.heroes = [];
        this.enemies = [];
        this.currentStage = 1;

        // Battle status
        this.isBattleActive = false;
        this.isPaused = false;
        this.battleResult = null; // 'victory', 'defeat', or null
        this.battleMode = 'IDLE'; // 'IDLE' or 'BOSS'

        // Attack timing (heroes/enemies attack every 1 second)
        this.attackInterval = 1000; // milliseconds
        this.timeSinceLastAttack = 0;

        // Floating damage numbers (for visual effects)
        this.damageNumbers = []; // Array of {x, y, damage, opacity, isHero}
    }

    /**
     * Start a new battle
     *
     * @param {Array<Hero>} heroes - Player's heroes
     * @param {number} stageLevel - Stage to fight
     * @param {string} mode - 'IDLE' or 'BOSS'
     */
    startBattle(heroes, stageLevel, mode = 'IDLE') {
        // Store references
        this.heroes = heroes;
        this.currentStage = stageLevel;
        this.battleMode = mode;

        // Heal all heroes to full health
        this.heroes.forEach(hero => hero.heal());

        // Create enemies for this stage
        this.enemies = createEnemiesForStage(stageLevel);

        // Reset battle state
        this.isBattleActive = true;
        this.isPaused = false;
        this.battleResult = null;
        this.timeSinceLastAttack = 0;
        this.damageNumbers = [];

        console.log(`Battle started! Stage ${stageLevel} (${mode} Mode)`);
    }

    /**
     * Update battle state (called every frame)
     *
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    update(deltaTime) {
        // Don't update if battle not active or paused
        if (!this.isBattleActive || this.isPaused) {
            return;
        }

        // Check if battle is over
        if (this.battleResult) {
            return;
        }

        // Update attack timer
        this.timeSinceLastAttack += deltaTime;

        // Determine effective interval using global speed multiplier if present
        const speed = (typeof window !== 'undefined' && window.game && window.game.speedMultiplier) ? window.game.speedMultiplier : 1;
        const effectiveInterval = this.attackInterval / (speed || 1);

        // Execute attacks when accumulated time exceeds the effective interval
        if (this.timeSinceLastAttack >= effectiveInterval) {
            this.executeRound();
            this.timeSinceLastAttack = 0;
        }

        // Update floating damage numbers
        this.updateDamageNumbers(deltaTime);

        // Check for victory/defeat
        this.checkBattleEnd();
    }

    /**
     * Execute one round of attacks (heroes attack, then enemies attack)
     */
    executeRound() {
        // Heroes attack enemies
        this.heroes.forEach(hero => {
            if (hero.isAlive()) {
                this.heroAttack(hero);
            }
        });

        // Enemies attack heroes (only if there are enemies alive)
        this.enemies.forEach(enemy => {
            if (enemy.isAlive()) {
                this.enemyAttack(enemy);
            }
        });
    }

    /**
     * Hero attacks a random living enemy
     *
     * @param {Hero} hero - Attacking hero
     */
    heroAttack(hero) {
        // Get all living enemies
        const aliveEnemies = this.enemies.filter(e => e.isAlive());

        if (aliveEnemies.length === 0) {
            return; // No enemies to attack
        }

        // Pick a random enemy
        const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];

        // Calculate damage (with ±10% variance for variety)
        const baseAttack = hero.attack;
        const variance = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        const damage = Math.floor(baseAttack * variance);

        // Apply damage to enemy
        const actualDamage = target.takeDamage(damage);

        // Create floating damage number
        this.createDamageNumber(target.x, target.y, actualDamage, false);

        console.log(`${hero.name} attacks ${target.type} for ${actualDamage} damage!`);
    }

    /**
     * Enemy attacks a random living hero
     *
     * @param {Enemy} enemy - Attacking enemy
     */
    enemyAttack(enemy) {
        // Get all living heroes
        const aliveHeroes = this.heroes.filter(h => h.isAlive());

        if (aliveHeroes.length === 0) {
            return; // No heroes to attack (shouldn't happen, but safety check)
        }

        // Pick a random hero
        const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];

        // Calculate damage (with ±10% variance)
        const baseAttack = enemy.attack;
        const variance = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        const damage = Math.floor(baseAttack * variance);

        // Apply damage to hero
        const actualDamage = target.takeDamage(damage);

        // Create floating damage number
        this.createDamageNumber(target.x, target.y, actualDamage, true);

        console.log(`${enemy.type} attacks ${target.name} for ${actualDamage} damage!`);
    }

    /**
     * Create a floating damage number for visual effect
     *
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} damage - Damage amount
     * @param {boolean} isHero - True if damage to hero (red), false if to enemy (white)
     */
    createDamageNumber(x, y, damage, isHero) {
        this.damageNumbers.push({
            x: x,
            y: y - 20, // Start above the character
            damage: damage,
            opacity: 1.0,
            lifetime: 0, // Time this number has existed
            maxLifetime: 1000, // Fade out after 1 second
            isHero: isHero
        });
    }

    /**
     * Update floating damage numbers (make them float up and fade out)
     *
     * @param {number} deltaTime - Time since last update
     */
    updateDamageNumbers(deltaTime) {
        // Update each damage number
        this.damageNumbers = this.damageNumbers.filter(num => {
            num.lifetime += deltaTime;

            // Float upward
            num.y -= 30 * (deltaTime / 1000); // Move up 30 pixels per second

            // Fade out
            num.opacity = 1 - (num.lifetime / num.maxLifetime);

            // Remove if fully faded
            return num.lifetime < num.maxLifetime;
        });
    }

    /**
     * Check if battle has ended (all heroes dead or all enemies dead)
     */
    checkBattleEnd() {
        const heroesAlive = this.heroes.some(h => h.isAlive());
        const enemiesAlive = this.enemies.some(e => e.isAlive());

        // In IDLE mode, heroes don't truly "lose", they just get back up
        // And enemies respawn instantly when dead
        if (this.battleMode === 'IDLE') {
            if (!heroesAlive) {
                // Heroes "wiped" in idle mode - just revive them
                // In a real game we might add a penalty, but for now just keep fighting
                this.heroes.forEach(h => h.heal());
                console.log('Heroes revived in Idle Mode');
            }

            if (!enemiesAlive) {
                // Enemies defeated in idle mode - spawn new wave immediately
                this.enemies = createEnemiesForStage(this.currentStage);
                console.log('New wave spawned in Idle Mode');
            }
            return;
        }

        // In BOSS mode, standard rules apply
        if (!enemiesAlive && heroesAlive) {
            // Victory!
            this.battleResult = 'victory';
            console.log('Victory!');
        } else if (!heroesAlive) {
            // Defeat
            this.battleResult = 'defeat';
            console.log('Defeat!');
        }
    }

    /**
     * Get battle result
     *
     * @returns {string|null} 'victory', 'defeat', or null
     */
    getBattleResult() {
        return this.battleResult;
    }

    /**
     * Pause/unpause the battle
     */
    togglePause() {
        this.isPaused = !this.isPaused;
    }

    /**
     * Check if battle is paused
     *
     * @returns {boolean}
     */
    getPauseState() {
        return this.isPaused;
    }

    /**
     * Get all living heroes
     *
     * @returns {Array<Hero>}
     */
    getAliveHeroes() {
        return this.heroes.filter(h => h.isAlive());
    }

    /**
     * Get all living enemies
     *
     * @returns {Array<Enemy>}
     */
    getAliveEnemies() {
        return this.enemies.filter(e => e.isAlive());
    }

    /**
     * Get damage numbers for rendering
     *
     * @returns {Array}
     */
    getDamageNumbers() {
        return this.damageNumbers;
    }

    /**
     * Reset battle (for retry)
     */
    resetBattle() {
        this.startBattle(this.heroes, this.currentStage, this.battleMode);
    }

    /**
     * Stop battle
     */
    stopBattle() {
        this.isBattleActive = false;
        this.battleResult = null;
    }
}
