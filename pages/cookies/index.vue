<template>
  <LegalPage
    title="Файлы cookie"
    path="/cookies/"
    description="Какие файлы cookie использует L2GM, зачем они нужны и как изменить свой выбор."
  >
    <section class="about-section">
      <p class="legal-date">Редакция от 12.10.2026</p>
    </section>

    <section class="about-section">
      <h2>Что такое cookie</h2>
      <p>Cookie — небольшие файлы, которые сайт сохраняет в вашем браузере. Они нужны, чтобы сайт работал и запоминал ваши настройки.</p>
    </section>

    <section class="about-section">
      <h2>Какие cookie использует L2GM</h2>
      <div class="legal-table-wrap">
      <table>
      <thead>
      <tr><th>Тип</th><th>Зачем</th><th>Срок</th><th>Можно ли отказаться</th></tr>
      </thead>
      <tbody>
      <tr><td>Необходимые</td><td>Работа сайта, запоминание вашего выбора в cookie-баннере, вход администратора</td><td>Сессия или до 12 месяцев</td><td>Нет, без них сайт не работает</td></tr>
      <tr><td>Функциональные</td><td>Сохранение выбранных фильтров (версия игры, рейты)</td><td>До 12 месяцев</td><td>Да, в настройках браузера</td></tr>
      <tr><td>Аналитические</td><td>Статистика посещений через Яндекс.Метрику</td><td>До 12 месяцев</td><td>Да, в cookie-баннере</td></tr>
      </tbody>
      </table>
      </div>
    </section>

    <section class="about-section">
      <h2>Яндекс.Метрика</h2>
      <p>Сайт использует сервис Яндекс.Метрика (ООО «ЯНДЕКС»). Метрика загружается, только если вы нажали «Принять» в cookie-баннере. Сервис получает IP-адрес, сведения о браузере и устройстве, данные о просмотренных страницах и действиях на сайте. Условия обработки данных сервисом: <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer">https://yandex.ru/legal/confidential/</a></p>
      <p>Других сторонних сервисов аналитики и рекламных сетей на сайте нет. Шрифты загружаются с сервера L2GM.</p>
    </section>

    <section class="about-section">
      <h2>Как изменить выбор</h2>
      <ul>
      <li>Отозвать согласие на аналитические cookie можно по ссылке «Настройки cookie» в подвале сайта.</li>
      <li>Удалить или заблокировать cookie можно в настройках браузера. После блокировки необходимых cookie часть функций сайта может не работать.</li>
      </ul>
    </section>

    <section class="about-section">
      <h2>Контакты</h2>
      <p>Вопросы об использовании cookie: <a href="mailto:info@l2gm.com">info@l2gm.com</a></p>
      <p>Подробнее об обработке данных — в <NuxtLink to="/privacy/">Политике конфиденциальности</NuxtLink>.</p>
    </section>
  </LegalPage>
</template>
