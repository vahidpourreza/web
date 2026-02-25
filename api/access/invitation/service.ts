import { apiGet, apiPost, apiPut } from '@/api/client';

// --- Requests ---

export interface CreateInvitationRequest {
  centerIds: string[];
  accessGroupIds: string[];
  mobileNumber: string;
}

export interface RevokeInvitationRequest {
  id: string;
}

export interface AcceptInvitationRequest {
  invitationCode: string;
}

export interface ResendInvitationRequest {
  id: string;
}

export interface GetInvitationDetailsRequest {
  invitationCode: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllPendingUserInvitationsInTenantRequest {}

// --- Responses ---

export interface UserInvitationDetailsResponse {
  invitationId: string;
  mobile: string;
  tenantName: string;
  centersName: string;
  accessGroupsName: string;
}

export interface PendingUserInvitationInTenantResponse {
  id: string;
  mobile: string;
  expirationDate: string;
  statusType: number;
  statusName: string;
  centersName: string;
  accessGroupsName: string;
}

// --- Service ---

const BASE = '/api/Access/v1/Invitation';

export const invitationService = {
  create: (data: CreateInvitationRequest) =>
    apiPost<string>(`${BASE}/Create`, data),

  revoke: (data: RevokeInvitationRequest) =>
    apiPut<void>(`${BASE}/Revoke`, data),

  accept: (data: AcceptInvitationRequest) =>
    apiPut<void>(`${BASE}/Accept`, data),

  resend: (data: ResendInvitationRequest) =>
    apiPut<void>(`${BASE}/Resend`, data),

  getDetails: (data: GetInvitationDetailsRequest) =>
    apiGet<UserInvitationDetailsResponse>(`${BASE}/GetDetails`, data),

  getAllPendingUserInvitationsInTenant: (data?: GetAllPendingUserInvitationsInTenantRequest) =>
    apiGet<PendingUserInvitationInTenantResponse[]>(`${BASE}/GetAllPendingUserInvitationsInTenant`, data),
};
