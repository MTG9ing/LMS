import {
  PaginatedResponse,
  PaginationExtra,
} from "../../dtos/paginateResponse.dto";

export function buildPaginatedResponse<T>(
  data: T[],
  meta: {
    total: number;
    pageNumber?: number;
    pageLimit?: number;
    sort?: "asc" | "desc";
    order?: string;
  },
  extras?: PaginationExtra
): PaginatedResponse<T> {
  const total = Math.max(0, meta.total);
  const pageNumber = Math.max(1, meta.pageNumber ?? 1);
  const pageLimit = Math.max(1, meta.pageLimit ?? 10);

  const totalPages = Math.ceil(total / pageLimit);
  const hasNextPage = pageNumber < totalPages;
  const hasPreviousPage = pageNumber > 1;

  return {
    success: true,
    returnedAt: new Date().toISOString(),
    data,
    meta: {
      total,
      pageNumber,
      pageLimit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
      order: meta.order ?? "id",
      sort: meta.sort ?? "desc",
    },
    extras,
  };
}
