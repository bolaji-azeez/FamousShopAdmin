// src/components/DashboardContent.tsx
import React from "react"; // Ensure React is imported
import { BarChart3, ShoppingCart, Package, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // CardDescription added
import type { Order } from "@/data/dashboardMock"; // Adjust path if needed
import type { Product } from "@/types"; // Adjust path if needed

// IMPORTANT: This component should NOT be calling the Redux hook.
// It receives data as props.

interface DashboardContentProps {
  // These props should come from the fetched dashboard data
  totalRevenue?: string | number | null; // Example: $45,231.89 or 45231.89
  orderCount?: string | number | null; // Example: 2350
  productCount?: string | number | null; // Example: 12234
  activeBrands?: string | number | null; // Example: 573
  recentOrders?: Order[]; // Data for recent orders
  topProducts?: Product[]; // Data for top products
  monthlySalesData?: any[]; // Data for charts
  salesOverviewData?: any[]; // Data for charts
  isLoading?: boolean; // To indicate loading state
  error?: string | null; // To display errors
}

export const DashboardContent: React.FC<DashboardContentProps> = ({
  totalRevenue,
  orderCount,
  productCount,
  activeBrands,
  recentOrders,
  topProducts,
  monthlySalesData,
  salesOverviewData,
  isLoading,
  error
}) => {

  // Helper to format numbers safely
  const formatNumber = (num: string | number | null | undefined, fallback: string = '0') => {
    if (num === null || num === undefined) return fallback;
    if (typeof num === 'number') return num.toLocaleString();
    return num; // If it's already a string like "$45,231.89"
  };

  // Handle loading and error states within the component itself
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p className="mb-4">Error loading dashboard: {error}</p>
        {/* Add a retry mechanism if needed */}
      </div>
    );
  }

  // If data is loaded or default empty, render the content
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your e-commerce store</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Safely display numbers */}
            <div className="text-2xl font-bold">${formatNumber(totalRevenue, 'N/A')}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{formatNumber(orderCount, '0')}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{formatNumber(productCount, '0')}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Brands</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{formatNumber(activeBrands, '0')}</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Safely render recent orders, showing message if none */}
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.product}</p>
                    </div>
                    <div className="ml-auto font-medium">{order.amount}</div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No recent orders to display.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Your best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Safely render top products, showing message if none */}
              {topProducts && topProducts.length > 0 ? (
                topProducts.slice(0, 3).map((product) => (
                  <div key={product._id} className="flex items-center">
                    <img
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                    <div className="ml-auto font-medium">${product.price}</div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No top products to display.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Add your charts here, passing data safely */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader><CardTitle>Sales Overview</CardTitle></CardHeader>
          <CardContent>
             {/* Use your chart component, passing data */}
             {/* <SalesOverviewChart salesData={monthlySalesData} /> */}
             {monthlySalesData && monthlySalesData.length > 0 ? (
                <div>Chart for Sales Overview</div>
             ) : (
                <p className="text-muted-foreground">No sales overview data.</p>
             )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
           <CardHeader><CardTitle>Category Sales</CardTitle></CardHeader>
           <CardContent>
              {/* Use your chart component, passing data */}
              {/* <CategoryChart salesData={salesOverviewData} /> */}
              {salesOverviewData && salesOverviewData.length > 0 ? (
                 <div>Chart for Category Sales</div>
              ) : (
                 <p className="text-muted-foreground">No category sales data.</p>
              )}
           </CardContent>
        </Card>
      </div>
    </div>
  );
};