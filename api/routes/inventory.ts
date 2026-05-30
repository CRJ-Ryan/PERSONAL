import { Router, Request, Response } from 'express';
import { inventoryItems, inventoryTransactions, generateId } from '../data';
import type { InventoryItem, InventoryTransaction } from '../types';

const router = Router();

// 获取库存列表
router.get('/', (req: Request, res: Response) => {
  res.json(inventoryItems);
});

// 获取库存交易记录
router.get('/transactions', (req: Request, res: Response) => {
  res.json(inventoryTransactions);
});

// 入库
router.post('/inbound', (req: Request, res: Response) => {
  const { productId, productName, quantity, location, referenceId, notes } = req.body;
  
  if (!productId || !productName || !quantity) {
    return res.status(400).json({ message: '产品ID、产品名称和数量是必填项' });
  }

  // 查找或创建库存项
  let inventoryIndex = inventoryItems.findIndex(item => item.productId === productId);
  
  if (inventoryIndex === -1) {
    const newItem: InventoryItem = {
      id: generateId(),
      productId,
      productName,
      quantity: Number(quantity),
      minStock: 5,
      location: location || '默认位置',
      lastUpdated: new Date()
    };
    inventoryItems.push(newItem);
  } else {
      inventoryItems[inventoryIndex] = {
        ...inventoryItems[inventoryIndex],
        quantity: inventoryItems[inventoryIndex].quantity + Number(quantity),
        lastUpdated: new Date()
      };
    }
  
  // 创建交易记录
  const transaction: InventoryTransaction = {
    id: generateId(),
    productId,
    type: 'in',
    quantity: Number(quantity),
    referenceId,
    notes,
    createdAt: new Date()
  };
  inventoryTransactions.push(transaction);
  
  res.status(201).json({ message: '入库成功', transaction });
});

// 出库
router.post('/outbound', (req: Request, res: Response) => {
  const { productId, quantity, referenceId, notes } = req.body;
  
  if (!productId || !quantity) {
    return res.status(400).json({ message: '产品ID和数量是必填项' });
  }

  const inventoryIndex = inventoryItems.findIndex(item => item.productId === productId);
  
  if (inventoryIndex === -1) {
    return res.status(404).json({ message: '产品库存不存在' });
  }
  
  if (inventoryItems[inventoryIndex].quantity < Number(quantity)) {
    return res.status(400).json({ message: '库存不足' });
  }
  
  inventoryItems[inventoryIndex] = {
    ...inventoryItems[inventoryIndex],
    quantity: inventoryItems[inventoryIndex].quantity - Number(quantity),
    lastUpdated: new Date()
  };
  
  // 创建交易记录
  const transaction: InventoryTransaction = {
    id: generateId(),
    productId,
    type: 'out',
    quantity: Number(quantity),
    referenceId,
    notes,
    createdAt: new Date()
  };
  inventoryTransactions.push(transaction);
  
  res.json({ message: '出库成功', transaction });
});

// 更新库存项
router.put('/:id', (req: Request, res: Response) => {
  const index = inventoryItems.findIndex(item => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '库存项不存在' });
  }

  const { productName, quantity, minStock, location } = req.body;
  
  inventoryItems[index] = {
    ...inventoryItems[index],
    productName: productName || inventoryItems[index].productName,
    quantity: quantity !== undefined ? Number(quantity) : inventoryItems[index].quantity,
    minStock: minStock !== undefined ? Number(minStock) : inventoryItems[index].minStock,
    location: location || inventoryItems[index].location,
    lastUpdated: new Date()
  };

  res.json(inventoryItems[index]);
});

export default router;
