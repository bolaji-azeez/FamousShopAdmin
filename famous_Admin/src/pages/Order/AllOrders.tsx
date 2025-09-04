"use client";

import { useState, useMemo } from "react";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/features/order/orderApi";

import { Check, Eye } from "lucide-react";
import { toast } from "sonner";
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

const ngn = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
}).format;

type Order = {
  _id: string;
  status: "pending" | "confirmed" | "delivered" | string;
  createdAt: string;
  totalPrice: number;
  userId?: { fullName?: string };
  products?: { quantity: number; price: number; productId?: { name?: string } }[];
};

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "delivered">("all");
  const [query, setQuery] = useState("");
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);

  const { data: ordersData = [], isLoading, isError, refetch } = useGetOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleStatusUpdate = async (orderId: string, status: "confirmed" | "delivered") => {
    try {
      setBusyOrderId(orderId);
      await updateOrderStatus({ orderId, status }).unwrap();
      toast.success(`Order ${orderId.slice(-4)} marked as ${status}`);
      refetch();
    } catch (e) {
      toast.error("Failed to update order status");
  
      console.error(e);
    } finally {
      setBusyOrderId(null);
    }
  };

  const filteredOrders: Order[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (ordersData as Order[]).filter((o) => {
      const matchesStatus = statusFilter === "all" ? true : o.status === statusFilter;
      if (!q) return matchesStatus;
      const idFrag = o._id?.toLowerCase?.() ?? "";
      const name = o.userId?.fullName?.toLowerCase?.() ?? "";
      const anyProduct = o.products?.some((p) =>
        [p.productId?.name, String(p.price), String(p.quantity)]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(q))
      );
      return matchesStatus && (idFrag.includes(q) || name.includes(q) || anyProduct);
    });
  }, [ordersData, statusFilter, query]);

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default" as const;
      case "confirmed":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-live="polite">
        <span>Loading orders…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500" role="alert">
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
          <p className="text-muted-foreground">Manage customer orders and deliveries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3">
        <Input
          placeholder="Search orders…"
          className="w-full sm:max-w-sm p-3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search orders"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
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

      <Card className="p-3 hidden md:block overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No orders match your filters.
                </TableCell>
              </TableRow>
            )}
            {filteredOrders.map((order) => {
              const first = order.products?.[0];
              return (
                <TableRow key={order._id}>
                  <TableCell className="font-medium whitespace-nowrap">{order._id.slice(-4)}</TableCell>
                  <TableCell className="whitespace-nowrap">{order.userId?.fullName ?? "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {first ? `${first.quantity}` : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{ngn(order.totalPrice || 0)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant={statusBadgeVariant(order.status)}>{order.status || "pending"}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {order.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order._id, "confirmed")}
                          disabled={busyOrderId === order._id}
                          aria-label={`Confirm order ${order._id.slice(-4)}`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(order._id, "delivered")}
                          disabled={busyOrderId === order._id}
                          aria-label={`Mark order ${order._id.slice(-4)} as delivered`}
                        >
                          Deliver
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order._id)}
                        aria-label={`View order ${order._id.slice(-4)}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Cards */}
      <div className="grid gap-4 md:hidden">
        {filteredOrders.length === 0 && (
          <Card className="p-4 text-center text-muted-foreground">No orders match your filters.</Card>
        )}
        {filteredOrders.map((order) => {
          const first = order.products?.[0];
          return (
            <Card key={order._id} className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{order._id.slice(-4)}</p>
                <Badge variant={statusBadgeVariant(order.status)}>{order.status || "pending"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground font-bold">{order.userId?.fullName ?? "—"}</p>
              <p className="text-sm">{first ? `${first.quantity} × ${first.productId?.name ?? "Item"}` : "—"}</p>
              <p className="text-sm font-semibold">{ngn(order.totalPrice || 0)}</p>
              <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
              <div className="flex gap-2">
                {order.status === "pending" && (
                  <Button size="sm" onClick={() => handleStatusUpdate(order._id, "confirmed")} disabled={busyOrderId === order._id} aria-label={`Confirm order ${order._id.slice(-4)}`}>
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                {order.status === "confirmed" && (
                  <Button size="sm" onClick={() => handleStatusUpdate(order._id, "delivered")} disabled={busyOrderId === order._id} aria-label={`Deliver order ${order._id.slice(-4)}`}>
                    Deliver
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleViewOrder(order._id)} aria-label={`View order ${order._id.slice(-4)}`}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <OrderDetailModal isOpen={isModalOpen} onClose={handleCloseModal} orderId={selectedOrderId} />
    </div>
  );
}
