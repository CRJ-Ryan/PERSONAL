import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Factory, 
  Warehouse, 
  DollarSign, 
  Calculator,
  Truck
} from 'lucide-react';

const menuItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/products', label: '产品管理', icon: Package },
  { path: '/orders', label: '订单管理', icon: ShoppingCart },
  { path: '/production', label: '生产管理', icon: Factory },
  { path: '/inventory', label: '仓库管理', icon: Warehouse },
  { path: '/finance', label: '财务管理', icon: DollarSign },
  { path: '/costing', label: '成本核算', icon: Calculator },
  { path: '/purchase', label: '采购管理', icon: Truck },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white min-h-screen">
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-xl font-bold">企业采购ERP</h1>
        <p className="text-blue-200 text-sm">玻璃钢模特道具</p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
