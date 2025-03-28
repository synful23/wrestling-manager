// src/ui/navigation.js
// Handles the navigation between different sections of the application
// Use the path relative to this file
class NavigationManager {
    constructor() {
      this.currentSection = null;
      this.sections = {
        dashboard: {
          id: 'dashboard',
          title: 'Dashboard',
          icon: 'bi-speedometer2',
          loadFunction: this.loadDashboard.bind(this)
        },
        roster: {
          id: 'roster',
          title: 'Roster',
          icon: 'bi-people-fill',
          loadFunction: this.loadRoster.bind(this)
        },
        booking: {
          id: 'booking',
          title: 'Event Booking',
          icon: 'bi-calendar-event',
          loadFunction: this.loadBooking.bind(this)
        },
        championships: {
          id: 'championships',
          title: 'Championships',
          icon: 'bi-trophy',
          loadFunction: this.loadChampionships.bind(this)
        },
        storylines: {
          id: 'storylines',
          title: 'Storylines',
          icon: 'bi-book',
          loadFunction: this.loadStorylines.bind(this)
        },
        finances: {
          id: 'finances',
          title: 'Finances',
          icon: 'bi-cash-coin',
          loadFunction: this.loadFinances.bind(this)
        },
        statistics: {
          id: 'statistics',
          title: 'Statistics',
          icon: 'bi-bar-chart',
          loadFunction: this.loadStatistics.bind(this)
        },
        settings: {
          id: 'settings',
          title: 'Settings',
          icon: 'bi-gear',
          loadFunction: this.loadSettings.bind(this)
        }
      };
    }
  
    /**
     * Initialize the navigation system
     */
    init() {
      // Create navigation sidebar
      this.createNavigationSidebar();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Load default section (dashboard)
      this.navigateTo('dashboard');
    }
  
    /**
     * Create the navigation sidebar
     */
    createNavigationSidebar() {
      const mainContainer = document.getElementById('app-container');
      if (!mainContainer) {
        console.error('App container not found');
        return;
      }
      
      // Clear existing content
      mainContainer.innerHTML = '';
      
      // Create sidebar and content area
      const appHTML = `
        <div class="row g-0 h-100">
          <!-- Sidebar Navigation -->
          <div class="col-md-3 col-lg-2 sidebar bg-dark text-white">
            <div class="d-flex flex-column p-3 h-100">
              <div class="mb-4 py-2 border-bottom">
                <h3 class="text-center">Wrestling Manager</h3>
              </div>
              <ul class="nav nav-pills flex-column mb-auto" id="main-nav">
                ${Object.values(this.sections).map(section => `
                  <li class="nav-item mb-1">
                    <a href="#" class="nav-link text-white" id="nav-${section.id}" data-section="${section.id}">
                      <i class="bi ${section.icon} me-2"></i>
                      ${section.title}
                    </a>
                  </li>
                `).join('')}
              </ul>
              <div class="mt-auto border-top pt-3">
                <button class="btn btn-success w-100 mb-2" id="btn-advance-week">
                  <i class="bi bi-arrow-right-circle me-2"></i> Advance Week
                </button>
                <button class="btn btn-primary w-100 mb-2" id="btn-save-game">
                  <i class="bi bi-save me-2"></i> Save Game
                </button>
              </div>
            </div>
          </div>
          
          <!-- Main Content Area -->
          <div class="col-md-9 col-lg-10 content-area bg-light">
            <div class="container-fluid p-4">
              <div id="section-header" class="mb-4"></div>
              <div id="content-container"></div>
            </div>
          </div>
        </div>
      `;
      
      mainContainer.innerHTML = appHTML;
    }
  
