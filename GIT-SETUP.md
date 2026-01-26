# Инструкция по добавлению проекта в Git

## Быстрый старт

### Вариант 1: Использование скрипта (PowerShell)

```powershell
.\init-git.ps1
```

### Вариант 2: Ручная инициализация

```bash
# 1. Инициализация репозитория
git init

# 2. Добавление всех файлов
git add .

# 3. Создание первого коммита
git commit -m "Initial commit: MVP L2Oops-clone SEO Platform"
```

## Добавление удаленного репозитория (опционально)

Если у вас есть удаленный репозиторий на GitHub/GitLab:

```bash
# Добавление remote
git remote add origin https://github.com/yourusername/l2gm2.git

# Отправка кода
git branch -M main
git push -u origin main
```

## Проверка статуса

```bash
git status
```

## Просмотр истории коммитов

```bash
git log
```

## Игнорируемые файлы

Проект уже содержит `.gitignore` файл, который исключает:
- `node_modules/`
- `.nuxt/`
- `.output/`
- `.nitro/`
- `.cache/`
- `dist/`
- Логи и временные файлы

## Дополнительные команды

### Просмотр изменений перед коммитом
```bash
git diff
```

### Добавление конкретного файла
```bash
git add path/to/file
```

### Отмена изменений в файле
```bash
git restore path/to/file
```

### Создание новой ветки
```bash
git checkout -b feature/new-feature
```
