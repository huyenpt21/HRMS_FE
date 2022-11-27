import {
  MoneyCollectOutlined,
  SolutionOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { MenuItemType } from 'models/menu';

export const menus: MenuItemType[] = [
  {
    title: 'Home Page',
    key: 'home',
    icon: 'home',
    path: '/',
  },
  {
    title: 'Employee',
    key: 'employee',
    icon: <TeamOutlined style={{ fontSize: '22px' }} />,
    children: [
      {
        title: 'Employee List',
        key: 'allEmployees',
        path: '/employee/all',
      },
      {
        title: 'Subordinate List',
        key: 'mySubordinate',
        path: '/employee/subordinate',
      },
    ],
  },
  {
    title: 'Request',
    key: 'request',
    icon: 'delivery',
    children: [
      {
        title: 'My Request',
        key: 'myRequest',
        path: '/request/my-request',
      },
      {
        title: 'Subordinate Request',
        key: 'subordinateRequestList',
        path: '/request/subordinate',
      },
      {
        title: 'All Request',
        key: 'allRequestList',
        path: '/request/all',
      },
      {
        title: 'Borrow Device Request',
        key: 'borrowDeviceRequestList',
        path: '/request/borrow-device',
      },
    ],
  },
  {
    title: 'Device',
    key: 'device',
    icon: 'mouse',
    children: [
      {
        title: 'Device Type',
        key: 'deviceType',
        path: '/device/device-type',
      },
      {
        title: 'My Device List',
        key: 'myDeviceList',
        path: '/device/my-device',
      },
      {
        title: 'Subodinate Device List',
        key: 'subordinateDeviceList',
        path: '/device/subordinate-device',
      },
      {
        title: 'All Request List',
        key: 'allDeviceRequestList',
        path: '/device/all',
      },
    ],
  },
  {
    title: 'Time Check',
    key: 'time-check',
    icon: 'deadline',
    children: [
      {
        title: 'My Time Check',
        key: 'myTimeCheck',
        path: '/time-check/my-time-check',
      },
      {
        title: 'Subordinate Time Check',
        key: 'subordinateTimeCheckList',
        path: '/time-check/subordinate',
      },
      {
        title: 'All Time Check List',
        key: 'allTimeCheckList',
        path: '/time-check/all',
      },
    ],
  },
  {
    title: 'Department',
    key: 'department',
    icon: <SolutionOutlined style={{ fontSize: '22px' }} />,
    path: '/department',
  },
  {
    title: 'All Leave Budget',
    key: 'all-leave-budget',
    icon: 'calendar',
    path: '/leave-budget/all',
  },
  {
    title: 'Subordinate Leave Budget',
    key: 'subordinate-leave-budget',
    icon: 'calendar',
    path: '/leave-budget/subordinate',
  },
  {
    title: 'My Leave Budget',
    key: 'my-leave-budget',
    icon: 'calendar',
    path: '/leave-budget/my-leave-budget',
  },
  {
    title: 'Payslip',
    key: 'payslip',
    icon: <MoneyCollectOutlined style={{ fontSize: '23px' }} />,
    path: '/payslip',
  },
];
