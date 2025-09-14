import { createSlice } from '@reduxjs/toolkit';

interface NavPosition {
  menuId: string;
  displayName: string;
}
const initialState: NavPosition[] = [];

const slice = createSlice({
  name: 'navigate',
  initialState,
  reducers: {
    changePosition: (_, action) => {
      return [action.payload];
    },
  },
});
export const { changePosition } = slice.actions;
export default slice.reducer;
