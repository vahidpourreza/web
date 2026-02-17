import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import type { ApiResponse } from '@/types/api';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
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
  (error) => Promise.reject(error),
);

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Typed helper functions - all return ApiResponse<T>
export async function apiGet<T>(url: string, params?: object) {
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

export async function apiDelete<T>(url: string, data?: unknown) {
  const response = await apiClient.delete<ApiResponse<T>>(url, { data });
  return response.data;
}

export default apiClient;
