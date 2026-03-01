<template>
  <div class="add-server-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>Добавить сервер Lineage 2</h1>
      </div>

      <!-- Кнопка фильтров (только мобильный) -->
      <button class="filters-mobile-btn" @click="filtersOpen = true">
        <span>Фильтры</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.7657 2.25C18.5589 2.25 19.2311 2.24837 19.7588 2.32032C20.3051 2.3948 20.8277 2.56278 21.2276 3.00293C21.6309 3.44696 21.7406 3.98232 21.7491 4.5293C21.7572 5.05251 21.6714 5.70577 21.5733 6.46875C21.5396 6.73048 21.4891 6.98386 21.3838 7.23731C21.2769 7.49462 21.1297 7.71384 20.9463 7.93164C19.9666 9.09554 18.145 11.1988 15.5811 13.1143C15.5397 13.1453 15.4875 13.2191 15.4776 13.3291C15.2292 16.0745 14.9991 17.5956 14.8516 18.3828C14.6802 19.2969 13.9734 19.9345 13.3721 20.3701C13.0561 20.599 12.7217 20.8045 12.4258 20.9844C12.1183 21.1714 11.8643 21.3237 11.6592 21.4688C11.1143 21.8541 10.4884 21.81 10.0215 21.5381C9.57904 21.2803 9.25185 20.8088 9.18754 20.2656C9.05017 19.1052 8.79283 16.7563 8.51176 13.3223C8.50264 13.2123 8.45014 13.1378 8.40825 13.1064C5.84963 11.1935 4.03206 9.09402 3.05375 7.93164C2.87044 7.71384 2.72318 7.4946 2.61625 7.23731C2.51097 6.98387 2.46048 6.73047 2.4268 6.46875C2.32865 5.70577 2.24292 5.05251 2.25102 4.5293C2.25949 3.98232 2.36918 3.44696 2.7725 3.00293C3.17236 2.56278 3.69501 2.3948 4.24125 2.32032C4.76897 2.24837 5.44118 2.25 6.23442 2.25H17.7657ZM6.23442 3.75C5.39762 3.75 4.84701 3.75179 4.44438 3.80664C4.06028 3.85901 3.94392 3.9445 3.88285 4.01172C3.82532 4.07511 3.7557 4.18717 3.75004 4.55274C3.74404 4.94235 3.81006 5.46852 3.9141 6.27735C3.93942 6.47409 3.96764 6.58063 4.00102 6.66114C4.03289 6.73785 4.08485 6.82757 4.20121 6.96582C5.15951 8.10442 6.88867 10.0975 9.30668 11.9053C9.71951 12.2139 9.96553 12.6955 10.0069 13.2002L10.211 15.5566C10.4072 17.7068 10.5763 19.2325 10.6778 20.0898C10.681 20.1165 10.6918 20.1473 10.712 20.1777C10.7327 20.2089 10.7569 20.2308 10.7764 20.2422C10.7801 20.2444 10.7835 20.2459 10.7862 20.2471C10.7879 20.246 10.7906 20.2458 10.793 20.2441L11.21 19.9697C11.3554 19.8789 11.504 19.7888 11.6465 19.7022C11.9433 19.5217 12.2307 19.3447 12.4922 19.1553C13.0456 18.7544 13.3193 18.4136 13.377 18.1064L13.4942 17.4141C13.6264 16.5669 13.7992 15.2301 13.9834 13.1934C14.0287 12.6945 14.2742 12.2191 14.6836 11.9131C17.1066 10.103 18.8393 8.10585 19.7989 6.96582C19.9152 6.82757 19.9672 6.73784 19.9991 6.66114C20.0324 6.58064 20.0607 6.4741 20.086 6.27735C20.19 5.46852 20.256 4.94235 20.25 4.55274C20.2444 4.18717 20.1748 4.07511 20.1172 4.01172C20.0562 3.9445 19.9398 3.85901 19.5557 3.80664C19.1531 3.75179 18.6025 3.75 17.7657 3.75H6.23442Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div class="page-layout">
        <div class="servers-column">
          <!-- Верхние блоки: правила + кнопка -->
          <div class="form-top-blocks">
            <!-- Правила публикации -->
            <div class="info-block">
              <h3 class="info-block__title">Правила публикации</h3>
              <ul class="info-block__list">
                <li>Все новые заявки проходят ручную модерацию.</li>
                <li>
                  Перед добавлением сервера разместите нашу кнопку на главной
                  странице сайта сервера.
                </li>
                <li>
                  Не удаляйте кнопку и не меняйте её код на всём сроке
                  размещения.
                </li>
                <li>
                  Для платного размещения кнопка не обязательна —
                  <NuxtLink to="/placement" class="info-block__link"
                    >подробнее о тарифах</NuxtLink
                  >.
                </li>
                <li>
                  Администрация может отклонить публикацию без комментариев
                  (например, при нарушении правил или некорректных данных).
                </li>
              </ul>
            </div>

            <!-- Кнопка для сайта -->
            <div class="info-block">
              <h3 class="info-block__title">Кнопка для сайта сервера</h3>
              <p class="info-block__desc">
                Скопируйте HTML-код и вставьте перед закрывающим тегом
                &lt;/body&gt; или в нужный блок шаблона.
              </p>
              <div class="site-button-preview">
                <a
                  href="https://l2gm.com/"
                  target="_blank"
                  class="site-button-link"
                >
                  <img
                    src="/logo.svg"
                    alt="L2GM — Новые сервера Lineage 2"
                    class="site-button-img"
                  />
                </a>
                <span class="site-button-preview__hint"
                  >Так будет выглядеть кнопка на вашем сайте</span
                >
              </div>
              <div class="site-button-code" @click="selectCode">
                <code ref="codeBlock">{{ siteButtonCode }}</code>
              </div>
              <button class="btn-copy" @click="copyButtonCode">
                <svg
                  v-if="!copied"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="9"
                    y="9"
                    width="13"
                    height="13"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                </svg>
                <svg
                  v-else
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ copied ? 'Скопировано!' : 'Копировать код' }}
              </button>
            </div>
          </div>

          <!-- Форма -->
          <form class="add-server-form" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">1</span>
                <label class="form-row__label">Название сервера</label>
              </div>
              <div class="form-row__input">
                <input
                  v-model="form.serverName"
                  type="text"
                  class="input"
                  placeholder="Например: MyServer"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">2</span>
                <label class="form-row__label">Сайт сервера</label>
              </div>
              <div class="form-row__input">
                <input
                  v-model="form.serverUrl"
                  type="url"
                  class="input"
                  placeholder="Например: https://my.server.com/"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">3</span>
                <label class="form-row__label">Дата открытия</label>
              </div>
              <div class="form-row__input">
                <input v-model="form.serverDate" type="date" class="input" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">4</span>
                <label class="form-row__label">Хроники</label>
              </div>
              <div class="form-row__input">
                <select v-model="form.serverChronicle" class="select">
                  <option value="">Выбрать хроники</option>
                  <option
                    v-for="chronicle in chronicles"
                    :key="chronicle.id"
                    :value="chronicle.name"
                  >
                    {{ chronicle.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">5</span>
                <label class="form-row__label">Рейты</label>
              </div>
              <div class="form-row__input">
                <input
                  v-model="form.serverRate"
                  type="text"
                  class="input"
                  placeholder="Числом или RVR / GVE"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">6</span>
                <label class="form-row__label">Тариф</label>
              </div>
              <div class="form-row__chips">
                <button
                  v-for="tariff in tariffs"
                  :key="tariff.id"
                  type="button"
                  :class="[
                    'chip',
                    { 'chip--active': form.tariff === tariff.id },
                  ]"
                  @click="form.tariff = tariff.id"
                >
                  <img
                    v-if="tariff.icon"
                    :src="tariff.icon"
                    :alt="tariff.name"
                    class="chip__icon"
                  />
                  {{ tariff.name }}
                </button>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">7</span>
                <label class="form-row__label">Тип сервера</label>
              </div>
              <div class="form-row__chips">
                <button
                  v-for="type in serverTypes"
                  :key="type.id"
                  type="button"
                  :class="[
                    'chip',
                    { 'chip--active': form.serverTypes.includes(type.id) },
                  ]"
                  @click="toggleChip(form.serverTypes, type.id)"
                >
                  {{ type.name }}
                </button>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">8</span>
                <label class="form-row__label">Дополнительно</label>
              </div>
              <div class="form-row__chips">
                <button
                  v-for="extra in extras"
                  :key="extra.id"
                  type="button"
                  :class="[
                    'chip',
                    { 'chip--active': form.extras.includes(extra.id) },
                  ]"
                  @click="toggleChip(form.extras, extra.id)"
                >
                  <img :src="extra.icon" :alt="extra.name" class="chip__icon" />
                  {{ extra.name }}
                </button>
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">9</span>
                <label class="form-row__label">Email</label>
              </div>
              <div class="form-row__input">
                <input
                  v-model="form.serverEmail"
                  type="email"
                  class="input"
                  placeholder="example@gmail.com"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-row__header">
                <span class="form-row__num">10</span>
                <label class="form-row__label">Контакты</label>
              </div>
              <div class="form-row__input">
                <input
                  v-model="form.contacts"
                  type="text"
                  class="input"
                  placeholder="Telegram / VK / Whats'app"
                />
              </div>
            </div>

            <!-- Превью карточки -->
            <div class="card-preview">
              <div class="card-preview__label">Превью карточки</div>
              <div class="card-preview__wrap">
                <ServerCard :server="previewServer" />
              </div>
            </div>

            <button type="submit" class="btn-primary btn-submit">
              Добавить сервер
            </button>
          </form>

          <!-- FAQ -->
          <div class="faq-section">
            <h2 class="faq-section__title">Часто задаваемые вопросы</h2>
            <div class="faq-list">
              <div
                v-for="(item, index) in faqItems"
                :key="index"
                :class="['faq-item', { 'faq-item--open': openFaq === index }]"
              >
                <button class="faq-item__header" @click="toggleFaq(index)">
                  <span class="faq-item__question">{{ item.question }}</span>
                  <span class="faq-item__icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 4V20"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4 12H20"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <Transition name="faq-expand">
                  <div v-if="openFaq === index" class="faq-item__body">
                    <p>{{ item.answer }}</p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>

        <!-- Десктопная колонка фильтров -->
        <div class="filters-column">
          <FiltersPanel />
        </div>

        <!-- Мобильный drawer -->
        <Teleport to="body">
          <Transition name="drawer">
            <div
              v-if="filtersOpen"
              class="filters-drawer-overlay"
              @click.self="filtersOpen = false"
            >
              <div class="filters-drawer">
                <div class="filters-drawer__header">
                  <span>Фильтры</span>
                  <button
                    class="filters-drawer__close"
                    @click="filtersOpen = false"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                </div>
                <div class="filters-drawer__body">
                  <FiltersPanel />
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>
      </div>

      <!-- SEO -->
      <SeoSection title="Добавить сервер Lineage 2 на L2GM" :text="seoText" />
    </div>
  </div>
