import { login } from "@/apiAxios/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export const loginRedux = createAsyncThunk(
  "auth/login",
  async ({ email, password }: ILoginRedux, thunkAPI) => {
    const res = await login({ email, password });
    if (res?.StatusCode === 400 || res?.StatusCode === 401) {
      return thunkAPI.rejectWithValue(res?.message?.message);
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
