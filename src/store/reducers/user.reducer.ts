import { createAsyncThunk, createSlice, type Action } from '@reduxjs/toolkit';
import type { LoginUserDto } from '../../dto/login-user.dto';
import { UserApi } from '../../api/auth';

interface User {
  firstName: string | null;
  fatherName: string | null;
  LastName: string | null;
  picture: string | null;
}
const initialState: {
  loading: boolean;
  errorMessage: string | null;
  user: User | null;
} = {
  loading: false,
  errorMessage: null,
  user: null,
};

const apiUser = UserApi.instance;

export const loginUser = createAsyncThunk('user/login', async (data: LoginUserDto, thunkAPI) => {
  try {
    const response = await apiUser.login(data);
    return response;
  } catch (e) {
    return thunkAPI.rejectWithValue((e as Error).message);
  }
});
export const getLoggetUser = createAsyncThunk('user/getLogget', async (_, thunkAPI) => {
  try {
    const response = await apiUser.getLoggetUser();
    return response;
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
  name: 'user',
  initialState,
  reducers: {
    refreshToken: (state, action) => {
      return {
        ...state,
        user: action.payload.user,
      };
    },
  },
  extraReducers: bilder => {
    bilder.addAsyncThunk(loginUser, {
      pending: pendingCalback,
      fulfilled: (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.errorMessage = null;
      },
      rejected: rejectedCalback,
    });
    bilder.addAsyncThunk(getLoggetUser, {
      pending: pendingCalback,
      fulfilled: (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.errorMessage = null;
      },
      rejected: (state, action) => {
        console.log(action);

        state.loading = false;
        state.errorMessage = action.payload as string;
        // BaseApi.instance.token = null;
        // localStorage.removeItem('at');
        // sessionStorage.removeItem('at');
      },
    });
  },
  // extraReducers: (builder) => {
  // builder.addAsyncThunk(createAsyncThunk("user/login", apiUser.login), {});
  // },
});

// export const {} = slice.actions;
export default slice.reducer;
