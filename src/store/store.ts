import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  createMigrate,
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  MigrationManifest,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import localforage from 'localforage';
import {
  authSlice,
  chatServiceApiSlice,
  paymentServiceApiSlice,
  projectServiceApiSlice,
  registerSlice,
  userServiceApiSlice,
} from './slices';
import { projectSlice } from './slices/project';

const migrations: MigrationManifest = {
  0: (state) => state,
};

localforage.config({
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
});

const persistConfig = {
  key: 'wema',
  migrate: createMigrate(migrations),
  stateReconciler: autoMergeLevel2,
  storage: localforage,
  // storage: storage,
  storeName: 'treva-store',
  timeout: 0,
  //  blacklist: ["api-slice"],
  transforms: [
    encryptTransform({
      secretKey: process.env.NEXT_PUBLIC_AUTH_TOKEN ?? '',
    }),
  ],
  version: 0,
  blacklist: [],
};

const rootReducer = combineReducers({
  [userServiceApiSlice.reducerPath]: userServiceApiSlice.reducer,
  [projectServiceApiSlice.reducerPath]: projectServiceApiSlice.reducer,
  [chatServiceApiSlice.reducerPath]: chatServiceApiSlice.reducer,
  [paymentServiceApiSlice.reducerPath]: paymentServiceApiSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
  [registerSlice.reducerPath]: registerSlice.reducer,
  [projectSlice.reducerPath]: projectSlice.reducer,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const persistedReducer = persistReducer<RootState, any>(
  persistConfig,
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      userServiceApiSlice.middleware,
      projectServiceApiSlice.middleware,
      chatServiceApiSlice.middleware,
      paymentServiceApiSlice.middleware,
    ]),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

// Types for use in the app
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
