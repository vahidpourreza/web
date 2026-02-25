import { apiGet, apiPost, apiPut } from '@/api/client';
import type { PagedData, PageQuery } from '@/api/types';

// --- Requests ---

export interface CreateSuperAdminRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
  birthDay: string;
  gender: string;
}

export interface ChangeStatusRequest {
  tenantUserId: string;
  newStatusType: string;
}

export interface UpdateUserProfileRequest {
  userId: string;
  firstName: string;
  lastName: string;
  birthDay: string;
  username: string;
}

export interface ChangePasswordRequest {
  userId: string;
  newPassword: string;
}

export interface ChangeAccountStatusRequest {
  userId: string;
  newStatusType: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllUsersByCurrentTenantRequest {}

export interface GetAllUsersByTenantRequest {
  tenantId: string;
}

export interface GetUserProfileRequest {
  tenantUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllUsersRequest {}

export interface GetUserByIdRequest {
  id: string;
}

export interface GetUserFullProfileRequest {
  userId: string;
}

export interface GetUserTenantProfileRequest {
  userId: string;
  tenantId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllUsersCompactRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllSuperAdminsCompactRequest {}

export interface GetPagedUsersRequest extends PageQuery {
  fullName?: string;
  mobile?: string;
  statusType?: string;
  roleType?: string;
  brokerId?: string;
}

// --- Responses ---

export interface UserByTenantResponse {
  tenantUserId: string;
  userId: string;
  mobile: string;
  firstName: string;
  lastName: string;
  fullName: string;
  tenantStatusName: string;
  tenantStatusType: string;
  isTenantAdmin: boolean;
}

export interface TenantUserUserProfileResponse {
  tenantUserId: string;
  mobile: string;
  firstName: string;
  lastName: string;
  roleName: string;
  email: string;
  genderName: string;
  joinedCurrentTenantCentersCount: number;
  statusInTenant: string;
  birthDay: string;
  centers: TenantUserUserProfileCenterResponse[];
}

export interface TenantUserUserProfileCenterResponse {
  centerId: string;
  centerName: string;
  accessGroups: TenantUserUserProfileAccessGroupResponse[];
}

export interface TenantUserUserProfileAccessGroupResponse {
  accessGroupId: string;
  accessGroupName: string;
}

export interface AllUsersResponse {
  id: string;
  mobile: string;
  fullName: string;
  statusName: string;
  statusType: string;
  roleName: string;
  brokerName: string;
  tenantsName: string;
}

export interface UserResponse {
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

export interface UserFullProfileResponse {
  id: string;
  mobile: string;
  firstName: string;
  lastName: string;
  statusName: string;
  roleName: string;
  brokerName: string;
  brokerTypeName: string;
  tenantsName: string;
  email: string;
  genderName: string;
  joinedTenantsCount: number;
  joinedCentersCount: number;
  birthDay: string;
  tenants: UserTenantShortProfileResponse[];
}

export interface UserTenantShortProfileResponse {
  id: string;
  displayName: string;
  legalName: string;
}

export interface UserTenantProfileResponse {
  tenantId: string;
  displayName: string;
  legalName: string;
  statusInTenant: string;
  centers: UserCenterResponse[];
}

export interface UserCenterResponse {
  centerId: string;
  centerName: string;
  accessGroups: UserAccessGroupInCenterResponse[];
}

export interface UserAccessGroupInCenterResponse {
  accessGroupId: string;
  accessGroupName: string;
}

export interface UserCompactResponse {
  id: string;
  mobile: string;
  fullName: string;
}

export interface SuperAdminCompactResponse {
  id: string;
  mobile: string;
  fullName: string;
}

// --- Service ---

const BASE = '/api/Access/v1/Account';

export const accountService = {
  createSuperAdmin: (data: CreateSuperAdminRequest) =>
    apiPost<string>(`${BASE}/CreateSuperAdmin`, data),

  changeStatus: (data: ChangeStatusRequest) =>
    apiPut<void>(`${BASE}/ChangeStatus`, data),

  updateUserProfile: (data: UpdateUserProfileRequest) =>
    apiPut<void>(`${BASE}/UpdateUserProfile`, data),

  changePassword: (data: ChangePasswordRequest) =>
    apiPut<void>(`${BASE}/ChangePassword`, data),

  changeAccountStatus: (data: ChangeAccountStatusRequest) =>
    apiPut<void>(`${BASE}/ChangeAccountStatus`, data),

  getAllUsersByCurrentTenant: (data?: GetAllUsersByCurrentTenantRequest) =>
    apiGet<UserByTenantResponse[]>(`${BASE}/GetAllUsersByCurrentTenant`, data),

  getAllUsersByTenant: (data: GetAllUsersByTenantRequest) =>
    apiGet<UserByTenantResponse[]>(`${BASE}/GetAllUsersByTenant`, data),

  getUserProfile: (data: GetUserProfileRequest) =>
    apiGet<TenantUserUserProfileResponse>(`${BASE}/GetUserProfile`, data),

  getAll: (data?: GetAllUsersRequest) =>
    apiGet<AllUsersResponse[]>(`${BASE}/GetAll`, data),

  getById: (data: GetUserByIdRequest) =>
    apiGet<UserResponse>(`${BASE}/GetById`, data),

  getFullProfile: (data: GetUserFullProfileRequest) =>
    apiGet<UserFullProfileResponse>(`${BASE}/GetFullProfile`, data),

  getUserTenantProfile: (data: GetUserTenantProfileRequest) =>
    apiGet<UserTenantProfileResponse>(`${BASE}/GetUserTenantProfile`, data),

  getAllUsersCompact: (data?: GetAllUsersCompactRequest) =>
    apiGet<UserCompactResponse[]>(`${BASE}/GetAllUsersCompact`, data),

  getAllSuperAdminsCompact: (data?: GetAllSuperAdminsCompactRequest) =>
    apiGet<SuperAdminCompactResponse[]>(`${BASE}/GetAllSuperAdminsCompact`, data),

  getPagedUsers: (data?: GetPagedUsersRequest) =>
    apiGet<PagedData<UserResponse>>(`${BASE}/GetPaged`, data),
};
