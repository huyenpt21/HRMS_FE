import { EMPLOYEE, USER_INFO } from 'constants/services';
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
  `${EMPLOYEE.model.hr}/${EMPLOYEE.service}`,
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

export const useGetuserInfo = (token: string) =>
  useQuery(
    ['user-infor'],
    () =>
      fetchApi(
        {
          url: USER_INFO.service,
        },
        undefined,
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !!token,
    },
  );

export const useGetUserRoles = (token: string) =>
  useQuery(
    ['user-roles'],
    () =>
      fetchApi(
        {
          url: USER_INFO.model.roles,
        },
        undefined,
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !!token,
    },
  );
export const useGetTotalEmployee = () =>
  useQuery(['total-employees'], () =>
    fetchApi(
      {
        url: `${EMPLOYEE.model.hr}/${EMPLOYEE.service}/${EMPLOYEE.model.total}`,
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
