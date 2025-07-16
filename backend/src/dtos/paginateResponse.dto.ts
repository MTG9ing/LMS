interface PaginationMeta {
  total: number;
  pageNumber: number;
  pageLimit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  sort: "asc" | "desc";
  order: string;
}
export type PaginationExtra = Record<string, any>;

export interface PaginatedResponse<T> {
  success: boolean;
  returnedAt: string;
  data: T[];
  meta: PaginationMeta;
  extras?: PaginationExtra;
}
