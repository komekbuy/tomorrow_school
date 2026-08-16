var META = {
  n: 7,
  slug: "07-recursion",
  eyebrow:{ru:"Go с нуля · тема 7 из 13", en:"Go from zero · topic 7 of 13"},
  title:  {ru:"Рекурсия", en:"Recursion"},
  lede:{
    ru:"Функция, которая вызывает саму себя: пока не видно, где она останавливается и что происходит на обратном пути, такой код выглядит магией и пишется наугад.",
    en:"A function that calls itself: until you can see where it stops and what happens on the way back, this code looks like magic and gets written by guesswork."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=21197s",
    t:{ru:"Курс по Go — глава «Функции» (5:53:17)", en:"Go course — the “Functions” chapter (5:53:17)"},
    d:{ru:"Отдельной главы про рекурсию в курсе нет, но она целиком стоит на функциях — стоит пересмотреть их.", en:"The course has no chapter on recursion, but it rests entirely on functions — worth revisiting them."}},
  folder: "rec1",
  txt: {ru:"go-tema-07-rekursiya.txt", en:"go-topic-07-recursion.txt"}
};

var INTRO = {
 ru:`<p>Функция умеет вызывать другую функцию — это ты уже писал. Собственное имя ничем не выделено: внутри <code>sum</code> можно вызвать <code>sum</code>, и язык не будет против. Получается повторение, у которого, в отличие от цикла, каждый шаг живёт отдельно: у него свои переменные, и он не заканчивается, пока не закончится запущенный им следующий.</p>
<p>Смотри, зачем это нужно. Надо напечатать цифры числа по одной, слева направо. Достать цифру можно только с конца — <code>n % 10</code> даёт последнюю:</p>
<pre><code>n := 4821
for n &gt; 0 {
	fmt.Print(n%10, " ")
	n /= 10
}                     <span class="cm">// 1 2 8 4 — задом наперёд</span></code></pre>
<p>Цикл идёт от конца к началу, и по-другому он не умеет: чтобы развернуть цифры, придётся сначала сложить их все куда-то, а потом пройти обратно. Рекурсия решает это перестановкой одной строки:</p>
<pre><code>func show(n int) {
	if n == 0 {
		return
	}
	show(n / 10)          <span class="cm">// сначала — всё, что левее</span>
	fmt.Print(n%10, " ")  <span class="cm">// 4 8 2 1</span>
}</code></pre>
<p>Ничего не сохранялось: каждый вызов подождал, пока закончится запущенный им, и только потом напечатал свою цифру. Освоив тему, ты сможешь так же разворачивать порядок, спускаться в задачу, глубина которой заранее неизвестна, и собирать ответ по дороге назад — сумму, произведение, перевёрнутую строку.</p>
<p>Платить приходится памятью: пока вызов ждёт, он занимает место, и все ждущие вызовы живут одновременно. Поэтому разбор начинается не с применений, а с двух вещей, без которых код просто падает: где рекурсия останавливается и чем каждый следующий вызов ближе к этой остановке. Только после них имеет смысл говорить о том, что функция возвращает: появится одна форма, по которой пишутся почти все такие функции. Дальше — разница между работой до вызова себя и после него; это она развернула цифры выше. Потом — почему у каждого ждущего вызова сохранилось своё значение, и тем же ответом объясняется падение без остановки. Последнее правило про цену: что меняется, если в строке не один вызов себя, а два.</p>`,
 en:`<p>A function can call another function — you have written that already. Its own name is nothing special: inside <code>sum</code> you can call <code>sum</code>, and the language has no objection. What you get is repetition where, unlike a loop, every step lives on its own: it has its own variables, and it does not finish until the next one it started has finished.</p>
<p>Here is what that buys you. You need to print the digits of a number one by one, left to right. A digit can only be taken off the end — <code>n % 10</code> gives the last one:</p>
<pre><code>n := 4821
for n &gt; 0 {
	fmt.Print(n%10, " ")
	n /= 10
}                     <span class="cm">// 1 2 8 4 — backwards</span></code></pre>
<p>The loop runs from the end to the start and cannot do otherwise: to flip the digits you would have to collect them all somewhere first and then walk back. Recursion does it by moving one line:</p>
<pre><code>func show(n int) {
	if n == 0 {
		return
	}
	show(n / 10)          <span class="cm">// first everything to the left</span>
	fmt.Print(n%10, " ")  <span class="cm">// 4 8 2 1</span>
}</code></pre>
<p>Nothing was stored: each call waited for the one it had started, and only then printed its own digit. Once this topic is yours you can flip an order the same way, descend into a task whose depth isn't known in advance, and build the answer on the way back — a sum, a product, a reversed string.</p>
<p>The price is memory: a waiting call holds its place, and every waiting call is alive at once. So the walkthrough starts not with the nice uses but with the two things without which the code simply crashes: where the recursion stops, and how each next call gets closer to that stop. Only after those does it make sense to talk about what the function returns — one shape covers almost all of them. Then the difference between work placed before the self-call and after it; that is what flipped the digits above. Then why each waiting call kept its own value, an answer that also explains the crash when there is no stop. The last rule is about cost: what changes when a line holds two self-calls instead of one.</p>`
};

