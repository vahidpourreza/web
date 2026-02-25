'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountService } from './service';
import { accountKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse, toastApiError } from '@/api/utils';
import type {
  CreateSuperAdminRequest,
  ChangeStatusRequest,
  UpdateUserProfileRequest,
  ChangePasswordRequest,
  ChangeAccountStatusRequest,
  GetAllUsersByTenantRequest,
  GetUserProfileRequest,
  GetUserByIdRequest,
  GetUserFullProfileRequest,
  GetUserTenantProfileRequest,
  GetPagedUsersRequest,
} from './service';

export function useCurrentTenantUsers({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: accountKeys.byCurrentTenant(),
    queryFn: () => unwrapApiResponse(accountService.getAllUsersByCurrentTenant()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useUsersByTenant(
  data: GetAllUsersByTenantRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accountKeys.byTenant(data.tenantId),
    queryFn: () => unwrapApiResponse(accountService.getAllUsersByTenant(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useTenantUserProfile(
  data: GetUserProfileRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accountKeys.profile(data.tenantUserId),
    queryFn: () => unwrapApiResponse(accountService.getUserProfile(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useAllUsers({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: accountKeys.lists(),
    queryFn: () => unwrapApiResponse(accountService.getAll()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useUserById(
  data: GetUserByIdRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accountKeys.detail(data.id),
    queryFn: () => unwrapApiResponse(accountService.getById(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useUserFullProfile(
  data: GetUserFullProfileRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accountKeys.fullProfile(data.userId),
    queryFn: () => unwrapApiResponse(accountService.getFullProfile(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useUserTenantProfile(
  data: GetUserTenantProfileRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accountKeys.tenantProfile(data.userId, data.tenantId),
    queryFn: () => unwrapApiResponse(accountService.getUserTenantProfile(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useUsersCompact({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: accountKeys.compact(),
    queryFn: () => unwrapApiResponse(accountService.getAllUsersCompact()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useSuperAdminsCompact({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: accountKeys.superAdminsCompact(),
    queryFn: () => unwrapApiResponse(accountService.getAllSuperAdminsCompact()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function usePagedUsers(
  params: GetPagedUsersRequest = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accountKeys.paged(params),
    queryFn: () => unwrapApiResponse(accountService.getPagedUsers(params)),
    staleTime: 0,
    enabled,
  });
}

export function useCreateSuperAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSuperAdminRequest) =>
      unwrapApiResponse(accountService.createSuperAdmin(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.all });
      toast.success('سوپر ادمین با موفقیت ایجاد شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useChangeUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangeStatusRequest) =>
      unwrapVoidResponse(accountService.changeStatus(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.all });
      toast.success('وضعیت با موفقیت تغییر کرد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useUpdateUserProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserProfileRequest) =>
      unwrapVoidResponse(accountService.updateUserProfile(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.all });
      toast.success('مشخصات کاربر با موفقیت ویرایش شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useAccountChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      unwrapVoidResponse(accountService.changePassword(data)),
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر کرد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useChangeAccountStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangeAccountStatusRequest) =>
      unwrapVoidResponse(accountService.changeAccountStatus(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accountKeys.all });
      toast.success('وضعیت حساب با موفقیت تغییر کرد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}
