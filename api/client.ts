import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import type { ApiResponse } from '@/api/types';

// --- Client ---

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
  (response) => {
    //  console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status, response.data , response);
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// --- Extract error messages ---

function extractMessages(err: unknown): string[] {
  const axiosErr = err as AxiosError;
  const data = axiosErr.response?.data;

  if (Array.isArray(data) && data.length) {
    return data;
  }

  const messages = (data as { messages?: string[] })?.messages;
  if (messages?.length) {
    return messages;
  }

  const status = axiosErr.response?.status;
  if (status === 403) return ['شما دسترسی لازم برای انجام این عملیات را ندارید'];
  if (status === 404) return ['مورد درخواستی یافت نشد'];
  if (status === 500) return ['خطای سرور - لطفاً دوباره تلاش کنید'];

  return ['خطای ناشناخته'];
}

// --- Typed helper functions ---

export async function apiGet<T>(url: string, params?: object): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.get<T>(url, { params });
    return { ok: true, data: response.data, status: response.status, allMessages: [], messages: '' };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const allMessages = extractMessages(err);
    return {
      ok: false,
      data: null,
      status: axiosErr.response?.status ?? 0,
      allMessages,
      messages: allMessages.join(' '),
    };
  }
}

export async function apiPost<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.post<T>(url, data);
    return { ok: true, data: response.data, status: response.status, allMessages: [], messages: '' };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const allMessages = extractMessages(err);
    return {
      ok: false,
      data: null,
      status: axiosErr.response?.status ?? 0,
      allMessages,
      messages: allMessages.join(' '),
    };
  }
}

export async function apiPut<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.put<T>(url, data);
    return { ok: true, data: response.data, status: response.status, allMessages: [], messages: '' };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const allMessages = extractMessages(err);
    return {
      ok: false,
      data: null,
      status: axiosErr.response?.status ?? 0,
      allMessages,
      messages: allMessages.join(' '),
    };
  }
}

export async function apiDelete<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.delete<T>(url, { data });
    return { ok: true, data: response.data, status: response.status, allMessages: [], messages: '' };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const allMessages = extractMessages(err);
    return {
      ok: false,
      data: null,
      status: axiosErr.response?.status ?? 0,
      allMessages,
      messages: allMessages.join(' '),
    };
  }
}

export async function apiPostFormData<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { ok: true, data: response.data, status: response.status, allMessages: [], messages: '' };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const allMessages = extractMessages(err);
    return {
      ok: false,
      data: null,
      status: axiosErr.response?.status ?? 0,
      allMessages,
      messages: allMessages.join(' '),
    };
  }
}

export async function apiGetBlob(url: string, params?: object): Promise<ApiResponse<Blob>> {
  try {
    const response = await apiClient.get<Blob>(url, { params, responseType: 'blob' });
    return { ok: true, data: response.data, status: response.status, allMessages: [], messages: '' };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const allMessages = extractMessages(err);
    return {
      ok: false,
      data: null,
      status: axiosErr.response?.status ?? 0,
      allMessages,
      messages: allMessages.join(' '),
    };
  }
}

export async function apiPostBlob(url: string, data?: unknown): Promise<ApiResponse<Blob>> {
  try {
    const response = await apiClient.post<Blob>(url, data, { responseType: 'blob' });
    return { ok: true, data: response.data, status: response.status, allMessages: [], messages: '' };
  } catch (err) {
    const axiosErr = err as AxiosError;
    const allMessages = extractMessages(err);
    return {
      ok: false,
      data: null,
      status: axiosErr.response?.status ?? 0,
      allMessages,
      messages: allMessages.join(' '),
    };
  }
}

export default apiClient;
