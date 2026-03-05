#!/bin/bash

# Обновляем пакеты и ставим nginx
sudo apt update && sudo apt install nginx -y

# Копируем файлы сайта
sudo rm -rf /var/www/html/*
sudo cp -r ./* /var/www/html/

# Запускаем nginx
sudo systemctl enable nginx
sudo systemctl restart nginx

echo "Сайт запущен на http://$(curl -s ifconfig.me)"
