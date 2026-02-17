'use client';

import { useSession } from 'next-auth/react';
import type { MahtaUserCliams } from '@/types/auth';

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
    email: session.user.email ?? '',
    role: session.user.role,
    tenant_name: session.user.tenant_name,
    tenant_id: session.user.tenant_id,
    broker_name: session.user.broker_name,
    broker_id: session.user.broker_id,
  };
  return {
    user: claims,
    isLoading: false,
    isAuthenticated: true,
    accessToken: session.accessToken,
  };
}
