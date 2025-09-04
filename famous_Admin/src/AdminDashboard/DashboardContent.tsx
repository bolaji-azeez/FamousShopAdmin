
import React from "react"; 
import { BarChart3, ShoppingCart, Package, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Order } from "@/data/dashboardMock"; 
import type { Product } from "@/types"; 

interface DashboardContentProps {

  totalRevenue?: string | number | null; 
  orderCount?: string | number | null; 
  productCount?: string | number | null; 
  activeBrands?: string | number | null; 
  recentOrders?: Order[]; 
  topProducts?: Product[]; 
  monthlySalesData?: []; 
  salesOverviewData?: []; 
  isLoading?: boolean; 
  error?: string | null; 
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

  
  const formatNumber = (num: string | number | null | undefined, fallback: string = '0') => {
    if (num === null || num === undefined) return fallback;
    if (typeof num === 'number') return num.toLocaleString();
    return num; 
  };

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
       
      </div>
    );
  }

 
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
                    <div className="ml-auto font-medium">N{product.price}</div>
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