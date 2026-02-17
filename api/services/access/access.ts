import { apiGet, apiPut } from '@/api/client';

// --- Requests ---

export interface SetUserCenterMembershipRequest {
  tenantUserId: string;
  centerId: string;
  accessGroupIds: string[];
  revokeAccess: boolean;
}

export interface GetUserActiveTenantsRequest {
  userId: string;
  brokerId: string;
}

export interface GetUserCentersWithAccessGroupsRequest {
  tenantUserId: string;
}

// --- Responses ---

export interface UserActiveTenantsResponse {
  tenantId: string;
  tenantName: string;
  tenantUserId: string;
}

export interface UserAccessibleCenterResponse {
  centerId: string;
  centerFullName: string;
  accessGroups: UserAccessGroupResponse[];
}

export interface UserAccessGroupResponse {
  accessGroupId: string;
  accessGroupName: string;
}

// --- Service ---

const BASE = '/api/Access/v1/Access';

export const accessService = {
  setUserCenterMembership: (data: SetUserCenterMembershipRequest) =>
    apiPut<void>(`${BASE}/SetUserCenterMembership`, data),

  getUserActiveTenants: (data: GetUserActiveTenantsRequest) =>
    apiGet<UserActiveTenantsResponse[]>(`${BASE}/GetUserActiveTenants`, data),

  getUserCentersWithAccessGroups: (data: GetUserCentersWithAccessGroupsRequest) =>
    apiGet<UserAccessibleCenterResponse[]>(`${BASE}/GetUserCentersWithAccessGroups`, data),
};
