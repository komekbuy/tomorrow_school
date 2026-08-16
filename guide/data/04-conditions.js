var META = {
  n: 4,
  slug: "04-conditions",
  eyebrow:{ru:"Go с нуля · тема 4 из 13", en:"Go from zero · topic 4 of 13"},
  title:  {ru:"Условия и логика", en:"Conditions and logic"},
  lede:{
    ru:"Без условий программа делает одно и то же при любых данных. <code>if</code> — единственное место, где она выбирает, что делать дальше.",
    en:"Without conditions a program does the same thing whatever data it gets. <code>if</code> is the one place where it chooses what to do next."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=9238s",
    t:{ru:"Курс по Go — глава «Условные ветвления» (2:33:58)", en:"Go course — the “Conditionals” chapter (2:33:58)"},
    d:{ru:"if/else и логические операторы.", en:"if/else and the logical operators."}},
  folder: "if1",
  txt: {ru:"go-tema-04-usloviya-i-logika.txt", en:"go-topic-04-conditions-and-logic.txt"}
};

/* ================= ВВЕДЕНИЕ ================= */
var INTRO = {
 ru:`<p>До этой темы программа шла одной дорогой: сверху вниз, строка за строкой, и делала одно и то же с любыми данными. Поменяй число в начале — поменяются числа в выводе, но не сам набор действий. Здесь появляется первое место, где программа сама выбирает, что делать дальше.</p>
<p>Без этого выбора код умеет только одно: печатать заранее известный текст. Вот программа, которая всегда врёт:</p>
<pre><code>n := -7
fmt.Println(n, "positive")   <span class="cm">// -7 positive — и так при любом n</span></code></pre>
<p>Здесь <code>n</code> — имя, за которым закреплено число. Строка ниже печатает это число и слово «positive» рядом. Слово напечатается, даже когда число отрицательное, и заставить эту строку промолчать нечем. Нет способа сказать «эту строку выполняй, а ту пропусти».</p>
<p>Когда разберёшь тему, ты сможешь: печатать разное в зависимости от данных, отсекать неподходящие значения до того, как программа на них упадёт, отличать цифру от буквы. На этом же держится всё, что будет дальше — цикл крутится, пока выполняется условие; функция возвращает разный ответ по условию.</p>
<p>Порядок разбора такой. Сначала — что вообще можно поставить после <code>if</code>: язык принимает туда не всё подряд (правило 1) и требует особый знак, чтобы задать вопрос (правило 2). Потом — как из одной проверки собрать выбор из нескольких вариантов (правило 3). Дальше — как задать в одной проверке сразу два вопроса (правило 4) и что при этом происходит с порядком вычисления (правило 5). Последние два — самые частые формы условия: диапазон чисел (правило 6) и проверка символа (правило 7). Каждое следующее правило опирается на предыдущее, поэтому читай подряд.</p>`,
 en:`<p>Up to this topic a program ran along a single road: top to bottom, line by line, doing the same thing whatever the data. Change a number at the top and the numbers in the output change, but the set of actions does not. Here comes the first place where a program picks what to do next.</p>
<p>Without that choice code can do exactly one thing: print text known in advance. Here is a program that always lies:</p>
<pre><code>n := -7
fmt.Println(n, "positive")   <span class="cm">// -7 positive — for any n at all</span></code></pre>
<p>In this code <code>n</code> is a name with a number attached to it. The line below prints that number and the word “positive” next to it. The word gets printed even when the number is negative, and there is nothing you can do to silence that line. There is no way to say “run this line, skip that one”.</p>
<p>Once you work through this topic you will be able to print different things depending on the data, to reject unsuitable values before the program crashes on them, and to tell a digit from a letter. Everything that comes later rests on the same thing: a loop runs while a condition holds; a function returns a different answer depending on a condition.</p>
<p>The order of the walkthrough is this. First, what may stand after <code>if</code> at all: the language does not accept just anything there (rule 1) and needs a special sign to ask a question (rule 2). Then, how a single check grows into a choice between several options (rule 3). Next, how to ask two questions inside one check (rule 4) and what that does to the order of evaluation (rule 5). The last two are the most common shapes of a condition: a range of numbers (rule 6) and a check on a character (rule 7). Every rule leans on the one before it, so read them in order.</p>`
};

