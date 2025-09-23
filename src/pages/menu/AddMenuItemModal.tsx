import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Modal,
  TextField,
  type TypographyStyle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ChooseMealsInMenuModal from './ChoseMealsInMenuModal';
import { useAppDispatch, useAppSelector } from '../../store';
import { getAllDrinks } from '../../store/reducers/drinks.reducer';
import { getAllDishes } from '../../store/reducers/dishes.reducer';
import { getAllCategories } from '../../store/reducers/category.reducer';
import ChooseCategoryInMenuModal from './AddCategoryModal';
import { addNewMenuItem } from '../../store/reducers/menu.reducer';

const styleModal: TypographyStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxHeight: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: '24',
  p: '4',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  overflow: 'scroll',
};

interface Props {
  isOpen: boolean;
  handleClose: () => void;
}

const priceFormula = (cost: number): number => {
  const price = (cost * 3.34).toFixed(2);
  return Number.parseFloat(price);
};

function AddMenuItemModal({ isOpen = true, handleClose }: Props) {
  const drinkList = useAppSelector(state => state.drinks);
  const dishList = useAppSelector(state => state.dishes);
  const categoryList = useAppSelector(state => state.categories);
  const menuList = useAppSelector(state => state.menu);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const isTitleError = titleError.length > 0;
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState(0.01);
  const [onboard, setOnboard] = useState(false);
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [drinks, setDrinks] = useState<number[]>([]);
  const [totalDrinksPrice, setTotalDrinksPrice] = useState(0);
  const [dishes, setDishes] = useState<number[]>([]);
  const [totalDishPrice, setTotalDishPrice] = useState(0);

  const dispatch = useAppDispatch();

  const spend = Number.parseFloat((totalDrinksPrice + totalDishPrice).toFixed(2));
  useEffect(() => {
    if (!drinkList.loaded) {
      dispatch(getAllDrinks());
    }
    if (!dishList.loaded) {
      dispatch(getAllDishes());
    }
    if (!categoryList.loaded) {
      dispatch(getAllCategories());
    }
  }, [dispatch, drinkList, dishList, categoryList]);

  const handlePriceNumber = (value: string) => {
    const price = Number.parseFloat(value);
    setPrice(price);
  };

  const handleSaveItem = () => {
    const cal = calories || undefined;
    console.log(cal);

    dispatch(
      addNewMenuItem({
        title,
        subtitle,
        price,
        onboard,
        categories,
        drinks,
        dishes,
        description,
        calories: cal,
      }),
    );
  };

  const [observer, setObserer] = useState(false);

  useEffect(() => {
    if (menuList.loading) {
      setObserer(true);
    }
  }, [menuList.loading]);

  useEffect(() => {
    if (!menuList.loading && observer) {
      if (!menuList.errorMessage) {
        setObserer(false);
        handleClose();
        return;
      } else {
        const code = menuList.errorMessage.split(' ');
        if (code[code.length - 1] === '409') {
          setTitleError('Ця страва вже є у списку');
        }
        if (code[code.length - 1] === '422') {
          setTitleError('Заповніть усі поля');
        }
      }
    }
  }, [menuList.loading, observer, menuList.errorMessage, handleClose]);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={styleModal}>
        <FormControl>
          <FormLabel htmlFor="title">Назва страви</FormLabel>
          <TextField
            error={isTitleError}
            helperText={titleError}
            id="title"
            value={title}
            onChange={e => setTitle(e.currentTarget.value)}
            sx={{ maxWidth: '350px' }}
          ></TextField>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="subTitle">Уточнююча назва страви</FormLabel>
          <TextField
            error={isTitleError}
            helperText={titleError}
            id="subTitle"
            value={subtitle}
            onChange={e => setSubtitle(e.currentTarget.value)}
            sx={{ maxWidth: '350px' }}
          ></TextField>
        </FormControl>
        <Box>
          <ChooseMealsInMenuModal
            buttonName="Додати напої"
            mealList={drinkList.items}
            checkedList={drinks}
            setCheckedList={setDrinks}
            addTotal={(p: number) => {
              setTotalDrinksPrice(price => price + p);
            }}
            minusTotal={(p: number) => {
              setTotalDrinksPrice(price => price - p);
            }}
            total={totalDrinksPrice}
          />
        </Box>
        <Box>
          <ChooseMealsInMenuModal
            buttonName="Додати страви"
            mealList={dishList.items}
            checkedList={dishes}
            setCheckedList={setDishes}
            addTotal={(p: number) => {
              setTotalDishPrice(price => price + p);
            }}
            minusTotal={(p: number) => {
              setTotalDishPrice(price => price - p);
            }}
            total={totalDishPrice}
          />
        </Box>
        <FormControl>
          <FormLabel htmlFor="price">{`Сума витрат ${spend} рекомендована ціна ${priceFormula(
            spend,
          )}`}</FormLabel>
          <TextField
            id="price"
            value={price}
            onChange={e => handlePriceNumber(e.currentTarget.value)}
            type="number"
            sx={{ maxWidth: '200px' }}
          ></TextField>
        </FormControl>

        <Box>
          <ChooseCategoryInMenuModal
            buttonName="Обрати категорію"
            categoryList={categoryList.items}
            setCheckedList={setCategories}
            checkedList={categories}
          />
        </Box>
        <FormControl>
          <FormLabel htmlFor="calories">Приблизна кількість калорій</FormLabel>
          <TextField
            id="calories"
            value={calories || undefined}
            type="number"
            onChange={e => setCalories(Number(e.currentTarget.value))}
            sx={{ maxWidth: '200px' }}
          ></TextField>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="description">Опис</FormLabel>
          <TextField
            id="description"
            value={description}
            multiline={true}
            minRows={2}
            maxRows={10}
            type="string"
            onChange={e => setDescription(e.currentTarget.value)}
            sx={{ maxWidth: '600px' }}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="onboard">
            {
              <Checkbox
                id="onboard"
                checked={onboard}
                onChange={() => setOnboard(value => !value)}
              />
            }
            В наявності?
          </FormLabel>
        </FormControl>
        <Box sx={{ alignSelf: 'flex-end' }}>
          <Button onClick={handleClose}>Закрити</Button>
          <Button onClick={handleSaveItem}>Зберегти</Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddMenuItemModal;
