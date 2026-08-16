// Проверка данных темы: структура, двуязычность и реальный вывод Go.
const fs = require("fs"), path = require("path"), os = require("os"), cp = require("child_process");
const DIR = __dirname;

function loadData(file){
  const src = fs.readFileSync(path.join(DIR, "data", file), "utf8");
  const sandbox = src + "\nmodule.exports={META,INTRO:(typeof INTRO!=='undefined'?INTRO:null),OUTRO:(typeof OUTRO!=='undefined'?OUTRO:null),RULES,TRAPS,EXAMPLES,TASKS,BANK,QA,SCENARIOS," +
                  "TABLE: (typeof TABLE!=='undefined'?TABLE:null)};";
  const tmp = path.join(os.tmpdir(), "vd-" + file);
  fs.writeFileSync(tmp, sandbox);
  delete require.cache[tmp];
  return require(tmp);
}

function bilingual(o, p, bad){
  if(typeof o === "function") return bad;
  if(o && typeof o === "object" && !Array.isArray(o)){
    const k = Object.keys(o);
    if((k.includes("ru") || k.includes("en")) && !(k.includes("ru") && k.includes("en"))) bad.push(p);
    k.forEach(x => bilingual(o[x], p + "." + x, bad));
  } else if(Array.isArray(o)) o.forEach((x,i) => bilingual(x, p+"["+i+"]", bad));
  return bad;
}

function runGo(code, dir){
  fs.writeFileSync(path.join(dir, "main.go"), code + "\n");
  const r = cp.spawnSync("go", ["run", "."], {cwd: dir, encoding: "utf8", timeout: 40000});
  return (r.stdout && r.stdout.length ? r.stdout : (r.stderr || "")).trim();
}

