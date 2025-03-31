// src/data/store.js
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { Wrestler, Championship, Event, Promotion, Settings } = require('../models');

/**
 * Game Data Store
 * 
 * Handles saving/loading game data and provides methods to work with game entities
 */
class GameDataStore {
  constructor() {
    // Set up data path in user data directory
    this.dataPath = path.join(app.getPath('userData'), 'game-data');
    
    // Ensure data directory exists
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath, { recursive: true });
    }
    
    // Initialize store containers
    this.wrestlers = [];
    this.championships = [];
    this.events = [];
    this.promotions = [];
    this.settings = new Settings();
    this.gameState = {
      currentDate: new Date().toISOString(),
      playerPromotionId: null,
      gameWeek: 1,
      difficulty: 'normal',
      lastSaved: null
    };
    
    // Save file path
    this.saveFilePath = path.join(this.dataPath, 'save-data.json');
    this.settingsFilePath = path.join(this.dataPath, 'settings.json');
  }
  
  /**
   * Initialize the store with default data or load existing save
   * @param {boolean} loadExisting - Whether to try loading existing save
   */
  init(loadExisting = true) {
    // First try to load settings
    this.loadSettings();
    
    if (loadExisting && fs.existsSync(this.saveFilePath)) {
      return this.loadGame();
    } else {
      return this.createNewGame();
    }
  }
  
  /**
   * Load settings from file
   */
  loadSettings() {
    try {
      if (fs.existsSync(this.settingsFilePath)) {
        const settingsData = JSON.parse(fs.readFileSync(this.settingsFilePath, 'utf8'));
        this.settings = Settings.fromJSON(settingsData);
        console.log('Settings loaded successfully');
      } else {
        this.settings = new Settings();
        this.saveSettings();
        console.log('Created default settings');
      }
      return {
        success: true,
        message: 'Settings loaded successfully'
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      this.settings = new Settings();
      return {
        success: false,
        message: `Error loading settings: ${error.message}`
      };
    }
  }
  
  /**
   * Save settings to file
   */
  saveSettings() {
    try {
      fs.writeFileSync(this.settingsFilePath, JSON.stringify(this.settings.toJSON(), null, 2));
      return {
        success: true,
        message: 'Settings saved successfully'
      };
    } catch (error) {
      console.error('Error saving settings:', error);
      return {
        success: false,
        message: `Error saving settings: ${error.message}`
      };
    }
  }
  
  /**
   * Update game settings
   * @param {Object} newSettings - New settings data
   */
  updateSettings(newSettings) {
    this.settings.updateSettings(newSettings);
    
    // Update game difficulty if included in settings
    if (newSettings.difficulty) {
      this.gameState.difficulty = newSettings.difficulty;
    }
    
    // Save updated settings
    return this.saveSettings();
  }
  
  /**
   * Reset settings to defaults
   */
  resetSettings() {
    this.settings.resetToDefaults();
    return this.saveSettings();
  }
  
  /**
   * Get current settings
   * @return {Object} Current settings
   */
  getSettings() {
    return this.settings;
  }
  
  /**
   * Create a new game with default data
   */
  createNewGame() {
    // Reset data
    this.wrestlers = [];
    this.championships = [];
    this.events = [];
    
    // Create player promotion
    const playerPromotion = new Promotion({
      name: 'Your Wrestling Promotion',
      shortName: 'YWP',
      isPlayerOwned: true,
      details: {
        owner: 'Player'
      }
    });
    
    this.promotions = [playerPromotion];
    this.gameState.playerPromotionId = playerPromotion.id;
    
    // Add some default wrestlers
    this.addDefaultWrestlers();
    
    // Save game
    this.saveGame();
    
    return {
      success: true,
      message: 'New game created'
    };
  }
  
  /**
   * Add some default wrestlers to the game
   */
  addDefaultWrestlers() {
    const defaultWrestlers = [
      {
        name: 'The Champion',
        nickname: 'The Best',
        attributes: {
          strength: 85,
          speed: 75,
          technique: 90,
          charisma: 88,
          stamina: 80,
          microphone: 85
        },
        style: {
          primary: 'Technical',
          signature: 'Perfect Suplex',
          finisher: 'Champion Lock'
        }
      },
      {
        name: 'High Flyer',
        nickname: 'The Aerial Wonder',
        attributes: {
          strength: 65,
          speed: 95,
          technique: 85,
          charisma: 80,
          stamina: 75,
          microphone: 70
        },
        style: {
          primary: 'High-Flyer',
          signature: 'Phoenix Splash',
          finisher: 'Shooting Star Press'
        }
      },
      {
        name: 'The Powerhouse',
        nickname: 'The Unstoppable Force',
        attributes: {
          strength: 95,
          speed: 60,
          technique: 70,
          charisma: 75,
          stamina: 85,
          microphone: 65
        },
        style: {
          primary: 'Powerhouse',
          signature: 'Spine Buster',
          finisher: 'Power Bomb'
        }
      }
    ];
    
    defaultWrestlers.forEach(data => {
      const wrestler = new Wrestler(data);
      this.wrestlers.push(wrestler);
      
      // Add to player promotion
      const playerPromotion = this.getPlayerPromotion();
      if (playerPromotion) {
        playerPromotion.addWrestler(wrestler);
      }
    });
  }
  
  /**
   * Save the current game state
   */
  saveGame() {
    // Update last saved timestamp
    this.gameState.lastSaved = new Date().toISOString();
    
    // Prepare data for saving
    const saveData = {
      gameState: this.gameState,
      wrestlers: this.wrestlers.map(w => w.toJSON()),
      championships: this.championships.map(c => c.toJSON()),
      events: this.events.map(e => e.toJSON()),
      promotions: this.promotions.map(p => p.toJSON())
    };
    
    // Write to file
    fs.writeFileSync(this.saveFilePath, JSON.stringify(saveData, null, 2));
    
    return {
      success: true,
      message: 'Game saved successfully',
      timestamp: this.gameState.lastSaved
    };
  }
  
  /**
   * Load a saved game
   */
  loadGame() {
    try {
      // Read save file
      const saveData = JSON.parse(fs.readFileSync(this.saveFilePath, 'utf8'));
      
      // Load game state
      this.gameState = saveData.gameState;
      
      // Load entities
      this.wrestlers = saveData.wrestlers.map(data => Wrestler.fromJSON(data));
      this.championships = saveData.championships.map(data => Championship.fromJSON(data));
      this.events = saveData.events.map(data => Event.fromJSON(data));
      this.promotions = saveData.promotions.map(data => Promotion.fromJSON(data));
      
      return {
        success: true,
        message: 'Game loaded successfully',
        timestamp: this.gameState.lastSaved
      };
    } catch (error) {
      console.error('Error loading game:', error);
      return {
        success: false,
        message: `Error loading game: ${error.message}`
      };
    }
  }
  
  /**
   * Get the player's promotion
   * @return {Promotion} Player promotion
   */
  getPlayerPromotion() {
    return this.promotions.find(p => p.id === this.gameState.playerPromotionId);
  }
  
  // Wrestler methods
  
  /**
   * Get all wrestlers
   * @return {Array} Array of wrestlers
   */
  getAllWrestlers() {
    return this.wrestlers;
  }
  
  /**
   * Get wrestler by ID
   * @param {string} id - Wrestler ID
   * @return {Wrestler} Wrestler object
   */
  getWrestlerById(id) {
    return this.wrestlers.find(w => w.id === id);
  }
  
  /**
   * Add a new wrestler
   * @param {Object} data - Wrestler data
   * @return {Wrestler} New wrestler
   */
  addWrestler(data) {
    const wrestler = new Wrestler(data);
    this.wrestlers.push(wrestler);
    return wrestler;
  }
  
  /**
   * Update a wrestler
   * @param {string} id - Wrestler ID
   * @param {Object} data - Updated data
   * @return {Wrestler} Updated wrestler
   */
  updateWrestler(id, data) {
    const index = this.wrestlers.findIndex(w => w.id === id);
    if (index === -1) return null;
    
    // Create updated wrestler
    const updated = new Wrestler({ ...this.wrestlers[index].toJSON(), ...data });
    this.wrestlers[index] = updated;
    
    return updated;
  }
  
  /**
   * Delete a wrestler
   * @param {string} id - Wrestler ID
   * @return {boolean} Success
   */
  deleteWrestler(id) {
    const index = this.wrestlers.findIndex(w => w.id === id);
    if (index === -1) return false;
    
    this.wrestlers.splice(index, 1);
    return true;
  }
  
  // Championship methods
  
  /**
   * Get all championships
   * @return {Array} Array of championships
   */
  getAllChampionships() {
    return this.championships;
  }
  
  /**
   * Get championship by ID
   * @param {string} id - Championship ID
   * @return {Championship} Championship object
   */
  getChampionshipById(id) {
    return this.championships.find(c => c.id === id);
  }
  
  /**
   * Add a new championship
   * @param {Object} data - Championship data
   * @return {Championship} New championship
   */
  addChampionship(data) {
    const championship = new Championship(data);
    this.championships.push(championship);
    return championship;
  }
  
  /**
   * Update a championship
   * @param {string} id - Championship ID
   * @param {Object} data - Updated data
   * @return {Championship} Updated championship
   */
  updateChampionship(id, data) {
    const index = this.championships.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    // Create updated championship
    const updated = new Championship({ ...this.championships[index].toJSON(), ...data });
    this.championships[index] = updated;
    
    return updated;
  }
  
  /**
   * Delete a championship
   * @param {string} id - Championship ID
   * @return {boolean} Success
   */
  deleteChampionship(id) {
    const index = this.championships.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.championships.splice(index, 1);
    return true;
  }
  
  // Event methods
  
  /**
   * Get all events
   * @return {Array} Array of events
   */
  getAllEvents() {
    return this.events;
  }
  
  /**
   * Get event by ID
   * @param {string} id - Event ID
   * @return {Event} Event object
   */
  getEventById(id) {
    return this.events.find(e => e.id === id);
  }
  
  /**
   * Add a new event
   * @param {Object} data - Event data
   * @return {Event} New event
   */
  addEvent(data) {
    const event = new Event(data);
    this.events.push(event);
    return event;
  }
  
  /**
   * Update an event
   * @param {string} id - Event ID
   * @param {Object} data - Updated data
   * @return {Event} Updated event
   */
  updateEvent(id, data) {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    // Create updated event
    const updated = new Event({ ...this.events[index].toJSON(), ...data });
    this.events[index] = updated;
    
    return updated;
  }
  
  /**
   * Delete an event
   * @param {string} id - Event ID
   * @return {boolean} Success
   */
  deleteEvent(id) {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) return false;
    
    this.events.splice(index, 1);
    return true;
  }
  
  // Promotion methods
  
  /**
   * Get all promotions
   * @return {Array} Array of promotions
   */
  getAllPromotions() {
    return this.promotions;
  }
  
  /**
   * Get promotion by ID
   * @param {string} id - Promotion ID
   * @return {Promotion} Promotion object
   */
  getPromotionById(id) {
    return this.promotions.find(p => p.id === id);
  }
  
  /**
   * Add a new promotion
   * @param {Object} data - Promotion data
   * @return {Promotion} New promotion
   */
  addPromotion(data) {
    const promotion = new Promotion(data);
    this.promotions.push(promotion);
    return promotion;
  }
  
  /**
   * Update a promotion
   * @param {string} id - Promotion ID
   * @param {Object} data - Updated data
   * @return {Promotion} Updated promotion
   */
  updatePromotion(id, data) {
    const index = this.promotions.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    // Create updated promotion
    const updated = new Promotion({ ...this.promotions[index].toJSON(), ...data });
    this.promotions[index] = updated;
    
    return updated;
  }
  
  /**
   * Delete a promotion
   * @param {string} id - Promotion ID
   * @return {boolean} Success
   */
  deletePromotion(id) {
    // Don't allow deleting player promotion
    if (id === this.gameState.playerPromotionId) return false;
    
    const index = this.promotions.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.promotions.splice(index, 1);
    return true;
  }
  
  /**
   * Advance game time by one week
   */
  advanceGameWeek() {
    // Increment game week
    this.gameState.gameWeek++;
    
    // Update current date
    const currentDate = new Date(this.gameState.currentDate);
    currentDate.setDate(currentDate.getDate() + 7);
    this.gameState.currentDate = currentDate.toISOString();
    
    // Process weekly events, updates, etc.
    // This would include running shows, updating stats, etc.
    
    // Auto-save if enabled
    if (this.settings.autosave.enabled && this.settings.autosave.frequency === 'weekly') {
      this.saveGame();
    }
    
    return {
      success: true,
      message: `Advanced to Week ${this.gameState.gameWeek}`,
      currentDate: this.gameState.currentDate
    };
  }
}

// Create and export a singleton instance
const gameStore = new GameDataStore();
module.exports = gameStore;