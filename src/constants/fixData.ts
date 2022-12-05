import { MenuOptionsType, SelectBoxType } from 'models/common';
import { COMMON_STATUS } from './common';
import {
  GENDER_KEY,
  MENU_OPTION_KEY,
  REQUEST_TYPE_KEY,
  STATUS,
} from './enums/common';

export const URL_PATH = {
  employeeList: '/employee/all/list',
  subordinateList: 'subordinate/list',
  myRequestList: 'request/my-request/list',
  subordinateRequestList: 'request/subordinate/list',
};

export const RANKING_LIST: SelectBoxType[] = [
  {
    label: 'Intern',
    value: 1,
  },
  {
    label: 'Fresher',
    value: 2,
  },
  {
    label: 'Junior',
    value: 3,
  },
  {
    label: 'Senior',
    value: 4,
  },
];

export const POSITION_WORKING: SelectBoxType[] = [
  {
    label: 'Back-end Developer',
    value: 1,
  },
  {
    label: 'Front-end Developer',
    value: 2,
  },
  {
    label: 'Fullstack Developer',
    value: 3,
  },
  {
    label: 'Mobile Developer',
    value: 9,
  },
  {
    label: 'Tester',
    value: 4,
  },
  {
    label: 'General accountant',
    value: 5,
  },
  {
    label: 'Accounting officer',
    value: 6,
  },
  {
    label: 'HR',
    value: 7,
  },
  {
    label: 'IT Support',
    value: 8,
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

export const COMMON_STATUS_LIST: SelectBoxType[] = [
  {
    value: COMMON_STATUS.ACTIVE,
    label: 'Active',
  },
  {
    value: COMMON_STATUS.INACTIVE,
    label: 'Inactive',
  },
];

export const REQUEST_TYPE_LIST: SelectBoxType[] = [
  {
    label: 'Annual Leave',
    type: REQUEST_TYPE_KEY.LEAVE,
    value: 1,
  },
  {
    label: 'Business Trip',
    type: REQUEST_TYPE_KEY.OTHER,
    value: 2,
  },
  {
    // eslint-disable-next-line quotes
    label: "Children's Sickness",
    type: REQUEST_TYPE_KEY.OTHER,
    value: 3,
  },
  {
    label: 'Forgot Check In/Out',
    type: REQUEST_TYPE_KEY.FORGOT_CHECK_IN_OUT,
    value: 4,
  },
  {
    label: 'Maternity Leave',
    type: REQUEST_TYPE_KEY.LEAVE,
    value: 5,
  },
  {
    label: 'Unpaid Leave',
    type: REQUEST_TYPE_KEY.LEAVE,
    value: 6,
  },
  {
    label: 'Over Time',
    type: REQUEST_TYPE_KEY.OT,
    value: 7,
  },
  {
    label: 'Sick Leave',
    type: REQUEST_TYPE_KEY.LEAVE,
    value: 8,
  },
  {
    label: 'Work from home',
    type: REQUEST_TYPE_KEY.OTHER,
    value: 9,
  },
  {
    label: 'Bereavement Leave',
    type: REQUEST_TYPE_KEY.LEAVE,
    value: 10,
  },
  {
    label: 'Borrow Device',
    type: REQUEST_TYPE_KEY.DEVICE,
    value: 11,
  },
];

export const REQUEST_STATUS_LIST: SelectBoxType[] = [
  {
    label: STATUS.PENDING,
    value: STATUS.PENDING,
  },
  {
    label: STATUS.APPROVED,
    value: STATUS.APPROVED,
  },
  {
    label: STATUS.REJECTED,
    value: STATUS.REJECTED,
  },
];
export const DEVICE_MANAGEMENT_STATUS: SelectBoxType[] = [
  {
    label: 'Using',
    value: COMMON_STATUS.ACTIVE,
  },
  {
    label: 'Available',
    value: COMMON_STATUS.INACTIVE,
  },
];
export const DEVICE_HISTORY_STATUS: SelectBoxType[] = [
  {
    label: 'Returned',
    value: COMMON_STATUS.ACTIVE,
  },
  {
    label: 'Using',
    value: COMMON_STATUS.INACTIVE,
  },
];
