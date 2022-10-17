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
        path: '/employee/all/list',
      },
      {
        title: 'Subordinate List',
        key: 'mySubordinate',
        path: '/employee/subordinate/list',
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
        path: '/request/my-request/list',
      },
      {
        title: 'Subordinate Request List',
        key: 'subordinateRequestList',
        path: '/request/subordinate/list',
      },
      {
        title: 'All Request List',
        key: 'allRequestList',
        path: '/request/all/list',
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
        path: '/device/my-device/list',
      },
      {
        title: 'My Request History',
        key: 'myDeviceRequest',
        path: '/device/my-request/list',
      },
      {
        title: 'Subodinate Device List',
        key: 'subordinateDeviceList',
        path: '/device/subordinate-device/list',
      },
      {
        title: 'Subodinate Request List',
        key: 'subordinateDeviceRequestList',
        path: '/device/subordinate-request/list',
      },
      {
        title: 'All Request List',
        key: 'allDeviceRequestList',
        path: '/device/all/list',
      },
    ],
  },
  {
    title: 'Time Check',
    key: 'timeCheck',
    icon: 'deadline',
    children: [
      {
        title: 'My Time Check',
        key: 'myTimeCheck',
        path: '/time-check/my-request/list',
      },
      {
        title: 'All Time Check List',
        key: 'allTimeCheckList',
        path: '/time-check/all/list',
      },
    ],
  },
];
