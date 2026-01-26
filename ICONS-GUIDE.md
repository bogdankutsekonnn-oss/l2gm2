# Руководство по замене иконок в ServerCard

## 🎯 Где находятся иконки

Иконки бейджей находятся в компоненте **`components/ServerCard.vue`** в функции `getBadgeIcon()`.

## 🔧 Способы замены иконок

### Вариант 1: Использовать изображения (SVG/PNG)

1. **Создайте папку для иконок:**
   ```
   public/
   └── images/
       └── badges/
           ├── recommended.svg
           ├── hot-start.svg
           └── bonus-start.svg
   ```

2. **Обновите функцию `getBadgeIcon` в `ServerCard.vue`:**
   
   Найдите функцию и замените на:
   ```javascript
   const getBadgeIcon = (badge) => {
     return h('img', {
       src: `/images/badges/${badge}.svg`,
       alt: badgeText(badge),
       width: 16,
       height: 16,
       style: 'display: block;'
     })
   }
   ```

3. **Разместите ваши SVG/PNG файлы** в папку `public/images/badges/`

### Вариант 2: Использовать встроенные SVG

Текущий вариант - SVG встроены прямо в код. Откройте `components/ServerCard.vue` и найдите функцию `getBadgeIcon()`:

```javascript
const getBadgeIcon = (badge) => {
  const iconMap = {
    'recommended': () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, [
      // Замените path на ваш SVG код
      h('path', { d: 'ВАШ_SVG_PATH', fill: 'currentColor' })
    ]),
    'hot-start': () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, [
      h('path', { d: 'ВАШ_SVG_PATH', fill: 'currentColor' })
    ]),
    'bonus-start': () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, [
      h('path', { d: 'ВАШ_SVG_PATH', fill: 'currentColor' })
    ])
  }
  
  return iconMap[badge] || (() => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16' }, [
    h('circle', { cx: 8, cy: 8, r: 6, fill: 'currentColor' })
  ]))
}
```

**Как получить SVG код:**
1. Откройте ваш SVG файл в текстовом редакторе
2. Скопируйте содержимое `<path>` или других элементов
3. Вставьте в `d` атрибут

### Вариант 3: Использовать Emoji или символы

```javascript
const getBadgeIcon = (badge) => {
  const iconMap = {
    'recommended': '⭐',
    'hot-start': '🔥',
    'bonus-start': '🎁'
  }
  
  return () => h('span', { style: 'font-size: 16px; line-height: 1;' }, iconMap[badge] || '•')
}
```

### Вариант 4: Использовать библиотеку иконок (Iconify)

1. **Установите пакет:**
   ```bash
   npm install @iconify/vue
   ```

2. **Импортируйте в компонент:**
   ```javascript
   import { Icon } from '@iconify/vue'
   ```

3. **Используйте:**
   ```javascript
   const getBadgeIcon = (badge) => {
     const iconMap = {
       'recommended': 'mdi:star',
       'hot-start': 'mdi:fire',
       'bonus-start': 'mdi:gift'
     }
     
     return () => h(Icon, { 
       icon: iconMap[badge] || 'mdi:circle',
       width: 16,
       height: 16
     })
   }
   ```

## 📝 Текущие иконки

В компоненте используются иконки для:
- **recommended** - "Рекомендуем" (звезда)
- **hot-start** - "Горячий старт" (звезда + точка)
- **bonus-start** - "Бонус старт" (круг)

## 🎨 Размеры иконок

- **Размер:** 16x16px
- **Цвет:** `currentColor` (наследуется от `.badge-icon`)
- **Текущий цвет:** `var(--status-warning)` (желтый)

## 🔍 Где изменить цвет иконок

В `components/ServerCard.vue` найдите:

```css
.badge-icon {
  width: 16px;
  height: 16px;
  color: var(--status-warning); /* Измените здесь */
  cursor: help;
}
```

## ✅ Быстрая замена

### Заменить на изображения:

1. Создайте `public/images/badges/`
2. Поместите туда файлы: `recommended.svg`, `hot-start.svg`, `bonus-start.svg`
3. В `ServerCard.vue` замените функцию `getBadgeIcon`:

```javascript
const getBadgeIcon = (badge) => {
  return h('img', {
    src: `/images/badges/${badge}.svg`,
    alt: badgeText(badge),
    width: 16,
    height: 16
  })
}
```

### Заменить на Emoji:

```javascript
const getBadgeIcon = (badge) => {
  const emojiMap = {
    'recommended': '⭐',
    'hot-start': '🔥',
    'bonus-start': '🎁'
  }
  return () => h('span', { 
    style: 'font-size: 16px; line-height: 1; display: inline-block;' 
  }, emojiMap[badge] || '•')
}
```

## 💡 Рекомендации

1. **Используйте SVG** для лучшего качества и масштабирования
2. **Размер 16x16px** оптимален для карточек
3. **Используйте `currentColor`** для наследования цвета из CSS
4. **Проверяйте на разных размерах экрана**

## 🚀 Пример полной замены

Если у вас есть готовые SVG файлы:

1. Поместите их в `public/images/badges/`
2. Откройте `components/ServerCard.vue`
3. Найдите функцию `getBadgeIcon`
4. Замените на:

```javascript
const getBadgeIcon = (badge) => {
  // Используем изображения из public
  return h('img', {
    src: `/images/badges/${badge}.svg`,
    alt: badgeText(badge),
    width: 16,
    height: 16,
    style: 'display: block; object-fit: contain;'
  })
}
```

Готово! Иконки будут загружаться из папки `public/images/badges/`.
