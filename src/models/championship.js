// src/models/championship.js
const crypto = require('crypto');

/**
 * Championship data model
 */
class Championship {
  /**
   * Create a new championship
   * @param {Object} data - Championship data
   */
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || 'New Championship';
    this.image = data.image || 'default_title.png';
    
    // Basic title information
    this.active = data.active !== undefined ? data.active : true;
    this.inaugurated = data.inaugurated || new Date().toISOString();
    this.prestige = data.prestige || 50; // 0-100 scale
    this.description = data.description || '';
    
    // Classification
    this.type = {
      gender: data.type?.gender || 'male', // male, female, any
      weight: data.type?.weight || 'heavyweight', // heavyweight, cruiserweight, etc.
      level: data.type?.level || 'midcard', // main event, midcard, undercard
      team: data.type?.team || false, // singles or tag team
    };
    
    // Current champion info
    this.currentChampion = {
      wrestlerId: data.currentChampion?.wrestlerId || null,
      name: data.currentChampion?.name || 'Vacant',
      wonOn: data.currentChampion?.wonOn || null,
      defenseCount: data.currentChampion?.defenseCount || 0
    };
    
    // Championship history
    this.lineage = data.lineage || [];
    
    // Scheduled defenses
    this.scheduledDefenses = data.scheduledDefenses || [];
    
    // Championship rules
    this.rules = {
      minimumDefensePeriod: data.rules?.minimumDefensePeriod || 14, // days
      vacateAfterInactivity: data.rules?.vacateAfterInactivity || 90, // days
      contenderRankings: data.rules?.contenderRankings || []
    };
  }
  
  /**
   * Change the champion
   * @param {string} wrestlerId - ID of the new champion
   * @param {string} wrestlerName - Name of the new champion
   * @param {string} date - ISO date string of title change
   * @param {string} eventName - Name of the event where title changed
   */
  changeChampion(wrestlerId, wrestlerName, date, eventName) {
    // Add current champion to lineage if exists
    if (this.currentChampion.wrestlerId) {
      this.lineage.push({
        wrestlerId: this.currentChampion.wrestlerId,
        name: this.currentChampion.name,
        wonOn: this.currentChampion.wonOn,
        lostOn: date,
        defenseCount: this.currentChampion.defenseCount,
        reignDays: this.calculateReignDays(this.currentChampion.wonOn, date)
      });
    }
    
    // Set new champion
    this.currentChampion = {
      wrestlerId,
      name: wrestlerName,
      wonOn: date,
      defenseCount: 0
    };
    
    // Add title change record
    return {
      championshipId: this.id,
      championshipName: this.name,
      date,
      eventName,
      previousChampion: this.lineage.length > 0 ? this.lineage[this.lineage.length - 1] : null,
      newChampionId: wrestlerId,
      newChampionName: wrestlerName
    };
  }
  
  /**
   * Record a successful title defense
   * @param {string} date - ISO date string of defense
   * @param {string} opponent - Name of opponent
   * @param {string} eventName - Name of the event
   */
  recordDefense(date, opponent, eventName) {
    if (!this.currentChampion.wrestlerId) {
      return null; // Can't defend a vacant title
    }
    
    this.currentChampion.defenseCount++;
    
    const defense = {
      date,
      championId: this.currentChampion.wrestlerId,
      championName: this.currentChampion.name,
      opponent,
      eventName
    };
    
    return defense;
  }
  
  /**
   * Vacate the championship
   * @param {string} date - ISO date string of vacating
   * @param {string} reason - Reason for vacating
   */
  vacate(date, reason) {
    if (this.currentChampion.wrestlerId) {
      this.lineage.push({
        wrestlerId: this.currentChampion.wrestlerId,
        name: this.currentChampion.name,
        wonOn: this.currentChampion.wonOn,
        lostOn: date,
        defenseCount: this.currentChampion.defenseCount,
        reignDays: this.calculateReignDays(this.currentChampion.wonOn, date),
        vacated: true,
        vacatedReason: reason
      });
    }
    
    this.currentChampion = {
      wrestlerId: null,
      name: 'Vacant',
      wonOn: null,
      defenseCount: 0
    };
    
    return {
      championshipId: this.id,
      championshipName: this.name,
      date,
      event: 'Title Vacated',
      reason,
      formerChampion: this.lineage[this.lineage.length - 1]
    };
  }
  
  /**
   * Calculate the reign length in days
   * @param {string} startDate - ISO date string of reign start
   * @param {string} endDate - ISO date string of reign end
   * @return {number} Reign length in days
   */
  calculateReignDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  /**
   * Create a championship object from JSON data
   * @param {Object} json - JSON data
   * @return {Championship} New championship instance
   */
  static fromJSON(json) {
    return new Championship(json);
  }
  
  /**
   * Convert championship to plain object
   * @return {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      active: this.active,
      inaugurated: this.inaugurated,
      prestige: this.prestige,
      description: this.description,
      type: this.type,
      currentChampion: this.currentChampion,
      lineage: this.lineage,
      scheduledDefenses: this.scheduledDefenses,
      rules: this.rules
    };
  }
}

module.exports = Championship;