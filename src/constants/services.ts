export const EMPLOYEE_LIST_ALL = {
  service: 'hr/employee',
  model: {
    list: 'all/list',
  },
};
export const SUBORDINATE_LIST = {
  service: 'manager/employee',
  model: {
    list: 'all/list',
  },
};

export const MY_REQUEST_LIST = {
  service: 'request',
  model: {
    status: 'status',
  },
};
export const MANAGER_REQUEST_LIST = {
  service: 'manager/request',
};
export const HR_REQUEST_LIST = {
  service: 'hr/request',
};
