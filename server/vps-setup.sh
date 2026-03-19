#!/bin/bash
# Entourage API Server - VPS Setup Script
# Run this on VPS (194.163.172.62) as root

set -e

echo "═══════════════════════════════════════"
echo "  Entourage API - VPS Deploy"
echo "═══════════════════════════════════════"

# 1. Add SSH key for passwordless access
echo "► Adding SSH key..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIIyMWUhuxsgcVCg/VbEcIcy+jy6/wc7oIX5+uXkix5NR smarketer@Giorgis-Mac-mini.local" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
echo "✓ SSH key added"

# 2. Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "► Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
echo "✓ Node.js $(node -v)"

# 3. Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo "► Installing PM2..."
    npm install -g pm2
fi
echo "✓ PM2 installed"

# 4. Create app directory
echo "► Setting up app directory..."
mkdir -p /opt/entourage

# 5. Open port 3001 in firewall
echo "► Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 3001/tcp 2>/dev/null || true
    echo "✓ UFW: port 3001 opened"
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=3001/tcp 2>/dev/null || true
    firewall-cmd --reload 2>/dev/null || true
    echo "✓ firewalld: port 3001 opened"
else
    # Try iptables directly
    iptables -I INPUT -p tcp --dport 3001 -j ACCEPT 2>/dev/null || true
    echo "✓ iptables: port 3001 opened"
fi

echo ""
echo "═══════════════════════════════════════"
echo "  ✅ VPS ready for deployment!"
echo "  SSH key added - Mac can now deploy"
echo "═══════════════════════════════════════"
