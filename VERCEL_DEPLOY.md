# GEO Agent Vercel 部署指南

## 方式一：通过 GitHub 部署（推荐）

### 第一步：创建 GitHub 仓库

1. 访问 [github.com](https://github.com) 登录账号
2. 点击右上角 `+` → `New repository`
3. 填写仓库信息：
   - Repository name: `geo-agent`
   - Description: `GEO Agent - 生成式引擎优化平台`
   - 选择 `Public` 或 `Private`
   - 勾选 `Add a README file`
4. 点击 `Create repository`

### 第二步：推送代码到 GitHub

```bash
# 在项目根目录执行

# 1. 初始化 Git（如果还没初始化）
git init

# 2. 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/geo-agent.git

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "Initial commit: GEO Agent platform"

# 5. 推送到 GitHub
git push -u origin main
```

### 第三步：在 Vercel 部署

1. 访问 [vercel.com](https://vercel.com) 用 GitHub 账号登录
2. 点击 `Add New...` → `Project`
3. 在 `Import Git Repository` 中找到 `geo-agent` 仓库
4. 点击 `Import`
5. 配置项目：
   - **Framework Preset**: 选择 `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. 点击 `Deploy`

等待 2-3 分钟，部署完成后会获得一个永久域名，如：
`https://geo-agent-xxx.vercel.app`

---

## 方式二：通过 Vercel CLI 部署

### 安装 Vercel CLI

```bash
npm i -g vercel
```

### 登录并部署

```bash
# 1. 登录 Vercel
vercel login

# 2. 在项目根目录执行部署
vercel

# 3. 按照提示选择：
# ? Set up and deploy ".../geo-agent"? [Y/n] Y
# ? Which scope do you want to deploy to? [你的账号]
# ? Link to existing project? [y/N] N
# ? What's your project name? [geo-agent]
# ? In which directory is your code located? ./

# 4. 部署到生产环境
vercel --prod
```

---

## 方式三：直接上传部署（无需 Git）

1. 访问 [vercel.com](https://vercel.com) 注册/登录
2. 点击 `Add New...` → `Project`
3. 选择 `Import Git Repository` 下方的 `Continue with Template`
4. 或者直接将项目文件夹拖拽到 Vercel 仪表板

---

## 部署后配置

### 自定义域名（可选）

1. 在 Vercel 项目页面点击 `Settings` → `Domains`
2. 输入你的域名，如 `geo-agent.yourdomain.com`
3. 按照提示添加 DNS 记录
4. 等待 DNS 生效（通常几分钟到几小时）

### 环境变量（如果需要）

1. 点击 `Settings` → `Environment Variables`
2. 添加所需的环境变量

---

## 自动部署

通过 GitHub 集成后，每次推送代码到 main 分支，Vercel 会自动重新部署。

---

## 常见问题

### 1. 构建失败
检查 `vercel.json` 配置是否正确，确保：
- 前端构建输出目录是 `dist`
- API 路由配置正确

### 2. API 404 错误
确保 `api/index.ts` 文件存在且导出正确。

### 3. 静态资源加载失败
检查 `vite.config.ts` 中的 `base` 配置，Vercel 部署时不需要修改。

---

## 部署文件说明

| 文件 | 作用 |
|------|------|
| `vercel.json` | Vercel 部署配置，定义构建和路由规则 |
| `api/index.ts` | 后端 API 入口，Vercel Serverless Functions |
| `package.json` | 包含 `vercel-build` 构建脚本 |

---

## 推荐方案

**首次部署**：使用方式一（GitHub + Vercel）
- 免费、稳定、自动部署
- 获得 `xxx.vercel.app` 永久域名
- 支持 HTTPS
- 全球 CDN 加速

部署完成后，您可以将域名分享给任何人访问！
