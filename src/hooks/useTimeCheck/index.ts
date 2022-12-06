import { TIME_CHECK } from 'constants/services';
import initialCustomQuery, {
  Feature,
  MutationProps,
  successHandler,
} from 'hooks/useCustomQuery';
import {
  ResTimeCheckDetail,
  ResTimeCheckList,
  ResTimeCheckModify,
  TimeCheckListQuery,
  TimeCheckListSortFields,
  TimeCheckModel,
} from 'models/timeCheck';
import { useMutation } from 'react-query';
import fetchApi from 'utils/fetch-api';

class TimeCheckList implements Feature<TimeCheckListSortFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const TimeCheckListInstance = new TimeCheckList(
  TIME_CHECK.service,
  undefined,
  'my-timeCheck-list',
);

export const {
  useList: useTimeCheckList,
  useItem: useTimeCheckDetail,
  useAddItemModal: useAddTimeCheckModal,
  useUpdateItem: useUpdateTimeCheck,
  useDeleteItem: useDeleteTimeCheck,
} = initialCustomQuery<
  TimeCheckModel,
  ResTimeCheckList,
  ResTimeCheckDetail,
  ResTimeCheckModify,
  TimeCheckListQuery
>(TimeCheckListInstance);

export const useDownloadTimeCheck = ({
  onError,
  onSuccess,
}: MutationProps<ResTimeCheckModify>) => {
  return useMutation(
    (payload: TimeCheckListQuery) =>
      fetchApi(
        {
          url: `${TIME_CHECK.model.hr}/${TIME_CHECK.service}/${TIME_CHECK.model.export}`,
          options: {
            method: 'GET',
          },
          payload,
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
    },
  );
};
