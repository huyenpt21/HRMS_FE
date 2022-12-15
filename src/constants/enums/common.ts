export enum STATUS {
  USING = 'Using',
  CANCELLED = 'Canceled',
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
  FAILED = 'Failed',
  SUCCESS = 'Success',
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ASSIGNED = 'Assigned',
  RETURNED = 'Returned',
  AVAILABLE = 'Available',
  REGISTERED = 'Registered',
  DELETED = 'Deleted',
}
export enum MENU_OPTION_KEY {
  EDIT = 'edit',
  DETAIL = 'detail',
  CANCELLED = 'cancelled',
  DELETE = 'delete',
  DEACTIVE = 'deactive',
  ACTIVE = 'active',
}

export enum CHECKBOX {
  CHECKED = 1,
  UNCHECKED = 0,
}

export enum SIZE_TYPE {
  SMALL = 'small',
  MIDDLE = 'middle',
  LARGE = 'large',
}

export enum PLACEMENT {
  TOP_LEFT = 'topLeft',
  TOP_CENTER = 'topCenter',
  TOP_RIGHT = 'topRight',
  BOTTOM_LEFT = 'bottomLeft',
  BOTTOM_CENTER = 'bottomCenter',
  BOTTOM_RIGHT = 'bottomRight',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum MODE_TYPE {
  MULTIPLE = 'multiple',
  TAGS = 'tags',
}

export enum PICKER_TYPE {
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export enum SHAPE_TYPE {
  DEFAULT = 'default',
  CIRCLE = 'circle',
  ROUND = 'round',
}

export enum GENDER_KEY {
  MALE = 1,
  FEMALE = 0,
  OTHER = 2,
}

export enum STATUS_COLORS {
  SUCCESS = 'success',
  PROCESSING = 'processing',
  ERROR = 'error',
  WARING = 'warning',
  DEFAULT = 'default',
}

export enum DIRECTION {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export enum ACTION_TYPE {
  EDIT,
  VIEW_DETAIL,
  CREATE,
  ASSIGN,
}

export enum REQUEST_ACTION_TYPE {
  EDIT,
  REJECT,
  APPROVE,
  CANCEL,
}

export enum EMPLOYEE_MENU {
  ALL = 'all',
  SUBORDINATE = 'subordinate',
}

export enum REQUEST_MENU {
  MY_REQUEST = 'my-request',
  SUBORDINATE = 'subordinate',
  ALL = 'all',
  DEVICE = 'device',
}
export enum DEVICE_MENU {
  DEVICE_TYPE = 'device-type',
  DEVICE_MANAGEMENT = 'device-management',
  SUBORDINATE = 'suborder',
  ALL_BORROW_DEVICE_HISTORY = 'all-history',
  MY_BORROW_DEVICE_HISTORY = 'my-history',
  ALL_BORROW_DEVICE_REQUEST = 'all-request-device',
}
export enum REQUEST_TYPE_KEY {
  LEAVE = 'leave',
  OT = 'ot',
  DEVICE = 'device',
  OTHER = 'other',
  FORGOT_CHECK_IN_OUT = 'forgotCheckInOut',
  MATERNITY = 'maternity',
}

export enum MENU_TYPE {
  MINE,
  SUBORDINATE,
  ALL,
  DETAIL,
}
