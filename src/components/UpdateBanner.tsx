/**
 * Update banner component - Banner-style notification for updates
 */

import { type FC } from 'react';

export interface UpdateBannerProps {
  show: boolean;
  onRefresh: () => void;
  onHardRefresh: () => void;
  position?: 'top' | 'bottom';
  message?: string;
  commitMessage?: string | null;
  commitAuthor?: string | null;
  buildId?: string | null;
}

export const UpdateBanner: FC<UpdateBannerProps> = ({
  show,
  onRefresh,
  onHardRefresh,
  position = 'top',
  message,
  commitMessage,
  commitAuthor,
  buildId,
}) => {
  if (!show) return null;

  const positionStyles = position === 'top'
    ? { top: 0, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }
    : { bottom: 0, borderTop: '1px solid rgba(255, 255, 255, 0.1)' };

  const author = commitAuthor || 'Someone';
  const hash = buildId ? `#${buildId.substring(0, 7)}` : 'a new build';
  const msg = commitMessage ? `"${commitMessage}"` : 'something new';

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        ...positionStyles,
        backgroundColor: '#0F172A', // Slate-900
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        zIndex: 9999,
        flexWrap: 'wrap',
        gap: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          backgroundColor: '#3B82F6', 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%',
          boxShadow: '0 0 10px #3B82F6'
        }} />
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#F1F5F9' }}>
          {message || (
            <>
              Update available: <strong>{author}</strong> ({hash}) - <em>{msg}</em>
            </>
          )}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onRefresh}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
        >
          Refresh
        </button>
        <button
          onClick={onHardRefresh}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: '#94A3B8',
            border: '1px solid #334155',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
        >
          Clear Cache
        </button>
      </div>
    </div>
  );
};
