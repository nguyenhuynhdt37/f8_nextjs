// reducers/index.ts
import { combineReducers } from "@reduxjs/toolkit";
import AuthReducer from "./slices/AuthSlice";
const rootReducer = combineReducers({
  auth: AuthReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
