import { useState, useEffect } from 'react'
import { Trash2, Edit, Eye, BarChart, Users, FileText, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface Article {
  id: string
  title: string
  excerpt: string
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  readTime: number
  views: number
}

interface Stats {
  totalArticles: number
  totalViews: number
  avgReadTime: number
  recentActivity: string[]
}

const mockArticles: Article[] = [
  {
    id: '1',
    title: '使用 Cloudflare Workers 构建无服务器博客',
    excerpt: '探索如何利用 Cloudflare Workers 和 Pages 构建现代化、高性能的无服务器博客系统。',
    author: '张三',
    createdAt: '2024-12-01T10:00:00Z',
    updatedAt: '2024-12-01T10:00:00Z',
    tags: ['Cloudflare', '无服务器', '博客'],
    readTime: 5,
    views: 1245
  },
  {
    id: '2',
    title: 'React 18 新特性深度解析',
    excerpt: '深入了解 React 18 中的并发特性、自动批处理和其他重要更新。',
    author: '李四',
    createdAt: '2024-11-28T14:30:00Z',
    updatedAt: '2024-11-28T14:30:00Z',
    tags: ['React', '前端', 'JavaScript'],
    readTime: 8,
    views: 892
  },
  {
    id: '3',
    title: 'TypeScript 高级类型技巧',
    excerpt: '掌握 TypeScript 中的条件类型、映射类型和模板字面量类型等高级特性。',
    author: '王五',
    createdAt: '2024-11-25T09:15:00Z',
    updatedAt: '2024-11-25T09:15:00Z',
    tags: ['TypeScript', '类型系统', '开发'],
    readTime: 6,
    views: 567
  },
  {
    id: '4',
    title: 'Tailwind CSS 最佳实践',
    excerpt: '分享在使用 Tailwind CSS 构建现代化 UI 时的一些最佳实践和技巧。',
    author: '赵六',
    createdAt: '2024-11-20T16:45:00Z',
    updatedAt: '2024-11-20T16:45:00Z',
    tags: ['Tailwind', 'CSS', 'UI'],
    readTime: 7,
    views: 432
  }
]

const mockStats: Stats = {
  totalArticles: 4,
  totalViews: 3136,
  avgReadTime: 6.5,
  recentActivity: [
    '文章 "使用 Cloudflare Workers 构建无服务器博客" 被编辑',
    '新文章 "Tailwind CSS 最佳实践" 发布',
    '用户 "李四" 登录系统',
    '文章 "React 18 新特性深度解析" 浏览量突破 800'
  ]
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [stats, setStats] = useState<Stats>(mockStats)
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.author.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelectArticle = (id: string) => {
    setSelectedArticles(prev =>
      prev.includes(id)
        ? prev.filter(articleId => articleId !== id)
        : [...prev, id]
    )
  }

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      setArticles(prev => prev.filter(article => article.id !== id))
      setSelectedArticles(prev => prev.filter(articleId => articleId !== id))
    }
  }

  const handleBulkDelete = () => {
    if (selectedArticles.length === 0) return
    if (window.confirm(`确定要删除选中的 ${selectedArticles.length} 篇文章吗？`)) {
      setArticles(prev => prev.filter(article => !selectedArticles.includes(article.id)))
      setSelectedArticles([])
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          博客管理后台
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          管理文章、查看统计数据和管理博客内容
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">文章总数</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalArticles}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">总浏览量</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalViews.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <BarChart className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">平均阅读时间</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.avgReadTime} 分钟
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">活跃作者</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {new Set(articles.map(a => a.author)).size}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  文章管理
                </h2>
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索文章..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 w-full md:w-64"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <Link
                    to="/editor"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    新建文章
                  </Link>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedArticles(filteredArticles.map(a => a.id))
                          } else {
                            setSelectedArticles([])
                          }
                        }}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                      文章标题
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                      作者
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                      发布日期
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                      浏览量
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map(article => (
                    <tr key={article.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article.id)}
                          onChange={() => toggleSelectArticle(article.id)}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {article.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {article.excerpt}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-700 dark:text-gray-300">{article.author}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-700 dark:text-gray-300">
                          {format(new Date(article.createdAt), 'MM/dd', { locale: zhCN })}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {article.views.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/article/${article.id}`}
                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            title="查看"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/editor/${article.id}`}
                            className="p-1.5 text-blue-500 hover:text-blue-700"
                            title="编辑"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-1.5 text-red-500 hover:text-red-700"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedArticles.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    已选择 {selectedArticles.length} 篇文章
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    批量删除
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              最近活动
            </h3>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                    {activity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              快速操作
            </h3>
            <div className="space-y-3">
              <Link
                to="/editor"
                className="block w-full px-4 py-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-center"
              >
                新建文章
              </Link>
              <button className="block w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                导出数据
              </button>
              <button className="block w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                系统设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}