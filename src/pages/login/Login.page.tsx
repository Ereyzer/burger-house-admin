import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ThemeSwitcher from '../../components/shared-theme/ThemSwitcher';
import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { myDebounce } from '../../utils/debounce-and-trottle';
import ForgotPassword from '../../components/auth/ForgotPassword';
import { switchRememberMe } from '../../store/reducers/rememberMe.reducer';
import { loginUser } from '../../store/reducers/user.reducer';
import { useAppDispatch, useAppSelector } from '../../store';
import { Navigate } from 'react-router-dom';
import { BaseApi } from '../../api/initial-class';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));
interface localValidator {
  (field: string, errorFunction: React.Dispatch<React.SetStateAction<string>>): void;
}

const validateFields: localValidator = (email, setEmailErrorMessage) => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    setEmailErrorMessage('Please enter a valid email address.');
  } else {
    setEmailErrorMessage('');
  }
};
const validatePasswrd: localValidator = (password, setPasswordErrorMessage) => {
  if (!password || password.length < 8) {
    setPasswordErrorMessage('Password must be at least 6 characters long.');
  } else {
    setPasswordErrorMessage('');
  }
};

const valideteEmailWithDebounce = myDebounce<localValidator>(validateFields);
const validatePasswordWithDebounce = myDebounce<localValidator>(validatePasswrd);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isValidFields, setIsValidFields] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const isMountedEmail = useRef(false);
  const isMountedPassword = useRef(false);
  const [open, setOpen] = useState(false);
  const rememberMe = useAppSelector(state => state.rememberMe);
  const { loading: loginWaiting, user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then(({ payload }) => {
      if (rememberMe) {
        localStorage.setItem('at', payload.at);
      } else {
        sessionStorage.setItem('at', payload.at);
      }
      BaseApi.instance.token = payload.at;
    });
  };

  useEffect(() => {
    if (!isMountedEmail.current) {
      isMountedEmail.current = true;
      return;
    }

    valideteEmailWithDebounce(email, setEmailErrorMessage);
  }, [email]);

  useEffect(() => {
    if (!isMountedPassword.current) {
      isMountedPassword.current = true;
      return;
    }

    validatePasswordWithDebounce(password, setPasswordErrorMessage);
  }, [password]);

  useEffect(() => {
    if (!email.length || !password.length) return;

    if (!emailErrorMessage.length && !passwordErrorMessage.length) {
      setIsValidFields(true);
    } else {
      setIsValidFields(false);
    }
  }, [email, password, emailErrorMessage, passwordErrorMessage]);
  const emailError = emailErrorMessage.length > 0;
  const passwordError = passwordErrorMessage.length > 0;

  const isSignInDisabled = (): boolean => {
    if (!isValidFields) return isValidFields;

    return loginWaiting ? true : false;
  };

  if (!user)
    return (
      <>
        <SignInContainer direction="column" justifyContent="space-beatween">
          <ThemeSwitcher sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
          <Card variant="outlined">
            {
              //TODO: our logo
            }

            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
              Вхід
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? 'error' : 'primary'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                ></TextField>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="••••••"
                  type={isVisible ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? 'error' : 'primary'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="text"
                            onClick={() => setIsVisible(old => !old)}
                            sx={{
                              borderRadius: '50%',
                              px: 2,
                              fontSize: '0.8rem',
                            }}
                          >
                            {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </Button>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={rememberMe}
                    onChange={() => dispatch(switchRememberMe())}
                  />
                }
                label="Запамятай мене"
              />
              <ForgotPassword open={open} handleClose={handleClose} />
              <Button type="submit" fullWidth variant="contained" disabled={isSignInDisabled()}>
                {loginWaiting ? <CircularProgress /> : 'Війти'}
              </Button>
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Забули ваш пароль?
              </Link>
            </Box>
          </Card>
        </SignInContainer>
      </>
    );

  return <Navigate to="/" replace={true} />;
}

export default Login;
