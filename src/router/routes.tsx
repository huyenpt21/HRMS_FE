// import { pathNameLocalStorage } from 'constants/common';
import MainLayout from 'layouts/MainLayout';
import EmployeeList from 'pages/Employee/EmployeeList';
import ForbiddenPage from 'pages/forbidden';
import HomePage from 'pages/homePage';
import NotFound from 'pages/notFound';
import RequestTabs from 'pages/Request';
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
          path: 'request/:tabType',
          element: <RequestTabs />,
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
