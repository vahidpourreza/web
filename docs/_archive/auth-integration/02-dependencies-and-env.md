# Step 02: Install Dependencies & Environment Configuration

## Install

```bash
pnpm add next-auth@beta axios
```

## Create file: `.env.local`

```env
# Auth - Duende Identity Server
AUTH_DUENDE_IDS_ISSUER=https://localhost:5001
AUTH_DUENDE_IDS_CLIENT_ID=web
AUTH_DUENDE_IDS_CLIENT_SECRET=YOUR_SECRET_HERE

# Auth.js
AUTH_SECRET=generate_with_command_below
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Gateway
NEXT_PUBLIC_GATEWAY_URL=https://localhost:7288

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Dev only - accept self-signed certs
NODE_TLS_REJECT_UNAUTHORIZED=0
```

Generate AUTH_SECRET:

```bash
pnpm dlx auth secret
```

## Create file: `.env.example`

```env
# Auth - Duende Identity Server
AUTH_DUENDE_IDS_ISSUER=https://localhost:5001
AUTH_DUENDE_IDS_CLIENT_ID=web
AUTH_DUENDE_IDS_CLIENT_SECRET=

# Auth.js
AUTH_SECRET=
AUTH_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Gateway
NEXT_PUBLIC_GATEWAY_URL=https://localhost:7288

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Create file: `config/env.ts`

```ts
const env = {
  auth: {
    issuer: process.env.AUTH_DUENDE_IDS_ISSUER!,
    clientId: process.env.AUTH_DUENDE_IDS_CLIENT_ID!,
    clientSecret: process.env.AUTH_DUENDE_IDS_CLIENT_SECRET!,
    secret: process.env.AUTH_SECRET!,
  },
  gateway: {
    url: process.env.NEXT_PUBLIC_GATEWAY_URL!,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
} as const;

export default env;
```

## Add to `.gitignore` (if not already there)

```
.env.local
```
