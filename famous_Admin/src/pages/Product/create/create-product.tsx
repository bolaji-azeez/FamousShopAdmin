
import { useNavigate } from "react-router-dom";

import ProductForm from "@/component/ProductForm";
import { toast } from "react-toastify";

export default function CreateProductPage() {
  const navigate = useNavigate();


  const handleSubmit = async (formData: FormData) => {
    try {
      // Replace with your actual API endpoint and method
      const response = await fetch("/products", {
        method: "POST", // or "PUT" for editing
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save product");

      toast.success("Product saved successfully!");
      navigate("/products");
    } catch  {
      toast.error("Failed to save product");
    }
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
