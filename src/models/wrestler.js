// src/models/wrestler.js
const crypto = require('crypto');

/**
 * Wrestler data model 
 */
class Wrestler {
  /**
   * Create a new wrestler
   * @param {Object} data - Wrestler data
   */
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || 'New Wrestler';
    this.nickname = data.nickname || '';
    this.gender = data.gender || 'male'; // male, female, other
    
    // Basic info
    this.age = data.age || 25;
    this.height = data.height || 180; // in cm
    this.weight = data.weight || 90; // in kg
    this.image = data.image || 'default_wrestler.png';
    this.bio = data.bio || '';
    this.homeTown = data.homeTown || '';
    
    // Wrestling attributes (0-100 scale)
    this.attributes = {
      strength: data.attributes?.strength || 50,
      speed: data.attributes?.speed || 50,
      technique: data.attributes?.technique || 50,
      charisma: data.attributes?.charisma || 50,
      stamina: data.attributes?.stamina || 50,
      microphone: data.attributes?.microphone || 50,
      loyalty: data.attributes?.loyalty || 50,
      popularity: data.attributes?.popularity || 50,
      morale: data.attributes?.morale || 70,
      health: data.attributes?.health || 100
    };
    
    // Wrestling style and preferences
    this.style = {
      primary: data.style?.primary || 'All-Rounder', // Technical, Powerhouse, High-Flyer, Brawler, etc.
      secondary: data.style?.secondary || '',
      signature: data.style?.signature || 'Signature Move',
      finisher: data.style?.finisher || 'Finisher Move',
      preferredRole: data.style?.preferredRole || 'Neutral', // Face, Heel, Neutral
      currentRole: data.style?.currentRole || 'Neutral'
    };
    
    // Personality traits (influences storylines and backstage dynamics)
    this.traits = data.traits || [];
    
    // Contract details
    this.contract = {
      signed: data.contract?.signed || new Date().toISOString(),
      expires: data.contract?.expires || this.calculateExpiryDate(),
      salary: data.contract?.salary || 1000, // weekly salary
      status: data.contract?.status || 'Active', // Active, Injured, Suspended, Released
      exclusivity: data.contract?.exclusivity || 'Exclusive', // Exclusive, Non-Exclusive, Per-Appearance
      minimumAppearances: data.contract?.minimumAppearances || 4 // per month
    };
    
    // Statistics and history
    this.stats = {
      matches: data.stats?.matches || 0,
      wins: data.stats?.wins || 0,
      losses: data.stats?.losses || 0,
      draws: data.stats?.draws || 0,
      championships: data.stats?.championships || [],
      rivalries: data.stats?.rivalries || [],
      allies: data.stats?.allies || [],
      lastMatchDate: data.stats?.lastMatchDate || null,
      averageRating: data.stats?.averageRating || 0
    };
    
    // Career development
    this.development = {
      potential: data.development?.potential || 75, // maximum potential (0-100)
      experience: data.development?.experience || 0, // experience points
      trainingPoints: data.development?.trainingPoints || 0, // points to allocate to attributes
      skillCeiling: data.development?.skillCeiling || {} // max value for each attribute
    };
  }
  
  /**
   * Calculate contract expiry date (1 year from now by default)
   * @return {string} ISO date string
   */
  calculateExpiryDate() {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    return expiryDate.toISOString();
  }
  
  /**
   * Calculate overall rating based on attributes
   * @return {number} Overall rating (0-100)
   */
  calculateOverall() {
    const { strength, speed, technique, charisma, stamina, microphone } = this.attributes;
    // Different weights for different attributes
    return Math.round(
      (strength * 0.15) +
      (speed * 0.15) +
      (technique * 0.2) +
      (charisma * 0.2) +
      (stamina * 0.15) +
      (microphone * 0.15)
    );
  }
  
  /**
   * Create a wrestler object from JSON data
   * @param {Object} json - JSON data
   * @return {Wrestler} New wrestler instance
   */
  static fromJSON(json) {
    return new Wrestler(json);
  }
  
  /**
   * Convert wrestler to plain object
   * @return {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      nickname: this.nickname,
      gender: this.gender,
      age: this.age,
      height: this.height,
      weight: this.weight,
      image: this.image,
      bio: this.bio,
      homeTown: this.homeTown,
      attributes: this.attributes,
      style: this.style,
      traits: this.traits,
      contract: this.contract,
      stats: this.stats,
      development: this.development
    };
  }
}

module.exports = Wrestler;