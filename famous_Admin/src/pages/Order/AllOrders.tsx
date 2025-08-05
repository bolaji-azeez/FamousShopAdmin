"use client";

import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchOrders, updateOrderStatus } from "../../features/order/orderSlice";
import { useEffect, useState } from "react";
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
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.items);
  const status = useAppSelector((state) => state.orders.status);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    dispatch(updateOrderStatus({ orderId, newStatus: newStatus as any }));
  };

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
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {order.id}
                </TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {order.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus(order.id, "confirmed")
                        }>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {order.status === "confirmed" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          updateOrderStatus(order.id, "delivered")
                        }>
                        Deliver
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order.id)}>
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
        {orders.map((order) => (
          <Card key={order.id} className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">{order.id}</p>
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
            <p className="text-sm text-muted-foreground">{order.customer}</p>
            <p className="text-sm">{order.product}</p>
            <p className="text-sm font-semibold">{order.amount}</p>
            <p className="text-xs text-muted-foreground">{order.date}</p>
            <div className="flex gap-2">
              {order.status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => updateOrderStatus(order.id, "confirmed")}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
              {order.status === "confirmed" && (
                <Button
                  size="sm"
                  onClick={() => updateOrderStatus(order.id, "delivered")}>
                  Deliver
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewOrder(order.id)}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderId={selectedOrderId}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
