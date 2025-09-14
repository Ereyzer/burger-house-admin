import { createSlice } from '@reduxjs/toolkit';

const initialState: boolean = true;

const slice = createSlice({
  name: 'rememberMe',
  initialState,
  reducers: {
    switchRememberMe: state => {
      return !state;
    },
  },
});

export const { switchRememberMe } = slice.actions;
export default slice.reducer;
