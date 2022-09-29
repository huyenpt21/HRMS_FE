import { notification } from 'antd';
import { LOCALE } from 'constants/common';
import urls from 'constants/url';
import queryString from 'query-string';

interface Property {
  url: string;
  options?: any;
  payload?: any;
}

const { REACT_APP_API_URL }: any = urls;

const getURI = (api_url: string, url: string, opts: any, payload: any) => {
  let uri = api_url + url;
  if (opts && opts.method === 'GET') {
    uri = queryString.stringifyUrl({ url: uri, query: payload });
  }
  return uri;
};

const getPayload = (opts: any, payload: any) => {
  if (payload && Object.keys(payload).length > 0) {
    if (opts && opts.method === 'GET') {
      if (payload.filter) {
        payload.filter = JSON.stringify(payload.filter);
      }
    }
  }
};

const fetchApi = async (
  { url, options, payload = {} }: Property,
  cb?: (...f: any) => void,
  api_url: string = REACT_APP_API_URL,
) => {
  try {
    const defaultOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const opts: any = Object.assign(defaultOptions, options);

    // set token
    const oidcAuth = localStorage.getItem(
      `oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`,
    );
    if (oidcAuth) {
      const oidcStorage = JSON.parse(oidcAuth);
      opts.headers.Authorization = `Bearer ${oidcStorage.access_token}`;
    }

    // set language
    const locale =
      localStorage.getItem(LOCALE) || process.env.REACT_APP_LANGUAGE_DEFAULT;

    if (locale) {
      opts.headers['Content-Language'] = locale;
    }

    const uri = getURI(api_url, url, opts, payload);
    getPayload(opts, payload);

    const response = await fetch(uri, opts);

    if (
      response.ok &&
      (response.status === 204 || response.statusText === 'No Content')
    ) {
      if (cb) {
        cb(null);
      }
      return {};
    }

    const data = (await response.json()) || {};
    if (![200, 201].includes(response.status)) {
      throw data;
    }

    if (cb) {
      cb(null, data);
    }

    if (options?.skipError) {
      return {
        ...data,
        metadata: { ...data.metadata, skipError: options.skipError },
      };
    }
    return data;
  } catch (err: any) {
    // !options?.skipError &&
    //   notification.error({
    //     message: 'Oops!',
    //     description: err.metadata?.message,
    //   });
    if (err.metadata.code === 401) {
      localStorage.clear();
      notification.error({
        message: 'Error!',
        description: err.metadata?.message,
        maxCount: 1,
      });
      window.location.reload();
    }

    if (cb) cb(err);

    throw err;
  }
};

export default fetchApi;
