import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/cssjs.tsx';
import App from './App.tsx';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import AppTheme from './components/shared-theme/AppTheme.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <AppTheme>
        <BrowserRouter>
          <CssBaseline enableColorScheme />
          <App />
        </BrowserRouter>
      </AppTheme>
    </StyledEngineProvider>
  </Provider>,
  // </StrictMode>,
);
