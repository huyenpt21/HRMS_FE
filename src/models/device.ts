import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface DeviceModel extends Resource {
  deviceName?: string;
  deviceCode?: string;
  description?: string;
  isUsed?: number;
  deviceTypeName?: string;
  isReturned?: number;
  borrowDate?: string;
  returnDate?: string;
  isAssigned?: number;
}

export interface DeviceListFilter {
  search?: string;
  isUsed?: number;
  deviceTypeId?: number;
  isReturned?: number;
  approvalDateFrom?: string;
  approvalDateTo?: string;
  isAssigned?: number;
}

export type DeviceListSortFields = 'deviceTypeName';
export type DeviceListQuery = QueryParams<DeviceListSortFields> &
  DeviceListFilter;

export type ResDeviceList = ResponseData<{ items: DeviceModel[] }, Pagination>;

export type ResDeviceDetail = ResponseData<{ item: DeviceModel }, {}>;

export type ResDeviceModify = ResponseData<{}, {}>;
