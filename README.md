# FarmBox backend: навчальна демонстрація

Цей репозиторій демонструє серверний компонент FarmBox для лабораторної роботи №3. Вебінтерфейс та Android-застосунок кур’єра за архітектурним рішенням мають окремі репозиторії та аналогічний GitHub Flow. Це не готова продуктова система.

Потрібні Node.js з `.nvmrc`, npm та PostgreSQL. Встановлення: `npm ci`; перевірки: `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run test:integration`, `npm run build`. Для інтеграційного тесту задайте `DATABASE_URL` до ізольованої тестової бази. Запуск `npm start`; стан: `GET /health`.

Локальний запуск із Docker: `docker compose up --build`. Значення у `.env.example` демонстраційні.
