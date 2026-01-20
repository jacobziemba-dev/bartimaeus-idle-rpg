/**
 * Skill System - Active abilities for combat
 */

import type { Hero } from './hero';
import type { Enemy } from './enemy';

// Forward declaration for BattleManager type
interface BattleManager {
  createDamageNumber?: (x: number, y: number, damage: number, isHeal: boolean) => void;
  adventureLog?: any;
}

type SkillEffect = (caster: Hero, targets: Enemy[], battleManager: BattleManager) => void;

/**
 * Skill - Represents an active ability that can be used in combat
 */
export class Skill {
  id: string;
  name: string;
  description: string;
  baseCooldown: number; // milliseconds
  currentCooldown: number = 0;
  manaCost: number; // For future mana system
  effect: SkillEffect;
  icon: HTMLImageElement | null = null; // Set by AssetManager

  constructor(id: string, name: string, description: string, cooldown: number, manaCost: number, effect: SkillEffect) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.baseCooldown = cooldown;
    this.manaCost = manaCost;
    this.effect = effect;
  }

  /**
   * Check if skill can be used (not on cooldown)
   * @returns True if skill is ready
   */
  canUse(): boolean {
    return this.currentCooldown <= 0;
  }

  /**
   * Use the skill
   * @param caster - The character using the skill
   * @param targets - Array of target enemies
   * @param battleManager - Reference to battle manager
   * @returns True if skill was used successfully
   */
  use(caster: Hero, targets: Enemy[], battleManager: BattleManager): boolean {
    if (!this.canUse()) {
      return false;
    }

    // Execute skill effect
    this.effect(caster, targets, battleManager);

    // Start cooldown
    this.currentCooldown = this.baseCooldown;

    return true;
  }

  /**
   * Update cooldown timer
   * @param deltaTime - Time since last update in milliseconds
   */
  update(deltaTime: number): void {
    if (this.currentCooldown > 0) {
      this.currentCooldown = Math.max(0, this.currentCooldown - deltaTime);
    }
  }

  /**
   * Get cooldown as percentage (0 to 1)
   * @returns Cooldown progress (1 = on cooldown, 0 = ready)
   */
  getCooldownPercent(): number {
    if (this.baseCooldown === 0) return 0;
    return this.currentCooldown / this.baseCooldown;
  }

  /**
   * Get remaining cooldown in seconds
   * @returns Seconds remaining
   */
  getCooldownSeconds(): number {
    return Math.ceil(this.currentCooldown / 1000);
  }
}

/**
 * Predefined skills available in the game
 */
export const SKILLS = {
  FIREBALL: new Skill(
    'fireball',
    'Fireball',
    'Deal 200% damage to target enemy',
    5000, // 5 second cooldown
    0,
    (caster, targets, battleManager) => {
      if (targets.length === 0) return;

      // Target first enemy in array
      const target = targets[0];
      const baseDamage = Math.floor(caster.attack * 2);

      // Apply damage variance (0.9 to 1.1)
      const variance = 0.9 + Math.random() * 0.2;
      const damage = Math.floor(baseDamage * variance);

      // Deal damage
      const actualDamage = target.takeDamage(damage);

      // Create damage number
      if (battleManager.createDamageNumber) {
        battleManager.createDamageNumber(target.x, target.y, actualDamage, false);
      }

      // Log to adventure log
      if (battleManager.adventureLog) {
        battleManager.adventureLog.logSkill(caster.name, 'Fireball', actualDamage);
      }
    }
  ),

  CLEAVE: new Skill(
    'cleave',
    'Cleave',
    'Deal 80% damage to all enemies',
    8000, // 8 second cooldown
    0,
    (caster, targets, battleManager) => {
      let totalDamage = 0;
      let enemiesHit = 0;

      targets.forEach(enemy => {
        if (enemy.isAlive()) {
          const baseDamage = Math.floor(caster.attack * 0.8);

          // Apply damage variance
          const variance = 0.9 + Math.random() * 0.2;
          const damage = Math.floor(baseDamage * variance);

          // Deal damage
          const actualDamage = enemy.takeDamage(damage);
          totalDamage += actualDamage;
          enemiesHit++;

          // Create damage number
          if (battleManager.createDamageNumber) {
            // Stagger damage numbers slightly for visual clarity
            setTimeout(() => {
              battleManager.createDamageNumber!(enemy.x, enemy.y, actualDamage, false);
            }, enemiesHit * 50);
          }
        }
      });

      // Log to adventure log
      if (battleManager.adventureLog) {
        battleManager.adventureLog.logSkill(caster.name, 'Cleave', totalDamage);
      }
    }
  ),

  HEAL: new Skill(
    'heal',
    'Second Wind',
    'Restore 30% of max health',
    15000, // 15 second cooldown
    0,
    (caster, targets, battleManager) => {
      const healAmount = Math.floor(caster.maxHealth * 0.3);
      const oldHealth = caster.health;

      caster.health = Math.min(caster.maxHealth, caster.health + healAmount);

      const actualHeal = caster.health - oldHealth;

      // Create heal number (positive damage number)
      if (battleManager.createDamageNumber) {
        battleManager.createDamageNumber(caster.x, caster.y, actualHeal, true);
      }

      // Log to adventure log
      if (battleManager.adventureLog) {
        battleManager.adventureLog.add('skill', `💚 ${caster.name} healed for ${actualHeal} HP!`);
      }
    }
  )
};

