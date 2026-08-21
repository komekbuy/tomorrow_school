# -*- coding: utf-8 -*-
"""Собирает один справочник: задание -> ожидаемый вывод -> код решения."""
import io, os, re, json, textwrap

BASE='/Users/komekbuy/Projects/tomorrow_school/exam-prep'
SUBJ='/Users/komekbuy/Projects/tomorrow_school/tmp/01edu-public/subjects'
OUT=BASE+'/otvety/VSE-ZADANIYA-kod-i-vyvod.txt'

PLAN = {
 1:  (5,   ['only1','onlya','onlyb','onlyf','onlyz']),
 2:  (10,  ['checknumber','countalpha','countcharacter','printif','printifnot','rectperimeter','retainfirsthalf']),
 3:  (20,  ['cameltosnakecase','countrepeats','digitlen','firstword','fishandchips','gcd','hashcode','lastword','longestword','repeatalpha','searchreplace','wordanatomy']),
 4:  (35,  ['cleanstr','expandstr','findprevprime','fromto','iscapitalized','itoa','passwordentropy','printmemory','printrevcomb','thirdtimeisacharm','weareunique','zipstring']),
 5:  (50,  ['addprimesum','canjump','chunk','concatalternate','concatslice','fprime','hiddenp','inter','reversestrcap','saveandmiss','union','wdmatch']),
 6:  (65,  ['fifthandskip','notdecimal','revconcatalternate','slice']),
 7:  (75,  ['findpairs','revwstr','rostring','wordflip']),
 8:  (85,  ['itoabase','options','piglatin','romannumbers']),
 9:  (95,  ['brackets','rpncalc']),
 10: (100, ['brainfuck','grouping']),
}

ISPRAVLENO = {'wordflip','fifthandskip','canjump','cameltosnakecase','notdecimal',
              'only1','onlya','onlyb','onlyf','onlyz','expandstr','fprime','brackets',
              'romannumbers','options','piglatin','grouping','rpncalc','findpairs'}

def etalon_exists(name):
    return os.path.exists(BASE+'/.raw/etalon/%s.go'%name) or os.path.isdir(BASE+'/.raw/etalon-prog/'+name)

def our_code(name):
    p1=BASE+'/piscine/%s.go'%name
    p2=BASE+'/programs/%s/main.go'%name
    if os.path.exists(p1): return io.open(p1,encoding='utf-8').read(), 'функция'
    if os.path.exists(p2): return io.open(p2,encoding='utf-8').read(), 'программа'
    return None, '?'

def instructions(name):
    """Текст задания из README школы, дословно."""
    p=os.path.join(SUBJ,name,'README.md')
    if not os.path.exists(p): return None
    t=io.open(p,encoding='utf-8').read()
    m=re.search(r'###\s*Instructions\s*\n(.*?)(?=\n###|\n##\s|\Z)', t, re.S)
    if not m: return None
    body=m.group(1).strip()
    body=re.sub(r'```go\n.*?```', '', body, flags=re.S)   # код прототипа уберём, он отдельно
    body=re.sub(r'\n{3,}', '\n\n', body).strip()
    return body or None

def readme_blocks(name):
    p=os.path.join(SUBJ,name,'README.md')
    if not os.path.exists(p): return None, None
    t=io.open(p,encoding='utf-8').read()
    proto=None
    m=re.search(r'###\s*Expected [Ff]unction.*?```go\n(.*?)```', t, re.S)
    if m:
        fm=re.search(r'^func .*$', m.group(1), re.M)
        if fm: proto=fm.group(0).rstrip(' {').strip()
    outs=re.findall(r'```console\n(.*?)```', t, re.S)
    return proto, (outs[-1].rstrip() if outs else None)

import subprocess
def actual_output(name, kind):
    """Прогоняет решение-программу и показывает, что оно печатает (с маркером конца строки)."""
    if kind != 'программа': return None
    d=BASE+'/programs/'+name
    try:
        r=subprocess.run(['go','run','.'], cwd=d, capture_output=True, text=True, timeout=60)
    except Exception:
        return None
    if r.returncode != 0: return None
    out=r.stdout
    if out=='' : return ["$ go run .", "(ничего не печатает)"]
    lines=out.split("\n")
    res=["$ go run . | cat -e"]
    for i,l in enumerate(lines):
        if i==len(lines)-1 and l=='': continue
        res.append(l+"$")
    if not out.endswith("\n") and lines:
        res[-1]=lines[-1]+"   <- БЕЗ перевода строки в конце"
    return res

