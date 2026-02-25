'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { backdoorAccessService } from './service';
import { backdoorAccessKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse, toastApiError } from '@/api/utils';
import type {
  SetBackdoorAccessRequest,
  DeleteFullBackdoorAccessRequest,
  GetBackdoorAccessesByUserRequest,
} from './service';

export function useUsersWithBackdoorAccess({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: backdoorAccessKeys.users(),
    queryFn: () => unwrapApiResponse(backdoorAccessService.getUsersWithBackdoorAccess()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useBackdoorAccessesByUser(
  data: GetBackdoorAccessesByUserRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: backdoorAccessKeys.byUser(data.userId),
    queryFn: () => unwrapApiResponse(backdoorAccessService.getBackdoorAccessesByUser(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useSetBackdoorAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SetBackdoorAccessRequest) =>
      unwrapApiResponse(backdoorAccessService.setBackdoorAccess(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: backdoorAccessKeys.all });
      toast.success('دسترسی backdoor با موفقیت تنظیم شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useDeleteFullBackdoorAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteFullBackdoorAccessRequest) =>
      unwrapVoidResponse(backdoorAccessService.deleteFullBackdoorAccess(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: backdoorAccessKeys.all });
      toast.success('دسترسی backdoor با موفقیت حذف شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}
