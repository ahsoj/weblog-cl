import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './ApiSlice';
import { rootReducer } from './combineReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
