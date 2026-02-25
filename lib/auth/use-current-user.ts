'use client';

import { useSession } from 'next-auth/react';
import type { MahtaUserCliams } from './types';

interface UseCurrentUserReturn {
  user: MahtaUserCliams | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  accessToken: string | null;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return {
      user: null,
      isLoading: true,
      isAuthenticated: false,
      accessToken: null,
    };
  }

  if (status === 'unauthenticated' || !session) {
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      accessToken: null,
    };
  }

  const claims: MahtaUserCliams = {
    user_id: session.user.user_id,
    name: session.user.name ?? '',
    family: session.user.family,
    mobile: session.user.mobile,
    role: session.user.role,
    tenant_name: session.user.tenant_name,
    tenant_id: session.user.tenant_id,
    center_name: session.user.center_name,
    center_id: session.user.center_id,
    broker_id: session.user.broker_id,
  };
  return {
    user: claims,
    isLoading: false,
    isAuthenticated: true,
    accessToken: session.accessToken,
  };
}
