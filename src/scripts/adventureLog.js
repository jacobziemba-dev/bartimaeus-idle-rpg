/**
 * AdventureLog - Text-based event feed for tracking game events
 * Displays combat, loot, progression, and story events in right sidebar
 */
class AdventureLog {
  constructor(maxEntries = 100) {
    this.entries = [];
    this.maxEntries = maxEntries;
    this.container = null; // Set when DOM is ready
  }

  /**
   * Initialize the log with DOM element
   * Call this after DOM is loaded
   */
  init() {
    this.container = document.getElementById('adventure-log');
    if (!this.container) {
      console.warn('Adventure log container not found');
    }
  }

  /**
   * Add a new entry to the log
   * @param {string} type - Entry type: 'combat', 'loot', 'stage', 'skill', 'story'
   * @param {string} message - The log message
   */
  add(type, message) {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const entry = {
      type: type,
      message: message,
      timestamp: timestamp,
      id: Date.now() + Math.random()
    };

    this.entries.push(entry);

    // Limit entries to max
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    // Render to DOM
    if (this.container) {
      this.renderEntry(entry);
    }
  }

  /**
   * Render a single entry to the DOM
   * @param {object} entry - The entry to render
   */
  renderEntry(entry) {
    if (!this.container) return;

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${entry.type}`;
    logEntry.dataset.id = entry.id;

    logEntry.innerHTML = `
      <span class="log-time">[${entry.timestamp}]</span>
      <span class="log-message">${entry.message}</span>
    `;

    // Add to container (newest at top)
    this.container.insertBefore(logEntry, this.container.firstChild);

    // Limit DOM entries to prevent memory bloat
    while (this.container.children.length > this.maxEntries) {
      this.container.removeChild(this.container.lastChild);
    }
  }

  /**
   * Clear all log entries
   */
  clear() {
    this.entries = [];

    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Get all entries
   * @returns {Array} Array of log entries
   */
  getEntries() {
    return this.entries;
  }

  // Convenience methods for common log types

  /**
   * Log combat damage
   * @param {string} attacker - Name of attacker
   * @param {string} target - Name of target
   * @param {number} damage - Damage amount
   */
  logCombat(attacker, target, damage) {
    this.add('combat', `${attacker} dealt ${damage} damage to ${target}`);
  }

  /**
   * Log enemy defeated
   * @param {string} enemyType - Type of enemy
   */
  logEnemyDefeated(enemyType) {
    this.add('combat', `💀 Defeated ${enemyType}`);
  }

  /**
   * Log loot obtained
   * @param {string} itemName - Name of item/resource
   * @param {number} quantity - Amount obtained
   */
  logLoot(itemName, quantity) {
    this.add('loot', `💰 Obtained ${quantity}x ${itemName}`);
  }

  /**
   * Log stage progression
   * @param {number} stageNumber - The new stage number
   */
  logStage(stageNumber) {
    this.add('stage', `🎯 Reached Stage ${stageNumber}!`);
  }

  /**
   * Log wave start
   * @param {number} waveNumber - The wave number
   */
  logWave(waveNumber) {
    this.add('combat', `⚔️ Wave ${waveNumber} incoming!`);
  }

  /**
   * Log skill usage
   * @param {string} casterName - Name of skill user
   * @param {string} skillName - Name of skill
   * @param {number} damage - Damage dealt (if applicable)
   */
  logSkill(casterName, skillName, damage = null) {
    const damageText = damage !== null ? ` for ${damage} damage` : '';
    this.add('skill', `✨ ${casterName} cast ${skillName}${damageText}!`);
  }

  /**
   * Log hero respawn
   * @param {string} heroName - Name of hero
   */
  logRespawn(heroName) {
    this.add('story', `💫 ${heroName} respawned and continues the fight!`);
  }

  /**
   * Log upgrade
   * @param {string} upgradeType - Type of upgrade
   * @param {number} newLevel - New level after upgrade
   */
  logUpgrade(upgradeType, newLevel) {
    this.add('stage', `⬆️ ${upgradeType} upgraded to level ${newLevel}!`);
  }

  /**
   * Log story event
   * @param {string} message - Story message
   */
  logStory(message) {
    this.add('story', message);
  }

  /**
   * Log migration message
   * @param {string} message - Migration message
   */
  logMigration(message) {
    this.add('story', `🔄 ${message}`);
  }
}