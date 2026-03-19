#!/bin/bash
# Deploy Entourage API to VPS
# Run from Mac after VPS setup is complete

set -e
VPS="root@194.163.172.62"
REMOTE_DIR="/opt/entourage"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$(dirname "$LOCAL_DIR")/.env"

echo "═══════════════════════════════════════"
echo "  Deploying Entourage API to VPS"
echo "═══════════════════════════════════════"

# 1. Copy server files
echo "► Uploading server files..."
ssh $VPS "mkdir -p $REMOTE_DIR"
scp "$LOCAL_DIR/index.js" "$LOCAL_DIR/db.js" "$LOCAL_DIR/migrate.js" "$LOCAL_DIR/package.json" "$VPS:$REMOTE_DIR/"
scp -r "$LOCAL_DIR/middleware" "$VPS:$REMOTE_DIR/"

# 2. Copy .env
echo "► Uploading .env..."
scp "$ENV_FILE" "$VPS:$REMOTE_DIR/.env"

# 3. Install dependencies on VPS
echo "► Installing dependencies..."
ssh $VPS "cd $REMOTE_DIR && npm install --production"

# 4. Run migration
echo "► Running migration..."
ssh $VPS "cd $REMOTE_DIR && node migrate.js"

# 5. Start/restart with PM2
echo "► Starting API server..."
ssh $VPS "cd $REMOTE_DIR && pm2 delete entourage-api 2>/dev/null; pm2 start index.js --name entourage-api && pm2 save"

# 6. Verify
echo "► Verifying..."
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "http://194.163.172.62:3001/api/content/settings" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo ""
    echo "═══════════════════════════════════════"
    echo "  ✅ API deployed successfully!"
    echo "  http://194.163.172.62:3001"
    echo "═══════════════════════════════════════"
else
    echo "⚠️  API returned HTTP $HTTP_CODE"
    echo "Check: ssh $VPS 'pm2 logs entourage-api --lines 20'"
fi
