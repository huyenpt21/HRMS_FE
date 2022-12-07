import axios, { AxiosRequestConfig } from 'axios';
import { ACCESS_TOKEN } from 'constants/common';
import urls from 'constants/url';

const { REACT_APP_API_URL }: any = urls;
export const downloadFile = async (
  url: string,
  nameFileDownload: string,
  param?: any,
) => {
  const token = localStorage.getItem(ACCESS_TOKEN) || null;
  const headers = {
    'Content-Type': 'blob',
    Authorization: `Bearer ${token}`,
  };
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `${REACT_APP_API_URL}${url}`,
    responseType: 'arraybuffer',
    headers,
    params: param,
  };
  const response = await axios(config);

  const outputFilename = nameFileDownload;
  const urlDownload = URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = urlDownload;
  link.setAttribute('download', outputFilename);
  document.body.appendChild(link);
  link.click();
};