/* ================= ПРАВИЛА ================= */
var RULES = [
{
 h:{ru:"Рекурсия — это функция, которая вызывает саму себя",
    en:"Recursion is a function that calls itself"},
 b:{ru:`<p>Внутри функции можно вызвать любую функцию. Собственное имя — не исключение, и никакой специальной конструкции в языке для этого нет: ты просто пишешь имя, как написал бы <code>fmt.Println</code>.</p>
<pre><code>func down(n int) {
	if n == 0 {          <span class="cm">// остановка</span>
		return
	}
	fmt.Println(n)
	down(n - 1)          <span class="cm">// вызов себя, аргумент меньше</span>
}</code></pre>
<p>По шагам это выглядит так. <code>down(3)</code> доходит до последней строки и на ней останавливается — не заканчивается, а ждёт. Запускается <code>down(2)</code>, с ним происходит то же самое, потом <code>down(1)</code>, потом <code>down(0)</code>. Пока вызовы уходят вглубь, ни один из начатых не закончен.</p>
<p>Отсюда видно, чего такой код требует обязательно: <strong>где он остановится</strong> и <strong>чем следующий вызов отличается от текущего</strong>. В примере это две вещи — <code>if n == 0 { return }</code> и <code>- 1</code> в аргументе. Убери любую из них, и функция останется правильной с точки зрения компилятора: он соберёт её молча. Программа упадёт при запуске, через долю секунды после старта. Дальше вся тема — разбор этих двух частей и того, что происходит между ними.</p>`,
    en:`<p>Inside a function you can call any function. Its own name is no exception, and the language has no special construct for it: you just write the name, the way you would write <code>fmt.Println</code>.</p>
<pre><code>func down(n int) {
	if n == 0 {          <span class="cm">// the stop</span>
		return
	}
	fmt.Println(n)
	down(n - 1)          <span class="cm">// calls itself, smaller argument</span>
}</code></pre>
<p>Step by step it goes like this. <code>down(3)</code> reaches the last line and stops there — it does not finish, it waits. <code>down(2)</code> starts, the same thing happens to it, then <code>down(1)</code>, then <code>down(0)</code>. While the calls go deeper, not one of them has finished.</p>
<p>That already shows what such code always needs: <strong>where it stops</strong> and <strong>how the next call differs from the current one</strong>. In the example those are two things — <code>if n == 0 { return }</code> and the <code>- 1</code> in the argument. Remove either one and the function stays correct as far as the compiler is concerned: it builds without a word. The program crashes when you run it, a fraction of a second in. The rest of this topic is those two parts and what happens between them.</p>`}
},
{
 h:{ru:"Остановка стоит первой строкой, и её значение — часть ответа",
    en:"The stop comes first, and its value is part of the answer"},
 b:{ru:`<p>Раз каждый вызов запускает следующий, кто-то должен первым перестать это делать. Занимается этим обычный <code>if</code> в самом начале функции — до вызова себя.</p>
<pre><code>func sum(n int) int {
	if n == 0 {
		return 0     <span class="cm">// дно: глубже не идём</span>
	}
	return n + sum(n-1)
}</code></pre>
<p>Проверяет его каждый вызов, а не только последний. Вызови <code>sum(0)</code> напрямую — функция вернёт 0 и не вызовет себя ни разу, никакой рекурсии не случится вообще.</p>
<p>Поставишь проверку под вызовом себя — очередь до неё не дойдёт: строка с вызовом выполнится раньше и уведёт управление на новый круг, где всё повторится с начала.</p>
<p>Вторая половина правила — про то, <em>что</em> остановка возвращает. Это не заглушка ради компилятора, а первое значение ответа: у суммы 0, у произведения 1, у строки — пустая строка. Напишешь в факториале <code>return 0</code>, и <code>fact(5)</code> даст 0: все умножения упрутся в этот ноль. Поэтому базу проверяют отдельно от остального кода — спроси себя, что функция обязана вернуть на самом маленьком входе, и сравни с тем, что написано.</p>`,
    en:`<p>Since every call starts the next one, something has to be the first to stop doing that. An ordinary <code>if</code> at the very top of the function does the job — before the self-call.</p>
<pre><code>func sum(n int) int {
	if n == 0 {
		return 0     <span class="cm">// the bottom: we go no deeper</span>
	}
	return n + sum(n-1)
}</code></pre>
<p>Every call tests it, not just the last one. Call <code>sum(0)</code> directly and the function returns 0 without ever calling itself; no recursion happens at all.</p>
<p>Put the check below the self-call and it never gets its turn: the call line runs first and takes control into a new round, where everything repeats from the top.</p>
<p>The other half of this rule is <em>what</em> the stop returns. It is not a placeholder to keep the compiler happy, it is the first value of the answer: 0 for a sum, 1 for a product, the empty string for a string. Write <code>return 0</code> in a factorial and <code>fact(5)</code> gives 0 — every multiplication runs into that zero. So check the base on its own: ask what the function must return for the smallest input, and compare that with what you wrote.</p>`}
},
{
 h:{ru:"Аргумент обязан приближаться к остановке",
    en:"The argument must move toward the stop"},
 b:{ru:`<p>Одной остановки мало — до неё надо ещё дойти. Поэтому вызов себя получает не тот аргумент, что пришёл, а изменённый: на шаг ближе к условию из прошлого правила.</p>
<pre><code>down(n - 1)      <span class="cm">// к нулю по единице</span>
digits(n / 10)   <span class="cm">// к нулю быстрее</span>
rev(s[1:])       <span class="cm">// строка короче на символ</span>
down(n)          <span class="cm">// ничего не меняется — падение</span></code></pre>
<p>Каким именно способом — не важно: вычитанием, делением, отрезанием символа. Важно другое: шаг должен менять ровно то, что проверяет остановка, и через конечное число шагов условие должно стать истинным. Если остановка смотрит на одно, а шаг двигает другое — она не сработает никогда, хотя обе части написаны.</p>
<p>Когда так выходит, программа не зависает, а падает почти сразу:</p>
<pre><code>runtime: goroutine stack exceeds 1000000000-byte limit
fatal error: stack overflow</code></pre>
<p>Почему это именно падение, а не бесконечное кручение, станет понятно чуть дальше — когда дойдём до того, что происходит с параметрами каждого вызова.</p>
<p>Отдельная ловушка — остановка, мимо которой можно проскочить. База <code>if n == 0</code>, шаг <code>n - 2</code>, старт с пятёрки: 5, 3, 1, −1, −3 — равенство не выполнится ни разу, хотя и остановка на месте, и аргумент честно уменьшается. Поэтому базу пишут с запасом: <code>if n &lt;= 0</code>. И поэтому при <code>stack overflow</code> первым делом смотрят на аргумент вызова себя: меняется ли он и в ту ли сторону.</p>`,
    en:`<p>A stop on its own is not enough — you have to reach it. So the self-call gets not the argument that came in but a changed one: a step closer to the condition from the previous rule.</p>
<pre><code>down(n - 1)      <span class="cm">// one step toward zero</span>
digits(n / 10)   <span class="cm">// toward zero faster</span>
rev(s[1:])       <span class="cm">// string is one character shorter</span>
down(n)          <span class="cm">// nothing changes — crash</span></code></pre>
<p>How exactly does not matter: subtraction, division, dropping a character. What matters is that the step changes precisely what the stop looks at, and that after a finite number of steps the condition becomes true. If the stop watches one thing while the step moves another, it never fires — even though both parts are written.</p>
<p>When that happens the program does not hang, it crashes almost immediately:</p>
<pre><code>runtime: goroutine stack exceeds 1000000000-byte limit
fatal error: stack overflow</code></pre>
<p>Why this is a crash rather than endless spinning becomes clear a little later, once we get to what happens to each call's parameters.</p>
<p>A stop you can shoot straight past is a trap of its own. Base <code>if n == 0</code>, step <code>n - 2</code>, starting at five: 5, 3, 1, −1, −3 — the equality never holds, even though the stop is there and the argument does shrink honestly. That is why the base is written with room to spare: <code>if n &lt;= 0</code>. And why on a <code>stack overflow</code> the first thing you check is the self-call's argument: whether it changes, and in which direction.</p>`}
},
{
 h:{ru:"Форма: кусок текущего шага плюс вызов себя на остатке",
    en:"The shape: a piece of this step plus a call on the rest"},
 b:{ru:`<p>Остановка и шаг отвечают за то, что рекурсия закончится. За то, что она посчитает, отвечает форма — и почти у всех таких функций она одна.</p>
<pre><code>return &lt;что-то от текущего шага&gt; + &lt;вызов себя на остатке&gt;</code></pre>
<p>Писать её надо так, будто вложенный вызов уже работает правильно. <code>sum(n-1)</code> возвращает сумму от 1 до <code>n-1</code> — прими это как данность и не разворачивай в голове всю глубину. Твоё дело на этом шаге одно: добавить к готовому ответу то, что относится к текущему <code>n</code>.</p>
<pre><code>return n + sum(n-1)          <span class="cm">// сумма от 1 до n</span>
return n * fact(n-1)         <span class="cm">// факториал</span>
return n%10 + digits(n/10)   <span class="cm">// сумма цифр</span>
return rev(s[1:]) + s[:1]    <span class="cm">// переворот строки</span></code></pre>
<p>Слева — то, что берётся на этом шаге. Справа — та же задача, но короче. Проверять такую функцию тоже можно без разворачивания: сходится база и сходится один шаг — сойдётся любая глубина, потому что шаг везде один и тот же.</p>
<p><code>return</code> перед вызовом обязателен. Без него строка <code>sum(n - 1)</code> отработает целиком, со всей вложенной глубиной, и результат будет выброшен — в Go так можно, компилятор не скажет ни слова. Функция вернёт что-то другое, проделав при этом всю работу.</p>`,
    en:`<p>The stop and the step decide that the recursion ends. What it computes is decided by the shape — and nearly all such functions share one.</p>
<pre><code>return &lt;something from this step&gt; + &lt;call on the rest&gt;</code></pre>
<p>Write it as if the nested call already worked correctly. <code>sum(n-1)</code> returns the sum from 1 to <code>n-1</code> — take that as given and do not unfold the whole depth in your head. Your job at this step is one thing: add to that finished answer whatever belongs to the current <code>n</code>.</p>
<pre><code>return n + sum(n-1)          <span class="cm">// sum from 1 to n</span>
return n * fact(n-1)         <span class="cm">// factorial</span>
return n%10 + digits(n/10)   <span class="cm">// sum of digits</span>
return rev(s[1:]) + s[:1]    <span class="cm">// reversed string</span></code></pre>
<p>On the left is what you take at this step. On the right is the same task, shorter. Checking such a function needs no unfolding either: if the base is right and one step is right, any depth is right, because the step is identical everywhere.</p>
<p>The <code>return</code> in front of the call is mandatory. Without it the line <code>sum(n - 1)</code> runs in full, all the nested depth included, and its result is thrown away — Go allows that and the compiler says nothing. The function returns something else while doing all the work anyway.</p>`}
},
{
 h:{ru:"Спуск и подъём: до вызова и после вызова",
    en:"Down and back: before the call and after it"},
 b:{ru:`<p>В прошлом правиле сложение стоит в одной строке с вызовом себя, а выполниться оно не может, пока вложенный вызов не вернул число. Это общее свойство: вызов себя не заканчивает текущую функцию, он ставит её на паузу ровно на этой строке.</p>
<p>Отсюда две зоны. Всё, что написано выше вызова, выполняется сразу — <strong>на спуске</strong>. Всё, что ниже, откладывается, пока не отработает вся глубина, и выполняется <strong>на подъёме</strong>.</p>
<pre><code>fmt.Println(n)   <span class="cm">// спуск</span>
down(n - 1)      <span class="cm">// на экране: 3 2 1</span></code></pre>
<pre><code>down(n - 1)
fmt.Println(n)   <span class="cm">// подъём, на экране: 1 2 3</span></code></pre>
<p>Код один и тот же, переставлены две строки — порядок вывода перевернулся. И перевернулся бесплатно: ты нигде не хранил числа, чтобы потом пройти их в обратную сторону. Подъём всегда идёт от самого глубокого вызова к самому первому, то есть строго против порядка спуска.</p>
<p>Отсюда рабочий приём: нужен обратный порядок — переноси работу под вызов себя. И отсюда же то, чем закончилось прошлое правило: вся арифметика в <code>return n + sum(n-1)</code> происходит на подъёме, потому что до возврата вложенного вызова складывать просто не с чем.</p>`,
    en:`<p>In the previous rule the addition shares a line with the self-call, and it cannot run until the nested call has returned a number. That is a general property: a self-call does not finish the current function, it pauses it on exactly that line.</p>
<p>Hence two zones. Everything written above the call runs immediately — <strong>on the way down</strong>. Everything below it is postponed until the whole depth is done, and runs <strong>on the way back</strong>.</p>
<pre><code>fmt.Println(n)   <span class="cm">// on the way down</span>
down(n - 1)      <span class="cm">// screen: 3 2 1</span></code></pre>
<pre><code>down(n - 1)
fmt.Println(n)   <span class="cm">// on the way back, screen: 1 2 3</span></code></pre>
<p>Same code, two lines swapped — and the output order flipped. It flipped for free: you stored no numbers anywhere in order to walk them backwards afterwards. The way back always runs from the deepest call to the very first one, that is, strictly against the order of the descent.</p>
<p>That gives you a working technique: need reverse order, move the work below the self-call. And it also explains where the previous rule ended up: all the arithmetic in <code>return n + sum(n-1)</code> happens on the way back, because until the nested call returns there is simply nothing to add to.</p>`}
},
{
 h:{ru:"У каждого вызова своя копия параметров",
    en:"Every call has its own copy of the parameters"},
 b:{ru:`<p>Подъём возможен только потому, что каждый ждущий вызов что-то помнит. Помнит он свои параметры: при каждом вызове они создаются заново, и вызов работает со своей копией, а не с общей на всех переменной.</p>
<p>Пока <code>down(3)</code> ждёт, внутри работает <code>down(2)</code>, а внутри него <code>down(1)</code>. Три переменные с именем <code>n</code> живут одновременно и друг другу не мешают.</p>
<pre><code>func f(n int) {
	if n == 0 {
		return
	}
	n = n - 1
	f(n)
	fmt.Print(n)   <span class="cm">// f(3) печатает 012</span>
}</code></pre>
<p><code>n = n - 1</code> правит только копию текущего вызова. Вызванная функция вообще не может изменить переменную того, кто её вызвал: она получила значение, а не саму переменную. Поэтому ждать, что <code>f(n)</code> внутри поменяет твоё <code>n</code>, бесполезно — на подъёме каждый вызов продолжит с тем значением, которое было у него перед уходом вглубь.</p>
<p>Здесь же ответ на вопрос, оставленный в правиле про аргумент: почему рекурсия без остановки падает, а не крутится вечно. Копии не исчезают, пока вызовы не закончились, и все незакрытые вызовы занимают память одновременно. Бесконечный цикл крутится в одной функции с одним набором переменных, не накапливает ничего и может висеть сколько угодно. Бесконечная рекурсия упирается в предел за доли секунды — это и есть <code>stack overflow</code>.</p>`,
    en:`<p>The way back is only possible because every waiting call remembers something. What it remembers is its parameters: they are created afresh on every call, and each call works on its own copy rather than on one shared variable.</p>
<p>While <code>down(3)</code> waits, <code>down(2)</code> runs inside it, and <code>down(1)</code> inside that. Three variables named <code>n</code> are alive at the same time and do not interfere with each other.</p>
<pre><code>func f(n int) {
	if n == 0 {
		return
	}
	n = n - 1
	f(n)
	fmt.Print(n)   <span class="cm">// f(3) prints 012</span>
}</code></pre>
<p><code>n = n - 1</code> edits only the current call's copy. A called function cannot change its caller's variable at all: it received a value, not the variable itself. So expecting the inner <code>f(n)</code> to change your <code>n</code> is pointless — on the way back each call resumes with the value it had before diving deeper.</p>
<p>This is also the answer left open in the rule about the argument: why recursion without a stop crashes instead of spinning forever. The copies do not disappear until the calls finish, and every unfinished call takes memory at the same time. An infinite loop spins inside one function with one set of variables, accumulates nothing and can hang as long as you like. Infinite recursion hits the limit in a fraction of a second — that is what <code>stack overflow</code> is.</p>`}
},
{
 h:{ru:"Два вызова себя в одной строке — работа растёт лавиной",
    en:"Two self-calls in one line make the work explode"},
 b:{ru:`<p>Во всех примерах до этого вызов себя был один. Поставь в строку два — ни одно правило не сломается: остановка на месте, аргументы к ней приближаются, форма прежняя. Изменится только цена.</p>
<pre><code>func fib(n int) int {
	if n &lt; 2 {
		return n
	}
	return fib(n-1) + fib(n-2)
}</code></pre>
<p>С одним вызовом в строке число вызовов равно глубине: <code>sum(100)</code> — около сотни вызовов, и всё. С двумя из каждого вызова растут два, из тех — ещё по два, и число вызовов почти удваивается на каждую единицу <code>n</code>.</p>
<pre><code>fib(10)  — 177 вызовов
fib(25)  — 242 785
fib(45)  — 3 672 623 805</code></pre>
<p>Причина — повторы. <code>fib(5)</code> считает <code>fib(3)</code> дважды, и каждый раз с нуля: результат нигде не запоминается, одна и та же ветка пересчитывается снова и снова.</p>
<p>Память тут ни при чём: глубина по-прежнему не больше <code>n</code>, до <code>stack overflow</code> дело не доходит. Кончается не память, а время — <code>fib(45)</code> считается секунды. И ответ при этом верный: код не сломан, он просто делает гору лишней работы.</p>`,
    en:`<p>In every example so far there was one self-call. Put two in a line and no rule breaks: the stop is in place, the arguments approach it, the shape is unchanged. Only the price changes.</p>
<pre><code>func fib(n int) int {
	if n &lt; 2 {
		return n
	}
	return fib(n-1) + fib(n-2)
}</code></pre>
<p>With one call per line the number of calls equals the depth: <code>sum(100)</code> is about a hundred calls, and that's it. With two, each call grows two more, and each of those grows two more, so the number of calls nearly doubles for every unit of <code>n</code>.</p>
<pre><code>fib(10)  — 177 calls
fib(25)  — 242,785
fib(45)  — 3,672,623,805</code></pre>
<p>The reason is repetition. <code>fib(5)</code> computes <code>fib(3)</code> twice, each time from scratch: nothing is remembered, so the same branch is recomputed over and over.</p>
<p>Memory is not the issue here: the depth is still no more than <code>n</code>, and <code>stack overflow</code> never comes into it. What runs out is time — <code>fib(45)</code> takes seconds. And the answer is still correct: the code isn't broken, it just does a mountain of unnecessary work.</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ + ГРАБЛИ ================= */
var TABLE = {
  title:{ru:"Скелет рекурсии", en:"The skeleton of a recursion"},
  intro:{ru:"Все задачи темы собраны по одной схеме: где остановка, чем аргумент приближается к ней, что возвращается на каждом шаге.",
         en:"Every task in this topic is built the same way: where it stops, how the argument moves toward that stop, what each step returns."},
  head:{ru:["Функция","Остановка","Шаг","Возврат"], en:["Function","Stop","Step","Return"]},
  rows:[
    ["sum(n)","n == 0 → 0","n - 1","n + sum(n-1)"],
    ["fact(n)","n == 0 → 1","n - 1","n * fact(n-1)"],
    ["digits(n)","n == 0 → 0","n / 10","n%10 + digits(n/10)"],
    ["pow(a, n)","n == 0 → 1","n - 1","a * pow(a, n-1)"],
    ["rev(s)","s == \"\" → \"\"","s[1:]","rev(s[1:]) + s[:1]"],
    ["fib(n)","n < 2 → n","n-1 и n-2","fib(n-1) + fib(n-2)"]
  ]
};

var TRAPS = [
 {ru:"<strong>Остановки нет или до неё не дойти.</strong> База <code>if n == 0</code>, а шаг <code>n - 2</code> — из пятёрки ноль будет пропущен: 5, 3, 1, −1, −3. Программа не зависает, а падает: <code>fatal error: stack overflow</code>. Пиши базу с запасом: <code>if n &lt;= 0</code>.",
  en:"<strong>No stop, or a stop you never reach.</strong> Base <code>if n == 0</code> with a step of <code>n - 2</code> — starting from five, zero is skipped: 5, 3, 1, −1, −3. The program doesn't hang, it crashes: <code>fatal error: stack overflow</code>. Write the base with room to spare: <code>if n &lt;= 0</code>."},
 {ru:"<strong><code>f(n)</code> вместо <code>f(n - 1)</code>.</strong> Опечатка в один символ: аргумент не приближается к остановке, и та же самая задача запускается бесконечно. Падение через долю секунды. Первое, что смотришь при stack overflow, — меняется ли аргумент.",
  en:"<strong><code>f(n)</code> instead of <code>f(n - 1)</code>.</strong> A one-character typo: the argument never approaches the stop, so the same task restarts forever. Crash in a fraction of a second. On any stack overflow, the first thing to check is whether the argument changes."},
 {ru:"<strong>Забыл <code>return</code> перед вызовом себя.</strong> Строка <code>sum(n - 1)</code> отработает целиком и выбросит результат — как будто её и не было. Функция вернёт что-то другое, компилятор промолчит: с точки зрения типов всё в порядке.",
  en:"<strong>Forgot the <code>return</code> before the self-call.</strong> The line <code>sum(n - 1)</code> runs in full and throws its result away, as if it were never there. The function returns something else and the compiler stays silent: type-wise everything is fine."},
 {ru:"<strong>Дно вернуло не то значение.</strong> У факториала база — единица, не ноль. С <code>return 0</code> на подъёме всё умножится на ноль, и <code>fact(5)</code> даст 0. Проверяй базу отдельно: что должна вернуть функция на самом маленьком входе.",
  en:"<strong>The bottom returns the wrong value.</strong> A factorial's base is one, not zero. With <code>return 0</code> everything gets multiplied by zero on the way back and <code>fact(5)</code> gives 0. Check the base on its own: what should the function return for the smallest input?"},
 {ru:"<strong>Печать не с той стороны вызова.</strong> Числа выходят в обратном порядке, а код при этом «работает» и ни на что не жалуется. Лечится переносом одной строки: до вызова — спуск, после — подъём.",
  en:"<strong>The print is on the wrong side of the call.</strong> The numbers come out in reverse order while the code “works” and complains about nothing. The fix is moving one line: before the call is the way down, after it is the way back."},
 {ru:"<strong>Ждёшь, что вложенный вызов изменит твоё <code>n</code>.</strong> Не изменит: у каждого вызова своя копия параметров. <code>n = n - 1</code> внутри — это правка только текущей копии, соседние вызовы её не видят.",
  en:"<strong>Expecting a nested call to change your <code>n</code>.</strong> It won't: every call has its own copy of the parameters. <code>n = n - 1</code> inside edits only the current copy; neighbouring calls never see it."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

func down(n int) {
	if n == 0 {
		return
	}
	fmt.Println(n)
	down(n - 1)
}

func main() {
	down(3)
}`,
 out:"3\n2\n1",
 why:{ru:"Печать стоит до вызова себя, поэтому числа выходят на спуске — в том порядке, в каком функция уходит вглубь. Ноль не печатается: на нём срабатывает остановка.<br><b>Сломай:</b> убери <code>if n == 0 { return }</code> и запусти. Через долю секунды получишь <code>fatal error: stack overflow</code> — так выглядит рекурсия без остановки.",
      en:"The print is before the self-call, so the numbers come out on the way down, in the order the function dives. Zero is never printed: that is where the stop fires.<br><b>Break it:</b> remove <code>if n == 0 { return }</code> and run. In a fraction of a second you get <code>fatal error: stack overflow</code> — that is what recursion without a stop looks like."}
},
{
 chg:{ru:"печать переехала под вызов", en:"the print moved below the call"},
 code:`package main

import "fmt"

func down(n int) {
	if n == 0 {
		return
	}
	down(n - 1)
	fmt.Println(n)
}

func main() {
	down(3)
}`,
 out:"1\n2\n3",
 why:{ru:"Переставили две строки — вывод перевернулся. Пока идёт спуск, не печатается ничего; когда самый глубокий вызов закончился, каждый печатает своё <code>n</code> по дороге назад.",
      en:"Two lines swapped and the output flipped. Nothing prints on the way down; once the deepest call has finished, each call prints its own <code>n</code> on the way back."}
},
{
 chg:{ru:"печатаем и до вызова, и после", en:"printing both before and after the call"},
 code:`package main

import "fmt"

func down(n int) {
	if n == 0 {
		return
	}
	fmt.Println(">", n)
	down(n - 1)
	fmt.Println("<", n)
}

func main() {
	down(3)
}`,
 out:"> 3\n> 2\n> 1\n< 1\n< 2\n< 3",
 why:{ru:"Сверху спуск, снизу подъём, и они зеркальны. Строку <code>&lt; 3</code> печатает тот самый первый вызов, который всё это время ждал: его <code>n</code> никуда не делось.",
      en:"The way down on top, the way back below, mirror images of each other. The line <code>&lt; 3</code> is printed by the very first call, which was waiting the whole time: its <code>n</code> never went anywhere."}
},
{
 chg:{ru:"функция стала возвращать число", en:"the function now returns a number"},
 code:`package main

import "fmt"

func sum(n int) int {
	if n == 0 {
		return 0
	}
	return n + sum(n-1)
}

func main() {
	fmt.Println(sum(4))
}`,
 out:"10",
 why:{ru:"Вместо печати — возврат. Сложение <code>n + sum(n-1)</code> не может выполниться, пока вложенный вызов не вернёт своё число, поэтому вся арифметика идёт на подъёме.<br><b>Сломай:</b> замени <code>return 0</code> на <code>return 1</code> — ответ станет 11. Дно даёт лишнюю единицу, и она попадает в сумму.",
      en:"A return instead of a print. The addition <code>n + sum(n-1)</code> cannot happen until the nested call gives back its number, so all the arithmetic runs on the way back.<br><b>Break it:</b> change <code>return 0</code> to <code>return 1</code> — the answer becomes 11. The bottom adds one extra, and it lands in the sum."}
},
{
 chg:{ru:"внутрь добавлена печать результата", en:"a print of the result added inside"},
 code:`package main

import "fmt"

func sum(n int) int {
	if n == 0 {
		return 0
	}
	r := n + sum(n-1)
	fmt.Printf("sum(%d) = %d\\n", n, r)
	return r
}

func main() {
	fmt.Println(sum(4))
}`,
 out:"sum(1) = 1\nsum(2) = 3\nsum(3) = 6\nsum(4) = 10\n10",
 why:{ru:"Строки идут снизу вверх: первым напечатался <code>sum(1)</code>, последним <code>sum(4)</code>. Числа собираются на подъёме, от дна к самому первому вызову. Это и есть способ увидеть, что делает непонятная рекурсия.",
      en:"The lines come out bottom-up: <code>sum(1)</code> first, <code>sum(4)</code> last. The numbers are assembled on the way back, from the bottom to the very first call. This is how you look inside a recursion you don't understand."}
},
{
 chg:{ru:"плюс стал умножением, а ноль в базе — единицей", en:"plus became times, and the zero base became one"},
 code:`package main

import "fmt"

func fact(n int) int {
	if n == 0 {
		return 1
	}
	r := n * fact(n-1)
	fmt.Printf("fact(%d) = %d\\n", n, r)
	return r
}

func main() {
	fmt.Println(fact(5))
}`,
 out:"fact(1) = 1\nfact(2) = 2\nfact(3) = 6\nfact(4) = 24\nfact(5) = 120\n120",
 why:{ru:"Два маленьких изменения — и та же форма считает факториал.<br><b>Сломай:</b> верни в базу <code>return 0</code>. Ответ станет нулём: на подъёме всё умножается на этот ноль. Значение дна — часть ответа.",
      en:"Two small edits and the same shape computes a factorial.<br><b>Break it:</b> put <code>return 0</code> back into the base. The answer becomes zero: everything is multiplied by that zero on the way back. The bottom value is part of the answer."}
},
{
 chg:{ru:"шаг к остановке — деление, а не вычитание", en:"the step toward the stop is division, not subtraction"},
 code:`package main

import "fmt"

func digits(n int) int {
	if n == 0 {
		return 0
	}
	r := n%10 + digits(n/10)
	fmt.Printf("digits(%d) = %d\\n", n, r)
	return r
}

func main() {
	fmt.Println(digits(4821))
}`,
 out:"digits(4) = 4\ndigits(48) = 12\ndigits(482) = 14\ndigits(4821) = 15\n15",
 why:{ru:"Аргумент приближается к нулю делением: 4821 → 482 → 48 → 4 → 0. Форма прежняя: кусок текущего шага (<code>n%10</code>) плюс вызов себя на остатке.",
      en:"The argument approaches zero by division: 4821 → 482 → 48 → 4 → 0. The shape is unchanged: a piece of this step (<code>n%10</code>) plus a call on the rest."}
},
{
 chg:{ru:"аргумент — строка, а не число", en:"the argument is a string, not a number"},
 code:`package main

import "fmt"

func rev(s string) string {
	if s == "" {
		return ""
	}
	return rev(s[1:]) + s[:1]
}

func main() {
	fmt.Println(rev("hello"))
}`,
 out:"olleh",
 why:{ru:"К остановке приближает укорачивание: <code>s[1:]</code> отрезает первый символ, пустая строка — дно. Первый символ приписывается справа от результата, поэтому строка выходит перевёрнутой.",
      en:"Shortening is what moves toward the stop: <code>s[1:]</code> cuts off the first character, and the empty string is the bottom. The first character is appended on the right of the result, so the string comes out reversed."}
},
{
 chg:{ru:"функция вызывает себя дважды в одной строке", en:"the function calls itself twice in one line"},
 code:`package main

import "fmt"

func fib(n int) int {
	if n < 2 {
		return n
	}
	return fib(n-1) + fib(n-2)
}

func main() {
	fmt.Println(fib(10))
}`,
 out:"55",
 why:{ru:"Ответ верный, но теперь из каждого вызова растут два. Go считает их по очереди: сначала весь левый <code>fib(n-1)</code> целиком, потом весь правый. Ничего не запоминается, и одни и те же числа считаются заново.",
      en:"The answer is right, but now two calls grow out of every one. Go evaluates them in order: the whole left <code>fib(n-1)</code> first, then the whole right one. Nothing is remembered, so the same numbers get recomputed."}
},
{
 chg:{ru:"добавлен счётчик вызовов", en:"a call counter added"},
 code:`package main

import "fmt"

var calls int

func fib(n int) int {
	calls++
	if n < 2 {
		return n
	}
	return fib(n-1) + fib(n-2)
}

func main() {
	fmt.Println(fib(10), calls)
	calls = 0
	fmt.Println(fib(20), calls)
	calls = 0
	fmt.Println(fib(25), calls)
}`,
 out:"55 177\n6765 21891\n75025 242785",
 why:{ru:"Аргумент вырос в два с половиной раза, а работа — в тысячу. Виновата не рекурсия, а два вызова в строке: одно и то же пересчитывается заново.<br><b>Сломай:</b> поставь 40 — задержка станет заметной, 45 считается уже несколько секунд.",
      en:"The argument grew two and a half times, the work grew a thousandfold. Recursion isn't to blame — two calls in one line are: the same values get recomputed over and over.<br><b>Break it:</b> try 40 — the delay becomes obvious; 45 takes several seconds."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"CountDown", lvl:1, e:"5\n4\n3\n2\n1",
 d:{ru:"Напиши функцию, которая печатает числа от 5 до 1, каждое на своей строке. Только рекурсия, циклов нет.",
    en:"Write a function that prints the numbers from 5 down to 1, one per line. Recursion only, no loops."},
 h:{ru:"Остановка первой строкой: <code>if n == 0 { return }</code>. Дальше печать, потом вызов себя с <code>n - 1</code>.",
    en:"The stop goes first: <code>if n == 0 { return }</code>. Then the print, then the self-call with <code>n - 1</code>."}},

{t:"CountUp", lvl:1, e:"1\n2\n3\n4\n5",
 d:{ru:"Та же функция должна напечатать те же числа в обратном порядке: от 1 до 5. Менять разрешено ровно одну вещь.",
    en:"The same function must print the same numbers in the opposite order: 1 to 5. You may change exactly one thing."},
 h:{ru:"Ни условие, ни аргумент трогать не надо. Печать переезжает на другую сторону вызова себя — со спуска на подъём.",
    en:"Don't touch the condition or the argument. The print moves to the other side of the self-call — from the way down to the way back."}},

{t:"SumTo", lvl:1, e:"55",
 d:{ru:"Функция считает сумму всех чисел от 1 до n и возвращает её. Напечатай результат для n = 10.",
    en:"A function that returns the sum of all numbers from 1 to n. Print the result for n = 10."},
 h:{ru:"Дно возвращает 0. Дальше <code>return n + sum(n-1)</code>. <code>return</code> перед вызовом обязателен.",
    en:"The bottom returns 0. Then <code>return n + sum(n-1)</code>. The <code>return</code> before the call is mandatory."}},

{t:"Factorial", lvl:1, e:"720",
 d:{ru:"Функция считает произведение всех чисел от 1 до n. Напечатай результат для n = 6.",
    en:"A function that returns the product of all numbers from 1 to n. Print the result for n = 6."},
 h:{ru:"Всё как в прошлой задаче, но плюс становится умножением, а дно возвращает 1. С нулём на дне весь ответ станет нулём.",
    en:"Same as the previous task, but plus becomes times and the bottom returns 1. With zero at the bottom the whole answer becomes zero."}},

{t:"SumDigits", lvl:2, e:"12",
 d:{ru:"Посчитай рекурсией сумму цифр числа 90210 и напечатай её. Число в строку не превращать.",
    en:"Use recursion to compute the sum of the digits of 90210 and print it. Don't turn the number into a string."},
 h:{ru:"Кусок текущего шага — <code>n % 10</code>, остаток задачи — <code>n / 10</code>. Дно на нуле возвращает 0.",
    en:"The piece of this step is <code>n % 10</code>, the rest of the task is <code>n / 10</code>. The bottom at zero returns 0."}},

{t:"Power", lvl:2, e:"1024\n1",
 d:{ru:"Функция <code>pow(a, n)</code> возводит <code>a</code> в степень <code>n</code>. Напечатай <code>pow(2, 10)</code> и <code>pow(7, 0)</code>, каждое на своей строке.",
    en:"A function <code>pow(a, n)</code> raising <code>a</code> to the power <code>n</code>. Print <code>pow(2, 10)</code> and <code>pow(7, 0)</code>, each on its own line."},
 h:{ru:"К остановке приближается только второй аргумент: <code>pow(a, n-1)</code>. Первый передаётся без изменений. Дно возвращает 1 — вторая строка вывода именно про это.",
    en:"Only the second argument moves toward the stop: <code>pow(a, n-1)</code>. The first is passed through unchanged. The bottom returns 1 — that is what the second output line checks."}},

{t:"DownAndUp", lvl:2, e:"> 3\n> 2\n> 1\n< 1\n< 2\n< 3",
 d:{ru:"Одна функция, один вызов из main. На спуске печатай <code>&gt;</code> и число, на подъёме <code>&lt;</code> и то же число. Старт с 3.",
    en:"One function, one call from main. On the way down print <code>&gt;</code> and the number; on the way back print <code>&lt;</code> and the same number. Start at 3."},
 h:{ru:"Две печати в одной функции: одна до вызова себя, другая после. Ничего запоминать не надо — <code>n</code> у каждого вызова своё и никуда не девается.",
    en:"Two prints in one function: one before the self-call, one after. Nothing needs to be remembered — each call keeps its own <code>n</code>."}},

{t:"ReverseString", lvl:3, e:"noisrucer",
 d:{ru:"Переверни строку <code>\"recursion\"</code> рекурсией и напечатай результат. Циклов нет.",
    en:"Reverse the string <code>\"recursion\"</code> with recursion and print the result. No loops."},
 h:{ru:"Дно — пустая строка, она возвращает пустую строку. Шаг: <code>s[1:]</code> отрезает первый символ. Собирай ответ как <code>rev(s[1:]) + s[:1]</code> и подумай, почему первый символ приписан справа.",
    en:"The bottom is the empty string, and it returns the empty string. The step: <code>s[1:]</code> drops the first character. Build the answer as <code>rev(s[1:]) + s[:1]</code> and think about why the first character goes on the right."}},

{t:"FibRow", lvl:3, e:"0 1 1 2 3 5 8 13 21 34",
 d:{ru:"Напечатай первые десять чисел Фибоначчи в одну строку через пробел. Каждое число считается рекурсивной функцией. Лишнего пробела в конце быть не должно.",
    en:"Print the first ten Fibonacci numbers on one line, separated by spaces. Each number is computed by a recursive function. No trailing space."},
 h:{ru:"Остановка тут двойная: <code>if n &lt; 2 { return n }</code> закрывает сразу и ноль, и единицу. Дальше <code>fib(n-1) + fib(n-2)</code>. Печать десяти чисел — обычный цикл в main, пробел ставь перед числом, кроме первого.",
    en:"The stop covers two cases at once: <code>if n &lt; 2 { return n }</code> handles both zero and one. Then <code>fib(n-1) + fib(n-2)</code>. Printing the ten numbers is a plain loop in main — print the space before each number except the first."}},

{t:"Palindrome", lvl:3, e:"true\nfalse\ntrue",
 d:{ru:"Функция проверяет, читается ли строка одинаково с обоих концов, и возвращает <code>bool</code>. Напечатай результат для <code>\"level\"</code>, <code>\"hello\"</code> и <code>\"abba\"</code>, каждый на своей строке.",
    en:"A function that checks whether a string reads the same from both ends and returns a <code>bool</code>. Print the result for <code>\"level\"</code>, <code>\"hello\"</code> and <code>\"abba\"</code>, each on its own line."},
 h:{ru:"Здесь два условия остановки. Первое: строка короче двух символов — это <code>true</code>. Второе: первый и последний символы разные — это <code>false</code>. Шаг отрезает оба конца сразу: <code>s[1 : len(s)-1]</code>.",
    en:"There are two stops here. First: a string shorter than two characters is <code>true</code>. Second: first and last characters differ, that is <code>false</code>. The step cuts off both ends at once: <code>s[1 : len(s)-1]</code>."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var CRASH = {ru:"упадёт: fatal error: stack overflow", en:"crashes: fatal error: stack overflow"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};

var BANK = [
{q:Q_OUT, code:"func f(n int) {\n\tif n == 0 {\n\t\treturn\n\t}\n\tfmt.Print(n)\n\tf(n - 1)\n}\n\nf(3)",
 opts:["321","123","3210","0123"], ok:0,
 why:{ru:"Печать стоит до вызова себя — значит на спуске. Первым выходит то, с чего начали. Ноль не печатается: на нём срабатывает остановка, и до печати дело не доходит.",
      en:"The print is before the self-call, so it runs on the way down. What you started with comes out first. Zero is never printed: the stop fires there and the print is never reached."}},

{q:Q_OUT, code:"func f(n int) {\n\tif n == 0 {\n\t\treturn\n\t}\n\tf(n - 1)\n\tfmt.Print(n)\n}\n\nf(3)",
 opts:["123","321","0123","3210"], ok:0,
 why:{ru:"Печать под вызовом — значит на подъёме. Пока идёт спуск, не печатается ничего; числа выходят по дороге назад, начиная с самого глубокого вызова.",
      en:"The print is below the call, so it runs on the way back. Nothing prints while diving; the numbers come out on the way back, starting from the deepest call."}},

{q:Q_OUT, code:"func s(n int) int {\n\tif n == 0 {\n\t\treturn 0\n\t}\n\treturn n + s(n-1)\n}\n\nfmt.Println(s(3))",
 opts:["6","3","0","1"], ok:0,
 why:{ru:"3 + 2 + 1 + 0. Сложения выполняются на подъёме: пока <code>s(2)</code> не вернёт число, тройке нечего прибавлять.",
      en:"3 + 2 + 1 + 0. The additions happen on the way back: until <code>s(2)</code> returns a number, the three has nothing to add."}},

{q:Q_OUT, code:"func f(n int) int {\n\tif n == 0 {\n\t\treturn 0\n\t}\n\treturn n * f(n-1)\n}\n\nfmt.Println(f(4))",
 opts:["0","24","4","1"], ok:0,
 why:{ru:"Форма верная, а дно неправильное. На подъёме всё умножается на этот ноль, и весь ответ обнуляется. У произведения база — единица.",
      en:"The shape is right but the bottom is wrong. On the way back everything is multiplied by that zero, so the whole answer collapses. A product's base is one."}},

{q:Q_OUT, code:"func d(n int) int {\n\tif n == 0 {\n\t\treturn 0\n\t}\n\treturn n%10 + d(n/10)\n}\n\nfmt.Println(d(507))",
 opts:["12","507","7","5"], ok:0,
 why:{ru:"7 + 0 + 5. Аргумент приближается к остановке делением: 507 → 50 → 5 → 0, всего четыре вызова.",
      en:"7 + 0 + 5. The argument approaches the stop by division: 507 → 50 → 5 → 0, four calls in total."}},

{q:Q_OUT, code:"func r(s string) string {\n\tif s == \"\" {\n\t\treturn \"\"\n\t}\n\treturn r(s[1:]) + s[:1]\n}\n\nfmt.Println(r(\"abc\"))",
 opts:["cba","abc","a","c"], ok:0,
 why:{ru:"Дно — пустая строка. Первый символ приписывается справа от того, что вернул вложенный вызов, поэтому он оказывается в самом конце.",
      en:"The bottom is the empty string. The first character is appended to the right of whatever the nested call returned, so it ends up at the very end."}},

{q:Q_OUT, code:"func fib(n int) int {\n\tif n < 2 {\n\t\treturn n\n\t}\n\treturn fib(n-1) + fib(n-2)\n}\n\nfmt.Println(fib(5))",
 opts:["5","8","3","4"], ok:0,
 why:{ru:"Ряд начинается с нуля: 0, 1, 1, 2, 3, 5. Условие <code>n &lt; 2</code> закрывает сразу два случая — и ноль, и единицу.",
      en:"The sequence starts at zero: 0, 1, 1, 2, 3, 5. The condition <code>n &lt; 2</code> covers two cases at once — zero and one."}},

{q:Q_OUT, code:"func s(n int) int {\n\tif n == 0 {\n\t\treturn 0\n\t}\n\ts(n - 1)\n\treturn n\n}\n\nfmt.Println(s(4))",
 opts:["4","10","0",NO], ok:0,
 why:{ru:"Вызов <code>s(n - 1)</code> отработает целиком, но его результат никуда не записан и выбрасывается. Возвращается просто <code>n</code>. Компилятор молчит: выбросить результат обычной функции в Go можно.",
      en:"The call <code>s(n - 1)</code> runs in full, but its result is stored nowhere and is discarded. The function simply returns <code>n</code>. The compiler stays quiet: discarding a normal function's result is allowed in Go."}},

{q:Q_OUT, code:"func f(n int) {\n\tif n == 0 {\n\t\treturn\n\t}\n\tfmt.Print(n)\n\tf(n - 1)\n\tfmt.Print(n)\n}\n\nf(3)",
 opts:["321123","123321","321","123"], ok:0,
 why:{ru:"Первая печать на спуске даёт 3 2 1, вторая на подъёме — 1 2 3. Каждый вызов печатает своё <code>n</code> дважды: до ухода вглубь и после возврата.",
      en:"The first print, on the way down, gives 3 2 1; the second, on the way back, gives 1 2 3. Each call prints its own <code>n</code> twice: before diving and after returning."}},

{q:Q_OUT, code:"func f(n int) {\n\tif n == 0 {\n\t\treturn\n\t}\n\tn = n - 1\n\tf(n)\n\tfmt.Print(n)\n}\n\nf(3)",
 opts:["012","210","123","321"], ok:0,
 why:{ru:"<code>n = n - 1</code> меняет только копию текущего вызова, соседние её не видят. Печать на подъёме, поэтому первым отчитывается самый глубокий вызов, у которого <code>n</code> стало нулём.",
      en:"<code>n = n - 1</code> changes only the current call's copy; the neighbours never see it. The print is on the way back, so the deepest call reports first — the one whose <code>n</code> became zero."}},

{q:{ru:"Что будет с рекурсивной функцией без условия остановки?",
    en:"What happens to a recursive function with no stop condition?"}, code:null,
 opts:[CRASH,
       {ru:"будет работать вечно, как бесконечный цикл", en:"it runs forever, like an infinite loop"},
       {ru:"компилятор не соберёт такой код", en:"the compiler refuses to build it"},
       {ru:"функция выполнится один раз", en:"the function runs once"}], ok:0,
 why:{ru:"Каждый начатый и незакрытый вызов занимает память, и все они живут одновременно. Память кончается за доли секунды — это падение, а не зависание. Компилятор такой код собирает: по типам всё в порядке.",
      en:"Every started, unfinished call takes memory, and they all live at once. Memory runs out in a fraction of a second — a crash, not a hang. The compiler builds this code happily: type-wise nothing is wrong."}},

{q:{ru:"Где должно стоять условие остановки?", en:"Where does the stop condition belong?"}, code:null,
 opts:[{ru:"в начале функции, до вызова себя", en:"at the top of the function, before the self-call"},
       {ru:"сразу после вызова себя", en:"right after the self-call"},
       {ru:"в main, перед первым вызовом", en:"in main, before the first call"},
       {ru:"в конце функции, последней строкой", en:"at the end of the function, as the last line"}], ok:0,
 why:{ru:"Проверку после вызова себя выполнить не успеют: вызов уйдёт вглубь раньше. Остановку проверяет каждый вызов до того, как начнёт новый.",
      en:"A check placed after the self-call never gets its turn: the call dives deeper first. Every call tests the stop before it starts a new one."}},

{q:{ru:"Функция считает верно, но печатает числа в обратном порядке. Что менять?",
    en:"The function computes correctly but prints the numbers in reverse. What do you change?"}, code:null,
 opts:[{ru:"перенести печать на другую сторону вызова себя", en:"move the print to the other side of the self-call"},
       {ru:"поменять условие остановки", en:"change the stop condition"},
       {ru:"изменить шаг аргумента", en:"change the argument's step"},
       {ru:"добавить второй вызов себя", en:"add a second self-call"}], ok:0,
 why:{ru:"До вызова — работа на спуске, после — на подъёме. Порядок вывода задаётся только этим, к подсчёту он отношения не имеет.",
      en:"Before the call means work on the way down, after it means work on the way back. Output order depends only on that; the computation itself is untouched."}},

{q:Q_HAP, code:"func f(n int) {\n\tif n == 0 {\n\t\treturn\n\t}\n\tfmt.Print(n)\n\tf(n)\n}\n\nf(3)",
 opts:[CRASH,
       {ru:"напечатает 321", en:"prints 321"},
       {ru:"напечатает 3 и закончится", en:"prints 3 and finishes"},
       {ru:"не соберётся", en:"won't compile"}], ok:0,
 why:{ru:"Аргумент не меняется, значит к остановке он не приближается и она не сработает никогда. Опечатка в один символ — падение через долю секунды. При stack overflow первым делом смотри, меняется ли аргумент.",
      en:"The argument never changes, so it never approaches the stop and the stop never fires. A one-character typo means a crash in a fraction of a second. On a stack overflow, first check whether the argument changes."}},

{q:{ru:"<code>down(n)</code> вызывает <code>down(n-1)</code> и останавливается на нуле. Сколько копий <code>n</code> живёт одновременно в момент, когда остановка сработала при <code>down(3)</code>?",
    en:"<code>down(n)</code> calls <code>down(n-1)</code> and stops at zero. How many copies of <code>n</code> are alive at the moment the stop fires for <code>down(3)</code>?"}, code:null,
 opts:["4","1","3","0"], ok:0,
 why:{ru:"Пока идёт спуск, ни один вызов не закончился: живы <code>n</code> = 3, 2, 1 и 0. У каждого вызова своя копия, и все они занимают память одновременно — поэтому она и кончается, если остановки нет.",
      en:"While diving, no call has finished: <code>n</code> = 3, 2, 1 and 0 are all alive. Each call has its own copy and they all take memory at once — which is why memory runs out when there is no stop."}},

{q:{ru:"Почему рекурсивный фибоначчи считает так медленно?",
    en:"Why is recursive Fibonacci so slow?"}, code:null,
 opts:[{ru:"каждый вызов порождает два, и одно и то же считается заново много раз",
        en:"each call spawns two, and the same values are recomputed many times"},
       {ru:"числа не помещаются в int", en:"the numbers don't fit in an int"},
       {ru:"рекурсия всегда медленнее цикла", en:"recursion is always slower than a loop"},
       {ru:"память под вызовы выделяется медленно", en:"memory for calls is allocated slowly"}], ok:0,
 why:{ru:"<code>fib(10)</code> — 177 вызовов, <code>fib(25)</code> — 242 785, <code>fib(45)</code> — 3,6 миллиарда. Дело не в рекурсии как таковой: у <code>sum(n)</code> вызов один в строке, и работа растёт по прямой.",
      en:"<code>fib(10)</code> is 177 calls, <code>fib(25)</code> is 242,785, <code>fib(45)</code> is 3.6 billion. Recursion itself is not the problem: <code>sum(n)</code> has one call per line and its work grows in a straight line."}},

{q:{ru:"Что обязательно должно быть верно про аргумент вызова себя?",
    en:"What must always be true about the argument of a self-call?"}, code:null,
 opts:[{ru:"он приближается к условию остановки", en:"it moves toward the stop condition"},
       {ru:"он уменьшается ровно на единицу", en:"it decreases by exactly one"},
       {ru:"он всегда число", en:"it is always a number"},
       {ru:"он не меняется", en:"it stays the same"}], ok:0,
 why:{ru:"Как именно — не важно: <code>n-1</code>, <code>n/10</code>, <code>s[1:]</code>. Важно, что через конечное число шагов условие остановки станет истинным.",
      en:"How exactly does not matter: <code>n-1</code>, <code>n/10</code>, <code>s[1:]</code>. What matters is that after a finite number of steps the stop condition becomes true."}},

{q:{ru:"В строке <code>return n + sum(n-1)</code> — когда выполняется сложение?",
    en:"In the line <code>return n + sum(n-1)</code>, when does the addition happen?"}, code:null,
 opts:[{ru:"на подъёме, после того как вложенный вызов вернул число",
        en:"on the way back, once the nested call has returned a number"},
       {ru:"на спуске, до вызова себя", en:"on the way down, before the self-call"},
       {ru:"одновременно с вызовом", en:"at the same time as the call"},
       {ru:"до проверки остановки", en:"before the stop is checked"}], ok:0,
 why:{ru:"Чтобы сложить, нужны оба слагаемых, а второе приходит только из закончившегося вызова. Поэтому вся арифметика идёт снизу вверх, начиная со значения из базы.",
      en:"Adding needs both operands, and the second one only arrives from a finished call. So all the arithmetic runs bottom-up, starting from the base value."}},

{q:{ru:"База <code>if n == 0</code>, шаг <code>n - 2</code>, старт с 5. Что будет?",
    en:"Base <code>if n == 0</code>, step <code>n - 2</code>, starting at 5. What happens?"}, code:null,
 opts:[CRASH,
       {ru:"вернётся 0", en:"it returns 0"},
       {ru:"вернётся 9", en:"it returns 9"},
       {ru:"не соберётся", en:"won't compile"}], ok:0,
 why:{ru:"5, 3, 1, −1, −3 — ноль проскакивается, и равенство никогда не выполнится. Поэтому базу пишут с запасом: <code>if n &lt;= 0</code>.",
      en:"5, 3, 1, −1, −3 — zero is skipped and the equality never holds. That is why the base is written with room to spare: <code>if n &lt;= 0</code>."}},

{q:{ru:"Чем рекурсия по сути отличается от цикла?", en:"What is the essential difference between recursion and a loop?"}, code:null,
 opts:[{ru:"каждый вызов заводит свои переменные и ждёт возврата, у цикла переменные общие",
        en:"each call creates its own variables and waits for a return; a loop shares one set"},
       {ru:"рекурсия всегда быстрее", en:"recursion is always faster"},
       {ru:"циклом нельзя решить те же задачи", en:"a loop cannot solve the same tasks"},
       {ru:"рекурсии не нужно условие остановки", en:"recursion needs no stop condition"}], ok:0,
 why:{ru:"Цикл крутится в одной функции с одним набором переменных и ничего не накапливает. Рекурсия на каждом шаге заводит новый набор и держит все незакрытые вызовы — отсюда и подъём, и падение при отсутствии остановки.",
      en:"A loop spins inside one function with one set of variables and accumulates nothing. Recursion creates a new set at every step and holds every unfinished call — hence the way back, and hence the crash when the stop is missing."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Что происходит, когда функция вызывает саму себя?", en:"What actually happens when a function calls itself?"},
 a:{ru:`<p>То же самое, что при вызове любой другой функции: текущий вызов останавливается на этой строке, запускается новый и работает до конца, потом управление возвращается на строку после вызова.</p>
<p>Разница только в том, что новый вызов — та же самая функция. Со своими параметрами и своими локальными переменными.</p>
<pre><code>down(3)
  down(2)
    down(1)
      down(0)   <span class="cm">// остановка, возврат</span>
    <span class="cm">// сюда вернулись, дальше вверх</span></code></pre>
<p>Пока идёт спуск, ни один из начатых вызовов не закончен — все они ждут. Отсюда два следствия: у каждого своё <code>n</code>, и все они занимают память одновременно.</p>`,
    en:`<p>Exactly what happens with any other function call: the current call pauses on that line, a new one starts and runs to the end, then control returns to the line after the call.</p>
<p>The only difference is that the new call is the same function. With its own parameters and its own local variables.</p>
<pre><code>down(3)
  down(2)
    down(1)
      down(0)   <span class="cm">// the stop, then return</span>
    <span class="cm">// back here, then upward</span></code></pre>
<p>While the calls go down, none of them has finished — they are all waiting. Two consequences: each has its own <code>n</code>, and they all occupy memory at the same time.</p>`}},

{q:{ru:"Почему рекурсия без остановки падает, а не зависает?", en:"Why does recursion without a stop crash instead of hanging?"},
 a:{ru:`<p>Каждый начатый вызов нужно где-то держать: его параметры, локальные переменные и место, куда возвращаться. Пока вызов не закончился, это место занято.</p>
<p>Бесконечная рекурсия начинает вызовы и не заканчивает ни одного. Отведённая под них память кончается за доли секунды:</p>
<pre><code>runtime: goroutine stack exceeds 1000000000-byte limit
fatal error: stack overflow</code></pre>
<p>Бесконечный цикл ведёт себя иначе: он крутится в одной функции и ничего не накапливает, поэтому может висеть сколько угодно.</p>
<p>Практический вывод: увидел <code>stack overflow</code> — ищи не «зависание», а неверную остановку или шаг, который к ней не приближается.</p>`,
    en:`<p>Every started call has to be held somewhere: its parameters, its local variables and the place to return to. Until the call finishes, that space stays occupied.</p>
<p>Infinite recursion starts calls and finishes none of them. The memory set aside for them runs out in a fraction of a second:</p>
<pre><code>runtime: goroutine stack exceeds 1000000000-byte limit
fatal error: stack overflow</code></pre>
<p>An infinite loop behaves differently: it spins inside one function and accumulates nothing, so it can hang indefinitely.</p>
<p>Practical takeaway: when you see <code>stack overflow</code>, don't look for a "hang" — look for a wrong stop or a step that never approaches it.</p>`}},

{q:{ru:"Почему одна и та же функция печатает то 3 2 1, то 1 2 3?", en:"Why does the same function print 3 2 1 one time and 1 2 3 another?"},
 a:{ru:`<p>Всё решает то, с какой стороны от вызова себя стоит печать.</p>
<pre><code>fmt.Println(n)   <span class="cm">// спуск → 3 2 1</span>
down(n - 1)</code></pre>
<pre><code>down(n - 1)
fmt.Println(n)   <span class="cm">// подъём → 1 2 3</span></code></pre>
<p>В первом случае вызов печатает своё число сразу, а потом уходит вглубь. Во втором сначала полностью отрабатывает вся глубина, и печать начинается с самого дальнего вызова.</p>
<p>Логика подсчёта при этом не меняется вообще. Это готовый приём: нужен обратный порядок — работай на подъёме.</p>`,
    en:`<p>It comes down to which side of the self-call the print sits on.</p>
<pre><code>fmt.Println(n)   <span class="cm">// way down → 3 2 1</span>
down(n - 1)</code></pre>
<pre><code>down(n - 1)
fmt.Println(n)   <span class="cm">// way back → 1 2 3</span></code></pre>
<p>In the first version each call prints its number immediately and then dives. In the second the whole depth runs first, and printing starts from the deepest call.</p>
<p>The computation itself doesn't change at all. It's a ready-made trick: need reverse order, do the work on the way back.</p>`}},

{q:{ru:"Как придумать рекурсию для новой задачи?", en:"How do you design a recursion for a new task?"},
 a:{ru:`<p>Три вопроса подряд, всегда одни и те же.</p>
<ul><li><strong>Что вернуть, когда считать уже нечего?</strong> Ноль, единица, пустая строка — это дно.</li>
<li><strong>Как сделать задачу меньше?</strong> <code>n-1</code>, <code>n/10</code>, <code>s[1:]</code> — что-то обязано приближаться к дну.</li>
<li><strong>Как из ответа на меньшую задачу получить свой?</strong> Прибавить, умножить, приписать символ.</li></ul>
<p>Сумма цифр числа: считать нечего при <code>n == 0</code>, ответ там 0. Меньше — это <code>n / 10</code>. Свой ответ — последняя цифра плюс ответ для остатка:</p>
<pre><code>return n%10 + digits(n/10)</code></pre>
<p>Проверять начинай с самого маленького входа: <code>digits(0)</code>, потом <code>digits(7)</code>, потом <code>digits(42)</code>. Если эти три верны, длинное число тоже сойдётся — форма одна и та же.</p>`,
    en:`<p>Three questions in a row, always the same ones.</p>
<ul><li><strong>What do you return when there is nothing left to compute?</strong> Zero, one, an empty string — that is the bottom.</li>
<li><strong>How do you make the task smaller?</strong> <code>n-1</code>, <code>n/10</code>, <code>s[1:]</code> — something must approach the bottom.</li>
<li><strong>How do you build your answer from the smaller one?</strong> Add, multiply, append a character.</li></ul>
<p>Sum of a number's digits: nothing to compute when <code>n == 0</code>, and the answer there is 0. Smaller is <code>n / 10</code>. Your answer is the last digit plus the answer for the rest:</p>
<pre><code>return n%10 + digits(n/10)</code></pre>
<p>Check the smallest input first: <code>digits(0)</code>, then <code>digits(7)</code>, then <code>digits(42)</code>. If those three are right, a long number works too — the shape is identical.</p>`}},

{q:{ru:"Рекурсия или цикл — что выбирать?", en:"Recursion or a loop — which one?"},
 a:{ru:`<p>Почти всё из этой темы делается циклом, и обычно быстрее: цикл не заводит новый набор переменных на каждый шаг.</p>
<pre><code><span class="cm">// сумма от 1 до n циклом</span>
s := 0
for i := n; i &gt; 0; i-- {
	s += i
}</code></pre>
<p>Рекурсию берут там, где задача сама распадается на такие же поменьше, и не на одну: обход дерева каталогов, перебор вариантов, разбор вложенных скобок. Циклом это тоже пишется, но приходится вручную вести список того, что осталось разобрать — то есть делать руками то, что рекурсия делает сама.</p>
<p>Пока задача линейная — пройти число, строку или список от начала до конца, — цикл проще и понятнее. Здесь ты пишешь рекурсию не потому, что так лучше, а чтобы её понять.</p>`,
    en:`<p>Nearly everything in this topic can be done with a loop, and usually faster: a loop doesn't create a new set of variables at every step.</p>
<pre><code><span class="cm">// sum from 1 to n with a loop</span>
s := 0
for i := n; i &gt; 0; i-- {
	s += i
}</code></pre>
<p>Recursion earns its place where a task splits into smaller copies of itself, and into more than one: walking a directory tree, exploring options, parsing nested brackets. A loop can do it too, but then you keep the list of what's left to process by hand — doing manually what recursion does for you.</p>
<p>While the task is linear — walk a number, a string or a list from start to end — a loop is simpler and clearer. Here you write recursion not because it is better, but to understand it.</p>`}},

{q:{ru:"Почему рекурсивный фибоначчи считает медленно?", en:"Why is recursive Fibonacci slow?"},
 a:{ru:`<p>Потому что в строке <code>return fib(n-1) + fib(n-2)</code> два вызова себя. Один вызов порождает два, каждый из них — ещё два.</p>
<pre><code>fib(5)
├── fib(4)
│   ├── fib(3)
│   └── fib(2)
└── fib(3)     <span class="cm">// считается заново, целиком</span>
    ├── fib(2)
    └── fib(1)</code></pre>
<p>Ничего не запоминается: <code>fib(3)</code> считается дважды, <code>fib(2)</code> — трижды, и дальше только хуже.</p>
<ul><li><code>fib(10)</code> — 177 вызовов</li>
<li><code>fib(25)</code> — 242 785 вызовов</li>
<li><code>fib(45)</code> — 3 672 623 805 вызовов, ответа ждёшь секунды</li></ul>
<p>Виновата не рекурсия, а повторы. У <code>sum(n)</code> вызов один в строке, и работа растёт по прямой: сто шагов — сто вызовов.</p>`,
    en:`<p>Because the line <code>return fib(n-1) + fib(n-2)</code> holds two self-calls. One call spawns two, and each of those spawns two more.</p>
<pre><code>fib(5)
├── fib(4)
│   ├── fib(3)
│   └── fib(2)
└── fib(3)     <span class="cm">// recomputed from scratch</span>
    ├── fib(2)
    └── fib(1)</code></pre>
<p>Nothing is remembered: <code>fib(3)</code> is computed twice, <code>fib(2)</code> three times, and it only gets worse.</p>
<ul><li><code>fib(10)</code> — 177 calls</li>
<li><code>fib(25)</code> — 242,785 calls</li>
<li><code>fib(45)</code> — 3,672,623,805 calls, and you wait seconds for the answer</li></ul>
<p>Recursion is not the culprit, repetition is. <code>sum(n)</code> has one call per line and its work grows in a straight line: a hundred steps, a hundred calls.</p>`}},

{q:{ru:"Что значит «у каждого вызова своя копия параметров»?", en:"What does “each call has its own copy of the parameters” mean?"},
 a:{ru:`<p>Параметр — это переменная, которая создаётся заново при каждом вызове. Одновременно живых копий столько, сколько вызовов начато и ещё не закончено.</p>
<pre><code>func f(n int) {
	if n == 0 {
		return
	}
	n = n - 1
	f(n)
	fmt.Print(n)
}</code></pre>
<p><code>f(3)</code> напечатает <code>012</code>. Строка <code>n = n - 1</code> в каждом вызове поменяла только его собственное <code>n</code>; на подъёме каждый напечатал своё значение.</p>
<p>Из того же правила следует, что вызванная функция не может изменить переменную того, кто её вызвал: она работает с копией. И из него же — почему память кончается, если остановки нет: копии не исчезают, пока вызовы не закончатся.</p>`,
    en:`<p>A parameter is a variable created afresh on every call. The number of live copies equals the number of calls that have started and not yet finished.</p>
<pre><code>func f(n int) {
	if n == 0 {
		return
	}
	n = n - 1
	f(n)
	fmt.Print(n)
}</code></pre>
<p><code>f(3)</code> prints <code>012</code>. The line <code>n = n - 1</code> changed only that call's own <code>n</code>; on the way back each one printed its own value.</p>
<p>The same rule explains why a called function cannot change its caller's variable — it works on a copy. And why memory runs out without a stop: the copies stay until the calls finish.</p>`}},

{q:{ru:"Как разобраться, что делает непонятная рекурсия?", en:"How do you figure out what an unfamiliar recursion does?"},
 a:{ru:`<p>Читать её глазами вглубь почти невозможно. Два рабочих способа.</p>
<p><strong>Первый: подставить самый маленький вход.</strong> Что вернёт <code>sum(0)</code>? А <code>sum(1)</code>? А <code>sum(2)</code>, если <code>sum(1)</code> уже известен? Дальше можно не идти — форма одна и та же на любой глубине.</p>
<p><strong>Второй: вставить печать</strong> — по строке на вход и на выход:</p>
<pre><code>func sum(n int) int {
	fmt.Println("вход", n)
	if n == 0 {
		return 0
	}
	r := n + sum(n-1)
	fmt.Println("выход", n, "=", r)
	return r
}</code></pre>
<p>Сразу видно порядок спуска, порядок подъёма и то место, где значение перестало быть тем, что ты ждёшь. Разобрался — печать убираешь.</p>`,
    en:`<p>Reading it downward with your eyes is nearly impossible. Two approaches that work.</p>
<p><strong>First: plug in the smallest input.</strong> What does <code>sum(0)</code> return? And <code>sum(1)</code>? And <code>sum(2)</code>, given that <code>sum(1)</code> is known? You can stop there — the shape is the same at any depth.</p>
<p><strong>Second: add prints</strong> — one line on the way in, one on the way out:</p>
<pre><code>func sum(n int) int {
	fmt.Println("in", n)
	if n == 0 {
		return 0
	}
	r := n + sum(n-1)
	fmt.Println("out", n, "=", r)
	return r
}</code></pre>
<p>Now you see the order going down, the order coming back, and the exact point where the value stops being what you expected. Once it's clear, remove the prints.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */
var SCENARIOS = [
{
 name:{ru:"Спуск: печать до вызова", en:"Down: print before the call"},
 params:[{key:"n", label:{ru:"старт", en:"start"}, min:1, max:6, def:2}],
 code: function(p){
   return ["func down(n int) {","\tif n == 0 {","\t\treturn","\t}","\tfmt.Println(n)","\tdown(n - 1)","}","","func main() {","\tdown(" + p.n + ")","}"];
 },
 steps: function(p){
   var n = +p.n, steps = [], out = "", d, k;
   function vars(depth){
     var v = [], i;
     for(i = 0; i < depth; i++) v.push(["n", String(n - i), "int · call " + (i + 1)]);
     return v;
   }
   function stack(depth){
     var s = ["main()"], i;
     for(i = 0; i < depth; i++) s.push("down(" + (n - i) + ")");
     return s;
   }
   function cRu(k){ return k === 1 ? "вызов" : (k < 5 ? "вызова" : "вызовов"); }
   function cEn(k){ return k === 1 ? "call" : "calls"; }

   steps.push({line:9, vars:vars(1), stack:stack(1), out:out,
     note:{ru:"main вызвал <code>down(" + n + ")</code>. Внутри функции появилась своя переменная <code>n</code> со значением " + n + ".",
           en:"main called <code>down(" + n + ")</code>. Inside the function its own variable <code>n</code> appeared, holding " + n + "."}});

   for(d = 1; d <= n; d++){
     k = n - d + 1;
     steps.push({line:1, vars:vars(d), stack:stack(d), out:out,
       note: d === 1
         ? {ru:"Первым делом — проверка остановки. " + k + " не ноль, значит работаем дальше.",
            en:"First thing: the stop check. " + k + " is not zero, so we carry on."}
         : {ru:"Начался вызов №" + d + ", и у него своя копия <code>n</code> = " + k + ". Проверка снова первая: " + k + " не ноль.",
            en:"Call " + d + " has begun with its own copy of <code>n</code> = " + k + ". The check comes first again: " + k + " is not zero."}});
     out += k + "\n";
     steps.push({line:4, vars:vars(d), stack:stack(d), out:out,
       note: d === 1
         ? {ru:"Печать стоит <b>до</b> вызова себя — значит она на спуске. Число " + k + " уже на экране.",
            en:"The print sits <b>before</b> the self-call, so it runs on the way down. The " + k + " is already on screen."}
         : {ru:"Печатается " + k + ". Каждый вызов печатает <b>своё</b> <code>n</code>, чужие ему не видны.",
            en:"The " + k + " is printed. Each call prints <b>its own</b> <code>n</code>; the others are invisible to it."}});
     steps.push({line:5, vars:vars(d), stack:stack(d), out:out,
       note: d === 1
         ? {ru:"Вызов себя с аргументом " + (k - 1) + ". Текущий вызов не заканчивается — он останавливается здесь и ждёт возврата.",
            en:"A self-call with argument " + (k - 1) + ". The current call does not finish — it pauses here and waits for the return."}
         : {ru:"Вызов себя с аргументом " + (k - 1) + ". Теперь ждут " + d + " незакрытых " + cRu(d) + ".",
            en:"A self-call with argument " + (k - 1) + ". " + d + " unfinished " + cEn(d) + " are now waiting."}});
   }

   steps.push({line:1, vars:vars(n + 1), stack:stack(n + 1), out:out,
     note:{ru:"<code>n</code> стало нулём — условие остановки сработало. Спуск закончен, одновременно живут " + (n + 1) + " " + cRu(n + 1) + ".",
           en:"<code>n</code> is zero — the stop condition fired. The descent is over, and " + (n + 1) + " " + cEn(n + 1) + " are alive at once."}});
   steps.push({line:2, vars:vars(n + 1), stack:stack(n + 1), out:out,
     note:{ru:"<code>return</code> без вызова себя. Самый глубокий вызов закончился, его копия <code>n</code> исчезла.",
           en:"A <code>return</code> with no self-call. The deepest call is done and its copy of <code>n</code> is gone."}});

   for(d = n; d >= 1; d--){
     steps.push({line:6, vars:vars(d), stack:stack(d), out:out,
       note: d === n
         ? {ru:"Управление вернулось в вызов №" + d + ", на строку после <code>down(n - 1)</code>. После неё ничего нет — он тоже заканчивается.",
            en:"Control is back in call " + d + ", on the line after <code>down(n - 1)</code>. Nothing follows it, so this call ends too."}
         : (d === 1
            ? {ru:"Закончился вызов №2, и следом заканчивается самый первый — тот, что запустил всю цепочку. Управление возвращается в <code>main</code>.",
               en:"Call 2 has finished, and right behind it the very first one ends — the call that started the whole chain. Control goes back to <code>main</code>."}
            : {ru:"Закончился вызов №" + (d + 1) + ". Управление в вызове №" + d + ", и после <code>down(n - 1)</code> в нём тоже ничего нет — он заканчивается следом.",
               en:"Call " + (d + 1) + " has finished. Control is in call " + d + ", and after <code>down(n - 1)</code> there is nothing there either — it ends next."})});
   }

   steps.push({line:10, vars:[["n","—","no live calls"]], stack:["main()"], out:out,
     note:{ru:"Программа дошла до конца. Печать шла на спуске, поэтому порядок прямой: " + (n === 1 ? "напечаталось одно число." : "от " + n + " до 1."),
           en:"The program is done. Printing happened on the way down, so the order is direct: " + (n === 1 ? "one number was printed." : n + " down to 1.")}});
   return steps;
 }
},
{
 name:{ru:"Подъём: печать после вызова", en:"Back up: print after the call"},
 params:[{key:"n", label:{ru:"старт", en:"start"}, min:1, max:6, def:2}],
 code: function(p){
   return ["func down(n int) {","\tif n == 0 {","\t\treturn","\t}","\tdown(n - 1)","\tfmt.Println(n)","}","","func main() {","\tdown(" + p.n + ")","}"];
 },
 steps: function(p){
   var n = +p.n, steps = [], out = "", d, k;
   function vars(depth){
     var v = [], i;
     for(i = 0; i < depth; i++) v.push(["n", String(n - i), "int · call " + (i + 1)]);
     return v;
   }
   function stack(depth){
     var s = ["main()"], i;
     for(i = 0; i < depth; i++) s.push("down(" + (n - i) + ")");
     return s;
   }
   function cRu(k){ return k === 1 ? "вызов" : (k < 5 ? "вызова" : "вызовов"); }
   function cEn(k){ return k === 1 ? "call" : "calls"; }

   steps.push({line:9, vars:vars(1), stack:stack(1), out:out,
     note:{ru:"Тот же код, две строки переставлены местами. Снова <code>down(" + n + ")</code>.",
           en:"The same code with two lines swapped. <code>down(" + n + ")</code> again."}});

   for(d = 1; d <= n; d++){
     k = n - d + 1;
     steps.push({line:1, vars:vars(d), stack:stack(d), out:out,
       note: d === 1
         ? {ru:"Проверка остановки на месте — она всегда первая. " + k + " не ноль.",
            en:"The stop check is where it belongs — always first. " + k + " is not zero."}
         : {ru:"Вызов №" + d + ", своя копия <code>n</code> = " + k + ". Экран всё ещё пуст.",
            en:"Call " + d + ", its own copy of <code>n</code> = " + k + ". The screen is still empty."}});
     steps.push({line:4, vars:vars(d), stack:stack(d), out:out,
       note: d === 1
         ? {ru:"Сразу вызов себя с аргументом " + (k - 1) + ". На экране пусто: печать теперь ниже и ещё не выполнялась.",
            en:"Straight to the self-call with argument " + (k - 1) + ". The screen is empty: the print is below and hasn't run yet."}
         : {ru:"Вызов себя с аргументом " + (k - 1) + ". Начато " + (d + 1) + " " + cRu(d + 1) + ", и ни один ничего не напечатал.",
            en:"A self-call with argument " + (k - 1) + ". " + (d + 1) + " " + cEn(d + 1) + " have started and none has printed anything."}});
   }

   steps.push({line:1, vars:vars(n + 1), stack:stack(n + 1), out:out,
     note:{ru:"Остановка сработала на нуле. Экран пуст, а вызовов уже " + (n + 1) + ".",
           en:"The stop fired at zero. The screen is empty and there are already " + (n + 1) + " calls."}});
   steps.push({line:2, vars:vars(n + 1), stack:stack(n + 1), out:out,
     note:{ru:"<code>return</code> — самый глубокий вызов закончился, так ничего и не напечатав.",
           en:"<code>return</code> — the deepest call finished without printing anything."}});

   for(d = n; d >= 1; d--){
     k = n - d + 1;
     out += k + "\n";
     steps.push({line:5, vars:vars(d), stack:stack(d), out:out,
       note: d === n
         ? {ru:"Подъём. Вызов №" + d + " продолжает со своим <code>n</code> = " + k + " и печатает его — это число выходит первым.",
            en:"The way back. Call " + d + " resumes with its own <code>n</code> = " + k + " and prints it — that number comes out first."}
         : (d === 1
            ? {ru:"Первый вызов печатает своё <code>n</code> = " + k + " — последним. Оно всё это время лежало нетронутым.",
               en:"The first call prints its <code>n</code> = " + k + " — last. It lay untouched the whole time."}
            : {ru:"Вызов №" + d + " печатает своё <code>n</code> = " + k + ". Подъём идёт строго против порядка спуска.",
               en:"Call " + d + " prints its own <code>n</code> = " + k + ". The way back runs strictly against the order of the descent."})});
     steps.push({line:6, vars: d > 1 ? vars(d - 1) : [["n","—","no live calls"]], stack:stack(d - 1), out:out,
       note: d > 1
         ? {ru:"Вызов №" + d + " закончился. Управление вернулось в вызов №" + (d - 1) + ".",
            en:"Call " + d + " is done. Control is back in call " + (d - 1) + "."}
         : {ru:"Вызов №1 закончился — после печати в функции больше ничего нет. Управление вернулось в <code>main</code>.",
            en:"Call 1 is done — after the print there is nothing left in the function. Control is back in <code>main</code>."}});
   }

   steps.push({line:10, vars:[["n","—","no live calls"]], stack:["main()"], out:out,
     note: n === 1
       ? {ru:"Число всего одно, переворачивать нечего. Поставь старт побольше — и станет видно, что порядок вывода стал обратным.",
          en:"There is only one number, so there is nothing to flip. Raise the start and you will see the output order come out backwards."}
       : {ru:"Порядок перевернулся: от 1 до " + n + ". Единственное отличие от прошлого сценария — печать стоит после вызова себя.",
          en:"The order flipped: 1 up to " + n + ". The only difference from the previous scenario is that the print sits after the self-call."}});
   return steps;
 }
},
{
 name:{ru:"Возврат значения", en:"Returning a value"},
 params:[{key:"n", label:{ru:"n", en:"n"}, min:1, max:6, def:3},
         {key:"base", label:{ru:"дно", en:"bottom"}, values:["0","1"], def:"0"}],
 code: function(p){
   return ["func sum(n int) int {","\tif n == 0 {","\t\treturn " + p.base,"\t}","\treturn n + sum(n-1)","}","","func main() {","\tfmt.Println(sum(" + p.n + "))","}"];
 },
 steps: function(p){
   var n = +p.n, b = +p.base, steps = [], out = "", i, d, k;
   var CT = {ru:"Что вернул вызов sum(индекс)", en:"What sum(index) returned"};
   var val = [], known = [];
   for(i = 0; i <= n; i++){ val.push(i === 0 ? b : val[i - 1] + i); known.push("?"); }
   var right = n * (n + 1) / 2;
   function cells(){ return known.slice(); }
   function vars(depth){
     var v = [], i;
     for(i = 0; i < depth; i++) v.push(["n", String(n - i), "int · call " + (i + 1)]);
     return v;
   }
   function stack(depth){
     var s = ["main()"], i;
     for(i = 0; i < depth; i++) s.push("sum(" + (n - i) + ")");
     return s;
   }

   steps.push({line:8, vars:vars(1), stack:stack(1), cells:cells(), cellsTitle:CT, out:out,
     note:{ru:"Вызов <code>sum(" + n + ")</code>. Печатать пока нечего: <code>Println</code> ждёт число.",
           en:"The call <code>sum(" + n + ")</code>. Nothing to print yet: <code>Println</code> is waiting for a number."}});

   for(d = 1; d <= n; d++){
     k = n - d + 1;
     steps.push({line:1, vars:vars(d), stack:stack(d), cells:cells(), cellsTitle:CT, out:out,
       note: d === 1
         ? {ru:"Первая выполненная строка вызова №1 — проверка остановки: <code>n == 0</code>, то есть " + k + " == 0. Неверно, значит остановка не срабатывает и идём дальше.",
            en:"The first line call 1 executes is the stop check: <code>n == 0</code>, that is " + k + " == 0. False, so the stop does not fire and we carry on."}
         : {ru:"Начался вызов №" + d + " со своей копией <code>n</code> = " + k + ". Проверка остановки снова первая: " + k + " == 0 — неверно, идём дальше.",
            en:"Call " + d + " has begun with its own copy of <code>n</code> = " + k + ". The stop check comes first again: " + k + " == 0 — false, we carry on."}});
     steps.push({line:4, vars:vars(d), stack:stack(d), cells:cells(), cellsTitle:CT, out:out,
       note: d === 1
         ? {ru:"Строка одна, но целиком выполниться не может: чтобы сложить, нужен результат <code>sum(" + (k - 1) + ")</code>. Число " + k + " ждёт.",
            en:"One line, but it cannot complete: to add, it needs the result of <code>sum(" + (k - 1) + ")</code>. The " + k + " waits."}
         : (d === n
            ? {ru:"Вызов №" + d + ", <code>n</code> = " + k + ". Ни одного сложения ещё не сделано — вся арифметика отложена на подъём.",
               en:"Call " + d + ", <code>n</code> = " + k + ". Not a single addition has happened yet — all the arithmetic is deferred to the way back."}
            : {ru:"Вызов №" + d + " дошёл до той же строки и упёрся в свой вызов себя.",
               en:"Call " + d + " reached the same line and hit its own self-call."})});
   }

   steps.push({line:1, vars:vars(n + 1), stack:stack(n + 1), cells:cells(), cellsTitle:CT, out:out,
     note:{ru:"Вызов №" + (n + 1) + " получил ноль. Та же самая проверка, но теперь <code>n == 0</code> — верно, и остановка наконец срабатывает.",
           en:"Call " + (n + 1) + " got zero. The same check as before, but now <code>n == 0</code> is true and the stop finally fires."}});

   known[0] = String(val[0]);
   steps.push({line:2, vars:vars(n + 1), stack:stack(n + 1), cells:cells(), cellsOn:[0], cellsTitle:CT, out:out,
     note: b === 0
       ? {ru:"<code>return 0</code>. Это то самое значение, с которого начнётся обратный ход. Будь тут 1 — весь ответ съехал бы на единицу.",
          en:"<code>return 0</code>. This is the value the way back starts from. Put 1 here and the whole answer shifts by one."}
       : {ru:"<code>return 1</code>. Дно вернуло единицу, хотя складывать на нуле нечего. Эта единица приплюсуется ко всему, что посчитается выше.",
          en:"<code>return 1</code>. The bottom returned one, though at zero there is nothing to add. That one gets added to everything computed above."}});

   for(k = 1; k <= n; k++){
     var v = vars(n - k), r = ["sum(" + k + ")", String(val[k]), "return"];
     v.push(r);
     known[k] = String(val[k]);
     steps.push({line:4, vars:v, stack:stack(n - k + 1), cells:cells(), cellsOn:[k], cellsTitle:CT, out:out,
       note: k === 1
         ? {ru:"Подъём. Самый глубокий счётный вызов получил " + val[0] + " и досчитал: 1 + " + val[0] + " = " + val[1] + ".",
            en:"The way back. The deepest computing call got " + val[0] + " and finished its sum: 1 + " + val[0] + " = " + val[1] + "."}
         : (k === n
            ? {ru:"Первый вызов: " + k + " + " + val[k - 1] + " = " + val[k] + ". Все сложения прошли на подъёме, снизу вверх.",
               en:"The first call: " + k + " + " + val[k - 1] + " = " + val[k] + ". Every addition happened on the way back, bottom-up."}
            : {ru:"Вызов <code>sum(" + k + ")</code> сложил своё <code>n</code> с тем, что пришло снизу: " + k + " + " + val[k - 1] + " = " + val[k] + ".",
               en:"The call <code>sum(" + k + ")</code> added its own <code>n</code> to what came from below: " + k + " + " + val[k - 1] + " = " + val[k] + "."})});
   }

   out += val[n] + "\n";
   steps.push({line:8, vars:[["sum(" + n + ")", String(val[n]), "return"]], stack:["main()"], cells:cells(), cellsOn:[n], cellsTitle:CT, out:out,
     note: b === 0
       ? {ru:"Только теперь <code>Println</code> получил число и напечатал его: сумма от 1 до " + n + " равна " + val[n] + ".",
          en:"Only now does <code>Println</code> have a number to print: the sum from 1 to " + n + " is " + val[n] + "."}
       : {ru:"На экране " + val[n] + ", а сумма от 1 до " + n + " равна " + right + ". Лишнюю единицу дало дно — значение остановки входит в ответ.",
          en:"The screen shows " + val[n] + ", while the sum from 1 to " + n + " is " + right + ". The extra one came from the bottom — the stop's value is part of the answer."}});
   return steps;
 }
},
{
 name:{ru:"Остановки нет", en:"No stop at all"},
 params:[{key:"n", label:{ru:"старт", en:"start"}, min:1, max:5, def:2},
         {key:"step", label:{ru:"шаг", en:"step"}, values:["n - 1","n - 2","n"], def:"n - 1"}],
 code: function(p){
   return ["func down(n int) {","\tfmt.Println(n)","\tdown(" + p.step + ")","}","","func main() {","\tdown(" + p.n + ")","}"];
 },
 steps: function(p){
   var n = +p.n, dec = (p.step === "n") ? 0 : (p.step === "n - 2" ? 2 : 1);
   var steps = [], out = "", vals = [], i;
   for(i = 0; i < 6; i++) vals.push(n - dec * i);
   function vars(depth){
     var v = [], i;
     for(i = 0; i < depth; i++) v.push(["n", String(vals[i]), "int · call " + (i + 1)]);
     return v;
   }
   function stack(depth){
     var s = ["main()"], i;
     for(i = 0; i < depth; i++) s.push("down(" + vals[i] + ")");
     return s;
   }

   steps.push({line:6, vars:vars(1), stack:stack(1), out:out,
     note:{ru:"Условие остановки просто забыли — в функции его нет. Компилятор на это не жалуется.",
           en:"The stop condition was simply forgotten — there is none in the function. The compiler doesn't mind."}});

   for(i = 0; i < 4; i++){
     out += vals[i] + "\n";
     steps.push({line:1, vars:vars(i + 1), stack:stack(i + 1), out:out,
       note: i === 0
         ? {ru:"Число " + vals[0] + " напечаталось. Пока всё выглядит нормально.",
            en:"The " + vals[0] + " is printed. So far everything looks fine."}
         : (dec === 0
            ? {ru:"Снова " + vals[i] + ": аргумент не изменился, и каждый следующий вызов получает ровно то же самое.",
               en:"Another " + vals[i] + ": the argument did not change, so every next call gets exactly the same value."}
            : {ru:"Вызов №" + (i + 1) + " печатает " + vals[i] + ". Останавливать некому — проверки в функции нет.",
               en:"Call " + (i + 1) + " prints " + vals[i] + ". There is nothing to stop it — the function has no check."})});
     steps.push({line:2, vars:vars(i + 1), stack:stack(i + 1), out:out,
       note: dec === 0
         ? {ru:"Вызов себя с тем же <code>n</code> = " + vals[i + 1] + ". Приближаться некуда и не к чему.",
            en:"A self-call with the same <code>n</code> = " + vals[i + 1] + ". There is nowhere and nothing to approach."}
         : {ru:"Вызов себя с аргументом " + vals[i + 1] + ". Проверять нечего — проверки нет.",
            en:"A self-call with argument " + vals[i + 1] + ". Nothing gets checked — there is no check."}});
   }

   out += vals[4] + "\n…";
   steps.push({line:2,
     vars:[["n","…","int · calls 1…4"],["n",String(vals[4]),"int · call 5"],["…","…","millions of calls"]],
     stack:stack(5).concat(["…"]), out:out,
     note:{ru:"Каждый незакрытый вызов занимает память, и все они живы одновременно. Через доли секунды: <code>runtime: goroutine stack exceeds 1000000000-byte limit</code>, затем <code>fatal error: stack overflow</code>." +
              (dec === 0 ? " Здесь видно вторую половину правила: аргумент обязан меняться, иначе никакая остановка не спасёт." : " Аргумент уменьшается честно, но проверять его негде — остановки в функции нет."),
           en:"Every unfinished call takes memory, and they are all alive at once. In a fraction of a second: <code>runtime: goroutine stack exceeds 1000000000-byte limit</code>, then <code>fatal error: stack overflow</code>." +
              (dec === 0 ? " This shows the other half of the rule: the argument has to change, otherwise no stop would help." : " The argument shrinks honestly, but there is nowhere to test it — the function has no stop.")}});
   return steps;
 }
},
{
 name:{ru:"Два вызова: фибоначчи", en:"Two calls: Fibonacci"},
 params:[{key:"n", label:{ru:"n", en:"n"}, min:2, max:5, def:3}],
 code: function(p){
   return ["func fib(n int) int {","\tif n < 2 {","\t\treturn n","\t}","\treturn fib(n-1) + fib(n-2)","}","","func main() {","\tfmt.Println(fib(" + p.n + "))","}"];
 },
 steps: function(p){
   var n = +p.n, steps = [], path = [], counts = [], calls = 1, i;
   var CT = {ru:"Сколько раз посчитан fib(индекс)", en:"How many times fib(index) was computed"};
   for(i = 0; i <= n; i++) counts.push(0);
   counts[n] = 1;
   function cells(){
     var r = [], i;
     for(i = 0; i < counts.length; i++) r.push(String(counts[i]));
     return r;
   }
   function stack(){
     var s = ["main()"], i;
     for(i = 0; i < path.length; i++) s.push("fib(" + path[i].k + ")" + (path[i].side ? " [" + path[i].side + "]" : ""));
     return s;
   }
   function vars(cut){
     var v = [], i, last = path.length - (cut ? 1 : 0);
     for(i = 0; i < last; i++) v.push(["n", String(path[i].k), "int · fib(" + path[i].k + ")"]);
     return v;
   }
   function sideRu(s){ return s === "n-1" ? "Левая половина. " : (s === "n-2" ? "Правая половина. " : ""); }
   function sideEn(s){ return s === "n-1" ? "The left half. " : (s === "n-2" ? "The right half. " : ""); }
   function cRu(k){ return k === 1 ? "вызов" : (k % 10 === 1 && k !== 11 ? "вызов" : (k % 10 > 1 && k % 10 < 5 && (k < 10 || k > 20) ? "вызова" : "вызовов")); }
   function razRu(k){ return (k % 10 > 1 && k % 10 < 5 && (k < 10 || k > 20)) ? "раза" : "раз"; }
   function timeEn(k){ return k === 1 ? "time" : "times"; }

   function gen(k, side, root){
     path.push({k:k, side:side});
     if(!root) counts[k]++;
     if(!root) calls++;
     var again = counts[k] > 1;
     var moreRu = again ? " Это значение уже считали — идёт " + counts[k] + "-й раз за запуск." : "";
     var moreEn = again ? " This value was computed before — this is time " + counts[k] + " in one run." : "";

     // Проверка остановки выполняется в КАЖДОМ вызове и стоит первой строкой.
     steps.push({line:1, vars:vars(false), stack:stack(), cells:cells(), cellsOn:[k], cellsTitle:CT, out:"",
       note: k < 2
         ? {ru:sideRu(side) + "Начался вызов <code>fib(" + k + ")</code>, и первой выполняется проверка остановки: <code>n &lt; 2</code> — это " + k + " &lt; 2, верно. Остановка сработала." + moreRu,
            en:sideEn(side) + "The call <code>fib(" + k + ")</code> has begun and the stop check runs first: <code>n &lt; 2</code> — that is " + k + " &lt; 2, true. The stop fires." + moreEn}
         : (root
            ? {ru:"Первая выполненная строка <code>fib(" + k + ")</code> — проверка остановки: <code>n &lt; 2</code>, то есть " + k + " &lt; 2. Неверно, значит вниз по обеим веткам.",
               en:"The first line <code>fib(" + k + ")</code> executes is the stop check: <code>n &lt; 2</code>, that is " + k + " &lt; 2. False, so we go down both branches."}
            : {ru:sideRu(side) + "Начался вызов <code>fib(" + k + ")</code>, и первой выполняется проверка остановки: <code>n &lt; 2</code> — это " + k + " &lt; 2, неверно. Остановка не сработала." + moreRu,
               en:sideEn(side) + "The call <code>fib(" + k + ")</code> has begun and the stop check runs first: <code>n &lt; 2</code> — that is " + k + " &lt; 2, false. The stop does not fire." + moreEn})});

     if(k < 2){
       steps.push({line:2, vars:vars(false), stack:stack(), cells:cells(), cellsOn:[k], cellsTitle:CT, out:"",
         note:{ru:"<code>return " + k + "</code> — вызов <code>fib(" + k + ")</code> закончился, ничего больше не вызвав. Это дно ветки.",
               en:"<code>return " + k + "</code> — the call <code>fib(" + k + ")</code> is over without calling anything. This is the bottom of the branch."}});
       path.pop();
       return k;
     }

     steps.push({line:4, vars:vars(false), stack:stack(), cells:cells(), cellsOn:[k], cellsTitle:CT, out:"",
       note: root
         ? {ru:"В строке два вызова себя. Go выполняет их по очереди: сначала весь левый — <code>fib(" + (k - 1) + ")</code>.",
            en:"Two self-calls in one line. Go runs them in order: the whole left one first — <code>fib(" + (k - 1) + ")</code>."}
         : {ru:sideRu(side) + "<code>fib(" + k + ")</code> дошёл до той же строки и запускает свой левый вызов — <code>fib(" + (k - 1) + ")</code>.",
            en:sideEn(side) + "<code>fib(" + k + ")</code> reached the same line and starts its own left call — <code>fib(" + (k - 1) + ")</code>."}});
     var a = gen(k - 1, "n-1", false);

     var vm = vars(false);
     vm.push(["fib(" + (k - 1) + ")", String(a), "return"]);
     steps.push({line:4, vars:vm, stack:stack(), cells:cells(), cellsOn:[k - 1], cellsTitle:CT, out:"",
       note:{ru:"Левый вызов вернул " + a + ". Та же строка, второй её вызов: только теперь запускается правый — <code>fib(" + (k - 2) + ")</code>.",
             en:"The left call returned " + a + ". Same line, its second call: only now does the right one start — <code>fib(" + (k - 2) + ")</code>."}});
     var b = gen(k - 2, "n-2", false);

     var r = a + b;
     var v = vars(true);
     v.push(["fib(" + k + ")", String(r), "return"]);
     steps.push({line:4, vars:v, stack:stack(), cells:cells(), cellsOn:[k], cellsTitle:CT, out:"",
       note:{ru:"Обе половины вернулись, и только теперь строка досчиталась: <code>fib(" + k + ")</code> = " + a + " + " + b + " = " + r + "." + (root ? " Ответ готов." : ""),
             en:"Both halves are back and only now can the line finish: <code>fib(" + k + ")</code> = " + a + " + " + b + " = " + r + "." + (root ? " The answer is ready." : "")}});
     path.pop();
     return r;
   }

   path.push({k:n, side:null});
   steps.push({line:8, vars:vars(false), stack:stack(), cells:cells(), cellsOn:[n], cellsTitle:CT, out:"",
     note:{ru:"Вызов <code>fib(" + n + ")</code>. Считаем вызовы — их будет больше, чем кажется.",
           en:"The call <code>fib(" + n + ")</code>. Count the calls — there will be more than you expect."}});
   path.pop();

   var res = gen(n, null, true);

   var hot = 0;
   for(i = 0; i < counts.length; i++) if(counts[i] > counts[hot]) hot = i;
   var hotRu = counts[hot] > 1
     ? " Чаще всего пересчитывался <code>fib(" + hot + ")</code> — " + counts[hot] + " " + razRu(counts[hot]) + "."
     : " Повторов пока нет: каждое значение посчитано по одному разу.";
   var hotEn = counts[hot] > 1
     ? " The most recomputed value was <code>fib(" + hot + ")</code> — " + counts[hot] + " " + timeEn(counts[hot]) + "."
     : " No repeats yet: every value was computed exactly once.";
   steps.push({line:8, vars:[["fib(" + n + ")", String(res), "return"]], stack:["main()"], cells:cells(), cellsOn:[hot], cellsTitle:CT, out:res + "\n",
     note:{ru:"Ответ " + res + ", потрачено " + calls + " " + cRu(calls) + " вместо " + n + " шагов." + hotRu + " Для <code>fib(25)</code> вызовов уже 242 785 — повторы множатся с каждым шагом.",
           en:"The answer is " + res + ", at the cost of " + calls + " calls instead of " + n + " steps." + hotEn + " For <code>fib(25)</code> it is already 242,785 calls — the repeats multiply at every step."}});
   return steps;
 }
}
];

var OUTRO = {
 ru:`<p>Все семь правил выросли из одного факта: вызов себя — обычный вызов, и он не заканчивает текущую функцию, а ставит её на паузу. Раз вызовы начинаются и не заканчиваются, кто-то должен перестать начинать новые — отсюда остановка. Раз остановка смотрит на значение, шаг обязан двигать именно это значение — отсюда требование к аргументу. Раз текущий вызов стоит на паузе, всё написанное после вызова ждёт возврата — отсюда спуск и подъём, и отсюда же форма <code>return n + sum(n-1)</code>: сложение не может произойти раньше, чем придёт второе слагаемое. Раз каждый ждущий вызов держит свои параметры — значение на подъёме находится само, а память кончается, если ждущих слишком много. Последнее правило ничего нового не вводит, оно показывает цену второго вызова себя в строке.</p>
<p>Что ты теперь умеешь: написать функцию, которая уходит на заранее неизвестную глубину и возвращается с ответом — суммой, произведением, суммой цифр, перевёрнутой строкой; поменять порядок вывода переносом одной строки; прочитать <code>fatal error: stack overflow</code> как конкретную поломку, а не как «что-то сломалось»; разобрать чужую рекурсию, подставив самый маленький вход или вставив печать на входе и на выходе.</p>
<p>Если из темы забудется всё, кроме одной мысли, пусть останется эта: <strong>вызов себя не заканчивает функцию, а ставит её на паузу — и она продолжится с того же места и со своими значениями</strong>. Отсюда выводится и обратный порядок на подъёме, и то, почему арифметика идёт снизу вверх, и то, почему без остановки кончается память.</p>
<p>А когда рекурсия ведёт себя не так, вопросов ровно три, и всегда в этом порядке: где она останавливается, приближается ли аргумент к остановке, по какую сторону от вызова стоит работа.</p>`,
 en:`<p>All seven rules grew out of one fact: a self-call is an ordinary call, and it does not finish the current function — it pauses it. Since calls keep starting and none finishes, something has to stop starting new ones: that is the stop condition. Since the stop looks at a value, the step has to move that exact value: that is the requirement on the argument. Since the current call is paused, everything written after the call waits for the return: that is the way down and the way back, and it is also why <code>return n + sum(n-1)</code> has the shape it does — the addition cannot happen before the second operand arrives. Since every waiting call keeps its own parameters, the value on the way back is simply there, and memory runs out when too many calls are waiting. The last rule introduces nothing new; it shows the price of a second self-call in the line.</p>
<p>What you can do now: write a function that descends to a depth you don't know in advance and comes back with an answer — a sum, a product, a digit sum, a reversed string; flip the output order by moving one line; read <code>fatal error: stack overflow</code> as a specific defect rather than "something broke"; and take apart someone else's recursion by plugging in the smallest input or adding a print on the way in and on the way out.</p>
<p>If everything from this topic fades except one thought, let it be this: <strong>a self-call does not end the function, it pauses it — and the function resumes at the same place with its own values</strong>. From there follow the reversed order on the way back, why the arithmetic runs bottom-up, and why memory runs out without a stop.</p>
<p>And when a recursion misbehaves, there are exactly three questions, always in this order: where does it stop, does the argument approach that stop, and which side of the call is the work on.</p>`
};
