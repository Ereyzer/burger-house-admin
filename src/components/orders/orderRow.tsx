import { Link, TableCell, TableRow } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Status } from './types';
import { chooseColor } from './helpers/chooseColor';
import { ONE_MINUTE } from './helpers/constnts';
import { showStatus } from './helpers/showStatus';
import { orderTimeAgo } from './helpers/orderredTimeAgo';
import { showMinuts } from './helpers/showMinuts';

interface Props {
  id: string;
  status: Status;
  customerName: string;
  phone: string;
  isDelivery: boolean;
  orderedAt: Date;
  clickOnRow: (id: string) => void;
}
function OrderRow({ id, isDelivery, orderedAt, phone, customerName, status, clickOnRow }: Props) {
  const ordered = useMemo(() => new Date(orderedAt), [orderedAt]);

  const [timePassed, setTimePassed] = useState(Date.now() - ordered.getTime());
  const firstRender = useRef(true);
  useEffect(() => {
    if (new Date().getDay() != ordered.getDay()) return;

    const leftMs = timePassed % ONE_MINUTE;

    const timeout = setTimeout(() => {
      setTimePassed(prev => prev + leftMs);
    }, leftMs);
    return () => {
      clearTimeout(timeout);
    };
  }, [timePassed, ordered]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setTimePassed(Date.now() - ordered.getTime());
  }, [ordered]);

  return (
    <TableRow
      sx={{
        cursor: 'pointer',
        '&:hover': { backgroundColor: 'action.hover', color: 'blue' },
        ...chooseColor(status, timePassed),
      }}
      onClick={() => clickOnRow(id)}
    >
      <TableCell align="left" padding="normal" sx={{ color: 'inherit' }}>
        {showStatus(status)}
      </TableCell>
      <TableCell
        align="center"
        padding="normal"
        sx={{
          color: 'inherit',
        }}
      >
        {customerName}
      </TableCell>
      <TableCell
        align="center"
        padding="normal"
        sx={{
          color: 'inherit',
        }}
      >
        <Link
          href={`tel:+380${phone}`}
          sx={{
            color: 'inherit',
          }}
        >
          {phone}
        </Link>
      </TableCell>
      <TableCell
        align="center"
        padding="normal"
        sx={{
          color: 'inherit',
        }}
      >
        {isDelivery ? 'Доставка' : 'В Закладі'}
      </TableCell>
      <TableCell
        align="center"
        padding="normal"
        sx={{
          color: 'inherit',
        }}
      >
        {`${ordered.getHours()}:${showMinuts(ordered.getMinutes())}`}
      </TableCell>
      <TableCell
        align="right"
        padding="normal"
        sx={{
          color: 'inherit',
        }}
      >
        {orderTimeAgo(timePassed, ordered)}
      </TableCell>
    </TableRow>
  );
}

export default OrderRow;
