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
import type { DeliveryPrice } from './interface';
import { useState } from 'react';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BeforeDeleteDialog from '../../components/agreeDialog/BeforeDeleteDialog';

interface Props {
  prices: DeliveryPrice[];
  addDeliveryPrice: (newPrice: Omit<DeliveryPrice, 'id'>) => void;
  rmDeliveryPrice: (id: string) => void;
}

function DeliveryPriceList({ prices, addDeliveryPrice, rmDeliveryPrice }: Props) {
  const [distamce, setDistance] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [deliveryPrice, setDeiveryPrice] = useState('');
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

    rmDeliveryPrice(removingId);
    handleClose();
  };

  return (
    <>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Відстань до:</TableCell>
                <TableCell>Мінімальне замовлення</TableCell>
                <TableCell>Ціна доставки</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    type="number"
                    value={distamce}
                    onChange={({ target }) =>
                      setDistance(Number(target.value) <= 0 ? '0' : target.value)
                    }
                    slotProps={{
                      htmlInput: {
                        step: 500,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={minOrder}
                    onChange={({ target }) =>
                      setMinOrder(Number(target.value) <= 0 ? '0' : target.value)
                    }
                    slotProps={{
                      htmlInput: {
                        step: 50,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={deliveryPrice}
                    onChange={({ target }) =>
                      setDeiveryPrice(Number(target.value) <= 0 ? '0' : target.value)
                    }
                    slotProps={{
                      htmlInput: {
                        step: 25,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      addDeliveryPrice({
                        distance: Number(distamce),
                        minOrder: Number(minOrder),
                        deliveryPrice: Number(minOrder),
                      })
                    }
                  >
                    <AddCircleOutlineRoundedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              {prices.map(({ id, distance, minOrder, deliveryPrice }) => (
                <TableRow key={id}>
                  <TableCell>{distance}</TableCell>
                  <TableCell>{minOrder}</TableCell>
                  <TableCell>{deliveryPrice}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(id)}>
                      <DeleteRoundedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <BeforeDeleteDialog
        open={isRemoving}
        handleApprove={handleDelete}
        onClose={handleClose}
        title="Зона доставки"
      />
    </>
  );
}

export default DeliveryPriceList;
