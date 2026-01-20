/**
 * Battle System - Horde Mode
 *
 * Manages auto-battle with a single hero vs continuous waves of enemies
 * Hero fights 3-5 enemies at once, defeated enemies respawn continuously
 */

import type { Hero } from './hero';
import type { Enemy } from './enemy';
import { Enemy as EnemyClass } from './enemy';
import type { AdventureLog } from './adventureLog';
import type { SkillManager } from './skills';
import type { DamageNumber, EnemyType, BattleMode } from '../types';

export class BattleManager {
  // Battle state - Single hero vs enemy horde
  hero: Hero | null = null;
  enemies: Enemy[] = [];
  currentStage: number = 1;
  currentWave: number = 1;
  enemiesDefeatedThisStage: number = 0;

  // Enemy spawn settings
  maxEnemies: number = 3; // Start with 3, scales to 5 based on stage
  battleMode: BattleMode = 'HORDE';

  // Battle status
  isBattleActive: boolean = false;
  isPaused: boolean = false;

  // Attack timing (attacks every 1 second)
  attackInterval: number = 1000; // milliseconds
  timeSinceLastAttack: number = 0;

  // Floating damage numbers (for visual effects)
  damageNumbers: DamageNumber[] = [];

  // References to other systems (set externally)
  adventureLog: AdventureLog | null = null;
  skillManager: SkillManager | null = null;

  /**
   * Start a new battle in horde mode
   *
   * @param hero - The player's hero
   * @param stageLevel - Stage to fight
   */
  startBattle(hero: Hero, stageLevel: number): void {
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
  spawnWave(): void {
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
   * @param stageLevel - The stage level
   * @returns New enemy
   */
  createEnemyForStage(stageLevel: number): Enemy {
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
    let enemyType: EnemyType = 'Goblin';
    if (stageLevel <= 2) enemyType = 'Goblin';
    else if (stageLevel <= 5) enemyType = 'Orc';
    else if (stageLevel <= 8) enemyType = 'Skeleton';
    else if (stageLevel <= 12) enemyType = 'Demon';
    else enemyType = 'Dragon';

    return new EnemyClass(this.enemies.length, enemyType, health, attack, defense);
  }

  /**
   * Update battle state (called every frame)
   *
   * @param deltaTime - Time since last update in milliseconds
   */
  update(deltaTime: number): void {
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
    const speed = (typeof window !== 'undefined' && (window as any).game && (window as any).game.speedMultiplier)
      ? (window as any).game.speedMultiplier
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
  executeRound(): void {
    // Hero auto-attacks
    if (this.hero && this.hero.isAlive()) {
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
   * @param hero - The hero
   */
  heroAttack(hero: Hero): void {
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
   * @param enemy - Attacking enemy
   */
  enemyAttack(enemy: Enemy): void {
    if (!this.hero || !this.hero.isAlive()) {
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
  checkEnemyRespawn(): void {
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
  respawnHero(): void {
    if (!this.hero) return;

    this.hero.heal();

    if (this.adventureLog) {
      this.adventureLog.logRespawn(this.hero.name);
    }

    console.log(`${this.hero.name} respawned!`);
  }

  /**
   * Create a floating damage number for visual effect
   *
   * @param x - X position
   * @param y - Y position
   * @param damage - Damage/heal amount
   * @param isHeal - True if healing (green), false if damage (red/white)
   */
  createDamageNumber(x: number, y: number, damage: number, isHeal: boolean): void {
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
   * @param deltaTime - Time since last update
   */
  updateDamageNumbers(deltaTime: number): void {
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
  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  /**
   * Check if battle is paused
   *
   * @returns boolean
   */
  getPauseState(): boolean {
    return this.isPaused;
  }

  /**
   * Get damage numbers for rendering
   *
   * @returns Array of damage numbers
   */
  getDamageNumbers(): DamageNumber[] {
    return this.damageNumbers;
  }

  /**
   * Stop battle
   */
  stopBattle(): void {
    this.isBattleActive = false;
  }
}
