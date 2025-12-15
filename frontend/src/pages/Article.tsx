import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Calendar, User, Clock, Tag, ArrowLeft, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Article {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  readTime: number
}

const mockArticle: Article = {
  id: '1',
  title: '使用 Cloudflare Workers 构建无服务器博客',
  content: `# 使用 Cloudflare Workers 构建无服务器博客

Cloudflare Workers 提供了一个强大的边缘计算平台，让我们能够在全球范围内运行 JavaScript 代码。结合 Cloudflare Pages，我们可以构建一个完全无服务器的现代化博客系统。

## 为什么选择 Cloudflare？

### 优势
- **全球边缘网络**：内容在全球 300+ 数据中心缓存
- **零冷启动**：Workers 几乎没有冷启动时间
- **免费额度充足**：个人项目完全够用
- **简单部署**：Git 集成，自动部署

## 架构设计

我们的博客系统采用以下架构：

\`\`\`mermaid
graph TD
    A[用户访问] --> B[Cloudflare Pages]
    B --> C[React 前端]
    C --> D[Cloudflare Workers API]
    D --> E[Cloudflare KV 存储]
\`\`\`

## 技术栈

### 前端
- **React 18**：现代化的 UI 框架
- **TypeScript**：类型安全的 JavaScript
- **Tailwind CSS**：实用优先的 CSS 框架
- **Vite**：快速的构建工具

### 后端
- **Cloudflare Workers**：边缘计算平台
- **Hono**：轻量级 Web 框架
- **Cloudflare KV**：键值存储

## 实现步骤

### 1. 创建前端项目

\`\`\`bash
npm create vite@latest blog-frontend -- --template react-ts
cd blog-frontend
npm install tailwindcss react-markdown marked
\`\`\`

### 2. 配置 Cloudflare Workers

创建 \`wrangler.toml\` 配置文件：

\`\`\`toml
name = "blog-api"
compatibility_date = "2024-12-01"

[[kv_namespaces]]
binding = "ARTICLES"
id = "your-kv-namespace-id"
\`\`\`

### 3. 实现 API 接口

使用 Hono 框架创建 RESTful API：

\`\`\`typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/articles', async (c) => {
  const articles = await c.env.ARTICLES.list()
  return c.json(articles)
})

app.post('/api/articles', async (c) => {
  const article = await c.req.json()
  await c.env.ARTICLES.put(article.id, JSON.stringify(article))
  return c.json({ success: true })
})
\`\`\`

## 部署流程

1. 将前端代码推送到 GitHub
2. 在 Cloudflare Pages 中连接仓库
3. 自动构建和部署前端
4. 使用 Wrangler 部署 Workers
5. 配置自定义域名（可选）

## 性能优化

### 缓存策略
- 使用 Cloudflare 的全球 CDN 缓存
- 设置适当的 Cache-Control 头
- 利用 Workers 的边缘计算能力

### 代码优化
- 代码分割和懒加载
- 图片优化和 WebP 格式
- 最小化 JavaScript 包大小

## 总结

使用 Cloudflare Workers 和 Pages 构建博客系统具有以下优势：

1. **成本效益**：免费额度足够个人使用
2. **性能优异**：全球边缘网络提供低延迟
3. **易于维护**：无需服务器运维
4. **可扩展性**：自动扩展应对流量高峰

这种架构特别适合个人博客、技术文档和小型内容网站。`,
  author: '张三',
  createdAt: '2024-12-01T10:00:00Z',
  updatedAt: '2024-12-01T10:00:00Z',
  tags: ['Cloudflare', '无服务器', '博客', '前端', '后端'],
  readTime: 8
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(mockArticle)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 这里会从 API 获取文章数据
    setLoading(true)
    setTimeout(() => {
      setArticle(mockArticle)
      setLoading(false)
    }, 500)
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          文章未找到
        </h2>
        <Link
          to="/"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回文章列表
        </Link>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{format(new Date(article.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span>{article.readTime} 分钟阅读</span>
          </div>
          <Link
            to={`/editor/${article.id}`}
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <Edit className="w-5 h-5 mr-2" />
            编辑文章
          </Link>
        </div>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
        <ReactMarkdown>
          {article.content}
        </ReactMarkdown>
      </div>
      
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              关于作者
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {article.author}，热爱技术的开发者，专注于前端和云原生技术。
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            浏览更多文章
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  )
}
