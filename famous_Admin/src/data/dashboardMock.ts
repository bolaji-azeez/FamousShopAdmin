"use client";

import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Home,
  Tag,

} from "lucide-react";

export interface SidebarItem {
  title: string;
  icon: React.ComponentType<any>;
  id: string;
}

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: "pending" | "confirmed" | "delivered";
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  images: string[];
  description: string;
  features: string[];
  rating: number;
}

export interface Brand {
  id: string;
  name: string;
  products: number;
  status: "active" | "inactive";
}

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "John Doe",
    product: "Rolex Submariner",
    amount: "$8,500",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    product: "Omega Speedmaster",
    amount: "$4,200",
    status: "confirmed",
    date: "2024-01-14",
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    product: "TAG Heuer Carrera",
    amount: "$2,800",
    status: "delivered",
    date: "2024-01-13",
  },
];

export const mockProducts: Product[] = [
  {
    id: "PROD-001",
    name: "Rolex Submariner",
    brand: "Rolex",
    price: 8500,
    stock: 5,
    status: "active",
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    description: "Iconic diving watch with exceptional craftsmanship",
    features: ["Water resistant to 300m", "Automatic movement", "Ceramic bezel"],
    rating: 4.9,
  },
  {
    id: "PROD-002",
    name: "Omega Speedmaster",
    brand: "Omega",
    price: 4200,
    stock: 8,
    status: "active",
    images: ["/placeholder.svg?height=200&width=200", "/placeholder.svg?height=200&width=200"],
    description: "The legendary moonwatch worn by astronauts",
    features: ["Manual winding", "Chronograph", "Hesalite crystal"],
    rating: 4.8,
  },
];

export const mockBrands: Brand[] = [
  { id: "BRAND-001", name: "Rolex", products: 12, status: "active" },
  { id: "BRAND-002", name: "Omega", products: 8, status: "active" },
  { id: "BRAND-003", name: "TAG Heuer", products: 6, status: "active" },
];

export const sidebarItems: SidebarItem[] = [
  { title: "Dashboard", icon: BarChart3, id: "dashboard" },
  { title: "Orders", icon: ShoppingCart, id: "orders" },
  { title: "Products", icon: Package, id: "products" },
  { title: "Brands", icon: Tag, id: "brands" },
  { title: "Landing Page", icon: Home, id: "landing" },
  { title: "Customers", icon: Users, id: "customers" },
  { title: "Settings", icon: Settings, id: "settings" },
];