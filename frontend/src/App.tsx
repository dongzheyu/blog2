import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Home, FileText, Edit, User } from 'lucide-react'
import HomePage from './pages/Home'
import ArticlePage from './pages/Article'
import EditorPage from './pages/Editor'
import AdminPage from './pages/Admin'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white">
                <FileText className="w-8 h-8 text-primary-600" />
                <span>Modern Blog</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <Home className="w-5 h-5" />
                  <span>首页</span>
                </Link>
                <Link to="/editor" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <Edit className="w-5 h-5" />
                  <span>写文章</span>
                </Link>
                <Link to="/admin" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <User className="w-5 h-5" />
                  <span>管理</span>
                </Link>
              </div>
              
              <button className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/editor/:id" element={<EditorPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-primary-600" />
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Modern Blog</span>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  基于 Cloudflare Pages & Workers 的现代化博客
                </p>
              </div>
              
              <div className="text-gray-600 dark:text-gray-400">
                <p>© {new Date().getFullYear()} Modern Blog. All rights reserved.</p>
                <p className="mt-1 text-sm">Powered by Cloudflare & React</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App