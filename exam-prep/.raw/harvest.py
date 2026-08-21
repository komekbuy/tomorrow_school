# -*- coding: utf-8 -*-
import json, os, glob, sys
RAW='/Users/komekbuy/Projects/tomorrow_school/exam-prep/.raw/solutions.json'
found=json.load(open(RAW,encoding='utf-8'))
before=len(found)
dirs=sys.argv[1:]
def harvest(obj):
    def walk(x):
        if isinstance(x,dict):
            if isinstance(x.get('solutions'),list):
                for s in x['solutions']:
                    if isinstance(s,dict) and s.get('task') and s.get('solution_code'):
                        if s['task'] not in found: found[s['task']]=s
            for v in x.values(): walk(v)
        elif isinstance(x,list):
            for v in x: walk(v)
        elif isinstance(x,str) and '"solutions"' in x:
            try: walk(json.loads(x))
            except Exception: pass
    walk(obj)
for D in dirs:
    files=[os.path.join(D,'journal.jsonl')]+glob.glob(os.path.join(D,'agent-*.jsonl'))
    for f in files:
        if not os.path.exists(f): continue
        for line in open(f,encoding='utf-8',errors='replace'):
            if 'solutions' not in line: continue
            try: harvest(json.loads(line))
            except Exception: pass
json.dump(found, open(RAW,'w',encoding='utf-8'), ensure_ascii=False, indent=1)
print("было %d, стало %d (+%d)" % (before,len(found),len(found)-before))
for t in ['brainfuck','grouping']:
    print(("  %s: " % t) + ("ЕСТЬ" if t in found else "нет"))
