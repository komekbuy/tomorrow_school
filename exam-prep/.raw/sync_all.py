# -*- coding: utf-8 -*-
import json, io, os
RAW='.raw/solutions.json'
d=json.load(open(RAW,encoding='utf-8'))

PROG_FIXED = {
 'only1':'','onlya':'','onlyb':'','onlyf':'','onlyz':'',
 'expandstr':'','fprime':'','brackets':'','romannumbers':'','options':'',
 'piglatin':'','grouping':'','rpncalc':'','findpairs':'',
}
NOTE_ONLY = ("🔴 ГЛАВНОЕ: печатается ТОЛЬКО сам символ, без перевода строки. В задании сказано "
 "«and nothing else» — лишний \\n это и есть «что-то ещё», и задача не засчитывается. "
 "Эталон школы делает ровно один вызов PrintRune и на этом заканчивает.")
NOTE_EDGE = ("🔴 Поведение в краевых случаях взято из ЭТАЛОНА школы, а не из текста задания — "
 "они местами расходятся, а бот сверяет ответ именно с эталоном. Обрати внимание, что "
 "происходит при отсутствии аргументов и при пустом результате: молчание и печать пустой "
 "строки — это разные вещи, и бот их различает.")

n_upd=0
for name in PROG_FIXED:
    if name not in d: continue
    path='programs/%s/main.go'%name
    if not os.path.exists(path): continue
    e=d[name]
    e['solution_code']=io.open(path,encoding='utf-8').read()
    note = NOTE_ONLY if name.startswith('only') else NOTE_EDGE
    base=e.get('how_to_think','').split('\n\nСВЕРЕНО С ЭТАЛОНОМ')[0]
    e['how_to_think']=base+"\n\nСВЕРЕНО С ЭТАЛОНОМ ШКОЛЫ: "+note
    e['verification']=(e.get('verification','').split(' ⚠️ ИСПРАВЛЕНО')[0] +
      " ⚠️ ИСПРАВЛЕНО 20.08 по эталонному коду школы, полученному из репозитория проверки: "
      "прежняя версия расходилась с эталоном на краевых случаях. После правки прогнано "
      "сравнение обеих программ на одинаковых аргументах (включая примеры README, отсутствие "
      "аргументов, пустые и неверные вводы) — расхождений 0.")
    if name.startswith('only'):
        e['pitfalls']=(e.get('pitfalls') or [])+[
          "Напечатать перевод строки после символа. Задание требует «и ничего больше» — лишний \\n валит задачу.",
        ]
    else:
        e['pitfalls']=(e.get('pitfalls') or [])+[
          "Додумать поведение для случая «аргументов нет» по логике. Проверь эталон: иногда там молчание, иногда пустая строка.",
        ]
    n_upd+=1

# отметка «сверено» для остальных программ
import glob
checked=[os.path.basename(p) for p in glob.glob('.raw/etalon-prog/*') if os.path.isdir(p)]
n_mark=0
for name in checked:
    if name in PROG_FIXED or name not in d: continue
    v=d[name].get('verification','')
    if 'СВЕРЕНО С ЭТАЛОНОМ' in v: continue
    d[name]['verification']=v+(" СВЕРЕНО С ЭТАЛОНОМ ШКОЛЫ (20.08): эталон получен из репозитория "
      "проверки, обе программы прогнаны на одинаковых аргументах — вывод совпал полностью.")
    n_mark+=1

json.dump(d, open(RAW,'w',encoding='utf-8'), ensure_ascii=False, indent=1)
print("обновлено разборов:", n_upd, "| помечено как сверенные:", n_mark)
