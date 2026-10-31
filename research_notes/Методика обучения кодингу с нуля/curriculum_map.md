# Карта основной программы Tomorrow School (Астана) после Go Piscine: проекты, концепции, аудит

> Собрано 31.10.2026. Главный источник: публичный конфиг кампуса `https://01.tomorrow-school.ai/api/object/astanahub` (JSON 1,27 МБ) и тексты заданий и аудитов, которые платформа школы отдаёт без входа по путям из этого конфига (`/api/content/root/01-edu_ai-module/content/<проект>/README.md` и `.../audit/README.md`). Для сравнения взяты классические версии из `github.com/01-edu/public`.
> Сокращения: **AR** = `requiredAuditRatio` (минимальный аудит-ратио, чтобы начать проект); **XP** = `baseXp`; «группа» = `groupMin–groupMax`; «аудиторов» = поле `required` у валидации `user_audit`.
> Единицы времени в конфиге — минуты (проверка: `eventDuration` модуля 1 051 920 мин = 730,5 суток ≈ 2 года).

## 1. Какова реальная структура и порядок программы школы (конфиг astanahub)?

### Takeaway
Нурс учится не в классическом «div-01», а в отдельном модуле **AI-Curriculum** (`/astanahub/ai-curriculum`). В центре модуля стоит Checkpoint-экзамен, вход — Prompt Piscine. Дальше идёт Go-ветка «Imperative»: go-refresh → symbol-* → tour-* → path-flow → discuss-*, а рядом внешняя дуга: git, tetris-fit, teller-system на C, swap-sort, folder-scan, net-link. После неё — «AI Full-Stack» (Piscine JS, затем Python), «AI Core Tech» (Piscine AI), а также «Mathematics» и «Employability». **Rust и классического Full-Stack JS в его модуле нет**: они есть только в старом модуле `Module`, где учатся прошлые потоки.

### Cited Findings

