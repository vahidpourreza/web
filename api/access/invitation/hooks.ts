'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { invitationService } from './service';
import { invitationKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse, toastApiError } from '@/api/utils';
import type {
  CreateInvitationRequest,
  RevokeInvitationRequest,
  AcceptInvitationRequest,
  ResendInvitationRequest,
  GetInvitationDetailsRequest,
} from './service';

export function useInvitationDetails(
  data: GetInvitationDetailsRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: invitationKeys.detail(data.invitationCode),
    queryFn: () => unwrapApiResponse(invitationService.getDetails(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useAllPendingInvitations({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: invitationKeys.pending(),
    queryFn: () => unwrapApiResponse(invitationService.getAllPendingUserInvitationsInTenant()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCreateInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvitationRequest) =>
      unwrapApiResponse(invitationService.create(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.all });
      toast.success('دعوتنامه با موفقیت ارسال شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useRevokeInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RevokeInvitationRequest) =>
      unwrapVoidResponse(invitationService.revoke(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.all });
      toast.success('دعوتنامه با موفقیت لغو شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useAcceptInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AcceptInvitationRequest) =>
      unwrapVoidResponse(invitationService.accept(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.all });
      toast.success('دعوتنامه با موفقیت پذیرفته شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}

export function useResendInvitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ResendInvitationRequest) =>
      unwrapVoidResponse(invitationService.resend(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: invitationKeys.all });
      toast.success('دعوتنامه با موفقیت مجدداً ارسال شد');
    },
    onError: (e: Error) => toastApiError(e),
  });
}
