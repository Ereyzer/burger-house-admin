import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import LocalDrinkRoundedIcon from '@mui/icons-material/LocalDrinkRounded';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changePosition } from '../store/reducers/naviagation.reducer';
import LunchDiningRoundedIcon from '@mui/icons-material/LunchDiningRounded';

const mainListItems = [
  { id: 'home', text: 'Головна', icon: <HomeRoundedIcon /> },
  { id: 'drinks', text: 'Напої', icon: <LocalDrinkRoundedIcon /> },
  { id: 'dishes', text: 'Страви', icon: <LunchDiningRoundedIcon /> },
  // { text: 'Analytics', icon: <AnalyticsRoundedIcon /> },
  //   { text: 'Clients', icon: <PeopleRoundedIcon /> },
  //   { text: 'Tasks', icon: <AssignmentRoundedIcon /> },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const [selected, setSelected] = useState(0);
  const dispatch = useDispatch();
  const handleMenuChose = (index: number) => {
    setSelected(index);
  };
  useEffect(() => {
    dispatch(
      changePosition({
        menuId: mainListItems[selected].id,
        displayName: mainListItems[selected].text,
      }),
    );
  }, [selected, dispatch]);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ display: 'block' }}
            onClick={() => handleMenuChose(index)}
          >
            <ListItemButton selected={index === selected}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
