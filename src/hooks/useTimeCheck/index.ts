import { TIME_CHECK } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import {
  ResTimeCheckDetail,
  ResTimeCheckList,
  ResTimeCheckModify,
  TimeCheckListQuery,
  TimeCheckListSortFields,
  TimeCheckModel,
} from 'models/timeCheck';

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
