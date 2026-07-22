'use client';

import { useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

type ConnectionState = 'online' | 'offline' | 'restored';

export default function ConnectionBanner() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('online');
  const wasOfflineRef = useRef(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
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

      wasOfflineRef.current = false;
      setConnectionState('restored');
      hideTimerRef.current = window.setTimeout(() => setConnectionState('online'), 2500);
    };

    if (!navigator.onLine) handleOffline();
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      clearHideTimer();
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (connectionState === 'online') return null;

  const restored = connectionState === 'restored';

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
      {restored ? 'Conexão restabelecida.' : 'Você está offline. Exibindo o conteúdo já carregado.'}
    </div>
  );
}