/**
 * SkillManager - Manages a hero's unlocked skills and cooldowns
 */
export class SkillManager {
  private hero: Hero;
  private skills: Skill[];

  constructor(hero: Hero) {
    this.hero = hero;

    // Initialize with unlocked skills from hero
    // Default to just Fireball if no skills unlocked
    const unlockedSkillIds = hero.unlockedSkills || ['fireball'];

    this.skills = [];
    unlockedSkillIds.forEach(skillId => {
      const skill = this.getSkillById(skillId);
      if (skill) {
        this.skills.push(skill);
      }
    });

    // If no skills were added, add Fireball as default
    if (this.skills.length === 0) {
      this.skills.push(SKILLS.FIREBALL);
    }
  }

  /**
   * Get skill definition by ID
   * @param skillId - The skill ID
   * @returns The skill or null if not found
   */
  getSkillById(skillId: string): Skill | null {
    switch (skillId.toLowerCase()) {
      case 'fireball':
        return SKILLS.FIREBALL;
      case 'cleave':
        return SKILLS.CLEAVE;
      case 'heal':
        return SKILLS.HEAL;
      default:
        console.warn(`Unknown skill ID: ${skillId}`);
        return null;
    }
  }

  /**
   * Update all skill cooldowns
   * @param deltaTime - Time since last update in milliseconds
   */
  update(deltaTime: number): void {
    this.skills.forEach(skill => skill.update(deltaTime));
  }

  /**
   * Use a skill by ID
   * @param skillId - The skill to use
   * @param targets - Array of target enemies
   * @param battleManager - Reference to battle manager
   * @returns True if skill was used successfully
   */
  useSkill(skillId: string, targets: Enemy[], battleManager: BattleManager): boolean {
    const skill = this.skills.find(s => s.id === skillId);

    if (!skill) {
      console.warn(`Skill not found: ${skillId}`);
      return false;
    }

    if (!skill.canUse()) {
      console.log(`Skill on cooldown: ${skill.name} (${skill.getCooldownSeconds()}s remaining)`);
      return false;
    }

    return skill.use(this.hero, targets, battleManager);
  }

  /**
   * Get all skills
   * @returns Array of Skill objects
   */
  getSkills(): Skill[] {
    return this.skills;
  }

  /**
   * Unlock a new skill for the hero
   * @param skillId - The skill ID to unlock
   */
  unlockSkill(skillId: string): void {
    // Check if already unlocked
    if (this.skills.find(s => s.id === skillId)) {
      console.log(`Skill already unlocked: ${skillId}`);
      return;
    }

    const skill = this.getSkillById(skillId);
    if (skill) {
      this.skills.push(skill);

      // Update hero's unlocked skills
      if (!this.hero.unlockedSkills) {
        this.hero.unlockedSkills = [];
      }
      if (!this.hero.unlockedSkills.includes(skillId)) {
        this.hero.unlockedSkills.push(skillId);
      }

      console.log(`Unlocked skill: ${skill.name}`);
    }
  }

  /**
   * Get skill by ID from unlocked skills
   * @param skillId - The skill ID
   * @returns The skill or null if not found
   */
  getSkill(skillId: string): Skill | null {
    return this.skills.find(s => s.id === skillId) || null;
  }
}
