import type { Status } from '../types';

export const showStatus = (status: Status) => {
  switch (status) {
    case 'processing':
      return 'Готується';
    case 'shipped':
      return 'Приготовано';
    case 'delivered':
      return 'Доставлено';
    case 'cancelled':
      return 'Відмінено';
    case 'pending':
      return 'Очікує';

    default:
      break;
  }
};
