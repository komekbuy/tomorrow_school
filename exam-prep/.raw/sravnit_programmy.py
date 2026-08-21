# -*- coding: utf-8 -*-
"""Сравнивает наши программы с эталонами школы на одинаковых аргументах."""
import subprocess, os, random, string, sys

BASE='/Users/komekbuy/Projects/tomorrow_school/exam-prep'
OUR=BASE+'/programs'
ET=BASE+'/.raw/etalon-prog'
random.seed(20260820)

def rs(n, alpha):
    return ''.join(random.choice(alpha) for _ in range(n))

W  = "abc XYZ 019"
WS = "abc XYZ 019 \t"
NUM= "0123456789"
SYM= "()[]{}+-*/ 09ab"

def words(n=4, alpha="abcXYZ"):
    return ' '.join(rs(random.randint(1,5), alpha) for _ in range(random.randint(0,n)))

CASES={
 'only1':        [[] for _ in range(3)] + [["a"],["a","b"]],
 'onlya':        [[] for _ in range(3)] + [["x"]],
 'onlyb':        [[] for _ in range(3)] + [["x"]],
 'onlyf':        [[] for _ in range(3)] + [["x"]],
 'onlyz':        [[] for _ in range(3)] + [["x"]],
 'printrevcomb': [[]],
 'addprimesum':  [[str(random.randint(-5,60))] for _ in range(40)] + [[],["abc"],["0"],["1"],["2"],["-7"],["x","y"]],
 'fprime':       [[str(random.randint(-3,500))] for _ in range(40)] + [[],["0"],["1"],["225"],["abc"],["a","b"]],
 'hiddenp':      [[rs(random.randint(0,6),"abc"), rs(random.randint(0,9),"abc")] for _ in range(40)] + [[],["a"],["","abc"],["abc",""]],
 'inter':        [[rs(random.randint(0,8),"abc19"), rs(random.randint(0,8),"abc19")] for _ in range(40)] + [[],["a"]],
 'union':        [[rs(random.randint(0,8),"abc19"), rs(random.randint(0,8),"abc19")] for _ in range(40)] + [[],["a"]],
 'wdmatch':      [[rs(random.randint(0,7),"abc"), rs(random.randint(0,9),"abc")] for _ in range(40)] + [[],["a"]],
 'reversestrcap':[[words()] for _ in range(40)] + [[],[""],["  "],["a"],["ab cd"]],
 'searchreplace':[[rs(random.randint(0,8),"abc"),"a","z"] for _ in range(30)] + [[],["abc","a"],["abc","a","z","w"],["","a","z"]],
 'cleanstr':     [[rs(random.randint(0,12)," ab")] for _ in range(40)] + [[],[""],["   "],["a  b"],["a","b"]],
 'expandstr':    [[rs(random.randint(0,12)," ab")] for _ in range(40)] + [[],[""],["   "],["a  b"]],
 'revwstr':      [[words()] for _ in range(40)] + [[],[""],["a"],["a b c"]],
 'rostring':     [[words()] for _ in range(40)] + [[],[""],["a"],["a b c"]],
 'wordflip':     [[words()] for _ in range(20)],
 'findpairs':    [["[1, 2, 3, 4, 5]","6"],["[-1, 2, -3, 4, -5]","1"],["[1, 2, 3, 4, 5]","10"],
                  ["[-1, -2, -3, -4, -5]","-5"],["[1, 2, 3, 4, 20, -4, 5]","2 5"],
                  ["[1, 2, 3, 4, 20, p, 5]","5"],["[1, 2, 3, 4","5"],["1, 2, 3, 4","5"],
                  [],["[]","0"],["[1]","1"],["[ ]","2"],["[1,2]","3"],["[0, 0]","0"]],
 'options':      [[str(random.randint(0,40))] for _ in range(30)] + [[],["abc"],["0"],["7"]],
 'piglatin':     [[rs(random.randint(0,8),"abcdeiou")] for _ in range(40)] + [[],[""],["apple"],["trash"]],
 'romannumbers': [[str(random.randint(0,60))] for _ in range(40)] + [[],["abc"],["0"],["4"],["9"],["3999"]],
 'brackets':     [[rs(random.randint(0,8),SYM)] for _ in range(40)] + [["(johndoe)"],["([)]"],["","{[(0 + 0)(1 + 1)](3*(-1)){()}}"],[]],
 'rpncalc':      [["1 2 +"],["3 4 * 5 -"],["1 2 3 4 +"],["a b +"],[""],[],["5 0 /"],["2 3 4 * +"],["10 2 /"],["1 +"]],
 'brainfuck':    [["++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>."],
                  ["++++++++++[>++++++++++>++++++++++>++++++++++<<<-]>---.>--.>-.>++++++++++."],[],["+++."],["[]"]],
 'grouping':     [["(a)","I'm heavy, jumpsuit is on steady, Lighter when I'm lower, higher when I'm heavy"],
                  ["(e|n)","I currently have 4 windows opened up… and I don't know why."],
                  ["(hi)","He swore he just saw his sushi move."],["(s)",""],["i","Something in the air"],
                  [],["(a)","cat and dog"],["(a|)","cat"],["(a|b)","cab bad"]],
}

BIN='/private/tmp/claude-501/-Users-komekbuy-Projects-tomorrow-school/03244afa-8f31-41d5-afa4-8f2aa4ff3bb8/scratchpad/bins'
os.makedirs(BIN, exist_ok=True)

def build(d, tag):
    out=os.path.join(BIN, tag)
    if os.path.exists(out): return out
    r=subprocess.run(['go','build','-o',out,'.'], cwd=d, capture_output=True, text=True, timeout=120)
    return out if r.returncode==0 else None

def run(binpath, args):
    if binpath is None: return "NOBUILD", -1
    try:
        r=subprocess.run([binpath]+args, capture_output=True, text=True, timeout=20)
        return r.stdout, r.returncode
    except Exception as e:
        return "TIMEOUT:"+str(e)[:30], -1

names=sorted(n for n in os.listdir(OUR) if os.path.isdir(OUR+'/'+n))
total=diff=0
report={}
for n in names:
    if not os.path.isdir(ET+'/'+n): continue
    cases=CASES.get(n)
    if cases is None: continue
    bo=build(OUR+'/'+n, 'our_'+n)
    be=build(ET+'/'+n, 'et_'+n)
    bad=[]
    for args in cases:
        o,_=run(bo, args)
        e,_=run(be, args)
        total+=1
        if o!=e:
            diff+=1
            if len(bad)<2: bad.append((args,o,e))
    if bad: report[n]=bad
print("ПРОГРАММ СВЕРЕНО: %d · ЗАПУСКОВ: %d · РАСХОЖДЕНИЙ: %d\n" % (len([n for n in names if n in CASES and os.path.isdir(ET+'/'+n)]), total, diff))
if not report:
    print("✅ ВСЕ ПРОГРАММЫ СОВПАЛИ С ЭТАЛОНАМИ")
for n,bad in sorted(report.items(), key=lambda x:-len(x[1])):
    print("❌ %s" % n)
    for args,o,e in bad:
        print("     аргументы: %s" % (args if args else "(нет)"))
        print("     наш:    %r" % o[:120])
        print("     эталон: %r" % e[:120])
