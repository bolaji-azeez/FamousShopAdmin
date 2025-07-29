export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: {
    thumbnail: string;
    fullSize: string;
  };
  stock: number;
  category: string;
  features: string[];
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt?: string;
}

export type ProductTableItem = Pick<
  Product, 
  'id' | 'name' | 'price' | 'discountedPrice' | 'stock' | 'status' | 'category'
> & {
  thumbnail: string;
};




