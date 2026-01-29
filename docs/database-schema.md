# Database Schema для Supabase

## Таблица: servers

| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | Primary key |
| name | text | Название сервера |
| url | text | Ссылка на сервер |
| chronicle | text | Хроника (Interlude, C4, etc.) |
| rate | text | Рейт (x1, x100, etc.) |
| startDate | date | Дата открытия |
| cardType | text | Тип карточки (см. ниже) |
| icons | text[] | Платные иконки (см. ниже) |
| avatarUrl | text | Аватар сервера (круглая иконка) |
| ownerId | uuid | FK на users (владелец) |
| description | text | Описание сервера |
| createdAt | timestamp | Дата создания записи |
| expiresAt | timestamp | Дата окончания размещения |

### Типы карточек (cardType)

| Значение | Описание | Цена |
|----------|----------|------|
| `basic` | Обычная карточка (бесплатно) | - |
| `vip` | VIP карточка (чёрный фон, белая рамка) | $ |
| `vip-plus` | VIP+ карточка (градиент рамка) | $$ |
| `premium` | Премиум карточка (розовый градиент фон) | $$$ |

### Платные иконки (icons)

| Значение | Описание | Иконка |
|----------|----------|--------|
| `recommended` | Рекомендуем (от нас) | 👍 палец вверх |
| `hot-start` | Горячий старт (для новых) | 🔥 огонь |
| `bonus-start` | Бонус к старту | 🎁 подарок |
| `obt` | ОБТ (открытый бета-тест) | ⚙️ шестерёнка |

## Таблица: users (владельцы серверов)

| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | Primary key (Supabase Auth) |
| email | text | Email |
| name | text | Имя |
| balance | decimal | Баланс для оплаты услуг |
| createdAt | timestamp | Дата регистрации |

## Таблица: orders (заказы на рекламу)

| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | Primary key |
| userId | uuid | FK на users |
| serverId | uuid | FK на servers |
| type | text | banner_top / banner_side / premium / vip |
| amount | decimal | Сумма |
| status | text | pending / paid / active / expired |
| startsAt | timestamp | Начало размещения |
| expiresAt | timestamp | Конец размещения |
| createdAt | timestamp | Дата создания |

## Таблица: banners (баннеры)

| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | Primary key |
| orderId | uuid | FK на orders |
| position | text | top / sidebar |
| imageUrl | text | URL изображения |
| targetUrl | text | Ссылка при клике |
| isActive | boolean | Активен ли |
| clicks | integer | Счетчик кликов |
| views | integer | Счетчик показов |

## SQL для создания таблиц (Supabase)

```sql
-- Серверы
CREATE TABLE servers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  chronicle TEXT NOT NULL,
  rate TEXT NOT NULL,
  start_date DATE NOT NULL,
  status TEXT CHECK (status IN ('premium', 'vip', 'top')),
  badges TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id),
  banner_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Индексы для быстрого поиска
CREATE INDEX idx_servers_chronicle ON servers(chronicle);
CREATE INDEX idx_servers_status ON servers(status);
CREATE INDEX idx_servers_start_date ON servers(start_date);
CREATE INDEX idx_servers_owner ON servers(owner_id);

-- RLS (Row Level Security)
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Все могут читать серверы
CREATE POLICY "Servers are viewable by everyone"
  ON servers FOR SELECT
  USING (true);

-- Владельцы могут редактировать свои серверы
CREATE POLICY "Users can update own servers"
  ON servers FOR UPDATE
  USING (auth.uid() = owner_id);
```

## Миграция с JSON на Supabase

1. Создать проект на supabase.com
2. Выполнить SQL выше
3. Импортировать данные из servers.json
4. В `composables/useServers.js` изменить `DATA_SOURCE = 'supabase'`
5. Раскомментировать Supabase код
