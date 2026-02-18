export interface ApiResponse<T> {
  ok: boolean;
  data: T | null;
  status: number;
  allMessages: string[];
  messages: string;
}
