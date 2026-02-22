'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminAccessService } from './service';
import { adminAccessKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse, toastApiError } from '@/api/utils';
import type {
  CreateAdminAccessRequest,
  ModifyNavigationsRequest,
  DeleteAdminAccessRequest,
  GetBySuperAdminIdRequest,
} from './service';

export function useAllSuperAdminsDetails({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: adminAccessKeys.all,
    queryFn: () => unwrapApiResponse(adminAccessService.getAllSuperAdminsDetails()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useSuperAdminPrivilege(
  data: GetBySuperAdminIdRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: adminAccessKeys.detail(data.superAdminUserId),
    queryFn: () => unwrapApiResponse(adminAccessService.getBySuperAdminId(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useAllSuperAdminsWithPrivilege({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: adminAccessKeys.withPrivilege(),
    queryFn: () => unwrapApiResponse(adminAccessService.getAllSuperAdminsWithPrivilege()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCreateAdminAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdminAccessRequest) =>
      unwrapApiResponse(adminAccessService.create(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminAccessKeys.all });
      toast.success('دسترسی مدیر با موفقیت ایجاد شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useModifyAdminNavigations() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ModifyNavigationsRequest) =>
      unwrapVoidResponse(adminAccessService.modifyNavigations(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminAccessKeys.all });
      toast.success('مسیریابی با موفقیت ویرایش شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useDeleteAdminAccess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteAdminAccessRequest) =>
      unwrapVoidResponse(adminAccessService.delete(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminAccessKeys.all });
      toast.success('دسترسی مدیر با موفقیت حذف شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}
