# Скрипт для инициализации Git репозитория
# Выполните: .\init-git.ps1

Write-Host "Инициализация Git репозитория..." -ForegroundColor Green

# Инициализация репозитория
git init

# Добавление всех файлов
Write-Host "Добавление файлов в staging..." -ForegroundColor Green
git add .

# Первый коммит
Write-Host "Создание первого коммита..." -ForegroundColor Green
git commit -m "Initial commit: MVP L2Oops-clone SEO Platform

- Базовая структура Nuxt 3 проекта
- Компоненты (Header, Footer, ServerCard, FiltersPanel, TopBanner)
- Динамические SEO-страницы для фильтров
- Автогенерация страниц на основе данных
- Интеграция дизайн-системы
- Композаблы для фильтрации и SEO
- Данные в JSON формате"

Write-Host "Готово! Репозиторий инициализирован." -ForegroundColor Green
Write-Host "Для просмотра статуса выполните: git status" -ForegroundColor Yellow
