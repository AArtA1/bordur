#!/usr/bin/env bash
#
# Проверка доступности сайта. Запускается systemd-таймером bordur-watch.timer
# раз в две минуты (см. infra/systemd/).
#
# Что проверяет:
#   1. Сайт отвечает 200 по https
#   2. В ответе есть маркер — иначе nginx может отдавать пустую или чужую страницу
#   3. Сколько дней осталось сертификату (предупреждение раз в сутки)
#
# Куда сообщает:
#   1. Локально — всегда: /var/log/bordur-watch.log и journal (`journalctl -t bordur-watch`).
#      Канал без внешних зависимостей, работает даже когда интернет отвалился.
#   2. ntfy — если в /etc/bordur/alerts.env задан NTFY_URL.
#
# Алерт шлётся только при СМЕНЕ состояния (работает -> лежит и обратно), иначе
# при долгой аварии телефон разорвёт. Падение засчитывается после двух неудачных
# проверок подряд, чтобы одиночная сетевая икота не поднимала тревогу.
#
# Во время деплоя проверка пропускается: infra/deploy-webroot.sh на время rsync
# ставит флаг /run/bordur-deploy-in-progress. Кратковременная неконсистентность
# при выкладке — это не авария. Флаг старше DEPLOY_FLAG_MAX_AGE игнорируется,
# чтобы упавший деплой не заглушил алерты навсегда.
#
# Всегда завершается кодом 0: сломанный канал уведомлений не должен, в свою
# очередь, выглядеть как авария сервиса.

set -uo pipefail

URL="${SITE_URL:-https://xn----9sbjzjjobl1h5a.xn--p1ai/}"
MARKER="${SITE_MARKER:-АГ СТРОЙ}"
HOST_LABEL="$(hostname)"
ENV_FILE=/etc/bordur/alerts.env
STATE_DIR=/var/lib/bordur-watch
STATE_FILE="$STATE_DIR/state"          # up | down
FAILS_FILE="$STATE_DIR/fails"          # счётчик неудач подряд
CERT_FILE="$STATE_DIR/cert-warned"     # дата последнего предупреждения о сертификате
LOG_FILE=/var/log/bordur-watch.log
FAIL_THRESHOLD=2
CERT_WARN_DAYS=14
DEPLOY_FLAG=/run/bordur-deploy-in-progress
DEPLOY_FLAG_MAX_AGE=600

mkdir -p "$STATE_DIR"
[ -f "$ENV_FILE" ] && . "$ENV_FILE"

log() {
    local msg="$1"
    printf '%s  %s\n' "$(date -u '+%Y-%m-%d %H:%M:%S UTC')" "$msg" >>"$LOG_FILE" 2>/dev/null
    if [ -f "$LOG_FILE" ] && [ "$(wc -c <"$LOG_FILE" 2>/dev/null || echo 0)" -gt 1048576 ]; then
        mv -f "$LOG_FILE" "${LOG_FILE}.1"
    fi
}

push() {
    # $1 — заголовок, $2 — текст, $3 — приоритет, $4 — теги
    logger -t bordur-watch -p daemon.err "$1" 2>/dev/null || true
    [ -n "${NTFY_URL:-}" ] || { log "ntfy не настроен ($ENV_FILE), только локальный лог"; return; }
    if curl -fsS --connect-timeout 5 --max-time 10 \
        -H "Title: $1" -H "Priority: $3" -H "Tags: $4" \
        -d "$2" "$NTFY_URL" >/dev/null 2>&1; then
        log "ntfy отправлен: $1"
    else
        log "ntfy НЕ отправлен (недоступен?): $1"
    fi
}

# --- Идёт деплой? Тогда пропускаем проверку целиком ---
# Именно пропускаем, а не «проверяем, но молчим»: иначе состояние переключилось
# бы в down без уведомления, и после деплоя прилетело бы «снова работает» без
# предшествующего «упал».
if [ -f "$DEPLOY_FLAG" ]; then
    flag_age=$(( $(date +%s) - $(stat -c %Y "$DEPLOY_FLAG" 2>/dev/null || echo 0) ))
    if [ "$flag_age" -ge 0 ] && [ "$flag_age" -lt "$DEPLOY_FLAG_MAX_AGE" ]; then
        log "проверка пропущена — идёт деплой (${flag_age} c)"
        exit 0
    fi
    log "флаг деплоя протух (${flag_age} c) — проверяю как обычно"
fi

# --- Проверка сайта ---
body="$(mktemp)"
trap 'rm -f "$body"' EXIT
code="$(curl -sS -o "$body" -w '%{http_code}' --connect-timeout 10 --max-time 25 "$URL" 2>/dev/null || echo 000)"

problem=""
if [ "$code" != "200" ]; then
    problem="HTTP $code"
elif ! grep -qF "$MARKER" "$body" 2>/dev/null; then
    problem="ответ 200, но в теле нет маркера «$MARKER» (страница пустая или подменена)"
fi

prev="$(cat "$STATE_FILE" 2>/dev/null || echo up)"
fails="$(cat "$FAILS_FILE" 2>/dev/null || echo 0)"

if [ -n "$problem" ]; then
    fails=$((fails + 1))
    echo "$fails" >"$FAILS_FILE"
    log "проверка не прошла ($fails/$FAIL_THRESHOLD): $problem"
    if [ "$fails" -ge "$FAIL_THRESHOLD" ] && [ "$prev" != "down" ]; then
        echo down >"$STATE_FILE"
        push "🔴 Сайт недоступен — $HOST_LABEL" \
             "$URL
$problem
Проверок подряд: $fails
$(date -u '+%Y-%m-%d %H:%M:%S UTC')" \
             urgent rotating_light
    fi
else
    echo 0 >"$FAILS_FILE"
    if [ "$prev" = "down" ]; then
        echo up >"$STATE_FILE"
        push "🟢 Сайт снова работает — $HOST_LABEL" \
             "$URL отвечает 200
$(date -u '+%Y-%m-%d %H:%M:%S UTC')" \
             default white_check_mark
    else
        echo up >"$STATE_FILE"
    fi
fi

# --- Срок сертификата: предупреждаем раз в сутки, начиная за 14 дней ---
host="$(printf '%s' "$URL" | sed -E 's#^https?://##; s#/.*##')"
end="$(echo | openssl s_client -servername "$host" -connect "$host:443" 2>/dev/null \
        | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)"
if [ -n "$end" ]; then
    end_ts="$(date -d "$end" +%s 2>/dev/null || echo 0)"
    if [ "$end_ts" -gt 0 ]; then
        days=$(( (end_ts - $(date +%s)) / 86400 ))
        today="$(date -u +%F)"
        if [ "$days" -le "$CERT_WARN_DAYS" ] && [ "$(cat "$CERT_FILE" 2>/dev/null)" != "$today" ]; then
            echo "$today" >"$CERT_FILE"
            push "🟡 Сертификат истекает через $days дн. — $host" \
                 "Автопродление должно сработать само (certbot.timer).
Если этого не произошло: certbot renew" \
                 high warning
        fi
    fi
fi

exit 0
