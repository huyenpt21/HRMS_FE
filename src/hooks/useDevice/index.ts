import { DEVICE, DEVICE_TYPE } from 'constants/services';
import initialCustomQuery, {
  Feature,
  MutationProps,
  successHandler,
} from 'hooks/useCustomQuery';
import {
  DeviceListQuery,
  DeviceListSortFields,
  DeviceModel,
  ResDeviceDetail,
  ResDeviceList,
  ResDeviceModify,
} from 'models/device';
import { useMutation, useQueryClient } from 'react-query';
import fetchApi from 'utils/fetch-api';

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

export const useReturnDevice = ({
  onError,
  onSuccess,
}: MutationProps<ResDeviceModify>) => {
  const queryClient = useQueryClient();
  return useMutation(
    (id: number) =>
      fetchApi(
        {
          url: `${DEVICE.model.return}/${id}`,
          options: {
            method: 'PUT',
          },
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
      onSettled: () => {
        queryClient.invalidateQueries(['my-borrow-device-history']);
      },
    },
  );
};
