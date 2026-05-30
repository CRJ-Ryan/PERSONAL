import {
  Product,
  Order,
  ProductionOrder,
  InventoryItem,
  InventoryTransaction,
  FinancialRecord,
  MonthlyOverhead,
  SurfaceType,
  ProductBaseCost,
  MonthlyProductCost,
  Material,
  ProductMaterialBOM,
  PurchaseOrder,
  PurchaseOrderItem,
  DeliveryOrder
} from '../types';

// 表面处理类型数据
export let surfaceTypes: SurfaceType[] = [
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'PU亮光漆',
    category: 'paint',
    paintName: 'PU聚氨酯漆',
    paintPrice: 45,
    paintDosage: 1.5,
    thinnerPrice: 18,
    thinnerDosage: 1.0,
    leadTimeDays: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'PU哑光漆',
    category: 'paint',
    paintName: 'PU哑光漆',
    paintPrice: 48,
    paintDosage: 1.5,
    thinnerPrice: 18,
    thinnerDosage: 1.0,
    leadTimeDays: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '5',
    name: '电镀金色',
    category: 'outsource',
    unitPrice: 80,
    leadTimeDays: 5,
    notes: '外加工-电镀金色，周期5天',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '6',
    name: '电镀银色',
    category: 'outsource',
    unitPrice: 75,
    leadTimeDays: 5,
    notes: '外加工-电镀银色，周期5天',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '7',
    name: '包布（普通）',
    category: 'outsource',
    unitPrice: 35,
    leadTimeDays: 5,
    notes: '外加工-普通布料包布，周期5天',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '8',
    name: '包布（高档）',
    category: 'outsource',
    unitPrice: 55,
    leadTimeDays: 5,
    notes: '外加工-高档布料包布，周期5天',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// 物料数据
export let materials: Material[] = [
  // 组件类
  { id: 'M001', name: '玻璃纤维布', sku: 'FIBER-001', type: 'component', category: '基础材料', unit: '公斤', price: 18, stock: 500, minStock: 100, supplier: '玻璃纤维厂', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'M002', name: '不饱和树脂', sku: 'RESIN-001', type: 'component', category: '基础材料', unit: '公斤', price: 25, stock: 300, minStock: 80, supplier: '树脂化工', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'M003', name: '滑石粉', sku: 'TALC-001', type: 'component', category: '辅助材料', unit: '公斤', price: 5, stock: 800, minStock: 200, supplier: '滑石粉厂', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'M004', name: '固化剂', sku: 'CURE-001', type: 'component', category: '辅助材料', unit: '公斤', price: 40, stock: 100, minStock: 30, supplier: '化工原料', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'M005', name: '钴水', sku: 'COBALT-001', type: 'component', category: '辅助材料', unit: '公斤', price: 80, stock: 50, minStock: 15, supplier: '化工原料', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  
  // 包装类
  { id: 'P001', name: '标准纸箱A', sku: 'BOX-001', type: 'packaging', category: '包装材料', unit: '个', price: 8, stock: 500, minStock: 100, supplier: '纸箱厂', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'P002', name: '标准纸箱B', sku: 'BOX-002', type: 'packaging', category: '包装材料', unit: '个', price: 12, stock: 300, minStock: 80, supplier: '纸箱厂', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'P003', name: 'PE包装袋', sku: 'BAG-001', type: 'packaging', category: '包装材料', unit: '个', price: 2, stock: 1000, minStock: 200, supplier: '胶袋厂', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  
  // 耗材类
  { id: 'C001', name: '砂纸120目', sku: 'SAND-120', type: 'consumable', category: '工具耗材', unit: '张', price: 3, stock: 200, minStock: 50, supplier: '磨料供应商', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'C002', name: '砂纸240目', sku: 'SAND-240', type: 'consumable', category: '工具耗材', unit: '张', price: 3.5, stock: 150, minStock: 50, supplier: '磨料供应商', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'C003', name: '砂轮片', sku: 'WHEEL-001', type: 'consumable', category: '工具耗材', unit: '片', price: 15, stock: 50, minStock: 20, supplier: '工具行', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'C004', name: '防护口罩', sku: 'MASK-001', type: 'consumable', category: '劳保用品', unit: '个', price: 1.5, stock: 500, minStock: 100, supplier: '劳保用品', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'C005', name: '防护手套', sku: 'GLOVE-001', type: 'consumable', category: '劳保用品', unit: '双', price: 5, stock: 100, minStock: 30, supplier: '劳保用品', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  
  // 其它类
  { id: 'O001', name: '天那水', sku: 'THINNER-001', type: 'other', category: '化工溶剂', unit: '升', price: 20, stock: 50, minStock: 20, supplier: '化工原料', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 'O002', name: '清洁布', sku: 'CLOTH-001', type: 'other', category: '清洁用品', unit: '卷', price: 25, stock: 30, minStock: 10, supplier: '清洁用品', createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') }
];

// 产品物料清单
export let productBOMs: ProductMaterialBOM[] = [
  // 标准女模
  { id: 'BOM001', productId: '1', materialId: 'M001', quantity: 1.2, notes: '玻璃纤维用量' },
  { id: 'BOM002', productId: '1', materialId: 'M002', quantity: 0.8, notes: '树脂用量' },
  { id: 'BOM003', productId: '1', materialId: 'M003', quantity: 0.3, notes: '滑石粉用量' },
  { id: 'BOM004', productId: '1', materialId: 'M004', quantity: 0.15, notes: '固化剂用量' },
  { id: 'BOM005', productId: '1', materialId: 'M005', quantity: 0.08, notes: '钴水用量' },
  { id: 'BOM006', productId: '1', materialId: 'P001', quantity: 1, notes: '标准纸箱' },
  { id: 'BOM007', productId: '1', materialId: 'P003', quantity: 1, notes: 'PE包装袋' },
  
  // 标准男模
  { id: 'BOM008', productId: '2', materialId: 'M001', quantity: 1.4, notes: '玻璃纤维用量' },
  { id: 'BOM009', productId: '2', materialId: 'M002', quantity: 0.9, notes: '树脂用量' },
  { id: 'BOM010', productId: '2', materialId: 'M003', quantity: 0.35, notes: '滑石粉用量' },
  { id: 'BOM011', productId: '2', materialId: 'M004', quantity: 0.18, notes: '固化剂用量' },
  { id: 'BOM012', productId: '2', materialId: 'M005', quantity: 0.10, notes: '钴水用量' },
  { id: 'BOM013', productId: '2', materialId: 'P002', quantity: 1, notes: '标准纸箱B' },
  { id: 'BOM014', productId: '2', materialId: 'P003', quantity: 1, notes: 'PE包装袋' },
  
  // 儿童模特
  { id: 'BOM015', productId: '3', materialId: 'M001', quantity: 0.8, notes: '玻璃纤维用量' },
  { id: 'BOM016', productId: '3', materialId: 'M002', quantity: 0.55, notes: '树脂用量' },
  { id: 'BOM017', productId: '3', materialId: 'M003', quantity: 0.2, notes: '滑石粉用量' },
  { id: 'BOM018', productId: '3', materialId: 'M004', quantity: 0.1, notes: '固化剂用量' },
  { id: 'BOM019', productId: '3', materialId: 'M005', quantity: 0.05, notes: '钴水用量' },
  { id: 'BOM020', productId: '3', materialId: 'P001', quantity: 1, notes: '标准纸箱' },
  { id: 'BOM021', productId: '3', materialId: 'P003', quantity: 1, notes: 'PE包装袋' },
  
  // 半身女模
  { id: 'BOM022', productId: '4', materialId: 'M001', quantity: 0.7, notes: '玻璃纤维用量' },
  { id: 'BOM023', productId: '4', materialId: 'M002', quantity: 0.5, notes: '树脂用量' },
  { id: 'BOM024', productId: '4', materialId: 'M003', quantity: 0.18, notes: '滑石粉用量' },
  { id: 'BOM025', productId: '4', materialId: 'M004', quantity: 0.08, notes: '固化剂用量' },
  { id: 'BOM026', productId: '4', materialId: 'M005', quantity: 0.04, notes: '钴水用量' },
  { id: 'BOM027', productId: '4', materialId: 'P001', quantity: 1, notes: '标准纸箱' },
  { id: 'BOM028', productId: '4', materialId: 'P003', quantity: 1, notes: 'PE包装袋' }
];

// 产品数据 - 包含纸箱尺寸
export let products: Product[] = [
  {
    id: '1',
    name: '标准女模',
    model: 'F-180',
    category: '全身模特',
    description: '高品质玻璃钢材质，站立姿态，适合服装展示',
    price: 1200,
    components: {
      型号: 'F-180',
      头型: '标准女头型A',
      手掌: '女式手掌M',
      手件: '女式手件',
      腰件: '标准腰件',
      肩件: '女式肩件38cm',
      大腿件: '大腿件55cm',
      后腿件: '后腿件52cm',
      底管: '底管12cm',
      小腿管: '小腿管42cm',
      地板: '标准底座φ35cm',
      表面: '标准亮光漆'
    },
    cartonSize: { length: 80, width: 30, height: 185 },
    specifications: {
      '身高': '180cm',
      '胸围': '96cm',
      '腰围': '78cm',
      '臀围': '94cm',
      '材质': '玻璃钢'
    },
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: '标准男模',
    model: 'M-185',
    category: '全身模特',
    description: '男性造型全身模特，适合男装展示',
    price: 1400,
    components: {
      型号: 'M-185',
      头型: '标准男头型B',
      手掌: '男式手掌L',
      手件: '男式手件',
      腰件: '男式腰件',
      肩件: '男式肩件42cm',
      大腿件: '大腿件58cm',
      后腿件: '后腿件55cm',
      底管: '底管14cm',
      小腿管: '小腿管45cm',
      地板: '标准底座φ38cm',
      表面: '标准亮光漆'
    },
    cartonSize: { length: 85, width: 35, height: 190 },
    specifications: {
      '身高': '185cm',
      '胸围': '100cm',
      '腰围': '82cm',
      '臀围': '98cm',
      '材质': '玻璃钢'
    },
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: '儿童模特',
    model: 'K-120',
    category: '儿童模特',
    description: '儿童尺寸模特，适合童装展示',
    price: 850,
    components: {
      型号: 'K-120',
      头型: '儿童头型C',
      手掌: '儿童手掌S',
      手件: '儿童手件',
      腰件: '儿童腰件',
      肩件: '儿童肩件28cm',
      大腿件: '大腿件38cm',
      后腿件: '后腿件35cm',
      底管: '底管8cm',
      小腿管: '小腿管28cm',
      地板: '标准底座φ25cm',
      表面: '哑光漆'
    },
    cartonSize: { length: 60, width: 25, height: 125 },
    specifications: {
      '身高': '120cm',
      '年龄': '6-8岁',
      '材质': '玻璃钢'
    },
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '4',
    name: '半身女模',
    model: 'HF-85',
    category: '半身模特',
    description: '上半身展示模特，适合上衣、内衣等展示',
    price: 680,
    components: {
      型号: 'HF-85',
      头型: '标准女头型A',
      手掌: '女式手掌M',
      手件: '女式手件',
      腰件: '标准腰件',
      肩件: '女式肩件38cm',
      大腿件: '-',
      后腿件: '-',
      底管: '-',
      小腿管: '-',
      地板: '半身底座φ30cm',
      表面: '标准亮光漆'
    },
    cartonSize: { length: 70, width: 28, height: 95 },
    specifications: {
      '高度': '85cm',
      '胸围': '92cm',
      '腰围': '72cm',
      '材质': '玻璃钢'
    },
    status: 'active',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  }
];

// 订单数据
export let orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      name: '时尚服饰有限公司',
      contact: '张经理 13800138001',
      address: '北京市朝阳区建国路88号'
    },
    items: [
      { productId: '1', productName: '标准女模', model: 'F-180', surface: '标准亮光漆', quantity: 10, unitPrice: 1200, pedestal: '标准底座φ35cm', subtotal: 12000 },
      { productId: '4', productName: '半身女模', model: 'HF-85', surface: '标准亮光漆', quantity: 5, unitPrice: 680, pedestal: '半身底座φ30cm', subtotal: 3400 }
    ],
    totalAmount: 15400,
    status: 'completed',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-25')
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      name: '精品女装店',
      contact: '李女士 13900139002',
      address: '上海市浦东新区南京路123号'
    },
    items: [
      { productId: '1', productName: '标准女模', model: 'F-180', surface: 'PU亮光漆', quantity: 8, unitPrice: 1400, pedestal: '标准底座φ35cm', subtotal: 11200 }
    ],
    totalAmount: 11200,
    status: 'shipped',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      name: '潮流男装店',
      contact: '王先生 13700137003',
      address: '广州市天河区天河路456号'
    },
    items: [
      { productId: '2', productName: '标准男模', model: 'M-185', surface: '电镀金色', quantity: 12, unitPrice: 1800, pedestal: '标准底座φ38cm', subtotal: 21600 }
    ],
    totalAmount: 21600,
    status: 'in_production',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-12')
  }
];

