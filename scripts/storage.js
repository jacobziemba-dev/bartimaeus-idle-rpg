/**
 * Storage System
 *
 * Handles saving and loading game data to/from browser's LocalStorage.
 *
 * Learning Note: LocalStorage lets you save data in the browser.
 * Even after closing the tab, the data persists!
 * It only stores strings, so we convert objects to JSON.
 */

class StorageManager {
    constructor() {
        this.SAVE_KEY = 'bartimaeus_rpg_save'; // Key name in LocalStorage
    }

    /**
     * Save the entire game state to LocalStorage
     *
     * @param {object} gameState - Object containing all game data
     */
    saveGame(gameState) {
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
     * @returns {object|null} Saved game state, or null if no save exists
     */
    loadGame() {
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
     * @returns {boolean} True if save exists
     */
    hasSavedGame() {
        return localStorage.getItem(this.SAVE_KEY) !== null;
    }

    /**
     * Delete saved game (for testing or reset)
     */
    deleteSave() {
        localStorage.removeItem(this.SAVE_KEY);
        console.log('Save deleted');
    }

    /**
     * Get the last save time
     *
     * @returns {number|null} Timestamp of last save, or null
     */
    getLastSaveTime() {
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
 * @param {Array<Hero>} heroes - Player's heroes
 * @param {ResourceManager} resources - Resource manager
 * @param {number} currentStage - Current stage number
 * @returns {object} Complete game state
 */
function createSaveState(heroes, resources, currentStage) {
    return {
        version: '1.0', // Save file version (for future compatibility)
        lastSaveTime: Date.now(),
        currentStage: currentStage,
        heroes: heroes.map(hero => hero.toJSON()),
        resources: resources.toJSON()
    };
}

/**
 * Load heroes from saved state
 *
 * @param {object} saveState - Saved game state
 * @returns {Array<Hero>} Reconstructed heroes
 */
function loadHeroesFromSave(saveState) {
    if (!saveState || !saveState.heroes) {
        // No save data, return starting heroes
        return createStartingHeroes();
    }

    // Reconstruct heroes from saved data
    return saveState.heroes.map(heroData => Hero.fromJSON(heroData));
}

/**
 * Load resources from saved state
 *
 * @param {object} saveState - Saved game state
 * @param {ResourceManager} resourceManager - Resource manager to populate
 */
function loadResourcesFromSave(saveState, resourceManager) {
    if (saveState && saveState.resources) {
        resourceManager.fromJSON(saveState.resources);
    }
}

/**
 * Load current stage from saved state
 *
 * @param {object} saveState - Saved game state
 * @returns {number} Stage number (default 1)
 */
function loadStageFromSave(saveState) {
    if (saveState && saveState.currentStage) {
        return saveState.currentStage;
    }
    return 1; // Default to stage 1
}
