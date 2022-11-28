import { TeamOutlined } from '@ant-design/icons';
import { MenuItemType } from 'models/menu';

export const menus: MenuItemType[] = [
  {
    title: 'Home Page',
    key: 'home',
    icon: 'home',
    path: '/',
  },
  {
    title: 'Emplyee Self-service',
    key: 'emp-self-service',
    icon: 'function',
    children: [
      {
        title: 'My Request',
        key: 'request',
        path: '/emp-self-service/request',
      },
      {
        title: 'My Attendence',
        key: 'time-attendance',
        path: '/emp-self-service/time-attendance',
      },
      {
        title: 'My Benefit Budget',
        key: 'benefit-budget',
        path: '/emp-self-service/benefit-budget',
      },
      {
        title: 'My Payslip',
        key: 'payslip',
        path: '/emp-self-service/payslip',
      },
      {
        title: 'My Device History',
        key: 'device-history',
        path: '/emp-self-service/device-history',
      },
    ],
  },
  {
    title: 'Human Resource',
    key: 'human-resource',
    icon: <TeamOutlined style={{ fontSize: '22px' }} />,
    children: [
      {
        title: 'All Employee List',
        key: 'all-employee',
        path: '/human-resource/all-employees',
      },
      {
        title: 'Subordinate List',
        key: 'mySubordinate',
        path: '/human-resource/subordinates',
      },
      {
        // eslint-disable-next-line quotes
        title: "All Employee's Benefit Budget",
        key: 'all-benefit',
        path: '/human-resource/all-benefits',
      },
      {
        // eslint-disable-next-line quotes
        title: "Subordinate's Benefit Budget",
        key: 'subordinate-benefit',
        path: '/human-resource/subordinate-benefits',
      },
      {
        title: 'All Borrow Device History',
        key: 'all-borrow-device-history',
        path: '/human-resource/borrow-device-history',
      },
      {
        // eslint-disable-next-line quotes
        title: "Subordinate's Borrow Device History",
        key: 'sub-borrow-device-history',
        path: '/human-resource/sub-borrow-device-history',
      },
    ],
  },
  {
    title: 'Request Center',
    key: 'request',
    icon: 'delivery',
    children: [
      {
        title: 'Subordinate Requests',
        key: 'subordinate-requests',
        path: '/request/subordinate',
      },
      {
        title: 'All Employee Requests',
        key: 'all-employee-requests',
        path: '/request/all',
      },
      {
        title: 'Borrow Device Request',
        key: 'borrow-device-requests',
        path: '/request/borrow-device',
      },
    ],
  },
  {
    title: 'Device Resource',
    key: 'device',
    icon: 'mouse',
    children: [
      {
        title: 'Device Type Management',
        key: 'device-type',
        path: '/device/device-type',
      },
      {
        title: 'Device Management',
        key: 'device-management',
        path: '/device/device-management',
      },
    ],
  },
  {
    title: 'Time Attendence',
    key: 'time-attendance',
    icon: 'calendar-search',
    children: [
      {
        title: 'Subordinate Attendence',
        key: 'sub-attendance',
        path: '/time-attendance/subordinate',
      },
      {
        title: 'Employee Attendence',
        key: 'employee-attendance',
        path: '/time-attendance/all',
      },
    ],
  },
  {
    title: 'System & Company',
    key: 'system-company',
    icon: 'organization-chart',
    children: [
      {
        title: 'Department management',
        key: 'department-management',
        path: 'system-company/department',
      },
      {
        title: 'Office time management',
        key: 'office-time-management',
        path: 'system-company/office-time',
      },
    ],
  },
];
