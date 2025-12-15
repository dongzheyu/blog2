const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

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

interface Stats {
  totalArticles: number
  totalViews: number
  avgReadTime: number
  uniqueAuthors: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const response = await fetch(url, { ...defaultOptions, ...options })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络请求失败'
      }
    }
  }

  // 文章相关 API
  async getArticles(): Promise<ApiResponse<Article[]>> {
    return this.request<Article[]>('/api/articles')
  }

  async getArticle(id: string): Promise<ApiResponse<Article>> {
    return this.request<Article>(`/api/articles/${id}`)
  }

  async createArticle(article: Partial<Article>): Promise<ApiResponse<Article>> {
    return this.request<Article>('/api/articles', {
      method: 'POST',
      body: JSON.stringify(article)
    })
  }

  async updateArticle(id: string, article: Partial<Article>): Promise<ApiResponse<Article>> {
    return this.request<Article>(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article)
    })
  }

  async deleteArticle(id: string): Promise<ApiResponse> {
    return this.request(`/api/articles/${id}`, {
      method: 'DELETE'
    })
  }

  async deleteArticles(ids: string[]): Promise<ApiResponse> {
    return this.request('/api/articles', {
      method: 'DELETE',
      body: JSON.stringify({ ids })
    })
  }

  async searchArticles(query: string): Promise<ApiResponse<Article[]>> {
    return this.request<Article[]>(`/api/articles/search/${encodeURIComponent(query)}`)
  }

  // 统计相关 API
  async getStats(): Promise<ApiResponse<Stats>> {
    return this.request<Stats>('/api/stats')
  }

  // 健康检查
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/api/health')
  }
}

export const apiClient = new ApiClient()
export type { Article, Stats, ApiResponse }