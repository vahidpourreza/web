import { apiGet, apiPost, apiPut, apiDelete } from '@/api/client';

// --- Requests ---

export interface CreateAdminAccessRequest {
  superAdminUserId: string;
  note: string;
  navigationIds: string[];
}

export interface ModifyNavigationsRequest {
  adminPrivilegeId: string;
  navigationIds: string[];
}

export interface DeleteAdminAccessRequest {
  adminPrivilegeId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllSuperAdminsDetailsRequest {}

export interface GetBySuperAdminIdRequest {
  superAdminUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllSuperAdminsWithPrivilegeRequest {}

// --- Responses ---

export interface AllSuperAdminsWithDetailsResponse {
  userId: string;
  isRoot: boolean;
  mobile: string;
  fullName: string;
  roleName: string;
  backdoorTenants: string[];
  privilege: SuperAdminPrivilegeDetailsResponse;
}

export interface SuperAdminPrivilegeDetailsResponse {
  privilegeId: string;
  adminNote: string;
  promotedBy: string;
}

export interface SuperAdminPrivilegeResponse {
  navigationIds: string[];
}

export interface SuperAdminWithPrivilegeResponse {
  userId: string;
  privilegeId: string;
  mobile: string;
  fullName: string;
  adminNote: string;
  promotedBy: string;
}

// --- Service ---

const BASE = '/api/Access/v1/AdminAccess';

export const adminAccessService = {
  create: (data: CreateAdminAccessRequest) =>
    apiPost<string>(`${BASE}/Create`, data),

  modifyNavigations: (data: ModifyNavigationsRequest) =>
    apiPut<void>(`${BASE}/ModifyNavigations`, data),

  delete: (data: DeleteAdminAccessRequest) =>
    apiDelete<void>(`${BASE}/Delete`, data),

  getAllSuperAdminsDetails: (data?: GetAllSuperAdminsDetailsRequest) =>
    apiGet<AllSuperAdminsWithDetailsResponse[]>(`${BASE}/GetAllSuperAdminsDetails`, data),

  getBySuperAdminId: (data: GetBySuperAdminIdRequest) =>
    apiGet<SuperAdminPrivilegeResponse>(`${BASE}/GetBySuperAdminId`, data),

  getAllSuperAdminsWithPrivilege: (data?: GetAllSuperAdminsWithPrivilegeRequest) =>
    apiGet<SuperAdminWithPrivilegeResponse[]>(`${BASE}/GetAllSuperAdminsWithPrivilege`, data),
};
