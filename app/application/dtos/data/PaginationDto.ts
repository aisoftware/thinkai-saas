import { SortedByDto } from "./SortedByDto";

export interface PaginationDto {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  sortedBy?: SortedByDto[];
  query?: string | undefined;
}

export interface PaginationData<T> {
  items: T[];
  pagination: PaginationDto | undefined;
}
