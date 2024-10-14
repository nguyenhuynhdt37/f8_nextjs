import { GetUserInfoByToken, login } from "@/apiAxios/api";
import { IAuthSlice } from "@/types/next-auth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const loginRedux = createAsyncThunk(
  "auth/login",
  async ({ email, password }: Ilogin, thunkAPI) => {
    try {
      const response = await login({ email, password });
      console.log("response", response.data);

      return response.data;
    } catch (error) {
      // return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
const initialState: IAuthSlice = {
  emailSentEmail: "",
  user: null,
  loading: false,
  error: null,
  accessToken: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmailRedux: (state, action: PayloadAction<string>) => {
      state.emailSentEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginRedux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginRedux.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.accessToken = action.payload.token;
      })
      .addCase(loginRedux.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { setEmailRedux } = authSlice.actions;
export default authSlice.reducer;
