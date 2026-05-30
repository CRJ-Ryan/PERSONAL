import React, { useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useAppStore } from '../store';
import { financeApi } from '../api/client';

export const Finance: React.FC = () => {
  const { financialRecords, financeSummary, fetchFinancialRecords, fetchFinanceSummary } = useAppStore();

  useEffect(() => {
    fetchFinancialRecords();
    fetchFinanceSummary();
  }, [fetchFinancialRecords, fetchFinanceSummary]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">财务管理</h1>
          <p className="text-gray-500 mt-1">管理收入和支出</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>添加记录</span>
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">总收入</h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ¥{financeSummary?.totalIncome.toLocaleString() || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">总支出</h3>
            <div className="bg-red-100 p-2 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">
            ¥{financeSummary?.totalExpense.toLocaleString() || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500">净利润</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className={`text-3xl font-bold ${
            (financeSummary?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ¥{financeSummary?.netProfit.toLocaleString() || 0}
          </p>
        </div>
      </div>

      {/* 财务记录 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">日期</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">类型</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">分类</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">描述</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">金额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {financialRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      record.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.type === 'income' ? '收入' : '支出'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{record.category}</td>
                  <td className="px-6 py-4 text-gray-600">{record.description}</td>
                  <td className={`px-6 py-4 text-right font-medium ${
                    record.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {record.type === 'income' ? '+' : '-'}{' '}
                    ¥{record.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
