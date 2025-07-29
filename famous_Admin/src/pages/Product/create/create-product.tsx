"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "@/component/ProductForm";

export default function CreateProductPage() {
  const navigate = useNavigate();

  const handleSubmit = (productData: Record<string, any>) => {
    console.log("Creating product:", productData);
    // Here you would typically send the data to your API
    // For now, we'll just log it and redirect
    navigate("/admin/products");
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
