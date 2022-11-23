import { LEAVE_BUDGET } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import {
  LeaveBudgetListQuery,
  LeaveBudgetListSortFields,
  LeaveBudgetModel,
  ResLeaveBudgetDetail,
  ResLeaveBudgetList,
  ResLeaveBudgetModify,
} from 'models/leaveBudget';

class LeaveBudgetList implements Feature<LeaveBudgetListSortFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const LeaveBudgetListInstance = new LeaveBudgetList(
  `${LEAVE_BUDGET.model.hr}/${LEAVE_BUDGET.service}`,
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
