export const getMonth = (date: Date) => {
  switch (date.getMonth()) {
    case 0:
      return 'Січень';
    case 1:
      return 'Лютий';
    case 2:
      return 'Березень';
    case 3:
      return 'Квітень';
    case 4:
      return 'Травень';
    case 5:
      return 'Червень';
    case 6:
      return 'Липень';
    case 7:
      return 'Серпень';
    case 8:
      return 'Вересень';
    case 9:
      return 'Жовтень';
    case 10:
      return 'Листопад';
    case 11:
      return 'Грудень';
  }
};
