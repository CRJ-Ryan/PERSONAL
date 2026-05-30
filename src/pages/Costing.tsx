import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calculator, 
  ChevronDown, 
  ChevronUp,
  Building,
  Zap,
  Package,
  Palette,
  Wrench
} from 'lucide-react';
import { costingApi, surfaceTypesApi } from '../api/client';
import { MonthlyOverhead, ProductBaseCost, MonthlyProductCost, SurfaceType } from '../types';

export const Costing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overheads' | 'surfaceTypes' | 'baseCosts' | 'monthly'>('overheads');
  const [monthlyOverheads, setMonthlyOverheads] = useState<MonthlyOverhead[]>([]);
  const [surfaceTypes, setSurfaceTypes] = useState<SurfaceType[]>([]);
  const [baseCosts, setBaseCosts] = useState<ProductBaseCost[]>([]);
  const [monthlyCosts, setMonthlyCosts] = useState<MonthlyProductCost[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'overheads') {
        const data = await costingApi.getOverheads();
        setMonthlyOverheads(data);
      } else if (activeTab === 'surfaceTypes') {
        const data = await surfaceTypesApi.getAll();
        setSurfaceTypes(data);
      } else if (activeTab === 'baseCosts') {
        const data = await costingApi.getBaseCosts();
        setBaseCosts(data);
      } else {
        const data = await costingApi.getMonthlyCosts();
        setMonthlyCosts(data);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getMonthLabel = (month: number) => {
    const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                    '七月', '八月', '九月', '十月', '十一月', '十二月'];
    return months[month - 1] || `${month}月`;
  };

  const calculateSurfaceCost = (surface: SurfaceType) => {
    if (surface.category === 'paint') {
      const paintCost = (surface.paintPrice || 0) * (surface.paintDosage || 0);
      const thinnerCost = (surface.thinnerPrice || 0) * (surface.thinnerDosage || 0);
      return paintCost + thinnerCost;
    } else {
      return surface.unitPrice || 0;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">成本核算</h1>
          <p className="text-gray-500 mt-1">全面管理产品成本，包括材料、人工、表面处理和公共费用</p>
        </div>
      </div>

      {/* 标签页切换 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overheads')}
            className={`flex-1 min-w-[140px] px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'overheads'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Building className="w-5 h-5" />
              <span>公共费用</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('surfaceTypes')}
            className={`flex-1 min-w-[140px] px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'surfaceTypes'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Palette className="w-5 h-5" />
              <span>表面处理</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('baseCosts')}
            className={`flex-1 min-w-[140px] px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'baseCosts'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              <span>基础成本</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 min-w-[140px] px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              <span>月度成本</span>
            </div>
          </button>
        </div>
      </div>

      {/* 月度公共费用 */}
      {activeTab === 'overheads' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>说明：</strong>月度公共费用（厂租、水电、其他）按月录入，系统会自动计算每件产品的均摊费用。
              产量越低，每件均摊越高；产量越高，每件均摊越低。
            </p>
          </div>
          
          {monthlyOverheads.map((overhead) => {
            const isExpanded = expandedItems.has(overhead.id);
            const totalOverhead = overhead.factoryRent + overhead.utilities + overhead.otherExpenses;

            return (
              <div key={overhead.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleExpand(overhead.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <Building className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{overhead.year}年{getMonthLabel(overhead.month)}</h3>
                        <p className="text-sm text-gray-500">当月总产量: {overhead.totalProduction} 件</p>
                        {overhead.notes && <p className="text-sm text-gray-600 mt-1">{overhead.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">每件均摊</p>
                        <p className="text-2xl font-bold text-blue-600">¥{overhead.overheadPerUnit.toFixed(2)}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">厂租</span>
                        </div>
                        <p className="text-xl font-bold text-gray-800">¥{overhead.factoryRent.toLocaleString()}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">水电费</span>
                        </div>
                        <p className="text-xl font-bold text-gray-800">¥{overhead.utilities.toLocaleString()}</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">其他费用</span>
                        </div>
                        <p className="text-xl font-bold text-gray-800">¥{overhead.otherExpenses.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                      <span className="text-sm text-gray-600">公共费用总计</span>
                      <span className="text-2xl font-bold text-blue-700">¥{totalOverhead.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 表面处理类型 */}
      {activeTab === 'surfaceTypes' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>说明：</strong>管理不同的表面处理方式。油漆类需要填写油漆名称、单价和用量，系统自动计算成本；
              外加工（电镀、包布等）直接录入单价。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 油漆类 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-800">油漆类</h3>
              </div>
              <div className="space-y-3">
                {surfaceTypes.filter(s => s.category === 'paint').map((surface) => {
                  const cost = calculateSurfaceCost(surface);
                  return (
                    <div key={surface.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{surface.name}</p>
                        <p className="text-xs text-gray-500">
                          {surface.paintName} ¥{surface.paintPrice}/kg × {surface.paintDosage}kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">¥{cost.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 外加工类 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">外加工类</h3>
              </div>
              <div className="space-y-3">
                {surfaceTypes.filter(s => s.category === 'outsource').map((surface) => {
                  return (
                    <div key={surface.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{surface.name}</p>
                        {surface.notes && <p className="text-xs text-gray-500">{surface.notes}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">¥{surface.unitPrice}</p>
                        <p className="text-xs text-gray-400">元/件</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 表面处理详细计算 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">表面处理成本计算说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">油漆类成本计算</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>公式：</strong>油漆成本 + 天那水成本</p>
                  <p><strong>油漆：</strong>单价(元/kg) × 用量(kg)</p>
                  <p><strong>天那水：</strong>单价(元/kg) × 用量(kg)</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">外加工成本计算</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>公式：</strong>直接使用单价</p>
                  <p><strong>电镀：</strong>金色 ¥80/件，银色 ¥75/件</p>
                  <p><strong>包布：</strong>普通 ¥35/件，高档 ¥55/件</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 产品基础成本 */}
      {activeTab === 'baseCosts' && (
        <div className="space-y-4">
          {baseCosts.map((cost) => {
            const isExpanded = expandedItems.has(cost.id);

            return (
              <div key={cost.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleExpand(cost.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800 text-lg">{cost.productName}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md">{cost.model}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          材料: ¥{cost.baseMaterialCost} | 人工: ¥{cost.laborCost} | 包装: ¥{cost.packageCost}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">基础成本总计</p>
                        <p className="text-2xl font-bold text-purple-600">¥{cost.baseCost}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* 材料成本 */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded" />
                          基础材料
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2 text-sm">
                          <div className="flex justify-between"><span>玻璃纤维</span><span>¥{cost.玻璃纤维}</span></div>
                          <div className="flex justify-between"><span>树脂</span><span>¥{cost.树脂}</span></div>
                          <div className="flex justify-between"><span>滑石粉</span><span>¥{cost.滑石粉}</span></div>
                          <div className="flex justify-between"><span>固化剂</span><span>¥{cost.固化剂}</span></div>
                          <div className="flex justify-between"><span>钴水</span><span>¥{cost.钴水}</span></div>
                          <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold">
                            <span>小计</span><span className="text-orange-600">¥{cost.baseMaterialCost}</span>
                          </div>
                        </div>
                      </div>

                      {/* 人工成本 */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded" />
                          人工成本
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2 text-sm">
                          <div className="flex justify-between"><span>出壳人工</span><span>¥{cost.出壳人工}</span></div>
                          <div className="flex justify-between"><span>打磨人工</span><span>¥{cost.打磨人工}</span></div>
                          <div className="flex justify-between"><span>底漆人工</span><span>¥{cost.底漆人工}</span></div>
                          <div className="flex justify-between"><span>面漆人工</span><span>¥{cost.面漆人工}</span></div>
                          <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold">
                            <span>小计</span><span className="text-purple-600">¥{cost.laborCost}</span>
                          </div>
                        </div>
                      </div>

                      {/* 包装成本 */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-500 rounded" />
                          包装成本
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-2 text-sm">
                          <div className="flex justify-between"><span>纸箱</span><span>¥{cost.纸箱}</span></div>
                          <div className="flex justify-between"><span>包装人工</span><span>¥{cost.包装人工}</span></div>
                          <div className="flex justify-between"><span>包装袋</span><span>¥{cost.包装袋}</span></div>
                          <div className="pt-2 border-t border-gray-200 flex justify-between font-semibold">
                            <span>小计</span><span className="text-gray-600">¥{cost.packageCost}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 月度产品成本 */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>说明：</strong>月度产品成本 = 基础成本 + 表面处理成本 + 均摊公共费用。
              不同表面处理方式会导致成本差异，如 PU 漆比普通硝基漆成本更高。
            </p>
          </div>

          {monthlyCosts.map((record) => {
            const isExpanded = expandedItems.has(record.id);

            return (
              <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleExpand(record.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Calculator className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-800 text-lg">{record.productName}</h3>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md">{record.model}</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-md">{record.surfaceTypeName}</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">{record.year}年{getMonthLabel(record.month)}</span>
                        </div>
                        <p className="text-sm text-gray-500">产量: {record.productionQuantity} 件</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">总成本</p>
                        <p className="text-2xl font-bold text-green-600">¥{record.totalCost.toFixed(2)}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <p className="text-sm text-gray-500 mb-2">基础成本</p>
                        <p className="text-xl font-bold text-purple-600">¥{record.baseCost}</p>
                        <p className="text-xs text-gray-400 mt-1">{((record.baseCost / record.totalCost) * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <p className="text-sm text-gray-500 mb-2">表面处理</p>
                        <p className="text-xl font-bold text-orange-600">¥{record.surfaceCost.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 mt-1">{((record.surfaceCost / record.totalCost) * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <p className="text-sm text-gray-500 mb-2">均摊费用</p>
                        <p className="text-xl font-bold text-blue-600">¥{record.overheadApportion}</p>
                        <p className="text-xs text-gray-400 mt-1">{((record.overheadApportion / record.totalCost) * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                        <p className="text-sm text-gray-500 mb-2">生产数量</p>
                        <p className="text-xl font-bold text-green-600">{record.productionQuantity}</p>
                        <p className="text-xs text-gray-400 mt-1">件</p>
                      </div>
                    </div>

                    <div className="mt-4 bg-gradient-to-r from-purple-50 via-orange-50 to-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">成本构成</span>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-500 rounded" />
                            <span>基础成本</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-500 rounded" />
                            <span>表面处理</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded" />
                            <span>均摊费用</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex h-3 rounded-full overflow-hidden">
                        <div className="bg-purple-500" style={{ width: `${(record.baseCost / record.totalCost) * 100}%` }} />
                        <div className="bg-orange-500" style={{ width: `${(record.surfaceCost / record.totalCost) * 100}%` }} />
                        <div className="bg-blue-500" style={{ width: `${(record.overheadApportion / record.totalCost) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
