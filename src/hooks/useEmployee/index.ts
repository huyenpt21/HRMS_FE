import { EMPLOYEE_LIST_ALL } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import {
  EmployeeListFields,
  EmployeeModel,
  EmployeeListQuery,
  ResEmployeeDetail,
  ResEmployeeList,
  ResEmployeeModify,
} from 'models/employee';

class EmployeeList implements Feature<EmployeeListFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const EmployeeListInstance = new EmployeeList(
  EMPLOYEE_LIST_ALL.service,
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
  EmployeeModel,
  ResEmployeeList,
  ResEmployeeDetail,
  ResEmployeeModify,
  EmployeeListQuery
>(EmployeeListInstance);