import { configureStore } from '@reduxjs/toolkit';
import rememberMeReduser from './reducers/rememberMe.reducer';
import userReducer from './reducers/user.reducer';
import { useDispatch, useSelector } from 'react-redux';
import navigateReducer from './reducers/naviagation.reducer';
import drinksReducer from './reducers/drinks.reducer';
import dishReducer from './reducers/dishes.reducer';

export const store = configureStore({
  reducer: {
    rememberMe: rememberMeReduser,
    user: userReducer,
    navigate: navigateReducer,
    drinks: drinksReducer,
    dishes: dishReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
