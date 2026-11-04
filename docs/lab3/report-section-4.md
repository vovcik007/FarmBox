# 4. Репозиторій та емуляція релізів

Для навчального серверного компонента FarmBox створено TypeScript-сервіс із health endpoint, атомарним резервуванням у PostgreSQL та обробкою повторних запитів за idempotency key. Frontend і Android за архітектурним рішенням мають окремі репозиторії. Оплату і production-інфраструктуру не реалізовано.

Обрано GitHub Flow: стабільна `main` та короткоживучі гілки змін. `feature/stock-reservations` містила резервування, `hotfix/reservation-validation` — посилену валідацію, а `feature/idempotent-reservations` — захист від повторного списання. Результати зливалися через PR із merge commit після успішних `lint`, `typecheck`, `unit`, `integration` та `build` у GitHub Actions. Інший учасник не проводив незалежне review.

Для перевірених merge-комітів створено теги та GitHub Releases `v1.0.0`, `v1.0.1` і `v1.1.0`. Поки feature-гілка ідемпотентності залишалася незавершеною, hotfix було злито до `main`, потім `main` перенесено до feature-гілки окремим merge-комітом `9d26d67`. Результати підтверджують [таблиця релізів](release-history.md), [граф Git](git-graph.txt), [діаграма](git-graph.svg), посилання на PR та запуски Actions.

Локально Docker Compose та інтеграційний тест не запускалися через відсутність Docker/PostgreSQL; інтеграційні тести пройшли в ізольованому PostgreSQL service container GitHub Actions. Production deployment не виконано.