// 生产工单数据
export let productionOrders: ProductionOrder[] = [
  {
    id: '1',
    orderId: '3',
    productId: '2',
    productName: '标准男模',
    model: 'M-185',
    surfaceType: '电镀金色',
    surfaceTypeId: '5',
    quantity: 12,
    outshellProcess: {
      planned: 12,
      completed: 15,
      dailyProgress: [
        { date: new Date('2024-03-12'), model: 'M-185', quantity: 5 },
        { date: new Date('2024-03-13'), model: 'M-185', quantity: 10, notes: '多做3个预防次品' }
      ],
      startedAt: new Date('2024-03-12'),
      completedAt: new Date('2024-03-13')
    },
    sandingProcess: {
      planned: 12,
      completed: 8,
      dailyProgress: [
        { date: new Date('2024-03-14'), model: 'M-185', quantity: 5 },
        { date: new Date('2024-03-15'), model: 'M-185', quantity: 3 }
      ],
      startedAt: new Date('2024-03-14')
    },
    surfaceProcess: {
      planned: 12,
      completed: 0
    },
    semiFinishedQuantity: 7,
    semiFinishedNotes: '出壳完成15个，打磨完成8个，半成品库存7个',
    status: 'in_progress',
    overallProgress: 40,
    startDate: new Date('2024-03-12'),
    notes: '订单 ORD-2024-003，表面处理电镀金色，预计入库时间需加5天',
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-15')
  }
];

