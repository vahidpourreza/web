import { apiGet } from '@/api/client';

// --- Requests ---

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetAllSmsRequest {}

// --- Responses ---

export interface SmsMessagesResponse {
  id: string;
  recipient: string;
  message: string;
  sentAt: string | null;
  status: string;
}

// --- Service ---

const BASE = '/api/Access/v1/Sms';

export const smsService = {
  getAll: (data?: GetAllSmsRequest) =>
    apiGet<SmsMessagesResponse[]>(`${BASE}/GetAll`, data),
};
