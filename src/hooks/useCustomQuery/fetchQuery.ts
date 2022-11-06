import fetchAPI from 'utils/fetch-api';

interface ParamsProps {
  service: string;
  api_url?: string | undefined;
  skipError?: boolean;
  payload?: any;
}

interface ItemProps extends ParamsProps {
  uid: number;
}

interface ListProps<T> extends ParamsProps {
  payload: T;
}

interface AddProps<T> extends ParamsProps {
  body: T;
}

interface UpdateProps<T> extends ParamsProps {
  uid: number;
  body: T;
}

interface DeleteProps extends ParamsProps {
  uid: any;
}

const fetchItem = <T>({
  uid,
  payload,
  service,
  api_url,
}: ItemProps): Promise<T> =>
  fetchAPI(
    {
      url: `${service}/${uid}`,
      payload,
    },
    undefined,
    api_url,
  );

const fetchList = <X, Y>({
  payload,
  service,
  api_url,
}: ListProps<X>): Promise<Y> => {
  return fetchAPI(
    {
      url: `${service}`,
      payload,
    },
    undefined,
    api_url,
  );
};

const addItem = <X, Y>({
  body,
  service,
  api_url,
  skipError = false,
}: AddProps<X>): Promise<Y> =>
  fetchAPI(
    {
      url: `${service}`,
      options: {
        method: 'POST',
        body: JSON.stringify(body),
        skipError,
      },
    },
    undefined,
    api_url,
  );

const updateItem = <X, Y>({
  uid,
  body,
  service,
  api_url,
  skipError = false,
}: UpdateProps<X>): Promise<Y> =>
  fetchAPI(
    {
      url: `${service}/${uid}`,
      options: {
        method: 'PUT',
        body: JSON.stringify(body),
        skipError,
      },
    },
    undefined,
    api_url,
  );

const deleteItem = <T>({
  uid,
  service,
  api_url,
  skipError = false,
}: DeleteProps): Promise<T> => {
  return fetchAPI(
    {
      url: `${service}/${uid}`,
      options: {
        method: 'DELETE',
        skipError,
      },
    },
    undefined,
    api_url,
  );
};

export { addItem, deleteItem, fetchItem, fetchList, updateItem };
