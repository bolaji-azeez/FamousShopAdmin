export interface Product {
  _id: string;
  name: string;
  productId: number;
  description: string;
  price: number;
  brand: string;
  images: Array<{
    url: string;
    imageId: string;
    _id: string;
  }>;
  quantity: number;
  features: string[];
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt?: string;
  __v: number;
}

export type ProductTableItem = Pick<
  Product,
  "_id" | "name" | "price" | "status"
> & {
  thumbnail: string;
  discountedPrice?: number;
  stock?: number;
  category?: string;
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Brand {
  _id: string;
  name: string;
  productsCount?: number;
  status?: "active" | "inactive";
}

export interface OrdersState {
  items: Order[];
  selectedOrder: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  totalPages: number;
}

export interface BrandState {
  items: [];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  page: number;
  totalPages: number;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  isActive: boolean;
  avatar?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  createdAt: string;
}

export interface Order {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
      image: string;
      _id: string;
      name: string;
      brand: string;
    }>;
  };
  totalQuantity: number;
  totalPrice: number;
  orderId: number;
  products: Array<{
    productId: string | null;
    price: number;
    quantity: number;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  status: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    street: string;
    country: string;
  };
  payment: {
    method: string;
    status: string;
  };
  paymentMethod: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shipping: {
    method: string;
    cost: number;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
  };
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  __v: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    image: string;
    id: string;
    name: string;
    brand: string;
    total: number;
  }>;
  timeline: Array<{
    status: string;
    date: string;
  }>;
  paymentStatus: string;
  paymentId: string;
  paymentDetails: {
    transactionId: string;
    method: string;
    status: string;
  };

  carrier: string;
  estimatedDelivery: string;
}

export interface OrderTableItem {
  _id: string;
  customer: string;
  product: string;
  amount: string;
  status: "pending" | "confirmed" | "delivered";
  date: string;
}

export interface changePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DashboardData {
  totalUser: number;
  totalProducts: number;
  totalOrders: number;
  monthlySalesData: {
    _id: number;
    totalSales: number;
  }[];
  salesOverview: {
    month: string;
    sales: number;
  }[];
}

export type TimelineStep = {
  status: string;
  description?: string;
  date?: string;
  time?: string;
  icon?: React.ElementType;
  completed?: boolean;
  current?: boolean;
};

export type OrderProduct = {
  _id: string;
  productId: {
    _id: string;
    name: string;
  };
  price: number;
  quantity: number;
};

export type OrderUser = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
};

export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type Shipping = {
  method: string;
  cost: number;
  estimatedDelivery: string;
  trackingNumber: string;
};

export type FullOrder = {
  _id: string;
  orderId: number;
  status: "pending" | "confirmed" | "delivered";
  totalQuantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  userId: OrderUser;
  products: OrderProduct[];
  timeline: TimelineStep[];
  shippingAddress?: ShippingAddress;
  shipping?: Shipping;
  phoneNumber: number;
};

export type OrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
};


