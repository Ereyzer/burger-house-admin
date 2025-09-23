import { createAsyncThunk, createSlice, type Action } from '@reduxjs/toolkit';
import { MenuApi } from '../../api/services/menu';
import type { AddMenuItemDto, UpdateMenuItemDto } from '../../dto/addMenuItem.dto';

interface Item {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  onboard: boolean;
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

const menuApi = new MenuApi();

export const getAllMenu = createAsyncThunk('menu/getAll', async (_, thunkAPI) => {
  try {
    return await menuApi.getAll();
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const switchOnboard = createAsyncThunk(
  'menu/switchOnboard',
  async (data: { id: number }, thunkAPI) => {
    try {
      return await menuApi.changeOnboard(data.id);
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  },
);

export const updatemenuItemPrice = createAsyncThunk(
  'menu/updatePrice',
  async ({ id, price }: { id: number; price: number }, thunkAPI) => {
    try {
      return await menuApi.updatePrice(id, price);
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  },
);

export const rmMenuItem = createAsyncThunk('menu/rmItem', async (data: number, thunkAPI) => {
  try {
    return await menuApi.rmItem(data);
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const addNewMenuItem = createAsyncThunk(
  'menu/addItem',
  async (data: AddMenuItemDto, thunkAPI) => {
    try {
      return await menuApi.addItem(data);
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  },
);

export const updateMenuItem = createAsyncThunk(
  'menu/updateItem',
  async ({ id, ...data }: UpdateMenuItemDto, thunkAPI) => {
    try {
      return await menuApi.updateItem(id, data);
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  },
);

const pendingCalback =
  <T extends { loading: boolean }>() =>
  (state: T) => {
    state.loading = true;
  };
const rejectedCalback = (state: typeof initialState, action: Action) => {
  state.loading = false;

  state.errorMessage = (action as { payload: string } & Action).payload;
};

const slice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: bilder => {
    bilder.addAsyncThunk(getAllMenu, {
      pending: pendingCalback<typeof initialState>(),
      fulfilled: (state, action) => {
        state.loaded = true;
        state.loading = false;
        state.errorMessage = null;
        state.items = action.payload;
      },
      rejected: rejectedCalback,
    });
    bilder.addAsyncThunk(switchOnboard, {
      pending: pendingCalback<typeof initialState>(),
      fulfilled: (state, action) => {
        state.loaded = true;
        state.loading = false;
        state.errorMessage = null;
        if (action.payload.affected) {
          state.items = state.items.map(item => {
            if (item.id === action.meta.arg.id) {
              item.onboard = !item.onboard;
            }
            return item;
          });
        }
      },
      rejected: rejectedCalback,
    });
    bilder.addAsyncThunk(updatemenuItemPrice, {
      pending: pendingCalback<typeof initialState>(),
      fulfilled: (state, action) => {
        state.loading = false;
        state.errorMessage = null;
        if (action.payload.affected) {
          state.items = state.items.map(drink => {
            if (drink.id === action.meta.arg.id) {
              drink.price = action.meta.arg.price;
            }
            return drink;
          });
        }
      },
      rejected: rejectedCalback,
    });
    bilder.addAsyncThunk(rmMenuItem, {
      pending: pendingCalback<typeof initialState>(),
      fulfilled: (state, action) => {
        state.loading = false;
        state.errorMessage = null;
        state.items = state.items.filter(({ id }) => id !== action.meta.arg);
      },
      rejected: rejectedCalback,
    });
    bilder.addAsyncThunk(addNewMenuItem, {
      pending: pendingCalback<typeof initialState>(),
      fulfilled: (state, action) => {
        state.loading = false;
        state.errorMessage = null;
        state.items.push(action.payload);
      },
      rejected: rejectedCalback,
    });
    bilder.addAsyncThunk(updateMenuItem, {
      pending: pendingCalback<typeof initialState>(),
      fulfilled: (state, action) => {
        state.loading = false;
        state.errorMessage = null;
        console.log(action);

        // state.items
      },
      rejected: rejectedCalback,
    });
  },
});

export default slice.reducer;
