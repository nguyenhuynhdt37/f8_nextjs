// reducers/index.ts
import { combineReducers } from '@reduxjs/toolkit';
import AuthReducer from './slices/AuthSlice';
import NavBarReducer from './slices/NavbarSlice';
import NotificationReducer from './slices/NotificationSlice';
const rootReducer = combineReducers({
  auth: AuthReducer,
  nav: NavBarReducer,
  noti: NotificationReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
