import { createAsyncThunk, createSlice, type Action } from '@reduxjs/toolkit';
import { DrinksApi } from '../../api/drinks';

interface Item {
  id: number;
  name: string;
  price: number;
  calories: number;
  description?: string;
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

const drinksApi = new DrinksApi();

export const getAllDrinks = createAsyncThunk('drinks/getAll', async (_, thunkAPI) => {
  try {
    return await drinksApi.getAll();
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const updateDrinkPrice = createAsyncThunk(
  'drinks/updatePrice',
  async ({ id, price }: { id: number; price: number }, thunkAPI) => {
    try {
      return await drinksApi.updatePrice(id, price);
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  },
);

export const addDrink = createAsyncThunk('drinks/add', async (data: Omit<Item, 'id'>, thunkAPI) => {
  try {
    return await drinksApi.addDrink(data.name, data.price, data.calories, data.description);
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const rmDrink = createAsyncThunk('drinks/rmDrink', async (data: number, thunkAPI) => {
  try {
    return await drinksApi.rmDrink(data);
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
  name: 'drinks',
  initialState,
  reducers: {},
  extraReducers: bilder => {
    bilder.addAsyncThunk(getAllDrinks, {
      pending: pendingCalback,
      fulfilled: (state, action) => {
        state.loaded = true;
        state.loading = false;
        state.errorMessage = null;
        state.items = action.payload;
      },
      rejected: rejectedCalback,
    });
    bilder.addAsyncThunk(updateDrinkPrice, {
      pending: pendingCalback,
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
    bilder.addAsyncThunk(addDrink, {
      pending: pendingCalback,
      fulfilled: (state, action) => {
        state.loading = false;
        state.errorMessage = null;
        state.items.push(action.payload);
      },
      rejected: rejectedCalback,
    });
    bilder.addAsyncThunk(rmDrink, {
      pending: pendingCalback,
      fulfilled: (state, action) => {
        state.loading = false;
        state.errorMessage = null;
        state.items = state.items.filter(({ id }) => id !== action.meta.arg);
      },
      rejected: rejectedCalback,
    });
  },
});

export default slice.reducer;
