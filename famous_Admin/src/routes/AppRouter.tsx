import Layout from "@/component/Layout";
import BrandsPage from "@/pages/Brand/BrandsPage";
import Dashboard from "@/pages/Dashboard";
import Popular from "@/pages/Featured/Popular";
import Trending from "@/pages/Featured/Trending";
import AllOrders from "@/pages/Order/AllOrders";
import ProductsPage from "@/pages/Product/AllPoductPage";
import CreateProductPage from "@/pages/Product/create/create-product";
import EditProductPage from "@/pages/Product/edit/edit-product";
import LandingPage from "@/pages/Landing/Landing";
import { createBrowserRouter } from "react-router-dom";
import CustomersPage from "@/pages/Customers/Customers";
import SettingsPage from "@/pages/Settings/Settings";

import type { RouteObject } from "react-router-dom";
import AdminLogin from "@/pages/auth/login";


//

const routes: RouteObject[] = [
  {
    path: "/admin/dashboard/",
    element: <Layout />,
    children: [
    { index: true, element: <Dashboard /> },
      // {
      //   path: "/admin/dashboard",
      //   element: <Dashboard />
      // },
      {
        path: "settings",
        element: <SettingsPage />
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "product/create",
        element: <CreateProductPage />
      },
        {
        path: "products/:id/edit",
        element: <EditProductPage />
      },
      {
        path: "orders",
        element: <AllOrders />,
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
        path: "brands",
        element: <BrandsPage />,
      },

      {
        path: "landing",
        element: <LandingPage />,
      },
        {
        path: "customers",
        element: <CustomersPage />,
      },
      
    ],
  },
  {
    path: "/",
    element: <AdminLogin />,
  }
];

export const router = createBrowserRouter(routes);
