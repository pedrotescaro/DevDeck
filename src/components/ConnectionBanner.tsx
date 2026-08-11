'use client';

import { useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

type ConnectionState = 'online' | 'offline' | 'degraded' | 'restored';

export default function ConnectionBanner() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('online');
  const wasOfflineRef = useRef(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    };

    const showRestored = () => {
      clearHideTimer();
      wasOfflineRef.current = false;
      setConnectionState('restored');
      hideTimerRef.current = window.setTimeout(() => setConnectionState('online'), 2500);
    };

    const handleOffline = () => {
      clearHideTimer();
      wasOfflineRef.current = true;
      setConnectionState('offline');
    };

    const handleOnline = () => {
      clearHideTimer();
      if (!wasOfflineRef.current) {
        setConnectionState('online');
        return;
      }
      showRestored();
    };

    const handleAppConnectionState = (event: Event) => {
      const state = (event as CustomEvent<{ state?: 'degraded' | 'restored' }>).detail?.state;
      if (!state) return;

      if (state === 'restored') {
        showRestored();
        return;
      }

      clearHideTimer();
      wasOfflineRef.current = true;
      setConnectionState('degraded');
    };

    if (!navigator.onLine) handleOffline();
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    window.addEventListener('devdeck:connection-state', handleAppConnectionState);

    return () => {
      clearHideTimer();
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('devdeck:connection-state', handleAppConnectionState);
    };
  }, []);

  if (connectionState === 'online') return null;

  const restored = connectionState === 'restored';
  const degraded = connectionState === 'degraded';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-20 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold shadow-xl backdrop-blur-xl md:bottom-5 ${
        restored
          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
          : 'border-dd-border bg-dd-surface/95 text-dd-text'
      }`}
    >
      {restored ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
      {restored
        ? 'Connection restored.'
        : degraded
          ? 'Unstable connection. Trying to reconnect…'
          : 'You’re offline. Showing previously loaded content.'}
    </div>
  );
}
