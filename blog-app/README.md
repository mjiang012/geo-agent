# 全栈博客应用

一个基于 React + TypeScript + Node.js + Express + MySQL 的全栈博客应用，支持文章发布、编辑、删除、评论等功能。

## 技术栈

### 前端
- React 18
- TypeScript 5
- React Router 6
- Axios
- Zustand (状态管理)
- Tailwind CSS
- Vite

### 后端
- Node.js 20
- Express 4
- TypeScript 5
- MySQL 8
- JWT (认证)
- bcryptjs (密码加密)

## 项目结构

```
blog-app/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── api/             # API 接口
│   │   ├── components/      # 组件
│   │   ├── layouts/         # 布局
│   │   ├── pages/           # 页面
│   │   ├── router/          # 路由
│   │   ├── stores/          # 状态管理
│   │   ├── types/           # TypeScript 类型
│   │   └── utils/           # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # 后端项目
│   ├── src/
│   │   ├── config/          # 配置文件
│   │   ├── middlewares/     # 中间件
│   │   ├── routes/          # 路由
│   │   ├── types/           # 类型定义
│   │   └── utils/           # 工具函数
│   ├── package.json
│   └── tsconfig.json
│
├── database/                 # 数据库脚本
│   └── init.sql             # 初始化 SQL
│
└── README.md
```

## 快速开始

### 1. 克隆项目

```bash
cd blog-app
```

### 2. 数据库配置

启动 MySQL 数据库并执行初始化脚本：

```bash
# 使用 Docker 启动 MySQL
docker run -d \
  --name blog-mysql \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=blog_db \
  -p 3306:3306 \
  mysql:8.0

# 执行初始化脚本
docker exec -i blog-mysql mysql -uroot -proot123 blog_db < database/init.sql
```

### 3. 启动后端服务

```bash
cd backend
npm install
npm run dev
```

后端服务将运行在 http://localhost:3000

### 4. 启动前端服务

```bash
cd frontend
npm install
npm run dev
```

前端服务将运行在 http://localhost:5173

### 5. 访问应用

打开浏览器访问 http://localhost:5173

默认管理员账号：
- 用户名：admin
- 密码：admin123

## API 接口文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 文章相关
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:id` - 获取文章详情
- `POST /api/articles` - 创建文章（需登录）
- `PUT /api/articles/:id` - 更新文章（需登录）
- `DELETE /api/articles/:id` - 删除文章（需登录）

### 评论相关
- `GET /api/comments/article/:articleId` - 获取文章评论
- `POST /api/comments/article/:articleId` - 发表评论（需登录）
- `DELETE /api/comments/:id` - 删除评论（需登录）

### 分类相关
- `GET /api/categories` - 获取分类列表

### 用户相关
- `GET /api/users/profile` - 获取用户信息（需登录）
- `PUT /api/users/profile` - 更新用户信息（需登录）
- `PUT /api/users/password` - 修改密码（需登录）
- `GET /api/users/articles` - 获取我的文章（需登录）

## 生产环境部署

### 构建前端

```bash
cd frontend
npm install
npm run build
```

构建产物在 `frontend/dist` 目录。

### 构建后端

```bash
cd backend
npm install
npm run build
```

构建产物在 `backend/dist` 目录。

### 使用 Docker Compose 部署

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: blog-mysql
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: blog_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - blog-network

  backend:
    build: ./backend
    container_name: blog-backend
    ports:
      - "3000:3000"
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: root
      DB_PASSWORD: root123
      DB_NAME: blog_db
      JWT_SECRET: your-secret-key-change-this
    depends_on:
      - mysql
    networks:
      - blog-network

  frontend:
    build: ./frontend
    container_name: blog-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - blog-network

volumes:
  mysql_data:

networks:
  blog-network:
    driver: bridge
```

启动服务：

```bash
docker-compose up -d
```

## 环境变量

### 后端 (.env)

```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root123
DB_NAME=blog_db

JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 前端 (.env)

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## 功能特性

- [x] 用户注册/登录
- [x] JWT 认证
- [x] 文章发布/编辑/删除
- [x] 文章分类
- [x] 文章标签
- [x] 评论发布/删除
- [x] 评论回复（嵌套评论）
- [x] 文章浏览量统计
- [x] 个人中心
- [x] 我的文章管理
- [x] 响应式设计

## 许可证

MIT
