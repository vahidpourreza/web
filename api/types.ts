export type ApiResponse<T> =
  | { ok: true; data: T; status: number; messages: string; allMessages: string[] }
  | { ok: false; data: null; status: number; messages: string; allMessages: string[] };

export interface PagedData<T> {
  queryResult: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface PageQuery {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortAscending?: boolean;
  needTotalCount?: boolean;
}
