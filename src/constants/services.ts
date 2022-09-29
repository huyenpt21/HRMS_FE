export const TIME_LEAVE_MANAGEMENT = {
  service: 'time-leave-management',
  model: {
    header: 'header',
    leaveBenefitType: 'leave-benefit-type',
    import: 'import-employee-benefit-temp',
  },
};

export const LEAVE_TIME_BENEFIT = {
  service: 'timeleave/benefit',
  model: {
    header: 'header',
    list: 'list',
    listBenefitTypes: 'list-benefit-types',
    changeStatus: 'change-status',
  },
};

export const TIME_LEAVE_HOLIDAY = {
  service: 'timeleave/holiday',
  model: {
    header: 'header',
  },
};

export const TIME_LEAVE_POLICY = {
  service: 'timeleave/policy',
  model: {
    header: 'header',
    data: 'data',
  },
};

export const TIME_CHECK_GENERAL = {
  service: 'time-check-management/general-working-time',
  model: {
    header: 'headers',
    status: 'change-status',
    changeStatus: 'change-status',
    changeDefault: 'change-default',
    exception: 'exception',
  },
};
export const TIME_CHECK_GENERAL_CHANGE_STT = {
  service: 'time-check-management/general-working-time/change-status',
};

export const TIME_CHECK_GENERAL_SET_DEFAULT = {
  service: 'time-check-management/general-working-time/change-default',
};

export const TIME_CHECK_INDIVIDUAL = {
  service: 'time-check-management/individual-settings',
  model: {
    header: 'header',
  },
};

export const TIME_CHECK_MANAGEMENT = {
  service: 'time-check-management',
  model: {
    header: 'header',
    myWorkingTimeShift: 'my-working-time-shift',
    allWorkingTimeShift: 'working-time-shift',
  },
};

export const TIME_CHECK_EXCEPTION = {
  service: 'time-check-management/working-time',
  model: {
    exception: 'exception',
    exceptions: 'exceptions',
    makeUp: 'make-up',
  },
};

export const TIME_CHECK_SYN_LIST = {
  service: 'time-check-sync-list',
  model: {
    header: 'header',
  },
};

export const TIME_CHECK_DEVICE = {
  service: 'timecheckdevice',
  model: {
    asyncNow: 'async-now',
    searchKeyVale: 'searchkeyvale',
  },
};

export const TIME_CHECK_SYNC_HISTORY = {
  service: 'time-check-sync-history',
  model: {
    header: 'header',
  },
};

export const TIME_CHECK_DEVICE_MANAGEMENT = {
  service: 'time-check/devices',
  model: {
    header: 'headers',
    userIdOption: 'user-devices',
  },
};

export const TIME_CHECK_DEVICE_EMPLOYEE_MAP = {
  service: 'time-check/devices/device-employee',
  model: {
    header: 'headers',
  },
};

export const TIME_CHECK_SYNC = {
  service: 'time-check-management/manual-sync',
};

export const TIME_LOG_MANAGEMENT = {
  service: 'timelog/management-view',
  model: {
    header: 'header',
  },
};

export const PRE_PAY_ROLL = {
  service: 'pre-payroll',
  model: {
    logwork: 'locked-worklog',
    header: 'header',
  },
};

export const TIMESHEET_LOG = {
  service: 'timelog',
  model: {
    weekPermission: 'week-permission',
    header: 'header',
    reviewed: 'reviewed',
  },
};

export const LOG_WORK_PROJECT_DETAIL = {
  service: 'timelog',
  model: {
    header: 'timelog/member-view/detail/header',
    detail: 'timelog/member-view/detail',
  },
};

export const EMPLOYEE = {
  service: 'timesheet/employee',
};

export const DEPARTMENTS = {
  service: 'department/view/list',
};
export const DEPARTMENT = {
  service: 'department',
};
export const ROLE = {
  service: 'syrole',
  model: {
    getPage: 'getpage',
    detail: 'detail',
    searchKeyVale: 'SearchKeyVale',
    update: 'update',
    delete: 'delete',
  },
};
export const View_All_Permission = {
  service: 'permission',
};

