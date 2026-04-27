@echo off
REM ==========================================
REM Citify AI - Windows 一键启动脚本
REM ==========================================

title Citify AI

color 0B
echo.
echo   ____ _ _   __       _    ___ 
echo  / ___(_) ^|_(_)_   _(_)  / _ \
echo ^| ^|   ^| ^| __^| \ \ / / ^| ^| ^| ^| ^|
echo ^| ^|___^| ^| ^|_^| ^|\ V /^| ^| ^| ^|_^| ^|
echo  \____^|_^|\__^|_^| \_/ ^|_^|  \___/ 
echo.
echo    GEO Optimization Platform
echo.
color 07

REM 检查管理员权限
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] 管理员权限确认
) else (
    echo [WARN] 建议以管理员身份运行
)

echo.
echo ========================================
echo   Citify AI - 启动选项
echo ========================================
echo.
echo   1^) 启动 Docker 服务
echo   2^) 查看服务状态
echo   3^) 停止所有服务
echo   4^) 启动数据库
echo   5^) 退出
echo.

set /p choice=请选择选项 [1-5]: 

if "%choice%"=="1" goto docker_start
if "%choice%"=="2" goto check_status
if "%choice%"=="3" goto stop_all
if "%choice%"=="4" goto start_db
if "%choice%"=="5" goto end
echo 无效选项
goto end

:docker_start
echo.
echo ========================================
echo   启动 Docker 服务
echo ========================================
echo.

REM 检查 Docker Desktop
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker 未运行，请先启动 Docker Desktop
    pause
    goto end
)

echo [OK] Docker 正在运行

cd /d "%~dp0"

REM 检查 docker-compose.yml
if not exist docker-compose.yml (
    echo [ERROR] 找不到 docker-compose.yml
    pause
    goto end
)

REM 检查 .env 文件
if not exist .env (
    if exist .env.example (
        echo [INFO] 从 .env.example 创建 .env
        copy .env.example .env
    )
)

echo.
echo 正在启动服务...
echo 这可能需要几分钟时间...
echo.
docker-compose up -d

if %errorlevel% equ 0 (
    echo.
    echo [OK] 服务启动成功！
    echo.
    echo 服务访问信息：
    echo   前端:    http://localhost:3000
    echo   后端:    http://localhost:8000
    echo   API文档: http://localhost:8000/docs
    echo.
) else (
    echo [ERROR] 启动失败
)
pause
goto end

:check_status
echo.
echo ========================================
echo   服务状态
echo ========================================
echo.
echo Docker 容器:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.
echo Docker Compose 服务:
if exist docker-compose.yml (
    docker-compose ps
)
echo.
echo 端口检查:
netstat -ano | findstr ":3000 " >nul && echo 端口 3000: 被占用 || echo 端口 3000: 空闲
netstat -ano | findstr ":8000 " >nul && echo 端口 8000: 被占用 || echo 端口 8000: 空闲
netstat -ano | findstr ":5432 " >nul && echo 端口 5432: 被占用 || echo 端口 5432: 空闲
echo.
pause
goto end

:stop_all
echo.
echo ========================================
echo   停止所有服务
echo ========================================
echo.

cd /d "%~dp0"

if exist docker-compose.yml (
    echo 停止 Docker Compose 服务...
    docker-compose down
)

echo 停止 PostgreSQL 容器...
docker stop citify-postgres 2>nul
docker rm citify-postgres 2>nul

echo.
echo [OK] 所有服务已停止
pause
goto end

:start_db
echo.
echo ========================================
echo   启动 PostgreSQL 数据库
echo ========================================
echo.

REM 检查容器是否已存在
docker ps --format "{{.Names}}" | findstr "^citify-postgres$" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL 已在运行
    goto show_db_info
)

REM 检查是否已停止
docker ps -a --format "{{.Names}}" | findstr "^citify-postgres$" >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] 启动已存在的容器
    docker start citify-postgres
) else (
    echo [INFO] 创建新容器
    docker run -d --name citify-postgres -e POSTGRES_USER=citify -e POSTGRES_PASSWORD=citify123 -e POSTGRES_DB=citify_ai -p 5432:5432 postgres:15-alpine
)

:show_db_info
echo.
echo 数据库信息：
echo   主机: localhost
echo   端口: 5432
echo   用户名: citify
echo   密码: citify123
echo   数据库: citify_ai
echo.
pause
goto end

:end
echo.
echo 再见！
timeout /t 2 >nul
