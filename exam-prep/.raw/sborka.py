#!/usr/bin/env python3
# Собирает vopros-01.txt .. vopros-10.txt из solutions.json
import json, os, textwrap, sys

BASE = '/Users/komekbuy/Projects/tomorrow_school/exam-prep'
RAW  = os.path.join(BASE, '.raw', 'solutions.json')
OUT  = os.path.join(BASE, 'otvety')

# вопрос -> (процент, [задания в порядке списка школы])
PLAN = {
 1:  (5,   ['only1','onlya','onlyb','onlyf','onlyz']),
 2:  (10,  ['checknumber','countalpha','countcharacter','printif','printifnot','rectperimeter','retainfirsthalf']),
 3:  (20,  ['cameltosnakecase','countrepeats','digitlen','firstword','fishandchips','gcd','hashcode','lastword','longestword','repeatalpha','searchreplace','wordanatomy']),
 4:  (35,  ['cameltosnakecase','cleanstr','expandstr','findprevprime','fromto','iscapitalized','itoa','passwordentropy','printmemory','printrevcomb','thirdtimeisacharm','weareunique','zipstring']),
 5:  (50,  ['addprimesum','canjump','chunk','concatalternate','concatslice','fprime','hiddenp','inter','reversestrcap','saveandmiss','union','wdmatch']),
 6:  (65,  ['fifthandskip','notdecimal','revconcatalternate','slice']),
 7:  (75,  ['findpairs','revwstr','rostring','wordflip']),
 8:  (85,  ['itoabase','options','piglatin','romannumbers']),
 9:  (95,  ['brackets','rpncalc']),
 10: (100, ['brainfuck','grouping']),
}

# каких заданий нет в публичной репе школы
NET_SUBJECTA = set()
IZ_KESHA = {'countrepeats','longestword','wordanatomy','passwordentropy'}

# в каком наборе встречается (по списку с портала)
TOLKO_ZERO = {'searchreplace','cleanstr','expandstr'}
TOLKO_CHECKPOINT = {'countrepeats','longestword','wordanatomy','passwordentropy','slice'}

W = 78
def line(ch='='): return ch * W
def wrap(t, indent=''):
    out = []
    for para in (t or '').split('\n'):
        if not para.strip():
            out.append('')
            continue
        out.extend(textwrap.wrap(para, width=W-len(indent),
                   initial_indent=indent, subsequent_indent=indent,
                   break_long_words=False, break_on_hyphens=False))
    return '\n'.join(out)

def block(title, body, ch='-'):
    if not body or not str(body).strip():
        return ''
    return f"\n{ch*W}\n  {title}\n{ch*W}\n{body}\n"

def code_block(code):
    if not code: return ''
    return '\n'.join('    ' + l for l in code.rstrip().split('\n'))

