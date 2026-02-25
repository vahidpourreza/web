import { apiGet, apiPost, apiPut, apiDelete } from '@/api/client';

// --- Requests ---

export interface AddDeskRequest {
  title: string;
  description: string | null;
  tenantId: string;
  centerId: string;
  accessGroupIds: string[];
}

export interface SwapDeskRequest {
  targetDeskId: string;
}

export interface UpdateDeskRequest {
  workDeskId: string;
  title: string;
  description: string | null;
  tenantId: string;
  centerId: string;
  accessGroupIds: string[];
}

export interface DeleteDeskRequest {
  workDeskId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetMyDesksRequest {}

export interface GetDeskRequest {
  deskId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetMyWorkSpaceRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetMyMenusRequest {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetMyAvailableWorkDeskRequest {}

// --- Responses ---

export interface WorkDeskResponse {
  id: string;
  title: string;
  description: string | null;
  isCurrent: boolean;
  workDeskType: number;
  workDeskTypeName: string;
  tenantName: string;
}

export interface WorkDeskItemResponse {
  id: string;
  title: string;
  description: string | null;
  isCurrent: boolean;
  tenantName: string;
  tenantUserId: string;
  tenantId: string;
  centerId: string;
  accessGroupIds: string;
}

export interface UserWorkSpaceResponse {
  layout: string;
  currentDeskId: string;
  currentDeskType: number;
}

export interface CurrentUserMenuResponse {
  id: string;
  title: string;
  type: number;
  icon: string | null;
  route: string | null;
  badge: string | null;
  parentId: string | null;
  sortOrder: number;
  userMenus: CurrentUserMenuResponse[];
}

export interface UserAvailableWorkDeskResponse {
  id: string;
  type: number;
  title: string;
  description: string | null;
  tenantName: string | null;
  centerName: string | null;
}

// --- Service ---

const BASE = '/api/Access/v1/WorkSpace';

export const workspaceService = {
  addDesk: (data: AddDeskRequest) =>
    apiPost<string>(`${BASE}/AddDesk`, data),

  swapDesk: (data: SwapDeskRequest) =>
    apiPut<void>(`${BASE}/SwapDesk`, data),

  updateDesk: (data: UpdateDeskRequest) =>
    apiPut<void>(`${BASE}/UpdateDesk`, data),

  toggleLayout: () =>
    apiPut<void>(`${BASE}/ToggleLayout`),

  deleteDesk: (data: DeleteDeskRequest) =>
    apiDelete<void>(`${BASE}/DeleteDesk`, data),

  getMyDesks: (data?: GetMyDesksRequest) =>
    apiGet<WorkDeskResponse[]>(`${BASE}/GetMyDesks`, data),

  getDesk: (data: GetDeskRequest) =>
    apiGet<WorkDeskItemResponse>(`${BASE}/GetDesk`, data),

  getMyWorkSpace: (data?: GetMyWorkSpaceRequest) =>
    apiGet<UserWorkSpaceResponse>(`${BASE}/GetMyWorkSpace`, data),

  getMyMenus: (data?: GetMyMenusRequest) =>
    apiGet<CurrentUserMenuResponse[]>('/api/Access/v1/Workspace/GetMyMenus', data),

  getMyAvailableWorkDesk: (data?: GetMyAvailableWorkDeskRequest) =>
    apiGet<UserAvailableWorkDeskResponse[]>(`${BASE}/GetMyAvailableWorkDesk`, data),
};
