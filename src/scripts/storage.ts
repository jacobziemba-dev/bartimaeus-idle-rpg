/**
 * Storage System
 *
 * Handles saving and loading game data to/from browser's LocalStorage.
 *
 * Learning Note: LocalStorage lets you save data in the browser.
 * Even after closing the tab, the data persists!
 * It only stores strings, so we convert objects to JSON.
 */

import type { Hero } from './hero';
import { Hero as HeroClass, createStartingHeroes } from './hero';
import type { ResourceManager } from './resources';

interface GameState {
  version: string;
  lastSaveTime: number;
  currentStage: number;
  heroes: any[];
  resources: any;
}

export class StorageManager {
  private readonly SAVE_KEY: string = 'bartimaeus_rpg_save';

  /**
   * Save the entire game state to LocalStorage
   *
   * @param gameState - Object containing all game data
   */
  saveGame(gameState: GameState): boolean {
    try {
      // Convert JavaScript object to JSON string
      const saveData = JSON.stringify(gameState);

      // Save to LocalStorage
      localStorage.setItem(this.SAVE_KEY, saveData);

      console.log('Game saved successfully!');
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  /**
   * Load game state from LocalStorage
   *
   * @returns Saved game state, or null if no save exists
   */
  loadGame(): GameState | null {
    try {
      // Get saved data from LocalStorage
      const saveData = localStorage.getItem(this.SAVE_KEY);

      // If no save exists, return null
      if (!saveData) {
        console.log('No saved game found');
        return null;
      }

      // Convert JSON string back to JavaScript object
      const gameState = JSON.parse(saveData);

      console.log('Game loaded successfully!');
      return gameState;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  /**
   * Check if a saved game exists
   *
   * @returns True if save exists
   */
  hasSavedGame(): boolean {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  /**
   * Delete saved game (for testing or reset)
   */
  deleteSave(): void {
    localStorage.removeItem(this.SAVE_KEY);
    console.log('Save deleted');
  }

  /**
   * Get the last save time
   *
   * @returns Timestamp of last save, or null
   */
  getLastSaveTime(): number | null {
    const saveData = this.loadGame();
    if (saveData && saveData.lastSaveTime) {
      return saveData.lastSaveTime;
    }
    return null;
  }
}

/**
 * Create a game state object that can be saved
 *
 * @param heroes - Player's hero(es)
 * @param resources - Resource manager
 * @param currentStage - Current stage number
 * @returns Complete game state
 */
export function createSaveState(heroes: Hero | Hero[], resources: ResourceManager, currentStage: number): GameState {
  return {
    version: '1.0', // Save file version (for future compatibility)
    lastSaveTime: Date.now(),
    currentStage: currentStage,
    // Handle single hero or array for backward compatibility
    heroes: heroes ? (Array.isArray(heroes) ? heroes.map(hero => hero.toJSON()) : [heroes.toJSON()]) : [],
    resources: resources.toJSON()
  };
}

/**
 * Load heroes from saved state
 *
 * @param saveState - Saved game state
 * @returns Reconstructed hero (single hero in horde mode)
 */
export function loadHeroesFromSave(saveState: GameState | null): Hero {
  if (!saveState || !saveState.heroes || saveState.heroes.length === 0) {
    // No save data, return starting hero
    return createStartingHeroes();
  }

  // Reconstruct hero from saved data (now returns single hero, not array)
  // Take the first hero from the array for backward compatibility
  return HeroClass.fromJSON(saveState.heroes[0]);
}

/**
 * Load resources from saved state
 *
 * @param saveState - Saved game state
 * @param resourceManager - Resource manager to populate
 */
export function loadResourcesFromSave(saveState: GameState | null, resourceManager: ResourceManager): void {
  if (saveState && saveState.resources) {
    resourceManager.fromJSON(saveState.resources);
  }
}

/**
 * Load current stage from saved state
 *
 * @param saveState - Saved game state
 * @returns Stage number (default 1)
 */
export function loadStageFromSave(saveState: GameState | null): number {
  if (saveState && saveState.currentStage) {
    return saveState.currentStage;
  }
  return 1; // Default to stage 1
}
