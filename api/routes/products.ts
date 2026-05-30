import { Router, Request, Response } from 'express';
import { products, generateId } from '../data';
import type { Product } from '../types';

const router = Router();

// 获取产品列表
router.get('/', (req: Request, res: Response) => {
  res.json(products);
});

// 获取产品详情
router.get('/:id', (req: Request, res: Response) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: '产品不存在' });
  }
  res.json(product);
});

// 创建产品
router.post('/', (req: Request, res: Response) => {
  const { 
    name, 
    model, 
    category, 
    description, 
    price, 
    components, 
    specifications, 
    status, 
    imageUrl 
  } = req.body;
  
  if (!name || !category || !price) {
    return res.status(400).json({ message: '产品名称、分类和价格是必填项' });
  }

  const defaultComponents = {
    型号: model || '',
    头型: '',
    手掌: '',
    手件: '',
    腰件: '',
    肩件: '',
    大腿件: '',
    后腿件: '',
    底管: '',
    小腿管: '',
    地板: '',
    表面: ''
  };

  const newProduct: Product = {
    id: generateId(),
    name,
    model: model || '',
    category,
    description: description || '',
    price: Number(price),
    components: { ...defaultComponents, ...components },
    specifications: specifications || {},
    status: status || 'active',
    imageUrl,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// 更新产品
router.put('/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '产品不存在' });
  }

  const { 
    name, 
    model, 
    category, 
    description, 
    price, 
    components, 
    specifications, 
    status, 
    imageUrl 
  } = req.body;
  
  products[index] = {
    ...products[index],
    name: name || products[index].name,
    model: model !== undefined ? model : products[index].model,
    category: category || products[index].category,
    description: description !== undefined ? description : products[index].description,
    price: price !== undefined ? Number(price) : products[index].price,
    components: components ? { ...products[index].components, ...components } : products[index].components,
    specifications: specifications || products[index].specifications,
    status: status || products[index].status,
    imageUrl: imageUrl !== undefined ? imageUrl : products[index].imageUrl,
    updatedAt: new Date()
  };

  res.json(products[index]);
});

// 删除产品
router.delete('/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: '产品不存在' });
  }

  products.splice(index, 1);
  res.json({ message: '产品删除成功' });
});

export default router;
