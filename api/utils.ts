import { toast } from 'sonner';
import type { ApiResponse } from '@/api/types';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function unwrapApiResponse<T>(promise: Promise<ApiResponse<T>>): Promise<T> {
  const res = await promise;
  if (!res.ok) throw new ApiError(res.messages || 'خطای ناشناخته', res.status);
  return res.data;
}

export async function unwrapVoidResponse(promise: Promise<ApiResponse<void>>): Promise<void> {
  const res = await promise;
  if (!res.ok) throw new ApiError(res.messages || 'خطای ناشناخته', res.status);
}

export function toastApiError(e: Error) {
  if (e instanceof ApiError && e.status === 500) return;
  toast.error(e.message);
}
