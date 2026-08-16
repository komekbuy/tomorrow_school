// Сборка курса: шаблон + все файлы тем -> одна страница index.html,
// плюс txt-файл по каждой теме на двух языках.
const fs = require("fs");
const path = require("path");
const os = require("os");

const DIR = __dirname;
const TPL = fs.readFileSync(path.join(DIR, "_template.html"), "utf8");
const RETURN = 'return {META:META, INTRO:(typeof INTRO!=="undefined"?INTRO:null), OUTRO:(typeof OUTRO!=="undefined"?OUTRO:null), RULES:RULES, TRAPS:TRAPS, EXAMPLES:EXAMPLES, TASKS:TASKS,' +
               ' BANK:BANK, QA:QA, SCENARIOS:SCENARIOS, TABLE:(typeof TABLE!=="undefined"?TABLE:null)};';

function dataFiles(){
  return fs.readdirSync(path.join(DIR, "data")).filter(f => f.endsWith(".js")).sort();
}

function readData(file){
  return fs.readFileSync(path.join(DIR, "data", file), "utf8");
}

/* Каждая тема живёт в своей области видимости, поэтому одинаковые имена
   переменных в разных файлах не конфликтуют. */
function wrap(src){
  return "TOPICS.push((function(){\n" + src + "\n" + RETURN + "\n})());";
}

function buildPage(files){
  const blocks = files.map(f => wrap(readData(f))).join("\n\n");
  const html = TPL.replace("__DATA__", blocks);
  const out = path.join(DIR, "index.html");
  fs.writeFileSync(out, html);
  return {out, size: Buffer.byteLength(html), count: files.length};
}

/* txt собирается тем же кодом, что и страница — расходиться они не могут */
function makeTxt(file, url){
  const tplJs = /<script>([\s\S]*)<\/script>/.exec(TPL)[1];
  const shared = tplJs.split("__DATA__")[0]
    .replace(/^\s*"use strict";\s*/, "")
    .replace(/var LANG\s*=\s*"ru";/, "")
    .replace(/var TOPICS = \[\];/, "");
  const strip  = /function strip\(html\)\{[\s\S]*?\n\}/.exec(tplJs)[0];
  const lineFn = /function line\(ch\)\{[\s\S]*?\}/.exec(tplJs)[0];
  const build  = /function buildTxt\(\)\{[\s\S]*?\n  return o\.join\("\\n"\);\n\}/.exec(tplJs)[0];
  const data = readData(file);

  const sandbox = `
var LANG="ru";
var location={href:${JSON.stringify(url || "")}};
function t(v){return (v&&typeof v==="object"&&(v.ru||v.en))?(v[LANG]||v.ru):v;}
${shared}
var D = (function(){
${data}
${RETURN}
})();
${strip}
${lineFn}
${build}
module.exports = function(l){ LANG = l; return buildTxt(); };`;

  const tmp = path.join(os.tmpdir(), "gen-" + file);
  fs.writeFileSync(tmp, sandbox);
  delete require.cache[tmp];
  const gen = require(tmp);
  const names = /txt:\s*\{ru:"([^"]+)",\s*en:"([^"]+)"\}/.exec(data);
  if(!names) throw new Error(file + ": в META нет txt:{ru,en}");
  fs.writeFileSync(path.join(DIR, "txt", names[1]), gen("ru") + "\n");
  fs.writeFileSync(path.join(DIR, "txt", names[2]), gen("en") + "\n");
  return [names[1], names[2]];
}

if(require.main === module){
  const url = process.env.GUIDE_URL || "";
  const files = dataFiles();
  fs.mkdirSync(path.join(DIR, "txt"), {recursive: true});
  const page = buildPage(files);
  console.log(`index.html — ${files.length} тем, ${(page.size/1024).toFixed(0)} КБ`);
  files.forEach(f => {
    try { console.log("  txt: " + makeTxt(f, url).join(", ")); }
    catch(e){ console.log(`  ❌ ${f}: ${e.message.split("\n")[0]}`); }
  });
}

module.exports = {buildPage, makeTxt, dataFiles};
