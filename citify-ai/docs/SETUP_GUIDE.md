# Citify AI 快速设置指南

## 目录
1. [获取 API 密钥](#获取-api-密钥)
2. [配置 .env 文件](#配置-env-文件)
3. [启动服务](#启动服务)
4. [故障排除](#故障排除)

---

## 获取 API 密钥

### 1. OpenAI API Key

**获取步骤：**
1. 访问：https://platform.openai.com/api-keys
2. 登录或注册 OpenAI 账户
3. 点击 "Create new secret key"
4. 命名您的密钥（例如：citify-ai-dev）
5. 复制密钥并保存（只显示一次！）

**密钥格式：**
```
sk-proj-1234abc56def789ghi01jkl234mno56789pq
```

**费用说明：**
- 新用户有免费额度
- Embedding 模型较便宜 ($0.00013 / 1K tokens)
- GPT-4 Turbo ($0.01 / 1K input tokens)

---

### 2. Pinecone API Key

**获取步骤：**
1. 访问：https://app.pinecone.io/
2. 注册或登录 Pinecone 账户
3. 在左侧菜单点击 "API Keys"
4. 点击 "Create API Key"
5. 复制 API Key 和 Environment

**密钥格式：**
```
PINECONE_API_KEY=sk-1234abc-56def-789gh-01ij-23456789012
PINECONE_ENVIRONMENT=gcp-starter
```

**免费套餐：**
- Starter Plan：免费，限制 1 个项目，100MB 存储
- 足够开发和测试使用

---

### 3. Anthropic API Key (可选)

**获取步骤：**
1. 访问：https://console.anthropic.com/
2. 注册或登录
3. 进入 API Keys 页面
4. 创建新密钥

**密钥格式：**
```
sk-ant-api01-1234567890abcdefghij1234567890abcdefghij
```

---

### 4. 其他 API Keys (可选)

#### Statista API
- 访问：https://www.statista.com/developers/
- 需要申请开发者账户

#### Semantic Scholar API
- 访问：https://www.semanticscholar.org/product/api
- 免费使用，无需密钥（但有速率限制）

---

## 配置 .env 文件

### 1. 编辑项目根目录 .env

打开 `/Users/bytedance/Documents/trae_projects/citify-ai/.env`，替换以下内容：

```env
# ==========================================
# 必填配置
# ==========================================

# OpenAI
OPENAI_API_KEY=sk-proj-您的真实密钥

# Pinecone
PINECONE_API_KEY=sk-您的真实密钥
PINECONE_ENVIRONMENT=gcp-starter  # 或您的实际环境

# Security
SECRET_KEY=生成一个安全的随机密钥
# 使用以下命令生成: python -c "import secrets; print(secrets.token_hex(32))"
```

### 2. 生成安全密钥

打开终端运行：

```bash
# 方法 1: 使用 Python
python3 -c "import secrets; print(secrets.token_hex(32))"

# 方法 2: 使用 OpenSSL
openssl rand -hex 32
```

将输出复制到 `SECRET_KEY=` 后面。

---

## 启动服务

### 选项 1: 使用 Docker (推荐)

```bash
cd /Users/bytedance/Documents/trae_projects/citify-ai

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

**访问地址：**
- 前端：http://localhost:3000
- 后端 API：http://localhost:8000
- API 文档：http://localhost:8000/docs

---

### 选项 2: 本地开发

#### 启动数据库 (PostgreSQL)

```bash
# 使用 Docker 启动 PostgreSQL
docker run -d \
  --name citify-postgres \
  -e POSTGRES_USER=citify \
  -e POSTGRES_PASSWORD=citify123 \
  -e POSTGRES_DB=citify_ai \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 启动后端

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 启动前端

```bash
cd frontend
npm install
npm run dev
```

---

## 验证安装

### 1. 检查后端健康状态

访问：http://localhost:8000/health

应该返回：
```json
{"status":"healthy","version":"1.0.0"}
```

### 2. 测试 API 端点

访问：http://localhost:8000/docs

使用 Swagger UI 测试各个 API 端点。

### 3. 访问前端应用

访问：http://localhost:3000

---

## 故障排除

### 常见问题

#### 1. OpenAI API 错误

**问题：** `AuthenticationError`
**解决：** 检查 `OPENAI_API_KEY` 是否正确配置

**问题：** `RateLimitError`
**解决：** 检查账户是否有足够的额度，或降低请求频率

---

#### 2. Pinecone 连接错误

**问题：** 无法连接到 Pinecone
**解决：**
- 验证 API Key 和 Environment 是否匹配
- 检查网络连接
- 确认在 Pinecone 控制台已创建 Index

---

#### 3. 数据库连接错误

**问题：** `Connection refused`
**解决：**
- 确认 PostgreSQL 正在运行
- 检查 `DATABASE_URL` 配置
- 验证用户名和密码

---

#### 4. 前端无法连接后端

**问题：** API 请求失败
**解决：**
- 确认后端正在运行
- 检查 `NEXT_PUBLIC_API_URL` 配置
- 查看浏览器控制台错误信息

---

## 开发工作流

### 添加新功能

```bash
# 1. 创建功能分支
git checkout -b feature/your-feature-name

# 2. 编写代码
# ...

# 3. 测试
cd backend
pytest

# 4. 提交
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

---

## 下一步

- [ ] 配置好所有 API 密钥
- [ ] 启动服务并验证健康检查
- [ ] 尝试第一个 API 调用
- [ ] 查看文档：API.md, DEPLOYMENT.md

---

## 获取帮助

- 查看项目文档：[README.md](../README.md)
- 提交问题：GitHub Issues
- 邮件支持：support@citify.ai
