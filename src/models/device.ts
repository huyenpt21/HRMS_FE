import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface DeviceModel extends Resource {
  deviceName?: string;
  deviceCode?: string;
  description?: string;
  isUsed?: number;
  deviceTypeName?: string;
}

export interface DeviceListFilter {
  search?: string;
  isUsed?: number;
  deviceTypeId?: number;
  isReturned?: number;
}

export type DeviceListSortFields = 'deviceTypeName';
export type DeviceListQuery = QueryParams<DeviceListSortFields> &
  DeviceListFilter;

export type ResDeviceList = ResponseData<{ items: DeviceModel[] }, Pagination>;

export type ResDeviceDetail = ResponseData<{ item: DeviceModel }, {}>;

export type ResDeviceModify = ResponseData<{}, {}>;
