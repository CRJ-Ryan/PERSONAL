import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Factory, 
  Warehouse, 
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useAppStore } from '../store';

export const Home: React.FC = () => {
  const { 
    products, 
    orders, 
    productionOrders, 
    inventoryItems,
    financeSummary,
    fetchProducts, 
    fetchOrders, 
    fetchProductionOrders, 
    fetchInventory,
    fetchFinanceSummary
  } = useAppStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchProductionOrders();
    fetchInventory();
    fetchFinanceSummary();
  }, [
    fetchProducts, 
    fetchOrders, 
    fetchProductionOrders, 
    fetchInventory,
    fetchFinanceSummary
  ]);

  // 计算统计数据
  const totalProducts = products.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
  const inProduction = productionOrders.filter(o => o.status === 'in_progress').length;
  const lowStockItems = inventoryItems.filter(i => i.quantity <= i.minStock).length;

  // 订单状态分布
  const orderStatusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    in_production: orders.filter(o => o.status === 'in_production').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_production: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      shipped: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: '待处理',
      confirmed: '已确认',
      in_production: '生产中',
      ready: '准备发货',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消',
    };
    return labels[status] || status;
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">产品数量</p>
              <p className="text-3xl font-bold text-gray-800">{totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <Link to="/products" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            查看详情 →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">待处理订单</p>
              <p className="text-3xl font-bold text-gray-800">{pendingOrders}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <Link to="/orders" className="text-orange-600 text-sm hover:underline mt-2 inline-block">
            查看详情 →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">生产中工单</p>
              <p className="text-3xl font-bold text-gray-800">{inProduction}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Factory className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <Link to="/production" className="text-purple-600 text-sm hover:underline mt-2 inline-block">
            查看详情 →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">净利润</p>
              <p className="text-3xl font-bold text-gray-800">
                ¥{financeSummary?.netProfit.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <Link to="/finance" className="text-green-600 text-sm hover:underline mt-2 inline-block">
            查看详情 →
          </Link>
        </div>
      </div>

      {/* 预警和最近订单 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 库存预警 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-gray-800">库存预警</h2>
            </div>
            {lowStockItems > 0 ? (
              <div className="space-y-3">
                {inventoryItems
                  .filter(i => i.quantity <= i.minStock)
                  .slice(0, 5)
                  .map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.productName}</p>
                        <p className="text-sm text-gray-500">库存: {item.quantity} / 最低: {item.minStock}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无库存预警</p>
            )}
          </div>
        </div>

        {/* 最近订单 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">最近订单</h2>
              <Link to="/orders" className="text-blue-600 text-sm hover:underline">
                查看全部
              </Link>
            </div>
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-800">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">¥{order.totalAmount.toLocaleString()}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
