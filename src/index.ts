/**
 * React Zero Downtime Build - Main exports
 * 
 * This package helps eliminate chunk load errors and 404s during deployments
 * by detecting version changes and prompting users to refresh.
 */

// Context and Provider
export { VersionProvider, VersionContext, type VersionContextState } from './context';

// Hooks
export { useVersion } from './hooks';

// Components
export { UpdateBanner, UpdatePrompt } from './components';
export type { UpdateBannerProps, UpdatePromptProps } from './components';

// Types
export type { RzdConfig, AppVersion, BuildAdapter } from './types';

// Utilities (for advanced use cases)
export { fetchLatestVersion, isVersionDifferent, getCurrentVersion, storeCurrentVersion } from './utils/version-checker';
export { refresh, hardRefresh } from './utils/cache-buster';
