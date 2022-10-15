import { MenuOptionsType, RadioButtonType, SelectBoxType } from 'models/common';
import { COMMON_STATUS } from './common';
import { GENDER_KEY, MENU_OPTION_KEY } from './enums/common';

export const URL_PATH = {
  employeeList: '/employee/all/list',
  subordinateList: 'subordinate/list',
  myRequestList: 'request/my-request/list',
  subordinateRequestList: 'request/subordinate/list',
};

export const RANKING_LIST: SelectBoxType[] = [
  {
    label: 'Intern',
    value: 'intern',
  },
  {
    label: 'Junior',
    value: 'junior',
  },
  {
    label: 'Middle',
    value: 'middle',
  },
  {
    label: 'Senior',
    value: 'senior',
  },
  {
    label: 'Expert',
    value: 'expert',
  },
];

export const POSITION_WORKING: SelectBoxType[] = [
  {
    label: 'HR',
    value: 'hr',
  },
  {
    label: 'Maketing',
    value: 'maketing',
  },
  {
    label: 'Web - Frontend',
    value: 'web-frontend',
  },
  {
    label: 'Web  - Backend',
    value: 'web-backend',
  },
  {
    label: 'Mobile - EOS',
    value: 'mobile-eos',
  },
  {
    label: 'Mobile - Android',
    value: 'mobile-android',
  },
];

export const MENU_COMMON: MenuOptionsType[] = [
  {
    key: MENU_OPTION_KEY.EDIT,
    label: 'Edit',
  },
];

export const GENDER_LIST: SelectBoxType[] = [
  {
    value: GENDER_KEY.FEMALE,
    label: 'Female',
  },
  {
    value: GENDER_KEY.MALE,
    label: 'Male',
  },
  {
    value: GENDER_KEY.OTHER,
    label: 'Other',
  },
];

export const STATUS_RADIO_LIST: RadioButtonType[] = [
  {
    value: COMMON_STATUS.TRUE,
    label: 'Active',
  },
  {
    value: COMMON_STATUS.FALSE,
    label: 'Inactive',
  },
];

export const REQUEST_TYPE_LIST: SelectBoxType[] = [
  {
    label: 'Request Type 1',
    value: 'type1',
  },
  {
    label: 'Request Type 2',
    value: 'type2',
  },
  {
    label: 'Request Type 3',
    value: 'type3',
  },
];
