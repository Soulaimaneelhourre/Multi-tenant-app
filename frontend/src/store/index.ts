import { configureStore } from '@reduxjs/toolkit';
import tenantReducer from './tenantSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    tenant: tenantReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
