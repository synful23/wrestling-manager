// src/models/promotion.js
const crypto = require('crypto');

/**
 * Wrestling Promotion data model
 */
class Promotion {
  /**
   * Create a new promotion
   * @param {Object} data - Promotion data
   */
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || 'New Wrestling Promotion';
    this.shortName = data.shortName || 'NWP';
    this.logo = data.logo || 'default_logo.png';
    this.founded = data.founded || new Date().toISOString();
    this.isPlayerOwned = data.isPlayerOwned !== undefined ? data.isPlayerOwned : true;
    
    // Company details
    this.details = {
      owner: data.details?.owner || 'Player Name',
      headquartersCity: data.details?.headquartersCity || 'City',
      headquartersCountry: data.details?.headquartersCountry || 'Country',
      website: data.details?.website || 'www.promotion.com',
      slogan: data.details?.slogan || 'Wrestling for everyone!',
      description: data.details?.description || ''
    };
    
    // Reputation and reach
    this.reputation = {
      overall: data.reputation?.overall || 50, // 0-100 scale
      localMarket: data.reputation?.localMarket || 60,
      nationalMarket: data.reputation?.nationalMarket || 40,
      internationalMarket: data.reputation?.internationalMarket || 20,
      industryPrestige: data.reputation?.industryPrestige || 30
    };
    
    // Fan base demographics
    this.fanBase = {
      total: data.fanBase?.total || 10000,
      loyalty: data.fanBase?.loyalty || 60, // 0-100 scale
      demographics: {
        casual: data.fanBase?.demographics?.casual || 60, // percentages
        hardcore: data.fanBase?.demographics?.hardcore || 30,
        lapsed: data.fanBase?.demographics?.lapsed || 10,
        ageGroups: {
          under18: data.fanBase?.demographics?.ageGroups?.under18 || 15,
          age18to34: data.fanBase?.demographics?.ageGroups?.age18to34 || 45,
          age35to50: data.fanBase?.demographics?.ageGroups?.age35to50 || 30,
          over50: data.fanBase?.demographics?.ageGroups?.over50 || 10
        },
        gender: {
          male: data.fanBase?.demographics?.gender?.male || 70,
          female: data.fanBase?.demographics?.gender?.female || 25,
          other: data.fanBase?.demographics?.gender?.other || 5
        }
      },
      growth: data.fanBase?.growth || 0, // positive or negative growth rate
      satisfactionRating: data.fanBase?.satisfactionRating || 70 // 0-100 scale
    };
    
    // Shows and schedule
    this.shows = {
      weekly: data.shows?.weekly || [],
      monthly: data.shows?.monthly || [],
      annual: data.shows?.annual || []
    };
    
    // Broadcasting and media deals
    this.broadcasting = {
      tvDeals: data.broadcasting?.tvDeals || [],
      streamingPlatforms: data.broadcasting?.streamingPlatforms || [],
      socialMedia: {
        followers: data.broadcasting?.socialMedia?.followers || 50000,
        engagement: data.broadcasting?.socialMedia?.engagement || 5, // percentage
        platforms: data.broadcasting?.socialMedia?.platforms || []
      }
    };
    
    // Finances
    this.finances = {
      balance: data.finances?.balance || 250000,
      weeklyRevenue: data.finances?.weeklyRevenue || 25000,
      weeklyExpenses: data.finances?.weeklyExpenses || 20000,
      profitMargin: data.finances?.profitMargin || 20, // percentage
      debtLevel: data.finances?.debtLevel || 0,
      creditRating: data.finances?.creditRating || 'A',
      history: data.finances?.history || []
    };
    
    // Roster capacity and contracts
    this.rosterManagement = {
      maxSize: data.rosterManagement?.maxSize || 30,
      currentSize: data.rosterManagement?.currentSize || 0,
      salaryBudget: data.rosterManagement?.salaryBudget || 100000,
      currentSalaries: data.rosterManagement?.currentSalaries || 0,
      contractsExpiringSoon: data.rosterManagement?.contractsExpiringSoon || []
    };
    
