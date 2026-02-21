import type { ApiResponse } from '@/api/types';

export async function unwrapApiResponse<T>(promise: Promise<ApiResponse<T>>): Promise<T> {
  const res = await promise;
  if (!res.ok) throw new Error(res.messages || 'خطای ناشناخته');
  return res.data;
}

export async function unwrapVoidResponse(promise: Promise<ApiResponse<void>>): Promise<void> {
  const res = await promise;
  if (!res.ok) throw new Error(res.messages || 'خطای ناشناخته');
}
