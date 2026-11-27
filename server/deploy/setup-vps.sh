#!/usr/bin/env bash
# One-shot, re-runnable setup of the MP Update API on a fresh Ubuntu/Debian VPS.
#
#   1. upload the backend folder to the server (git clone or scp) e.g. /var/www/mpupdate-api
#   2. cd /var/www/mpupdate-api && sudo bash deploy/setup-vps.sh
#
# It: picks a FREE port, installs Node 20 + Nginx + PM2 + certbot, installs dependencies,
# starts the API in cluster mode, configures Nginx (cache, rate limit, gzip) and the firewall.
set -euo pipefail

DOMAIN="${DOMAIN:-api.mpupdate.com}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_USER="${SUDO_USER:-$(whoami)}"

[ "$(id -u)" -eq 0 ] || { echo "Run with sudo:  sudo bash deploy/setup-vps.sh"; exit 1; }
echo ">> App folder : $APP_DIR"
echo ">> Domain     : $DOMAIN"

# ---------- 1. free port -------------------------------------------------------------
in_use() { ss -tln | awk '{print $4}' | grep -Eq "[:.]$1$"; }
PORT=""
for p in 8080 8081 8082 4015 4016 5001 5002 7000 7001 9000 9001; do
  if ! in_use "$p"; then PORT="$p"; break; fi
done
[ -n "$PORT" ] || { echo "No free port among the usual ones – edit this script."; exit 1; }
echo ">> Free port  : $PORT  (private, only Nginx can reach it)"

# ---------- 2. packages ---------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl ca-certificates gnupg nginx ufw certbot python3-certbot-nginx build-essential

if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
command -v pm2 >/dev/null || npm install -g pm2

# ---------- 3. swap (small VPS safety net) --------------------------------------------
MEM_MB=$(free -m | awk 'NR==2{print $2}')
SWAP_MB=$(free -m | awk 'NR==3{print $2}')
if [ "$MEM_MB" -lt 2000 ] && [ "$SWAP_MB" -eq 0 ]; then
  echo ">> Low RAM ($MEM_MB MB) – creating 2 GB swap"
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl -w vm.swappiness=10 >/dev/null
  grep -q 'vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf
fi

# ---------- 4. environment file --------------------------------------------------------
cd "$APP_DIR"
if [ ! -f .env ]; then
  cp .env.production.example .env
  echo ">> Created .env from the example – FILL IT, then re-run this script:  nano $APP_DIR/.env"
  sed -i "s/^PORT=.*/PORT=$PORT/" .env
  exit 0
fi
# keep PORT in .env in sync with the free port we found (unless the API is already running on it)
if ! pm2 describe mpupdate-api >/dev/null 2>&1; then sed -i "s/^PORT=.*/PORT=$PORT/" .env; fi
PORT="$(grep -E '^PORT=' .env | cut -d= -f2 | tr -d '\r')"
for k in MONGODB_URL JWT_SECRET; do
  grep -Eq "^$k=.+" .env || { echo "!! $k is empty in .env"; exit 1; }
done

# ---------- 5. dependencies + start ----------------------------------------------------
chown -R "$APP_USER":"$APP_USER" "$APP_DIR"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && npm ci --omit=dev --no-audit --no-fund"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && pm2 startOrReload deploy/ecosystem.config.js --env production && pm2 save"
env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$APP_USER" --hp "$(getent passwd "$APP_USER" | cut -d: -f6)" >/dev/null 2>&1 || true

# ---------- 6. nginx ---------------------------------------------------------------------
mkdir -p /var/cache/nginx/mpupdate
sed "s/__PORT__/$PORT/g; s/api.mpupdate.com/$DOMAIN/g" deploy/nginx-api.mpupdate.com.conf > "/etc/nginx/sites-available/$DOMAIN"
ln -sf "/etc/nginx/sites-available/$DOMAIN" "/etc/nginx/sites-enabled/$DOMAIN"
nginx -t && systemctl reload nginx

# ---------- 7. firewall ------------------------------------------------------------------
ufw allow OpenSSH >/dev/null; ufw allow 'Nginx Full' >/dev/null
ufw --force enable >/dev/null
# the API port is NOT opened: it listens on 127.0.0.1 only

# ---------- 8. health check ----------------------------------------------------------------
sleep 3
echo
echo "== API (local)   : $(curl -s http://127.0.0.1:$PORT/health || echo 'not answering')"
echo "== API (nginx)   : $(curl -s -H "Host: $DOMAIN" http://127.0.0.1/health || echo 'not answering')"
echo
echo "NEXT: make sure DNS  A  record  $DOMAIN -> this server's IP, then enable HTTPS:"
echo "      sudo certbot --nginx -d $DOMAIN --redirect -m you@example.com --agree-tos -n"
