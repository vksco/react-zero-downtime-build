/**
 * Version checker utility - Check for version updates
 */

import { AppVersion } from '../types/config';

/**
 * Fetch the latest version from the server
 */
export async function fetchLatestVersion(endpoint: string): Promise<AppVersion | null> {
  try {
    // Add cache-busting query parameter
    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(`${endpoint}${cacheBuster}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

    if (!response.ok) {
      console.warn(`[RZD] Failed to fetch version: ${response.status}`);
      return null;
    }

    const data: AppVersion = await response.json();
    return data;
  } catch (error) {
    console.warn('[RZD] Error fetching version:', error);
    return null;
  }
}

/**
 * Compare two versions
 */
export function isVersionDifferent(
  currentVersion: string | null,
  latestVersion: string | null
): boolean {
  if (!currentVersion || !latestVersion) {
    return false;
  }
  
  return currentVersion !== latestVersion;
}

/**
 * Get current version from localStorage or initial load
 */
export function getCurrentVersion(): string | null {
  try {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const stored = localStorage.getItem('rzd_app_version');
    return stored;
  } catch (error) {
    console.warn('[RZD] Error reading version from localStorage:', error);
    return null;
  }
}

/**
 * Store current version in localStorage
 */
export function storeCurrentVersion(version: string): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }
    
    localStorage.setItem('rzd_app_version', version);
  } catch (error) {
    console.warn('[RZD] Error storing version in localStorage:', error);
  }
}
