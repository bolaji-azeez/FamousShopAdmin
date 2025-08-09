import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../features/admin/adminAuthSlice";
import { productApi } from "@/features/products/productApi";
import ordersReducer from "../features/order/orderSlice";
import {userApi} from "@/features/users/userApi";
import { brandApi } from "@/features/brand/brandApi";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; 

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["adminAuth", "token"],
};

const persistedReducer = persistReducer(persistConfig, adminAuthReducer);

export const store = configureStore({
  reducer: {
    adminAuth: persistedReducer,
    [productApi.reducerPath]: productApi.reducer,

    orders: ordersReducer,
    [userApi.reducerPath]: userApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(productApi.middleware)
      .concat(brandApi.middleware)
      .concat(userApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
