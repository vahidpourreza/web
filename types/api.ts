export interface ApiResponse<T> {
  data: T | null;
  status: number;
  messages: string[];
}
