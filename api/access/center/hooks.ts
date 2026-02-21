'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { centerService } from './service';
import { centerKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse } from '@/api/utils';
import type {
  AddBranchRequest,
  AddRepositoryRequest,
  AddSiteRequest,
  RenameCenterRequest,
  DeleteCenterRequest,
  GetCenterByIdRequest,
  GetTenantCentersRequest,
  GetTenantAllCentersFlatRequest,
  GetCenterTreeByLevelsRequest,
} from './service';

export function useCenterById(
  data: GetCenterByIdRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: centerKeys.detail(data.centerId),
    queryFn: () => unwrapApiResponse(centerService.getById(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useTenantCenters(
  data: GetTenantCentersRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: centerKeys.byTenant(data.tenantId),
    queryFn: () => unwrapApiResponse(centerService.getTenantCenters(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCurrentTenantCentersFlat({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: centerKeys.currentTenantFlat(),
    queryFn: () => unwrapApiResponse(centerService.getCurrentTenantCentersFlat()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCurrentTenantCenters({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: centerKeys.currentTenant(),
    queryFn: () => unwrapApiResponse(centerService.getCurrentTenantCenters()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useTenantAllCentersFlat(
  data: GetTenantAllCentersFlatRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: centerKeys.byTenant(data.tenantId),
    queryFn: () => unwrapApiResponse(centerService.getTenantAllCentersFlat(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCenterTreeByLevels(
  data: GetCenterTreeByLevelsRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: centerKeys.tree(data.centerId),
    queryFn: () => unwrapApiResponse(centerService.getCenterTreeByLevels(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useAddBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddBranchRequest) =>
      unwrapApiResponse(centerService.addBranch(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: centerKeys.all });
      toast.success('شاخه با موفقیت اضافه شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddRepository() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddRepositoryRequest) =>
      unwrapApiResponse(centerService.addRepository(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: centerKeys.all });
      toast.success('مخزن با موفقیت اضافه شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAddSite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddSiteRequest) =>
      unwrapApiResponse(centerService.addSite(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: centerKeys.all });
      toast.success('سایت با موفقیت اضافه شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRenameCenter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RenameCenterRequest) =>
      unwrapVoidResponse(centerService.rename(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: centerKeys.all });
      toast.success('نام با موفقیت تغییر کرد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteCenter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteCenterRequest) =>
      unwrapVoidResponse(centerService.delete(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: centerKeys.all });
      toast.success('مرکز با موفقیت حذف شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
