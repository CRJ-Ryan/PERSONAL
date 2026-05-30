import { Router, Request, Response } from 'express';
import { productionOrders, generateId } from '../data';
import type { ProductionOrder } from '../types';

const router = Router();

// 获取生产工单列表
router.get('/', (req: Request, res: Response) => {
  res.json(productionOrders);
});

// 获取生产工单详情
router.get('/:id', (req: Request, res: Response) => {
  const order = productionOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: '生产工单不存在' });
  }
  res.json(order);
});

// 创建生产工单
router.post('/', (req: Request, res: Response) => {
  const { orderId, productId, productName, quantity, notes } = req.body;
  
  if (!productId || !productName || !quantity) {
    return res.status(400).json({ message: '产品ID、产品名称和数量是必填项' });
  }

  const newOrder: ProductionOrder = {
    id: generateId(),
    orderId,
    productId,
    productName,
    quantity: Number(quantity),
    status: 'planned',
    progress: 0,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  productionOrders.push(newOrder);
  res.status(201).json(newOrder);
});

// 更新生产工单
router.put('/:id', (req: Request, res: Response) => {
  const index = productionOrders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '生产工单不存在' });
  }

  const { productId, productName, quantity, status, notes } = req.body;
  
  productionOrders[index] = {
    ...productionOrders[index],
    productId: productId || productionOrders[index].productId,
    productName: productName || productionOrders[index].productName,
    quantity: quantity !== undefined ? Number(quantity) : productionOrders[index].quantity,
    status: status || productionOrders[index].status,
    notes: notes !== undefined ? notes : productionOrders[index].notes,
    updatedAt: new Date()
  };

  res.json(productionOrders[index]);
});

// 更新生产进度
router.patch('/:id/progress', (req: Request, res: Response) => {
  const index = productionOrders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '生产工单不存在' });
  }

  const { progress, status } = req.body;
  
  const updateData: Partial<ProductionOrder> = { updatedAt: new Date() };
  
  if (progress !== undefined) {
    const newProgress = Math.max(0, Math.min(100, Number(progress)));
    updateData.progress = newProgress;
    
    if (newProgress === 100) {
      updateData.status = 'completed';
      updateData.endDate = new Date();
    } else if (newProgress > 0 && productionOrders[index].status === 'planned') {
      updateData.status = 'in_progress';
      updateData.startDate = new Date();
    }
  }
  
  if (status) {
    updateData.status = status;
    if (status === 'in_progress' && !productionOrders[index].startDate) {
      updateData.startDate = new Date();
    }
    if (status === 'completed') {
      updateData.endDate = new Date();
      updateData.progress = 100;
    }
  }

  productionOrders[index] = {
    ...productionOrders[index],
    ...updateData
  };

  res.json(productionOrders[index]);
});

// 删除生产工单
router.delete('/:id', (req: Request, res: Response) => {
  const index = productionOrders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '生产工单不存在' });
  }

  productionOrders.splice(index, 1);
  res.json({ message: '生产工单删除成功' });
});

export default router;
