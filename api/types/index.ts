// 产品组成元素
export interface ProductComponent {
  型号: string;
  头型: string;
  手掌: string;
  手件: string;
  腰件: string;
  肩件: string;
  大腿件: string;
  后腿件: string;
  底管: string;
  小腿管: string;
  地板: string;
  表面: string;
}

// 纸箱尺寸
export interface CartonSize {
  length: number;
  width: number;
  height: number;
}

// 产品
export interface Product {
  id: string;
  name: string;
  model: string;
  category: string;
  description: string;
  price: number;
  components: ProductComponent;
  cartonSize: CartonSize;
  specifications: Record<string, string>;
  status: 'active' | 'inactive';
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 物料分类
export type MaterialType = 'component' | 'packaging' | 'consumable' | 'other';

// 物料
export interface Material {
  id: string;
  name: string;
  sku: string;
  type: MaterialType;
  category: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 产品物料清单
export interface ProductMaterialBOM {
  id: string;
  productId: string;
  materialId: string;
  quantity: number;
  notes?: string;
}

// 采购订单
export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  items: PurchaseOrderItem[];
  status: 'draft' | 'pending' | 'ordered' | 'partial' | 'received' | 'cancelled';
  totalAmount: number;
  expectedDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  received: number;
  notes?: string;
}

// 物料采购汇总
export interface OrderMaterialSummary {
  orderId: string;
  orderNumber: string;
  materials: MaterialRequirement[];
  createdAt: Date;
}

export interface MaterialRequirement {
  materialId: string;
  materialName: string;
  sku: string;
  required: number;
  inStock: number;
  shortage: number;
  unit: string;
}

// 订单项目
export interface OrderItem {
  productId: string;
  productName: string;
  model: string;
  surface: string;
  quantity: number;
  unitPrice: number;
  pedestal: string;
  subtotal: number;
}

// 订单
export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    contact: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in_production' | 'ready' | 'shipped' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// 工序进度记录
export interface ProcessProgress {
  date: Date;
  model: string;
  quantity: number;
  notes?: string;
}

// 生产工单
export interface ProductionOrder {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  model: string;
  surfaceType: string;
  surfaceTypeId: string;
  quantity: number;
  outshellProcess: {
    planned: number;
    completed: number;
    dailyProgress: ProcessProgress[];
    startedAt?: Date;
    completedAt?: Date;
  };
  sandingProcess: {
    planned: number;
    completed: number;
    dailyProgress: ProcessProgress[];
    startedAt?: Date;
    completedAt?: Date;
  };
  surfaceProcess: {
    planned: number;
    completed: number;
    startedAt?: Date;
    completedAt?: Date;
  };
  semiFinishedQuantity: number;
  semiFinishedNotes?: string;
  expectedWarehouseDate?: Date;
  status: 'planned' | 'in_progress' | 'sanding_done' | 'surface_done' | 'ready_for_warehouse' | 'completed';
  overallProgress: number;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 库存项
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  model: string;
  quantity: number;
  minStock: number;
  location: string;
  lastUpdated: Date;
}

// 库存交易
export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  model: string;
  type: 'in' | 'out';
  quantity: number;
  referenceType?: 'production' | 'order' | 'semi_finished';
  referenceId?: string;
  notes?: string;
  createdAt: Date;
}

// 半成品库存
export interface SemiFinishedInventory {
  id: string;
  productId: string;
  productName: string;
  model: string;
  quantity: number;
  processStage: 'outshelled' | 'sanded';
  location?: string;
  lastUpdated: Date;
  createdAt: Date;
}

// 财务记录
export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  referenceId?: string;
  date: Date;
  createdAt: Date;
}

// 表面处理类型
export interface SurfaceType {
  id: string;
  name: string;
  category: 'paint' | 'outsource';
  paintName?: string;
  paintPrice?: number;
  paintDosage?: number;
  thinnerPrice?: number;
  thinnerDosage?: number;
  unitPrice?: number;
  leadTimeDays?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 月度公共费用
export interface MonthlyOverhead {
  id: string;
  year: number;
  month: number;
  factoryRent: number;
  utilities: number;
  otherExpenses: number;
  totalProduction: number;
  overheadPerUnit: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 产品基础成本
export interface ProductBaseCost {
  id: string;
  productId: string;
  productName: string;
  model: string;
  玻璃纤维: number;
  树脂: number;
  滑石粉: number;
  固化剂: number;
  钴水: number;
  出壳人工: number;
  打磨人工: number;
  底漆人工: number;
  面漆人工: number;
  纸箱: number;
  包装人工: number;
  包装袋: number;
  baseMaterialCost: number;
  laborCost: number;
  packageCost: number;
  baseCost: number;
  createdAt: Date;
  updatedAt: Date;
}

// 月度产品成本明细
export interface MonthlyProductCost {
  id: string;
  productId: string;
  productName: string;
  model: string;
  surfaceTypeId: string;
  surfaceTypeName: string;
  year: number;
  month: number;
  fixedCost: number;
  surfaceCost: number;
  overheadApportion: number;
  totalCost: number;
  productionQuantity: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 出库单项目
export interface DeliveryItem {
  id: string;
  productId: string;
  productName: string;
  model: string;
  color?: string;
  unit: string;
  quantity: number;
  unitPrice?: number;
  amount?: number;
  remark?: string;
}

// 出库单状态
export type DeliveryStatus = 'draft' | 'confirmed' | 'shipped' | 'completed';

// 出库单
export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerContact?: string;
  deliveryDate: Date;
  items: DeliveryItem[];
  logistics?: string;
  shippingAddress?: string;
  consignee?: string;
  consigneePhone?: string;
  totalQuantity: number;
  totalAmount: number;
  boxCount?: number;
  status: DeliveryStatus;
  shipper?: string;
  receiverSignature?: string;
  createdBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
