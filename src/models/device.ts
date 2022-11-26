import { Pagination, QueryParams, Resource, ResponseData } from './common';

export interface DeviceTypeModel extends Resource {
  deviceTypeName?: string;
}

export interface DeviceTypeListFilter {
  search?: string;
}

export type DeviceTypeListSortFields = 'deviceTypeName';
export type DeviceTypeListQuery = QueryParams<DeviceTypeListSortFields> &
  DeviceTypeListFilter;

export type ResDeviceTypeList = ResponseData<
  { items: DeviceTypeModel[] },
  Pagination
>;

export type ResDeviceTypeDetail = ResponseData<{ item: DeviceTypeModel }, {}>;

export type ResDeviceTypeModify = ResponseData<{}, {}>;
