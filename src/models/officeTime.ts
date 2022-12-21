import { Resource, ResponseData } from './common';

export interface OfficeTimelModel extends Resource {
  timeStart: string;
  timeFinish: string;
  lunchBreakStartTime?: string;
  lunchBreakEndTime?: string;
}

export type ResOfficeTimelModify = ResponseData<{ item: OfficeTimelModel }, {}>;
