import { createContext, useContext, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { CURRENT_AUTHOR, CURRENT_BUILD_ID, CURRENT_BUILD_TIME, CURRENT_COMMIT, CURRENT_VERSION, CURRENT_COMMIT_MESSAGE } from '../version';
import { UpdatePrompt } from '../components/UpdatePrompt';
import type { VersionInfo, VersionContextState, ProviderProps } from './types';

export type { VersionContextState };

const VersionContext = createContext<VersionContextState | undefined>(undefined);

export function useVersion(): VersionContextState {
    const context = useContext(VersionContext);
    if (!context) {
        throw new Error('useVersion must be used within a VersionProvider');
    }
    return context;
}

export { VersionContext };

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
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Current version info from props/constants
    const currentInfo: VersionInfo = useMemo(() => ({
        version: currentVersion,
        commit: currentCommit,
        commitAuthor: currentAuthor,
        commitMessage: currentCommitMessage,
        buildTime: currentBuildTime,
        buildId: currentBuildId,
    }), [currentVersion, currentCommit, currentAuthor, currentCommitMessage, currentBuildTime, currentBuildId]);

    // Fetch latest version from server
    const fetchLatest = async () => {
        try {
            const url = `/app-version.json?ts=${Date.now()}`;
            const res = await fetch(url, { cache: 'no-store' });

            if (!res.ok) {
                setLatest(undefined);
                setUpdateAvailable(false);
                return;
            }

            const data = await res.json();
            const normalized: VersionInfo = {
                version: String(data.version || ''),
                commit: data.commit || null,
                commitAuthor: data.commitAuthor || null,
                commitMessage: data.commitMessage || null,
                buildTime: String(data.buildTime || ''),
                buildId: String(data.buildId || ''),
            };

            setLatest(normalized);
            // THE KEY COMPARISON: Compare buildIds
            setUpdateAvailable(Boolean(normalized.buildId) && normalized.buildId !== currentBuildId);
        } catch {
            setLatest(undefined);
            setUpdateAvailable(false);
        }
    };

    // Setup periodic checking
    useEffect(() => {
        fetchLatest(); // Initial check
        timerRef.current = window.setInterval(fetchLatest, intervalMs);
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [intervalMs, currentBuildId]);

    // Context value
    const value: VersionContextState = useMemo(() => ({
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
    }), [currentInfo, latest, updateAvailable]);

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
