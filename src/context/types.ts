import type { FC, ReactNode } from 'react';

export type VersionInfo = {
    version: string;
    commit?: string | null;
    commitAuthor?: string | null;
    commitMessage?: string | null;
    buildTime: string;
    buildId: string;
};

export type VersionContextState = {
    current: VersionInfo;
    latest?: VersionInfo;
    updateAvailable: boolean;
    checkNow: () => Promise<void>;
    reload: () => void;
    hardReload: () => void;
};

export type ProviderProps = {
    intervalMs?: number;
    children: ReactNode;
    currentBuildId?: string;
    currentVersion?: string;
    currentCommit?: string | null;
    currentAuthor?: string | null;
    currentCommitMessage?: string | null;
    currentBuildTime?: string;
    autoPrompt?: boolean;
    promptMessage?: string;
    customPrompt?: FC<{
        show: boolean;
        onRefresh: () => void;
        onHardRefresh: () => void;
        onDismiss: () => void;
        message?: string;
        commitMessage?: string | null;
        commitAuthor?: string | null;
        buildId?: string | null;
    }>;
};