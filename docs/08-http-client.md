# Step 08: HTTP Client (Axios)

## Folder structure

```
api/
  client.ts              # Axios instance + helper functions
  index.ts               # Central barrel — single import point
  services/
    access/
      access-group.ts    # (create later, per feature)
      user.ts
    order/
      menu-item.ts
    ...
```

## Create file: `api/client.ts`

```ts
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";
import type { ApiResponse } from "@/types/api";

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
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Typed helper functions — all return ApiResponse<T>
export async function apiGet<T>(url: string, params?: Record<string, unknown>) {
  const response = await apiClient.get<ApiResponse<T>>(url, { params });
  return response.data;
}

export async function apiPost<T>(url: string, data?: unknown) {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data;
}

export async function apiPut<T>(url: string, data?: unknown) {
  const response = await apiClient.put<ApiResponse<T>>(url, data);
  return response.data;
}

export async function apiDelete<T>(url: string) {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data;
}

export default apiClient;
```

## Create file: `api/index.ts`

Start empty, add exports as you build each service:

```ts
// Add service exports here as you create them:
// export { accessGroupService } from "./services/access/access-group";
// export { userService } from "./services/access/user";
```

## Example service file (create later when building the page)

`api/services/access/access-group.ts`:

```ts
import { apiGet, apiPost, apiPut, apiDelete } from "@/api/client";

// --- Types ---
export interface CreateAccessGroupRequest {
  name: string;
  navigationIds: string[];
}

export interface AccessGroupSummary {
  id: string;
  name: string;
  isProtected: boolean;
}

// --- Service ---
const BASE = "/api/Access/v1/AccessGroup";

export const accessGroupService = {
  create: (data: CreateAccessGroupRequest) =>
    apiPost<string>(`${BASE}/Create`, data),

  getAllSummary: () =>
    apiGet<AccessGroupSummary[]>(`${BASE}/GetAllSummary`),

  update: (data: CreateAccessGroupRequest & { id: string }) =>
    apiPut<void>(`${BASE}/Update`, data),

  delete: (id: string) =>
    apiDelete<void>(`${BASE}/Delete/${id}`),
};
```

Then add to `api/index.ts`:
```ts
export { accessGroupService } from "./services/access/access-group";
```

Usage:
```ts
import { accessGroupService } from "@/api";

const result = await accessGroupService.create({ name: "ادمین", navigationIds: [] });
```
