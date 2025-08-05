import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from '../features/admin/adminAuthSlice';
import productsReducer from '../features/products/productsSlice';
import ordersReducer from '../features/order/orderSlice';
import usersReducer from '../features/users/usersSlice';
import brandReducer from '../features/brand/brandSlice'

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    products: productsReducer,
    orders: ordersReducer,
    users: usersReducer,
    brand: brandReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
