import { useState, useEffect } from 'react'
import { Calendar, User, ArrowRight, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  readTime: number
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: '使用 Cloudflare Workers 构建无服务器博客',
    excerpt: '探索如何利用 Cloudflare Workers 和 Pages 构建现代化、高性能的无服务器博客系统。',
    content: '# 使用 Cloudflare Workers 构建无服务器博客\n\nCloudflare Workers 提供了一个强大的边缘计算平台...',
    author: '张三',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    tags: ['Cloudflare', '无服务器', '博客'],
    readTime: 5
  },
  {
    id: '2',
    title: 'React 18 新特性深度解析',
    excerpt: '深入了解 React 18 中的并发特性、自动批处理和其他重要更新。',
    content: '# React 18 新特性深度解析\n\nReact 18 带来了许多令人兴奋的新特性...',
    author: '李四',
    createdAt: '2024-11-28T14:30:00Z',
    updatedAt: '2024-11-28T14:30:00Z',
    tags: ['React', '前端', 'JavaScript'],
    readTime: 8
  },
  {
    id: '3',
    title: 'TypeScript 高级类型技巧',
    excerpt: '掌握 TypeScript 中的条件类型、映射类型和模板字面量类型等高级特性。',
    content: '# TypeScript 高级类型技巧\n\nTypeScript 的类型系统非常强大...',
    author: '王五',
    createdAt: '2024-11-25T09:15:00Z',
    updatedAt: '2024-11-25T09:15:00Z',
    tags: ['TypeScript', '类型系统', '开发'],
    readTime: 6
  },
  {
    id: '4',
    title: 'Tailwind CSS 最佳实践',
    excerpt: '分享在使用 Tailwind CSS 构建现代化 UI 时的一些最佳实践和技巧。',
    content: '# Tailwind CSS 最佳实践\n\nTailwind CSS 是一个功能强大的实用优先的 CSS 框架...',
    author: '赵六',
    createdAt: '2024-11-20T16:45:00Z',
    updatedAt: '2024-11-20T16:45:00Z',
    tags: ['Tailwind', 'CSS', 'UI'],
    readTime: 7
  }
]

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)))

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !selectedTag || article.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          现代化响应式博客
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          基于 Cloudflare Pages & Workers 构建，无需服务器，极致性能
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索文章..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${!selectedTag ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
            >
              全部
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1 rounded-full text-sm ${selectedTag === tag ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(article => (
          <article
            key={article.id}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                <Link to={`/article/${article.id}`}>
                  {article.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{format(new Date(article.createdAt), 'yyyy-MM-dd', { locale: zhCN })}</span>
                  </div>
                </div>
                <span>{article.readTime} 分钟阅读</span>
              </div>
              
              <Link
                to={`/article/${article.id}`}
                className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300"
              >
                阅读全文
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            未找到相关文章
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            尝试不同的搜索词或标签
          </p>
        </div>
      )}
    </div>
  )
}
