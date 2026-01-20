/**
 * Skill - Represents an active ability that can be used in combat
 */
class Skill {
  constructor(id, name, description, cooldown, manaCost, effect) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.baseCooldown = cooldown; // milliseconds
    this.currentCooldown = 0;
    this.manaCost = manaCost; // For future mana system
    this.effect = effect; // Function: (caster, targets, battleManager) => void
    this.icon = null; // Set by AssetManager
  }

  /**
   * Check if skill can be used (not on cooldown)
   * @returns {boolean} True if skill is ready
   */
  canUse() {
    return this.currentCooldown <= 0;
  }

  /**
   * Use the skill
   * @param {Hero} caster - The character using the skill
   * @param {Array} targets - Array of target enemies
   * @param {BattleManager} battleManager - Reference to battle manager
   * @returns {boolean} True if skill was used successfully
   */
  use(caster, targets, battleManager) {
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
   * @param {number} deltaTime - Time since last update in milliseconds
   */
  update(deltaTime) {
    if (this.currentCooldown > 0) {
      this.currentCooldown = Math.max(0, this.currentCooldown - deltaTime);
    }
  }

  /**
   * Get cooldown as percentage (0 to 1)
   * @returns {number} Cooldown progress (1 = on cooldown, 0 = ready)
   */
  getCooldownPercent() {
    if (this.baseCooldown === 0) return 0;
    return this.currentCooldown / this.baseCooldown;
  }

  /**
   * Get remaining cooldown in seconds
   * @returns {number} Seconds remaining
   */
  getCooldownSeconds() {
    return Math.ceil(this.currentCooldown / 1000);
  }
}

/**
 * Predefined skills available in the game
 */
const SKILLS = {
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
              battleManager.createDamageNumber(enemy.x, enemy.y, actualDamage, false);
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
class SkillManager {
  constructor(hero) {
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
   * @param {string} skillId - The skill ID
   * @returns {Skill|null} The skill or null if not found
   */
  getSkillById(skillId) {
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
   * @param {number} deltaTime - Time since last update in milliseconds
   */
  update(deltaTime) {
    this.skills.forEach(skill => skill.update(deltaTime));
  }

  /**
   * Use a skill by ID
   * @param {string} skillId - The skill to use
   * @param {Array} targets - Array of target enemies
   * @param {BattleManager} battleManager - Reference to battle manager
   * @returns {boolean} True if skill was used successfully
   */
  useSkill(skillId, targets, battleManager) {
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
   * @returns {Array} Array of Skill objects
   */
  getSkills() {
    return this.skills;
  }

  /**
   * Unlock a new skill for the hero
   * @param {string} skillId - The skill ID to unlock
   */
  unlockSkill(skillId) {
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
   * @param {string} skillId - The skill ID
   * @returns {Skill|null} The skill or null if not found
   */
  getSkill(skillId) {
    return this.skills.find(s => s.id === skillId) || null;
  }
}