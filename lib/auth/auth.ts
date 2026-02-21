import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { MahtaUserCliams } from './types';
import { refreshAccessToken } from '@/lib/auth/token';
import { isSessionRevoked } from '@/lib/auth/logout-store';
import env from '@/config/env';

const config: NextAuthConfig = {
  providers: [
    {
      id: 'duende-ids',
      name: 'Duende IdentityServer',
      type: 'oidc',
      issuer: env.auth.issuer,
      clientId: env.auth.clientId,
      clientSecret: env.auth.clientSecret,
      authorization: {
        params: {
          scope: 'openid profile email MahtaUserInfo offline_access',
          response_type: 'code',
        },
      },
      checks: ['pkce', 'state'],
      client: {
        token_endpoint_auth_method: 'client_secret_post',
      },
    },
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      // First login - store tokens and claims
      if (account && profile) {
        const claims: MahtaUserCliams = {
          user_id: (profile.userid as string) ?? '',
          name: (profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] as string) ?? '',
          family: (profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] as string) ?? '',
          mobile: (profile.mobile as string) ?? '',
          role: (profile.role as string) ?? '',
          tenant_name: (profile.tenantname as string) ?? '',
          tenant_id: (profile.tenantid as string) ?? '',
          center_name: (profile.centername as string) ?? '',
          center_id: (profile.centerid as string) ?? '',
          broker_id: (profile.brokerid as string) ?? '',
        };
        return {
          ...token,
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
          expiresAt: account.expires_at!,
          idToken: account.id_token!,
          sid: (profile.sid as string) ?? undefined,
          error: undefined,
          claims,
        };
      }

      // Check if session was revoked (federated logout from another app)
      if (token.sid && isSessionRevoked(token.sid)) {
        return { ...token, error: 'RefreshTokenError' as const };
      }

      // Token not expired yet
      if (Date.now() < token.expiresAt * 1000) {
        return token;
      }

      // Token expired - refresh it
      const refreshed = await refreshAccessToken(token.refreshToken);
      if (!refreshed) {
        return { ...token, error: 'RefreshTokenError' as const };
      }

      return {
        ...token,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        expiresAt: refreshed.expiresAt,
        idToken: refreshed.idToken,
      };
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.error = token.error;
      session.user = {
        ...session.user,
        ...token.claims,
      };
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
