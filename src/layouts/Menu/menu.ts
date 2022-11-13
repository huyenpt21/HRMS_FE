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
    icon: 'user',
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
        title: 'My Request History',
        key: 'myRequest',
        path: '/request/my-request',
      },
      {
        title: 'Subordinate Request List',
        key: 'subordinateRequestList',
        path: '/request/subordinate',
      },
      {
        title: 'All Request List',
        key: 'allRequestList',
        path: '/request/all',
      },
    ],
  },
  {
    title: 'Device',
    key: 'device',
    icon: 'mouse',
    children: [
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
];