**Верхний уровень конфига**
- У кампуса `astanahub` пять дочерних объектов: Onboarding, Piscine Go, `Module` (160 объектов без порядкового индекса — старая программа), `AI-Curriculum` (70 объектов с индексами 0–68) и Sign up. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- go-refresh, ethical-ai и prompt-basics есть только в AI-Curriculum. В `Module` вместо них стоят классические go-reloaded, ascii-art и т. д. Значит, Нурс (его первые проекты — go-refresh, ethical-ai, prompt-basics) учится в AI-Curriculum. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- В 01-edu/public переименованных проектов нет: запросы `subjects/go-refresh`, `symbol-art`, `tour-track`, `path-flow`, `discuss-hub`, `swap-sort`, `ethical-ai`, `prompt-basics` дают 404, а `ascii-art-web` и `lem-in` — 200. Задания AI-модуля живут только на платформе школы. — [01-edu/public subjects](https://github.com/01-edu/public/tree/master/subjects)

**Граф AI-Curriculum (атрибут `graph`)**
- Центр (`centralPoint`) — `checkpoint`. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- **Сектор 1 «Imperative»**, вход (`entryPoint`) — `prompt-piscine`.
  - Внутренняя дуга: go-refresh → symbol-art {symbol-invert, symbol-color, symbol-output, symbol-fs, symbol-justify} → symbol-web {symbol-web-stylize, symbol-web-dockerize, symbol-web-export} → tour-track {tour-filters, tour-geo, tour-visuals, tour-search} → path-flow → discuss-hub {discuss-auth, discuss-upload, discuss-security, discuss-moderation, discuss-plus}.
  - Внешняя дуга: git, tetris-fit, teller-system, swap-sort, folder-scan, net-link.
  — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- **Сектор 2 «AI Full-Stack»**, вход — `piscine-js`. Внутренняя дуга: checkpoint-js, piscine-python, scan-sense, vision-classify, doc-genius, flow-lang, product-discovery. Внешняя: market-lab, brain-check, watch-flow, cart-zone. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- **Сектор 3 «AI Core Tech»**, вход — `piscine-ai`. Внутренняя дуга: kaggle-titanic, nlp-scraper, matrix-factorization, spectral-learning, vision-track, doc-classify, ai-pong, triton-deploy. Внешняя: emotions-detector, sp500-strategies, credit-scoring. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Средний круг «Mathematics»: linear-model, picture-perfect, digit-detect, grade-tree, neuro-genesis, cluster-garden, binary-guard, matrix-match, sudoku-solver, evo-sim. Внешний круг «Employability»: building-resume, personal-branding, networking-practices, market-exploration, interview-practices. — [config](https://01.tomorrow-school.ai/api/object/astanahub)

**Ветка Imperative: атрибуты проектов** (все данные — из [config](https://01.tomorrow-school.ai/api/object/astanahub))

| # | Проект (школа) | Классическое имя 01-edu | Группа | XP | AR | Аудиторов | Что открывает проект (`requirements`) |
|---|---|---|---|---|---|---|---|
| 1 | Prompt Piscine (9 квестов) | — | 1 | 22 500 | 0–0,5 | 2–3 | `admin_selection` |
| 2 | go-refresh (обязательный) | go-reloaded | 1 | 5 000 | 0 | 5 | ничего |
| 3 | symbol-art (обязательный) | ascii-art | 2–3 | 6 125 | 0,5 | 5 | go-refresh + prompt-piscine; go≥20, algo≥10 |
| 4–8 | symbol-invert / -color / -output / -fs / -justify | ascii-art-reverse / -color / -output / -fs / -justify | 2–3 | по 6 125 | 0,5 | 5 (у symbol-output 2) | symbol-art; go≥25 |
| 9 | symbol-web (обязательный) | ascii-art-web | 2–3 | 9 200 | 0,5 | 5 | symbol-art; go≥25 |
| 10–12 | symbol-web-stylize / -dockerize / -export | ascii-art-web-stylize / -dockerize / -export-file | 2–3 | по 9 200 | 0,5 | 5 | symbol-web; front-end≥10 (stylize) или back-end≥10 (dockerize, export) |
| 13 | tour-track (обязательный) | groupie-tracker | 2–3 | 24 500 | 0,5 | 5 | symbol-web; go≥35, back-end≥15, front-end≥20 |
| 14–17 | tour-filters / -geo / -visuals / -search | groupie-tracker-filters / -geolocalization / -visualizations / -search-bar | 2–3 | по 12 250 | 0,5 | 5 | tour-track; go≥35 |
| 18 | path-flow (обязательный) | lem-in | **3–4** | 34 375 | 0,5 | 5 | tour-track; go≥35, **unix≥15** |
| 19 | discuss-hub (обязательный) | forum | **4–5** | 76 250 | 0,5 | 5 | path-flow; go≥40, docker≥10, back-end≥15, front-end≥30 |
| 20–24 | discuss-auth / -upload / -security / -moderation / -plus | forum-authentication / -image-upload / -security / -moderation / -advanced-features | 4–5 | по 19 100 | 0,5 | 5 | discuss-hub; go≥45, back-end≥35 (у upload ещё front-end≥40, у security ещё sys-admin≥5; у plus вместо этого back-end≥45 и front-end≥42) |
| 25 | git | git | 1 | 5 000 | 0,5 | 5 | go-refresh; prog≥10 |
| 26 | tetris-fit | tetris-optimizer | 1 | 5 000 | 0,5 | 5 | prog≥20 |
| 27 | teller-system (**язык C**) | atm-management-system | 1 | **75 250** | 0,5 | 5 | prog≥10 |
| 28 | swap-sort | push-swap | 2–3 | 18 375 | 0,5 | 5 | prog≥20 |
| 29 | folder-scan | my-ls-1 | 2–3 | 12 250 | 0,5 | 5 | algo≥30, prog≥30 |
| 30 | net-link | net-cat | 2–3 | 12 250 | 0,5 | 5 | prog≥50 |

**Какие навыки выдаёт каждый проект (`baseSkills`)**
- go-refresh: ai 10, go 20, algo 15. symbol-art: ai 12, go 25, algo 20. symbol-web: ai 14, go 35, html 10, back-end 10, front-end 10. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- stylize: css 10, html 15, front-end 20. dockerize: docker 10, back-end 15. export: back-end 20. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- tour-track: go 35, html 25, back-end 10, front-end 25. tour-filters: go 36, front-end 30. tour-geo: back-end 15. tour-visuals: front-end 35. tour-search: go 38. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- path-flow: go 40, algo 35. discuss-hub: go 45, sql 25, docker 15, back-end 35, front-end 40, sys-admin 5. discuss-auth: back-end 45. discuss-upload: front-end 42. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- tetris-fit и swap-sort: algo 35. folder-scan и net-link: unix 15. Других источников `unix` в AI-Curriculum нет. — [config](https://01.tomorrow-school.ai/api/object/astanahub)

**Чекпоинт-экзамен и навык `prog`**
- Навык `prog` дают только упражнения чекпоинта. Их 61, и они разбиты на уровни: 5 (onlya…onlyb), 10 (rectperimeter…retainfirsthalf), 20 (digitlen…longestword), 35 (cameltosnakecase…passwordentropy), 50 (concatalternate…canjump), 65 (notdecimal, slice, fifthandskip, revconcatalternate), 75 (wordflip, revwstr, rostring, findpairs), 85 (options, romannumbers, piglatin, itoabase), 95 (rpncalc, brackets), 100 (grouping, brainfuck). — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Параметры чекпоинта: `eventDuration` 180 мин (3 часа), `registrationDuration` 2 160 мин, `maxGroup` 10, `expectedXp` 2 750. Упражнения проверяет автомат (`"type":"tester"`, образ `ghcr.io/01-edu/module-go`) со списком разрешённых функций. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Примеры ограничений по функциям: onlya — `z01.PrintRune` + builtin; wdmatch, hiddenp, union, revwstr, rostring, piglatin — `os.Args` + `z01.PrintRune`; fprime — `strconv.Atoi`, `os.Args`, `fmt.*`; rpncalc, brackets — `strconv.Atoi`, `os.*`, `fmt.*`, `strings.Split`; passwordentropy — `math.Log2`, `unicode.*`; printrevcomb запрещает трёхзначные литералы (`--no-lit=\d{3},`). — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- 57 из 61 упражнения уже были в чекпоинтах Piscine Go. Новых четыре: countrepeats и wordanatomy, longestword (уровень 20) и passwordentropy (уровень 35). — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Что просят новые упражнения:
  - countrepeats — RLE-сжатие (`AAABBC` → `A3B2C`); — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/countrepeats/README.md)
  - longestword — самое длинное «валидное» слово с Unicode-буквами; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/longestword/README.md)
  - passwordentropy — энтропия `E = L·log₂(P)`; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/passwordentropy/README.md)
  - wordanatomy — первый подходящий префикс и суффикс. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/wordanatomy/README.md)
- В модуле есть и `checkpoint-js` для сектора AI Full-Stack: 31 упражнение (js-factorial … js-trap-object), 180 минут. — [config](https://01.tomorrow-school.ai/api/object/astanahub)

**Уровни, ранги, темп**
- `levelsDefinitions`: уровень 10 требует prog≥10, 20 — prog≥20, 30 — prog≥30, 40 — prog≥40, 50 — prog≥50. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Ранги: Aspiring developer (0, «Passed the piscine») → Beginner (10) → Apprentice (20) → Assistant (30) → Basic (40) → Junior (50) → Confirmed (55) → Full-Stack developer (60). — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- `timeline` по месяцам (minLevel / expectedLevel / checkpointLevel): м2 5/7/0; м3 6/10/0; м4 9/13/0; м5 12/17/10; м6 15/18/20; м7 17/20/20; м8 20/23/30; м10 28/34/30; м11 33/38/40; м13 37/41/40; м18 50/62/50. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Темы в `timeline`:
  - месяц 2 — «Imperative programming, Structured programming, Algorithms (basics), Go…, network and security (basics)»;
  - месяц 7 — «Event-driven programming, … HTML, CSS, JavaScript & Node.js, Backend programming in Go & JS…»;
  - месяц 13 — «… Mathematics for AI … Algorithms (advanced)».
  — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Prompt Piscine:
  - `eventDuration` 25 920 мин (18 суток);
  - 9 квестов-проектов с `startDay` 1–9 и `duration` 1;
  - XP по квестам: 500 / 650 / 650 / 800 / 800 / 800 / 950 / 950 / 950;
  - работа соло, аудиторов 2 (у creative-ai 3);
  - AR: 0 у ethical-ai, 0,5 у остальных.
  — [config](https://01.tomorrow-school.ai/api/object/astanahub)

**Следующие пиcцины**
- Piscine JS: квесты data, loop, find, рейд crossword, time, call-me-maybe, dom, рейд sortable, object, async, рейд clonernews, node. Рейды проверяет администратор (`admin_audit`). Открывается после discuss-hub и prog≥50. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Piscine Python: python-basics, control-flow, advanced-flow, data-handling, string-files, numpy-pandas, apis-json, python-oop. Открывается после Piscine JS. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Piscine AI: numpy, pandas, visualizations, data-wrangling, time-series, рейд backtesting-sp500, linear-regression, classification, pipeline, training, model-selection, рейд forest-prediction, neural-networks, keras, keras-2, nlp, nlp-spacy. Открывается после product-discovery и prog≥50. — [config](https://01.tomorrow-school.ai/api/object/astanahub)

**Старый модуль `Module` (для сравнения)**
- Сектор «GO»: checkpoint-zero, go-reloaded, ascii-art {color, output, fs, justify, reverse}, ascii-art-web {stylize, dockerize, exportfile}, groupie-tracker {…}, lem-in, forum {…}, filevault. Внешняя дуга: git, tetris-optimizer, atm-management-system, push-swap, my-ls-1, net-cat. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Дальше в `Module` идут AdminSys, Full-Stack (вход piscine-js), AI (вход piscine-ai-1), **Architecture (вход piscine-rust)**, Algorithm и Java Full-Stack. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Группы в старой версии другие: lem-in — ровно 2, forum — 1–4 (`required` 10). — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Проект ascii-art-web-dockerize, который Нурс сейчас аудирует, лежит в `Module` (`/astanahub/module/dockerize`, группа 2–3, AR 0,5, нужен ascii-art-web и go≥35). Его задание берётся из `01-edu_module` — то есть он аудирует студента старой программы. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- Контекст: статья Astana Hub «Tomorrow School: Launch of the Kazakhstan's First Artificial Intelligence School» датирована 9 октября 2024. — [Astana Hub](https://astanahub.com/en/article/tomorrow-school-otkrytie-pervoi-shkoly-iskusstvennogo-intellekta-v-kazakhstane)

### Inferences

**Реальная цепочка доступа к проектам** (вывод из `requirements` + `baseSkills`). Предполагаю, что навык равен максимуму, а не сумме: значения навыков растут ступенями (go 20 → 25 → 35 → 40 → 45), а уровни prog 5…100 устроены как ярусы.
- **tour-track** не откроется после одного symbol-web. Нужны front-end≥20 (даёт только stylize) и back-end≥15 (dockerize, export или tour-geo). Значит, stylize и dockerize/export — фактически обязательные.
- **path-flow** требует unix≥15. Его дают только folder-scan или net-link из внешней дуги.
  - folder-scan требует algo≥30: это tetris-fit или swap-sort (algo 35, symbol-art даёт только 20). Ещё нужен prog≥30, то есть сдать на чекпоинте упражнение уровня 35+.
  - Самый короткий путь к path-flow: чекпоинт уровня 20 → tetris-fit (соло) → чекпоинт уровня 35 → folder-scan → path-flow.
  - Другой путь: чекпоинт уровня 50 → net-link.
- **discuss-hub** требует docker≥10 (dockerize) и front-end≥30 (tour-filters или tour-visuals). **discuss-plus** требует back-end 45 (discuss-auth) и front-end 42 (discuss-upload).
- **Чекпоинты — главный ограничитель.** Без них закрыты вся внешняя дуга, Piscine JS (prog≥50) и рост уровня выше 10/20/30/40/50 (`levelsDefinitions`). Значение `checkpointLevel` в timeline (10 к 5-му месяцу, 20 к 6-му, 30 к 8-му, 40 к 11-му, 50 к 18-му) похоже на ожидаемый ярус prog на этот месяц. Подготовка к чекпоинту — постоянная линия рядом с проектами, а не разовое событие.
- **Ранние доступные проекты.** После первого упражнения уровня 10 сразу открываются git (соло) и **teller-system на C** (соло, 75 250 XP — больше, чем у tour-track). Для teller-system нужны основы C: `fopen`/`fgets`/`sscanf`/`fprintf`, структуры, Makefile.
- **Размер команд растёт:** соло (go-refresh) → 2–3 (symbol, tour) → 3–4 (path-flow) → 4–5 (discuss). Командный git-процесс (ветки, merge, конфликты) нужен уже с symbol-art.
- **Обязательный минимум ветки** (`mandatory`): go-refresh, symbol-art, symbol-web, tour-track, path-flow, discuss-hub. Остальное — по выбору, но, как показано выше, часть из них фактически нужна для навыков.

### Gaps
- Публично не описано, что означают поля валидации `required` (5 / 2 / 3), `ratio`, `delay` (4 320 / 20 160 мин), `maxGroup` у чекпоинта и `cooldown` у тестера. Трактовки выше — мои.
- Не подтверждено, считается ли навык максимумом или суммой. Вся «реальная цепочка» держится на допущении «максимум».
- Неизвестно, приводит ли `minLevel` из timeline к отчислению. Сроков на отдельные проекты в конфиге нет: `duration` есть только у квестов пиcцин.
- Неизвестно, сколько упражнений даёт один чекпоинт и как растёт сложность внутри экзамена (`maxGroup: 10` не объяснён).

## 2. Что просит каждый проект, какие концепции нужны, что проверяет аудит, типичные ловушки

### Takeaway
Все 29 проектов Go-ветки — это классические проекты 01-edu (go-reloaded, ascii-art*, groupie-tracker*, lem-in, forum*, push-swap, my-ls, net-cat, tetris-optimizer, atm-management-system) под новыми именами. К каждому добавлены три вещи:
1. **Обязательная «AI-функция».** Почти везде это правило «посчитать → формула → таблица порогов → метка, проценты с 2 знаками». В symbol-web, stylize и swap-sort это настоящий вызов LLM с обязательным mock-режимом.
2. **Жёсткие инженерные требования:** пакеты в `internal/`, юнит-тесты (`go test ./...`), папки `samples/` и `testdata/`, разделы README, `go fmt`.
3. **Устный блок в аудите** «Play the Role of a Stakeholder»: объяснить свой код без подсказки и предсказать вывод после живой правки.

### Cited Findings

#### go-refresh (≈ go-reloaded; соло; сейчас в работе)
- **Что делает программа.** `go run . sample.txt result.txt` читает файл, применяет правила и пишет результат:
  - `(hex)`, `(bin)` — заменить предыдущее слово на десятичное число;
  - `(up)`, `(low)`, `(cap)` и вариант `(… , N)` — изменить регистр предыдущего слова или N слов (`cap` = первая буква заглавная, остальные строчные);
  - знаки `.,!?:;` прижать к предыдущему слову; группы `...` и `!?` не разбивать;
  - парные `'` прижать к первому и последнему слову внутри;
  - `a`/`A` → `an`/`An` перед гласной **или любой `h`**: только целое слово, регистр сохраняется.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/README.md)
- **Порядок применения правил задан:** сначала теги (и их удаление), потом пробелы у пунктуации, потом артикли. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/README.md)
- **Обязательный флаг `--lang`.**
  - Считает целые слова без учёта регистра: английские `the, and, of, to, is, in, you, it, that` и французские `le, la, les, de, et, un, une, est, dans, vous`. Буквы `é è à ç ô î û` считаются французским сигналом.
  - Печатает в stdout ровно одну строку: `Language: English (X%)`, `Language: French (X%)` или `Language: Unknown`, где `X = round(max·100/total)`. При равенстве побеждает English.
  - Файл с результатом пишется всегда.
  - Пример из задания: `the menu is in the café and the prices are à la carte` → `Language: English (67%)`.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/README.md)
- **Бонус `--keywords`:** топ-5 слов по шаблону `[a-z0-9']`, со списком стоп-слов, при равенстве — по алфавиту, иначе `Keywords: (none)`. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/README.md)
- **Обязательная структура:**
  - `cmd/go-refresh/main.go`;
  - `internal/{numbers,cases,punct,quotes,grammar,ai,pipeline}`, у каждого пакета `_test.go`;
  - `samples/` с тремя парами `.in/.out`;
  - `go.mod`, `README.md`, `Makefile`;
  - `go.sum` не нужен; только стандартные пакеты; `go fmt`.
  Подсказка в задании — пакет `unicode`. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/README.md)
