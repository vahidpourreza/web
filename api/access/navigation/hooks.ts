'use client';

import { useQuery } from '@tanstack/react-query';
import { navigationService } from './service';
import { navigationKeys } from './keys';
import { unwrapApiResponse } from '@/api/utils';
import type { GetTreeByClientRequest } from './service';

export function useNavigationTreeByClient(
  data: GetTreeByClientRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: navigationKeys.byClient(data.clientApp),
    queryFn: () => unwrapApiResponse(navigationService.getTreeByClient(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useLicensableTree({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: navigationKeys.licensable(),
    queryFn: () => unwrapApiResponse(navigationService.getLicensableTree()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCurrentTenantLicenseAccess({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: navigationKeys.currentLicense(),
    queryFn: () => unwrapApiResponse(navigationService.getCurrentTenantCurrentLicenseAccess()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useNavigationTreeByAdminScope({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: navigationKeys.adminScope(),
    queryFn: () => unwrapApiResponse(navigationService.getNavigationTreeByAdminScope()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}
