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
}

export const UpdateBanner: FC<UpdateBannerProps> = ({
  show,
  onRefresh,
  onHardRefresh,
  position = 'top',
  message = 'A new version is available!',
}) => {
  if (!show) return null;

  const positionStyles = position === 'top'
    ? { top: 0 }
    : { bottom: 0 };

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        ...positionStyles,
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 9999,
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 500 }}>{message}</span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onRefresh}
          style={{
            padding: '6px 16px',
            backgroundColor: 'white',
            color: '#007bff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Refresh
        </button>
        <button
          onClick={onHardRefresh}
          style={{
            padding: '6px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid white',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Hard Refresh
        </button>
      </div>
    </div>
  );
};