- **Аудит, устная часть (5–10 мин):**
  - объяснить весь конвейер и почему важен порядок;
  - как отсчитываются N слов назад и что будет, если в начале строки слов меньше N;
  - как привязываются кавычки;
  - как работает `a → an` и сохраняется регистр;
  - почему текст на одном языке всегда даёт 100%; изменить две строки и **предсказать новый процент до запуска**;
  - почему нет `go.sum`.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/audit/README.md)
- **Аудит, функциональная часть:**
  - 5 входов с точным ожидаемым выводом: BREAKFAST… `(low, 3)`; `101 (bin)` / `1a (hex)`; `harold wilson (cap, 2)` с кавычками и артиклями; `Punctuation tests are ... kinda boring ,what do you think ?`; `A amazing rock`;
  - теги удалены, `go test ./...` проходит;
  - `--lang` = 67% на примере;
  - `samples/` на месте; **не-ASCII символы сохраняются**; пакеты разделены; `go fmt`;
  - бонус: `Keywords: was, age, epoch, season, times`.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/audit/README.md)
- **Отличие от публичного go-reloaded.** В go-reloaded только правила, тесты «рекомендованы», а аудит — 4 функциональные проверки без устной части, `--lang` и требований к структуре. — [public subject](https://github.com/01-edu/public/blob/master/subjects/go-reloaded/README.md), [public audit](https://github.com/01-edu/public/blob/master/subjects/go-reloaded/audit/README.md)

#### symbol-art (≈ ascii-art; 2–3 чел.)
- **Рендер.**
  - Строка из символов ASCII 32–126 и последовательности `\n` выводится шрифтом из баннера: по умолчанию `standard`, также `shadow` и `thinkertoy`. Каждый символ — 8 строк, в файле 95 символов, разделённых пустой строкой.
  - Пустой ввод `""` — вывода нет совсем; `"\n"` — ровно одна пустая строка.
  - Задание прямо называет типичную ошибку: печатать пустую строку на каждый сегмент после разбиения.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-art/README.md)
- **Обязательный `--analyze` (после арта).**
  - Посчитать заглавные, строчные, цифры, спецсимволы, пробелы.
  - Найти паттерны: смешанный регистр, повторы подряд, числовые последовательности.
  - Сложность = уникальные/все символы × 100, с учётом регистра, 2 знака после запятой.
  - Размер арта: «N lines × M characters».
  Бонус — `--suggest`. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-art/README.md)
- **Структура:** `main.go`; `internal/{banner,printer,analyzer}` с тестами; три `.txt`-баннера; `samples/` с ≥2 парами; только стандартная библиотека. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-art/README.md)
- **Аудит.**
  - Устно: как найти 8-строчный блок символа в файле; как выровнять 8 строк при склейке; как обрабатываются `\n` и `""`; как классифицируются символы; **посчитать сложность `"AAaa"` вслух**.
  - Затем точные сравнения через `cat -e`: `""`, `"\n"`, `hello`, `HeLlo HuMaN`, `1Hello 2There`, `Hello\nThere`, `Hello\n\nThere`, `{Hello & There #}`, `A–Z` и две случайные строки.
  - Затем проверки AI-функции, тестов и good practices.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-art/audit/README.md)

#### symbol-invert (≈ ascii-art-reverse)
- **Задача.**
  - Флаг строго `--reverse=<file>`. Любой другой формат печатает `Usage: go run . [OPTION]` и `EX: go run . --reverse=<fileName>`.
  - Запуск с одной строкой-аргументом должен работать по-прежнему.
  - Ширина символов разная, поэтому границы символов ищут слева направо подбором шаблона. Задание называет это главной трудностью.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-invert/README.md)
- **AI `--confidence`.**
  - Уверенность по символу = совпавшие строки / 8 × 100.
  - Метки: Perfect 100%, Partial 50–99%, Failed <50%.
  - Общая уверенность — среднее; качество: Excellent ≥95, Good 80–94.99, Fair 60–79.99, Poor <60.
  Бонус — `--tolerant` (ближайший шаблон). — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-invert/README.md)
- **Тестовые данные:** `testdata/example00–07`. Например, 00 → `Hello World`, 01 → `123`, 02 → `#=\[`, 07 → A–Z. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-invert/README.md)
- **Аудит.**
  - `--reverse testdata/example00.txt` без `=` должен печатать usage.
  - Примеры 00/01/02/07 и случайные строки.
  - Чистый файл даёт 100% Excellent; 2 испорченные строки дают 75% Partial.
  - Пакеты: `internal/reader`, `matcher`, `confidence`.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-invert/audit/README.md)

#### symbol-color (≈ ascii-art-color)
- **Задача.**
  - Формат `--color=<color> [<substring>] "string"`. Без подстроки красится вся строка; красятся **все вхождения** (`kit` и внутри `kitten`).
  - Любой другой формат печатает `Usage: go run . [OPTION] [STRING]` и `EX: …`.
  - Цвет задаётся ANSI-кодами: `\033[…m` и сброс `\033[0m`.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-color/README.md)
- **AI `--readability`.**
  - Яркость = (R+G+B)/3: Dark 0–84, Medium 85–169, Bright 170–255.
  - Контраст: на тёмном фоне Good при ≥85, на светлом — при <170.
  - Покрытие = окрашенные/все символы **входной строки** × 100.
  - При плохом контрасте — предупреждение и совет взять цвет из противоположной полосы.
  - Обязательная таблица RGB для 8 цветов: red, green, blue, yellow, magenta, cyan, white, black.
  - Бонус: `--auto-color` по ключевым словам и форматы hex/rgb/hsl.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-color/README.md)
- **Аудит.**
  - `--color red "banana"` (без `=`) должен печатать usage.
  - `--color=blue B 'RGB()'` — окрашена только B.
  - **`--color=orange GuYs "HeY GuYs"`** — каждое вхождение.
  - Окраска всей строки; запуск с одним аргументом.
  - `--readability` на примере даёт 85.00 (Medium), Good/Good, 27.27%.
  - Пакеты: `internal/color`, `parser`, `analyzer`.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-color/audit/README.md)

#### symbol-output (≈ ascii-art-output)
- **Задача.**
  - Флаг строго `--output=<fileName.txt>`, иначе печатается `Usage: go run . [OPTION] [STRING] [BANNER]` и `EX: …`.
  - AI `--verify`: перечитать файл через `os.ReadFile` и сделать 5 проверок — файл читается; строк = 8 × строк ввода; ширина одинакова внутри ряда; нет лишних пробелов справа; размер = сумма длин + перевод строки на каждую строку.
  - Итог /5: Valid (5), Acceptable (4), Corrupted (≤3). Пример: `hello`/standard → 8 × 31 + 8 = 256 байт.
  - Бонус — `--tamper-check`.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-output/README.md)
- **Аудит.**
  - `--output test00.txt banana standard` должен печатать usage.
  - `"First\nTest" shadow`, `"123 -> #$%"`.
  - Проверка именно перечитанного файла; 5/5 Valid, 256 байт.
  - Пакеты: `internal/writer`, `generator`, `verifier`.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-output/audit/README.md)

#### symbol-fs (≈ ascii-art-fs)
- **Задача.**
  - Формат `go run . [STRING] [BANNER]`, иначе печатается `Usage: go run . [STRING] [BANNER]` и `EX: go run . something standard`.
  - AI `--compare`: средняя ширина 95 шаблонов (2 знака); стиль compact <6, standard 6–8.5, wide >8.5.
  - Эталон для самопроверки: thinkertoy 5.06, standard 7.59, shadow 8.69.
  - Бонус — `--fingerprint` (узнать баннер по образцу арта).
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-fs/README.md)
- **Аудит.**
  - `"banana" standard abc` должен печатать usage.
  - `hello world` shadow, `nice 2 meet you` thinkertoy.
  - `--compare` для standard: 7.59 и стиль standard.
  - Пакеты: `internal/loader`, `generator`, `profiler`.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-fs/audit/README.md)

