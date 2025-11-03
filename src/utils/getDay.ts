export const getDay = (date: Date) => {
  switch (date.getDay()) {
    case 0:
      return 'Неділя';
    case 1:
      return 'Понеділок';
    case 2:
      return 'Вівторок';
    case 3:
      return 'Середа';
    case 4:
      return 'Четвер';
    case 5:
      return 'Пятниця';
    case 6:
      return 'Субота';
  }
};
