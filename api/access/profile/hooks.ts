'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileService } from './service';
import { profileKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse } from '@/api/utils';
import type {
  UpdateFullNameRequest,
  SetUserNameRequest,
  UpdateDateOfBirthRequest,
  ChangeProfilePasswordRequest,
} from './service';

export function useProfile({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: () => unwrapApiResponse(profileService.get()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useUpdateFullName() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateFullNameRequest) =>
      unwrapVoidResponse(profileService.updateFullName(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.all });
      toast.success('مشخصات با موفقیت ویرایش شد.');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSetUsername() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SetUserNameRequest) =>
      unwrapVoidResponse(profileService.setUserName(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.all });
      toast.success('نام کاربری با موفقیت ذخیره شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateDateOfBirth() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateDateOfBirthRequest) =>
      unwrapVoidResponse(profileService.updateDateOfBirth(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.all });
      toast.success('تاریخ تولد با موفقیت ذخیره شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangeProfilePasswordRequest) =>
      unwrapVoidResponse(profileService.changePassword(data)),
    onSuccess: () => {
      toast.success('رمز عبور با موفقیت تغییر کرد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
