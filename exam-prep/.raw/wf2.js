export const meta = {
  name: 'exam-prep-dobivka',
  description: 'Доделать вопросы 5-10: проверить готовый код прогоном и написать объяснения для новичка',
  phases: [{ title: 'Разбор', detail: 'проверка прогоном + объяснения' }],
}

const SUBJ = '/Users/komekbuy/Projects/tomorrow_school/tmp/01edu-public/subjects'
const WORK = '/Users/komekbuy/Projects/tomorrow_school/exam-prep'

const GROUPS = [
  { id: 'Q05a', q: 5, pct: 50, exists: true,  tasks: ['addprimesum','canjump','chunk','concatalternate','concatslice','fprime'] },
  { id: 'Q05b', q: 5, pct: 50, exists: true,  tasks: ['hiddenp','inter','reversestrcap','saveandmiss','union','wdmatch'] },
  { id: 'Q06',  q: 6, pct: 65, exists: true,  tasks: ['fifthandskip','notdecimal','revconcatalternate','slice'] },
  { id: 'Q07',  q: 7, pct: 75, exists: true,  tasks: ['findpairs','revwstr','rostring','wordflip'] },
  { id: 'Q08',  q: 8, pct: 85, exists: true,  tasks: ['itoabase','options','piglatin','romannumbers'] },
  { id: 'Q09',  q: 9, pct: 95, exists: true,  tasks: ['brackets','rpncalc'] },
  { id: 'Q10',  q: 10, pct: 100, exists: false, tasks: ['brainfuck','grouping'] },
]

const SCHEMA = {
  type: 'object',
  required: ['solutions'],
  properties: {
    solutions: {
      type: 'array',
      items: {
        type: 'object',
        required: ['task','kind','statement_ru','solution_code','how_to_think','line_by_line','terms','pitfalls','verification','test_program','file_path'],
        properties: {
          task: { type: 'string' },
          kind: { type: 'string', enum: ['function','program'] },
          prototype: { type: 'string', description: 'прототип дословно из README, пусто для программ' },
          statement_ru: { type: 'string', description: 'условие своими словами по-русски, 2-5 предложений' },
          solution_code: { type: 'string', description: 'ПОЛНЫЙ текст файла решения, ровно как на диске после проверки' },
          how_to_think: { type: 'string', description: 'как дойти до решения самому: что дано, что надо, какой приём и почему. 5-12 предложений' },
          line_by_line: { type: 'string', description: 'разбор по строкам: строка кода, под ней объяснение. Для человека без опыта' },
          terms: { type: 'array', items: { type: 'string' }, description: 'термин — объяснение одним предложением' },
          pitfalls: { type: 'array', items: { type: 'string' }, description: 'типичные ошибки и краевые случаи' },
          verification: { type: 'string', description: 'что РЕАЛЬНО прогнано и с каким результатом' },
          test_program: { type: 'string', description: 'программа самопроверки из README + ожидаемый вывод' },
          file_path: { type: 'string' },
        },
      },
    },
  },
}

function prompt(g) {
  const already = g.exists
    ? `## Код уже написан — он лежит на диске
Функции: \`${WORK}/piscine/<имя>.go\` · программы: \`${WORK}/programs/<имя>/main.go\` · тесты: \`${WORK}/tests/<имя>/\`
Он собирается, но НЕ ПРОВЕРЕН на правильность вывода. Твоя работа: прогнать, сверить с README, ПОЧИНИТЬ если расходится, и написать разбор.`
    : `## Кода ещё нет — напиши его сам
Функции клади в \`${WORK}/piscine/<имя>.go\` (первая строка \`package piscine\`, имена вспомогательных функций с префиксом задания чтобы не конфликтовать).
Программы — в \`${WORK}/programs/<имя>/\` с \`main.go\` (package main) и \`go.mod\` (module <имя>).
Тест функции — в \`${WORK}/tests/<имя>/\` с go.mod вида: module test<имя> / go 1.22 / require piscine v0.0.0 / replace piscine => ${WORK}/piscine`

  return `Ты готовишь ученика школы 01-edu к экзамену по Go. Ученик — новичок, программировать начал в конце июля 2026. На экзамене ИИ запрещён: он должен по твоему тексту ПОНЯТЬ логику и написать код сам.

## Задания (вопрос ${g.q} экзамена, вес ${g.pct}%)
${g.tasks.map(t => `- ${t}`).join('\n')}

Subject каждого: \`${SUBJ}/<имя>/README.md\` (рядом бывает main.go — тестовая программа из Usage).
Читай ДОСЛОВНО: прототип копируй символ в символ, бот школы сверяет подпись. Не упусти слова вроде "only", "separated by", формат разделителя, наличие перевода строки.

${already}

## Обязательные проверки перед ответом
1. \`gofmt -l <файл>\` — пусто
2. сборка: для функций \`cd ${WORK}/piscine && go build ./...\`; для программ \`cd ${WORK}/programs/<имя> && go build -o /dev/null .\`
3. прогон примера из README ровно теми командами и аргументами, что там показаны; вывод сверь через \`diff\` с ожидаемым, ПОБАЙТОВО, а не глазами
4. свои краевые случаи: пустой ввод, один символ, ноль, отрицательное, нет аргументов, слишком много аргументов, неверный формат. Проверь то, что README требует словами, но не показывает примером
5. если расходится — чини и перепроверяй

В поле verification пиши ТОЛЬКО то, что реально запускал и видел. Не ври и не преувеличивай.

## Объяснения — по-русски, для человека с нулевым опытом
- \`statement_ru\` — что просят, своими словами
- \`how_to_think\` — ГЛАВНОЕ поле: как дойти до решения самому. Что дано, что надо получить, какой приём применить и почему именно он. Ход мысли, а не пересказ кода
- \`line_by_line\` — разбор по строкам: строка кода, под ней что делает и зачем. Не пропускай ничего, даже заголовок цикла
- \`terms\` — каждый термин из решения одним предложением ("срез — список значений переменной длины"). Обязательно: руна, байт, срез, указатель, os.Args, рекурсия, стек — всё что встретилось
- \`pitfalls\` — на чём заваливаются: ловушки условия, краевые случаи

Без аналогий (ученик прямо просил), без воды, без похвал. Каждое предложение — факт.

Верни объект по схеме: по одному элементу на каждое из ${g.tasks.length} заданий.`
}

log(`Добиваю ${GROUPS.length} групп, ${GROUPS.reduce((n,g)=>n+g.tasks.length,0)} заданий`)

const res = await parallel(GROUPS.map(g => () =>
  agent(prompt(g), { label: `разбор:${g.id}`, phase: 'Разбор', schema: SCHEMA })
    .then(r => ({ group: g, solutions: r?.solutions || [] }))
))

const ok = res.filter(Boolean)
log(`Готово: ${ok.reduce((n,r)=>n+r.solutions.length,0)} заданий разобрано`)

return {
  groups: ok.map(r => ({ id: r.group.id, question: r.group.q, percent: r.group.pct, solutions: r.solutions })),
}
