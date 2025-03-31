// src/index.js - Main process file
console.log('Starting application...');

// Basic Electron setup
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Data model imports
const gameStore = require('./data/store');
const { generateSampleData } = require('./data/sample-data');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
// We'll handle Windows shortcuts setup later
// Removing electron-squirrel-startup dependency for now

const createWindow = () => {
  console.log('Creating browser window...');
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      // Add this to help with debugging
      devTools: true
    },
  });

  // Initialize game data store
  console.log('Initializing game store...');
  try {
    gameStore.init();
    console.log('Game store initialized successfully');
  } catch (error) {
    console.error('Error initializing game store:', error);
  }

  // Add sample data for development purposes
  if (process.env.NODE_ENV === 'development') {
    try {
      const sampleData = generateSampleData();
      console.log('Sample data generated for development');
    } catch (error) {
      console.error('Error generating sample data:', error);
    }
  }

  // Load the index.html of the app
  console.log('Loading HTML file...');
  mainWindow.loadFile(path.join(__dirname, 'index.html'))
    .then(() => {
      console.log('HTML file loaded successfully');
      // Open DevTools automatically (can remove in production)
      mainWindow.webContents.openDevTools();
    })
    .catch(err => {
      console.error('Error loading HTML file:', err);
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Set up IPC handlers for data access from renderer process

// Get all wrestlers
ipcMain.handle('get-wrestlers', () => {
  return gameStore.getAllWrestlers().map(w => w.toJSON());
});

// Get wrestler by ID
ipcMain.handle('get-wrestler', (event, id) => {
  const wrestler = gameStore.getWrestlerById(id);
  return wrestler ? wrestler.toJSON() : null;
});

// Add a new wrestler
ipcMain.handle('add-wrestler', (event, data) => {
  const wrestler = gameStore.addWrestler(data);
  gameStore.saveGame();
  return wrestler.toJSON();
});

// Update a wrestler
ipcMain.handle('update-wrestler', (event, id, data) => {
  const wrestler = gameStore.updateWrestler(id, data);
  if (wrestler) {
    gameStore.saveGame();
    return wrestler.toJSON();
  }
  return null;
});

// Delete a wrestler
ipcMain.handle('delete-wrestler', (event, id) => {
  const result = gameStore.deleteWrestler(id);
  if (result) {
    gameStore.saveGame();
  }
  return result;
});

// Similar handlers for championships
ipcMain.handle('get-championships', () => {
  return gameStore.getAllChampionships().map(c => c.toJSON());
});

ipcMain.handle('get-championship', (event, id) => {
  const championship = gameStore.getChampionshipById(id);
  return championship ? championship.toJSON() : null;
});

// Similar handlers for events
ipcMain.handle('get-events', () => {
  return gameStore.getAllEvents().map(e => e.toJSON());
});

ipcMain.handle('get-event', (event, id) => {
  const gameEvent = gameStore.getEventById(id);
  return gameEvent ? gameEvent.toJSON() : null;
});

// Get player promotion
ipcMain.handle('get-player-promotion', () => {
  const promotion = gameStore.getPlayerPromotion();
  return promotion ? promotion.toJSON() : null;
});

// Save game
ipcMain.handle('save-game', () => {
  return gameStore.saveGame();
});

// Load game
ipcMain.handle('load-game', () => {
  return gameStore.loadGame();
});

// Create new game
ipcMain.handle('new-game', () => {
  return gameStore.createNewGame();
});

// Advance game week
ipcMain.handle('advance-week', () => {
  const result = gameStore.advanceGameWeek();
  gameStore.saveGame();
  return result;
});

// Settings handlers
ipcMain.handle('get-settings', () => {
  return gameStore.getSettings().toJSON();
});

ipcMain.handle('update-settings', (event, newSettings) => {
  return gameStore.updateSettings(newSettings);
});

ipcMain.handle('reset-settings', () => {
  return gameStore.resetSettings();
});