import moment from 'moment';
import momentTz from 'moment-timezone';

momentTz.tz();

moment.locale();

moment.relativeTimeThreshold('s', 59);

moment.relativeTimeThreshold('ss', 3);

moment.relativeTimeThreshold('m', 60);

moment.relativeTimeThreshold('h', 24);
