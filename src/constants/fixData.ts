import { MenuOptionsType, SelectBoxType } from 'models/common';
import { GENDER_KEY, MENU_OPTION_KEY } from './enums/common';

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
  {
    key: MENU_OPTION_KEY.DELETE,
    label: 'Delete',
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
