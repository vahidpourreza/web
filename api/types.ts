export type ApiResponse<T> =
  | { ok: true; data: T; status: number; messages: string; allMessages: string[] }
  | { ok: false; data: null; status: number; messages: string; allMessages: string[] };
