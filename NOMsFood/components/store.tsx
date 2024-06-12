import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

export const storeConfig = configureStore({
  reducer: {
    api: apiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});