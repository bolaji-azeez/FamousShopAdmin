// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditProduct from './pages/Product/EditProductForm';
import ProductList from './pages/Product/AllPoductPage';

// Import other components...

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/products" element={<ProductList />} />
        <Route path="/productsEdits" element={<EditProduct/>} />
        {/* Add other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;