// 库存数据
export let inventoryItems: InventoryItem[] = [
  { id: '1', productId: '1', productName: '标准女模', model: 'F-180', quantity: 5, minStock: 10, location: 'A区1号货架', lastUpdated: new Date('2024-03-05') },
  { id: '2', productId: '2', productName: '标准男模', model: 'M-185', quantity: 3, minStock: 8, location: 'A区2号货架', lastUpdated: new Date('2024-02-20') },
  { id: '3', productId: '3', productName: '儿童模特', model: 'K-120', quantity: 8, minStock: 5, location: 'B区1号货架', lastUpdated: new Date('2024-02-15') },
  { id: '4', productId: '4', productName: '半身女模', model: 'HF-85', quantity: 12, minStock: 5, location: 'A区3号货架', lastUpdated: new Date('2024-02-20') }
];

// 库存交易记录
export let inventoryTransactions: InventoryTransaction[] = [];

// 财务记录
export let financialRecords: FinancialRecord[] = [
  { id: '1', type: 'income', category: '销售收入', amount: 15400, description: '订单 ORD-2024-001 销售收入', referenceId: '1', date: new Date('2024-02-25'), createdAt: new Date('2024-02-25') },
  { id: '2', type: 'expense', category: '材料采购', amount: 8000, description: '采购玻璃钢原材料', date: new Date('2024-02-20'), createdAt: new Date('2024-02-20') },
  { id: '3', type: 'expense', category: '人工成本', amount: 5000, description: '2月份工人工资', date: new Date('2024-02-28'), createdAt: new Date('2024-02-28') }
];

