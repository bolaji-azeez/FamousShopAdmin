import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import type { ApiResponse, BrandType } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useBrands = () => {
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse<BrandType[]>>(`${API_URL}/brands`);
      setBrands(response.data.data);
      setError(null);
    } catch (err) {
      setError(err as AxiosError);
      toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const addBrand = useCallback(async (brandData: Omit<BrandType, 'id'>) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse<BrandType>>(
        `${API_URL}/brands`,
        brandData
      );
      setBrands(prev => [...prev, response.data.data]);
      toast.success('Brand added successfully');
      return response.data.data;
    } catch (err) {
      const error = err as AxiosError;
      setError(error);
      toast.error(error.response?.data?.message || 'Failed to add brand');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBrand = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/brands/${id}`);
      setBrands(prev => prev.filter(brand => brand.id !== id));
      toast.success('Brand deleted successfully');
    } catch (err) {
      const error = err as AxiosError;
      setError(error);
      toast.error(error.response?.data?.message || 'Failed to delete brand');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    brands,
    loading,
    error,
    fetchBrands,
    addBrand,
    deleteBrand,
  };
};

export type UseBrandsReturn = ReturnType<typeof useBrands>;