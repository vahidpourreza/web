'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

type BannerState = 'hidden' | 'offline' | 'reconnected' | 'fading';

export function OfflineBanner() {
  const [banner, setBanner] = useState<BannerState>('hidden');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleOnline = useCallback(() => {
    clearTimers();
    setBanner('reconnected');
    timerRef.current = setTimeout(() => {
      setBanner('fading');
      timerRef.current = setTimeout(() => setBanner('hidden'), 500);
    }, 2000);
  }, [clearTimers]);

  const handleOffline = useCallback(() => {
    clearTimers();
    setBanner('offline');
  }, [clearTimers]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimers();
    };
  }, [handleOnline, handleOffline, clearTimers]);

  if (banner === 'hidden') return null;

  return (
    <div className={`fixed top-4 left-4 z-[100] max-w-xs transition-opacity duration-500 ${banner === 'fading' ? 'opacity-0' : 'opacity-100'}`}>
      {banner === 'offline' ? (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10 backdrop-blur-sm shadow-lg">
          <WifiOff className="size-4" />
          <AlertTitle>آفلاین هستید</AlertTitle>
        </Alert>
      ) : (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 text-emerald-600 backdrop-blur-sm shadow-lg dark:text-emerald-400">
          <Wifi className="size-4" />
          <AlertTitle>آنلاین شدید</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
