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
                Можно <NuxtLink to="/add-server">добавить проект через форму</NuxtLink> и при необходимости
                <NuxtLink to="/placement">выбрать VIP/Премиум размещение</NuxtLink>. А для
                игроков: меньше поиска по чатам — больше времени на старт.
              </p>
            </section>

            <section class="about-section">
              <h2>Обратная связь</h2>
              <div class="contact-cards">
                <a href="https://t.me/DamonLaptev" target="_blank" rel="noopener" class="contact-card">
                  <span class="contact-card__icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="20" fill="#2F89CE"/>
                      <path d="M9.3507 20.3741L13.9488 22.0886L15.7413 27.8557C15.8192 28.2454 16.2868 28.3233 16.5985 28.0895L19.1703 25.9853C19.4041 25.7515 19.7938 25.7515 20.1055 25.9853L24.7036 29.3364C25.0154 29.5702 25.483 29.4144 25.5609 29.0247L28.99 12.6587C29.0679 12.269 28.6782 11.8793 28.2886 12.0352L9.3507 19.3609C8.8831 19.5168 8.8831 20.2182 9.3507 20.3741ZM15.5075 21.2313L24.5477 15.6981C24.7036 15.6201 24.8595 15.8539 24.7036 15.9319L17.2999 22.868C17.0661 23.1018 16.8323 23.4135 16.8323 23.8032L16.5985 25.6736C16.5985 25.9074 16.2089 25.9853 16.1309 25.6736L15.1957 22.2445C14.9619 21.8548 15.1178 21.3872 15.5075 21.2313Z" fill="white"/>
                    </svg>
                  </span>
                  <span class="contact-card__label">Telegram</span>
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

                <NuxtLink to="/feedback" class="contact-card">
                  <span class="contact-card__icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.33301 6.66671V30L11.333 24C11.9094 23.5661 12.6116 23.332 13.333 23.3334H26.6663C28.5073 23.3334 29.9997 21.841 29.9997 20V6.66671C29.9997 4.82576 28.5073 3.33337 26.6663 3.33337H6.66634C4.82539 3.33337 3.33301 4.82576 3.33301 6.66671ZM6.66634 23.3334V6.66671H26.6663V20H12.223C11.5015 19.9981 10.7991 20.2322 10.223 20.6667L6.66634 23.3334Z" fill="#5062F4"/>
                      <path d="M36.6663 36.6667V15C36.6663 13.1591 35.174 11.6667 33.333 11.6667V30L29.7763 27.3334C29.2003 26.8989 28.4979 26.6648 27.7763 26.6667H11.6663C11.6663 28.5077 13.1587 30 14.9997 30H26.6663C27.3878 29.9987 28.09 30.2328 28.6663 30.6667L36.6663 36.6667Z" fill="#5062F4"/>
                    </svg>
                  </span>
                  <span class="contact-card__label">Форма обратной связи</span>
                </NuxtLink>
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
</template>

<script setup>
const { getCanonicalUrl } = useSeo()
const canonicalUrl = getCanonicalUrl('/about')

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
    // Open Graph
    { property: 'og:title', content: 'О нас | L2GM' },
    { property: 'og:description', content: 'L2GM - платформа для поиска серверов Lineage 2. Актуальные анонсы, удобные фильтры, честная модерация.' },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'L2GM' },
    // Twitter
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'О нас | L2GM' },
    { name: 'twitter:description', content: 'L2GM - платформа для поиска серверов Lineage 2.' },
  ],
  link: [{ rel: 'canonical', href: canonicalUrl }],
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
  grid-template-columns: repeat(3, 1fr);
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

@media (max-width: 640px) {
  .contact-cards {
    grid-template-columns: 1fr;
  }
}
</style>
