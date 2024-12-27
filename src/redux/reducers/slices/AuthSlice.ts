import { getInfoUser } from '@/api/api';
 
import { GetUserInfoByToken, login } from '@/api/api';
import { IAuthSlice } from '@/types/next-auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export const getInfoRedux = createAsyncThunk(
  'auth/getinfo',
  async (_, thunkAPI) => {
    const res = await getInfoUser();

    if (res?.statusCode === 200) {
      return res?.data;
    } else {
      return thunkAPI.rejectWithValue(res);
    }
  },
);
const initialState: any = {
  emailSentEmail: '',
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
    },
    setEmailRedux: (state, action: PayloadAction<string>) => {
      state.emailSentEmail = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getInfoRedux.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInfoRedux.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getInfoRedux.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setEmailRedux, logout } = authSlice.actions;

export default authSlice.reducer;
