import { apiGet, apiPost } from '@/api/client';

// --- Requests ---

export interface CreateTenantRequest {
  legalName: string;
  displayName: string;
  brokerId: string;
  tenantAdminUserId: string;
}

export interface GetTenantByIdRequest {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllTenantsSummaryRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllTenantCompactSummaryRequest {}

// --- Responses ---

export interface TenantResponse {
  id: string;
  legalName: string;
  displayName: string;
  brokerId: string;
  userId: string;
}

export interface TenantSummaryDetailResponse {
  tenantId: string;
  legalName: string;
  brokerName: string;
  adminFirstName: string;
  adminLastName: string;
  adminMobile: string;
  adminJoinedDate: string;
  adminGender: string;
  adminStatus: string;
}

export interface TenantCompactSummaryResponse {
  tenantId: string;
  displayName: string;
}

// --- Service ---

const BASE = '/api/Access/v1/Tenant';

export const tenantService = {
  create: (data: CreateTenantRequest) =>
    apiPost<string>(`${BASE}/Create`, data),

  getById: (data: GetTenantByIdRequest) =>
    apiGet<TenantResponse>(`${BASE}/GetById`, data),

  getAllSummary: (data?: GetAllTenantsSummaryRequest) =>
    apiGet<TenantSummaryDetailResponse[]>(`${BASE}/GetAllSummary`, data),

  getAllCompactSummary: (data?: GetAllTenantCompactSummaryRequest) =>
    apiGet<TenantCompactSummaryResponse[]>(`${BASE}/GetAllCompactSummary`, data),
};
