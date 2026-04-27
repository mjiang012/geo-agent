#!/bin/bash

# ==========================================
# Citify AI - 一键启动脚本
# ==========================================
# 功能:
#   - 环境检查
#   - 依赖检查
#   - .env 文件检查
#   - 服务启动
# ==========================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
EXTENSION_DIR="$PROJECT_DIR/extension"

# 日志文件
LOG_DIR="$PROJECT_DIR/logs"
mkdir -p "$LOG_DIR"

# 显示 Logo
show_logo() {
    echo -e "${CYAN}"
    echo "  ____ _ _   __       _    ___ "
    echo " / ___(_) |_(_)_   _(_)  / _ \\"
    echo "| |   | | __| \ \ / / | | | | |"
    echo "| |___| | |_| |\ V /| | | |_| |"
    echo " \____|_|\__|_| \_/ |_|  \___/ "
    echo ""
    echo -e "${PURPLE}   GEO Optimization Platform${NC}"
    echo ""
}

# 打印标题
print_title() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# 打印成功消息
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# 打印警告消息
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# 打印错误消息
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 打印信息消息
print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# ==========================================
# 环境检查
# ==========================================
check_environment() {
    print_title "环境检查"
    
    local checks_passed=0
    local checks_failed=0
    
    # 检查操作系统
    echo "检查操作系统..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_success "操作系统: macOS"
        checks_passed=$((checks_passed + 1))
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_success "操作系统: Linux"
        checks_passed=$((checks_passed + 1))
    else
        print_warning "操作系统: $OSTYPE (未完全测试)"
        checks_passed=$((checks_passed + 1))
    fi
    
    # 检查 Docker
    echo "检查 Docker..."
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
        print_success "Docker 已安装: v$DOCKER_VERSION"
        checks_passed=$((checks_passed + 1))
        
        # 检查 Docker 运行状态
        if docker info >/dev/null 2>&1; then
            print_success "Docker 正在运行"
            checks_passed=$((checks_passed + 1))
        else
            print_warning "Docker 未运行 (需要手动启动)"
            checks_failed=$((checks_failed + 1))
        fi
    else
        print_warning "Docker 未安装 (使用本地开发模式)"
    fi
    
    # 检查 Docker Compose
    echo "检查 Docker Compose..."
    if command_exists docker-compose; then
        COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | tr -d ',')
        print_success "Docker Compose 已安装: v$COMPOSE_VERSION"
        checks_passed=$((checks_passed + 1))
    elif docker compose version >/dev/null 2>&1; then
        COMPOSE_VERSION=$(docker compose version | cut -d' ' -f4 | tr -d ',')
        print_success "Docker Compose (v2) 已安装: v$COMPOSE_VERSION"
        checks_passed=$((checks_passed + 1))
    else
        print_warning "Docker Compose 未安装 (使用本地开发模式)"
    fi
    
    # 检查 Python (本地开发用)
    echo "检查 Python..."
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        print_success "Python 3 已安装: v$PYTHON_VERSION"
        checks_passed=$((checks_passed + 1))
    elif command_exists python; then
        PYTHON_VERSION=$(python --version | cut -d' ' -f2)
        print_success "Python 已安装: v$PYTHON_VERSION"
        checks_passed=$((checks_passed + 1))
    else
        print_warning "Python 未安装"
    fi
    
    # 检查 Node.js (本地开发用)
    echo "检查 Node.js..."
    if command_exists node; then
        NODE_VERSION=$(node --version | sed 's/v//')
        print_success "Node.js 已安装: v$NODE_VERSION"
        checks_passed=$((checks_passed + 1))
    else
        print_warning "Node.js 未安装"
    fi
    
    # 检查 Git
    echo "检查 Git..."
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_success "Git 已安装: v$GIT_VERSION"
        checks_passed=$((checks_passed + 1))
    else
        print_warning "Git 未安装"
    fi
    
    echo ""
    echo -e "检查完成: ${GREEN}$checks_passed 通过${NC}, ${YELLOW}$checks_failed 警告${NC}"
    
    return 0
}

