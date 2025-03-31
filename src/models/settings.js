// src/models/settings.js
const crypto = require('crypto');

/**
 * Game Settings data model
 */
class Settings {
  /**
   * Create new settings
   * @param {Object} data - Settings data
   */
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    
    // Game difficulty settings
    this.difficulty = data.difficulty || 'normal'; // easy, normal, hard, simulation
    
    // Autosave settings
    this.autosave = {
      frequency: data.autosave?.frequency || 'weekly', // never, weekly, monthly, yearly
      enabled: data.autosave?.enabled !== undefined ? data.autosave.enabled : true
    };
    
    // Game simulation settings
    this.simulation = {
      injuries: data.simulation?.injuries !== undefined ? data.simulation.injuries : true,
      retirements: data.simulation?.retirements !== undefined ? data.simulation.retirements : true,
      randomEvents: data.simulation?.randomEvents !== undefined ? data.simulation.randomEvents : true,
      financialCrises: data.simulation?.financialCrises !== undefined ? data.simulation.financialCrises : true
    };
    
    // Display settings
    this.display = {
      theme: data.display?.theme || 'light', // light, dark
      showTutorials: data.display?.showTutorials !== undefined ? data.display.showTutorials : true,
      compactMode: data.display?.compactMode !== undefined ? data.display.compactMode : false
    };
    
    // Notification settings
    this.notifications = {
      contractExpiry: data.notifications?.contractExpiry !== undefined ? data.notifications.contractExpiry : true,
      injuryUpdates: data.notifications?.injuryUpdates !== undefined ? data.notifications.injuryUpdates : true,
      rosterMorale: data.notifications?.rosterMorale !== undefined ? data.notifications.rosterMorale : true,
      financialAlerts: data.notifications?.financialAlerts !== undefined ? data.notifications.financialAlerts : true
    };
    
    // Audio settings
    this.audio = {
      enabled: data.audio?.enabled !== undefined ? data.audio.enabled : true,
      volume: data.audio?.volume || 0.5, // 0.0 - 1.0
      eventSounds: data.audio?.eventSounds !== undefined ? data.audio.eventSounds : true,
      backgroundMusic: data.audio?.backgroundMusic !== undefined ? data.audio.backgroundMusic : true
    };
  }
  
  /**
   * Update settings
   * @param {Object} newSettings - New settings values
   * @return {Settings} Updated settings
   */
  updateSettings(newSettings) {
    // Update difficulty
    if (newSettings.difficulty) {
      this.difficulty = newSettings.difficulty;
    }
    
    // Update autosave settings
    if (newSettings.autosave) {
      this.autosave = {
        ...this.autosave,
        ...newSettings.autosave
      };
    }
    
    // Update simulation settings
    if (newSettings.simulation) {
      this.simulation = {
        ...this.simulation,
        ...newSettings.simulation
      };
    }
    
    // Update display settings
    if (newSettings.display) {
      this.display = {
        ...this.display,
        ...newSettings.display
      };
    }
    
    // Update notification settings
    if (newSettings.notifications) {
      this.notifications = {
        ...this.notifications,
        ...newSettings.notifications
      };
    }
    
    // Update audio settings
    if (newSettings.audio) {
      this.audio = {
        ...this.audio,
        ...newSettings.audio
      };
    }
    
    return this;
  }
  
  /**
   * Reset settings to defaults
   * @return {Settings} Reset settings
   */
  resetToDefaults() {
    // Create a new settings object with defaults
    const defaults = new Settings();
    
    // Copy all default values
    this.difficulty = defaults.difficulty;
    this.autosave = { ...defaults.autosave };
    this.simulation = { ...defaults.simulation };
    this.display = { ...defaults.display };
    this.notifications = { ...defaults.notifications };
    this.audio = { ...defaults.audio };
    
    return this;
  }
  
  /**
   * Create a settings object from JSON data
   * @param {Object} json - JSON data
   * @return {Settings} New settings instance
   */
  static fromJSON(json) {
    return new Settings(json);
  }
  
  /**
   * Convert settings to plain object
   * @return {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      difficulty: this.difficulty,
      autosave: this.autosave,
      simulation: this.simulation,
      display: this.display,
      notifications: this.notifications,
      audio: this.audio
    };
  }
}

module.exports = Settings;