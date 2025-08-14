export interface Product {
  _id: string;
  name: string;
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
}

export type ProductTableItem = Pick<
  Product,
  "id" | "name" | "price" | "discountedPrice" | "stock" | "status" | "category"
> & {
  thumbnail: string;
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
