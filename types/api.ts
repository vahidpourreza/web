//todo fix the props

export interface ApiResponse<T> {
  date: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: string;
  pageNumber: number;
  pageSize: number;
  TotalPages: number;
}
