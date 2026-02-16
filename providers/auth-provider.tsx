'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    // refetchInterval={4 * 60} keeps the session fresh every 4 minutes (token is 1 hour,
    // so we refresh well before expiry).
    // refetchOnWindowFocus re-checks the session when the user returns to the tab.
    <SessionProvider refetchInterval={4 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}
