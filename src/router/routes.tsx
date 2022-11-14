// import { pathNameLocalStorage } from 'constants/common';
import MainLayout from 'layouts/MainLayout';
import DepartmentList from 'pages/department/departmentList';
import AllEmployeeList from 'pages/employees/allEmployee';
import SubordinateList from 'pages/employees/subordinate';

import ForbiddenPage from 'pages/forbidden';
import HomePage from 'pages/homePage';
import NotFound from 'pages/notFound';
import AllRequestList from 'pages/requests/allRequest';
import MyRequestList from 'pages/requests/myRequest';
import SubordinateRequestList from 'pages/requests/subordinateRequest';
import AllTimeCheck from 'pages/timeCheck/allTimeCheck';
import MyTimeCheck from 'pages/timeCheck/myTimeCheck';
import SubordinateTimeCheck from 'pages/timeCheck/subordinateTimeCheck';
import TimeCheckDetail from 'pages/timeCheck/timeCheckDetail';

import { useRoutes } from 'react-router-dom';

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
          path: 'department',
          element: <DepartmentList />,
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
