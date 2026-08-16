var META = {
  n: 5,
  slug: "05-strings",
  eyebrow:{ru:"Go с нуля · тема 5 из 13", en:"Go from zero · topic 5 of 13"},
  title:  {ru:"Строки, руны и байты", en:"Strings, runes and bytes"},
  lede:{
    ru:"Строка в Go — это байты, а не буквы. Пока это не улеглось, <code>len</code> считает не то, <code>s[i]</code> выдаёт числа, а кириллица разваливается пополам.",
    en:"A string in Go is bytes, not letters. Until that settles, <code>len</code> counts the wrong thing, <code>s[i]</code> gives numbers, and non-Latin text falls apart mid-letter."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=3907s",
    t:{ru:"Курс по Go — глава «Переменные» (1:05:07)", en:"Go course — the “Variables” chapter (1:05:07)"},
    d:{ru:"Отдельной главы про строки в курсе нет — основы строк даются здесь, вместе с типами.", en:"The course has no separate chapter on strings — the basics are covered here, alongside types."}},
  folder: "str1",
  txt: {ru:"go-tema-05-stroki-runy-bayty.txt", en:"go-topic-05-strings-runes-bytes.txt"}
};

/* ================= О ЧЁМ ТЕМА ================= */
var INTRO = {
 ru:`<p>Текст в программе — это тип <code>string</code>. Из него состоит всё, что программа получает от человека и показывает обратно: слово, имя, строка ввода, сообщение об ошибке. Разобрав тему, ты сможешь посчитать, сколько в тексте символов, достать любую букву по её номеру, отрезать кусок, собрать из старого слова новое — перевернуть его, выбросить пробелы, поменять регистр, — и сравнить две строки между собой.</p>
<p>Загвоздка одна, и она в самом начале. Go хранит текст не как список букв, а как набор чисел — байтов. Пока в строке только латиница, разницы не видно: одна буква занимает ровно один байт, и всё сходится. Как только появляется кириллица, всё расходится:</p>
<pre><code>s := "Дом"
fmt.Println(len(s))          <span class="cm">// 6, хотя букв три</span>
fmt.Println(string(s[0]))    <span class="cm">// Ð, хотя первая буква Д</span></code></pre>
<p>Ничего при этом не сломалось. <code>len</code> честно ответил, сколько байтов занимает строка, а <code>s[0]</code> честно достал первый байт — но буква «Д» состоит из двух байтов, и один байт из двух сам по себе не значит ничего. Пока это не улеглось, любая задача на текст будет работать на английских словах и разваливаться на русских, то есть ошибку ты увидишь не сразу.</p>
<p>Поэтому разбор идёт от устройства строки к работе с ней. Сначала — из чего строка состоит на самом деле и почему <code>len</code> считает не то, что кажется. Отсюда сразу следует, что даёт обращение по индексу <code>s[i]</code> и почему нужен другой способ перебора — <code>range</code>, который выдаёт целые символы. Дальше — перевод строки в символы и обратно, <code>[]rune</code> и <code>string</code>: он понадобится, потому что строку в Go нельзя изменить, ни одну букву в ней. Из этого запрета вырастает главный приём темы — сборка новой строки по кусочку в цикле. И в конце — срез <code>s[a:b]</code> и сравнение строк: обе операции снова упираются в байты и коды, так что к тому моменту читаться они будут почти без объяснений.</p>`,
 en:`<p>Text in a program is the type <code>string</code>. Everything a program takes from a person and shows back is made of it: a word, a name, a line of input, an error message. Once you have this topic, you can count how many characters a text has, take any letter by its position, cut a piece out, build a new word out of an old one — reverse it, drop the spaces, switch the case — and compare two strings.</p>
<p>There is one catch, and it sits right at the start. Go keeps text not as a list of letters but as a set of numbers — bytes. While the text is Latin only, you never notice: one letter takes exactly one byte and everything adds up. The moment non-Latin text appears, it stops adding up:</p>
<pre><code>s := "Дом"
fmt.Println(len(s))          <span class="cm">// 6, though there are three letters</span>
fmt.Println(string(s[0]))    <span class="cm">// Ð, though the first letter is Д</span></code></pre>
<p>Nothing broke here. <code>len</code> honestly answered how many bytes the string takes, and <code>s[0]</code> honestly pulled the first byte — but the letter “Д” is made of two bytes, and one byte out of two means nothing on its own. Until this settles, every text task will work on English words and fall apart on Russian ones, which means you will not see the mistake right away.</p>
<p>So the walkthrough goes from how a string is built to how you work with it. First — what a string really consists of and why <code>len</code> counts something other than what you expect. From that follows immediately what indexing <code>s[i]</code> gives you, and why you need a different way to walk a string: <code>range</code>, which yields whole characters. Then — converting a string into characters and back, <code>[]rune</code> and <code>string</code>: you need it because a string in Go cannot be changed, not by a single letter. Out of that ban grows the main technique of the topic — building a new string piece by piece in a loop. And at the end — the slice <code>s[a:b]</code> and string comparison: both come back to bytes and codes, so by then they read almost without explanation.</p>`
};

