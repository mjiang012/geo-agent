# GEO Agent Dockerfile
# 支持阿里云、腾讯云、华为云等云厂商容器服务部署

# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 安装 tsx 用于运行 TypeScript
RUN npm install -g tsx

# 从构建阶段复制必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/api ./api
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动命令
CMD ["tsx", "api/server.ts"]
