'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { otpService } from './service';
import { otpKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse, toastApiError } from '@/api/utils';
import type {
  GenerateOtpRequest,
  GenerateOtpByInvitationCodeRequest,
  VerifyOtpRequest,
  GetOtpMobileRequest,
} from './service';

export function useOtpMobile(
  data: GetOtpMobileRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: otpKeys.mobile(data.id),
    queryFn: () => unwrapApiResponse(otpService.getOtpMobile(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useGenerateOtp() {
  return useMutation({
    mutationFn: (data: GenerateOtpRequest) =>
      unwrapApiResponse(otpService.generate(data)),
    onSuccess: () => {
      toast.success('کد تایید با موفقیت ارسال شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useGenerateOtpByInvitationCode() {
  return useMutation({
    mutationFn: (data: GenerateOtpByInvitationCodeRequest) =>
      unwrapApiResponse(otpService.generateByInvitationCode(data)),
    onSuccess: () => {
      toast.success('کد تایید با موفقیت ارسال شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) =>
      unwrapVoidResponse(otpService.verify(data)),
    onSuccess: () => {
      toast.success('کد تایید با موفقیت تایید شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}
