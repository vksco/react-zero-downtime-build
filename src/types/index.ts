/**
 * Type definitions for React Zero Downtime Build
 */

export * from './config';

export interface VersionContextValue {
  currentVersion: string | null;
  latestVersion: string | null;
  isUpdateAvailable: boolean;
  checkForUpdates: () => Promise<void>;
  refresh: () => void;
  hardRefresh: () => void;
  isChecking: boolean;
  lastChecked: number | null;
}

export interface UpdatePromptProps {
  show: boolean;
  onRefresh: () => void;
  onHardRefresh: () => void;
  onDismiss?: () => void;
  message?: string;
}

export interface UpdateBannerProps {
  show: boolean;
  onRefresh: () => void;
  onHardRefresh: () => void;
  position?: 'top' | 'bottom';
  message?: string;
}
