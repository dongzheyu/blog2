#!/bin/bash

# 现代化响应式博客部署脚本
# 使用说明: ./deploy.sh [backend|frontend|all]

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "检查依赖..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    # 检查 wrangler
    if ! command -v wrangler &> /dev/null; then
        log_warning "wrangler 未安装，正在安装..."
        npm install -g wrangler
    fi
    
    log_success "所有依赖已就绪"
}

deploy_backend() {
    log_info "开始部署后端 (Cloudflare Workers)..."
    
    cd backend
    
    # 安装依赖
    log_info "安装后端依赖..."
    npm install
    
    # 检查 wrangler.toml 配置
    if grep -q "your-kv-namespace-id" wrangler.toml; then
        log_warning "请先配置 wrangler.toml 中的 KV 命名空间 ID"
        log_info "运行以下命令创建 KV 命名空间:"
        echo "  wrangler kv:namespace create \"ARTICLES\""
        echo "然后更新 wrangler.toml 中的 id 字段"
        exit 1
    fi
    
    # 登录 Cloudflare（如果需要）
    if ! wrangler whoami &> /dev/null; then
        log_info "请登录 Cloudflare..."
        wrangler login
    fi
    
    # 部署 Workers
    log_info "部署到 Cloudflare Workers..."
    npx wrangler deploy src/index.ts
    
    cd ..
    log_success "后端部署完成"
}

deploy_frontend() {
    log_info "开始部署前端 (Cloudflare Pages)..."
    
    cd frontend
    
    # 安装依赖
    log_info "安装前端依赖..."
    npm install
    
    # 构建项目
    log_info "构建前端项目..."
    npm run build
    
    # 检查构建结果
    if [ ! -d "dist" ]; then
        log_error "构建失败，dist 目录不存在"
        exit 1
    fi
    
    # 部署到 Pages
    log_info "部署到 Cloudflare Pages..."
    npx wrangler pages deploy dist
    
    cd ..
    log_success "前端部署完成"
}

setup_environment() {
    log_info "设置环境..."
    
    # 复制环境变量示例文件
    if [ ! -f "frontend/.env" ]; then
        log_info "创建前端环境变量文件..."
        cp frontend/.env.example frontend/.env
        log_warning "请编辑 frontend/.env 文件配置 API 地址"
    fi
    
    # 检查后端配置
    if [ ! -f "backend/wrangler.toml" ]; then
        log_error "后端配置文件不存在"
        exit 1
    fi
    
    log_success "环境设置完成"
}

run_tests() {
    log_info "运行测试..."
    
    # 前端测试
    cd frontend
    log_info "检查前端构建..."
    npm run build
    cd ..
    
    # 后端类型检查
    cd backend
    log_info "检查后端类型..."
    npx tsc --noEmit
    cd ..
    
    log_success "所有测试通过"
}

print_deploy_info() {
    log_success "部署完成！"
    echo ""
    echo "下一步操作："
    echo "1. 在 Cloudflare Dashboard 中："
    echo "   - 检查 Workers 部署状态"
    echo "   - 检查 Pages 部署状态"
    echo "   - 配置自定义域名（可选）"
    echo ""
    echo "2. 测试 API："
    echo "   curl https://your-worker.workers.dev/api/health"
    echo ""
    echo "3. 访问博客："
    echo "   https://your-project.pages.dev"
    echo ""
    echo "4. 管理文章："
    echo "   https://your-project.pages.dev/admin"
}

case "$1" in
    "backend")
        check_dependencies
        setup_environment
        deploy_backend
        ;;
    "frontend")
        check_dependencies
        setup_environment
        deploy_frontend
        ;;
    "all"|"")
        check_dependencies
        setup_environment
        run_tests
        deploy_backend
        deploy_frontend
        print_deploy_info
        ;;
    *)
        echo "使用说明: $0 [backend|frontend|all]"
        echo "  backend   - 仅部署后端"
        echo "  frontend  - 仅部署前端"
        echo "  all       - 部署全部（默认）"
        exit 1
        ;;
esac
