import { create } from 'zustand';
import { 
  Product, 
  Order, 
  ProductionOrder, 
  InventoryItem, 
  FinancialRecord, 
  CostCalculation,
  FinanceSummary 
} from '../types';
import { 
  productsApi, 
  ordersApi, 
  productionApi, 
  inventoryApi, 
  financeApi, 
  costingApi 
} from '../api/client';

interface AppState {
  // 产品
  products: Product[];
  productsLoading: boolean;
  fetchProducts: () => Promise<void>;
  
  // 订单
  orders: Order[];
  ordersLoading: boolean;
  fetchOrders: () => Promise<void>;
  
  // 生产
  productionOrders: ProductionOrder[];
  productionLoading: boolean;
  fetchProductionOrders: () => Promise<void>;
  
  // 库存
  inventoryItems: InventoryItem[];
  inventoryLoading: boolean;
  fetchInventory: () => Promise<void>;
  
  // 财务
  financialRecords: FinancialRecord[];
  financeSummary: FinanceSummary | null;
  financeLoading: boolean;
  fetchFinancialRecords: () => Promise<void>;
  fetchFinanceSummary: () => Promise<void>;
  
  // 成本核算
  costCalculations: CostCalculation[];
  costingLoading: boolean;
  fetchCostCalculations: () => Promise<void>;
}

export const useAppStore = create<AppState>((set) => ({
  // 产品
  products: [],
  productsLoading: false,
  fetchProducts: async () => {
    set({ productsLoading: true });
    try {
      const data = await productsApi.getAll();
      set({ products: data });
    } finally {
      set({ productsLoading: false });
    }
  },
  
  // 订单
  orders: [],
  ordersLoading: false,
  fetchOrders: async () => {
    set({ ordersLoading: true });
    try {
      const data = await ordersApi.getAll();
      set({ orders: data });
    } finally {
      set({ ordersLoading: false });
    }
  },
  
  // 生产
  productionOrders: [],
  productionLoading: false,
  fetchProductionOrders: async () => {
    set({ productionLoading: true });
    try {
      const data = await productionApi.getAll();
      set({ productionOrders: data });
    } finally {
      set({ productionLoading: false });
    }
  },
  
  // 库存
  inventoryItems: [],
  inventoryLoading: false,
  fetchInventory: async () => {
    set({ inventoryLoading: true });
    try {
      const data = await inventoryApi.getAll();
      set({ inventoryItems: data });
    } finally {
      set({ inventoryLoading: false });
    }
  },
  
  // 财务
  financialRecords: [],
  financeSummary: null,
  financeLoading: false,
  fetchFinancialRecords: async () => {
    set({ financeLoading: true });
    try {
      const data = await financeApi.getRecords();
      set({ financialRecords: data });
    } finally {
      set({ financeLoading: false });
    }
  },
  fetchFinanceSummary: async () => {
    set({ financeLoading: true });
    try {
      const data = await financeApi.getSummary();
      set({ financeSummary: data });
    } finally {
      set({ financeLoading: false });
    }
  },
  
  // 成本核算
  costCalculations: [],
  costingLoading: false,
  fetchCostCalculations: async () => {
    set({ costingLoading: true });
    try {
      const data = await costingApi.getAll();
      set({ costCalculations: data });
    } finally {
      set({ costingLoading: false });
    }
  },
}));
