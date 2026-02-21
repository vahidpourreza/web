'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accessGroupService } from './service';
import { accessGroupKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse } from '@/api/utils';
import type {
  CreateAccessGroupRequest,
  ModifyAccessGroupRequest,
  DeleteAccessGroupRequest,
  GetAccessGroupByIdRequest,
  GetTenantAllAccessGroupsSummaryRequest,
} from './service';

export function useAllAccessGroupsSummary({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: accessGroupKeys.lists(),
    queryFn: () => unwrapApiResponse(accessGroupService.getAllSummary()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useAccessGroupById(
  data: GetAccessGroupByIdRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accessGroupKeys.detail(data.accessGroupId),
    queryFn: () => unwrapApiResponse(accessGroupService.getById(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useTenantAllAccessGroupsSummary(
  data: GetTenantAllAccessGroupsSummaryRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: accessGroupKeys.byTenant(data.tenantId),
    queryFn: () => unwrapApiResponse(accessGroupService.getTenantAllAccessGroupsSummary(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCreateAccessGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccessGroupRequest) =>
      unwrapApiResponse(accessGroupService.create(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accessGroupKeys.all });
      toast.success('گروه دسترسی با موفقیت ایجاد شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useModifyAccessGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ModifyAccessGroupRequest) =>
      unwrapVoidResponse(accessGroupService.modify(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accessGroupKeys.all });
      toast.success('گروه دسترسی با موفقیت ویرایش شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteAccessGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteAccessGroupRequest) =>
      unwrapVoidResponse(accessGroupService.delete(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: accessGroupKeys.all });
      toast.success('گروه دسترسی با موفقیت حذف شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