/* ================= ПРАВИЛА ================= */
var RULES = [
{
 h:{ru:"Строка — это байты, и <code>len</code> считает байты",
    en:"A string is bytes, and <code>len</code> counts bytes"},
 b:{ru:`<p>Начинать надо с того, что лежит внутри строки. А лежит там не список букв, а последовательность чисел — байтов. Байт — это число от 0 до 255, и одна буква не обязана помещаться в одно такое число.</p>
<p>Поэтому <code>len</code> у строки отвечает на вопрос «сколько байтов», а не «сколько букв»:</p>
<pre><code>len("Go")    <span class="cm">// 2</span>
len("Дом")   <span class="cm">// 6, а не 3</span></code></pre>
<p>Сколько байтов уходит на символ, зависит от самого символа: латинская буква, цифра, пробел и знак препинания — один байт, кириллическая буква — два, иероглиф — три, эмодзи — четыре. Это не выдумка Go: так устроена кодировка UTF-8, в которой хранится текст.</p>
<p>Увидеть это можно прямо — попросить показать строку числами:</p>
<pre><code>fmt.Println([]byte("Дом"))   <span class="cm">// [208 148 208 190 208 188]</span></code></pre>
<p>Шесть чисел на три буквы, по два на каждую. Букв в памяти нет вообще: есть только эти числа, а буквы появляются в тот момент, когда строку печатают.</p>
<p>Если считать, что <code>len</code> даёт количество букв, ошибка вылезет не сразу: на <code>"hello"</code> ответ будет верным, потому что там байт и буква совпадают. Тем она и опасна. Количество символов даёт другая запись — <code>len([]rune(s))</code>, до неё дойдём в четвёртом правиле.</p>`,
    en:`<p>Start with what is inside a string. What is inside is not a list of letters but a sequence of numbers — bytes. A byte is a number from 0 to 255, and a letter is not obliged to fit into one of them.</p>
<p>So <code>len</code> on a string answers “how many bytes”, not “how many letters”:</p>
<pre><code>len("Go")    <span class="cm">// 2</span>
len("Дом")   <span class="cm">// 6, not 3</span></code></pre>
<p>How many bytes a character takes depends on the character: a Latin letter, a digit, a space and a punctuation mark take one byte, a Cyrillic letter takes two, a Chinese character three, an emoji four. Go did not invent this — that is how UTF-8, the encoding the text is stored in, works.</p>
<p>You can see it directly by asking for the string as numbers:</p>
<pre><code>fmt.Println([]byte("Дом"))   <span class="cm">// [208 148 208 190 208 188]</span></code></pre>
<p>Six numbers for three letters, two per letter. There are no letters in memory at all: there are only these numbers, and letters appear at the moment the string is printed.</p>
<p>If you assume <code>len</code> gives the letter count, the mistake will not show up right away: on <code>"hello"</code> the answer is correct, because there a byte and a letter are the same thing. That is what makes it dangerous. The character count comes from a different expression — <code>len([]rune(s))</code>, which we reach in rule four.</p>`}
},
{
 h:{ru:"<code>s[i]</code> даёт байт — число, а не букву",
    en:"<code>s[i]</code> gives a byte — a number, not a letter"},
 b:{ru:`<p>Раз внутри строки лежат байты, обращение по номеру не может дать ничего другого — только байт. <code>s[0]</code> — это не «первая буква», а «первое число».</p>
<pre><code>s := "Go"
fmt.Println(s[0])           <span class="cm">// 71</span>
fmt.Println(string(s[0]))   <span class="cm">// G</span></code></pre>
<p>Тип у <code>s[i]</code> — <code>byte</code>, число от 0 до 255. И печатается оно как число: <code>fmt.Println</code> не догадывается, что ты имел в виду букву, он видит число и печатает число. <code>string(...)</code> — это просьба показать то же самое число как символ: значение не меняется, меняется только способ показа.</p>
<p>На латинице такое обращение проходит незаметно — там байт и буква одно и то же. Разница вылезает на кириллице:</p>
<pre><code>s := "Дом"
fmt.Println(s[0])           <span class="cm">// 208</span>
fmt.Println(string(s[0]))   <span class="cm">// Ð  ← это не «Д»</span></code></pre>
<p>Буква «Д» — это пара байтов 208 и 148. По отдельности ни один из них буквой не является, поэтому <code>string(s[0])</code> показывает посторонний символ: тот, у которого код 208. И заметь, ничего при этом не ломается — программа собирается, запускается и молча выдаёт мусор.</p>
<p>Отсюда правило: <code>s[i]</code> берут тогда, когда байт нужен именно как байт — например, на строке, где заведомо только латиница и цифры. Чтобы получать целые символы, нужен другой способ.</p>`,
    en:`<p>Since a string holds bytes, indexing it cannot give anything else — only a byte. <code>s[0]</code> is not “the first letter”, it is “the first number”.</p>
<pre><code>s := "Go"
fmt.Println(s[0])           <span class="cm">// 71</span>
fmt.Println(string(s[0]))   <span class="cm">// G</span></code></pre>
<p>The type of <code>s[i]</code> is <code>byte</code>, a number from 0 to 255. And it prints as a number: <code>fmt.Println</code> has no idea you meant a letter, it sees a number and prints a number. <code>string(...)</code> asks for that same number to be shown as a character: the value stays, only the way it is shown changes.</p>
<p>With Latin text this slips by unnoticed — there a byte and a letter are the same thing. The difference shows up with Cyrillic:</p>
<pre><code>s := "Дом"
fmt.Println(s[0])           <span class="cm">// 208</span>
fmt.Println(string(s[0]))   <span class="cm">// Ð  ← this is not “Д”</span></code></pre>
<p>The letter “Д” is the pair of bytes 208 and 148. Neither of them is a letter on its own, so <code>string(s[0])</code> shows an unrelated character: the one with code 208. And notice that nothing breaks along the way — the program compiles, runs, and quietly prints garbage.</p>
<p>Hence the rule: reach for <code>s[i]</code> when you want a byte as a byte — on a string you know holds only Latin letters and digits, say. To get whole characters you need a different way.</p>`}
},
{
 h:{ru:"<code>range</code> идёт по буквам, но номер считает в байтах",
    en:"<code>range</code> walks letters, but the index counts bytes"},
 b:{ru:`<p>Этот другой способ — <code>range</code>. Он идёт по строке не байтами, а символами: сам разбирается, из скольких байтов состоит очередная буква, и отдаёт её целиком.</p>
<pre><code>for i, c := range "Дом" {
	fmt.Println(i, string(c))
}
<span class="cm">// 0 Д</span>
<span class="cm">// 2 о</span>
<span class="cm">// 4 м</span></code></pre>
<p>Шагов три — по числу букв. А <code>i</code> идёт 0, 2, 4, потому что <code>i</code> по-прежнему номер байта: того, с которого буква начинается. Единицу и тройку заняли вторые половинки букв, и отдельного шага для них нет.</p>
<p><code>c</code> здесь имеет тип <code>rune</code> — это целый символ, число с кодом буквы, а не половина буквы. Печатать его надо через <code>string(c)</code>: без обёртки на экран пойдёт код, 1044 вместо «Д».</p>
<p>Если номер не нужен, его выбрасывают подчёркиванием:</p>
<pre><code>for _, c := range s { ... }</code></pre>
<p>А если вместо <code>range</code> написать обычный цикл <code>for i := 0; i &lt; len(s); i++</code> и внутри брать <code>s[i]</code>, получится перебор по байтам — со всеми последствиями второго правила: на английском слове сойдётся, на русском развалится.</p>
<p>Чего <code>range</code> по строке не даёт — так это порядкового номера символа. Если нужен именно он, «третья буква», а не «байт номер 4», строку сначала переводят в символы.</p>`,
    en:`<p>That different way is <code>range</code>. It walks a string by characters, not by bytes: it works out how many bytes the next letter takes and hands the letter over whole.</p>
<pre><code>for i, c := range "Дом" {
	fmt.Println(i, string(c))
}
<span class="cm">// 0 Д</span>
<span class="cm">// 2 о</span>
<span class="cm">// 4 м</span></code></pre>
<p>Three steps — one per letter. But <code>i</code> goes 0, 2, 4, because <code>i</code> is still a byte offset: the one the letter starts at. Offsets 1 and 3 are taken by the second halves of the letters, and they get no step of their own.</p>
<p><code>c</code> here has the type <code>rune</code> — a whole character, a number holding the letter's code, not half of one. Print it through <code>string(c)</code>: without the wrapper the code goes to the screen, 1044 instead of “Д”.</p>
<p>If you don't need the offset, drop it with an underscore:</p>
<pre><code>for _, c := range s { ... }</code></pre>
<p>And if instead of <code>range</code> you write a plain <code>for i := 0; i &lt; len(s); i++</code> and take <code>s[i]</code> inside, you get a walk over bytes — with everything rule two implies: fine on an English word, broken on a Russian one.</p>
<p>What <code>range</code> over a string does not give you is the position of the character. If that is what you need — “the third letter”, not “byte number 4” — you convert the string into characters first.</p>`}
},
{
 h:{ru:"<code>[]rune(s)</code> и <code>string(...)</code> переводят в обе стороны",
    en:"<code>[]rune(s)</code> and <code>string(...)</code> convert both ways"},
 b:{ru:`<p>Переводит одна запись — <code>[]rune(s)</code>. Она проходит строку от начала до конца и раскладывает её на символы: один элемент — один символ, сколько бы байтов он ни занимал.</p>
<pre><code>s := "Дом"
r := []rune(s)        <span class="cm">// [1044 1086 1084] — по одному числу на букву</span>
fmt.Println(len(r))   <span class="cm">// 3   символа</span>
fmt.Println(len(s))   <span class="cm">// 6   байтов</span>
back := string(r)     <span class="cm">// "Дом" — обратно в строку</span></code></pre>
<p>После такого перевода индексы становятся честными: <code>r[0]</code> — первый символ, <code>r[1]</code> — второй, на любом языке. Отсюда же и обещанный способ посчитать символы: <code>len([]rune(s))</code>.</p>
<p><code>string(...)</code> работает в обратную сторону и принимает как одну руну, так и целый слайс рун:</p>
<pre><code>string('Д')                   <span class="cm">// "Д"</span>
string([]rune{'Д','о','м'})   <span class="cm">// "Дом"</span></code></pre>
<p>Две вещи тут важны. Первая: <code>[]rune(s)</code> делает копию — отдельный набор чисел, лежащий рядом; исходная строка от этого не меняется. Вторая: за удобство платят проходом по всей строке, поэтому в руны переводят тогда, когда нужен доступ по номеру символа; для простого перебора хватает <code>range</code>.</p>
<p>Напрашивается вопрос: зачем копия, почему нельзя поправить строку на месте? Потому что на месте её поправить нельзя в принципе.</p>`,
    en:`<p>One expression does the conversion — <code>[]rune(s)</code>. It walks the string from start to end and lays it out as characters: one element is one character, no matter how many bytes it took.</p>
<pre><code>s := "Дом"
r := []rune(s)        <span class="cm">// [1044 1086 1084] — one number per letter</span>
fmt.Println(len(r))   <span class="cm">// 3   characters</span>
fmt.Println(len(s))   <span class="cm">// 6   bytes</span>
back := string(r)     <span class="cm">// "Дом" — back into a string</span></code></pre>
<p>After that conversion the indices become honest: <code>r[0]</code> is the first character, <code>r[1]</code> the second, in any language. This is also the promised way to count characters: <code>len([]rune(s))</code>.</p>
<p><code>string(...)</code> works the other way round and takes either a single rune or a whole slice of runes:</p>
<pre><code>string('Д')                   <span class="cm">// "Д"</span>
string([]rune{'Д','о','м'})   <span class="cm">// "Дом"</span></code></pre>
<p>Two things matter here. First: <code>[]rune(s)</code> makes a copy — a separate set of numbers sitting next to the string; the original does not change. Second: you pay for the convenience with a full pass over the string, so convert to runes when you need access by character position; for a plain walk <code>range</code> is enough.</p>
<p>The obvious question: why a copy, why not fix the string in place? Because in place it cannot be fixed at all.</p>`}
},
{
 h:{ru:"Строку изменить нельзя — можно собрать новую",
    en:"A string cannot be changed — you build a new one"},
 b:{ru:`<p>Строка в Go неизменяема: после того как она создана, её содержимое тронуть нельзя, и компилятор запрещает это прямо:</p>
<pre><code>s := "hello"
s[0] = 'H'   <span class="cm">// не соберётся: cannot assign to s[0]</span></code></pre>
<p>Запрет даёт понятную гарантию: если строка попала в переменную, никакой другой участок кода её не испортит. Строку можно передавать куда угодно и не проверять потом, что с ней стало. Плата за это — правку приходится делать в обход: разложить на руны, поправить копию, собрать строку заново.</p>
<pre><code>r := []rune(s)
r[0] = 'H'
s = string(r)
fmt.Println(s)   <span class="cm">// Hello</span></code></pre>
<p>Смотри, что здесь на самом деле произошло. <code>s = string(r)</code> старую строку не меняло — оно положило в переменную <b>новую</b>. Старая осталась какой была, просто на неё больше никто не смотрит. Изменилось не содержимое строки, а то, что лежит в переменной.</p>
<p>Отсюда следствие на всю тему: «заменить символ», «убрать пробелы», «сделать буквы заглавными» в Go всегда означает построить новую строку. Операции «поправить букву на месте» не существует, и искать её не надо.</p>`,
    en:`<p>A string in Go is immutable: once it has been created, its contents cannot be touched, and the compiler says so outright:</p>
<pre><code>s := "hello"
s[0] = 'H'   <span class="cm">// won't compile: cannot assign to s[0]</span></code></pre>
<p>The ban buys a clear guarantee: once a string is in a variable, no other piece of code can spoil it. You can pass the string anywhere and never check afterwards what happened to it. The price is that edits have to go around: convert to runes, fix the copy, rebuild the string.</p>
<pre><code>r := []rune(s)
r[0] = 'H'
s = string(r)
fmt.Println(s)   <span class="cm">// Hello</span></code></pre>
<p>Look at what actually happened. <code>s = string(r)</code> did not change the old string — it put a <b>new</b> one into the variable. The old one stayed exactly as it was, nobody just looks at it any more. What changed is not the contents of a string but what the variable holds.</p>
<p>Hence the consequence that runs through the whole topic: “replace a character”, “strip the spaces”, “make the letters uppercase” in Go always means building a new string. There is no “fix a letter in place” operation, and there is no point looking for one.</p>`}
},
{
 h:{ru:"Новая строка собирается накопителем, который начинается с пустой строки",
    en:"A new string is built with an accumulator that starts empty"},
 b:{ru:`<p>Строят новую строку всегда по одной схеме: заводят переменную-накопитель, кладут в неё пустую строку и в цикле приклеивают по куску.</p>
<pre><code>res := ""              <span class="cm">// накопитель — ДО цикла</span>
for _, c := range "abc" {
	res = res + string(c)
}
fmt.Println(res)       <span class="cm">// abc</span></code></pre>
<p>Пустая строка нужна как точка отсчёта: к ней уже можно прибавлять, и первый же шаг даёт строку из одного символа. <code>res += string(c)</code> — та же самая строчка, записанная короче.</p>
<p>Ломается схема обычно в двух местах. Первое — накопитель, объявленный внутри цикла: <code>res := ""</code> тогда выполняется на каждом шаге и стирает накопленное, а в конце остаётся один последний символ. Второе — <code>res + c</code> без обёртки: не соберётся, <code>mismatched types string and rune</code>. Причина из третьего правила: <code>c</code> — это число, а <code>+</code> у строк складывает строку со строкой.</p>
<p>Порядок склейки задаёт направление, и это не мелочь:</p>
<pre><code>res = res + string(c)   <span class="cm">// abc — новый символ справа</span>
res = string(c) + res   <span class="cm">// cba — новый символ слева</span></code></pre>
<p><code>if</code> перед склейкой решает, что вообще попадёт в новую строку, а выражение внутри <code>string(...)</code> — в каком виде попадёт. Пропустил пробелы — получил строку без пробелов; приклеил <code>string(c - 32)</code> вместо <code>string(c)</code> — получил заглавные. Почти любая задача на текст — это та же схема с другим условием внутри.</p>`,
    en:`<p>A new string is always built the same way: you make an accumulator variable, put an empty string into it, and glue a piece onto it in a loop.</p>
<pre><code>res := ""              <span class="cm">// the accumulator — BEFORE the loop</span>
for _, c := range "abc" {
	res = res + string(c)
}
fmt.Println(res)       <span class="cm">// abc</span></code></pre>
<p>The empty string is the starting point: you can already add to it, and the very first step yields a one-character string. <code>res += string(c)</code> is the same line written shorter.</p>
<p>The shape usually breaks in two places. First — the accumulator declared inside the loop: <code>res := ""</code> then runs on every step and wipes what was collected, so only the last character is left at the end. Second — <code>res + c</code> without the wrapper: it won't compile, <code>mismatched types string and rune</code>. The reason comes from rule three: <code>c</code> is a number, and <code>+</code> on strings joins a string with a string.</p>
<p>The order of the concatenation sets the direction, and that is not a detail:</p>
<pre><code>res = res + string(c)   <span class="cm">// abc — the new character on the right</span>
res = string(c) + res   <span class="cm">// cba — the new character on the left</span></code></pre>
<p>An <code>if</code> before the concatenation decides what gets into the new string, and the expression inside <code>string(...)</code> decides in what form. Skip the spaces and you get a string without spaces; glue <code>string(c - 32)</code> instead of <code>string(c)</code> and you get capitals. Almost every text task is this same shape with a different condition inside.</p>`}
},
{
 h:{ru:"Срез <code>s[a:b]</code> режет по байтам, сравнение идёт по кодам",
    en:"A slice <code>s[a:b]</code> cuts by bytes, comparison goes by codes"},
 b:{ru:`<p>Остались две операции, которые делают со строкой целиком, не разбирая её на символы: взять кусок и сравнить с другой строкой. Обе упираются в то, с чего начали, — в байты и коды.</p>
<pre><code>s := "Hello"
s[1:]    <span class="cm">// "ello"  с байта 1 и до конца</span>
s[:2]    <span class="cm">// "He"    с начала до байта 2, не включая его</span>
s[1:3]   <span class="cm">// "el"    длина куска 3 - 1 = 2</span></code></pre>
<p>Правая граница не входит. Из этого следует удобное: длина куска всегда <code>b - a</code>, а <code>s[2:2]</code> даёт пустую строку, а не один символ.</p>
<p>Числа в скобках — номера байтов, не символов. На латинице разницы не видно, на кириллице резать надо по краям букв: у <code>"Дом"</code> буква <code>Д</code> заняла байты 0 и 1, поэтому <code>s[2:]</code> даёт <code>"ом"</code>, а <code>s[1:]</code> — обрубок из половины буквы, ровно как во втором правиле. Если границы нужно считать в символах, строку сначала переводят в руны: <code>string([]rune(s)[1:])</code>.</p>
<p>Сравнивают строки обычными знаками, ничего специального не нужно:</p>
<pre><code>"abc" == "abc"       <span class="cm">// true</span>
"apple" &lt; "banana"   <span class="cm">// true — посимвольно, решает первое различие</span>
"Apple" &lt; "apple"    <span class="cm">// true — 'A' это 65, 'a' это 97</span></code></pre>
<p>Работает это потому, что сравниваются коды символов слева направо: как только коды разошлись, ответ известен и дальше смотреть незачем. Оттуда же и вся арифметика с буквами — в таблице кодов латинские буквы идут подряд, заглавные ровно на 32 раньше строчных, цифры тоже подряд. Поэтому <code>c - 32</code> делает строчную букву заглавной, <code>c + 32</code> — наоборот, а <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code> проверяет, что символ является цифрой.</p>`,
    en:`<p>Two operations are left, and both work on the string as a whole instead of taking it apart: cutting a piece out and comparing it with another string. Both come back to where we started — bytes and codes.</p>
<pre><code>s := "Hello"
s[1:]    <span class="cm">// "ello"  from byte 1 to the end</span>
s[:2]    <span class="cm">// "He"    from the start up to byte 2, not including it</span>
s[1:3]   <span class="cm">// "el"    length 3 - 1 = 2</span></code></pre>
<p>The right bound is excluded. A handy consequence: the length of the piece is always <code>b - a</code>, and <code>s[2:2]</code> gives an empty string, not one character.</p>
<p>The numbers in the brackets are byte offsets, not character positions. With Latin text you see no difference; with Cyrillic you must cut on letter edges: in <code>"Дом"</code> the letter <code>Д</code> took bytes 0 and 1, so <code>s[2:]</code> gives <code>"ом"</code> while <code>s[1:]</code> gives a stub made of half a letter — exactly as in rule two. If the bounds have to be counted in characters, convert to runes first: <code>string([]rune(s)[1:])</code>.</p>
<p>Strings compare with the usual operators, nothing special needed:</p>
<pre><code>"abc" == "abc"       <span class="cm">// true</span>
"apple" &lt; "banana"   <span class="cm">// true — character by character, the first difference decides</span>
"Apple" &lt; "apple"    <span class="cm">// true — 'A' is 65, 'a' is 97</span></code></pre>
<p>It works because character codes are compared left to right: as soon as two codes differ the answer is known and there is no point looking further. The same table gives you all the arithmetic on letters — Latin letters sit consecutively, capitals exactly 32 before lowercase, digits consecutively too. That is why <code>c - 32</code> turns a lowercase letter into a capital, <code>c + 32</code> does the opposite, and <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code> checks that a character is a digit.</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ ================= */
var TABLE = {
  title:{ru:"Что чем является", en:"What gives what"},
  intro:{ru:"Одна и та же строка через разные записи даёт разные вещи. Эту таблицу стоит держать перед глазами, пока она не выучится.",
         en:"The same string gives different things depending on how you touch it. Keep this table in sight until it sticks."},
  head:{ru:["Запись","Что получается","Тип"], en:["Expression","What you get","Type"]},
  rows:[
    ["len(s)", {ru:"число байтов", en:"number of bytes"}, "int"],
    ["len([]rune(s))", {ru:"число символов", en:"number of characters"}, "int"],
    ["s[i]", {ru:"один байт", en:"one byte"}, "byte"],
    ["s[a:b]", {ru:"кусок строки по байтам", en:"a piece of the string, by bytes"}, "string"],
    ["for i, c := range s", {ru:"i — номер байта, c — символ", en:"i is a byte offset, c is a character"}, "int, rune"],
    ["[]rune(s)", {ru:"все символы подряд", en:"all characters in a row"}, "[]rune"],
    ["[]byte(s)", {ru:"все байты подряд", en:"all bytes in a row"}, "[]byte"],
    ["string(r)", {ru:"руна как строка", en:"a rune as a string"}, "string"],
    ["string(rs)", {ru:"слайс рун как строка", en:"a rune slice as a string"}, "string"],
    ["a + b", {ru:"склейка двух строк", en:"two strings joined"}, "string"]
  ]
};

var TRAPS = [
 {ru:"<strong>Цикл <code>for i := 0; i &lt; len(s); i++</code> по строке.</strong> На <code>\"hello\"</code> он работает, ты проверяешь — всё хорошо. На <code>\"привет\"</code> тот же код выдаёт мусор: <code>s[i]</code> достаёт половину буквы. Строку перебирают через <code>range</code> или через <code>[]rune(s)</code>.",
  en:"<strong>The loop <code>for i := 0; i &lt; len(s); i++</code> over a string.</strong> On <code>\"hello\"</code> it works, you check it, all good. On <code>\"привет\"</code> the same code prints garbage: <code>s[i]</code> pulls half a letter. Walk a string with <code>range</code> or with <code>[]rune(s)</code>."},
 {ru:"<strong>Накопитель создан внутри цикла.</strong> <code>res := \"\"</code> должно стоять <em>до</em> <code>for</code>. Внутри он обнуляется на каждом шаге, и в конце в нём остаётся только последний символ. Ошибка одинаковая для строк, счётчиков и сумм.",
  en:"<strong>The accumulator created inside the loop.</strong> <code>res := \"\"</code> must sit <em>before</em> the <code>for</code>. Inside, it resets on every step and ends up holding only the last character. The same mistake hits strings, counters and sums alike."},
 {ru:"<strong><code>res += c</code>, где <code>c</code> — руна.</strong> Не соберётся: <code>mismatched types string and rune</code>. Руна — число, к строке его прибавить нельзя. Нужно <code>res += string(c)</code>.",
  en:"<strong><code>res += c</code> where <code>c</code> is a rune.</strong> Won't compile: <code>mismatched types string and rune</code>. A rune is a number and cannot be added to a string. Write <code>res += string(c)</code>."},
 {ru:"<strong><code>s[0] = 'H'</code>.</strong> Не соберётся: <code>cannot assign to s[0]</code>. Строку правят только через <code>[]rune(s)</code> и обратную сборку <code>string(r)</code>.",
  en:"<strong><code>s[0] = 'H'</code>.</strong> Won't compile: <code>cannot assign to s[0]</code>. A string is edited only through <code>[]rune(s)</code> and rebuilding with <code>string(r)</code>."},
 {ru:"<strong><code>string(n)</code> для числа даёт не цифру.</strong> <code>string(5)</code> — это символ с кодом 5, невидимый служебный знак, а не <code>\"5\"</code>. Программа соберётся, вывод будет пустым на вид. Цифру в строку переводят так: <code>string('0' + n)</code>, число целиком — <code>strconv.Itoa(n)</code>.",
  en:"<strong><code>string(n)</code> on a number is not a digit.</strong> <code>string(5)</code> is the character with code 5, an invisible control character, not <code>\"5\"</code>. The program compiles and the output looks empty. A digit becomes a character with <code>string('0' + n)</code>; a whole number needs <code>strconv.Itoa(n)</code>."},
 {ru:"<strong>Выход за границу строки роняет программу.</strong> <code>s[10]</code> у строки из трёх байтов даёт <code>index out of range [10] with length 3</code>. Компилятор это не ловит — длина известна только во время работы. Чаще всего вылезает на <code>s[i+1]</code> в цикле до <code>len(s)</code>.",
  en:"<strong>Going past the end of a string crashes the program.</strong> <code>s[10]</code> on a three-byte string gives <code>index out of range [10] with length 3</code>. The compiler doesn't catch it — the length is only known at run time. It usually shows up as <code>s[i+1]</code> in a loop running to <code>len(s)</code>."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

func main() {
	s := "Go"
	fmt.Println(s)
	fmt.Println(len(s))
}`,
 out:"Go\n2",
 why:{ru:"Две латинские буквы — два байта. Пока <code>len</code> совпадает с числом букв, и это совпадение скоро закончится.<br><b>Сломай:</b> поставь <code>s := \"Go!\"</code> и посчитай заранее, что выведет <code>len</code>.",
      en:"Two Latin letters, two bytes. For now <code>len</code> matches the letter count — that coincidence is about to end.<br><b>Break it:</b> set <code>s := \"Go!\"</code> and predict what <code>len</code> prints."}
},
{
 chg:{ru:"добавили печать первого элемента строки", en:"added printing the first element"},
 code:`package main

import "fmt"

func main() {
	s := "Go"
	fmt.Println(s)
	fmt.Println(len(s))
	fmt.Println(s[0])
}`,
 out:"Go\n2\n71",
 why:{ru:"Ждал букву — получил число. <code>s[0]</code> достаёт <b>байт</b>, а 71 — код символа «G».",
      en:"You expected a letter and got a number. <code>s[0]</code> pulls a <b>byte</b>, and 71 is the code of “G”."}
},
{
 chg:{ru:"обернули <code>s[0]</code> в <code>string</code>", en:"wrapped <code>s[0]</code> in <code>string</code>"},
 code:`package main

import "fmt"

func main() {
	s := "Go"
	fmt.Println(s)
	fmt.Println(len(s))
	fmt.Println(string(s[0]))
}`,
 out:"Go\n2\nG",
 why:{ru:"<code>string</code> говорит: «покажи это число как символ». Значение то же — изменился только тип.",
      en:"<code>string</code> says “show this number as a character”. The value is the same, only the type changed."}
},
{
 chg:{ru:"строка стала кириллической", en:"the string became Cyrillic"},
 code:`package main

import "fmt"

func main() {
	s := "Дом"
	fmt.Println(s)
	fmt.Println(len(s))
	fmt.Println(string(s[0]))
}`,
 out:"Дом\n6\nÐ",
 why:{ru:"Букв три, а <code>len</code> шесть. И вместо «Д» вылезло «Ð» — <code>s[0]</code> достал только первую половину буквы, и <code>string</code> честно показал символ с этим кодом. <b>Это и есть главная ловушка темы.</b>",
      en:"Three letters, but <code>len</code> says six. And instead of “Д” you get “Ð” — <code>s[0]</code> pulled only the first half of the letter, and <code>string</code> honestly showed the character with that code. <b>This is the central trap of the topic.</b>"}
},
{
 chg:{ru:"вместо одного байта печатаем все", en:"printing all the bytes instead of one"},
 code:`package main

import "fmt"

func main() {
	s := "Дом"
	fmt.Println(s)
	fmt.Println(len(s))
	fmt.Println([]byte(s))
}`,
 out:"Дом\n6\n[208 148 208 190 208 188]",
 why:{ru:"Вот вся строка изнутри: шесть чисел на три буквы, по два числа на букву. Никаких букв в памяти нет.<br><b>Сломай:</b> поставь <code>s := \"Go\"</code> и сравни — там будет два числа.",
      en:"Here is the whole string from inside: six numbers for three letters, two per letter. There are no letters in memory.<br><b>Break it:</b> set <code>s := \"Go\"</code> and compare — you'll see two numbers."}
},
{
 chg:{ru:"вместо печати байтов — цикл <code>range</code>", en:"a <code>range</code> loop instead of printing bytes"},
 code:`package main

import "fmt"

func main() {
	s := "Дом"
	fmt.Println(s)
	fmt.Println(len(s))
	for i, c := range s {
		fmt.Println(i, string(c))
	}
}`,
 out:"Дом\n6\n0 Д\n2 о\n4 м",
 why:{ru:"Буквы наконец целые. Но номера идут 0, 2, 4 — <code>i</code> считает байты, а не шаги. Шагов было три.",
      en:"The letters are whole at last. But the offsets go 0, 2, 4 — <code>i</code> counts bytes, not steps. There were three steps."}
},
{
 chg:{ru:"<code>range</code> идёт по <code>[]rune(s)</code>, а не по строке", en:"<code>range</code> walks <code>[]rune(s)</code>, not the string"},
 code:`package main

import "fmt"

func main() {
	s := "Дом"
	fmt.Println(s)
	fmt.Println(len(s))
	for i, c := range []rune(s) {
		fmt.Println(i, string(c))
	}
}`,
 out:"Дом\n6\n0 Д\n1 о\n2 м",
 why:{ru:"Одно изменение — и номера стали 0, 1, 2. По слайсу рун <code>range</code> идёт как по обычному списку: индекс — это номер символа. Так делают, когда нужен именно порядковый номер буквы.",
      en:"One change and the offsets became 0, 1, 2. Over a rune slice <code>range</code> behaves like over an ordinary list: the index is the character number. Use this when you actually need the letter's position."}
},
{
 chg:{ru:"правим руну и собираем строку обратно", en:"editing a rune and rebuilding the string"},
 code:`package main

import "fmt"

func main() {
	s := "Дом"
	r := []rune(s)
	r[0] = 'Т'
	fmt.Println(s)
	fmt.Println(string(r))
}`,
 out:"Дом\nТом",
 why:{ru:"Исходная строка не изменилась — правили копию, разложенную на руны. <b>Сломай:</b> напиши <code>s[0] = 'Т'</code> напрямую и прочитай ошибку.",
      en:"The original didn't change — you edited a rune copy. <b>Break it:</b> write <code>s[0] = 'Т'</code> directly and read the error."}
},
{
 chg:{ru:"вместо правки — сборка новой строки накопителем", en:"an accumulator building a new string instead of editing"},
 code:`package main

import "fmt"

func main() {
	s := "Дом"
	res := ""
	for _, c := range s {
		res = string(c) + res
	}
	fmt.Println(s)
	fmt.Println(res)
}`,
 out:"Дом\nмоД",
 why:{ru:"Каждый новый символ приписывается <b>слева</b>, поэтому строка растёт задом наперёд.<br><b>Сломай:</b> поменяй на <code>res = res + string(c)</code> и посмотри, что выйдет.",
      en:"Each new character is glued on the <b>left</b>, so the string grows backwards.<br><b>Break it:</b> change it to <code>res = res + string(c)</code> and see what comes out."}
},
{
 chg:{ru:"добавили срез и сравнение строк", en:"added a slice and a string comparison"},
 code:`package main

import "fmt"

func main() {
	s := "Дом"
	res := ""
	for _, c := range s {
		res = string(c) + res
	}
	fmt.Println(res)
	fmt.Println(s[2:], s[:2])
	fmt.Println(s == "Дом", s < "Кот")
}`,
 out:"моД\nом Д\ntrue true",
 why:{ru:"<code>s[2:]</code> даёт «ом», потому что буква «Д» заняла байты 0 и 1. <code>s &lt; \"Кот\"</code> — true: сравнение идёт по кодам, «Д» раньше «К».<br><b>Сломай:</b> напиши <code>s[1:]</code> и посмотри на обрубок.",
      en:"<code>s[2:]</code> gives “ом” because the letter “Д” took bytes 0 and 1. <code>s &lt; \"Кот\"</code> is true: comparison goes by codes and “Д” comes before “К”.<br><b>Break it:</b> write <code>s[1:]</code> and look at the broken stub."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"FirstByte", lvl:1, e:"10\n83\nS",
 d:{ru:"Для строки <code>\"Salem, Go!\"</code> напечатай на трёх строках: её длину, первый элемент как есть и его же как символ.",
    en:"For the string <code>\"Salem, Go!\"</code> print on three lines: its length, the first element as is, and the same element as a character."},
 h:{ru:"<code>len(s)</code>, затем <code>s[0]</code>, затем <code>string(s[0])</code>. Второе число — код символа.",
    en:"<code>len(s)</code>, then <code>s[0]</code>, then <code>string(s[0])</code>. The second number is a character code."}},

{t:"FirstAndLast", lvl:1, e:"G g",
 d:{ru:"Напечатай первую и последнюю букву строки <code>\"Golang\"</code> в одну строку через пробел.",
    en:"Print the first and the last letter of <code>\"Golang\"</code> on one line, separated by a space."},
 h:{ru:"Последний элемент — <code>s[len(s)-1]</code>. Минус единица нужна потому, что счёт идёт с нуля.",
    en:"The last element is <code>s[len(s)-1]</code>. The minus one is there because counting starts at zero."}},

{t:"BytesVsRunes", lvl:1, e:"9 6 3",
 d:{ru:"Для строки <code>\"Go дос\"</code> напечатай в одну строку: длину в байтах, количество символов и разницу между ними.",
    en:"For the string <code>\"Go дос\"</code> print on one line: the length in bytes, the number of characters, and the difference between them."},
 h:{ru:"Байты даёт <code>len(s)</code>, символы — <code>len([]rune(s))</code>. Разница — это лишние байты кириллицы.",
    en:"Bytes come from <code>len(s)</code>, characters from <code>len([]rune(s))</code>. The difference is the extra bytes the Cyrillic letters take."}},

{t:"Backwards", lvl:1, e:"edcba",
 d:{ru:"Напечатай строку <code>\"abcde\"</code> задом наперёд — одной строкой, без переносов внутри.",
    en:"Print the string <code>\"abcde\"</code> backwards — on one line, with no breaks inside."},
 h:{ru:"Цикл идёт с конца: <code>for i := len(s) - 1; i &gt;= 0; i--</code>. Печатай через <code>fmt.Print</code>, перенос в конце добавь отдельно.",
    en:"Loop from the end: <code>for i := len(s) - 1; i &gt;= 0; i--</code>. Print with <code>fmt.Print</code> and add the line break separately at the end."}},

{t:"CountVowels", lvl:2, e:"5",
 d:{ru:"Посчитай гласные буквы <code>a e i o u</code> в строке <code>\"programming in go\"</code> и напечатай их количество.",
    en:"Count the vowels <code>a e i o u</code> in the string <code>\"programming in go\"</code> and print how many there are."},
 h:{ru:"Счётчик создай до цикла. Внутри — <code>if c == 'a' || c == 'e' || ...</code>. Сравнивать руну с руной можно напрямую, это числа.",
    en:"Create the counter before the loop. Inside — <code>if c == 'a' || c == 'e' || ...</code>. A rune compares to a rune directly, they are numbers."}},

{t:"SliceParts", lvl:2, e:"omorrow\nTom\norr",
 d:{ru:"Для строки <code>\"Tomorrow\"</code> напечатай на трёх строках: всё без первого символа, первые три символа, и кусок с третьего по шестой не включая шестой.",
    en:"For the string <code>\"Tomorrow\"</code> print on three lines: everything except the first character, the first three characters, and the piece from index 3 up to but not including 6."},
 h:{ru:"<code>s[1:]</code>, <code>s[:3]</code>, <code>s[3:6]</code>. Правая граница не входит, поэтому в последнем куске ровно 6 − 3 = 3 символа.",
    en:"<code>s[1:]</code>, <code>s[:3]</code>, <code>s[3:6]</code>. The right bound is excluded, so the last piece has exactly 6 − 3 = 3 characters."}},

{t:"NoSpaces", lvl:2, e:"мыпишемкод",
 d:{ru:"Собери из строки <code>\"мы пишем код\"</code> новую строку без пробелов и напечатай её.",
    en:"Build a new string without spaces out of <code>\"мы пишем код\"</code> and print it."},
 h:{ru:"Накопитель <code>res := \"\"</code> до цикла. Внутри <code>if c != ' '</code>, и только тогда <code>res += string(c)</code>. Через <code>s[i]</code> не выйдет — кириллица развалится.",
    en:"Accumulator <code>res := \"\"</code> before the loop. Inside, <code>if c != ' '</code>, and only then <code>res += string(c)</code>. <code>s[i]</code> won't do — the Cyrillic breaks apart."}},

{t:"Palindrome", lvl:3, e:"true\nfalse",
 d:{ru:"Проверь, читается ли слово одинаково в обе стороны. Напечатай ответ для <code>\"шалаш\"</code> и для <code>\"привет\"</code>, каждый на своей строке.",
    en:"Check whether a word reads the same both ways. Print the answer for <code>\"шалаш\"</code> and for <code>\"привет\"</code>, each on its own line."},
 h:{ru:"Разложи на руны, собери перевёрнутую копию накопителем, сравни её с исходной строкой через <code>==</code>. Сравнивать надо строку со строкой.",
    en:"Convert to runes, build the reversed copy with an accumulator, compare it to the original with <code>==</code>. Compare a string to a string."}},

{t:"SumDigitsInString", lvl:3, e:"14",
 d:{ru:"В строке <code>\"a1b22c333\"</code> найди все цифры и напечатай их сумму как число.",
    en:"Find every digit in the string <code>\"a1b22c333\"</code> and print their sum as a number."},
 h:{ru:"Цифра — это символ в промежутке <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code>. Настоящее число из символа получается вычитанием: <code>c - '0'</code>. Складывать в <code>int</code> — значит написать <code>int(c - '0')</code>.",
    en:"A digit is a character in the range <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code>. The real number comes from subtracting: <code>c - '0'</code>. To add it into an <code>int</code>, write <code>int(c - '0')</code>."}},

{t:"SwapCase", lvl:3, e:"gO iS fUN",
 d:{ru:"Поменяй регистр каждой латинской буквы в строке <code>\"Go Is Fun\"</code>: строчные сделай заглавными, заглавные — строчными. Остальные символы оставь как есть.",
    en:"Swap the case of every Latin letter in <code>\"Go Is Fun\"</code>: lowercase becomes uppercase, uppercase becomes lowercase. Leave everything else as is."},
 h:{ru:"Три ветки: <code>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</code> → <code>c - 32</code>; <code>c &gt;= 'A' &amp;&amp; c &lt;= 'Z'</code> → <code>c + 32</code>; иначе символ без изменений. Каждый результат оборачивай в <code>string(...)</code> и приклеивай к накопителю.",
    en:"Three branches: <code>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</code> → <code>c - 32</code>; <code>c &gt;= 'A' &amp;&amp; c &lt;= 'Z'</code> → <code>c + 32</code>; otherwise the character unchanged. Wrap each result in <code>string(...)</code> and glue it onto the accumulator."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var CRASH = {ru:"упадёт при запуске", en:"crashes at run time"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};

var BANK = [
{q:Q_OUT, code:"fmt.Println(len(\"Дом\"))", opts:["6","3","4",NO], ok:0,
 why:{ru:"<code>len</code> считает байты, а кириллическая буква занимает два. Три буквы — шесть байтов. Буквы считает <code>len([]rune(s))</code>.",
      en:"<code>len</code> counts bytes and a Cyrillic letter takes two. Three letters, six bytes. To count letters use <code>len([]rune(s))</code>."}},

{q:Q_OUT, code:"s := \"Go\"\nfmt.Println(s[0])", opts:["71","G","\"G\"",NO], ok:0,
 why:{ru:"Обращение по индексу даёт <code>byte</code> — число. 71 это код символа «G». Букву покажет <code>string(s[0])</code>.",
      en:"Indexing gives a <code>byte</code> — a number. 71 is the code of “G”. <code>string(s[0])</code> shows the letter."}},

{q:Q_OUT, code:"s := \"Дом\"\nfmt.Println(string(s[0]))", opts:["Ð","Д","208",NO], ok:0,
 why:{ru:"<code>s[0]</code> достаёт байт 208 — это только первая половина буквы «Д». <code>string</code> показывает символ с кодом 208, а он к «Д» отношения не имеет. Половина буквы не значит ничего.",
      en:"<code>s[0]</code> pulls byte 208 — only the first half of the letter “Д”. <code>string</code> shows the character with code 208, which has nothing to do with “Д”. Half a letter means nothing."}},

{q:Q_OUT, code:"for i := range \"Дом\" {\n\tfmt.Print(i)\n}", opts:["024","012","0123","0246"], ok:0,
 why:{ru:"Шагов три — <code>range</code> идёт по буквам. Но <code>i</code> — это номер <b>байта</b>, с которого буква начинается: 0, 2, 4. Номера символов дал бы <code>range []rune(s)</code>.",
      en:"Three steps — <code>range</code> walks letters. But <code>i</code> is the <b>byte</b> offset where the letter starts: 0, 2, 4. Character positions would come from <code>range []rune(s)</code>."}},

{q:Q_OUT, code:"s := \"abcdef\"\nfmt.Println(s[1:3])", opts:["bc","bcd","ab","bcde"], ok:0,
 why:{ru:"Правая граница не входит: берутся элементы 1 и 2. Длина куска всегда <code>b - a</code>, здесь 3 − 1 = 2.",
      en:"The right bound is excluded: elements 1 and 2 are taken. The length is always <code>b - a</code>, here 3 − 1 = 2."}},

{q:Q_HAP, code:"s := \"hello\"\ns[0] = 'H'",
 opts:[NO, {ru:"s станет \"Hello\"", en:"s becomes \"Hello\""}, {ru:"s останется \"hello\"", en:"s stays \"hello\""}, CRASH], ok:0,
 why:{ru:"Ошибка: <code>cannot assign to s[0]</code>. Строка неизменяема. Порядок такой: <code>r := []rune(s)</code>, поправить <code>r[0]</code>, затем <code>s = string(r)</code>.",
      en:"Error: <code>cannot assign to s[0]</code>. A string is immutable. The way is: <code>r := []rune(s)</code>, fix <code>r[0]</code>, then <code>s = string(r)</code>."}},

{q:Q_OUT, code:"r := []rune(\"Дом\")\nfmt.Println(len(r), len(\"Дом\"))", opts:["3 6","6 3","3 3","6 6"], ok:0,
 why:{ru:"<code>[]rune</code> разбирает строку на символы — их три. Сама строка как была шестью байтами, так и осталась: перевод в руны создаёт копию, а не меняет строку.",
      en:"<code>[]rune</code> breaks the string into characters — there are three. The string itself is still six bytes: converting to runes makes a copy, it does not change the string."}},

{q:Q_OUT, code:"res := \"\"\nfor _, c := range \"abc\" {\n\tres = string(c) + res\n}\nfmt.Println(res)",
 opts:["cba","abc","c","a"], ok:0,
 why:{ru:"Новый символ приписывается <b>слева</b> от накопителя, поэтому строка растёт задом наперёд. Поменяй порядок на <code>res + string(c)</code> — получишь <code>abc</code>.",
      en:"The new character is glued to the <b>left</b> of the accumulator, so the string grows backwards. Swap to <code>res + string(c)</code> and you get <code>abc</code>."}},

{q:Q_HAP, code:"res := \"\"\nfor _, c := range \"abc\" {\n\tres += c\n}",
 opts:[NO, {ru:"res станет \"abc\"", en:"res becomes \"abc\""}, {ru:"res останется пустым", en:"res stays empty"}, CRASH], ok:0,
 why:{ru:"Ошибка: <code>mismatched types string and rune</code>. Руна — число, к строке его прибавить нельзя. Нужно <code>res += string(c)</code>.",
      en:"Error: <code>mismatched types string and rune</code>. A rune is a number and cannot be added to a string. Write <code>res += string(c)</code>."}},

{q:Q_OUT, code:"acc := \"\"\nfor i := 0; i < 3; i++ {\n\tacc += \"ab\"\n}\nfmt.Println(acc, len(acc))",
 opts:["ababab 6","ab 2","ababab 3","abababab 8"], ok:0,
 why:{ru:"Накопитель объявлен до цикла, поэтому куски складываются: три раза по два символа. <code>len</code> считает байты, латиница — байт на букву, значит 6. Если перенести <code>acc := \"\"</code> внутрь цикла, останется только <code>ab</code>.",
      en:"The accumulator is declared before the loop, so the pieces add up: three times two characters. <code>len</code> counts bytes and Latin takes one byte per letter, so 6. Move <code>acc := \"\"</code> inside the loop and only <code>ab</code> would be left."}},

{q:{ru:"Какой тип у <code>s[i]</code>, если <code>s</code> — строка?", en:"What is the type of <code>s[i]</code> when <code>s</code> is a string?"},
 code:null, opts:["byte","rune","string","int"], ok:0,
 why:{ru:"<code>byte</code> — число от 0 до 255. Не буква и не строка длиной один. <code>rune</code> получается из <code>range</code> или из <code>[]rune(s)</code>, и вот она уже целый символ.",
      en:"<code>byte</code> — a number from 0 to 255. Not a letter, not a one-character string. A <code>rune</code> comes from <code>range</code> or from <code>[]rune(s)</code>, and that one is a whole character."}},

{q:{ru:"Какой тип у <code>c</code> в <code>for _, c := range s</code>?", en:"What is the type of <code>c</code> in <code>for _, c := range s</code>?"},
 code:null, opts:["rune", "byte", "string", {ru:"зависит от строки", en:"depends on the string"}], ok:0,
 why:{ru:"<code>range</code> по строке выдаёт целые символы, поэтому <code>c</code> — <code>rune</code>. Это число, а не буква: чтобы напечатать букву, нужен <code>string(c)</code>.",
      en:"<code>range</code> over a string yields whole characters, so <code>c</code> is a <code>rune</code>. It is a number, not a letter: to print the letter you need <code>string(c)</code>."}},

{q:{ru:"Как посчитать количество символов в строке на любом языке?", en:"How do you count the characters of a string in any language?"},
 code:null, opts:["len([]rune(s))","len(s)","len(s) / 2","s.length"], ok:0,
 why:{ru:"<code>len(s)</code> даёт байты, и для кириллицы это вдвое больше нужного. Деление пополам тоже не спасёт: в смешанной строке латиница по байту, кириллица по два. Тот же верный ответ даст цикл <code>range</code> со счётчиком.",
      en:"<code>len(s)</code> gives bytes, which for Cyrillic is twice too many. Halving doesn't help either: in a mixed string Latin takes one byte and Cyrillic two. A <code>range</code> loop with a counter gives the same correct answer."}},

{q:{ru:"Что делает <code>[]rune(s)</code> с исходной строкой?", en:"What does <code>[]rune(s)</code> do to the original string?"},
 code:null,
 opts:[{ru:"ничего — создаётся отдельная копия", en:"nothing — a separate copy is created"},
       {ru:"превращает её в слайс на месте", en:"turns it into a slice in place"},
       {ru:"очищает её", en:"clears it"},
       {ru:"меняет её длину", en:"changes its length"}], ok:0,
 why:{ru:"Строка неизменяема, тронуть её нельзя в принципе. <code>[]rune(s)</code> собирает новый слайс. Правки в нём на строку не влияют — чтобы получить изменённую строку, её надо собрать обратно через <code>string(r)</code>.",
      en:"A string is immutable — it cannot be touched at all. <code>[]rune(s)</code> builds a new slice. Edits there don't affect the string; to get the changed string you must rebuild it with <code>string(r)</code>."}},

{q:{ru:"Где объявляют накопитель-строку?", en:"Where do you declare a string accumulator?"},
 code:null,
 opts:[{ru:"до цикла", en:"before the loop"},
       {ru:"внутри цикла", en:"inside the loop"},
       {ru:"после цикла", en:"after the loop"},
       {ru:"неважно", en:"doesn't matter"}], ok:0,
 why:{ru:"Внутри цикла <code>res := \"\"</code> выполняется на каждом шаге и стирает всё накопленное — в конце останется только последний кусок. Ровно та же ошибка бывает со счётчиками и суммами.",
      en:"Inside the loop, <code>res := \"\"</code> runs on every step and wipes everything collected — only the last piece survives. The exact same mistake happens with counters and sums."}},

{q:{ru:"Что означает <code>i</code> в <code>for i, c := range s</code>?", en:"What does <code>i</code> mean in <code>for i, c := range s</code>?"},
 code:null,
 opts:[{ru:"номер байта, с которого начинается символ", en:"the byte offset where the character starts"},
       {ru:"порядковый номер символа", en:"the position of the character"},
       {ru:"номер шага цикла", en:"the loop step number"},
       {ru:"код символа", en:"the character code"}], ok:0,
 why:{ru:"Для латиницы все три первых варианта совпадают, поэтому ошибка долго не всплывает. На кириллице <code>i</code> идёт 0, 2, 4 — шагов три, а номера прыгают через один. Порядковый номер символа даёт <code>range []rune(s)</code>.",
      en:"For Latin text the first three options coincide, so the mistake hides for a long time. With Cyrillic <code>i</code> goes 0, 2, 4 — three steps but the offsets jump. The character position comes from <code>range []rune(s)</code>."}},

{q:{ru:"Как сравнивается <code>\"apple\" &lt; \"banana\"</code>?", en:"How is <code>\"apple\" &lt; \"banana\"</code> compared?"},
 code:null,
 opts:[{ru:"посимвольно по кодам, решает первое различие", en:"character by character, the first difference decides"},
       {ru:"по длине строк", en:"by string length"},
       {ru:"по сумме кодов всех символов", en:"by the sum of all character codes"},
       {ru:"так сравнивать нельзя", en:"you cannot compare like that"}], ok:0,
 why:{ru:"Сравниваются коды символов слева направо, до первого различия: <code>'a'</code> это 97, <code>'b'</code> это 98, дальше можно не смотреть. Поэтому <code>\"Zebra\" &lt; \"apple\"</code> тоже true — заглавные идут раньше строчных.",
      en:"Character codes are compared left to right until the first difference: <code>'a'</code> is 97, <code>'b'</code> is 98, no need to look further. That is also why <code>\"Zebra\" &lt; \"apple\"</code> is true — capitals come before lowercase."}},

{q:{ru:"В строке 3 байта. Что будет при обращении к <code>s[10]</code>?", en:"A string has 3 bytes. What happens on <code>s[10]</code>?"},
 code:null,
 opts:[CRASH, NO, {ru:"вернётся 0", en:"returns 0"}, {ru:"вернётся пустая строка", en:"returns an empty string"}], ok:0,
 why:{ru:"<code>index out of range [10] with length 3</code>. Компилятор это не ловит: длину строки он во время сборки не знает. Чаще всего вылезает на <code>s[i+1]</code> в цикле, идущем до <code>len(s)</code>.",
      en:"<code>index out of range [10] with length 3</code>. The compiler doesn't catch it: it doesn't know the string length at build time. It usually appears as <code>s[i+1]</code> in a loop running up to <code>len(s)</code>."}},

{q:{ru:"Чему равна длина куска <code>s[a:b]</code>?", en:"What is the length of the piece <code>s[a:b]</code>?"},
 code:null, opts:["b - a","b - a + 1","b","a + b"], ok:0,
 why:{ru:"Правая граница не входит, поэтому длина ровно <code>b - a</code>. Из этого же следует, что <code>s[2:2]</code> — пустая строка, а не один символ.",
      en:"The right bound is excluded, so the length is exactly <code>b - a</code>. It also follows that <code>s[2:2]</code> is an empty string, not one character."}},

{q:{ru:"Почему <code>string(5)</code> не даёт <code>\"5\"</code>?", en:"Why doesn't <code>string(5)</code> give <code>\"5\"</code>?"},
 code:null,
 opts:[{ru:"5 понимается как код символа, а не как цифра", en:"5 is read as a character code, not as a digit"},
       {ru:"5 уже является строкой", en:"5 is already a string"},
       {ru:"нужны кавычки: string(\"5\")", en:"you need quotes: string(\"5\")"},
       {ru:"это не соберётся", en:"it won't compile"}], ok:0,
 why:{ru:"<code>string</code> от числа значит «покажи это число как символ». Код 5 — невидимый служебный знак, на экране пусто. Одну цифру переводят как <code>string('0' + n)</code>, число целиком — <code>strconv.Itoa(n)</code>. Программа при этом собирается, а <code>go vet</code> предупреждает отдельной строкой.",
      en:"<code>string</code> of a number means “show this number as a character”. Code 5 is an invisible control character, so the screen looks empty. A single digit converts as <code>string('0' + n)</code>, a whole number needs <code>strconv.Itoa(n)</code>. The program does compile, and <code>go vet</code> warns about it separately."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Почему <code>len(\"Привет\")</code> равно 12, а не 6?", en:"Why is <code>len(\"Привет\")</code> 12 and not 6?"},
 a:{ru:`<p>Потому что <code>len</code> у строки считает <strong>байты</strong>. Букв там действительно шесть, но каждая кириллическая буква хранится в двух байтах.</p>
<p>Сколько занимает символ:</p>
<ul><li>латинская буква, цифра, пробел, знак препинания — 1 байт</li>
<li>кириллица, греческий, иврит — 2 байта</li>
<li>иероглифы — 3 байта</li>
<li>эмодзи — 4 байта</li></ul>
<p>Посмотреть можно напрямую: <code>fmt.Println([]byte("Дом"))</code> даёт <code>[208 148 208 190 208 188]</code>.</p>
<p>Число символов считают так:</p>
<pre><code>count := len([]rune(s))

<span class="cm">// или циклом</span>
count := 0
for range s {
	count++
}</code></pre>`,
    en:`<p>Because <code>len</code> on a string counts <strong>bytes</strong>. There really are six letters, but each Cyrillic letter is stored in two bytes.</p>
<p>How much a character takes:</p>
<ul><li>Latin letter, digit, space, punctuation — 1 byte</li>
<li>Cyrillic, Greek, Hebrew — 2 bytes</li>
<li>Chinese and Japanese characters — 3 bytes</li>
<li>emoji — 4 bytes</li></ul>
<p>You can look directly: <code>fmt.Println([]byte("Дом"))</code> gives <code>[208 148 208 190 208 188]</code>.</p>
<p>Characters are counted like this:</p>
<pre><code>count := len([]rune(s))

<span class="cm">// or with a loop</span>
count := 0
for range s {
	count++
}</code></pre>`}},

{q:{ru:"Как правильно перебирать строку — через <code>s[i]</code> или через <code>range</code>?", en:"What is the right way to walk a string — <code>s[i]</code> or <code>range</code>?"},
 a:{ru:`<p>По умолчанию — <code>range</code>. Он выдаёт целые символы, а <code>s[i]</code> выдаёт байты.</p>
<pre><code><span class="cm">// ломается на кириллице</span>
for i := 0; i &lt; len(s); i++ {
	fmt.Print(string(s[i]))
}

<span class="cm">// работает всегда</span>
for _, c := range s {
	fmt.Print(string(c))
}</code></pre>
<p>Коварство в том, что первый вариант на <code>"hello"</code> работает идеально. Ты проверяешь, всё сходится, а на <code>"привет"</code> тот же код выдаёт мусор.</p>
<p><code>s[i]</code> уместен, когда ты сознательно работаешь с байтами: считаешь длину, режешь строку по известным границам, проверяешь ASCII-символы.</p>
<p>Если нужен именно порядковый номер буквы, а не байта — идут по рунам:</p>
<pre><code>r := []rune(s)
for i := 0; i &lt; len(r); i++ {
	fmt.Println(i, string(r[i]))
}</code></pre>`,
    en:`<p>By default — <code>range</code>. It yields whole characters, while <code>s[i]</code> yields bytes.</p>
<pre><code><span class="cm">// breaks on Cyrillic</span>
for i := 0; i &lt; len(s); i++ {
	fmt.Print(string(s[i]))
}

<span class="cm">// always works</span>
for _, c := range s {
	fmt.Print(string(c))
}</code></pre>
<p>The nasty part is that the first version works perfectly on <code>"hello"</code>. You test it, everything adds up, and then the same code prints garbage on <code>"привет"</code>.</p>
<p><code>s[i]</code> is fine when you deliberately work with bytes: measuring length, cutting on known boundaries, checking ASCII characters.</p>
<p>If you need the letter's position rather than a byte offset, walk the runes:</p>
<pre><code>r := []rune(s)
for i := 0; i &lt; len(r); i++ {
	fmt.Println(i, string(r[i]))
}</code></pre>`}},

{q:{ru:"Что такое <code>[]rune(s)</code> и когда без него не обойтись?", en:"What is <code>[]rune(s)</code> and when can't you do without it?"},
 a:{ru:`<p>Это перевод строки в слайс рун: один элемент — один символ, независимо от того, сколько байтов он занимал.</p>
<pre><code>s := "Дом"
r := []rune(s)   <span class="cm">// [1044 1086 1084]</span>
r[0]             <span class="cm">// 1044 — целая буква «Д»</span>
s[0]             <span class="cm">// 208  — половина буквы</span></code></pre>
<p>Без рун не обойтись, когда нужен <strong>прямой доступ к n-му символу</strong>:</p>
<ul><li>перевернуть строку</li>
<li>сравнить первый символ с последним</li>
<li>заменить символ на позиции</li>
<li>посчитать символы</li></ul>
<p>Обратно строку собирают тем же <code>string</code>:</p>
<pre><code>s = string(r)</code></pre>
<p>Важно: <code>[]rune(s)</code> делает <strong>копию</strong>. Правки в слайсе исходную строку не трогают.</p>`,
    en:`<p>It converts a string into a slice of runes: one element is one character, no matter how many bytes it took.</p>
<pre><code>s := "Дом"
r := []rune(s)   <span class="cm">// [1044 1086 1084]</span>
r[0]             <span class="cm">// 1044 — the whole letter “Д”</span>
s[0]             <span class="cm">// 208  — half a letter</span></code></pre>
<p>You need runes whenever you want <strong>direct access to the n-th character</strong>:</p>
<ul><li>reversing a string</li>
<li>comparing the first character with the last</li>
<li>replacing a character at a position</li>
<li>counting characters</li></ul>
<p>The string is rebuilt with the same <code>string</code>:</p>
<pre><code>s = string(r)</code></pre>
<p>Important: <code>[]rune(s)</code> makes a <strong>copy</strong>. Edits to the slice never touch the original string.</p>`}},

{q:{ru:"Почему строку нельзя изменить, и что делать вместо этого?", en:"Why can't a string be changed, and what do you do instead?"},
 a:{ru:`<p>В Go строка неизменяема. Любая попытка написать в неё не собирается:</p>
<pre><code>s := "hello"
s[0] = 'H'   <span class="cm">// cannot assign to s[0]</span></code></pre>
<p>Вместо правки строку <strong>пересобирают</strong>. Два способа:</p>
<pre><code><span class="cm">// 1. через руны — когда меняешь символ на известной позиции</span>
r := []rune(s)
r[0] = 'H'
s = string(r)

<span class="cm">// 2. накопителем — когда фильтруешь или преобразуешь всё подряд</span>
res := ""
for _, c := range s {
	if c != ' ' {
		res += string(c)
	}
}</code></pre>
<p>Обрати внимание: <code>s = string(r)</code> старую строку не меняет. Оно кладёт в переменную <em>новую</em> строку. Старая просто перестаёт быть нужна.</p>
<p>Из-за этого склейка в цикле каждый раз создаёт новую строку. На сотнях символов это незаметно; на сотнях тысяч для этого есть <code>strings.Builder</code> — но это уже следующая тема.</p>`,
    en:`<p>In Go a string is immutable. Any attempt to write into it fails to compile:</p>
<pre><code>s := "hello"
s[0] = 'H'   <span class="cm">// cannot assign to s[0]</span></code></pre>
<p>Instead of editing, you <strong>rebuild</strong> the string. Two ways:</p>
<pre><code><span class="cm">// 1. via runes — when replacing a character at a known position</span>
r := []rune(s)
r[0] = 'H'
s = string(r)

<span class="cm">// 2. via an accumulator — when filtering or transforming everything</span>
res := ""
for _, c := range s {
	if c != ' ' {
		res += string(c)
	}
}</code></pre>
<p>Note that <code>s = string(r)</code> does not modify the old string. It puts a <em>new</em> string into the variable. The old one simply stops being needed.</p>
<p>Because of this, concatenating in a loop creates a new string every time. On hundreds of characters that's invisible; on hundreds of thousands there is <code>strings.Builder</code> — but that's a later topic.</p>`}},

{q:{ru:"Как собрать новую строку накопителем?", en:"How do you build a new string with an accumulator?"},
 a:{ru:`<p>Схема одна и та же для всех задач на сборку строки:</p>
<pre><code>res := ""                <span class="cm">// 1. пустой накопитель ДО цикла</span>
for _, c := range s {    <span class="cm">// 2. проходим по символам</span>
	if <span class="cm">условие</span> {          <span class="cm">// 3. решаем, брать ли символ</span>
		res += string(c) <span class="cm">// 4. приклеиваем</span>
	}
}
fmt.Println(res)         <span class="cm">// 5. печатаем ПОСЛЕ цикла</span>`+`</code></pre>
<p>Три места, где чаще всего ломается:</p>
<ul><li><strong>накопитель внутри цикла</strong> — обнуляется на каждом шаге, останется последний символ;</li>
<li><strong><code>res += c</code> вместо <code>res += string(c)</code></strong> — не соберётся, руна это число;</li>
<li><strong>печать внутри цикла</strong> — вместо одной строки получишь столбик промежуточных.</li></ul>
<p>Порядок склейки решает направление:</p>
<pre><code>res = res + string(c)   <span class="cm">// вперёд:  abc</span>
res = string(c) + res   <span class="cm">// назад:   cba</span></code></pre>`,
    en:`<p>The shape is the same for every string-building task:</p>
<pre><code>res := ""                <span class="cm">// 1. empty accumulator BEFORE the loop</span>
for _, c := range s {    <span class="cm">// 2. walk the characters</span>
	if <span class="cm">condition</span> {        <span class="cm">// 3. decide whether to take it</span>
		res += string(c) <span class="cm">// 4. glue it on</span>
	}
}
fmt.Println(res)         <span class="cm">// 5. print AFTER the loop</span>`+`</code></pre>
<p>Three places where it usually breaks:</p>
<ul><li><strong>accumulator inside the loop</strong> — it resets every step, only the last character survives;</li>
<li><strong><code>res += c</code> instead of <code>res += string(c)</code></strong> — won't compile, a rune is a number;</li>
<li><strong>printing inside the loop</strong> — instead of one string you get a column of partial ones.</li></ul>
<p>The order of concatenation decides the direction:</p>
<pre><code>res = res + string(c)   <span class="cm">// forward:  abc</span>
res = string(c) + res   <span class="cm">// backward: cba</span></code></pre>`}},

{q:{ru:"Как пройти строку задом наперёд?", en:"How do you walk a string backwards?"},
 a:{ru:`<p><code>range</code> назад не умеет — он всегда идёт слева направо. Поэтому два пути.</p>
<p><strong>Через руны и обычный цикл</strong> — работает на любом языке:</p>
<pre><code>r := []rune(s)
for i := len(r) - 1; i &gt;= 0; i-- {
	fmt.Print(string(r[i]))
}</code></pre>
<p><strong>Через накопитель</strong> — идём вперёд, но клеим слева:</p>
<pre><code>res := ""
for _, c := range s {
	res = string(c) + res
}</code></pre>
<p>Разбор шапки обратного цикла:</p>
<ul><li><code>i := len(r) - 1</code> — последний элемент, минус один потому что счёт с нуля;</li>
<li><code>i &gt;= 0</code> — именно <code>&gt;=</code>, иначе потеряешь первый символ;</li>
<li><code>i--</code> — шаг назад.</li></ul>
<p>Через <code>s[i]</code> так делать нельзя, если в строке может оказаться кириллица: байты пойдут в обратном порядке и буквы развалятся.</p>`,
    en:`<p><code>range</code> cannot go backwards — it always moves left to right. So there are two ways.</p>
<p><strong>Runes with a plain loop</strong> — works in any language:</p>
<pre><code>r := []rune(s)
for i := len(r) - 1; i &gt;= 0; i-- {
	fmt.Print(string(r[i]))
}</code></pre>
<p><strong>An accumulator</strong> — walk forward but glue on the left:</p>
<pre><code>res := ""
for _, c := range s {
	res = string(c) + res
}</code></pre>
<p>Reading the backward loop header:</p>
<ul><li><code>i := len(r) - 1</code> — the last element; minus one because counting starts at zero;</li>
<li><code>i &gt;= 0</code> — <code>&gt;=</code> exactly, otherwise you lose the first character;</li>
<li><code>i--</code> — one step back.</li></ul>
<p>Don't do this with <code>s[i]</code> if the string may contain Cyrillic: the bytes come out reversed and the letters fall apart.</p>`}},

{q:{ru:"Как устроены срезы строки <code>s[a:b]</code>?", en:"How do string slices <code>s[a:b]</code> work?"},
 a:{ru:`<p><code>a</code> — с какого байта начать, <code>b</code> — до какого дойти <strong>не включая его</strong>.</p>
<pre><code>s := "Hello"
s[1:3]   <span class="cm">// "el"    длина 3 - 1 = 2</span>
s[1:]    <span class="cm">// "ello"  до конца</span>
s[:2]    <span class="cm">// "He"    с начала</span>
s[:]     <span class="cm">// "Hello" вся строка</span>
s[2:2]   <span class="cm">// ""      пусто, а не один символ</span></code></pre>
<p>Длина куска всегда <code>b - a</code>. Это правило избавляет от вечного вопроса «включать или не включать».</p>
<p>Границы считаются в <strong>байтах</strong>. На латинице это незаметно, на кириллице надо резать по краям букв:</p>
<pre><code>s := "Дом"    <span class="cm">// Д = байты 0,1   о = 2,3   м = 4,5</span>
s[2:]         <span class="cm">// "ом"      правильно</span>
s[1:]         <span class="cm">// обрубок    буква разрезана пополам</span></code></pre>
<p>Если резать надо по символам, а не по байтам — переводи в руны, режь слайс, собирай обратно: <code>string([]rune(s)[1:])</code>.</p>`,
    en:`<p><code>a</code> is the byte to start at, <code>b</code> is the byte to stop at, <strong>not including it</strong>.</p>
<pre><code>s := "Hello"
s[1:3]   <span class="cm">// "el"    length 3 - 1 = 2</span>
s[1:]    <span class="cm">// "ello"  to the end</span>
s[:2]    <span class="cm">// "He"    from the start</span>
s[:]     <span class="cm">// "Hello" the whole string</span>
s[2:2]   <span class="cm">// ""      empty, not one character</span></code></pre>
<p>The length of the piece is always <code>b - a</code>. That rule ends the endless “inclusive or not” question.</p>
<p>The bounds are counted in <strong>bytes</strong>. With Latin text you never notice; with Cyrillic you must cut on letter edges:</p>
<pre><code>s := "Дом"    <span class="cm">// Д = bytes 0,1   о = 2,3   м = 4,5</span>
s[2:]         <span class="cm">// "ом"      correct</span>
s[1:]         <span class="cm">// a stub     the letter is cut in half</span></code></pre>
<p>If you need to cut by characters rather than bytes, convert to runes, slice that, and convert back: <code>string([]rune(s)[1:])</code>.</p>`}},

{q:{ru:"Как сравнивают строки и символы?", en:"How do you compare strings and characters?"},
 a:{ru:`<p>Строки сравнивают обычными знаками — ничего специального не нужно:</p>
<pre><code>a == b    <span class="cm">// точное совпадение, регистр учитывается</span>
a != b
a &lt; b     <span class="cm">// посимвольно по кодам, до первого различия</span></code></pre>
<p><code>"apple" &lt; "banana"</code> — true, потому что <code>'a'</code> это 97, а <code>'b'</code> это 98; дальше можно не смотреть.</p>
<p><code>"Apple" &lt; "apple"</code> — тоже true: заглавные идут раньше строчных ровно на 32.</p>
<p>Эта же тридцатка с двойкой даёт смену регистра:</p>
<pre><code>c - 32   <span class="cm">// строчная → заглавная</span>
c + 32   <span class="cm">// заглавная → строчная</span></code></pre>
<p>Символы сравнивают так же, ведь это числа. Отсюда стандартные проверки:</p>
<pre><code>c &gt;= '0' &amp;&amp; c &lt;= '9'   <span class="cm">// цифра</span>
c &gt;= 'a' &amp;&amp; c &lt;= 'z'   <span class="cm">// строчная латинская буква</span></code></pre>
<p>Работают они потому, что цифры и буквы в таблице кодов идут подряд, без пропусков.</p>`,
    en:`<p>Strings compare with the usual operators — nothing special needed:</p>
<pre><code>a == b    <span class="cm">// exact match, case sensitive</span>
a != b
a &lt; b     <span class="cm">// character by character, until the first difference</span></code></pre>
<p><code>"apple" &lt; "banana"</code> is true because <code>'a'</code> is 97 and <code>'b'</code> is 98; there is no need to look further.</p>
<p><code>"Apple" &lt; "apple"</code> is true as well: capitals come exactly 32 before lowercase.</p>
<p>That same 32 gives you case switching:</p>
<pre><code>c - 32   <span class="cm">// lowercase → uppercase</span>
c + 32   <span class="cm">// uppercase → lowercase</span></code></pre>
<p>Characters compare the same way, since they are numbers. Hence the standard checks:</p>
<pre><code>c &gt;= '0' &amp;&amp; c &lt;= '9'   <span class="cm">// a digit</span>
c &gt;= 'a' &amp;&amp; c &lt;= 'z'   <span class="cm">// a lowercase Latin letter</span></code></pre>
<p>They work because digits and letters sit consecutively in the code table, with no gaps.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */

/* Разбор строки на символы и байты UTF-8 — тем же способом, каким это делает Go. */
function scRunes(s){
  var r = [], i = 0;
  while(i < s.length){ var cp = s.codePointAt(i); r.push(cp); i += (cp > 0xFFFF) ? 2 : 1; }
  return r;
}
function scEnc(cp){
  if(cp < 0x80)    return [cp];
  if(cp < 0x800)   return [0xC0 | (cp >> 6), 0x80 | (cp & 63)];
  if(cp < 0x10000) return [0xE0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63)];
  return [0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63)];
}
/* Байты обратно в текст — ровно как их покажет экран: обломок символа
   превращается в знак замены. */
function scDec(bytes){
  var out = "", i = 0;
  while(i < bytes.length){
    var b = bytes[i], need = 0, cp = 0;
    if(b < 0x80){ out += String.fromCharCode(b); i++; continue; }
    if(b >= 0xC2 && b <= 0xDF){ need = 1; cp = b & 31; }
    else if(b >= 0xE0 && b <= 0xEF){ need = 2; cp = b & 15; }
    else if(b >= 0xF0 && b <= 0xF4){ need = 3; cp = b & 7; }
    else { out += "\uFFFD"; i++; continue; }
    var got = 0;
    while(got < need){
      var c = bytes[i + 1 + got];
      if(c === undefined || (c & 192) !== 128) break;
      cp = (cp << 6) | (c & 63);
      got++;
    }
    if(got < need){ out += "\uFFFD"; i += 1 + got; continue; }   // обломок целиком — один знак замены
    out += String.fromCodePoint(cp);
    i += 1 + need;
  }
  return out;
}
/* то, что ввели в поле: не длиннее десяти символов и без знаков, ломающих код */
function scWord(v, def){
  var s = String(v === undefined || v === null ? "" : v).replace(/[<>&"'`\\]/g, "");
  s = scRunes(s).slice(0, 10).map(function(cp){ return String.fromCodePoint(cp); }).join("");
  return s.length ? s : def;
}
/* модель строки: символы со своими байтами и лента байтов под ними */
function scModel(s){
  var chars = [], bytes = [], tape = [], off = 0;
  scRunes(s).forEach(function(cp){
    var b = scEnc(cp), ch = String.fromCodePoint(cp);
    chars.push({ch:ch, cp:cp, off:off, n:b.length});
    for(var k = 0; k < b.length; k++){ bytes.push(b[k]); tape.push(ch); }
    off += b.length;
  });
  return {s:s, chars:chars, bytes:bytes, tape:tape};
}
function scSpan(a, b){ var r = []; for(var i = a; i < b; i++) r.push(i); return r; }
function scQ(s){ return '"' + s + '"'; }
function scRV(cp){ return "'" + String.fromCodePoint(cp) + "' (" + cp + ")"; }
function scStarts(m){ var o = {}; m.chars.forEach(function(c){ o[c.off] = true; }); o[m.bytes.length] = true; return o; }
function scB(n){ var d = n % 10, h = n % 100;                       // 1 байт / 2 байта / 5 байтов
  if(h >= 11 && h <= 14) return n + " байтов";
  if(d === 1) return n + " байт";
  if(d >= 2 && d <= 4) return n + " байта";
  return n + " байтов"; }
function scBe(n){ return n + (n === 1 ? " byte" : " bytes"); }

var SCENARIOS = [
{
 name:{ru:"Байт и буква", en:"Byte and letter"},
 params:[{key:"word", label:{ru:"слово", en:"word"}, text:true, max:10, def:"Дом"}],
 code: function(p){
   var w = scWord(p.word, "Дом");
   return ["s := \"" + w + "\"", "fmt.Println(len(s))", "fmt.Println(s[0])", "fmt.Println(string(s[0]))"];
 },
 tape: function(p){ return scModel(scWord(p.word, "Дом")).tape; },
 steps: function(p){
   var w = scWord(p.word, "Дом"), m = scModel(w);
   var nb = m.bytes.length, nc = m.chars.length, all = scSpan(0, nb);
   var sv = ["s", scQ(w), "string"], f = m.chars[0], b0 = m.bytes[0];
   var ch0 = String.fromCodePoint(b0);           // так Go покажет string(s[0])
   var o1 = nb + "\n", o2 = o1 + b0 + "\n", o3 = o2 + ch0 + "\n";
   var same = (nb === nc);
   return [
     {line:0, vars:[sv], out:"", tapeOn:all,
      note:{ru:"Символов — " + nc + ", байтов — " + nb + ". " + (same
              ? "Здесь числа совпали: каждый символ занял по одному байту. Впиши кириллицу — они разойдутся."
              : "Кириллическая буква занимает два байта, латинская — один. Лента внизу показывает, какой байт какому символу принадлежит."),
            en:"Characters — " + nc + ", bytes — " + nb + ". " + (same
              ? "Here the numbers match: every character took one byte. Type something non-Latin and they will part ways."
              : "A Cyrillic letter takes two bytes, a Latin one takes one. The tape below shows which byte belongs to which character.")}},
     {line:1, vars:[sv, ["len(s)", String(nb), "int"]], out:o1, tapeOn:all,
      note:{ru:"<b>len считает байты, а не символы.</b> Символов " + nc + ", ответ " + nb + ". Символы посчитал бы <code>len([]rune(s))</code>.",
            en:"<b>len counts bytes, not characters.</b> " + nc + " characters, answer " + nb + ". Characters would come from <code>len([]rune(s))</code>."}},
     {line:2, vars:[sv, ["s[0]", String(b0), "byte"]], out:o2, tapeOn:[0],
      note:{ru:"Индекс достаёт <b>один байт</b> — число " + b0 + ". " + (f.n === 1
              ? "Символ «" + f.ch + "» занял ровно один байт, поэтому байт и символ здесь одно и то же."
              : "Это только первая часть символа «" + f.ch + "»: в нём " + scB(f.n) + "."),
            en:"Indexing pulls <b>one byte</b> — the number " + b0 + ". " + (f.n === 1
              ? "The character “" + f.ch + "” took exactly one byte, so here a byte and a character are the same thing."
              : "This is only the first part of the character “" + f.ch + "”: it takes " + scBe(f.n) + ".")}},
     {line:3, vars:[sv, ["s[0]", String(b0), "byte"]], out:o3, tapeOn:[0],
      note:{ru:"<code>string</code> показал символ с кодом " + b0 + " — " + (f.n === 1
              ? "это и есть «" + f.ch + "». Совпало только потому, что символ однобайтовый: поставь кириллицу и получишь другое."
              : "«" + ch0 + "». К букве «" + f.ch + "» он отношения не имеет: часть символа сама по себе не значит ничего. <b>Вот так s[i] и ломает кириллицу.</b>"),
            en:"<code>string</code> showed the character with code " + b0 + " — " + (f.n === 1
              ? "that is “" + f.ch + "” itself. It matched only because the character is one byte long: type something non-Latin and you get something else."
              : "“" + ch0 + "”. It has nothing to do with the letter “" + f.ch + "”: part of a character means nothing on its own. <b>This is exactly how s[i] breaks non-Latin text.</b>")}}
   ];
 }
},
{
 name:{ru:"range по буквам", en:"range over letters"},
 params:[{key:"word", label:{ru:"слово", en:"word"}, text:true, max:10, def:"Дом"}],
 code: function(p){
   var w = scWord(p.word, "Дом");
   return ["s := \"" + w + "\"", "for i, c := range s {", "\tfmt.Println(i, string(c))", "}", "fmt.Println(len(s))"];
 },
 tape: function(p){ return scModel(scWord(p.word, "Дом")).tape; },
 steps: function(p){
   var w = scWord(p.word, "Дом"), m = scModel(w);
   var nb = m.bytes.length, nc = m.chars.length;
   var sv = ["s", scQ(w), "string"], st = [], out = "";
   st.push({line:0, vars:[sv], out:out, tapeOn:[],
     note:{ru:"Строка та же: символов " + nc + ", байтов " + nb + ".",
           en:"The same string: " + nc + " characters, " + nb + " bytes."}});
   m.chars.forEach(function(c, k){
     var on = scSpan(c.off, c.off + c.n);
     var vars = [sv, ["i", String(c.off), "int"], ["c", scRV(c.cp), "rune"]];
     var head;
     if(k === 0){
       head = {ru:(c.n === 1
                ? "<code>range</code> отдал символ «" + c.ch + "» целиком; он занимает один байт."
                : "<code>range</code> взял символ «" + c.ch + "» <b>целиком</b> — все " + scB(c.n) + " сразу.") +
               " В <code>c</code> лежит руна, число " + c.cp + ".",
               en:(c.n === 1
                ? "<code>range</code> handed over the character “" + c.ch + "” whole; it takes one byte."
                : "<code>range</code> took the character “" + c.ch + "” <b>whole</b> — all " + scBe(c.n) + " at once.") +
               " <code>c</code> holds a rune, the number " + c.cp + "."};
     } else if(c.off === k){
       head = {ru:"<code>i</code> = " + c.off + " — пока совпадает с номером символа, потому что все предыдущие однобайтовые.",
               en:"<code>i</code> = " + c.off + " — still equal to the character's position, because every previous one takes a single byte."};
     } else {
       head = {ru:"<code>i</code> стал " + c.off + ", а не " + k + ": предыдущие символы заняли " + scB(c.off) + ". <b>Это номер байта, а не номер шага.</b>",
               en:"<code>i</code> became " + c.off + ", not " + k + ": the previous characters took up " + scBe(c.off) + ". <b>It is a byte offset, not a step number.</b>"};
     }
     st.push({line:1, vars:vars, out:out, tapeOn:on, note:head});
     out += c.off + " " + c.ch + "\n";
     st.push({line:2, vars:vars, out:out, tapeOn:on,
       note:(k === 0
         ? {ru:"Печатаем номер байта и символ. Без <code>string(c)</code> вывелось бы число " + c.cp + ".",
            en:"Printing the byte offset and the character. Without <code>string(c)</code> it would print the number " + c.cp + "."}
         : {ru:"Символ №" + (k+1) + " напечатан.", en:"Character " + (k+1) + " printed."})});
   });
   st.push({line:3, vars:[sv], out:out, tapeOn:[],
     note:{ru:"Цикл закончился. Шагов было " + nc + " — по числу символов.",
           en:"The loop is over. There were " + nc + " steps — one per character."}});
   out += nb + "\n";
   st.push({line:4, vars:[sv, ["len(s)", String(nb), "int"]], out:out, tapeOn:scSpan(0, nb),
     note:{ru:(nb === nc
             ? "А <code>len</code> — " + nb + ". Здесь совпало, потому что символы однобайтовые. Впиши кириллицу — шаги и байты разойдутся."
             : "А <code>len</code> — " + nb + ". <b>Шагов " + nc + ", байтов " + nb + " — это разные числа, и путать их нельзя.</b>"),
           en:(nb === nc
             ? "And <code>len</code> is " + nb + ". It matched because the characters take one byte each. Type something non-Latin and steps and bytes will part ways."
             : "And <code>len</code> is " + nb + ". <b>" + nc + " steps, " + nb + " bytes — different numbers, never mix them up.</b>")}});
   return st;
 }
},
{
 name:{ru:"Накопитель", en:"Accumulator"},
 params:[
   {key:"word", label:{ru:"слово", en:"word"}, text:true, max:10, def:"abc"},
   {key:"glue", label:{ru:"склейка", en:"glue"}, values:["string(c) + res", "res + string(c)"], def:"string(c) + res"}
 ],
 code: function(p){
   var w = scWord(p.word, "abc");
   var g = (p.glue === "res + string(c)") ? "res + string(c)" : "string(c) + res";
   return ["s := \"" + w + "\"", "res := \"\"", "for _, c := range s {", "\tres = " + g, "}", "fmt.Println(res)"];
 },
 steps: function(p){
   var w = scWord(p.word, "abc"), m = scModel(w);
   var left = (p.glue !== "res + string(c)");
   var sv = ["s", scQ(w), "string"], st = [], res = "";
   st.push({line:0, vars:[sv], out:"",
     note:{ru:"Исходная строка. Она не изменится ни разу — менять строку нельзя.",
           en:"The source string. It will never change — a string cannot be modified."}});
   st.push({line:1, vars:[sv, ["res", scQ(""), "string"]], out:"",
     note:{ru:"Накопитель создан <b>до</b> цикла и пуст. Создашь его внутри — он будет обнуляться на каждом шаге.",
           en:"The accumulator is created <b>before</b> the loop and is empty. Create it inside and it resets on every step."}});
   m.chars.forEach(function(c, k){
     st.push({line:2, vars:[sv, ["res", scQ(res), "string"], ["c", scRV(c.cp), "rune"]], out:"",
       note:(k === 0
         ? {ru:"Первый шаг. В <code>c</code> руна — число " + c.cp + ", а не буква.",
            en:"First step. <code>c</code> holds a rune — the number " + c.cp + ", not a letter."}
         : {ru:"Шаг " + (k+1) + ": в <code>c</code> символ «" + c.ch + "», число " + c.cp + ".",
            en:"Step " + (k+1) + ": <code>c</code> holds the character “" + c.ch + "”, the number " + c.cp + "."})});
     var was = res;
     res = left ? (c.ch + res) : (res + c.ch);
     st.push({line:3, vars:[sv, ["res", scQ(res), "string"], ["c", scRV(c.cp), "rune"]], out:"",
       note:(k === 0
         ? {ru:(left ? "<code>string(c) + res</code>: новый символ встал <b>слева</b>." : "<code>res + string(c)</code>: новый символ встал <b>справа</b>.") +
              " Без <code>string(...)</code> эта строка не собралась бы — руну к строке не прибавить.",
            en:(left ? "<code>string(c) + res</code>: the new character went to the <b>left</b>." : "<code>res + string(c)</code>: the new character went to the <b>right</b>.") +
              " Without <code>string(...)</code> this line wouldn't compile — a rune cannot be added to a string."}
         : {ru:(left ? "Снова слева: «" + c.ch + "» + «" + was + "». " : "Снова справа: «" + was + "» + «" + c.ch + "». ") +
              "Порядок склейки и задаёт направление.",
            en:(left ? "On the left again: “" + c.ch + "” + “" + was + "”. " : "On the right again: “" + was + "” + “" + c.ch + "”. ") +
              "The order of concatenation sets the direction."})});
   });
   st.push({line:4, vars:[sv, ["res", scQ(res), "string"]], out:"",
     note:{ru:"Цикл закончился. Каждый шаг создавал <b>новую</b> строку, а <code>s</code> как была " + scQ(w) + ", так и осталась.",
           en:"The loop is over. Every step created a <b>new</b> string, and <code>s</code> is still " + scQ(w) + "."}});
   st.push({line:5, vars:[sv, ["res", scQ(res), "string"]], out:res + "\n",
     note:{ru:"Печать <b>после</b> цикла. Поставишь её внутрь — вместо одной строки получишь столбик промежуточных." +
             (left ? " Слово собралось задом наперёд: переключи склейку и сравни." : " Слово собралось как было: переключи склейку и сравни."),
           en:"Printing <b>after</b> the loop. Put it inside and instead of one string you get a column of partial ones." +
             (left ? " The word came out backwards: switch the glue and compare." : " The word came out as it was: switch the glue and compare.")}});
   return st;
 }
},
{
 name:{ru:"Срезы и сравнение", en:"Slices and comparison"},
 params:[
   {key:"word", label:{ru:"слово", en:"word"}, text:true, max:10, def:"Hello"},
   {key:"a", label:{ru:"a", en:"a"}, min:0, max:9, def:1},
   {key:"b", label:{ru:"b", en:"b"}, min:0, max:9, def:3}
 ],
 code: function(p){
   var w = scWord(p.word, "Hello"), n = scModel(w).bytes.length;
   var a = Math.min(Math.max(+p.a || 0, 0), n);
   var b = Math.min(Math.max(+p.b || 0, a), n);
   return ["s := \"" + w + "\"",
           "fmt.Println(s[" + a + ":])",
           "fmt.Println(s[:" + b + "])",
           "fmt.Println(s[" + a + ":" + b + "])",
           "fmt.Println(s == \"Hello\")",
           "fmt.Println(\"apple\" < \"banana\")"];
 },
 tape: function(p){ return scModel(scWord(p.word, "Hello")).tape; },
 steps: function(p){
   var w = scWord(p.word, "Hello"), m = scModel(w), n = m.bytes.length;
   var ra = +p.a || 0, rb = +p.b || 0;
   var a = Math.min(Math.max(ra, 0), n);
   var b = Math.min(Math.max(rb, a), n);
   var edge = scStarts(m);
   var p1 = scDec(m.bytes.slice(a)), p2 = scDec(m.bytes.slice(0, b)), p3 = scDec(m.bytes.slice(a, b));
   var sv = ["s", scQ(w), "string"];
   var eq = (w === "Hello");
   var o1 = p1 + "\n", o2 = o1 + p2 + "\n", o3 = o2 + p3 + "\n";
   var o4 = o3 + (eq ? "true" : "false") + "\n", o5 = o4 + "true\n";
   var fixRu = "", fixEn = "";
   if(ra > n || rb > n){
     fixRu += " Границы подрезаны под длину: в строке всего " + scB(n) + ", а за ней в Go — падение <code>index out of range</code>.";
     fixEn += " The bounds are trimmed to the length: the string has only " + scBe(n) + ", and going past it in Go is an <code>index out of range</code> crash.";
   }
   if(rb < ra){
     fixRu += " Правая граница подтянута до левой: <code>s[" + ra + ":" + rb + "]</code> в Go не соберётся.";
     fixEn += " The right bound was pulled up to the left one: <code>s[" + ra + ":" + rb + "]</code> does not compile in Go.";
   }
   var multi = (n !== m.chars.length);
   return [
     {line:0, vars:[sv, ["len(s)", String(n), "int"]], out:"", tapeOn:scSpan(0, n),
      note:{ru:"Границы среза считаются в <b>байтах</b>, а их здесь " + n + ". " + (multi
              ? "Символы заняли разное число байтов, и лента внизу показывает, где кончается каждый: резать надо по этим краям."
              : "Каждый символ занял по байту, поэтому границы читаются как номера символов.") + fixRu,
            en:"Slice bounds are counted in <b>bytes</b>, and there are " + n + " of them. " + (multi
              ? "The characters took different numbers of bytes, and the tape below shows where each one ends: you must cut on those edges."
              : "Every character took one byte, so the bounds read like character positions.") + fixEn}},
     {line:1, vars:[sv, ["s[" + a + ":]", scQ(p1), "string"]], out:o1, tapeOn:scSpan(a, n),
      note:{ru:"<code>s[" + a + ":]</code> — с байта " + a + " и до конца, правой границы нет. " + (edge[a]
              ? "Байт " + a + " — начало символа, поэтому кусок вышел целым."
              : "<b>Байт " + a + " — середина символа</b>, и кусок начался с обломка: на экране знак замены."),
            en:"<code>s[" + a + ":]</code> — from byte " + a + " to the end, no right bound. " + (edge[a]
              ? "Byte " + a + " starts a character, so the piece came out whole."
              : "<b>Byte " + a + " sits in the middle of a character</b>, so the piece starts with a stub: the screen shows a replacement mark.")}},
     {line:2, vars:[sv, ["s[:" + b + "]", scQ(p2), "string"]], out:o2, tapeOn:scSpan(0, b),
      note:{ru:"<code>s[:" + b + "]</code> — с начала до байта " + b + ", <b>не включая его</b>. Взялись байты " + (b > 0 ? "0…" + (b-1) : "— ни одного, кусок пустой") + ". " + (edge[b] ? "" : "Правая граница попала в середину символа, и он оборвался."),
            en:"<code>s[:" + b + "]</code> — from the start up to byte " + b + ", <b>excluding it</b>. Bytes taken: " + (b > 0 ? "0…" + (b-1) : "none, the piece is empty") + ". " + (edge[b] ? "" : "The right bound landed inside a character, so it got cut off.")}},
     {line:3, vars:[sv, ["s[" + a + ":" + b + "]", scQ(p3), "string"]], out:o3, tapeOn:scSpan(a, b),
      note:{ru:"<code>s[" + a + ":" + b + "]</code> — длина куска всегда <code>b - a</code>: здесь " + b + " − " + a + " = " + scB(b - a) + "." + (a === b ? " Одинаковые границы дают пустую строку, а не один символ." : ""),
            en:"<code>s[" + a + ":" + b + "]</code> — the length of a piece is always <code>b - a</code>: here " + b + " − " + a + " = " + scBe(b - a) + "." + (a === b ? " Equal bounds give an empty string, not one character." : "")}},
     {line:4, vars:[sv, ["s == \"Hello\"", eq ? "true" : "false", "bool"]], out:o4, tapeOn:scSpan(0, n),
      note:{ru:"Строки сравниваются обычным <code>==</code>, посимвольно и с учётом регистра. " + (eq
              ? "Здесь строки одинаковые — true. Поменяй хоть одну букву, и станет false."
              : "Здесь " + scQ(w) + " против \"Hello\" — совпадения нет, поэтому false."),
            en:"Strings compare with a plain <code>==</code>, character by character and case sensitive. " + (eq
              ? "Here the strings are identical — true. Change a single letter and it turns false."
              : "Here it is " + scQ(w) + " against \"Hello\" — no match, so false.")}},
     {line:5, vars:[sv], out:o5, tapeOn:[],
      note:{ru:"<code>&lt;</code> сравнивает коды слева направо до первого различия: <code>'a'</code> это 97, <code>'b'</code> это 98 — дальше можно не смотреть.",
            en:"<code>&lt;</code> compares codes left to right until the first difference: <code>'a'</code> is 97, <code>'b'</code> is 98 — no need to look further."}}
   ];
 }
}
];

/* ================= ЧТО ИЗ ЭТОГО СКЛАДЫВАЕТСЯ ================= */
var OUTRO = {
 ru:`<p>Все семь правил выросли из одного факта: строка — это байты. <code>len</code> считает байты, потому что считать в ней больше нечего. <code>s[i]</code> достаёт байт, потому что ничего другого там не лежит. <code>range</code> и <code>[]rune</code> существуют ровно затем, чтобы собрать байты обратно в символы. Срез режет по байтам по той же причине, а сравнение идёт по кодам, потому что коды и есть содержимое строки.</p>
<p>Вторая половина темы держится на запрете: изменить строку нельзя. Отсюда ровно два способа что-то с ней сделать. Первый — разложить на руны, поправить нужный элемент, собрать обратно через <code>string(r)</code>; он для случая, когда позиция известна. Второй — накопитель: пустая строка до цикла, <code>range</code> по символам, <code>if</code> внутри, склейка <code>res += string(c)</code>; он для случая, когда надо отфильтровать или преобразовать всё подряд. Перевернуть строку, выбросить пробелы, посчитать гласные, поменять регистр, узнать палиндром — это вторая схема с разным условием внутри.</p>
<p>Теперь по любой записи ты можешь сказать, что получишь и какого оно типа: <code>byte</code> из индекса, <code>rune</code> из <code>range</code>, <code>string</code> из среза и из склейки. Это и есть главное умение темы — не помнить приёмы наизусть, а выводить их из устройства строки.</p>
<p>Если забудется всё остальное, держи одно: <b>Go хранит байты, а буквы появляются только на экране.</b> Из этой фразы восстанавливается и <code>len</code>, и <code>s[i]</code>, и <code>range</code>, и то, почему кириллица разваливается там, где латиница работала.</p>`,
 en:`<p>All seven rules grow out of one fact: a string is bytes. <code>len</code> counts bytes because there is nothing else in there to count. <code>s[i]</code> pulls a byte because there is nothing else in there either. <code>range</code> and <code>[]rune</code> exist precisely to put the bytes back together into characters. A slice cuts by bytes for the same reason, and comparison goes by codes because codes are what a string is made of.</p>
<p>The second half of the topic rests on a ban: a string cannot be changed. That leaves exactly two ways to do anything with it. One — convert to runes, fix the element you need, rebuild with <code>string(r)</code>; this is for when you know the position. Two — the accumulator: an empty string before the loop, <code>range</code> over the characters, an <code>if</code> inside, and <code>res += string(c)</code>; this is for when you filter or transform everything. Reversing a string, dropping spaces, counting vowels, switching case, telling a palindrome — all of it is the second shape with a different condition inside.</p>
<p>Now, for any expression, you can say what you get and what type it is: a <code>byte</code> from indexing, a <code>rune</code> from <code>range</code>, a <code>string</code> from a slice and from concatenation. That is the real skill of this topic — not remembering the tricks but deriving them from how a string is built.</p>
<p>If everything else fades, keep one thing: <b>Go stores bytes, and letters appear only on the screen.</b> From that sentence you can rebuild <code>len</code>, <code>s[i]</code>, <code>range</code>, and the reason non-Latin text falls apart where Latin worked fine.</p>`
};
