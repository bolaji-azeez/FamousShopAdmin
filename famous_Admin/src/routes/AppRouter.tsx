import Layout from "@/component/Layout";
import BrandsPage from "@/pages/Brand/BrandsPage";
import Dashboard from "@/pages/Dashboard";
import Popular from "@/pages/Featured/Popular";
import Trending from "@/pages/Featured/Trending";
import AllOrders from "@/pages/Order/AllOrders";
import OrderDetailModal from "@/pages/Order/OrderModal";
import ProductsPage from "@/pages/Product/AllPoductPage";
import CreateProductPage from "@/pages/Product/create/create-product";
import EditProductPage from "@/pages/Product/edit/edit-product";
import LandingPage from "@/pages/Landing/Landing";
import { createBrowserRouter } from "react-router-dom";
import CustomersPage from "@/pages/Customers/Customers";
import SettingsPage from "@/pages/Settings/Settings";
import type { RouteObject } from "react-router-dom";


//

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "/admin/settings",
        element: <SettingsPage />
      },
      {
        path: "/admin/products",
        element: <ProductsPage />,
      },
      {
        path: "/admin/product/create",
        element: <CreateProductPage />
      },
        {
        path: "/admin/products/:id/edit",
        element: <EditProductPage />
      },
      {
        path: "/admin/orders",
        element: <AllOrders />,
      },
      {
        path: "orderDetailModal",
        element: <OrderDetailModal />
        
      },
      {
        path: "popular",
        element: <Popular />,
      },
      {
        path: "trending",
        element: <Trending />,
      },
      {
        path: "/admin/brands",
        element: <BrandsPage />,
      },

      {
        path: "/admin/landing",
        element: <LandingPage />,
      },
        {
        path: "/admin/customers",
        element: <CustomersPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
