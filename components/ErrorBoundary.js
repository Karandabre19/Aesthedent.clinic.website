'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ children, fallback }) {
  useEffect(() => {
    const errorHandler = (event) => {
      console.error('[v0] Caught error:', event.error);
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', (event) => {
      console.error('[v0] Unhandled promise rejection:', event.reason);
    });

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  return (
    <>
      {children}
      {fallback && (
        <div id="error-fallback" style={{ display: 'none' }}>
          {fallback}
        </div>
      )}
    </>
  );
}
