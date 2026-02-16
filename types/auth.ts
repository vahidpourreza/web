import 'next-auth/jwt';
import type { DefaultSession } from 'next-auth';

// Claims from MahtaUserInfo Scope
export interface MahtaUserCliams {
  user_id: string;
  name: string;
  family: string;
  mobile: string;
  email: string;
  role: string;
  tenant_name: string;
  tenant_id: string;
  broker_name: string;
  broker_id: string;
}

// Extend Auth.js Types
declare module 'next-auth' {
  interface Session {
    accessToken: string;
    error?: 'RefreshTokenError';
    user: MahtaUserCliams & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    idToken: string;
    sid?: string;
    error?: 'RefreshTokenError';
    claims: MahtaUserCliams;
  }
}
