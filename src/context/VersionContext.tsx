import { createContext, useContext, useEffect, useMemo, useRef, useState, type FC, type ReactNode } from 'react';
import { CURRENT_AUTHOR, CURRENT_BUILD_ID, CURRENT_BUILD_TIME, CURRENT_COMMIT, CURRENT_VERSION, CURRENT_COMMIT_MESSAGE } from '../version';
import { UpdatePrompt } from '../components/UpdatePrompt';

type VersionInfo = {
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

// Helper to get global state if it exists
const getGlobalState = () => {
    if (typeof window !== 'undefined' && (window as any).__RZD_APP_VERSION__) {
        return (window as any).__RZD_APP_VERSION__;
    }
    return null;
};

const globalState = getGlobalState();

const defaultInfo: VersionInfo = {
    version: globalState?.version || CURRENT_VERSION,
    commit: globalState?.commit || CURRENT_COMMIT || null,
    commitAuthor: globalState?.commitAuthor || CURRENT_AUTHOR || null,
    commitMessage: globalState?.commitMessage || CURRENT_COMMIT_MESSAGE || null,
    buildTime: globalState?.timestamp || globalState?.buildTime || CURRENT_BUILD_TIME,
    buildId: globalState?.buildId || CURRENT_BUILD_ID,
};

const VersionContext = createContext<VersionContextState | undefined>(undefined);

type ProviderProps = {
    intervalMs?: number;
    children: ReactNode;
    currentBuildId?: string;
    currentVersion?: string;
    currentCommit?: string | null;
    currentAuthor?: string | null;
    currentCommitMessage?: string | null;
    currentBuildTime?: string;
    autoPrompt?: boolean;      // New: Automatically show the prompt
    promptMessage?: string;    // New: Custom message
    customPrompt?: FC<{        // New: Support for user-designed prompt
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

export const VersionProvider: FC<ProviderProps> = ({
    intervalMs = 60_000,
    children,
    currentBuildId = CURRENT_BUILD_ID,
    currentVersion = CURRENT_VERSION,
    currentCommit = CURRENT_COMMIT,
    currentAuthor = CURRENT_AUTHOR,
    currentCommitMessage = CURRENT_COMMIT_MESSAGE,
    currentBuildTime = CURRENT_BUILD_TIME,
    autoPrompt = true,
    promptMessage,
    customPrompt: CustomPrompt,
}) => {
    const [latest, setLatest] = useState<VersionInfo | undefined>(undefined);
    const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
    const [dismissed, setDismissed] = useState<boolean>(false);
    const timerRef = useRef<number | null>(null);

    const currentInfo: VersionInfo = useMemo(() => {
        const g = getGlobalState();
        return {
            version: currentVersion || g?.version || CURRENT_VERSION,
            commit: (currentCommit ?? g?.commit ?? CURRENT_COMMIT) || null,
            commitAuthor: (currentAuthor ?? g?.commitAuthor ?? CURRENT_AUTHOR) || null,
            commitMessage: (currentCommitMessage ?? g?.commitMessage) || null,
            buildTime: currentBuildTime || g?.timestamp || g?.buildTime || CURRENT_BUILD_TIME,
            buildId: currentBuildId || g?.buildId || CURRENT_BUILD_ID,
        };
    }, [currentVersion, currentCommit, currentAuthor, currentCommitMessage, currentBuildTime, currentBuildId]);

    const fetchLatest = async () => {
        try {
            const url = `/app-version.json?ts=${Date.now()}`;
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) {
                // Explicitly reset state on fetch failure
                setLatest(undefined);
                setUpdateAvailable(false);
                return;
            }
            const data = (await res.json()) as Partial<VersionInfo>;
            const normalized: VersionInfo = {
                version: String(data.version || ''),
                commit: (data.commit as string | undefined) ?? null,
                commitAuthor: (data.commitAuthor as string | undefined) ?? null,
                commitMessage: (data.commitMessage as string | undefined) ?? null,
                buildTime: String(data.buildTime || ''),
                buildId: String(data.buildId || ''),
            };
            setLatest(normalized);
            setUpdateAvailable(Boolean(normalized.buildId) && normalized.buildId !== currentBuildId);
        } catch (_) {
            // Explicitly reset state on network errors
            setLatest(undefined);
            setUpdateAvailable(false);
        }
    };

    useEffect(() => {
        // initial check soon after mount
        fetchLatest();
        // periodic checks
        timerRef.current = window.setInterval(fetchLatest, intervalMs);
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intervalMs, currentBuildId]);

    const value: VersionContextState = useMemo(
        () => ({
            current: currentInfo,
            latest,
            updateAvailable,
            checkNow: fetchLatest,
            reload: () => window.location.reload(),
            hardReload: () => {
                if ('caches' in window) {
                    caches.keys().then(names => names.forEach(name => caches.delete(name)));
                }
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
            },
        }),
        [currentInfo, latest, updateAvailable]
    );

    const showUI = autoPrompt && updateAvailable && !dismissed;

    return (
        <VersionContext.Provider value={value}>
            {children}
            {showUI && (
                CustomPrompt ? (
                    <CustomPrompt 
                        show={true}
                        onRefresh={value.reload}
                        onHardRefresh={value.hardReload}
                        onDismiss={() => setDismissed(true)}
                        message={promptMessage}
                        commitMessage={latest?.commitMessage}
                        commitAuthor={latest?.commitAuthor}
                        buildId={latest?.buildId}
                    />
                ) : (
                    <UpdatePrompt 
                        show={true} 
                        onRefresh={value.reload} 
                        onHardRefresh={value.hardReload} 
                        onDismiss={() => setDismissed(true)}
                        message={promptMessage}
                        commitMessage={latest?.commitMessage}
                        commitAuthor={latest?.commitAuthor}
                        buildId={latest?.buildId}
                    />
                )
            )}
        </VersionContext.Provider>
    );
};

export function useVersion(): VersionContextState {
    const ctx = useContext(VersionContext);
    if (!ctx) throw new Error('useVersion must be used within VersionProvider');
    return ctx;
}

export default VersionContext;
