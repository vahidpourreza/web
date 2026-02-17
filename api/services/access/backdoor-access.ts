import { apiGet, apiPost, apiDelete } from '@/api/client';

// --- Requests ---

export interface SetBackdoorAccessRequest {
  userId: string;
  tenantId: string;
  centerId: string;
  accessGroupIds: string[];
  revokeAccess: boolean;
}

export interface DeleteFullBackdoorAccessRequest {
  tenantUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetUsersWithBackdoorAccessRequest {}

export interface GetBackdoorAccessesByUserRequest {
  userId: string;
}

// --- Responses ---

export interface UserWithBackdoorAccessSummaryResponse {
  userId: string;
  mobile: string;
  fullName: string;
  roleName: string;
  backdoorTenantsName: string;
}

export interface UserBackdoorAccessResponse {
  tenantId: string;
  tenantUserId: string;
  tenantDisplayName: string;
  centers: UserBackdoorInCenterResponse[];
}

export interface UserBackdoorInCenterResponse {
  centerId: string;
  centerFullName: string;
  accessGroups: UserBackdoorAccessGroupResponse[];
}

export interface UserBackdoorAccessGroupResponse {
  accessGroupId: string;
  accessGroupName: string;
}

// --- Service ---

const BASE = '/api/Access/v1/BackdoorAccess';

export const backdoorAccessService = {
  setBackdoorAccess: (data: SetBackdoorAccessRequest) =>
    apiPost<string>(`${BASE}/SetBackdoorAccess`, data),

  deleteFullBackdoorAccess: (data: DeleteFullBackdoorAccessRequest) =>
    apiDelete<void>(`${BASE}/DeleteFullBackdoorAccess`, data),

  getUsersWithBackdoorAccess: (data?: GetUsersWithBackdoorAccessRequest) =>
    apiGet<UserWithBackdoorAccessSummaryResponse[]>(`${BASE}/GetUsersWithBackdoorAccess`, data),

  getBackdoorAccessesByUser: (data: GetBackdoorAccessesByUserRequest) =>
    apiGet<UserBackdoorAccessResponse[]>(`${BASE}/GetBackdoorAccessesByUser`, data),
};
