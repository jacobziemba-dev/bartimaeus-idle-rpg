/**
 * AdventureLog - Text-based event feed for tracking game events
 * Displays combat, loot, progression, and story events in right sidebar
 */

type LogEntryType = 'combat' | 'loot' | 'stage' | 'skill' | 'story';

interface LogEntry {
  type: LogEntryType;
  message: string;
  timestamp: string;
  id: number;
}

export class AdventureLog {
  private entries: LogEntry[] = [];
  private maxEntries: number;
  private container: HTMLElement | null = null;

  constructor(maxEntries: number = 100) {
    this.maxEntries = maxEntries;
  }

  /**
   * Initialize the log with DOM element
   * Call this after DOM is loaded
   */
  init(): void {
    this.container = document.getElementById('adventure-log');
    if (!this.container) {
      console.warn('Adventure log container not found');
    }
  }

  /**
   * Add a new entry to the log
   * @param type - Entry type: 'combat', 'loot', 'stage', 'skill', 'story'
   * @param message - The log message
   */
  add(type: LogEntryType, message: string): void {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const entry: LogEntry = {
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
   * @param entry - The entry to render
   */
  private renderEntry(entry: LogEntry): void {
    if (!this.container) return;

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${entry.type}`;
    logEntry.dataset.id = String(entry.id);

    logEntry.innerHTML = `
      <span class="log-time">[${entry.timestamp}]</span>
      <span class="log-message">${entry.message}</span>
    `;

    // Add to container (newest at top)
    this.container.insertBefore(logEntry, this.container.firstChild);

    // Limit DOM entries to prevent memory bloat
    while (this.container.children.length > this.maxEntries) {
      this.container.removeChild(this.container.lastChild!);
    }
  }

  /**
   * Clear all log entries
   */
  clear(): void {
    this.entries = [];

    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Get all entries
   * @returns Array of log entries
   */
  getEntries(): LogEntry[] {
    return this.entries;
  }

  // Convenience methods for common log types

  /**
   * Log combat damage
   * @param attacker - Name of attacker
   * @param target - Name of target
   * @param damage - Damage amount
   */
  logCombat(attacker: string, target: string, damage: number): void {
    this.add('combat', `${attacker} dealt ${damage} damage to ${target}`);
  }

  /**
   * Log enemy defeated
   * @param enemyType - Type of enemy
   */
  logEnemyDefeated(enemyType: string): void {
    this.add('combat', `💀 Defeated ${enemyType}`);
  }

  /**
   * Log loot obtained
   * @param itemName - Name of item/resource
   * @param quantity - Amount obtained
   */
  logLoot(itemName: string, quantity: number): void {
    this.add('loot', `💰 Obtained ${quantity}x ${itemName}`);
  }

  /**
   * Log stage progression
   * @param stageNumber - The new stage number
   */
  logStage(stageNumber: number): void {
    this.add('stage', `🎯 Reached Stage ${stageNumber}!`);
  }

  /**
   * Log wave start
   * @param waveNumber - The wave number
   */
  logWave(waveNumber: number): void {
    this.add('combat', `⚔️ Wave ${waveNumber} incoming!`);
  }

  /**
   * Log skill usage
   * @param casterName - Name of skill user
   * @param skillName - Name of skill
   * @param damage - Damage dealt (if applicable)
   */
  logSkill(casterName: string, skillName: string, damage: number | null = null): void {
    const damageText = damage !== null ? ` for ${damage} damage` : '';
    this.add('skill', `✨ ${casterName} cast ${skillName}${damageText}!`);
  }

  /**
   * Log hero respawn
   * @param heroName - Name of hero
   */
  logRespawn(heroName: string): void {
    this.add('story', `💫 ${heroName} respawned and continues the fight!`);
  }

  /**
   * Log upgrade
   * @param upgradeType - Type of upgrade
   * @param newLevel - New level after upgrade
   */
  logUpgrade(upgradeType: string, newLevel: number): void {
    this.add('stage', `⬆️ ${upgradeType} upgraded to level ${newLevel}!`);
  }

  /**
   * Log story event
   * @param message - Story message
   */
  logStory(message: string): void {
    this.add('story', message);
  }

  /**
   * Log migration message
   * @param message - Migration message
   */
  logMigration(message: string): void {
    this.add('story', `🔄 ${message}`);
  }
}
