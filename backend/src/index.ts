import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

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

interface Env {
  ARTICLES: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()

// 中间件
app.use('*', logger())
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

// 健康检查
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 获取所有文章
app.get('/api/articles', async (c) => {
  try {
    const list = await c.env.ARTICLES.list()
    const articles: Article[] = []

    for (const key of list.keys) {
      const articleData = await c.env.ARTICLES.get(key.name)
      if (articleData) {
        articles.push(JSON.parse(articleData))
      }
    }

    // 按创建时间倒序排序
    articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return c.json({
      success: true,
      data: articles,
      count: articles.length
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return c.json({ success: false, error: '获取文章列表失败' }, 500)
  }
})

// 获取单篇文章
app.get('/api/articles/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const articleData = await c.env.ARTICLES.get(id)

    if (!articleData) {
      return c.json({ success: false, error: '文章未找到' }, 404)
    }

    const article: Article = JSON.parse(articleData)
    
    // 更新浏览量
    article.views = (article.views || 0) + 1
    await c.env.ARTICLES.put(id, JSON.stringify(article))

    return c.json({
      success: true,
      data: article
    })
  } catch (error) {
    console.error('获取文章失败:', error)
    return c.json({ success: false, error: '获取文章失败' }, 500)
  }
})

// 创建文章
app.post('/api/articles', async (c) => {
  try {
    const articleData = await c.req.json<Partial<Article>>()
    
    if (!articleData.title || !articleData.content) {
      return c.json({ success: false, error: '标题和内容不能为空' }, 400)
    }

    const id = Date.now().toString()
    const now = new Date().toISOString()
    
    const article: Article = {
      id,
      title: articleData.title,
      content: articleData.content,
      excerpt: articleData.excerpt || articleData.content.slice(0, 200) + '...',
      author: articleData.author || '匿名作者',
      createdAt: now,
      updatedAt: now,
      tags: articleData.tags || [],
      readTime: articleData.readTime || 5,
      views: 0
    }

    await c.env.ARTICLES.put(id, JSON.stringify(article))

    return c.json({
      success: true,
      data: article,
      message: '文章创建成功'
    }, 201)
  } catch (error) {
    console.error('创建文章失败:', error)
    return c.json({ success: false, error: '创建文章失败' }, 500)
  }
})

// 更新文章
app.put('/api/articles/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const articleData = await c.req.json<Partial<Article>>()
    
    const existingData = await c.env.ARTICLES.get(id)
    if (!existingData) {
      return c.json({ success: false, error: '文章未找到' }, 404)
    }

    const existingArticle: Article = JSON.parse(existingData)
    
    const updatedArticle: Article = {
      ...existingArticle,
      ...articleData,
      id, // 确保ID不变
      updatedAt: new Date().toISOString()
    }

    await c.env.ARTICLES.put(id, JSON.stringify(updatedArticle))

    return c.json({
      success: true,
      data: updatedArticle,
      message: '文章更新成功'
    })
  } catch (error) {
    console.error('更新文章失败:', error)
    return c.json({ success: false, error: '更新文章失败' }, 500)
  }
})

// 删除文章
app.delete('/api/articles/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const existingData = await c.env.ARTICLES.get(id)
    if (!existingData) {
      return c.json({ success: false, error: '文章未找到' }, 404)
    }

    await c.env.ARTICLES.delete(id)

    return c.json({
      success: true,
      message: '文章删除成功'
    })
  } catch (error) {
    console.error('删除文章失败:', error)
    return c.json({ success: false, error: '删除文章失败' }, 500)
  }
})

// 批量删除文章
app.delete('/api/articles', async (c) => {
  try {
    const { ids } = await c.req.json<{ ids: string[] }>()
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return c.json({ success: false, error: '请提供要删除的文章ID列表' }, 400)
    }

    for (const id of ids) {
      await c.env.ARTICLES.delete(id)
    }

    return c.json({
      success: true,
      message: `成功删除 ${ids.length} 篇文章`
    })
  } catch (error) {
    console.error('批量删除文章失败:', error)
    return c.json({ success: false, error: '批量删除文章失败' }, 500)
  }
})

// 搜索文章
app.get('/api/articles/search/:query', async (c) => {
  try {
    const query = c.req.param('query').toLowerCase()
    const list = await c.env.ARTICLES.list()
    const results: Article[] = []

    for (const key of list.keys) {
      const articleData = await c.env.ARTICLES.get(key.name)
      if (articleData) {
        const article: Article = JSON.parse(articleData)
        
        if (
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.tags.some(tag => tag.toLowerCase().includes(query))
        ) {
          results.push(article)
        }
      }
    }

    return c.json({
      success: true,
      data: results,
      count: results.length
    })
  } catch (error) {
    console.error('搜索文章失败:', error)
    return c.json({ success: false, error: '搜索文章失败' }, 500)
  }
})

// 获取统计数据
app.get('/api/stats', async (c) => {
  try {
    const list = await c.env.ARTICLES.list()
    let totalViews = 0
    let totalReadTime = 0
    const authors = new Set<string>()

    for (const key of list.keys) {
      const articleData = await c.env.ARTICLES.get(key.name)
      if (articleData) {
        const article: Article = JSON.parse(articleData)
        totalViews += article.views || 0
        totalReadTime += article.readTime || 0
        authors.add(article.author)
      }
    }

    const totalArticles = list.keys.length
    const avgReadTime = totalArticles > 0 ? totalReadTime / totalArticles : 0

    return c.json({
      success: true,
      data: {
        totalArticles,
        totalViews,
        avgReadTime: Math.round(avgReadTime * 10) / 10,
        uniqueAuthors: authors.size
      }
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return c.json({ success: false, error: '获取统计数据失败' }, 500)
  }
})

// 404 处理
app.notFound((c) => {
  return c.json({ success: false, error: 'API 端点未找到' }, 404)
})

// 错误处理
app.onError((err, c) => {
  console.error('服务器错误:', err)
  return c.json({ success: false, error: '服务器内部错误' }, 500)
})

export default app