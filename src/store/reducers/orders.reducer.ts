import { createAsyncThunk, createSlice, type Action } from '@reduxjs/toolkit';
import { OrdersApi } from '../../api/services/orders';
import type { PaymentMethod, Status } from '../../components/orders/types';

interface Selection {
  menu_id: number;
  quantity: number;
  selection: {
    id: number;
    title: string;
    subtitle: string;
    price: number;
  };
}

export interface FullOrder {
  id: number;
  amount: number;
  payment: PaymentMethod;
  phone: string;
  customerName: string;
  delivery: boolean;
  street: '';
  status: Status;
  addressFull: string;
  addressClarification: string;
  description?: string | null;
  createdAt: Date;
  selections: Selection[];
}

export interface OrderItem {
  id: string;
  status: Status;
  customerName: string;
  phone: string;
  delivery: boolean;
  createdAt: Date;
}

interface Oreders {
  items: OrderItem[];
  totalItems: number;
  perPage: number;
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

interface InitialState {
  loaded: boolean;
  loading: boolean;
  errorMessage: string | null;
  orders: Oreders;
}
const initialState: InitialState = {
  loaded: false,
  loading: false,
  errorMessage: null,
  orders: {
    items: [],
    totalItems: 0,
    perPage: 10,
    page: 1,
    totalPages: 0,
    hasPrevPage: false,
    hasNextPage: false,
  },
};

const ordersApi = new OrdersApi();

export const getAllOrders = createAsyncThunk(
  'menu/getAllOrders',
  async ({ page, perPage }: { page: number; perPage: number }, thunkAPI) => {
    try {
      return ordersApi.getAllOrders(page, perPage);
    } catch (e) {
      return thunkAPI.rejectWithValue((e as Error).message);
    }
  },
);

// export const getOrderById = createAsyncThunk(
//   'menu/getOrderById',
//   async (data: number, thunkAPI) => {
//     try {
//       return ordersApi.getOneById(data);
//     } catch (e) {
//       return thunkAPI.rejectWithValue((e as Error).message);
//     }
//   },
// );
export const updateOrderStatus = createAsyncThunk(
  'menu/updateOrderStatus',
  async ({ id, status }: { id: string; status: Status }, thunkAPI) => {
    try {
      return ordersApi.changeOrderStatus(id, status);
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
  name: 'orders',
  initialState,
  reducers: {
    pushNewOrder: (state, action) => {
      //   state.loaded = true;
      //   state.loading = false;
      //   state.errorMessage = null;
      state.orders = { ...state.orders, items: [action.payload, ...state.orders.items] };
    },
  },
  extraReducers(builder) {
    builder.addAsyncThunk(getAllOrders, {
      pending: pendingCalback<typeof initialState>(),
      fulfilled: (state, action) => {
        state.loaded = true;
        state.loading = false;
        state.errorMessage = null;
        state.orders = action.payload;
      },
      rejected: rejectedCalback,
    });
    builder.addAsyncThunk(updateOrderStatus, {
      pending: pendingCalback<typeof initialState>(),
      fulfilled: (state, action) => {
        const { id, status } = action.payload as { id: string; status: Status };

        state.loaded = true;
        state.loading = false;
        state.errorMessage = null;
        state.orders.items = state.orders.items.map(order => {
          if (order.id !== id) return order;

          order.status = status;
          return order;
        });
      },
      rejected: rejectedCalback,
    });
  },
});

export const { pushNewOrder } = slice.actions;

export default slice.reducer;
