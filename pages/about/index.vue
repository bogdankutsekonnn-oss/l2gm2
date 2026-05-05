<template>
  <div class="about-page">
    <div class="page-wrapper">
      <Breadcrumbs />
      <div class="page-header">
        <h1>О нас</h1>
      </div>

      <div class="page-layout">
        <div class="servers-column">
          <div class="about-content">
            <section class="about-section">
              <h2>О проекте</h2>
              <p>
                L2GM — портал с анонсами и рейтингом серверов Lineage 2. Мы помогаем игрокам быстро находить
                подходящие проекты по хроникам, рейтам и дате старта, а владельцам серверов — получать внимание
                аудитории в самый важный момент: на открытии.
              </p>
              <p>
                Наша цель простая: чтобы на сайте была понятная, актуальная и проверяемая информация о стартах —
                без лишнего шума и «воды». Мы поддерживаем честные анонсы, следим за корректностью данных
                и делаем так, чтобы хороший проект не потерялся в ленте.
              </p>
              <p>
                Мы хотим, чтобы каждый игрок нашёл сервер «под себя», а каждый админ получил шанс собрать
                активный старт и стабильный онлайн.
              </p>
            </section>

            <section class="about-section">
              <h2>Для админов серверов:</h2>
              <p>
                Можно <NuxtLink to="/add-server/">добавить проект через форму</NuxtLink> и при необходимости
                <NuxtLink to="/placement/">выбрать VIP/Премиум размещение</NuxtLink>. А для
                игроков: меньше поиска по чатам — больше времени на старт.
              </p>
            </section>

            <section class="about-section">
              <h2>Обратная связь</h2>
              <div class="contact-cards">
                <a href="https://t.me/l2gm_official" target="_blank" rel="noopener" class="contact-card">
                  <span class="contact-card__icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="20" fill="#2F89CE"/>
                      <path d="M9.3507 20.3741L13.9488 22.0886L15.7413 27.8557C15.8192 28.2454 16.2868 28.3233 16.5985 28.0895L19.1703 25.9853C19.4041 25.7515 19.7938 25.7515 20.1055 25.9853L24.7036 29.3364C25.0154 29.5702 25.483 29.4144 25.5609 29.0247L28.99 12.6587C29.0679 12.269 28.6782 11.8793 28.2886 12.0352L9.3507 19.3609C8.8831 19.5168 8.8831 20.2182 9.3507 20.3741ZM15.5075 21.2313L24.5477 15.6981C24.7036 15.6201 24.8595 15.8539 24.7036 15.9319L17.2999 22.868C17.0661 23.1018 16.8323 23.4135 16.8323 23.8032L16.5985 25.6736C16.5985 25.9074 16.2089 25.9853 16.1309 25.6736L15.1957 22.2445C14.9619 21.8548 15.1178 21.3872 15.5075 21.2313Z" fill="white"/>
                    </svg>
                  </span>
                  <span class="contact-card__label">Telegram канал</span>
                </a>

                <a href="https://t.me/DamonLaptev" target="_blank" rel="noopener" class="contact-card">
                  <span class="contact-card__icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="20" fill="#229ED9"/>
                      <path d="M9.3507 20.3741L13.9488 22.0886L15.7413 27.8557C15.8192 28.2454 16.2868 28.3233 16.5985 28.0895L19.1703 25.9853C19.4041 25.7515 19.7938 25.7515 20.1055 25.9853L24.7036 29.3364C25.0154 29.5702 25.483 29.4144 25.5609 29.0247L28.99 12.6587C29.0679 12.269 28.6782 11.8793 28.2886 12.0352L9.3507 19.3609C8.8831 19.5168 8.8831 20.2182 9.3507 20.3741ZM15.5075 21.2313L24.5477 15.6981C24.7036 15.6201 24.8595 15.8539 24.7036 15.9319L17.2999 22.868C17.0661 23.1018 16.8323 23.4135 16.8323 23.8032L16.5985 25.6736C16.5985 25.9074 16.2089 25.9853 16.1309 25.6736L15.1957 22.2445C14.9619 21.8548 15.1178 21.3872 15.5075 21.2313Z" fill="white"/>
                    </svg>
                  </span>
                  <span class="contact-card__label">Написать лично</span>
                </a>

                <a href="mailto:info@l2gm.com" class="contact-card">
                  <span class="contact-card__icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="20" fill="#F59124"/>
                      <path d="M26.5808 14.1577C25.0116 12.7192 23.1154 12 20.7615 12C18.3423 12 16.25 12.7846 14.55 14.4192C12.85 16.0538 12 18.0808 12 20.5C12 22.8538 12.7846 24.8154 14.4192 26.5154C16.0539 28.2154 18.2116 29 21.0231 29C22.6577 29 24.2923 28.6731 25.9269 27.9538C26.45 27.7577 26.7115 27.1038 26.5154 26.5808C26.3192 26.0577 25.6654 25.7962 25.1423 25.9923C23.7692 26.5808 22.3962 26.9077 21.0885 26.9077C18.9962 26.9077 17.3615 26.2538 16.1846 24.9462C15.0077 23.6385 14.4192 22.1346 14.4192 20.4346C14.4192 18.5385 15.0731 16.9692 16.25 15.7269C17.4923 14.4846 18.9962 13.8308 20.8269 13.8308C22.4615 13.8308 23.9 14.3538 25.0769 15.4C26.2538 16.4462 26.7769 17.7538 26.7769 19.3231C26.7769 20.3692 26.5154 21.2846 25.9923 22.0038C25.4692 22.7231 24.9462 23.05 24.3577 23.05C24.0308 23.05 23.9 22.9192 23.9 22.5269C23.9 22.2654 23.9 21.9385 23.9654 21.6115L24.6192 16.3154H22.3962L22.2654 16.8385C21.6769 16.3808 21.0885 16.1192 20.4346 16.1192C19.3885 16.1192 18.4731 16.5769 17.6885 17.4269C16.9039 18.2769 16.5769 19.3885 16.5769 20.6962C16.5769 22.0038 16.9039 23.05 17.6231 23.9C18.2769 24.6846 19.1269 25.0769 20.0423 25.0769C20.8923 25.0769 21.6115 24.75 22.2 24.0308C22.6577 24.6846 23.3115 25.0769 24.2269 25.0769C25.5346 25.0769 26.6462 24.4885 27.6269 23.3769C28.6077 22.2654 29.0654 20.8923 29.0654 19.2577C28.8692 17.2962 28.0846 15.5308 26.5808 14.1577ZM21.4154 22.1346C21.0231 22.6577 20.5654 22.9192 19.9769 22.9192C19.5846 22.9192 19.3231 22.7231 19.0616 22.3308C18.8 21.9385 18.7346 21.4808 18.7346 20.8923C18.7346 20.1731 18.8654 19.5846 19.1923 19.1923C19.5192 18.7346 19.9116 18.5385 20.3692 18.5385C20.7616 18.5385 21.1538 18.6692 21.4808 19.0615C21.8077 19.3885 21.9385 19.8462 21.9385 20.3692C22.0039 21.0231 21.8077 21.6115 21.4154 22.1346Z" fill="white"/>
                    </svg>
                  </span>
                  <span class="contact-card__label">Почта</span>
                </a>

                <button type="button" class="contact-card contact-card--btn" @click="modalOpen = true">
                  <span class="contact-card__icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.33301 6.66671V30L11.333 24C11.9094 23.5661 12.6116 23.332 13.333 23.3334H26.6663C28.5073 23.3334 29.9997 21.841 29.9997 20V6.66671C29.9997 4.82576 28.5073 3.33337 26.6663 3.33337H6.66634C4.82539 3.33337 3.33301 4.82576 3.33301 6.66671ZM6.66634 23.3334V6.66671H26.6663V20H12.223C11.5015 19.9981 10.7991 20.2322 10.223 20.6667L6.66634 23.3334Z" fill="#5062F4"/>
                      <path d="M36.6663 36.6667V15C36.6663 13.1591 35.174 11.6667 33.333 11.6667V30L29.7763 27.3334C29.2003 26.8989 28.4979 26.6648 27.7763 26.6667H11.6663C11.6663 28.5077 13.1587 30 14.9997 30H26.6663C27.3878 29.9987 28.09 30.2328 28.6663 30.6667L36.6663 36.6667Z" fill="#5062F4"/>
                    </svg>
                  </span>
                  <span class="contact-card__label">Форма обратной связи</span>
                </button>
              </div>
            </section>
          </div>
        </div>

        <div class="filters-column">
          <FiltersPanel />
        </div>
      </div>

      <SeoSection
        title="L2GM — портал анонсов серверов Lineage 2"
        :text="seoText"
      />
    </div>
  </div>

  <!-- Попап с формой обратной связи -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal__header">
            <h2 id="modal-title">Форма обратной связи</h2>
            <button class="modal__close" @click="closeModal" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <form class="contact-form" @submit.prevent="submitContactForm">
            <div class="form-row">
              <div class="form-group">
                <label for="cf-name">Имя</label>
                <input
                  id="cf-name"
                  v-model="contactForm.name"
                  type="text"
                  placeholder="Ваше имя"
                  required
                  :disabled="isSubmitting"
                />
              </div>
              <div class="form-group">
                <label for="cf-reply">Контакт для ответа</label>
                <input
                  id="cf-reply"
                  v-model="contactForm.reply"
                  type="text"
                  placeholder="Telegram, email и т.д."
                  :disabled="isSubmitting"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="cf-message">Сообщение</label>
              <textarea
                id="cf-message"
                v-model="contactForm.message"
                placeholder="Ваше сообщение"
                rows="5"
                required
                :disabled="isSubmitting"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Отправляем...' : 'Отправить' }}
              </button>
              <Transition name="fade">
                <span v-if="submitStatus === 'success'" class="form-status form-status--success">
                  Сообщение отправлено!
                </span>
                <span v-else-if="submitStatus === 'error'" class="form-status form-status--error">
                  Ошибка отправки. Попробуйте позже.
                </span>
              </Transition>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const BOT_TOKEN = '8604308878:AAE2qkmF2jpKC94b_vsypBf7jc_l8NJh8SE'
