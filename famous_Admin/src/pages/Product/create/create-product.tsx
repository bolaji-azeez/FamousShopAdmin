import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/hooks";
import { createProduct } from "@/features/products/productsSlice";
import ProductForm from "@/component/ProductForm";
import { toast } from "react-toastify";

export default function CreateProductPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (productData: Record<string, any>) => {
    dispatch(createProduct(productData))
      .unwrap()
      .then(() => {
        toast.success("Product created successfully!");
        navigate("/products");
      })
      .catch((err) => {
        toast.error(`Failed to create product: ${err}`);
      });
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
