import { EMPLOYEE_LIST } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import {
  EmployeeListFields,
  EmployeeListItem,
  EmployeeListQuery,
  ResEmployeeDetail,
  ResEmployeeList,
  ResEmployeeModify,
} from 'models/allEmployee';

class EmployeeList implements Feature<EmployeeListFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const EmployeeListInstance = new EmployeeList(
  EMPLOYEE_LIST.service,
  undefined,
  'employee-list-all',
);

export const {
  useList: useEmployeeList,
  useItem: useEmployeeDetail,
  useAddItemModal: useAddEmployeeModal,
  useUpdateItem: useUpdateEmployee,
  useDeleteItem: useDeleteEmployee,
} = initialCustomQuery<
  EmployeeListItem,
  ResEmployeeList,
  ResEmployeeDetail,
  ResEmployeeModify,
  EmployeeListQuery
>(EmployeeListInstance);
