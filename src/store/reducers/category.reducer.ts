import { createAsyncThunk, createSlice, type Action } from '@reduxjs/toolkit';
import { CategoryApi } from '../../api/services/categories';

interface Item {
  id: string;
  display_name: string;
}

interface InitialState {
  loaded: boolean;
  loading: boolean;
  errorMessage: string | null;
  items: Item[];
}

const initialState: InitialState = {
  loaded: false,
  loading: false,
  errorMessage: null,
  items: [],
};

const categoryApi = new CategoryApi();

export const getAllCategories = createAsyncThunk('category/getAll', async (_, thunkAPI) => {
  try {
    return await categoryApi.getAll();
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

const pendingCalback = (state: typeof initialState) => {
  state.loading = true;
};
const rejectedCalback = (state: typeof initialState, action: Action) => {
  state.loading = false;

  state.errorMessage = (action as { payload: string } & Action).payload;
};
const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: bilder => {
    bilder.addAsyncThunk(getAllCategories, {
      pending: pendingCalback,
      fulfilled: (state, action) => {
        state.loaded = true;
        state.loading = false;
        state.errorMessage = null;
        state.items = action.payload;
      },
      rejected: rejectedCalback,
    });
  },
});

export default slice.reducer;
