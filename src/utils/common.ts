import {
  DATE_REQUEST,
  SortDir,
  TIME_HOUR,
  US_DATE_FORMAT,
} from 'constants/common';

import { isNumber } from 'lodash';
import { Pagination, QueryParams, SelectBoxType } from 'models/common';
import moment from 'moment';
export const isEmptyPagination = (pagination: Pagination) => {
  return Object.entries(pagination).length === 0;
};

export const removeEmptyValueInObject = (obj: any) => {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
};

export const sortInforWithDir = (
  field: string | undefined,
  stateQuery: QueryParams<string>,
) => {
  if (field) {
    return (
      stateQuery?.sort === field &&
      (stateQuery?.dir === SortDir.ASC ? 'ascend' : 'descend')
    );
  }
};

export const getStartOfWeek = (
  date: moment.Moment | string,
  format?: string,
) => {
  return format
    ? moment(date).startOf('isoWeek').format(format)
    : moment(date).startOf('isoWeek');
};

export const getEndOfWeek = (date: moment.Moment | string, format?: string) => {
  return format
    ? moment(date).endOf('isoWeek').format(format)
    : moment(date).endOf('isoWeek');
};

export const getDateFormat = (
  date: string | moment.Moment | undefined,
  outputFormat: string,
  inputFormat?: string,
): string => {
  return inputFormat
    ? moment(date, inputFormat).format(outputFormat)
    : moment(date).format(outputFormat);
};

export const getStartOfMonth = (
  date: moment.Moment | string,
  format?: string,
) => {
  return format
    ? moment(date).startOf('month').format(format)
    : moment(date).startOf('month');
};

export const getEndOfMonth = (
  date: moment.Moment | string,
  format?: string,
) => {
  return format
    ? moment(date).endOf('month').format(format)
    : moment(date).endOf('month');
};

export const getCurrentDate = (format?: string) => {
  return format ? moment().format(format) : moment().toString();
};

export const getDateUTC = (date: string | moment.Moment, format?: string) => {
  return format ? moment.utc(date).format(format) : moment.utc(date).format();
};

export const getLocalTime = (date: string) => {
  return new Date(date);
};

//convert localtime to UTC
export const convertToDateUtc = (
  date: string | moment.Moment,
  startDate = true,
  currentFormat = US_DATE_FORMAT,
) => {
  if (startDate) {
    return moment(date, currentFormat).startOf('date').utc().format();
  } else {
    return moment(date, currentFormat).endOf('date').utc().format();
  }
};

//convert UTC to local time
export const convertDate = (
  date: string | undefined,
  format: string = US_DATE_FORMAT,
) => {
  const dateMoment = moment(date);
  if (dateMoment.isValid()) return dateMoment.format(format);
};

export const convertToDateTimeUtc = (
  date: string | moment.Moment,
  currentFormat = US_DATE_FORMAT,
) => {
  return moment(date, currentFormat).utc().format();
};

export const convertDateToDateString = (
  date: moment.Moment,
  currentFormat = DATE_REQUEST,
) => {
  return moment(date).format(currentFormat);
};

export const TimeCombine = (
  date: moment.Moment | string | undefined,
  time?: moment.Moment | string | undefined,
  isStartDate = true,
  isConvertToUTC = true,
  formatOutput?: string,
) => {
  const convertDate = moment(date).format(US_DATE_FORMAT);
  let convertTime;
  if (time) {
    convertTime = moment(time).format(TIME_HOUR);
  } else {
    if (isStartDate) {
      convertTime = '00:00';
    } else {
      convertTime = '23:59';
    }
  }

  const format = `${US_DATE_FORMAT} ${TIME_HOUR}`;
  if (isConvertToUTC) {
    return moment(`${convertDate} ${convertTime}`, format).utc().format();
  }
  if (!isConvertToUTC) {
    return formatOutput
      ? moment(`${convertDate} ${convertTime}`, format).format(formatOutput)
      : moment(`${convertDate} ${convertTime}`, format).format();
  }
};

export const convertMillisecondToMinute = (milliSeconds: number) => {
  const minutes = Math.floor(milliSeconds / 60000);
  return minutes;
};

export const getTimeDiff = (
  start: moment.Moment | string,
  end: moment.Moment | string,
) => {
  const duration = moment.duration(moment(end).diff(moment(start)));
  //Get Days
  const days = Math.floor(duration.asDays());
  const daysFormatted = days ? `${days}d ` : '';

  //Get Hours
  const hours = duration.hours();
  const hoursFormatted = `${hours}h `;

  //Get Minutes
  const minutes = duration.minutes();
  const minutesFormatted = `${minutes}m`;
  return [daysFormatted, hoursFormatted, minutesFormatted].join('');
};

export const formatTimeForLogTimeOt = (time: string | moment.Moment) => {
  return `${moment(time).format(DATE_REQUEST)} 00:00:00`;
};

export const camelCaseToWord = (word: string) => {
  return word
    .split(/(?=[A-Z])/)
    .map((s) => s.toUpperCase())
    .join(' ');
};

export const kFormatter = (num: number) => {
  let value = isNumber(num) ? num : 0;
  const checkPrice: number = parseFloat((Math.abs(value) / 1000).toFixed(1));
  return Math.abs(value) > 999
    ? Math.sign(value) * checkPrice + 'k'
    : Math.sign(value) * Math.abs(value);
};

export const checkIsCurrentWeek = (date: moment.Moment | string) => {
  const startDateOfWeek = moment().startOf('isoWeek');
  return moment(date).isSame(startDateOfWeek);
};

export const getUserInfo = () => {
  const oidcAuth = localStorage.getItem(
    `oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`,
  );

  return !oidcAuth ? null : JSON.parse(oidcAuth);
};
export const optsDate = () => {
  let date: SelectBoxType[] = [];
  for (let i = 0; i < 31; i++) {
    date.push({ value: i + 1, label: `${i + 1}` });
  }
  return date;
};

export const getRange = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
