import { DEVICE_TYPE } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import {
  DeviceTypeListQuery,
  DeviceTypeListSortFields,
  DeviceTypeModel,
  ResDeviceTypeDetail,
  ResDeviceTypeList,
  ResDeviceTypeModify,
} from 'models/device';

class DeviceTypeList implements Feature<DeviceTypeListSortFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const DeviceTypeListInstance = new DeviceTypeList(
  DEVICE_TYPE.service,
  undefined,
  'department-list',
);

export const {
  useList: useDeviceTypeList,
  useItem: useDeviceTypeDetail,
  useAddItemModal: useAddDeviceTypeModal,
  useUpdateItem: useUpdateDeviceType,
  useDeleteItem: useDeleteDeviceType,
} = initialCustomQuery<
  DeviceTypeModel,
  ResDeviceTypeList,
  ResDeviceTypeDetail,
  ResDeviceTypeModify,
  DeviceTypeListQuery
>(DeviceTypeListInstance);
