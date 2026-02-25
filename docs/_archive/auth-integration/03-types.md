# Step 03: TypeScript Types

## Create file: `types/auth.ts`

```ts
import type { DefaultSession } from "next-auth";

// Claims from MahtaUserInfo scope
export interface MahtaUserClaims {
  user_id: string;
  name: string;
  family: string;
  mobile: string;
  email: string;
  role: string;
  company_name: string;
  company_id: string;
  broker_name: string;
  broker_id: string;
}

// Extend Auth.js types
declare module "next-auth" {
  interface Session {
    accessToken: string;
    error?: "RefreshTokenError";
    user: MahtaUserClaims & DefaultSession["user"];
  }

  interface User extends MahtaUserClaims {}
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    idToken: string;
    sid?: string;
    error?: "RefreshTokenError";
    claims: MahtaUserClaims;
  }
}
```

## Create file: `types/api.ts`

```ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
```
