# GEO Agent 云厂商部署指南

支持：阿里云、腾讯云、华为云、AWS、Azure 等主流云厂商

---

## 方案一：Docker 部署（推荐）

### 1. 购买云服务器

**推荐配置**：
- **CPU**: 2核
- **内存**: 4GB
- **系统**: Ubuntu 22.04 LTS
- **带宽**: 3-5Mbps

**推荐云厂商**：
| 平台 | 价格 | 链接 |
|------|------|------|
| 阿里云 ECS | 99元/年 | [aliyun.com](https://www.aliyun.com/product/ecs) |
| 腾讯云 CVM | 99元/年 | [cloud.tencent.com](https://cloud.tencent.com/product/cvm) |
| 华为云 ECS | 99元/年 | [huaweicloud.com](https://www.huaweicloud.com/product/ecs.html) |

### 2. 安装 Docker

```bash
# 连接服务器
ssh root@your-server-ip

# 安装 Docker
curl -fsSL https://get.docker.com | sh

# 启动 Docker
systemctl start docker
systemctl enable docker

# 安装 Docker Compose
apt-get install -y docker-compose-plugin
# 或
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 3. 部署项目

```bash
# 克隆代码
git clone https://github.com/mjiang012/geo-agent.git
cd geo-agent

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### 4. 访问应用

- 应用地址：`http://your-server-ip:3001`

---

## 方案二：云厂商容器服务（更稳定）

### 阿里云容器服务 ACK

```bash
# 1. 安装阿里云 CLI
https://aliyun.com/product/cli

# 2. 配置认证
aliyun configure

# 3. 构建并推送镜像到 ACR
# 登录阿里云容器镜像服务
aliyun cr GetAuthorizationToken

# 构建镜像
docker build -t registry.cn-hangzhou.aliyuncs.com/YOUR_NAMESPACE/geo-agent:latest .

# 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/YOUR_NAMESPACE/geo-agent:latest

# 4. 在 ACK 控制台创建 Deployment 和 Service
```

### 腾讯云容器服务 TKE

```bash
# 1. 安装腾讯云 CLI
https://cloud.tencent.com/document/product/440/3408

# 2. 登录腾讯云容器镜像服务 TCR
docker login ccr.ccs.tencentyun.com --username=YOUR_USERNAME

# 3. 构建并推送镜像
docker build -t ccr.ccs.tencentyun.com/YOUR_NAMESPACE/geo-agent:latest .
docker push ccr.ccs.tencentyun.com/YOUR_NAMESPACE/geo-agent:latest

# 4. 在 TKE 控制台部署应用
```

### 华为云容器服务 CCE

```bash
# 1. 登录华为云容器镜像服务 SWR
# 在华为云控制台获取登录指令

# 2. 构建并推送镜像
docker build -t swr.cn-north-4.myhuaweicloud.com/YOUR_NAMESPACE/geo-agent:latest .
docker push swr.cn-north-4.myhuaweicloud.com/YOUR_NAMESPACE/geo-agent:latest

# 3. 在 CCE 控制台部署应用
```

---

## 方案三：传统部署（无 Docker）

### 1. 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2 tsx
```

### 2. 部署应用

```bash
# 克隆代码
git clone https://github.com/mjiang012/geo-agent.git
cd geo-agent

# 安装依赖
npm install

# 构建前端
npm run build

# 启动服务
pm2 start api/server.ts --name "geo-agent" --interpreter tsx

# 保存配置
pm2 save
pm2 startup
```

### 3. 配置 Nginx

```bash
# 安装 Nginx
apt-get install -y nginx

# 复制配置
cp nginx.conf /etc/nginx/sites-available/geo-agent
ln -s /etc/nginx/sites-available/geo-agent /etc/nginx/sites-enabled/

# 修改 server_name
nano /etc/nginx/sites-available/geo-agent

# 测试并重载
nginx -t
systemctl reload nginx
```

---

## 方案四：Serverless 部署

### 阿里云函数计算 FC

```bash
# 1. 安装 Serverless Devs
npm install -g @serverless-devs/s

# 2. 初始化项目
s init start-fc3-nodejs

# 3. 部署
s deploy
```

### 腾讯云云函数 SCF

```bash
# 1. 安装 Serverless Framework
npm install -g serverless

# 2. 创建 serverless.yml
cat > serverless.yml << 'EOF'
service: geo-agent

provider:
  name: tencent
  runtime: Nodejs20
  region: ap-guangzhou

functions:
  api:
    handler: api/index.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY

EOF

# 3. 部署
sls deploy
```

---

## 配置域名和 HTTPS

### 使用 Nginx + Certbot

```bash
# 安装 Certbot
apt-get install -y certbot python3-certbot-nginx

# 申请证书
certbot --nginx -d your-domain.com

# 自动续期
certbot renew --dry-run
```

### 云厂商负载均衡 SSL

1. 在控制台上传 SSL 证书
2. 配置 HTTPS 监听
3. 后端指向应用端口

---

## 监控和日志

### 安装阿里云监控

```bash
# 安装云监控插件
wget http://update2.aegis.aliyun.com/download/cms_install.sh
chmod +x cms_install.sh
./cms_install.sh
```

### 安装腾讯云监控

```bash
# 安装 BaradAgent
wget http://update2.agent.tencentyun.com/update/barad_agent_installer.sh
chmod +x barad_agent_installer.sh
./barad_agent_installer.sh
```

---

## 备份策略

```bash
# 创建备份脚本
cat > /opt/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR=/opt/backups

# 备份代码
cd /var/www/geo-agent && tar czf $BACKUP_DIR/geo-agent-$DATE.tar.gz .

# 保留最近7天备份
find $BACKUP_DIR -name "geo-agent-*.tar.gz" -mtime +7 -delete
EOF

chmod +x /opt/backup.sh

# 添加定时任务
echo "0 2 * * * /opt/backup.sh" | crontab -
```

---

## 故障排查

### 查看容器日志
```bash
docker-compose logs -f geo-agent
```

### 查看 PM2 日志
```bash
pm2 logs geo-agent
```

### 检查端口占用
```bash
netstat -tlnp | grep 3001
```

### 防火墙设置
```bash
# Ubuntu
ufw allow 80
ufw allow 443
ufw allow 3001

# CentOS
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --permanent --add-port=3001/tcp
firewall-cmd --reload
```

---

## 成本对比

| 方案 | 月成本 | 适用场景 |
|------|--------|----------|
| 云服务器 + Docker | 8-15元 | 个人/小团队 |
| 容器服务 ACK/TKE | 50-200元 | 企业生产环境 |
| Serverless | 按量计费 | 流量波动大 |
| 传统部署 | 8-15元 | 熟悉 Linux |

---

## 推荐方案

1. **个人/测试**：云服务器 + Docker
2. **企业生产**：容器服务 + 负载均衡
3. **流量波动大**：Serverless

需要帮助选择或部署？请告诉我您的具体需求！