export const USER_ROLE_LIST = {
  service: 'SyUserRole',
  model: {
    getPage: 'GetPage',
    add: 'add',
    delete: 'delete',
  },
};
export const ROLE_MODULE_SITEMAP = {
  service: 'RoleModuleSitemap',
  model: {
    getPage: 'get-paging',
    create: 'create',
    delete: 'delete',
    permission: 'check-permisson',
  },
};
export const NOTIFICATION = {
  service: 'notification',
  model: {
    detail: 'Notification/notification',
    updateDetail: 'Notification/notification-save',
    sendEmail: 'Notification/SendData',
    detailManagement: 'NotificationSetup/get',
    editManagement: 'NotificationSetup/save-change',
    createContent: 'create-content',
    updateContent: 'update-content',
    deleteContent: 'Notification/delete-content',
    count: 'count',
    listNoti: 'Notification/system-notification',
    ChangeSttNoti: 'notification-change-status',
  },
};
export const NOTIFICATION_CHANGE_STATUS = {
  service: 'notification-change-status',
};
export const OPTS_WORKING_TIME = {
  service: 'employee-management/view/working-time',
};
export const OPTS_POSITION = {
  service: 'employee-management/view/position',
};

export const OPTS_USER = {
  service: 'user/select-options',
};

export const PROJECTS = {
  service: 'project-management',
  model: {
    list: 'view/list',
    import: 'import-project-management',
  },
};

export const TIME_LOG_INDIVIDUAL = {
  service: 'timelog/member-view',
  model: {
    header: 'header',
  },
};

export const TIME_LOG_SYNC = {
  service: 'worklog-sync',
  model: {
    header: 'header',
  },
};

export const TIME_LOG_AUTO_SYNC = {
  service: 'timelog/auto-sync',
  model: {
    header: 'header',
  },
};

export const TIME_LOG_CONFIGURATION = {
  service: 'configuration',
  serviceKey: 'configuration/key',
};

export const TIME_LOG_SYNC_MANUAL = {
  service: 'timelog/sync-manual',
};

export const TIME_LOG_LOCK_WORKLOG = {
  service: 'timelog/week-permission/locked',
};

export const REQUEST_POLICY = {
  service: 'time-requests',
  model: {
    policyTypes: 'policy-types',
    changeStatus: 'change-status',
    policyGroupAll: 'group-all',
  },
};

export const REQUEST_FLOW = {
  service: 'time-requests/request-flow',
  model: {
    changeStatus: 'change-status',
    policy: 'policy',
    employees: 'employees',
  },
};

export const REQUEST_MANAGEMENT = {
  service: 'request-management',
  model: {
    myRequest: 'my-request',
    allRequest: 'all-request',
    approver: 'approver',
    approverList: 'get-approver-list',
    status: 'status',
    data: 'data',
    duplicate: 'duplicate',
    makeUpTimeAmount: 'calculate-make-up-time',
    byAdmin: 'by-admin',
  },
};

export const TIME_REQUEST = {
  service: 'time-requests',
  model: {
    searchKeyVale: 'group',
    remoteCheckTime: 'remote-check-time',
  },
};

export const EMPLOYEE_LIST = {
  service: 'Employee',
  model: {
    searchKeyVale: 'SearchKeyVale',
    timeWork: 'GetTimeWork',
  },
};

export const MENU = {
  service: 'sitemaps',
};

export const TENENT = {
  service: 'tenants',
  model: {
    settings: 'settings',
    register: 'company-register',
  },
};

export const SITEMAP_MANAGEMENT = {
  service: 'SiteMap',
  model: {
    header: 'get-sitemap/header',
    getParentList: 'get-sitemap',
    getList: 'GetSubSiteMap',
    add: 'add',
    update: 'update',
  },
};

export const TAB_HEADER = {
  service: 'TableHeader',
  model: {
    getPaging: 'get-paging',
    add: 'add',
    update: 'update',
    delete: 'delete',
  },
};
export const SITEMAP_FIELD = {
  service: 'SitemapField',
};

export const SITEMAP_OPTS = {
  service: 'sitemap',
  model: {
    getKeyValue: 'getkeyvalue',
  },
};
export const PROJECT_MANAGEMENT_LIST = {
  service: 'project-management',
  model: {
    header: 'header',
    status: 'status',
  },
};

export const PROJECT_MANAGEMENT_DETAIL = {
  service: 'project',
  model: {
    model: 'model',
    type: 'type',
    status: 'status',
  },
};

export const PROJECT_EMPLOYEE_LIST = {
  service: 'project-management',
  model: {
    employees: 'employees',
  },
};

