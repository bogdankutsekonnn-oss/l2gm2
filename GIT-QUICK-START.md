# Быстрый старт с Git

## Шаг 1: Откройте Git Bash или PowerShell

После установки Git откройте **Git Bash** (из меню Пуск) или перезапустите PowerShell/терминал.

## Шаг 2: Перейдите в папку проекта

```bash
cd d:\l2gm2
```

## Шаг 3: Инициализация репозитория

```bash
git init
```

## Шаг 4: Настройка пользователя (если еще не настроено)

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "your.email@example.com"
```

## Шаг 5: Добавление всех файлов

```bash
git add .
```

## Шаг 6: Первый коммит

```bash
git commit -m "Initial commit: MVP L2Oops-clone SEO Platform"
```

## Готово! ✅

Теперь ваш проект в Git. Проверить статус можно командой:

```bash
git status
```

## Если возникли проблемы с lock файлом

Если видите ошибку про `config.lock`:
1. Закройте все программы, которые могут использовать Git (VS Code, Cursor, другие терминалы)
2. Удалите файл `.git/config.lock` вручную (если существует)
3. Повторите команды

## Добавление на GitHub/GitLab (опционально)

1. Создайте новый репозиторий на GitHub/GitLab
2. Выполните:

```bash
git remote add origin https://github.com/yourusername/l2gm2.git
git branch -M main
git push -u origin main
```