const CHAT_ID = '649834807'

const modalOpen = ref(false)
const isSubmitting = ref(false)
const submitStatus = ref('')
const contactForm = ref({ name: '', reply: '', message: '' })

const closeModal = () => {
  modalOpen.value = false
  submitStatus.value = ''
}

const submitContactForm = async () => {
  isSubmitting.value = true
  submitStatus.value = ''

  const text = [
    '📩 *Сообщение с сайта (О нас)*',
    '',
    `*Имя:* ${contactForm.value.name}`,
    `*Контакт:* ${contactForm.value.reply || '—'}`,
    `*Сообщение:* ${contactForm.value.message}`,
  ].join('\n')

  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
    })
    if (res.ok) {
      submitStatus.value = 'success'
      contactForm.value = { name: '', reply: '', message: '' }
    } else {
      submitStatus.value = 'error'
    }
  } catch {
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

const { getCanonicalUrl, generateBreadcrumbJsonLd, generateOrganizationJsonLd } = useSeo()
const canonicalUrl = getCanonicalUrl('/about/')

const breadcrumbJsonLd = generateBreadcrumbJsonLd([
  { name: 'Главная', url: '/' },
  { name: 'О нас', url: '/about/' },
])
const orgJsonLd = generateOrganizationJsonLd()
const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'О нас | L2GM',
  description: 'L2GM - платформа для поиска серверов Lineage 2.',
  url: canonicalUrl,
  isPartOf: {
    '@type': 'WebSite',
    name: 'L2GM',
    url: 'https://l2gm.com',
  },
}

