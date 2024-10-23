
import { log } from "console";
import { GetUserInfoByToken, login } from "@/api/api";
import { IAuthSlice } from "@/types/next-auth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const loginRedux = createAsyncThunk(
  "auth/login",
  async ({ email, password }: Ilogin, thunkAPI) => {
    const res = await login({ email, password });
    console.log("response", res.data.statusCode);
    if (res?.data?.statusCode === 400 || res?.data?.statusCode === 401) {
      return thunkAPI.rejectWithValue(res?.data);
    }
    return res?.data;
  }
);
export const GetUserInfoByTokenRedux = createAsyncThunk(
  "auth/getinfo",
  async (token: string, thunkAPI) => {
    const res = await GetUserInfoByToken(token);
    console.log("response", res.data.statusCode);
    if (res?.data?.statusCode === 400 || res?.data?.statusCode === 401) {
      return thunkAPI.rejectWithValue(res?.data);
    }
    return res?.data;

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

    setToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
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

        state.accessToken = action?.payload?.token;
        console.log("fjkashfjahsd");
      })
      .addCase(loginRedux.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(GetUserInfoByTokenRedux.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        GetUserInfoByTokenRedux.fulfilled,
        (state, action: PayloadAction<any>) => {
          console.log("redux", action);

          state.loading = false;
          state.user = action?.payload;
        }
      )
      .addCase(
        GetUserInfoByTokenRedux.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { setEmailRedux, setToken } = authSlice.actions;

export default authSlice.reducer;
