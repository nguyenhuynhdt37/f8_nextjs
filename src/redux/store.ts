// store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/index';

const store = configureStore({
  reducer: rootReducer,
  // @ts-ignore
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
