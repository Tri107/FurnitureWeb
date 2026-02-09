import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/admin/Dashboard";
import Product from "./pages/admin/Product";
import AdminLayout from "./components/layout/AdminLayout";

function App() {
  return (
    <Routes>
      {/* Trang ngoài */}
      <Route path="/" element={<Home />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Product />} />
      </Route>
    </Routes>
  );
}

export default App;
