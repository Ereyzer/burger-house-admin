import './css/App.css';
import Login from './pages/login/Login.page';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoaderPage from './components/auth/Loader';
import { useAppDispatch, useAppSelector } from './store';
import { BaseApi } from './api/initial-class';
import { getLoggetUser } from './store/reducers/user.reducer';
import MainPage from './pages/home/Main.page';

const HelloTime = 1000;
function App() {
  const [isLoading, setIsloading] = useState(true);
  const { user, loading, errorMessage } = useAppSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    setTimeout(() => {
      setIsloading(false);
    }, HelloTime);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user && !errorMessage) {
      const at = BaseApi.instance.token;
      if (!at) {
        navigate('/login', { replace: true });
      } else {
        dispatch(getLoggetUser());
      }
    } else if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate, dispatch, loading, errorMessage]);

  return (
    <>
      {isLoading ? (
        <LoaderPage />
      ) : (
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="login" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

export default App;