#### symbol-justify (≈ ascii-art-justify)
- **Задача.**
  - Флаг `--align=center|left|right|justify`. Вывод подстраивается под ширину терминала, ширину берут через `syscall` ioctl.
  - Неверный формат печатает `Usage: … [OPTION] [STRING] [BANNER]` и `Example: …`.
  - AI `--recommend`: доля = ширина арта / ширина терминала × 100; <40% → center, 40–70% → left, >70% → left с пометкой о переполнении; justify предлагать только при ≥3 словах.
  - Бонус — `--preview` для ширин 80/120/160.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-justify/README.md)
- **Аудит.**
  - `--align right something standard` должен печатать usage.
  - right/left/center; justify на `"1 Two 4"` и `"1 Two 4 and 5"` (shadow); уменьшить окно и проверить центровку.
  - `--recommend "hello"` при 80 колонках: 38.75% → center.
  - Пакеты: `internal/aligner`, `terminal`, `advisor`.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-justify/audit/README.md)

#### symbol-web (≈ ascii-art-web; обязательный)
- **Ядро.**
  - `GET /` через `html/template`: поле ввода, выбор баннера, кнопка с POST на `/symbol-art`, область результата.
  - Коды ответа: 200 / 400 (пустой ввод, >1000 символов, недопустимые символы, неверный баннер) / 404 (нет шаблона или баннера) / 500 / 503 (AI недоступен).
  - README с разделами Description, Authors, Usage, Implementation Details, AI Features.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web/README.md)
- **AI-часть.**
  - `POST /api/suggest` — настоящий LLM: 3–5 подсказок, от 3 символов, таймаут 10 с.
  - **Обязательный mock-режим**, когда `LLM_BASE_URL` не задан. Бэкенд по умолчанию — Ollama или любой OpenAI-совместимый; модель берётся из `LLM_MODEL`. Нужен `.env.example`.
  - `POST /api/recommend-banner` — только правила, без LLM.
  - Бонус — `/api/variations`.
  - Фронтенд: `fetch`, задержка (debounce) 300 мс, выпадающий список.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web/README.md)
- **Аудит.**
  - Структура `cmd/`, `internal/`, `templates/`, `static/`; баннеры в корне.
  - Арт для standard и thinkertoy (`123 T/fs#R`); навигация; 404/400/500; правильные методы.
  - Меньше 3 символов — запроса нет; mock работает без ключа; недоступный бэкенд не роняет сервер.
  - `WELCOME` даёт детерминированную рекомендацию; env-переменные не зашиты в код; ответы в JSON; обновление без перезагрузки.
  - Тесты обработчиков; **параллельные запросы без гонок (race)**.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web/audit/README.md)

#### symbol-web-stylize (≈ ascii-art-web-stylize)
- **Задача.**
  - Внешний CSS в `static/css/`, без inline-стилей; CSS-переменные; media queries; переходы; контраст WCAG AA 4.5:1.
  - AI: `POST /api/suggest-palette` (LLM + mock) возвращает 3 палитры (name, colors, reasoning, mood).
  - Сервер проверяет контраст `(L1+0.05)/(L2+0.05) ≥ 4.5` и выбрасывает или исправляет плохие палитры.
  - Палитра применяется через CSS-переменные и сохраняется в `localStorage`.
  - Бонус — Style Memory.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web-stylize/README.md)
- **Аудит.** Адаптивность на 375 / 768 / 1920 px; hover/focus/loading; иерархия шрифтов; 3 палитры; mock; мягкий отказ при ошибке; тема переживает перезагрузку; все палитры ≥4.5:1 с проверкой на сервере; тесты контраста; управление с клавиатуры. — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web-stylize/audit/README.md)

#### symbol-web-dockerize (≈ ascii-art-web-dockerize)
- **Задача.**
  - Dockerfile, образ, контейнер; LABEL-метаданные; уборка неиспользуемых объектов.
  - AI: `health-monitor <container>` и/или `GET /health-monitor` читает 4 реальные метрики из `docker stats` / `docker inspect`: uptime (StartedAt), memory %, CPU %, RestartCount.
  - Каждая метрика оценивается в 25 / 15 / 5 / 0 баллов, сумма 0–100 переводится в звёзды. Пример: 5 + 15 + 5 + 5 = 30 → 1 звезда.
  - Можно использовать клиентскую библиотеку Docker — единственное исключение из «только стандартные пакеты».
  - Бонус — `--lint Dockerfile`.
  - Подсказки: multi-stage сборка, alpine, `.dockerignore`, `docker system prune`.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web-dockerize/README.md)
- **Аудит.**
  - `docker image build -f Dockerfile -t <name> .` → `docker images` → `docker container run -p 8080:8080 --detach --name …` → `docker ps -a` → **`docker exec -it <container> /bin/bash` + `ls -l`**.
  - Метаданные; сайт и статика работают; метрики настоящие; подсчёт по таблицам.
  - Ошибки (нет контейнера, демон не запущен) не роняют программу.
  - Пакеты: `internal/ascii`, `handlers`, `monitor`; тесты; скрипт или Makefile для сборки.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web-dockerize/audit/README.md)
- **Старая версия, которую Нурс аудирует (ascii-art-web-dockerize).**
  - Задание: Dockerfile, образ и контейнер; метаданные; «garbage collection»; соблюдать Dockerfile best practices; только стандартные пакеты. — [legacy subject](https://01.tomorrow-school.ai/api/content/root/01-edu_module/content/ascii-art-web-dockerize/README.md)
  - Аудит: разрешённые пакеты → Dockerfile есть → build → `docker images` → run → `docker ps -a` → `docker exec … /bin/bash` + `ls -l` → метаданные → итоговый вопрос «проект соответствует стандарту? если нет — почему проваливаете (Empty Work, Incomplete Work, Invalid compilation, Cheating, Crashing, Leaks)».
  - Бонусы: скрипт сборки, скорость, good practices, тесты, понятные инструкции на сайте, раздел «Social».
  — [legacy audit](https://01.tomorrow-school.ai/api/content/root/01-edu_module/content/ascii-art-web-dockerize/audit/README.md)
  - По сути это та же публичная версия 01-edu: отличаются только ссылки и пример вывода. — [public audit](https://github.com/01-edu/public/blob/master/subjects/ascii-art-web/dockerize/audit/README.md)

#### symbol-web-export (≈ ascii-art-web-export-file)
- **Задача.**
  - Отдельный endpoint экспорта: txt и html обязательно (png/pdf — бонус, внешняя библиотека только для PDF).
  - Заголовки `Content-Type`, `Content-Length` и `Content-Disposition: attachment`; права на файл rw (0644/0664).
  - AI: `GET /export-analyzer?content=` считает символы, строки, ширину и наличие ANSI-цвета. Оценки размера: txt = len, html = len × 2.5 + 800, png = width × lines × 60.
  - Правила: есть цвет → html; ширина >120 → html с предупреждением; иначе txt. Пример `hello`: 256 / 1440 / 14880 → txt.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web-export/README.md)
- **Аудит.** Скачанный файл совпадает с показанным; права rw; все 3 заголовка; есть кнопка; повторный экспорт; цифры примера; пустой или очень широкий ввод не роняет сервер. — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web-export/audit/README.md)

#### tour-track (≈ groupie-tracker; обязательный)
- **Задача.**
  - Взять данные из API `groupietrackers.herokuapp.com/api` (artists, locations, dates, relation) и показать их на сайте.
  - Нужно событие «клиент → сервер» (запрос-ответ). Сервер не должен падать; тесты; только стандартная библиотека.
  - AI: `score = tour_spread×2 + concert_count×3 + min(10, career_years/5)`, где `career_years` считается через `time.Now().Year()`. Метки: Emerging 0–10, Active 11–25, Established 26–40, Legendary ≥41.
  - Бейдж на карточке и странице артиста; пакет `internal/activity` с отдельной функцией для score.
  - Бонусы: Rising Star; события на горутинах и каналах; хостинг на DNS.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-track/README.md)
- **Аудит.**
  - Используются все 4 части API; точные данные: члены Queen, первый альбом Gorillaz `26-03-2001`, локации Travis Scott, члены Foo Fighters.
  - Событие срабатывает; нет 404; есть обработка 500; правильные методы.
  - Пересчитать вручную: 5/8/30 → 40 → Established.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-track/audit/README.md)

#### tour-filters / tour-geo / tour-visuals / tour-search
- **tour-filters.**
  - Фильтры: дата создания, первый альбом, число участников, локации. Типы: диапазон и чекбоксы. Подсказка: «Seattle, Washington, USA» входит в «Washington, USA».
  - AI-профиль выборки: эпоха (среднее год создания: <1990 / 1990–2005 / 2006–2015 / >2015), размер (среднее участников ≤1.5 / ≤3.5 / ≤6.5 / >6.5), охват (уникальные страны 1–3 / 4–8 / ≥9).
  - При пустом результате: `No artists match the current filters.`; пакет `internal/profile`.
  - Аудит проверяет конкретные наборы артистов (например, создание 1995–2000 → SOJA, … Coldplay; ровно 6 участников → Pink Floyd, Arctic Monkeys, Linkin Park, Foo Fighters).
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-filters/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-filters/audit/README.md)
- **tour-geo.**
  - Геокодинг (рекомендуют Nominatim, ≤1 запроса в секунду, кешировать) и карта на Leaflet.js.
  - AI: нормализовать локацию (нижний регистр, `-`/`_` → пробел) и искать **самый длинный ключ страны в конце строки** (`south africa`, `new zealand`, `saudi arabia`); страна → континент; число континентов 1 / 2 / 3–4 / ≥5 → domestic / regional / international / world tour.
  - Пакет `internal/tourscope` с таблицей на уровне пакета.
  - Аудит: маркеры для Queen, ACDC, Imagine Dragons, Guns N' Roses, Post Malone, RHCP; Queen → international.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-geo/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-geo/audit/README.md)
