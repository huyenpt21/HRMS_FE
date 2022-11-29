// import { pathNameLocalStorage } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import MainLayout from 'layouts/MainLayout';
import DepartmentList from 'pages/department/departmentList';
import DeviceTypeList from 'pages/device/deviceType/deviceTypeList';
import AllEmployeeList from 'pages/employees/allEmployee';
import SubordinateList from 'pages/employees/subordinate';
import ForbiddenPage from 'pages/forbidden';
import HomePage from 'pages/homePage';
import MyLeaveBudget from 'pages/leave/myLeaveBudget';
import SubordinateLeaveBudget from 'pages/leave/allLeaveBudget';
import NotFound from 'pages/notFound';
import AllRequestList from 'pages/requests/allRequest';
import MyRequestList from 'pages/requests/myRequest';
import SubordinateRequestList from 'pages/requests/subordinateRequest';
import AllTimeCheck from 'pages/timeCheck/allTimeCheck';
import MyTimeCheck from 'pages/timeCheck/myTimeCheck';
import SubordinateTimeCheck from 'pages/timeCheck/subordinateTimeCheck';
import TimeCheckDetail from 'pages/timeCheck/timeCheckDetail';

import { useRoutes } from 'react-router-dom';
import UserProfile from 'pages/userProfile';
import BorrowDeviceRequest from 'pages/requests/borrowDeviceRequest';
import PayslipDetail from 'pages/payslip';
import SettingSecurityCode from 'pages/payslip/settingSecurityCode';
import AllDiviceList from 'pages/device/device/allDeviceList';
import AllBorrowDeviceHistory from 'pages/device/allBorrowDeviceHistory';
import MyBorrowDeviceHistory from 'pages/device/myDeviceHistory';
import OfficeTime from 'pages/officeTime';

export default function RouterElement() {
  let element = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'emp-self-service',
          children: [
            { path: 'request', element: <MyRequestList /> },
            { path: 'time-attendance', element: <MyTimeCheck /> },
            { path: 'benefit-budget', element: <MyLeaveBudget /> },
            { path: 'payslip', element: <PayslipDetail /> },
            { path: 'device-history', element: <MyBorrowDeviceHistory /> },
          ],
        },
        {
          path: 'human-resource',
          children: [
            {
              path: 'subordinates',
              element: <SubordinateList />,
            },
            {
              path: 'all-employees',
              element: <AllEmployeeList />,
            },
            {
              path: 'all-benefits',
              element: <SubordinateLeaveBudget menuType={MENU_TYPE.ALL} />,
            },
            {
              path: 'subordinate-benefits',
              element: (
                <SubordinateLeaveBudget menuType={MENU_TYPE.SUBORDINATE} />
              ),
            },
            {
              path: 'borrow-device-history',
              element: <AllBorrowDeviceHistory menuType={MENU_TYPE.ALL} />,
            },
            {
              path: 'sub-borrow-device-history',
              element: (
                <AllBorrowDeviceHistory menuType={MENU_TYPE.SUBORDINATE} />
              ),
            },
          ],
        },
        {
          path: 'request-center',
          children: [
            {
              path: 'my-request',
              element: <MyRequestList />,
            },
            {
              path: 'subordinate',
              element: <SubordinateRequestList />,
            },
            {
              path: 'all',
              element: <AllRequestList />,
            },
            {
              path: 'borrow-device',
              element: <BorrowDeviceRequest />,
            },
          ],
        },
        {
          path: 'time-attendance',
          children: [
            {
              path: 'all',
              children: [
                { path: '', element: <AllTimeCheck /> },
                {
                  path: 'detail/:personId',
                  element: <TimeCheckDetail />,
                },
              ],
            },
            {
              path: 'subordinate',
              children: [
                { path: '', element: <SubordinateTimeCheck /> },
                {
                  path: 'detail/:personId',
                  element: <TimeCheckDetail />,
                },
              ],
            },
          ],
        },
        {
          path: 'device',
          children: [
            { path: 'device-type', element: <DeviceTypeList /> },
            { path: 'device-management', element: <AllDiviceList /> },
          ],
        },
        {
          path: 'system-company',
          children: [
            { path: 'department', element: <DepartmentList /> },
            { path: 'office-time', element: <OfficeTime /> },
          ],
        },
        {
          path: 'profile',
          element: <UserProfile />,
        },
        {
          path: 'setting/security-code',
          element: <SettingSecurityCode />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
    {
      path: '403',
      element: <ForbiddenPage />,
    },
  ]);

  return element;
}
