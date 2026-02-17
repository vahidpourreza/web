import { apiGet, apiPut } from '@/api/client';

// --- Requests ---

export interface UpdateFullNameRequest {
  firstName: string;
  lastName: string;
}

export interface ChangeProfilePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SetUserNameRequest {
  username: string;
}

export interface UpdateDateOfBirthRequest {
  birthDay: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetProfileRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetProfileDetailsRequest {}

export interface GetProfileTenantRequest {
  tenantId: string;
}

// --- Responses ---

export interface ProfileUserResponse {
  id: string;
  email: string | null;
  mobile: string;
  username: string | null;
  firstName: string;
  lastName: string;
  genderName: string;
  genderType: string;
  statusName: string;
  statusType: string;
  roleName: string;
  roleType: string;
  isRoot: boolean;
  birthDay: string;
  brokerId: string;
}

export interface CurrentUserProfileResponse {
  id: string;
  mobile: string;
  firstName: string;
  lastName: string;
  roleName: string;
  tenantsName: string;
  email: string;
  genderName: string;
  joinedTenantsCount: number;
  joinedCentersCount: number;
  birthDay: string;
  tenants: CurrentUserTenantShortProfileResponse[];
}

export interface CurrentUserTenantShortProfileResponse {
  id: string;
  displayName: string;
  legalName: string;
}

export interface CurrentUserTenantProfileResponse {
  tenantId: string;
  displayName: string;
  legalName: string;
  statusInTenant: string;
  centers: CurrentUserCenterResponse[];
}

export interface CurrentUserCenterResponse {
  centerId: string;
  centerName: string;
  accessGroups: CurrentUserAccessGroupResponse[];
}

export interface CurrentUserAccessGroupResponse {
  accessGroupId: string;
  accessGroupName: string;
}

// --- Service ---

const BASE = '/api/Access/v1/Profile';

export const profileService = {
  updateFullName: (data: UpdateFullNameRequest) =>
    apiPut<void>(`${BASE}/UpdateFullName`, data),

  changePassword: (data: ChangeProfilePasswordRequest) =>
    apiPut<void>(`${BASE}/ChangePassword`, data),

  setUserName: (data: SetUserNameRequest) =>
    apiPut<void>(`${BASE}/SetUserName`, data),

  updateDateOfBirth: (data: UpdateDateOfBirthRequest) =>
    apiPut<void>(`${BASE}/UpdateDateOfBirth`, data),

  get: (data?: GetProfileRequest) =>
    apiGet<ProfileUserResponse>(`${BASE}/Get`, data),

  getDetails: (data?: GetProfileDetailsRequest) =>
    apiGet<CurrentUserProfileResponse>(`${BASE}/GetDetails`, data),

  getTenant: (data: GetProfileTenantRequest) =>
    apiGet<CurrentUserTenantProfileResponse>(`${BASE}/GetTenant`, data),
};
