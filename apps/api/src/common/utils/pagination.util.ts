import { PaginationMeta, PaginatedResponseDTO } from "@fluxos/contracts";

export function createPaginationMeta(
  totalItems: number,
  page: number = 1,
  limit: number = 10
): PaginationMeta {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.max(1, Number(limit) || 10);
  const totalPages = Math.ceil(totalItems / safeLimit) || 1;

  return {
    page: safePage,
    limit: safeLimit,
    totalItems,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  page: number = 1,
  limit: number = 10
): PaginatedResponseDTO<T> {
  return {
    data,
    meta: createPaginationMeta(totalItems, page, limit),
  };
}
