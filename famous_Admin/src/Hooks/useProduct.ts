import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ProductType } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

export const useProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (productData: ProductType) => {
    try {
      const response = await axios.post(`${API_URL}/products`, productData);
      setProducts([...products, response.data]);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<ProductType>) => {
    try {
      const response = await axios.patch(`${API_URL}/products/${id}`, productData);
      setProducts(products.map(product => 
        product.id === id ? { ...product, ...response.data } : product
      ));
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
};