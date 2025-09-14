import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const position = useSelector((state: RootState) => state.navigate);
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {/* <Typography variant="body1">Dashboard</Typography> */}
      {position.map((pos, index) => (
        <Typography key={index} variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {pos.displayName}
        </Typography>
      ))}
    </StyledBreadcrumbs>
  );
}
