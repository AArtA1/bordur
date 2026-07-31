#!/usr/bin/env bash
#
# Выкладка содержимого репозитория в вебрут. Вызывается из
# .github/workflows/deploy.yml и годится для ручного запуска на сервере:
#
#   /root/bordur/infra/deploy-webroot.sh
#
# На время работы ставит флаг /run/bordur-deploy-in-progress — пока он есть,
# site-watch.sh не шлёт пуши. Во время rsync сайт короткое время может быть
# неконсистентен, и это ожидаемо, а не авария. Флаг снимается в trap, поэтому
# переживает и ошибку, и прерывание; вдобавок лежит в /run (tmpfs), так что
# исчезает при перезагрузке. Со стороны наблюдателя есть ещё ограничение по
# возрасту — упавший деплой не заглушит алерты навсегда.

set -euo pipefail

SRC="${SRC:-$(cd "$(dirname "$0")/.." && pwd)}"
WEBROOT="${WEBROOT:-/var/www/html}"
FLAG=/run/bordur-deploy-in-progress

# Страховка: не выкладывать пустое или битое дерево поверх живого сайта
test -s "$SRC/index.html"

touch "$FLAG"
trap 'rm -f "$FLAG"' EXIT

mkdir -p "$WEBROOT"
rsync -a --delete --exclude-from="$SRC/.rsync-exclude" "$SRC"/ "$WEBROOT"/

nginx -t
systemctl reload nginx

echo "Выложено: $(git -C "$SRC" rev-parse --short HEAD)"
