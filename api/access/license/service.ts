import { apiGet, apiPost, apiPut, apiDelete } from '@/api/client';

// --- Requests ---

export interface CreateStandardLicenseRequest {
  name: string;
  maxUsers: number;
  maxCenters: number;
  validityPeriodDays: number;
  navigationIds: string[];
}

export interface CreateUnlimitedLicenseRequest {
  name: string;
  validityPeriodDays: number;
  navigationIds: string[];
}

export interface SetDefaultLicenseRequest {
  licenseId: string;
}

export interface UpdateLicenseContentRequest {
  licenseId: string;
  navigationIds: string[];
}

export interface UpdateLicenseRequest {
  licenseId: string;
  newName: string;
  newMaxUsers: number;
  newMaxCenters: number;
  newValidityPeriodDays: number;
}

export interface DeleteLicenseRequest {
  licenseId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllLicensesSummaryRequest {}

export interface GetLicenseByIdRequest {
  id: string;
}

export interface GetAllTenantsLicensesRequest {
  needFullHistory: boolean;
}

export interface GetTenantLicensesHistoryRequest {
  tenantId: string;
}

// --- Responses ---

export interface LicenseSummaryResponse {
  id: string;
  name: string;
  isDefault: boolean;
  maxUsers: number;
  maxCenters: number;
  validityPeriodDays: number;
}

export interface LicenseResponse {
  id: string;
  name: string;
  isDefault: boolean;
  maxUsers: number;
  maxCenters: number;
  validityPeriodDays: number;
  licenseNavigations: LicenseNavigationResponse[];
}

export interface LicenseNavigationResponse {
  id: string;
  navigationId: string;
}

export interface TenantLicenseResponse {
  id: string;
  displayName: string;
  activeCentersCount: number;
  activeUsersCount: number;
  licenseHistories: LicenseHistoryResponse[];
}

export interface LicenseHistoryResponse {
  id: string;
  licenseId: string;
  licenseName: string;
  startDate: string;
  endDate: string;
  statusType: string;
  statusName: string;
  isCurrent: boolean;
}

// --- Service ---

const BASE = '/api/Access/v1/License';

export const licenseService = {
  createStandard: (data: CreateStandardLicenseRequest) =>
    apiPost<string>(`${BASE}/CreateStandard`, data),

  createUnlimited: (data: CreateUnlimitedLicenseRequest) =>
    apiPost<string>(`${BASE}/CreateUnlimited`, data),

  setDefault: (data: SetDefaultLicenseRequest) =>
    apiPut<void>(`${BASE}/SetDefault`, data),

  updateContent: (data: UpdateLicenseContentRequest) =>
    apiPut<void>(`${BASE}/UpdateContent`, data),

  update: (data: UpdateLicenseRequest) =>
    apiPut<void>(`${BASE}/Update`, data),

  delete: (data: DeleteLicenseRequest) =>
    apiDelete<void>(`${BASE}/Delete`, data),

  getAllSummary: (data?: GetAllLicensesSummaryRequest) =>
    apiGet<LicenseSummaryResponse[]>(`${BASE}/GetAllSummary`, data),

  getById: (data: GetLicenseByIdRequest) =>
    apiGet<LicenseResponse>(`${BASE}/GetById`, data),

  getAllTenantsLicenses: (data: GetAllTenantsLicensesRequest) =>
    apiGet<TenantLicenseResponse[]>(`${BASE}/GetAllTenantsLicenses`, data),

  getTenantLicensesHistory: (data: GetTenantLicensesHistoryRequest) =>
    apiGet<TenantLicenseResponse>(`${BASE}/GetTenantLicensesHistory`, data),
};
