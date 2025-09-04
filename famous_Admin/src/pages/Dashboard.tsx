import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useNavigate } from "react-router-dom";

import { useDashboardData } from "@/hooks/useDashboardData";
import { fetchDashboardOverview } from "@/features/admin/adminAuthSlice";

import { useAppDispatch } from "@/hooks/hooks";
import { useGetOrdersQuery } from "@/features/order/orderApi";
import { useGetProductsQuery } from "@/features/products/productApi";
import { useGetUsersQuery } from "@/features/users/userApi";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // <-- Move this here, before any return

  const { data: ordersData = [], isLoading: ordersLoading } =
    useGetOrdersQuery();
  const { data: productsData = [], isLoading: productsLoading } =
    useGetProductsQuery();
  const { data: totalUser = [] } = useGetUsersQuery();
  console.log(productsData, "This is product data");
  console.log(ordersData, "This is order data");
  console.log(totalUser, "This is users data");




  const { dashboardData, isLoading, isFailed, error } = useDashboardData();
  // Helper to format numbers safely for display
  const formatNumber = (
    num: number | null | undefined,
    fallback: string = "0"
  ) => {
    if (num === null || num === undefined) return fallback;
    return num.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p className="mb-4">
          Error loading dashboard: {error || "Unknown error"}
        </p>
        <Button
          onClick={() => dispatch(fetchDashboardOverview())}
          className="mr-2">
          Retry Fetch
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/admin/dashboard")}
          className="ml-2">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${formatNumber(dashboardData?.totalUser, "0")}{" "}
              {/* Corrected: Use actual data field */}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +20.1% from last month
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/20 to-transparent rounded-bl-full" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-[#0b163f]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(ordersData.length, "0")}{" "}
              {/* Corrected: Use actual data field */}
            </div>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
             
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(productsData.length, "0")}{" "}
              {/* Corrected: Use actual data field */}
            </div>
            <div className="flex items-center text-xs text-purple-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
             
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full" />
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(totalUser.length, "0")}{" "}
              {/* Corrected: Use actual data field */}
            </div>
            <div className="flex items-center text-xs text-orange-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
             
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-400/20 to-transparent rounded-bl-full" />
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest customer orders and their status
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("orders")}>
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div>Loading orders...</div>
            ) : ordersData.length > 0 ? (
              ordersData.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 mb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {order.userId?.fullName}
                      </p>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "confirmed"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {order.products && order.products.length > 0
                        ? `${order.products[0].quantity} x ${order.products[0].price}`
                        : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{order.totalPrice}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">
                No recent orders data available.
              </div>
            )}
          </CardContent>
        </Card>
        {/* Top Products Card moved outside Recent Orders Card */}
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                Best selling products this month
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("products")}>
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div>Loading products...</div>
            ) : productsData.length > 0 ? (
              productsData.slice(0, 3).map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors mb-2">
                  <div className="relative">
                    <img
                      src={
                        product.images && product.images.length
                          ? (typeof product.images[0] === "string"
                              ? product.images[0]
                              : product.images[0]?.url) || "/placeholder.svg"
                          : "/placeholder.svg"
                      }
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded border"
                    />
                    <div className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.brand}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">
                        ${product.price?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">
                No top products data available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
