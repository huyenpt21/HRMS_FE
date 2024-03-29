import { TeamOutlined } from '@ant-design/icons';
import { MenuItemType } from 'models/menu';

export const personalUrl: string[] = [
  '/setting/security-code/create',
  '/setting/security-code/update',
  '/profile',
];
export const menuEmployee: MenuItemType[] = [
  {
    title: 'Home Page',
    key: 'home',
    icon: 'home',
    path: '/',
  },
  {
    title: 'Employee Self-service',
    key: 'emp-self-service',
    icon: 'function',
    children: [
      {
        title: 'My Request',
        key: 'my-request',
        path: '/emp-self-service/request',
      },
      {
        title: 'My Time Check',
        key: 'my-time-check',
        path: '/emp-self-service/time-check',
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
];

export const menuSubEmployee: MenuItemType[] = [
  {
    title: 'System & Company',
    key: 'system-company',
    icon: 'organization-chart',
    children: [
      {
        title: 'Office time management',
        key: 'office-time-management',
        path: 'system-company/office-time',
      },
    ],
  },
];

export const menuManager: MenuItemType[] = [
  {
    title: 'Human Resource',
    key: 'human-resource',
    icon: <TeamOutlined style={{ fontSize: '22px' }} />,
    children: [
      {
        title: 'Subordinate',
        key: 'mySubordinate',
        path: '/human-resource/subordinates',
      },
      {
        // eslint-disable-next-line quotes
        title: "Subordinate's Benefit Budget",
        key: 'subordinate-benefit',
        path: '/human-resource/subordinate-benefits',
      },
      {
        // eslint-disable-next-line quotes
        title: "Subordinate's Device History",
        key: 'sub-borrow-device-history',
        path: '/human-resource/sub-borrow-device-history',
      },
    ],
  },
  {
    title: 'Request Center',
    key: 'request-center',
    icon: 'delivery',
    children: [
      {
        title: 'Subordinate Requests',
        key: 'subordinate-requests',
        path: '/request-center/subordinate',
      },
    ],
  },
  {
    title: 'Time Check',
    key: 'time-check',
    icon: 'calendar-search',
    children: [
      {
        title: 'Subordinate Time Check',
        key: 'sub-time-check',
        path: '/time-check/subordinate',
      },
    ],
  },
];
export const menuHR: MenuItemType[] = [
  {
    title: 'Human Resource',
    key: 'human-resource',
    icon: <TeamOutlined style={{ fontSize: '22px' }} />,
    children: [
      {
        title: 'Signature Profile',
        key: 'signature-profile',
        path: '/human-resource/signature-profile',
      },
      {
        title: 'All Employee',
        key: 'all-employee',
        path: '/human-resource/all-employees',
      },
      {
        // eslint-disable-next-line quotes
        title: "All Employee's Benefit Budget",
        key: 'all-benefit',
        path: '/human-resource/all-benefits',
      },
      {
        title: 'All Employee Device History',
        key: 'all-borrow-device-history',
        path: '/human-resource/borrow-device-history',
      },
    ],
  },
  {
    title: 'Request Center',
    key: 'request-center',
    icon: 'delivery',
    children: [
      {
        title: 'All Employee Requests',
        key: 'all-employee-requests',
        path: '/request-center/all',
      },
    ],
  },
  {
    title: 'Time Check',
    key: 'time-check',
    icon: 'calendar-search',
    children: [
      {
        title: 'All Employee Time Check',
        key: 'all-employee-time-check',
        path: '/time-check/all',
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

export const menuItSupport: MenuItemType[] = [
  {
    title: 'Human Resource',
    key: 'human-resource',
    icon: <TeamOutlined style={{ fontSize: '22px' }} />,
    children: [
      {
        title: 'All Employee Device History',
        key: 'all-borrow-device-history',
        path: '/human-resource/borrow-device-history',
      },
    ],
  },
  {
    title: 'Request Center',
    key: 'request-center',
    icon: 'delivery',
    children: [
      {
        title: 'Borrow Device Request',
        key: 'borrow-device-requests',
        path: '/request-center/borrow-device',
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
];

export const menuHrManager: MenuItemType[] = [
  {
    title: 'Human Resource',
    key: 'human-resource',
    icon: <TeamOutlined style={{ fontSize: '22px' }} />,
    children: [
      {
        title: 'Signature Profile',
        key: 'signature-profile',
        path: '/human-resource/signature-profile',
      },
      {
        title: 'All Employee',
        key: 'all-employee',
        path: '/human-resource/all-employees',
      },
      {
        title: 'Subordinate',
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
        // eslint-disable-next-line quotes
        title: "Subordinate's Device History",
        key: 'sub-borrow-device-history',
        path: '/human-resource/sub-borrow-device-history',
      },
    ],
  },
  {
    title: 'Request Center',
    key: 'request-center',
    icon: 'delivery',
    children: [
      {
        title: 'Subordinate Requests',
        key: 'subordinate-requests',
        path: '/request-center/subordinate',
      },
      {
        title: 'All Employee Requests',
        key: 'all-employee-requests',
        path: '/request-center/all',
      },
    ],
  },
  {
    title: 'Time Check',
    key: 'time-check',
    icon: 'calendar-search',
    children: [
      {
        title: 'Subordinate Time Check',
        key: 'sub-time-check',
        path: '/time-check/subordinate',
      },
      {
        title: 'All Employee Time Check',
        key: 'all-employee-time-check',
        path: '/time-check/all',
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

export const menuItSupportManager: MenuItemType[] = [
  {
    title: 'Human Resource',
    key: 'human-resource',
    icon: <TeamOutlined style={{ fontSize: '22px' }} />,
    children: [
      {
        title: 'Subordinate',
        key: 'mySubordinate',
        path: '/human-resource/subordinates',
      },
      {
        // eslint-disable-next-line quotes
        title: "Subordinate's Benefit Budget",
        key: 'subordinate-benefit',
        path: '/human-resource/subordinate-benefits',
      },
      {
        title: 'All Employee Device History',
        key: 'all-borrow-device-history',
        path: '/human-resource/borrow-device-history',
      },
      {
        // eslint-disable-next-line quotes
        title: "Subordinate's Device History",
        key: 'sub-borrow-device-history',
        path: '/human-resource/sub-borrow-device-history',
      },
    ],
  },
  {
    title: 'Request Center',
    key: 'request-center',
    icon: 'delivery',
    children: [
      {
        title: 'Subordinate Requests',
        key: 'subordinate-requests',
        path: '/request-center/subordinate',
      },
      {
        title: 'Borrow Device Request',
        key: 'borrow-device-requests',
        path: '/request-center/borrow-device',
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
    title: 'Time Check',
    key: 'time-check',
    icon: 'calendar-search',
    children: [
      {
        title: 'Subordinate Time Check',
        key: 'sub-time-check',
        path: '/time-check/subordinate',
      },
    ],
  },
];

export const menus: MenuItemType[] = [
  {
    title: 'Home Page',
    key: 'home',
    icon: 'home',
    path: '/',
  },
  {
    title: 'Employee Self-service',
    key: 'emp-self-service',
    icon: 'function',
    children: [
      {
        title: 'My Request',
        key: 'my-request',
        path: '/emp-self-service/request',
      },
      {
        title: 'My Time Check',
        key: 'my-time-check',
        path: '/emp-self-service/time-check',
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
        title: 'Signature Profile',
        key: 'signature-profile',
        path: '/human-resource/signature-profile',
      },
      {
        title: 'All Employee',
        key: 'all-employee',
        path: '/human-resource/all-employees',
      },
      {
        title: 'Subordinate',
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
        title: 'All Employee Device History',
        key: 'all-borrow-device-history',
        path: '/human-resource/borrow-device-history',
      },
      {
        // eslint-disable-next-line quotes
        title: "Subordinate's Device History",
        key: 'sub-borrow-device-history',
        path: '/human-resource/sub-borrow-device-history',
      },
    ],
  },
  {
    title: 'Request Center',
    key: 'request-center',
    icon: 'delivery',
    children: [
      {
        title: 'Subordinate Requests',
        key: 'subordinate-requests',
        path: '/request-center/subordinate',
      },
      {
        title: 'All Employee Requests',
        key: 'all-employee-requests',
        path: '/request-center/all',
      },
      {
        title: 'Borrow Device Request',
        key: 'borrow-device-requests',
        path: '/request-center/borrow-device',
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
    title: 'Time Check',
    key: 'time-check',
    icon: 'calendar-search',
    children: [
      {
        title: 'Subordinate Time Check',
        key: 'sub-time-check',
        path: '/time-check/subordinate',
      },
      {
        title: 'All Employee Time Check',
        key: 'all-employee-time-check',
        path: '/time-check/all',
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
