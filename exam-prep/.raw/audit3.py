# -*- coding: utf-8 -*-
"""Строгая проверка: строки БЕЗ русских букв в разборе считаются цитатами кода
и должны дословно встречаться в решении."""
import json, re
d=json.load(open('.raw/solutions.json',encoding='utf-8'))
RU=re.compile(r'[а-яёА-ЯЁ]')
CODEY=re.compile(r'(:=|\bfunc\b|\bfor\b|\bif\b|\breturn\b|\bvar\b|\bimport\b|\bpackage\b|\bswitch\b|\bcase\b|\+\+|--|==|!=)')
def norm(s): return re.sub(r'\s+','',s)

bad={}
for name in sorted(d):
    e=d[name]; code=e.get('solution_code',''); lbl=e.get('line_by_line','')
    if not code or not lbl: continue
    flat=norm(code)
    miss=[]
    for line in lbl.split('\n'):
        l=line.strip()
        if len(l)<5 or RU.search(l): continue          # объяснения пропускаем
        if not CODEY.search(l): continue                # не код — пропускаем
        if l.startswith('//'): continue
        l2=re.sub(r'\s*//.*$','',l).strip()             # хвостовой комментарий отрезаем
        if not l2: continue
        if norm(l2) not in flat:
            miss.append(l2[:72])
    if miss: bad[name]=miss

print("ЗАДАНИЙ С ЧУЖИМИ СТРОКАМИ КОДА: %d из %d\n" % (len(bad), len(d)))
for n,ms in sorted(bad.items(), key=lambda x:-len(x[1])):
    print("❌ %-20s %d" % (n, len(ms)))
    for m in ms[:4]: print("      %s" % m)