# ==========================================
# 配置检查
# ==========================================
check_config() {
    print_title "配置检查"
    
    # 检查 .env 文件
    echo "检查 .env 文件..."
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        print_warning ".env 文件不存在，从 .env.example 复制..."
        if [ -f "$PROJECT_DIR/.env.example" ]; then
            cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
            print_success "已创建 .env 文件"
        else
            print_error ".env.example 文件不存在"
            return 1
        fi
    else
        print_success ".env 文件存在"
    fi
    
    # 检查关键配置
    echo "检查 API 密钥配置..."
    local has_openai_key=1
    local has_pinecone_key=1
    
    if [ -f "$PROJECT_DIR/.env" ]; then
        source "$PROJECT_DIR/.env" 2>/dev/null || true
        
        if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
            has_openai_key=0
        fi
        
        if [ -z "$PINECONE_API_KEY" ] || [ "$PINECONE_API_KEY" = "your_pinecone_api_key_here" ]; then
            has_pinecone_key=0
        fi
    fi
    
    if [ $has_openai_key -eq 1 ]; then
        print_success "OpenAI API 密钥已配置"
    else
        print_warning "OpenAI API 密钥未配置 (可用于基础功能)"
    fi
    
    if [ $has_pinecone_key -eq 1 ]; then
        print_success "Pinecone API 密钥已配置"
    else
        print_warning "Pinecone API 密钥未配置 (向量搜索功能不可用)"
    fi
    
    # 检查目录
    echo "检查目录结构..."
    local directories=("data" "logs" "output")
    for dir in "${directories[@]}"; do
        if [ ! -d "$PROJECT_DIR/$dir" ]; then
            mkdir -p "$PROJECT_DIR/$dir"
            print_info "已创建目录: $dir"
        fi
    done
    
    return 0
}

# ==========================================
# 启动选项菜单
# ==========================================
show_menu() {
    print_title "启动选项"
    echo ""
    echo "请选择启动方式:"
    echo ""
    echo "  1) 🐳  Docker 启动 (推荐)"
    echo "  2) 💻  本地开发模式 (后端 + 前端)"
    echo "  3) 🔧  仅启动后端"
    echo "  4) 🎨  仅启动前端"
    echo "  5) 📊  仅启动数据库"
    echo "  6) ⏹️  停止所有服务"
    echo "  7) 🔄  重启所有服务"
    echo "  8) 📋  查看服务状态"
    echo "  9) ❌  退出"
    echo ""
    read -p "请输入选项 [1-9]: " choice
    echo ""
    
    case $choice in
        1)
            start_docker
            ;;
        2)
            start_local
            ;;
        3)
            start_backend_only
            ;;
        4)
            start_frontend_only
            ;;
        5)
            start_database_only
            ;;
        6)
            stop_all
            ;;
        7)
            restart_all
            ;;
        8)
            check_status
            ;;
        9)
            echo "再见！👋"
            exit 0
            ;;
        *)
            print_error "无效选项"
            show_menu
            ;;
    esac
}

# ==========================================
# Docker 启动
# ==========================================
start_docker() {
    print_title "Docker 启动模式"
    
    if ! command_exists docker; then
        print_error "Docker 未安装，无法使用 Docker 模式"
        show_menu
        return
    fi
    
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker 未运行，请先启动 Docker"
        show_menu
        return
    fi
    
    cd "$PROJECT_DIR"
    
    echo "检查是否有运行中的容器..."
    if docker-compose ps 2>/dev/null | grep -q "Up"; then
        echo ""
        read -p "已有运行中的容器，是否停止它们? (y/n): " stop_choice
        if [ "$stop_choice" = "y" ] || [ "$stop_choice" = "Y" ]; then
            echo "正在停止容器..."
            docker-compose down
        fi
    fi
    
    echo ""
    echo "正在启动服务..."
    echo "这可能需要几分钟时间..."
    echo ""
    
    if docker-compose up -d --build; then
        echo ""
        print_success "服务启动成功！"
        echo ""
        show_access_info
    else
        print_error "启动失败"
    fi
}

