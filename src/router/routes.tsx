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
          path: 'employee',
          children: [
            {
              path: 'subordinate',
              element: <SubordinateList />,
            },
            {
              path: 'all',
              element: <AllEmployeeList />,
            },
          ],
        },
        {
          path: 'request',
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
          path: 'time-check',
          children: [
            {
              path: 'my-time-check',
              element: <MyTimeCheck />,
            },
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
          children: [{ path: 'device-type', element: <DeviceTypeList /> }],
        },
        {
          path: 'department',
          element: <DepartmentList />,
        },
        {
          path: 'leave-budget',
          children: [
            {
              path: 'subordinate',
              element: (
                <SubordinateLeaveBudget menuType={MENU_TYPE.SUBORDINATE} />
              ),
            },
            {
              path: 'all',
              element: <SubordinateLeaveBudget menuType={MENU_TYPE.ALL} />,
            },
            { path: 'my-leave-budget', element: <MyLeaveBudget /> },
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
        {
          path: 'payslip',
          element: <PayslipDetail />,
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
