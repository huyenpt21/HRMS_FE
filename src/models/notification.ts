import { Pagination, ResponseData } from './common';

export interface NotifcationModel {
  notificationId: number;
  userTo: number;
  userFrom: string;
  content: string;
  redirectUrl: string;
  delivered: number;
  isRead: number;
  createDate?: string;
  avtUrl?: string;
}

export interface NotificationQuery {
  limit: number;
  page: number;
}

export type ResNotifcationList = ResponseData<
  { items: NotifcationModel[] },
  Pagination
>;