    // Championships and titles
    this.championships = data.championships || [];
    
    // Active storylines
    this.storylines = data.storylines || [];
    
    // Rivals and relationships
    this.relationships = {
      allies: data.relationships?.allies || [],
      rivals: data.relationships?.rivals || [],
      talentExchanges: data.relationships?.talentExchanges || []
    };
    
    // Staff and personnel
    this.staff = {
      bookers: data.staff?.bookers || [],
      scouts: data.staff?.scouts || [],
      trainers: data.staff?.trainers || [],
      producers: data.staff?.producers || []
    };
    
    // Company policies and style
    this.policies = {
      matchStyle: data.policies?.matchStyle || 'Balanced', // Sports-oriented, Entertainment-focused, Hardcore, Technical, etc.
      contentRating: data.policies?.contentRating || 'PG-13', // G, PG, PG-13, R, etc.
      drugTesting: data.policies?.drugTesting || 'Standard',
      injuryProtocol: data.policies?.injuryProtocol || 'Cautious',
      talentDevelopment: data.policies?.talentDevelopment || 'Moderate'
    };
    
    // Facilities
    this.facilities = {
      headquarters: {
        quality: data.facilities?.headquarters?.quality || 3, // 1-5 scale
        size: data.facilities?.headquarters?.size || 'Medium',
        monthlyCost: data.facilities?.headquarters?.monthlyCost || 5000
      },
      trainingCenter: {
        quality: data.facilities?.trainingCenter?.quality || 2,
        size: data.facilities?.trainingCenter?.size || 'Small',
        monthlyCost: data.facilities?.trainingCenter?.monthlyCost || 3000
      },
      performanceCenter: data.facilities?.performanceCenter || null
    };
    
