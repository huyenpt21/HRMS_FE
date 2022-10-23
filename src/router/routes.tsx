// import { pathNameLocalStorage } from 'constants/common';
import MainLayout from 'layouts/MainLayout';
import EmployeeList from 'pages/employee/employeeList';
import ForbiddenPage from 'pages/forbidden';
import HomePage from 'pages/homePage';
import NotFound from 'pages/notFound';
import AllRequestList from 'pages/request/allRequest';
import MyRequestList from 'pages/request/myRequest';
import SubordinateRequestList from 'pages/request/subordinateRequest';
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
              path: ':viewType',
              element: <EmployeeList />,
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
