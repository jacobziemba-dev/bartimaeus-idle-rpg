/**
 * Battle System - Horde Mode
 *
 * Manages auto-battle with a single hero vs continuous waves of enemies
 * Hero fights 3-5 enemies at once, defeated enemies respawn continuously
 */

class BattleManager {
  constructor() {
    // Battle state - Single hero vs enemy horde
    this.hero = null; // Single hero reference
    this.enemies = [];
    this.currentStage = 1;
    this.currentWave = 1;
    this.enemiesDefeatedThisStage = 0;

    // Enemy spawn settings
    this.maxEnemies = 3; // Start with 3, scales to 5 based on stage
    this.battleMode = 'HORDE'; // Always horde mode now

    // Battle status
    this.isBattleActive = false;
    this.isPaused = false;

    // Attack timing (attacks every 1 second)
    this.attackInterval = 1000; // milliseconds
    this.timeSinceLastAttack = 0;

    // Floating damage numbers (for visual effects)
    this.damageNumbers = []; // Array of {x, y, damage, opacity, isHeal}

    // References to other systems (set externally)
    this.adventureLog = null; // AdventureLog instance
    this.skillManager = null; // SkillManager instance
  }

  /**
   * Start a new battle in horde mode
   *
   * @param {Hero} hero - The player's hero
   * @param {number} stageLevel - Stage to fight
   */
  startBattle(hero, stageLevel) {
    // Store references
    this.hero = hero;
    this.currentStage = stageLevel;
    this.currentWave = 1;
    this.enemiesDefeatedThisStage = 0;

    // Scale max enemies with stage (3 to 5)
    this.maxEnemies = Math.min(5, 3 + Math.floor(stageLevel / 5));

    // Heal hero to full health
    this.hero.heal();

    // Spawn initial wave
    this.spawnWave();

    // Reset battle state
    this.isBattleActive = true;
    this.isPaused = false;
    this.timeSinceLastAttack = 0;
    this.damageNumbers = [];

    // Log to adventure log
    if (this.adventureLog) {
      this.adventureLog.logStage(stageLevel);
      this.adventureLog.logWave(this.currentWave);
    }

    console.log(`Horde Battle started! Stage ${stageLevel} - ${this.maxEnemies} enemies`);
  }

  /**
   * Spawn a new wave of enemies
   * Fills enemy array up to maxEnemies
   */
  spawnWave() {
    while (this.enemies.length < this.maxEnemies) {
      const enemy = this.createEnemyForStage(this.currentStage);
      this.enemies.push(enemy);
    }

    // Log new wave
    if (this.adventureLog && this.currentWave > 1) {
      this.adventureLog.logWave(this.currentWave);
    }
  }

  /**
   * Create a single enemy for the current stage
   *
   * @param {number} stageLevel - The stage level
   * @returns {Enemy} New enemy
   */
  createEnemyForStage(stageLevel) {
    // Base stats
    const baseHealth = 200;
    const baseAttack = 25;
    const baseDefense = 10;

    // Scaling multipliers (same as original createEnemiesForStage)
    const healthMultiplier = Math.pow(1.20, stageLevel - 1); // 20% per stage
    const attackMultiplier = Math.pow(1.15, stageLevel - 1); // 15% per stage
    const defenseMultiplier = Math.pow(1.10, stageLevel - 1); // 10% per stage

    const health = Math.floor(baseHealth * healthMultiplier);
    const attack = Math.floor(baseAttack * attackMultiplier);
    const defense = Math.floor(baseDefense * defenseMultiplier);

    // Determine enemy type based on stage
    let enemyType = 'Goblin';
    if (stageLevel <= 2) enemyType = 'Goblin';
    else if (stageLevel <= 5) enemyType = 'Orc';
    else if (stageLevel <= 8) enemyType = 'Skeleton';
    else if (stageLevel <= 12) enemyType = 'Demon';
    else enemyType = 'Dragon';

    return new Enemy(this.enemies.length, enemyType, health, attack, defense);
  }

