# Фактична історія релізів

| Етап | Гілка | PR | Merge SHA | Тег | Зміст зміни | CI коміту в main |
|---|---|---|---|---|---|---|
| Резервування | `feature/stock-reservations` | [#1](https://github.com/vovcik007/FarmBox/pull/1) | `50f5b763c05eaf7475809612a199e489b50b93c5` | [v1.0.0](https://github.com/vovcik007/FarmBox/releases/tag/v1.0.0) | Атомарне списання запасу | [успішний](https://github.com/vovcik007/FarmBox/actions/runs/41796350705) |
| Hotfix | `hotfix/reservation-validation` | [#2](https://github.com/vovcik007/FarmBox/pull/2) | `e3c12d96198f55a6fc00a311d9cdbf13b0312c16` | [v1.0.1](https://github.com/vovcik007/FarmBox/releases/tag/v1.0.1) | Валідація ідентифікатора товару | [успішний](https://github.com/vovcik007/FarmBox/actions/runs/41796816654) |
| Ідемпотентність | `feature/idempotent-reservations` | [#3](https://github.com/vovcik007/FarmBox/pull/3) | `0b6bb9cb30bb8f9d9061ca1f3cc7af0fbd2d24fc` | [v1.1.0](https://github.com/vovcik007/FarmBox/releases/tag/v1.1.0) | Повтори і конкурентні запити | [успішний](https://github.com/vovcik007/FarmBox/actions/runs/41797469532) |

Перевірки PR: [#1](https://github.com/vovcik007/FarmBox/actions/runs/41796228847), [#2](https://github.com/vovcik007/FarmBox/actions/runs/41796723981), [#3](https://github.com/vovcik007/FarmBox/actions/runs/41797311282). Гілку hotfix включено до незавершеної feature-гілки merge-комітом `9d26d67`. Історичні назви гілок на діаграмі не є чинними віддаленими refs. Незалежного review не було.
