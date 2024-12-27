import { getInfoUser } from '@/api/api';
import { GetUserInfoByToken, login } from '@/api/api';
import { IAuthSlice } from '@/types/next-auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState: any = {
  state: 0,
};

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setStateNav: (state, action: PayloadAction<number>) => {
      state.state = action.payload;
    },
  },
  extraReducers: builder => {},
});

export const { setStateNav } = navbarSlice.actions;

export default navbarSlice.reducer;
