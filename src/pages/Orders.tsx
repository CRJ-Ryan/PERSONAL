import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ShoppingCart, Package } from 'lucide-react';
import { useAppStore } from '../store';
import { Order } from '../types';
import { ordersApi } from '../api/client';

export const Orders: React.FC = () => {
  const { orders, fetchOrders, products } = useAppStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">订单管理</h1>
          <p className="text-gray-500 mt-1">管理销售订单，跟踪订单状态</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>新建订单</span>
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`bg-white rounded-xl shadow-sm border-2 cursor-pointer transition-all ${
              selectedOrder?.id === order.id ? 'border-blue-500' : 'border-gray-100 hover:border-gray-200'
            }`}
            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg">{order.orderNumber}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">客户:</span> {order.customer.name}
                      </p>
                      <p className="text-gray-500">{order.customer.contact}</p>
                      <p className="text-gray-500 text-xs">{order.customer.address}</p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ¥{order.totalAmount.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.items.length} 个产品
                  </p>
                </div>
              </div>
            </div>

            {/* 展开的订单详情 */}
            {selectedOrder?.id === order.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  订单产品
                </h4>
                
                <div className="space-y-3 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">产品名称</p>
                          <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">型号</p>
                          <p className="text-sm font-medium text-gray-800">{item.model}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">表面效果</p>
                          <p className="text-sm font-medium text-gray-800">{item.surface}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">底座</p>
                          <p className="text-sm font-medium text-gray-800">{item.pedestal}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">数量</p>
                          <p className="text-sm font-medium text-gray-800">× {item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">单价</p>
                          <p className="text-sm font-medium text-gray-800">¥{item.unitPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end">
                        <span className="text-sm text-gray-600">小计: </span>
                        <span className="text-lg font-bold text-blue-600 ml-2">
                          ¥{item.subtotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                      <span>编辑订单</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-sm text-gray-600">订单总计: </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ¥{order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
          <p className="text-gray-500">点击"新建订单"开始创建</p>
        </div>
      )}
    </div>
  );
};
