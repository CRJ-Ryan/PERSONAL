import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package, Truck, Inbox, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../store';
import { InventoryItem, InventoryTransaction, ProductionOrder } from '../types';

export const Inventory: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showPendingInbound, setShowPendingInbound] = useState(true);
  
  // 模拟待入库工单
  const [pendingInbound, setPendingInbound] = useState<Array<{
    id: string;
    orderId?: string;
    productId: string;
    productName: string;
    model: string;
    surfaceType: string;
    quantity: number;
    sandingCompleteDate: string;
    surfaceCompleteDate: string;
    expectedWarehouseDate: string;
  }>>([]);
  
  useEffect(() => {
    fetchPendingInbound();
  }, []);
  
  const fetchPendingInbound = () => {
    setPendingInbound([
      {
        id: '1',
        orderId: 'ORD-2024-003',
        productId: '2',
        productName: '标准男模',
        model: 'M-185',
        surfaceType: '电镀金色',
        quantity: 12,
        sandingCompleteDate: '2024-03-15',
        surfaceCompleteDate: '2024-03-20',
        expectedWarehouseDate: '2024-03-22'
      }
    ]);
  };
  
  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  };
  
  const daysUntil = (dateStr: string) => {
    if (!dateStr) return 0;
    const today = new Date();
    const target = new Date(dateStr);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">仓库管理</h1>
          <p className="text-gray-500 mt-1">成品库存管理与生产入库跟进</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowTransactionModal(true)}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Package className="w-5 h-5" />
            <span>库存交易记录</span>
          </button>
          <button 
            onClick={() => window.location.href = '/delivery'}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Truck className="w-5 h-5" />
            <span>出库管理</span>
          </button>
        </div>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Inbox className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">库存总额</p>
              <p className="text-2xl font-bold text-gray-800">28</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Truck className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待入库</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">库存预警</p>
              <p className="text-2xl font-bold text-gray-800">2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日入库</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 待入库跟进 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">待入库跟进</h2>
        </div>
        
        <div className="space-y-3">
          {pendingInbound.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-gray-500">产品型号</p>
                  <p className="font-medium text-gray-800">{item.productName}</p>
                  <p className="text-sm text-gray-600">{item.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">表面处理</p>
                  <p className="font-medium text-gray-800">{item.surfaceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">数量</p>
                  <p className="font-medium text-gray-800">{item.quantity}件</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">预计入库</p>
                  <p className="font-medium text-gray-800">{formatDate(item.expectedWarehouseDate)}</p>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    daysUntil(item.expectedWarehouseDate) <= 2
                      ? 'bg-red-100 text-red-800'
                      : daysUntil(item.expectedWarehouseDate) <= 5
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {daysUntil(item.expectedWarehouseDate) > 0 
                      ? `${daysUntil(item.expectedWarehouseDate)}天后`
                      : daysUntil(item.expectedWarehouseDate) === 0
                      ? '今天'
                      : `${Math.abs(daysUntil(item.expectedWarehouseDate))}天前`}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500">打磨完成</p>
                  <p className="font-medium text-purple-600">{formatDate(item.sandingCompleteDate)}</p>
                </div>
                <div>
                  <p className="text-gray-500">表面处理完成</p>
                  <p className="font-medium text-orange-600">{formatDate(item.surfaceCompleteDate)}</p>
                </div>
                <div>
                  <p className="text-gray-500">入库逻辑</p>
                  <p className="text-gray-600">
                    {item.surfaceType.includes('电镀') || item.surfaceType.includes('包布')
                      ? '打磨完成+5天 (外加工)'
                      : '打磨完成+2天'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 库存列表 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">成品库存</h2>
        </div>
        
        <div className="space-y-0">
          {/* 标准女模 */}
          <div className="border-b border-gray-100">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand('1')}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">标准女模</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        F-185
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        库存预警
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      型号: F-180 | 库位: A区1号货架
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">库存:</span>
                      <span className="text-lg font-bold text-gray-800">5</span>
                      <span className="text-sm text-gray-400">/ 最低10</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      最后更新: 2024-03-05
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg">
                    {expandedItems.has('1') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {expandedItems.has('1') && (
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-3">最近交易</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">2024-02-25 - 出库 (订单发货)</span>
                        <span className="font-medium text-red-600">-10</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">2024-02-20 - 入库 (生产完成)</span>
                        <span className="font-medium text-green-600">+5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-3">快速操作</h4>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors text-sm">
                        入库
                      </button>
                      <button className="flex-1 bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 transition-colors text-sm">
                        出库
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 标准男模 */}
          <div className="border-b border-gray-100">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand('2')}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">标准男模</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        M-185
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                        库存预警
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      型号: M-185 | 库位: A区2号货架
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">库存:</span>
                      <span className="text-lg font-bold text-gray-800">3</span>
                      <span className="text-sm text-gray-400">/ 最低8</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      最后更新: 2024-02-20
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg">
                    {expandedItems.has('2') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 儿童模特 */}
          <div className="border-b border-gray-100">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand('3')}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">儿童模特</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        K-120
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      型号: K-120 | 库位: B区1号货架
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">库存:</span>
                      <span className="text-lg font-bold text-gray-800">8</span>
                      <span className="text-sm text-gray-400">/ 最低5</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      最后更新: 2024-02-15
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg">
                    {expandedItems.has('3') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 半身女模 */}
          <div>
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpand('4')}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-orange-600" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">半身女模</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        HF-85
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      型号: HF-85 | 库位: A区3号货架
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-500">库存:</span>
                      <span className="text-lg font-bold text-gray-800">12</span>
                      <span className="text-sm text-gray-400">/ 最低5</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      最后更新: 2024-02-20
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg">
                    {expandedItems.has('4') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 入库规则说明 */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-medium text-yellow-800 mb-3">📋 入库规则</h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">•</span>
            <span>普通表面处理（喷漆类）: 打磨完成 + 2天 入库</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">•</span>
            <span>外加工表面处理（电镀、包布等）: 打磨完成 + 5天 入库</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">•</span>
            <span>系统会根据表面处理类型自动计算预计入库时间</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
