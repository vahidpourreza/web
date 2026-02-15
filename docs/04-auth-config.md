# Step 04: Auth.js Configuration

## Create file: `lib/auth/token.ts`

```ts
import env from "@/config/env";

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id_token: string;
  token_type: string;
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  idToken: string;
} | null> {
  try {
    const response = await fetch(
      `${env.auth.issuer}/connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: env.auth.clientId,
          client_secret: env.auth.clientSecret,
          refresh_token: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      return null;
    }

    const data: TokenResponse = await response.json();

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
      idToken: data.id_token,
    };
  } catch {
    return null;
  }
}
```

## Create file: `lib/auth/logout-store.ts`

```ts
// In-memory store of revoked session IDs (sid claim).
// For production, replace with Redis or a database table.

const revokedSessions = new Set<string>();

export function revokeSession(sid: string): void {
  revokedSessions.add(sid);
}

export function isSessionRevoked(sid: string): boolean {
  return revokedSessions.has(sid);
}
```

## Create file: `lib/auth/auth.ts`

```ts
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import type { MahtaUserClaims } from "@/types/auth";
import { refreshAccessToken } from "@/lib/auth/token";
import env from "@/config/env";

const config: NextAuthConfig = {
  providers: [
    {
      id: "duende-ids",
      name: "Duende IdentityServer",
      type: "oidc",
      issuer: env.auth.issuer,
      clientId: env.auth.clientId,
      clientSecret: env.auth.clientSecret,
      authorization: {
        params: {
          scope: "openid profile email MahtaUserInfo offline_access",
          response_type: "code",
        },
      },
      checks: ["pkce", "state"],
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    },
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      // First login - store tokens and claims
      if (account && profile) {
        const claims: MahtaUserClaims = {
          user_id: (profile.user_id as string) ?? "",
          name: (profile.name as string) ?? "",
          family: (profile.family as string) ?? "",
          mobile: (profile.mobile as string) ?? "",
          email: (profile.email as string) ?? "",
          role: (profile.role as string) ?? "",
          company_name: (profile.company_name as string) ?? "",
          company_id: (profile.company_id as string) ?? "",
          broker_name: (profile.broker_name as string) ?? "",
          broker_id: (profile.broker_id as string) ?? "",
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
        return { ...token, error: "RefreshTokenError" as const };
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

  events: {
    async signOut(message) {
      // "token" exists when using JWT strategy
      if ("token" in message && message.token?.idToken) {
        // Redirect to IDP end-session endpoint is handled client-side
        // This event is for server-side cleanup if needed
      }
    },
  },
};

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(config);
```

## Note on self-signed certificates

If your IDP uses a self-signed certificate (localhost dev), the `NODE_TLS_REJECT_UNAUTHORIZED=0` in `.env.local` handles this. Remove it in production.
