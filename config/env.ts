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
    url: process.env.NEXT_PUBLIC_APP_URL!,
  },
} as const;

export default env;
