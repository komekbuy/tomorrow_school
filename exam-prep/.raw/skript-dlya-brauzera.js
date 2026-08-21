// ========================================================================
//  Забрать эталонные решения 01-edu одним заходом.
//  Открыть https://sourcegraph.com/github.com/01-edu/go-tests
//  F12 -> Console -> вставить это -> Enter -> дождаться -> скачается файл
// ========================================================================
const names = [
  "only1",
  "onlya",
  "onlyb",
  "onlyf",
  "onlyz",
  "checknumber",
  "countalpha",
  "countcharacter",
  "printif",
  "printifnot",
  "rectperimeter",
  "retainfirsthalf",
  "cameltosnakecase",
  "countrepeats",
  "digitlen",
  "firstword",
  "fishandchips",
  "gcd",
  "hashcode",
  "lastword",
  "longestword",
  "repeatalpha",
  "searchreplace",
  "wordanatomy",
  "cleanstr",
  "expandstr",
  "findprevprime",
  "fromto",
  "iscapitalized",
  "itoa",
  "passwordentropy",
  "printmemory",
  "printrevcomb",
  "thirdtimeisacharm",
  "weareunique",
  "zipstring",
  "addprimesum",
  "canjump",
  "chunk",
  "concatalternate",
  "concatslice",
  "fprime",
  "hiddenp",
  "inter",
  "reversestrcap",
  "saveandmiss",
  "union",
  "wdmatch",
  "fifthandskip",
  "notdecimal",
  "revconcatalternate",
  "slice",
  "findpairs",
  "revwstr",
  "rostring",
  "wordflip",
  "itoabase",
  "options",
  "piglatin",
  "romannumbers",
  "brackets",
  "rpncalc",
  "brainfuck",
  "grouping"
];

const base = "https://sourcegraph.com/github.com/01-edu/go-tests/-/raw/solutions/";
const out = [];
let ok = 0, fail = 0;

for (const n of names) {
  try {
    const r = await fetch(base + n + ".go");
    if (r.ok) {
      const t = await r.text();
      if (t.includes("package solutions")) {
        out.push("===== " + n + ".go =====\n" + t);
        ok++;
      } else { out.push("===== " + n + ".go ===== НЕ ФАЙЛ (пришла страница)"); fail++; }
    } else { out.push("===== " + n + ".go ===== HTTP " + r.status); fail++; }
  } catch (e) {
    out.push("===== " + n + ".go ===== ОШИБКА " + e.message); fail++;
  }
  console.log(ok + fail, "/", names.length, n);
  await new Promise(r => setTimeout(r, 250));   // пауза, чтобы не словить лимит
}

console.log("ГОТОВО. Получено:", ok, "не вышло:", fail);

const blob = new Blob([out.join("\n\n")], {type: "text/plain"});
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "etalony-01edu.txt";
a.click();
