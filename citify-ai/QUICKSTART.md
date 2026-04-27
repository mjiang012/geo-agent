# 🚀 Citify AI 快速启动指南

欢迎使用 Citify AI！本指南将帮助您在几分钟内启动并运行项目。

---

## 📋 前置条件

### 必需安装
- **Docker Desktop** (推荐) 或 Docker Engine
- **Git** (用于版本控制)

### 可选安装
- **Python 3.11+** (仅本地开发)
- **Node.js 18+** (仅本地开发)

### 获取 API 密钥 (可选但推荐)
- [OpenAI API Key](https://platform.openai.com/api-keys)
- [Pinecone API Key](https://app.pinecone.io/)

---

## 🎯 快速开始 (Docker, 推荐)

### 1️⃣ 运行启动脚本

**macOS / Linux:**
```bash
cd /Users/bytedance/Documents/trae_projects/citify-ai
./start.sh
```

**Windows:**
```cmd
cd C:\path\to\citify-ai
start.bat
```

### 2️⃣ 选择启动方式

脚本会自动检查环境并提供菜单选项：
```
  1) 🐳  Docker 启动 (推荐)
  2) 💻  本地开发模式
  3) 🔧  仅启动后端
  4) 🎨  仅启动前端
  5) 📊  仅启动数据库
  6) ⏹️  停止所有服务
  7) 🔄  重启所有服务
  8) 📋  查看服务状态
```

**选择 1 即可一键启动 Docker 模式！**

### 3️⃣ 配置 API 密钥

首次运行后，编辑 `.env` 文件：

```bash
# 编辑 .env 文件
nano .env
# 或使用编辑器
open .env
```

填入您的 API 密钥：
```env
OPENAI_API_KEY=sk-proj-您的OpenAI密钥
PINECONE_API_KEY=您的Pinecone密钥
PINECONE_ENVIRONMENT=gcp-starter
```

### 4️⃣ 访问服务

启动成功后，可访问：

- 🌐 **前端应用**: http://localhost:3000
- 🚀 **后端 API**: http://localhost:8000
- 📚 **API 文档**: http://localhost:8000/docs
- 📊 **健康检查**: http://localhost:8000/health

---

## ⌨️ 快速命令

### 使用命令行参数 (跳过菜单)

**macOS / Linux:**
```bash
# Docker 模式
./start.sh --docker

# 本地开发
./start.sh --local

# 查看状态
./start.sh --status

# 停止所有服务
./start.sh --stop
```

**Windows:**
```cmd
# 直接运行脚本选择菜单
start.bat
```

### 手动 Docker 命令

```bash
# 首次构建和启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

---

## 🛠️ 本地开发模式

如果您想进行开发，使用本地模式：

### 后端
```bash
cd backend

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 前端
```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

---

## 🔍 故障排除

### Docker 相关

**问题: Docker 未运行**
```
# 启动 Docker Desktop (macOS/Windows)
# 或启动 Docker 服务 (Linux)
sudo systemctl start docker
```

**问题: 端口被占用**
```bash
# 查找占用端口的进程
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

### 配置相关

**问题: .env 文件缺失**
```bash
cp .env.example .env
# 然后编辑 .env
```

**问题: 数据库连接失败**
```bash
# 重启数据库容器
docker-compose restart postgres
# 或重启所有服务
docker-compose restart
```

### 依赖相关

**问题: Python 依赖安装失败**
```bash
# 升级 pip
pip install --upgrade pip
# 使用国内镜像
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

**问题: npm install 很慢**
```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com
npm install
```

---

## 📚 项目结构

```
citify-ai/
├── 📄 start.sh              - 一键启动脚本 (macOS/Linux)
├── 📄 start.bat             - 一键启动脚本 (Windows)
├── 📄 docker-compose.yml    - Docker 配置
├── 📄 .env                  - 环境变量配置
├── 📄 QUICKSTART.md         - 本文档
├── 📁 backend/              - 后端服务
│   ├── app/                 - 应用代码
│   └── requirements.txt     - Python 依赖
├── 📁 frontend/             - 前端应用
│   ├── app/                 - Next.js 应用
│   └── package.json         - Node 依赖
├── 📁 extension/            - 浏览器插件
└── 📁 docs/                 - 文档
```

---

## 🎮 功能模块

### 📊 Dashboard
- 关键词引用监控
- AI 搜索分析
- 数据可视化

### 🔍 Analyze
- 内容分析
- RAG 友好度评分
- 优化建议

### ✨ Optimize
- 内容优化
- 数据增强
- 专家引用

### 🚀 Generate
- 内容生成
- 长尾问题
- 行业模板

---

## 🔧 开发工作流

### 1. 创建功能分支
```bash
git checkout -b feature/您的功能名称
```

### 2. 开发和测试
```bash
# 启动开发环境
./start.sh --local
```

### 3. 提交更改
```bash
git add .
git commit -m "feat: 添加新功能"
git push
```

---

## 📞 获取帮助

- 📖 详细文档: `docs/` 目录
- 📚 API 文档: http://localhost:8000/docs
- 🐛 问题反馈: GitHub Issues

---

## 🎉 开始使用！

**现在就开始使用 Citify AI：**

```bash
# 进入项目目录
cd /Users/bytedance/Documents/trae_projects/citify-ai

# 运行启动脚本
./start.sh

# 选择 1 - Docker 模式
# 配置 API 密钥
# 访问 http://localhost:3000
```

祝您使用愉快！🎉
