import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllDishes, rmDish, updateDishPrice } from '../../store/reducers/dishes.reducer';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AddDishModal from './AddDishModal';

function Dishes() {
  const { items, loaded, loading } = useAppSelector(state => state.dishes);
  const [prices, setPrices] = useState<{ [key: number]: number }>({});
  const [dialogOpen, setDialogOpen] = useState<{
    open: boolean;
    title: string;
    body: string;
    agree?: () => void;
  }>({
    open: false,
    title: '',
    body: '',
  });
  const [addDishModalOpen, setAddDishModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleDialogClose = () => {
    setDialogOpen(() => ({
      ...{
        open: false,
        title: '',
        body: '',
      },
    }));
  };

  const handleAddDrinModalClose = () => {
    setAddDishModalOpen(false);
  };

  useEffect(() => {
    if (loaded) return;
    if (loading) return;
    dispatch(getAllDishes());
  }, [dispatch, loaded, loading]);

  useEffect(() => {
    if (items.length < 1) return;

    let obj: { [v: number]: number } = {};

    items.forEach(drink => {
      obj = { ...obj, [drink.id]: drink.price };
    });
    setPrices(obj);
  }, [items]);

  const changePrice = (id: number) => {
    const handleChangePrice = () => {
      dispatch(updateDishPrice({ id, price: prices[id] }));
    };
    setDialogOpen(() => ({
      ...{
        open: true,
        title: 'Зміна ціни',
        body: `Ви впевненніб що хочете змінити ціну на ${prices[id]}?`,
        agree: handleChangePrice,
      },
    }));
  };

  const removeDish = (id: number) => {
    const handleRemove = () => {
      dispatch(rmDish(id));
    };
    setDialogOpen(() => ({
      ...{
        open: true,
        title: 'Видалення Напою',
        body: 'Ви впевненніб що хочете видалити цей напій?',
        agree: handleRemove,
      },
    }));
  };

  const [observer, setObserer] = useState(false);

  useEffect(() => {
    if (dialogOpen.open && loading) {
      setObserer(true);
    }
  }, [loading, dialogOpen]);

  useEffect(() => {
    if (observer && dialogOpen.open && !loading) {
      handleDialogClose();
      setObserer(false);
    }
  }, [dialogOpen, observer, loading]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Страва</TableCell>
              <TableCell align="right">Ціна виробництва</TableCell>
              <TableCell align="right">Видалити</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((dish, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button>
                    <span style={{ textDecoration: 'underline' }}>{dish.name}</span>
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <TextField
                    id={`price-${dish.id}`}
                    variant="standard"
                    type="number"
                    value={prices[dish.id] || dish.price}
                    onChange={e => {
                      const price = e.currentTarget.value;
                      setPrices(obj => ({
                        ...obj,
                        [dish.id]: Number.parseFloat(price),
                      }));
                    }}
                    slotProps={{
                      htmlInput: {
                        inputMode: 'decimal',
                        pattern: '^\\d{0,3}(\\.\\d{0,2})?$',
                        step: 0.01,
                        min: 0.01,
                        max: 999.99,
                      },
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              disabled={
                                prices[dish.id] ? items[index].price === prices[dish.id] : true
                              }
                              onClick={() => changePrice(dish.id)}
                            >
                              Зберегти
                            </Button>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  {
                    <IconButton
                      aria-label="delete"
                      sx={{ borderRadius: '50%' }}
                      size="small"
                      onClick={() => removeDish(dish.id)}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={dialogOpen.open}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableRestoreFocus
      >
        <DialogTitle id="alert-dialog-title">{dialogOpen.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{dialogOpen.body}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Відмінити</Button>
          <Button onClick={dialogOpen.agree} autoFocus>
            Пітвердити
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton onClick={() => setAddDishModalOpen(true)}>
        <AddCircleOutlineRoundedIcon />
      </IconButton>
      <AddDishModal isOpen={addDishModalOpen} handleClose={handleAddDrinModalClose} />
    </>
  );
}

export default Dishes;
