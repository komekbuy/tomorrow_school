var META = {
  n: 2,
  slug: "02-loops",
  eyebrow:{ru:"Go с нуля · тема 2 из 13", en:"Go from zero · topic 2 of 13"},
  title:  {ru:"Циклы", en:"Loops"},
  lede:{
    ru:"Всё, что повторяется — фигура из звёздочек, обход строки, подсчёт суммы — держится на цикле. Без него код превращается в двадцать одинаковых строк подряд.",
    en:"Everything that repeats — a shape made of stars, walking a string, adding up numbers — rests on a loop. Without one, code turns into twenty identical lines in a row."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=16727s",
    t:{ru:"Курс по Go — глава «Циклы» (4:38:47)", en:"Go course — the “Loops” chapter (4:38:47)"},
    d:{ru:"Разбор for со всеми частями и вложенных циклов.", en:"for in all its parts, plus nested loops."}},
  folder: "loop1",
  txt: {ru:"go-tema-02-cikly.txt", en:"go-topic-02-loops.txt"}
};

/* ================= ВВЕДЕНИЕ ================= */
var INTRO = {
ru:`<p>Программа выполняется по строке за раз, сверху вниз, и каждая строка выполняется ровно один раз. Пока строк пять, это удобно. Как только одно и то же действие нужно повторить двадцать раз, приходится написать двадцать одинаковых строк — и любая правка превращается в двадцать правок.</p>
<pre><code>fmt.Println("*")
fmt.Println("*")
fmt.Println("*")   <span class="cm">// и так ещё семнадцать раз</span></code></pre>
<p>Цикл убирает это повторение: действие пишется один раз, а рядом стоит, сколько раз его выполнить. Освоив тему, ты сможешь напечатать фигуру любого размера, сложить сотню чисел, пройти по строке буква за буквой и остановиться ровно там, где нужно, — кодом в три-четыре строки.</p>
<p>Есть задачи, которые без цикла не написать вообще. Двадцать одинаковых строк ещё можно скопировать. А когда количество повторов заранее неизвестно — оно приходит числом уже во время работы программы, — копировать нечего: в момент написания кода ты не знаешь, сколько раз копировать. Цикл решает это тем, что количество повторов в нём не набрано руками, а проверяется на ходу.</p>
<p>Держится всё на одной переменной — счётчике. Переменная это имя, за которым лежит значение; счётчик — имя, за которым лежит число, и это число меняется от повтора к повтору. Цикл его создаёт, проверяет и увеличивает. Почти всё, что ломается в циклах, ломается именно тут: счётчик начал не с того числа, дошёл не до того или не двигается вовсе.</p>
<p>Поэтому разбор идёт от счётчика наружу. Сначала — три части заголовка <code>for</code> и порядок, в котором они выполняются: из этого порядка следует всё остальное. Потом — что счётчик не обязан попадать на экран, и как граница задаёт количество шагов. Дальше цикл кладём внутрь другого цикла — так появляются строки и столбцы. Затем <code>range</code>: он ведёт счёт сам, когда идти надо по готовому набору данных. После — <code>break</code> и <code>continue</code>, две команды, которыми в ход цикла вмешиваются на ходу. И в конце — что происходит, когда счётчик не двигается: цикл, который не заканчивается никогда.</p>`,
en:`<p>A program runs one line at a time, top to bottom, and each line runs exactly once. With five lines that's convenient. The moment the same action has to happen twenty times, you end up writing twenty identical lines — and any edit becomes twenty edits.</p>
<pre><code>fmt.Println("*")
fmt.Println("*")
fmt.Println("*")   <span class="cm">// and seventeen more like it</span></code></pre>
<p>A loop removes that repetition: the action is written once, and next to it stands the number of times to run it. Once you have this topic, you can print a shape of any size, add up a hundred numbers, walk a string letter by letter and stop exactly where you need to — in three or four lines of code.</p>
<p>Some tasks cannot be written at all without a loop. Twenty identical lines can still be copied. But when the number of repeats isn't known in advance — it arrives as a number while the program is already running — there is nothing to copy: at the time you write the code you don't know how many copies to make. A loop solves that, because the number of repeats isn't typed out by hand, it's checked as the program goes.</p>
<p>All of it rests on one variable — the counter. A variable is a name with a value behind it; a counter is a name with a number behind it, and that number changes from repeat to repeat. The loop creates it, checks it and increases it. Almost everything that breaks in loops breaks right there: the counter started at the wrong number, went to the wrong number, or doesn't move at all.</p>
<p>So the walkthrough goes outward from the counter. First the three parts of the <code>for</code> header and the order they run in: everything else follows from that order. Then the fact that the counter doesn't have to reach the screen, and how the bound sets the number of steps. Then we put a loop inside another loop — that's where rows and columns come from. Next <code>range</code>, which keeps count on its own when the walk goes over data that already exists. After that <code>break</code> and <code>continue</code>, the two commands that interfere with a loop mid-run. And at the end, what happens when the counter doesn't move: a loop that never ends.</p>`
};