    /**
     * Set up event listeners for navigation
     */
    setupEventListeners() {
      // Add event listeners to navigation items
      const navItems = document.querySelectorAll('#main-nav .nav-link');
      navItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const sectionId = item.getAttribute('data-section');
          this.navigateTo(sectionId);
        });
      });
      
      // Set up advance week button
      const advanceWeekButton = document.getElementById('btn-advance-week');
      if (advanceWeekButton) {
        advanceWeekButton.addEventListener('click', async () => {
          try {
            const result = await window.gameAPI.advanceWeek();
            this.showNotification('Game advanced to next week', 'success');
            
            // Reload current section to reflect changes
            if (this.currentSection) {
              this.navigateTo(this.currentSection);
            }
          } catch (error) {
            console.error('Error advancing week:', error);
            this.showNotification('Failed to advance week', 'danger');
          }
        });
      }
      
      // Set up save game button
      const saveGameButton = document.getElementById('btn-save-game');
      if (saveGameButton) {
        saveGameButton.addEventListener('click', async () => {
          try {
            const result = await window.gameAPI.saveGame();
            this.showNotification('Game saved successfully', 'success');
          } catch (error) {
            console.error('Error saving game:', error);
            this.showNotification('Failed to save game', 'danger');
          }
        });
      }
    }
  
    /**
     * Navigate to a specific section
     * @param {string} sectionId - ID of the section to navigate to
     */
    navigateTo(sectionId) {
      if (!this.sections[sectionId]) {
        console.error(`Section "${sectionId}" not found`);
        return;
      }
      
      // Update active navigation item
      const navItems = document.querySelectorAll('#main-nav .nav-link');
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
          item.classList.add('active');
        }
      });
      
      // Update current section
      this.currentSection = sectionId;
      
      // Update section header
      const sectionHeader = document.getElementById('section-header');
      if (sectionHeader) {
        sectionHeader.innerHTML = `
          <h2>
            <i class="bi ${this.sections[sectionId].icon} me-2"></i>
            ${this.sections[sectionId].title}
          </h2>
        `;
      }
      
      // Load section content
      this.sections[sectionId].loadFunction();
    }
  
    /**
     * Show a notification message
     * @param {string} message - Message to display
     * @param {string} type - Bootstrap alert type (success, danger, warning, info)
     */
    showNotification(message, type = 'info') {
      const contentContainer = document.getElementById('content-container');
      
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `alert alert-${type} alert-dismissible fade show notification-toast`;
      notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      
      // Add to DOM
      contentContainer.insertAdjacentElement('beforebegin', notification);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 150);
      }, 5000);
    }
  
    // Section loading methods
    
    /**
     * Load the dashboard section
     */
    async loadDashboard() {
      const contentContainer = document.getElementById('content-container');
      
      try {
        // Get promotion data
        const promotion = await window.gameAPI.getPlayerPromotion();
        
        // Create dashboard UI
        contentContainer.innerHTML = `
          <div class="row">
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header">
                  <h4>Promotion Overview</h4>
                </div>
                <div class="card-body">
                  <h3>${promotion.name}</h3>
                  <p class="text-muted">${promotion.details.slogan}</p>
                  <hr>
                  <div class="row">
                    <div class="col-6">
                      <h5>Reputation</h5>
                      <div class="progress mb-3" style="height: 25px;">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: ${promotion.reputation.overall}%">
                          ${promotion.reputation.overall}%
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <h5>Fan Satisfaction</h5>
                      <div class="progress mb-3" style="height: 25px;">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${promotion.fanBase.satisfactionRating}%">
                          ${promotion.fanBase.satisfactionRating}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-3">
                    <p><strong>Total Fans:</strong> ${promotion.fanBase.total.toLocaleString()}</p>
                    <p><strong>Balance:</strong> $${promotion.finances.balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header">
                  <h4>Quick Actions</h4>
                </div>
                <div class="card-body">
                  <div class="d-grid gap-2">
                    <button class="btn btn-primary" id="btn-schedule-show">
                      <i class="bi bi-calendar-plus me-2"></i> Schedule Show
                    </button>
                    <button class="btn btn-info" id="btn-scout-talent">
                      <i class="bi bi-binoculars me-2"></i> Scout New Talent
                    </button>
                    <button class="btn btn-warning" id="btn-manage-contracts">
                      <i class="bi bi-file-earmark-text me-2"></i> Manage Contracts
                    </button>
                    <button class="btn btn-success" id="btn-marketing-campaign">
                      <i class="bi bi-megaphone me-2"></i> Run Marketing Campaign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h4>Upcoming Events</h4>
                  <a href="#" class="btn btn-sm btn-outline-primary" id="view-all-events">View All</a>
                </div>
                <div class="card-body">
                  <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action">
                      <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">Weekly Show</h5>
                        <small>7 days</small>
                      </div>
                      <p class="mb-1">Your next weekly television show.</p>
                      <small>Local Arena, Seattle</small>
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                      <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">Monthly PPV: Summer Showdown</h5>
                        <small>21 days</small>
                      </div>
                      <p class="mb-1">Monthly pay-per-view event.</p>
                      <small>Major Arena, Los Angeles</small>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h4>Roster Highlights</h4>
                  <a href="#" class="btn btn-sm btn-outline-primary" id="view-full-roster">View All</a>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-6 mb-3">
                      <div class="card bg-light">
                        <div class="card-body p-3">
                          <h5>Top Star</h5>
                          <p class="mb-0">The Champion</p>
                          <small class="text-muted">Popularity: 95%</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 mb-3">
                      <div class="card bg-light">
                        <div class="card-body p-3">
                          <h5>Rising Star</h5>
                          <p class="mb-0">High Flyer</p>
                          <small class="text-muted">Popularity: 82%</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 mb-3">
                      <div class="card bg-light">
                        <div class="card-body p-3">
                          <h5>Contract Expiring</h5>
                          <p class="mb-0">The Veteran</p>
                          <small class="text-muted">45 days remaining</small>
                        </div>
                      </div>
                    </div>
                    <div class="col-6 mb-3">
                      <div class="card bg-light">
                        <div class="card-body p-3">
                          <h5>Injured</h5>
                          <p class="mb-0">The Powerhouse</p>
                          <small class="text-muted">Returns in 14 days</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Add event listeners for dashboard actions
        document.getElementById('view-all-events')?.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateTo('booking');
        });
        
        document.getElementById('view-full-roster')?.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateTo('roster');
        });
        
        // Set up buttons (placeholders for now)
        ['btn-schedule-show', 'btn-scout-talent', 'btn-manage-contracts', 'btn-marketing-campaign'].forEach(id => {
          document.getElementById(id)?.addEventListener('click', () => {
            this.showNotification(`Feature not implemented yet: ${id.replace('btn-', '').replace(/-/g, ' ')}`, 'info');
          });
        });
        
      } catch (error) {
        console.error('Error loading dashboard:', error);
        contentContainer.innerHTML = `
          <div class="alert alert-danger">
            Error loading dashboard. Please check the console for details.
          </div>
        `;
      }
    }
  
    /**
     * Load the roster section
     */
    async loadRoster() {
      const contentContainer = document.getElementById('content-container');
      
      try {
        const wrestlers = await window.gameAPI.getAllWrestlers();
        
        // Create roster UI
        contentContainer.innerHTML = `
          <div class="row mb-4">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h4>Wrestler Roster</h4>
                  <button class="btn btn-success" id="add-wrestler-btn">
                    <i class="bi bi-person-plus me-2"></i> Add Wrestler
                  </button>
                </div>
                <div class="card-body">
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Style</th>
                        <th>Popularity</th>
                        <th>Overall</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody id="wrestler-list">
                      ${wrestlers.map(wrestler => `
                        <tr>
                          <td>${wrestler.name}</td>
                          <td>${wrestler.style.primary}</td>
                          <td>
                            <div class="progress" style="height: 15px;">
                              <div class="progress-bar bg-success" role="progressbar" style="width: ${wrestler.attributes.popularity}%">
                                ${wrestler.attributes.popularity}%
                              </div>
                            </div>
                          </td>
                          <td>
                            <div class="progress" style="height: 15px;">
                              <div class="progress-bar bg-primary" role="progressbar" style="width: ${this.calculateOverall(wrestler.attributes)}%">
                                ${this.calculateOverall(wrestler.attributes)}
                              </div>
                            </div>
                          </td>
                          <td>${wrestler.contract.status}</td>
                          <td>
                            <button class="btn btn-sm btn-info view-wrestler" data-id="${wrestler.id}">
                              <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning edit-wrestler" data-id="${wrestler.id}">
                              <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-wrestler" data-id="${wrestler.id}">
                              <i class="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Add event listeners for wrestler actions
        document.querySelectorAll('.view-wrestler').forEach(button => {
          button.addEventListener('click', () => {
            this.viewWrestler(button.getAttribute('data-id'));
          });
        });
        
        document.querySelectorAll('.edit-wrestler').forEach(button => {
          button.addEventListener('click', () => {
            this.editWrestler(button.getAttribute('data-id'));
          });
        });
        
        document.querySelectorAll('.delete-wrestler').forEach(button => {
          button.addEventListener('click', async () => {
            const wrestlerId = button.getAttribute('data-id');
            const wrestler = wrestlers.find(w => w.id === wrestlerId);
            
            if (confirm(`Are you sure you want to release ${wrestler.name} from your roster?`)) {
              try {
                await window.gameAPI.deleteWrestler(wrestlerId);
                this.showNotification(`${wrestler.name} has been released from your roster`, 'success');
                this.loadRoster(); // Reload roster
              } catch (error) {
                console.error('Error deleting wrestler:', error);
                this.showNotification('Error releasing wrestler', 'danger');
              }
            }
          });
        });
        
        // Add wrestler button
        document.getElementById('add-wrestler-btn')?.addEventListener('click', () => {
          this.showAddWrestlerForm();
        });
        
      } catch (error) {
        console.error('Error loading roster:', error);
        contentContainer.innerHTML = `
          <div class="alert alert-danger">
            Error loading roster. Please check the console for details.
          </div>
        `;
      }
    }
  
    /**
     * Load the booking section
     */
    async loadBooking() {
      const contentContainer = document.getElementById('content-container');
      
      try {
        const events = await window.gameAPI.getAllEvents();
        
        // Create events UI
        contentContainer.innerHTML = `
          <div class="row mb-4">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h4>Event Schedule</h4>
                  <button class="btn btn-success" id="create-event-btn">
                    <i class="bi bi-calendar-plus me-2"></i> Create New Event
                  </button>
                </div>
                <div class="card-body">
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Venue</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody id="event-list">
                      ${events.map(event => `
                        <tr>
                          <td>${event.name}</td>
                          <td>${new Date(event.date).toLocaleDateString()}</td>
                          <td>${event.venue.name}, ${event.venue.city}</td>
                          <td>${event.type}</td>
                          <td>
                            <span class="badge ${this.getStatusBadgeClass(event.status)}">
                              ${event.status}
                            </span>
                          </td>
                          <td>
                            <button class="btn btn-sm btn-info view-event" data-id="${event.id}">
                              <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning edit-event" data-id="${event.id}">
                              <i class="bi bi-pencil"></i>
                            </button>
                            ${event.status === 'Scheduled' ? `
                              <button class="btn btn-sm btn-success run-event" data-id="${event.id}">
                                <i class="bi bi-play"></i>
                              </button>
                            ` : ''}
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Add event listeners for event actions
        document.querySelectorAll('.view-event').forEach(button => {
          button.addEventListener('click', () => {
            this.viewEvent(button.getAttribute('data-id'));
          });
        });
        
        document.querySelectorAll('.edit-event').forEach(button => {
          button.addEventListener('click', () => {
            this.editEvent(button.getAttribute('data-id'));
          });
        });
        
        document.querySelectorAll('.run-event').forEach(button => {
          button.addEventListener('click', () => {
            this.runEvent(button.getAttribute('data-id'));
          });
        });
        
        // Create event button
        document.getElementById('create-event-btn')?.addEventListener('click', () => {
          this.showCreateEventForm();
        });
        
      } catch (error) {
        console.error('Error loading events:', error);
        contentContainer.innerHTML = `
          <div class="alert alert-danger">
            Error loading events. Please check the console for details.
          </div>
        `;
      }
    }
  
    /**
     * Load the championships section
     */
    async loadChampionships() {
      const contentContainer = document.getElementById('content-container');
      
      try {
        const championships = await window.gameAPI.getAllChampionships();
        
        // Create championships UI
        contentContainer.innerHTML = `
          <div class="row mb-4">
            <div class="col-md-12 mb-4">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h4>Active Championships</h4>
                  <button class="btn btn-success" id="create-championship-btn">
                    <i class="bi bi-plus-circle me-2"></i> Create New Championship
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row">
            ${championships.map(championship => `
              <div class="col-md-6 mb-4">
                <div class="card h-100">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h4>${championship.name}</h4>
                    <span class="badge bg-primary">Prestige: ${championship.prestige}%</span>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-4 text-center">
                        <div class="bg-light rounded mb-3 p-3" style="height: 150px;">
                          <i class="bi bi-trophy text-warning" style="font-size: 5rem;"></i>
                        </div>
                      </div>
                      <div class="col-md-8">
                        <h5>${championship.currentChampion.name === 'Vacant' ? 'Title Vacant' : 'Current Champion'}</h5>
                        <p class="lead">${championship.currentChampion.name}</p>
                        ${championship.currentChampion.name !== 'Vacant' ? `
                          <p><strong>Reign Length:</strong> ${this.calculateDaysBetween(new Date(championship.currentChampion.wonOn), new Date())} days</p>
                          <p><strong>Defenses:</strong> ${championship.currentChampion.defenseCount}</p>
                        ` : ''}
                        <p><strong>Type:</strong> ${this.formatTitleType(championship.type)}</p>
                        <div class="mt-3">
                          <button class="btn btn-sm btn-info view-championship" data-id="${championship.id}">
                            <i class="bi bi-eye me-2"></i> View History
                          </button>
                          <button class="btn btn-sm btn-warning edit-championship" data-id="${championship.id}">
                            <i class="bi bi-pencil me-2"></i> Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        
        // Add event listeners for championship actions
        document.querySelectorAll('.view-championship').forEach(button => {
          button.addEventListener('click', () => {
            this.viewChampionship(button.getAttribute('data-id'));
          });
        });
        
        document.querySelectorAll('.edit-championship').forEach(button => {
          button.addEventListener('click', () => {
            this.editChampionship(button.getAttribute('data-id'));
          });
        });
        
        // Create championship button
        document.getElementById('create-championship-btn')?.addEventListener('click', () => {
          this.showCreateChampionshipForm();
        });
        
      } catch (error) {
        console.error('Error loading championships:', error);
        contentContainer.innerHTML = `
          <div class="alert alert-danger">
            Error loading championships. Please check the console for details.
          </div>
        `;
      }
    }
  
    /**
     * Load the storylines section
     */
    loadStorylines() {
      const contentContainer = document.getElementById('content-container');
      
      // Placeholder for storylines section
      contentContainer.innerHTML = `
        <div class="alert alert-info">
          <h4>Coming Soon</h4>
          <p>The storylines feature is still in development.</p>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h4>Storyline Planning</h4>
          </div>
          <div class="card-body">
            <p>This section will allow you to:</p>
            <ul>
              <li>Create and manage storylines between wrestlers</li>
              <li>Track feuds and alliances</li>
              <li>Plan long-term booking arcs</li>
              <li>Measure fan engagement with different narratives</li>
            </ul>
            <p>Check back soon for updates!</p>
          </div>
        </div>
      `;
    }
  
    /**
     * Load the finances section
     */
    async loadFinances() {
      const contentContainer = document.getElementById('content-container');
      
      try {
        const promotion = await window.gameAPI.getPlayerPromotion();
        
        // Create finances UI
        contentContainer.innerHTML = `
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h4>Financial Overview</h4>
                </div>
                <div class="card-body">
                  <h3>$${promotion.finances.balance.toLocaleString()}</h3>
                  <p class="text-muted">Current Balance</p>
                  <hr>
                  <div class="row mb-3">
                    <div class="col-6">
                      <h5>Weekly Revenue</h5>
                      <p class="text-success">$${promotion.finances.weeklyRevenue.toLocaleString()}</p>
                    </div>
                    <div class="col-6">
                      <h5>Weekly Expenses</h5>
                      <p class="text-danger">$${promotion.finances.weeklyExpenses.toLocaleString()}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-6">
                      <h5>Profit Margin</h5>
                      <div class="progress" style="height: 25px;">
                        <div class="progress-bar ${promotion.finances.profitMargin >= 0 ? 'bg-success' : 'bg-danger'}" role="progressbar" 
                             style="width: ${Math.min(Math.abs(promotion.finances.profitMargin), 100)}%">
                          ${promotion.finances.profitMargin.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-header">
                  <h4>Financial Actions</h4>
                </div>
                <div class="card-body">
                  <div class="d-grid gap-2">
                    <button class="btn btn-primary" id="btn-budget-planning">
                      <i class="bi bi-calculator me-2"></i> Budget Planning
                    </button>
                    <button class="btn btn-info" id="btn-sponsorship-deals">
                      <i class="bi bi-briefcase me-2"></i> Sponsorship Deals
                    </button>
                    <button class="btn btn-warning" id="btn-tv-contracts">
                      <i class="bi bi-tv me-2"></i> TV Contracts
                    </button>
                    <button class="btn btn-success" id="btn-merchandise">
                      <i class="bi bi-shop me-2"></i> Merchandise
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header">
                  <h4>Recent Transactions</h4>
                </div>
                <div class="card-body">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${promotion.finances.history.slice(0, 10).map(transaction => `
                        <tr>
                          <td>${new Date(transaction.date).toLocaleDateString()}</td>
                          <td>${transaction.description}</td>
                          <td>
                            <span class="badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}">
                              ${transaction.type === 'income' ? 'Income' : 'Expense'}
                            </span>
                          </td>
                          <td>${transaction.amount.toLocaleString()}</td>
                          <td>${transaction.balanceAfter.toLocaleString()}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        `;
        
        // Add event listeners for financial actions
        ['btn-budget-planning', 'btn-sponsorship-deals', 'btn-tv-contracts', 'btn-merchandise'].forEach(id => {
          document.getElementById(id)?.addEventListener('click', () => {
            this.showNotification(`Feature not implemented yet: ${id.replace('btn-', '').replace(/-/g, ' ')}`, 'info');
          });
        });
        
      } catch (error) {
        console.error('Error loading finances:', error);
        contentContainer.innerHTML = `
          <div class="alert alert-danger">
            Error loading finances. Please check the console for details.
          </div>
        `;
      }
    }
  
    /**
     * Load the statistics section
     */
    loadStatistics() {
      const contentContainer = document.getElementById('content-container');
      
      // Placeholder for statistics section
      contentContainer.innerHTML = `
        <div class="alert alert-info">
          <h4>Coming Soon</h4>
          <p>The detailed statistics feature is still in development.</p>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h4>Statistics & Analytics</h4>
          </div>
          <div class="card-body">
            <p>This section will provide detailed metrics and analytics including:</p>
            <ul>
              <li>Attendance trends</li>
              <li>Revenue analysis</li>
              <li>Wrestler popularity tracking</li>
              <li>Match ratings statistics</li>
              <li>Fan demographic insights</li>
            </ul>
            <p>Check back soon for updates!</p>
          </div>
        </div>
      `;
    }
  
    /**
     * Load the settings section
     */
    loadSettings() {
      const contentContainer = document.getElementById('content-container');
      
      // Create settings UI
      contentContainer.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h4>Game Settings</h4>
              </div>
              <div class="card-body">
                <form id="game-settings-form">
                  <div class="mb-3">
                    <label class="form-label">Difficulty Level</label>
                    <select class="form-select" id="difficulty-setting">
                      <option value="easy">Easy</option>
                      <option value="normal" selected>Normal</option>
                      <option value="hard">Hard</option>
                      <option value="simulation">Simulation</option>
                    </select>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Auto-Save Frequency</label>
                    <select class="form-select" id="autosave-setting">
                      <option value="never">Never</option>
                      <option value="weekly" selected>Every Week</option>
                      <option value="monthly">Every Month</option>
                      <option value="yearly">Every Year</option>
                    </select>
                  </div>
                  
                  <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="injuries-setting" checked>
                    <label class="form-check-label" for="injuries-setting">Enable Injuries</label>
                  </div>
                  
                  <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="retirements-setting" checked>
                    <label class="form-check-label" for="retirements-setting">Enable Retirements</label>
                  </div>
                  
                  <div class="text-end">
                    <button type="submit" class="btn btn-primary">Save Settings</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="card-header">
                <h4>Save/Load Game</h4>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button class="btn btn-primary" id="btn-save-game-file">
                    <i class="bi bi-save me-2"></i> Save Game to File
                  </button>
                  <button class="btn btn-info" id="btn-load-game-file">
                    <i class="bi bi-folder-open me-2"></i> Load Game from File
                  </button>
                  <button class="btn btn-warning" id="btn-new-game">
                    <i class="bi bi-plus-circle me-2"></i> Start New Game
                  </button>
                </div>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header">
                <h4>About</h4>
              </div>
              <div class="card-body">
                <h5>Wrestling Booking Manager</h5>
                <p>Version 1.0.0</p>
                <p>A simulation game for wrestling bookers and promoters.</p>
                <p>© 2025 Your Name</p>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add settings form handler
      document.getElementById('game-settings-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.showNotification('Settings saved successfully', 'success');
      });
      
      // Add event listeners for save/load actions
      document.getElementById('btn-save-game-file')?.addEventListener('click', async () => {
        try {
          await window.gameAPI.saveGame();
          this.showNotification('Game saved successfully', 'success');
        } catch (error) {
          console.error('Error saving game:', error);
          this.showNotification('Failed to save game', 'danger');
        }
      });
      
      document.getElementById('btn-load-game-file')?.addEventListener('click', async () => {
        try {
          await window.gameAPI.loadGame();
          this.showNotification('Game loaded successfully', 'success');
          this.navigateTo('dashboard');
        } catch (error) {
          console.error('Error loading game:', error);
          this.showNotification('Failed to load game', 'danger');
        }
      });
      
      document.getElementById('btn-new-game')?.addEventListener('click', async () => {
        if (confirm('Are you sure you want to start a new game? All unsaved progress will be lost.')) {
          try {
            await window.gameAPI.newGame();
            this.showNotification('New game started', 'success');
            this.navigateTo('dashboard');
          } catch (error) {
            console.error('Error starting new game:', error);
            this.showNotification('Failed to start new game', 'danger');
          }
        }
      });
    }
  
    // Utility methods
    
    /**
     * Calculate overall rating for a wrestler
     * @param {Object} attributes - Wrestler attributes
     * @return {number} Overall rating
     */
    calculateOverall(attributes) {
      const { strength, speed, technique, charisma, stamina, microphone } = attributes;
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
     * Calculate days between two dates
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @return {number} Number of days
     */
    calculateDaysBetween(startDate, endDate) {
      const diffTime = Math.abs(endDate - startDate);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    /**
     * Format championship type
     * @param {Object} type - Championship type object
     * @return {string} Formatted type string
     */
    formatTitleType(type) {
      const parts = [];
      if (type.level) parts.push(this.capitalize(type.level));
      if (type.weight) parts.push(this.capitalize(type.weight));
      if (type.team) parts.push('Tag Team');
      if (type.gender && type.gender !== 'any') parts.push(this.capitalize(type.gender));
      
      return parts.join(' ');
    }
    
    /**
     * Capitalize first letter of a string
     * @param {string} str - String to capitalize
     * @return {string} Capitalized string
     */
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    /**
     * Get Bootstrap badge class for event status
     * @param {string} status - Event status
     * @return {string} Badge class
     */
    getStatusBadgeClass(status) {
      switch (status) {
        case 'Scheduled': return 'bg-primary';
        case 'In Progress': return 'bg-warning';
        case 'Completed': return 'bg-success';
        case 'Cancelled': return 'bg-danger';
        default: return 'bg-secondary';
      }
    }
    
    // Wrestler management methods
    
    /**
     * Show wrestler details
     * @param {string} id - Wrestler ID
     */
    async viewWrestler(id) {
      const contentContainer = document.getElementById('content-container');
      
      try {
        const wrestler = await window.gameAPI.getWrestler(id);
        if (!wrestler) throw new Error('Wrestler not found');
        
        // Get championship info if wrestler is a champion
        const championships = await window.gameAPI.getAllChampionships();
        const championship = championships.find(c => c.currentChampion.wrestlerId === wrestler.id);
        
        // Create wrestler details UI
        contentContainer.innerHTML = `
          <div class="row">
            <div class="col-md-4">
              <div class="card mb-4">
                <div class="card-header">
                  <h3>${wrestler.name}</h3>
                  ${wrestler.nickname ? `<div class="text-muted">"${wrestler.nickname}"</div>` : ''}
                </div>
                <div class="card-body">
                  <div class="text-center mb-3">
                    <div class="bg-light rounded mb-3 p-3" style="height: 200px;">
                      <i class="bi bi-person" style="font-size: 8rem;"></i>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-6">
                      <p><strong>Age:</strong> ${wrestler.age}</p>
                      <p><strong>Style:</strong> ${wrestler.style.primary}</p>
                      <p><strong>Role:</strong> ${wrestler.style.currentRole}</p>
                    </div>
                    <div class="col-6">
                      <p><strong>Height:</strong> ${wrestler.height} cm</p>
                      <p><strong>Weight:</strong> ${wrestler.weight} kg</p>
                      <p><strong>From:</strong> ${wrestler.homeTown || 'Unknown'}</p>
                    </div>
                  </div>
                  <div class="mb-3">
                    <p><strong>Status:</strong> ${wrestler.contract.status}</p>
                    <p><strong>Contract:</strong> ${wrestler.contract.salary.toLocaleString()} per week</p>
                    <p><strong>Expires:</strong> ${new Date(wrestler.contract.expires).toLocaleDateString()}</p>
                    ${championship ? `<p><strong>Current Champion:</strong> ${championship.name}</p>` : ''}
                  </div>
                </div>
              </div>
              
              <div class="card">
                <div class="card-header">
                  <h4>Wrestling Style</h4>
                </div>
                <div class="card-body">
                  <p><strong>Primary Style:</strong> ${wrestler.style.primary}</p>
                  <p><strong>Secondary Style:</strong> ${wrestler.style.secondary || 'None'}</p>
                  <p><strong>Signature Move:</strong> ${wrestler.style.signature}</p>
                  <p><strong>Finisher:</strong> ${wrestler.style.finisher}</p>
                  <p><strong>Preferred Role:</strong> ${wrestler.style.preferredRole}</p>
                  <p><strong>Current Role:</strong> ${wrestler.style.currentRole}</p>
                </div>
              </div>
            </div>
            
            <div class="col-md-8">
              <div class="card mb-4">
                <div class="card-header">
                  <h4>Attributes</h4>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label>Strength: ${wrestler.attributes.strength}</label>
                        <div class="progress" style="height: 20px;">
                          <div class="progress-bar bg-danger" role="progressbar" style="width: ${wrestler.attributes.strength}%">
                            ${wrestler.attributes.strength}
                          </div>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label>Speed: ${wrestler.attributes.speed}</label>
                        <div class="progress" style="height: 20px;">
                          <div class="progress-bar bg-info" role="progressbar" style="width: ${wrestler.attributes.speed}%">
                            ${wrestler.attributes.speed}
                          </div>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label>Technique: ${wrestler.attributes.technique}</label>
                        <div class="progress" style="height: 20px;">
                          <div class="progress-bar bg-primary" role="progressbar" style="width: ${wrestler.attributes.technique}%">
                            ${wrestler.attributes.technique}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label>Charisma: ${wrestler.attributes.charisma}</label>
                        <div class="progress" style="height: 20px;">
                          <div class="progress-bar bg-warning" role="progressbar" style="width: ${wrestler.attributes.charisma}%">
                            ${wrestler.attributes.charisma}
                          </div>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label>Microphone: ${wrestler.attributes.microphone}</label>
                        <div class="progress" style="height: 20px;">
                          <div class="progress-bar bg-success" role="progressbar" style="width: ${wrestler.attributes.microphone}%">
                            ${wrestler.attributes.microphone}
                          </div>
                        </div>
                      </div>
                      <div class="mb-3">
                        <label>Stamina: ${wrestler.attributes.stamina}</label>
                        <div class="progress" style="height: 20px;">
                          <div class="progress-bar bg-secondary" role="progressbar" style="width: ${wrestler.attributes.stamina}%">
                            ${wrestler.attributes.stamina}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label>Popularity: ${wrestler.attributes.popularity}%</label>
                        <div class="progress" style="height: 20px;">
                          <div class="progress-bar bg-success" role="progressbar" style="width: ${wrestler.attributes.popularity}%">
                            ${wrestler.attributes.popularity}%
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label>Morale: ${wrestler.attributes.morale}%</label>
                        <div class="progress" style="height: 20px;">
                          <div class="progress-bar ${wrestler.attributes.morale > 70 ? 'bg-success' : wrestler.attributes.morale > 40 ? 'bg-warning' : 'bg-danger'}" 
                               role="progressbar" style="width: ${wrestler.attributes.morale}%">
                            ${wrestler.attributes.morale}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-12">
                      <div class="card bg-light">
                        <div class="card-body">
                          <h5>Overall Rating</h5>
                          <div class="progress" style="height: 30px;">
                            <div class="progress-bar bg-primary" role="progressbar" 
                                 style="width: ${this.calculateOverall(wrestler.attributes)}%">
                              ${this.calculateOverall(wrestler.attributes)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card mb-4">
                <div class="card-header">
                  <h4>Career Statistics</h4>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-3 text-center mb-3">
                      <div class="card bg-light h-100">
                        <div class="card-body p-3">
                          <h1>${wrestler.stats.matches}</h1>
                          <p class="mb-0">Total Matches</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3 text-center mb-3">
                      <div class="card bg-light h-100">
                        <div class="card-body p-3">
                          <h1>${wrestler.stats.wins}</h1>
                          <p class="mb-0">Wins</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3 text-center mb-3">
                      <div class="card bg-light h-100">
                        <div class="card-body p-3">
                          <h1>${wrestler.stats.losses}</h1>
                          <p class="mb-0">Losses</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-3 text-center mb-3">
                      <div class="card bg-light h-100">
                        <div class="card-body p-3">
                          <h1>${wrestler.stats.championships.length}</h1>
                          <p class="mb-0">Title Reigns</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <p><strong>Win Percentage:</strong> ${wrestler.stats.matches > 0 ? ((wrestler.stats.wins / wrestler.stats.matches) * 100).toFixed(1) : 0}%</p>
                      <p><strong>Average Match Rating:</strong> ${wrestler.stats.averageRating.toFixed(1)} stars</p>
                      <p><strong>Last Match:</strong> ${wrestler.stats.lastMatchDate ? new Date(wrestler.stats.lastMatchDate).toLocaleDateString() : 'No matches yet'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <h4>Personality Traits</h4>
                </div>
                <div class="card-body">
                  ${wrestler.traits.length > 0 ? `
                    <div class="row">
                      ${wrestler.traits.map(trait => `
                        <div class="col-md-4 mb-2">
                          <div class="card bg-light">
                            <div class="card-body p-2 text-center">
                              ${trait}
                            </div>
                          </div>
                        </div>
                      `).join('')}
                    </div>
                  ` : '<p>No notable personality traits.</p>'}
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-secondary" id="back-to-roster">
              <i class="bi bi-arrow-left me-2"></i> Back to Roster
            </button>
            <button class="btn btn-warning ms-2" id="edit-this-wrestler">
              <i class="bi bi-pencil me-2"></i> Edit Wrestler
            </button>
            <button class="btn btn-primary ms-2" id="book-this-wrestler">
              <i class="bi bi-calendar-plus me-2"></i> Book in Match
            </button>
          </div>
        `;
        
        // Add event listeners
        document.getElementById('back-to-roster')?.addEventListener('click', () => {
          this.loadRoster();
        });
        
        document.getElementById('edit-this-wrestler')?.addEventListener('click', () => {
          this.editWrestler(wrestler.id);
        });
        
        document.getElementById('book-this-wrestler')?.addEventListener('click', () => {
          this.showNotification('Booking feature not implemented yet', 'info');
        });
        
      } catch (error) {
        console.error('Error loading wrestler details:', error);
        contentContainer.innerHTML = `
          <div class="alert alert-danger">
            Error loading wrestler details. Please check the console for details.
          </div>
          <button class="btn btn-secondary" id="back-to-roster">Back to Roster</button>
        `;
        
        document.getElementById('back-to-roster')?.addEventListener('click', () => {
          this.loadRoster();
        });
      }
    }
    
    /**
   * Show form to add a new wrestler
   */
  showAddWrestlerForm() {
    const contentContainer = document.getElementById('content-container');
    
    // Create form UI
    contentContainer.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h4>Add New Wrestler</h4>
        </div>
        <div class="card-body">
          <form id="add-wrestler-form">
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" id="wrestler-name" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Nickname</label>
                <input type="text" class="form-control" id="wrestler-nickname">
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-4">
                <label class="form-label">Age</label>
                <input type="number" class="form-control" id="wrestler-age" min="18" max="60" value="28">
              </div>
              <div class="col-md-4">
                <label class="form-label">Height (cm)</label>
                <input type="number" class="form-control" id="wrestler-height" min="150" max="220" value="180">
              </div>
              <div class="col-md-4">
                <label class="form-label">Weight (kg)</label>
                <input type="number" class="form-control" id="wrestler-weight" min="50" max="200" value="90">
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Hometown</label>
                <input type="text" class="form-control" id="wrestler-hometown" value="">
              </div>
              <div class="col-md-6">
                <label class="form-label">Gender</label>
                <select class="form-select" id="wrestler-gender">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Primary Style</label>
                <select class="form-select" id="wrestler-style">
                  <option value="Technical">Technical</option>
                  <option value="Powerhouse">Powerhouse</option>
                  <option value="High-Flyer">High-Flyer</option>
                  <option value="Brawler">Brawler</option>
                  <option value="All-Rounder">All-Rounder</option>
                  <option value="Showman">Showman</option>
                  <option value="Submission">Submission Specialist</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Role</label>
                <select class="form-select" id="wrestler-role">
                  <option value="Face">Face (Hero)</option>
                  <option value="Heel">Heel (Villain)</option>
                  <option value="Neutral">Neutral</option>
                </select>
              </div>
            </div>
            
            <h5 class="mt-4 mb-3">Attributes</h5>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Strength <span id="strength-value">50</span></label>
                <input type="range" class="form-range" id="attr-strength" min="30" max="100" value="50">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Speed <span id="speed-value">50</span></label>
                <input type="range" class="form-range" id="attr-speed" min="30" max="100" value="50">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Technique <span id="technique-value">50</span></label>
                <input type="range" class="form-range" id="attr-technique" min="30" max="100" value="50">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Charisma <span id="charisma-value">50</span></label>
                <input type="range" class="form-range" id="attr-charisma" min="30" max="100" value="50">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Microphone <span id="microphone-value">50</span></label>
                <input type="range" class="form-range" id="attr-microphone" min="30" max="100" value="50">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Stamina <span id="stamina-value">50</span></label>
                <input type="range" class="form-range" id="attr-stamina" min="30" max="100" value="50">
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Popularity <span id="popularity-value">50</span></label>
                <input type="range" class="form-range" id="attr-popularity" min="30" max="100" value="50">
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Signature Move</label>
                <input type="text" class="form-control" id="signature-move" value="Signature Move">
              </div>
              <div class="col-md-6">
                <label class="form-label">Finisher</label>
                <input type="text" class="form-control" id="finisher-move" value="Finisher">
              </div>
            </div>
            
            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Weekly Salary ($)</label>
                <input type="number" class="form-control" id="wrestler-salary" min="500" value="2000">
              </div>
              <div class="col-md-6">
                <label class="form-label">Contract Status</label>
                <select class="form-select" id="contract-status">
                  <option value="Active">Active</option>
                  <option value="Injured">Injured</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            
            <div class="text-end mt-4">
              <button type="button" class="btn btn-secondary me-2" id="cancel-add-wrestler">Cancel</button>
              <button type="submit" class="btn btn-primary">Add Wrestler</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    // Add event listeners to update range value displays
    ['strength', 'speed', 'technique', 'charisma', 'microphone', 'stamina', 'popularity'].forEach(attr => {
      const slider = document.getElementById(`attr-${attr}`);
      const display = document.getElementById(`${attr}-value`);
      slider?.addEventListener('input', () => {
        if (display) display.textContent = slider.value;
      });
    });
    
    // Add form submission handler
    document.getElementById('add-wrestler-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form values
      const wrestlerData = {
        name: document.getElementById('wrestler-name')?.value,
        nickname: document.getElementById('wrestler-nickname')?.value,
        age: parseInt(document.getElementById('wrestler-age')?.value || '28'),
        height: parseInt(document.getElementById('wrestler-height')?.value || '180'),
        weight: parseInt(document.getElementById('wrestler-weight')?.value || '90'),
        gender: document.getElementById('wrestler-gender')?.value,
        homeTown: document.getElementById('wrestler-hometown')?.value,
        attributes: {
          strength: parseInt(document.getElementById('attr-strength')?.value || '50'),
          speed: parseInt(document.getElementById('attr-speed')?.value || '50'),
          technique: parseInt(document.getElementById('attr-technique')?.value || '50'),
          charisma: parseInt(document.getElementById('attr-charisma')?.value || '50'),
          microphone: parseInt(document.getElementById('attr-microphone')?.value || '50'),
          stamina: parseInt(document.getElementById('attr-stamina')?.value || '50'),
          popularity: parseInt(document.getElementById('attr-popularity')?.value || '50'),
          morale: 80,
          health: 100
        },
        style: {
          primary: document.getElementById('wrestler-style')?.value,
          signature: document.getElementById('signature-move')?.value,
          finisher: document.getElementById('finisher-move')?.value,
          preferredRole: document.getElementById('wrestler-role')?.value,
          currentRole: document.getElementById('wrestler-role')?.value
        },
        contract: {
          salary: parseInt(document.getElementById('wrestler-salary')?.value || '2000'),
          status: document.getElementById('contract-status')?.value
        }
      };
      
      try {
        // Add wrestler to game data
        await window.gameAPI.addWrestler(wrestlerData);
        this.showNotification(`${wrestlerData.name} has been added to your roster`, 'success');
        this.loadRoster();
      } catch (error) {
        console.error('Error adding wrestler:', error);
        this.showNotification('Error adding wrestler', 'danger');
      }
    });
    
    // Cancel button
    document.getElementById('cancel-add-wrestler')?.addEventListener('click', () => {
      this.loadRoster();
    });
  }
  
  /**
   * Edit wrestler
   * @param {string} id - Wrestler ID
   */
  async editWrestler(id) {
    // Placeholder for edit wrestler functionality
    this.showNotification('Edit wrestler functionality not implemented yet', 'info');
  }
  
  /**
   * View championship details
   * @param {string} id - Championship ID
   */
  async viewChampionship(id) {
    // Placeholder for view championship functionality
    this.showNotification('View championship functionality not implemented yet', 'info');
  }
  
  /**
   * Show form to create a new championship
   */
  showCreateChampionshipForm() {
    // Placeholder for create championship form
    this.showNotification('Create championship functionality not implemented yet', 'info');
  }
  
  /**
   * Edit championship
   * @param {string} id - Championship ID
   */
  async editChampionship(id) {
    // Placeholder for edit championship functionality
    this.showNotification('Edit championship functionality not implemented yet', 'info');
  }
  
  /**
   * View event details
   * @param {string} id - Event ID
   */
  async viewEvent(id) {
    // Placeholder for view event functionality
    this.showNotification('View event functionality not implemented yet', 'info');
  }
  
  /**
   * Show form to create a new event
   */
  showCreateEventForm() {
    // Placeholder for create event form
    this.showNotification('Create event functionality not implemented yet', 'info');
  }
  
  /**
   * Edit event
   * @param {string} id - Event ID
   */
  async editEvent(id) {
    // Placeholder for edit event functionality
    this.showNotification('Edit event functionality not implemented yet', 'info');
  }
  
  /**
   * Run event simulation
   * @param {string} id - Event ID
   */
  async runEvent(id) {
    // Placeholder for run event functionality
    this.showNotification('Run event functionality not implemented yet', 'info');
  }
}

// At the end of navigation.js file
window.NavigationManager = NavigationManager;
module.exports = NavigationManager;