import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import type { BrakeTime } from './interface';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BeforeDeleteDialog from '../../components/agreeDialog/BeforeDeleteDialog';

interface Props {
  items: BrakeTime[];
  addBrakeTime: (brakeTime: Pick<BrakeTime, 'workDate' | 'closesAt' | 'opensAt'>) => void;
  rmBrakeTime: (id: string) => void;
}

function BrakeTimesList({ items, addBrakeTime, rmBrakeTime }: Props) {
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [isRemoving, setIsRemoving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleOpen = (id: string) => {
    setRemovingId(id);
    setIsRemoving(true);
  };

  const handleClose = () => {
    setRemovingId(null);
    setIsRemoving(false);
  };

  const handleDelete = () => {
    if (removingId === null) return;

    rmBrakeTime(removingId);
    handleClose();
  };
  return (
    <>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Початок</TableCell>
                <TableCell>Кінець</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {}}
                    // sx={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
                    disabled={true}
                  >
                    {/* <AddCircleOutlineRoundedIcon /> */}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(date)}
                      onChange={value => {
                        if (!value) return;
                        setDate(value.format('YYYY-MM-DD'));
                      }}
                      format="YYYY-MM-DD"
                      sx={{ maxWidth: 200 }}
                      minDate={dayjs()}
                    />
                  </LocalizationProvider>
                </TableCell>
                <TableCell>
                  <TextField type="time" value={start} onChange={e => setStart(e.target.value)} />
                </TableCell>
                <TableCell>
                  <TextField type="time" value={end} onChange={e => setEnd(e.target.value)} />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => addBrakeTime({ workDate: date, closesAt: start, opensAt: end })}
                  >
                    <AddCircleOutlineRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              {items.map(item => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.workDate}</TableCell>
                    <TableCell>{item.closesAt}</TableCell>
                    <TableCell>{item.opensAt}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpen(item.id)}>
                        <DeleteRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[1, 5, 10, 25, 50, 100]}
          component="div"
          count={1}
          rowsPerPage={1}
          page={1}
          onRowsPerPageChange={() => {}}
          onPageChange={() => {}}
        ></TablePagination> */}
      </Paper>
      <BeforeDeleteDialog
        open={isRemoving}
        handleApprove={handleDelete}
        onClose={handleClose}
        title="Перерва"
      />
    </>
  );
}

export default BrakeTimesList;