</template>

<script setup>
import { calculateExpiresAt } from '~/utils/dateUtils'

const { getChronicles } = useFilters()

const chronicles = getChronicles()
const filtersOpen = ref(false)
const copied = ref(false)

const codeBlock = ref(null)

const siteButtonCode = `<a href="https://l2gm.com/" target="_blank" rel="noopener" title="L2GM — Новые сервера Lineage 2" style="display:inline-block"><img src="https://l2gm.com/button.png" alt="L2GM — Новые сервера Lineage 2" width="189" height="59" style="border:0" /></a>`

const copyButtonCode = async () => {
  try {
    await navigator.clipboard.writeText(siteButtonCode)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = false
  }
}

const selectCode = () => {
  if (codeBlock.value) {
    const range = document.createRange()
    range.selectNodeContents(codeBlock.value)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

const tariffs = [
  { id: 'free', name: 'Бесплатный', icon: null },
  { id: 'premium', name: 'Premium', icon: '/images/status/premium.png' },
  { id: 'vip', name: 'VIP', icon: '/images/status/vip.png' },
  {
    id: 'vip-standard',
    name: 'VIP Стандартный',
    icon: '/images/status/vip.png',
  },
]

const serverTypes = [
  { id: 'rvr', name: 'RVR' },
  { id: 'gve', name: 'GVE' },
  { id: 'low-rate', name: 'Лоу рейты' },
  { id: 'mid-rate', name: 'Мид рейты' },
  { id: 'multicraft', name: 'Мультикрафт' },
  { id: 'multiprof', name: 'Мультипрофа' },
]

const extras = [
  { id: 'obt', name: 'ОБТ', icon: '/images/badges/obt.png' },
  {
    id: 'bonus-start',
    name: 'Бонус-старт',
    icon: '/images/badges/bonus-start.png',
  },
  {
    id: 'hot-start',
    name: 'Горячий старт',
    icon: '/images/badges/hot-start.png',
  },
  {
    id: 'recommended',
    name: 'Рекомендуем',
    icon: '/images/badges/recommended.png',
  },
]

const form = reactive({
  serverUrl: '',
  serverName: '',
  serverRate: '',
  serverChronicle: '',
  serverDate: '',
  serverEmail: '',
  contacts: '',
  tariff: 'free',
  serverTypes: [],
  extras: [],
})

const toggleChip = (arr, id) => {
  const idx = arr.indexOf(id)
  if (idx === -1) arr.push(id)
  else arr.splice(idx, 1)
}

// Маппинг тарифа в cardType для превью
const tariffToCardType = {
  free: 'basic',
  premium: 'premium',
  vip: 'vip',
  'vip-standard': 'top',
}

// Иконки из extras для превью
const previewIcons = computed(() =>
  form.extras.filter((e) =>
    ['obt', 'bonus-start', 'hot-start', 'recommended'].includes(e),
  ),
)

const previewServer = computed(() => ({
  id: 0,
  name: form.serverName || 'SERVER NAME',
  url: form.serverUrl || '#',
  chronicle: form.serverChronicle || 'INTERLUDE+',
  rate: form.serverRate || '100K',
  startDate: form.serverDate || new Date().toISOString().slice(0, 10),
  cardType: tariffToCardType[form.tariff] || 'basic',
  icons: previewIcons.value,
}))

const handleSubmit = () => {
  const today = new Date().toISOString().slice(0, 10)
  const cardType = tariffToCardType[form.tariff] || 'basic'

  const serverData = {
    name: form.serverName,
    url: form.serverUrl,
    chronicle: form.serverChronicle,
    rate: form.serverRate,
    startDate: form.serverDate,
    cardType,
    icons: previewIcons.value,
    avatarUrl: null,
    ownerId: null,
    description: null,
    createdAt: today,
    expiresAt: calculateExpiresAt(today, cardType),
    email: form.serverEmail,
    contacts: form.contacts,
    serverTypes: form.serverTypes,
  }

  // TODO: отправить serverData на API когда подключим Supabase
  if (import.meta.client) {
    sessionStorage.setItem('pendingServer', JSON.stringify(serverData))
  }

  navigateTo('/thanks')
}

// FAQ
const openFaq = ref(null)

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}

const faqItems = [
  {
    question: 'Сколько стоит размещение сервера на L2GM?',
    answer:
      'Базовое размещение бесплатно — достаточно разместить нашу кнопку на сайте вашего сервера. Также доступны платные тарифы (Premium, VIP), которые дают приоритетное расположение в списке и выделенное оформление карточки. Подробнее о тарифах можно узнать на странице рекламы.',
  },
  {
    question: 'Как быстро сервер появится в списке после добавления?',
    answer:
      'Все заявки проходят ручную модерацию. Обычно проверка занимает от нескольких часов до одного рабочего дня. После одобрения сервер сразу появится в каталоге. Убедитесь, что все поля заполнены корректно и кнопка размещена на вашем сайте — это ускорит процесс.',
  },
  {
    question: 'Что будет, если я удалю кнопку с сайта сервера?',
    answer:
      'Для бесплатного тарифа наличие кнопки обязательно на весь срок размещения. Если кнопка будет удалена или её код изменён, сервер может быть снят с публикации без предупреждения. Для платных тарифов размещение кнопки не требуется.',
  },
  {
    question: 'Можно ли изменить данные сервера после добавления?',
    answer:
      'Да, вы можете обратиться в администрацию через контакты, указанные на сайте, и запросить изменение информации о сервере — например, обновить дату открытия, хроники или рейты. Изменения будут внесены после проверки.',
  },
  {
    question: 'Что даёт платное размещение?',
    answer:
      'Платные тарифы обеспечивают приоритетную позицию в списке серверов, выделенное оформление карточки (Premium или VIP-дизайн) и дополнительную видимость для игроков. Это значительно увеличивает количество переходов на сайт вашего сервера.',
  },
  {
    question: 'По какой причине могут отклонить заявку?',
    answer:
      'Заявка может быть отклонена, если указаны некорректные данные, сайт сервера недоступен, кнопка не размещена (для бесплатного тарифа) или сервер нарушает общие правила площадки. Администрация оставляет за собой право отклонить публикацию без комментариев.',
  },
]

// SEO
const seoText = `Разместить сервер Lineage 2 на L2GM — это простой и эффективный способ привлечь новых игроков. Наш каталог ежедневно посещают тысячи пользователей, которые ищут свежие серверы для игры. Добавление занимает всего пару минут: заполните форму, укажите основные параметры и отправьте заявку на модерацию.

L2GM поддерживает все популярные хроники — от Interlude и High Five до Essence и Classic. Независимо от типа вашего сервера, будь то PvP, крафт или RvR, вы найдёте свою аудиторию среди наших посетителей. Удобные фильтры помогают игрокам быстро находить серверы по хроникам, рейтам и дате открытия.

Для владельцев серверов доступны бесплатные и платные тарифы размещения. Бесплатный тариф требует установки кнопки на сайт сервера. Платные тарифы Premium и VIP дают приоритетное расположение и выделенный дизайн карточки, что значительно повышает видимость и количество переходов.`

useHead({
  title: 'Добавить сервер Lineage 2 - L2GM',
  meta: [
    {
      name: 'description',
      content:
        'Добавьте свой сервер Lineage 2 на наш сайт. Размещение серверов всех хроник и рейтов.',
    },
  ],
})
</script>

<style scoped>
.add-server-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: 0;
}

