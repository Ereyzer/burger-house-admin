import { alpha, Box, Stack } from '@mui/material';
import SideMenu from '../../components/SideMenu';
import Header from '../../components/Header';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import Home from './Home.page';
import Drinks from '../drinks/Drinks.page';
import Dishes from '../dishes/Dishes.page';

function MainPage() {
  const position = useSelector((state: RootState) => state.navigate);
  const currentPage = () => {
    if (!position[0]?.menuId) return <Home />;
    switch (position[0].menuId) {
      case 'home':
        return <Home />;
      case 'drinks':
        return <Drinks />;
      case 'dishes':
        return <Dishes />;

      default:
        return <Home />;
    }
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      {/* <AppNavbar /> */}
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

          {currentPage()}
        </Stack>
      </Box>
    </Box>
  );
}

export default MainPage;
