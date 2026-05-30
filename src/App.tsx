import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Home } from "@/pages/Home";
import { Products } from "@/pages/Products";
import { Orders } from "@/pages/Orders";
import { Production } from "@/pages/Production";
import { Inventory } from "@/pages/Inventory";
import { Finance } from "@/pages/Finance";
import { Costing } from "@/pages/Costing";
import { Purchase } from "@/pages/Purchase";
import { Delivery } from "@/pages/Delivery";

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/production" element={<Production />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/costing" element={<Costing />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/delivery" element={<Delivery />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
