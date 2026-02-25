import { apiGet, apiPost, apiPut } from '@/api/client';

// --- Requests ---

export interface CreateInvitedUserRequest {
  invitationId: string;
  brokerId: string;
}

export interface CreateTenantAdminRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
  birthDay: string;
  gender: string;
  brokerId: string;
}

export interface CreateTenantStaffRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  password: string;
  birthDay: string;
  gender: string;
  brokerId: string;
}

export interface ForgetPasswordRequest {
  mobile: string;
  brokerId: string;
  newPassword: string;
}

export interface ValidateCredentialsByPasswordRequest {
  mobileNumber: string;
  password: string;
  brokerId: string;
}

// --- Service ---

const BASE = '/api/Access/v1/Registration';

export const registrationService = {
  createInvitedUser: (data: CreateInvitedUserRequest) =>
    apiPost<string>(`${BASE}/CreateInvitedUser`, data),

  createTenantAdmin: (data: CreateTenantAdminRequest) =>
    apiPost<string>(`${BASE}/CreateTenantAdmin`, data),

  createTenantStaff: (data: CreateTenantStaffRequest) =>
    apiPost<string>(`${BASE}/CreateTenantStaff`, data),

  forgetPassword: (data: ForgetPasswordRequest) =>
    apiPut<void>(`${BASE}/ForgetPassword`, data),

  validateCredentialsByPassword: (data: ValidateCredentialsByPasswordRequest) =>
    apiGet<boolean>(`${BASE}/ValidateCredentialsByPassword`, data),
};
