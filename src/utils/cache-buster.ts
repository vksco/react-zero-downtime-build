/**
 * Cache buster utility - Handle page refresh and cache clearing
 */

/**
 * Perform a standard page refresh
 */
export function refresh(): void {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

/**
 * Perform a hard refresh (clear cache and reload)
 */
export function hardRefresh(): void {
  if (typeof window !== 'undefined') {
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    
    // Clear localStorage
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('[RZD] Error clearing localStorage:', error);
    }
    
    // Clear sessionStorage
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('[RZD] Error clearing sessionStorage:', error);
    }
    
    // Perform hard reload
    window.location.reload();
  }
}
