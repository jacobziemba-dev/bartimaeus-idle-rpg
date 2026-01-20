/**
 * Enemy Class
 *
 * Represents an enemy that heroes fight against.
 * Enemies are generated based on the current stage level.
 *
 * Learning Note: Very similar to Hero class, but enemies don't level up
 * individually - they scale with the stage number instead.
 */

import type { EnemyType } from '../types';

export class Enemy {
  id: number;
  type: EnemyType;

  // Stats
  maxHealth: number;
  health: number;
  attack: number;
  defense: number;

  // Visual properties
  color: string;
  x: number;
  y: number;

  /**
   * Constructor - creates a new enemy
   *
   * @param id - Enemy identifier
   * @param type - Enemy type name (Goblin, Orc, Demon, etc.)
   * @param health - Total health points
   * @param attack - Attack damage
   * @param defense - Defense stat
   */
  constructor(id: number, type: EnemyType, health: number, attack: number, defense: number) {
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
  getColorByType(): string {
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
   * @param damage - Amount of damage to take
   * @returns Actual damage taken (after defense)
   */
  takeDamage(damage: number): number {
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
   * @returns True if health > 0
   */
  isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * Get health percentage (for health bar display)
   *
   * @returns Value between 0 and 1
   */
  getHealthPercent(): number {
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
 * @param stageLevel - Current stage number (1, 2, 3, ...)
 * @returns Array of 3 enemies
 */
export function createEnemiesForStage(stageLevel: number): Enemy[] {
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

  // Select enemy type based on stage (higher stages = tougher enemies)
  let enemyType: EnemyType;
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
 * @param stageLevel - Stage that was completed
 * @returns Gold reward amount
 */
export function getStageGoldReward(stageLevel: number): number {
  // Formula: 50 * stage * 1.1^stage
  // Stage 1 = 55 gold
  // Stage 5 = 402 gold
  // Stage 10 = 1,297 gold
  return Math.floor(50 * stageLevel * Math.pow(1.1, stageLevel));
}

/**
 * Calculate gem reward for defeating a stage
 *
 * @param stageLevel - Stage that was completed
 * @returns Gem reward amount
 */
export function getStageGemReward(stageLevel: number): number {
  // Formula: 2 * stage (gems are rarer than gold)
  // Stage 1 = 2 gems
  // Stage 5 = 10 gems
  // Stage 10 = 20 gems
  return stageLevel * 2;
}
