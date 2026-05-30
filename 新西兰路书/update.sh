#!/bin/bash

# 新西兰路书网站更新脚本
# 用法: ./update.sh

set -e

echo "🚀 开始更新新西兰路书网站..."

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 服务器配置
SERVER="root@121.43.235.86"
REMOTE_DIR="/usr/local/nginx/html/trip"
NGINX_BIN="/usr/local/nginx/sbin/nginx"

# 本地路径
WEBSITE_DIR="$(cd "$(dirname "$0")/website" && pwd)"

echo -e "${BLUE}📦 步骤1: 构建网站...${NC}"
cd "$WEBSITE_DIR"
npm run build

echo -e "${BLUE}📤 步骤2: 上传文件到服务器...${NC}"
scp -r "$WEBSITE_DIR/dist/"* "$SERVER:$REMOTE_DIR/"

echo -e "${BLUE}🔄 步骤3: 重载 Nginx...${NC}"
ssh "$SERVER" "$NGINX_BIN -s reload"

echo -e "${GREEN}✅ 更新完成！${NC}"
echo -e "${GREEN}🌐 访问地址: https://ginstar.top/trip/${NC}"
