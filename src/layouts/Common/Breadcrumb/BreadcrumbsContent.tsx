import { URL_PATH } from 'constants/fixData';

const BreadcrumbsContent = [
  {
    path: URL_PATH.employeeList,
    breadcrumbs: [
      {
        title: 'Employee List',
      },
    ],
  },
  {
    path: URL_PATH.subordinateList,
    breadcrumbs: [
      {
        title: 'Subordinate List',
      },
    ],
  },
  {
    path: URL_PATH.myRequestList,
    breadcrumbs: [
      {
        title: 'My Request List',
      },
    ],
  },
];
export default BreadcrumbsContent;
