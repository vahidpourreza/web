import { apiGet, apiPost, apiPut } from '@/api/client';

// --- Requests ---

export interface GenerateOtpRequest {
  mobileNumber: string;
}

export interface GenerateOtpByInvitationCodeRequest {
  invitationCode: string;
}

export interface VerifyOtpRequest {
  otpRequestId: string;
  inputCode: string;
  inputMobile: string;
}

export interface GetOtpMobileRequest {
  id: string;
}

// --- Responses ---

export interface OtpMobileResponse {
  id: string;
  mobile: string;
}

// --- Service ---

const BASE = '/api/Access/v1/Otp';

export const otpService = {
  generate: (data: GenerateOtpRequest) =>
    apiPost<string>(`${BASE}/Generate`, data),

  generateByInvitationCode: (data: GenerateOtpByInvitationCodeRequest) =>
    apiPost<string>(`${BASE}/GenerateByInvitationCode`, data),

  verify: (data: VerifyOtpRequest) =>
    apiPut<void>(`${BASE}/Verify`, data),

  getOtpMobile: (data: GetOtpMobileRequest) =>
    apiGet<OtpMobileResponse>(`${BASE}/GetOtpMobile`, data),
};
