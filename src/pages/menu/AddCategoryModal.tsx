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
interface Category {
  id: string;
  display_name: string;
}
interface Props {
  buttonName: string;
  categoryList: Category[];
  setCheckedList: (list: string[]) => void;
  checkedList: string[];
}

function ChooseCategoryInMenuModal(props: Props) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>(() => props.checkedList.map(id => id));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSave = () => {
    props.setCheckedList([...checked]);
    handleClose();
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
            {props.categoryList.map(item => (
              <ListItem key={item.id}>
                <ListItemButton role={undefined} onClick={handleToggle(item.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.includes(item.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText>{item.display_name}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button onClick={handleClose}>Закрити</Button>
          <Button onClick={handleSave}>Оновити</Button>
        </Box>
      </Modal>
      <List
        sx={{
          width: '100%',
          maxWidth: '600px',
          minHeight: '35px',
          borderStyle: 'solid',
          borderWidth: '1px',
          borderColor: 'grey',
        }}
      >
        {checked.map(id => {
          return (
            <ListItem key={id}>
              <ListItemText>
                {props.categoryList.find(item => item.id === id)?.display_name}
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
    </>
  );
}

export default ChooseCategoryInMenuModal;