# ==========================================
# 本地开发模式启动
# ==========================================
start_local() {
    print_title "本地开发模式"
    
    cd "$PROJECT_DIR"
    
    # 1. 启动数据库
    echo ""
    echo "启动 PostgreSQL 数据库..."
    if ! docker ps --format '{{.Names}}' | grep -q "^citify-postgres$"; then
        if [ ! "$(docker ps -a -q -f name=^citify-postgres$)" ]; then
            docker run -d \
                --name citify-postgres \
                -e POSTGRES_USER=citify \
                -e POSTGRES_PASSWORD=citify123 \
                -e POSTGRES_DB=citify_ai \
                -p 5432:5432 \
                --health-cmd="pg_isready -U citify" \
                --health-interval=10s \
                --health-timeout=5s \
                --health-retries=5 \
                postgres:15-alpine
            print_success "PostgreSQL 容器已创建"
        else
            docker start citify-postgres
            print_success "PostgreSQL 容器已启动"
        fi
    else
        print_success "PostgreSQL 已在运行"
    fi
    
    # 等待数据库就绪
    echo ""
    echo "等待数据库就绪..."
    sleep 5
    
    # 2. 启动后端
    echo ""
    echo "启动后端服务..."
    if [ ! -d "$BACKEND_DIR/venv" ]; then
        echo "创建虚拟环境..."
        cd "$BACKEND_DIR"
        python3 -m venv venv
    fi
    
    cd "$BACKEND_DIR"
    source venv/bin/activate
    
    if [ ! -d "venv/lib/python3.*/site-packages/fastapi" ]; then
        echo "安装 Python 依赖..."
        pip install -r requirements.txt
    fi
    
    print_success "后端将在后台运行 (端口: 8000)"
    
    # 3. 启动前端
    echo ""
    echo "启动前端服务..."
    cd "$FRONTEND_DIR"
    
    if [ ! -d "node_modules" ]; then
        echo "安装 Node.js 依赖..."
        npm install
    fi
    
    print_success "前端将在后台运行 (端口: 3000)"
    
    # 使用 tmux 或 screen 保持服务运行，或者给出提示
    echo ""
    echo ""
    print_success "本地开发模式已准备就绪！"
    echo ""
    echo "请在不同的终端窗口运行以下命令："
    echo ""
    echo -e "${CYAN}终端 1 (后端):${NC}"
    echo "  cd $BACKEND_DIR"
    echo "  source venv/bin/activate"
    echo "  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    echo ""
    echo -e "${CYAN}终端 2 (前端):${NC}"
    echo "  cd $FRONTEND_DIR"
    echo "  npm run dev"
    echo ""
    show_access_info
}

