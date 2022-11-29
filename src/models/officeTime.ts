import { Resource, ResponseData } from './common';

export interface OfficeTimelModel extends Resource {
  timeStart: string;
  timeFinish: string;
}

export type ResOfficeTimelModify = ResponseData<{ item: OfficeTimelModel }, {}>;
