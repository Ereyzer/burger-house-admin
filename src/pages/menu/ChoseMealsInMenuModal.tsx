import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  type TypographyStyle,
} from '@mui/material';
import { useState } from 'react';
import ChoosenMealList from './ChoosenMealList';

const OpenMOdalButtonStyle: TypographyStyle = {
  marginBottom: '10px',
};

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
interface Meal {
  id: number;
  name: string;
  price: number;
}
interface Props {
  buttonName: string;
  mealList: Meal[];
  setCheckedList: (list: number[]) => void;
  checkedList: number[];
  addTotal: (price: number) => void;
  minusTotal: (price: number) => void;
  total: number;
}

function ChooseMealsInMenuModal(props: Props) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<number[]>(() => props.checkedList.map(id => id));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (value: number, price: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      props.addTotal(price);
    } else {
      newChecked.splice(currentIndex, 1);
      props.minusTotal(price);
    }

    setChecked(newChecked);
  };

  const handleSave = () => {
    // props.setCheckedList(
    //   // checked.length > 0 ? props.mealList.filter(({ id }) => checked.includes(id)) : [],
    // );
    props.setCheckedList([...checked]);
    handleClose();
  };
  // useEffect(() => {
  //   let total = 0;
  //   drinks.forEach(item => {
  //     total = Number.parseFloat((total + item.price).toFixed(2));
  //   });
  //   setTotalDrinksPrice(total);
  // }, [drinks]);

  const choosenList = () => {
    const list = props.mealList.filter(({ id }) => {
      if (checked.includes(id)) {
        return true;
      } else {
        return false;
      }
    });

    return list;
  };
  return (
    <>
      <Button sx={OpenMOdalButtonStyle} onClick={handleOpen} variant="outlined">
        {props.buttonName}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
            {props.mealList.map(item => (
              <ListItem key={item.id}>
                <ListItemButton role={undefined} onClick={handleToggle(item.id, item.price)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.includes(item.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText>{item.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button onClick={handleClose}>Закрити</Button>
          <Button onClick={handleSave}>Додати</Button>
        </Box>
      </Modal>
      <ChoosenMealList totalPrice={props.total} list={choosenList()} />
    </>
  );
}

export default ChooseMealsInMenuModal;