# ==========================================
# 仅启动后端
# ==========================================
start_backend_only() {
    print_title "仅启动后端"
    cd "$PROJECT_DIR"
    
    # 先启动数据库
    echo "启动 PostgreSQL..."
    if ! docker ps --format '{{.Names}}' | grep -q "^citify-postgres$"; then
        if [ ! "$(docker ps -a -q -f name=^citify-postgres$)" ]; then
            docker run -d \
                --name citify-postgres \
                -e POSTGRES_USER=citify \
                -e POSTGRES_PASSWORD=citify123 \
                -e POSTGRES_DB=citify_ai \
                -p 5432:5432 \
                postgres:15-alpine
        else
            docker start citify-postgres
        fi
    fi
    
    echo "等待数据库..."
    sleep 3
    
    cd "$BACKEND_DIR"
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    
    if [ ! -d "venv/lib/python3.*/site-packages/fastapi" ]; then
        pip install -r requirements.txt
    fi
    
    echo ""
    echo "启动后端服务器..."
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# ==========================================
# 仅启动前端
# ==========================================
start_frontend_only() {
    print_title "仅启动前端"
    cd "$FRONTEND_DIR"
    
    if [ ! -d "node_modules" ]; then
        echo "安装依赖..."
        npm install
    fi
    
    echo ""
    echo "启动前端服务器..."
    npm run dev
}

# ==========================================
# 仅启动数据库
# ==========================================
start_database_only() {
    print_title "仅启动数据库"
    
    if ! docker ps --format '{{.Names}}' | grep -q "^citify-postgres$"; then
        if [ ! "$(docker ps -a -q -f name=^citify-postgres$)" ]; then
            docker run -d \
                --name citify-postgres \
                -e POSTGRES_USER=citify \
                -e POSTGRES_PASSWORD=citify123 \
                -e POSTGRES_DB=citify_ai \
                -p 5432:5432 \
                postgres:15-alpine
            print_success "PostgreSQL 容器已创建并启动"
        else
            docker start citify-postgres
            print_success "PostgreSQL 容器已启动"
        fi
    else
        print_success "PostgreSQL 已在运行"
    fi
    
    echo ""
    echo "数据库信息:"
    echo "  主机: localhost"
    echo "  端口: 5432"
    echo "  用户名: citify"
    echo "  密码: citify123"
    echo "  数据库: citify_ai"
    echo ""
}

# ==========================================
# 停止所有服务
# ==========================================
stop_all() {
    print_title "停止所有服务"
    cd "$PROJECT_DIR"
    
    # 停止 Docker Compose 服务
    if [ -f "docker-compose.yml" ]; then
        echo "停止 Docker Compose 服务..."
        docker-compose down 2>/dev/null || true
    fi
    
    # 停止独立 PostgreSQL 容器
    if docker ps --format '{{.Names}}' | grep -q "^citify-postgres$"; then
        echo "停止 PostgreSQL 容器..."
        docker stop citify-postgres
    fi
    
    print_success "所有服务已停止"
}

# ==========================================
# 重启所有服务
# ==========================================
restart_all() {
    print_title "重启所有服务"
    stop_all
    sleep 2
    start_docker
}

# ==========================================
# 检查服务状态
# ==========================================
check_status() {
    print_title "服务状态"
    
    cd "$PROJECT_DIR"
    
    echo ""
    echo -e "${CYAN}Docker 容器状态:${NC}"
    echo ""
    
    if command_exists docker; then
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    else
        print_warning "Docker 未安装"
    fi
    
    echo ""
    echo -e "${CYAN}Docker Compose 服务:${NC}"
    echo ""
    
    if [ -f "docker-compose.yml" ]; then
        if command_exists docker-compose; then
            docker-compose ps 2>/dev/null || true
        elif docker compose version >/dev/null 2>&1; then
            docker compose ps 2>/dev/null || true
        fi
    fi
    
    # 检查端口占用
    echo ""
    echo -e "${CYAN}端口占用:${NC}"
    echo ""
    
    local ports=("8000" "3000" "5432")
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            echo -e "  端口 ${GREEN}$port${NC}: 被占用"
        else
            echo -e "  端口 ${RED}$port${NC}: 空闲"
        fi
    done
    
    echo ""
}

# ==========================================
# 显示访问信息
# ==========================================
show_access_info() {
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}                    ${CYAN}服务访问信息${NC}                              ${PURPLE}║${NC}"
    echo -e "${PURPLE}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${PURPLE}║${NC}  🌐  前端应用:     ${BLUE}http://localhost:3000${NC}                    ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}  🚀  后端 API:     ${BLUE}http://localhost:8000${NC}                    ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}  📚  API 文档:     ${BLUE}http://localhost:8000/docs${NC}               ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}  📊  健康检查:     ${BLUE}http://localhost:8000/health${NC}              ${PURPLE}║${NC}"
    echo -e "${PURPLE}╠══════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${PURPLE}║${NC}  💾  数据库:       localhost:5432                              ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}  📁  项目目录:     $PROJECT_DIR${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}提示: 按 Ctrl+C 停止服务，或运行 ./start.sh 6 停止所有服务${NC}"
    echo ""
}

# ==========================================
# 主函数
# ==========================================
main() {
    show_logo
    
    # 检查环境
    check_environment
    
    # 检查配置
    check_config
    
    # 显示菜单
    show_menu
}

# 命令行参数处理
case "$1" in
    --docker|-d)
        show_logo
        check_environment
        check_config
        start_docker
        ;;
    --local|-l)
        show_logo
        check_environment
        check_config
        start_local
        ;;
    --stop|-s)
        show_logo
        stop_all
        ;;
    --status|-t)
        show_logo
        check_status
        ;;
    --help|-h)
        show_logo
        echo "用法: $0 [选项]"
        echo ""
        echo "选项:"
        echo "  -d, --docker    Docker 模式启动"
        echo "  -l, --local     本地开发模式"
        echo "  -s, --stop      停止所有服务"
        echo "  -t, --status    查看服务状态"
        echo "  -h, --help      显示帮助"
        echo ""
        echo "无选项时显示交互菜单"
        ;;
    *)
        main
        ;;
esac
