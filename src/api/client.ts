import { 
  Product, 
  Order, 
  ProductionOrder, 
  InventoryItem, 
  InventoryTransaction, 
  FinancialRecord,
  SurfaceType,
  MonthlyOverhead,
  ProductBaseCost,
  MonthlyProductCost,
  FinanceSummary
} from '../types';

const API_BASE = '/api';

// 请求工具函数
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// 产品 API
export const productsApi = {
  getAll: () => request<Product[]>('/products'),
  getById: (id: string) => request<Product>(`/products/${id}`),
  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>) => 
    request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<void>(`/products/${id}`, { method: 'DELETE' }),
};

// 订单 API
export const ordersApi = {
  getAll: () => request<Order[]>('/orders'),
  getById: (id: string) => request<Order>(`/orders/${id}`),
  create: (data: Omit<Order, 'id' | 'orderNumber' | 'totalAmount' | 'createdAt' | 'updatedAt'>) => 
    request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<Order, 'id' | 'createdAt'>>) => 
    request<Order>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateStatus: (id: string, status: Order['status']) => 
    request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (id: string) => request<void>(`/orders/${id}`, { method: 'DELETE' }),
};

// 生产 API
export const productionApi = {
  getAll: () => request<ProductionOrder[]>('/production'),
  getById: (id: string) => request<ProductionOrder>(`/production/${id}`),
  create: (data: Omit<ProductionOrder, 'id' | 'status' | 'progress' | 'createdAt' | 'updatedAt'>) => 
    request<ProductionOrder>('/production', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<ProductionOrder, 'id' | 'createdAt'>>) => 
    request<ProductionOrder>(`/production/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateProgress: (id: string, data: { progress?: number; status?: ProductionOrder['status'] }) => 
    request<ProductionOrder>(`/production/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<void>(`/production/${id}`, { method: 'DELETE' }),
};

// 库存 API
export const inventoryApi = {
  getAll: () => request<InventoryItem[]>('/inventory'),
  getTransactions: () => request<InventoryTransaction[]>('/inventory/transactions'),
  inbound: (data: { productId: string; productName: string; quantity: number; location?: string; referenceId?: string; notes?: string }) => 
    request<{ message: string; transaction: InventoryTransaction }>('/inventory/inbound', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  outbound: (data: { productId: string; quantity: number; referenceId?: string; notes?: string }) => 
    request<{ message: string; transaction: InventoryTransaction }>('/inventory/outbound', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<InventoryItem, 'id' | 'productId' | 'lastUpdated'>>) => 
    request<InventoryItem>(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// 财务 API
export const financeApi = {
  getRecords: (type?: 'income' | 'expense', category?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<FinancialRecord[]>(`/finance/records${query}`);
  },
  getSummary: () => request<FinanceSummary>('/finance/summary'),
  createRecord: (data: Omit<FinancialRecord, 'id' | 'createdAt'>) => 
    request<FinancialRecord>('/finance/records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateRecord: (id: string, data: Partial<Omit<FinancialRecord, 'id' | 'createdAt'>>) => 
    request<FinancialRecord>(`/finance/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteRecord: (id: string) => request<void>(`/finance/records/${id}`, { method: 'DELETE' }),
};

// 表面处理类型 API
export const surfaceTypesApi = {
  getAll: () => request<SurfaceType[]>('/surface-types'),
  getByCategory: (category: 'paint' | 'outsource') => 
    request<SurfaceType[]>(`/surface-types/category/${category}`),
  getById: (id: string) => request<SurfaceType>(`/surface-types/${id}`),
  create: (data: Omit<SurfaceType, 'id' | 'createdAt' | 'updatedAt'>) => 
    request<SurfaceType>('/surface-types', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<SurfaceType, 'id' | 'createdAt'>>) => 
    request<SurfaceType>(`/surface-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => request<void>(`/surface-types/${id}`, { method: 'DELETE' }),
  calculate: (surfaceTypeId: string) =>
    request<{ surfaceTypeId: string; surfaceTypeName: string; cost: number; details: string }>(
      '/surface-types/calculate',
      {
        method: 'POST',
        body: JSON.stringify({ surfaceTypeId }),
      }
    ),
};

// 成本核算 API
export const costingApi = {
  // 月度公共费用
  getOverheads: () => request<MonthlyOverhead[]>('/costing/overheads'),
  getOverhead: (year: number, month: number) => 
    request<MonthlyOverhead>(`/costing/overheads/${year}/${month}`),
  createOverhead: (data: Omit<MonthlyOverhead, 'id' | 'overheadPerUnit' | 'createdAt' | 'updatedAt'>) => 
    request<MonthlyOverhead>('/costing/overheads', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 产品基础成本
  getBaseCosts: () => request<ProductBaseCost[]>('/costing/base-costs'),
  getBaseCost: (productId: string) => 
    request<ProductBaseCost>(`/costing/base-costs/${productId}`),
  createBaseCost: (data: Omit<ProductBaseCost, 'id' | 'baseMaterialCost' | 'laborCost' | 'packageCost' | 'baseCost' | 'createdAt' | 'updatedAt'>) => 
    request<ProductBaseCost>('/costing/base-costs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // 月度产品成本
  getMonthlyCosts: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<MonthlyProductCost[]>(`/costing/monthly${query}`);
  },
  createMonthlyCost: (data: Omit<MonthlyProductCost, 'id' | 'totalCost' | 'createdAt' | 'updatedAt'>) => 
    request<MonthlyProductCost>('/costing/monthly', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
