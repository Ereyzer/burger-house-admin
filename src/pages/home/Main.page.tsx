import { alpha, Box, Stack } from '@mui/material';
import SideMenu from '../../components/SideMenu';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import Home from './Home.page';
import Drinks from '../drinks/Drinks.page';
import Dishes from '../dishes/Dishes.page';
import Menu from '../menu/Menu.page';
import { useEffect, useRef, useState } from 'react';
import AboutPlace from '../aboutPlace/AboutPlace.page';

const currentPage = (menuId: string) => {
  switch (menuId) {
    case 'home':
      return <Home />;
    case 'drinks':
      return <Drinks />;
    case 'dishes':
      return <Dishes />;
    case 'menu':
      return <Menu />;
    case 'about':
      return <AboutPlace/>

    default:
      return <Home />;
  }
};

function MainPage() {
  const position = useSelector((state: RootState) => state.navigate[0]?.menuId);
  const [pageWithPosition, setPageWithPosition] = useState(<Home />);
  const firstLoad = useRef(true);

  useEffect(() => {
    if (!position) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    setPageWithPosition(currentPage(position));
  }, [position]);

  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />

      <Box
        component="main"
        sx={theme => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: 'auto',
        })}
      >
        <Stack
          spacing={5}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />

          {pageWithPosition}
        </Stack>
      </Box>
    </Box>
  );
}

export default MainPage;