- **tour-visuals.**
  - Нужен CSS и 8 «золотых правил» Шнейдермана.
  - AI-сезон: убрать `*` из дат `*DD-MM-YYYY`, месяц → сезон, пик; при равенстве Summer > Spring > Autumn > Winter; без дат — Unknown.
  - Свой CSS-класс на каждый сезон; пакет `internal/season`.
  - Аудит: контраст, единый стиль, адаптивность, оформленная страница 404, тесты на Summer, Winter и порядок при равенстве.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-visuals/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-visuals/audit/README.md)
- **tour-search.**
  - Поиск по имени, участникам, локациям, первому альбому и дате создания; без учёта регистра; подсказки с типом («Phil Collins - member»).
  - AI-намерение, правила **по порядку**: 4 цифры → year; `DD-MM-YYYY` → date; есть `-` → location; только буквы и пробелы → name; иначе any. Совпадающие подсказки поднимаются наверх.
  - Аудит: `queen` → Queen и Queensland; `05-08-1967` → Pink Floyd; `1973` → ACDC; `london-uk` → список групп; дата классифицируется как date, а не location.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-search/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-search/audit/README.md)

#### path-flow (≈ lem-in; обязательный; 3–4 чел.)
- **Задача.**
  - Прочитать файл: число муравьёв, комнаты `name x y`, связи `a-b`, команды `##start`/`##end`, комментарии `#`. Провести n муравьёв от старта к выходу за минимум ходов.
  - В комнате один муравей (кроме start и end); каждый туннель — один раз за ход.
  - Вывод: сначала исходный файл, потом ходы `Lx-y` по строке на ход.
  - Ошибки: `ERROR: invalid data format`.
  - Имя комнаты не начинается с `L` или `#`; неизвестные команды игнорируются; программа не должна падать.
  - AI: `ratio = туннели / комнаты`: <1.2 sparse, 1.2–2.0 connected, >2.0 dense. Строка `# Colony profile: rooms N | tunnels M | topology: X` печатается **до ходов**; пакет `internal/colony`.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/path-flow/README.md)
- **Аудит.**
  - Правильный формат; оптимальное число ходов на колонии, где оно известно; ERROR на кривом файле.
  - **100 муравьёв < 1,5 мин, 1000 муравьёв < 2,5 мин.**
  - Занятость комнат и туннелей; все муравьи дошли; результаты стабильны.
  - Метки топологии; бонусом — тесты на границах 1.2 и 2.0.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/path-flow/audit/README.md)

#### discuss-hub (≈ forum; обязательный; 4–5 чел.)
- **Задача.**
  - SQLite: минимум по одному запросу SELECT, CREATE и INSERT; советуют нарисовать ER-диаграмму.
  - Регистрация: email (занятый → ошибка), username, пароль; хеширование — бонус. Вход через cookie-сессию: **одна сессия на пользователя**, со сроком жизни; UUID — бонус.
  - Посты и комментарии — только для зарегистрированных; категории; лайки и дизлайки — только для зарегистрированных, счётчики видят все.
  - Фильтры: по категориям, «мои посты», «понравившиеся».
  - **Docker обязателен.**
  - AI `/insights`: тональность по словам (Score = позитивные − негативные, без учёта регистра); статистика **через SQL**: самая активная категория, топ-5 постов по реакциям, самый активный пользователь, общее настроение в %.
  - Разрешено: стандартная библиотека + `sqlite3` (mattn), `bcrypt`, `gofrs/uuid`. Фронтенд-фреймворки запрещены.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-hub/README.md)
- **Аудит.**
  - Есть `go.mod` и `go.sum`; есть Dockerfile.
  - Регистрация и ошибки входа; email и username заняты.
  - **Два браузера: залогинен только один** — проверка, что сессия одна.
  - `sqlite3 <db>`: видны новый пользователь и пост.
  - docker build и run.
  - Гостю запрещены действия; пустые пост и комментарий запрещены; **нельзя одновременно лайкнуть и дизлайкнуть**; фильтры работают; 400/500.
  - Всё про insights; пакет `internal/insights`.
  — [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-hub/audit/README.md)

#### discuss-auth / -upload / -security / -moderation / -plus
- **discuss-auth.**
  - OAuth 2.0 через Google и GitHub, полный цикл: redirect → code → token → профиль → локальный аккаунт → сессия. Email и пароль тоже работают.
  - AI-монитор входа: таблица `login_attempts`; 5 неудач подряд → блок на 15 минут с текстом `Too many failed attempts…`; сброс при успешном входе; >10 неудач за час → флаг и предупреждение `Unusual login activity detected on your account.`.
  - Страница `/security`; пороги вынесены в константы; пакет `internal/security`. Секреты OAuth — в `.env`.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-auth/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-auth/audit/README.md)
- **discuss-upload.**
  - JPEG, PNG и GIF до 20 МБ; при превышении — сообщение об ошибке.
  - AI-теги: размер по длинной стороне через `image.DecodeConfig` (>1200 large / 501–1200 medium / 151–500 small / ≤150 thumbnail); тип: GIF с >1 кадром (`gif.DecodeAll`) — animated, JPEG — photo, PNG — graphic; вес: <500 КБ optimized, ≤5 МБ moderate, >5 МБ heavy.
  - Теги хранятся строкой в `posts.image_tags`.
  - Подсказки: `http.MaxBytesReader`, `static/uploads/` с уникальными именами, защита от path traversal.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-upload/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-upload/audit/README.md)
- **discuss-security.**
  - HTTPS с собственным сертификатом и разумными cipher suites; rate limiting; хеш паролей; уникальные серверные сессии (UUID); таймауты сервера (Read, Write, Idle).
  - AI: таблица `session_profiles`; `score = endpoints×1 + rate×2 + restricted_hits×5`, где rate считается минимум за 1 минуту; 0–10 normal, 11–25 probing, ≥26 anomalous.
  - `/session-monitor` только для админа, заданного через `ADMIN_EMAIL`. Можно использовать `autocert`.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-security/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-security/audit/README.md)
- **discuss-moderation.**
  - 4 роли: guest, user, moderator, admin — с запросами на роль, жалобами и ответами на них, повышением и понижением, управлением категориями.
  - AI часть 1: классификатор по 4 спискам слов; побеждает больше совпадений; при равенстве illegal > obscene > insulting > irrelevant; всё, кроме `clean`, уходит в очередь модерации.
  - AI часть 2: оценка на `testdata/labeled_posts.json` (30 постов): accuracy, ложные срабатывания по каждой метке, `EVALUATION.md` на 3–5 предложений о худшей ошибке.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-moderation/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-moderation/audit/README.md)
- **discuss-plus.**
  - Уведомления о лайках, дизлайках и комментариях; страница активности; правка и удаление своих постов.
  - AI: `score = посты×5 + комменты×2 + полученные лайки×3 + поставленные лайки×1`; уровни Lurker / Member / Contributor / Active / Champion (0–10 / 11–30 / 31–60 / 61–100 / ≥101).
  - Таблица `user_scores`; топ-5 на главной; пакет `internal/engagement`.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-plus/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-plus/audit/README.md)

#### Внешняя дуга
- **git** (соло).
  - Минимум 5 коммитов в формате `type: short description` (add / update / fix / delete / docs / refactor); ветка `feature/<name>` с merge; push на GitHub, GitLab или Codeberg; намеренный конфликт и его разрешение.
  - Файлы: `README.md`, `reflection.md`, `feature/feature.txt`, `docs/workflow.md`.
  - AI-анализатор по `git log --pretty=format:"%ad|%s" --date=short`: каденс, оценка сообщения 0–3, метки tidy / acceptable / messy.
  - В аудите есть вопрос: **коммиты сделаны самим студентом, без соавторов (co-authored)**.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/git/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/git/audit/README.md)
- **tetris-fit** (соло).
  - Тетромино 4×4 из `#` и `.` → минимальный квадрат с буквами A, B, …; `ERROR` на кривом вводе.
  - AI-анализ: размер, заполненность, теоретический минимум `ceil(sqrt(n·4))`, время через `time.Since`, число попыток и откатов (backtracks).
  - Аудит: bad-примеры → ERROR; good-примеры с 0 / 9 / 4 / 5 точками; hard — 1 точка; **≤10 секунд**.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tetris-fit/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tetris-fit/audit/README.md)
- **teller-system** (соло, **C**).
  - Доработать выданный банкомат на C: файлы `users.txt`, `records.txt`, `transactions.txt`.
  - Функции: регистрация с уникальным именем; правка телефона и страны; просмотр счёта с процентами (savings 7%, fixed01 4%, fixed02 5%, fixed03 8%, у current процентов нет); транзакции (запрещены для fixed*); удаление счёта; передача владельцу.
  - AI в `src/analyzer.c/.h`: доля сбережений с округлением, ≥60 saver / 40–59 moderate / <40 spender. Подсказки: `fgets` + `sscanf`, режимы `"a"`/`"r"`/`"w"`, `fflush(stdout)`.
  - Аудит с конкретными суммами: savings 1001.20 → $5.84 в месяц; fixed01 → $40.05; fixed02 → $100.12; fixed03 → $240.29.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/teller-system/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/teller-system/audit/README.md)
