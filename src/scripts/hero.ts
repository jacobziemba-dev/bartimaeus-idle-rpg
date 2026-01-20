/**
 * Hero Class
 *
 * Represents a playable hero character in the game.
 * Heroes fight automatically in battles and can be upgraded.
 *
 * Learning Note: This is a JavaScript class - a blueprint for creating hero objects
 */

import type { HeroRole, HeroData } from '../types';

export class Hero {
  id: number;
  name: string;
  role: HeroRole;
  level: number;

  // Base stats (never change)
  baseHealth: number;
  baseAttack: number;
  baseDefense: number;

  // Current stats (calculated from base + level)
  maxHealth: number;
  health: number;
  attack: number;
  defense: number;

  // Skill system
  unlockedSkills: string[];

  // Visual properties
  color: string;
  x: number;
  y: number;

  /**
   * Constructor - runs when you create a new hero: new Hero(...)
   *
   * @param id - Unique identifier (0, 1, 2 for our 3 heroes)
   * @param name - Hero's name
   * @param role - Tank, Damage, or Support
   * @param baseHealth - Starting health points
   * @param baseAttack - Starting attack damage
   * @param baseDefense - Starting defense (reduces damage taken)
   */
  constructor(id: number, name: string, role: HeroRole, baseHealth: number, baseAttack: number, baseDefense: number) {
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
  calculateMaxHealth(): number {
    return Math.floor(this.baseHealth * (1 + (this.level - 1) * 0.15));
  }

  /**
   * Calculate attack damage based on level
   * Formula: baseAttack * (1 + (level - 1) * 0.10)
   * Each level gives +10% more attack
   */
  calculateAttack(): number {
    return Math.floor(this.baseAttack * (1 + (this.level - 1) * 0.10));
  }

  /**
   * Calculate defense based on level
   * Formula: baseDefense * (1 + (level - 1) * 0.08)
   * Each level gives +8% more defense
   */
  calculateDefense(): number {
    return Math.floor(this.baseDefense * (1 + (this.level - 1) * 0.08));
  }

  /**
   * Get hero color based on their role
   * Tank = Blue, Damage = Red, Support = Green
   */
  getColorByRole(): string {
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
   * Check if hero is still alive
   *
   * @returns True if health > 0
   */
  isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * Restore hero to full health
   * Used at the start of each battle
   */
  heal(): void {
    this.health = this.maxHealth;
  }

  /**
   * Upgrade the hero to the next level
   * Recalculates all stats based on new level
   */
  upgrade(): void {
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
   * @returns Gold cost to upgrade
   */
  getUpgradeCost(): number {
    return Math.floor(100 * Math.pow(this.level, 1.5));
  }

  /**
   * Get health percentage (for health bar display)
   *
   * @returns Value between 0 and 1
   */
  getHealthPercent(): number {
    return this.health / this.maxHealth;
  }

  /**
   * Unlock a new skill for the hero
   *
   * @param skillId - The skill ID to unlock
   */
  unlockSkill(skillId: string): void {
    if (!this.unlockedSkills.includes(skillId)) {
      this.unlockedSkills.push(skillId);
    }
  }

  /**
   * Check if hero has a specific skill unlocked
   *
   * @param skillId - The skill ID to check
   * @returns True if skill is unlocked
   */
  hasSkill(skillId: string): boolean {
    return this.unlockedSkills.includes(skillId);
  }

  /**
   * Serialize hero to object for saving
   *
   * @returns Hero data that can be saved to LocalStorage
   */
  toJSON(): HeroData {
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
   * @param data - Saved hero data
   * @returns Reconstructed hero
   */
  static fromJSON(data: HeroData): Hero {
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
 * @returns Bartimaeus the Tank
 */
export function createStartingHeroes(): Hero {
  // Tank: High HP, balanced damage and defense for solo survival
  return new Hero(0, 'Bartimaeus', 'Tank', 500, 30, 25);
}