/* ================= СЕМЬ ПРАВИЛ ================= */
var RULES = [
{
 h:{ru:"<code>if</code> берёт <code>bool</code>, а не число",
    en:"<code>if</code> takes a <code>bool</code>, not a number"},
 b:{ru:`<p>Начнём с того, что вообще можно поставить между <code>if</code> и открывающей фигурной скобкой. Go принимает туда одно-единственное: то, у чего ответ — <code>true</code> или <code>false</code>. Такое значение называется <code>bool</code>, и других значений у него не бывает, ровно два.</p>
<p>Число не подходит никакое — ни единица, ни ноль:</p>
<pre><code>if n % 2 == 0 { }   <span class="cm">// ок: сравнение даёт bool</span>
if n % 2 { }        <span class="cm">// не соберётся: non-boolean condition in if statement</span>
if 1 { }            <span class="cm">// не соберётся</span></code></pre>
<p>Разница между первой строкой и второй — в том, что там стоит. <code>n % 2</code> — это остаток от деления на два, то есть число 0 или 1: вычисление, а не вопрос. <code>n % 2 == 0</code> — уже вопрос «остаток равен нулю?», и ответ на него <code>true</code> или <code>false</code>. Работать <code>if</code> умеет только со вторым.</p>
<p>Многие языки поступают иначе: в C и Python ноль считается ложью, а всё остальное истиной, и <code>if n % 2</code> там соберётся. Go эту вольность убрал — вопрос надо задать вслух.</p>
<p>Отсюда главное следствие, на котором держится вся тема: сравнение не является частью записи <code>if</code>. Это самостоятельное значение, живущее отдельно. Его можно положить в переменную, напечатать, передать в функцию — как любое число:</p>
<pre><code>ok := n &gt; 0
fmt.Println(ok)          <span class="cm">// true или false</span>
fmt.Printf("%T\\n", ok)   <span class="cm">// bool</span></code></pre>
<p><code>if</code> сам ничего не вычисляет. Он получает готовый ответ и решает по нему: выполнить тело или пропустить.</p>`,
    en:`<p>Start with what may stand between <code>if</code> and the opening brace at all. Go accepts one thing there: something whose answer is <code>true</code> or <code>false</code>. That kind of value is called a <code>bool</code>, and it has no other values — exactly two.</p>
<p>No number will do, neither one nor zero:</p>
<pre><code>if n % 2 == 0 { }   <span class="cm">// fine: a comparison gives a bool</span>
if n % 2 { }        <span class="cm">// won't compile: non-boolean condition in if statement</span>
if 1 { }            <span class="cm">// won't compile</span></code></pre>
<p>The difference between the first line and the second is what is written there. <code>n % 2</code> is the remainder of division by two, that is the number 0 or 1: a calculation, not a question. <code>n % 2 == 0</code> is already a question — “is the remainder zero?” — and its answer is <code>true</code> or <code>false</code>. Only the second kind works with <code>if</code>.</p>
<p>Many languages do it differently: in C and Python zero counts as false and everything else as true, so <code>if n % 2</code> compiles there. Go dropped that liberty — the question has to be asked out loud.</p>
<p>Hence the consequence the whole topic rests on: a comparison is not part of the <code>if</code> syntax. It is a value in its own right and lives on its own. You can store it, print it, pass it to a function — like any number:</p>
<pre><code>ok := n &gt; 0
fmt.Println(ok)          <span class="cm">// true or false</span>
fmt.Printf("%T\\n", ok)   <span class="cm">// bool</span></code></pre>
<p><code>if</code> computes nothing by itself. It receives a finished answer and decides on it: run the body or skip it.</p>`}
},
{
 h:{ru:"<code>==</code> спрашивает, <code>=</code> кладёт", en:"<code>==</code> asks, <code>=</code> puts"},
 b:{ru:`<p>Раз <code>if</code> ждёт готовый ответ, надо уметь задать вопрос. Задаёт его <code>==</code>. И здесь теряют больше всего времени, потому что почти такой же знак делает совсем другое.</p>
<pre><code>x = 5    <span class="cm">// положили пятёрку в x — x изменился</span>
x == 5   <span class="cm">// спросили: в x пятёрка? — x не изменился</span></code></pre>
<p>Один знак — команда: возьми значение справа и положи в переменную слева. Два знака — вопрос: слева и справа одно и то же? Первое меняет данные и ничего не отвечает. Второе ничего не меняет и даёт <code>bool</code> — ровно то, что нужно <code>if</code>.</p>
<p>Перепутать легко, но Go не даст:</p>
<pre><code>if x = 5 { }   <span class="cm">// не соберётся: cannot use assignment x = 5 as value</span></code></pre>
<p>Сообщение говорит ровно то, что нужно: присваивание — не значение, его нельзя откуда-то взять и на что-то проверить. Это первое правило другими словами: <code>bool</code> тут не появился, значит после <code>if</code> такой записи не место. Это не придирка. В C такая строка собирается молча: она кладёт в <code>x</code> пятёрку, а условие считает истинным — и программа годами работает не так, как написано. Go закрыл эту дыру целиком.</p>
<p>Обратная сторона того же правила: <code>x == 5</code> отдельной строкой — вопрос, ответ которого некуда деть. Go и это не пропустит: «x == 5 (untyped bool value) is not used». Раз сравнение производит значение, значение обязано куда-то пойти — в <code>if</code>, в переменную или в <code>fmt.Println</code>.</p>`,
    en:`<p>Since <code>if</code> expects a finished answer, you need a way to ask the question. <code>==</code> asks it. And this is where most time gets lost, because an almost identical sign does something entirely different.</p>
<pre><code>x = 5    <span class="cm">// put five into x — x changed</span>
x == 5   <span class="cm">// ask: is x five? — x unchanged</span></code></pre>
<p>One sign is a command: take the value on the right and put it into the variable on the left. Two signs are a question: are the left and the right the same? The first changes data and answers nothing. The second changes nothing and produces a <code>bool</code> — exactly what <code>if</code> needs.</p>
<p>Mixing them up is easy, but Go will not let you:</p>
<pre><code>if x = 5 { }   <span class="cm">// won't compile: cannot use assignment x = 5 as value</span></code></pre>
<p>The message says exactly the right thing: an assignment is not a value, so there is nothing to pick up and test. That is the first rule in other words — no <code>bool</code> appeared here, so this line has no business after <code>if</code>. This is not pedantry. In C that line compiles silently: it puts five into <code>x</code> and treats the condition as true — and the program runs for years doing something other than what is written. Go closed that hole completely.</p>
<p>The flip side of the same rule: <code>x == 5</code> on a line of its own is a question with nowhere to put the answer. Go rejects that too: “x == 5 (untyped bool value) is not used”. If a comparison produces a value, the value has to go somewhere — into an <code>if</code>, into a variable, or into <code>fmt.Println</code>.</p>`}
},
{
 h:{ru:"Ветки проверяются сверху вниз до первого совпадения",
    en:"Branches are checked top to bottom until one matches"},
 b:{ru:`<p>Один <code>if</code> умеет две вещи: выполнить тело или пропустить. Когда вариантов больше двух, к нему пристраивают продолжение — <code>else if</code> и <code>else</code>. Это не отдельные конструкции, а одна цепочка.</p>
<p>Работает она так: Go проверяет условия сверху вниз и останавливается на первом, которое дало <code>true</code>. Выполняется тело именно этой ветки, остальные пропускаются — их условия даже не вычисляются.</p>
<pre><code>if n &gt; 0 {
	fmt.Println("positive")
} else if n == 0 {
	fmt.Println("zero")
} else {
	fmt.Println("negative")
}</code></pre>
<p>Из цепочки работает ровно одна ветка, никогда две. У <code>else</code> условия нет — это «во всех остальных случаях», и он выполняется, только если не подошло ничего выше.</p>
<p>Раз проверка идёт сверху вниз до первого попадания, порядок веток — это часть логики, а не оформление. Узкое условие ставят выше широкого, иначе нижняя ветка становится недостижимой:</p>
<pre><code>if n &gt; 10 {
	fmt.Println("big")
} else if n &gt; 100 {   <span class="cm">// сюда не попасть: всё больше 100 больше и 10</span>
	fmt.Println("huge")
}</code></pre>
<p>Такой код соберётся и запустится: по типам всё честно, оба условия дают <code>bool</code>. Просто «huge» не напечатается никогда, ни при каком числе. Поменяй ветки местами — заработает.</p>
<p>Два отдельных <code>if</code> подряд — совсем другое. Между ними нет связи, проверяются оба, сработать могут оба. Одно слово <code>else</code> меняет смысл кода полностью, поэтому решай сразу: варианты исключают друг друга (цепочка) или проверки независимы (отдельные <code>if</code>).</p>`,
    en:`<p>A single <code>if</code> can do two things: run its body or skip it. When there are more than two options, you attach a continuation to it — <code>else if</code> and <code>else</code>. These are not separate constructs but one chain.</p>
<p>It works like this: Go checks the conditions top to bottom and stops at the first one that gives <code>true</code>. The body of that branch runs, the rest are skipped — their conditions are not even evaluated.</p>
<pre><code>if n &gt; 0 {
	fmt.Println("positive")
} else if n == 0 {
	fmt.Println("zero")
} else {
	fmt.Println("negative")
}</code></pre>
<p>Exactly one branch of a chain runs, never two. <code>else</code> has no condition — it means “in every other case”, and it runs only when nothing above matched.</p>
<p>Because checking goes top to bottom until the first hit, the order of the branches is part of the logic, not formatting. The narrow condition goes above the broad one, or the lower branch becomes unreachable:</p>
<pre><code>if n &gt; 10 {
	fmt.Println("big")
} else if n &gt; 100 {   <span class="cm">// unreachable: anything over 100 is over 10 too</span>
	fmt.Println("huge")
}</code></pre>
<p>That code compiles and runs: type-wise everything is honest, both conditions give a <code>bool</code>. It is just that “huge” never prints, for any number at all. Swap the branches and it works.</p>
<p>Two separate <code>if</code> statements are a different thing entirely. Nothing connects them, both are checked, both can fire. One word <code>else</code> changes the meaning of the code completely, so decide up front: are the options mutually exclusive (a chain) or are the checks independent (separate <code>if</code> statements)?</p>`}
},
{
 h:{ru:"<code>&amp;&amp;</code> и <code>||</code> соединяют условия целиком",
    en:"<code>&amp;&amp;</code> and <code>||</code> join whole conditions"},
 b:{ru:`<p>Цепочка раскладывает разные условия по разным веткам. Но часто одна ветка должна сработать только при двух совпадениях сразу: «число больше нуля и меньше десяти». Разносить это по веткам незачем — два условия соединяют в одно.</p>
<p><code>&amp;&amp;</code> даёт <code>true</code>, только когда истинны обе части. <code>||</code> — когда истинна хотя бы одна. Результат снова <code>bool</code>, поэтому такая склейка годится ровно туда же, куда и одиночное сравнение.</p>
<p>Главное — что именно стоит слева и справа от знака. Не значения, а полные условия, каждое со своим сравнением:</p>
<pre><code>if n &gt; 0 &amp;&amp; n &lt; 10 { }        <span class="cm">// ок: два полных сравнения</span>
if c == 'a' || c == 'b' { }    <span class="cm">// ок: имя переменной в каждой части</span>
if c == 'a' || 'b' { }         <span class="cm">// не соберётся</span></code></pre>
<p>Третья строка читается вслух нормально — «c равно a или b», — но справа от <code>||</code> оказалась руна, а не условие. Соединять можно только <code>bool</code> с <code>bool</code>: это то же первое правило, просто теперь оно действует внутри условия, а не перед ним. Имя переменной приходится повторять в каждой части — не для красоты, другой формы нет.</p>
<p>Когда в строке встречаются оба знака, <code>&amp;&amp;</code> связывает сильнее: <code>a || b &amp;&amp; c</code> Go читает как <code>a || (b &amp;&amp; c)</code>. Держать это в голове не нужно и не стоит — ставь скобки сам, тогда строка значит ровно то, что видно глазами.</p>`,
    en:`<p>A chain spreads different conditions across different branches. But often one branch has to fire only when two things hold at once: “the number is above zero and below ten”. There is no point splitting that across branches — you join the two conditions into one.</p>
<p><code>&amp;&amp;</code> gives <code>true</code> only when both sides are true. <code>||</code> — when at least one is. The result is a <code>bool</code> again, so the joined thing fits exactly where a single comparison fits.</p>
<p>What matters is what stands on each side of the sign. Not values, but complete conditions, each with its own comparison:</p>
<pre><code>if n &gt; 0 &amp;&amp; n &lt; 10 { }        <span class="cm">// fine: two complete comparisons</span>
if c == 'a' || c == 'b' { }    <span class="cm">// fine: the variable name in each part</span>
if c == 'a' || 'b' { }         <span class="cm">// won't compile</span></code></pre>
<p>The third line reads fine out loud — “c equals a or b” — but what sits to the right of <code>||</code> is a rune, not a condition. You can only join a <code>bool</code> to a <code>bool</code>: that is the first rule again, now working inside the condition instead of in front of it. The variable name has to be repeated in every part — not for looks, there is no other form.</p>
<p>When both signs meet in one line, <code>&amp;&amp;</code> binds tighter: Go reads <code>a || b &amp;&amp; c</code> as <code>a || (b &amp;&amp; c)</code>. Don't keep that in your head, and don't rely on it — write the parentheses yourself and the line means exactly what your eyes see.</p>`}
},
{
 h:{ru:"Правую часть Go может не вычислять вовсе", en:"Go may never evaluate the right side"},
 b:{ru:`<p>Раз части соединены в одну строку, стоит знать, в каком порядке Go их читает. Слева направо — и он бросает работу, как только ответ уже определён, не глядя на остаток строки.</p>
<ul><li>у <code>&amp;&amp;</code> левая часть дала <code>false</code> → правую не смотрят: обе истинными уже не станут, ответ <code>false</code>;</li>
<li>у <code>||</code> левая часть дала <code>true</code> → правую не смотрят: одной хватило, ответ <code>true</code>.</li></ul>
<p>Пока обе части — простые сравнения, разницы никакой: ответ тот же, просто получен быстрее. Видно становится тогда, когда правая часть что-то делает: печатает, вызывает функцию, лезет в память по номеру.</p>
<p>Отсюда рабочий приём: проверку, которая защищает, ставят слева от <code>&amp;&amp;</code>.</p>
<pre><code>if i &lt; len(s) &amp;&amp; s[i] == 'x' { }   <span class="cm">// безопасно</span>
if s[i] == 'x' &amp;&amp; i &lt; len(s) { }   <span class="cm">// упадёт: index out of range</span></code></pre>
<p>В первой строке, если <code>i</code> вышел за длину строки, левая часть даёт <code>false</code> — и до <code>s[i]</code> дело просто не доходит. Во второй <code>s[i]</code> выполняется первым, ещё до всякой проверки, и программа падает прямо там.</p>
<p>Обе строки собираются одинаково и обе выглядят разумно — отличаются только порядком слов. Компилятор здесь не помощник, разница видна лишь на запуске. И это не оптимизация, которая может передумать: пропуск правой части гарантирован языком, на него можно опираться.</p>`,
    en:`<p>Once two parts sit in one line, it is worth knowing the order Go reads them in. Left to right — and it stops working the moment the answer is settled, without looking at the rest of the line.</p>
<ul><li>with <code>&amp;&amp;</code>, a <code>false</code> on the left → the right side is skipped: both can no longer be true, the answer is <code>false</code>;</li>
<li>with <code>||</code>, a <code>true</code> on the left → the right side is skipped: one was enough, the answer is <code>true</code>.</li></ul>
<p>While both parts are plain comparisons this changes nothing: same answer, just reached sooner. It becomes visible when the right side actually does something — prints, calls a function, reaches into memory by index.</p>
<p>Hence a working technique: the check that protects you goes to the left of the <code>&amp;&amp;</code>.</p>
<pre><code>if i &lt; len(s) &amp;&amp; s[i] == 'x' { }   <span class="cm">// safe</span>
if s[i] == 'x' &amp;&amp; i &lt; len(s) { }   <span class="cm">// crashes: index out of range</span></code></pre>
<p>In the first line, if <code>i</code> has run past the length of the string, the left part gives <code>false</code> — and <code>s[i]</code> is simply never reached. In the second, <code>s[i]</code> runs first, before any check at all, and the program crashes right there.</p>
<p>Both lines compile the same and both look sensible — only the word order differs. The compiler is no help here; the difference shows only at run time. And this is not an optimisation that might change its mind: skipping the right side is guaranteed by the language, so you can build on it.</p>`}
},
{
 h:{ru:"Диапазон — это два сравнения через <code>&amp;&amp;</code>", en:"A range is two comparisons joined by <code>&amp;&amp;</code>"},
 b:{ru:`<p>Самая частая склейка через <code>&amp;&amp;</code> — проверка, что число попало в диапазон. Форма у неё жёсткая, и записать «как в математике» не выйдет:</p>
<pre><code>n &gt;= 0 &amp;&amp; n &lt;= 9   <span class="cm">// верно</span>
0 &lt;= n &lt;= 9        <span class="cm">// не соберётся</span></code></pre>
<p>Вторая строка ломается по правилу из самого начала. Go читает её слева направо: сначала <code>0 &lt;= n</code>, это даёт <code>bool</code>, а потом он пытается сравнить <code>bool</code> с числом 9 — «mismatched types». Двойного сравнения в языке просто нет, и обойти это нечем.</p>
<p>В верной записи имя переменной стоит в обеих частях, а знаки смотрят друг на друга: <code>&gt;=</code> у нижней границы, <code>&lt;=</code> у верхней. Запомни эту картинку — по ней ошибка ловится глазами.</p>
<p>Потому что развернуть знаки наружу ничего не мешает:</p>
<pre><code>n &lt;= 0 &amp;&amp; n &gt;= 9   <span class="cm">// собирается, но ложно при любом n</span></code></pre>
<p>Здесь спрашивается «число меньше нуля и одновременно больше девяти». Такого числа нет, значит ветка не сработает ни разу. Компилятор молчит: по типам обе части — честные <code>bool</code>, соединены правильно. Ошибка не в форме, а в смысле, а смысл он не проверяет — это и есть граница того, что за тебя может сделать язык.</p>
<p>Проверка за пять секунд: подставь в условие три числа — заведомо подходящее, заведомо нет и ровно границу. Середина ловит развёрнутые знаки, граница — путаницу <code>&lt;</code> и <code>&lt;=</code>.</p>`,
    en:`<p>The most common join with <code>&amp;&amp;</code> is a check that a number falls inside a range. Its shape is fixed, and writing it “the way maths does” will not work:</p>
<pre><code>n &gt;= 0 &amp;&amp; n &lt;= 9   <span class="cm">// correct</span>
0 &lt;= n &lt;= 9        <span class="cm">// won't compile</span></code></pre>
<p>The second line breaks on the rule from the very beginning. Go reads it left to right: first <code>0 &lt;= n</code>, which gives a <code>bool</code>, and then it tries to compare that <code>bool</code> with the number 9 — “mismatched types”. The language has no chained comparison at all, and there is no way around it.</p>
<p>In the correct form the variable name appears in both parts and the signs face each other: <code>&gt;=</code> at the lower bound, <code>&lt;=</code> at the upper one. Memorise that picture — it is how you catch the mistake by eye.</p>
<p>Because nothing stops you from turning the signs outward:</p>
<pre><code>n &lt;= 0 &amp;&amp; n &gt;= 9   <span class="cm">// compiles, but false for every n</span></code></pre>
<p>This asks “is the number below zero and above nine at the same time”. No such number exists, so the branch never fires. The compiler stays silent: type-wise both parts are honest <code>bool</code> values, joined correctly. The mistake is not in the form but in the meaning, and meaning is not something it checks — that is exactly the limit of what the language can do for you.</p>
<p>A five-second check: plug three numbers into the condition — one that clearly fits, one that clearly doesn't, and the boundary itself. The middle catches reversed signs, the boundary catches the <code>&lt;</code> versus <code>&lt;=</code> mix-up.</p>`}
},
{
 h:{ru:"Символ сравнивают с символом, а не с числом", en:"Compare a character with a character, not with a number"},
 b:{ru:`<p>Тот же диапазон, только по символам, — и здесь появляется ловушка, которой у чисел нет. Отдельный символ хранится в Go как руна, а руна — это число, код символа. Поэтому сравнить руну можно и с символом, и с числом: соберётся и то, и другое.</p>
<pre><code>c &gt;= '0' &amp;&amp; c &lt;= '9'   <span class="cm">// c — цифра</span>
c &gt;= 48 &amp;&amp; c &lt;= 57     <span class="cm">// то же самое, но так не пишут</span>
c &gt;= 0 &amp;&amp; c &lt;= 9       <span class="cm">// c — число от 0 до 9, а не цифра</span></code></pre>
<p>Первые две строки означают одно и то же: <code>'0'</code> — это код символа «ноль», то есть 48. Одинарные кавычки просят Go подставить код за тебя, поэтому 48 и 57 держать в памяти не нужно, а строка остаётся читаемой.</p>
<p>Третья строка — уже другая проверка. Она спрашивает, лежит ли сам код символа между 0 и 9, а символов с такими кодами в обычном тексте не встретить. Условие собирается и молча даёт <code>false</code> для любой буквы и любой цифры: код символа «5» — это 53, а не 5. Разница между рабочей проверкой и мёртвой — две кавычки, и ошибку показывает не компилятор, а пустой вывод.</p>
<p>Диапазоны по символам вообще работают только потому, что коды внутри группы идут подряд: <code>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</code> — строчная буква, <code>c &gt;= 'A' &amp;&amp; c &lt;= 'Z'</code> — заглавная. Форма та же, что и у чисел: имя переменной в обеих частях, знаки смотрят друг на друга. Правило диапазона не меняется от того, что внутри лежат коды.</p>
<p>Из того же факта следует полезное: <code>c - '0'</code> превращает символ цифры в само число — из 53 вычитается 48, остаётся 5.</p>`,
    en:`<p>The same range, only over characters — and here comes a trap that numbers do not have. A single character is stored in Go as a rune, and a rune is a number: the character's code. So a rune can be compared both with a character and with a number, and both forms compile.</p>
<pre><code>c &gt;= '0' &amp;&amp; c &lt;= '9'   <span class="cm">// c is a digit</span>
c &gt;= 48 &amp;&amp; c &lt;= 57     <span class="cm">// the same, but nobody writes it this way</span>
c &gt;= 0 &amp;&amp; c &lt;= 9       <span class="cm">// c is a number from 0 to 9, not a digit</span></code></pre>
<p>The first two lines mean the same thing: <code>'0'</code> is the code of the character “zero”, that is 48. Single quotes ask Go to fill in the code for you, so there is no need to hold 48 and 57 in your head and the line stays readable.</p>
<p>The third line is a different check altogether. It asks whether the character's code itself lies between 0 and 9, and normal text contains no characters with such codes. The condition compiles and silently gives <code>false</code> for every letter and every digit: the code of “5” is 53, not 5. The difference between a working check and a dead one is two quotes — and what reports the bug is not the compiler but an empty output.</p>
<p>Character ranges work at all only because the codes inside a group are consecutive: <code>c &gt;= 'a' &amp;&amp; c &lt;= 'z'</code> is a lowercase letter, <code>c &gt;= 'A' &amp;&amp; c &lt;= 'Z'</code> an uppercase one. The shape is the same as for numbers: the variable name in both parts, the signs facing each other. The range rule does not change just because the values inside are codes.</p>
<p>The same fact gives you something useful: <code>c - '0'</code> turns a digit character into the number itself — subtract 48 from 53 and 5 is left.</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ + ГРАБЛИ ================= */
var TABLE = {
  title:{ru:"Знаки сравнения и логики", en:"Comparison and logic operators"},
  intro:{ru:"Все девять дают bool. Ничего другого из сравнения выйти не может.",
         en:"All nine produce a bool. A comparison cannot yield anything else."},
  head:{ru:["Запись","Что значит","Пример"], en:["Operator","Meaning","Example"]},
  rows:[
    ["==", {ru:"равно", en:"equal"}, "5 == 5 → true"],
    ["!=", {ru:"не равно", en:"not equal"}, "5 != 4 → true"],
    ["<",  {ru:"меньше", en:"less than"}, "3 < 5 → true"],
    [">",  {ru:"больше", en:"greater than"}, "5 > 3 → true"],
    ["<=", {ru:"меньше или равно", en:"less or equal"}, "5 <= 5 → true"],
    [">=", {ru:"больше или равно", en:"greater or equal"}, "5 >= 5 → true"],
    ["&&", {ru:"истинны обе части", en:"both sides true"}, "true && false → false"],
    ["||", {ru:"истинна хотя бы одна", en:"at least one side true"}, "true || false → true"],
    ["!",  {ru:"наоборот", en:"the opposite"}, "!false → true"]
  ]
};

var TRAPS = [
 {ru:"<strong><code>n &lt;= 0 &amp;&amp; n &gt;= 9</code> не сработает никогда.</strong> Знаки развёрнуты наружу: одно число не может быть одновременно меньше нуля и больше девяти. Программа собирается, ветка просто молчит, и ты ищешь ошибку где угодно, только не в условии. Подставь число из середины диапазона — всё видно сразу.",
  en:"<strong><code>n &lt;= 0 &amp;&amp; n &gt;= 9</code> is never true.</strong> The signs point outward: no single number is both below zero and above nine. The program compiles, the branch simply stays silent, and you hunt the bug everywhere except the condition. Plug in a number from the middle of the range and it shows at once."},
 {ru:"<strong><code>!</code> накрывает только то, что стоит сразу за ним.</strong> <code>!n &gt; 5</code> не соберётся — <code>!</code> к числу неприменим. Хуже другое: <code>!a &amp;&amp; b</code> соберётся и будет значить <code>(!a) &amp;&amp; b</code>, а не отрицание всего условия. Нужно всё выражение — ставь скобки: <code>!(a &amp;&amp; b)</code>.",
  en:"<strong><code>!</code> covers only what stands right after it.</strong> <code>!n &gt; 5</code> won't compile — <code>!</code> doesn't apply to a number. Worse is the other case: <code>!a &amp;&amp; b</code> compiles and means <code>(!a) &amp;&amp; b</code>, not the negation of the whole thing. If you want the whole expression, use parentheses: <code>!(a &amp;&amp; b)</code>."},
 {ru:"<strong><code>c &gt;= 0 &amp;&amp; c &lt;= 9</code> вместо <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code>.</strong> Обе записи собираются: руна — число. Первая проверяет, что код символа лежит между 0 и 9, а таких символов в обычном тексте не бывает — условие всегда ложно. Забыл две кавычки — потерял час.",
  en:"<strong><code>c &gt;= 0 &amp;&amp; c &lt;= 9</code> instead of <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code>.</strong> Both compile — a rune is a number. The first one checks that the character code sits between 0 and 9, and normal text has no such characters, so it is always false. Two missing quotes cost you an hour."},
 {ru:"<strong><code>else</code> обязан стоять на одной строке с закрывающей скобкой.</strong> Перенос на новую строку ломает сборку: Go дописывает точку с запятой в конце строки, и цепочка обрывается. Пиши <code>} else {</code>, ничего другого язык не примет.",
  en:"<strong><code>else</code> must sit on the same line as the closing brace.</strong> Moving it to the next line breaks the build: Go inserts a semicolon at the end of the line and the chain falls apart. Write <code>} else {</code> — the language accepts nothing else."},
 {ru:"<strong>Широкое условие выше узкого убивает нижнюю ветку.</strong> В цепочке <code>if n &gt; 10 { } else if n &gt; 100 { }</code> вторая ветка не сработает никогда: всё, что больше ста, уже больше десяти и ушло в первую. Компилятор молчит — по типам всё в порядке.",
  en:"<strong>A broad condition above a narrow one kills the lower branch.</strong> In <code>if n &gt; 10 { } else if n &gt; 100 { }</code> the second branch never fires: anything over a hundred is already over ten and went into the first. The compiler says nothing — type-wise everything is fine."},
 {ru:"<strong>Переменная, созданная внутри ветки, снаружи не существует.</strong> <code>if n &gt; 0 { msg := \"yes\" }</code>, а ниже <code>fmt.Println(msg)</code> — «undefined: msg». Нужна снаружи — объяви её до <code>if</code>, а внутри веток только присваивай.",
  en:"<strong>A variable created inside a branch does not exist outside it.</strong> <code>if n &gt; 0 { msg := \"yes\" }</code> followed by <code>fmt.Println(msg)</code> gives “undefined: msg”. If you need it outside, declare it before the <code>if</code> and only assign inside the branches."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

func main() {
	n := -7
	if n > 0 {
		fmt.Println("positive")
	}
	fmt.Println("done")
}`,
 out:"done",
 why:{ru:"Условие ложно — тело <code>if</code> пропущено целиком, программа пошла дальше. Ни ошибки, ни предупреждения: пропуск ветки — нормальная работа.<br><b>Сломай:</b> поставь <code>if n</code> вместо <code>if n &gt; 0</code> и прочитай ошибку.",
      en:"The condition is false — the <code>if</code> body is skipped entirely and the program moves on. No error, no warning: skipping a branch is normal behaviour.<br><b>Break it:</b> write <code>if n</code> instead of <code>if n &gt; 0</code> and read the error."}
},
{
 chg:{ru:"добавили else", en:"added an else"},
 code:`package main

import "fmt"

func main() {
	n := -7
	if n > 0 {
		fmt.Println("positive")
	} else {
		fmt.Println("not positive")
	}
	fmt.Println("done")
}`,
 out:"not positive\ndone",
 why:{ru:"Теперь ветки две, и одна из них выполнится обязательно. <b>Сломай:</b> перенеси <code>else</code> на новую строку под <code>}</code> — не соберётся.",
      en:"Now there are two branches and exactly one of them will run. <b>Break it:</b> move <code>else</code> to its own line below the <code>}</code> — it won't compile."}
},
{
 chg:{ru:"между ними встала ветка else if", en:"an else if branch went in between"},
 code:`package main

import "fmt"

func main() {
	n := -7
	if n > 0 {
		fmt.Println("positive")
	} else if n == 0 {
		fmt.Println("zero")
	} else {
		fmt.Println("negative")
	}
	fmt.Println("done")
}`,
 out:"negative\ndone",
 why:{ru:"Проверки идут сверху вниз: первая ложна, вторая ложна, сработал <code>else</code>. Ровно одна ветка из трёх.",
      en:"Checks run top to bottom: the first is false, the second is false, so <code>else</code> fires. Exactly one branch out of three."}
},
{
 chg:{ru:"вместо веток печатаем сами сравнения", en:"instead of branching we print the comparisons themselves"},
 code:`package main

import "fmt"

func main() {
	n := -7
	fmt.Println(n > 0)
	fmt.Println(n == 0)
	ok := n < 0
	fmt.Println(ok)
	fmt.Printf("%T\\n", ok)
}`,
 out:"false\nfalse\ntrue\nbool",
 why:{ru:"Сравнение — это выражение со значением, а не часть <code>if</code>. Его можно напечатать, положить в переменную, вернуть из функции. Тип у него <code>bool</code>.",
      en:"A comparison is an expression with a value, not a piece of <code>if</code> syntax. You can print it, store it, return it from a function. Its type is <code>bool</code>."}
},
{
 chg:{ru:"два сравнения соединили через &&", en:"two comparisons joined with &&"},
 code:`package main

import "fmt"

func main() {
	n := 5
	fmt.Println(n >= 0 && n <= 9)
	n = 42
	fmt.Println(n >= 0 && n <= 9)
}`,
 out:"true\nfalse",
 why:{ru:"Это и есть диапазон: две границы, обе про <code>n</code>, соединены через <code>&amp;&amp;</code>. У 42 первая часть истинна, вторая нет — значит, всё условие ложно.",
      en:"That is a range: two bounds, both about <code>n</code>, joined by <code>&amp;&amp;</code>. For 42 the first part is true and the second is not, so the whole condition is false."}
},
{
 chg:{ru:"перед условием появился !", en:"a ! appeared in front of the condition"},
 code:`package main

import "fmt"

func main() {
	n := 5
	fmt.Println(!(n >= 0 && n <= 9))
	n = 42
	fmt.Println(!(n >= 0 && n <= 9))
}`,
 out:"false\ntrue",
 why:{ru:"Ответы перевернулись. Скобки здесь обязательны: без них <code>!</code> взял бы только <code>n</code>, а к числу он неприменим — не соберётся.",
      en:"The answers flipped. The parentheses are required: without them <code>!</code> would grab just <code>n</code>, and it doesn't apply to a number — no compile."}
},
{
 chg:{ru:"то же самое переписали через ||, без !", en:"the same thing rewritten with ||, no !"},
 code:`package main

import "fmt"

func main() {
	n := 5
	fmt.Println(n < 0 || n > 9)
	n = 42
	fmt.Println(n < 0 || n > 9)
}`,
 out:"false\ntrue",
 why:{ru:"Вывод совпал с прошлым примером до символа — это одно и то же условие. «Не (внутри диапазона)» равно «ниже нижней границы или выше верхней». Знаки при этом развернулись: <code>&gt;=</code> стал <code>&lt;</code>, <code>&lt;=</code> стал <code>&gt;</code>.",
      en:"The output matches the previous example exactly — it is the same condition. “Not (inside the range)” equals “below the lower bound or above the upper one”. Note the signs flipped: <code>&gt;=</code> became <code>&lt;</code>, <code>&lt;=</code> became <code>&gt;</code>."}
},
{
 chg:{ru:"|| заменили на && — один знак", en:"|| replaced by && — a single sign"},
 code:`package main

import "fmt"

func main() {
	n := 5
	fmt.Println(n < 0 && n > 9)
	n = 42
	fmt.Println(n < 0 && n > 9)
}`,
 out:"false\nfalse",
 why:{ru:"Два <code>false</code> — и так будет при любом числе. Ни одно число не меньше нуля и больше девяти одновременно. Это самая частая ошибка темы, и компилятор её не видит.",
      en:"Two <code>false</code> results — and it stays that way for any number. No number is both below zero and above nine. This is the most common mistake in the topic, and the compiler does not see it."}
},
{
 chg:{ru:"появилась функция, которая сообщает, что её вызвали", en:"a function appeared that announces its own call"},
 code:`package main

import "fmt"

func check(name string, result bool) bool {
	fmt.Println("check", name)
	return result
}

func main() {
	fmt.Println(check("A", true) || check("B", true))
	fmt.Println(check("A", false) && check("B", false))
}`,
 out:"check A\ntrue\ncheck A\nfalse",
 why:{ru:"«check B» не напечаталось ни разу. У <code>||</code> левая часть дала <code>true</code>, у <code>&amp;&amp;</code> — <code>false</code>: ответ уже известен, правую часть Go просто не вызывает.",
      en:"“check B” never printed. For <code>||</code> the left side gave <code>true</code>, for <code>&amp;&amp;</code> it gave <code>false</code>: the answer is settled, so Go never calls the right side at all."}
},
{
 chg:{ru:"сравниваем не числа, а руны", en:"comparing runes instead of numbers"},
 code:`package main

import "fmt"

func main() {
	c := '5'
	fmt.Println(c >= '0' && c <= '9')
	fmt.Println(c >= 0 && c <= 9)
	if c >= '0' && c <= '9' {
		fmt.Println("digit", c-'0')
	} else {
		fmt.Println("not a digit")
	}
}`,
 out:"true\nfalse\ndigit 5",
 why:{ru:"Вторая строка собралась и дала <code>false</code>: в <code>c</code> лежит 53, а не 5. Разница между двумя строками — две одинарные кавычки.<br><b>Сломай:</b> поставь <code>c := 'x'</code> и посмотри, что напечатается.",
      en:"The second line compiled and printed <code>false</code>: <code>c</code> holds 53, not 5. The difference between the two lines is two single quotes.<br><b>Break it:</b> set <code>c := 'x'</code> and see what comes out."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"NotPositive", lvl:1, e:"not positive",
 d:{ru:"Возьми <code>n := -3</code>. Напечатай <code>positive</code>, если число больше нуля, и <code>not positive</code> в противном случае.",
    en:"Take <code>n := -3</code>. Print <code>positive</code> if the number is above zero, otherwise <code>not positive</code>."},
 h:{ru:"Две ветки: <code>if</code> и <code>else</code>. <code>else</code> пишется на одной строке с закрывающей скобкой.",
    en:"Two branches: <code>if</code> and <code>else</code>. Put <code>else</code> on the same line as the closing brace."}},

{t:"EvenOrOdd", lvl:1, e:"odd",
 d:{ru:"Возьми <code>n := 7</code>. Напечатай <code>even</code>, если число чётное, иначе <code>odd</code>.",
    en:"Take <code>n := 7</code>. Print <code>even</code> if the number is even, otherwise <code>odd</code>."},
 h:{ru:"Чётность — это остаток от деления на два: <code>n % 2 == 0</code>. Без <code>== 0</code> не соберётся: в <code>if</code> нужен <code>bool</code>, а не число.",
    en:"Evenness is the remainder of division by two: <code>n % 2 == 0</code>. Without <code>== 0</code> it won't compile: <code>if</code> needs a <code>bool</code>, not a number."}},

{t:"ThreeAnswers", lvl:1, e:"false true true",
 d:{ru:"Возьми <code>a := 5</code> и <code>b := 8</code>. Напечатай в одну строку три ответа: равны ли они, не равны ли, меньше ли <code>a</code>, чем <code>b</code>.",
    en:"Take <code>a := 5</code> and <code>b := 8</code>. Print three answers on one line: are they equal, are they different, is <code>a</code> less than <code>b</code>."},
 h:{ru:"Никакого <code>if</code> здесь не нужно: сравнение само по себе даёт значение. <code>fmt.Println</code> примет все три сразу.",
    en:"No <code>if</code> is needed here: a comparison is a value by itself. <code>fmt.Println</code> takes all three at once."}},

{t:"SignOfNumber", lvl:1, e:"zero",
 d:{ru:"Возьми <code>n := 0</code>. Напечатай <code>positive</code>, <code>zero</code> или <code>negative</code> — цепочкой из трёх веток.",
    en:"Take <code>n := 0</code>. Print <code>positive</code>, <code>zero</code> or <code>negative</code> — a chain of three branches."},
 h:{ru:"Средняя ветка — <code>else if n == 0</code>. Последняя — просто <code>else</code>, без условия: если первые две не подошли, других вариантов нет.",
    en:"The middle branch is <code>else if n == 0</code>. The last one is a bare <code>else</code>: if the first two didn't match, nothing else is left."}},

{t:"InRange", lvl:2, e:"true\nfalse",
 d:{ru:"Возьми два числа: <code>a := 7</code> и <code>b := 42</code>. Для каждого напечатай на своей строке, попадает ли оно в диапазон от 0 до 9 включительно.",
    en:"Take two numbers: <code>a := 7</code> and <code>b := 42</code>. For each one print on its own line whether it falls in the range 0 to 9 inclusive."},
 h:{ru:"Диапазон — два сравнения через <code>&amp;&amp;</code>. Знаки должны смотреть друг на друга: <code>&gt;=</code> у нижней границы, <code>&lt;=</code> у верхней.",
    en:"A range is two comparisons joined by <code>&amp;&amp;</code>. The signs must face each other: <code>&gt;=</code> at the lower bound, <code>&lt;=</code> at the upper one."}},

{t:"IsDigit", lvl:2, e:"true\nfalse",
 d:{ru:"Возьми две руны: <code>c := '5'</code> и <code>d := 'x'</code>. Для каждой напечатай на своей строке, цифра это или нет.",
    en:"Take two runes: <code>c := '5'</code> and <code>d := 'x'</code>. For each one print on its own line whether it is a digit."},
 h:{ru:"Сравнивай с символами в одинарных кавычках, а не с числами 0 и 9. Коды цифр идут подряд, поэтому диапазон работает.",
    en:"Compare against characters in single quotes, not against the numbers 0 and 9. Digit codes are consecutive, which is why a range works."}},

{t:"MaxOfThree", lvl:2, e:"9",
 d:{ru:"Возьми три числа: <code>a := 3</code>, <code>b := 9</code>, <code>c := 5</code>. Напечатай самое большое.",
    en:"Take three numbers: <code>a := 3</code>, <code>b := 9</code>, <code>c := 5</code>. Print the largest one."},
 h:{ru:"Первая ветка: <code>a</code> больше или равно и <code>b</code>, и <code>c</code> — два сравнения через <code>&amp;&amp;</code>. Вторая — то же самое про <code>b</code>. Иначе остаётся <code>c</code>.",
    en:"First branch: <code>a</code> is at least <code>b</code> and at least <code>c</code> — two comparisons joined by <code>&amp;&amp;</code>. Second: the same for <code>b</code>. Otherwise <code>c</code> is left."}},

{t:"LeapYear", lvl:3, e:"true\nfalse",
 d:{ru:"Год високосный, если он делится на 4 и при этом не делится на 100, либо делится на 400. Напечатай ответ для 2000 и для 2100 — двумя строками.",
    en:"A year is a leap year if it divides by 4 and does not divide by 100, or if it divides by 400. Print the answer for 2000 and for 2100 — two lines."},
 h:{ru:"Условие целиком: <code>y%4 == 0 &amp;&amp; y%100 != 0 || y%400 == 0</code>. <code>&amp;&amp;</code> связывает сильнее, но скобки вокруг первой пары стоит поставить — читать легче.",
    en:"The whole condition: <code>y%4 == 0 &amp;&amp; y%100 != 0 || y%400 == 0</code>. <code>&amp;&amp;</code> binds tighter, but parentheses around the first pair make it easier to read."}},

{t:"TriangleKind", lvl:3, e:"true\nscalene",
 d:{ru:"Стороны <code>a := 3</code>, <code>b := 4</code>, <code>c := 5</code>. На первой строке напечатай, можно ли построить такой треугольник: сумма любых двух сторон больше третьей. На второй — какой он: <code>equilateral</code> (все стороны равны), <code>isosceles</code> (равны две), <code>scalene</code> (все разные) или <code>none</code>, если построить нельзя.",
    en:"Sides <code>a := 3</code>, <code>b := 4</code>, <code>c := 5</code>. On the first line print whether such a triangle exists: the sum of any two sides is greater than the third. On the second line print its kind: <code>equilateral</code> (all sides equal), <code>isosceles</code> (two equal), <code>scalene</code> (all different), or <code>none</code> if it cannot exist."},
 h:{ru:"Первое условие — три сравнения через <code>&amp;&amp;</code>. Положи ответ в переменную и используй её дважды: сначала напечатай, потом проверь через <code>!</code>. Дальше цепочка: сначала «все три равны», потом «хотя бы две равны» через <code>||</code>, иначе <code>scalene</code>. Порядок важен.",
    en:"The first condition is three comparisons joined by <code>&amp;&amp;</code>. Store the answer in a variable and use it twice: print it, then test it with <code>!</code>. Then a chain: first “all three equal”, then “at least two equal” with <code>||</code>, otherwise <code>scalene</code>. The order matters."}},

{t:"FizzBuzzOne", lvl:3, e:"FizzBuzz",
 d:{ru:"Возьми <code>n := 15</code>. Напечатай <code>Fizz</code>, если число делится на 3, <code>Buzz</code>, если на 5, <code>FizzBuzz</code>, если и на 3, и на 5, и само число, если ни на что не делится.",
    en:"Take <code>n := 15</code>. Print <code>Fizz</code> if the number divides by 3, <code>Buzz</code> if by 5, <code>FizzBuzz</code> if by both 3 and 5, and the number itself if by neither."},
 h:{ru:"Вся задача — в порядке веток. Если проверку на 3 поставить первой, до <code>FizzBuzz</code> дело не дойдёт никогда: 15 делится на 3 и уйдёт в верхнюю ветку. Самое узкое условие — наверх.",
    en:"The whole task is the order of the branches. Put the “divides by 3” check first and <code>FizzBuzz</code> becomes unreachable: 15 divides by 3 and leaves through the top branch. The narrowest condition goes on top."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};

var BANK = [
{q:Q_OUT, code:"n := 5\nif n > 3 {\n\tfmt.Println(\"a\")\n} else {\n\tfmt.Println(\"b\")\n}",
 opts:["a","b","a\nb",NO], ok:0,
 why:{ru:"5 &gt; 3 даёт <code>true</code>, работает первая ветка. Тело <code>else</code> пропускается целиком — из цепочки выполняется ровно одна ветка, никогда две.",
      en:"5 &gt; 3 is <code>true</code>, so the first branch runs. The <code>else</code> body is skipped entirely — exactly one branch of a chain runs, never two."}},

{q:Q_OUT, code:"fmt.Println(5 == 5, 5 != 5)",
 opts:["true false","false true","true true",NO], ok:0,
 why:{ru:"Сравнение — это значение, его можно печатать без всякого <code>if</code>. <code>==</code> и <code>!=</code> всегда дают противоположные ответы.",
      en:"A comparison is a value; you can print it with no <code>if</code> at all. <code>==</code> and <code>!=</code> always give opposite answers."}},

{q:Q_OUT, code:"n := 42\nfmt.Println(n >= 0 && n <= 9)",
 opts:["false","true","42",NO], ok:0,
 why:{ru:"42 &gt;= 0 истинно, 42 &lt;= 9 ложно. <code>&amp;&amp;</code> требует обе части — достаточно одной ложной, чтобы всё стало <code>false</code>.",
      en:"42 &gt;= 0 is true, 42 &lt;= 9 is false. <code>&amp;&amp;</code> needs both — one false part makes the whole thing <code>false</code>."}},

{q:Q_OUT, code:"n := 5\nfmt.Println(!(n > 3))",
 opts:["false","true","5",NO], ok:0,
 why:{ru:"Внутри скобок <code>true</code>, <code>!</code> переворачивает его в <code>false</code>. Без скобок эта строка не собралась бы: <code>!</code> взял бы <code>n</code>, а к числу он неприменим.",
      en:"Inside the parentheses it is <code>true</code>, and <code>!</code> flips it to <code>false</code>. Without the parentheses the line wouldn't compile: <code>!</code> would grab <code>n</code>, and it doesn't apply to numbers."}},

{q:Q_OUT, code:"n := 5\nfmt.Println(n <= 0 && n >= 9)",
 opts:["false","true",{ru:"зависит от n",en:"depends on n"},NO], ok:0,
 why:{ru:"Развёрнутый диапазон: знаки смотрят наружу. Ответ <code>false</code> при любом <code>n</code> — такого числа не существует. Компилятор такое пропускает молча, ошибку ищут глазами.",
      en:"A reversed range: the signs point outward. The answer is <code>false</code> for every <code>n</code> — no such number exists. The compiler passes it silently; you find this one by eye."}},

{q:Q_OUT, code:"c := '7'\nfmt.Println(c >= 0 && c <= 9)",
 opts:["false","true","55",NO], ok:0,
 why:{ru:"В <code>c</code> лежит 55 — код символа «7». 55 &lt;= 9 ложно. Проверка цифры пишется через символы: <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code>.",
      en:"<code>c</code> holds 55, the code of the character “7”. 55 &lt;= 9 is false. A digit check is written with characters: <code>c &gt;= '0' &amp;&amp; c &lt;= '9'</code>."}},

{q:Q_OUT, code:"n := 0\nif n > 0 {\n\tfmt.Println(\"positive\")\n} else if n == 0 {\n\tfmt.Println(\"zero\")\n} else {\n\tfmt.Println(\"negative\")\n}",
 opts:["zero","positive","negative","zero\nnegative"], ok:0,
 why:{ru:"Первая проверка ложна, вторая истинна — дальше цепочка не идёт, <code>else</code> не смотрят вообще.",
      en:"The first check is false, the second is true — the chain stops there and <code>else</code> is never looked at."}},

{q:Q_OUT, code:"n := 150\nif n > 10 {\n\tfmt.Println(\"big\")\n} else if n > 100 {\n\tfmt.Println(\"huge\")\n}",
 opts:["big","huge","big\nhuge",{ru:"ничего",en:"nothing"}], ok:0,
 why:{ru:"Вторая ветка недостижима: всё, что больше 100, больше и 10, и уходит в первую. Чтобы заработала, её надо поставить выше.",
      en:"The second branch is unreachable: anything over 100 is over 10 as well and leaves through the first one. To make it work, move it above."}},

{q:Q_OUT, code:"n := 5\nif n > 0 {\n\tfmt.Println(\"positive\")\n}\nif n > 3 {\n\tfmt.Println(\"big\")\n}",
 opts:["positive\nbig","positive","big",NO], ok:0,
 why:{ru:"Это не цепочка, а два независимых <code>if</code>. Проверяются оба, сработали оба. Убери <code>else</code> — и смысл кода меняется полностью.",
      en:"This is not a chain but two independent <code>if</code> statements. Both are checked, both fire. Drop an <code>else</code> and the meaning of the code changes completely."}},

{q:Q_OUT, code:"fmt.Println(true || false && false)",
 opts:["true","false",NO,{ru:"зависит от версии Go",en:"depends on the Go version"}], ok:0,
 why:{ru:"<code>&amp;&amp;</code> связывает сильнее, чем <code>||</code>, поэтому читается как <code>true || (false &amp;&amp; false)</code>. Если бы скобки стояли вокруг первой пары, ответ был бы <code>false</code>. Ставь их сам.",
      en:"<code>&amp;&amp;</code> binds tighter than <code>||</code>, so this reads as <code>true || (false &amp;&amp; false)</code>. With the parentheses around the first pair the answer would be <code>false</code>. Write them yourself."}},

{q:{ru:"Какая строка не соберётся?", en:"Which line won't compile?"}, code:null,
 opts:["if n = 5 {","if n == 5 {","if n != 5 {","if n >= 5 {"], ok:0,
 why:{ru:"Один знак — присваивание, два — сравнение. Go отвечает: «expected boolean expression, found assignment». В C такая строка собралась бы молча и испортила данные — здесь язык прикрывает.",
      en:"One sign is assignment, two is comparison. Go says: “expected boolean expression, found assignment”. In C that line would compile silently and corrupt the data — here the language covers you."}},

{q:{ru:"Как проверить, что число чётное?", en:"How do you check that a number is even?"}, code:null,
 opts:["n % 2 == 0","n % 2","n / 2 == 0","n == 2"], ok:0,
 why:{ru:"<code>n % 2</code> — это число 0 или 1, а <code>if</code> требует <code>bool</code>. Сравнение превращает число в ответ. <code>n / 2 == 0</code> — совсем другое: оно истинно только для 0 и 1.",
      en:"<code>n % 2</code> is a number, 0 or 1, and <code>if</code> requires a <code>bool</code>. The comparison turns the number into an answer. <code>n / 2 == 0</code> means something else entirely: it is true only for 0 and 1."}},

{q:{ru:"Как записать «n от 0 до 9 включительно»?", en:"How do you write “n from 0 to 9 inclusive”?"}, code:null,
 opts:["n >= 0 && n <= 9","0 <= n <= 9","n >= 0 || n <= 9","n <= 0 && n >= 9"], ok:0,
 why:{ru:"Двойного сравнения в Go нет — второй вариант не соберётся. Третий истинен почти всегда: любое число либо не меньше нуля, либо не больше девяти. Четвёртый ложен всегда — знаки развёрнуты наружу.",
      en:"Go has no chained comparison — the second option won't compile. The third is true almost always: any number is either at least zero or at most nine. The fourth is always false — the signs point outward."}},

{q:{ru:"Что то же самое, что <code>!(n &gt; 5)</code>?", en:"What is the same as <code>!(n &gt; 5)</code>?"}, code:null,
 opts:["n <= 5","n < 5","n >= 5","!n > 5"], ok:0,
 why:{ru:"Отрицание «больше» — это «меньше или равно»: граница переходит на другую сторону. Терять её — типовая ошибка. Последний вариант не соберётся: <code>!</code> к числу неприменим.",
      en:"The negation of “greater than” is “less than or equal”: the boundary switches sides. Losing it is a classic mistake. The last option won't compile: <code>!</code> doesn't apply to a number."}},

{q:{ru:"Сколько раз вызовется <code>f()</code>?", en:"How many times is <code>f()</code> called?"},
 code:"// f() returns true\nfmt.Println(f() || f())",
 opts:["1","2","0",{ru:"зависит от компилятора",en:"up to the compiler"}], ok:0,
 why:{ru:"Левая часть уже дала <code>true</code>, у <code>||</code> этого достаточно — правую Go не вычисляет. Это гарантия языка, а не оптимизация: на ней держится приём <code>i &lt; len(s) &amp;&amp; s[i] == 'x'</code>.",
      en:"The left side already gave <code>true</code>, which is enough for <code>||</code> — Go never evaluates the right one. This is a language guarantee, not an optimisation: the trick <code>i &lt; len(s) &amp;&amp; s[i] == 'x'</code> relies on it."}},

{q:{ru:"Почему этот код не соберётся?", en:"Why won't this code compile?"},
 code:"if n > 0 {\n\tfmt.Println(\"a\")\n}\nelse {\n\tfmt.Println(\"b\")\n}",
 opts:[{ru:"else должен стоять на одной строке с }",en:"else must be on the same line as the }"},
       {ru:"перед else нужна точка с запятой",en:"a semicolon is needed before else"},
       {ru:"else нельзя без else if",en:"else needs an else if before it"},
       {ru:"он соберётся",en:"it does compile"}], ok:0,
 why:{ru:"Go дописывает точку с запятой в конце строки. После <code>}</code> на своей строке цепочка считается законченной, и <code>else</code> оказывается ни к чему не привязан. Пиши <code>} else {</code>.",
      en:"Go inserts a semicolon at the end of the line. After a <code>}</code> standing alone the chain is considered finished, and the <code>else</code> has nothing to attach to. Write <code>} else {</code>."}},

{q:Q_HAP, code:"a := []int{1}\nb := []int{1}\nfmt.Println(a == b)",
 opts:[NO,"true","false",{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"Ошибка: «slice can only be compared to nil». Через <code>==</code> сравнивают числа, руны, строки и <code>bool</code>. Слайсы — только поэлементно, вручную.",
      en:"The error is “slice can only be compared to nil”. <code>==</code> works on numbers, runes, strings and <code>bool</code>. Slices have to be compared element by element, by hand."}},

{q:{ru:"Как принято писать проверку логической переменной?", en:"How is a boolean variable normally tested?"}, code:null,
 opts:["if ok {","if ok == true {","if ok != false {","if ok == 1 {"], ok:0,
 why:{ru:"<code>ok</code> уже <code>bool</code> — сравнивать не с чем, <code>if</code> берёт его как есть. Второй и третий варианты соберутся, но это лишний шум. Последний не соберётся: <code>bool</code> с числом не сравнивают.",
      en:"<code>ok</code> is already a <code>bool</code> — there is nothing to compare, <code>if</code> takes it as is. The second and third compile but are pure noise. The last one won't compile: a <code>bool</code> is not compared to a number."}},

{q:{ru:"Как записать «n вне диапазона от 0 до 9»?", en:"How do you write “n is outside the range 0 to 9”?"}, code:null,
 opts:["n < 0 || n > 9","n < 0 && n > 9","n <= 0 || n >= 9","n > 0 || n < 9"], ok:0,
 why:{ru:"Отрицание «и» даёт «или», а знаки разворачиваются: <code>!(n &gt;= 0 &amp;&amp; n &lt;= 9)</code> — это <code>n &lt; 0 || n &gt; 9</code>. Третий вариант выкидывает сами границы: 0 и 9 в диапазоне, а он скажет, что снаружи.",
      en:"Negating an “and” gives an “or”, and the signs flip: <code>!(n &gt;= 0 &amp;&amp; n &lt;= 9)</code> is <code>n &lt; 0 || n &gt; 9</code>. The third option throws out the boundaries: 0 and 9 are inside the range, yet it calls them outside."}},

{q:Q_HAP, code:"var x int = 5\nvar y float64 = 5\nfmt.Println(x == y)",
 opts:[NO,"true","false",{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"«mismatched types int and float64». Сравнивать можно только значения одного типа, даже если оба — числа и оба равны пяти. Нужно привести: <code>float64(x) == y</code>.",
      en:"“mismatched types int and float64”. Only values of the same type can be compared, even when both are numbers and both equal five. Convert first: <code>float64(x) == y</code>."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Почему <code>if</code> требует именно <code>bool</code>?", en:"Why does <code>if</code> require a <code>bool</code>?"},
 a:{ru:`<p>Потому что ветвление — это ответ на вопрос «да или нет», и Go требует, чтобы вопрос был задан явно.</p>
<p>В C и Python ноль считается ложью, а всё остальное истиной. Оттуда и приходит привычка писать <code>if n % 2</code>. В Go это не соберётся: «non-boolean condition in if statement».</p>
<p>Разница простая:</p>
<pre><code>n % 2        <span class="cm">// число: 0 или 1</span>
n % 2 == 0   <span class="cm">// bool: true или false</span></code></pre>
<p>Плюс такого запрета в том, что <code>if x = 5</code> и <code>if x == 5</code> перестают быть похожими: первое просто не соберётся.</p>`,
    en:`<p>Because branching is an answer to a yes-or-no question, and Go insists the question be asked explicitly.</p>
<p>In C and Python zero counts as false and everything else as true. That is where the habit of writing <code>if n % 2</code> comes from. In Go it won't compile: “non-boolean condition in if statement”.</p>
<p>The difference is simple:</p>
<pre><code>n % 2        <span class="cm">// a number: 0 or 1</span>
n % 2 == 0   <span class="cm">// a bool: true or false</span></code></pre>
<p>A side benefit: <code>if x = 5</code> and <code>if x == 5</code> stop looking alike, because the first one simply won't build.</p>`}},

{q:{ru:"Чем <code>else if</code> отличается от нескольких <code>if</code> подряд?", en:"How is <code>else if</code> different from several <code>if</code> statements in a row?"},
 a:{ru:`<p>Цепочка <code>if / else if / else</code> выполняет ровно одну ветку. Как только проверка дала <code>true</code>, остальные не проверяются вообще.</p>
<p>Отдельные <code>if</code> проверяются все подряд, и сработать могут несколько:</p>
<pre><code>n := 5

<span class="cm">// цепочка → одна строка на экране</span>
if n &gt; 0 {
	fmt.Println("positive")
} else if n &gt; 3 {
	fmt.Println("big")
}

<span class="cm">// два отдельных if → две строки</span>
if n &gt; 0 {
	fmt.Println("positive")
}
if n &gt; 3 {
	fmt.Println("big")
}</code></pre>
<p>Отсюда два следствия. Первое: в цепочке порядок веток решает всё — узкое условие ставят выше широкого, иначе нижняя ветка мертва. Второе: если условия действительно независимы (число и чётное, и больше десяти), цепочка тут не подходит, нужны отдельные <code>if</code>.</p>`,
    en:`<p>An <code>if / else if / else</code> chain runs exactly one branch. The moment a check returns <code>true</code>, the rest are not evaluated at all.</p>
<p>Separate <code>if</code> statements are all checked, and several can fire:</p>
<pre><code>n := 5

<span class="cm">// a chain → one line on screen</span>
if n &gt; 0 {
	fmt.Println("positive")
} else if n &gt; 3 {
	fmt.Println("big")
}

<span class="cm">// two separate ifs → two lines</span>
if n &gt; 0 {
	fmt.Println("positive")
}
if n &gt; 3 {
	fmt.Println("big")
}</code></pre>
<p>Two consequences. First: inside a chain the order decides everything — the narrow condition goes above the broad one, or the lower branch is dead. Second: if the conditions really are independent (the number is both even and above ten), a chain is the wrong tool; use separate <code>if</code> statements.</p>`}},

{q:{ru:"Что такое сокращённое вычисление и когда это видно?", en:"What is short-circuit evaluation and when does it show?"},
 a:{ru:`<p>Go считает условие слева направо и бросает работу, как только ответ известен.</p>
<ul><li><code>false &amp;&amp; ...</code> → правая часть не вычисляется, ответ <code>false</code>;</li>
<li><code>true || ...</code> → правая часть не вычисляется, ответ <code>true</code>.</li></ul>
<p>Пока обе части — простые сравнения, это незаметно. Видно становится в двух случаях.</p>
<p><strong>Вызов функции.</strong> Если правая часть что-то печатает или меняет, при коротком замыкании этого просто не произойдёт.</p>
<p><strong>Страховка от падения.</strong> Порядок частей превращается в рабочий инструмент:</p>
<pre><code>if i &lt; len(s) &amp;&amp; s[i] == 'x' { }   <span class="cm">// безопасно</span>
if s[i] == 'x' &amp;&amp; i &lt; len(s) { }   <span class="cm">// упадёт на выходе за границу</span></code></pre>
<p>Обе строки собираются, обе выглядят разумно. Первая работает всегда, вторая падает, как только <code>i</code> выйдет за длину строки. Проверку границы ставят слева.</p>`,
    en:`<p>Go evaluates a condition left to right and stops the moment the answer is settled.</p>
<ul><li><code>false &amp;&amp; ...</code> → the right side is not evaluated, the answer is <code>false</code>;</li>
<li><code>true || ...</code> → the right side is not evaluated, the answer is <code>true</code>.</li></ul>
<p>While both parts are plain comparisons you never notice. It shows in two situations.</p>
<p><strong>A function call.</strong> If the right side prints or changes something, short-circuiting means it simply never happens.</p>
<p><strong>Crash protection.</strong> The order of the parts becomes a working tool:</p>
<pre><code>if i &lt; len(s) &amp;&amp; s[i] == 'x' { }   <span class="cm">// safe</span>
if s[i] == 'x' &amp;&amp; i &lt; len(s) { }   <span class="cm">// crashes on index out of range</span></code></pre>
<p>Both lines compile, both look sensible. The first always works; the second crashes as soon as <code>i</code> passes the length of the string. The bounds check goes on the left.</p>`}},

{q:{ru:"Почему <code>0 &lt;= n &lt;= 9</code> не работает и как писать диапазон?", en:"Why doesn't <code>0 &lt;= n &lt;= 9</code> work, and how do I write a range?"},
 a:{ru:`<p>В Go нет двойного сравнения. Запись читается слева направо: сначала <code>0 &lt;= n</code>, это даёт <code>bool</code>, и дальше язык пытается сравнить <code>bool</code> с числом 9. Ошибка: «mismatched types untyped bool and untyped int».</p>
<p>Правильно — два полных сравнения через <code>&amp;&amp;</code>:</p>
<pre><code>n &gt;= 0 &amp;&amp; n &lt;= 9</code></pre>
<p>Обрати внимание на форму записи: имя переменной с обеих сторон, знаки смотрят друг на друга. Если развернуть их наружу, получится <code>n &lt;= 0 &amp;&amp; n &gt;= 9</code> — условие, истинное ни при каком числе. Собирается молча.</p>
<p>Проверять условие проще всего подстановкой трёх чисел: середина диапазона, что-то заведомо снаружи и ровно граница. Граница ловит путаницу <code>&lt;</code> и <code>&lt;=</code>.</p>`,
    en:`<p>Go has no chained comparison. The line is read left to right: first <code>0 &lt;= n</code>, which gives a <code>bool</code>, and then the language tries to compare that <code>bool</code> with the number 9. The error is “mismatched types untyped bool and untyped int”.</p>
<p>The correct form is two complete comparisons joined by <code>&amp;&amp;</code>:</p>
<pre><code>n &gt;= 0 &amp;&amp; n &lt;= 9</code></pre>
<p>Look at the shape: the variable name on both sides, the signs facing each other. Turn them outward and you get <code>n &lt;= 0 &amp;&amp; n &gt;= 9</code> — a condition no number satisfies. It compiles silently.</p>
<p>The easiest way to check a condition is to plug in three numbers: one from the middle, one clearly outside, and the boundary itself. The boundary catches the <code>&lt;</code> vs <code>&lt;=</code> mix-up.</p>`}},

{q:{ru:"Где <code>!</code> обязательно требует скобок?", en:"Where does <code>!</code> absolutely need parentheses?"},
 a:{ru:`<p><code>!</code> относится только к тому, что стоит сразу за ним. Дальше по строке он не распространяется.</p>
<pre><code>!ok                  <span class="cm">// перевернули одну переменную</span>
!(a &amp;&amp; b)            <span class="cm">// перевернули всё условие</span>
!a &amp;&amp; b              <span class="cm">// это (!a) &amp;&amp; b — совсем другое</span>
!n &gt; 5               <span class="cm">// не соберётся: ! к числу неприменим</span></code></pre>
<p>Последняя строка ловит новичка чаще всего: хочется написать «не больше пяти», а надо <code>!(n &gt; 5)</code> или проще — <code>n &lt;= 5</code>.</p>
<p>Часто <code>!</code> вообще не нужен. Два правила замены:</p>
<pre><code>!(a &amp;&amp; b)   →   !a || !b
!(a || b)   →   !a &amp;&amp; !b</code></pre>
<p>Отсюда и «вне диапазона»: <code>!(n &gt;= 0 &amp;&amp; n &lt;= 9)</code> превращается в <code>n &lt; 0 || n &gt; 9</code>. Знаки при этом разворачиваются, и границы переходят на другую сторону — здесь и теряют равенство.</p>`,
    en:`<p><code>!</code> applies only to what stands right after it. It does not reach further along the line.</p>
<pre><code>!ok                  <span class="cm">// flips one variable</span>
!(a &amp;&amp; b)            <span class="cm">// flips the whole condition</span>
!a &amp;&amp; b              <span class="cm">// this is (!a) &amp;&amp; b — something else</span>
!n &gt; 5               <span class="cm">// won't compile: ! doesn't apply to a number</span></code></pre>
<p>The last line catches beginners most often: you want to say “not greater than five”, but you need <code>!(n &gt; 5)</code> or, better, <code>n &lt;= 5</code>.</p>
<p>Often <code>!</code> is not needed at all. Two rewriting rules:</p>
<pre><code>!(a &amp;&amp; b)   →   !a || !b
!(a || b)   →   !a &amp;&amp; !b</code></pre>
<p>Hence “outside the range”: <code>!(n &gt;= 0 &amp;&amp; n &lt;= 9)</code> becomes <code>n &lt; 0 || n &gt; 9</code>. The signs flip and the boundaries move to the other side — that is exactly where the equal part gets lost.</p>`}},

{q:{ru:"Почему <code>c &gt;= '0'</code>, а не <code>c &gt;= 0</code>?", en:"Why <code>c &gt;= '0'</code> and not <code>c &gt;= 0</code>?"},
 a:{ru:`<p>Потому что руна — это число, и Go пропустит оба варианта. Смысл у них разный.</p>
<p><code>'0'</code> — это код символа «ноль», то есть 48. <code>0</code> — это ноль. Символа с кодом 0 в обычном тексте не встретить, поэтому <code>c &gt;= 0 &amp;&amp; c &lt;= 9</code> ложно всегда — и ошибку выдаёт не компилятор, а пустой вывод.</p>
<pre><code>c &gt;= '0' &amp;&amp; c &lt;= '9'   <span class="cm">// цифра</span>
c &gt;= 'a' &amp;&amp; c &lt;= 'z'   <span class="cm">// строчная буква</span>
c &gt;= 'A' &amp;&amp; c &lt;= 'Z'   <span class="cm">// заглавная</span></code></pre>
<p>Диапазоны работают, потому что коды внутри каждой группы идут подряд. Числа 48, 97 и 65 запоминать не надо — пиши символ в одинарных кавычках, Go подставит код сам, и код останется читаемым.</p>
<p>Оттуда же приём перевода символа в цифру: <code>c - '0'</code> даёт настоящее число.</p>`,
    en:`<p>Because a rune is a number, and Go accepts both forms. They mean different things.</p>
<p><code>'0'</code> is the code of the character “zero”, that is 48. <code>0</code> is zero. Normal text contains no character with code 0, so <code>c &gt;= 0 &amp;&amp; c &lt;= 9</code> is always false — and the thing reporting the bug is not the compiler but an empty output.</p>
<pre><code>c &gt;= '0' &amp;&amp; c &lt;= '9'   <span class="cm">// a digit</span>
c &gt;= 'a' &amp;&amp; c &lt;= 'z'   <span class="cm">// a lowercase letter</span>
c &gt;= 'A' &amp;&amp; c &lt;= 'Z'   <span class="cm">// an uppercase one</span></code></pre>
<p>The ranges work because codes inside each group are consecutive. You never need to memorise 48, 97 or 65 — write the character in single quotes, Go fills in the code, and the code stays readable.</p>
<p>The same idea gives the character-to-digit trick: <code>c - '0'</code> produces a real number.</p>`}},

{q:{ru:"Что можно сравнивать через <code>==</code>, а что нельзя?", en:"What can be compared with <code>==</code>, and what cannot?"},
 a:{ru:`<p>Можно: числа, руны, строки, <code>bool</code>. Строки сравниваются посимвольно, так что <code>s == "go"</code> работает как ожидается.</p>
<p>Нельзя: слайсы. <code>a == b</code> для двух <code>[]int</code> не соберётся — «slice can only be compared to nil». Сравнивать их приходится поэлементно.</p>
<p>Ещё одно ограничение — типы должны совпадать:</p>
<pre><code>var x int = 5
var y float64 = 5
x == y            <span class="cm">// не соберётся: mismatched types</span>
float64(x) == y   <span class="cm">// true</span></code></pre>
<p>Отдельно про дробные числа: <code>==</code> для них формально работает, но результаты вычислений сравнивать так не стоит — <code>0.1 + 0.2</code> не равно <code>0.3</code>. Причина в том, как дробные числа хранятся в памяти, а не в языке.</p>`,
    en:`<p>You can: numbers, runes, strings, <code>bool</code>. Strings compare character by character, so <code>s == "go"</code> behaves as expected.</p>
<p>You cannot: slices. <code>a == b</code> for two <code>[]int</code> won't compile — “slice can only be compared to nil”. They have to be compared element by element.</p>
<p>One more restriction — the types must match:</p>
<pre><code>var x int = 5
var y float64 = 5
x == y            <span class="cm">// won't compile: mismatched types</span>
float64(x) == y   <span class="cm">// true</span></code></pre>
<p>A note on floats: <code>==</code> is allowed, but don't use it on computed results — <code>0.1 + 0.2</code> is not equal to <code>0.3</code>. That comes from how floats are stored in memory, not from the language.</p>`}},

{q:{ru:"Как проверить своё условие, не запуская всю программу?", en:"How do I check my condition without running the whole program?"},
 a:{ru:`<p>Подставить числа руками. Компилятор проверяет типы, а не смысл: развёрнутый диапазон, перепутанные <code>&lt;</code> и <code>&lt;=</code>, лишнее <code>!</code> — всё это по типам безупречно.</p>
<p>Три подстановки закрывают почти все ошибки:</p>
<ul><li>заведомо подходящее значение — условие должно дать <code>true</code>;</li>
<li>заведомо неподходящее — должно дать <code>false</code>;</li>
<li>ровно граница — ловит путаницу <code>&lt;</code> и <code>&lt;=</code>.</li></ul>
<p>Для <code>n &gt;= 0 &amp;&amp; n &lt;= 9</code> это 5, 42 и 9. Для <code>n &lt;= 0 &amp;&amp; n &gt;= 9</code> первая же подстановка даёт <code>false</code> там, где ждали <code>true</code> — ошибка найдена за секунды.</p>
<p>Второй приём: распечатать части условия по отдельности.</p>
<pre><code>fmt.Println(n &gt;= 0, n &lt;= 9)   <span class="cm">// видно, какая половина врёт</span></code></pre>`,
    en:`<p>Plug numbers in by hand. The compiler checks types, not meaning: a reversed range, <code>&lt;</code> confused with <code>&lt;=</code>, a stray <code>!</code> — all of it is flawless type-wise.</p>
<p>Three substitutions catch almost everything:</p>
<ul><li>a value that clearly fits — the condition must give <code>true</code>;</li>
<li>one that clearly doesn't — must give <code>false</code>;</li>
<li>the boundary itself — catches the <code>&lt;</code> vs <code>&lt;=</code> mix-up.</li></ul>
<p>For <code>n &gt;= 0 &amp;&amp; n &lt;= 9</code> that is 5, 42 and 9. For <code>n &lt;= 0 &amp;&amp; n &gt;= 9</code> the very first substitution gives <code>false</code> where you expected <code>true</code> — found in seconds.</p>
<p>The second technique: print the parts of the condition separately.</p>
<pre><code>fmt.Println(n &gt;= 0, n &lt;= 9)   <span class="cm">// shows which half is lying</span></code></pre>`}}
];

/* ================= ТРЕНАЖЁР ================= */
var SCENARIOS = [
{
 name:{ru:"Три ветки", en:"Three branches"},
 params:[{key:"n", label:{ru:"n", en:"n"}, min:-5, max:5, def:0}],
 code: function(p){
   return ["n := " + p.n,
           "if n > 0 {",
           "\tfmt.Println(\"positive\")",
           "} else if n == 0 {",
           "\tfmt.Println(\"zero\")",
           "} else {",
           "\tfmt.Println(\"negative\")",
           "}",
           "fmt.Println(\"done\")"];
 },
 steps: function(p){
   var n = p.n, st = [], out = "";
   var v = [["n", String(n), "int"]];
   var first = n > 0, second = (n === 0);

   st.push({line:0, vars:v, out:out,
     note:{ru:"Создали число " + n + ". Дальше цепочка решит, какую из трёх строк напечатать.",
           en:"The number " + n + " is created. The chain below decides which of the three lines gets printed."}});

   st.push({line:1, vars:v.concat([["n > 0", first ? "true" : "false", "bool"]]), out:out,
     note:{ru:"Первая проверка: " + n + " больше нуля? " +
              (first ? "Да — работает эта ветка, ветки ниже Go даже не посмотрит."
                     : "Нет. Тело ветки пропускается целиком, строка 3 не выполняется.") +
              (n === 0 ? " Ноль не больше нуля: знак <code>&gt;</code> границу внутрь не пускает." : ""),
           en:"First check: is " + n + " greater than zero? " +
              (first ? "Yes — this branch runs and Go never looks at the ones below."
                     : "No. The branch body is skipped entirely, line 3 never runs.") +
              (n === 0 ? " Zero is not greater than zero: the <code>&gt;</code> sign keeps the boundary out." : "")}});

   if(first){
     out += "positive\n";
     st.push({line:2, vars:v, out:out,
       note:{ru:"Ветка сработала, напечатано <code>positive</code>.",
             en:"The branch fired, <code>positive</code> is printed."}});
   } else {
     st.push({line:3, vars:v.concat([["n == 0", second ? "true" : "false", "bool"]]), out:out,
       note:{ru:"Вторая проверка: " + n + " равен нулю? " + (second ? "Да." : "Нет.") +
                " Обрати внимание на <code>==</code> — один знак здесь означал бы присваивание, и Go не собрал бы программу.",
             en:"Second check: is " + n + " equal to zero? " + (second ? "Yes." : "No.") +
                " Note the <code>==</code> — a single sign here would mean assignment and Go would refuse to build."}});
     if(second){
       out += "zero\n";
       st.push({line:4, vars:v, out:out,
         note:{ru:"Ветка сработала, строка напечатана.",
               en:"The branch fired and the line is printed."}});
     } else {
       st.push({line:5, vars:v, out:out,
         note:{ru:"Ни одна проверка не подошла — остаётся <code>else</code>. Условия у него нет: это «во всех остальных случаях».",
               en:"Nothing above matched, so <code>else</code> is what is left. It has no condition — it means “in every other case”."}});
       out += "negative\n";
       st.push({line:6, vars:v, out:out,
         note:{ru:"Напечатано <code>negative</code>.",
               en:"<code>negative</code> is printed."}});
     }
   }

   out += "done\n";
   st.push({line:8, vars:v, out:out,
     note:{ru:"Сработала ровно одна ветка из трёх" +
              (first ? " — верхняя" : second ? " — средняя" : " — <code>else</code>") +
              ", остальные пропущены. Управление идёт сразу за закрывающую скобку, поэтому <code>done</code> печатается при любом n.",
           en:"Exactly one of the three branches ran" +
              (first ? " — the top one" : second ? " — the middle one" : " — the <code>else</code>") +
              ", the rest were skipped. Control goes straight past the closing brace, so <code>done</code> prints for any n."}});
   return st;
 }
},
{
 name:{ru:"Диапазон через &&", en:"A range with &&"},
 params:[{key:"n", label:{ru:"n", en:"n"}, min:-5, max:42, def:42}],
 code: function(p){
   return ["n := " + p.n,
           "a := n >= 0",
           "b := n <= 9",
           "fmt.Println(a, b, a && b)",
           "fmt.Println(n >= 0 && n <= 9)"];
 },
 steps: function(p){
   var n = p.n, a = (n >= 0), b = (n <= 9), both = a && b;
   var s = function(x){ return x ? "true" : "false"; };
   var v0 = [["n", String(n), "int"]];
   var v1 = v0.concat([["a", s(a), "bool"]]);
   var v2 = v1.concat([["b", s(b), "bool"]]);
   var st = [], out = "";

   st.push({line:0, vars:v0, out:out,
     note:{ru:"Число " + n + ". Диапазон в условии — от 0 до 9 включительно; посмотрим, из чего складывается ответ.",
           en:"The number " + n + ". The range in the condition is 0 to 9 inclusive; let's see what the answer is made of."}});

   st.push({line:1, vars:v1, out:out,
     note:{ru:"Первая половина условия: " + n + " >= 0 — <code>" + s(a) + "</code>. " +
              (n === 0 ? "Это ровно нижняя граница, и <code>&gt;=</code> пускает её внутрь."
                       : "Результат сравнения лёг в переменную как обычное значение."),
           en:"The first half of the condition: " + n + " >= 0 — <code>" + s(a) + "</code>. " +
              (n === 0 ? "That is the lower bound itself, and <code>&gt;=</code> lets it in."
                       : "The result of the comparison went into a variable like any ordinary value.")}});

   st.push({line:2, vars:v2, out:out,
     note:{ru:"Вторая половина: " + n + " <= 9 — <code>" + s(b) + "</code>." +
              (n === 9 ? " Ровно верхняя граница: <code>&lt;=</code> пускает её внутрь, а <code>&lt;</code> уже нет." :
               n === 10 ? " На единицу выше границы — и половина стала ложной." : ""),
           en:"The second half: " + n + " <= 9 — <code>" + s(b) + "</code>." +
              (n === 9 ? " The upper bound itself: <code>&lt;=</code> lets it in, <code>&lt;</code> would not." :
               n === 10 ? " One above the bound — and this half turned false." : "")}});

   out += s(a) + " " + s(b) + " " + s(both) + "\n";
   st.push({line:3, vars:v2, out:out,
     note:{ru:"<code>&amp;&amp;</code> даёт <code>true</code>, только когда истинны обе части. " +
              (both ? "Здесь истинны обе — число внутри диапазона."
                    : !a ? "Нижнюю границу число не прошло, и этого уже хватило."
                         : "Верхнюю границу число не прошло — одной ложной части достаточно."),
           en:"<code>&amp;&amp;</code> gives <code>true</code> only when both parts are true. " +
              (both ? "Here both are true — the number is inside the range."
                    : !a ? "The number failed the lower bound, and that alone settled it."
                         : "The number failed the upper bound — one false part is enough.")}});

   out += s(both) + "\n";
   st.push({line:4, vars:v2, out:out,
     note:{ru:"Та же проверка одной строкой, ответ тот же. Переменные <code>a</code> и <code>b</code> были нужны только чтобы увидеть половинки — обычно пишут сразу так.",
           en:"The same check in one line, the same answer. <code>a</code> and <code>b</code> existed only to expose the halves — normally you write it directly."}});
   return st;
 }
},
{
 name:{ru:"Короткое замыкание", en:"Short-circuit"},
 params:[
   {key:"orA",  label:{ru:"A в ||", en:"A in ||"}, values:["true","false"], def:"true"},
   {key:"andA", label:{ru:"A в &&", en:"A in &&"}, values:["true","false"], def:"false"}
 ],
 code: function(p){
   return ["func check(name string, r bool) bool {",
           "\tfmt.Println(\"check\", name)",
           "\treturn r",
           "}",
           "",
           "fmt.Println(check(\"A\", " + p.orA + ") || check(\"B\", true))",
           "fmt.Println(check(\"A\", " + p.andA + ") && check(\"B\", false))"];
 },
 steps: function(p){
   var orA = (String(p.orA) === "true"), andA = (String(p.andA) === "true");
   var s = function(x){ return x ? "true" : "false"; };
   var st = [], out = "";

   st.push({line:5, vars:[], out:out,
     note:{ru:"Функция <code>check</code> печатает своё имя при каждом вызове — так видно, кого на самом деле вызвали. Условие вычисляется слева направо.",
           en:"The <code>check</code> function prints its name on every call — that is how you see who actually ran. A condition is evaluated left to right."}});

   out += "check A\n";
   st.push({line:1, vars:[["name","\"A\"","string"],["r", s(orA), "bool"]], out:out,
     note:{ru:"Левая часть <code>||</code> вызвана: напечатала строку и сейчас вернёт <code>" + s(orA) + "</code>.",
           en:"The left side of <code>||</code> was called: it printed its line and is about to return <code>" + s(orA) + "</code>."}});

   if(orA){
     out += "true\n";
     st.push({line:5, vars:[["left","true","bool"]], out:out,
       note:{ru:"Ответ уже известен: у <code>||</code> хватает одной истинной части. Правый вызов <b>не сделан</b> — «check B» на экране нет.",
             en:"The answer is already settled: one true part is enough for <code>||</code>. The right call <b>never happened</b> — there is no “check B” on screen."}});
   } else {
     out += "check B\n";
     st.push({line:1, vars:[["name","\"B\"","string"],["r","true","bool"]], out:out,
       note:{ru:"Левая часть дала <code>false</code> — ответ ещё не решён, и правую пришлось вызвать. «check B» появилось на экране.",
             en:"The left side gave <code>false</code> — the answer is not settled yet, so the right one had to be called. “check B” shows up on screen."}});
     out += "true\n";
     st.push({line:5, vars:[["left","false","bool"],["right","true","bool"]], out:out,
       note:{ru:"<code>false || true</code> — <code>true</code>. Правую часть пропускают не всегда, а только когда левой уже хватило.",
             en:"<code>false || true</code> is <code>true</code>. The right side is not always skipped — only when the left one already settled the answer."}});
   }

   out += "check A\n";
   st.push({line:1, vars:[["name","\"A\"","string"],["r", s(andA), "bool"]], out:out,
     note:{ru:"Вторая строка, теперь <code>&amp;&amp;</code>. Снова начинаем с левой части — она печатает и вернёт <code>" + s(andA) + "</code>.",
           en:"Second line, now with <code>&amp;&amp;</code>. Again we start on the left — it prints and will return <code>" + s(andA) + "</code>."}});

   if(!andA){
     out += "false\n";
     st.push({line:6, vars:[["left","false","bool"]], out:out,
       note:{ru:"<code>&amp;&amp;</code> останавливается так же: раз левая часть ложна, весь ответ ложен, правую вызывать незачем. Именно поэтому <code>i &lt; len(s) &amp;&amp; s[i] == 'x'</code> не падает.",
             en:"<code>&amp;&amp;</code> stops the same way: with a false left side the whole answer is false, so there is no point calling the right one. This is exactly why <code>i &lt; len(s) &amp;&amp; s[i] == 'x'</code> never crashes."}});
   } else {
     out += "check B\n";
     st.push({line:1, vars:[["name","\"B\"","string"],["r","false","bool"]], out:out,
       note:{ru:"Левая часть истинна — одной этого мало, и <code>&amp;&amp;</code> вызывает правую. Проверка слева прикрывает правую часть только тогда, когда сама даёт <code>false</code>.",
             en:"The left side is true — that alone is not enough, so <code>&amp;&amp;</code> calls the right one. A check on the left shields the right side only when it gives <code>false</code> itself."}});
     out += "false\n";
     st.push({line:6, vars:[["left","true","bool"],["right","false","bool"]], out:out,
       note:{ru:"<code>true &amp;&amp; false</code> — <code>false</code>. Ответ решила правая часть, поэтому её и пришлось вычислить.",
             en:"<code>true &amp;&amp; false</code> is <code>false</code>. The right side decided the answer, which is why it had to be evaluated."}});
   }
   return st;
 }
},
{
 name:{ru:"! и скобки", en:"! and parentheses"},
 params:[{key:"n", label:{ru:"n", en:"n"}, min:-5, max:42, def:42}],
 code: function(p){
   return ["n := " + p.n,
           "inRange := n >= 0 && n <= 9",
           "fmt.Println(inRange)",
           "fmt.Println(!inRange)",
           "fmt.Println(!(n >= 0 && n <= 9))",
           "fmt.Println(!(n >= 0) && n <= 9)"];
 },
 steps: function(p){
   var n = p.n;
   var inR = (n >= 0 && n <= 9);
   var third = !inR;
   var fourth = (!(n >= 0)) && (n <= 9);
   var s = function(x){ return x ? "true" : "false"; };
   var v0 = [["n", String(n), "int"]];
   var v1 = v0.concat([["inRange", s(inR), "bool"]]);
   var st = [], out = "";

   st.push({line:0, vars:v0, out:out,
     note:{ru:"Одно число — " + n + " — и четыре записи с <code>!</code>. Сравним, что они дают.",
           en:"One number — " + n + " — and four ways of writing <code>!</code>. Let's compare what they produce."}});

   st.push({line:1, vars:v1, out:out,
     note:{ru:n + (inR ? " в диапазоне 0..9, значит <code>true</code>." : " не в диапазоне 0..9, значит <code>false</code>.") +
              " Условие целиком лежит в переменной.",
           en:n + (inR ? " is inside the range 0..9, so <code>true</code>." : " is not inside the range 0..9, so <code>false</code>.") +
              " The whole condition now sits in a variable."}});

   out += s(inR) + "\n";
   st.push({line:2, vars:v1, out:out,
     note:{ru:"Печатаем как есть.", en:"Printed as is."}});

   out += s(!inR) + "\n";
   st.push({line:3, vars:v1, out:out,
     note:{ru:"<code>!</code> перед одной переменной — здесь скобки не нужны, переворачивать нечего кроме неё.",
           en:"<code>!</code> in front of a single variable — no parentheses needed here, there is nothing else to flip."}});

   out += s(third) + "\n";
   st.push({line:4, vars:v1, out:out,
     note:{ru:"То же самое, но условие записано на месте. Скобки обязательны: они говорят, что <code>!</code> относится ко всему выражению.",
           en:"The same thing with the condition written inline. The parentheses are required: they say <code>!</code> applies to the whole expression."}});

   out += s(fourth) + "\n";
   st.push({line:5, vars:v1, out:out,
     note:{ru:"Скобки сдвинули на одно сравнение: <code>!(" + n + " &gt;= 0)</code> — <code>" + s(!(n >= 0)) +
              "</code>, дальше <code>" + s(!(n >= 0)) + " &amp;&amp; " + s(n <= 9) + "</code> — <code>" + s(fourth) + "</code>. " +
              (third !== fourth
                ? "Ответ разошёлся со строкой выше. <b>Строка собирается и молча значит не то.</b>"
                : "Здесь ответ случайно совпал со строкой выше — поставь n больше 9, и они разойдутся."),
           en:"The parentheses moved to cover one comparison: <code>!(" + n + " &gt;= 0)</code> is <code>" + s(!(n >= 0)) +
              "</code>, then <code>" + s(!(n >= 0)) + " &amp;&amp; " + s(n <= 9) + "</code> gives <code>" + s(fourth) + "</code>. " +
              (third !== fourth
                ? "The answer differs from the line above. <b>The line compiles and quietly means something else.</b>"
                : "Here the answer happens to match the line above — set n above 9 and the two come apart.")}});
   return st;
 }
},
{
 name:{ru:"Развёрнутый диапазон", en:"A reversed range"},
 params:[{key:"n", label:{ru:"n", en:"n"}, min:-10, max:12, def:5}],
 code: function(p){
   return ["n := " + p.n,
           "fmt.Println(n <= 0, n >= 9)",
           "fmt.Println(n <= 0 && n >= 9)",
           "n = -100",
           "fmt.Println(n <= 0 && n >= 9)",
           "n = 100",
           "fmt.Println(n <= 0 && n >= 9)",
           "// n >= 0 && n <= 9"];
 },
 steps: function(p){
   var n = p.n, lo = (n <= 0), hi = (n >= 9);
   var s = function(x){ return x ? "true" : "false"; };
   var st = [], out = "";
   var v = function(x){ return [["n", String(x), "int"]]; };

   st.push({line:0, vars:v(n), out:out,
     note:{ru:"Условие <code>n &lt;= 0 &amp;&amp; n &gt;= 9</code> выглядит как диапазон, но знаки смотрят наружу. Начнём с числа " + n + ".",
           en:"The condition <code>n &lt;= 0 &amp;&amp; n &gt;= 9</code> looks like a range, but the signs point outward. Let's start with " + n + "."}});

   out += s(lo) + " " + s(hi) + "\n";
   st.push({line:1, vars:v(n).concat([["n <= 0", s(lo), "bool"],["n >= 9", s(hi), "bool"]]), out:out,
     note:{ru:"Половины по отдельности: " +
              (lo && !hi ? "левая истинна, правая нет."
               : !lo && hi ? "правая истинна, левая нет."
               : "обе ложны — " + n + " не меньше нуля и не больше девяти.") +
              " Печатать части по отдельности — быстрый способ понять, какая врёт.",
           en:"The halves on their own: " +
              (lo && !hi ? "the left one is true, the right one is not."
               : !lo && hi ? "the right one is true, the left one is not."
               : "both are false — " + n + " is neither below zero nor above nine.") +
              " Printing the parts separately is the fastest way to see which one lies."}});

   out += "false\n";
   st.push({line:2, vars:v(n), out:out,
     note:{ru:"Вместе — <code>false</code>. " +
              (lo || hi ? "Одна половина истинна, но <code>&amp;&amp;</code> требует обе."
                        : "Пока похоже на «число не в диапазоне» — и здесь легко успокоиться и пойти дальше."),
           en:"Together — <code>false</code>. " +
              (lo || hi ? "One half is true, but <code>&amp;&amp;</code> demands both."
                        : "So far it looks like “the number is outside the range” — and this is where it is easy to relax and move on.")}});

   st.push({line:3, vars:v(-100), out:out,
     note:{ru:"Берём число заведомо меньше нуля.", en:"Take a number clearly below zero."}});

   out += "false\n";
   st.push({line:4, vars:v(-100), out:out,
     note:{ru:"Снова <code>false</code>: левая часть истинна, но −100 не больше девяти.",
           en:"<code>false</code> again: the left part is true, but −100 is not above nine."}});

   st.push({line:5, vars:v(100), out:out,
     note:{ru:"Теперь заведомо больше девяти.", en:"Now something clearly above nine."}});

   out += "false\n";
   st.push({line:6, vars:v(100), out:out,
     note:{ru:"И опять <code>false</code>. Покрути n сверху: одно число не может быть одновременно и меньше нуля, и больше девяти — условие ложно всегда.",
           en:"<code>false</code> once more. Drag n at the top: a single number cannot be below zero and above nine at the same time — the condition is always false."}});

   st.push({line:7, vars:v(100), out:out,
     note:{ru:"Верная запись диапазона — в последней строке: знаки смотрят друг на друга. Компилятор разницы между этими двумя условиями не видит, поэтому проверять приходится подстановкой.",
           en:"The correct form of a range is on the last line: the signs face each other. The compiler sees no difference between the two conditions, so plugging in numbers is the only check."}});
   return st;
 }
}
];

/* ================= ЧТО ИЗ ЭТОГО СКЛАДЫВАЕТСЯ ================= */
var OUTRO = {
 ru:`<p>Все семь правил — про одно значение. Сравнение его производит, <code>&amp;&amp;</code>, <code>||</code> и <code>!</code> собирают из нескольких таких значений одно, <code>if</code> его потребляет. Что бы ни стояло между <code>if</code> и скобкой — хоть одно сравнение, хоть пять, соединённых знаками, — к моменту проверки от всего этого остаётся единственный <code>true</code> или <code>false</code>. Ничего другого там оказаться не может.</p>
<p>Из этого складывается порядок работы. Решаешь, о чём вопрос, и записываешь его через <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code> — так, чтобы получился <code>bool</code>. Если вопросов несколько, соединяешь их через <code>&amp;&amp;</code> или <code>||</code>, повторяя имя переменной в каждой части, и ставишь скобки. Если правая часть может упасть — защиту ставишь слева. Если вариантов ответа больше двух — раскладываешь их по цепочке <code>if / else if / else</code>, от узкого условия к широкому.</p>
<p>Этого набора хватает, чтобы программа перестала быть одной прямой дорогой: печатать разное в зависимости от данных, разложить число по знаку, поймать диапазон, отличить цифру от буквы, отсечь плохое значение до падения.</p>
<p>И одна мысль, если забудется всё остальное: компилятор проверяет форму условия, а не смысл. <code>n &lt;= 0 &amp;&amp; n &gt;= 9</code>, <code>c &gt;= 0 &amp;&amp; c &lt;= 9</code>, перепутанный порядок веток — всё это соберётся и запустится, ничего не сказав. Правильность вопроса не проверит никто, кроме тебя. Подставь три числа руками — подходящее, неподходящее и ровно границу — и посмотри, что вышло.</p>`,
 en:`<p>All seven rules are about one value. A comparison produces it, <code>&amp;&amp;</code>, <code>||</code> and <code>!</code> fold several of them into one, and <code>if</code> consumes it. Whatever stands between <code>if</code> and the brace — one comparison or five joined by signs — by the time the check happens all that is left of it is a single <code>true</code> or <code>false</code>. Nothing else can end up there.</p>
<p>Out of that comes an order of work. Decide what the question is and write it with <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code> so that it comes out as a <code>bool</code>. If there are several questions, join them with <code>&amp;&amp;</code> or <code>||</code>, repeating the variable name in every part, and add parentheses. If the right side can crash, put the guard on the left. If there are more than two possible answers, lay them out in an <code>if / else if / else</code> chain, from the narrow condition to the broad one.</p>
<p>That set is enough to stop a program from being a single straight road: print different things depending on the data, sort a number by its sign, catch a range, tell a digit from a letter, reject a bad value before it crashes anything.</p>
<p>And one thought, if everything else fades: the compiler checks the form of a condition, not its meaning. <code>n &lt;= 0 &amp;&amp; n &gt;= 9</code>, <code>c &gt;= 0 &amp;&amp; c &lt;= 9</code>, branches in the wrong order — all of it compiles and runs without a word. Nobody but you will check that the question is right. Plug in three numbers by hand — one that fits, one that doesn't, and the boundary itself — and look at what comes out.</p>`
};
