import React, { useEffect, useState, useMemo } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  X,
  Check,
  Image as ImageIcon,
  Package,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAppStore } from '../store';
import { Product } from '../types';
import { productsApi } from '../api/client';

interface Specification {
  key: string;
  value: string;
}

export const Products: React.FC = () => {
  const { products, fetchProducts } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    category: '',
    description: '',
    price: '',
    status: 'active' as 'active' | 'inactive',
    imageUrl: '',
    specifications: [] as Specification[],
    components: {
      型号: '',
      头型: '',
      手掌: '',
      手件: '',
      腰件: '',
      肩件: '',
      大腿件: '',
      后腿件: '',
      底管: '',
      小腿管: '',
      地板: '',
      表面: ''
    },
    cartonSize: {
      length: 0,
      width: 0,
      height: 0
    }
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 提取所有产品分类
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => cats.add(p.category));
    return Array.from(cats).sort();
  }, [products]);

  // 过滤产品
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.model.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory ? product.category === filterCategory : true;
      const matchesStatus = filterStatus !== 'all' ? product.status === filterStatus : true;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, filterCategory, filterStatus]);

  const toggleProduct = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const handleAddSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const handleRemoveSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateSpecification = (index: number, field: 'key' | 'value', val: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: val } : spec
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 将规格数组转换为对象
      const specObject: Record<string, string> = {};
      formData.specifications.forEach(spec => {
        if (spec.key.trim() && spec.value.trim()) {
          specObject[spec.key.trim()] = spec.value.trim();
        }
      });

      const data = {
        name: formData.name,
        model: formData.model,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        components: formData.components,
        cartonSize: formData.cartonSize,
        specifications: specObject,
        status: formData.status,
        imageUrl: formData.imageUrl || undefined
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, data);
      } else {
        await productsApi.create(data);
      }

      fetchProducts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    // 将规格对象转换为数组
    const specArray: Specification[] = Object.entries(product.specifications).map(([key, value]) => ({
      key,
      value
    }));
    setFormData({
      name: product.name,
      model: product.model || '',
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      status: product.status,
      imageUrl: product.imageUrl || '',
      specifications: specArray,
      components: product.components,
      cartonSize: product.cartonSize || { length: 0, width: 0, height: 0 }
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个产品吗？')) {
      try {
        await productsApi.delete(id);
        fetchProducts();
      } catch (error) {
        console.error('删除失败:', error);
      }
    }
  };

  const toggleStatus = async (product: Product) => {
    try {
      await productsApi.update(product.id, {
        status: product.status === 'active' ? 'inactive' : 'active'
      });
      fetchProducts();
    } catch (error) {
      console.error('状态更新失败:', error);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      model: '',
      category: '',
      description: '',
      price: '',
      status: 'active',
      imageUrl: '',
      specifications: [],
      components: {
        型号: '',
        头型: '',
        手掌: '',
        手件: '',
        腰件: '',
        肩件: '',
        大腿件: '',
        后腿件: '',
        底管: '',
        小腿管: '',
        地板: '',
        表面: ''
      },
      cartonSize: {
        length: 0,
        width: 0,
        height: 0
      }
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? '启用' : '停用';
  };

  // 产品组成元素列表
  const componentItems = [
    { key: '型号', label: '型号' },
    { key: '头型', label: '头型' },
    { key: '手掌', label: '手掌' },
    { key: '手件', label: '手件' },
    { key: '腰件', label: '腰件' },
    { key: '肩件', label: '肩件' },
    { key: '大腿件', label: '大腿件' },
    { key: '后腿件', label: '后腿件' },
    { key: '底管', label: '底管' },
    { key: '小腿管', label: '小腿管' },
    { key: '地板', label: '地板' },
    { key: '表面', label: '表面' },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">产品管理</h1>
          <p className="text-gray-500 mt-1">管理您的玻璃钢模特道具产品</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>添加产品</span>
        </button>
      </div>

      {/* 筛选和搜索栏 */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索产品名称、型号、描述或分类..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有分类</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">所有状态</option>
              <option value="active">启用</option>
              <option value="inactive">停用</option>
            </select>
          </div>
        </div>
      </div>

      {/* 产品列表 - 卡片视图 */}
      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const isExpanded = expandedProducts.has(product.id);
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleProduct(product.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-10 h-10 text-blue-300" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
                        {product.model && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md">
                            {product.model}
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                          {getStatusLabel(product.status)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-blue-600 font-medium mb-2">{product.category}</p>
                      
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ¥{product.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">单价</p>
                    </div>
                    
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 展开的产品详情 */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 产品组成元素 */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">产品组成</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {componentItems.map((item) => {
                          const value = product.components[item.key as keyof typeof product.components] || '-';
                          return (
                            <div key={item.key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                              <span className="text-sm font-medium text-gray-700">{item.label}</span>
                              <span className="text-sm text-gray-900">{value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 产品规格和操作 */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">产品规格</h4>
                      <div className="space-y-2 mb-6">
                        {/* 纸箱尺寸 */}
                        {product.cartonSize && (
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                            <span className="text-sm text-blue-700 font-medium">📦 纸箱尺寸 (长×宽×高)</span>
                            <span className="text-sm font-medium text-blue-800">
                              {product.cartonSize.length} × {product.cartonSize.width} × {product.cartonSize.height} cm
                            </span>
                          </div>
                        )}
                        
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                            <span className="text-sm text-gray-600">{key}</span>
                            <span className="text-sm font-medium text-gray-800">{value}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStatus(product);
                          }}
                          className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {product.status === 'active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          <span>{product.status === 'active' ? '停用' : '启用'}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(product);
                          }}
                          className="flex items-center space-x-1 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>编辑</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(product.id);
                          }}
                          className="flex items-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>删除</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">未找到产品</h3>
          <p className="text-gray-500">尝试修改搜索条件或筛选器</p>
        </div>
      )}

      {/* 添加/编辑产品模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? '编辑产品' : '添加产品'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品名称 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="输入产品名称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    型号
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      model: e.target.value,
                      components: { ...prev.components, '型号': e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="例如: F-180"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="输入分类名称"
                    list="categoryList"
                  />
                  <datalist id="categoryList">
                    {categories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    价格 (元) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">启用</option>
                    <option value="inactive">停用</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品图片 URL
                  </label>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    产品描述
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="输入产品描述"
                  />
                </div>
              </div>

              {/* 产品组成元素 */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">产品组成</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {componentItems.map((item) => (
                    <div key={item.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {item.label}
                      </label>
                      <input
                        type="text"
                        value={formData.components[item.key as keyof typeof formData.components] || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          components: { 
                            ...prev.components, 
                            [item.key]: e.target.value 
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder={`输入${item.label}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 纸箱尺寸 */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">📦 包装纸箱尺寸</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      长度 (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.cartonSize.length}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        cartonSize: { ...prev.cartonSize, length: Number(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      宽度 (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.cartonSize.width}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        cartonSize: { ...prev.cartonSize, width: Number(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      高度 (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.cartonSize.height}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        cartonSize: { ...prev.cartonSize, height: Number(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* 其他规格参数 */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">其他规格参数</h3>
                  <button
                    type="button"
                    onClick={handleAddSpecification}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + 添加规格
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleUpdateSpecification(index, 'key', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="规格名称"
                      />
                      <span className="text-gray-400">:</span>
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpecification(index, 'value', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="规格值"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecification(index)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? '保存修改' : '添加产品'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