- **swap-sort** (2–3 чел.).
  - Три программы:
    - `push-swap` — операции pa / pb / sa / sb / ss / ra / rb / rr / rra / rrb / rrr; `Error` в stderr при нечислах или дубликатах; без аргументов — пусто;
    - `checker` — печатает OK или KO;
    - `ai-coach` — LLM через `<LLM_BASE_URL>/chat/completions`, режимы explain и debug, таймаут 10 с, **mock обязателен**, usage при неверном числе аргументов.
  - Аудит: `"2 1 3 6 5 8"` — меньше 9 операций; 5 случайных чисел — меньше 12; **100 случайных — меньше 700** и OK.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/swap-sort/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/swap-sort/audit/README.md)
- **folder-scan** (2–3 чел.).
  - Свой `ls` с флагами `-l -a -r -t` в любых сочетаниях; вывод `-l` идентичен системному; **`os/exec` запрещён**.
  - Разрешены **только** fmt, os, os/user, strconv, strings, syscall, time, math/rand, errors, io/fs.
  - AI: возраст файла в целых сутках → fresh 0–6 / recent 7–30 / aging 31–365 / archived ≥366; строка `Age profile:` только для каталога.
  - Аудит: `/usr/bin` с симлинками; `-la /dev`; каталог с именем `-`; симлинк с `/` на конце и без; бонус `-R` быстрее 1,5 с.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/folder-scan/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/folder-scan/audit/README.md)
- **net-link** (2–3 чел.).
  - TCP-чат: `./TCPChat $port`, по умолчанию порт 8989, иначе `[USAGE]: ./TCPChat $port`; клиенты подключаются через `nc`.
  - Логотип и запрос имени; максимум 10 подключений; формат `[YYYY-MM-DD HH:MM:SS][name]:[msg]`; пустые сообщения не рассылаются; история приходит новичку; системные сообщения о входе и выходе; своё сообщение отправителю не возвращается.
  - **Обязательны горутины и каналы или мьютексы**; тесты сервера и клиента.
  - Разрешены io, log, os, fmt, net, sync, time, bufio, errors, strings, reflect.
  - AI: сообщений в минуту <3 quiet / 3–10 active / >10 lively; самый активный участник; пакет `internal/chatprofile`.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/net-link/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/net-link/audit/README.md)

#### Следующие сектора (кратко, только задания)
- **AI Full-Stack** — уже не Go, а JS + Python. В каждом проекте настоящая модель с mock-режимом.
  - scan-sense: Vanilla JS + FastAPI/Pydantic, Tesseract.js (OCR), LLM. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/scan-sense/README.md)
  - vision-classify: React/Vite + TanStack Router + FastAPI, YOLO/CNN, OpenCV. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/vision-classify/README.md)
  - doc-genius: RAG — эмбеддинги + LLM. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/doc-genius/README.md)
  - flow-lang: разговорный тренажёр языка, LLM + векторный индекс. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/flow-lang/README.md)
  - product-discovery: семантический поиск по эмбеддингам. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/product-discovery/README.md)
  - Внешняя дуга:
    - market-lab: тональность + RAG; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/market-lab/README.md)
    - brain-check: Django + React; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/brain-check/README.md)
    - watch-flow: Django REST + Channels/WebSocket; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/watch-flow/README.md)
    - cart-zone: агент с tool-calling. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/cart-zone/README.md)
- **AI Core Tech** (Python/ML):
  - kaggle-titanic — недельное соревнование; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/kaggle-titanic/README.md)
  - nlp-scraper; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/nlp-scraper/README.md)
  - matrix-factorization — SVD/PMF; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/matrix-factorization/README.md)
  - spectral-learning — PCA/SVD; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/spectral-learning/README.md)
  - vision-track — YOLO + Streamlit; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/vision-track/README.md)
  - doc-classify; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/doc-classify/README.md)
  - ai-pong — генетический алгоритм; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/ai-pong/README.md)
  - triton-deploy — NVIDIA Triton. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/triton-deploy/README.md)
- **Mathematics** — всё «с нуля» на NumPy:
  - linear-model — линейная регрессия; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/linear-model/README.md)
  - picture-perfect — SVD-сжатие изображений; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/picture-perfect/README.md)
  - digit-detect — k-NN; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/digit-detect/README.md)
  - grade-tree — дерево решений, энтропия; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/grade-tree/README.md)
  - neuro-genesis — нейросеть с обратным распространением ошибки (backprop); — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/neuro-genesis/README.md)
  - cluster-garden — K-Means; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/cluster-garden/README.md)
  - binary-guard — SVM; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/binary-guard/README.md)
  - matrix-match — ALS против user-CF; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/matrix-match/README.md)
  - sudoku-solver — CSP + перебор с откатом; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/sudoku-solver/README.md)
  - evo-sim — генетический алгоритм. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/evo-sim/README.md)
- **Employability:**
  - building-resume — PDF до 2 МБ, 1–2 страницы; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/building-resume/README.md)
  - personal-branding — видео-резюме на 1–2 минуты; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/personal-branding/README.md)
  - networking-practices — LinkedIn, GitHub, open source; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/networking-practices/README.md)
  - market-exploration — площадки для поиска работы; — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/market-exploration/README.md)
  - interview-practices — сертификаты по алгоритмам и структурам данных, группа 3–4. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/interview-practices/README.md)

### Inferences

**Ловушки и нестыковки, которые стоит знать заранее** (мой вывод из текстов выше)
1. **go-refresh: `go run .` против `cmd/`.** По структуре `main.go` лежит в `cmd/go-refresh/`, корневого `main.go` нет. Но и задание, и аудит запускают `go run . sample.txt result.txt` из корня — так программа не запустится. Нужно либо положить в корень тонкий `main.go`, либо явно описать в README и Makefile команду `go run ./cmd/go-refresh`. Это стоит решить сейчас: проект уже в работе.
2. **Точные сообщения usage — первый пункт почти каждого аудита symbol-*.** Проверяются `--reverse file`, `--color red`, `--output file`, `--align right` без `=` и лишние аргументы. Удобнее сделать один общий парсер флагов на всё семейство: каждый вариант обязан ещё и принимать флаги других вариантов, и работать с одной строкой.
3. **symbol-art: `"\n"` приходит из shell двумя символами** — обратный слеш и `n`, а не настоящим переводом строки. Делить нужно по этой паре. Плюс правило «одна пустая строка на каждый `\n`» — ловушка, которую задание называет само.
4. **symbol-color: аудит просит `--color=orange`, а в обязательной таблице RGB оранжевого нет.** Нужно поддержать больше имён цветов (например, через truecolor `\033[38;2;R;G;Bm`) и задать RGB для orange, иначе `--readability` нечем считать.
5. **dockerize (обе версии): аудитор вводит `docker exec -it … /bin/bash`.** В образах на alpine, которые сами же советует задание, bash нет. Сдающему стоит либо поставить bash, либо заранее предупредить и использовать `/bin/sh`. Нурсу как аудитору — не валить проект только из-за этой команды.
6. **discuss-hub: `mattn/go-sqlite3` требует cgo.** Docker-сборка на alpine без `gcc`/`musl-dev` и `CGO_ENABLED=1` упадёт. Это частая причина провала на пункте «docker build».
7. **folder-scan: в списке разрешённых нет `sort` и `path/filepath`.** Сортировку (по имени, по времени, обратную) и склейку путей придётся писать вручную. Формат `ls -l` (total, права, число ссылок, владелец через `os/user` и `syscall.Stat_t`, формат даты, `->` у симлинков, major/minor в `/dev`) — главный объём работы.
8. **net-link: в разрешённых пакетах нет `strconv`.** Порт придётся проверять без него, например вручную по цифрам. «Не возвращать сообщение отправителю» и «максимум 10» — обязательные пункты аудита.
9. **path-flow.**
   - Нужен алгоритм нескольких непересекающихся путей (BFS и идеи max-flow), а не один кратчайший путь; иначе не будет ни «минимума ходов», ни лимитов 1,5 и 2,5 минуты.
   - В задании ошибка: пример бонуса `9 ants | rooms 6 | load: heavy`, хотя 9/6 = 1,5 — это moderate (задание само делает оговорку).
10. **tetris-fit и swap-sort — проекты на производительность.** Лимит 10 с требует отсечения заведомо плохих вариантов при переборе; меньше 700 операций на 100 чисел — алгоритма уровня «чанки»/radix, простая сортировка не пройдёт.
11. **git-проект и ИИ.** Аудит спрашивает, нет ли соавторов в коммитах. Если коммитит Claude Code со строкой `Co-Authored-By`, этот пункт провален. В этом проекте коммиты должен делать Нурс сам.
12. **Порядок правил как источник ошибок:** go-refresh (теги → пунктуация → артикли), tour-search (date раньше location), discuss-moderation (порядок при равенстве), tour-visuals (Summer > Spring > Autumn > Winter). Аудиторы проверяют именно это.
13. **Чекпоинт wordanatomy:** текст требует кавычки (`prefix: "<prefix>"`), а пример вывода — без них (`prefix: un, suffix: able`). Автотестер, скорее всего, сверяет с примером.

**Инструменты Go, которые понадобятся** (вывод: задания сами функции почти не называют)

