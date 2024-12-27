// reducers/index.ts
import { combineReducers } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import NavBarReducer from './slices/NavbarSlice';
const rootReducer = combineReducers({
  auth: AuthReducer,
  nav: NavBarReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
