import { apiGet, apiPost, apiPut, apiDelete } from '@/api/client';

// --- Requests ---

export interface AddBranchRequest {
  name: string;
  parentCenterId: string;
}

export interface AddRepositoryRequest {
  name: string;
  parentCenterId: string;
}

export interface AddSiteRequest {
  name: string;
  parentCenterId: string;
}

export interface RenameCenterRequest {
  centerId: string;
  newName: string;
}

export interface DeleteCenterRequest {
  centerId: string;
}

export interface GetCenterByIdRequest {
  centerId: string;
}

export interface GetTenantCentersRequest {
  tenantId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetCurrentTenantCentersFlatRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetCurrentTenantCentersRequest {}

export interface GetTenantAllCentersFlatRequest {
  tenantId: string;
}

export interface GetCenterTreeByLevelsRequest {
  centerId: string;
  centerLevels: number[];
}

// --- Responses ---

export interface CenterResponse {
  id: string;
  name: string;
  level: string;
  prefix: string;
  parentId: string | null;
  tenantId: string;
  isDeleted: boolean;
  childs: CenterResponse[];
  parent: CenterResponse | null;
}

export interface CurrentTenantCenterFlatResponse {
  id: string;
  fullName: string;
}

export interface CurrentTenantCenterResponse {
  id: string;
  name: string;
  levelName: string;
  levelType: number;
  parentId: string | null;
  children: CurrentTenantCenterResponse[];
}

export interface TenantCenterFlatResponse {
  id: string;
  fullName: string;
}

export interface CenterTreeResponse {
  id: string;
  name: string;
  level: string;
  prefix: string;
  parentId: string | null;
  nodes: CenterTreeResponse[];
}

// --- Service ---

const BASE = '/api/Access/v1/Center';

export const centerService = {
  addBranch: (data: AddBranchRequest) =>
    apiPost<string>(`${BASE}/AddBranch`, data),

  addRepository: (data: AddRepositoryRequest) =>
    apiPost<string>(`${BASE}/AddRepository`, data),

  addSite: (data: AddSiteRequest) =>
    apiPost<string>(`${BASE}/AddSite`, data),

  rename: (data: RenameCenterRequest) =>
    apiPut<void>(`${BASE}/Rename`, data),

  delete: (data: DeleteCenterRequest) =>
    apiDelete<void>(`${BASE}/Delete`, data),

  getById: (data: GetCenterByIdRequest) =>
    apiGet<CenterResponse>(`${BASE}/GetById`, data),

  getTenantCenters: (data: GetTenantCentersRequest) =>
    apiGet<CenterResponse>(`${BASE}/GetTenantCenters`, data),

  getCurrentTenantCentersFlat: (data?: GetCurrentTenantCentersFlatRequest) =>
    apiGet<CurrentTenantCenterFlatResponse[]>(`${BASE}/GetCurrentTenantCentersFlat`, data),

  getCurrentTenantCenters: (data?: GetCurrentTenantCentersRequest) =>
    apiGet<CurrentTenantCenterResponse>(`${BASE}/GetCurrentTenantCenters`, data),

  getTenantAllCentersFlat: (data: GetTenantAllCentersFlatRequest) =>
    apiGet<TenantCenterFlatResponse[]>(`${BASE}/GetTenantAllCentersFlat`, data),

  getCenterTreeByLevels: (data: GetCenterTreeByLevelsRequest) =>
    apiGet<CenterTreeResponse[]>(`${BASE}/GetCenterTreeByLevels`, data),
};
