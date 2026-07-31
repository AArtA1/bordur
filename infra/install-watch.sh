#!/bin/bash
# Установка мониторинга сайта с уведомлениями в ntfy. Запускать от root на сервере:
#
#   /root/bordur/infra/install-watch.sh
#
# Топик ntfy берётся из /etc/bordur/alerts.env — файл создаётся при первом
# запуске, если его нет, и в него надо вписать свой NTFY_URL. В репозиторий он
# не попадает: топик ntfy.sh защищён только тем, что его имя не угадать.

set -euo pipefail

SRC="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE=/etc/bordur/alerts.env

if [ "$(id -u)" -ne 0 ]; then
    echo "Запускать от root" >&2
    exit 1
fi

install -m 755 "$SRC/site-watch.sh" /usr/local/bin/bordur-site-watch
install -m 644 "$SRC/systemd/bordur-watch.service" /etc/systemd/system/
install -m 644 "$SRC/systemd/bordur-watch.timer" /etc/systemd/system/

mkdir -p /etc/bordur /var/lib/bordur-watch
if [ ! -f "$ENV_FILE" ]; then
    cat >"$ENV_FILE" <<'EOF'
# Топик ntfy для алертов о падении сайта.
# Подписаться: открыть приложение ntfy -> Add subscription -> вставить имя топика.
NTFY_URL=
EOF
    chmod 600 "$ENV_FILE"
    echo "Создан $ENV_FILE — впишите NTFY_URL и запустите скрипт ещё раз."
fi

systemctl daemon-reload
systemctl enable --now bordur-watch.timer

echo
echo "Готово. Проверить:"
echo "  systemctl list-timers bordur-watch.timer"
echo "  /usr/local/bin/bordur-site-watch && tail /var/log/bordur-watch.log"
