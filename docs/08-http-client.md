# Step 08: HTTP Client (Axios)

## Create file: `lib/api/endpoints.ts`

```ts
export const API = {
  access: {
    users: "/api/Access/users",
    centers: "/api/Access/centers",
    accessGroups: "/api/Access/access-groups",
    invitations: "/api/Access/invitations",
  },
  order: {
    menuItems: "/api/Order/menu-items",
    groups: "/api/Order/groups",
    categories: "/api/Order/categories",
    pos: "/api/Order/pos",
    orders: "/api/Order/orders",
    cashManagement: "/api/Order/cash-management",
  },
  payment: {
    base: "/api/payment",
  },
  messaging: {
    events: "/api/Messaging/events",
  },
  file: {
    upload: "/api/file/upload",
    base: "/api/file",
  },
  cdn: {
    base: "/cdn",
  },
  accounting: {
    base: "/accounting",
  },
} as const;
```

## Create file: `lib/api/client.ts`

```ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import type { ApiError } from "@/types/api";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token to every request
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expired and refresh failed - redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Typed helper functions
export async function apiGet<T>(url: string, params?: Record<string, unknown>) {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
}

export async function apiPost<T>(url: string, data?: unknown) {
  const response = await apiClient.post<T>(url, data);
  return response.data;
}

export async function apiPut<T>(url: string, data?: unknown) {
  const response = await apiClient.put<T>(url, data);
  return response.data;
}

export async function apiDelete<T>(url: string) {
  const response = await apiClient.delete<T>(url);
  return response.data;
}

export default apiClient;
```

## Usage example

```ts
import { apiGet, apiPost } from "@/lib/api/client";
import { API } from "@/lib/api/endpoints";
import type { PaginatedResponse } from "@/types/api";

// GET list of users
interface User {
  id: string;
  name: string;
}
const users = await apiGet<PaginatedResponse<User>>(API.access.users, {
  pageNumber: 1,
  pageSize: 10,
});

// POST create a user
const newUser = await apiPost(API.access.users, {
  name: "وحید",
  mobile: "09112223344",
});
```
