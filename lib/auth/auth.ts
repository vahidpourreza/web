import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import type { MahtaUserCliams } from '@/types/auth';
import { refreshAccessToken } from '@/lib/auth/token';
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
          user_id: (profile.user_id as string) ?? '',
          name: (profile.name as string) ?? '',
          family: (profile.family as string) ?? '',
          mobile: (profile.mobile as string) ?? '',
          email: (profile.email as string) ?? '',
          role: (profile.role as string) ?? '',
          tenant_name: (profile.tenant_name as string) ?? '',
          tenant_id: (profile.tenant_id as string) ?? '',
          broker_name: (profile.broker_name as string) ?? '',
          broker_id: (profile.broker_id as string) ?? '',
        };
        return {
          ...token,
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
          expiresAt: account.expires_at!,
          idToken: account.id_token!,
          sid: (profile.sid as string) ?? undefined,
          claims,
        };
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
