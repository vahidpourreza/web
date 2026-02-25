import { apiGet, apiPost, apiPut, apiDelete } from '@/api/client';

// --- Requests ---

export interface CreateAccessGroupRequest {
  name: string;
  navigationIds: string[];
}

export interface ModifyAccessGroupRequest {
  id: string;
  name: string;
  navigationIds: string[];
}

export interface DeleteAccessGroupRequest {
  accessGroupId: string;
}

export interface GetAccessGroupByIdRequest {
  accessGroupId: string;
}

export interface GetTenantAllAccessGroupsSummaryRequest {
  tenantId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllAccessGroupsSummaryRequest {}

// --- Responses ---

export interface AccessGroupSummaryResponse {
  id: string;
  name: string;
  isProtected: boolean;
}

export interface AccessGroupByIdResponse {
  id: string;
  name: string;
  isProtected: boolean;
  navigationIds: string[];
}

export interface TenantAccessGroupSummaryResponse {
  id: string;
  name: string;
}

// --- Service ---

const BASE = '/api/Access/v1/AccessGroup';

export const accessGroupService = {
  create: (data: CreateAccessGroupRequest) => apiPost<string>(`${BASE}/Create`, data),

  modify: (data: ModifyAccessGroupRequest) => apiPut<void>(`${BASE}/Modify`, data),

  delete: (data: DeleteAccessGroupRequest) => apiDelete<void>(`${BASE}/Delete`, data),

  getAllSummary: (data?: GetAllAccessGroupsSummaryRequest) =>
    apiGet<AccessGroupSummaryResponse[]>(`${BASE}/GetAllSummary`, data),

  getById: (data: GetAccessGroupByIdRequest) =>
    apiGet<AccessGroupByIdResponse>(`${BASE}/GetById`, data),

  getTenantAllAccessGroupsSummary: (data: GetTenantAllAccessGroupsSummaryRequest) =>
    apiGet<TenantAccessGroupSummaryResponse[]>(`${BASE}/GetTenantAllAccessGroupsSummary`, data),
};