export const EMPLOYEE_PROJECT = {
  service: 'employee-project',
};

export const EMPLOYEE_MANAGEMENT = {
  service: 'employee-management',
  model: {
    header: 'view/header',
    management: 'view/manager',
    changeStatus: 'change-status',
  },
};

export const TIME_LOG_EMPLOYEE = {
  service: 'timelog/employee',
  model: {
    header: 'header',
    mappingEmployee: 'timelog/mapping-employees',
  },
};

export const TIME_OT_PLANS = {
  service: 'timeot/plan',
  model: {
    tabMyPlan: 'my-plan/status-total',
    tabAllPlan: 'all-plan/status-total',
    allPlan: 'all-plan',
    myPlan: 'my-plan',
    project: 'project',
    changeSttAllPlan: 'status',
    listPlan: 'select-list',
  },
};

export const TIME_OT_REQUEST_SETTING = {
  service: 'timeot',
  model: {
    policy: 'request-policy',
    flow: 'request-flow',
    policyOption: 'request-policy/list/option',
    active: 'active',
    deactive: 'deactive',
    listEmployee: 'ot-management/management-view',
  },
};
export const TIME_OT_MANAGEMENT = {
  service: 'ot-management',
  model: {
    listEmployee: 'management-view',
    otLog: 'ot-log',
    listProject: 'member-view',
    listOtLog: 'member-view/detail',
  },
};

export const TIME_OT_REQUESTS = {
  service: 'timeot/request',
  model: {
    myRequestTab: 'my-request/total',
    allRequestTab: 'all-request/total',
    myRequest: 'my-request',
    approvers: 'approver',
    allRequest: 'all-request',
    changeStatus: 'status',
    otWorkingPoint: 'ot-working-point',
    plan: 'plan',
    status: 'status',
  },
};

export const DASHBOARD_EMPLOYEE = {
  service: 'Employee',
  model: {
    statistic: 'timesheet-info',
    checkTimeLogWork: 'GetCheckTimeLogWork',
    request: 'my-time-request',
  },
};

export const DASHBOARD = {
  service: 'dashboard',
  model: {
    checkTimeWorklog: 'check-time-worklog',
    summary: 'summary',
    timeOt: 'time-ot',
    projectsOfEmployee: 'projects-of-employee',
  },
};

export const USER_MANAGEMENT = {
  service: 'user',
  model: {
    getPage: 'getpage',
    detail: 'detail',
    role: 'role',
    update: 'update',
  },
};

export const USER_ROLE = {
  service: 'syuserrole',
  model: {
    add: 'add',
    delete: 'delete',
  },
};

export const OPTS_ROLE = {
  service: 'syrole',
  model: {
    searchKeyVale: 'searchkeyvale',
  },
};

export const REPORT_CD_EMPLOYEE = {
  service: 'report/employee',
  model: {
    header: 'header',
  },
};

export const REPORT_CD_SUMMARY = {
  serviceEmployee: 'report/summary/employee',
  serviceWorklog: 'report/summary/worklog',
  serviceBillableRate: 'report/summary/billable-rate',
  model: {
    header: 'header',
  },
};
export const REPORT_CD_PROJECT = {
  service: 'report/project',
};

export const EXCEL_REPORT = {
  project: 'report/project/export',
  employee: '',
};

export const SEND_BY_CHANNEL = {
  service: 'sendbychannel',
  model: {
    testSend: 'test-send',
    sendTeam: 'send-team',
    getPage: 'get-page',
    create: 'create',
    update: 'save-change',
    delete: 'delete',
    getDetail: 'get-detail',
    getEmployee: 'get-employee-page',
    addEmployee: 'add-employee',
    deleteEmployee: 'delete-emp',
    getChannel: 'get-channel',
    getAction: 'get-action',
    getTimezone: 'get-timezone',
  },
};
export const USER_SETTING = {
  service: 'users/',
};

export const CHANGE_PASSWORD = {
  service: 'changePassword',
};
export const TIMESHEET_SETTING = {
  service: 'timesheetSetting',
};

export const DEVICE_TOKEN = {
  service: 'DeviceToken',
  model: {
    saveToken: 'save-token',
  },
};
export const PENALTY = {
  service: 'penalty',
};

export const REPORT_PREPAYROLL = {
  service: 'report',
  model: {
    prepayroll: 'pre-payroll',
    header: 'header',
    listing: 'listing',
  },
};
