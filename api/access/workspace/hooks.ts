'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workspaceService } from './service';
import { workspaceKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse } from '@/api/utils';
import type {
  AddDeskRequest,
  SwapDeskRequest,
  UpdateDeskRequest,
  DeleteDeskRequest,
  GetDeskRequest,
} from './service';

export function useMyDesks({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: workspaceKeys.desks(),
    queryFn: () => unwrapApiResponse(workspaceService.getMyDesks()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useDesk(
  data: GetDeskRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: workspaceKeys.desk(data.deskId),
    queryFn: () => unwrapApiResponse(workspaceService.getDesk(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useMyWorkSpace({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: workspaceKeys.space(),
    queryFn: () => unwrapApiResponse(workspaceService.getMyWorkSpace()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useMyMenus({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: workspaceKeys.menus(),
    queryFn: () => unwrapApiResponse(workspaceService.getMyMenus()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useMyAvailableWorkDesks({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: workspaceKeys.available(),
    queryFn: () => unwrapApiResponse(workspaceService.getMyAvailableWorkDesk()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useAddDesk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddDeskRequest) =>
      unwrapApiResponse(workspaceService.addDesk(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workspaceKeys.all });
      toast.success('میز با موفقیت اضافه شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSwapDesk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SwapDeskRequest) =>
      unwrapVoidResponse(workspaceService.swapDesk(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workspaceKeys.all });
      toast.success('میز با موفقیت تغییر کرد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateDesk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateDeskRequest) =>
      unwrapVoidResponse(workspaceService.updateDesk(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workspaceKeys.all });
      toast.success('میز با موفقیت ویرایش شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useToggleLayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => unwrapVoidResponse(workspaceService.toggleLayout()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workspaceKeys.space() });
      toast.success('چیدمان با موفقیت تغییر کرد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteDesk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteDeskRequest) =>
      unwrapVoidResponse(workspaceService.deleteDesk(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workspaceKeys.all });
      toast.success('میز با موفقیت حذف شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
