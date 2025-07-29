"use client";

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "@/component/ProductForm";

// Mock data for editing
const mockProductData = {
  name: "Rolex Submariner",
  description:
    "The Rolex Submariner is a legendary diving watch that combines exceptional functionality with timeless elegance. Crafted with precision and built to withstand the depths of the ocean.",
  price: 8500,
  discountedPrice: 7999,
  stock: 5,
  category: "Luxury Watches",
  status: "active",
  features: [
    "Water resistant to 300m",
    "Automatic movement",
    "Ceramic bezel",
    "Oystersteel case",
    "Glidelock clasp",
  ],
};

export default function EditProductPage() {
  const navigate = useNavigate();
  const params = useParams(); // Example: if route is /admin/products/:id

  const handleSubmit = (productData: typeof mockProductData) => {
    console.log("Updating product:", productData);
    // Here you would typically send the data to your API
    // For now, we'll just log it and redirect
    navigate("/admin/products");
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialData={mockProductData}
      />
    </div>
  );
}
