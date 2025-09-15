import { useEffect, useState, type ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { addDish } from '../../store/reducers/dishes.reducer';

const styleModalAddDrink = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
interface Props {
  handleClose: () => void;
  isOpen?: boolean;
}

const regExp = new RegExp(/^(([0-9]{0,3})|([0-9]{1,3}(\.[0-9]{0,2})?))$/);
function AddDishModal({ isOpen = true, handleClose }: Props) {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [price, setPrice] = useState('0.01');
  const [priceError, setPriceError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const dispatch = useAppDispatch();
  const { errorMessage, loading } = useAppSelector(state => state.dishes);

  const handleSetPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const string = e.currentTarget.value;

    if (string.match(regExp)) {
      setPrice(string);
    }
    return;
  };
  const submitWithValidation = () => {
    const testName = typeof name !== 'string' || name.length < 1;
    const testPrice = !price.match(regExp) || price.length === 0;
    const testDescription = typeof description !== 'string';

    if (testName) {
      setNameError('Назва є обовязковою');
    } else {
      setNameError('');
    }
    if (testPrice) {
      setPriceError('Ціна повинна бути від 0.01 до 999.01');
    } else {
      setPriceError('');
    }

    if (testDescription) {
      setDescriptionError('Щось взагалі не то ввели.');
    } else {
      setDescriptionError('');
    }
    if (testName || testPrice || testDescription) return;
    const obj: {
      name: string;
      price: number;
      description?: string;
    } = {
      name,
      price: Number.parseFloat(price),
    };
    // if (description.length > 0) obj.description = description;
    dispatch(addDish(obj));
  };

  const [observer, setObserer] = useState(false);
  useEffect(() => {
    if (loading) {
      setObserer(true);
    }
  }, [loading]);
  useEffect(() => {
    if (!loading && observer) {
      if (!errorMessage) {
        setObserer(false);
        handleClose();
        return;
      } else {
        const code = errorMessage.split(' ');
        if (code[code.length - 1] === '409') {
          setNameError('Ця страва вже є у списку');
        }
      }
    }
  }, [loading, observer, errorMessage, handleClose]);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={styleModalAddDrink}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Додати Страву
        </Typography>
        <FormGroup>
          <FormControl>
            <FormLabel htmlFor="name">Назва</FormLabel>
            <TextField
              error={nameError.length > 0}
              helperText={nameError}
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={e => setName(e.currentTarget.value)}
            ></TextField>
            <FormLabel htmlFor="price">Ціна</FormLabel>
            <TextField
              error={priceError.length > 0}
              helperText={priceError}
              id="price"
              name="price"
              type="decimal"
              slotProps={{
                htmlInput: {
                  min: 0.01,
                  max: 999.99,
                },
              }}
              value={price}
              onChange={handleSetPrice}
            ></TextField>
            <FormLabel htmlFor="description">Опис</FormLabel>
            <TextField
              error={descriptionError.length > 0}
              helperText={descriptionError}
              id="description"
              name="description"
              multiline
              value={description}
              onChange={e => setDescription(e.currentTarget.value)}
            />
          </FormControl>
        </FormGroup>
        <Button type="button" onClick={submitWithValidation}>
          Зберегти
        </Button>
      </Box>
    </Modal>
  );
}

export default AddDishModal;
