import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CURRENT_BUILD_ID, CURRENT_BUILD_TIME, CURRENT_COMMIT, CURRENT_VERSION } from '../version';

type VersionInfo = {
    version: string;
    commit?: string | null;
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

const defaultInfo: VersionInfo = {
    version: CURRENT_VERSION,
    commit: CURRENT_COMMIT ?? null,
    buildTime: CURRENT_BUILD_TIME,
    buildId: CURRENT_BUILD_ID,
};

const VersionContext = createContext<VersionContextState | undefined>(undefined);

type ProviderProps = {
    intervalMs?: number;
    children: React.ReactNode;
};

export const VersionProvider: React.FC<ProviderProps> = ({ intervalMs = 60_000, children }) => {
    const [latest, setLatest] = useState<VersionInfo | undefined>(undefined);
    const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
    const timerRef = useRef<number | null>(null);

    const fetchLatest = async () => {
        try {
            const url = `/app-version.json?ts=${Date.now()}`;
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) return;
            const data = (await res.json()) as Partial<VersionInfo>;
            const normalized: VersionInfo = {
                version: String(data.version || ''),
                commit: (data.commit as string | undefined) ?? null,
                buildTime: String(data.buildTime || ''),
                buildId: String(data.buildId || ''),
            };
            setLatest(normalized);
            setUpdateAvailable(Boolean(normalized.buildId) && normalized.buildId !== defaultInfo.buildId);
        } catch (_) {
            // ignore network errors; will retry on next interval
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
    }, [intervalMs]);

    const value: VersionContextState = useMemo(
        () => ({
            current: defaultInfo,
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
        [latest, updateAvailable]
    );

    return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>;
};

export function useVersion(): VersionContextState {
    const ctx = useContext(VersionContext);
    if (!ctx) throw new Error('useVersion must be used within VersionProvider');
    return ctx;
}

export default VersionContext;
