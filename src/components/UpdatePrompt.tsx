/**
 * Update prompt component - Modal-style popup for update notifications
 */

import { type FC } from 'react';

export interface UpdatePromptProps {
  show: boolean;
  onRefresh: () => void;
  onHardRefresh: () => void;
  onDismiss?: () => void;
  message?: string;
  commitMessage?: string | null;
  commitAuthor?: string | null;
  buildId?: string | null;
}

export const UpdatePrompt: FC<UpdatePromptProps> = ({
  show,
  onRefresh,
  onHardRefresh,
  onDismiss,
  message,
  commitMessage,
  commitAuthor,
  buildId,
}) => {
  if (!show) return null;

  const author = commitAuthor || 'Someone';
  const hash = buildId ? `#${buildId.substring(0, 7)}` : 'a new build';
  const msg = commitMessage ? `"${commitMessage}"` : 'something new';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)', // Slate-900 with alpha
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '440px',
          width: '90%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
          border: '1px solid rgba(226, 232, 240, 1)',
        }}
      >
        <div 
            style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#EFF6FF',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
            }}
        >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.59 17.38 15.03 16.38 16.12L17.8 17.54C19.18 16.11 20 14.16 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 10.41 6.62 8.97 7.62 7.88L6.2 6.46C4.82 7.89 4 9.84 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18Z" fill="#3B82F6"/>
            </svg>
        </div>

        <h2
          style={{
            margin: '0 0 12px 0',
            fontSize: '24px',
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.025em',
          }}
        >
          Update Required
        </h2>
        
        <p
          style={{
            margin: '0 0 28px 0',
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#475569',
          }}
        >
          {message || (
            <>
              <strong>{author}</strong> commit <strong>{hash}</strong> and <strong>{msg}</strong> is coming. 
              <br />
              Please refresh to continue.
            </>
          )}
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <button
            onClick={onRefresh}
            style={{
              padding: '14px 24px',
              backgroundColor: '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)',
            }}
          >
            Refresh Now
          </button>
          
          <button
            onClick={onHardRefresh}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#64748B',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
          >
            Clear Cache & Refresh
          </button>
        </div>
      </div>
    </div>
  );
};
