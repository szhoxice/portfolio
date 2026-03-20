# Портфолио — Давид Миралиев

Статический сайт (HTML, CSS, JS). После включения **GitHub Pages** он доступен по ссылке:

**https://szhoxice.github.io/portfolio/**

## Как включить сайт на GitHub (один раз)

1. Зайди в репозиторий на GitHub: [github.com/szhoxice/portfolio](https://github.com/szhoxice/portfolio)
2. **Settings** → слева **Pages**
3. В блоке **Build and deployment**:
   - **Source**: *Deploy from a branch*
   - **Branch**: `main`, папка **`/ (root)`**
4. Сохрани. Через 1–2 минуты появится зелёное сообщение с адресом сайта.

Если репозиторий был **приватным**, в том же разделе **Pages** проверь, что для GitHub Pages разрешена публикация (для бесплатного аккаунта публичные Pages только с **public** репозиторием — сделай репозиторий общедоступным в **Settings → General → Danger zone**).

## Структура проекта

```
portfolio/
├── index.html          ← главная (открывается по ссылке github.io)
├── about.html, projects.html, skills.html, contact.html
├── css/styles.css
├── js/app.js, particles-bg.js
├── assets/images/      ← фото и обложки
├── .nojekyll           ← чтобы GitHub не обрабатывал сайт как Jekyll
└── README.md
```

## Локально

Открой `index.html` в браузере или запусти локальный сервер (Live Server) из корня папки проекта.

## Обновления на сайте

После `git push` в ветку `main` GitHub Pages сам подхватит изменения (обычно до минуты).
