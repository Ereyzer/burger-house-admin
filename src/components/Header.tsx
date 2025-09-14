import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ThemeSwitcher from './shared-theme/ThemSwitcher';
// import CustomDatePicker from './CustomDatePicker';
// import NavbarBreadcrumbs from './NavbarBreadcrumbs';
// import MenuButton from './MenuButton';
// import ColorModeIconDropdown from '.././theme/ColorModeIconDropdown';

// import Search from './Search';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        {/* <Search /> */}
        {/* <CustomDatePicker />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown /> */}
        <ThemeSwitcher sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      </Stack>
    </Stack>
  );
}