    // Game history and records
    this.history = {
      foundedDate: data.history?.foundedDate || new Date().toISOString(),
      majorEvents: data.history?.majorEvents || [],
      hallOfFame: data.history?.hallOfFame || [],
      championships: data.history?.championships || []
    };
  }

  /**
   * Add a wrestler to the roster
   * @param {Object} wrestler - Wrestler object
   */
  addWrestler(wrestler) {
    // This would connect to a separate roster management system
    this.rosterManagement.currentSize++;
    this.rosterManagement.currentSalaries += wrestler.contract.salary;
    
    return {
      success: true,
      message: `${wrestler.name} has been added to the roster`,
      currentRosterSize: this.rosterManagement.currentSize,
      remainingCapacity: this.rosterManagement.maxSize - this.rosterManagement.currentSize
    };
  }
  
  /**
   * Remove a wrestler from the roster
   * @param {Object} wrestler - Wrestler object
   */
  removeWrestler(wrestler) {
    if (this.rosterManagement.currentSize > 0) {
      this.rosterManagement.currentSize--;
      this.rosterManagement.currentSalaries -= wrestler.contract.salary;
      
      return {
        success: true,
        message: `${wrestler.name} has been removed from the roster`,
        currentRosterSize: this.rosterManagement.currentSize
      };
    }
    
    return {
      success: false,
      message: 'Roster is already empty'
    };
  }
  
  /**
   * Schedule a new show
   * @param {string} type - Show type (weekly, monthly, annual)
   * @param {Object} showDetails - Show details
   */
  scheduleShow(type, showDetails) {
    if (!['weekly', 'monthly', 'annual'].includes(type)) {
      return { success: false, message: 'Invalid show type' };
    }
    
    const show = {
      id: showDetails.id || crypto.randomUUID(),
      name: showDetails.name || 'New Show',
      day: showDetails.day || 'Monday',
      time: showDetails.time || '20:00',
      duration: showDetails.duration || 120, // minutes
      venue: showDetails.venue || 'Regular Arena',
      broadcastPartner: showDetails.broadcastPartner || null,
      isActive: showDetails.isActive !== undefined ? showDetails.isActive : true
    };
    
    this.shows[type].push(show);
    
    return {
      success: true,
      message: `${show.name} has been scheduled as a ${type} show`,
      showId: show.id
    };
  }
  
  /**
   * Cancel a scheduled show
   * @param {string} type - Show type (weekly, monthly, annual)
   * @param {string} id - Show ID
   */
  cancelShow(type, id) {
    if (!['weekly', 'monthly', 'annual'].includes(type)) {
      return { success: false, message: 'Invalid show type' };
    }
    
    const index = this.shows[type].findIndex(show => show.id === id);
    if (index === -1) {
      return { success: false, message: 'Show not found' };
    }
    
    const show = this.shows[type][index];
    show.isActive = false;
    
    return {
      success: true,
      message: `${show.name} has been cancelled`,
      show
    };
  }
  
  /**
   * Add a new TV or media deal
   * @param {Object} dealDetails - Deal details
   */
  addMediaDeal(dealDetails) {
    const deal = {
      id: dealDetails.id || crypto.randomUUID(),
      partner: dealDetails.partner || 'TV Network',
      type: dealDetails.type || 'Television', // Television, Streaming, etc.
      show: dealDetails.show || null,
      value: dealDetails.value || 100000, // Annual value
      startDate: dealDetails.startDate || new Date().toISOString(),
      endDate: dealDetails.endDate || this.calculateDealExpiryDate(),
      requirements: dealDetails.requirements || {
        minimumRating: 70,
        contentRestrictions: []
      }
    };
    
    if (deal.type === 'Television') {
      this.broadcasting.tvDeals.push(deal);
    } else if (deal.type === 'Streaming') {
      this.broadcasting.streamingPlatforms.push(deal);
    }
    
    // Update weekly revenue
    this.finances.weeklyRevenue += Math.floor(deal.value / 52);
    
    return {
      success: true,
      message: `New ${deal.type} deal added with ${deal.partner}`,
      deal
    };
  }
  
  /**
   * Calculate TV deal expiry date (3 years from now by default)
   * @return {string} ISO date string
   */
  calculateDealExpiryDate() {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);
    return expiryDate.toISOString();
  }
  
  /**
   * Update promotion finances
   * @param {Object} transaction - Financial transaction details
   */
  updateFinances(transaction) {
    const { type, amount, description, date } = transaction;
    
    if (type === 'income') {
      this.finances.balance += amount;
    } else if (type === 'expense') {
      this.finances.balance -= amount;
    }
    
    // Record transaction in history
    this.finances.history.push({
      date: date || new Date().toISOString(),
      type,
      amount,
      description,
      balanceAfter: this.finances.balance
    });
    
    // Update profit margin
    if (this.finances.weeklyRevenue > 0) {
      this.finances.profitMargin = ((this.finances.weeklyRevenue - this.finances.weeklyExpenses) / 
                                    this.finances.weeklyRevenue) * 100;
    }
    
    return {
      success: true,
      message: `Financial ${type} of $${amount} recorded: ${description}`,
      currentBalance: this.finances.balance
    };
  }
  
  /**
   * Process weekly finances
   * @return {Object} Financial update results
   */
  processWeeklyFinances() {
    const weeklyProfit = this.finances.weeklyRevenue - this.finances.weeklyExpenses;
    this.finances.balance += weeklyProfit;
    
    // Record weekly transaction
    this.finances.history.push({
      date: new Date().toISOString(),
      type: weeklyProfit >= 0 ? 'income' : 'expense',
      amount: Math.abs(weeklyProfit),
      description: 'Weekly operations',
      balanceAfter: this.finances.balance
    });
    
    // Update profit margin
    this.finances.profitMargin = ((this.finances.weeklyRevenue - this.finances.weeklyExpenses) / 
                                  this.finances.weeklyRevenue) * 100;
    
    return {
      success: true,
      message: `Weekly finances processed: ${weeklyProfit >= 0 ? 'Profit' : 'Loss'} of $${Math.abs(weeklyProfit)}`,
      weeklyRevenue: this.finances.weeklyRevenue,
      weeklyExpenses: this.finances.weeklyExpenses,
      weeklyProfit,
      currentBalance: this.finances.balance
    };
  }
  
  /**
   * Upgrade a facility
   * @param {string} facility - Facility type (headquarters, trainingCenter, performanceCenter)
   * @param {Object} upgrade - Upgrade details
   */
  upgradeFacility(facility, upgrade) {
    if (!['headquarters', 'trainingCenter', 'performanceCenter'].includes(facility)) {
      return { success: false, message: 'Invalid facility type' };
    }
    
    if (facility === 'performanceCenter' && !this.facilities.performanceCenter) {
      // Create new performance center
      this.facilities.performanceCenter = {
        quality: 1,
        size: 'Small',
        monthlyCost: 10000
      };
      
      // Deduct cost from balance
      this.updateFinances({
        type: 'expense',
        amount: 250000, // Initial construction cost
        description: 'Performance Center construction'
      });
      
      return {
        success: true,
        message: 'Performance Center has been built',
        facility: this.facilities.performanceCenter
      };
    }
    
    const currentFacility = this.facilities[facility];
    
    // Apply upgrade
    if (upgrade.quality) {
      if (upgrade.quality <= currentFacility.quality) {
        return { success: false, message: 'Cannot downgrade facility quality' };
      }
      
      const qualityIncrease = upgrade.quality - currentFacility.quality;
      const upgradeCost = qualityIncrease * 50000; // $50,000 per quality level
      
      // Deduct cost from balance
      this.updateFinances({
        type: 'expense',
        amount: upgradeCost,
        description: `${facility} quality upgrade`
      });
      
      currentFacility.quality = upgrade.quality;
      
      // Increase monthly cost
      currentFacility.monthlyCost += qualityIncrease * 1000; // $1,000 per quality level
    }
    
    if (upgrade.size && upgrade.size !== currentFacility.size) {
      const sizeRanking = { 'Small': 1, 'Medium': 2, 'Large': 3 };
      const currentSizeRank = sizeRanking[currentFacility.size];
      const newSizeRank = sizeRanking[upgrade.size];
      
      if (newSizeRank <= currentSizeRank) {
        return { success: false, message: 'Cannot downsize facility' };
      }
      
      const sizeIncrease = newSizeRank - currentSizeRank;
      const upgradeCost = sizeIncrease * 100000; // $100,000 per size level
      
      // Deduct cost from balance
      this.updateFinances({
        type: 'expense',
        amount: upgradeCost,
        description: `${facility} size upgrade`
      });
      
      currentFacility.size = upgrade.size;
      
      // Increase monthly cost
      currentFacility.monthlyCost += sizeIncrease * 2000; // $2,000 per size level
    }
    
    return {
      success: true,
      message: `${facility} has been upgraded`,
      facility: this.facilities[facility]
    };
  }
  
  /**
   * Calculate fan satisfaction based on recent events
   * @param {Array} recentEvents - Array of recent events
   * @return {number} Updated satisfaction rating
   */
  calculateFanSatisfaction(recentEvents) {
    if (!recentEvents || recentEvents.length === 0) {
      return this.fanBase.satisfactionRating;
    }
    
    // Calculate average event rating
    const averageRating = recentEvents.reduce((sum, event) => sum + event.ratings.overall, 0) / recentEvents.length;
    
    // Convert 0-5 star rating to 0-100 scale
    const ratingOn100Scale = (averageRating / 5) * 100;
    
    // Weighted combination of previous satisfaction and recent events
    const newSatisfaction = (this.fanBase.satisfactionRating * 0.7) + (ratingOn100Scale * 0.3);
    
    // Update fan satisfaction
    this.fanBase.satisfactionRating = Math.round(Math.max(0, Math.min(100, newSatisfaction)));
    
    return this.fanBase.satisfactionRating;
  }
  
  /**
   * Update fan base data based on recent events and promotion actions
   * @param {Object} updates - Fan base update data
   */
  updateFanBase(updates) {
    // Update total fans
    if (updates.fanChange) {
      this.fanBase.total += updates.fanChange;
    }
    
    // Update growth rate
    if (updates.growthChange) {
      this.fanBase.growth += updates.growthChange;
    }
    
    // Update satisfaction
    if (updates.satisfactionChange) {
      this.fanBase.satisfactionRating = Math.max(0, Math.min(100, 
        this.fanBase.satisfactionRating + updates.satisfactionChange));
    }
    
    // Update demographics if provided
    if (updates.demographics) {
      // Casual/hardcore/lapsed split
      if (updates.demographics.casual) {
        this.fanBase.demographics.casual = updates.demographics.casual;
        this.fanBase.demographics.hardcore = updates.demographics.hardcore || this.fanBase.demographics.hardcore;
        this.fanBase.demographics.lapsed = updates.demographics.lapsed || this.fanBase.demographics.lapsed;
      }
      
      // Age groups
      if (updates.demographics.ageGroups) {
        Object.assign(this.fanBase.demographics.ageGroups, updates.demographics.ageGroups);
      }
      
      // Gender distribution
      if (updates.demographics.gender) {
        Object.assign(this.fanBase.demographics.gender, updates.demographics.gender);
      }
    }
    
    return {
      success: true,
      message: 'Fan base updated',
      currentFans: this.fanBase.total,
      satisfaction: this.fanBase.satisfactionRating,
      growth: this.fanBase.growth
    };
  }
  
  /**
   * Add a new staff member
   * @param {string} role - Staff role (booker, scout, trainer, producer)
   * @param {Object} staffMember - Staff member details
   */
  addStaffMember(role, staffMember) {
    if (!['bookers', 'scouts', 'trainers', 'producers'].includes(role)) {
      return { success: false, message: 'Invalid staff role' };
    }
    
    const newStaff = {
      id: staffMember.id || crypto.randomUUID(),
      name: staffMember.name || 'New Staff Member',
      specialty: staffMember.specialty || '',
      skill: staffMember.skill || 70, // 0-100 scale
      salary: staffMember.salary || 1000, // Weekly salary
      hired: staffMember.hired || new Date().toISOString()
    };
    
    this.staff[role].push(newStaff);
    
    // Update weekly expenses
    this.finances.weeklyExpenses += newStaff.salary;
    
    return {
      success: true,
      message: `${newStaff.name} has been hired as a ${role.slice(0, -1)}`,
      staffMember: newStaff
    };
  }
  
  /**
   * Remove a staff member
   * @param {string} role - Staff role (booker, scout, trainer, producer)
   * @param {string} id - Staff member ID
   */
  removeStaffMember(role, id) {
    if (!['bookers', 'scouts', 'trainers', 'producers'].includes(role)) {
      return { success: false, message: 'Invalid staff role' };
    }
    
    const index = this.staff[role].findIndex(member => member.id === id);
    if (index === -1) {
      return { success: false, message: 'Staff member not found' };
    }
    
    const staffMember = this.staff[role][index];
    
    // Remove staff member
    this.staff[role].splice(index, 1);
    
    // Update weekly expenses
    this.finances.weeklyExpenses -= staffMember.salary;
    
    return {
      success: true,
      message: `${staffMember.name} has been removed from staff`,
      staffMember
    };
  }
  
  /**
   * Create a new promotion object from JSON data
   * @param {Object} json - JSON data
   * @return {Promotion} New promotion instance
   */
  static fromJSON(json) {
    return new Promotion(json);
  }
  
  /**
   * Convert promotion to plain object
   * @return {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      shortName: this.shortName,
      logo: this.logo,
      founded: this.founded,
      isPlayerOwned: this.isPlayerOwned,
      details: this.details,
      reputation: this.reputation,
      fanBase: this.fanBase,
      shows: this.shows,
      broadcasting: this.broadcasting,
      finances: this.finances,
      rosterManagement: this.rosterManagement,
      championships: this.championships,
      storylines: this.storylines,
      relationships: this.relationships,
      staff: this.staff,
      policies: this.policies,
      facilities: this.facilities,
      history: this.history
    };
  }
}

module.exports = Promotion;