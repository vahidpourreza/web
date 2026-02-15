import type { DefaultSession } from 'next-auth';

//todo fix the errors.

// Claims from MahtaUserInfo Scope
export interface MahtaUserCliams {
  user_id: string;
  name: string;
  family: string;
  mobile: string;
  email: string;
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
  interface User extends MahtaUserCliams {}
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
