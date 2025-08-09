"use client";
import {
  Package,
  User,
  MapPin,
  CreditCard,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchOrderById } from "@/features/order/orderSlice";

export const OrderDetailModal = ({
  isOpen,
  onClose,
  orderId,
}: OrderModalProps) => {
  const dispatch = useAppDispatch();
  const orderDetails = useAppSelector((state) => state.orders.selectedOrder);

  useEffect(() => {
    if (orderId && isOpen) {
      dispatch(fetchOrderById(orderId));
    }
  }, [orderId, dispatch, isOpen]);

  const handleStatusUpdate = (newStatus: string) => {
    if (orderDetails) {
      dispatch(updateOrderStatus({ id: orderDetails.id, status: newStatus }));
    }
  };

  if (!orderDetails) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Order Details
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                {orderDetails.orderNumber} • Placed on {orderDetails.date} at{" "}
                {orderDetails.time}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(orderDetails.status)}>
              {orderDetails.status.charAt(0).toUpperCase() +
                orderDetails.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Customer & Order Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={orderDetails.customer.avatar || "/placeholder.svg"}
                      alt={orderDetails.customer.name}
                    />
                    <AvatarFallback>
                      {orderDetails.customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {orderDetails.customer.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetails.customer.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetails.customer.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Method:</span>
                  <span className="text-sm font-medium">
                    {orderDetails.payment.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Card:</span>
                  <span className="text-sm font-medium">
                    {orderDetails.payment.cardType} ••••{" "}
                    {orderDetails.payment.lastFour}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Transaction ID:
                  </span>
                  <span className="text-sm font-mono">
                    {orderDetails.payment.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200">
                    {orderDetails.payment.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipping Addresses */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{orderDetails.customer.name}</p>
                  <p>{orderDetails.shippingAddress.street}</p>
                  <p>
                    {orderDetails.shippingAddress.city},{" "}
                    {orderDetails.shippingAddress.state}{" "}
                    {orderDetails.shippingAddress.zipCode}
                  </p>
                  <p>{orderDetails.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Method:</span>
                  <span className="text-sm font-medium">
                    {orderDetails.shipping.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cost:</span>
                  <span className="text-sm font-medium">
                    ${orderDetails.shipping.cost}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated Delivery:
                  </span>
                  <span className="text-sm font-medium">
                    {orderDetails.shipping.estimatedDelivery}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tracking:
                  </span>
                  <span className="text-sm font-mono">
                    {orderDetails.shipping.trackingNumber}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg border"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.brand}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="text-sm">
                          Price: ${item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${item.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${orderDetails.totals.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>${orderDetails.totals.shipping}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${orderDetails.totals.tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${orderDetails.totals.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Order Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderDetails.timeline.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                          step.completed
                            ? "bg-green-100 border-green-500 text-green-600"
                            : step.current
                            ? "bg-blue-100 border-blue-500 text-blue-600"
                            : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-medium ${
                              step.completed || step.current
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}>
                            {step.status}
                          </p>
                          {step.current && (
                            <Badge variant="outline">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                        {step.date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {step.date} at {step.time}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {orderDetails.status === "pending" && (
              <Button
                onClick={() => handleStatusUpdate("confirmed")}
                className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm Order
              </Button>
            )}
            {orderDetails.status === "confirmed" && (
              <Button
                onClick={() => handleStatusUpdate("delivered")}
                className="flex-1">
                <Truck className="h-4 w-4 mr-2" />
                Mark as Delivered
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderId={selectedOrderId}
      />
    </Dialog>
  );
};

export default OrderDetailModal;
