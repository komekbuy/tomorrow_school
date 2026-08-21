# -*- coding: utf-8 -*-
import json, re
d=json.load(open('.raw/solutions.json',encoding='utf-8'))
PKGS=('fmt','os','strings','strconv','math','unicode','sort','bufio','regexp')

def imports_of(code):
    got=set()
    m=re.search(r'(?s)import\s*\((.*?)\)', code)
    if m: got |= set(re.findall(r'"([^"]+)"', m.group(1)))
    for mm in re.finditer(r'^import\s+"([^"]+)"', code, re.M): got.add(mm.group(1))
    return got

def funcs_of(code):
    return set(re.findall(r'^func\s+(?:\([^)]*\)\s*)?(\w+)', code, re.M))

problems={}
for name in sorted(d):
    e=d[name]; code=e.get('solution_code','')
    if not code: continue
    imp=imports_of(code); fns=funcs_of(code)
    text=" ".join(str(e.get(k,'')) for k in ('how_to_think','line_by_line','verification','test_program','statement_ru'))
    tl=text.lower()
    iss=[]

    # 1) текст утверждает «без пакета X», а пакет используется
    for pk in PKGS:
        if pk in imp and re.search(r'без (пакета )?%s'%pk, tl):
            iss.append("текст говорит «без %s», а код его использует" % pk)
    if imp - {'github.com/01-edu/z01'} and re.search(r'не подключает ничего|остал[аось]+ только os|переписано без пакет', tl):
        iss.append("текст говорит «без пакетов», а импорты: %s" % ", ".join(sorted(imp)))

    # 2) разбор упоминает функции, которых в коде нет
    lbl=e.get('line_by_line','')
    ghosts=set()
    for m in re.findall(r'\b([a-z][A-Za-z0-9]{5,})\s*\(', lbl):
        if m not in code and m not in ('append','string','printf','println','sprintf','strconv','strings','unicode'):
            ghosts.add(m)
    if ghosts: iss.append("разбор упоминает несуществующие функции: %s" % ", ".join(sorted(ghosts)[:5]))

    # 3) функции кода, вовсе не упомянутые в разборе
    miss=[f for f in fns if f not in ('main',) and f not in lbl]
    if miss and lbl: iss.append("в разборе не упомянуты функции кода: %s" % ", ".join(miss[:5]))

    # 4) следы прежних формулировок
    for frag in ('наша версия','наш вариант','мы переписали','мы пишем сами','наше решение строже'):
        if frag in tl: iss.append("следы прежней формулировки: «%s»" % frag)

    if iss: problems[name]=iss

print("ЗАДАНИЙ С ЗАМЕЧАНИЯМИ: %d из %d\n" % (len(problems), len(d)))
for n,iss in problems.items():
    print("❌ %s" % n)
    for i in iss: print("     - %s" % i)
