import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, FileText, Eye, ChevronLeft, Package, Search, X } from 'lucide-react';
import { DeliveryOrder, DeliveryItem, Product, InventoryItem } from '../types';
const API_BASE = 'http://localhost:3001/api';
const DeliveryStatusLabels: Record<string, string> = {
 draft: '草稿',
 confirmed: '已确认',
 shipped: '已发货',
 completed: '已完成'
};
const DeliveryStatusColors: Record<string, string> = {
 draft: 'bg-gray-100 text-gray-700',
 confirmed: 'bg-yellow-100 text-yellow-700',
 shipped: 'bg-blue-100 text-blue-700',
 completed: 'bg-green-100 text-green-700'
};
export function Delivery() {
 const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
 const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
 const [products, setProducts] = useState<Product[]>([]);
 const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
 const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOrder | null>(null);
 const [showPrintModal, setShowPrintModal] = useState(false);
 const printRef = useRef<HTMLDivElement>(null);
 // 表单数据
 const [formData, setFormData] = useState({
 customerName: '',
 customerContact: '',
 deliveryDate: '',
 items: [] as DeliveryItem[],
 logistics: '',
 shippingAddress: '',
 consignee: '',
 consigneePhone: '',
 boxCount: '',
 shipper: '',
 createdBy: '',
 notes: ''
 });
 // 加载数据
 const loadData = async () => {
 try {
 const [deliveriesRes, productsRes, inventoryRes] = await Promise.all([
 fetch(`${API_BASE}/delivery`),
 fetch(`${API_BASE}/products`),
 fetch(`${API_BASE}/inventory`)
 ]);
 const deliveries = await deliveriesRes.json();
 const prods = await productsRes.json();
 const inventory = await inventoryRes.json();
 setDeliveryOrders(deliveries);
 setProducts(prods);
 setInventoryItems(inventory);
 }
 catch (error) {
 console.error('加载数据失败:', error);
 }
 };
 useEffect(() => {
 loadData();
 }, []);
 // 获取产品库存
 const getProductStock = (productId: string) => {
 const item = inventoryItems.find(i => i.productId === productId);
 return item?.quantity || 0;
 };
 // 添加出库项目
 const addItem = () => {
 const newItem: DeliveryItem = {
 id: Date.now().toString(),
 productId: '',
 productName: '',
 model: '',
 unit: '台',
 quantity: 1,
 unitPrice: 0,
 amount: 0
 };
 setFormData(prev => ({
 ...prev,
 items: [...prev.items, newItem]
 }));
 };
 // 更新项目产品
 const updateItemProduct = (index: number, product: Product) => {
 const newItems = [...formData.items];
 newItems[index] = {
 ...newItems[index],
 productId: product.id,
 productName: product.name,
 model: product.model,
 unitPrice: product.price,
 amount: product.price * newItems[index].quantity
 };
 setFormData(prev => ({
 ...prev,
 items: newItems
 }));
 };
 // 更新项目数量
 const updateItemQuantity = (index: number, quantity: number) => {
 const newItems = [...formData.items];
 newItems[index] = {
 ...newItems[index],
 quantity,
 amount: newItems[index].unitPrice ? newItems[index].unitPrice * quantity : 0
 };
 setFormData(prev => ({
 ...prev,
 items: newItems
 }));
 };
 // 删除项目
 const removeItem = (index: number) => {
 setFormData(prev => ({
 ...prev,
 items: prev.items.filter((_, i) => i !== index)
 }));
 };
 // 计算合计
 const totalQuantity = formData.items.reduce((sum, item) => sum + item.quantity, 0);
 const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
 // 提交出库单
 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 try {
 const data = {
 ...formData,
 totalQuantity,
 totalAmount,
 boxCount: parseInt(formData.boxCount) || totalQuantity
 };
 const res = await fetch(`${API_BASE}/delivery`, {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(data)
 });
 if (res.ok) {
 alert('出库单创建成功');
 setFormData({
 customerName: '',
 customerContact: '',
 deliveryDate: '',
 items: [],
 logistics: '',
 shippingAddress: '',
 consignee: '',
 consigneePhone: '',
 boxCount: '',
 shipper: '',
 createdBy: '',
 notes: ''
 });
 setActiveTab('list');
 loadData();
 }
 else {
 const error = await res.json();
 alert(error.message);
 }
 }
 catch (error) {
 console.error('创建失败:', error);
 }
 };
 // 打印出库单
 const handlePrint = () => {
 setShowPrintModal(true);
 window.print();
 };
 // 关闭打印预览
 const closePrintModal = () => {
 setShowPrintModal(false);
 setSelectedDelivery(null);
 };
 return (<div className="p-6">
 {/* 打印样式 */}
 <style>{`
 @media print {
 body * {
 visibility: hidden;
 }
 .print-container, .print-container * {
 visibility: visible;
 }
 .print-container {
 position: absolute;
 left: 0;
 top: 0;
 width: 100%;
 }
 @page {
 size: A4;
 margin: 5mm;
 }
 }
 `}</style>

 {/* 打印预览 */}
 {showPrintModal && selectedDelivery && (<div className="print-container" ref={printRef}>
 <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg" id="print-content">
 {/* 公司信息 */}
 <div className="text-center mb-6">
 <h1 className="text-xl font-bold text-gray-900">江门市鸿鑫复合材料材料有限公司</h1>
 <p className="text-sm text-gray-600 mt-1">Tel:(0750) 6539892 Fax:(0750) 6539903</p>
 <div className="flex justify-between items-center mt-4">
 <span className="text-sm text-gray-600">出货单</span>
 <span className="text-sm text-gray-600">No.{selectedDelivery.orderNumber}</span>
 </div>
 </div>

 {/* 客户信息 */}
 <div className="grid grid-cols-2 gap-4 mb-4">
 <div>
 <span className="text-sm font-medium text-gray-700">客户名称:</span>
 <span className="text-sm text-gray-900 ml-2">{selectedDelivery.customerName}</span>
 </div>
 <div>
 <span className="text-sm font-medium text-gray-700">发货日期:</span>
 <span className="text-sm text-gray-900 ml-2">
 {new Date(selectedDelivery.deliveryDate).toLocaleDateString()}
 </span>
 </div>
 </div>

 {/* 物流信息 */}
 {selectedDelivery.logistics && (<div className="mb-4">
 <span className="text-sm font-medium text-gray-700">物流:</span>
 <span className="text-sm text-gray-900 ml-2">{selectedDelivery.logistics}</span>
 </div>)}

 {/* 收货信息 */}
 {selectedDelivery.shippingAddress && (<div className="mb-4">
 <span className="text-sm font-medium text-gray-700">收货地址:</span>
 <span className="text-sm text-gray-900 ml-2">{selectedDelivery.shippingAddress}</span>
 </div>)}

 {selectedDelivery.consignee && (<div className="mb-4">
 <span className="text-sm font-medium text-gray-700">收货人:</span>
 <span className="text-sm text-gray-900 ml-2">
 {selectedDelivery.consignee} {selectedDelivery.consigneePhone}
 </span>
 </div>)}

 {/* 商品表格 */}
 <table className="w-full border-collapse mb-4">
 <thead>
 <tr className="border-b border-gray-300">
 <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">编号</th>
 <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">型号</th>
 <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">颜色</th>
 <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">单位</th>
 <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">数量</th>
 <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">单价</th>
 <th className="text-right py-2 px-2 text-sm font-medium text-gray-700">金额</th>
 <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">备注</th>
 </tr>
 </thead>
 <tbody>
 {selectedDelivery.items.map((item, index) => (<tr key={item.id} className="border-b border-gray-200">
 <td className="py-2 px-2 text-sm text-gray-900">{index + 1}</td>
 <td className="py-2 px-2 text-sm text-gray-900">{item.model}</td>
 <td className="py-2 px-2 text-sm text-gray-900">{item.color || '-'}</td>
 <td className="py-2 px-2 text-sm text-gray-900">{item.unit}</td>
 <td className="py-2 px-2 text-sm text-gray-900 text-right">{item.quantity}</td>
 <td className="py-2 px-2 text-sm text-gray-900 text-right">
 {item.unitPrice?.toFixed(2) || '-'}
 </td>
 <td className="py-2 px-2 text-sm text-gray-900 text-right">
 {item.amount?.toFixed(2) || '-'}
 </td>
 <td className="py-2 px-2 text-sm text-gray-900">{item.remark || '-'}</td>
 </tr>))}
 </tbody>
 </table>

 {/* 合计 */}
 <div className="flex justify-between items-end mt-6">
 <div className="flex-1"></div>
 <div className="text-right">
 <div className="flex items-center justify-end gap-4 mb-2">
 <span className="text-sm text-gray-600">合计:</span>
 <span className="text-lg font-bold text-gray-900">{selectedDelivery.totalQuantity} 台</span>
 </div>
 <div className="flex items-center justify-end gap-4">
 <span className="text-sm text-gray-600">合计金额:</span>
 <span className="text-lg font-bold text-gray-900">
 ¥{selectedDelivery.totalAmount.toLocaleString()}
 </span>
 </div>
 {selectedDelivery.boxCount && (<div className="flex items-center justify-end gap-4 mt-2">
 <span className="text-sm text-gray-600">合计:</span>
 <span className="text-sm font-medium text-gray-900">{selectedDelivery.boxCount}箱</span>
 </div>)}
 </div>
 </div>

 {/* 颜色说明 */}
 <div className="mt-6 pt-4 border-t border-gray-300">
 <p className="text-xs text-gray-500">
 白联:存根 红联:客户 绿联:仓库 黄联:跟单
 </p>
 </div>

 {/* 签名栏 */}
 <div className="mt-8 flex justify-between">
 <div>
 <p className="text-sm text-gray-600">发货人签字:</p>
 <div className="border-b border-gray-300 w-32 mt-1"></div>
 </div>
 <div>
 <p className="text-sm text-gray-600">收货人签字:</p>
 <div className="border-b border-gray-300 w-32 mt-1"></div>
 </div>
 <div>
 <p className="text-sm text-gray-600">制单:</p>
 <div className="border-b border-gray-300 w-32 mt-1">
 {selectedDelivery.createdBy || '-'}
 </div>
 </div>
 </div>
 </div>

 {/* 关闭按钮 */}
 <button onClick={closePrintModal} className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
 关闭预览
 </button>
 </div>)}

 {/* 主页面内容 */}
 {!showPrintModal && (<>
 <div className="flex items-center gap-3 mb-6">
 <button onClick={() => setActiveTab('list')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
 <ChevronLeft className="h-5 w-5"/>
 <span>返回</span>
 </button>
 <div>
 <h1 className="text-2xl font-bold text-gray-900">出库管理</h1>
 <p className="text-gray-600 mt-1">出库单管理与打印</p>
 </div>
 </div>

 {/* 标签页导航 */}
 <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
 <div className="border-b border-gray-200">
 <nav className="-mb-px flex">
 <button onClick={() => setActiveTab('list')} className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'list'
 ? 'border-blue-500 text-blue-600 bg-blue-50'
 : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
 出库单列表
 </button>
 <button onClick={() => setActiveTab('create')} className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'create'
 ? 'border-blue-500 text-blue-600 bg-blue-50'
 : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
 创建出库单
 </button>
 </nav>
 </div>

 <div className="p-6">
 {/* 出库单列表 */}
 {activeTab === 'list' && (<div>
 <div className="flex justify-end mb-4">
 <button onClick={() => setActiveTab('create')} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
 <Plus className="h-4 w-4"/>
 新建出库单
 </button>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full">
 <thead>
 <tr className="border-b border-gray-200">
 <th className="text-left py-3 px-4 font-medium text-gray-700">出库单号</th>
 <th className="text-left py-3 px-4 font-medium text-gray-700">客户名称</th>
 <th className="text-left py-3 px-4 font-medium text-gray-700">发货日期</th>
 <th className="text-right py-3 px-4 font-medium text-gray-700">数量</th>
 <th className="text-right py-3 px-4 font-medium text-gray-700">金额</th>
 <th className="text-left py-3 px-4 font-medium text-gray-700">状态</th>
 <th className="text-left py-3 px-4 font-medium text-gray-700">操作</th>
 </tr>
 </thead>
 <tbody>
 {deliveryOrders.map(order => (<tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
 <td className="py-4 px-4 font-medium text-gray-900">{order.orderNumber}</td>
 <td className="py-4 px-4 text-gray-700">{order.customerName}</td>
 <td className="py-4 px-4 text-gray-700">
 {new Date(order.deliveryDate).toLocaleDateString()}
 </td>
 <td className="py-4 px-4 text-right text-gray-900">{order.totalQuantity} 台</td>
 <td className="py-4 px-4 text-right font-medium text-gray-900">
 ¥{order.totalAmount.toLocaleString()}
 </td>
 <td className="py-4 px-4">
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${DeliveryStatusColors[order.status]}`}>
 {DeliveryStatusLabels[order.status]}
 </span>
 </td>
 <td className="py-4 px-4">
 <div className="flex items-center gap-2">
 <button onClick={() => {
 setSelectedDelivery(order);
 handlePrint();
 }} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
 <FileText className="h-4 w-4"/>
 打印
 </button>
 </div>
 </td>
 </tr>))}
 </tbody>
 </table>
 </div>

 {deliveryOrders.length === 0 && (<div className="text-center py-12">
 <Package className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
 <p className="text-gray-500">暂无出库单</p>
 </div>)}
 </div>)}

 {/* 创建出库单 */}
 {activeTab === 'create' && (<form onSubmit={handleSubmit} className="space-y-6">
 {/* 客户信息 */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">客户名称 *</label>
 <input type="text" required value={formData.customerName} onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">客户联系</label>
 <input type="text" value={formData.customerContact} onChange={(e) => setFormData(prev => ({ ...prev, customerContact: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
 </div>
 </div>

 {/* 发货信息 */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">发货日期 *</label>
 <input type="date" required value={formData.deliveryDate} onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">物流公司</label>
 <input type="text" value={formData.logistics} onChange={(e) => setFormData(prev => ({ ...prev, logistics: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
 </div>
 </div>

 {/* 收货信息 */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">收货地址</label>
 <textarea value={formData.shippingAddress} onChange={(e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={2}/>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">收货人</label>
 <input type="text" value={formData.consignee} onChange={(e) => setFormData(prev => ({ ...prev, consignee: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
 <input type="text" value={formData.consigneePhone} onChange={(e) => setFormData(prev => ({ ...prev, consigneePhone: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
 </div>
 </div>
 </div>

 {/* 出库商品 */}
 <div className="border border-gray-200 rounded-lg p-4">
 <div className="flex items-center justify-between mb-4">
 <h3 className="text-lg font-semibold text-gray-800">出库商品</h3>
 <button type="button" onClick={addItem} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
 <Plus className="h-4 w-4"/>
 添加商品
 </button>
 </div>

 {formData.items.length === 0 ? (<div className="text-center py-8 text-gray-500">
 <Package className="w-12 h-12 mx-auto mb-2 opacity-50"/>
 <p>点击上方按钮添加出库商品</p>
 </div>) : (<div className="space-y-3">
 {formData.items.map((item, index) => (<div key={item.id} className="grid grid-cols-1 md:grid-cols-8 gap-3 p-3 bg-gray-50 rounded-lg">
 <div className="md:col-span-3">
 <label className="block text-xs text-gray-500 mb-1">选择产品</label>
 <select required value={item.productId} onChange={(e) => {
 const product = products.find(p => p.id === e.target.value);
 if (product) {
 updateItemProduct(index, product);
 }
 }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
 <option value="">-- 请选择产品 --</option>
 {products.map(product => (<option key={product.id} value={product.id}>
 {product.name} ({product.model}) - 库存: {getProductStock(product.id)}
 </option>))}
 </select>
 </div>
 <div className="md:col-span-1">
 <label className="block text-xs text-gray-500 mb-1">数量</label>
 <input type="number" min="1" required value={item.quantity} onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
 </div>
 <div className="md:col-span-1">
 <label className="block text-xs text-gray-500 mb-1">单价</label>
 <input type="number" step="0.01" value={item.unitPrice || ''} onChange={(e) => {
 const newItems = [...formData.items];
 newItems[index] = {
 ...newItems[index],
 unitPrice: parseFloat(e.target.value) || 0,
 amount: (parseFloat(e.target.value) || 0) * newItems[index].quantity
 };
 setFormData(prev => ({ ...prev, items: newItems }));
 }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
 </div>
 <div className="md:col-span-1">
 <label className="block text-xs text-gray-500 mb-1">金额</label>
 <input type="number" step="0.01" readOnly value={item.amount || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"/>
 </div>
 <div className="md:col-span-1">
 <label className="block text-xs text-gray-500 mb-1">备注</label>
 <input type="text" value={item.remark || ''} onChange={(e) => {
 const newItems = [...formData.items];
 newItems[index].remark = e.target.value;
 setFormData(prev => ({ ...prev, items: newItems }));
 }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
 </div>
 <div className="md:col-span-1 flex items-end">
 <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-1">
 <X className="h-5 w-5"/>
 </button>
 </div>
 </div>))}

 {/* 合计 */}
 <div className="border-t border-gray-300 pt-4 mt-4 flex justify-end items-center gap-8">
 <div>
 <span className="text-sm text-gray-600">合计数量:</span>
 <span className="ml-2 text-lg font-bold text-gray-900">{totalQuantity} 台</span>
 </div>
 <div>
 <span className="text-sm text-gray-600">合计金额:</span>
 <span className="ml-2 text-lg font-bold text-gray-900">¥{totalAmount.toLocaleString()}</span>
 </div>
 </div>
 </div>)}
 </div>

 {/* 其他信息 */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">箱数</label>
 <input type="number" value={formData.boxCount} onChange={(e) => setFormData(prev => ({ ...prev, boxCount: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="默认等于数量"/>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">发货人</label>
 <input type="text" value={formData.shipper} onChange={(e) => setFormData(prev => ({ ...prev, shipper: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">制单人</label>
 <input type="text" value={formData.createdBy} onChange={(e) => setFormData(prev => ({ ...prev, createdBy: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
 <input type="text" value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
 </div>
 </div>

 {/* 提交按钮 */}
 <div className="flex justify-end gap-3">
 <button type="button" onClick={() => setActiveTab('list')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
 取消
 </button>
 <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
 创建出库单
 </button>
 </div>
 </form>)}
 </div>
 </div>
 </>)}
 </div>);
}
