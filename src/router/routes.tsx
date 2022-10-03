// import { pathNameLocalStorage } from 'constants/common';
import MainLayout from 'layouts/MainLayout';
import HomePage from 'pages/homePage';
import ForbiddenPage from 'pages/forbidden';
import NotFound from 'pages/notFound';
import { useRoutes } from 'react-router-dom';
import EmployeeList from 'pages/Employee/EmployeeList';
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
              path: 'list',
              element: <EmployeeList />,
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