| Проект | Инструменты |
|---|---|
| go-refresh | `os.Args`, `os.ReadFile`/`os.WriteFile`, `strings.Fields`/`ToUpper`/`ToLower`, `strconv.ParseInt(s, 16 и 2, 64)`, `unicode`, руны и UTF-8, `map[string]int`, `sort.Slice` с правилом при равенстве, `math.Round`, пакет `testing` с табличными тестами (table-driven) |
| symbol-* | чтение баннера в `[][]string`, `strings.Split`, `fmt.Sprintf("%.2f")`, ANSI-коды, `os.Stat`, `syscall.Syscall(SYS_IOCTL, …TIOCGWINSZ…)` |
| symbol-web* | `net/http` (`HandleFunc`, `ServeMux`, `FileServer`), `html/template`, `r.ParseForm`/`FormValue`, `encoding/json`, `http.Client{Timeout}`, `os.Getenv`, интерфейс «реальный LLM / mock», заголовки ответа; JS: `fetch`, `async/await`, `setTimeout` (debounce), `localStorage`; CSS-переменные |
| tour-* | `http.Get` + `json.Unmarshal` в структуры, `time.Now()`, `strings`, Leaflet (JS) |
| path-flow | разбор с проверкой входа, граф на списках смежности, BFS, несколько путей |
| discuss-* | `database/sql`, SQL с JOIN и GROUP BY, cookies (`http.SetCookie`), `bcrypt`, `uuid`, `golang.org/x/oauth2` или ручной OAuth через `net/http`, `crypto/tls`, `http.Server{ReadTimeout…}`, `mime/multipart`, пакеты `image/*` |
| net-link | `net.Listen`, `Accept`, горутина на клиента, `sync.Mutex` или каналы, `bufio.Scanner` |

### Gaps
- Файлы `testdata` (labeled_posts.json, examples для path-flow и tetris-fit, баннеры) и полные блоки «Submission Structure» я не открывал. Точные деревья папок для tour-*, discuss-*, symbol-web* стоит смотреть в самих заданиях.
- Аудиты секторов AI Full-Stack, AI Core Tech и Mathematics не читал — только задания.
- Публичные версии 01-edu сверял только для go-reloaded, ascii-art и ascii-art-web-dockerize. Остальные соответствия «школа ↔ классика» выведены из совпадения позиций в графах и текстов заданий.

## 3. Какие концепции повторяются во многих проектах и должны быть освоены заранее?

### Takeaway
Сквозные требования есть почти в каждом проекте: Go-модули и пакеты в `internal/`, юнит-тесты, разбор аргументов командной строки с точными сообщениями usage, файлы, строки и руны, map для подсчётов, а также шаблон AI-функции «формула → пороги → метка с округлением до 2 знаков». Дальше по ветке добавляются HTTP-сервер, `html/template` и JSON (с symbol-web), LLM с mock-режимом и env-переменными (symbol-web, stylize, swap-sort), Docker (dockerize, discuss-hub), SQL и сессии (discuss-*), конкурентность (net-link, а также гонки в symbol-web) и алгоритмы на графах и переборе (path-flow, tetris-fit, swap-sort).

### Cited Findings
- **Юнит-тесты и `go test ./...` в аудите.** Есть в go-refresh, symbol-*, tour-*, path-flow, discuss-*, tetris-fit, swap-sort, folder-scan, net-link. Часто отдельно требуют, чтобы каждая формула была вынесена в свою функцию «so it can be unit tested independently» (tour-track, path-flow, net-link). — [go-refresh audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/audit/README.md), [tour-track](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-track/README.md), [net-link](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/net-link/README.md)
- **Структура `internal/<пакет>` проверяется аудитом поимённо:** go-refresh (7 пакетов), symbol-invert (reader/matcher/confidence), tour-track (activity), path-flow (colony), discuss-hub (insights) и др. — [go-refresh audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/audit/README.md), [path-flow](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/path-flow/README.md)
- **Аргументы командной строки и точный usage:** symbol-invert, symbol-color, symbol-output, symbol-fs, symbol-justify, net-link (`[USAGE]: ./TCPChat $port`), swap-sort `ai-coach`. — [symbol-color](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-color/README.md), [net-link](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/net-link/README.md)
- **Файлы:** go-refresh (вход и выход), баннеры symbol-*, symbol-output (повторное чтение, `os.Stat`), path-flow и tetris-fit (разбор файла), discuss-upload (хранение загрузок), teller-system (файлы на C). — [symbol-output](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-output/README.md), [teller-system](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/teller-system/README.md)
- **Подсчёт частот через map:** keywords и lang (go-refresh), анализатор symbol-art, разбивка по континентам (tour-geo), самый активный участник (net-link), trending (discuss-hub), классификатор discuss-moderation. — [go-refresh](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/README.md), [tour-geo](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-geo/README.md)
- **Шаблон «формула → пороги → метка»** с точными граничными значениями в аудите: tour-track, tour-filters, path-flow, discuss-security, discuss-plus, folder-scan, net-link, teller-system. Почти везде «Round … to 2 decimal places». — [discuss-security](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-security/README.md), [folder-scan](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/folder-scan/README.md)
- **HTTP-сервер, шаблоны, коды ответа:** symbol-web (200/400/404/500/503), tour-track (нет 404, обработка 500, правильные методы), discuss-hub (400/500). — [symbol-web](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web/README.md), [tour-track audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-track/audit/README.md)
- **LLM по HTTP:** env-переменные `LLM_BASE_URL`/`LLM_MODEL`, таймаут 10 с, обязательный mock, `.env.example`. Встречается в symbol-web, stylize и swap-sort, бонусом в discuss-moderation, и во всех проектах AI Full-Stack. — [symbol-web](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web/README.md), [swap-sort](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/swap-sort/README.md), [scan-sense](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/scan-sense/README.md)
- **Docker:** dockerize (сборка, запуск, exec, метаданные) и обязательный Docker в discuss-hub. — [discuss-hub](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/discuss-hub/README.md)
- **Конкурентность:** обязательна в net-link; бонусом в tour-track; в аудите symbol-web есть вопрос про гонки. — [net-link](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/net-link/README.md), [symbol-web audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-web/audit/README.md)
- **Время (`time`):** tour-track (`time.Now().Year()`), tour-visuals (даты), folder-scan (mtime), discuss-auth (окна времени), net-link (метки времени и темп), tetris-fit (`time.Since`), dockerize (uptime). — [tour-visuals](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tour-visuals/README.md), [tetris-fit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tetris-fit/README.md)
- **Общий документ good practices,** на который ссылаются аудиты: комментарии, единообразное именование, DRY, KISS, YAGNI, разделение ответственности, без глубокой вложенности, обработка ошибок, `gofmt`/`goimports`, лучшие практики Dockerfile, лимит времени работы любой программы — 5 минут. — [good-practices](https://github.com/01-edu/public/blob/master/subjects/good-practices/README.md)

### Inferences
**Порядок подготовительных уроков** (вывод из таблицы требований и ловушек):
1. **Сейчас (go-refresh → symbol-art):**
   - Go-модули, `internal/`, `go test` с табличными тестами;
   - ручной разбор `os.Args` и флагов `--x=y`;
   - файлы; `strings`, `strconv`, `unicode`; руны и байты (UTF-8, акценты);
   - map для подсчёта, сортировка с правилом при равенстве, `math.Round` и `%.2f`;
   - README и Makefile;
   - git в команде: ветки, merge, конфликты — группы начинаются с symbol-art.
2. **Параллельно — чекпоинты.** Упражнения уровней 10, 20, 35 и 50 открывают внешнюю дугу и Piscine JS. Нужна тренировка в условиях экзамена: без ИИ, с ограничением по функциям (`z01.PrintRune`, `os.Args`).
3. **До symbol-web:**
   - HTTP (методы, коды), `net/http`, `html/template`, формы, статика;
   - JSON; env-переменные; `http.Client` с таймаутом;
   - паттерн «интерфейс + mock»;
   - основы JS (`fetch`, async, DOM, debounce) и CSS (переменные, media queries), `localStorage`.
4. **До dockerize и discuss-hub:** Docker — multi-stage, LABEL, build/run/exec/ps/images/prune, порты, cgo для sqlite.
5. **До tour-track:** потребление REST API — структуры, `json.Unmarshal`, `range` в шаблонах.
6. **До path-flow:** графы, BFS, несколько путей / max-flow, проверка входных данных, скорость работы. До этого нужен unix-навык через folder-scan или net-link — то есть `os`, `syscall`, `io/fs` или `net` с горутинами.
7. **До discuss-hub:** SQL (CREATE, INSERT, SELECT, JOIN, GROUP BY), `database/sql`, cookies и сессии, bcrypt, UUID, ER-диаграмма, права доступа. Затем OAuth2, TLS, rate limiting, multipart, пакет `image`.
8. **Отдельной линией — C для teller-system.** Доступен рано, даёт много XP, делается соло.

### Gaps
- Не проверял, совпадает ли реальная частота повторения с тем, что видят студенты на практике (например, по отзывам). Список собран только из текстов заданий.

## 4. Что известно об AI-квестах (Prompt Piscine): содержание и аудит

### Takeaway
Prompt Piscine — 9 соло-квестов за 18 дней по одному в день: ethical-ai, prompt-basics, ai-ethics, role-prompts, reasoning-flow, prompt-patterns, debug-control, tool-prompts, creative-ai. Это работа в браузере с чат-моделью плюс markdown-отчёты; кода почти нет. Сдаются файлы `exNN_*.md` и README с обязательными фразами-выводами. Каждый аудит начинается с 5-минутного устного блока «Stakeholder»: объяснить свои результаты без подсказки и предсказать эффект изменения до запуска. Проваливают за пропущенное сравнение «до/после», общие слова без личного разбора и отсутствие собственной проверки ответов ИИ. Валить за то, что текст «похож на ИИ», запрещено.

### Cited Findings
- **Параметры в конфиге:**
  - Prompt Piscine длится 18 суток; квесты идут в днях 1–9;
  - XP: 500 → 950; соло;
  - аудиторов 2 (у creative-ai 3); AR 0 у ethical-ai, 0,5 у остальных;
  - в конфиге стоит язык `python`, хотя задания допускают любой язык и браузер.
  — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- **ethical-ai (Quest 0).** Принцип «сначала попытка → проверка → рефлексия».
  - Ex1: найти и исправить настоящий баг **без ИИ** (`ex01_buggy`, `ex01_fixed`, `ex01_debug.md`), потом спросить ИИ про граничные случаи.
  - Ex2: «договор честности» с проверяемыми правилами, подписанный и датированный.
  - Ex3: три сценария, где зависимость от ИИ ломает (собеседование, авария без ИИ, новая технология).
  - Ex4: самооценка 5 навыков и 2 действия по самому слабому.
  - Аудит проваливает, если нет баговой версии или студент не может объяснить свой баг и фикс устно.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/ethical-ai/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/ethical-ai/audit/README.md)