// 月度公共费用数据
export let monthlyOverheads: MonthlyOverhead[] = [
  { id: '1', year: 2024, month: 1, factoryRent: 5000, utilities: 1200, otherExpenses: 800, totalProduction: 50, overheadPerUnit: 140, notes: '2024年1月公共费用', createdAt: new Date('2024-01-31'), updatedAt: new Date('2024-01-31') },
  { id: '2', year: 2024, month: 2, factoryRent: 5000, utilities: 1500, otherExpenses: 1000, totalProduction: 45, overheadPerUnit: 166, notes: '2024年2月公共费用（春节期间）', createdAt: new Date('2024-02-29'), updatedAt: new Date('2024-02-29') },
  { id: '3', year: 2024, month: 3, factoryRent: 5000, utilities: 1100, otherExpenses: 900, totalProduction: 60, overheadPerUnit: 117, notes: '2024年3月公共费用', createdAt: new Date('2024-03-31'), updatedAt: new Date('2024-03-31') }
];

// 产品基础成本数据
export let productBaseCosts: ProductBaseCost[] = [
  {
    id: '1',
    productId: '1',
    productName: '标准女模',
    model: 'F-180',
    玻璃纤维: 120,
    树脂: 80,
    滑石粉: 30,
    固化剂: 15,
    钴水: 8,
    出壳人工: 60,
    打磨人工: 50,
    底漆人工: 40,
    面漆人工: 55,
    纸箱: 8,
    包装人工: 20,
    包装袋: 2,
    baseMaterialCost: 253,
    laborCost: 205,
    packageCost: 30,
    baseCost: 488,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    productId: '2',
    productName: '标准男模',
    model: 'M-185',
    玻璃纤维: 140,
    树脂: 90,
    滑石粉: 35,
    固化剂: 18,
    钴水: 10,
    出壳人工: 65,
    打磨人工: 55,
    底漆人工: 45,
    面漆人工: 60,
    纸箱: 12,
    包装人工: 22,
    包装袋: 2,
    baseMaterialCost: 293,
    laborCost: 225,
    packageCost: 36,
    baseCost: 554,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    productId: '3',
    productName: '儿童模特',
    model: 'K-120',
    玻璃纤维: 80,
    树脂: 55,
    滑石粉: 20,
    固化剂: 10,
    钴水: 5,
    出壳人工: 40,
    打磨人工: 35,
    底漆人工: 28,
    面漆人工: 38,
    纸箱: 8,
    包装人工: 12,
    包装袋: 2,
    baseMaterialCost: 170,
    laborCost: 141,
    packageCost: 22,
    baseCost: 333,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '4',
    productId: '4',
    productName: '半身女模',
    model: 'HF-85',
    玻璃纤维: 70,
    树脂: 50,
    滑石粉: 18,
    固化剂: 8,
    钴水: 4,
    出壳人工: 35,
    打磨人工: 30,
    底漆人工: 25,
    面漆人工: 32,
    纸箱: 8,
    包装人工: 10,
    包装袋: 2,
    baseMaterialCost: 150,
    laborCost: 122,
    packageCost: 20,
    baseCost: 292,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  }
];

