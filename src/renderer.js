// src/renderer.js
// API for interacting with the main process and game data
const { ipcRenderer } = require('electron');

// Game data API
window.gameAPI = {
  // Wrestlers
  getAllWrestlers: () => ipcRenderer.invoke('get-wrestlers'),
  getWrestler: (id) => ipcRenderer.invoke('get-wrestler', id),
  addWrestler: (data) => ipcRenderer.invoke('add-wrestler', data),
  updateWrestler: (id, data) => ipcRenderer.invoke('update-wrestler', id, data),
  deleteWrestler: (id) => ipcRenderer.invoke('delete-wrestler', id),
  
  // Championships
  getAllChampionships: () => ipcRenderer.invoke('get-championships'),
  getChampionship: (id) => ipcRenderer.invoke('get-championship', id),
  
  // Events
  getAllEvents: () => ipcRenderer.invoke('get-events'),
  getEvent: (id) => ipcRenderer.invoke('get-event', id),
  
  // Promotion
  getPlayerPromotion: () => ipcRenderer.invoke('get-player-promotion'),
  
  // Game state
  saveGame: () => ipcRenderer.invoke('save-game'),
  loadGame: () => ipcRenderer.invoke('load-game'),
  newGame: () => ipcRenderer.invoke('new-game'),
  advanceWeek: () => ipcRenderer.invoke('advance-week')
};

// Initialize UI components
document.addEventListener('DOMContentLoaded', async () => {
  // Load roster data and set up navigation
  await loadRoster();
  setupNavigation();
  
  // Add event listener for the "Add Wrestler" button
  document.getElementById('add-wrestler-btn')?.addEventListener('click', showAddWrestlerForm);
});

// Set up navigation
function setupNavigation() {
  document.querySelectorAll('.list-group-item').forEach(navItem => {
    navItem.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Update active nav item
      document.querySelectorAll('.list-group-item').forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      
      // Update content based on navigation
      const contentArea = document.getElementById('content-area');
      const navId = this.id;
      
      switch(navId) {
        case 'nav-roster':
          contentArea.innerHTML = '<h2>Roster Management</h2>';
          loadRoster();
          break;
        case 'nav-booking':
          contentArea.innerHTML = '<h2>Event Booking</h2>';
          loadEvents();
          break;
        case 'nav-championships':
          contentArea.innerHTML = '<h2>Championships</h2>';
          loadChampionships();
          break;
        case 'nav-statistics':
          contentArea.innerHTML = '<h2>Statistics</h2><p>View ratings and metrics.</p>';
          break;
        case 'nav-finances':
          contentArea.innerHTML = '<h2>Finance</h2><p>Manage your finances.</p>';
          loadFinances();
          break;
      }
    });
  });
}

