export const EMPLOYEE_LIST_ALL = {
  service: 'hr/employee',
  model: {
    list: 'all/list',
  },
};
export const EMPLOYEE_CHANGE_STATUS = {
  service: 'hr/status/employee',
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
    remainingTime: 'remaining-time',
  },
};
export const MANAGER_REQUEST_LIST = {
  service: 'manager/request',
};
export const HR_REQUEST_LIST = {
  service: 'hr/request',
};

export const TIME_CHECK = {
  service: 'time-check',
  model: {
    manager: 'manager',
    allSubordinate: 'all-subordinate',
  },
};

export const MANAGER_LIST = {
  service: 'all-manager-master-data',
};

export const POSITION_BY_DEPARTMENT = {
  service: 'position-by-departmentId-master-data',
};
export const DEPARTMENT = {
  service: 'department-master-data',
};
