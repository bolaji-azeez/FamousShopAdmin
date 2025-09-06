"use client";
import { useEffect, useState, type ComponentType } from "react";

import { LoadingSpinner } from "@/component/loadingSpinner";
import { ErrorDisplay } from "@/component/ErrorDisplay";
import {
  Package,
  User,
  MapPin,
  Truck,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import {
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "@/features/order/orderApi";

type OrderStatus = "pending" | "confirmed" | "delivered";

type TimelineStep = {
  status: string;
  description?: string;
  date?: string;
  time?: string;
  icon?: ComponentType<{ className?: string }>;
  completed?: boolean;
  current?: boolean;
};

type OrderProduct = {
  _id: string;
  productId?: string | { _id: string; name?: string } | null;
  name?: string; // snapshot for guests
  price?: number;
  unitPrice?: number;
  quantity: number;
};

type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

type Shipping = {
  method: string;
  cost: number;
  estimatedDelivery: string;
  trackingNumber: string;
};

type FullOrder = {
  _id: string;
  orderId: number;
  status: OrderStatus;
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  userId?: {
    _id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
  city?: string; // 👈 guest fields
  products: OrderProduct[];
  timeline: TimelineStep[];
  shippingAddress?: ShippingAddress;
  shipping?: Shipping;
};

type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
};

const getRtkErrorMessage = (err: unknown) => {
  if (typeof err === "string") return err;
  return (err as Error)?.message ?? "Something went wrong";
};

const ngn = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
}).format;

export const OrderDetailModal = ({
  isOpen,
  onClose,
  orderId,
}: OrderModalProps) => {
  const {
    data: orderDetails,
    isLoading,
    isError,
    error,
  } = useGetOrderByIdQuery(orderId as string, {
    skip: !isOpen || !orderId,
    refetchOnMountOrArgChange: true,
  });

  const DEFAULT_ORDER: FullOrder = {
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
      phoneNumber: "",
    },
    products: [],
    timeline: [],
    shippingAddress: undefined,
    shipping: undefined,
  };

  const [fullOrderDetails, setFullOrderDetails] =
    useState<FullOrder>(DEFAULT_ORDER);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (isError) {
      console.error("Error fetching order details:", error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (orderDetails) {
      setFullOrderDetails(orderDetails as FullOrder);
    }
  }, [orderDetails]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!fullOrderDetails._id) {
      console.error("Cannot update status: Order ID is missing.");
      toast.error("Cannot update status: Order ID is missing.");
      return;
    }

    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus({
        orderId: fullOrderDetails._id,
        status: newStatus,
      }).unwrap();
      setFullOrderDetails((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error(`Failed to update status: ${getRtkErrorMessage(err)}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>Loading order</VisuallyHidden>
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>Fetching order details…</VisuallyHidden>
            </DialogDescription>
          </DialogHeader>
          <LoadingSpinner />
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || !orderDetails) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <VisuallyHidden>Order error</VisuallyHidden>
            </DialogTitle>
            <DialogDescription>
              <VisuallyHidden>
                There was an error loading the order
              </VisuallyHidden>
            </DialogDescription>
          </DialogHeader>
          <ErrorDisplay message={getRtkErrorMessage(error)} />
        </DialogContent>
      </Dialog>
    );
  }

  if (orderDetails) {
    console.log(orderDetails, "This is order details");
  }

  const orderIdToDisplay =
    fullOrderDetails.orderId || fullOrderDetails._id || "N/A";
  const orderDate = fullOrderDetails.createdAt
    ? new Date(fullOrderDetails.createdAt).toLocaleDateString()
    : "Unknown date";
  const userFullName =
    fullOrderDetails.userId?.fullName ||
    [fullOrderDetails.firstName, fullOrderDetails.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Unknown Customer";

  const userEmail =
    fullOrderDetails.userId?.email ||
    fullOrderDetails.email ||
    "No email provided";

  const shippingAddress = fullOrderDetails.shippingAddress;
  const shipping = fullOrderDetails.shipping;
  const orderProducts = fullOrderDetails.products || [];
  const orderTimeline = fullOrderDetails.timeline || [];
  const orderStatus = fullOrderDetails.status || "pending";

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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                Order Details
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                Order #{orderIdToDisplay} • Placed on {orderDate}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(orderStatus)}>
              {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Customer & Order Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" /> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {userFullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{userFullName}</p>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                  
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Addresses */}
          <div className="grid md:grid-cols-2 gap-6">
            {shippingAddress && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" /> Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{userFullName}</p>
                    <p>{shippingAddress.street}</p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.state}{" "}
                      {shippingAddress.zipCode}
                    </p>
                    <p>{shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {shipping && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5" /> Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Method:
                    </span>
                    <span className="text-sm font-medium">
                      {shipping.method || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cost:</span>
                    <span className="text-sm font-medium">
                      {shipping.cost !== undefined
                        ? `$${shipping.cost.toLocaleString()}`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Estimated Delivery:
                    </span>
                    <span className="text-sm font-medium">
                      {shipping.estimatedDelivery || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tracking:
                    </span>
                    <span className="text-sm font-mono">
                      {shipping.trackingNumber || "N/A"}
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
                <Package className="h-5 w-5" /> Order Items (
                {fullOrderDetails.totalQuantity || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderProducts.map((item) => {
                  const title =
                    (typeof item.productId === "object" &&
                      item.productId?.name) ||
                    item.name ||
                    "Item";

                  const unit = item.unitPrice ?? item.price ?? 0;
                  const qty = item.quantity ?? 0;
                  const line = unit * qty;

                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{title}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">Qty: {qty}</span>
                          <span className="text-sm">Price: {ngn(unit)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{ngn(line)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{ngn(fullOrderDetails.totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          {orderTimeline.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5" /> Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderTimeline.map((step, index) => {
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
                        {Icon && <Icon className="h-5 w-5" />}
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
                        {step.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                        )}
                        {step.date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {step.date}
                            {step.time && ` at ${step.time}`}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {orderStatus === "pending" && (
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
            {orderStatus === "confirmed" && (
              <Button onClick={() => handleStatusUpdate("delivered")}>
                <Truck className="h-4 w-4 mr-2" />
                Mark as Delivered
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
