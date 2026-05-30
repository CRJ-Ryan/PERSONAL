# 企业采购 ERP 系统

> 玻璃钢模特道具销售专用 ERP 系统

## 🚀 功能模块

### 📦 产品管理
- 产品信息管理
- 包装纸箱尺寸记录
- 产品分类管理

### 📋 订单管理
- 客户订单录入
- 订单状态跟踪
- 订单明细管理

### 🏭 生产管理
- 出壳工序管理
- 打磨工序管理
- 生产进度跟踪
- 半成品统计

### 📊 仓库管理
- 库存实时查询
- 入库管理（自动计算入库时间）
- 出库管理
- 4联单打印

### 💰 财务管理
- 收入支出记录
- 财务汇总分析

### 🧮 成本核算
- 月度公共费用管理
- 产品基础成本计算
- 表面处理成本（油漆/外加工）
- 月度产品成本汇总

### 🛒 采购管理
- 物料管理
- 物料需求汇总
- 欠料提醒
- 采购订单管理

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router DOM
- **图标**: Lucide React
- **图表**: Recharts

### 后端
- **框架**: Express
- **语言**: TypeScript
- **开发工具**: nodemon, tsx

## 📁 项目结构

```
├── api/                    # 后端代码
│   ├── routes/            # API 路由
│   ├── types/             # 类型定义
│   ├── data/              # 数据存储
│   ├── server.ts          # 服务器入口
│   └── app.ts             # Express 应用
├── src/                   # 前端代码
│   ├── pages/             # 页面组件
│   ├── components/        # 公共组件
│   ├── store/             # 状态管理
│   ├── types/             # 类型定义
│   ├── api/               # API 客户端
│   └── hooks/             # 自定义 Hooks
├── public/                # 静态资源
├── package.json           # 项目配置
├── vite.config.ts         # Vite 配置
└── tailwind.config.js     # Tailwind 配置
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

前端开发服务器：http://localhost:5173
后端 API 服务：http://localhost:3001

### 生产构建

```bash
npm run build
```

## 📝 业务说明

### 生产工序流程
1. **出壳** - 制作产品外壳
2. **打磨** - 表面打磨处理
3. **表面处理** - 喷漆/电镀/包布等
   - 普通打磨完成后 +2天 入库
   - 电镀/包布处理完成后 +5天 入库

### 成本核算
- 月度公共费用（水电、租金等）按月均摊
- 产品基础成本：材料费 + 人工费 + 包装费
- 表面处理成本：
  - 油漆类：油漆单价 × 用量
  - 外加工：直接录入单价

## 📄 许可证

MIT License

## 👤 作者

CRJ-Ryan

## 🙏 致谢

使用 [Trae AI](https://www.trae.ai/) 开发
