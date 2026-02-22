'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { registrationService } from './service';
import { unwrapApiResponse, unwrapVoidResponse, toastApiError } from '@/api/utils';
import type {
  CreateInvitedUserRequest,
  CreateTenantAdminRequest,
  CreateTenantStaffRequest,
  ForgetPasswordRequest,
} from './service';

export function useCreateInvitedUser() {
  return useMutation({
    mutationFn: (data: CreateInvitedUserRequest) =>
      unwrapApiResponse(registrationService.createInvitedUser(data)),
    onSuccess: () => {
      toast.success('کاربر با موفقیت ایجاد شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useCreateTenantAdmin() {
  return useMutation({
    mutationFn: (data: CreateTenantAdminRequest) =>
      unwrapApiResponse(registrationService.createTenantAdmin(data)),
    onSuccess: () => {
      toast.success('مدیر سازمان با موفقیت ایجاد شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useCreateTenantStaff() {
  return useMutation({
    mutationFn: (data: CreateTenantStaffRequest) =>
      unwrapApiResponse(registrationService.createTenantStaff(data)),
    onSuccess: () => {
      toast.success('کارمند سازمان با موفقیت ایجاد شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useForgetPassword() {
  return useMutation({
    mutationFn: (data: ForgetPasswordRequest) =>
      unwrapVoidResponse(registrationService.forgetPassword(data)),
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر کرد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}
