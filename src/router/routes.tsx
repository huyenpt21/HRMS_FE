// import { pathNameLocalStorage } from 'constants/common';
import MainLayout from 'layouts/MainLayout';
import HomePage from 'pages/homePage';
import ForbiddenPage from 'pages/forbidden';
import NotFound from 'pages/notFound';
import { useRoutes } from 'react-router-dom';
import AllEmployeeList from 'pages/Employee/AllEmployeeList';
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
              path: 'all/list',
              element: <AllEmployeeList />,
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
