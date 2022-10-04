import { TablePaginationConfig } from 'antd';
import i18n from 'i18n';

const { t } = i18n;

export const ACCESS_TOKEN = 'at';

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export const paginationConfig: TablePaginationConfig = {
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: false,
};

export const RecordStatus = {
  ACTIVE: true,
  INACTIVE: false,
};

export const DATE_DISPLAY = 'DD/MM/YYYY';
export const DATE_REQUEST = 'YYYY-MM-DD';
export const DATE_DMY = 'DD-MM-YYYY';
export const DATE_SYSTEM = 'MM-DD-YYYY';
export const TIME_HOUR = 'HH:mm';
export const TIME_DAY = 'DD-MM';
export const TIME_MONTH = 'YYYY-MM';
export const DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
export const YEAR = 'YYYY';
export const MONTH_YEAR = 'MMM-YYYY';
export const YEAR_MONTH_NUM = 'YYYY-MM';

export const DEFAULT_SIZE_ICON = 24;

export interface SELECT_TYPE {
  value: any;
  label: string;
}

export const validateMessages = () => ({
  required: '${label}' + ` ${t('isRequired')}`,
  types: {
    email: '${label}' + ` ${t('isNotAValidEmail')}`,
    number: '${label}' + ` ${t('isNotAValidNumber')}`,
  },
  number: {
    range:
      '${label}' +
      ` ${t('mustBeBetween')} ` +
      '${min}' +
      ` ${t('and')} ` +
      '${max}',
  },
});

export const namePath = {
  Dashboard: '/',
};

export const LOCALE = 'locale';

export const Gender = {
  MALE: 'Male',
  FEMALE: 'Female',
  GENDERQUEER: 'Genderqueer',
  NONCONFORMING: 'Non-Conforming',
  PREFERNOTTOSAY: 'Prefer not to say',
  OTHER: 'Other',
  TRANSGENDER: 'Transgender',
};

export const regexNumber = /^[0-9]+$/;

export const regexNumberAndDot = /^[0-9]*\.?[0-9]*$/;

export const regexCharacter = /^[a-zA-Z]+$/;

export const ActionUploadURL =
  'https://www.mocky.io/v2/5cc8019d300000980a055e76';
export const fileTypeExcel = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const acceptFile =
  '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const pathNameLocalStorage = 'current-path';
