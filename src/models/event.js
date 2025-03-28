// src/models/event.js
const crypto = require('crypto');

/**
 * Wrestling Event data model
 */
class Event {
  /**
   * Create a new event
   * @param {Object} data - Event data
   */
  constructor(data = {}) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || 'New Event';
    this.date = data.date || new Date().toISOString();
    
    // Event type and status
    this.type = data.type || 'Weekly Show'; // Weekly Show, Pay-Per-View, Special
    this.status = data.status || 'Scheduled'; // Scheduled, In Progress, Completed, Cancelled
    this.isRecurring = data.isRecurring !== undefined ? data.isRecurring : false;
    this.recurringPattern = data.recurringPattern || null; // weekly, monthly, etc.
    
    // Venue information
    this.venue = {
      name: data.venue?.name || 'Local Arena',
      city: data.venue?.city || 'City',
      state: data.venue?.state || 'State',
      country: data.venue?.country || 'Country',
      capacity: data.venue?.capacity || 1000,
      cost: data.venue?.cost || 2000
    };
    
    // Attendance and financial data
    this.attendance = {
      tickets: {
        available: data.attendance?.tickets?.available || this.venue.capacity,
        sold: data.attendance?.tickets?.sold || 0,
        comped: data.attendance?.tickets?.comped || 0
      },
      ticketPrices: {
        general: data.attendance?.ticketPrices?.general || 20,
        premium: data.attendance?.ticketPrices?.premium || 50,
        vip: data.attendance?.ticketPrices?.vip || 100
      },
      forecasted: data.attendance?.forecasted || 0,
      actual: data.attendance?.actual || 0,
      percentFull: data.attendance?.percentFull || 0
    };
    
    // Match card
    this.card = data.card || [];
    
    // Event ratings and feedback
    this.ratings = {
      overall: data.ratings?.overall || 0,
      crowd: data.ratings?.crowd || 0,
      critical: data.ratings?.critical || 0,
      matchRatings: data.ratings?.matchRatings || []
    };
    
    // Financial summary
    this.finances = {
      revenue: {
        tickets: data.finances?.revenue?.tickets || 0,
        merchandise: data.finances?.revenue?.merchandise || 0,
        sponsorships: data.finances?.revenue?.sponsorships || 0,
        broadcasting: data.finances?.revenue?.broadcasting || 0,
        total: data.finances?.revenue?.total || 0
      },
      expenses: {
        venue: data.finances?.expenses?.venue || this.venue.cost,
        production: data.finances?.expenses?.production || 0,
        talent: data.finances?.expenses?.talent || 0,
        marketing: data.finances?.expenses?.marketing || 0,
        misc: data.finances?.expenses?.misc || 0,
        total: data.finances?.expenses?.total || 0
      },
      profit: data.finances?.profit || 0
    };
    
    // Storyline advancements
    this.storylineProgression = data.storylineProgression || [];
    
    // Marketing and promotion
    this.marketing = {
      budget: data.marketing?.budget || 0,
      socialMediaReach: data.marketing?.socialMediaReach || 0,
      promos: data.marketing?.promos || [],
      specialAttractions: data.marketing?.specialAttractions || []
    };
    
    // Notes and special instructions
    this.notes = data.notes || '';
  }
  
  /**
   * Add a match to the event card
   * @param {Object} match - Match data
   */
  addMatch(match) {
    const matchId = match.id || crypto.randomUUID();
    
    this.card.push({
      id: matchId,
      title: match.title || 'Singles Match',
      type: match.type || 'Singles',
      participants: match.participants || [],
      stipulation: match.stipulation || '',
      championship: match.championship || null,
      duration: match.duration || 15, // in minutes
      scheduledOrder: this.card.length + 1,
      bookedOutcome: match.bookedOutcome || null,
      actualOutcome: null,
      rating: 0,
      notes: match.notes || ''
    });
    
    return matchId;
  }
  
  /**
   * Calculate expected ticket revenue
   * @return {number} Expected revenue
   */
  calculateExpectedRevenue() {
    // Basic calculation - will be more complex in real implementation
    const generalRevenue = this.attendance.tickets.available * 0.7 * this.attendance.ticketPrices.general;
    const premiumRevenue = this.attendance.tickets.available * 0.2 * this.attendance.ticketPrices.premium;
    const vipRevenue = this.attendance.tickets.available * 0.1 * this.attendance.ticketPrices.vip;
    
    return generalRevenue + premiumRevenue + vipRevenue;
  }
  
  /**
   * Finalize event after it's completed
   * @param {Object} results - Event results data
   */
  finalizeEvent(results) {
    this.status = 'Completed';
    
    // Update attendance
    this.attendance.actual = results.attendance || 0;
    this.attendance.percentFull = Math.round((this.attendance.actual / this.venue.capacity) * 100);
    
    // Update ratings
    this.ratings = results.ratings || this.ratings;
    
    // Update finances with actual numbers
    this.finances = results.finances || this.finances;
    
    // Calculate profit
    this.finances.profit = this.finances.revenue.total - this.finances.expenses.total;
    
    return this;
  }
  
  /**
   * Create an event object from JSON data
   * @param {Object} json - JSON data
   * @return {Event} New event instance
   */
  static fromJSON(json) {
    return new Event(json);
  }
  
  /**
   * Convert event to plain object
   * @return {Object} Plain object representation
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      date: this.date,
      type: this.type,
      status: this.status,
      isRecurring: this.isRecurring,
      recurringPattern: this.recurringPattern,
      venue: this.venue,
      attendance: this.attendance,
      card: this.card,
      ratings: this.ratings,
      finances: this.finances,
      storylineProgression: this.storylineProgression,
      marketing: this.marketing,
      notes: this.notes
    };
  }
}

module.exports = Event;