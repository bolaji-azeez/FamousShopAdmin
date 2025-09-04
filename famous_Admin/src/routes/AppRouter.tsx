import Layout from "@/component/Layout";
import BrandsPage from "@/pages/Brand/BrandsPage";
import Dashboard from "@/pages/Dashboard";

import AllOrders from "@/pages/Order/AllOrders";
import ProductsPage from "@/pages/Product/AllPoductPage";
import CreateProductPage from "@/pages/Product/create/create-product";
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
        path: "orders",
        element: <AllOrders />,
      },
  
      {
        path: "brands",
        element: <BrandsPage />,
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