W=78
def hr(c='-'): return c*W

parts=[]
parts.append(hr('='))
parts.append("  ВСЕ ЗАДАНИЯ ЭКЗАМЕНА: ОЖИДАЕМЫЙ ВЫВОД И ГОТОВЫЙ КОД")
parts.append(hr('='))
parts.append("")
parts.append(textwrap.fill(
 "Справочник по всем заданиям экзамена. На каждое: условие своими словами, дословный "
 "текст задания от школы, ожидаемый вывод и готовый код решения. "
 "Подробные разборы с ходом мысли — в файлах vopros-01..10.txt.", W))
parts.append("")
parts.append("  ПОМЕТКИ:")
parts.append("    [КОД ЭТАЛОНА ШКОЛЫ]         — приведён РОВНО тот код, с которым бот сверяет ответ")
parts.append("    [БЕЗ ЭТАЛОНА — наше решение] — эталон достать не удалось, код написан нами и")
parts.append("                                   проверен по примерам задания")
parts.append("")
parts.append(textwrap.fill(
 "Эталон — это решение, с которым бот школы сравнивает твой ответ. Получен из репозитория "
 "проверки 01-edu/go-tests. Там, где текст задания расходится с эталоном, верен эталон — "
 "поэтому в коде ниже приведён именно эталон, без наших переделок.", W))
parts.append("")

D=json.load(io.open(BASE+'/.raw/solutions.json',encoding='utf-8'))
stats={'сверен':0,'исправлен':0,'без эталона':0}
for q,(pct,tasks) in sorted(PLAN.items()):
    parts.append("")
    parts.append(hr('='))
    parts.append("  ВОПРОС %d ЭКЗАМЕНА   —   %d%%   —   заданий: %d" % (q,pct,len(tasks)))
    parts.append(hr('='))
    for t in tasks:
        code, kind = our_code(t)
        proto, expected = readme_blocks(t)
        if etalon_exists(t):
            mark = "[КОД ЭТАЛОНА ШКОЛЫ]"
            stats['сверен'] += 1
        else:
            mark = "[БЕЗ ЭТАЛОНА — наше решение]"
            stats['без эталона'] += 1
        parts.append("")
        title = "  %s  " % t.upper()
        parts.append(title + "." * max(4, W-len(title)-len(mark)-2) + " " + mark)
        parts.append("  тип: %s" % kind)
        if proto:
            parts.append("  прототип: %s" % proto)

        ru = D.get(t,{}).get('statement_ru')
        if ru:
            parts.append("")
            parts.append("  ЗАДАНИЕ (своими словами):")
            for l in textwrap.wrap(ru, W-6):
                parts.append("      " + l)

        ins = instructions(t)
        if ins:
            parts.append("")
            parts.append("  ТЕКСТ ЗАДАНИЯ (дословно из школы):")
            for para in ins.split("\n"):
                if not para.strip():
                    parts.append("")
                    continue
                for l in textwrap.wrap(para.strip(), W-6):
                    parts.append("      " + l)
        else:
            parts.append("")
            parts.append("  ТЕКСТ ЗАДАНИЯ: в публичной репе школы отсутствует")
        if expected:
            parts.append("")
            parts.append("  ОЖИДАЕМЫЙ ВЫВОД:")
            for l in expected.split("\n"):
                parts.append("      " + l)
        else:
            parts.append("")
            real = actual_output(t, kind)
            if real:
                parts.append("  ОЖИДАЕМЫЙ ВЫВОД: примера в задании нет; фактический вывод решения")
                parts.append("  (символ $ показывает конец строки, как делает cat -e):")
                for l in real:
                    parts.append("      " + l)
            else:
                parts.append("  ОЖИДАЕМЫЙ ВЫВОД: примера в задании нет")
        parts.append("")
        parts.append("  КОД:")
        if code:
            for l in code.rstrip().split("\n"):
                parts.append("      " + l)
        else:
            parts.append("      (решения нет)")
        parts.append("")

parts.append("")
parts.append(hr('='))
parts.append("  ИТОГО")
parts.append(hr('='))
parts.append("    код эталона школы:             %d" % stats['сверен'])
parts.append("    наше решение (эталона нет):    %d" % stats['без эталона'])
parts.append("    всего заданий:                 %d" % sum(stats.values()))
parts.append("")

io.open(OUT,'w',encoding='utf-8').write("\n".join(parts)+"\n")
print("готово:", OUT)
print("строк:", len(parts))
for k,v in stats.items(): print("   %-14s %d" % (k,v))
