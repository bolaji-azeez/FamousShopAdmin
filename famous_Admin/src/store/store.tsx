import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../features/admin/adminAuthSlice";
import { productApi } from "@/features/products/productApi";
import { userApi } from "@/features/users/userApi";
import { brandApi } from "@/features/brand/brandApi";
import { orderApi } from "@/features/order/orderApi";
import { notificationApi } from "@/features/notification/notficationApi";


import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage
};

const persistedReducer = persistReducer(persistConfig, adminAuthReducer);

export const store = configureStore({
  reducer: {
    adminAuth: persistedReducer,
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
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
      .concat(orderApi.middleware)
      .concat(notificationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);


