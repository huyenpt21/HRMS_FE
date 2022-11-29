export const EMPLOYEE_LIST_ALL = {
  service: 'hr/employee',
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

export const REQUEST = {
  service: 'request',
  model: {
    status: 'status',
    remainingTime: 'remaining-time',
    officeTime: 'office-time',
    itSupport: 'it-support',
    manager: 'manager',
    hr: 'hr',
    assign: 'assign',
    remainDevice: 'check-remaining-device',
    cancel: 'cancel-request',
  },
};
export const TIME_CHECK = {
  service: 'time-check',
  model: {
    manager: 'manager',
    hr: 'hr',
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
    deviceName: 'device-by-deviceType',
    masterData: 'master-data',
  },
};

export const DEVICE = {
  service: 'device',
  model: {
    itSupport: 'it-support',
  },
};

export const LEAVE_BUDGET = {
  service: 'benefit-budget',
  model: {
    hr: 'hr',
    manager: 'manager',
  },
};
