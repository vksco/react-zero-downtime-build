import { useContext } from 'react';
import { VersionContext } from './VersionContext';
import type { VersionContextState } from './types';

export function useVersion(): VersionContextState {
    const ctx = useContext(VersionContext);
    if (!ctx) throw new Error('useVersion must be used within VersionProvider');
    return ctx;
}