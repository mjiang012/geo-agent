#!/bin/bash

# GEO Agent 云服务器部署脚本
# 使用方法：
# 1. 购买云服务器（推荐阿里云/腾讯云 2核4G）
# 2. 安装 Node.js 20+ 和 PM2
# 3. 上传项目代码
# 4. 运行此脚本：chmod +x deploy.sh && ./deploy.sh

echo "🚀 开始部署 GEO Agent..."

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建前端
echo "🏗️ 构建前端..."
npm run build

# 安装 PM2（如果未安装）
if ! command -v pm2 &> /dev/null; then
    echo "📥 安装 PM2..."
    npm install -g pm2
fi

# 停止旧进程
echo "🛑 停止旧进程..."
pm2 delete geo-agent 2>/dev/null || true

# 启动服务
echo "▶️ 启动服务..."
pm2 start api/server.ts --name "geo-agent" --interpreter tsx

# 保存 PM2 配置
echo "💾 保存 PM2 配置..."
pm2 save
pm2 startup

echo "✅ 部署完成！"
echo ""
echo "服务已启动，访问地址："
echo "- 前端：http://your-server-ip:5173"
echo "- 后端 API：http://your-server-ip:3001"
echo ""
echo "查看日志：pm2 logs geo-agent"
echo "停止服务：pm2 stop geo-agent"
echo "重启服务：pm2 restart geo-agent"
