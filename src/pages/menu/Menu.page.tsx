import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllMenu, rmMenuItem, switchOnboard } from '../../store/reducers/menu.reducer';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AddMenuItemModal from './AddMenuItemModal';
import UpdateMenuItemModal from './UpdateMenuItemModal';
import type { PropsOf } from '@emotion/react';

function Menu() {
  const { items, loading } = useAppSelector(state => state.menu);
  //   const [prices, setPrices] = useState<{ [key: number]: number }>({});
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
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [updateMenuProps, setUpdateMenuProps] = useState<PropsOf<typeof UpdateMenuItemModal>>({
    isOpen: true,
    onClose: () => {
      setUpdateMenuProps(p => ({ ...p, isOpen: false, itemId: 0 }));
    },
    itemId: 0,
  });

  const dispatch = useAppDispatch();

  const openUpdateMenuItemModal = (itemId: number) => {
    setUpdateMenuProps(p => ({ ...p, isOpen: true, itemId }));
  };
  useEffect(() => {
    dispatch(getAllMenu());
  }, [dispatch]);

  const handleAddItemModalClose = () => {
    setAddItemModalOpen(false);
  };

  const handleSwitchOnboard = (id: number) => {
    dispatch(switchOnboard({ id }));
  };

  const handleDialogClose = () => {
    setDialogOpen(() => ({
      ...{
        open: false,
        title: '',
        body: '',
      },
    }));
  };

  const removeItem = (id: number) => {
    const handleRemoveDrink = () => {
      dispatch(rmMenuItem(id));
    };
    setDialogOpen(() => ({
      ...{
        open: true,
        title: 'Видалення Страви',
        body: 'Ви впевненніб що хочете видалитицю страву?',
        agree: handleRemoveDrink,
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
              <TableCell align="left" padding="normal">
                В наявності
              </TableCell>
              <TableCell align="center">Страва</TableCell>
              <TableCell align="center">Ціна виробництва</TableCell>
              <TableCell align="right">Видалити</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((meal, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={meal.onboard}
                    onChange={() => handleSwitchOnboard(meal.id)}
                  />
                </TableCell>

                <TableCell align="center">
                  <Button onClick={() => openUpdateMenuItemModal(meal.id)}>
                    <span style={{ textDecoration: 'underline' }}>
                      {meal.title} {meal.subtitle}
                    </span>
                  </Button>
                </TableCell>
                <TableCell align="center">{meal.price}</TableCell>
                <TableCell align="right">
                  {
                    <IconButton
                      aria-label="delete"
                      sx={{ borderRadius: '50%' }}
                      size="small"
                      onClick={() => removeItem(meal.id)}
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
      <IconButton
        onClick={() => setAddItemModalOpen(true)}
        sx={{ position: 'fixed', bottom: '1rem', right: '1rem' }}
      >
        <AddCircleOutlineRoundedIcon />
      </IconButton>
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
      <AddMenuItemModal isOpen={addItemModalOpen} handleClose={handleAddItemModalClose} />
      <UpdateMenuItemModal
        isOpen={updateMenuProps.isOpen}
        onClose={updateMenuProps.onClose}
        itemId={updateMenuProps.itemId}
      />
    </>
  );
}

export default Menu;
