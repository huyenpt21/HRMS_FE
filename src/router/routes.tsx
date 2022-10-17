// import { pathNameLocalStorage } from 'constants/common';
import MainLayout from 'layouts/MainLayout';
import HomePage from 'pages/homePage';
import ForbiddenPage from 'pages/forbidden';
import NotFound from 'pages/notFound';
import { useRoutes } from 'react-router-dom';
import EmployeeList from 'pages/Employee/EmployeeList';
import MyRequestList from 'pages/Request/TimingRequest/MyRequest/RequestList';
import SubordinateRequestList from 'pages/Request/TimingRequest/SubordinateRequest/RequestList';

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
              path: ':viewType/list',
              element: <EmployeeList />,
            },
          ],
        },
        {
          path: 'request',
          children: [
            {
              path: 'my-request/list',
              element: <MyRequestList />,
            },
            {
              path: 'subordinate/list',
              element: <SubordinateRequestList />,
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
