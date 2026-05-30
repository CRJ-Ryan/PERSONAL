import { Router, Request, Response } from 'express';
import {
  deliveryOrders,
  inventoryItems,
  products,
  generateId,
  generateDeliveryOrderNumber
} from '../data';
import type { DeliveryOrder, DeliveryItem } from '../types';

const router = Router();

// 获取所有出库单
router.get('/', (req: Request, res: Response) => {
  const { status } = req.query;
  let result = [...deliveryOrders];
  
  if (status) {
    result = result.filter(d => d.status === status);
  }
  
  res.json(result);
});

// 获取单个出库单
router.get('/:id', (req: Request, res: Response) => {
  const delivery = deliveryOrders.find(d => d.id === req.params.id);
  if (!delivery) {
    return res.status(404).json({ message: '出库单未找到' });
  }
  res.json(delivery);
});

// 创建出库单
router.post('/', (req: Request, res: Response) => {
  const { customerName, customerContact, deliveryDate, items, logistics, shippingAddress, consignee, consigneePhone, boxCount, shipper, createdBy, notes } = req.body;
  
  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ message: '客户名称和出库项目为必填项' });
  }
  
  // 检查库存
  for (const item of items) {
    const inventory = inventoryItems.find(i => i.productId === item.productId);
    if (!inventory || inventory.quantity < item.quantity) {
      const product = products.find(p => p.id === item.productId);
      return res.status(400).json({ 
        message: `${product?.name || '产品'}库存不足，当前库存: ${inventory?.quantity || 0}，需求: ${item.quantity}` 
      });
    }
  }
  
  // 扣减库存
  for (const item of items) {
    const inventory = inventoryItems.find(i => i.productId === item.productId);
    if (inventory) {
      inventory.quantity -= item.quantity;
      inventory.lastUpdated = new Date();
    }
  }
  
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  
  const newDelivery: DeliveryOrder = {
    id: generateId(),
    orderNumber: generateDeliveryOrderNumber(),
    customerName,
    customerContact,
    deliveryDate: new Date(deliveryDate),
    items: items.map((item: any) => ({
      id: generateId(),
      productId: item.productId,
      productName: item.productName,
      model: item.model,
      color: item.color,
      unit: item.unit || '台',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.amount,
      remark: item.remark
    })),
    logistics,
    shippingAddress,
    consignee,
    consigneePhone,
    totalQuantity,
    totalAmount,
    boxCount,
    status: 'confirmed',
    shipper,
    createdBy,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  deliveryOrders.push(newDelivery);
  res.status(201).json(newDelivery);
});

// 更新出库单
router.put('/:id', (req: Request, res: Response) => {
  const index = deliveryOrders.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '出库单未找到' });
  }
  
  deliveryOrders[index] = {
    ...deliveryOrders[index],
    ...req.body,
    id: req.params.id,
    updatedAt: new Date()
  };
  
  res.json(deliveryOrders[index]);
});

// 更新出库单状态
router.put('/:id/status', (req: Request, res: Response) => {
  const index = deliveryOrders.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '出库单未找到' });
  }
  
  deliveryOrders[index].status = req.body.status;
  deliveryOrders[index].updatedAt = new Date();
  res.json(deliveryOrders[index]);
});

// 删除出库单（仅限草稿状态）
router.delete('/:id', (req: Request, res: Response) => {
  const index = deliveryOrders.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '出库单未找到' });
  }
  
  if (deliveryOrders[index].status !== 'draft') {
    return res.status(400).json({ message: '只能删除草稿状态的出库单' });
  }
  
  deliveryOrders.splice(index, 1);
  res.json({ message: '删除成功' });
});

export default router;
