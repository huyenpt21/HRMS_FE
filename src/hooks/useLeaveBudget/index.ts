import { LEAVE_BUDGET } from 'constants/services';
import initialCustomQuery, {
  Feature,
  MutationProps,
  successHandler,
} from 'hooks/useCustomQuery';
import {
  LeaveBudgetListQuery,
  LeaveBudgetListSortFields,
  LeaveBudgetModel,
  ResLeaveBudgetDetail,
  ResLeaveBudgetList,
  ResLeaveBudgetModify,
} from 'models/leaveBudget';
import { useMutation } from 'react-query';
import fetchApi from 'utils/fetch-api';

class LeaveBudgetList implements Feature<LeaveBudgetListSortFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const LeaveBudgetListInstance = new LeaveBudgetList(
  LEAVE_BUDGET.service,
  undefined,
  'budget-list',
);
export const {
  useList: useLeaveBudgetList,
  useItem: useLeaveBudgetDetail,
  useAddItemModal: useAddLeaveBudgetModal,
  useUpdateItem: useUpdateLeaveBudget,
  useDeleteItem: useDeleteLeaveBudget,
} = initialCustomQuery<
  LeaveBudgetModel,
  ResLeaveBudgetList,
  ResLeaveBudgetDetail,
  ResLeaveBudgetModify,
  LeaveBudgetListQuery
>(LeaveBudgetListInstance);

export const useDownloadLeaveBudget = ({
  onError,
  onSuccess,
}: MutationProps<ResLeaveBudgetModify>) => {
  return useMutation(
    (payload: LeaveBudgetListQuery) =>
      fetchApi(
        {
          url: `${LEAVE_BUDGET.model.hr}/${LEAVE_BUDGET.service}/${LEAVE_BUDGET.model.export}`,
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
