import { Router, Request, Response } from 'express';
import { surfaceTypes, generateId } from '../data';
import type { SurfaceType } from '../types';

const router = Router();

// 获取所有表面处理类型
router.get('/', (req: Request, res: Response) => {
  res.json(surfaceTypes);
});

// 按类别获取表面处理类型
router.get('/category/:category', (req: Request, res: Response) => {
  const { category } = req.params;
  const filtered = surfaceTypes.filter(s => s.category === category);
  res.json(filtered);
});

// 获取单个表面处理类型
router.get('/:id', (req: Request, res: Response) => {
  const surface = surfaceTypes.find(s => s.id === req.params.id);
  if (!surface) {
    return res.status(404).json({ message: '表面处理类型不存在' });
  }
  res.json(surface);
});

// 创建表面处理类型
router.post('/', (req: Request, res: Response) => {
  const { name, category, paintName, paintPrice, paintDosage, thinnerPrice, thinnerDosage, unitPrice, notes } = req.body;
  
  if (!name || !category) {
    return res.status(400).json({ message: '名称和类别是必填项' });
  }

  if (category === 'paint') {
    if (!paintName || paintPrice === undefined || paintDosage === undefined) {
      return res.status(400).json({ message: '油漆类需要填写油漆名称、单价和用量' });
    }
  } else if (category === 'outsource') {
    if (unitPrice === undefined) {
      return res.status(400).json({ message: '外加工类需要填写单价' });
    }
  }

  const newSurface: SurfaceType = {
    id: generateId(),
    name,
    category,
    paintName: category === 'paint' ? paintName : undefined,
    paintPrice: category === 'paint' ? Number(paintPrice) : undefined,
    paintDosage: category === 'paint' ? Number(paintDosage) : undefined,
    thinnerPrice: category === 'paint' ? Number(thinnerPrice || 0) : undefined,
    thinnerDosage: category === 'paint' ? Number(thinerDosage || 0) : undefined,
    unitPrice: category === 'outsource' ? Number(unitPrice) : undefined,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  surfaceTypes.push(newSurface);
  res.status(201).json(newSurface);
});

// 更新表面处理类型
router.put('/:id', (req: Request, res: Response) => {
  const index = surfaceTypes.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '表面处理类型不存在' });
  }

  const { name, category, paintName, paintPrice, paintDosage, thinnerPrice, thinnerDosage, unitPrice, notes } = req.body;
  
  surfaceTypes[index] = {
    ...surfaceTypes[index],
    name: name || surfaceTypes[index].name,
    category: category || surfaceTypes[index].category,
    paintName: paintName !== undefined ? paintName : surfaceTypes[index].paintName,
    paintPrice: paintPrice !== undefined ? Number(paintPrice) : surfaceTypes[index].paintPrice,
    paintDosage: paintDosage !== undefined ? Number(paintDosage) : surfaceTypes[index].paintDosage,
    thinnerPrice: thinnerPrice !== undefined ? Number(thinnerPrice) : surfaceTypes[index].thinnerPrice,
    thinnerDosage: thinnerDosage !== undefined ? Number(thinnerDosage) : surfaceTypes[index].thinnerDosage,
    unitPrice: unitPrice !== undefined ? Number(unitPrice) : surfaceTypes[index].unitPrice,
    notes: notes !== undefined ? notes : surfaceTypes[index].notes,
    updatedAt: new Date()
  };

  res.json(surfaceTypes[index]);
});

// 删除表面处理类型
router.delete('/:id', (req: Request, res: Response) => {
  const index = surfaceTypes.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '表面处理类型不存在' });
  }

  surfaceTypes.splice(index, 1);
  res.json({ message: '表面处理类型删除成功' });
});

// 计算表面处理成本
router.post('/calculate', (req: Request, res: Response) => {
  const { surfaceTypeId } = req.body;
  
  const surface = surfaceTypes.find(s => s.id === surfaceTypeId);
  if (!surface) {
    return res.status(404).json({ message: '表面处理类型不存在' });
  }

  let cost = 0;
  let details = '';

  if (surface.category === 'paint') {
    const paintCost = (surface.paintPrice || 0) * (surface.paintDosage || 0);
    const thinnerCost = (surface.thinnerPrice || 0) * (surface.thinnerDosage || 0);
    cost = paintCost + thinnerCost;
    details = `${surface.paintName}: ¥${surface.paintPrice} × ${surface.paintDosage}kg = ¥${paintCost} + 天那水: ¥${surface.thinnerPrice} × ${surface.thinnerDosage}kg = ¥${thinnerCost}`;
  } else if (surface.category === 'outsource') {
    cost = surface.unitPrice || 0;
    details = `外加工: ¥${surface.unitPrice}`;
  }

  res.json({
    surfaceTypeId,
    surfaceTypeName: surface.name,
    cost,
    details,
    calculation: details
  });
});

export default router;