// 月度产品成本明细
export let monthlyProductCosts: MonthlyProductCost[] = [
  {
    id: '1',
    productId: '1',
    productName: '标准女模',
    model: 'F-180',
    surfaceTypeId: '1',
    surfaceTypeName: '标准亮光漆',
    year: 2024,
    month: 1,
    fixedCost: 488,
    surfaceCost: 39.6,
    overheadApportion: 140,
    totalCost: 667.6,
    productionQuantity: 10,
    notes: '2024年1月生产成本',
    createdAt: new Date('2024-01-31'),
    updatedAt: new Date('2024-01-31')
  },
  {
    id: '2',
    productId: '1',
    productName: '标准女模',
    model: 'F-180',
    surfaceTypeId: '3',
    surfaceTypeName: 'PU亮光漆',
    year: 2024,
    month: 3,
    fixedCost: 488,
    surfaceCost: 85.5,
    overheadApportion: 117,
    totalCost: 690.5,
    productionQuantity: 8,
    notes: '订单 ORD-2024-002，PU亮光漆',
    createdAt: new Date('2024-03-31'),
    updatedAt: new Date('2024-03-31')
  },
  {
    id: '3',
    productId: '3',
    productName: '儿童模特',
    model: 'K-120',
    surfaceTypeId: '2',
    surfaceTypeName: '哑光漆',
    year: 2024,
    month: 2,
    fixedCost: 333,
    surfaceCost: 46.8,
    overheadApportion: 166,
    totalCost: 545.8,
    productionQuantity: 20,
    notes: '2024年2月生产成本',
    createdAt: new Date('2024-02-29'),
    updatedAt: new Date('2024-02-29')
  }
];