def main():
    sols = json.load(open(RAW, encoding='utf-8'))
    os.makedirs(OUT, exist_ok=True)
    itogo_est, itogo_net = 0, []

    for q, (pct, tasks) in sorted(PLAN.items()):
        # cameltosnakecase в вопросе 3 только для checkpoint-zero, в вопросе 4 только для Checkpoint
        parts = []
        parts.append(line('='))
        parts.append(f"  ВОПРОС {q} ЭКЗАМЕНА   —   уровень {pct}%")
        parts.append(line('='))
        parts.append('')
        parts.append(wrap(
            "На экзамене этот вопрос выпадает одним из перечисленных ниже заданий. "
            "Какое именно — заранее неизвестно, поэтому разобрать надо все. "
            "ИИ на экзамене запрещён: цель этого файла не в том, чтобы ты списал код, "
            "а в том, чтобы понял ход мысли и написал сам."))
        parts.append('')
        parts.append(f"  Заданий в этом вопросе: {len(tasks)}")
        parts.append('')
        parts.append("  СПИСОК:")
        for i, t in enumerate(tasks, 1):
            metka = ''
            if t in TOLKO_ZERO: metka = '   [только в наборе checkpoint-zero]'
            elif t in TOLKO_CHECKPOINT: metka = '   [только в наборе Checkpoint]'
            est = '' if t in sols else '   *** РАЗБОРА НЕТ, см. конец файла ***'
            if t in IZ_KESHA: est += '   [прототип из кода бота-проверяльщика]'
            parts.append(f"    {i:2}. {t}{metka}{est}")
        parts.append('')
        parts.append(wrap("Как читать каждое задание: сначала «ЧТО ПРОСЯТ» и «КАК ДУМАТЬ» — "
                          "закрой код и попробуй решить сам. Только потом смотри решение и разбор."))
        parts.append('')

        nomer = 0
        for t in tasks:
            s = sols.get(t)
            if not s:
                itogo_net.append((q, t))
                continue
            nomer += 1
            itogo_est += 1
            parts.append('')
            parts.append('#' * W)
            parts.append(f"#  ВОПРОС {q} · ЗАДАНИЕ {nomer} из {len(tasks)}:  {t.upper()}")
            kind = 'ПРОГРАММА (пишется целиком, package main)' if s.get('kind')=='program' else 'ФУНКЦИЯ (пишется в пакет piscine)'
            parts.append(f"#  Тип: {kind}")
            parts.append('#' * W)

            parts.append(block('ЧТО ПРОСЯТ СДЕЛАТЬ', wrap(s.get('statement_ru',''), '  ')))

            if s.get('prototype'):
                parts.append(block('ПРОТОТИП — переписывать БУКВА В БУКВУ',
                    code_block(s['prototype']) + "\n\n" +
                    wrap("Бот школы сверяет подпись функции посимвольно. Другое имя, другой "
                         "порядок или тип параметров, лишний или недостающий возврат — задача не засчитана.", '  ')))

            parts.append(block('КАК ДУМАТЬ НАД ЗАДАЧЕЙ (читать до кода)', wrap(s.get('how_to_think',''), '  ')))
            parts.append(block('ГОТОВОЕ РЕШЕНИЕ', code_block(s.get('solution_code',''))))
            parts.append(block('РАЗБОР ПО СТРОКАМ', s.get('line_by_line','')))

            terms = s.get('terms') or []
            if terms:
                body = '\n'.join(wrap('* ' + x, '  ') for x in terms)
                parts.append(block('ТЕРМИНЫ, КОТОРЫЕ ЗДЕСЬ ВСТРЕТИЛИСЬ', body))

            pit = s.get('pitfalls') or []
            if pit:
                body = '\n'.join(wrap('* ' + x, '  ') for x in pit)
                parts.append(block('ГДЕ ЗАВАЛИВАЮТСЯ НА ЭТОЙ ЗАДАЧЕ', body))

            parts.append(block('ЧЕМ ПРОВЕРИТЬ СЕБЯ', code_block(s.get('test_program',''))))
            parts.append(block('ЧТО БЫЛО ПРОВЕРЕНО ЗАПУСКОМ', wrap(s.get('verification',''), '  ')))

        # хвост: чего не хватает
        nety = [t for t in tasks if t not in sols]
        if nety:
            parts.append('')
            parts.append(line('!'))
            parts.append("  ЧЕГО В ЭТОМ ФАЙЛЕ НЕТ")
            parts.append(line('!'))
            for t in nety:
                if t in NET_SUBJECTA:
                    parts.append(wrap(f"* {t} — задания нет в публичной репе школы 01-edu (проверены все 807 "
                                      f"папок subjects, ни по имени папки, ни по имени функции). Оно есть только "
                                      f"в закрытом наборе Checkpoint. Чтобы получить разбор, нужен текст subject "
                                      f"с портала: Instructions + Expected function + Usage.", '  '))
                else:
                    parts.append(wrap(f"* {t} — разбор не готов.", '  '))
            parts.append('')

        text = '\n'.join(parts).rstrip() + '\n'
        path = os.path.join(OUT, f'vopros-{q:02d}.txt')
        open(path, 'w', encoding='utf-8').write(text)
        print(f"vopros-{q:02d}.txt  вопрос {q} ({pct}%)  заданий с разбором: {nomer}/{len(tasks)}  строк: {text.count(chr(10))}")

    print()
    print("итого разобрано:", itogo_est)
    if itogo_net:
        print("без разбора:", ', '.join(f'Q{q}:{t}' for q, t in itogo_net))

main()
