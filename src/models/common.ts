export interface Resource {
  uid: string;
}

export interface Pagination {
  records: number;
  totalRecords: number;
  limit: number;
  page: number;
}

export interface Metadata {
  code: string;
  message: string;
  skipError?: boolean;
}

export interface ResponseData<T, P> {
  metadata: P extends object ? Metadata & { pagination: P } : Metadata;
  data: T;
  errors?: object;
}

export interface QueryParams<T extends string> {
  page?: number | undefined;
  limit?: number | undefined;
  sort?: T | string;
  dir?: 'asc' | 'desc' | string;
}

export interface DisableTime {
  disabledHours: () => number[];
  disabledMinutes: () => number[];
}
