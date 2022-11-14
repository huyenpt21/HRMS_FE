import { DEPARTMENT } from 'constants/services';
import initialCustomQuery, { Feature } from 'hooks/useCustomQuery';
import {
  DepartmentListQuery,
  DepartmentListSortFields,
  DepartmentModel,
  ResDepartmentDetail,
  ResDepartmentList,
  ResDepartmentModify,
} from 'models/department';

class DepartmentList implements Feature<DepartmentListSortFields> {
  constructor(
    public readonly service: string,
    public readonly api_url: string | undefined,
    public readonly key: string,
  ) {}
}

const DepartmentListInstance = new DepartmentList(
  DEPARTMENT.service,
  undefined,
  'department-list',
);

export const {
  useList: useDepartmentList,
  useItem: useDepartmentDetail,
  useAddItemModal: useAddDepartmentModal,
  useUpdateItem: useUpdateDepartment,
  useDeleteItem: useDeleteDepartment,
} = initialCustomQuery<
  DepartmentModel,
  ResDepartmentList,
  ResDepartmentDetail,
  ResDepartmentModify,
  DepartmentListQuery
>(DepartmentListInstance);
