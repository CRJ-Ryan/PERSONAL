import { Router, Request, Response } from 'express';
import { orders, generateId, generateOrderNumber } from '../data';
import type { Order } from '../types';

const router = Router();

// 获取订单列表
router.get('/', (req: Request, res: Response) => {
  res.json(orders);
});

// 获取订单详情
router.get('/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: '订单不存在' });
  }
  res.json(order);
});

// 创建订单
router.post('/', (req: Request, res: Response) => {
  const { customer, items } = req.body;
  
  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ message: '客户信息和订单项是必填项' });
  }

  // 计算总金额
  const totalAmount = items.reduce((sum: number, item: any) => sum + (item.subtotal || item.quantity * item.unitPrice), 0);

  const newOrder: Order = {
    id: generateId(),
    orderNumber: generateOrderNumber(),
    customer,
    items,
    totalAmount,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// 更新订单
router.put('/:id', (req: Request, res: Response) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '订单不存在' });
  }

  const { customer, items, status } = req.body;
  
  let totalAmount = orders[index].totalAmount;
  if (items) {
    totalAmount = items.reduce((sum: number, item: any) => sum + (item.subtotal || item.quantity * item.unitPrice), 0);
  }

  orders[index] = {
    ...orders[index],
    customer: customer || orders[index].customer,
    items: items || orders[index].items,
    totalAmount,
    status: status || orders[index].status,
    updatedAt: new Date()
  };

  res.json(orders[index]);
});

// 更新订单状态
router.patch('/:id/status', (req: Request, res: Response) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '订单不存在' });
  }

  const { status } = req.body;
  
  const validStatuses = ['pending', 'confirmed', 'in_production', 'ready', 'shipped', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: '无效的订单状态' });
  }

  orders[index] = {
    ...orders[index],
    status,
    updatedAt: new Date()
  };

  res.json(orders[index]);
});

// 删除订单
router.delete('/:id', (req: Request, res: Response) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '订单不存在' });
  }

  orders.splice(index, 1);
  res.json({ message: '订单删除成功' });
});

export default router;
