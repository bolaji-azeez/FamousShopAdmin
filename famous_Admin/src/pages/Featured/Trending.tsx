import { useState } from "react";
import DataTable from "../../component/DataTable";

const Trending = () => {
  const [trendingProducts, setTrendingProducts] = useState([
    { id: 1, name: "Premium Watch", current: true },
    { id: 2, name: "Classic Watch", current: false },
    // More products...
  ]);

  const toggleTrending = (id: number) => {
    setTrendingProducts((products) =>
      products.map((product) =>
        product.id === id ? { ...product, current: !product.current } : product
      )
    );
  };

  const columns = [
    { header: "Product Name", accessor: "name" },
    {
      header: "Status",
      accessor: "current",
      render: (current: boolean, row: any) => (
        <button
          onClick={() => toggleTrending(row.id)}
          className={`px-3 py-1 rounded-full text-sm ${
            current
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}>
          {current ? "Featured" : "Not Featured"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Trending Products</h1>
      <p className="mb-6 text-gray-600">
        Select which products should appear in the trending section on the
        homepage.
      </p>
      <DataTable data={trendingProducts} columns={columns} />
    </div>
  );
};

export default Trending;
