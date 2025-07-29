import { useState } from 'react';
import ImageUploader from './ImageUploader';

type BrandFormProps = {
  initialData?: BrandType;
  onSubmit: (data: BrandType) => void;
};

const BrandForm = ({ initialData, onSubmit }: BrandFormProps) => {
  const [brand, setBrand] = useState<BrandType>(initialData || {
    name: '',
    description: '',
    logo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(brand);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand Name
        </label>
        <input
          type="text"
          value={brand.name}
          onChange={(e) => setBrand({...brand, name: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={brand.description}
          onChange={(e) => setBrand({...brand, description: e.target.value})}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Brand Logo
        </label>
        <ImageUploader
          image={brand.logo}
          onImageChange={(logo) => setBrand({...brand, logo})}
          aspectRatio={1}
          uploadText="Upload Logo"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {initialData ? 'Update Brand' : 'Create Brand'}
        </button>
      </div>
    </form>
  );
};

export default BrandForm;