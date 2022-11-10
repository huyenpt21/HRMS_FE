import { Pagination, QueryParams, Resource, ResponseData } from 'models/common';
import { notification } from 'antd';
import {
  QueryObserverOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import {
  addItem,
  deleteItem,
  fetchItem,
  fetchList,
  updateItem,
} from 'hooks/useCustomQuery/fetchQuery';

export interface Feature<T> {
  service: string;
  api_url: string | undefined;
  key: string;
  getFilterList?: (old: any, uid: number) => { [key: string]: T[] };
}

export interface MutationProps<T> {
  onError?: (errMsg: any) => void;
  onSuccess: (response: T) => void;
}

export interface MultiProps<T> {
  url: string;
  body: T;
}

export interface UpdateProps<T> {
  uid?: any;
  body: T;
  endPoint?: string;
}

export interface DeleteProps<T> {
  uid: number;
  currentFilter: T;
}

type ResponseDetail = ResponseData<{ [key: string]: Resource }, any>;

type ResponseList = ResponseData<{ [key: string]: Resource[] }, Pagination>;

type ResponseModify = ResponseData<any, any>;

type RequestQuery = QueryParams<string>;

export const successHandler =
  <T extends ResponseModify>(onSuccess: (response: T) => void) =>
  (response: T) => {
    const {
      metadata: { message, skipError, code },
    } = response;
    if (skipError || [200, 201].includes(Number(code))) {
      return onSuccess(response);
    }

    notification.error({
      message: 'Oops!',
      description: message,
    });
  };

const initialCustomQuery = <
  X extends Resource,
  Y extends ResponseList,
  Z extends ResponseDetail,
  W extends ResponseModify,
  T extends RequestQuery,
>(
  feature: Feature<X>,
) => {
  const useItem = (
    uid: any,
    endPoint?: string,
    payload?: any,
    reactQueryOtps?: QueryObserverOptions,
    root_url?: string,
  ) => {
    const defaultOptions = {
      refetchOnWindowFocus: false,
      enabled: !!uid,
    };
    const options = reactQueryOtps
      ? { ...reactQueryOtps, ...defaultOptions }
      : defaultOptions;
    return useQuery<Z>(
      [feature.key, uid, payload],
      () =>
        fetchItem<Z>({
          uid,
          payload,
          service: endPoint ? endPoint : feature.service,
          api_url: root_url ?? feature.api_url,
        }),
      options,
    );
  };

  const useList = (
    payload: T,
    endPoint?: string,
    reactQueryOtps?: QueryObserverOptions,
    root_url?: string,
  ) => {
    const defaultOptions = {
      refetchOnWindowFocus: false,
    };
    const options = reactQueryOtps
      ? { ...reactQueryOtps, ...defaultOptions }
      : defaultOptions;
    return useQuery<Y>(
      [feature.key, payload],
      () =>
        fetchList<T, Y>({
          payload,
          service: endPoint ? endPoint : feature.service,
          api_url: root_url ?? feature.api_url,
        }),
      options,
    );
  };

  const useAddItem = (
    { onError, onSuccess }: MutationProps<W>,
    endPoint?: string,
  ) => {
    const queryClient = useQueryClient();

    return useMutation(
      (body: X) =>
        addItem<X, W>({
          body,
          service: endPoint ? endPoint : feature.service,
          api_url: feature.api_url,
        }),
      {
        onError: (error: any) => onError?.(error),
        onSuccess: successHandler(onSuccess),
        onSettled: () => {
          queryClient.invalidateQueries([feature.key]);
        },
      },
    );
  };

  const useAddItemModal = (
    { onError, onSuccess }: MutationProps<W>,
    endPoint?: string,
  ) => {
    const queryClient = useQueryClient();

    return useMutation(
      (body: X) =>
        addItem<X, W>({
          body,
          service: endPoint ? endPoint : feature.service,
          api_url: feature.api_url,
        }),
      {
        onError: (error: any) => onError?.(error),
        onSuccess: successHandler(onSuccess),
        onSettled: () => {
          queryClient.invalidateQueries([feature.key]);
        },
      },
    );
  };

  const useUpdateItem = (
    { onError, onSuccess }: MutationProps<W>,
    endPoint?: string,
  ) => {
    return useMutation(
      ({ uid, body }: UpdateProps<X>) =>
        updateItem<X, W>({
          uid,
          body,
          service: endPoint ? endPoint : feature.service,
          api_url: feature.api_url,
        }),
      {
        onError: (error: any) => onError?.(error),
        onSuccess: successHandler(onSuccess),
      },
    );
  };

  const useUpdateItemModal = (
    { onError, onSuccess }: MutationProps<W>,
    endPoint?: string,
  ) => {
    const queryClient = useQueryClient();

    return useMutation(
      ({ uid, body }: UpdateProps<X>) =>
        updateItem<X, W>({
          uid,
          body,
          service: endPoint ? endPoint : feature.service,
          api_url: feature.api_url,
        }),
      {
        onError: (error: any) => onError?.(error),
        onSuccess: successHandler(onSuccess),
        onSettled: () => {
          queryClient.invalidateQueries([feature.key]);
        },
      },
    );
  };

  const useDeleteItem = (
    { onError, onSuccess }: MutationProps<W>,
    endPoint?: string,
  ) => {
    const queryClient = useQueryClient();

    return useMutation(
      ({ uid, currentFilter }: DeleteProps<T>) =>
        deleteItem<W>({
          uid,
          service: endPoint ? endPoint : feature.service,
          api_url: feature.api_url,
        }),
      {
        onMutate: async ({ uid, currentFilter }: any) => {
          await queryClient.cancelQueries([feature.key, currentFilter]);

          // const prev = queryClient.getQueryData([
          //   feature.key,
          //   currentFilter,
          // ]) as Y;
          // queryClient.setQueryData(
          //   [feature.key, currentFilter],
          //   (old: Y = prev) => {
          //     return {
          //       ...old,
          //       data: feature.getFilterList(old, uid),
          //     };
          //   },
          // );
          // return prev;
        },
        onError: (
          error: any,
          variables: DeleteProps<T>,
          previousValue: any,
        ) => {
          queryClient.setQueryData(
            [feature.key, variables.currentFilter],
            previousValue,
          );
          onError?.(error);
        },
        onSuccess: successHandler(onSuccess),
        onSettled: (
          _data: W | undefined,
          _error: any,
          variables: DeleteProps<T>,
        ) => {
          queryClient.invalidateQueries([feature.key, variables.currentFilter]);
        },
      },
    );
  };

  return {
    useAddItemModal,
    useUpdateItemModal,
    useAddItem,
    useItem,
    useList,
    useUpdateItem,
    useDeleteItem,
  };
};

export default initialCustomQuery;
