import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { ACCESS_TOKEN } from 'constants/common';

let isAlreadyFetchingAccessToken = false;
let refreshToken: Promise<boolean>;

const axiosInstance: AxiosInstance = axios.create({
  headers: {
    Accept: 'applications/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Do something before request is sent
    const token = localStorage.getItem(ACCESS_TOKEN) || null;
    if (token && config.headers) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error: AxiosError) => {
    // Do something with request error
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    throw error;
  },
);

export const callAPI = (
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  body: object,
  config: object = {},
  baseURL: string | undefined = process.env.REACT_APP_API,
) => {
  axiosInstance.defaults.baseURL = baseURL;

  let res = null;
  switch (method) {
    case 'get':
      // in case GET method: body is config
      res = axiosInstance[method](path, body || config);
      break;
    default:
      res = axiosInstance[method](path, body, config);
  }

  return res
    .then((resp: any) => {
      isAlreadyFetchingAccessToken = false;
      return resp;
    })
    .catch(async (error: any) => {
      if (!error.config?.skipErrorHandle) {
        switch (error.response?.status) {
          case 400: // Wrong url or params
            break;
          case 500: // Server error
            // Show toastr if error code global, likes: 500 Unknow Error
            // Other: handled in vue component catch
            break;
          case 403: // Permission
            break;
          case 401: // Signature verification failed | Token has been revoked
            // check url # refresh token
            // true: try to refresh access token. then call queue apis
            // else: logout

            if (path !== 'refresh') {
              if (!isAlreadyFetchingAccessToken) {
                isAlreadyFetchingAccessToken = true;
                refreshToken = new Promise(async (resolve: any) => {
                  // dispatch action call refresh token
                  resolve(true);
                });
              }
              await refreshToken;
              callAPI(method, path, body, config);
              return;
            } else {
              // handle logut
              localStorage.clear();
              // redirect to login page
              throw error.response.data;
            }
          default:
            throw error.response.data;
        }
      }
      throw error.response.data;
    });
};
