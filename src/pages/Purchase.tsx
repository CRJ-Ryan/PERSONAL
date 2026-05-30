import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Box, TrendingUp, ArrowLeft } from 'lucide-react';
import { Material, Order, PurchaseOrder, MaterialRequirement } from '../types';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3001/api';

// 物料类型标签
const MaterialTypeLabels: Record<string, string> = {
  component: '产品组件',
  packaging: '包装材料',
  consumable: '工具耗材',
  other: '其他物料'
};

// 物料类型颜色
const MaterialTypeColors: Record<string, string> = {
  component: 'bg-blue-100 text-blue-700',
  packaging: 'bg-green-100 text-green-700',
  consumable: 'bg-yellow-100 text-yellow-700',
  other: 'bg-gray-100 text-gray-700'
};

// 采购订单状态标签
const POStatusLabels: Record<string, string> = {
  draft: '草稿',
  pending: '待下单',
  ordered: '已下单',
  partial: '部分收货',
  received: '已收货',
  cancelled: '已取消'
};

// 采购订单状态颜色
const POStatusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  ordered: 'bg-blue-100 text-blue-700',
  partial: 'bg-purple-100 text-purple-700',
  received: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

export function Purchase() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'materials' | 'requirements' | 'purchase'>('materials');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [materialTypeFilter, setMaterialTypeFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const [materialsRes, ordersRes, purchaseRes] = await Promise.all([
        fetch(`${API_BASE}/purchase/materials`),
        fetch(`${API_BASE}/orders`),
        fetch(`${API_BASE}/purchase/purchase`)
      ]);
      
      const materialsData = await materialsRes.json();
      const ordersData = await ordersRes.json();
      const purchaseData = await purchaseRes.json();
      
      setMaterials(materialsData);
      setOrders(ordersData);
      setPurchaseOrders(purchaseData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 加载订单物料需求
  const loadRequirements = async (orderId: string) => {
    setSelectedOrder(orderId);
    try {
      const res = await fetch(`${API_BASE}/purchase/requirement/${orderId}`);
      const data = await res.json();
      setRequirements(data);
    } catch (error) {
      console.error('加载物料需求失败:', error);
    }
  };

  // 过滤后的物料
  const filteredMaterials = materials.filter(m => 
    materialTypeFilter === 'all' || m.type === materialTypeFilter
  );

  // 库存预警物料
  const lowStockMaterials = materials.filter(m => m.stock <= m.minStock);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">采购管理</h1>
          <p className="text-gray-600 mt-1">管理物料库存、订单物料需求和采购订单</p>
        </div>
      </div>

      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Box className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">物料总数</p>
              <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">库存预警</p>
              <p className="text-2xl font-bold text-red-600">{lowStockMaterials.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">采购订单</p>
              <p className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">待处理</p>
              <p className="text-2xl font-bold text-yellow-600">
                {purchaseOrders.filter(p => ['draft', 'pending', 'ordered'].includes(p.status)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'materials'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              物料管理
            </button>
            <button
              onClick={() => setActiveTab('requirements')}
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'requirements'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              物料需求汇总
            </button>
            <button
              onClick={() => setActiveTab('purchase')}
              className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'purchase'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              采购订单
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* 物料管理 */}
          {activeTab === 'materials' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setMaterialTypeFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      materialTypeFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    全部物料
                  </button>
                  {Object.entries(MaterialTypeLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setMaterialTypeFilter(key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        materialTypeFilter === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <Plus className="h-4 w-4" />
                  添加物料
                </button>
              </div>

              {/* 库存预警提示 */}
              {lowStockMaterials.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-red-800 mb-2">⚠️ 库存预警</h3>
                  <div className="flex flex-wrap gap-2">
                    {lowStockMaterials.map(m => (
                      <span key={m.id} className="bg-white px-3 py-1 rounded-full text-sm text-red-700 border border-red-200">
                        {m.name}: 当前库存 {m.stock} {m.unit} ≤ 最低库存 {m.minStock} {m.unit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 物料列表 */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">物料名称</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">SKU</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">类型</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">分类</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">单价</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">库存</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">供应商</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMaterials.map(material => (
                      <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{material.name}</div>
                          {material.notes && <div className="text-xs text-gray-500 mt-1">{material.notes}</div>}
                        </td>
                        <td className="py-4 px-4 text-gray-700 font-mono text-sm">{material.sku}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${MaterialTypeColors[material.type]}`}>
                            {MaterialTypeLabels[material.type]}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{material.category}</td>
                        <td className="py-4 px-4 text-gray-700">¥{material.price.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={material.stock <= material.minStock ? 'text-red-600 font-medium' : 'text-gray-900'}>
                            {material.stock} {material.unit}
                          </span>
                          <span className="text-gray-400 text-xs ml-1">/ {material.minStock}</span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{material.supplier}</td>
                        <td className="py-4 px-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            操作
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 物料需求汇总 */}
          {activeTab === 'requirements' && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">选择订单查看物料需求</label>
                <select
                  value={selectedOrder || ''}
                  onChange={(e) => e.target.value ? loadRequirements(e.target.value) : null}
                  className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- 请选择订单 --</option>
                  {orders.map(order => (
                    <option key={order.id} value={order.id}>
                      {order.orderNumber} - {order.customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {requirements && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{requirements.orderNumber}</h3>
                    <p className="text-sm text-gray-600">物料需求汇总</p>
                  </div>

                  {requirements.materials.length > 0 ? (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-medium text-gray-700">物料</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">SKU</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">类型</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">需求数量</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">当前库存</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">缺口</th>
                              <th className="text-left py-3 px-4 font-medium text-gray-700">状态</th>
                            </tr>
                          </thead>
                          <tbody>
                            {requirements.materials.map((req: MaterialRequirement) => (
                              <tr key={req.materialId} className="border-b border-gray-100">
                                <td className="py-4 px-4 font-medium text-gray-900">{req.materialName}</td>
                                <td className="py-4 px-4 text-gray-600 font-mono text-sm">{req.sku}</td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${MaterialTypeColors[req.type as string] || 'bg-gray-100 text-gray-700'}`}>
                                    {MaterialTypeLabels[req.type as string] || '其他'}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-gray-900 font-medium">{req.required} {req.unit}</td>
                                <td className="py-4 px-4 text-gray-700">{req.inStock} {req.unit}</td>
                                <td className="py-4 px-4">
                                  <span className={req.shortage > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                                    {req.shortage > 0 ? `+${req.shortage}` : '0'} {req.unit}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  {req.shortage > 0 ? (
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                      生成采购单
                                    </button>
                                  ) : (
                                    <span className="text-green-600 text-sm">库存充足</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">该订单暂无物料需求配置</p>
                    </div>
                  )}
                </div>
              )}

              {!requirements && selectedOrder === null && (
                <div className="text-center py-12">
                  <p className="text-gray-500">请选择一个订单查看物料需求</p>
                </div>
              )}
            </div>
          )}

          {/* 采购订单 */}
          {activeTab === 'purchase' && (
            <div>
              <div className="flex justify-end mb-6">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <Plus className="h-4 w-4" />
                  新建采购订单
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">采购单号</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">供应商</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">总金额</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">状态</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">预计到货</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">创建时间</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchaseOrders.map(po => (
                      <tr key={po.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{po.orderNumber}</div>
                          {po.notes && <div className="text-xs text-gray-500 mt-1">{po.notes}</div>}
                        </td>
                        <td className="py-4 px-4 text-gray-700">{po.supplier}</td>
                        <td className="py-4 px-4 font-medium text-gray-900">¥{po.totalAmount.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${POStatusColors[po.status]}`}>
                            {POStatusLabels[po.status]}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-700">
                          {po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(po.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            详情
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {purchaseOrders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">暂无采购订单</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
