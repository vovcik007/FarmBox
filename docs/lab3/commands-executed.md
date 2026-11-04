# Фактичні команди й операції

Нижче скорочений журнал змістовних операцій; номери PR та SHA фактичні. Перевірки запускалися з portable Node.js 26.13.0. `gh` відсутній, тому PR і злиття виконувалися через підключення GitHub, а Releases — через GitHub REST API з Git Credential Manager. Токен до файлів не записувався.

```text
git clone https://github.com/vovcik007/FarmBox.git FarmBox
git config --local user.name vovcik007
git config --local user.email <наданий користувачем email>
git add .
git commit -m "chore: initialize FarmBox backend demo"
git push -u origin main                         # перша спроба не пройшла: автентифікація
git switch -c feature/stock-reservations
npm run lint; npm run typecheck; npm run test:unit; npm run build
git worktree add -b docs/lab3-guidance ../FarmBox-docs main
git add docs                                   # у документаційній робочій копії
git commit -m "docs: describe branching and deployment plan"
git push -u origin main                         # виконав користувач після входу
git add README.md src/app.ts src/server.ts src/reservations.ts tests/integration/database.test.ts tests/unit/health.test.ts
git commit -m "feat: add atomic stock reservations"
git push -u origin feature/stock-reservations
GitHub API: створено PR #1; CI успішний; merge commit 50f5b76
git fetch origin
git switch main
git merge --ff-only origin/main
git push origin --delete feature/stock-reservations
CI main 50f5b76: успішний
git tag -a v1.0.0 -m "FarmBox backend demo v1.0.0"
git push origin v1.0.0
GitHub REST API: створено Release v1.0.0
git switch -c feature/idempotent-reservations
git add src/reservations.ts
git commit -m "feat: prepare idempotent reservation handling"
git push -u origin feature/idempotent-reservations
git switch -c hotfix/reservation-validation main
npm run lint; npm run typecheck; npm run test:unit; npm run build
git add src/app.ts src/reservations.ts tests/unit/health.test.ts
git commit -m "fix: strengthen reservation input validation"
git push -u origin hotfix/reservation-validation
GitHub API: створено PR #2; CI успішний; merge commit e3c12d9
git fetch origin
git switch main
git merge --ff-only origin/main
git push origin --delete hotfix/reservation-validation
git switch feature/idempotent-reservations
git merge --no-edit origin/main                 # merge commit 9d26d67
CI main e3c12d9: успішний
git tag -a v1.0.1 e3c12d96198f55a6fc00a311d9cdbf13b0312c16 -m "FarmBox backend demo v1.0.1"
git push origin v1.0.1
GitHub REST API: створено Release v1.0.1
npm run lint; npm run typecheck; npm run test:unit; npm run build
git add README.md src/app.ts src/reservations.ts tests/integration/database.test.ts
git commit -m "feat: complete idempotent reservations"
git push origin feature/idempotent-reservations
GitHub API: створено PR #3
git add tests/integration/database.test.ts
git commit -m "test: cover concurrent and rejected reservation retries"
git push origin feature/idempotent-reservations
GitHub API: CI для c6d4f1a успішний; PR #3 злито merge-комітом 0b6bb9c
git fetch origin
git switch main
git merge --ff-only origin/main
git push origin --delete feature/idempotent-reservations
git merge --no-edit main                       # у документаційній копії
CI main 0b6bb9c: успішний
git tag -a v1.1.0 0b6bb9cb30bb8f9d9061ca1f3cc7af0fbd2d24fc -m "FarmBox backend demo v1.1.0"
git push origin v1.1.0
GitHub REST API: створено Release v1.1.0
git log --graph --oneline --decorate --all --date-order
git add docs                                  # у документаційній робочій копії
git commit -m "docs: record lab evidence and release graph"
git push -u origin docs/lab3-guidance         # з основної робочої копії
GitHub API: створено PR #4
git switch -c feature/runnable-build-artifact
git add .github/workflows/ci.yml
git commit -m "ci: package and smoke test runnable artifact"
git push -u origin feature/runnable-build-artifact
GitHub API: створено PR #5
GitHub API: CI успішний; PR #4 злито merge-комітом 39f61d9
git fetch origin
git merge --no-edit origin/main               # оновлення feature-гілки документацією
git push origin feature/runnable-build-artifact
git push origin --delete docs/lab3-guidance
GitHub API: CI успішний; PR #5 злито merge-комітом d95c816
git fetch origin
git switch main
git merge --ff-only origin/main
git push origin --delete feature/runnable-build-artifact
git switch -c docs/final-evidence
```

Усі п’ять CI jobs виконувалися у GitHub Actions, включно з PostgreSQL service container. Локальний integration та Docker Compose не запускалися: Docker/PostgreSQL на комп’ютері відсутні. Точний стан graph-файлу — момент його генерації; пізніші документаційні коміти до нього фізично не входять.

[PR #4](https://github.com/vovcik007/FarmBox/pull/4) додає документацію. [PR #5](https://github.com/vovcik007/FarmBox/pull/5) пакує production-залежності разом зі збіркою і перевіряє запуск розпакованого артефакту в [CI](https://github.com/vovcik007/FarmBox/actions/runs/41798297025). Ці зміни виконані після трьох демонстраційних релізів і не змінюють їхніх тегів.
