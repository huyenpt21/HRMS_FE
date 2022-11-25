import { EMPLOYEE_LIST_ALL, USER_INFO } from 'constants/services';
import initialCustomQuery, {
  Feature,
  MutationProps,
  successHandler,
} from 'hooks/useCustomQuery';
import {
  EmployeeListFields,
  EmployeeListQuery,
  EmployeeModel,
  ResEmployeeDetail,
  ResEmployeeList,
  ResEmployeeModify,
} from 'models/employee';
import { useMutation, useQuery } from 'react-query';
import fetchApi from 'utils/fetch-api';

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

export const useGetUserInfor = () =>
  useQuery(['user-infor'], () =>
    fetchApi(
      {
        url: USER_INFO.service,
      },
      undefined,
    ),
  );

export const useUpdateUserInfor = ({
  onError,
  onSuccess,
}: MutationProps<ResEmployeeModify>) => {
  return useMutation(
    (body: EmployeeModel) =>
      fetchApi(
        {
          url: USER_INFO.service,
          options: {
            method: 'PUT',
            body: JSON.stringify(body),
          },
        },
        undefined,
      ),
    {
      onError: (error: any) => onError?.(error),
      onSuccess: successHandler(onSuccess),
    },
  );
};
