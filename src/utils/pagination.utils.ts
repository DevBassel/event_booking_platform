import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  minLimit: 5,
  maxLimit: 25,
} as const;

export interface PaginationResult<T> {
  data: T[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export async function pagination<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  page: number = PAGINATION_DEFAULTS.page,
  limit: number = PAGINATION_DEFAULTS.limit,
): Promise<PaginationResult<T>> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(
    Math.max(limit, PAGINATION_DEFAULTS.minLimit),

    PAGINATION_DEFAULTS.maxLimit,
  );

  const [data, total] = await query
    .skip((safePage - 1) * safeLimit)
    .take(safeLimit)
    .getManyAndCount();

  return {
    data,
    total,
    pages: Math.ceil(total / safeLimit),
    page: safePage,
    limit: safeLimit,
  };
}
