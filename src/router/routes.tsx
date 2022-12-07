// import { pathNameLocalStorage } from 'constants/common';
import { MENU_TYPE } from 'constants/enums/common';
import MainLayout from 'layouts/MainLayout';
import DepartmentList from 'pages/department/departmentList';
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
import PayslipDetail from 'pages/payslip';
import MyBorrowDeviceHistory from 'pages/device/deviceHistory/myDeviceHistory';
import DetailDeviceRequest from 'pages/device/deviceRequest/detailDeviceRequest';
import AllBorrowDeviceHistory from 'pages/device/deviceHistory/allBorrowDeviceHistory';
import BorrowDeviceRequest from 'pages/device/deviceRequest/borrowDeviceRequest';
import DeviceTypeList from 'pages/device/deviceTypeManagemenrt/deviceTypeList';
import AllDiviceList from 'pages/device/deviceManagement/allDeviceList';
import OfficeTime from 'pages/officeTime';
import UpdateSecurityCode from 'pages/payslip/updateSecurityCode';
import CreateSecurityCode from 'pages/payslip/createSecureCode';
import DetailPageRequestForNoti from 'pages/requests/detailPageRequestNoti';
import Login from '../pages/login';
import PrivateRoute from './PrivateRoute';
import LoginRedirect from 'pages/login/loginRedirect';
import SignatureProfileList from 'pages/signatureProfile';

export default function RouterElement() {
  let element = useRoutes([
    {
      path: '/',
      element: (
        <PrivateRoute>
          {/* <PermissionRoute> */}
          <MainLayout />
          {/* </PermissionRoute> */}
        </PrivateRoute>
      ),
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'emp-self-service',
          children: [
            {
              path: 'request',
              children: [
                { path: '', element: <MyRequestList /> },
                {
                  path: 'detail/:requestId',
                  element: <DetailPageRequestForNoti />,
                },
              ],
            },
            { path: 'time-check', element: <MyTimeCheck /> },
            { path: 'benefit-budget', element: <MyLeaveBudget /> },
            { path: 'payslip', element: <PayslipDetail /> },
            {
              path: 'device-history',
              children: [
                {
                  path: '',
                  element: <MyBorrowDeviceHistory />,
                },
                {
                  path: 'detail/:assignDeviceId',
                  element: <DetailDeviceRequest />,
                },
              ],
            },
          ],
        },
        {
          path: 'human-resource',
          children: [
            {
              path: 'signature-profile',
              element: <SignatureProfileList />,
            },
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

              children: [
                {
                  path: '',
                  element: <AllBorrowDeviceHistory menuType={MENU_TYPE.ALL} />,
                },
                {
                  path: 'detail/:assignDeviceId',
                  element: <DetailDeviceRequest />,
                },
              ],
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
              children: [
                { path: '', element: <SubordinateRequestList /> },
                {
                  path: 'detail/:requestId',
                  element: <DetailPageRequestForNoti />,
                },
              ],
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
          path: 'setting',
          children: [
            {
              path: 'security-code',
              children: [
                {
                  path: 'update',
                  element: <UpdateSecurityCode />,
                },
                {
                  path: 'create',
                  element: <CreateSecurityCode />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
    {
      path: '',
      children: [
        { path: '', element: <Login /> },
        { path: 'oauth2/google', element: <LoginRedirect /> },
      ],
    },
    {
      path: '403',
      element: <ForbiddenPage />,
    },
  ]);

  return element;
}
