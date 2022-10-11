import { MENU_OPTION_KEY } from 'constants/enums/common';
import { ReactNode } from 'react';

export interface Resource {
  uid: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
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

interface FilterTable {
  text: string;
  value: string;
}

export interface HeaderTableFields {
  key: string;
  title: string;
  dataIndex: string;
  fixed?: string;
  width?: number;
  sorter?: boolean;
  align?: 'left' | 'right' | 'center';
  render?: any;
  code?: string;
  filters?: FilterTable[];
  filterMultiple?: boolean;
  sortOrder?: 'ascend' | 'descend' | false;
}

export interface MenuOptionsType {
  key: MENU_OPTION_KEY;
  label: string | ReactNode;
}

export interface SelectBoxType {
  value: any;
  label: string;
}
export interface RadioButtonType {
  value: any;
  label: string;
}
