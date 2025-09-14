import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllDrinks, rmDrink, updateDrinkPrice } from '../../store/reducers/drinks.reducer';
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
import AddDrinkModal from './AddDrinkModal';

function Drinks() {
  const { items, loading, loaded } = useAppSelector(state => state.drinks);
  const dispatch = useAppDispatch();
  const [prices, setPrices] = useState<{ [v: number]: number }>({});
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
  const [addDrinkModalOpen, setAddDrinkModalOpen] = useState(false);

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
    setAddDrinkModalOpen(false);
  };

  useEffect(() => {
    if (loaded) return;
    if (loading) return;
    dispatch(getAllDrinks());
  }, [dispatch, loaded, loading]);

  useEffect(() => {
    if (items.length < 1) return;

    let obj: { [v: number]: number } = {};

    items.forEach(drink => {
      obj = { ...obj, [drink.id]: drink.price };
    });
    setPrices(obj);
  }, [items]);

  const removeDrink = (id: number) => {
    const handleRemoveDrink = () => {
      dispatch(rmDrink(id));
    };
    setDialogOpen(() => ({
      ...{
        open: true,
        title: 'Видалення Напою',
        body: 'Ви впевненніб що хочете видалити цей напій?',
        agree: handleRemoveDrink,
      },
    }));
  };

  const changePrice = (id: number) => {
    const handleChangePrice = () => {
      dispatch(updateDrinkPrice({ id, price: prices[id] }));
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
              <TableCell>Напій</TableCell>
              <TableCell align="right">Ціна закупівельна</TableCell>
              <TableCell align="right">Видалити</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(prices).length > 0 ? (
              items.map((drink, index) => {
                return (
                  <TableRow
                    key={drink.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {drink.name}
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        id={`price-${drink.id}`}
                        // label={drink.price}
                        // component="input"
                        variant="standard"
                        type="number"
                        value={prices[drink.id] || drink.price}
                        onChange={e => {
                          const price = e.currentTarget.value;
                          setPrices(obj => ({
                            ...obj,
                            [drink.id]: Number.parseFloat(price),
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
                                    prices[drink.id]
                                      ? items[index].price === prices[drink.id]
                                      : true
                                  }
                                  onClick={() => changePrice(drink.id)}
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
                          onClick={() => removeDrink(drink.id)}
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      }
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <></>
            )}
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
      <IconButton onClick={() => setAddDrinkModalOpen(true)}>
        <AddCircleOutlineRoundedIcon />
      </IconButton>
      <AddDrinkModal isOpen={addDrinkModalOpen} handleClose={handleAddDrinModalClose} />
    </>
  );
}

export default Drinks;
