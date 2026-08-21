// ========================================================================
//  ВТОРОЙ ЗАХОД: эталоны заданий-ПРОГРАММ.
//  Они лежат не в solutions/<имя>.go, а в подпапке solutions/<имя>/main.go —
//  поэтому в прошлый раз были 404.
//  Открыть https://sourcegraph.com/github.com/01-edu/go-tests
//  F12 -> Console -> вставить -> Enter -> скачается файл
// ========================================================================
const names = [
  "only1",
  "onlya",
  "onlyb",
  "onlyf",
  "onlyz",
  "countcharacter",
  "searchreplace",
  "cleanstr",
  "expandstr",
  "printrevcomb",
  "addprimesum",
  "fprime",
  "hiddenp",
  "inter",
  "reversestrcap",
  "union",
  "wdmatch",
  "findpairs",
  "revwstr",
  "rostring",
  "options",
  "piglatin",
  "romannumbers",
  "brackets",
  "rpncalc",
  "brainfuck",
  "grouping",
  "itoa",
  "printmemory",
  "findprevprime"
];

const base = "https://sourcegraph.com/github.com/01-edu/go-tests/-/raw/solutions/";
const out = [];
let ok = 0, fail = 0;

for (const n of names) {
  // пробуем оба варианта: подпапка с main.go и файл с дефисом
  const tries = [n + "/main.go", n + ".go", n.replace("countcharacter","count-character") + ".go"];
  let done = false;
  for (const t of tries) {
    try {
      const r = await fetch(base + t);
      if (r.ok) {
        const txt = await r.text();
        if (txt.includes("package ")) {
          out.push("===== " + n + " (" + t + ") =====\n" + txt);
          ok++; done = true; break;
        }
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 120));
  }
  if (!done) { out.push("===== " + n + " ===== НЕ НАЙДЕН"); fail++; }
  console.log(ok + fail, "/", names.length, n, done ? "ok" : "нет");
}

console.log("ГОТОВО. Получено:", ok, "не вышло:", fail);
const blob = new Blob([out.join("\n\n")], {type: "text/plain"});
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "etalony-programmy.txt";
a.click();
