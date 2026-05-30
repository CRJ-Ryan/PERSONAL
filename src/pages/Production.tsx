import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Package, Factory, Zap, ChevronDown, ChevronUp, Clock, Users, Truck } from 'lucide-react';
import { useAppStore } from '../store';
import { ProductionOrder, SemiFinishedInventory, SurfaceType, Product } from '../types';
import { productionApi } from '../api/client';

export const Production: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [surfaceTypes, setSurfaceTypes] = useState<SurfaceType[]>([]);
  
  // 模拟数据
  const [semiFinished, setSemiFinished] = useState<SemiFinishedInventory[]>([]);
  
  useEffect(() => {
    // 从store获取数据
    const store = useAppStore.getState();
    setProducts(store.products);
    fetchSurfaceTypes();
    fetchSemiFinished();
  }, []);
  
  const fetchSurfaceTypes = async () => {
    // 模拟表面处理类型数据
    setSurfaceTypes([
      {
        id: '1',
        name: '标准亮光漆',
        category: 'paint',
        paintName: '标准硝基漆',
        paintPrice: 25,
        paintDosage: 1.2,
        thinnerPrice: 12,
        thinnerDosage: 0.8,
        leadTimeDays: 2,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '2',
        name: '哑光漆',
        category: 'paint',
        paintName: '哑光硝基漆',
        paintPrice: 28,
        paintDosage: 1.3,
        thinnerPrice: 12,
        thinnerDosage: 0.9,
        leadTimeDays: 2,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '5',
        name: '电镀金色',
        category: 'outsource',
        unitPrice: 80,
        leadTimeDays: 5,
        notes: '外加工-电镀金色，周期5天',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '7',
        name: '包布（普通）',
        category: 'outsource',
        unitPrice: 35,
        leadTimeDays: 5,
        notes: '外加工-普通布料包布，周期5天',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]);
  };
  
  const fetchSemiFinished = () => {
    // 模拟半成品数据
    setSemiFinished([
      {
        id: '1',
        productId: '2',
        productName: '标准男模',
        model: 'M-185',
        quantity: 5,
        processStage: 'outshelled',
        location: '半成品区1号架',
        lastUpdated: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ]);
  };
  
  const toggleOrderExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };
  
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planned: '待开始',
      in_progress: '生产中',
      sanding_done: '打磨完成',
      surface_done: '表面处理完成',
      ready_for_warehouse: '待入库',
      completed: '已完成'
    };
    return labels[status] || status;
  };
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      sanding_done: 'bg-purple-100 text-purple-800',
      surface_done: 'bg-orange-100 text-orange-800',
      ready_for_warehouse: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString();
  };
  
  // 计算进度百分比
  const calculateProgress = (order: ProductionOrder) => {
    const totalPlanned = order.outshellProcess.planned + 
                       order.sandingProcess.planned + 
                       order.surfaceProcess.planned;
    
    const totalCompleted = order.outshellProcess.completed + 
                         order.sandingProcess.completed + 
                         order.surfaceProcess.completed;
    
    return Math.round((totalCompleted / totalPlanned) * 100);
  };
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">生产管理</h1>
          <p className="text-gray-500 mt-1">工单管理、工序进度与半成品库存</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新建工单</span>
        </button>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Factory className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">在制工单</p>
              <p className="text-2xl font-bold text-gray-800">1</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">半成品库存</p>
              <p className="text-2xl font-bold text-gray-800">
                {semiFinished.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">今日生产</p>
              <p className="text-2xl font-bold text-gray-800">9</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">待入库</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 半成品库存 */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">半成品库存</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600">产品型号</th>
                <th className="px-4 py-2 text-left text-gray-600">工序阶段</th>
                <th className="px-4 py-2 text-left text-gray-600">数量</th>
                <th className="px-4 py-2 text-left text-gray-600">库位</th>
                <th className="px-4 py-2 text-left text-gray-600">更新时间</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {semiFinished.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-gray-500">{item.model}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={
                      item.processStage === 'outshelled' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    } className="px-2 py-1 rounded-full text-xs">
                      {item.processStage === 'outshelled' ? '已出壳' : '已打磨'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-600">{item.location}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(item.lastUpdated)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 生产工单列表 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">生产工单</h2>
        
        {/* 模拟的一个生产工单 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div 
            className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleOrderExpand('1')}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Factory className="w-6 h-6 text-blue-600" />
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">标准男模 - M-185</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      生产中
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                      电镀金色
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">订单: ORD-2024-003</p>
                  <p className="text-sm text-gray-500">
                    数量: 12 | 预计入库: 2024-03-20
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">总体进度:</span>
                    <span className="text-lg font-bold text-gray-800">33%</span>
                  </div>
                  <div className="w-40 h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-200 rounded-lg">
                  {expandedOrders.has('1') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* 展开的工单详情 */}
          {expandedOrders.has('1') && (
            <div className="border-t border-gray-100 bg-gray-50 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 出壳工序 */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">出壳工序</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      10/15
                    </span>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-200 rounded-full mb-4">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '66%' }} />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      计划: 15 (含3个备用)
                    </p>
                    <p className="text-sm text-gray-600">
                      完成: 10
                    </p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">每日进度:</p>
                    <div className="space-y-1">
                      <p className="text-gray-700">
                        2024-03-12: 5件
                      </p>
                      <p className="text-gray-700">
                        2024-03-13: 5件
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* 打磨工序 */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">打磨工序</h4>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      4/12
                    </span>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-200 rounded-full mb-4">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '33%' }} />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      计划: 12
                    </p>
                    <p className="text-sm text-gray-600">
                      完成: 4
                    </p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-gray-500 mb-1">每日进度:</p>
                    <p className="text-gray-700">
                      2024-03-13: 4件
                    </p>
                  </div>
                </div>
                
                {/* 表面处理工序 */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">表面处理</h4>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                      0/12
                    </span>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-200 rounded-full mb-4">
                    <div className="h-full bg-gray-400 rounded-full" style={{ width: '0%' }} />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      类型: 电镀金色 (外加工)
                    </p>
                    <p className="text-sm text-gray-600">
                      周期: 5天
                    </p>
                    <p className="text-sm text-gray-600">
                      计划: 12
                    </p>
                    <p className="text-sm text-orange-600 font-medium">
                      打磨完成 +5天后入库
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">备注</p>
                    <p className="font-medium text-gray-800">
                      多备3个壳预防次品
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">开始时间</p>
                    <p className="font-medium text-gray-800">2024-03-12</p>
                  </div>
                  <div>
                    <p className="text-gray-600">预计入库</p>
                    <p className="font-medium text-blue-600">2024-03-20</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
