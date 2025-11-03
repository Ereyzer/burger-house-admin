import type { Status } from '../types';
import { ONE_HOUR, ONE_MINUTE } from './constnts';

const paletteRowColors = {
  warning: { backgroundColor: '#f70909ff', color: 'black' },
  attention: { backgroundColor: '#df531cff', color: 'black' },
  notice: { backgroundColor: '#ffff00', color: 'black' },
  ordered: { backgroundColor: '#83e7adff', color: 'black' },
  delivered: { backgroundColor: 'inherit', color: 'inherit' },
};

export const chooseColor = (status: Status, timePassed: number) => {
  if (status === 'delivered') {
    return paletteRowColors.delivered;
  }
  if (status === 'pending' && timePassed > 20 * ONE_MINUTE) {
    return paletteRowColors.warning;
  }
  if (status === 'pending' && timePassed > 15 * ONE_MINUTE) {
    return paletteRowColors.attention;
  }
  if (status === 'pending' && timePassed > 10 * ONE_MINUTE) {
    return paletteRowColors.notice;
  }
  if (status === 'pending') {
    return paletteRowColors.ordered;
  }
  if (status === 'processing' && timePassed > 45 * ONE_MINUTE) {
    return paletteRowColors.warning;
  }
  if (status === 'processing' && timePassed > 35 * ONE_MINUTE) {
    return paletteRowColors.attention;
  }
  if (status === 'processing' && timePassed > 25 * ONE_MINUTE) {
    return paletteRowColors.notice;
  }
  if (status === 'processing') {
    return paletteRowColors.ordered;
  }

  if (status === 'shipped' && timePassed > 70 * ONE_MINUTE) {
    return paletteRowColors.warning;
  }
  if (status === 'shipped' && timePassed > ONE_HOUR) {
    return paletteRowColors.attention;
  }
  if (status === 'shipped' && timePassed > 55 * ONE_MINUTE) {
    return paletteRowColors.notice;
  }
  if (status === 'shipped') {
    return paletteRowColors.ordered;
  }
};
