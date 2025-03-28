// src/ui/index.js
// Entry point for the UI

(function() {
    console.log('Initializing UI...');
  
    try {
      // Create instance from global class when DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing navigation...');
        
        // Create navigation manager from window object
        const navigationManager = new window.NavigationManager();
        
        // Initialize navigation
        navigationManager.init();
        
        // Expose to window for debugging
        window.navigationManager = navigationManager;
      });
    } catch (error) {
      console.error('Error initializing UI:', error);
    }
  })();

// Initialize UI
initializeUI();