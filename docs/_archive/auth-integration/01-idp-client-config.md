# Step 01: IDP Client Configuration

Add this client via your Identity Server Admin UI.

## Client Settings

| Field | Value |
| --- | --- |
| ClientId | `web` |
| ClientName | `اپلیکیشن وب` |
| Client Secret | Generate a strong secret, save it for `.env.local` |
| Allowed Grant Types | Authorization Code |
| Require PKCE | true |
| Require Client Secret | true |

## URIs

| Field | Value |
| --- | --- |
| Redirect URIs | `http://localhost:3000/api/auth/callback/duende-ids` |
| Post Logout Redirect URIs | `http://localhost:3000` |
| Front Channel Logout URI | `http://localhost:3000/api/auth/frontchannel-logout` |
| Back Channel Logout URI | `http://localhost:3000/api/auth/backchannel-logout` |
| Back Channel Logout Session Required | true |
| Allowed CORS Origins | `http://localhost:3000` |

## Scopes

`openid`, `profile`, `email`, `MahtaUserInfo`, `offline_access`

## Token Settings

| Field | Value |
| --- | --- |
| Allow Offline Access | true |
| Access Token Lifetime | 3600 |
| Sliding Refresh Token Lifetime | 1296000 (15 days) |
| Absolute Refresh Token Lifetime | 2592000 (30 days) |
| Refresh Token Usage | ReUse |
| Refresh Token Expiration | Sliding |
| Always Include User Claims In Id Token | true |
| Update Access Token Claims On Refresh | true |