function check(file){
  const d = loadData(file);
  const issues = [];
  const say = m => issues.push(m);

  if(!d.META || !d.META.slug) say("нет META.slug");
  if(!d.RULES || d.RULES.length < 5) say(`правил ${d.RULES ? d.RULES.length : 0}, нужно 5-7`);
  if(!d.TRAPS || d.TRAPS.length < 4) say(`ловушек ${d.TRAPS ? d.TRAPS.length : 0}, нужно 4-6`);
  if(!d.EXAMPLES || d.EXAMPLES.length < 10) say(`примеров ${d.EXAMPLES ? d.EXAMPLES.length : 0}, нужно минимум 10`);
  if(!d.TASKS || d.TASKS.length !== 10) say(`задач ${d.TASKS ? d.TASKS.length : 0}, нужно 10`);
  if(!d.BANK || d.BANK.length !== 20) say(`вопросов ${d.BANK ? d.BANK.length : 0}, нужно 20`);
  if(!d.QA || d.QA.length < 6) say(`Q&A ${d.QA ? d.QA.length : 0}, нужно 6-8`);
  if(!d.SCENARIOS || d.SCENARIOS.length < 3) say(`сценариев ${d.SCENARIOS ? d.SCENARIOS.length : 0}, нужно 3-5`);

  (d.BANK||[]).forEach((q,i) => {
    if(!q.opts || q.opts.length !== 4) say(`вопрос ${i+1}: вариантов ${q.opts?q.opts.length:0}`);
    if(q.ok !== 0) say(`вопрос ${i+1}: ok=${q.ok}, должен быть 0`);
    if(!q.why) say(`вопрос ${i+1}: нет объяснения`);
  });

  // сценарий может быть параметрическим: code/steps — функции от значений регуляторов
  (d.SCENARIOS||[]).forEach((s,i) => {
    const params = s.params || [];
    const sets = [];
    if(params.length){
      const mins = {}, defs = {}, maxs = {};
      params.forEach(p => {
        const def = (p.def !== undefined) ? p.def : (p.values ? p.values[0] : p.min);
        defs[p.key] = def;
        mins[p.key] = p.values ? p.values[0] : (p.text ? def : p.min);
        maxs[p.key] = p.values ? p.values[p.values.length-1] : (p.text ? def : p.max);
      });
      sets.push(["min",mins], ["def",defs], ["max",maxs]);
      params.forEach(p => {
        if(!p.key) say(`сценарий ${i+1}: у параметра нет key`);
        if(!p.label || !p.label.ru || !p.label.en) say(`сценарий ${i+1}: параметр ${p.key} без двуязычной подписи`);
        if(!p.values && !p.text && !(typeof p.min === "number" && typeof p.max === "number"))
          say(`сценарий ${i+1}: параметр ${p.key} без min/max`);
      });
    } else {
      sets.push(["", {}]);
    }

    sets.forEach(([tag, p]) => {
      let code, steps;
      try {
        code  = (typeof s.code  === "function") ? s.code(p)  : s.code;
        steps = (typeof s.steps === "function") ? s.steps(p) : s.steps;
      } catch(e){
        say(`сценарий ${i+1}${tag?" ("+tag+")":""}: падает — ${e.message}`);
        return;
      }
      if(!steps || !steps.length){ say(`сценарий ${i+1}${tag?" ("+tag+")":""}: нет шагов`); return; }

      // шаг должен быть один на строку: заголовки циклов и условия нельзя перепрыгивать
      if(tag !== "max"){
        const seen = new Set(steps.map(st => st.line));
        // прогон мог кончиться раньше кода: os.Exit / return / panic на последнем шаге
        // обрывают программу, и всё, что ниже, в этом прогоне недостижимо — шагов там быть не может
        const lastLine = steps[steps.length-1].line;
        const stopped = /^(os\.Exit\(|return\b|panic\()/.test(String(code[lastLine] || "").trim());
        const limit = stopped ? lastLine : code.length - 1;
        const skipped = [];
        code.forEach((ln, k) => {
          if(k > limit) return;
          const s = ln.trim();
          if(!s || s === "}" || s === "{" || s.startsWith("//")) return;
          if(/^(package|import|func |type |var .*struct)/.test(s)) return;   // объявления не выполняются
          if(/^\}?\s*else\s*\{?$/.test(s)) return;
          if(!/^(for |if |switch |case |return|fmt\.|os\.)/.test(s) && !/(:=|=[^=])/.test(s)) return;
          if(!seen.has(k)) skipped.push((k+1) + ": " + s.slice(0, 34));
        });
        // ветки, которые при этих параметрах не выполняются, — это нормально;
        // сигналим только про циклы и условия, мимо которых пройти нельзя
        const hard = skipped.filter(x => /:\s*(for |if )/.test(x));
        if(hard.length) say(`сценарий ${i+1}${tag?" ("+tag+")":""}: перепрыгивает строки — ${hard.slice(0,3).join(" | ")}`);
      }
      if(steps.length > 60) say(`сценарий ${i+1} (${tag}): ${steps.length} шагов — слишком длинный прогон`);
      let prevOut = "";
      steps.forEach((st,j) => {
        if(st.line >= code.length) say(`сценарий ${i+1}${tag?" ("+tag+")":""} шаг ${j+1}: line=${st.line}, а строк ${code.length}`);
        if(!st.note || !st.note.ru || !st.note.en) say(`сценарий ${i+1}${tag?" ("+tag+")":""} шаг ${j+1}: подпись не на двух языках`);
        const out = st.out || "";
        if(out.indexOf(prevOut) !== 0) say(`сценарий ${i+1}${tag?" ("+tag+")":""} шаг ${j+1}: вывод не продолжает предыдущий`);
        prevOut = out;
      });
    });
  });

  const bad = bilingual(d, "", []);
  if(bad.length) say(`односторонний перевод: ${bad.slice(0,4).join(", ")}${bad.length>4?" и ещё "+(bad.length-4):""}`);

  // прогон примеров
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "gochk-"));
  fs.writeFileSync(path.join(dir, "go.mod"), "module chk\n\ngo 1.21\n");
  let okRun = 0;
  (d.EXAMPLES||[]).forEach((ex,i) => {
    if(!/^package main/.test(ex.code.trim())) { say(`пример ${i+1}: не начинается с package main`); return; }
    const got = runGo(ex.code, dir);
    if(got === String(ex.out).trim()) okRun++;
    else say(`пример ${i+1}: ожидалось ${JSON.stringify(String(ex.out).trim().slice(0,60))}, реально ${JSON.stringify(got.slice(0,90))}`);
  });
  fs.rmSync(dir, {recursive:true, force:true});

  return {file, slug: d.META && d.META.slug, issues, okRun, total: (d.EXAMPLES||[]).length};
}

const files = process.argv.slice(2).length ? process.argv.slice(2)
            : fs.readdirSync(path.join(DIR,"data")).filter(f=>f.endsWith(".js")).sort();
let bad = 0;
files.forEach(f => {
  let r;
  try { r = check(f); }
  catch(e){ console.log(`\n❌ ${f}: не загружается — ${e.message.split("\n")[0]}`); bad++; return; }
  const head = `${r.slug || f}: примеры ${r.okRun}/${r.total}`;
  if(!r.issues.length) console.log(`✅ ${head}`);
  else { bad++; console.log(`❌ ${head}`); r.issues.forEach(m => console.log(`     · ${m}`)); }
});
console.log(bad ? `\nтем с замечаниями: ${bad}` : `\n✅ все ${files.length} тем чистые`);