// Load and display roster data
async function loadRoster() {
  try {
    const wrestlers = await window.gameAPI.getAllWrestlers();
    const contentArea = document.getElementById('content-area');
    
    // Create roster UI
    const rosterHTML = `
      <h2>Roster Management</h2>
      <div class="card mb-3">
        <div class="card-header">
          <div class="row">
            <div class="col">
              <h5>Your Wrestlers</h5>
            </div>
            <div class="col text-end">
              <button class="btn btn-primary btn-sm" id="add-wrestler-btn">Add Wrestler</button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <table class="table table-striped">
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
                  <td>${wrestler.attributes.popularity}%</td>
                  <td>${calculateOverall(wrestler.attributes)}</td>
                  <td>${wrestler.contract.status}</td>
                  <td>
                    <button class="btn btn-sm btn-info view-wrestler" data-id="${wrestler.id}">View</button>
                    <button class="btn btn-sm btn-warning edit-wrestler" data-id="${wrestler.id}">Edit</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    contentArea.innerHTML = rosterHTML;
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-wrestler').forEach(button => {
      button.addEventListener('click', function() {
        viewWrestler(this.getAttribute('data-id'));
      });
    });
    
    document.querySelectorAll('.edit-wrestler').forEach(button => {
      button.addEventListener('click', function() {
        editWrestler(this.getAttribute('data-id'));
      });
    });
    
    document.getElementById('add-wrestler-btn').addEventListener('click', showAddWrestlerForm);
    
  } catch (error) {
    console.error('Error loading roster:', error);
  }
}

// Calculate overall rating
function calculateOverall(attributes) {
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

// View wrestler details
async function viewWrestler(id) {
  try {
    const wrestler = await window.gameAPI.getWrestler(id);
    if (!wrestler) return;
    
    // Get championship info if wrestler is a champion
    const championships = await window.gameAPI.getAllChampionships();
    const championship = championships.find(c => c.currentChampion.wrestlerId === wrestler.id);
    
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
      <h2>Wrestler Profile</h2>
      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <div class="card-header">
              <h3>${wrestler.name}</h3>
              ${wrestler.nickname ? `<div class="text-muted">"${wrestler.nickname}"</div>` : ''}
            </div>
            <div class="card-body">
              <div class="text-center mb-3">
                <img src="placeholder.jpg" class="img-fluid rounded" alt="${wrestler.name}" style="max-height: 200px; background-color: #ddd;">
              </div>
              <p><strong>Style:</strong> ${wrestler.style.primary}</p>
              <p><strong>Age:</strong> ${wrestler.age}</p>
              <p><strong>Status:</strong> ${wrestler.contract.status}</p>
              <p><strong>Salary:</strong> $${wrestler.contract.salary} per week</p>
              ${championship ? `<p><strong>Current Champion:</strong> ${championship.name}</p>` : ''}
            </div>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h4>Attributes</h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label>Strength: ${wrestler.attributes.strength}</label>
                    <div class="stat-bar">
                      <div class="stat-value" style="width: ${wrestler.attributes.strength}%"></div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Speed: ${wrestler.attributes.speed}</label>
                    <div class="stat-bar">
                      <div class="stat-value" style="width: ${wrestler.attributes.speed}%"></div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Technique: ${wrestler.attributes.technique}</label>
                    <div class="stat-bar">
                      <div class="stat-value" style="width: ${wrestler.attributes.technique}%"></div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label>Charisma: ${wrestler.attributes.charisma}</label>
                    <div class="stat-bar">
                      <div class="stat-value" style="width: ${wrestler.attributes.charisma}%"></div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Microphone: ${wrestler.attributes.microphone}</label>
                    <div class="stat-bar">
                      <div class="stat-value" style="width: ${wrestler.attributes.microphone}%"></div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label>Popularity: ${wrestler.attributes.popularity}%</label>
                    <div class="stat-bar">
                      <div class="stat-value" style="width: ${wrestler.attributes.popularity}%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card mt-3">
            <div class="card-header">
              <h4>Wrestling Style</h4>
            </div>
            <div class="card-body">
              <p><strong>Signature Move:</strong> ${wrestler.style.signature}</p>
              <p><strong>Finisher:</strong> ${wrestler.style.finisher}</p>
              <p><strong>Current Role:</strong> ${wrestler.style.currentRole}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3">
        <button class="btn btn-secondary" id="back-to-roster">Back to Roster</button>
        <button class="btn btn-warning ms-2" id="edit-this-wrestler">Edit</button>
      </div>
    `;
    
    document.getElementById('back-to-roster').addEventListener('click', () => {
      document.getElementById('nav-roster').click();
    });
    
    document.getElementById('edit-this-wrestler').addEventListener('click', () => {
      editWrestler(wrestler.id);
    });
  } catch (error) {
    console.error('Error viewing wrestler:', error);
  }
}

