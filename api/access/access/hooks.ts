'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accessService } from './service';
import { accessKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse } from '@/api/utils';
import type {
  SetUserCenterMembershipRequest,
  GetUserActiveTenantsRequest,
  GetUserCentersWithAccessGroupsRequest,
} from './service';

export function useUserActiveTenants(
  data: GetUserActiveTenantsRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accessKeys.activeTenants(data.userId, data.brokerId),
    queryFn: () => unwrapApiResponse(accessService.getUserActiveTenants(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useUserCentersWithAccessGroups(
  data: GetUserCentersWithAccessGroupsRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accessKeys.centersWithGroups(data.tenantUserId),
    queryFn: () => unwrapApiResponse(accessService.getUserCentersWithAccessGroups(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useSetUserCenterMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SetUserCenterMembershipRequest) =>
      unwrapVoidResponse(accessService.setUserCenterMembership(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accessKeys.all });
      toast.success('دسترسی کاربر با موفقیت تنظیم شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
