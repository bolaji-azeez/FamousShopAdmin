"use client";

import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/features/order/orderApi";


import { useState } from "react";
import { Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetailModal } from "./OrderModal";

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: ordersData = [], isLoading, isError } = useGetOrdersQuery();
  console.log("ordersData:", ordersData);

  const [updateOrderStatus] = useUpdateOrderStatusMutation(); // RTK Query mutation

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    await updateOrderStatus({ orderId, status });
    handleCloseModal();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>Loading orders...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <span>Failed to load orders. Please try again.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage customer orders and deliveries
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3">
        <Input
          placeholder="Search orders..."
          className="w-full sm:max-w-sm p-3"
        />
        <Select>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table */}
      <Card className="p-3 hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersData.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {order._id.slice(-4)}
                </TableCell>
                <TableCell>{order.userId?.fullName}</TableCell>
                <TableCell>
                  {" "}
                  {order.products && order.products.length > 0
                    ? `${order.products[0].quantity} x ${order.products[0].price}`
                    : "—"}
                </TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "default"
                        : order.status === "confirmed"
                        ? "secondary"
                        : "outline"
                    }>
                    {order.status || "pending"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus({
                            orderId: order._id,
                            status: "confirmed",
                          })
                        }>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {order.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus({
                            orderId: order._id,
                            status: "delivered",
                          })
                        }>
                        Deliver
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order._id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {ordersData.map((order) => (
          <Card key={order._id} className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{order._id.slice(-4)}</p>
              <Badge
                variant={
                  order.status === "delivered"
                    ? "default"
                    : order.status === "confirmed"
                    ? "secondary"
                    : "outline"
                }>
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-bold">
              {order.userId?.fullName}
            </p>
            <p className="text-sm">
              {" "}
              {order.products && order.products.length > 0
                ? `${order.products[0].quantity} x ${order.products[0].price}`
                : "—"}
            </p>
            <p className="text-sm font-semibold">{order.totalPrice}</p>
            <p className="text-xs text-muted-foreground">
              {" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              {order.status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order._id, "confirmed")}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
              {order.status === "confirmed" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order._id, "delivered")}>
                  Deliver
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderId={selectedOrderId}
      />
    </div>
  );
}
