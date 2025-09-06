// App.tsx
import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Layout from "./component/Layout";
import ProtectedRoute from "./component/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const Products = lazy(() => import("./pages/Product/AllPoductPage"));
const CreateProduct = lazy(() => import("./pages/Product/AllPoductPage"));
const Orders = lazy(() => import("./pages/Order/AllOrders"));
const Brands = lazy(() => import("./pages/Brand/BrandsPage"));
const Customers = lazy(() => import("./pages/Customers/Customers"));

const router = createBrowserRouter([
  { path: "/admin/login", element: <Login /> },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/admin/dashboard", element: <Dashboard /> },
      { path: "/admin/settings", element: <Settings /> },
      { path: "/admin/products", element: <Products /> },
      { path: "/admin/products/new", element: <CreateProduct /> },
      { path: "/admin/orders", element: <Orders /> },
      { path: "/admin/brands", element: <Brands /> },
      { path: "/admin/customers", element: <Customers /> },
      { index: true, loader: () => redirect("/admin/dashboard") },
    ],
  },
  { path: "*", loader: () => redirect("/admin/login") },
]);

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
}
