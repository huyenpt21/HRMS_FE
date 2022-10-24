import { Resource } from './common';

export interface TimeCheckModel extends Resource {
  personName?: string;
  rollNumber?: string;
  inLate?: number;
  outEarly?: number;
  timeIn?: string;
  timeOut?: string;
  ot?: number;
  workingTime?: number;
}
