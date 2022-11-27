import { DEVICE_TYPE } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import {
  DeviceListQuery,
  DeviceListSortFields,
  DeviceModel,
  ResDeviceDetail,
  ResDeviceList,
  ResDeviceModify,
} from 'models/device';

class DeviceList implements Feature<DeviceListSortFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const DeviceListInstance = new DeviceList(
  DEVICE_TYPE.service,
  undefined,
  'department-list',
);

export const {
  useList: useDeviceList,
  useItem: useDeviceDetail,
  useAddItemModal: useAddDeviceModal,
  useUpdateItem: useUpdateDevice,
  useDeleteItem: useDeleteDevice,
} = initialCustomQuery<
  DeviceModel,
  ResDeviceList,
  ResDeviceDetail,
  ResDeviceModify,
  DeviceListQuery
>(DeviceListInstance);
