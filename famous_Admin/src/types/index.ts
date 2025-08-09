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
