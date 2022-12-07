import { RangeValue } from 'components/BasicDateRangePicker';
import { EventValue } from 'components/TimeRangePicker';
import { REQUEST_TYPE_KEY } from 'constants/enums/common';
import { OfficeTime } from 'models/request';
import moment from 'moment-timezone';
import { getRange } from 'utils/common';
export const disabledDate = (
  current: moment.Moment,
  dateSelected?: RangeValue,
) => {
  // if start date haven't selected -> disable past date to curent date
  //disable weekend
  const weekend = moment(current).day() === 0 || moment(current).day() === 6;
  if (!dateSelected) {
    return (current && current < moment().endOf('day')) || !!weekend;
  }
  //disable next years
  const tooLate = current > moment(dateSelected[0]).endOf('years');
  //disable previous years and past dates and current dates
  const tooEarly =
    current < moment(dateSelected[1]).startOf('years') ||
    current < moment().endOf('days');
  return !!tooLate || !!tooEarly || !!weekend;
};

export const disableDateOT = (
  current: moment.Moment,
  dateSelected?: RangeValue,
) => {
  if (!dateSelected) {
    return false;
  }
  const hourStartSelected = moment(dateSelected[0]).get('hours');
  const hourEndSelected = moment(dateSelected[1]).get('hours');
  //disable next month
  const tooLate = current > moment(dateSelected[0]).endOf('months');
  //disable previous month
  const tooEarly = current < moment(dateSelected[1]).startOf('months');
  const onlyTwoDaysNext =
    current > moment(dateSelected[0]).add(1, 'days') && hourStartSelected >= 22;
  const onlyTwoDaysPrev =
    current < moment(dateSelected[1]).subtract(1, 'days').startOf('days') &&
    hourEndSelected <= 4;
  const onlyOneDaynext =
    current >= moment(dateSelected[0]).endOf('days') && hourStartSelected <= 4;
  const onlyOneDayPrev =
    current <= moment(dateSelected[1]).startOf('days') && hourEndSelected >= 22;
  return (
    !!tooLate ||
    !!tooEarly ||
    !!onlyTwoDaysNext ||
    !!onlyTwoDaysPrev ||
    !!onlyOneDaynext ||
    !!onlyOneDayPrev
  );
};

export const disabledDateForgotCheckInOut = (current: moment.Moment) => {
  return current >= moment().startOf('days');
};

export const disabledDateMaternity = (current: moment.Moment) => {
  return current <= moment().startOf('days');
};

export const disabledRangeTime = (
  value: EventValue<moment.Moment>,
  type: string,
  requestType: string,
  dateSelected?: RangeValue,
  officeTimeRef?: OfficeTime,
) => {
  const hourStart = Number(officeTimeRef?.timeStart?.split(':')[0]);
  const hourEnd = Number(officeTimeRef?.timeFinish?.split(':')[0]);
  const minuteStart = Number(officeTimeRef?.timeStart?.split(':')[1]);
  const minuteEnd = Number(officeTimeRef?.timeFinish?.split(':')[1]);
  if (requestType === REQUEST_TYPE_KEY.OT) {
    return {
      disabledHours: () => {
        if (dateSelected) {
          if (type === 'end') {
            if (
              value?.get('dates') === moment(dateSelected[0]).get('dates') &&
              moment(dateSelected[0]).get('hours') >= 22
            ) {
              return getRange(0, 22);
            }
            return getRange(5, 24);
          }
          if (type === 'start') {
            if (
              value?.get('dates') === moment(dateSelected[1]).get('dates') &&
              moment(dateSelected[1]).get('hours') <= 4
            ) {
              return getRange(5, 24);
            }
            return getRange(0, 22);
          }
        }
        return getRange(5, 22);
      },
    };
  }
  return {
    disabledHours: () => [
      ...getRange(0, hourStart),
      ...getRange(hourEnd + 1, 24),
    ],
    disabledMinutes: (selectedHour: any) => {
      if (selectedHour === hourStart) return getRange(0, minuteStart);
      if (selectedHour === hourEnd) return getRange(minuteEnd + 1, 60);
      return [];
    },
  };
};
