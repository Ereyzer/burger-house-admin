import { Box, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { MenuApi } from '../../api/services/menu';
import ChooseCategoryInMenuModal from './AddCategoryModal';
import { useAppSelector } from '../../store';
import AddMealinUpdateMenuModal from './AddMealinUpdateMenu';
import AddImageMenu from './AddImageMenu';
//TODO: need add all updates and image
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxHeight: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  overflow: 'scroll',
};
// const styleModal: TypographyStyle = {
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: '24',
//   p: '4',
//   padding: '10px',
//   display: 'flex',
//   flexDirection: 'column',
//   gap: '10px',
//   overflow: 'scroll',
// };
export interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}
interface Category {
  id: string;
  display_name: string;
  description?: string | null;
}
// {"id":1,"name":"Coka Cola 0.5","price":19.99,"calories":100,"description":null}
interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  onboard: boolean;
  calories: number;
  categories: Category[];
  image_medium: string | null;
  dishes: { id: string }[];
  drinks: { id: string }[];
}

const menuApi = new MenuApi();

const handleCategoryUpdate =
  (item: MenuItem, addCategory: (id: string) => void, rmCategory: (id: string) => void) =>
  (arr: string[]) => {
    const sameId: string[] = [];
    item?.categories.forEach(category => {
      if (arr.includes(category.id)) {
        sameId.push(category.id);
        return;
      } else {
        rmCategory(category.id);
      }
    });
    arr.forEach(id => {
      if (sameId.includes(id)) {
        return;
      }
      addCategory(id);
    });
  };

const handleMealUpdate =
  (items: { id: string }[], addItem: (id: string) => void, rmItem: (id: string) => void) =>
  (arr: string[]) => {
    const sameId: string[] = [];
    items.forEach(item => {
      if (arr.includes(item.id)) {
        sameId.push(item.id);
        return;
      } else {
        rmItem(item.id);
      }
    });
    arr.forEach(id => {
      if (sameId.includes(id)) {
        return;
      }
      addItem(id);
    });
  };

function UpdateMenuItemModal({ isOpen, onClose, itemId }: Props) {
  const [item, setItem] = useState<MenuItem>({
    id: '',
    title: '',
    subtitle: '',
    price: 0,
    onboard: false,
    calories: 0,
    categories: [],
    image_medium: null,
    dishes: [],
    drinks: [],
  });
  const categoryList = useAppSelector(state => state.categories);
  const [categories, setCategories] = useState<string[]>([]);
  const drinkList = useAppSelector(state => state.drinks);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [totalDrinksPrice, setTotalDrinksPrice] = useState(0);
  const dishList = useAppSelector(state => state.dishes);
  const [dishes, setDishes] = useState<string[]>([]);
  const [totalDishesPrice, setTotalDishesPrice] = useState(0);

  const addCategory = (category: string) => {
    menuApi.addCategory(itemId, category).then(data => {
      setItem(obj => {
        const newCategory = categoryList.items.find(({ id }) => id === data.category_id);
        const categories = !newCategory ? [...obj.categories] : [...obj.categories, newCategory];

        return {
          ...obj,
          categories,
        };
      });
      return data;
    });
  };

  const rmCategory = (category: string) => {
    menuApi.rmCategory(itemId, category).then(data => {
      if (!data.affected) return;

      setItem(obj => {
        const categories = obj.categories.filter(({ id }) => id !== category);

        return { ...obj, categories };
      });
    });
  };

  const addDrinks = (drinkId: string) => {
    menuApi.addDrink(itemId, drinkId).then(data => {
      if (!data.affected) return;

      setItem(obj => {
        const newDrink = drinkList.items.find(({ id }) => id === data.drink_id);
        const drinks = !newDrink ? [...obj.drinks] : [...obj.drinks, newDrink];

        return {
          ...obj,
          drinks,
        };
      });
    });
  };

  const rmDrinks = (drinkId: string) => {
    menuApi.rmDrink(itemId, drinkId).then(data => {
      if (!data.affected) return;
      setItem(obj => {
        const drinks = obj.drinks.filter(({ id }) => id !== drinkId);

        return {
          ...obj,
          drinks,
        };
      });
    });
  };

  const addDishes = (dishId: string) => {
    menuApi.addDish(itemId, dishId).then(data => {
      if (!data.affected) return;

      setItem(obj => {
        const newDish = dishList.items.find(({ id }) => id === data.dish_id);
        const dishes = !newDish ? [...obj.dishes] : [...obj.dishes, newDish];

        return {
          ...obj,
          dishes,
        };
      });
    });
  };

  const rmDishes = (dishId: string) => {
    menuApi.rmDish(itemId, dishId).then(data => {
      if (!data.affected) return;
      setItem(obj => {
        const dishes = obj.dishes.filter(({ id }) => id !== dishId);

        return {
          ...obj,
          dishes,
        };
      });
    });
  };

  useEffect(() => {
    (async () => {

      if (!itemId) return;

      const data = await menuApi.getOneById(itemId);
      setItem(() => ({ ...data }));
      interface IdType {
        id: number;
        price: number;
      }
      let totalDrinksPriceTmp = 0;
      setDrinks([
        ...data.drinks.map(({ id, price }: IdType) => {
          totalDrinksPriceTmp = totalDrinksPriceTmp + price;
          return id;
        }),
      ]);
      setTotalDrinksPrice(totalDrinksPriceTmp);
      setCategories([...data.categories.map(({ id }: { id: string }) => id)]);

      let totalDishesPriceTmp = 0;
      setDishes([
        ...data.dishes.map(({ id, price }: IdType) => {
          totalDishesPriceTmp = totalDishesPriceTmp + price;
          return id;
        }),
      ]);

      setTotalDishesPrice(totalDishesPriceTmp);
    })();
  }, [itemId]);

  const handleClose = () => {
    onClose();
  };

  const mealName = item?.title + ' ' + item?.subtitle;
  return (
    <>
      <Modal open={isOpen && !!item.id} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h3" sx={{ textAlign: 'center' }}>
            {mealName}
          </Typography>
          <Box>
            <AddImageMenu imgUrl={item.image_medium} name={mealName} itemId={itemId} />
          </Box>
          <Box>
            <ChooseCategoryInMenuModal
              buttonName="Оновити категорії"
              categoryList={categoryList.items}
              setCheckedList={handleCategoryUpdate(item, addCategory, rmCategory)}
              checkedList={categories}
            />
          </Box>
          <Box>
            <AddMealinUpdateMenuModal
              buttonName="Оновити напої"
              mealList={drinkList.items}
              checkedList={drinks}
              setCheckedList={handleMealUpdate(item.drinks, addDrinks, rmDrinks)}
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
            <AddMealinUpdateMenuModal
              buttonName="Оновити страви"
              mealList={dishList.items}
              checkedList={dishes}
              setCheckedList={handleMealUpdate(item.dishes, addDishes, rmDishes)}
              addTotal={(p: number) => {
                setTotalDishesPrice(price => price + p);
              }}
              minusTotal={(p: number) => {
                setTotalDishesPrice(price => price - p);
              }}
              total={totalDishesPrice}
            />
          </Box>

          {/* <Typography>{JSON.stringify(item)}</Typography> */}
        </Box>
      </Modal>
    </>
  );
}

export default UpdateMenuItemModal;