/* Кнопка фильтров — только мобильный */
.filters-mobile-btn {
  display: none;
}

/* Верхние блоки */
.form-top-blocks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.info-block {
  background: #1b1d1f;
  border-radius: var(--radius-base);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.info-block__title {
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
}

.info-block__list {
  margin: 0;
  padding-left: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-block__list li {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.info-block__link {
  color: var(--primary-main);
  text-decoration: none;
}

.info-block__link:hover {
  text-decoration: underline;
}

.info-block__desc {
  font-size: var(--font-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

.site-button-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.site-button-preview__hint {
  font-size: 11px;
  color: var(--text-disabled);
}

.site-button-link {
  display: inline-block;
  border-radius: 4px;
  overflow: hidden;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.site-button-link:hover {
  opacity: 0.85;
}

.site-button-img {
  height: 28px;
  width: auto;
  display: block;
}

.site-button-code {
  background: #06080a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  padding: 6px 10px;
  overflow-x: auto;
  cursor: pointer;
  transition: border-color 0.2s;
  max-height: 52px;
}

.site-button-code:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

.site-button-code code {
  font-size: 10px;
  color: var(--text-disabled);
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
  line-height: 1.5;
  user-select: all;
}

.btn-copy {
  margin-top: var(--spacing-sm);
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--primary-main);
  color: var(--primary-contrast);
  border: none;
  border-radius: var(--radius-button);
  padding: 8px 16px;
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-copy:hover {
  background: var(--primary-hover);
}

/* Форма */
.add-server-form {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: 56px 160px 1fr;
  align-items: center;
  min-height: 52px;
  gap: 0 var(--spacing-md);
}

.form-row__num {
  width: 36px;
  height: 36px;
  background: #1b1d1f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-sm);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  flex-shrink: 0;
  justify-self: center; /* на десктопе центрирует в grid-колонке */
}

/* На десктопе header — это просто display: contents, чтоб num и label остались в grid */
.form-row__header {
  display: contents;
}

.form-row__label {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.form-row__input {
  /* наследует grid-column автоматически */
}

.form-row__input .input,
.form-row__input .select {
  width: 100%;
  background: #06080a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-base);
  padding: 10px 14px;
  font-size: var(--font-sm);
  color: var(--text-primary);
  font-family: inherit;
  outline: none;
  box-shadow: none;
  color-scheme: dark;
  transition: border-color 0.2s;
}

.form-row__input .input:focus,
.form-row__input .select:focus {
  border-color: var(--primary-main);
}

.form-row__input .select option {
  background: #1a1c1e;
  color: var(--text-primary);
}

.form-row__input .input::placeholder {
  color: var(--text-disabled);
}

.form-row__input .select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url('/images/arrow-down.svg');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
  cursor: pointer;
}

.form-row__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: 6px 0;
  align-items: center;
}

/* Чипы */
.chip {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: var(--secondary-main);
  color: var(--text-secondary);
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-sm);
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  white-space: nowrap;
}

.chip:hover {
  background: var(--secondary-hover);
  color: var(--text-primary);
}

.chip--active {
  background: var(--primary-main);
  color: var(--primary-contrast);
}

.chip--active:hover {
  background: var(--primary-hover);
}

.chip__icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

/* Превью карточки */
.card-preview {
  margin: var(--spacing-md) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.card-preview__wrap {
  width: 50%;
}

@media (max-width: 1024px) {
  .card-preview__wrap {
    width: 100%;
  }

  .card-preview {
    margin: var(--spacing-md) 0 0 0;
  }
}

.card-preview__label {
  font-size: var(--font-sm);
  color: var(--text-disabled);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Кнопка сабмита */
.btn-submit {
  margin: var(--spacing-md);
  width: calc(100% - 32px);
}

/* Drawer overlay */
.filters-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.filters-drawer {
  width: 100%;
  max-height: 85dvh;
  background: var(--bg-surface);
  border-radius: 16px 16px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.filters-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: var(--font-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  flex-shrink: 0;
}

.filters-drawer__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-base);
  transition: color 0.2s;
}

.filters-drawer__close:hover {
  color: var(--text-primary);
}

.filters-drawer__body {
  overflow-y: auto;
  padding: 16px 20px 32px;
}

/* Анимация drawer */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-active .filters-drawer,
.drawer-leave-active .filters-drawer {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .filters-drawer,
.drawer-leave-to .filters-drawer {
  transform: translateY(100%);
}

@media (max-width: 1024px) {
  .filters-mobile-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 20px;
    background: var(--secondary-main);
    color: var(--secondary-contrast);
    border: none;
    border-radius: var(--radius-button);
    font-size: var(--font-base);
    font-weight: var(--font-semibold);
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s;
    margin: 16px;
    width: calc(100% - 32px);
  }

  .filters-mobile-btn:hover {
    background: var(--secondary-hover);
  }

  .form-top-blocks {
    grid-template-columns: 1fr;
  }

  .form-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 8px 0;
  }

  .form-row__header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing-sm);
  }

  .form-row__input,
  .form-row__chips {
    width: 100%;
  }
}

/* FAQ */
.faq-section {
  margin-top: var(--spacing-md);
}

.faq-section__title {
  font-size: var(--font-h2);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  padding: var(--spacing-lg);
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.faq-item {
  background: #06080a;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.faq-item__header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.2s;
}

.faq-item:not(.faq-item--open) .faq-item__header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.faq-item__question {
  font-size: var(--font-lg);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  line-height: 1.4;
}

.faq-item__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.faq-item--open .faq-item__icon {
  transform: rotate(45deg);
}

.faq-item__body {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

.faq-item__body p {
  margin: 0;
  font-size: var(--font-base);
  color: var(--text-secondary);
  line-height: 1.7;
}

/* FAQ анимация */
.faq-expand-enter-active,
.faq-expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.faq-expand-enter-from,
.faq-expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.faq-expand-enter-to,
.faq-expand-leave-from {
  opacity: 1;
  max-height: 200px;
}

@media (max-width: 1024px) {
  .faq-section__title {
    font-size: 20px;
    padding: 16px;
  }

  .faq-item__header {
    padding: 16px;
  }

  .faq-item__question {
    font-size: var(--font-base);
  }

  .faq-item__body {
    padding: 0 16px 16px;
  }
}
</style>
