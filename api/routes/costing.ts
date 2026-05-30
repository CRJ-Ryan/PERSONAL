import { Router, Request, Response } from 'express';
import { monthlyOverheads, productBaseCosts, monthlyProductCosts, products, generateId } from '../data';
import type { MonthlyOverhead, ProductBaseCost, MonthlyProductCost } from '../types';

const router = Router();

// 获取月度公共费用列表
router.get('/overheads', (req: Request, res: Response) => {
  res.json(monthlyOverheads);
});

// 获取指定月份的公共费用
router.get('/overheads/:year/:month', (req: Request, res: Response) => {
  const { year, month } = req.params;
  const overhead = monthlyOverheads.find(
    o => o.year === parseInt(year) && o.month === parseInt(month)
  );
  if (!overhead) {
    return res.status(404).json({ message: '未找到该月份公共费用' });
  }
  res.json(overhead);
});

// 创建月度公共费用
router.post('/overheads', (req: Request, res: Response) => {
  const { year, month, factoryRent, utilities, otherExpenses, totalProduction, notes } = req.body;
  
  if (!year || !month || !factoryRent || !utilities || !otherExpenses || !totalProduction) {
    return res.status(400).json({ message: '年份、月份及费用信息是必填项' });
  }

  const totalOverhead = factoryRent + utilities + otherExpenses;
  const overheadPerUnit = totalOverhead / totalProduction;

  const newOverhead: MonthlyOverhead = {
    id: generateId(),
    year,
    month,
    factoryRent,
    utilities,
    otherExpenses,
    totalProduction,
    overheadPerUnit,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  monthlyOverheads.push(newOverhead);
  res.status(201).json(newOverhead);
});

// 获取产品基础成本列表
router.get('/base-costs', (req: Request, res: Response) => {
  res.json(productBaseCosts);
});

// 获取指定产品的基础成本
router.get('/base-costs/:productId', (req: Request, res: Response) => {
  const cost = productBaseCosts.find(c => c.productId === req.params.productId);
  if (!cost) {
    return res.status(404).json({ message: '未找到该产品基础成本' });
  }
  res.json(cost);
});

// 创建/更新产品基础成本
router.post('/base-costs', (req: Request, res: Response) => {
  const { productId, productName, model, ...costItems } = req.body;
  
  if (!productId || !productName) {
    return res.status(400).json({ message: '产品ID和产品名称是必填项' });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: '产品不存在' });
  }

  const materialCost = (costItems.玻璃纤维 || 0) + (costItems.树脂 || 0) + 
                       (costItems.滑石粉 || 0) + (costItems.固化剂 || 0) + 
                       (costItems.钴水 || 0);
  
  const laborCost = (costItems.出壳人工 || 0) + (costItems.打磨人工 || 0) + 
                    (costItems.底漆人工 || 0) + (costItems.面漆人工 || 0);
  
  const packageCost = (costItems.纸箱 || 0) + (costItems.包装人工 || 0) + 
                      (costItems.包装袋 || 0);
  
  const baseCost = materialCost + laborCost + packageCost;

  const existingIndex = productBaseCosts.findIndex(c => c.productId === productId);
  
  const costRecord: ProductBaseCost = {
    id: existingIndex >= 0 ? productBaseCosts[existingIndex].id : generateId(),
    productId,
    productName,
    model: model || product.model,
    玻璃纤维: costItems.玻璃纤维 || 0,
    树脂: costItems.树脂 || 0,
    滑石粉: costItems.滑石粉 || 0,
    固化剂: costItems.固化剂 || 0,
    钴水: costItems.钴水 || 0,
    出壳人工: costItems.出壳人工 || 0,
    打磨人工: costItems.打磨人工 || 0,
    底漆人工: costItems.底漆人工 || 0,
    面漆人工: costItems.面漆人工 || 0,
    纸箱: costItems.纸箱 || 0,
    包装人工: costItems.包装人工 || 0,
    包装袋: costItems.包装袋 || 0,
    baseMaterialCost: materialCost,
    laborCost,
    packageCost,
    baseCost,
    createdAt: existingIndex >= 0 ? productBaseCosts[existingIndex].createdAt : new Date(),
    updatedAt: new Date()
  };

  if (existingIndex >= 0) {
    productBaseCosts[existingIndex] = costRecord;
  } else {
    productBaseCosts.push(costRecord);
  }

  res.json(costRecord);
});

// 获取月度产品成本明细
router.get('/monthly', (req: Request, res: Response) => {
  const { year, month } = req.query;
  
  let result = [...monthlyProductCosts];
  
  if (year) {
    result = result.filter(c => c.year === parseInt(year as string));
  }
  if (month) {
    result = result.filter(c => c.month === parseInt(month as string));
  }
  
  result.sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1);
    const dateB = new Date(b.year, b.month - 1);
    return dateB.getTime() - dateA.getTime();
  });
  
  res.json(result);
});

// 创建月度产品成本记录
router.post('/monthly', (req: Request, res: Response) => {
  const { productId, productName, model, year, month, fixedCost, overheadApportion, productionQuantity, notes } = req.body;
  
  if (!productId || !productName || !year || !month) {
    return res.status(400).json({ message: '产品ID、产品名称、年份和月份是必填项' });
  }

  const totalCost = (fixedCost || 0) + (overheadApportion || 0);

  const newRecord: MonthlyProductCost = {
    id: generateId(),
    productId,
    productName,
    model: model || '',
    year,
    month,
    fixedCost: fixedCost || 0,
    overheadApportion: overheadApportion || 0,
    totalCost,
    productionQuantity: productionQuantity || 0,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  monthlyProductCosts.push(newRecord);
  res.status(201).json(newRecord);
});

// 获取成本核算汇总
router.get('/summary', (req: Request, res: Response) => {
  const summary = {
    totalProducts: products.length,
    totalBaseCosts: productBaseCosts.length,
    totalOverheads: monthlyOverheads.length,
    totalMonthlyRecords: monthlyProductCosts.length,
    recentOverheads: monthlyOverheads.slice(-3),
    recentRecords: monthlyProductCosts.slice(-10)
  };
  
  res.json(summary);
});

export default router;
