import { getDay } from '../../../utils/getDay';
import { getMonth } from '../../../utils/getMonth';
import { getYear } from '../../../utils/getYear';
import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_MONTH, ONE_WEEK, ONE_YEAR } from './constnts';
import { showMinuts } from './showMinuts';

export const orderTimeAgo = (timePassed: number, ordered: Date) => {
  const hours = Math.floor(timePassed / ONE_HOUR);
  const now = new Date();

  if (ONE_YEAR < timePassed) {
    return getYear(ordered);
  }
  if (ONE_MONTH < timePassed) {
    return getMonth(ordered);
  }
  if (ONE_WEEK < timePassed) {
    return '> Тижня';
  }
  if (now.getDay() - 2 === ordered.getDay()) {
    return 'Позавчора';
  }
  if (now.getDay() - 1 === ordered.getDay()) {
    return 'Вчора';
  }
  if (2 * ONE_DAY < timePassed) {
    return getDay(ordered);
  }

  return `${hours}:${showMinuts(Math.round((timePassed % ONE_HOUR) / ONE_MINUTE))}`;
};
