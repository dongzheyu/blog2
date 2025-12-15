import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Save, Eye, Code, Type, Upload, X, Check } from 'lucide-react'

interface ArticleForm {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  tags: string[]
  readTime: number
}

const defaultArticle: ArticleForm = {
  id: '',
  title: '',
  content: '# 新文章\n\n开始写作吧...',
  excerpt: '',
  author: '作者',
  tags: [],
  readTime: 5
}

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<ArticleForm>(defaultArticle)
  const [preview, setPreview] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (id) {
      // 这里会从 API 加载现有文章
      setArticle({
        id,
        title: '编辑现有文章',
        content: '# 编辑模式\n\n你可以修改这篇文章的内容。',
        excerpt: '这是文章的摘要',
        author: '当前用户',
        tags: ['编辑', '示例'],
        readTime: 5
      })
    }
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    // 这里会调用 API 保存文章
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      
      if (!article.id) {
        const newId = Date.now().toString()
        setArticle(prev => ({ ...prev, id: newId }))
        navigate(`/editor/${newId}`)
      }
    }, 1000)
  }

  const addTag = () => {
    if (newTag.trim() && !article.tags.includes(newTag.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const calculateReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    return Math.ceil(words / 200) // 假设每分钟阅读200字
  }

  useEffect(() => {
    const readTime = calculateReadTime(article.content)
    setArticle(prev => ({ ...prev, readTime }))
  }, [article.content])

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {id ? '编辑文章' : '新建文章'}
        </h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPreview(!preview)}
            className={`flex items-center px-4 py-2 rounded-lg ${preview ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
          >
            <Eye className="w-4 h-4 mr-2" />
            {preview ? '编辑模式' : '预览模式'}
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center px-6 py-2 rounded-lg ${saved ? 'bg-green-600' : 'bg-primary-600'} text-white hover:opacity-90 disabled:opacity-50`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                保存中...
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                已保存
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                保存文章
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {!preview ? (
          <>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  文章标题
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="输入文章标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  文章摘要
                </label>
                <textarea
                  value={article.excerpt}
                  onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="输入文章摘要"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  标签
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-primary-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    placeholder="添加标签"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    添加
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    作者
                  </label>
                  <input
                    type="text"
                    value={article.author}
                    onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    阅读时间（分钟）
                  </label>
                  <input
                    type="number"
                    value={article.readTime}
                    onChange={(e) => setArticle(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Markdown 内容
                </label>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Type className="w-4 h-4 mr-1" />
                  {article.content.length} 字符
                </div>
              </div>
              <textarea
                value={article.content}
                onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 font-mono text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="# 开始写作..."
              />
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  <span>支持 Markdown 语法：**粗体**、*斜体*、`代码`、# 标题等</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {article.title || '文章标题'}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center">
                  <span>作者：{article.author}</span>
                </div>
                <div className="flex items-center">
                  <span>阅读时间：{article.readTime} 分钟</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {article.excerpt && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-8">
                  <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                    {article.excerpt}
                  </p>
                </div>
              )}
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {article.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          发布说明
        </h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li>• 文章将保存到 Cloudflare KV 存储中</li>
          <li>• 支持实时预览和编辑</li>
          <li>• 自动计算阅读时间</li>
          <li>• 支持标签分类</li>
          <li>• 保存后立即生效，无需重新部署</li>
        </ul>
      </div>
    </div>
  )
}
