'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tenantService } from './service';
import { tenantKeys } from './keys';
import { unwrapApiResponse } from '@/api/utils';
import type { CreateTenantRequest, GetTenantByIdRequest } from './service';

export function useTenantById(
  data: GetTenantByIdRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: tenantKeys.detail(data.id),
    queryFn: () => unwrapApiResponse(tenantService.getById(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useAllTenantsSummary({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: tenantKeys.summary(),
    queryFn: () => unwrapApiResponse(tenantService.getAllSummary()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useAllTenantCompactSummary({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: tenantKeys.compactSummary(),
    queryFn: () => unwrapApiResponse(tenantService.getAllCompactSummary()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCreateTenant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTenantRequest) =>
      unwrapApiResponse(tenantService.create(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: tenantKeys.all });
      toast.success('سازمان با موفقیت ایجاد شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
