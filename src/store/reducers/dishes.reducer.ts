import { createAsyncThunk, createSlice, type Action } from '@reduxjs/toolkit';
import { DishApi } from '../../api/dishes';
import type { CreateDishDto } from '../../dto/dish.dto';

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

const dishApi = new DishApi();

export const getAllDishes = createAsyncThunk('dish/getAll', async (_, thunkAPI) => {
  try {
    return await dishApi.getAll();
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const updateDishPrice = createAsyncThunk(
  'dish/updatePrice',
  async ({ id, price }: { id: number; price: number }, thunkAPI) => {
    try {
      return await dishApi.updatePrice(id, price);
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  },
);

export const addDish = createAsyncThunk('dish/add', async (data: CreateDishDto, thunkAPI) => {
  try {
    return await dishApi.addItem<CreateDishDto>(data);
  } catch (e) {
    console.log('errrrrrrrrrrroooor: ', e);

    return thunkAPI.rejectWithValue((e as Error).message);
  }
});

export const rmDish = createAsyncThunk('dish/rmDrink', async (data: number, thunkAPI) => {
  try {
    return await dishApi.rmItem(data);
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
  name: 'dish',
  initialState,
  reducers: {},
  extraReducers: bilder => {
    bilder.addAsyncThunk(getAllDishes, {
      pending: pendingCalback,
      fulfilled: (state, action) => {
        state.loaded = true;
        state.loading = false;
        state.errorMessage = null;
        state.items = action.payload;
      },
      rejected: rejectedCalback,
    });

    bilder.addAsyncThunk(updateDishPrice, {
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
    bilder.addAsyncThunk(addDish, {
      pending: pendingCalback,
      fulfilled: (state, action) => {
        state.loading = false;
        state.errorMessage = null;
        state.items.push(action.payload);
      },
      rejected: rejectedCalback,
    });
    bilder.addAsyncThunk(rmDish, {
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