  /**
   * Update battle state (called every frame)
   *
   * @param {number} deltaTime - Time since last update in milliseconds
   */
  update(deltaTime) {
    if (!this.isBattleActive || this.isPaused || !this.hero) {
      return;
    }

    // Update skill cooldowns
    if (this.skillManager) {
      this.skillManager.update(deltaTime);
    }

    // Update attack timer
    this.timeSinceLastAttack += deltaTime;

    // Get speed multiplier from global game object
    const speed = (typeof window !== 'undefined' && window.game && window.game.speedMultiplier)
      ? window.game.speedMultiplier
      : 1;
    const effectiveInterval = this.attackInterval / speed;

    // Execute attacks when interval reached
    if (this.timeSinceLastAttack >= effectiveInterval) {
      this.executeRound();
      this.timeSinceLastAttack = 0;
    }

    // Update floating damage numbers
    this.updateDamageNumbers(deltaTime);

    // Check for defeated enemies and respawn
    this.checkEnemyRespawn();

    // Check if hero died (respawn in horde mode)
    if (!this.hero.isAlive()) {
      this.respawnHero();
    }
  }

  /**
   * Execute one round of attacks
   */
  executeRound() {
    // Hero auto-attacks
    if (this.hero.isAlive()) {
      this.heroAttack(this.hero);
    }

    // All enemies attack
    this.enemies.forEach(enemy => {
      if (enemy.isAlive()) {
        this.enemyAttack(enemy);
      }
    });
  }

  /**
   * Hero attacks a random living enemy
   *
   * @param {Hero} hero - The hero
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

    // Log to adventure log (less frequently to avoid spam)
    if (this.adventureLog && Math.random() < 0.1) { // 10% chance to log
      this.adventureLog.logCombat(hero.name, target.type, actualDamage);
    }
  }

  /**
   * Enemy attacks the hero
   *
   * @param {Enemy} enemy - Attacking enemy
   */
  enemyAttack(enemy) {
    if (!this.hero.isAlive()) {
      return; // Hero dead
    }

    // Calculate damage (with ±10% variance)
    const baseAttack = enemy.attack;
    const variance = 0.9 + Math.random() * 0.2;
    const damage = Math.floor(baseAttack * variance);

    // Apply damage to hero
    const actualDamage = this.hero.takeDamage(damage);

    // Create floating damage number
    this.createDamageNumber(this.hero.x, this.hero.y, actualDamage, true);

    // Log occasionally
    if (this.adventureLog && Math.random() < 0.05) { // 5% chance
      this.adventureLog.logCombat(enemy.type, this.hero.name, actualDamage);
    }
  }

  /**
   * Check for defeated enemies and respawn new ones
   */
  checkEnemyRespawn() {
    // Remove dead enemies and count defeats
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (!this.enemies[i].isAlive()) {
        const defeatedEnemy = this.enemies[i];

        // Log defeat
        if (this.adventureLog && Math.random() < 0.2) { // 20% chance to log
          this.adventureLog.logEnemyDefeated(defeatedEnemy.type);
        }

        // Remove from array
        this.enemies.splice(i, 1);
        this.enemiesDefeatedThisStage++;
      }
    }

    // Spawn new wave when below max enemies
    if (this.enemies.length < this.maxEnemies) {
      this.currentWave++;
      this.spawnWave();
    }
  }

  /**
   * Respawn hero when defeated
   */
  respawnHero() {
    this.hero.heal();

    if (this.adventureLog) {
      this.adventureLog.logRespawn(this.hero.name);
    }

    console.log(`${this.hero.name} respawned!`);
  }

  /**
   * Create a floating damage number for visual effect
   *
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} damage - Damage/heal amount
   * @param {boolean} isHeal - True if healing (green), false if damage (red/white)
   */
  createDamageNumber(x, y, damage, isHeal) {
    this.damageNumbers.push({
      x: x,
      y: y - 20, // Start above the character
      damage: Math.floor(damage),
      opacity: 1.0,
      lifetime: 0,
      maxLifetime: 1000, // Fade out after 1 second
      isHeal: isHeal
    });
  }

  /**
   * Update floating damage numbers (make them float up and fade out)
   *
   * @param {number} deltaTime - Time since last update
   */
  updateDamageNumbers(deltaTime) {
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
   * Get damage numbers for rendering
   *
   * @returns {Array}
   */
  getDamageNumbers() {
    return this.damageNumbers;
  }

  /**
   * Stop battle
   */
  stopBattle() {
    this.isBattleActive = false;
  }
}