- **prompt-basics (Quest 1).**
  - Ex1: инструкция против открытого вопроса о своей функции из пиcцины.
  - Ex2: уточнить расплывчатый запрос минимум в 2 шага.
  - Ex3: zero-shot против few-shot.
  - Ex4: temperature 0.2 / 0.9 и top-p 0.5 / 1.0 в Google AI Studio, **с предсказанием до запуска**, плюс системное сообщение.
  - На аудите просят предсказать эффект повышения температуры до запуска.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/prompt-basics/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/prompt-basics/audit/README.md)
- **ai-ethics (Quest 2).**
  - Источники (OECD, UNESCO, правила провайдеров).
  - Происхождение предвзятости: данные, постановка задачи или внедрение; кто страдает.
  - 3 вредных промпта и их переписанные версии с проверкой.
  - Вредные ответы и пределы исправлений через промпт; реальный кейс.
  - Ответственность: почему «это сделала модель» — не ответ инженера.
  - В аудите прямо сказано: не проваливать за «AI-written», автора проверять устными вопросами.
  — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/ai-ethics/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/ai-ethics/audit/README.md)
- **role-prompts (Quest 3):** три роли на один вопрос; выбор роли под цель; «senior reviewer» на функции с известным багом — поймал ли он баг; смена тона без смены фактов. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/role-prompts/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/role-prompts/audit/README.md)
- **reasoning-flow (Quest 4):** прямой ответ против chain-of-thought; ИИ трассирует **свою** функцию, студент сверяет с реальным запуском; разбор задачи на шаги; найти убедительный, но неверный шаг. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/reasoning-flow/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/reasoning-flow/audit/README.md)
- **prompt-patterns (Quest 5):** шаблон краткого пересказа на 2 разных входа; шаблон извлечения в JSON со слотом `{INPUT}`; усиление слабого промпта паттерном. На аудите — применить свой шаблон к новому входу на месте. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/prompt-patterns/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/prompt-patterns/audit/README.md)
- **debug-control (Quest 6):** поймать галлюцинацию (например, несуществующий `strings.ReverseWords`); ответ только по выданному тексту — включая отказ, если ответа там нет; разделители. Если модель повела себя правильно, это не провал. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/debug-control/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/debug-control/audit/README.md)
- **tool-prompts (Quest 7):** валидный JSON; выбор инструмента из двух (`get_weather` / `define_word`); цепочка «запрос → JSON-вызов → выдуманный результат → ответ». Устно: инструмент запускает код, а не модель; что делать с битым JSON. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tool-prompts/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/tool-prompts/audit/README.md)
- **creative-ai (Quest 8):** генерация с ограничениями; прикладная задача (резюме или описание проекта) **только для вымышленной персоны** — реальные личные данные дают провал; картинка: расплывчатый промпт против детального. — [subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/creative-ai/README.md), [audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/creative-ai/audit/README.md)

### Inferences
- Квесты учат тем же навыкам, которые дальше проверяются в Go-проектах: tool-prompts и debug-control — это теория к mock-режиму и JSON в symbol-web и swap-sort, а reasoning-flow — тренировка «трассировать свою функцию». Проходить квесты формально невыгодно.
- Для аудиторов квестов главное — найти доказательства собственной работы: баговая версия, предсказание до запуска, честное «модель ошиблась вот здесь».

### Gaps
- Публичных отзывов или разборов именно этих квестов я не нашёл. Источник — только тексты школы.

## 5. Как устроен устный peer-аудит в школах 01-edu

### Takeaway
Проект проверяют студенты своего кампуса, не администраторы. Для Go-проектов в конфиге стоит `required: 5`, для квестов — 2–3. Аудит идёт по чек-листу из вопросов «да/нет»; отмеченные `+` — бонусные. В новых аудитах AI-модуля первым идёт устный блок «Play the Role of a Stakeholder» на 5–10 минут: объяснить свой код без подсказки, предсказать вывод после живой правки, ответить на 5–6 конкретных вопросов. Для старта следующих проектов нужен аудит-ратио ≥0,5 — то есть нужно аудировать других.

### Cited Findings
- **Валидация проекта** — `user_audit`:
  - `matchWhere`: кампус `astanahub`, без ролей admin и campus_admin;
  - подбор аудитора (`matchInfluence`) учитывает auditsRatio, auditsAssigned, levelProximity и lastAuditAttributed;
  - поле `form` указывает на файл аудита;
  - `delay` 4 320 мин у Go-проектов и 20 160 мин у проектов AI Full-Stack и Core.
  — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- **Рейды пиcцин и упражнения чекпоинтов проверяются иначе:** рейды — `admin_audit`, чекпоинты — автотестер `ghcr.io/01-edu/module-go`. — [config](https://01.tomorrow-school.ai/api/object/astanahub)
- **Устная часть.** В go-refresh аудитор играет коллегу, который смотрит код перед выпуском, 5–10 минут; цель — убедиться, что студент понимает написанное, а не просто запустил. Итоговые вопросы:
  - может ли объяснить конвейер, не читая код;
  - верно ли предсказывает результат живой правки;
  - понимает ли он, а не пересказывает сгенерированный код.
  — [go-refresh audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/audit/README.md)
- **Что обычно просят на устной части:**
  - посчитать вручную: сложность `"AAaa"`, яркость цвета, уверенность символа, оценку артиста, метку топологии, размер файла;
  - объяснить алгоритм и защиту общих данных от гонок.
  — [symbol-art audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-art/audit/README.md), [net-link audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/net-link/audit/README.md), [path-flow audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/path-flow/audit/README.md)
- **Порядок блоков** в новых аудитах: General / Submission Structure → Stakeholder → Preliminary → Functional / Core → AI Integration → Input Data → Code Quality → Bonus. Пункты «Note for Auditors» дают точные ожидаемые значения. — [symbol-color audit](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/symbol-color/audit/README.md)
- **Старый формат аудита** заканчивается вопросом «проект соответствует стандарту? если нет — почему проваливаете (Empty Work, Incomplete Work, Invalid compilation, Cheating, Crashing, Leaks)» и блоками General, Basic, Social с бонусами (скрипт сборки, good practices, тесты, понятность сайта, «рекомендовал бы как пример»). — [legacy dockerize audit](https://01.tomorrow-school.ai/api/content/root/01-edu_module/content/ascii-art-web-dockerize/audit/README.md)
- **Совет готовить свои тесты для аудитов.** Задание go-refresh советует написать собственные тесты, чтобы использовать их и при аудите чужих работ. В публичном go-reloaded сказано, что аудиторами будут другие студенты и ты тоже будешь аудитором. — [go-refresh subject](https://01.tomorrow-school.ai/api/content/root/01-edu_ai-module/content/go-refresh/README.md), [public go-reloaded](https://github.com/01-edu/public/blob/master/subjects/go-reloaded/README.md)
- **Аудит-ратио доступен в GraphQL-профиле.** Задание graphql называет «audits ratio» среди данных профиля. Профиль студента Tomorrow School строит карточку по полям `auditRatio`, `totalUp`, `totalDown` с подписями «done» и «received» и считает аудит пройденным при оценке ≥1. — [01-edu graphql subject](https://github.com/01-edu/public/blob/master/subjects/graphql/README.md), [AxeMadxD/graphql](https://github.com/AxeMadxD/graphql)
- **Публичных официальных описаний аудита 01-edu поиском не нашлось.** Главная 01edu.ai говорит только о peer-to-peer обучении без учителей. Документ `docs/reviews.md` в 01-edu/public описывает «review» бонусных упражнений пиcцины со ставками «fail/succeed», а не аудит проектов. — [01edu.ai](https://01edu.ai/), [docs/reviews.md](https://github.com/01-edu/public/blob/master/docs/reviews.md)

### Inferences
- Для Нурса это главный аргумент за этап «разобрать и объяснить» в его методе: аудит AI-модуля прямо проверяет объяснение без кода и предсказание изменения вслух. Готовый, но не разобранный код проваливает блок Stakeholder даже при идеальной функциональности.
- Как аудитор, Нурс должен идти по чек-листу буквально. Спорные места (например, `/bin/bash` в alpine) лучше обсудить с командой, а не проваливать молча. Кроме того, каждый проведённый аудит поднимает его ратио, а без ратио ≥0,5 не открыть symbol-art.
- Трактовка «auditRatio = сделанные / полученные» (totalUp / totalDown) — вывод из чужого проекта, а не из официальной документации.

### Gaps
- Нет официального описания: как считаются `required: 5` (5 проходящих аудитов? 5 назначенных?), `ratio`, что происходит при расхождении оценок аудиторов, как работает отмена аудита.
- Не найдено публичных отзывов студентов о реальном ходе устных аудитов в Tomorrow School.