// 采购订单数据
export let purchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO-001',
    orderNumber: 'PO-2024-001',
    supplier: '玻璃纤维厂',
    items: [
      { id: 'POI-001', materialId: 'M001', materialName: '玻璃纤维布', quantity: 200, unitPrice: 18, subtotal: 3600, received: 200 }
    ],
    totalAmount: 3600,
    status: 'received',
    expectedDate: new Date('2024-03-10'),
    notes: '补充玻璃纤维库存',
    createdAt: new Date('2024-03-08'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'PO-002',
    orderNumber: 'PO-2024-002',
    supplier: '树脂化工',
    items: [
      { id: 'POI-002', materialId: 'M002', materialName: '不饱和树脂', quantity: 100, unitPrice: 25, subtotal: 2500, received: 0 }
    ],
    totalAmount: 2500,
    status: 'pending',
    expectedDate: new Date('2024-03-20'),
    notes: '订单 ORD-2024-003 配套物料',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  }
];

// 生成ID函数
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 生成订单号
export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const num = String(orders.length + 1).padStart(3, '0');
  return `ORD-${year}-${num}`;
};

// 生成采购订单号
export const generatePO = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const num = String(purchaseOrders.length + 1).padStart(3, '0');
  return `PO-${year}-${num}`;
};

// 出库单数据
export let deliveryOrders: DeliveryOrder[] = [
  {
    id: 'D001',
    orderNumber: 'CKD-2024-001',
    customerName: '新疆乌鲁木齐 吴剑',
    customerContact: '13800138001',
    deliveryDate: new Date('2024-05-28'),
    items: [
      { id: 'DI001', productId: '1', productName: '标准女模', model: 'WTH1053女全身', color: '脸,手臂手掌电', unit: '台', quantity: 5, unitPrice: 1200, amount: 6000, remark: '配不锈钢方盘后脚管' },
      { id: 'DI002', productId: '2', productName: '标准男模', model: 'WTH1043女坐模', color: '镀金+身体哑白', unit: '台', quantity: 4, unitPrice: 1400, amount: 5600, remark: '配凳子' }
    ],
    logistics: '发环亚物流',
    shippingAddress: '新疆乌鲁木齐市天山区中山路新澳大鞋城负一楼三信道具店',
    consignee: '吴剑',
    consigneePhone: '18099616815',
    totalQuantity: 9,
    totalAmount: 11600,
    boxCount: 9,
    status: 'completed',
    shipper: '张三',
    createdBy: '徐焕英',
    createdAt: new Date('2024-05-28'),
    updatedAt: new Date('2024-05-28')
  },
  {
    id: 'D002',
    orderNumber: 'CKD-2024-002',
    customerName: '时尚服饰有限公司',
    customerContact: '张经理 13800138001',
    deliveryDate: new Date('2024-06-01'),
    items: [
      { id: 'DI003', productId: '1', productName: '标准女模', model: 'F-180', unit: '台', quantity: 10, unitPrice: 1200, amount: 12000 }
    ],
    logistics: '顺丰速运',
    shippingAddress: '北京市朝阳区建国路88号',
    consignee: '张经理',
    consigneePhone: '13800138001',
    totalQuantity: 10,
    totalAmount: 12000,
    boxCount: 10,
    status: 'confirmed',
    createdBy: '管理员',
    createdAt: new Date('2024-05-30'),
    updatedAt: new Date('2024-05-30')
  }
];

// 生成出库单号
export const generateDeliveryOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const num = String(deliveryOrders.length + 1).padStart(3, '0');
  return `CKD-${year}-${num}`;
};
