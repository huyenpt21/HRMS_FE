import { Pagination, ResponseData } from './common';

export interface NotifcationModel {
  id?: number;
  notificationId?: number;
  userTo?: number;
  userFrom?: string;
  content?: string;
  redirectUrl?: string;
  delivered?: number;
  isRead?: number;
  createDate?: string;
  avtUrl?: string;
  totalNotificationNotRead?: number;
}

export interface NotificationQuery {
  limit: number;
  page: number;
}

export type ResNotifcationList = ResponseData<
  { items: NotifcationModel[] },
  Pagination
>;
