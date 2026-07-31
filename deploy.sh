#!/bin/bash
# Первичная настройка сервера с нуля (свежий образ Ubuntu). Запускать от root.
#
#   git clone https://github.com/AArtA1/bordur.git /root/bordur
#   cd /root/bordur && ./deploy.sh
#
# Дальше сайт обновляется автоматически через .github/workflows/deploy.yml
# при каждом push в main — этот скрипт повторно запускать не нужно.

set -euo pipefail

DOMAIN=xn----9sbjzjjobl1h5a.xn--p1ai
SRC=$(cd "$(dirname "$0")" && pwd)
WEBROOT=/var/www/html

if [ "$(id -u)" -ne 0 ]; then
    echo "Запускать от root" >&2
    exit 1
fi

echo "==> Ставим пакеты"
apt-get update
apt-get install -y nginx git rsync

echo "==> Выкладываем сайт в $WEBROOT"
mkdir -p "$WEBROOT"
rsync -a --delete --exclude-from="$SRC/.rsync-exclude" "$SRC"/ "$WEBROOT"/

echo "==> Настраиваем nginx"
cp "$SRC/nginx.conf" /etc/nginx/sites-available/bordur
ln -sf /etc/nginx/sites-available/bordur /etc/nginx/sites-enabled/bordur
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl restart nginx

echo
echo "Готово. Сайт работает на http://$DOMAIN"
echo
echo "Следующий шаг — HTTPS (сертификат выпускается вручную, у Let's Encrypt лимиты):"
echo "  apt-get install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d $DOMAIN"
echo
echo "Certbot допишет в /etc/nginx/sites-available/bordur блок с 443 и TLS."
echo "После этого не перезаписывайте этот файл из репозитория — иначе HTTPS отвалится."
