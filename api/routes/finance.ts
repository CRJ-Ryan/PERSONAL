import { Router, Request, Response } from 'express';
import { financialRecords, generateId } from '../data';
import type { FinancialRecord } from '../types';

const router = Router();

// 获取财务记录
router.get('/records', (req: Request, res: Response) => {
  const { type, category } = req.query;
  let records = [...financialRecords];
  
  if (type) {
    records = records.filter(r => r.type === type);
  }
  if (category) {
    records = records.filter(r => r.category === category);
  }
  
  // 按日期降序排序
  records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  res.json(records);
});

// 获取财务汇总
router.get('/summary', (req: Request, res: Response) => {
  const totalIncome = financialRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const totalExpense = financialRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const netProfit = totalIncome - totalExpense;
  
  res.json({
    totalIncome,
    totalExpense,
    netProfit
  });
});

// 创建财务记录
router.post('/records', (req: Request, res: Response) => {
  const { type, category, amount, description, referenceId, date } = req.body;
  
  if (!type || !category || !amount || !description) {
    return res.status(400).json({ message: '类型、分类、金额和描述是必填项' });
  }

  if (!['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: '类型必须是 income 或 expense' });
  }

  const newRecord: FinancialRecord = {
    id: generateId(),
    type,
    category,
    amount: Number(amount),
    description,
    referenceId,
    date: date ? new Date(date) : new Date(),
    createdAt: new Date()
  };

  financialRecords.push(newRecord);
  res.status(201).json(newRecord);
});

// 更新财务记录
router.put('/records/:id', (req: Request, res: Response) => {
  const index = financialRecords.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '财务记录不存在' });
  }

  const { type, category, amount, description, referenceId, date } = req.body;
  
  financialRecords[index] = {
    ...financialRecords[index],
    type: type || financialRecords[index].type,
    category: category || financialRecords[index].category,
    amount: amount !== undefined ? Number(amount) : financialRecords[index].amount,
    description: description || financialRecords[index].description,
    referenceId: referenceId !== undefined ? referenceId : financialRecords[index].referenceId,
    date: date ? new Date(date) : financialRecords[index].date
  };

  res.json(financialRecords[index]);
});

// 删除财务记录
router.delete('/records/:id', (req: Request, res: Response) => {
  const index = financialRecords.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '财务记录不存在' });
  }

  financialRecords.splice(index, 1);
  res.json({ message: '财务记录删除成功' });
});

export default router;
