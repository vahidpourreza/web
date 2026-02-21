'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { licenseService } from './service';
import { licenseKeys } from './keys';
import { unwrapApiResponse, unwrapVoidResponse } from '@/api/utils';
import type {
  CreateStandardLicenseRequest,
  CreateUnlimitedLicenseRequest,
  SetDefaultLicenseRequest,
  UpdateLicenseContentRequest,
  UpdateLicenseRequest,
  DeleteLicenseRequest,
  GetLicenseByIdRequest,
  GetAllTenantsLicensesRequest,
  GetTenantLicensesHistoryRequest,
} from './service';

export function useAllLicensesSummary({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: licenseKeys.lists(),
    queryFn: () => unwrapApiResponse(licenseService.getAllSummary()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useLicenseById(
  data: GetLicenseByIdRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: licenseKeys.detail(data.id),
    queryFn: () => unwrapApiResponse(licenseService.getById(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useAllTenantsLicenses(
  data: GetAllTenantsLicensesRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: licenseKeys.tenants(),
    queryFn: () => unwrapApiResponse(licenseService.getAllTenantsLicenses(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useTenantLicensesHistory(
  data: GetTenantLicensesHistoryRequest,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: licenseKeys.tenantHistory(data.tenantId),
    queryFn: () => unwrapApiResponse(licenseService.getTenantLicensesHistory(data)),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}

export function useCreateStandardLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStandardLicenseRequest) =>
      unwrapApiResponse(licenseService.createStandard(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: licenseKeys.all });
      toast.success('لایسنس استاندارد با موفقیت ایجاد شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateUnlimitedLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUnlimitedLicenseRequest) =>
      unwrapApiResponse(licenseService.createUnlimited(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: licenseKeys.all });
      toast.success('لایسنس نامحدود با موفقیت ایجاد شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSetDefaultLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SetDefaultLicenseRequest) =>
      unwrapVoidResponse(licenseService.setDefault(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: licenseKeys.all });
      toast.success('لایسنس پیش‌فرض با موفقیت تنظیم شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLicenseContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateLicenseContentRequest) =>
      unwrapVoidResponse(licenseService.updateContent(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: licenseKeys.all });
      toast.success('محتوای لایسنس با موفقیت ویرایش شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateLicenseRequest) =>
      unwrapVoidResponse(licenseService.update(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: licenseKeys.all });
      toast.success('لایسنس با موفقیت ویرایش شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DeleteLicenseRequest) =>
      unwrapVoidResponse(licenseService.delete(data)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: licenseKeys.all });
      toast.success('لایسنس با موفقیت حذف شد');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
