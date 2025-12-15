# 现代化响应式博客

基于 Cloudflare Pages 和 Workers 构建的无服务器博客系统，包含完整的 Markdown 编辑器和管理后台。

## 技术栈

### 前端 (Cloudflare Pages)
- React 18 + TypeScript
- Tailwind CSS (响应式设计)
- Vite (构建工具)
- React Router (路由)
- React Markdown (Markdown 渲染)

### 后端 (Cloudflare Workers)
- Hono (Web 框架)
- TypeScript
- Cloudflare KV (数据存储)

## 功能特性

- ✅ 现代化响应式设计
- ✅ Markdown 编辑器（实时预览）
- ✅ 文章管理（CRUD）
- ✅ 标签分类系统
- ✅ 搜索功能
- ✅ 统计数据面板
- ✅ 无需服务器运维
- ✅ 全球 CDN 加速

## 项目结构

```
blog/
├── frontend/          # 前端应用
│   ├── src/
│   │   ├── pages/    # 页面组件
│   │   ├── api/      # API 客户端
│   │   └── ...
│   └── ...
├── backend/          # Workers API
│   ├── src/
│   │   └── index.ts  # API 主文件
│   └── ...
└── README.md
```

## 快速开始

### 1. 本地开发

#### 前端开发
```bash
cd frontend
npm install
npm run dev
```
访问 http://localhost:3000

#### 后端开发
```bash
cd backend
npm install
npx wrangler dev
```
API 运行在 http://localhost:8787

### 2. 配置 Cloudflare

1. **创建 Cloudflare 账户**
2. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   ```

3. **创建 KV 命名空间**
   ```bash
   wrangler kv:namespace create "ARTICLES"
   ```
   更新 `backend/wrangler.toml` 中的 KV ID

### 3. 部署

#### 部署后端 (Workers)
```bash
cd backend
npx wrangler deploy
```

#### 部署前端 (Pages)
```bash
cd frontend
npm run deploy
```

或者通过 GitHub 自动部署：
1. 将代码推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 配置构建命令：`npm run build`
4. 配置输出目录：`dist`

## 环境变量

### 前端 (.env)
```env
VITE_API_URL=http://localhost:8787  # 开发环境
# VITE_API_URL=https://your-worker.workers.dev  # 生产环境
```

### 后端 (wrangler.toml)
```toml
name = "blog-api"
compatibility_date = "2024-12-01"

[[kv_namespaces]]
binding = "ARTICLES"
id = "your-kv-namespace-id"
```

## API 接口

### 文章管理
- `GET /api/articles` - 获取所有文章
- `GET /api/articles/:id` - 获取单篇文章
- `POST /api/articles` - 创建文章
- `PUT /api/articles/:id` - 更新文章
- `DELETE /api/articles/:id` - 删除文章
- `DELETE /api/articles` - 批量删除文章

### 搜索
- `GET /api/articles/search/:query` - 搜索文章

### 统计
- `GET /api/stats` - 获取博客统计数据

### 健康检查
- `GET /api/health` - 健康检查

## 数据模型

```typescript
interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  readTime: number
  views: number
}
```

## 开发指南

### 添加新页面
1. 在 `frontend/src/pages/` 创建新组件
2. 在 `frontend/src/App.tsx` 中添加路由
3. 在导航栏中添加链接（可选）

### 添加 API 端点
1. 在 `backend/src/index.ts` 中添加新路由
2. 实现业务逻辑
3. 更新前端 API 客户端

### 样式定制
- 修改 `frontend/tailwind.config.js` 主题配置
- 编辑 `frontend/src/index.css` 全局样式
- 使用 Tailwind 工具类进行组件样式

## 性能优化

### 前端优化
- 代码分割和懒加载
- 图片优化（WebP 格式）
- 浏览器缓存策略
- 服务端渲染（SSR）支持

### 后端优化
- 边缘缓存（Cloudflare CDN）
- KV 存储缓存
- 请求批处理
- 错误重试机制

## 安全考虑

1. **API 认证**（可选）
   - 添加 API 密钥验证
   - 实现 JWT 认证

2. **输入验证**
   - 所有 API 端点验证输入
   - 防止 XSS 攻击

3. **CORS 配置**
   - 限制允许的域名
   - 设置适当的 CORS 头

## 故障排除

### 常见问题

1. **KV 存储无法访问**
   - 检查 `wrangler.toml` 配置
   - 确认 KV 命名空间已创建
   - 运行 `wrangler kv:namespace list` 验证

2. **API 跨域问题**
   - 检查 CORS 配置
   - 确认前端代理设置
   - 验证 API 响应头

3. **构建失败**
   - 检查 TypeScript 错误
   - 验证依赖版本
   - 清理 node_modules 重新安装

### 日志查看
```bash
# Workers 日志
wrangler tail

# Pages 构建日志
# 在 Cloudflare Dashboard 查看
```

## 扩展功能

### 计划中的功能
- [ ] 评论系统
- [ ] 用户认证
- [ ] 文章草稿
- [ ] 图片上传
- [ ] RSS 订阅
- [ ] SEO 优化
- [ ] 暗色模式切换

### 集成选项
- **分析**: Google Analytics, Plausible
- **评论**: Disqus, Giscus
- **搜索**: Algolia, Meilisearch
- **CDN**: Cloudflare Images, R2

## 许可证

MIT License - 详见 LICENSE 文件

## 支持

- 问题报告: GitHub Issues
- 文档: 本项目 README
- 社区: Cloudflare Discord