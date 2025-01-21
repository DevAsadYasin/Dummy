'use client'

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  return function(...args: any[]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export default function GoogleAuthCallback() {
  const router = useRouter();
  const { handleGoogleCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const isProcessing = useRef(false);

  const processCallback = useCallback(() => {
    const debouncedProcess = debounce(async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      try {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');

        if (!code) {
          console.error('Missing authorization code');
          setError('Invalid callback parameters');
          return;
        }

        await handleGoogleCallback(code);
        router.push('/');
      } catch (error) {
        console.error('Error handling Google callback:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during authentication';
        setError(errorMessage);
      } finally {
        isProcessing.current = false;
      }
    }, 300);

    debouncedProcess();
  }, [handleGoogleCallback, router]);

  useEffect(() => {
    processCallback();
  }, [processCallback]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-red-600">Authentication Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Processing...</h2>
        <p className="text-gray-600">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
}