/* ================= СЕМЬ ПРАВИЛ ================= */
var RULES = [
{
 h:{ru:"У <code>for</code> три части, разделённые точкой с запятой",
    en:"<code>for</code> has three parts separated by semicolons"},
 b:{ru:`<p>В Go есть одно слово для повторения — <code>for</code>. Всё, что ему нужно, стоит в первой строке, между <code>for</code> и открывающей фигурной скобкой: откуда считать, до каких пор и на сколько двигаться за раз.</p>
<pre><code>for i := 0; i &lt; 5; i++ {
	fmt.Println(i)
}</code></pre>
<ul>
<li><code>i := 0</code> — <strong>старт</strong>. Создаёт счётчик и кладёт в него ноль. Выполняется один раз, до всего остального, и больше не повторяется никогда.</li>
<li><code>i &lt; 5</code> — <strong>условие</strong>. Вопрос «продолжаем?», который задаётся перед каждым проходом тела, включая самый первый.</li>
<li><code>i++</code> — <strong>шаг</strong>. Прибавляет к счётчику единицу. Выполняется после тела, перед следующей проверкой.</li>
</ul>
<p>Порядок такой: старт → проверка → тело → шаг → проверка → тело → шаг → … → проверка дала ложь → выход.</p>
<p>Из этого порядка следуют две вещи. Первая: условие проверяется <strong>до</strong> тела, поэтому цикл может не выполниться ни разу — <code>for i := 0; i &lt; 0; i++</code> не сделает ни шага, и это не поломка, а нормальная работа. Вторая: шаг выполняется <strong>после</strong> тела, а не перед ним, поэтому на первом проходе внутри тела <code>i</code> равен нулю, а не единице.</p>
<p>Записывается заголовок жёстко. Скобок вокруг условия нет: <code>for (i := 0; i &lt; 5; i++)</code> не соберётся. Разделитель — точка с запятой, не запятая. Фигурные скобки обязательны, даже когда тело в одну строку, и открывающая скобка стоит на той же строке, что и <code>for</code>.</p>`,
    en:`<p>Go has a single word for repetition — <code>for</code>. Everything it needs sits on the first line, between <code>for</code> and the opening brace: where to start counting, how far to go, and how big a move to make each time.</p>
<pre><code>for i := 0; i &lt; 5; i++ {
	fmt.Println(i)
}</code></pre>
<ul>
<li><code>i := 0</code> — the <strong>start</strong>. It creates the counter and puts zero in it. Runs once, before anything else, and never again.</li>
<li><code>i &lt; 5</code> — the <strong>condition</strong>. The question “do we keep going?”, asked before every pass through the body, including the very first.</li>
<li><code>i++</code> — the <strong>step</strong>. Adds one to the counter. Runs after the body, before the next check.</li>
</ul>
<p>The order is: start → check → body → step → check → body → step → … → the check is false → exit.</p>
<p>Two things follow from that order. First: the condition is checked <strong>before</strong> the body, so a loop may run zero times — <code>for i := 0; i &lt; 0; i++</code> takes no steps at all, and that isn't a breakage, it's normal behaviour. Second: the step runs <strong>after</strong> the body, not before it, so on the first pass <code>i</code> is zero inside the body, not one.</p>
<p>The header is spelled strictly. No parentheses around the condition: <code>for (i := 0; i &lt; 5; i++)</code> won't compile. The separator is a semicolon, not a comma. Curly braces are required even for a one-line body, and the opening brace goes on the same line as <code>for</code>.</p>`}
},
{
 h:{ru:"Счётчик не обязан попадать на экран",
    en:"The counter doesn't have to reach the screen"},
 b:{ru:`<p>Счётчик в заголовке есть всегда — иначе циклу нечего было бы проверять. А вот появляться в теле он не обязан: заголовок отвечает за то, <strong>сколько раз</strong>, тело — за то, <strong>что происходит</strong>. Это две независимые вещи, и два цикла с одинаковым заголовком это показывают:</p>
<pre><code>for i := 0; i &lt; 5; i++ {
	fmt.Print(i)      <span class="cm">// 01234 — i это значение, его печатают</span>
}

for i := 0; i &lt; 5; i++ {
	fmt.Print("*")    <span class="cm">// ***** — i только считает, внутри его нет</span>
}</code></pre>
<p>В первом цикле <code>i</code> — это то, что печатают: на экран уходят сами значения счётчика. Во втором <code>i</code> в теле не встречается ни разу, он только считает, и на экран не попадает ничего, кроме звёздочки.</p>
<p>Отсюда вопрос, который стоит задать себе до того, как писать цикл: <strong>«сколько раз» или «что именно»?</strong> Если «сколько раз» — счётчик нужен только для счёта, и в теле ему делать нечего. Если «что именно» — счётчик и есть содержимое.</p>
<p>Практическое следствие. Пока <code>i</code> не встречается в теле, границы можно двигать свободно: меняется только количество повторов, а не то, что печатается. Как только <code>i</code> появился в теле, любая правка заголовка меняет и вывод — сдвинешь старт с нуля на единицу, и вместо <code>01234</code> напечатается <code>1234</code>, на одно число меньше.</p>`,
    en:`<p>The counter is always in the header — otherwise the loop would have nothing to check. Showing up in the body is another matter: the header decides <strong>how many times</strong>, the body decides <strong>what happens</strong>. Two independent things, and two loops with identical headers show it:</p>
<pre><code>for i := 0; i &lt; 5; i++ {
	fmt.Print(i)      <span class="cm">// 01234 — i is the value, it gets printed</span>
}

for i := 0; i &lt; 5; i++ {
	fmt.Print("*")    <span class="cm">// ***** — i only counts, it never appears inside</span>
}</code></pre>
<p>In the first loop <code>i</code> is what gets printed: the counter values themselves go to the screen. In the second one <code>i</code> never appears in the body — it only counts, and nothing but a star reaches the screen.</p>
<p>Hence the question worth asking before you write a loop: <strong>“how many times” or “what exactly”?</strong> If it's “how many times”, the counter is there for counting only and has no business in the body. If it's “what exactly”, the counter <em>is</em> the content.</p>
<p>A practical consequence. As long as <code>i</code> stays out of the body, you can move the bounds freely: only the number of repeats changes, not what gets printed. Once <code>i</code> is in the body, every edit to the header changes the output too — move the start from zero to one and <code>01234</code> becomes <code>1234</code>, one number shorter.</p>`}
},
{
 h:{ru:"Граница решает, сколько будет шагов",
    en:"The bound decides how many steps you get"},
 b:{ru:`<p>Раз количество повторов задаётся только заголовком, стоит понять, какая его часть за это отвечает. Отвечает условие — точнее, знак сравнения и число рядом с ним.</p>
<pre><code>for i := 0; i &lt; n         <span class="cm">// n шагов, i идёт 0 … n-1</span>
for i := 0; i &lt;= n        <span class="cm">// n+1 шагов, i идёт 0 … n</span>
for i := 1; i &lt;= n        <span class="cm">// n шагов, i идёт 1 … n</span></code></pre>
<p>Смотри: старт и граница работают в паре. Начал с нуля — знак строгий; начал с единицы — нестрогий; в обоих случаях шагов ровно <code>n</code>. Перепутаешь пару — цикл сделает на один шаг больше или меньше, чем нужно.</p>
<p>Разницу в один знак компилятор не поймает: <code>&lt;</code> и <code>&lt;=</code> одинаково законны, ошибка тут не в языке, а в замысле. Программа соберётся, запустится и просто напечатает не то — на одну звёздочку больше, на одно число меньше.</p>
<p>Отдельный случай — обход набора данных по номерам. Элементы нумеруются с нуля, поэтому у набора из трёх элементов номера 0, 1 и 2, а номера 3 не существует. Граница здесь всегда строгая, <code>i &lt; len(s)</code>. Возьмёшь нестрогую — цикл сделает лишний шаг и полезет за <code>s[3]</code>, а такого элемента нет: программа не «напечатает не то», а остановится на середине с <code>panic: index out of range</code>.</p>
<p>Посчитать шаги можно до запуска — выписать таблицу и прогнать её глазами:</p>
<pre><code> i | i &lt; 3 | напечатано
 0 | да    | 0
 1 | да    | 01
 2 | да    | 012
 3 | нет   | выход</code></pre>
<p>Три строки со словом «да» — три шага. Такая таблица за минуту ловит то, что иначе ищешь час.</p>`,
    en:`<p>If the header alone decides the number of repeats, it's worth knowing which part of it does the deciding. It's the condition — the comparison sign and the number next to it.</p>
<pre><code>for i := 0; i &lt; n         <span class="cm">// n steps, i runs 0 … n-1</span>
for i := 0; i &lt;= n        <span class="cm">// n+1 steps, i runs 0 … n</span>
for i := 1; i &lt;= n        <span class="cm">// n steps, i runs 1 … n</span></code></pre>
<p>Look: the start and the bound work as a pair. Start at zero and the comparison is strict; start at one and it isn't; either way you get exactly <code>n</code> steps. Mix the pair up and the loop runs one step too many or one too few.</p>
<p>The compiler will not catch a one-character difference: <code>&lt;</code> and <code>&lt;=</code> are equally legal, and the mistake is in the intent, not in the language. The program compiles, runs, and simply prints the wrong thing — one star too many, one number too few.</p>
<p>Walking a collection by index is a special case. Elements are numbered from zero, so a three-element collection has numbers 0, 1 and 2, and there is no number 3. The bound there is always strict, <code>i &lt; len(s)</code>. Make it non-strict and the loop takes an extra step and reaches for <code>s[3]</code>, which doesn't exist: the program doesn't “print the wrong thing”, it stops halfway with <code>panic: index out of range</code>.</p>
<p>You can count the steps before running anything — write out a table and walk it by eye:</p>
<pre><code> i | i &lt; 3 | printed
 0 | yes   | 0
 1 | yes   | 01
 2 | yes   | 012
 3 | no    | exit</code></pre>
<p>Three “yes” rows means three steps. A table like this catches in a minute what otherwise takes an hour to find.</p>`}
},
{
 h:{ru:"Вложенные циклы: внешний — строки, внутренний — то, что внутри строки",
    en:"Nested loops: the outer one is rows, the inner one is what's inside a row"},
 b:{ru:`<p>Тело цикла — обычный код: в нём может стоять что угодно, в том числе ещё один цикл. Так из одного повторения получаются два измерения, одно внутри другого.</p>
<pre><code>for row := 0; row &lt; 3; row++ {
	for col := 0; col &lt; 5; col++ {
		fmt.Print("*")
	}
	fmt.Println()
}</code></pre>
<p>Читается это изнутри наружу. Внутренний цикл проходит <strong>целиком</strong> на каждом шаге внешнего: внешний сделал шаг — внутренний отработал все свои пять и закончился; внешний сделал следующий шаг — внутренний начался заново. Три шага снаружи по пять внутри, звёздочка печатается пятнадцать раз.</p>
<p>«Начался заново» — буквально. Переменная <code>col</code> создаётся заголовком внутреннего цикла, и на каждом шаге внешнего это новая переменная, снова с нулём внутри. Поэтому строки и выходят одинаковыми: внутренний цикл каждый раз проходит один и тот же путь.</p>
<p>Дальше картинку решает одна деталь — <strong>где стоит <code>fmt.Println()</code></strong>. <code>fmt.Print</code> строку не рвёт, он дописывает в неё; строка на экране кончается там, где сработал <code>Println</code>. В теле внешнего цикла, после внутреннего, он срабатывает по разу на каждый внешний шаг — три строки по пять звёздочек. Сдвинешь его на уровень внутрь, в тело внутреннего цикла, — он сработает после каждой звёздочки, и те же пятнадцать звёздочек лягут в пятнадцать строк по одной. Звёздочек столько же, картинка другая, ошибки компилятора нет.</p>
<p>Если ширина строки должна меняться, граница внутреннего цикла берётся не постоянным числом, а от внешнего счётчика. При <code>col &lt; row</code> в нулевой строке внутренний цикл не сделает ни шага, в первой сделает один, во второй два — получается лесенка.</p>`,
    en:`<p>A loop body is ordinary code: anything can go in it, including another loop. That's how one repetition turns into two dimensions, one inside the other.</p>
<pre><code>for row := 0; row &lt; 3; row++ {
	for col := 0; col &lt; 5; col++ {
		fmt.Print("*")
	}
	fmt.Println()
}</code></pre>
<p>Read it from the inside out. The inner loop runs <strong>from start to finish</strong> on every step of the outer one: the outer loop takes a step, the inner one does all five of its own and ends; the outer takes the next step, the inner starts over. Three outer steps times five inner ones, the star is printed fifteen times.</p>
<p>“Starts over” is literal. The variable <code>col</code> is created by the inner header, so on every outer step it is a new variable holding zero again. That is why the rows come out identical: the inner loop walks the same path every time.</p>
<p>From there one detail decides the picture — <strong>where <code>fmt.Println()</code> sits</strong>. <code>fmt.Print</code> doesn't break the line, it appends to it; a line on screen ends where <code>Println</code> fires. In the outer body, after the inner loop, it fires once per outer step — three rows of five stars. Move it one level in, into the inner body, and it fires after every star: the same fifteen stars land in fifteen rows of one. Same number of stars, different picture, no compiler error.</p>
<p>If the row width has to change, the inner bound comes from the outer counter instead of a fixed number. With <code>col &lt; row</code> the inner loop takes no steps in row zero, one step in row one and two in row two — that's a staircase.</p>`}
},
{
 h:{ru:"<code>range</code> считает сам и даёт номер и значение — именно в таком порядке",
    en:"<code>range</code> counts for you and gives an index and a value — in that order"},
 b:{ru:`<p>До сих пор счётчик мы вели руками: сами задавали старт, границу и шаг. Когда цикл идёт по готовому набору данных, всё это можно не писать — <code>range</code> сам знает, где начало и где конец, и выдаёт на каждом шаге две вещи: <strong>номер элемента и его значение, именно в таком порядке</strong>.</p>
<pre><code>nums := []int{10, 20, 30}

for i, v := range nums {
	fmt.Println(i, v)     <span class="cm">// 0 10 / 1 20 / 2 30</span>
}</code></pre>
<p>Раз номер идёт первым, одна переменная — это <strong>номер</strong>, а не значение. Ловушка на ровном месте: строка читается как «беру числа», а работает как «беру их номера».</p>
<pre><code>for i := range nums {
	fmt.Print(i)          <span class="cm">// 012, а не 102030</span>
}</code></pre>
<p>Нужно только значение — номер выбрасывают подчёркиванием: <code>for _, v := range nums</code>. Подчёркивание здесь не украшение: Go не разрешает создать переменную и не использовать её, поэтому просто дать номеру имя и забыть про него нельзя — код не соберётся. Не нужно ни то ни другое, а нужно повторить действие столько раз, сколько элементов, — <code>for range nums</code>.</p>
<p>По строке <code>range</code> ведёт себя не совсем так, как ожидаешь. Он идёт по <strong>буквам</strong>, а не по байтам, но номер выдаёт байтовый, а значение — руну, то есть число, код символа:</p>
<pre><code>for i, c := range "Go" {
	fmt.Println(i, c)     <span class="cm">// 0 71 / 1 111</span>
	fmt.Println(string(c))<span class="cm">// G / o</span>
}</code></pre>
<p>Поэтому <code>fmt.Print(c)</code> печатает числа, а не буквы: букву показывает только <code>string(c)</code>. И поэтому же обходить строку счётчиком по номерам (<code>s[i]</code>) не стоит — там придёт отдельный байт, и любая нелатинская буква развалится пополам.</p>`,
    en:`<p>So far we've driven the counter by hand: our own start, bound and step. When the loop walks a collection that already exists, none of that has to be written — <code>range</code> knows where the data begins and ends, and hands you two things on every step: <strong>the index of the element and its value, in that order</strong>.</p>
<pre><code>nums := []int{10, 20, 30}

for i, v := range nums {
	fmt.Println(i, v)     <span class="cm">// 0 10 / 1 20 / 2 30</span>
}</code></pre>
<p>Since the index comes first, a single variable is the <strong>index</strong>, not the value. An easy trap: the line reads like “take the numbers” and behaves like “take their positions”.</p>
<pre><code>for i := range nums {
	fmt.Print(i)          <span class="cm">// 012, not 102030</span>
}</code></pre>
<p>If you only want the value, throw the index away with an underscore: <code>for _, v := range nums</code>. The underscore isn't decoration: Go refuses to let you create a variable and never use it, so you can't just name the index and forget about it — the code won't compile. If you want neither, and only need the action repeated once per element, write <code>for range nums</code>.</p>
<p>Over a string <code>range</code> behaves a little differently than you'd expect. It walks <strong>letters</strong>, not bytes, but the index it reports is a byte offset, and the value is a rune — a number, the character's code:</p>
<pre><code>for i, c := range "Go" {
	fmt.Println(i, c)     <span class="cm">// 0 71 / 1 111</span>
	fmt.Println(string(c))<span class="cm">// G / o</span>
}</code></pre>
<p>That is why <code>fmt.Print(c)</code> prints numbers instead of letters: only <code>string(c)</code> shows the letter. And it is why walking a string with an index (<code>s[i]</code>) is a bad idea — that gives you a single byte, and any non-Latin letter falls apart in the middle.</p>`}
},
{
 h:{ru:"<code>break</code> обрывает цикл, <code>continue</code> пропускает один шаг",
    en:"<code>break</code> ends the loop, <code>continue</code> skips one step"},
 b:{ru:`<p>И <code>range</code>, и обычный счётчик задают ход цикла заранее: сколько будет шагов, видно уже по заголовку. Иногда решение приходится принимать на ходу, посреди работы. Для этого есть две команды, и обе стоят в теле, обычно внутри <code>if</code>.</p>
<pre><code>for i := 0; i &lt; 5; i++ {
	if i == 2 {
		break
	}
	fmt.Print(i)          <span class="cm">// 01 — цикл кончился на двойке</span>
}

for i := 0; i &lt; 5; i++ {
	if i == 2 {
		continue
	}
	fmt.Print(i)          <span class="cm">// 0134 — пропущен только один шаг</span>
}</code></pre>
<p>Общее у них одно: обе бросают остаток тела — всё, что стоит в теле ниже, в этом проходе не выполнится. Дальше пути расходятся.</p>
<p><code>break</code> заканчивает цикл целиком: следующих проходов не будет, управление уходит на первую строку после закрывающей скобки. Заголовок при этом не соврал — он разрешал пять шагов, просто до них не дошло.</p>
<p><code>continue</code> заканчивает только текущий проход и переходит <strong>к шагу счётчика</strong>, а оттуда к обычной проверке. Цикл продолжается. Заметь порядок: шаг после <code>continue</code> выполняется — потому цикл и не виснет. А вот в цикле, где шаг написан руками в теле (<code>for i &lt; n</code>), <code>continue</code>, поставленный выше строки <code>i++</code>, до неё просто не доходит: счётчик застревает, и программа виснет.</p>
<p>Во вложенных циклах обе команды действуют только на тот цикл, <strong>в котором написаны</strong>. <code>break</code> во внутреннем цикле обрывает внутренний и возвращает во внешний, а не выходит из обоих сразу — внешний спокойно доделает свои шаги. Из-за этого фигуры обрываются не там, где ждали.</p>`,
    en:`<p>Both <code>range</code> and a plain counter settle how the loop will run in advance: the header already tells you how many steps there will be. Sometimes the decision has to be made mid-run. Two commands do that, and both live in the body, usually inside an <code>if</code>.</p>
<pre><code>for i := 0; i &lt; 5; i++ {
	if i == 2 {
		break
	}
	fmt.Print(i)          <span class="cm">// 01 — the loop ended at two</span>
}

for i := 0; i &lt; 5; i++ {
	if i == 2 {
		continue
	}
	fmt.Print(i)          <span class="cm">// 0134 — only one step was skipped</span>
}</code></pre>
<p>They share one thing: both abandon the rest of the body — everything below them is skipped for this pass. After that they part ways.</p>
<p><code>break</code> ends the loop entirely: there are no further passes, and control moves to the first line after the closing brace. The header wasn't lying — it allowed five steps, they just never happened.</p>
<p><code>continue</code> ends only the current pass and jumps <strong>to the step</strong>, and from there to the usual check. The loop keeps going. Note the order: the step after a <code>continue</code> does run, which is why the loop doesn't hang. In a loop where the step is written by hand in the body (<code>for i &lt; n</code>), though, a <code>continue</code> placed above the <code>i++</code> line never reaches it: the counter freezes and the program hangs.</p>
<p>In nested loops both commands affect only the loop <strong>they are written in</strong>. A <code>break</code> in the inner loop ends the inner loop and returns to the outer one; it does not leave both at once — the outer loop calmly finishes its steps. This is why shapes get cut short in the wrong place.</p>`}
},
{
 h:{ru:"Части заголовка можно убирать — и цикл теряет конец",
    en:"You can drop parts of the header — and the loop loses its ending"},
 b:{ru:`<p>До сих пор все три части заголовка стояли на месте. Их можно убирать — и тогда видно, за что каждая отвечала. Убрал старт и шаг, оставил условие — получился цикл «пока»:</p>
<pre><code>i := 0
for i &lt; 3 {
	fmt.Println(i)
	i++            <span class="cm">// шаг теперь делаешь руками, и его-то и забывают</span>
}</code></pre>
<p>Отдельного слова <code>while</code> в Go нет, это и есть его замена. Счётчик приходится создавать до цикла — значит, он переживёт цикл и будет виден после него. Но и двигать его теперь твоя забота.</p>
<p>Убрал всё — условия не осталось. Проверять нечего, значит проверка никогда не даст ложь:</p>
<pre><code>for {
	<span class="cm">// без break отсюда не выйти</span>
}</code></pre>
<p>Так пишут осознанно, когда конец заранее неизвестен, и выход делают через <code>break</code> в теле. Гораздо чаще бесконечность выходит случайно, и причина всегда одна: <strong>условие проверяет то, что не меняется</strong>. Три обычных способа этого добиться:</p>
<ul>
<li>забыт шаг: <code>for i := 0; i &lt; 3; { … }</code> или цикл «пока» без <code>i++</code> в теле;</li>
<li>шаг в другую сторону: <code>for i := 0; i &lt; 3; i--</code> — <code>i</code> уходит в минус, и <code>i &lt; 3</code> остаётся истинным навсегда;</li>
<li>двигается не тот счётчик: во внутреннем цикле по ошибке <code>i++</code> вместо <code>j++</code>.</li>
</ul>
<p>Признак: программа висит молча либо печатает одно и то же без остановки. Останавливают её <code>Ctrl+C</code>. Искать надо не в теле, а в шаге, и вопрос ровно один: приближает ли шаг счётчик к границе?</p>`,
    en:`<p>Up to now all three header parts have been in place. You can drop them — and then you can see what each one was doing. Drop the start and the step, keep the condition, and you get a “while” loop:</p>
<pre><code>i := 0
for i &lt; 3 {
	fmt.Println(i)
	i++            <span class="cm">// the step is yours now, and this is what gets forgotten</span>
}</code></pre>
<p>Go has no separate <code>while</code> keyword; this is the replacement. The counter has to be created before the loop, which means it outlives the loop and is still visible afterwards. But moving it is now your job.</p>
<p>Drop everything and no condition is left. There is nothing to check, so the check can never come out false:</p>
<pre><code>for {
	<span class="cm">// no way out without break</span>
}</code></pre>
<p>People write this on purpose when the end isn't known in advance, and put a <code>break</code> in the body for the exit. Far more often endlessness happens by accident, and the cause is always the same: <strong>the condition tests something that never changes</strong>. Three usual ways to get there:</p>
<ul>
<li>the step is missing: <code>for i := 0; i &lt; 3; { … }</code>, or a “while” loop with no <code>i++</code> in the body;</li>
<li>the step goes the wrong way: <code>for i := 0; i &lt; 3; i--</code> — <code>i</code> goes negative and <code>i &lt; 3</code> stays true forever;</li>
<li>the wrong counter moves: <code>i++</code> instead of <code>j++</code> inside the inner loop.</li>
</ul>
<p>The symptom: the program hangs silently, or prints the same thing over and over. Stop it with <code>Ctrl+C</code>. Look at the step, not at the body, and ask exactly one question: does the step move the counter toward the bound?</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ + ГРАБЛИ ================= */
var TABLE = {
  title:{ru:"Сколько шагов сделает цикл",en:"How many steps a loop takes"},
  intro:{ru:"Первое, что надо уметь с циклом, — назвать количество шагов, не запуская программу.",en:"The first skill with a loop is naming the number of steps without running the program."},
  head:{ru:["Заголовок цикла","Значения i","Шагов"], en:["Loop header","Values of i","Steps"]},
  rows:[
    ["for i := 0; i < 5; i++","0 1 2 3 4","5"],
    ["for i := 0; i <= 5; i++","0 1 2 3 4 5","6"],
    ["for i := 1; i <= 5; i++","1 2 3 4 5","5"],
    ["for i := 5; i > 0; i--","5 4 3 2 1","5"],
    ["for i := 0; i < 10; i += 2","0 2 4 6 8","5"],
    ["for i := 0; i < 0; i++",{ru:"нет ни одного",en:"none"},"0"],
    ["for i := 0; i <= len(s); i++",{ru:"0 … len(s) — последний за границей",en:"0 … len(s) — the last one is out of range"},{ru:"падение",en:"crash"}],
    ["for i := range nums",{ru:"0 1 2 …",en:"0 1 2 …"},{ru:"по числу элементов",en:"one per element"}],
    ["for range \"Привет\"",{ru:"счётчика нет",en:"no counter"},"6"]
  ]
};

var TRAPS = [
 {ru:"<strong><code>fmt.Println()</code> внутри внутреннего цикла.</strong> Вместо прямоугольника 3×5 выходит столбик из пятнадцати одиночных звёздочек. Ни одной ошибки компилятора — просто перевод строки стоит на строку выше, чем нужно. Место у него одно: в теле внешнего цикла, после внутреннего.",
  en:"<strong><code>fmt.Println()</code> inside the inner loop.</strong> Instead of a 3×5 rectangle you get a column of fifteen single stars. Not one compiler error — the line break just sits one level too deep. It belongs in the outer body, after the inner loop."},
 {ru:"<strong><code>i &lt;= len(s)</code> при обходе слайса.</strong> Цикл делает один лишний шаг и программа падает: <code>panic: index out of range [3] with length 3</code>. У слайса из трёх элементов индексы 0, 1, 2 — граница должна быть строгой: <code>i &lt; len(s)</code>.",
  en:"<strong><code>i &lt;= len(s)</code> when walking a slice.</strong> The loop takes one extra step and the program crashes: <code>panic: index out of range [3] with length 3</code>. A three-element slice has indices 0, 1, 2 — the bound must be strict: <code>i &lt; len(s)</code>."},
 {ru:"<strong>Программа запустилась и висит.</strong> Значит, счётчик не двигается к границе: забыт <code>i++</code>, или стоит <code>i--</code> при условии <code>i &lt; n</code>, или во внутреннем цикле по ошибке меняется внешний счётчик. Жми <code>Ctrl+C</code> и смотри на шаг, а не на тело.",
  en:"<strong>The program starts and hangs.</strong> That means the counter isn't moving toward the bound: <code>i++</code> is missing, or it's <code>i--</code> with an <code>i &lt; n</code> condition, or the inner loop bumps the outer counter by mistake. Hit <code>Ctrl+C</code> and look at the step, not the body."},
 {ru:"<strong>Одна переменная в <code>range</code> — это номер.</strong> <code>for v := range nums</code> даст 0, 1, 2, а не сами числа. Выглядит как «беру значения», работает как «беру индексы». Нужны значения — <code>for _, v := range nums</code>.",
  en:"<strong>A single variable in <code>range</code> is the index.</strong> <code>for v := range nums</code> yields 0, 1, 2 — not the numbers themselves. It reads like “take the values”, it behaves like “take the indices”. For values write <code>for _, v := range nums</code>."},
 {ru:"<strong><code>fmt.Print(c)</code> в цикле по строке печатает числа.</strong> В <code>for i, c := range s</code> переменная <code>c</code> — руна, то есть код символа. Вместо букв на экране столбик вроде 1055, 1088, 1080. Букву покажет <code>string(c)</code>.",
  en:"<strong><code>fmt.Print(c)</code> in a string loop prints numbers.</strong> In <code>for i, c := range s</code> the variable <code>c</code> is a rune, that is a character code. Instead of letters you get a column like 1055, 1088, 1080. <code>string(c)</code> shows the letter."},
 {ru:"<strong>Накопитель, созданный внутри цикла, обнуляется каждый шаг.</strong> <code>sum := 0</code> должен стоять ДО <code>for</code>, иначе сумма всегда равна последнему числу. И наоборот: счётчик цикла живёт только внутри — строка <code>fmt.Println(i)</code> после цикла не соберётся, <code>undefined: i</code>.",
  en:"<strong>An accumulator created inside the loop resets every step.</strong> <code>sum := 0</code> must sit BEFORE the <code>for</code>, otherwise the sum always equals the last number. And the other way round: the loop counter lives only inside — <code>fmt.Println(i)</code> after the loop won't compile, <code>undefined: i</code>."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

func main() {
	for i := 0; i < 5; i++ {
		fmt.Println(i)
	}
}`,
 out:"0\n1\n2\n3\n4",
 why:{ru:"Пять строк, а не шесть: счётчик начал с нуля и остановился на четырёх — пятёрка условие <code>i &lt; 5</code> уже не прошла.<br><b>Сломай:</b> убери <code>i++</code> и запусти. Программа зависнет — останавливай <code>Ctrl+C</code>.",
      en:"Five lines, not six: the counter started at zero and stopped at four — five already fails <code>i &lt; 5</code>.<br><b>Break it:</b> remove <code>i++</code> and run. The program hangs — stop it with <code>Ctrl+C</code>."}
},
{
 chg:{ru:"строгий знак стал нестрогим", en:"the strict comparison became non-strict"},
 code:`package main

import "fmt"

func main() {
	for i := 0; i <= 5; i++ {
		fmt.Println(i)
	}
}`,
 out:"0\n1\n2\n3\n4\n5",
 why:{ru:"Изменился один символ — шагов стало шесть вместо пяти. Компилятор здесь молчит: оба варианта законны. Это и есть ошибка на единицу.",
      en:"One character changed and the loop takes six steps instead of five. The compiler says nothing: both forms are legal. This is the off-by-one error."}
},
{
 chg:{ru:"печатаем звёздочку вместо счётчика", en:"printing a star instead of the counter"},
 code:`package main

import "fmt"

func main() {
	for i := 0; i <= 5; i++ {
		fmt.Print("*")
	}
	fmt.Println()
}`,
 out:"******",
 why:{ru:"Звёздочек шесть, потому что нестрогая граница из прошлого примера осталась на месте. Теперь <code>i</code> в теле нет — он только считает, а на экран не попадает.",
      en:"Six stars, because the non-strict bound from the previous example is still there. <code>i</code> no longer appears in the body — it just counts and never reaches the screen."}
},
{
 chg:{ru:"вернули строгую границу", en:"the strict bound is back"},
 code:`package main

import "fmt"

func main() {
	for i := 0; i < 5; i++ {
		fmt.Print("*")
	}
	fmt.Println()
}`,
 out:"*****",
 why:{ru:"Пять звёздочек. Тело не менялось вообще — количество повторов задаётся только заголовком цикла.",
      en:"Five stars. The body didn't change at all — the number of repeats is set by the loop header alone."}
},
{
 chg:{ru:"вокруг появился второй цикл", en:"a second loop wrapped around it"},
 code:`package main

import "fmt"

func main() {
	for row := 0; row < 3; row++ {
		for i := 0; i < 5; i++ {
			fmt.Print("*")
		}
		fmt.Println()
	}
}`,
 out:"*****\n*****\n*****",
 why:{ru:"Внутренний цикл проходит целиком на каждом шаге внешнего: 3 × 5 = 15 звёздочек. <code>fmt.Println()</code> переехал в тело внешнего цикла — по одному разу на строку.",
      en:"The inner loop runs completely on every outer step: 3 × 5 = 15 stars. <code>fmt.Println()</code> moved into the outer body — once per row."}
},
{
 chg:{ru:"вместо звёздочки печатаем внутренний счётчик", en:"printing the inner counter instead of a star"},
 code:`package main

import "fmt"

func main() {
	for row := 0; row < 3; row++ {
		for i := 0; i < 5; i++ {
			fmt.Print(i)
		}
		fmt.Println()
	}
}`,
 out:"01234\n01234\n01234",
 why:{ru:"Строки одинаковые — значит, внутренний счётчик каждый раз начинается заново. Он создаётся на каждом шаге внешнего цикла и умирает вместе с ним.",
      en:"The rows are identical — so the inner counter restarts every time. It is created on each outer step and dies with it."}
},
{
 chg:{ru:"перевод строки переехал внутрь внутреннего цикла", en:"the line break moved inside the inner loop"},
 code:`package main

import "fmt"

func main() {
	for row := 0; row < 3; row++ {
		for i := 0; i < 5; i++ {
			fmt.Print(i)
			fmt.Println()
		}
	}
}`,
 out:"0\n1\n2\n3\n4\n0\n1\n2\n3\n4\n0\n1\n2\n3\n4",
 why:{ru:"Картинка развалилась в столбик из пятнадцати строк. Изменилось только одно — где стоит <code>Println</code>. <b>Запомни этот вывод</b>: увидишь его в своих задачах на фигуры.",
      en:"The picture fell apart into a column of fifteen lines. Only one thing changed — where <code>Println</code> sits. <b>Remember this output</b>: you'll meet it in your own shape tasks."}
},
{
 chg:{ru:"добавлен break (перевод строки вернули на место)", en:"break added (the line break is back where it belongs)"},
 code:`package main

import "fmt"

func main() {
	for row := 0; row < 3; row++ {
		for i := 0; i < 5; i++ {
			if i == 3 {
				break
			}
			fmt.Print(i)
		}
		fmt.Println()
	}
}`,
 out:"012\n012\n012",
 why:{ru:"Внутренний цикл заявлен до пяти, а обрывается на трёх. Важно: <code>break</code> вышел только из внутреннего цикла — внешний спокойно сделал все три шага.",
      en:"The inner loop is declared up to five but ends at three. Note: <code>break</code> left only the inner loop — the outer one calmly took all three steps."}
},
{
 chg:{ru:"break стал continue", en:"break became continue"},
 code:`package main

import "fmt"

func main() {
	for row := 0; row < 3; row++ {
		for i := 0; i < 5; i++ {
			if i == 3 {
				continue
			}
			fmt.Print(i)
		}
		fmt.Println()
	}
}`,
 out:"0124\n0124\n0124",
 why:{ru:"Было <code>012</code>, стало <code>0124</code>. <code>break</code> обрывает цикл, <code>continue</code> пропускает один шаг и идёт дальше — тройка исчезла, четвёрка осталась.",
      en:"It was <code>012</code>, now it's <code>0124</code>. <code>break</code> ends the loop, <code>continue</code> skips one step and carries on — the three vanished, the four stayed."}
},
{
 chg:{ru:"цикл со счётчиком заменили на range", en:"the counted loop was replaced by range"},
 code:`package main

import "fmt"

func main() {
	nums := []int{10, 20, 30}
	for i, v := range nums {
		fmt.Println(i, v)
	}
	for i, c := range "Go!" {
		fmt.Println(i, c, string(c))
	}
}`,
 out:"0 10\n1 20\n2 30\n0 71 G\n1 111 o\n2 33 !",
 why:{ru:"Первая переменная — номер, вторая — значение. По строке значение приходит руной, то есть числом: 71 и <code>G</code> в одной строке — это одно и то же.<br><b>Сломай:</b> убери <code>v</code> и оставь <code>for i := range nums</code> — вывод станет 0, 1, 2.",
      en:"The first variable is the index, the second is the value. Over a string the value arrives as a rune, that is a number: 71 and <code>G</code> on one line are the same thing.<br><b>Break it:</b> drop <code>v</code> and leave <code>for i := range nums</code> — the output becomes 0, 1, 2."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"CountToFive", lvl:1, e:"1\n2\n3\n4\n5",
 d:{ru:"Напечатай числа от 1 до 5, каждое на своей строке.",
    en:"Print the numbers from 1 to 5, each on its own line."},
 h:{ru:"Старт <code>i := 1</code>, граница <code>i &lt;= 5</code>. Со строгим знаком последняя пятёрка не напечатается.",
    en:"Start with <code>i := 1</code>, bound <code>i &lt;= 5</code>. With a strict comparison the last five never prints."}},

{t:"SevenStars", lvl:1, e:"*******",
 d:{ru:"Напечатай семь звёздочек в одну строку, а после них — перевод строки.",
    en:"Print seven stars on one line, followed by a line break."},
 h:{ru:"Счётчик здесь только считает, в теле его нет. Печатай <code>fmt.Print(\"*\")</code>, а <code>fmt.Println()</code> поставь после цикла.",
    en:"Here the counter only counts, it never appears in the body. Print <code>fmt.Print(\"*\")</code> and put <code>fmt.Println()</code> after the loop."}},

{t:"CountDown", lvl:1, e:"5\n4\n3\n2\n1",
 d:{ru:"Напечатай числа от 5 до 1, каждое на своей строке.",
    en:"Print the numbers from 5 down to 1, each on its own line."},
 h:{ru:"Разворачиваются все три части: старт <code>i := 5</code>, условие <code>i &gt; 0</code>, шаг <code>i--</code>.",
    en:"All three parts flip: start <code>i := 5</code>, condition <code>i &gt; 0</code>, step <code>i--</code>."}},

{t:"EvenNumbers", lvl:1, e:"0\n2\n4\n6\n8\n10",
 d:{ru:"Напечатай чётные числа от 0 до 10 включительно, каждое на своей строке.",
    en:"Print the even numbers from 0 to 10 inclusive, each on its own line."},
 h:{ru:"Шаг не обязан быть <code>i++</code>. Пиши <code>i += 2</code>. Десятка должна попасть в вывод — значит граница нестрогая.",
    en:"The step doesn't have to be <code>i++</code>. Write <code>i += 2</code>. Ten must appear in the output — so the bound is non-strict."}},

{t:"SumTo100", lvl:2, e:"5050",
 d:{ru:"Посчитай сумму всех чисел от 1 до 100 и напечатай её одним числом.",
    en:"Add up all the numbers from 1 to 100 and print the result as a single number."},
 h:{ru:"Накопитель <code>sum := 0</code> создавай ДО цикла. Внутри — <code>sum += i</code>, печать после цикла. Создашь <code>sum</code> внутри — получишь 100.",
    en:"Create the accumulator <code>sum := 0</code> BEFORE the loop. Inside, do <code>sum += i</code>; print after the loop. Create <code>sum</code> inside and you get 100."}},

{t:"Rectangle", lvl:2, e:"******\n******\n******\n******",
 d:{ru:"Нарисуй прямоугольник из звёздочек: четыре строки по шесть штук.",
    en:"Draw a rectangle of stars: four rows of six."},
 h:{ru:"Два цикла: внешний считает строки, внутренний — звёздочки в строке. <code>fmt.Println()</code> ставь в теле внешнего цикла, после внутреннего.",
    en:"Two loops: the outer counts rows, the inner counts stars in a row. Put <code>fmt.Println()</code> in the outer body, after the inner loop."}},

{t:"SkipEveryThird", lvl:2, e:"1\n2\n4\n5\n7\n8\n10",
 d:{ru:"Напечатай числа от 1 до 10, каждое на своей строке, но пропусти те, что делятся на 3.",
    en:"Print the numbers from 1 to 10, each on its own line, but skip those divisible by 3."},
 h:{ru:"Делимость проверяется остатком: <code>i%3 == 0</code>. Пропустить шаг, не обрывая цикл, — это <code>continue</code>.",
    en:"Divisibility is checked with the remainder: <code>i%3 == 0</code>. Skipping a step without ending the loop is <code>continue</code>."}},

{t:"MulTable", lvl:3, e:"1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9",
 d:{ru:"Напечатай таблицу умножения от 1 до 3 в виде строк <code>1 x 2 = 2</code>. Девять строк, первое число меняется медленнее второго.",
    en:"Print a multiplication table from 1 to 3 as lines like <code>1 x 2 = 2</code>. Nine lines; the first number changes more slowly than the second."},
 h:{ru:"Оба цикла идут от 1 до 3 включительно. Строка целиком печатается одним вызовом: <code>fmt.Println(i, \"x\", j, \"=\", i*j)</code> — <code>Println</code> сам ставит пробелы между значениями.",
    en:"Both loops run from 1 to 3 inclusive. The whole line is one call: <code>fmt.Println(i, \"x\", j, \"=\", i*j)</code> — <code>Println</code> inserts the spaces itself."}},

{t:"Triangle", lvl:3, e:"*\n**\n***\n****\n*****",
 d:{ru:"Нарисуй лесенку из звёздочек: пять строк, в первой одна звёздочка, в последней пять.",
    en:"Draw a staircase of stars: five rows, one star in the first, five in the last."},
 h:{ru:"Ширина строки меняется — значит, граница внутреннего цикла считается от внешнего счётчика, а не от постоянного числа.",
    en:"The row width changes — so the inner bound is computed from the outer counter, not from a fixed number."}},

{t:"HollowSquare", lvl:3, e:"*****\n*   *\n*   *\n*   *\n*****",
 d:{ru:"Нарисуй квадрат 5×5, у которого звёздочки только по краю, а внутри пробелы.",
    en:"Draw a 5×5 square with stars only along the border and spaces inside."},
 h:{ru:"Цикл обходит все 25 клеток. На каждой решается, что печатать: звёздочку, если клетка в первой или последней строке либо в первом или последнем столбце, иначе пробел. Проверок четыре, соединяются через <code>||</code>.",
    en:"The loop visits all 25 cells. For each one you decide what to print: a star if the cell is in the first or last row, or the first or last column; otherwise a space. Four checks joined with <code>||</code>."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};
var INF = {ru:"цикл никогда не закончится", en:"the loop never ends"};

var BANK = [
{q:Q_OUT, code:"for i := 0; i < 3; i++ {\n\tfmt.Print(i)\n}", opts:["012","123","0123","0 1 2"], ok:0,
 why:{ru:"Старт с нуля, граница строгая — значит <code>i</code> принимает 0, 1, 2. Тройка условие уже не проходит. <code>Print</code> пробелов между вызовами не добавляет.",
      en:"Starts at zero with a strict bound, so <code>i</code> takes 0, 1, 2. Three already fails the check. <code>Print</code> adds no spaces between calls."}},

{q:Q_OUT, code:"for i := 1; i <= 3; i++ {\n\tfmt.Print(i)\n}", opts:["123","0123","012","1234"], ok:0,
 why:{ru:"Старт с единицы и нестрогая граница дают ровно три шага: 1, 2, 3. Пара «старт 1 / знак <=» — обычный способ считать от единицы.",
      en:"Starting at one with a non-strict bound gives exactly three steps: 1, 2, 3. The “start at 1 / use <=” pair is the usual way to count from one."}},

{q:{ru:"Сколько раз выполнится тело у <code>for i := 0; i &lt;= 5; i++</code>?", en:"How many times does the body of <code>for i := 0; i &lt;= 5; i++</code> run?"},
 code:null, opts:["6","5","7","0"], ok:0,
 why:{ru:"<code>i</code> принимает значения 0, 1, 2, 3, 4, 5 — шесть штук. Со строгим знаком было бы пять. Ровно на этом знаке ломаются фигуры и обходы слайсов.",
      en:"<code>i</code> takes 0, 1, 2, 3, 4, 5 — six values. With a strict comparison it would be five. This one character is where shapes and slice walks break."}},

{q:Q_OUT, code:"for i := 0; i < 5; i++ {\n\tif i == 2 {\n\t\tbreak\n\t}\n\tfmt.Print(i)\n}", opts:["01","0134","01234","012"], ok:0,
 why:{ru:"<code>break</code> обрывает цикл целиком. На шаге <code>i == 2</code> печать до неё не доходит, и следующих шагов не будет — хотя в заголовке заявлено до пяти.",
      en:"<code>break</code> ends the whole loop. On the <code>i == 2</code> step the print is never reached, and there are no further steps — even though the header promised five."}},

{q:Q_OUT, code:"for i := 0; i < 5; i++ {\n\tif i == 2 {\n\t\tcontinue\n\t}\n\tfmt.Print(i)\n}", opts:["0134","01","01234","034"], ok:0,
 why:{ru:"<code>continue</code> бросает остаток тела и переходит к шагу счётчика. Пропала только двойка, цикл дошёл до конца. Сравни с <code>break</code>: там вывод был бы <code>01</code>.",
      en:"<code>continue</code> drops the rest of the body and jumps to the step. Only the two is missing; the loop ran to the end. Compare with <code>break</code>, which would print <code>01</code>."}},

{q:Q_OUT, code:"for i := 0; i < 2; i++ {\n\tfor j := 0; j < 3; j++ {\n\t\tfmt.Print(\"*\")\n\t}\n\tfmt.Println()\n}",
 opts:[{ru:"две строки по три звёздочки",en:"two lines of three stars"},
       {ru:"одна строка из шести звёздочек",en:"one line of six stars"},
       {ru:"шесть строк по одной звёздочке",en:"six lines of one star"},
       {ru:"три строки по две звёздочки",en:"three lines of two stars"}], ok:0,
 why:{ru:"Внешний цикл даёт строки, внутренний — звёздочки в строке. <code>Println</code> стоит в теле внешнего цикла, значит срабатывает дважды.",
      en:"The outer loop makes rows, the inner one makes stars within a row. <code>Println</code> sits in the outer body, so it fires twice."}},

{q:Q_OUT, code:"for i := 0; i < 2; i++ {\n\tfor j := 0; j < 3; j++ {\n\t\tfmt.Print(\"*\")\n\t\tfmt.Println()\n\t}\n}",
 opts:[{ru:"шесть строк по одной звёздочке",en:"six lines of one star"},
       {ru:"две строки по три звёздочки",en:"two lines of three stars"},
       {ru:"одна строка из шести звёздочек",en:"one line of six stars"},
       {ru:"три строки по две звёздочки",en:"three lines of two stars"}], ok:0,
 why:{ru:"<code>Println</code> переехал внутрь внутреннего цикла и теперь срабатывает после каждой звёздочки — шесть раз. Одно и то же количество звёздочек, совсем другая картинка.",
      en:"<code>Println</code> moved inside the inner loop and now fires after every star — six times. Same number of stars, completely different picture."}},

{q:Q_HAP, code:"i := 0\nfor i < 3 {\n\tfmt.Println(i)\n}",
 opts:[INF,{ru:"напечатает 0 1 2",en:"prints 0 1 2"},{ru:"напечатает 0 один раз",en:"prints 0 once"},NO], ok:0,
 why:{ru:"В такой записи у <code>for</code> только условие — шаг надо делать руками в теле. <code>i</code> остаётся нулём, <code>0 &lt; 3</code> истинно всегда, ноль печатается без остановки. Лечится строкой <code>i++</code> в теле.",
      en:"In this form <code>for</code> has only a condition — the step is yours to write in the body. <code>i</code> stays zero, <code>0 &lt; 3</code> is always true, and zero prints forever. Fix it with an <code>i++</code> in the body."}},

{q:Q_HAP, code:"for i := 0; i < 3; i-- {\n\tfmt.Println(i)\n}",
 opts:[INF,{ru:"напечатает 0 1 2",en:"prints 0 1 2"},{ru:"не напечатает ничего",en:"prints nothing"},NO], ok:0,
 why:{ru:"Шаг уводит <code>i</code> в минус: 0, −1, −2… Условие <code>i &lt; 3</code> при этом истинно всегда. Смотри не на тело, а на то, приближает ли шаг счётчик к границе.",
      en:"The step drives <code>i</code> negative: 0, −1, −2… and <code>i &lt; 3</code> stays true forever. Don't look at the body — check whether the step moves the counter toward the bound."}},

{q:{ru:"Что означает <code>for { }</code> без всяких частей?", en:"What does a bare <code>for { }</code> mean?"},
 code:null,
 opts:[{ru:"цикл крутится, пока не встретит break",en:"the loop runs until it hits a break"},
       {ru:"цикл выполняется один раз",en:"the loop runs once"},
       {ru:"цикл не выполняется",en:"the loop doesn't run"},
       NO], ok:0,
 why:{ru:"Условия нет — значит проверять нечего и цикл не заканчивается сам. Так пишут осознанно, когда конец заранее неизвестен, и выход делают через <code>break</code> внутри тела.",
      en:"There is no condition, so there is nothing to check and the loop never ends on its own. It's written on purpose when the end isn't known in advance, with a <code>break</code> inside for the exit."}},

{q:{ru:"Как в Go записать цикл «пока <code>x &lt; 10</code>»?", en:"How do you write a “while <code>x &lt; 10</code>” loop in Go?"},
 code:null,
 opts:["for x < 10 { }","while x < 10 { }","do { } while x < 10","loop x < 10 { }"], ok:0,
 why:{ru:"Отдельного слова <code>while</code> в Go нет — у <code>for</code> просто убирают старт и шаг. Обратная сторона: шаг теперь твоя забота, и забытый шаг вешает программу.",
      en:"Go has no separate <code>while</code> keyword — you just drop the start and the step from <code>for</code>. The flip side: the step is now your job, and a forgotten step hangs the program."}},

{q:Q_OUT, code:"for i := range []int{7, 8, 9} {\n\tfmt.Print(i)\n}", opts:["012","789","0 1 2","789012"], ok:0,
 why:{ru:"Одна переменная в <code>range</code> — это <strong>номер</strong>, а не значение. Читается как «беру числа», работает как «беру индексы». Нужны значения — <code>for _, v := range …</code>.",
      en:"A single variable in <code>range</code> is the <strong>index</strong>, not the value. It reads as “take the numbers”, it behaves as “take the indices”. For values write <code>for _, v := range …</code>."}},

{q:Q_OUT, code:"for _, v := range []int{7, 8, 9} {\n\tfmt.Print(v)\n}", opts:["789","012","7 8 9",NO], ok:0,
 why:{ru:"Подчёркивание выбрасывает номер и оставляет значение. Оно нужно именно потому, что Go не разрешает создавать переменную и не использовать её.",
      en:"The underscore throws the index away and keeps the value. It exists precisely because Go refuses to let you create a variable and not use it."}},

{q:Q_OUT, code:"for i, c := range \"Go\" {\n\tfmt.Println(i, c)\n}",
 opts:[{ru:"две строки: 0 71 и 1 111",en:"two lines: 0 71 and 1 111"},
       {ru:"две строки: 0 G и 1 o",en:"two lines: 0 G and 1 o"},
       {ru:"одна строка: G o",en:"one line: G o"},
       {ru:"две строки: 1 71 и 2 111",en:"two lines: 1 71 and 2 111"}], ok:0,
 why:{ru:"Значение приходит руной, то есть кодом символа: <code>G</code> это 71, <code>o</code> это 111. Букву покажет только <code>string(c)</code>.",
      en:"The value arrives as a rune, that is a character code: <code>G</code> is 71, <code>o</code> is 111. Only <code>string(c)</code> shows the letter."}},

{q:Q_OUT, code:"for i := 0; i < 0; i++ {\n\tfmt.Println(\"hi\")\n}\nfmt.Println(\"end\")",
 opts:["end","hi\nend",{ru:"ничего",en:"nothing"},INF], ok:0,
 why:{ru:"Условие проверяется <strong>до</strong> первого прохода тела. <code>0 &lt; 0</code> ложно сразу, поэтому тело не выполнится ни разу. Цикл, который не сделал ни шага, — нормальная ситуация, а не ошибка.",
      en:"The condition is checked <strong>before</strong> the first pass. <code>0 &lt; 0</code> is false right away, so the body never runs. A loop that takes zero steps is normal, not a bug."}},

{q:Q_HAP, code:"i := 0\nx := i++\nfmt.Println(x)",
 opts:[NO,"0","1",{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"В Go <code>i++</code> — это отдельная команда, а не выражение: у неё нет значения, которое можно куда-то присвоить. И <code>++i</code> в языке тоже нет.",
      en:"In Go <code>i++</code> is a statement, not an expression: it has no value to assign anywhere. And there is no <code>++i</code> in the language either."}},

{q:Q_HAP, code:"for i := 0; i < 3; i++ {\n}\nfmt.Println(i)",
 opts:[NO,"3","2","0"], ok:0,
 why:{ru:"Счётчик, созданный в заголовке через <code>:=</code>, существует только внутри цикла. После закрывающей скобки его нет: <code>undefined: i</code>. Нужно значение после цикла — создавай переменную до цикла.",
      en:"A counter created in the header with <code>:=</code> exists only inside the loop. After the closing brace it's gone: <code>undefined: i</code>. If you need the value afterwards, declare the variable before the loop."}},

{q:{ru:"Во вложенных циклах <code>break</code> стоит во внутреннем. Из какого цикла он выйдет?",
    en:"In nested loops a <code>break</code> sits in the inner one. Which loop does it leave?"},
 code:null,
 opts:[{ru:"только из внутреннего",en:"the inner one only"},
       {ru:"из обоих сразу",en:"both at once"},
       {ru:"только из внешнего",en:"the outer one only"},
       {ru:"из функции целиком",en:"the whole function"}], ok:0,
 why:{ru:"<code>break</code> действует на тот цикл, в котором написан. Внешний продолжит свои шаги как ни в чём не бывало. Из-за этого фигуры «обрываются» не там, где ждали.",
      en:"<code>break</code> affects the loop it is written in. The outer loop carries on as if nothing happened. This is why shapes get cut short in the wrong place."}},

{q:{ru:"Где создавать переменную-накопитель для суммы?", en:"Where do you create the accumulator variable for a sum?"},
 code:null,
 opts:[{ru:"до цикла",en:"before the loop"},
       {ru:"внутри тела цикла",en:"inside the loop body"},
       {ru:"после цикла",en:"after the loop"},
       {ru:"в заголовке цикла, рядом со счётчиком",en:"in the loop header, next to the counter"}], ok:0,
 why:{ru:"Переменная, созданная внутри тела, рождается заново на каждом шаге и обнуляется. Сумма тогда равна последнему слагаемому. Накопитель должен пережить весь цикл — значит, создавать его надо снаружи.",
      en:"A variable created inside the body is born again on every step and reset. The sum then equals the last term. The accumulator must outlive the loop, so it has to be created outside."}},

{q:Q_HAP, code:"s := []int{1, 2, 3}\nfor i := 0; i <= len(s); i++ {\n\tfmt.Println(s[i])\n}",
 opts:[{ru:"напечатает 1 2 3 и упадёт: index out of range",en:"prints 1 2 3, then crashes: index out of range"},
       {ru:"напечатает 1 2 3",en:"prints 1 2 3"},
       {ru:"напечатает 1 2 3 и ноль",en:"prints 1 2 3 and a zero"},
       NO], ok:0,
 why:{ru:"У слайса из трёх элементов индексы 0, 1, 2. Нестрогая граница даёт четвёртый шаг с <code>i == 3</code>, а <code>s[3]</code> не существует. Собирается такой код без единой жалобы — ломается только на запуске.",
      en:"A three-element slice has indices 0, 1, 2. The non-strict bound adds a fourth step with <code>i == 3</code>, and <code>s[3]</code> doesn't exist. This compiles without a single complaint and breaks only at run time."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"В каком порядке выполняются три части <code>for</code>?", en:"In what order do the three parts of <code>for</code> run?"},
 a:{ru:`<p>Для <code>for i := 0; i &lt; 3; i++ { тело }</code> порядок такой:</p>
<ul>
<li><code>i := 0</code> — один раз, в самом начале;</li>
<li><code>i &lt; 3</code> — проверка;</li>
<li>тело — если проверка дала истину;</li>
<li><code>i++</code> — шаг;</li>
<li>снова проверка, снова тело, снова шаг…</li>
<li>проверка дала ложь — выход, тело в этот раз не выполняется.</li>
</ul>
<p>Из этого порядка следуют две вещи, которые новички часто путают.</p>
<p>Первое: <strong>условие проверяется до тела</strong>, поэтому цикл может не выполниться ни разу. <code>for i := 0; i &lt; 0; i++</code> не сделает ни шага.</p>
<p>Второе: <strong>шаг выполняется после тела</strong>, а не перед ним. Внутри тела на первом проходе <code>i</code> равен нулю, а не единице.</p>`,
    en:`<p>For <code>for i := 0; i &lt; 3; i++ { body }</code> the order is:</p>
<ul>
<li><code>i := 0</code> — once, at the very start;</li>
<li><code>i &lt; 3</code> — the check;</li>
<li>the body — if the check was true;</li>
<li><code>i++</code> — the step;</li>
<li>check again, body again, step again…</li>
<li>the check is false — exit, and the body does not run this time.</li>
</ul>
<p>Two consequences that beginners mix up.</p>
<p>First: <strong>the condition is checked before the body</strong>, so a loop may run zero times. <code>for i := 0; i &lt; 0; i++</code> takes no steps at all.</p>
<p>Second: <strong>the step runs after the body</strong>, not before it. On the first pass <code>i</code> is zero inside the body, not one.</p>`}},

{q:{ru:"Как понять, сколько шагов сделает цикл, не запуская его?", en:"How do I tell how many steps a loop takes without running it?"},
 a:{ru:`<p>Выписать таблицу. Три столбца: значение счётчика, результат проверки, что напечатано.</p>
<pre><code> i | i &lt; 3 | напечатано
 0 | да    | 0
 1 | да    | 01
 2 | да    | 012
 3 | нет   | выход</code></pre>
<p>Сколько строк со словом «да» — столько шагов. Здесь три.</p>
<p>Короткие правила, которые эта таблица подтверждает:</p>
<ul>
<li><code>for i := 0; i &lt; n</code> — ровно <code>n</code> шагов;</li>
<li><code>for i := 0; i &lt;= n</code> — <code>n+1</code> шаг;</li>
<li><code>for i := 1; i &lt;= n</code> — снова <code>n</code> шагов.</li>
</ul>
<p>Таблицу стоит рисовать не только когда цикл сломался. Три строчки на бумаге до запуска экономят полчаса разглядывания кода после.</p>`,
    en:`<p>Write out a table. Three columns: the counter value, the result of the check, and what has been printed.</p>
<pre><code> i | i &lt; 3 | printed
 0 | yes   | 0
 1 | yes   | 01
 2 | yes   | 012
 3 | no    | exit</code></pre>
<p>The number of “yes” rows is the number of steps. Three here.</p>
<p>Short rules the table confirms:</p>
<ul>
<li><code>for i := 0; i &lt; n</code> — exactly <code>n</code> steps;</li>
<li><code>for i := 0; i &lt;= n</code> — <code>n+1</code> steps;</li>
<li><code>for i := 1; i &lt;= n</code> — <code>n</code> steps again.</li>
</ul>
<p>Draw the table before you run, not only after the loop breaks. Three lines on paper save half an hour of staring at code.</p>`}},

{q:{ru:"Почему вместо прямоугольника получается столбик?", en:"Why do I get a column instead of a rectangle?"},
 a:{ru:`<p>Потому что <code>fmt.Println()</code> стоит внутри внутреннего цикла.</p>
<pre><code><span class="cm">// прямоугольник 2×3</span>
for i := 0; i &lt; 2; i++ {
	for j := 0; j &lt; 3; j++ {
		fmt.Print("*")
	}
	fmt.Println()      <span class="cm">// ← в теле внешнего цикла</span>
}

<span class="cm">// столбик из шести строк</span>
for i := 0; i &lt; 2; i++ {
	for j := 0; j &lt; 3; j++ {
		fmt.Print("*")
		fmt.Println()  <span class="cm">// ← в теле внутреннего цикла</span>
	}
}</code></pre>
<p>Звёздочек в обоих случаях шесть. Разница только в том, сколько раз рвётся строка: два раза или шесть.</p>
<p>Правило простое: <strong>перевод строки — это конец строки картинки</strong>. Значит, он выполняется столько раз, сколько строк, то есть на каждом шаге внешнего цикла ровно один раз.</p>`,
    en:`<p>Because <code>fmt.Println()</code> sits inside the inner loop.</p>
<pre><code><span class="cm">// a 2×3 rectangle</span>
for i := 0; i &lt; 2; i++ {
	for j := 0; j &lt; 3; j++ {
		fmt.Print("*")
	}
	fmt.Println()      <span class="cm">// ← in the outer body</span>
}

<span class="cm">// a column of six lines</span>
for i := 0; i &lt; 2; i++ {
	for j := 0; j &lt; 3; j++ {
		fmt.Print("*")
		fmt.Println()  <span class="cm">// ← in the inner body</span>
	}
}</code></pre>
<p>Both print six stars. The only difference is how many times the line breaks: twice or six times.</p>
<p>The rule is simple: <strong>a line break is the end of a picture row</strong>. So it runs once per row — exactly once on each step of the outer loop.</p>`}},

{q:{ru:"Чем <code>break</code> отличается от <code>continue</code>?", en:"How does <code>break</code> differ from <code>continue</code>?"},
 a:{ru:`<p><code>break</code> заканчивает цикл. <code>continue</code> заканчивает только текущий шаг.</p>
<pre><code>for i := 0; i &lt; 5; i++ {
	if i == 2 { break }
	fmt.Print(i)          <span class="cm">// 01</span>
}

for i := 0; i &lt; 5; i++ {
	if i == 2 { continue }
	fmt.Print(i)          <span class="cm">// 0134</span>
}</code></pre>
<p>Общее у них одно: обе команды бросают остаток тела. Дальше пути расходятся — <code>break</code> уходит за пределы цикла, <code>continue</code> уходит на шаг счётчика и возвращается к проверке.</p>
<p>Две детали, о которых спотыкаются.</p>
<p>Первая: во вложенных циклах обе команды действуют <strong>только на свой цикл</strong>. <code>break</code> из внутреннего цикла попадает во внешний, а не наружу обоих.</p>
<p>Вторая: <code>continue</code> в цикле «пока» (<code>for i &lt; n</code>, шаг вручную в теле) вешает программу — он перепрыгивает через строку <code>i++</code>, и счётчик застревает.</p>`,
    en:`<p><code>break</code> ends the loop. <code>continue</code> ends only the current step.</p>
<pre><code>for i := 0; i &lt; 5; i++ {
	if i == 2 { break }
	fmt.Print(i)          <span class="cm">// 01</span>
}

for i := 0; i &lt; 5; i++ {
	if i == 2 { continue }
	fmt.Print(i)          <span class="cm">// 0134</span>
}</code></pre>
<p>They share one thing: both abandon the rest of the body. Then they part ways — <code>break</code> goes outside the loop, <code>continue</code> goes to the step and back to the check.</p>
<p>Two details people trip on.</p>
<p>First: in nested loops both affect <strong>their own loop only</strong>. A <code>break</code> in the inner loop lands in the outer one, not outside both.</p>
<p>Second: <code>continue</code> in a “while” loop (<code>for i &lt; n</code> with a manual step in the body) hangs the program — it jumps over the <code>i++</code> line and the counter gets stuck.</p>`}},

{q:{ru:"Когда брать <code>range</code>, а когда обычный счётчик?", en:"When do I use <code>range</code> and when a plain counter?"},
 a:{ru:`<p><code>range</code> — когда надо пройти всё подряд от начала до конца:</p>
<pre><code>for _, v := range nums { … }</code></pre>
<p>Он сам знает, где конец, поэтому ошибиться с границей невозможно. Обход строки без <code>range</code> вообще лучше не писать: <code>s[i]</code> даёт байт, и на любом не-латинском тексте буква разваливается пополам.</p>
<p>Обычный счётчик — когда нужен контроль над номерами:</p>
<ul>
<li>шаг не единица: <code>i += 2</code>;</li>
<li>обход с конца: <code>for i := len(s)-1; i &gt;= 0; i--</code>;</li>
<li>нужны два элемента сразу: <code>s[i]</code> и <code>s[i+1]</code>;</li>
<li>элементов нет вообще — цикл просто повторяет действие n раз.</li>
</ul>
<p>Порядок переменных в <code>range</code> запоминается сразу: <strong>сначала номер, потом значение</strong>. Одна переменная — это номер. Ошибка «получил 0 1 2 вместо 10 20 30» именно отсюда.</p>`,
    en:`<p><code>range</code> — when you need to walk everything from start to finish:</p>
<pre><code>for _, v := range nums { … }</code></pre>
<p>It knows where the end is, so the bound cannot be wrong. And you should not walk a string without it: <code>s[i]</code> gives a byte, and on any non-Latin text a letter falls apart.</p>
<p>A plain counter — when you need control over the numbers:</p>
<ul>
<li>the step isn't one: <code>i += 2</code>;</li>
<li>walking backwards: <code>for i := len(s)-1; i &gt;= 0; i--</code>;</li>
<li>you need two elements at once: <code>s[i]</code> and <code>s[i+1]</code>;</li>
<li>there are no elements at all — the loop just repeats an action n times.</li>
</ul>
<p>The variable order in <code>range</code> sticks quickly: <strong>index first, value second</strong>. A single variable is the index. The “I got 0 1 2 instead of 10 20 30” bug comes straight from here.</p>`}},

{q:{ru:"Программа запустилась и висит. Что смотреть?", en:"The program starts and hangs. What do I look at?"},
 a:{ru:`<p>Сначала <code>Ctrl+C</code> — это останавливает программу.</p>
<p>Дальше смотри не на тело цикла, а на <strong>шаг</strong>. Вопрос один: приближает ли шаг счётчик к границе? Три типичных ответа «нет»:</p>
<ul>
<li>шага нет вообще — <code>for i := 0; i &lt; 3; { … }</code> или цикл «пока» без <code>i++</code> в теле;</li>
<li>шаг в другую сторону — <code>i--</code> при условии <code>i &lt; 3</code>;</li>
<li>двигается не тот счётчик — во внутреннем цикле по ошибке <code>i++</code> вместо <code>j++</code>.</li>
</ul>
<p>Отдельный случай — <code>continue</code>, поставленный выше строки с шагом, когда шаг делается руками в теле. Управление до <code>i++</code> просто не доходит.</p>
<p>Быстрая проверка: добавь <code>fmt.Println(i)</code> первой строкой тела и запусти. Если на экране одно и то же число подряд — счётчик стоит на месте, и ответ найден.</p>`,
    en:`<p>First, <code>Ctrl+C</code> — that stops the program.</p>
<p>Then look at the <strong>step</strong>, not at the body. One question: does the step move the counter toward the bound? Three typical “no” answers:</p>
<ul>
<li>there is no step at all — <code>for i := 0; i &lt; 3; { … }</code>, or a “while” loop with no <code>i++</code> in the body;</li>
<li>the step goes the wrong way — <code>i--</code> with an <code>i &lt; 3</code> condition;</li>
<li>the wrong counter moves — <code>i++</code> instead of <code>j++</code> inside the inner loop.</li>
</ul>
<p>A special case is a <code>continue</code> placed above the manual step line. Control never reaches the <code>i++</code>.</p>
<p>Quick check: put <code>fmt.Println(i)</code> as the first line of the body and run. If the same number repeats on screen, the counter is frozen and you have your answer.</p>`}},

{q:{ru:"Почему <code>i</code> нельзя использовать после цикла?", en:"Why can't I use <code>i</code> after the loop?"},
 a:{ru:`<p>Потому что <code>:=</code> в заголовке создаёт переменную <strong>внутри</strong> цикла. Закрывающая фигурная скобка — конец её жизни.</p>
<pre><code>for i := 0; i &lt; 3; i++ {
}
fmt.Println(i)   <span class="cm">// не соберётся: undefined: i</span></code></pre>
<p>То же самое с любой переменной, созданной в теле цикла: на каждом шаге она рождается заново, а после цикла её нет. Отсюда правило про накопители:</p>
<pre><code>sum := 0                      <span class="cm">// создан ДО цикла — переживёт его</span>
for i := 1; i &lt;= 4; i++ {
	sum += i
}
fmt.Println(sum)              <span class="cm">// 10</span></code></pre>
<p>Перенеси <code>sum := 0</code> внутрь тела — на каждом шаге он обнулится, и в конце останется последнее слагаемое.</p>
<p>Если значение счётчика нужно после цикла, создай переменную до него и не объявляй заново в заголовке.</p>`,
    en:`<p>Because <code>:=</code> in the header creates the variable <strong>inside</strong> the loop. The closing brace is the end of its life.</p>
<pre><code>for i := 0; i &lt; 3; i++ {
}
fmt.Println(i)   <span class="cm">// won't compile: undefined: i</span></code></pre>
<p>The same goes for any variable created in the body: it is born again on every step and gone after the loop. Hence the rule about accumulators:</p>
<pre><code>sum := 0                      <span class="cm">// created BEFORE the loop — it outlives it</span>
for i := 1; i &lt;= 4; i++ {
	sum += i
}
fmt.Println(sum)              <span class="cm">// 10</span></code></pre>
<p>Move <code>sum := 0</code> into the body and it resets every step, leaving only the last term at the end.</p>
<p>If you need the counter value after the loop, declare the variable before it and don't redeclare it in the header.</p>`}},

{q:{ru:"Почему цикл собирается, а рисует не то?", en:"Why does the loop compile but draw the wrong thing?"},
 a:{ru:`<p>Потому что компилятор проверяет типы, а не смысл. Всё, что ломает цикл, по типам безупречно:</p>
<ul>
<li><code>&lt;</code> вместо <code>&lt;=</code> — оба сравнения дают <code>bool</code>;</li>
<li><code>i</code> вместо <code>j</code> во вложенном цикле — обе переменные <code>int</code>;</li>
<li><code>fmt.Println()</code> на уровень глубже — вызов законный где угодно;</li>
<li><code>break</code> вместо <code>continue</code> — обе команды разрешены в цикле.</li>
</ul>
<p>Поэтому «собралось» о правильности цикла не говорит ничего. Работает только сверка вывода: запустить и посмотреть, совпало ли символ в символ.</p>
<p>Если не совпало — считай шаги таблицей и проверь три вещи по очереди: границу, шаг, место <code>Println</code>. В этих трёх местах сидит почти всё.</p>`,
    en:`<p>Because the compiler checks types, not meaning. Everything that breaks a loop is flawless type-wise:</p>
<ul>
<li><code>&lt;</code> instead of <code>&lt;=</code> — both comparisons yield a <code>bool</code>;</li>
<li><code>i</code> instead of <code>j</code> in a nested loop — both variables are <code>int</code>;</li>
<li><code>fmt.Println()</code> one level deeper — the call is legal anywhere;</li>
<li><code>break</code> instead of <code>continue</code> — both are allowed in a loop.</li>
</ul>
<p>So “it compiled” says nothing about whether the loop is right. Only comparing the output works: run it and check character by character.</p>
<p>If it doesn't match, count the steps with a table and check three things in order: the bound, the step, and where <code>Println</code> sits. Almost everything lives in those three places.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */

/* Помощники для параметрических сценариев. Каждый файл темы живёт в своей
   области видимости, поэтому имена здесь ни с чем не конфликтуют. */
function scLt(op){ return op === "<=" ? "&lt;=" : "&lt;"; }
function scWord(p){
  var w = String(p.word === undefined ? "" : p.word).replace(/["\\\n\r\t]/g, "");
  return w.length ? w : "Go";
}
function scRunes(s){
  var out = [], i = 0;
  while(i < s.length){
    var ch = String.fromCodePoint(s.codePointAt(i));
    out.push(ch);
    i += ch.length;
  }
  return out;
}
function scByteLen(ch){
  var cp = ch.codePointAt(0);
  if(cp < 0x80) return 1;
  if(cp < 0x800) return 2;
  if(cp < 0x10000) return 3;
  return 4;
}

var SCENARIOS = [
{
 name:{ru:"Три части for", en:"The three parts of for"},
 params:[
  {key:"n",  label:{ru:"граница", en:"bound"}, min:1, max:8, def:3},
  {key:"op", label:{ru:"знак", en:"sign"}, values:["<","<="], def:"<"}
 ],
 code: function(p){
   return ["for i := 0; i " + p.op + " " + p.n + "; i++ {",
           "\tfmt.Println(i)",
           "}",
           "fmt.Println(\"end\")"];
 },
 steps: function(p){
   var lt = scLt(p.op), n = p.n;
   var alive = function(i){ return p.op === "<=" ? i <= n : i < n; };
   var iters = p.op === "<=" ? n + 1 : n;
   var vals  = iters === 1 ? "0" : "0 … " + (iters - 1);
   var alt   = p.op === "<=" ? iters - 1 : iters + 1;
   var altSign = p.op === "<=" ? "&lt;" : "&lt;=";
   var out = "", steps = [], i = 0;
   while(alive(i)){
     steps.push({line:0, vars:[["i", String(i), "int"]], out:out,
       note: i === 0
         ? {ru:"Старт <code>i := 0</code> выполнился — один раз и больше никогда. Сразу за ним проверка: <code>0 "+lt+" "+n+"</code> истина, значит тело выполнится.",
            en:"The start <code>i := 0</code> ran — once and never again. Right after it the check: <code>0 "+lt+" "+n+"</code> is true, so the body will run."}
         : {ru:"Тело кончилось — выполнился шаг <code>i++</code>, и только потом снова проверка. <code>"+i+" "+lt+" "+n+"</code> истина.",
            en:"The body ended — the step <code>i++</code> ran, and only then the check again. <code>"+i+" "+lt+" "+n+"</code> is true."}});
     out += i + "\n";
     steps.push({line:1, vars:[["i", String(i), "int"]], out:out,
       note: i === 0
         ? {ru:"Тело. Печатается текущее значение счётчика — ноль, потому что шаг ещё не выполнялся.",
            en:"The body. It prints the current counter value — zero, because the step hasn't run yet."}
         : {ru:"Проход тела номер "+(i+1)+". На экран уходит "+i+".",
            en:"Body pass number "+(i+1)+". "+i+" goes to the screen."}});
     i++;
   }
   steps.push({line:0, vars:[["i", String(i), "int"]], out:out,
     note:{ru:"Шаг сделал <code>i</code> равным "+i+". Проверка <code>"+i+" "+lt+" "+n+"</code> — ложь. Цикл заканчивается, <b>тело в этот раз не выполняется</b>. Шагов: "+iters+", значения i: "+vals+". Со знаком <code>"+altSign+"</code> их было бы "+alt+".",
           en:"The step made <code>i</code> equal "+i+". The check <code>"+i+" "+lt+" "+n+"</code> is false. The loop ends and <b>the body does not run this time</b>. There were "+iters+" steps, i took: "+vals+". With <code>"+altSign+"</code> there would be "+alt+"."}});
   out += "end\n";
   steps.push({line:3, vars:[], out:out,
     note:{ru:"После цикла переменной <code>i</code> уже нет — она жила только внутри. Строка <code>fmt.Println(i)</code> здесь не собралась бы: <code>undefined: i</code>.",
           en:"After the loop the variable <code>i</code> is gone — it lived only inside. A line <code>fmt.Println(i)</code> here wouldn't compile: <code>undefined: i</code>."}});
   return steps;
 }
},
{
 name:{ru:"Ошибка на единицу", en:"Off by one"},
 params:[
  {key:"n",  label:{ru:"элементов", en:"elements"}, min:1, max:8, def:3},
  {key:"op", label:{ru:"знак", en:"sign"}, values:["<=","<"], def:"<="}
 ],
 code: function(p){
   var v = [];
   for(var k = 1; k <= p.n; k++) v.push(k);
   return ["s := []int{" + v.join(", ") + "}",
           "for i := 0; i " + p.op + " len(s); i++ {",
           "\tfmt.Println(s[i])",
           "}"];
 },
 steps: function(p){
   var n = p.n, lt = scLt(p.op), v = [];
   for(var k = 1; k <= n; k++) v.push(k);
   var sv = "[" + v.join(" ") + "]";
   var idx = n === 1 ? "0" : "0 … " + (n - 1);
   var S = ["s", sv, "[]int"];
   var out = "", steps = [], i = 0;
   steps.push({line:0, vars:[S, ["len(s)", String(n), "int"]], out:"",
     note:{ru:"Элементов "+n+". Индексы у них — "+idx+". Индекса "+n+" не существует.",
           en:"There are "+n+" elements. Their indices are "+idx+". There is no index "+n+"."}});
   while(true){
     var alive = p.op === "<=" ? i <= n : i < n;
     if(!alive){
       steps.push({line:1, vars:[S, ["i", String(i), "int"]], out:out,
         note:{ru:"<code>"+i+" "+lt+" "+n+"</code> — ложь. Цикл остановился ровно там, где кончились данные: последним был индекс "+(n-1)+". Строгая граница <code>i &lt; len(s)</code> — единственная правильная при обходе по индексам.",
               en:"<code>"+i+" "+lt+" "+n+"</code> is false. The loop stopped exactly where the data ran out: the last index was "+(n-1)+". The strict bound <code>i &lt; len(s)</code> is the only correct one when walking by index."}});
       break;
     }
     steps.push({line:1, vars:[S, ["i", String(i), "int"]], out:out,
       note: i < n
         ? {ru:"Проверка: <code>"+i+" "+lt+" "+n+"</code> истина, индекс "+i+" у набора есть.",
            en:"Check: <code>"+i+" "+lt+" "+n+"</code> is true, and index "+i+" does exist."}
         : {ru:"<b>Вот здесь и ломается.</b> <code>"+i+" &lt;= "+n+"</code> — истина, поэтому цикл делает ещё один шаг. Со строгим знаком <code>i &lt; len(s)</code> он бы уже закончился.",
            en:"<b>This is where it breaks.</b> <code>"+i+" &lt;= "+n+"</code> is true, so the loop takes one more step. With a strict <code>i &lt; len(s)</code> it would already be over."}});
     if(i < n){
       out += v[i] + "\n";
       steps.push({line:2, vars:[S, ["i", String(i), "int"], ["s[i]", String(v[i]), "int"]], out:out,
         note: i === n - 1
           ? {ru:"Элемент номер "+i+" — и он последний. Данные кончились.",
              en:"Element number "+i+" — and it is the last one. The data is exhausted."}
           : {ru:"Элемент номер "+i+", значение "+v[i]+".",
              en:"Element number "+i+", value "+v[i]+"."}});
       i++;
     } else {
       steps.push({line:2, vars:[S, ["i", String(i), "int"], ["s[i]", "?", "—"]], out:out,
         note:{ru:"Падение: <code>panic: index out of range ["+n+"] with length "+n+"</code>. Программа собралась без единой жалобы — компилятор шаги не считает. Правильная граница: <code>i &lt; len(s)</code>.",
               en:"Crash: <code>panic: index out of range ["+n+"] with length "+n+"</code>. The program compiled without a complaint — the compiler doesn't count steps. The correct bound is <code>i &lt; len(s)</code>."}});
       break;
     }
   }
   return steps;
 }
},
{
 name:{ru:"Вложенные циклы", en:"Nested loops"},
 params:[
  {key:"rows", label:{ru:"строк", en:"rows"}, min:1, max:3, def:2},
  {key:"cols", label:{ru:"в строке", en:"per row"}, min:1, max:5, def:3}
 ],
 code: function(p){
   return ["for i := 0; i < " + p.rows + "; i++ {",
           "\tfor j := 0; j < " + p.cols + "; j++ {",
           "\t\tfmt.Print(\"*\")",
           "\t}",
           "\tfmt.Println()",
           "}"];
 },
 steps: function(p){
   var R = p.rows, C = p.cols, out = "", steps = [];
   for(var i = 0; i < R; i++){
     steps.push({line:0, vars:[["i", String(i), "int"]], out:out,
       note: i === 0
         ? {ru:"Внешний цикл начался. Он отвечает за строки картинки, их будет "+R+".",
            en:"The outer loop started. It is responsible for the rows of the picture — there will be "+R+"."}
         : {ru:"Шаг внешнего цикла. Переменной <code>j</code> сейчас не существует — она создастся заново и снова с нуля.",
            en:"A step of the outer loop. The variable <code>j</code> doesn't exist right now — it will be created again, from zero."}});
     for(var j = 0; j < C; j++){
       steps.push({line:1, vars:[["i", String(i), "int"], ["j", String(j), "int"]], out:out,
         note: (j === 0
           ? (i === 0
              ? {ru:"Внутренний цикл создал свой счётчик <code>j</code>. Он отвечает за то, что внутри одной строки; её ширина — "+C+".",
                 en:"The inner loop created its own counter <code>j</code>. It is responsible for what's inside one row; its width is "+C+"."}
              : {ru:"Вот и новый <code>j</code>, снова ноль. Поэтому строки выходят одинаковыми.",
                 en:"Here is the new <code>j</code>, zero again. That is why the rows come out identical."})
           : {ru:"Шаг внутреннего цикла: <code>j</code> стал "+j+". <code>i</code> при этом не двигается.",
              en:"A step of the inner loop: <code>j</code> is now "+j+". <code>i</code> doesn't move at all."})});
       out += "*";
       steps.push({line:2, vars:[["i", String(i), "int"], ["j", String(j), "int"]], out:out,
         note: j === C - 1
           ? {ru:"Звёздочка номер "+(j+1)+". Строка набрана.", en:"Star number "+(j+1)+". The row is complete."}
           : {ru:"Звёздочка номер "+(j+1)+". <code>Print</code> строку не рвёт.", en:"Star number "+(j+1)+". <code>Print</code> doesn't break the line."}});
     }
     steps.push({line:1, vars:[["i", String(i), "int"], ["j", String(C), "int"]], out:out,
       note:{ru:"<code>"+C+" &lt; "+C+"</code> ложь — внутренний цикл закончился. Внешний при этом жив.",
             en:"<code>"+C+" &lt; "+C+"</code> is false — the inner loop is done. The outer one is still alive."}});
     out += "\n";
     steps.push({line:4, vars:[["i", String(i), "int"]], out:out,
       note: i === 0
         ? {ru:"<b>Перевод строки.</b> Он стоит в теле внешнего цикла, после внутреннего — значит выполняется один раз на строку.",
            en:"<b>The line break.</b> It sits in the outer body after the inner loop — so it runs once per row."}
         : {ru:"Перевод строки номер "+(i+1)+".", en:"Line break number "+(i+1)+"."}});
   }
   steps.push({line:0, vars:[], out:out,
     note:{ru:"<code>"+R+" &lt; "+R+"</code> ложь — внешний цикл закончился. Звёздочек всего "+R+" × "+C+" = "+(R*C)+". Переводов строки — "+R+". Переставь <code>Println</code> внутрь внутреннего цикла — и переводов станет "+(R*C)+".",
           en:"<code>"+R+" &lt; "+R+"</code> is false — the outer loop is done. Stars in total: "+R+" × "+C+" = "+(R*C)+". Line breaks: "+R+". Move <code>Println</code> into the inner loop and you get "+(R*C)+" of them."}});
   return steps;
 }
},
{
 name:{ru:"continue против break", en:"continue vs break"},
 params:[
  {key:"n",   label:{ru:"граница", en:"bound"}, min:3, max:10, def:4},
  {key:"k",   label:{ru:"на числе", en:"at value"}, min:0, max:9, def:2},
  {key:"cmd", label:{ru:"команда", en:"command"}, values:["continue","break"], def:"continue"}
 ],
 code: function(p){
   return ["for i := 0; i < " + p.n + "; i++ {",
           "\tif i == " + p.k + " {",
           "\t\t" + p.cmd,
           "\t}",
           "\tfmt.Print(i)",
           "}"];
 },
 steps: function(p){
   var n = p.n, k = p.k, isBreak = p.cmd === "break";
   var full = "", skip = "", cut = "";
   for(var q = 0; q < n; q++){
     full += q;
     if(q !== k) skip += q;
     if(q < k) cut += q;
   }
   var shown = function(s, ru){ return s === "" ? (ru ? "пусто" : "empty") : "<code>" + s + "</code>"; };
   var hits = k < n;
   var altRu, altEn;
   if(!hits){
     altRu = "Число "+k+" за границей цикла, поэтому <code>"+p.cmd+"</code> не сработал ни разу.";
     altEn = "The value "+k+" is beyond the loop bound, so <code>"+p.cmd+"</code> never fired.";
   } else if(isBreak){
     altRu = "Замени <code>break</code> на <code>continue</code>, и вывод станет "+shown(skip, true)+": пропала бы только одна цифра, а цикл дошёл бы до конца.";
     altEn = "Replace <code>break</code> with <code>continue</code> and the output becomes "+shown(skip, false)+": only one digit would be missing and the loop would run to the end.";
   } else {
     altRu = "Замени <code>continue</code> на <code>break</code>, и вывод станет "+shown(cut, true)+": цикл оборвался бы на "+k+" и дальше не пошёл.";
     altEn = "Replace <code>continue</code> with <code>break</code> and the output becomes "+shown(cut, false)+": the loop would stop at "+k+" and go no further.";
   }
   var out = "", steps = [], i = 0, broke = false;
   for(i = 0; i < n; i++){
     steps.push({line:0, vars:[["i", String(i), "int"]], out:out,
       note: i === 0
         ? {ru:"Старт и первая проверка: <code>0 &lt; "+n+"</code> истина.",
            en:"Start and first check: <code>0 &lt; "+n+"</code> is true."}
         : {ru:"Шаг и проверка: <code>"+i+" &lt; "+n+"</code> истина.",
            en:"Step and check: <code>"+i+" &lt; "+n+"</code> is true."}});
     steps.push({line:1, vars:[["i", String(i), "int"]], out:out,
       note: i === k
         ? {ru:"<code>"+i+" == "+k+"</code> истина — заходим внутрь <code>if</code>.",
            en:"<code>"+i+" == "+k+"</code> is true — we enter the <code>if</code>."}
         : {ru:"<code>"+i+" == "+k+"</code> ложь — тело <code>if</code> пропускается.",
            en:"<code>"+i+" == "+k+"</code> is false — the <code>if</code> body is skipped."}});
     if(i === k){
       if(isBreak){
         steps.push({line:2, vars:[["i", String(i), "int"]], out:out,
           note:{ru:"<b><code>break</code>.</b> Остаток тела пропускается, и цикл заканчивается целиком: следующих проходов не будет. Заголовок разрешал шагов: "+n+". Сделано: "+(i+1)+". Вывод: "+shown(out, true)+". "+altRu,
                 en:"<b><code>break</code>.</b> The rest of the body is skipped and the whole loop ends: there will be no further passes. The header allowed "+n+" steps; "+(i+1)+" happened. Output: "+shown(out, false)+". "+altEn}});
         broke = true;
         break;
       }
       steps.push({line:2, vars:[["i", String(i), "int"]], out:out,
         note:{ru:"<b><code>continue</code>.</b> Остаток тела — строка с печатью — пропускается, управление уходит на шаг счётчика. Цикл <b>не</b> оборвался.",
               en:"<b><code>continue</code>.</b> The rest of the body — the print line — is skipped and control jumps to the step. The loop did <b>not</b> end."}});
     } else {
       out += i;
       steps.push({line:4, vars:[["i", String(i), "int"]], out:out,
         note:{ru:"Печать выполнилась, на экране появилось "+i+".",
               en:"The print ran, "+i+" appeared on the screen."}});
     }
   }
   if(!broke){
     steps.push({line:0, vars:[], out:out,
       note:{ru:"<code>"+n+" &lt; "+n+"</code> ложь — конец. Вывод: "+shown(out, true)+". "+altRu,
             en:"<code>"+n+" &lt; "+n+"</code> is false — done. Output: "+shown(out, false)+". "+altEn}});
   }
   return steps;
 }
},
{
 name:{ru:"Бесконечный цикл", en:"An endless loop"},
 params:[
  {key:"n",    label:{ru:"граница", en:"bound"}, min:1, max:8, def:3},
  {key:"step", label:{ru:"шаг в теле", en:"step in body"}, values:["—","i++"], def:"—"}
 ],
 code: function(p){
   var c = ["i := 0", "for i < " + p.n + " {", "\tfmt.Println(i)"];
   if(p.step === "i++") c.push("\ti++");
   c.push("}");
   return c;
 },
 steps: function(p){
   var n = p.n, out = "", steps = [];
   steps.push({line:0, vars:[["i", "0", "int"]], out:"",
     note:{ru:"Счётчик создан <b>до</b> цикла — значит, он переживёт его и будет виден после.",
           en:"The counter is created <b>before</b> the loop — so it outlives it and stays visible afterwards."}});
   if(p.step === "i++"){
     for(var i = 0; i < n; i++){
       steps.push({line:1, vars:[["i", String(i), "int"]], out:out,
         note: i === 0
           ? {ru:"У <code>for</code> оставили только условие. Это цикл «пока»: старта нет, шага в заголовке тоже нет. <code>0 &lt; "+n+"</code> истина.",
              en:"Only the condition is left on <code>for</code>. This is a “while” loop: no start, and no step in the header either. <code>0 &lt; "+n+"</code> is true."}
           : {ru:"Проверка снова: <code>"+i+" &lt; "+n+"</code> истина.",
              en:"Check again: <code>"+i+" &lt; "+n+"</code> is true."}});
       out += i + "\n";
       steps.push({line:2, vars:[["i", String(i), "int"]], out:out,
         note:{ru:"Тело: на экран ушло "+i+".", en:"The body: "+i+" went to the screen."}});
       steps.push({line:3, vars:[["i", String(i + 1), "int"]], out:out,
         note:{ru:"<b>Шаг руками.</b> Здесь его пишет человек, а не заголовок — и именно эту строку забывают. <code>i</code> стал "+(i + 1)+".",
               en:"<b>The step by hand.</b> Here a person writes it, not the header — and this is the line that gets forgotten. <code>i</code> is now "+(i + 1)+"."}});
     }
     steps.push({line:1, vars:[["i", String(n), "int"]], out:out,
       note:{ru:"<code>"+n+" &lt; "+n+"</code> ложь — цикл закончился. Шагов было столько, сколько разрешало условие: "+n+". Убери строку <code>i++</code> — и он не закончится никогда. Переменная <code>i</code> здесь жива: она создавалась до цикла.",
             en:"<code>"+n+" &lt; "+n+"</code> is false — the loop is over, having taken exactly the "+n+" steps the condition allowed. Remove the <code>i++</code> line and it never ends. The variable <code>i</code> is still alive here: it was created before the loop."}});
     return steps;
   }
   for(var r = 0; r < 3; r++){
     steps.push({line:1, vars:[["i", "0", "int"]], out:out,
       note: r === 0
         ? {ru:"У <code>for</code> оставили только условие. Это цикл «пока»: старта нет, <b>шага тоже нет</b> — его придётся делать руками в теле. <code>0 &lt; "+n+"</code> истина.",
            en:"Only the condition is left on <code>for</code>. This is a “while” loop: no start and <b>no step</b> — you have to write it in the body yourself. <code>0 &lt; "+n+"</code> is true."}
         : {ru:"Снова проверка. <code>i</code> как был нулём, так и остался: <code>0 &lt; "+n+"</code> опять истина.",
            en:"Check again. <code>i</code> is still zero: <code>0 &lt; "+n+"</code> is true once more."}});
     out += "0\n";
     steps.push({line:2, vars:[["i", "0", "int"]], out:out,
       note: r === 2
         ? {ru:"И так до бесконечности. Останавливают <code>Ctrl+C</code>. Лечится одной строкой <code>i++</code> в теле — тогда счётчик дойдёт до границы и цикл закончится. <b>Признак такой ошибки: одно и то же число печатается без остановки.</b>",
            en:"And so on forever. Stop it with <code>Ctrl+C</code>. One line of <code>i++</code> in the body fixes it — then the counter reaches the bound and the loop ends. <b>The symptom: the same number printing without stopping.</b>"}
         : (r === 0
            ? {ru:"Тело выполнилось. В теле только печать — <code>i</code> никто не трогал.",
               en:"The body ran. There is only a print in it — nothing touched <code>i</code>."}
            : {ru:"Тот же ноль второй раз.", en:"The same zero a second time."})});
   }
   return steps;
 }
},
{
 name:{ru:"range по строке", en:"range over a string"},
 params:[
  {key:"word", label:{ru:"слово", en:"word"}, text:true, max:8, def:"Привет"}
 ],
 code: function(p){
   return ["s := \"" + scWord(p) + "\"",
           "for i, c := range s {",
           "\tfmt.Println(i, string(c))",
           "}"];
 },
 tape: function(p){
   var t = [];
   scRunes(scWord(p)).forEach(function(ch){
     for(var b = 0; b < scByteLen(ch); b++) t.push(ch);
   });
   return t;
 },
 steps: function(p){
   var w = scWord(p), rs = scRunes(w), out = "", steps = [];
   var pos = [], at = 0, total = 0;
   rs.forEach(function(ch){ pos.push(at); at += scByteLen(ch); });
   total = at;
   var S = ["s", "\"" + w + "\"", "string"];
   var wide = total > rs.length;
   steps.push({line:0, vars:[S, ["len(s)", String(total), "int"]], out:"", tapeOn:[],
     note: wide
       ? {ru:"Букв — "+rs.length+", а байтов — "+total+": нелатинская буква занимает больше одного байта. Лента ниже показывает, какой байт какой букве принадлежит.",
          en:"Letters — "+rs.length+", bytes — "+total+": a non-Latin letter takes more than one byte. The tape below shows which byte belongs to which letter."}
       : {ru:"Букв — "+rs.length+", байтов столько же: латинская буква занимает ровно один байт. <code>len(s)</code> считает байты, а не буквы.",
          en:"Letters — "+rs.length+", and the same number of bytes: a Latin letter takes exactly one byte. <code>len(s)</code> counts bytes, not letters."}});
   rs.forEach(function(ch, k){
     var on = [], b;
     for(b = 0; b < scByteLen(ch); b++) on.push(pos[k] + b);
     var cp = ch.codePointAt(0);
     var V = [S, ["i", String(pos[k]), "int"], ["c", "'" + ch + "' (" + cp + ")", "rune"]];
     steps.push({line:1, vars:V, out:out, tapeOn:on,
       note: k === 0
         ? {ru:"<code>range</code> выдал сразу две вещи, именно в этом порядке: номер "+pos[k]+" и руну "+cp+". Границу никто не писал — язык сам знает, где строка кончается.",
            en:"<code>range</code> handed over two things at once, in this order: the index "+pos[k]+" and the rune "+cp+". Nobody wrote a bound — the language knows where the string ends."}
         : {ru:"Следующая буква. Номер — "+pos[k]+", и он вырос на "+(pos[k] - pos[k-1])+": <code>range</code> шагает по буквам, но номер выдаёт байтовый.",
            en:"The next letter. The index is "+pos[k]+", up by "+(pos[k] - pos[k-1])+": <code>range</code> walks letters but reports a byte index."}});
     out += pos[k] + " " + ch + "\n";
     steps.push({line:2, vars:V, out:out, tapeOn:on,
       note: k === 0
         ? {ru:"Печать. Букву показывает <code>string(c)</code>; без него на экран ушло бы число "+cp+".",
            en:"The print. <code>string(c)</code> shows the letter; without it the number "+cp+" would go to the screen instead."}
         : {ru:"Печать: номер и буква. Значение <code>c</code> — число "+cp+", буквой его делает <code>string</code>.",
            en:"The print: index and letter. The value of <code>c</code> is the number "+cp+"; <code>string</code> turns it into a letter."}});
   });
   steps.push({line:1, vars:[S], out:out, tapeOn:[],
     note: wide
       ? {ru:"Буквы кончились — цикл закончился, шагов было столько же, сколько букв: "+rs.length+". Последний номер — "+pos[rs.length-1]+", а не "+(rs.length-1)+": номера байтовые. Поэтому обходить такую строку счётчиком <code>s[i]</code> нельзя — там придёт отдельный байт, и буква развалится пополам.",
          en:"The letters ran out — the loop is over after "+rs.length+" steps, one per letter. The last index is "+pos[rs.length-1]+", not "+(rs.length-1)+": the indices are byte offsets. That is why walking such a string with <code>s[i]</code> doesn't work — you get a single byte and the letter falls apart."}
       : {ru:"Буквы кончились — цикл закончился, шагов было "+rs.length+". Здесь номера совпали с порядком букв, потому что каждая заняла один байт. Впиши слово с нелатинскими буквами — и номера пойдут через два.",
          en:"The letters ran out — the loop is over after "+rs.length+" steps. Here the indices matched the letter order because each letter took one byte. Type a word with non-Latin letters and the indices will jump by two."}});
   return steps;
 }
}
];

/* ================= ЧТО ИЗ ЭТОГО СКЛАДЫВАЕТСЯ ================= */
var OUTRO = {
ru:`<p>Все семь правил держатся на одном — на счётчике. Заголовок <code>for</code> задаёт ему стартовое число, границу и шаг, а порядок «проверка → тело → шаг» объясняет остальное: почему цикл может не выполниться ни разу; почему на первом проходе <code>i</code> равен нулю; почему один знак, <code>&lt;</code> или <code>&lt;=</code>, меняет количество повторов; почему <code>continue</code> не вешает обычный цикл, но вешает цикл «пока»; почему цикл с неподвижным счётчиком не заканчивается никогда.</p>
<p>Остальное — надстройки над этим. Вложенность работает потому, что тело цикла это обычный код: в него ложится второй цикл, и его счётчик рождается заново на каждом шаге первого. <code>range</code> — тот же обход, только границу считает не человек, а язык. <code>break</code> и <code>continue</code> — вмешательство в уже идущий цикл, и каждое действует только на свой.</p>
<p>Что ты теперь умеешь: по одному заголовку назвать, сколько будет шагов и какие значения примет счётчик; собрать из двух циклов прямоугольник, лесенку или таблицу; пройти по набору данных и по строке; оборвать цикл в нужном месте и пропустить ненужный шаг; а увидев зависшую программу — знать, куда смотреть.</p>
<p>Если забудется всё остальное, пусть останется одно: <strong>цикл никогда не спорит со своим заголовком</strong>. Он делает ровно столько шагов, сколько разрешают старт, условие и шаг, — не больше и не меньше. Поэтому когда на экране не то, что ждал, тело трогать рано: сначала посчитай шаги по заголовку.</p>`,
en:`<p>All seven rules rest on one thing — the counter. The <code>for</code> header gives it a starting number, a bound and a step, and the order “check → body → step” explains the rest: why a loop may run zero times; why <code>i</code> is zero on the first pass; why one character, <code>&lt;</code> or <code>&lt;=</code>, changes the number of repeats; why <code>continue</code> doesn't hang an ordinary loop but hangs a “while” loop; why a loop with a frozen counter never ends.</p>
<p>Everything else is built on top of that. Nesting works because a loop body is ordinary code: a second loop fits inside it, and that loop's counter is born again on every step of the first. <code>range</code> is the same walk, except the language works out the bound instead of you. <code>break</code> and <code>continue</code> are interference in a loop already running, and each affects only its own loop.</p>
<p>What you can do now: read a header and say how many steps there will be and which values the counter takes; build a rectangle, a staircase or a table out of two loops; walk a collection and a string; cut a loop short at the right place and skip a step you don't want; and, faced with a program that hangs, know where to look.</p>
<p>If everything else fades, keep this: <strong>a loop never argues with its own header</strong>. It takes exactly as many steps as the start, the condition and the step allow — no more, no fewer. So when the screen shows something other than what you expected, it's too early to touch the body: count the steps from the header first.</p>`
};
