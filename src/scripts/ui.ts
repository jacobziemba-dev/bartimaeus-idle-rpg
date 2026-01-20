/**
 * UI System
 *
 * Handles all visual rendering and UI updates.
 * - Draws heroes and enemies on canvas
 * - Draws health bars
 * - Draws floating damage numbers
 * - Updates HTML elements (gold, gems, etc.)
 *
 * Learning Note: Canvas is like a digital painting canvas.
 * You draw shapes, text, and images on it using JavaScript.
 */

import type { Hero } from './hero';
import type { Enemy } from './enemy';
import type { DamageNumber, BattleMode } from '../types';

export class UIManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dpr: number;
  private width: number = 0;
  private height: number = 0;

  // Responsive layout properties
  private characterSize: number = 60;
  private healthBarWidth: number = 70;
  private healthBarHeight: number = 8;
  private labelFontSize: number = 14;
  private damageFontSize: number = 24;
  private resultFontSize: number = 72;
  private heroStartX: number = 0;
  private enemyStartX: number = 0;
  private yPositions: number[] = [];

  constructor(canvasId: string) {
    // Get canvas element and 2D drawing context
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }
    this.canvas = canvas;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = ctx;

    // Device pixel ratio for crisp rendering on high-DPI displays
    this.dpr =
      typeof window !== 'undefined' && window.devicePixelRatio
        ? window.devicePixelRatio
        : 1;

    // Ensure the canvas backing store matches the visible (CSS) size
    this.resizeCanvas();

    // Recompute canvas size on window resize
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.resizeCanvas());
    }
  }

  /**
   * Resize the canvas backing store to match its CSS size and device pixel ratio
   */
  resizeCanvas(): void {
    const baseWidth = 800;
    const baseHeight = 400;
    const heroXRatio = 0.125;
    const enemyXRatio = 0.75;
    const yPositionRatios = [0.25, 0.5, 0.75];

    // Get the CSS size of the canvas (fallback to attributes if not styled)
    const cssWidth =
      this.canvas.clientWidth ||
      parseInt(this.canvas.getAttribute('width') || String(baseWidth)) ||
      baseWidth;
    const cssHeight =
      this.canvas.clientHeight ||
      parseInt(this.canvas.getAttribute('height') || String(baseHeight)) ||
      baseHeight;

    // Set the canvas width/height in device pixels
    this.canvas.width = Math.round(cssWidth * this.dpr);
    this.canvas.height = Math.round(cssHeight * this.dpr);

    // Ensure the element's CSS size remains the intended size
    this.canvas.style.width = cssWidth + 'px';
    this.canvas.style.height = cssHeight + 'px';

    // Scale drawing operations so code can continue using CSS pixel coordinates
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // Store logical drawing size in CSS pixels for the rest of the UI code
    this.width = cssWidth;
    this.height = cssHeight;

    // Responsive layout scaling for cross-platform sizing
    const scale = Math.min(this.width / baseWidth, this.height / baseHeight, 1);
    this.characterSize = Math.max(40, Math.round(60 * scale));
    this.healthBarWidth = Math.max(50, Math.round(70 * scale));
    this.healthBarHeight = Math.max(6, Math.round(8 * scale));
    this.labelFontSize = Math.max(12, Math.round(14 * scale));
    this.damageFontSize = Math.max(14, Math.round(24 * scale));
    this.resultFontSize = Math.max(32, Math.round(72 * scale));

    this.heroStartX = Math.max(
      this.characterSize,
      Math.round(this.width * heroXRatio)
    );
    this.enemyStartX = Math.min(
      this.width - this.characterSize,
      Math.round(this.width * enemyXRatio)
    );
    this.yPositions = yPositionRatios.map(ratio =>
      Math.round(this.height * ratio)
    );
  }

  /**
   * Main render function - draws everything
   *
   * @param heroes - Heroes to draw
   * @param enemies - Enemies to draw
   * @param damageNumbers - Damage numbers to draw
   */
  render(heroes: Hero | Hero[], enemies: Enemy[], damageNumbers: DamageNumber[]): void {
    // Clear canvas (like erasing the whiteboard)
    this.clearCanvas();

    // Draw background effects
    this.drawBackground();

    // Draw characters
    this.drawHeroes(heroes);
    this.drawEnemies(enemies);

    // Draw floating damage numbers
    this.drawDamageNumbers(damageNumbers);
  }

  /**
   * Clear the entire canvas
   */
  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Draw background gradient and effects
   */
  private drawBackground(): void {
    // Draw a subtle gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#2d1b3d');
    gradient.addColorStop(1, '#1a1a2e');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw dividing line between heroes and enemies
    this.ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width / 2, 0);
    this.ctx.lineTo(this.width / 2, this.height);
    this.ctx.stroke();
  }

  /**
   * Draw hero (single hero in horde mode)
   *
   * @param heroes - Hero or array of heroes to draw
   */
  private drawHeroes(heroes: Hero | Hero[]): void {
    // Handle single hero or array for backward compatibility
    const heroArray = Array.isArray(heroes) ? heroes : [heroes];

    heroArray.forEach((hero, index) => {
      if (!hero) return; // Skip if hero is null/undefined

      const x = this.heroStartX;
      const y = this.yPositions[index];

      // Update hero position (for damage numbers)
      hero.x = x;
      hero.y = y;

      // Draw character
      this.drawCharacter(x, y, hero.color, hero.isAlive());

      // Draw health bar
      this.drawHealthBar(x, y - 40, hero.getHealthPercent(), true);

      // Draw name label
      this.drawLabel(x, y + 80, hero.name, '#fbbf24');
    });
  }

  /**
   * Draw all enemies
   *
   * @param enemies - Enemies to draw
   */
  private drawEnemies(enemies: Enemy[]): void {
    enemies.forEach((enemy, index) => {
      const x = this.enemyStartX;
      const y = this.yPositions[index];

      // Update enemy position (for damage numbers)
      enemy.x = x;
      enemy.y = y;

      // Draw character
      this.drawCharacter(x, y, enemy.color, enemy.isAlive());

      // Draw health bar
      this.drawHealthBar(x, y - 40, enemy.getHealthPercent(), false);

      // Draw type label
      this.drawLabel(x, y + 80, enemy.type, '#d1d5db');
    });
  }

  /**
   * Draw a single character (rectangle with glow effect)
   *
   * @param x - X position
   * @param y - Y position
   * @param color - Color
   * @param isAlive - If false, draw as gray/dead
   */
  private drawCharacter(x: number, y: number, color: string, isAlive: boolean): void {
    const size = this.characterSize;

    // If dead, draw gray
    const displayColor = isAlive ? color : '#404040';

    // Draw glow effect (shadow)
    if (isAlive) {
      this.ctx.shadowBlur = 20;
      this.ctx.shadowColor = color;
    }

    // Draw character rectangle
    this.ctx.fillStyle = displayColor;
    this.ctx.fillRect(x - size / 2, y - size / 2, size, size);

    // Add border
    this.ctx.strokeStyle = isAlive ? '#ffffff' : '#808080';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(x - size / 2, y - size / 2, size, size);

    // Reset shadow
    this.ctx.shadowBlur = 0;

    // Draw X if dead
    if (!isAlive) {
      this.ctx.strokeStyle = '#ff0000';
      this.ctx.lineWidth = 4;
      const crossOffset = Math.round(size * 0.33);
      this.ctx.beginPath();
      this.ctx.moveTo(x - crossOffset, y - crossOffset);
      this.ctx.lineTo(x + crossOffset, y + crossOffset);
      this.ctx.moveTo(x + crossOffset, y - crossOffset);
      this.ctx.lineTo(x - crossOffset, y + crossOffset);
      this.ctx.stroke();
    }
  }

  /**
   * Draw a health bar
   *
   * @param x - X position (center)
   * @param y - Y position (center)
   * @param healthPercent - Health percentage (0 to 1)
   * @param isHero - If true, use green; if false, use red
   */
  private drawHealthBar(x: number, y: number, healthPercent: number, isHero: boolean): void {
    const width = this.healthBarWidth;
    const height = this.healthBarHeight;

    // Background (empty health bar)
    this.ctx.fillStyle = '#404040';
    this.ctx.fillRect(x - width / 2, y - height / 2, width, height);

    // Foreground (current health)
    const currentWidth = width * healthPercent;
    const healthColor = isHero ? '#10b981' : '#ef4444'; // Green for heroes, red for enemies

    this.ctx.fillStyle = healthColor;
    this.ctx.fillRect(x - width / 2, y - height / 2, currentWidth, height);

    // Border
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x - width / 2, y - height / 2, width, height);
  }

  /**
   * Draw a text label
   *
   * @param x - X position (center)
   * @param y - Y position
   * @param text - Text to display
   * @param color - Text color
   */
  private drawLabel(x: number, y: number, text: string, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${this.labelFontSize || 14}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, x, y);
  }

  /**
   * Draw floating damage numbers
   *
   * @param damageNumbers - Array of damage number objects
   */
  private drawDamageNumbers(damageNumbers: DamageNumber[]): void {
    damageNumbers.forEach(num => {
      // Color: red for hero damage, white for enemy damage
      const color = num.isHeal ? '#10b981' : '#ef4444';

      // Set opacity
      this.ctx.globalAlpha = num.opacity;

      // Draw damage text
      this.ctx.fillStyle = color;
      this.ctx.font = `bold ${this.damageFontSize || 24}px Arial`;
      this.ctx.textAlign = 'center';
      const prefix = num.isHeal ? '+' : '-';
      this.ctx.fillText(`${prefix}${num.damage}`, num.x, num.y);

      // Reset opacity
      this.ctx.globalAlpha = 1.0;
    });
  }

  /**
   * Draw battle result overlay (Victory or Defeat)
   *
   * @param result - 'victory' or 'defeat'
   */
  drawBattleResult(result: string): void {
    // Semi-transparent dark overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Result text
    const text = result === 'victory' ? 'VICTORY!' : 'DEFEAT!';
    const color = result === 'victory' ? '#10b981' : '#ef4444';

    // Draw text with glow
    this.ctx.shadowBlur = 30;
    this.ctx.shadowColor = color;
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${this.resultFontSize || 72}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(text, this.width / 2, this.height / 2);

    // Reset shadow
    this.ctx.shadowBlur = 0;
  }

  /**
   * Update HTML resource displays (gold, gems, stage)
   *
   * @param gold - Current gold amount
   * @param gems - Current gems amount
   * @param stage - Current stage number
   */
  updateResourceDisplay(gold: number, gems: number, stage: number): void {
    const goldDisplay = document.getElementById('gold-display');
    const gemDisplay = document.getElementById('gem-display');
    const stageNumber = document.getElementById('stage-number');

    if (goldDisplay) goldDisplay.textContent = gold.toLocaleString();
    if (gemDisplay) gemDisplay.textContent = gems.toLocaleString();
    if (stageNumber) stageNumber.textContent = String(stage);
  }

  /**
   * Update upgrade modal with hero information
   *
   * @param heroes - Heroes to display
   * @param onUpgrade - Callback when upgrade button clicked
   */
  updateUpgradeModal(heroes: Hero | Hero[], onUpgrade: (heroId: number) => void): void {
    const heroList = document.getElementById('hero-list');
    if (!heroList) return;

    heroList.innerHTML = ''; // Clear existing content

    const heroArray = Array.isArray(heroes) ? heroes : [heroes];

    heroArray.forEach(hero => {
      const heroItem = document.createElement('div');
      heroItem.className = 'hero-item';

      const cost = hero.getUpgradeCost();

      heroItem.innerHTML = `
                <div class="hero-info">
                    <div class="hero-name">${hero.name} - Level ${hero.level}</div>
                    <div class="hero-stats">
                        ❤️ HP: ${hero.maxHealth} | ⚔️ ATK: ${hero.attack} | 🛡️ DEF: ${hero.defense}
                    </div>
                </div>
                <button class="hero-upgrade-btn" data-hero-id="${hero.id}">
                    Upgrade (${cost.toLocaleString()} 💰)
                </button>
            `;

      heroList.appendChild(heroItem);
    });

    // Add event listeners to upgrade buttons
    document.querySelectorAll('.hero-upgrade-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const heroId = parseInt(target.dataset.heroId || '0');
        onUpgrade(heroId);
      });
    });
  }

  /**
   * Show AFK rewards modal
   *
   * @param gold - Gold earned
   * @param gems - Gems earned
   * @param timeAway - Formatted time away
   */
  showAFKRewards(gold: number, gems: number, timeAway: string): void {
    const afkGold = document.getElementById('afk-gold');
    const afkGems = document.getElementById('afk-gems');
    const timeAwayEl = document.getElementById('time-away');
    const afkModal = document.getElementById('afk-modal');

    if (afkGold) afkGold.textContent = `+${gold.toLocaleString()}`;
    if (afkGems) afkGems.textContent = `+${gems.toLocaleString()}`;
    if (timeAwayEl) timeAwayEl.textContent = timeAway;

    // Show modal
    if (afkModal) afkModal.style.display = 'flex';
  }

  /**
   * Hide AFK rewards modal
   */
  hideAFKRewards(): void {
    const afkModal = document.getElementById('afk-modal');
    if (afkModal) afkModal.style.display = 'none';
  }

  /**
   * Show/hide upgrade modal
   *
   * @param show - True to show, false to hide
   */
  toggleUpgradeModal(show: boolean): void {
    const upgradeModal = document.getElementById('upgrade-modal');
    if (upgradeModal) {
      upgradeModal.style.display = show ? 'flex' : 'none';
    }
  }

  /**
   * Update battle control buttons
   *
   * @param result - Battle result ('victory', 'defeat', or null)
   * @param mode - 'IDLE' or 'HORDE'
   */
  updateBattleControls(result: string | null = null, mode: BattleMode = 'HORDE'): void {
    const nextStageBtn = document.getElementById('next-stage-btn');
    const retryBtn = document.getElementById('retry-btn');

    // In IDLE/HORDE mode, always show Challenge button
    if (nextStageBtn) {
      nextStageBtn.style.display = 'block';
    }
    if (retryBtn) {
      retryBtn.style.display = 'none';
    }
  }
}
