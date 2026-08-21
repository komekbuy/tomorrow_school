# -*- coding: utf-8 -*-
"""Строгая проверка: строки кода, процитированные в разборе, должны быть в решении."""
import json, re
d=json.load(open('.raw/solutions.json',encoding='utf-8'))

def norm(s):
    return re.sub(r'\s+','', s)

CODEY=re.compile(r'(:=|^\s*(func|for|if|return|var|import|package|switch|case)\b|\+\+|==|!=|\breturn\b)')
bad={}
for name in sorted(d):
    e=d[name]; code=e.get('solution_code',''); lbl=e.get('line_by_line','')
    if not code or not lbl: continue
    codeset={norm(l) for l in code.split('\n') if norm(l)}
    codeflat=norm(code)
    missing=[]
    for line in lbl.split('\n'):
        l=line.strip()
        if len(l)<6 or not CODEY.search(l): continue
        if l.startswith('//') or l.startswith('*'): continue
        n=norm(l)
        # цитата считается «своей», если она встречается в коде хотя бы как подстрока
        if n not in codeflat:
            missing.append(l[:70])
    if missing:
        bad[name]=missing

print("ЗАДАНИЙ, ГДЕ РАЗБОР ЦИТИРУЕТ ЧУЖОЙ КОД: %d из %d\n" % (len(bad), len(d)))
for n,ms in sorted(bad.items(), key=lambda x:-len(x[1])):
    print("❌ %-20s строк не из кода: %d" % (n, len(ms)))
    for m in ms[:3]: print("      %s" % m)
