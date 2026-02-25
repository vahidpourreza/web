import env from '@/config/env';

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
    const response = await fetch(`${env.auth.issuer}/connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: env.auth.clientId,
        client_secret: env.auth.clientSecret,
        refresh_token: refreshToken,
      }),
    });

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
