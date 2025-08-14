"use client";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/component/loadingSpinner";
import { ErrorDisplay } from "@/component/ErrorDisplay";
import { Package, User, MapPin, Truck, CheckCircle } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useGetOrderDetailsQuery,
} from "@/features/order/orderApi";

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
};

export const OrderDetailModal = ({
  isOpen,
  onClose,
  orderId,
}: OrderModalProps) => {
  const {
    data: orderDetails,
    isLoading,
    isError,
  } = useGetOrderByIdQuery(orderId); // Removed skip condition

  const {
    data: orderDetailsData,
    isLoading: isDetailsLoading,
    isError: isDetailsError,
  } = useGetOrderDetailsQuery(orderId);

  const DEFAULT_ORDER = {
    _id: "",
    orderId: 0,
    status: "pending",
    totalQuantity: 0,
    totalPrice: 0,
    createdAt: "",
    updatedAt: "",
    userId: {
      _id: "",
      fullName: "Unknown Customer",
      email: "No email provided",
      phoneNumber: "No phone provided",
    },
    products: [
      {
        _id: "",
        productId: {
          _id: "",
          name: "Unknown Product",
        },
        price: 0,
        quantity: 0,
      },
    ],
    timeline: [],

    shippingAddress: undefined,
    shipping: undefined,
  };
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [fullOrderDetails, setFullOrderDetails] = useState(DEFAULT_ORDER);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus({
        orderId: fullOrderDetails._id,
        status: newStatus,
      }).unwrap();

      setFullOrderDetails((prev) => ({
        ...prev,
        status: newStatus,
      }));
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  useEffect(() => {
    if (isError) {
      console.error("Error fetching order details:", isError);
    }
    if (isDetailsError) {
      console.error("Error fetching order details data:", isDetailsError);
    }
  }, [isError, isDetailsError]);
  console.log("Order ID:", orderId);
  console.log("Is Open:", isOpen);
  console.log("Order Details:", orderDetails);
  console.log("Order Details Data:", orderDetailsData);

  if (isLoading || isDetailsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>Loading order details...</span>
      </div>
    );
  }

  if (!orderDetails && !orderDetailsData) {
    return (
      <div className="flex justify-center items-center h-64 text-yellow-500">
        <span>No order data available.</span>
      </div>
    );
  }

  if (isLoading || isDetailsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <LoadingSpinner />
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || isDetailsError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <ErrorDisplay />
        </DialogContent>
      </Dialog>
    );
  }

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
                {fullOrderDetails.orderNumber} • Placed on{" "}
                {fullOrderDetails.date} at {fullOrderDetails.time}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(fullOrderDetails.status)}>
              {fullOrderDetails.status.charAt(0).toUpperCase() +
                fullOrderDetails.status.slice(1)}
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
                    <AvatarFallback>
                      {fullOrderDetails.userId.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {fullOrderDetails.userId.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fullOrderDetails.userId.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {fullOrderDetails.userId.phoneNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
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
                    {fullOrderDetails.payment.method}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Card:</span>
                  <span className="text-sm font-medium">
                    {fullOrderDetails.payment.cardType} ••••{" "}
                    {fullOrderDetails.payment.lastFour}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Transaction ID:
                  </span>
                  <span className="text-sm font-mono">
                    {fullOrderDetails.payment.transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200">
                    {fullOrderDetails.payment.status}
                  </Badge>
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Shipping Addresses */}
          <div className="grid md:grid-cols-2 gap-6">
            {fullOrderDetails.shippingAddress && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {fullOrderDetails.customer.fullName}
                    </p>
                    <p>{fullOrderDetails.shippingAddress.street}</p>
                    <p>
                      {fullOrderDetails.shippingAddress.city},{" "}
                      {fullOrderDetails.shippingAddress.state}{" "}
                      {fullOrderDetails.shippingAddress.zipCode}
                    </p>
                    <p>{fullOrderDetails.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {fullOrderDetails.timeline?.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Method:
                    </span>
                    <span className="text-sm font-medium">
                      {fullOrderDetails.shipping.method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cost:</span>
                    <span className="text-sm font-medium">
                      ${fullOrderDetails.shipping.cost}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Estimated Delivery:
                    </span>
                    <span className="text-sm font-medium">
                      {fullOrderDetails.shipping.estimatedDelivery}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tracking:
                    </span>
                    <span className="text-sm font-mono">
                      {fullOrderDetails.shipping.trackingNumber}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Order Items ({fullOrderDetails.totalQuantity || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(fullOrderDetails.products || []).map((item) => {
                  // Skip rendering if item or productId is null
                  if (!item || !item.productId) return null;

                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {item.productId.name || "Unknown Product"}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            Qty: {item.quantity || 0}
                          </span>
                          <span className="text-sm">
                            Price: ${(item.price || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          $
                          {(
                            (item.price || 0) * (item.quantity || 0)
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              {/* Order Totals */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${fullOrderDetails.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          {(fullOrderDetails.timeline || []).map((step, index) => {
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
                    {step.current && <Badge variant="outline">Current</Badge>}
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

          <Badge className={getStatusColor(fullOrderDetails.status)}>
            {fullOrderDetails.status.charAt(0).toUpperCase() +
              fullOrderDetails.status.slice(1)}
          </Badge>

          {/* Action Buttons */}
          {fullOrderDetails.status === "pending" && (
            <Button
              onClick={() => handleStatusUpdate("confirmed")}
              disabled={isUpdatingStatus}
              className="flex items-center">
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirm Order
                </>
              )}
            </Button>
          )}
          {fullOrderDetails.status === "confirmed" && (
            <Button onClick={() => handleStatusUpdate("delivered")}>
              <Truck className="h-4 w-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
