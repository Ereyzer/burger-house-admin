import { Box, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { MenuApi } from '../../api/services/menu';
import ChooseCategoryInMenuModal from './AddCategoryModal';
import { useAppSelector } from '../../store';
//TODO: need add all updates and image
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemId: number;
}
interface Category {
  id: string;
  display_name: string;
  description?: string | null;
}
// {"id":1,"name":"Coka Cola 0.5","price":19.99,"calories":100,"description":null}
interface MenuItem {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  onboard: boolean;
  calories: number;
  categories: Category[];
  // dishes: number[];
  // drinks: number[];
}

const menuApi = new MenuApi();

function UpdateMenuItemModal(props: Props) {
  const [item, setItem] = useState<MenuItem>({
    id: 0,
    title: '',
    subtitle: '',
    price: 0,
    onboard: false,
    calories: 0,
    categories: [], // dishes: number[];
    // drinks: number[];
  });
  const categoryList = useAppSelector(state => state.categories);
  const [categories, setCategories] = useState<string[]>([]);

  const addCategory = (category: string) => {
    menuApi.addCategory(props.itemId, category).then(data => {
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
    menuApi.rmCategory(props.itemId, category).then(data => {
      if (!data.affected) return;

      setItem(obj => {
        const categories = obj.categories.filter(({ id }) => id !== category);

        return { ...obj, categories };
      });
    });
  };

  const handleCategoryUpdate = (arr: string[]) => {
    const sameId: string[] = [];
    item?.categories.forEach(category => {
      if (arr.includes(category.id)) {
        sameId.push(category.id);
        return;
      } else {
        rmCategory(category.id);
        console.log(category);
      }
    });
    console.log(sameId);
    arr.forEach(id => {
      if (sameId.includes(id)) {
        return;
      }
      addCategory(id);
    });
  };

  useEffect(() => {
    (async () => {
      if (!props.itemId) return;
      const data = await menuApi.getOneById(props.itemId);
      setItem(() => ({ ...data }));
    })();
  }, [props]);

  useEffect(() => {
    if (!item) return;
    setCategories([...item.categories.map(({ id }) => id)]);
  }, [item]);
  return (
    <>
      <Modal open={props.isOpen && !!item.id} onClose={props.onClose}>
        <Box sx={style}>
          <Typography variant="h3" sx={{ textAlign: 'center' }}>
            {item?.title} {item?.subtitle}
          </Typography>
          <Box>
            <ChooseCategoryInMenuModal
              buttonName="Оновити категорії"
              categoryList={categoryList.items}
              setCheckedList={handleCategoryUpdate}
              checkedList={categories}
            />
          </Box>
          {/* <Typography>{JSON.stringify(item)}</Typography> */}
        </Box>
      </Modal>
    </>
  );
}

export default UpdateMenuItemModal;
