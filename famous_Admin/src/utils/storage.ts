// utils/storage.ts
export const loadCartFromStorage = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const saveCartToStorage = (cart: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};
