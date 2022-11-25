export const EMPLOYEE_LIST_ALL = {
  service: 'hr/employee',
  model: {
    list: 'all/list',
  },
};

export const USER_INFO = {
  service: 'user-info',
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
    officeTime: 'office-time',
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
    hr: 'HR',
    allEmployee: 'all-employee',
    allSubordinate: 'all-subordinate',
    detail: 'detail-subordinate',
  },
};

export const MANAGER_LIST = {
  service: 'all-manager-master-data',
};

export const POSITION_BY_DEPARTMENT = {
  service: 'position-by-departmentId-master-data',
};
export const DEPARTMENT = {
  service: 'hr/department',
  model: {
    masterData: 'department-master-data',
  },
};

export const DEVICE_TYPE = {
  service: 'device-type',
  model: {
    masterData: 'master-data',
  },
};

export const LEAVE_BUDGET = {
  service: 'benefit-budget',
  model: {
    hr: 'hr',
    manager: 'manager',
  },
};
