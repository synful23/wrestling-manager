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