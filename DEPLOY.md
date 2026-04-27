# GEO Agent 云服务器部署指南

## 一、购买云服务器

### 推荐配置
- **CPU**: 2核
- **内存**: 4GB
- **带宽**: 3-5Mbps
- **系统**: Ubuntu 22.04 LTS / CentOS 8

### 推荐平台
| 平台 | 入门价格 | 链接 |
|------|---------|------|
| 阿里云 | 99元/年 | [aliyun.com](https://www.aliyun.com) |
| 腾讯云 | 99元/年 | [cloud.tencent.com](https://cloud.tencent.com) |
| 华为云 | 99元/年 | [huaweicloud.com](https://www.huaweicloud.com) |

---

## 二、服务器环境配置

### 1. 连接服务器
```bash
ssh root@your-server-ip
```

### 2. 安装 Node.js 20+
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### 3. 安装 PM2 进程管理器
```bash
npm install -g pm2 tsx
```

### 4. 安装 Nginx（可选，推荐用于生产环境）
```bash
# Ubuntu/Debian
sudo apt-get install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

---

## 三、部署项目

### 方法 1：使用部署脚本（推荐）

```bash
# 1. 上传项目代码到服务器
scp -r /local/path/to/project root@your-server-ip:/var/www/geo-agent

# 2. 连接服务器并进入项目目录
ssh root@your-server-ip
cd /var/www/geo-agent

# 3. 运行部署脚本
chmod +x deploy.sh
./deploy.sh
```

### 方法 2：手动部署

```bash
# 1. 进入项目目录
cd /var/www/geo-agent

# 2. 安装依赖
npm install

# 3. 构建前端
npm run build

# 4. 启动后端服务
pm2 start api/server.ts --name "geo-agent" --interpreter tsx

# 5. 保存配置
pm2 save
pm2 startup
```

---

## 四、配置 Nginx（推荐）

### 1. 复制配置文件
```bash
sudo cp nginx.conf /etc/nginx/sites-available/geo-agent
sudo ln -s /etc/nginx/sites-available/geo-agent /etc/nginx/sites-enabled/
```

### 2. 修改配置文件
```bash
sudo nano /etc/nginx/sites-available/geo-agent
# 修改 server_name 为你的域名或服务器 IP
```

### 3. 测试并重载配置
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 配置 HTTPS（可选）
```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 自动配置 HTTPS
sudo certbot --nginx -d your-domain.com
```

---

## 五、访问应用

部署完成后，可以通过以下地址访问：

| 方式 | 地址 |
|------|------|
| 直接访问（无 Nginx）| http://your-server-ip:3001 |
| Nginx 代理 | http://your-domain.com |
| HTTPS | https://your-domain.com |

---

## 六、常用命令

```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs geo-agent

# 重启服务
pm2 restart geo-agent

# 停止服务
pm2 stop geo-agent

# 更新代码后重新部署
git pull
npm run build
pm2 restart geo-agent
```

---

## 七、故障排查

### 1. 端口被占用
```bash
# 查看端口占用
sudo lsof -i :3001

# 结束进程
sudo kill -9 <PID>
```

### 2. 防火墙设置
```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3001

# CentOS/RHEL (FirewallD)
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

### 3. 权限问题
```bash
# 修改项目目录权限
sudo chown -R $USER:$USER /var/www/geo-agent
```

---

## 八、安全建议

1. **修改默认 SSH 端口**（22 → 其他）
2. **禁用 root 密码登录**，使用密钥登录
3. **配置防火墙**，只开放必要端口
4. **定期更新系统和依赖**
5. **配置自动备份**

---

## 需要帮助？

如有问题，请检查：
1. 服务器防火墙是否放行端口
2. 安全组/网络 ACL 是否配置正确
3. 域名 DNS 解析是否正确
4. Nginx 配置是否有语法错误
