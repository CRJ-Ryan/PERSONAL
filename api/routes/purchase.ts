import { Router, Request, Response } from 'express';
import {
  materials,
  productBOMs,
  purchaseOrders,
  generateId,
  generatePO
} from '../data';
import type { Material, ProductMaterialBOM, PurchaseOrder } from '../types';

const router = Router();

// 获取所有物料
router.get('/materials', (req: Request, res: Response) => {
  const { type } = req.query;
  let result = [...materials];
  
  if (type) {
    result = result.filter(m => m.type === type);
  }
  
  res.json(result);
});

// 获取单个物料
router.get('/materials/:id', (req: Request, res: Response) => {
  const material = materials.find(m => m.id === req.params.id);
  if (!material) {
    return res.status(404).json({ message: '物料未找到' });
  }
  res.json(material);
});

// 创建物料
router.post('/materials', (req: Request, res: Response) => {
  const { name, sku, type, category, unit, price, minStock, supplier, notes } = req.body;
  
  if (!name || !sku || !type || !unit || !supplier) {
    return res.status(400).json({ message: '名称、SKU、类型、单位和供应商为必填项' });
  }
  
  const newMaterial: Material = {
    id: generateId(),
    name,
    sku,
    type,
    category: category || '未分类',
    unit,
    price: price || 0,
    stock: 0,
    minStock: minStock || 0,
    supplier,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  materials.push(newMaterial);
  res.status(201).json(newMaterial);
});

// 更新物料
router.put('/materials/:id', (req: Request, res: Response) => {
  const index = materials.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '物料未找到' });
  }
  
  materials[index] = {
    ...materials[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date()
  };
  
  res.json(materials[index]);
});

// 更新物料库存
router.post('/materials/:id/stock', (req: Request, res: Response) => {
  const material = materials.find(m => m.id === req.params.id);
  if (!material) {
    return res.status(404).json({ message: '物料未找到' });
  }
  
  const { quantity, type } = req.body;
  if (type === 'in') {
    material.stock += quantity;
  } else if (type === 'out') {
    if (material.stock < quantity) {
      return res.status(400).json({ message: '库存不足' });
    }
    material.stock -= quantity;
  }
  
  material.updatedAt = new Date();
  res.json(material);
});

// 获取产品物料清单
router.get('/bom/:productId', (req: Request, res: Response) => {
  const bom = productBOMs.filter(b => b.productId === req.params.productId);
  res.json(bom);
});

// 获取订单物料需求汇总
router.get('/requirement/:orderId', (req: Request, res: Response) => {
  const order = require('../data').orders.find((o: any) => o.id === req.params.orderId);
  if (!order) {
    return res.status(404).json({ message: '订单未找到' });
  }
  
  const requirements: any[] = [];
  
  order.items.forEach((item: any) => {
    const bom = productBOMs.filter(b => b.productId === item.productId);
    bom.forEach(bomItem => {
      const material = materials.find(m => m.id === bomItem.materialId);
      if (material) {
        const required = bomItem.quantity * item.quantity;
        const shortage = Math.max(0, required - material.stock);
        
        const existingReq = requirements.find(r => r.materialId === material.id);
        if (existingReq) {
          existingReq.required += required;
          existingReq.shortage = Math.max(0, existingReq.required - existingReq.inStock);
        } else {
          requirements.push({
            materialId: material.id,
            materialName: material.name,
            sku: material.sku,
            required,
            inStock: material.stock,
            shortage,
            unit: material.unit,
            type: material.type
          });
        }
      }
    });
  });
  
  res.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    materials: requirements,
    createdAt: new Date()
  });
});

// 获取所有采购订单
router.get('/purchase', (req: Request, res: Response) => {
  const { status } = req.query;
  let result = [...purchaseOrders];
  
  if (status) {
    result = result.filter(p => p.status === status);
  }
  
  res.json(result);
});

// 获取单个采购订单
router.get('/purchase/:id', (req: Request, res: Response) => {
  const po = purchaseOrders.find(p => p.id === req.params.id);
  if (!po) {
    return res.status(404).json({ message: '采购订单未找到' });
  }
  res.json(po);
});

// 创建采购订单
router.post('/purchase', (req: Request, res: Response) => {
  const { supplier, items, expectedDate, notes } = req.body;
  
  if (!supplier || !items || items.length === 0) {
    return res.status(400).json({ message: '供应商和订单项为必填项' });
  }
  
  const totalAmount = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
  
  const newPO: PurchaseOrder = {
    id: generateId(),
    orderNumber: generatePO(),
    supplier,
    items: items.map((item: any) => ({
      id: generateId(),
      materialId: item.materialId,
      materialName: item.materialName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
      received: 0,
      notes: item.notes
    })),
    status: 'draft',
    totalAmount,
    expectedDate: expectedDate ? new Date(expectedDate) : undefined,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  purchaseOrders.push(newPO);
  res.status(201).json(newPO);
});

// 更新采购订单
router.put('/purchase/:id', (req: Request, res: Response) => {
  const index = purchaseOrders.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '采购订单未找到' });
  }
  
  const updateData = { ...req.body };
  if (updateData.items) {
    updateData.totalAmount = updateData.items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0);
  }
  
  purchaseOrders[index] = {
    ...purchaseOrders[index],
    ...updateData,
    id: req.params.id,
    updatedAt: new Date()
  };
  
  res.json(purchaseOrders[index]);
});

// 更新采购订单状态
router.put('/purchase/:id/status', (req: Request, res: Response) => {
  const index = purchaseOrders.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '采购订单未找到' });
  }
  
  purchaseOrders[index].status = req.body.status;
  purchaseOrders[index].updatedAt = new Date();
  res.json(purchaseOrders[index]);
});

// 采购收货
router.post('/purchase/:id/receive', (req: Request, res: Response) => {
  const po = purchaseOrders.find(p => p.id === req.params.id);
  if (!po) {
    return res.status(404).json({ message: '采购订单未找到' });
  }
  
  const { items } = req.body;
  
  items.forEach((receiveItem: any) => {
    const poItem = po.items.find(i => i.id === receiveItem.itemId);
    if (poItem) {
      const quantity = Math.min(receiveItem.quantity, poItem.quantity - poItem.received);
      poItem.received += quantity;
      
      const material = materials.find(m => m.id === poItem.materialId);
      if (material) {
        material.stock += quantity;
        material.updatedAt = new Date();
      }
    }
  });
  
  const allReceived = po.items.every(i => i.received >= i.quantity);
  const partialReceived = po.items.some(i => i.received > 0 && i.received < i.quantity);
  
  if (allReceived) {
    po.status = 'received';
  } else if (partialReceived) {
    po.status = 'partial';
  }
  
  po.updatedAt = new Date();
  res.json(po);
});

export default router;