// Show form to add a new wrestler
function showAddWrestlerForm() {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = `
    <h2>Add New Wrestler</h2>
    <div class="card">
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
              <label class="form-label">Primary Style</label>
              <select class="form-select" id="wrestler-style">
                <option value="Technical">Technical</option>
                <option value="Powerhouse">Powerhouse</option>
                <option value="High-Flyer">High-Flyer</option>
                <option value="Brawler">Brawler</option>
                <option value="All-Rounder">All-Rounder</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Role</label>
              <select class="form-select" id="wrestler-role">
                <option value="Face">Face</option>
                <option value="Heel">Heel</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Attributes</label>
            <div class="row">
              <div class="col-md-4 mb-2">
                <label class="form-label">Strength</label>
                <input type="range" class="form-range" id="attr-strength" min="30" max="100" value="50">
                <div class="text-center"><span id="strength-value">50</span></div>
              </div>
              <div class="col-md-4 mb-2">
                <label class="form-label">Speed</label>
                <input type="range" class="form-range" id="attr-speed" min="30" max="100" value="50">
                <div class="text-center"><span id="speed-value">50</span></div>
              </div>
              <div class="col-md-4 mb-2">
                <label class="form-label">Technique</label>
                <input type="range" class="form-range" id="attr-technique" min="30" max="100" value="50">
                <div class="text-center"><span id="technique-value">50</span></div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-2">
                <label class="form-label">Charisma</label>
                <input type="range" class="form-range" id="attr-charisma" min="30" max="100" value="50">
                <div class="text-center"><span id="charisma-value">50</span></div>
              </div>
              <div class="col-md-4 mb-2">
                <label class="form-label">Microphone</label>
                <input type="range" class="form-range" id="attr-microphone" min="30" max="100" value="50">
                <div class="text-center"><span id="microphone-value">50</span></div>
              </div>
              <div class="col-md-4 mb-2">
                <label class="form-label">Stamina</label>
                <input type="range" class="form-range" id="attr-stamina" min="30" max="100" value="50">
                <div class="text-center"><span id="stamina-value">50</span></div>
              </div>
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
              <label class="form-label">Popularity</label>
              <input type="range" class="form-range" id="attr-popularity" min="30" max="100" value="50">
              <div class="text-center"><span id="popularity-value">50</span></div>
            </div>
          </div>
          
          <div class="text-end">
            <button type="button" class="btn btn-secondary" id="cancel-add">Cancel</button>
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
    slider.addEventListener('input', () => {
      display.textContent = slider.value;
    });
  });
  
  // Add form submission handler
  document.getElementById('add-wrestler-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const wrestlerData = {
      name: document.getElementById('wrestler-name').value,
      nickname: document.getElementById('wrestler-nickname').value,
      age: parseInt(document.getElementById('wrestler-age').value),
      attributes: {
        strength: parseInt(document.getElementById('attr-strength').value),
        speed: parseInt(document.getElementById('attr-speed').value),
        technique: parseInt(document.getElementById('attr-technique').value),
        charisma: parseInt(document.getElementById('attr-charisma').value),
        microphone: parseInt(document.getElementById('attr-microphone').value),
        stamina: parseInt(document.getElementById('attr-stamina').value),
        popularity: parseInt(document.getElementById('attr-popularity').value),
        morale: 80,
        health: 100
      },
      style: {
        primary: document.getElementById('wrestler-style').value,
        signature: document.getElementById('signature-move').value,
        finisher: document.getElementById('finisher-move').value,
        preferredRole: document.getElementById('wrestler-role').value,
        currentRole: document.getElementById('wrestler-role').value
      },
      contract: {
        salary: parseInt(document.getElementById('wrestler-salary').value)
      }
    };
    
    try {
      await window.gameAPI.addWrestler(wrestlerData);
      document.getElementById('nav-roster').click();
    } catch (error) {
      console.error('Error adding wrestler:', error);
    }
  });
  
  document.getElementById('cancel-add').addEventListener('click', () => {
    document.getElementById('nav-roster').click();
  });
}

// Edit wrestler
async function editWrestler(id) {
  try {
    const wrestler = await window.gameAPI.getWrestler(id);
    if (!wrestler) return;
    
    // Similar to showAddWrestlerForm but populated with wrestler data
    // Implementation omitted for brevity - would follow similar pattern
    alert('Edit wrestler functionality would go here for: ' + wrestler.name);
    
  } catch (error) {
    console.error('Error editing wrestler:', error);
  }
}

// Load championships
async function loadChampionships() {
  try {
    const championships = await window.gameAPI.getAllChampionships();
    const contentArea = document.getElementById('content-area');
    
    // Build championship UI (simplified version)
    let championshipsHTML = `
      <h2>Championships</h2>
      <div class="row">
    `;
    
    championships.forEach(championship => {
      championshipsHTML += `
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h4>${championship.name}</h4>
            </div>
            <div class="card-body">
              <p><strong>Current Champion:</strong> ${championship.currentChampion.name}</p>
              <p><strong>Prestige:</strong> ${championship.prestige}%</p>
              <p><strong>Type:</strong> ${championship.type.level} ${championship.type.weight}</p>
              <button class="btn btn-primary view-championship" data-id="${championship.id}">View Details</button>
            </div>
          </div>
        </div>
      `;
    });
    
    championshipsHTML += `
      </div>
      <div class="mt-3">
        <button class="btn btn-success" id="add-championship">Create New Championship</button>
      </div>
    `;
    
    contentArea.innerHTML = championshipsHTML;
    
    // Add event listeners
    document.querySelectorAll('.view-championship').forEach(button => {
      button.addEventListener('click', function() {
        alert('View championship details for: ' + this.getAttribute('data-id'));
      });
    });
    
    document.getElementById('add-championship')?.addEventListener('click', () => {
      alert('Add championship functionality would go here');
    });
    
  } catch (error) {
    console.error('Error loading championships:', error);
  }
}

// Load events
async function loadEvents() {
  try {
    const events = await window.gameAPI.getAllEvents();
    const contentArea = document.getElementById('content-area');
    
    // Build events UI (simplified)
    let eventsHTML = `
      <h2>Event Booking</h2>
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4>Upcoming Events</h4>
          <button class="btn btn-success" id="create-event">Create New Event</button>
        </div>
        <div class="card-body">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    events.forEach(event => {
      const eventDate = new Date(event.date);
      eventsHTML += `
        <tr>
          <td>${event.name}</td>
          <td>${eventDate.toLocaleDateString()}</td>
          <td>${event.venue.name}</td>
          <td>${event.status}</td>
          <td>
            <button class="btn btn-sm btn-primary view-event" data-id="${event.id}">View</button>
            <button class="btn btn-sm btn-warning edit-event" data-id="${event.id}">Edit</button>
          </td>
        </tr>
      `;
    });
    
    eventsHTML += `
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    contentArea.innerHTML = eventsHTML;
    
    // Add event listeners
    document.querySelectorAll('.view-event').forEach(button => {
      button.addEventListener('click', function() {
        alert('View event: ' + this.getAttribute('data-id'));
      });
    });
    
    document.querySelectorAll('.edit-event').forEach(button => {
      button.addEventListener('click', function() {
        alert('Edit event: ' + this.getAttribute('data-id'));
      });
    });
    
    document.getElementById('create-event')?.addEventListener('click', () => {
      alert('Create event functionality would go here');
    });
    
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

// Load finances
async function loadFinances() {
  try {
    const promotion = await window.gameAPI.getPlayerPromotion();
    if (!promotion) return;
    
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
      <h2>Finances</h2>
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4>Financial Overview</h4>
            </div>
            <div class="card-body">
              <p><strong>Current Balance:</strong> $${promotion.finances.balance.toLocaleString()}</p>
              <p><strong>Weekly Revenue:</strong> $${promotion.finances.weeklyRevenue.toLocaleString()}</p>
              <p><strong>Weekly Expenses:</strong> $${promotion.finances.weeklyExpenses.toLocaleString()}</p>
              <p><strong>Profit Margin:</strong> ${promotion.finances.profitMargin.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h4>Actions</h4>
            </div>
            <div class="card-body">
              <button class="btn btn-primary mb-2">View Revenue Breakdown</button>
              <button class="btn btn-primary mb-2">View Expense Breakdown</button>
              <button class="btn btn-success" id="advance-week">Advance to Next Week</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('advance-week')?.addEventListener('click', async () => {
      try {
        const result = await window.gameAPI.advanceWeek();
        alert(`Advanced to Week ${result.currentDate}\nBalance: $${promotion.finances.balance.toLocaleString()}`);
        loadFinances(); // Refresh the view
      } catch (error) {
        console.error('Error advancing week:', error);
      }
    });
    
  } catch (error) {
    console.error('Error loading finances:', error);
  }
}