import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from './authSlice'
import tenantReducer from './tenantSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  tenant: tenantReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'tenant'], // persist these slices
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch