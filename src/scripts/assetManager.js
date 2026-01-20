/**
 * AssetManager - Handles loading and caching of game assets (sprites, backgrounds, UI images)
 * Provides fallback support when assets are missing
 */
class AssetManager {
  constructor() {
    this.assets = {};
    this.loadedCount = 0;
    this.totalCount = 0;
    this.loadingProgress = 0;

    // Asset manifest - maps category -> name -> file path
    this.manifest = {
      backgrounds: {
        forest: 'assets/backgrounds/forest.svg',
        dungeon: 'assets/backgrounds/dungeon.svg',
        volcano: 'assets/backgrounds/volcano.svg',
        castle: 'assets/backgrounds/castle.svg'
      },
      heroes: {
        bartimaeus: 'assets/heroes/bartimaeus.svg'
      },
      enemies: {
        goblin: 'assets/enemies/goblin.svg',
        orc: 'assets/enemies/orc.svg',
        skeleton: 'assets/enemies/skeleton.svg',
        demon: 'assets/enemies/demon.svg',
        dragon: 'assets/enemies/dragon.svg'
      },
      ui: {
        // Skill icons
        skill_fireball: 'assets/ui/fireball-icon.svg',
        skill_cleave: 'assets/ui/cleave-icon.svg',
        skill_heal: 'assets/ui/heal-icon.svg',

        // UI elements
        button_upgrade: 'assets/ui/button-upgrade.svg',
        panel_frame: 'assets/ui/panel-frame.svg',
        healthbar_bg: 'assets/ui/healthbar-background.svg',
        healthbar_fill_green: 'assets/ui/healthbar-fill-green.svg',
        healthbar_fill_red: 'assets/ui/healthbar-fill-red.svg',
        gold_coin: 'assets/ui/gold-coin.svg',
        gem_icon: 'assets/ui/gem-icon.svg'
      }
    };
  }

  /**
   * Load all assets defined in manifest
   * @returns {Promise} Resolves when all assets are loaded (or failed)
   */
  loadAll() {
    return new Promise((resolve, reject) => {
      // Count total assets
      this.totalCount = 0;
      Object.keys(this.manifest).forEach(category => {
        this.totalCount += Object.keys(this.manifest[category]).length;
      });

      if (this.totalCount === 0) {
        console.log('No assets to load');
        resolve();
        return;
      }

      console.log(`Loading ${this.totalCount} assets...`);

      const loadPromises = [];

      // Load each category
      Object.keys(this.manifest).forEach(category => {
        if (!this.assets[category]) {
          this.assets[category] = {};
        }

        Object.keys(this.manifest[category]).forEach(name => {
          const path = this.manifest[category][name];
          const promise = this.loadAsset(category, name, path);
          loadPromises.push(promise);
        });
      });

      // Wait for all assets (some may fail, that's ok)
      Promise.allSettled(loadPromises)
        .then(results => {
          const successful = results.filter(r => r.status === 'fulfilled').length;
          const failed = results.filter(r => r.status === 'rejected').length;

          console.log(`Asset loading complete: ${successful} loaded, ${failed} failed`);
          this.loadingProgress = 1.0;
          resolve();
        })
        .catch(err => {
          console.error('Asset loading error:', err);
          reject(err);
        });
    });
  }

  /**
   * Load a single asset
   * @param {string} category - Asset category
   * @param {string} name - Asset name
   * @param {string} path - Asset file path
   * @returns {Promise} Resolves when asset loads or rejects on error
   */
  loadAsset(category, name, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.assets[category][name] = img;
        this.loadedCount++;
        this.loadingProgress = this.loadedCount / this.totalCount;

        // Update loading screen if it exists
        this.updateLoadingScreen();

        console.log(`✓ Loaded: ${path} (${this.loadedCount}/${this.totalCount})`);
        resolve(img);
      };

      img.onerror = () => {
        console.warn(`✗ Failed to load: ${path}`);
        this.loadedCount++;
        this.loadingProgress = this.loadedCount / this.totalCount;

        // Update loading screen even on failure
        this.updateLoadingScreen();

        // Don't reject - we want to continue loading other assets
        // Fallback rendering will handle missing assets
        resolve(null);
      };

      img.src = path;
    });
  }

  /**
   * Get an asset by category and name
   * @param {string} category - Asset category
   * @param {string} name - Asset name
   * @returns {Image|null} The loaded image or null if not found
   */
  get(category, name) {
    if (!this.assets[category]) {
      return null;
    }
    return this.assets[category][name] || null;
  }

  /**
   * Check if all assets are loaded
   * @returns {boolean} True if all assets finished loading (success or failure)
   */
  isLoaded() {
    return this.loadingProgress >= 1.0;
  }

  /**
   * Get loading progress as percentage
   * @returns {number} Progress from 0 to 1
   */
  getProgress() {
    return this.loadingProgress;
  }

  /**
   * Update loading screen UI if it exists
   */
  updateLoadingScreen() {
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');

    if (progressBar) {
      const percent = Math.floor(this.loadingProgress * 100);
      progressBar.style.width = `${percent}%`;
    }

    if (loadingText) {
      const percent = Math.floor(this.loadingProgress * 100);
      loadingText.textContent = `Loading assets... ${percent}%`;
    }
  }

  /**
   * Get stats about loaded assets
   * @returns {object} Object with loaded/total/failed counts
   */
  getStats() {
    let totalAssets = 0;
    let loadedAssets = 0;

    Object.keys(this.manifest).forEach(category => {
      Object.keys(this.manifest[category]).forEach(name => {
        totalAssets++;
        if (this.assets[category] && this.assets[category][name]) {
          loadedAssets++;
        }
      });
    });

    return {
      total: totalAssets,
      loaded: loadedAssets,
      failed: totalAssets - loadedAssets,
      progress: this.loadingProgress
    };
  }
}