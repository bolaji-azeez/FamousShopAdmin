// "use client";

// import { useNavigate } from "react-router-dom";
// import ProductForm from "@/component/ProductForm";
// import { toast } from "react-toastify";


// // You need to provide the product's _id and initial data for editing
// const mockProductData = {
//   productId: "1234567890", // Replace with actual product ID
//   name: "Rolex Submariner",
//   description: "The Rolex Submariner is a legendary diving watch...",
//   price: 8500,
//   discountedPrice: 7999,
//   stock: 5,
//   category: "Luxury Watches",
//   status: "active",
//   features: [
//     "Water resistant to 300m",
//     "Automatic movement",
//     "Ceramic bezel",
//     "Oystersteel case",
//     "Glidelock clasp",
//   ],
//   images: [
//     // Add image URLs or base64 strings here if needed
//   ],
// };

// export default function EditProductPage() {
//   const navigate = useNavigate();

//   const handleSubmit = async (formData: FormData) => {
   
//    try {
//       const response = await fetch(`/products/${productId}`, {
//         method: "PUT",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to save product");

//       toast.success("Product saved successfully!");
//       navigate("/products");
//     } catch  {
//       toast.error("Failed to save product");
//     }
//   };

//   const handleCancel = () => {
//     navigate("/products");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <ProductForm
//         onSubmit={handleSubmit}
//         onCancel={handleCancel}
//         initialData={mockProductData}
//       />
//     </div>
//   );
// }