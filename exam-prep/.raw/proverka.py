#!/usr/bin/env python3
"""Независимая сверка решений с README школы.
Учитывает, что в README вывод показан через `cat -e` — символ $ в конце строки."""
import os, re, subprocess, glob, sys

SUBJ='/Users/komekbuy/Projects/tomorrow_school/tmp/01edu-public/subjects'
WORK='/Users/komekbuy/Projects/tomorrow_school/exam-prep'

def readme_runs(name):
    """Возвращает список (аргументы, ожидаемые_строки, через_cat_e) из блоков console."""
    p=os.path.join(SUBJ,name,'README.md')
    if not os.path.exists(p): return []
    txt=open(p,encoding='utf-8').read()
    runs=[]
    for blk in re.findall(r'```console\n(.*?)```', txt, re.S):
        cur=None
        for line in blk.split('\n'):
            if line.startswith('$ go run'):
                if cur: runs.append(cur)
                cmd=line[len('$ go run'):].strip()
                cate = '| cat -e' in cmd or '|cat -e' in cmd
                cmd=re.sub(r'\|\s*cat\s+-e','',cmd).strip()
                args=cmd[1:].strip() if cmd.startswith('.') else ''
                cur={'args':args,'want':[],'cate':cate}
            elif line.startswith('$'):
                if cur: runs.append(cur); cur=None
            elif cur is not None:
                cur['want'].append(line)
        if cur: runs.append(cur)
    for r in runs:
        while r['want'] and r['want'][-1]=='': r['want'].pop()
        if r['cate']:
            r['want']=[l[:-1] if l.endswith('$') else l for l in r['want']]
    return runs

def split_args(s):
    return re.findall(r'"([^"]*)"|(\S+)', s) and [a or b for a,b in re.findall(r'"([^"]*)"|(\S+)', s)] or []

def run_dir(d, args):
    try:
        r=subprocess.run(['go','run','.']+args, cwd=d, capture_output=True, text=True, timeout=90)
        return r
    except Exception as e:
        return None

def check(kind, d, name):
    runs=readme_runs(name)
    if not runs: return ('SKIP','нет эталона в README')
    problems=[]
    for i,r in enumerate(runs):
        args=split_args(r['args'])
        res=run_dir(d,args)
        if res is None: return ('FAIL','таймаут или сбой запуска')
        if res.returncode!=0:
            return ('FAIL','не запускается: '+res.stderr.strip().split('\n')[0][:110])
        got=res.stdout.split('\n')
        while got and got[-1]=='': got.pop()
        want=r['want']
        # сравниваем только столько строк, сколько в эталоне (тестовая программа могла быть расширена)
        if got[:len(want)]!=want:
            problems.append(f"прогон {i+1} (args={args or 'нет'}): получено {got[:len(want)+1]} ожидалось {want}")
    if problems: return ('FAIL','; '.join(problems)[:400])
    return ('OK','')

ok=fail=skip=0
bad=[]
targets=[]
for d in sorted(glob.glob(os.path.join(WORK,'tests','*'))):
    targets.append(('function',d,os.path.basename(d)))
for d in sorted(glob.glob(os.path.join(WORK,'programs','*'))):
    targets.append(('program',d,os.path.basename(d)))

for kind,d,name in targets:
    st,msg=check(kind,d,name)
    if st=='OK': ok+=1
    elif st=='SKIP': skip+=1
    else: fail+=1; bad.append((kind,name,msg))

print(f"ИТОГО: совпало {ok} · разошлось {fail} · без эталона {skip}")
print()
for kind,name,msg in bad:
    print(f"  [{kind}] {name}\n      {msg}")