const seoText = `Каждый день десятки серверов Lineage 2 открывают свои двери, и разобраться в этом потоке бывает непросто. L2GM берёт на себя задачу структурировать информацию: мы проверяем данные, группируем проекты по датам и характеристикам и показываем только то, что действительно актуально.

Для игроков это экономия времени — не нужно мониторить форумы и чаты в поисках нового старта. Достаточно зайти на L2GM, выбрать нужные параметры и увидеть подборку проектов, которые открываются в ближайшее время. Календарь стартов, фильтрация по типу сервера и рейтинговая система помогают принять решение быстрее.

Для администраторов серверов L2GM — это возможность заявить о своём проекте целевой аудитории. Анонс попадает в общую ленту, индексируется поисковыми системами и становится доступен тысячам игроков, которые ищут новый сервер прямо сейчас.`

useHead({
  title: 'О нас | L2GM - анонсы серверов Lineage 2',
  meta: [
    {
      name: 'description',
      content: 'L2GM - платформа для поиска серверов Lineage 2. Актуальные анонсы, удобные фильтры, честная модерация. Размещение серверов для владельцев.'
    },
    { name: 'keywords', content: 'l2gm, о нас, lineage 2, анонсы серверов, размещение серверов, рейтинг серверов lineage 2, календарь стартов' },
    { property: 'og:title', content: 'О нас | L2GM' },
    { property: 'og:description', content: 'L2GM - платформа для поиска серверов Lineage 2. Актуальные анонсы, удобные фильтры, честная модерация.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'О нас | L2GM' },
    { name: 'twitter:description', content: 'L2GM - платформа для поиска серверов Lineage 2.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(orgJsonLd) },
    { type: 'application/ld+json', innerHTML: JSON.stringify(aboutJsonLd) },
  ],
})
</script>

<style scoped>
.about-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.about-section {
  background: #1B1D1F;
  border-radius: 8px;
  padding: var(--spacing-xl);
}

.about-section h2 {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.about-section p {
  color: var(--text-secondary);
  font-size: var(--font-base);
  line-height: 1.7;
  margin: 0;
}

.about-section p + p {
  margin-top: var(--spacing-md);
}

.about-section p a {
  color: var(--primary-main);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.about-section p a:hover {
  color: var(--primary-hover);
}

/* Contact cards */
.contact-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-md);
  background: #0F1113;
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: background 0.2s;
}

.contact-card--btn {
  border: none;
  cursor: pointer;
  width: 100%;
}

.contact-card:hover {
  background: rgba(255, 255, 255, 0.05);
}

.contact-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-card__label {
  color: var(--text-primary);
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  text-align: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.modal {
  background: #1B1D1F;
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  padding: var(--spacing-xl);
  position: relative;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.modal__header h2 {
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.modal__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: color 0.2s;
  flex-shrink: 0;
}

.modal__close:hover {
  color: var(--text-primary);
}

/* Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: var(--font-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
}

.form-group input,
.form-group textarea {
  background: #06080a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-base);
  color: var(--text-primary);
  font-size: var(--font-sm);
  padding: 10px 14px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  resize: vertical;
  color-scheme: dark;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-disabled);
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--primary-main);
}

.form-group input:disabled,
.form-group textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.btn-submit {
  background: var(--primary-main);
  color: #fff;
  border: none;
  border-radius: var(--radius-button);
  padding: 12px 28px;
  font-size: var(--font-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  font-family: inherit;
  white-space: nowrap;
}

.btn-submit:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-status {
  font-size: var(--font-sm);
}

.form-status--success {
  color: #4ade80;
}

.form-status--error {
  color: #f87171;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.95) translateY(8px);
}

/* Fade transition for status */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .contact-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 400px) {
  .contact-cards {
    grid-template-columns: 1fr;
  }
}
</style>
