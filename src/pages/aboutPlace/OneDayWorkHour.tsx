import { Button, ListItem, TextField, Typography } from '@mui/material';
import type { OpenDay } from './interface';
import { useEffect, useState } from 'react';

interface Props {
  oneDay: OpenDay;
  saveDayOpeningTime: (oneDay: OpenDay) => void;
  resetOpeningTime: (dayOfWeek: OpenDay['dayOfWeek']) => void;
}

function OneDayWorkHour({ oneDay, saveDayOpeningTime, resetOpeningTime }: Props) {
  const [opensAt, setOpensAt] = useState(oneDay.opensAt);
  const [closesAt, setClosesAt] = useState(oneDay.closesAt);

  useEffect(() => {
    setOpensAt(oneDay.opensAt);
    setClosesAt(oneDay.closesAt);
  }, [oneDay]);

  let day = '';
  switch (oneDay.dayOfWeek) {
    case 0:
      day = 'Неділя';
      break;

    case 1:
      day = 'Понеділок';
      break;

    case 2:
      day = 'Вівторрок';
      break;

    case 3:
      day = 'Середа';
      break;

    case 4:
      day = 'Четвер';
      break;

    case 5:
      day = "П'ятниця";
      break;
    case 6:
      day = 'Субота';
      break;
  }
  return (
    <ListItem
      key={oneDay.dayOfWeek}
      sx={{ width: '600px', display: 'flex', justifyContent: 'space-between' }}
    >
      <Typography sx={{ width: '40px' }}>{day}</Typography>
      <TextField
        type="time"
        value={opensAt || ''}
        label={'З '}
        onChange={e => setOpensAt(e.target.value)}
      />
      <TextField
        type="time"
        value={closesAt || ''}
        onChange={e => setClosesAt(e.target.value)}
        label="По "
      />
      <Button onClick={() => resetOpeningTime(oneDay.dayOfWeek)}>Скинути</Button>
      <Button
        onClick={() => saveDayOpeningTime({ dayOfWeek: oneDay.dayOfWeek, opensAt, closesAt })}
      >
        Зберегти
      </Button>
    </ListItem>
  );
}

export default OneDayWorkHour;
