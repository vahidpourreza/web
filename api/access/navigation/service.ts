import { apiGet } from '@/api/client';

// --- Requests ---

export interface GetTreeByClientRequest {
  clientApp: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetLicensableTreeRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetCurrentTenantCurrentLicenseAccessRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetNavigationTreeByAdminScopeRequest {}

// --- Responses ---

export interface ClientAppNavigationResponse {
  id: string;
  parentId: string | null;
  title: string;
  typeName: string;
  type: string;
  accessScope: string;
  isActive: boolean;
  requiredPermissions: string[] | null;
  navigations: ClientAppNavigationResponse[] | null;
}

export interface LicensableNavigationResponse {
  id: string;
  parentId: string | null;
  title: string;
  typeName: string;
  type: string;
  clientApp: string;
  isActive: boolean;
  isMandatoryForParent: boolean;
  requiredPermissions: string[] | null;
  navigations: LicensableNavigationResponse[] | null;
}

export interface CurrentTenantCurrentLicenseAccessResponse {
  licenseName: string;
  navigations: CurrentLicenseNavigationTreeResponse[];
}

export interface CurrentLicenseNavigationTreeResponse {
  id: string;
  parentId: string | null;
  title: string;
  typeName: string;
  type: string;
  clientApp: string;
  clientAppName: string;
  isMandatoryForParent: boolean;
  isAccessible: boolean;
  navigations: CurrentLicenseNavigationTreeResponse[] | null;
}

export interface NavigationByAdminScopeResponse {
  id: string;
  parentId: string | null;
  title: string;
  typeName: string;
  type: string;
  clientApp: string;
  clientAppName: string;
  isMandatoryForParent: boolean;
  navigations: NavigationByAdminScopeResponse[] | null;
}

// --- Service ---

const BASE = '/api/Access/v1/Navigation';

export const navigationService = {
  getTreeByClient: (data: GetTreeByClientRequest) =>
    apiGet<ClientAppNavigationResponse[]>(`${BASE}/GetTreeByClient`, data),

  getLicensableTree: (data?: GetLicensableTreeRequest) =>
    apiGet<LicensableNavigationResponse[]>(`${BASE}/GetLicensableTree`, data),

  getCurrentTenantCurrentLicenseAccess: (data?: GetCurrentTenantCurrentLicenseAccessRequest) =>
    apiGet<CurrentTenantCurrentLicenseAccessResponse>(`${BASE}/GetCurrentTenantCurrentLicenseAccess`, data),

  getNavigationTreeByAdminScope: (data?: GetNavigationTreeByAdminScopeRequest) =>
    apiGet<NavigationByAdminScopeResponse[]>(`${BASE}/GetNavigationTreeByAdminScope`, data),
};
