var META = {
  n: 3,
  slug: "03-functions",
  eyebrow:{ru:"Go с нуля · тема 3 из 13", en:"Go from zero · topic 3 of 13"},
  title:  {ru:"Функции и return", en:"Functions and return"},
  lede:{
    ru:"Пока <code>fmt.Println</code> и <code>return</code> кажутся одним и тем же, всё сложнее одной строки разваливается: программа печатает правильные числа и при этом не работает.",
    en:"While <code>fmt.Println</code> and <code>return</code> feel like the same thing, anything bigger than one line falls apart: the program prints the right numbers and still doesn't work."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=21197s",
    t:{ru:"Курс по Go — глава «Функции» (5:53:17)", en:"Go course — the “Functions” chapter (5:53:17)"},
    d:{ru:"Объявление, параметры и возвращаемые значения.", en:"Declarations, parameters and return values."}},
  folder: "func1",
  txt: {ru:"go-tema-03-funkcii-i-return.txt", en:"go-topic-03-functions-and-return.txt"}
};

/* ================= О ЧЁМ ТЕМА ================= */
var INTRO = {
 ru:`<p>До этой темы вся программа помещалась в один <code>main</code>: строки шли сверху вниз, и каждая делала своё дело. Так пишется десяток строк. Дальше это перестаёт работать — не потому, что код становится сложнее, а потому что кусок, который считает что-то нужное, нельзя ни назвать, ни повторить, ни проверить отдельно от всего остального.</p>
<p>Функция решает ровно это. Ты один раз описываешь кусок работы, даёшь ему имя — и дальше вызываешь по имени сколько угодно раз, каждый раз с другими числами. После этой темы ты сможешь разбить программу на части, которые проверяются по одной; передать в такую часть данные; и — это главное — забрать у неё результат, чтобы работать с ним дальше.</p>
<p>Вот место, где без этого всё встаёт. Две функции считают одно и то же:</p>
<pre><code>func showSum(a int, b int) {
	fmt.Println(a + b)
}

func sum(a int, b int) int {
	return a + b
}</code></pre>
<p>Обе умеют выдать на экран <code>5</code>: первая сама, вторая — через <code>fmt.Println(sum(2, 3))</code>. Но строка <code>x := sum(2, 3)</code> работает, а <code>x := showSum(2, 3)</code> даже не соберётся. Пока эта разница не видна, получается программа, которая печатает правильные числа и при этом ничего не умеет: посчитанное некуда деть.</p>
<p>Порядок дальше такой. Сначала — как функция устроена и что происходит в момент вызова; из этого сразу выпадает разница между печатью и возвратом. Потом — что именно попадает в параметры (копия, а не твоя переменная) и почему из-за этого функция «не меняет» то, что ей дали. Потом вторая половина работы <code>return</code>: он не только отдаёт значение, но и заканчивает функцию, и это решает, куда его ставить в цикле. Оттуда сам собой встаёт вопрос, где живут переменные и почему накопитель объявляют до цикла. В конце — два случая, которые ломают привычку «одна функция — одно значение»: возвращать можно несколько значений сразу, а можно и вообще ничего.</p>`,
 en:`<p>Until now the whole program fit inside one <code>main</code>: lines ran top to bottom, each doing its bit. That is fine for a dozen lines. Past that it stops working — not because the code gets harder, but because a chunk that computes something useful cannot be named, cannot be reused, and cannot be checked apart from everything else.</p>
<p>A function solves exactly that. You describe a piece of work once, give it a name, and from then on call it by name as often as you like, with different numbers each time. After this topic you will be able to split a program into parts that can be checked one at a time, feed data into such a part, and — this is the point — take its result back out and keep working with it.</p>
<p>Here is where things stall without it. Two functions compute the same thing:</p>
<pre><code>func showSum(a int, b int) {
	fmt.Println(a + b)
}

func sum(a int, b int) int {
	return a + b
}</code></pre>
<p>Both can put <code>5</code> on the screen: the first one by itself, the second through <code>fmt.Println(sum(2, 3))</code>. But the line <code>x := sum(2, 3)</code> works, while <code>x := showSum(2, 3)</code> does not even compile. Until you can see that difference, you get a program that prints the right numbers and still can do nothing: there is nowhere to put what it computed.</p>
<p>The order from here. First, how a function is built and what happens at the moment of a call — the difference between printing and returning falls straight out of that. Then what actually lands in the parameters (a copy, not your variable) and why a function therefore “does not change” what you gave it. Then the second half of what <code>return</code> does: it hands back a value and also ends the function, and that decides where to put it inside a loop. From there the next question arrives on its own — where variables live and why the accumulator is declared before the loop. At the end, two cases that break the habit of “one function, one value”: you can return several values at once, or none at all.</p>`
};

/* ================= ПРАВИЛА ================= */
var RULES = [
{
 h:{ru:"Функцию объявляют один раз, вызывают сколько угодно",
    en:"A function is declared once and called as many times as you like"},
 b:{ru:`<p>Функция — это кусок кода, у которого есть имя, и рядом написано, что в него входит и что из него выходит. Всё это стоит в первой строке:</p>
<pre><code>func sum(a int, b int) int {
	return a + b
}</code></pre>
<p>Читается слева направо: слово <code>func</code>, имя <code>sum</code>, в круглых скобках — что функция принимает, после скобок — что отдаёт, в фигурных — сама работа. Параметры одного типа можно записать короче: <code>func sum(a, b int) int</code>. Это ровно та же функция, просто запись компактнее.</p>
<p><code>a</code> и <code>b</code> — не конкретные числа. Это имена, под которыми функция будет обращаться к тому, что ей дадут при вызове. Значения подставляются строго по порядку, имена при вызове не пишут:</p>
<pre><code>sum(2, 3)   <span class="cm">// a = 2, b = 3</span>
sum(3, 2)   <span class="cm">// a = 3, b = 2</span></code></pre>
<p>Поэтому <code>sum(2, 10)</code> и <code>sum(10, 2)</code> — два разных вызова, хотя числа одни и те же.</p>
<p>Объявить функцию и выполнить её — разные вещи. Файл с функциями это набор описаний, ни одно из них само по себе не работает. Программа начинает с <code>main</code>, и <code>sum</code> сработает только тогда, когда кто-то уже работающий напишет <code>sum(2, 3)</code>. Не вызвал — она просто лежит в файле, и компилятор об этом даже не заикнётся: неиспользованная функция ошибкой не считается, в отличие от неиспользованной переменной.</p>
<p>Порядок в файле роли не играет: <code>main</code> спокойно вызывает функцию, написанную ниже. Компилятор сначала прочитывает файл целиком и только потом собирает.</p>
<p>А вот количество аргументов должно совпасть точно. <code>sum(2)</code> даст <code>not enough arguments in call to sum</code>, <code>sum(2, 3, 4)</code> — <code>too many arguments in call to sum</code>. Первая строка функции не пожелание, а требование.</p>`,
    en:`<p>A function is a chunk of code with a name, and next to the name it says what goes in and what comes out. All of that sits in the first line:</p>
<pre><code>func sum(a int, b int) int {
	return a + b
}</code></pre>
<p>Read it left to right: the word <code>func</code>, the name <code>sum</code>, in parentheses what it takes, after the parentheses what it gives back, in braces the work itself. Parameters of the same type can be written shorter: <code>func sum(a, b int) int</code>. Exactly the same function, just a tighter spelling.</p>
<p><code>a</code> and <code>b</code> are not particular numbers. They are the names the function will use for whatever it is handed at the call. Values are filled in strictly by position; names are not written at the call site:</p>
<pre><code>sum(2, 3)   <span class="cm">// a = 2, b = 3</span>
sum(3, 2)   <span class="cm">// a = 3, b = 2</span></code></pre>
<p>So <code>sum(2, 10)</code> and <code>sum(10, 2)</code> are two different calls even though the numbers are the same.</p>
<p>Declaring a function and running it are different things. A file of functions is a set of descriptions; none of them does anything on its own. The program starts at <code>main</code>, and <code>sum</code> only runs once something already running writes <code>sum(2, 3)</code>. Never called, it just sits in the file, and the compiler will not even mention it: an unused function is not an error, unlike an unused variable.</p>
<p>Order in the file does not matter: <code>main</code> can call a function written below it. The compiler reads the whole file first and builds afterwards.</p>
<p>The number of arguments, though, has to match exactly. <code>sum(2)</code> gives <code>not enough arguments in call to sum</code>, and <code>sum(2, 3, 4)</code> gives <code>too many arguments in call to sum</code>. That first line is not a suggestion, it is a requirement.</p>`}
},
{
 h:{ru:"Печать — это не возврат", en:"Printing is not returning"},
 b:{ru:`<p>Функция объявлена и вызвана. Теперь главный вопрос темы: что остаётся от её работы, когда она закончилась.</p>
<p>Две функции считают одно и то же:</p>
<pre><code>func showSum(a int, b int) {
	fmt.Println(a + b)
}

func sum(a int, b int) int {
	return a + b
}</code></pre>
<p>Разница не в вычислении, а в том, кому уходит результат. <code>fmt.Println</code> отправляет число на экран — человеку. Сама программа этого числа не видит: читать свой экран она не умеет, для неё напечатанное просто исчезло. <code>return</code> отдаёт значение в то место, откуда функцию вызвали, то есть обратно в программу. Оттуда его можно положить в переменную, сложить, передать дальше.</p>
<pre><code>x := sum(2, 3)       <span class="cm">// x = 5, с ним можно работать</span>
y := showSum(2, 3)   <span class="cm">// showSum(2, 3) (no value) used as value</span></code></pre>
<p>Вторая строка не соберётся, и ошибка говорит буквально это: у вызова нет значения, а его пытаются использовать как значение. В подписи <code>showSum</code> после круглых скобок ничего не написано — значит, наружу она не отдаёт ничего, и брать нечего.</p>
<p>Обратная ошибка встречается не реже: тип возврата в подписи есть, а в теле только печать.</p>
<pre><code>func sum(a int, b int) int {
	fmt.Println(a + b)   <span class="cm">// missing return</span>
}</code></pre>
<p>Слово <code>int</code> в первой строке — обещание вернуть число. Печать это обещание не выполняет: она отправила значение человеку, а программе не отдала ничего. Компилятор отвечает <code>missing return</code>.</p>
<p>Отсюда привычка, которая дальше экономит много времени: если функция что-то <em>считает</em> — пусть возвращает, а печатает пусть тот, кто её вызвал. Тогда одну и ту же функцию можно и вывести на экран, и подставить внутрь другого вычисления. Функция, которая только печатает, годится ровно на одно: показать и забыть.</p>`,
    en:`<p>The function is declared and called. Now the central question of this topic: what is left of its work once it has finished.</p>
<p>Two functions compute the same thing:</p>
<pre><code>func showSum(a int, b int) {
	fmt.Println(a + b)
}

func sum(a int, b int) int {
	return a + b
}</code></pre>
<p>The difference is not the calculation, it is who receives the result. <code>fmt.Println</code> sends the number to the screen, to a human. The program itself never sees that number: it cannot read its own screen, so as far as it is concerned the printed value is gone. <code>return</code> hands the value to the place the call came from, that is, back into the program. From there you can store it, add it, pass it on.</p>
<pre><code>x := sum(2, 3)       <span class="cm">// x = 5, you can work with it</span>
y := showSum(2, 3)   <span class="cm">// showSum(2, 3) (no value) used as value</span></code></pre>
<p>The second line will not compile, and the error says exactly that: the call has no value, and it is being used as one. <code>showSum</code>'s signature has nothing after the parentheses, so it hands nothing outward and there is nothing to take.</p>
<p>The mirror mistake is just as common: the signature names a return type and the body only prints.</p>
<pre><code>func sum(a int, b int) int {
	fmt.Println(a + b)   <span class="cm">// missing return</span>
}</code></pre>
<p>The word <code>int</code> in the first line is a promise to give back a number. Printing does not keep that promise: it sent the value to a human and handed the program nothing. The compiler answers <code>missing return</code>.</p>
<p>Hence a habit that saves a lot of time later: if a function <em>computes</em> something, let it return, and let whoever called it do the printing. Then the same function serves both for display and inside a bigger calculation. A function that only prints is good for exactly one thing: showing something once and forgetting it.</p>`}
},
{
 h:{ru:"Аргументы копируются при вызове", en:"Arguments are copied on the call"},
 b:{ru:`<p>С тем, что уходит из функции наружу, разобрались. Теперь — что попадает внутрь.</p>
<p>Параметр это не та переменная, которую ты передал. Это новая переменная: она создаётся в момент вызова, живёт до конца функции, и в неё <strong>копируется значение</strong>. Функция работает с копией и до оригинала не дотягивается.</p>
<pre><code>func addTen(n int) {
	n = n + 10
	fmt.Println(n)   <span class="cm">// 15</span>
}

x := 5
addTen(x)
fmt.Println(x)       <span class="cm">// 5 — снаружи ничего не изменилось</span></code></pre>
<p>Внутри 15, снаружи 5 — это не сбой, а ровно то, что должно произойти. Совпадение имён тоже ничего не связывает: назови параметр <code>x</code> — получишь две разные переменные с одинаковым именем.</p>
<p>Польза от этого прямая: вызвав функцию, ты знаешь, что твои переменные она не испортит. Внутри <code>n</code> можно делить, обнулять, гонять по циклу — снаружи от этого ничего не изменится. Это пригодится, когда будешь разбирать число по цифрам: <code>n</code> внутри функции спокойно уменьшается до нуля, а исходное число остаётся целым.</p>
<p>Обратная сторона та же самая: изменение, сделанное внутри, само наружу не выберется. Хочешь, чтобы оно осталось — верни новое значение и присвой его:</p>
<pre><code>func addTen(n int) int {
	return n + 10
}

x = addTen(x)</code></pre>
<p>Одно исключение стоит знать заранее. У слайса копируется не сам набор чисел, а указание, где они лежат. Копия указывает туда же, поэтому <code>nums[0] = 0</code> внутри функции меняет слайс и у того, кто вызвал.</p>`,
    en:`<p>What leaves a function is settled. Now what gets into it.</p>
<p>A parameter is not the variable you passed. It is a new variable: created at the moment of the call, alive until the function ends, and the <strong>value is copied</strong> into it. The function works on the copy and cannot reach the original.</p>
<pre><code>func addTen(n int) {
	n = n + 10
	fmt.Println(n)   <span class="cm">// 15</span>
}

x := 5
addTen(x)
fmt.Println(x)       <span class="cm">// 5 — nothing changed outside</span></code></pre>
<p>Fifteen inside, five outside — not a glitch, exactly what is supposed to happen. Matching names connect nothing either: name the parameter <code>x</code> and you simply get two different variables that share a name.</p>
<p>The upside is direct: calling a function cannot spoil your variables. Inside, <code>n</code> can be divided, zeroed, run through a loop — none of that shows outside. This pays off when you take a number apart digit by digit: <code>n</code> inside the function is ground down to zero while the original number stays whole.</p>
<p>The flip side is the same fact: a change made inside will not walk out on its own. If you want it to stick, return the new value and assign it:</p>
<pre><code>func addTen(n int) int {
	return n + 10
}

x = addTen(x)</code></pre>
<p>One exception is worth knowing in advance. With a slice, what gets copied is not the numbers themselves but a pointer to where they are. The copy points to the same place, so <code>nums[0] = 0</code> inside the function changes the caller's slice too.</p>`}
},
{
 h:{ru:"<code>return</code> немедленно заканчивает функцию", en:"<code>return</code> ends the function immediately"},
 b:{ru:`<p>Теперь вернёмся к самому <code>return</code>. Он делает не одно дело, а два: отдаёт значение и <strong>тут же заканчивает функцию</strong>. Вторая половина обычно и остаётся незамеченной.</p>
<pre><code>func f() int {
	fmt.Print("A")
	return 1
	fmt.Print("B")   <span class="cm">// сюда управление не дойдёт никогда</span>
	return 2
}</code></pre>
<p>Напечатается <code>A1</code>. Не <code>AB1</code> и не <code>A1B</code>: на строке <code>return 1</code> функция закончилась, и всё, что ниже, не выполнилось. Компилятор такую строку пропускает молча, а <code>go vet</code> на неё указывает: <code>unreachable code</code>. Убери последний <code>return 2</code> — и сборка упадёт с <code>missing return</code>: Go требует, чтобы тело заканчивалось возвратом, и довод «до конца всё равно не дойдёт» его не убеждает.</p>
<p>Внутри цикла эта вторая половина решает всё:</p>
<pre><code>for _, n := range nums {
	total = total + n
	return total     <span class="cm">// функция закончилась на первом же шаге</span>
}</code></pre>
<p><code>return</code> здесь не «переходит к следующему шагу». Он обрывает функцию целиком, а вместе с ней и цикл. В слайсе десять чисел, а просмотрено одно: сумма всегда равна первому элементу. Ошибки при этом нет — программа собирается и выдаёт неверный ответ.</p>
<p>Куда его ставить, решает один вопрос: <strong>может ли ответ ещё измениться на следующих шагах?</strong></p>
<pre><code><span class="cm">// сумма — может, ответ известен только в конце</span>
for _, n := range nums {
	total = total + n
}
return total

<span class="cm">// первое отрицательное — не может, дальше искать незачем</span>
for i, n := range nums {
	if n &lt; 0 {
		return i
	}
}
return -1</code></pre>
<p>Во втором случае <code>return</code> после цикла тоже нужен: он сработает, если цикл прошёл целиком и ничего не нашёл. Без него будет <code>missing return</code> — Go не верит, что цикл обязательно что-то найдёт, и он прав, ведь слайс может оказаться пустым.</p>`,
    en:`<p>Back to <code>return</code> itself. It does two things, not one: it hands back a value and <strong>ends the function on the spot</strong>. The second half is the one people miss.</p>
<pre><code>func f() int {
	fmt.Print("A")
	return 1
	fmt.Print("B")   <span class="cm">// control never gets here</span>
	return 2
}</code></pre>
<p>This prints <code>A1</code>. Not <code>AB1</code> and not <code>A1B</code>: at the line <code>return 1</code> the function ended and nothing below it ran. The compiler lets that line through in silence; <code>go vet</code> points at it: <code>unreachable code</code>. Drop the final <code>return 2</code> and the build fails with <code>missing return</code>: Go requires the body to end in a return, and the argument “control never gets there anyway” does not move it.</p>
<p>Inside a loop this second half decides everything:</p>
<pre><code>for _, n := range nums {
	total = total + n
	return total     <span class="cm">// the function ended on the very first step</span>
}</code></pre>
<p><code>return</code> here does not “move to the next step”. It cuts the whole function short, and the loop with it. Ten numbers in the slice, one of them looked at: the sum always equals the first element. And there is no error — the program compiles and gives a wrong answer.</p>
<p>Where to put it is decided by one question: <strong>can the answer still change on later steps?</strong></p>
<pre><code><span class="cm">// a sum — it can, the answer is known only at the end</span>
for _, n := range nums {
	total = total + n
}
return total

<span class="cm">// the first negative — it cannot, there is no point looking further</span>
for i, n := range nums {
	if n &lt; 0 {
		return i
	}
}
return -1</code></pre>
<p>In the second case the <code>return</code> after the loop is needed too: it fires when the loop ran to the end and found nothing. Without it you get <code>missing return</code> — Go does not assume the loop is guaranteed to find something, and it is right, because the slice may be empty.</p>`}
},
{
 h:{ru:"Переменная живёт до конца своих фигурных скобок",
    en:"A variable lives until its closing brace"},
 b:{ru:`<p>Мы только что поставили <code>return</code> после цикла. И сразу упираемся в следующий вопрос: а что после цикла ещё существует?</p>
<p>Переменная живёт от строки, где создана, до закрывающей фигурной скобки того блока, в котором создана. Тело цикла и тело <code>if</code> — такие же блоки, как тело функции. За скобкой переменная не «пустая» и не «нулевая» — её нет вообще, имя ничего не означает:</p>
<pre><code>for i := 0; i &lt; 3; i++ {
	sum := i
}
fmt.Println(sum)   <span class="cm">// undefined: sum</span></code></pre>
<p>Отсюда главное практическое следствие темы: <strong>накопитель создают ДО цикла</strong>.</p>
<pre><code>total := 0                 <span class="cm">// один на всю функцию</span>
for _, n := range nums {
	total = total + n
}
return total</code></pre>
<p>Почему именно так, видно из значка <code>:=</code> — он означает «создать новую переменную». Напишешь <code>total := 0</code> внутри цикла — новая переменная будет создаваться на каждом шаге, каждый раз с нуля, и прошлое значение исчезает вместе с предыдущим шагом. Накапливать не в чем. А после цикла её нет, и <code>return total</code> даст <code>undefined: total</code>.</p>
<p>Самое неприятное — что ошибки может не быть вовсе. Если внутри цикла ты <code>total</code> не возвращаешь, а печатаешь, программа спокойно соберётся и выдаст числа, похожие на правду: 1, 2, 3, 4 вместо накопленной суммы. Такое ищут дольше всего, потому что искать начинают не сразу.</p>
<p>Правило шире, чем про сумму: <strong>всё, что должно пережить блок, объявляется до блока</strong>. Это касается счётчика, флага, найденного максимума, собираемой строки — всего, что нужно после закрывающей скобки.</p>`,
    en:`<p>We have just put <code>return</code> after the loop. Which runs straight into the next question: what still exists after the loop?</p>
<p>A variable lives from the line that creates it to the closing brace of the block it was created in. A loop body and an <code>if</code> body are blocks exactly like a function body. Past that brace the variable is not “empty” and not “zero” — it does not exist at all, and the name means nothing:</p>
<pre><code>for i := 0; i &lt; 3; i++ {
	sum := i
}
fmt.Println(sum)   <span class="cm">// undefined: sum</span></code></pre>
<p>Hence the practical rule of this topic: <strong>create the accumulator BEFORE the loop</strong>.</p>
<pre><code>total := 0                 <span class="cm">// one for the whole function</span>
for _, n := range nums {
	total = total + n
}
return total</code></pre>
<p>Why it has to be that way is visible in the <code>:=</code> sign — it means “create a new variable”. Write <code>total := 0</code> inside the loop and a new variable is created on every step, each time starting at zero, while the previous value disappears with the previous step. There is nothing to accumulate in. And after the loop it does not exist, so <code>return total</code> gives <code>undefined: total</code>.</p>
<p>The nasty part is that there may be no error at all. If inside the loop you print <code>total</code> instead of returning it, the program builds happily and produces numbers that look plausible: 1, 2, 3, 4 instead of a running sum. Those take the longest to find, because you do not start looking right away.</p>
<p>The rule is wider than sums: <strong>anything that must outlive a block is declared before the block</strong>. Counters, flags, the best value found so far, a string being assembled — everything you still need past the closing brace.</p>`}
},
{
 h:{ru:"Возвращать можно несколько значений", en:"You can return several values"},
 b:{ru:`<p>До сих пор функция отдавала одно значение. Их может быть несколько — типы перечисляются в круглых скобках после параметров:</p>
<pre><code>func sumAndCount(nums []int) (int, int) {
	total := 0
	count := 0
	for _, n := range nums {
		total = total + n
		count++
	}
	return total, count
}

s, c := sumAndCount([]int{4, 9, 1, 7})   <span class="cm">// s = 21, c = 4</span></code></pre>
<p>Значения после <code>return</code> идут через запятую и в том же порядке, что типы в подписи. Заметь, что оба накопителя объявлены до цикла: правило из прошлого пункта не меняется от того, что их стало два.</p>
<p>Забрать нужно все значения — слева от <code>:=</code> должно стоять столько же переменных, сколько функция отдаёт. Иначе <code>x := sumAndCount(nums)</code> даст <code>assignment mismatch: 1 variable but sumAndCount returns 2 values</code>. Если второе значение не нужно, на его место ставят подчёркивание. Это не переменная, а место, куда значение попадает и тут же пропадает:</p>
<pre><code>s, _ := sumAndCount(nums)</code></pre>
<p>Самая ходовая пара — «значение и признак, нашлось ли»: <code>(int, bool)</code>.</p>
<pre><code>func firstNegative(nums []int) (int, bool) {
	for i, n := range nums {
		if n &lt; 0 {
			return i, true
		}
	}
	return -1, false
}</code></pre>
<p>Без второго значения пришлось бы условиться, что «−1 означает не нашлось», и однажды об этом забыть. А ещё −1 занято: если бы искали не индекс, а само число, −1 было бы нормальным ответом, и отличить его от «нет ответа» стало бы нечем. Отдельный <code>bool</code> снимает вопрос: он прямо говорит, настоящий это результат или пусто.</p>`,
    en:`<p>So far the function handed back one value. There can be several — the types are listed in parentheses after the parameters:</p>
<pre><code>func sumAndCount(nums []int) (int, int) {
	total := 0
	count := 0
	for _, n := range nums {
		total = total + n
		count++
	}
	return total, count
}

s, c := sumAndCount([]int{4, 9, 1, 7})   <span class="cm">// s = 21, c = 4</span></code></pre>
<p>The values after <code>return</code> are comma-separated and in the same order as the types in the signature. Note that both accumulators are declared before the loop: the rule from the previous point does not change just because there are two of them.</p>
<p>You have to take every value — the left of <code>:=</code> must hold as many variables as the function gives back. Otherwise <code>x := sumAndCount(nums)</code> gives <code>assignment mismatch: 1 variable but sumAndCount returns 2 values</code>. If the second value is not needed, put an underscore in its slot. It is not a variable but a place where a value arrives and vanishes on the spot:</p>
<pre><code>s, _ := sumAndCount(nums)</code></pre>
<p>The most useful pair is “a value plus whether it was found”: <code>(int, bool)</code>.</p>
<pre><code>func firstNegative(nums []int) (int, bool) {
	for i, n := range nums {
		if n &lt; 0 {
			return i, true
		}
	}
	return -1, false
}</code></pre>
<p>Without the second value you would have to agree that “−1 means not found” and then one day forget it. And −1 is not even free: if you were searching for the number itself rather than its index, −1 would be a perfectly ordinary answer and nothing would tell it apart from “no answer”. A separate <code>bool</code> removes the question: it states outright whether the result is real or empty.</p>`}
},
{
 h:{ru:"Функция без возврата — это нормально", en:"A function that returns nothing is fine"},
 b:{ru:`<p>И зеркальный случай: функция может не возвращать ничего. Если после круглых скобок тип не написан, <code>return</code> ей не нужен вовсе:</p>
<pre><code>func printLine() {
	fmt.Println("-----")
}</code></pre>
<p>Это не «недоделанная» функция. Так выглядит любая, вся работа которой — что-то показать или изменить, а не посчитать. Одиночный <code>return</code> без значения в ней разрешён: он просто заканчивает её досрочно, ничего не отдавая.</p>
<p>Результат у такой функции не возьмёшь — его нет, и это ошибка из второго пункта: <code>(no value) used as value</code>. А вот обратное Go разрешает, и здесь ловушка. Результат обычной функции можно молча выбросить:</p>
<pre><code>sum(2, 3)   <span class="cm">// соберётся, посчитает 5 и потеряет его</span></code></pre>
<p>Строка выглядит как работа, и работа действительно была: функция вызвалась и посчитала пятёрку. Просто её никто не забрал, и она исчезла вместе с концом функции. Компилятор промолчит, потому что отдельный вызов — законная строка: функцию могли вызвать и ради печати, как <code>printLine()</code>, а он не знает, чего ты хотел.</p>
<p>Нужен результат — забирай его сразу: <code>x := sum(2, 3)</code> или <code>fmt.Println(sum(2, 3))</code>. Это, кстати, самая тихая ошибка темы: ни красной строки, ни сообщения — просто на экране ничего не появилось.</p>`,
    en:`<p>And the mirror case: a function may return nothing at all. If there is no type after the parentheses, it needs no <code>return</code> whatsoever:</p>
<pre><code>func printLine() {
	fmt.Println("-----")
}</code></pre>
<p>This is not an “unfinished” function. It is what any function looks like whose whole job is to show or change something rather than compute it. A bare <code>return</code> with no value is allowed inside it: it simply ends the function early, handing nothing back.</p>
<p>You cannot take a result from such a function — there is none, and that is the error from point two: <code>(no value) used as value</code>. The reverse, though, Go permits, and that is the trap. The result of an ordinary function can be silently thrown away:</p>
<pre><code>sum(2, 3)   <span class="cm">// compiles, computes 5 and loses it</span></code></pre>
<p>The line looks like work, and work did happen: the function ran and computed the 5. Nobody took it, so it vanished when the function ended. The compiler stays quiet because a standalone call is a legal statement: the function might have been called for its printing, like <code>printLine()</code>, and the compiler does not know what you wanted.</p>
<p>If you want the result, take it right away: <code>x := sum(2, 3)</code> or <code>fmt.Println(sum(2, 3))</code>. This is the quietest mistake in the topic: no red line, no message — just nothing on the screen.</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ ================= */
var TABLE = {
  title:{ru:"Подпись и вызов", en:"Signature and call"},
  intro:{ru:"Всё, что нужно знать о функции, написано в её первой строке: что она принимает, что отдаёт и можно ли забрать результат.",
         en:"Everything you need to know about a function is in its first line: what it takes, what it gives back, and whether there is a result to take."},
  head:{ru:["Подпись","Принимает","Отдаёт","Как вызвать"], en:["Signature","Takes","Gives back","How to call"]},
  rows:[
    ["func f()", "—", "—", "f()"],
    ["func f(n int)", "int", "—", "f(5)"],
    ["func f() int", "—", "int", "x := f()"],
    ["func f(a, b int) int", {ru:"два int", en:"two ints"}, "int", "x := f(2, 3)"],
    ["func f(s string) bool", "string", "bool", "ok := f(\"hi\")"],
    ["func f(nums []int) (int, bool)", "[]int", {ru:"int и bool", en:"int and bool"}, "v, ok := f(nums)"]
  ]
};

/* ================= ГРАБЛИ ================= */
var TRAPS = [
 {ru:"<strong>Функция печатает, но ничего не возвращает.</strong> На экране всё правильно, а результат взять нельзя: <code>show(5) (no value) used as value</code>. Обратная версия той же ошибки — тип возврата в подписи есть, а в теле только <code>fmt.Println</code>: тогда <code>missing return</code>. Печать идёт человеку, <code>return</code> — программе, и одно другое не заменяет.",
  en:"<strong>The function prints but returns nothing.</strong> The screen looks right, yet there is no result to take: <code>show(5) (no value) used as value</code>. The mirror version — the signature names a return type but the body only prints: then it's <code>missing return</code>. Printing goes to a human, <code>return</code> goes to the program, and neither replaces the other."},

 {ru:"<strong><code>return</code> внутри цикла выходит на первом же шаге.</strong> Цикл выглядит так, будто пройдёт весь слайс, а не делает и одного полного круга: сумма всегда равна первому элементу, поиск максимума всегда возвращает первое число. Надо пройти всё — <code>return</code> ставится после закрывающей скобки цикла.",
  en:"<strong><code>return</code> inside a loop exits on the very first step.</strong> The loop looks like it walks the whole slice but never completes one round: the sum always equals the first element, the max search always returns the first number. If you must walk everything, put <code>return</code> after the loop's closing brace."},

 {ru:"<strong><code>total := 0</code> написали внутри цикла.</strong> Каждый шаг создаёт новую переменную с нуля, накопления нет. Ошибки при этом может не быть вовсе — программа спокойно печатает неверное число. Накопитель объявляют до цикла, иначе после цикла его просто не существует.",
  en:"<strong><code>total := 0</code> written inside the loop.</strong> Every step creates a brand-new variable starting at zero, so nothing accumulates. And there may be no error at all — the program calmly prints a wrong number. Declare the accumulator before the loop, otherwise after the loop it simply doesn't exist."},

 {ru:"<strong>Вызвал функцию и не забрал результат.</strong> Строка <code>sum(2, 3)</code> собирается, выполняется и молча выбрасывает пятёрку. Компилятор не ругается — это разрешённый код. Нужно <code>x := sum(2, 3)</code> либо сразу <code>fmt.Println(sum(2, 3))</code>.",
  en:"<strong>Called the function and never took the result.</strong> The line <code>sum(2, 3)</code> compiles, runs and silently drops the 5. The compiler says nothing — this is legal code. You want <code>x := sum(2, 3)</code>, or <code>fmt.Println(sum(2, 3))</code> right away."},

 {ru:"<strong>Функция изменила параметр, а снаружи всё по-прежнему.</strong> В параметр легла копия значения. Чтобы изменение осталось, функция должна вернуть новое значение, а вызывающий — присвоить его: <code>x = addTen(x)</code>.",
  en:"<strong>The function changed its parameter and nothing changed outside.</strong> The parameter got a copy of the value. For the change to stick, the function must return a new value and the caller must assign it: <code>x = addTen(x)</code>."},

 {ru:"<strong><code>return</code> спрятан внутри <code>if</code>.</strong> Условие не сработало — возвращать нечего, и это <code>missing return</code>. Та же история с переменными: созданная внутри <code>if</code> или цикла, снаружи она не существует (<code>undefined</code>). Всё, что понадобится после блока, объявляй до него.",
  en:"<strong><code>return</code> hidden inside an <code>if</code>.</strong> If the condition is false there is nothing to return, and that's <code>missing return</code>. Same story with variables: one created inside an <code>if</code> or a loop does not exist outside it (<code>undefined</code>). Declare anything you'll need after a block before that block."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

func hello() {
	fmt.Println("hello")
}

func main() {
	hello()
}`,
 out:"hello",
 why:{ru:"<code>main</code> — точка входа, с неё всё начинается. Функция <code>hello</code> объявлена отдельно и срабатывает только потому, что её вызвали строкой <code>hello()</code>.<br><b>Сломай:</b> убери <code>hello()</code> из <code>main</code>. Программа соберётся и не напечатает ничего — объявить функцию не значит выполнить её.",
      en:"<code>main</code> is the entry point, everything starts there. <code>hello</code> is declared separately and runs only because the line <code>hello()</code> calls it.<br><b>Break it:</b> remove <code>hello()</code> from <code>main</code>. It still compiles and prints nothing — declaring a function is not running it."}
},
{
 chg:{ru:"у функции появился параметр", en:"the function got a parameter"},
 code:`package main

import "fmt"

func greet(name string) {
	fmt.Println("hello,", name)
}

func main() {
	greet("Go")
	greet("world")
}`,
 out:"hello, Go\nhello, world",
 why:{ru:"Одна функция, два вызова с разными значениями. Параметр <code>name</code> — переменная, которая создаётся заново на каждый вызов и живёт только внутри функции.<br><b>Сломай:</b> вызови <code>greet()</code> без аргумента и прочитай ошибку.",
      en:"One function, two calls with different values. The parameter <code>name</code> is a variable created afresh on every call and alive only inside the function.<br><b>Break it:</b> call <code>greet()</code> with no argument and read the error."}
},
{
 chg:{ru:"два параметра, функция печатает результат", en:"two parameters, the function prints the result"},
 code:`package main

import "fmt"

func showSum(a int, b int) {
	fmt.Println(a + b)
}

func main() {
	showSum(2, 3)
	showSum(10, 20)
}`,
 out:"5\n30",
 why:{ru:"Функция считает и сразу печатает. Возврата у неё нет — после закрывающей скобки от вычисления не остаётся ничего.<br><b>Сломай:</b> напиши <code>x := showSum(2, 3)</code>. Ошибка <code>showSum(2, 3) (no value) used as value</code> — это и есть разница между печатью и возвратом.",
      en:"The function computes and prints on the spot. It returns nothing — past the closing brace, nothing of the calculation is left.<br><b>Break it:</b> write <code>x := showSum(2, 3)</code>. The error <code>showSum(2, 3) (no value) used as value</code> is exactly the difference between printing and returning."}
},
{
 chg:{ru:"печать заменили на return", en:"the print was replaced by return"},
 code:`package main

import "fmt"

func sum(a int, b int) int {
	return a + b
}

func main() {
	fmt.Println(sum(2, 3))
	fmt.Println(sum(10, 20))
}`,
 out:"5\n30",
 why:{ru:"<b>Вывод точно такой же, как в примере 3</b> — и это главное в теме. По экрану две функции неразличимы. Разница в том, кому ушло число: раньше — сразу на экран, теперь — в <code>main</code>, и уже <code>main</code> решает, что с ним делать.",
      en:"<b>The output is identical to example 3</b> — and that is the heart of this topic. On screen the two functions are indistinguishable. The difference is who received the number: before it went straight to the screen, now it goes to <code>main</code>, and <code>main</code> decides what to do with it."}
},
{
 chg:{ru:"результат подставили в другой вызов", en:"the result was fed into another call"},
 code:`package main

import "fmt"

func sum(a int, b int) int {
	return a + b
}

func main() {
	x := sum(2, 3)
	fmt.Println(x)
	fmt.Println(sum(x, sum(10, 20)))
}`,
 out:"5\n35",
 why:{ru:"Вернувшееся значение — обычное число: его можно положить в переменную, сложить, передать в другую функцию. Внутренний <code>sum(10, 20)</code> выполняется первым, его 30 идёт аргументом наружу, 5 + 30 = 35. С печатающей функцией так не выйдет — подставлять нечего.",
      en:"A returned value is an ordinary number: store it, add it, pass it into another function. The inner <code>sum(10, 20)</code> runs first, its 30 goes out as an argument, 5 + 30 = 35. A printing function can't do this — there is nothing to feed in."}
},
{
 chg:{ru:"параметр стал слайсом, внутри появился цикл", en:"the parameter became a slice, a loop appeared inside"},
 code:`package main

import "fmt"

func sumAll(nums []int) int {
	total := 0
	for _, n := range nums {
		total = total + n
	}
	return total
}

func main() {
	fmt.Println(sumAll([]int{1, 2, 3, 4}))
}`,
 out:"10",
 why:{ru:"Накопитель <code>total</code> создан ДО цикла: он один на всю функцию и переживает все шаги. <code>return</code> стоит ПОСЛЕ цикла, потому что ответ известен, только когда пройден весь слайс. Запомни эту расстановку — следующие два примера ломают её по очереди.",
      en:"The accumulator <code>total</code> is created BEFORE the loop: one for the whole function, surviving every step. <code>return</code> sits AFTER the loop, because the answer is known only once the whole slice is walked. Remember this layout — the next two examples break it one piece at a time."}
},
{
 chg:{ru:"return переехал внутрь цикла", en:"return moved inside the loop"},
 code:`package main

import "fmt"

func sumAll(nums []int) int {
	total := 0
	for _, n := range nums {
		total = total + n
		return total
	}
	return total
}

func main() {
	fmt.Println(sumAll([]int{1, 2, 3, 4}))
}`,
 out:"1",
 why:{ru:"Одна строка сдвинулась — вместо 10 получилась 1. <code>return</code> не ждёт конца цикла, он закончил функцию на первом же шаге. Второй <code>return</code> после цикла здесь обязателен, иначе <code>missing return</code>, но управление до него не доходит никогда.",
      en:"One line moved and 10 became 1. <code>return</code> does not wait for the loop to finish — it ended the function on the first step. The second <code>return</code> after the loop is required here, otherwise <code>missing return</code>, but control never reaches it."}
},
{
 chg:{ru:"накопитель переехал внутрь цикла", en:"the accumulator moved inside the loop"},
 code:`package main

import "fmt"

func sumAll(nums []int) int {
	for _, n := range nums {
		total := 0
		total = total + n
		fmt.Println("total:", total)
	}
	return 0
}

func main() {
	fmt.Println(sumAll([]int{1, 2, 3, 4}))
}`,
 out:"total: 1\ntotal: 2\ntotal: 3\ntotal: 4\n0",
 why:{ru:"Каждый шаг создаёт НОВУЮ переменную <code>total</code>, равную нулю, поэтому печатается сам элемент, а не сумма. После цикла её нет вообще — возвращать пришлось ноль.<br><b>Сломай:</b> замени <code>return 0</code> на <code>return total</code>. Ошибка <code>undefined: total</code>: переменная умерла вместе с закрывающей скобкой цикла.",
      en:"Every step creates a NEW <code>total</code> equal to zero, so what gets printed is the element itself, not a sum. After the loop it doesn't exist at all — hence returning zero.<br><b>Break it:</b> replace <code>return 0</code> with <code>return total</code>. The error is <code>undefined: total</code>: the variable died with the loop's closing brace."}
},
{
 chg:{ru:"функция без возврата меняет свой параметр", en:"a function with no return changes its parameter"},
 code:`package main

import "fmt"

func addTen(n int) {
	n = n + 10
	fmt.Println(n)
}

func main() {
	x := 5
	addTen(x)
	fmt.Println(x)
}`,
 out:"15\n5",
 why:{ru:"Внутри 15, снаружи 5. В <code>n</code> легла копия значения, и <code>x</code> о ней ничего не знает. Чтобы изменение осталось, функция должна вернуть новое значение, а <code>main</code> — присвоить его: <code>x = addTen(x)</code>.",
      en:"Fifteen inside, five outside. <code>n</code> got a copy of the value and <code>x</code> knows nothing about it. For the change to stick, the function must return a new value and <code>main</code> must assign it: <code>x = addTen(x)</code>."}
},
{
 chg:{ru:"функция возвращает два значения", en:"the function returns two values"},
 code:`package main

import "fmt"

func minMax(nums []int) (int, int) {
	lo := nums[0]
	hi := nums[0]
	for _, n := range nums {
		if n < lo {
			lo = n
		}
		if n > hi {
			hi = n
		}
	}
	return lo, hi
}

func main() {
	a, b := minMax([]int{4, 9, 1, 7})
	fmt.Println(a, b)
	fmt.Println(b - a)
}`,
 out:"1 9\n8",
 why:{ru:"Типы перечислены в скобках, значения в <code>return</code> — через запятую и в том же порядке. Начальные значения берутся из <code>nums[0]</code>, а не из нуля: с нулём максимум у отрицательного слайса нашёлся бы неверно.<br><b>Сломай:</b> напиши <code>v := minMax([]int{4, 9, 1, 7})</code> и прочитай <code>assignment mismatch</code>.",
      en:"Types listed in parentheses, values after <code>return</code> comma-separated in the same order. The starting values come from <code>nums[0]</code>, not from zero: starting at zero would find the wrong maximum for an all-negative slice.<br><b>Break it:</b> write <code>v := minMax([]int{4, 9, 1, 7})</code> and read the <code>assignment mismatch</code>."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"PrintLine", lvl:1, e:"-----\n-----\n-----",
 d:{ru:"Напиши функцию <code>printLine()</code> без параметров и без возврата — она печатает пять дефисов. Вызови её из <code>main</code> три раза.",
    en:"Write a function <code>printLine()</code> with no parameters and no return — it prints five dashes. Call it three times from <code>main</code>."},
 h:{ru:"Тип возврата после круглых скобок не пишется вообще, <code>return</code> в теле не нужен. Один вызов — одна строка на экране.",
    en:"Write no type after the parentheses, and no <code>return</code> in the body. One call, one line on screen."}},

{t:"Double", lvl:1, e:"8\n42",
 d:{ru:"Напиши функцию <code>double(n int) int</code> — она возвращает удвоенное число. Печатать должна <code>main</code>: результаты для 4 и для 21.",
    en:"Write <code>double(n int) int</code> — it returns the number doubled. The printing is done by <code>main</code>: results for 4 and for 21."},
 h:{ru:"Внутри функции ни одного <code>fmt.Println</code>. Она отдаёт значение через <code>return</code>, а печатает уже <code>main</code>.",
    en:"Not a single <code>fmt.Println</code> inside the function. It hands the value back with <code>return</code>; <code>main</code> does the printing."}},

{t:"Max2", lvl:1, e:"9\n10\n5",
 d:{ru:"Напиши функцию <code>max2(a, b int) int</code> — она возвращает большее из двух чисел. Проверь на парах (3, 9), (10, 4) и (5, 5).",
    en:"Write <code>max2(a, b int) int</code> — it returns the larger of two numbers. Check it on the pairs (3, 9), (10, 4) and (5, 5)."},
 h:{ru:"Хватит одного <code>if</code>: если <code>a</code> больше — <code>return a</code>, иначе строкой ниже <code>return b</code>. Второй <code>return</code> обязателен, иначе <code>missing return</code>.",
    en:"One <code>if</code> is enough: if <code>a</code> is bigger, <code>return a</code>, otherwise <code>return b</code> on the next line. That second <code>return</code> is required, otherwise <code>missing return</code>."}},

{t:"IsEven", lvl:1, e:"true\nfalse\ntrue",
 d:{ru:"Напиши функцию <code>isEven(n int) bool</code> — чётное ли число. Проверь на 4, 7 и 0.",
    en:"Write <code>isEven(n int) bool</code> — is the number even. Check it on 4, 7 and 0."},
 h:{ru:"Сравнение <code>n % 2 == 0</code> само по себе даёт <code>true</code> или <code>false</code>, так что его можно вернуть напрямую. Возвращать <code>n % 2</code> нельзя: это число, а не ответ на вопрос.",
    en:"The comparison <code>n % 2 == 0</code> is already <code>true</code> or <code>false</code>, so return it directly. Returning <code>n % 2</code> won't do: that is a number, not an answer to a question."}},

{t:"SumTo", lvl:2, e:"15\n5050",
 d:{ru:"Напиши функцию <code>sumTo(n int) int</code> — сумма всех чисел от 1 до n. Проверь на 5 и на 100.",
    en:"Write <code>sumTo(n int) int</code> — the sum of all numbers from 1 to n. Check it on 5 and on 100."},
 h:{ru:"Накопитель объявляй ДО цикла, <code>return</code> ставь ПОСЛЕ цикла. Если получилась единица — значит <code>return</code> оказался внутри.",
    en:"Declare the accumulator BEFORE the loop and put <code>return</code> AFTER the loop. If you got 1, your <code>return</code> ended up inside."}},

{t:"CountDigits", lvl:2, e:"1\n4\n6",
 d:{ru:"Напиши функцию <code>countDigits(n int) int</code> — сколько цифр в положительном числе. Проверь на 7, 4821 и 100000.",
    en:"Write <code>countDigits(n int) int</code> — how many digits a positive number has. Check it on 7, 4821 and 100000."},
 h:{ru:"Деление на 10 отрезает последнюю цифру. Цикл <code>for n &gt; 0</code> идёт, пока число не кончится; счётчик, как и любой накопитель, объявляется до цикла. Менять <code>n</code> внутри функции можно свободно — это копия.",
    en:"Dividing by 10 cuts off the last digit. The loop <code>for n &gt; 0</code> runs until the number is gone; the counter, like any accumulator, is declared before the loop. Changing <code>n</code> inside the function is safe — it is a copy."}},

{t:"SumAndCount", lvl:2, e:"21 4\n5",
 d:{ru:"Напиши функцию, которая для слайса <code>{4, 9, 1, 7}</code> возвращает <strong>два</strong> значения: сумму и количество элементов. В <code>main</code> напечатай их в одну строку, а следующей строкой — среднее (целочисленное деление суммы на количество).",
    en:"Write a function that, for the slice <code>{4, 9, 1, 7}</code>, returns <strong>two</strong> values: the sum and the number of elements. In <code>main</code> print them on one line, then the average on the next (integer division of the sum by the count)."},
 h:{ru:"Типы возврата пишутся в скобках: <code>(int, int)</code>. Забрать надо оба: <code>s, c := ...</code>. Два накопителя — оба до цикла.",
    en:"Return types go in parentheses: <code>(int, int)</code>. Take both: <code>s, c := ...</code>. Two accumulators, both before the loop."}},

{t:"AllEven", lvl:3, e:"true\nfalse\ntrue",
 d:{ru:"Напиши функцию <code>allEven(nums []int) bool</code> — все ли числа в слайсе чётные. Проверь на <code>{2, 4, 6}</code>, <code>{2, 3, 6}</code> и на пустом слайсе <code>{}</code>.",
    en:"Write <code>allEven(nums []int) bool</code> — are all the numbers in the slice even. Check it on <code>{2, 4, 6}</code>, <code>{2, 3, 6}</code> and on the empty slice <code>{}</code>."},
 h:{ru:"Здесь оба <code>return</code> на своих местах: <code>return false</code> — ВНУТРИ цикла, как только встретилось нечётное (дальше искать незачем), а <code>return true</code> — ПОСЛЕ цикла, когда весь слайс пройден и ни одного нечётного не нашлось. Пустой слайс даёт <code>true</code> сам собой: цикл не сделает ни шага.",
    en:"Both returns are in their right places here: <code>return false</code> goes INSIDE the loop, the moment an odd number shows up (no point looking further), and <code>return true</code> goes AFTER the loop, once the whole slice is walked with no odd number found. The empty slice gives <code>true</code> by itself: the loop takes no steps."}},

{t:"FirstNegative", lvl:3, e:"2 true\n-1 false",
 d:{ru:"Напиши функцию <code>firstNegative(nums []int) (int, bool)</code> — она возвращает индекс первого отрицательного числа и признак, нашлось ли оно. Если отрицательных нет, верни <code>-1</code> и <code>false</code>. Проверь на <code>{4, 7, -2, 9, -5}</code> и на <code>{1, 2, 3}</code>.",
    en:"Write <code>firstNegative(nums []int) (int, bool)</code> — it returns the index of the first negative number and whether one was found. If there are none, return <code>-1</code> and <code>false</code>. Check it on <code>{4, 7, -2, 9, -5}</code> and on <code>{1, 2, 3}</code>."},
 h:{ru:"Индекс даёт <code>for i, n := range nums</code>. Ответ известен на первом же отрицательном — там и <code>return i, true</code>. Строка <code>return -1, false</code> стоит после цикла и срабатывает, только если он прошёл целиком.",
    en:"The index comes from <code>for i, n := range nums</code>. The answer is known at the first negative — <code>return i, true</code> right there. The line <code>return -1, false</code> sits after the loop and fires only if the loop ran to the end."}},

{t:"BestDigitSum", lvl:3, e:"10\n10\n5\n16\n88",
 d:{ru:"Напиши две функции. Первая — <code>digitSum(n int) int</code>, сумма цифр числа. Вторая принимает слайс <code>{19, 91, 5, 88}</code>, печатает сумму цифр каждого числа на отдельной строке и <strong>возвращает</strong> то число, у которого эта сумма наибольшая. При равенстве оставляй то, что встретилось раньше. <code>main</code> печатает результат последней строкой.",
    en:"Write two functions. The first is <code>digitSum(n int) int</code>, the sum of a number's digits. The second takes the slice <code>{19, 91, 5, 88}</code>, prints each number's digit sum on its own line and <strong>returns</strong> the number whose sum is the largest. On a tie keep the one seen first. <code>main</code> prints the result on the last line."},
 h:{ru:"Пара <code>% 10</code> и <code>/ 10</code> разбирает число на цифры. Вторая функция спокойно вызывает первую — обычная строка вроде <code>s := digitSum(n)</code>. Победителя храни в переменной, объявленной ДО цикла, начальное значение бери из <code>nums[0]</code>. Условие строго «больше», а не «больше либо равно» — тогда при равенстве останется первый.",
    en:"The <code>% 10</code> and <code>/ 10</code> pair takes a number apart. The second function simply calls the first — an ordinary line like <code>s := digitSum(n)</code>. Keep the winner in a variable declared BEFORE the loop, starting from <code>nums[0]</code>. Use a strict “greater than”, not “greater or equal” — that way a tie keeps the first one."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};

var BANK = [
{q:Q_OUT, code:"func double(n int) int {\n\treturn n * 2\n}\n\nfmt.Println(double(3))", opts:["6","3","double(3)",NO], ok:0,
 why:{ru:"<code>return</code> отдаёт 6 туда, откуда функцию вызвали, и <code>Println</code> печатает уже это значение. Сама функция при этом ничего не печатает — печать и возврат делают разные строки.",
      en:"<code>return</code> hands 6 back to the caller and <code>Println</code> prints that value. The function itself prints nothing — returning and printing are done by different lines."}},

{q:Q_HAP, code:"func show(n int) {\n\tfmt.Println(n)\n}\n\nx := show(5)",
 opts:[NO,{ru:"x станет 5",en:"x becomes 5"},{ru:"x станет 0",en:"x becomes 0"},{ru:"напечатает 5, x останется пустым",en:"prints 5, x stays empty"}], ok:0,
 why:{ru:"Ошибка дословно: <code>show(5) (no value) used as value</code>. В подписи после скобок нет типа — значит, функция не отдаёт ничего, и присваивать нечего. То, что она печатает, роли не играет: печать идёт человеку, а не в программу.",
      en:"The error verbatim: <code>show(5) (no value) used as value</code>. There is no type after the parentheses, so the function hands back nothing and there is nothing to assign. That it prints is irrelevant: printing goes to a human, not into the program."}},

{q:Q_OUT, code:"func sum(nums []int) int {\n\ttotal := 0\n\tfor _, n := range nums {\n\t\ttotal = total + n\n\t\treturn total\n\t}\n\treturn total\n}\n\nfmt.Println(sum([]int{1, 2, 3}))",
 opts:["1","6","3","0"], ok:0,
 why:{ru:"<code>return</code> сработал на первом же шаге цикла и закончил функцию — до второго элемента дело не дошло. Второй <code>return</code> после цикла здесь нужен только для сборки, управление до него не доходит. Чтобы получить 6, <code>return</code> должен стоять один и после цикла.",
      en:"<code>return</code> fired on the loop's first step and ended the function — the second element was never reached. The second <code>return</code> after the loop exists only to make it compile; control never gets there. To get 6, there must be a single <code>return</code>, placed after the loop."}},

{q:Q_HAP, code:"func f(a int) int {\n\tif a > 0 {\n\t\treturn 1\n\t}\n}",
 opts:[NO,{ru:"при a <= 0 вернёт 0",en:"returns 0 when a <= 0"},{ru:"при a <= 0 вернёт nil",en:"returns nil when a <= 0"},{ru:"соберётся, но упадёт при запуске",en:"compiles but crashes at run time"}], ok:0,
 why:{ru:"Ошибка <code>missing return</code>. Функция обещала вернуть <code>int</code>, но при ложном условии не возвращает ничего — а нулевое значение само не подставляется. Нужен второй <code>return</code> после <code>if</code>.",
      en:"The error is <code>missing return</code>. The function promised an <code>int</code> but returns nothing when the condition is false — and no zero value is filled in for you. Add a second <code>return</code> after the <code>if</code>."}},

{q:Q_OUT, code:"func add(n int) {\n\tn = n + 1\n}\n\nx := 5\nadd(x)\nfmt.Println(x)",
 opts:["5","6","0",NO], ok:0,
 why:{ru:"В параметр <code>n</code> легла копия пятёрки. Функция изменила копию, а <code>x</code> об этом не знает. Чтобы изменение осталось, функция должна вернуть новое значение, а вызывающий — присвоить его.",
      en:"The parameter <code>n</code> received a copy of the 5. The function changed the copy; <code>x</code> knows nothing about it. For the change to stick, the function must return a new value and the caller must assign it."}},

{q:Q_OUT, code:"func f() (int, string) {\n\treturn 7, \"go\"\n}\n\na, b := f()\nfmt.Println(b, a)",
 opts:["go 7","7 go",NO,"go"], ok:0,
 why:{ru:"Значения расходятся по переменным строго по порядку: <code>a</code> берёт 7, <code>b</code> берёт \"go\". А <code>Println</code> печатает их в том порядке, в каком они перечислены в нём самом — сначала <code>b</code>.",
      en:"Values land in the variables strictly by position: <code>a</code> takes 7, <code>b</code> takes \"go\". And <code>Println</code> prints them in the order listed inside the call — <code>b</code> first."}},

{q:Q_HAP, code:"func f() (int, string) {\n\treturn 7, \"go\"\n}\n\nx := f()",
 opts:[NO,{ru:"x станет 7",en:"x becomes 7"},{ru:"x станет \"go\"",en:"x becomes \"go\""},{ru:"x получит оба значения",en:"x gets both values"}], ok:0,
 why:{ru:"Ошибка дословно: <code>assignment mismatch: 1 variable but f returns 2 values</code>. Забирать нужно все значения. Если второе не нужно, на его место ставят подчёркивание: <code>x, _ := f()</code>.",
      en:"The error verbatim: <code>assignment mismatch: 1 variable but f returns 2 values</code>. You must take every value. If you don't need the second, put an underscore there: <code>x, _ := f()</code>."}},

{q:Q_HAP, code:"func f() int {\n\tfmt.Print(\"A\")\n\treturn 1\n\tfmt.Print(\"B\")\n}",
 opts:[NO,{ru:"напечатает A1",en:"prints A1"},{ru:"напечатает AB1",en:"prints AB1"},{ru:"напечатает A1B",en:"prints A1B"}], ok:0,
 why:{ru:"Строка после <code>return</code> недостижима, но компилятор ругается не на это. Он требует, чтобы тело заканчивалось возвратом, а тут последняя строка — печать: <code>missing return</code>. Допиши в конце <code>return 2</code> — соберётся и напечатает <code>A1</code>, а <code>go vet</code> отдельно скажет <code>unreachable code</code>.",
      en:"The line after <code>return</code> is unreachable, but that is not what the compiler complains about. It requires the body to end in a return, and here the last statement is a print: <code>missing return</code>. Add <code>return 2</code> at the end — it compiles and prints <code>A1</code>, while <code>go vet</code> separately reports <code>unreachable code</code>."}},

{q:Q_OUT, code:"nums := []int{1, 2, 3}\nfor _, n := range nums {\n\ttotal := 0\n\ttotal = total + n\n\tfmt.Print(total)\n}",
 opts:["123","136","6",NO], ok:0,
 why:{ru:"<code>total := 0</code> стоит внутри цикла, поэтому на каждом шаге создаётся новая переменная, равная нулю. Печатается сам элемент, а не сумма. Ошибки при этом нет вовсе — программа собирается и выдаёт неверный ответ.",
      en:"<code>total := 0</code> sits inside the loop, so every step creates a fresh variable equal to zero. What gets printed is the element itself, not a sum. And there is no error at all — the program builds and gives a wrong answer."}},

{q:Q_HAP, code:"for i := 0; i < 3; i++ {\n\tsum := i\n}\nfmt.Println(sum)",
 opts:[NO,"2","3","0"], ok:0,
 why:{ru:"Сразу две ошибки: <code>declared and not used: sum</code> и <code>undefined: sum</code>. Переменная живёт до закрывающей скобки блока, в котором создана, — после цикла её просто не существует. Нужна снаружи — объявляй до цикла.",
      en:"Two errors at once: <code>declared and not used: sum</code> and <code>undefined: sum</code>. A variable lives until the closing brace of the block that created it — after the loop it simply does not exist. Need it outside? Declare it before the loop."}},

{q:Q_OUT, code:"func f(a int, b int) int {\n\treturn a - b\n}\n\nfmt.Println(f(2, 10))",
 opts:["-8","8","12",NO], ok:0,
 why:{ru:"Аргументы встают на места параметров по порядку: <code>a = 2</code>, <code>b = 10</code>. Значит 2 − 10 = −8. Имена параметров при вызове не пишут, и переставить их местами нельзя.",
      en:"Arguments fill the parameters by position: <code>a = 2</code>, <code>b = 10</code>. So 2 − 10 = −8. Parameter names are not written at the call site, and you cannot reorder them."}},

{q:{ru:"Чем <code>return x</code> отличается от <code>fmt.Println(x)</code>?",
    en:"How does <code>return x</code> differ from <code>fmt.Println(x)</code>?"}, code:null,
 opts:[{ru:"return отдаёт значение туда, откуда вызвали; Println показывает его человеку",en:"return hands the value back to the caller; Println shows it to a human"},
       {ru:"это одно и то же, просто разная запись",en:"they are the same thing written two ways"},
       {ru:"return печатает значение и заканчивает функцию",en:"return prints the value and ends the function"},
       {ru:"Println работает быстрее",en:"Println is faster"}], ok:0,
 why:{ru:"Два разных адресата. Напечатанное число нельзя сложить, сравнить или передать дальше — оно ушло на экран и всё. Возвращённое можно: оно вернулось в программу, в то место, где стоял вызов.",
      en:"Two different destinations. A printed number cannot be added, compared or passed on — it went to the screen and that is that. A returned one can: it came back into the program, to the spot where the call was."}},

{q:{ru:"Функция объявлена как <code>func f(n int) int</code>, а в теле только <code>fmt.Println(n)</code>. Что скажет компилятор?",
    en:"A function is declared <code>func f(n int) int</code> and its body is only <code>fmt.Println(n)</code>. What does the compiler say?"}, code:null,
 opts:["missing return",{ru:"ничего, соберётся",en:"nothing, it compiles"},"declared and not used","no value used as value"], ok:0,
 why:{ru:"Тип <code>int</code> в подписи — это обещание вернуть число. Печать обещание не выполняет: она отправляет число человеку, а программе не отдаёт ничего. Нужен <code>return</code>.",
      en:"The <code>int</code> in the signature is a promise to give back a number. Printing does not keep that promise: it sends the number to a human and hands the program nothing. A <code>return</code> is required."}},

{q:Q_OUT, code:"func twice(s string) string {\n\treturn s + s\n}\n\nfmt.Println(twice(twice(\"ab\")))",
 opts:["abababab","abab","ab",NO], ok:0,
 why:{ru:"Внутренний вызов выполняется первым и возвращает \"abab\". Это значение становится аргументом внешнего вызова, и он удваивает уже его. Так можно только с функцией, которая возвращает — печатающая тут не подойдёт.",
      en:"The inner call runs first and returns \"abab\". That value becomes the argument of the outer call, which doubles it in turn. This only works with a function that returns — a printing one cannot be nested."}},

{q:{ru:"Где объявить <code>total</code>, чтобы посчитать сумму слайса?",
    en:"Where should <code>total</code> be declared to sum a slice?"}, code:null,
 opts:[{ru:"до цикла",en:"before the loop"},
       {ru:"внутри цикла, первой строкой",en:"inside the loop, as its first line"},
       {ru:"после цикла, перед return",en:"after the loop, just before the return"},
       {ru:"внутри цикла, но через var, а не :=",en:"inside the loop, but with var instead of :="}], ok:0,
 why:{ru:"Накопитель должен пережить все шаги, значит создаётся снаружи. Внутри цикла он рождается заново на каждом шаге, а после цикла его вообще не существует — и вернуть его будет нельзя. Способ объявления (<code>var</code> или <code>:=</code>) на это никак не влияет.",
      en:"The accumulator must survive every step, so it is created outside. Inside the loop it is reborn on each step, and after the loop it does not exist at all — there would be nothing to return. How you declare it (<code>var</code> or <code>:=</code>) makes no difference."}},

{q:Q_OUT, code:"func sign(n int) string {\n\tif n > 0 {\n\t\treturn \"+\"\n\t}\n\treturn \"-\"\n}\n\nfmt.Print(sign(3), sign(-3), sign(0))",
 opts:["+--","+-+","++-",NO], ok:0,
 why:{ru:"Три отдельных вызова, каждый вернул строку. Для нуля условие <code>n > 0</code> ложно, поэтому идёт второй <code>return</code> и получается минус. <code>fmt.Print</code> склеил три строки без пробелов — пробелы он ставит только там, где рядом стоят два не-строковых значения.",
      en:"Three separate calls, each returning a string. For zero the condition <code>n > 0</code> is false, so the second <code>return</code> runs and you get a minus. <code>fmt.Print</code> glued the three strings with no spaces — it inserts spaces only between two neighbouring non-string values."}},

{q:Q_OUT, code:"func sum(a int, b int) int {\n\treturn a + b\n}\n\nfunc main() {\n\tsum(2, 3)\n\tfmt.Println(\"done\")\n}",
 opts:["done","5","5\ndone",NO], ok:0,
 why:{ru:"Функция выполнилась, посчитала 5 и выбросила результат: его никто не взял. Компилятор такое разрешает — обычный вызов может стоять отдельной строкой. Нужно значение — пиши <code>x := sum(2, 3)</code> или <code>fmt.Println(sum(2, 3))</code>.",
      en:"The function ran, computed 5 and threw the result away: nobody took it. The compiler allows this — an ordinary call may stand as its own statement. If you want the value, write <code>x := sum(2, 3)</code> or <code>fmt.Println(sum(2, 3))</code>."}},

{q:{ru:"Функция приняла <code>int</code> и изменила его внутри себя. Что с переменной снаружи?",
    en:"A function took an <code>int</code> and changed it inside. What about the variable outside?"}, code:null,
 opts:[{ru:"осталась прежней — в параметр легла копия",en:"unchanged — the parameter got a copy"},
       {ru:"тоже изменилась",en:"it changed too"},
       {ru:"обнулилась",en:"it was reset to zero"},
       {ru:"зависит от того, объявлена она через := или var",en:"depends on whether it was declared with := or var"}], ok:0,
 why:{ru:"При вызове значение копируется в параметр, и это отдельная переменная. Со слайсом было бы иначе: там копируется указание на данные, поэтому изменение элемента видно и снаружи.",
      en:"On the call the value is copied into the parameter, which is a separate variable. A slice would behave differently: there a pointer to the data is copied, so changing an element is visible outside too."}},

{q:Q_OUT, code:"func f() (int, int) {\n\treturn 1, 2\n}\n\na, _ := f()\nfmt.Println(a)",
 opts:["1","2","1 2",NO], ok:0,
 why:{ru:"Подчёркивание — место для значения, которое не нужно. Оно принимает второе значение и тут же его выбрасывает. Просто не написать вторую переменную нельзя: получишь <code>assignment mismatch</code>.",
      en:"The underscore is a slot for a value you don't need. It takes the second value and drops it immediately. Simply omitting the second variable is not allowed: you'd get <code>assignment mismatch</code>."}},

{q:{ru:"Что делает <code>return</code>, кроме передачи значения?",
    en:"What does <code>return</code> do besides handing back a value?"}, code:null,
 opts:[{ru:"немедленно заканчивает функцию",en:"ends the function immediately"},
       {ru:"печатает значение",en:"prints the value"},
       {ru:"обнуляет локальные переменные и идёт дальше по телу",en:"clears the local variables and carries on through the body"},
       {ru:"ничего больше",en:"nothing else"}], ok:0,
 why:{ru:"Это и делает <code>return</code> внутри цикла таким опасным: он не «пропускает шаг», а обрывает всю функцию целиком. Строки ниже не выполнятся, оставшиеся элементы не просмотрятся.",
      en:"That is exactly what makes <code>return</code> inside a loop so dangerous: it doesn't “skip a step”, it cuts the whole function short. Lines below never run and the remaining elements are never looked at."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Зачем вообще нужны функции?", en:"Why do functions exist at all?"},
 a:{ru:`<p>Три причины, и все три практические.</p>
<ul>
<li><strong>Повтор.</strong> Один и тот же кусок кода нужен в пяти местах. Функция пишется один раз и вызывается пять.</li>
<li><strong>Имя.</strong> Строка <code>x := digitSum(n)</code> читается сразу, а те же четыре строки с <code>% 10</code> и <code>/ 10</code> посреди чужого кода приходится расшифровывать.</li>
<li><strong>Проверка по частям.</strong> Программу из одного длинного <code>main</code> можно проверить только целиком. Разбитую на функции — по одной: запустил <code>digitSum(4821)</code>, увидел 15, пошёл дальше.</li>
</ul>
<p>Третья причина важнее, чем кажется. Когда что-то не сходится, ты не гадаешь, а сужаешь: проверяешь функции по очереди, пока не найдёшь ту, что врёт.</p>`,
    en:`<p>Three reasons, all of them practical.</p>
<ul>
<li><strong>Repetition.</strong> The same piece of code is needed in five places. A function is written once and called five times.</li>
<li><strong>A name.</strong> The line <code>x := digitSum(n)</code> reads instantly, while the same four lines of <code>% 10</code> and <code>/ 10</code> sitting in someone else's code have to be decoded.</li>
<li><strong>Checking piece by piece.</strong> A program that is one long <code>main</code> can only be checked as a whole. Split into functions, it can be checked one at a time: run <code>digitSum(4821)</code>, see 15, move on.</li>
</ul>
<p>The third reason matters more than it looks. When something is off, you stop guessing and start narrowing: test the functions one by one until you find the one that lies.</p>`}},

{q:{ru:"В чём разница между <code>fmt.Println</code> и <code>return</code>?", en:"What is the difference between <code>fmt.Println</code> and <code>return</code>?"},
 a:{ru:`<p>В адресате.</p>
<ul>
<li><code>fmt.Println(x)</code> — отправить значение <strong>человеку</strong>, на экран. Для программы это тупик: напечатанное число нельзя ни сложить, ни сравнить, ни передать дальше.</li>
<li><code>return x</code> — отдать значение <strong>программе</strong>, в то место, откуда функцию вызвали. Оттуда с ним можно делать что угодно.</li>
</ul>
<p>Проверить себя просто: попробуй использовать результат.</p>
<pre><code>x := sum(2, 3)       <span class="cm">// работает</span>
y := showSum(2, 3)   <span class="cm">// showSum(2, 3) (no value) used as value</span></code></pre>
<p>Функция может делать и то и другое сразу — посчитать, напечатать и вернуть. Но одно вместо другого не подставляется.</p>
<p>Общее правило: считает — пусть <strong>возвращает</strong>. Печатает пусть тот, кто вызвал. Тогда одну и ту же функцию можно использовать и для вывода на экран, и внутри вычисления.</p>`,
    en:`<p>The destination.</p>
<ul>
<li><code>fmt.Println(x)</code> sends the value to a <strong>human</strong>, on screen. For the program it is a dead end: a printed number cannot be added, compared or passed along.</li>
<li><code>return x</code> hands the value to the <strong>program</strong>, back to the place that called the function. From there you can do anything with it.</li>
</ul>
<p>The test is easy: try to use the result.</p>
<pre><code>x := sum(2, 3)       <span class="cm">// works</span>
y := showSum(2, 3)   <span class="cm">// showSum(2, 3) (no value) used as value</span></code></pre>
<p>A function can do both — compute, print and return. But one never substitutes for the other.</p>
<p>General rule: if it computes, let it <strong>return</strong>. Let the caller do the printing. Then the same function serves both for display and inside a calculation.</p>`}},

{q:{ru:"Что делает <code>return</code>, кроме того что отдаёт значение?", en:"What does <code>return</code> do apart from handing back a value?"},
 a:{ru:`<p>Немедленно заканчивает функцию. Это вторая половина его работы, и именно её обычно упускают.</p>
<pre><code>func f() int {
	fmt.Print("A")
	return 1
	fmt.Print("B")   <span class="cm">// сюда управление не дойдёт</span>
	return 2
}</code></pre>
<p>Напечатается <code>A1</code>. Компилятор недостижимую строку пропустит, но <code>go vet</code> на неё укажет: <code>unreachable code</code>. А если убрать последний <code>return 2</code>, сборка упадёт с <code>missing return</code> — тело обязано заканчиваться возвратом.</p>
<p>В цикле это свойство решает всё:</p>
<pre><code><span class="cm">// найти первое отрицательное — return ВНУТРИ, ответ уже есть</span>
for i, n := range nums {
	if n &lt; 0 {
		return i
	}
}
return -1

<span class="cm">// сложить всё — return ПОСЛЕ, ответ известен только в конце</span>
for _, n := range nums {
	total = total + n
}
return total</code></pre>
<p>Вопрос, который решает, куда ставить: <strong>«может ли ответ измениться на следующих шагах?»</strong> Может — <code>return</code> после цикла. Не может — внутри.</p>`,
    en:`<p>It ends the function immediately. That is the other half of its job, and the half people miss.</p>
<pre><code>func f() int {
	fmt.Print("A")
	return 1
	fmt.Print("B")   <span class="cm">// control never gets here</span>
	return 2
}</code></pre>
<p>This prints <code>A1</code>. The compiler lets the unreachable line through, but <code>go vet</code> points at it: <code>unreachable code</code>. Remove the final <code>return 2</code> and the build fails with <code>missing return</code> — the body must end in a return.</p>
<p>In a loop this property decides everything:</p>
<pre><code><span class="cm">// find the first negative — return INSIDE, the answer is already there</span>
for i, n := range nums {
	if n &lt; 0 {
		return i
	}
}
return -1

<span class="cm">// sum everything — return AFTER, the answer is known only at the end</span>
for _, n := range nums {
	total = total + n
}
return total</code></pre>
<p>The question that decides placement: <strong>“can the answer still change on later steps?”</strong> If it can, <code>return</code> goes after the loop. If it can't, inside.</p>`}},

{q:{ru:"Почему функция не изменила мою переменную?", en:"Why didn't the function change my variable?"},
 a:{ru:`<p>Потому что она её не получала. При вызове значение <strong>копируется</strong> в параметр, а параметр — отдельная переменная, живущая только внутри функции.</p>
<pre><code>func addTen(n int) {
	n = n + 10
	fmt.Println(n)   <span class="cm">// 15</span>
}

x := 5
addTen(x)
fmt.Println(x)       <span class="cm">// 5</span></code></pre>
<p>Даже одинаковое имя ничего не меняет: <code>x</code> внутри функции и <code>x</code> снаружи — две разные переменные.</p>
<p>Правильный путь — вернуть новое значение и присвоить его:</p>
<pre><code>func addTen(n int) int {
	return n + 10
}

x = addTen(x)</code></pre>
<p>Одно исключение стоит знать: со слайсом копируется не сам набор чисел, а указание на них. Поэтому <code>nums[0] = 0</code> внутри функции меняет слайс и у вызвавшего. Это регулярный источник неожиданностей — функция «просто посчитала», а данные поменялись.</p>`,
    en:`<p>Because it never got it. On the call the value is <strong>copied</strong> into the parameter, and the parameter is a separate variable that lives only inside the function.</p>
<pre><code>func addTen(n int) {
	n = n + 10
	fmt.Println(n)   <span class="cm">// 15</span>
}

x := 5
addTen(x)
fmt.Println(x)       <span class="cm">// 5</span></code></pre>
<p>Even an identical name changes nothing: <code>x</code> inside the function and <code>x</code> outside are two different variables.</p>
<p>The right way is to return a new value and assign it:</p>
<pre><code>func addTen(n int) int {
	return n + 10
}

x = addTen(x)</code></pre>
<p>One exception is worth knowing: with a slice, what gets copied is not the numbers but a pointer to them. So <code>nums[0] = 0</code> inside the function changes the caller's slice as well. This is a steady source of surprises — the function “just computed something” and the data changed.</p>`}},

{q:{ru:"Что значит ошибка <code>missing return</code>?", en:"What does the error <code>missing return</code> mean?"},
 a:{ru:`<p>Что в подписи функции есть тип возврата, а тело не гарантированно заканчивается возвратом. Go требует, чтобы <strong>последним</strong> в теле стоял завершающий оператор — обычно <code>return</code>.</p>
<p>Три частых случая:</p>
<pre><code><span class="cm">// 1. return только внутри if</span>
func f(a int) int {
	if a &gt; 0 {
		return 1
	}
}                      <span class="cm">// а если условие ложно?</span>

<span class="cm">// 2. вместо возврата — печать</span>
func f(n int) int {
	fmt.Println(n)
}

<span class="cm">// 3. return только внутри цикла</span>
func f(nums []int) int {
	for _, n := range nums {
		return n
	}
}                      <span class="cm">// а если слайс пустой?</span></code></pre>
<p>Во всех трёх лечение одно: добавить <code>return</code> строкой ниже, вне блока.</p>
<p>Обрати внимание: Go не подставляет нулевое значение сам. Раз пообещал вернуть <code>int</code> — верни его явно, на любом пути выполнения.</p>`,
    en:`<p>That the signature names a return type but the body is not guaranteed to end in a return. Go requires the <strong>last</strong> statement of the body to be a terminating one — usually a <code>return</code>.</p>
<p>Three common cases:</p>
<pre><code><span class="cm">// 1. return only inside an if</span>
func f(a int) int {
	if a &gt; 0 {
		return 1
	}
}                      <span class="cm">// and if the condition is false?</span>

<span class="cm">// 2. a print instead of a return</span>
func f(n int) int {
	fmt.Println(n)
}

<span class="cm">// 3. return only inside a loop</span>
func f(nums []int) int {
	for _, n := range nums {
		return n
	}
}                      <span class="cm">// and if the slice is empty?</span></code></pre>
<p>All three have the same cure: add a <code>return</code> on the next line, outside the block.</p>
<p>Note that Go does not fill in a zero value for you. If you promised an <code>int</code>, return one explicitly, on every path.</p>`}},

{q:{ru:"Как вернуть несколько значений и зачем нужно подчёркивание?", en:"How do I return several values, and what is the underscore for?"},
 a:{ru:`<p>Типы перечисляются в круглых скобках, значения — через запятую и в том же порядке:</p>
<pre><code>func sumAndCount(nums []int) (int, int) {
	total := 0
	count := 0
	for _, n := range nums {
		total = total + n
		count++
	}
	return total, count
}

s, c := sumAndCount(nums)</code></pre>
<p>Забрать нужно <strong>все</strong> значения — иначе <code>assignment mismatch: 1 variable but sumAndCount returns 2 values</code>. Если какое-то не нужно, на его место ставится подчёркивание: <code>s, _ := sumAndCount(nums)</code>. Это не переменная, а место, куда значение попадает и сразу пропадает.</p>
<p>Тот же знак используют в <code>range</code>, когда индекс не нужен: <code>for _, n := range nums</code>.</p>
<p>Самая ходовая пара — <code>(значение, bool)</code>: первое отдаёт результат, второе честно сообщает, есть ли он вообще.</p>
<pre><code>func firstNegative(nums []int) (int, bool) {
	for i, n := range nums {
		if n &lt; 0 {
			return i, true
		}
	}
	return -1, false
}

i, ok := firstNegative(nums)
if ok {
	fmt.Println("нашлось на месте", i)
}</code></pre>
<p>Без второго значения пришлось бы договариваться, что «−1 означает не нашлось» — и однажды об этом договоре забыть.</p>`,
    en:`<p>Types go in parentheses, values after <code>return</code> comma-separated in the same order:</p>
<pre><code>func sumAndCount(nums []int) (int, int) {
	total := 0
	count := 0
	for _, n := range nums {
		total = total + n
		count++
	}
	return total, count
}

s, c := sumAndCount(nums)</code></pre>
<p>You must take <strong>all</strong> the values — otherwise <code>assignment mismatch: 1 variable but sumAndCount returns 2 values</code>. If one isn't needed, put an underscore in its slot: <code>s, _ := sumAndCount(nums)</code>. It is not a variable but a place where a value arrives and vanishes.</p>
<p>The same sign appears in <code>range</code> when the index isn't needed: <code>for _, n := range nums</code>.</p>
<p>The most useful pair is <code>(value, bool)</code>: the first carries the result, the second says honestly whether there is one.</p>
<pre><code>func firstNegative(nums []int) (int, bool) {
	for i, n := range nums {
		if n &lt; 0 {
			return i, true
		}
	}
	return -1, false
}

i, ok := firstNegative(nums)
if ok {
	fmt.Println("found at", i)
}</code></pre>
<p>Without the second value you'd have to agree that “−1 means not found” — and one day forget that agreement.</p>`}},

{q:{ru:"Почему накопитель объявляют до цикла?", en:"Why is the accumulator declared before the loop?"},
 a:{ru:`<p>Потому что переменная живёт до закрывающей скобки того блока, в котором создана. Тело цикла — такой же блок.</p>
<pre><code><span class="cm">// правильно</span>
total := 0
for _, n := range nums {
	total = total + n
}
return total

<span class="cm">// неправильно</span>
for _, n := range nums {
	total := 0
	total = total + n
}
return total   <span class="cm">// undefined: total</span></code></pre>
<p>Во втором варианте на каждом шаге создаётся <strong>новая</strong> переменная, равная нулю: накапливать нечему. А после цикла её вообще нет, и возвращать нечего.</p>
<p>Хуже другое. Если внутри цикла ещё и печатать <code>total</code>, ошибки сборки не будет вовсе — программа соберётся и выдаст числа, которые выглядят правдоподобно. Такой вариант ищут дольше всего.</p>
<p>То же правило работает шире: <strong>всё, что должно пережить блок, объявляется до блока</strong>. Это касается счётчиков, флагов, найденного максимума, собираемой строки.</p>`,
    en:`<p>Because a variable lives until the closing brace of the block that created it. A loop body is such a block.</p>
<pre><code><span class="cm">// right</span>
total := 0
for _, n := range nums {
	total = total + n
}
return total

<span class="cm">// wrong</span>
for _, n := range nums {
	total := 0
	total = total + n
}
return total   <span class="cm">// undefined: total</span></code></pre>
<p>In the second version every step creates a <strong>new</strong> variable equal to zero: there is nothing to accumulate in. And after the loop it doesn't exist, so there is nothing to return.</p>
<p>Worse: if the loop also prints <code>total</code>, there is no build error at all — the program compiles and produces numbers that look plausible. That version takes the longest to find.</p>
<p>The rule generalises: <strong>anything that must outlive a block is declared before the block</strong>. That covers counters, flags, the best value found so far, a string being assembled.</p>`}},

{q:{ru:"Функция вызвана, а ничего не произошло. Почему?", en:"The function was called and nothing happened. Why?"},
 a:{ru:`<p>Три обычные причины, от самой частой к редкой.</p>
<p><strong>1. Результат никто не забрал.</strong></p>
<pre><code>sum(2, 3)               <span class="cm">// посчитала 5 и потеряла его</span>
x := sum(2, 3)          <span class="cm">// вот так значение сохранится</span></code></pre>
<p>Компилятор здесь молчит: отдельный вызов — законная строка. Функция честно отработала, просто её ответ выбросили.</p>
<p><strong>2. Функция объявлена, но не вызвана.</strong> Объявление ничего не выполняет, оно только описывает. Неиспользованная функция, в отличие от неиспользованной переменной, ошибкой не считается — программа соберётся и промолчит.</p>
<p><strong>3. Функция изменила параметр вместо возврата.</strong> Изменилась копия, снаружи всё как было. Лечится возвратом: <code>x = addTen(x)</code>.</p>
<p>Быстрая проверка: поставь <code>fmt.Println</code> первой строкой внутри функции. Ничего не напечаталось — значит, до вызова дело не дошло, и проблема в первом или втором пункте.</p>`,
    en:`<p>Three usual causes, from most to least common.</p>
<p><strong>1. Nobody took the result.</strong></p>
<pre><code>sum(2, 3)               <span class="cm">// computed 5 and lost it</span>
x := sum(2, 3)          <span class="cm">// this keeps the value</span></code></pre>
<p>The compiler stays quiet here: a standalone call is a legal statement. The function did its job, its answer was simply thrown away.</p>
<p><strong>2. The function is declared but never called.</strong> A declaration runs nothing, it only describes. Unlike an unused variable, an unused function is not an error — the program builds and says nothing.</p>
<p><strong>3. The function changed its parameter instead of returning.</strong> A copy changed; outside, everything is as it was. Cured by returning: <code>x = addTen(x)</code>.</p>
<p>Quick check: put a <code>fmt.Println</code> as the first line inside the function. Nothing printed means the call never happened, and the problem is cause one or two.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */
var SCENARIOS = [
{
 name:{ru:"Вызов и возврат", en:"Call and return"},
 params:[
   {key:"a", label:{ru:"a", en:"a"}, min:1, max:9, def:2},
   {key:"b", label:{ru:"b", en:"b"}, min:1, max:9, def:3}
 ],
 code: function(p){
   return ["func sum(a int, b int) int {","\treturn a + b","}","",
           "func main() {","\tx := sum(" + p.a + ", " + p.b + ")","\tfmt.Println(x)","}"];
 },
 steps: function(p){
   var A = String(p.a), B = String(p.b), S = String(p.a + p.b);
   return [
    {line:5, vars:[["a",A,"int"],["b",B,"int"]], out:"",
     note:{ru:"Вызов. Значения "+A+" и "+B+" скопировались в параметры <code>a</code> и <code>b</code>, управление ушло внутрь функции. Переменной <code>x</code> пока нет — справа ещё ничего не посчитано.",
           en:"The call. The values "+A+" and "+B+" were copied into the parameters <code>a</code> and <code>b</code>, and control moved inside the function. There is no <code>x</code> yet — nothing on the right has been computed."}},
    {line:1, vars:[["a",A,"int"],["b",B,"int"]], out:"",
     note:{ru:"<code>return</code> считает <code>a + b</code> и отдаёт "+S+" туда, откуда вызвали. На экране по-прежнему пусто: возврат — это не печать.",
           en:"<code>return</code> computes <code>a + b</code> and hands "+S+" back to the caller. The screen is still empty: returning is not printing."}},
    {line:5, vars:[["x",S,"int"]], out:"",
     note:{ru:"Управление вернулось на строку вызова, и число "+S+" легло в <code>x</code>. Параметров <code>a</code> и <code>b</code> больше нет — они жили только внутри функции.",
           en:"Control came back to the call line and "+S+" landed in <code>x</code>. The parameters <code>a</code> and <code>b</code> are gone — they lived only inside the function."}},
    {line:6, vars:[["x",S,"int"]], out:S+"\n",
     note:{ru:"Только теперь число попало на экран. Возврат и печать — два отдельных шага, и делают их разные строки.",
           en:"Only now does the number reach the screen. Returning and printing are two separate steps, done by two different lines."}}
   ];
 }
},
{
 name:{ru:"Печать — не возврат", en:"Printing is not returning"},
 params:[
   {key:"a", label:{ru:"a", en:"a"}, min:1, max:9, def:2},
   {key:"b", label:{ru:"b", en:"b"}, min:1, max:9, def:3}
 ],
 code: function(p){
   var call = "(" + p.a + ", " + p.b + ")";
   return ["func show(a int, b int) {","\tfmt.Println(a + b)","}","",
           "func sum(a int, b int) int {","\treturn a + b","}","",
           "func main() {","\tshow" + call,"\tx := sum" + call,"\tfmt.Println(x)","}"];
 },
 steps: function(p){
   var A = String(p.a), B = String(p.b), S = String(p.a + p.b);
   return [
    {line:9, vars:[["a",A,"int"],["b",B,"int"]], out:"",
     note:{ru:"Вызвали <code>show</code>. В её подписи после скобок нет типа — значит, отдавать наружу она ничего не будет.",
           en:"We called <code>show</code>. Its signature has no type after the parentheses, so it will hand nothing back."}},
    {line:1, vars:[["a",A,"int"],["b",B,"int"]], out:S+"\n",
     note:{ru:"Число "+S+" ушло на экран. В программу не вернулось ничего: после закрывающей скобки от этого вычисления не остаётся следа.",
           en:"The "+S+" went to the screen. Nothing came back into the program: past the closing brace no trace of the calculation is left."}},
    {line:10, vars:[["a",A,"int"],["b",B,"int"]], out:S+"\n",
     note:{ru:"Вызвали <code>sum</code> с теми же числами. В её подписи стоит <code>int</code> — она обязана вернуть значение.",
           en:"We called <code>sum</code> with the same numbers. Its signature says <code>int</code> — it must return a value."}},
    {line:5, vars:[["a",A,"int"],["b",B,"int"]], out:S+"\n",
     note:{ru:"<code>return</code> отдал "+S+" в место вызова. На экране ничего нового — вывод остался прежним.",
           en:"<code>return</code> handed "+S+" to the call site. Nothing new on screen — the output is unchanged."}},
    {line:10, vars:[["x",S,"int"]], out:S+"\n",
     note:{ru:"Значение легло в <code>x</code>. Вот чего не умеет <code>show</code>: у неё брать нечего, и строка <code>y := show("+A+", "+B+")</code> просто не собралась бы.",
           en:"The value landed in <code>x</code>. This is what <code>show</code> cannot do: there is nothing to take from it, and the line <code>y := show("+A+", "+B+")</code> would not even compile."}},
    {line:11, vars:[["x",S,"int"]], out:S+"\n"+S+"\n",
     note:{ru:"На экране два одинаковых числа "+S+". Но первое — тупик, а второе можно сложить, сравнить, передать дальше.",
           en:"Two identical "+S+"s on screen. But the first is a dead end, while the second can be added, compared, passed on."}}
   ];
 }
},
{
 name:{ru:"Накопитель до цикла", en:"Accumulator before the loop"},
 params:[
   {key:"n", label:{ru:"чисел", en:"numbers"}, min:2, max:8, def:3}
 ],
 code: function(p){
   var a = [];
   for(var i = 1; i <= p.n; i++) a.push(i);
   return ["func sumAll(nums []int) int {","\ttotal := 0","\tfor _, n := range nums {",
           "\t\ttotal = total + n","\t}","\treturn total","}","",
           "func main() {","\tx := sumAll([]int{" + a.join(", ") + "})","\tfmt.Println(x)","}"];
 },
 steps: function(p){
   var a = [], i;
   for(i = 1; i <= p.n; i++) a.push(i);
   var nums = "[" + a.join(" ") + "]", steps = [], total = 0;
   steps.push({line:9, vars:[["nums",nums,"[]int"]], out:"",
     note:{ru:"Вызов. Слайс из "+p.n+" чисел попал в параметр <code>nums</code>.",
           en:"The call. A slice of "+p.n+" numbers landed in the parameter <code>nums</code>."}});
   steps.push({line:1, vars:[["nums",nums,"[]int"],["total","0","int"]], out:"",
     note:{ru:"Накопитель создан <b>до</b> цикла. Он один на всю функцию и переживёт все "+p.n+" шагов.",
           en:"The accumulator is created <b>before</b> the loop. There is one for the whole function and it survives all "+p.n+" steps."}});
   for(i = 1; i <= p.n; i++){
     var head;
     if(i === 1) head = {ru:"Первый шаг из "+p.n+": <code>n</code> равно 1.", en:"Step one of "+p.n+": <code>n</code> is 1."};
     else if(i === p.n) head = {ru:"Шаг "+i+" — последний элемент.", en:"Step "+i+" — the last element."};
     else head = {ru:"Шаг "+i+". <code>total</code> не сбросился в ноль — он объявлен снаружи цикла.",
                  en:"Step "+i+". <code>total</code> was not reset to zero — it is declared outside the loop."};
     steps.push({line:2, vars:[["nums",nums,"[]int"],["total",String(total),"int"],["n",String(i),"int"]], out:"", note:head});
     var was = total; total = total + i;
     var tail;
     if(i === 1) tail = {ru:"0 + 1 = 1, и результат лёг обратно в тот же <code>total</code>.",
                         en:"0 + 1 = 1, and the result went back into the same <code>total</code>."};
     else if(i === p.n) tail = {ru:was+" + "+i+" = "+total+". Слайс кончился, следующего шага не будет.",
                                en:was+" + "+i+" = "+total+". The slice is exhausted, there will be no next step."};
     else tail = {ru:was+" + "+i+" = "+total+". Накопление идёт.", en:was+" + "+i+" = "+total+". The accumulation is working."};
     steps.push({line:3, vars:[["nums",nums,"[]int"],["total",String(total),"int"],["n",String(i),"int"]], out:"", note:tail});
   }
   var T = String(total);
   steps.push({line:5, vars:[["nums",nums,"[]int"],["total",T,"int"]], out:"",
     note:{ru:"Цикл закрылся, <code>n</code> больше нет. <code>return</code> стоит <b>после</b> цикла — только здесь ответ окончательный.",
           en:"The loop closed and <code>n</code> is gone. <code>return</code> sits <b>after</b> the loop — only here is the answer final."}});
   steps.push({line:9, vars:[["x",T,"int"]], out:"",
     note:{ru:"Число "+T+" вернулось в <code>main</code> и легло в <code>x</code>. Переменные функции исчезли вместе с ней.",
           en:"The "+T+" came back into <code>main</code> and landed in <code>x</code>. The function's variables vanished along with it."}});
   steps.push({line:10, vars:[["x",T,"int"]], out:T+"\n",
     note:{ru:"И только теперь печать.", en:"And only now does it print."}});
   return steps;
 }
},
{
 name:{ru:"return внутри цикла", en:"return inside the loop"},
 params:[
   {key:"n", label:{ru:"чисел", en:"numbers"}, min:2, max:8, def:3}
 ],
 code: function(p){
   var a = [];
   for(var i = 1; i <= p.n; i++) a.push(i);
   return ["func sumAll(nums []int) int {","\ttotal := 0","\tfor _, n := range nums {",
           "\t\ttotal = total + n","\t\treturn total","\t}","\treturn total","}","",
           "func main() {","\tx := sumAll([]int{" + a.join(", ") + "})","\tfmt.Println(x)","}"];
 },
 steps: function(p){
   var a = [], right = 0, i;
   for(i = 1; i <= p.n; i++){ a.push(i); right += i; }
   var nums = "[" + a.join(" ") + "]", R = String(right);
   return [
    {line:10, vars:[["nums",nums,"[]int"]], out:"",
     note:{ru:"Тот же вызов, что и в прошлом сценарии. Разница — одна строка внутри функции.",
           en:"The same call as in the previous scenario. The difference is one line inside the function."}},
    {line:1, vars:[["nums",nums,"[]int"],["total","0","int"]], out:"",
     note:{ru:"Накопитель на месте, до цикла. С ним всё в порядке.",
           en:"The accumulator is in place, before the loop. Nothing wrong with it."}},
    {line:2, vars:[["nums",nums,"[]int"],["total","0","int"],["n","1","int"]], out:"",
     note:{ru:"Первый шаг из "+p.n+". Цикл собирается пройти весь слайс.",
           en:"Step one of "+p.n+". The loop intends to walk the whole slice."}},
    {line:3, vars:[["nums",nums,"[]int"],["total","1","int"],["n","1","int"]], out:"",
     note:{ru:"0 + 1 = 1. Пока всё как в правильной версии.",
           en:"0 + 1 = 1. So far identical to the correct version."}},
    {line:4, vars:[["nums",nums,"[]int"],["total","1","int"],["n","1","int"]], out:"",
     note:{ru:"<code>return</code> отдал 1 и <b>закончил функцию целиком</b>. Остальных "+(p.n-1)+" шагов не будет: цикл оборвался вместе с ней. Строка 7 существует только чтобы код собрался — управление до неё не дойдёт никогда.",
           en:"<code>return</code> handed back 1 and <b>ended the entire function</b>. The other "+(p.n-1)+" steps will not happen: the loop died with it. Line 7 exists only to make the code compile — control will never reach it."}},
    {line:10, vars:[["x","1","int"]], out:"",
     note:{ru:"В <code>x</code> легла единица вместо "+R+". Сколько бы чисел ни было в слайсе, ответ всегда равен первому элементу.",
           en:"A 1 landed in <code>x</code> instead of "+R+". However many numbers are in the slice, the answer always equals the first element."}},
    {line:11, vars:[["x","1","int"]], out:"1\n",
     note:{ru:"Ответ неверный, а программа собралась и работает. Одна строка стоит не на своём месте — и никто об этом не предупредит.",
           en:"The answer is wrong yet the program compiles and runs. One line sits in the wrong place and nothing warns you."}}
   ];
 }
},
{
 name:{ru:"Ранний return в поиске", en:"Early return in a search"},
 params:[
   {key:"limit", label:{ru:"порог", en:"limit"}, min:0, max:5, def:3}
 ],
 code: function(p){
   return ["func firstOver(nums []int, limit int) int {","\tfor i, n := range nums {",
           "\t\tif n > limit {","\t\t\treturn i","\t\t}","\t}","\treturn -1","}","",
           "func main() {","\tx := firstOver([]int{3, 1, 4, 5, 2}, " + p.limit + ")","\tfmt.Println(x)","}"];
 },
 steps: function(p){
   var data = [3, 1, 4, 5, 2], nums = "[3 1 4 5 2]", L = String(p.limit);
   var steps = [], found = -1, i;
   steps.push({line:10, vars:[["nums",nums,"[]int"],["limit",L,"int"]], out:"",
     note:{ru:"Вызов. Функция ищет номер первого числа, которое больше "+L+".",
           en:"The call. The function looks for the index of the first number greater than "+L+"."}});
   for(i = 0; i < data.length; i++){
     var v = data[i], base = [["nums",nums,"[]int"],["limit",L,"int"],["i",String(i),"int"],["n",String(v),"int"]];
     steps.push({line:1, vars:base, out:"",
       note:{ru:"Шаг "+(i+1)+": <code>i</code> = "+i+", <code>n</code> = "+v+".",
             en:"Step "+(i+1)+": <code>i</code> = "+i+", <code>n</code> = "+v+"."}});
     if(v > p.limit){
       found = i;
       steps.push({line:2, vars:base, out:"",
         note:{ru:"Проверка: "+v+" &gt; "+L+" — верно. Заходим внутрь <code>if</code>.",
               en:"Check: "+v+" &gt; "+L+" — true. We go inside the <code>if</code>."}});
       steps.push({line:3, vars:base, out:"",
         note:{ru:"<code>return</code> отдал "+i+" и закончил функцию. Оставшиеся элементы не посмотрят — ответ уже не изменится, искать дальше незачем.",
               en:"<code>return</code> handed back "+i+" and ended the function. The remaining elements are never looked at — the answer cannot change, so there is no point looking further."}});
       break;
     }
     steps.push({line:2, vars:base, out:"",
       note:{ru:"Проверка: "+v+" &gt; "+L+" — неверно. <code>return</code> не сработал, цикл идёт на следующий шаг.",
             en:"Check: "+v+" &gt; "+L+" — false. The <code>return</code> did not fire, the loop moves to the next step."}});
   }
   if(found < 0){
     steps.push({line:6, vars:[["nums",nums,"[]int"],["limit",L,"int"]], out:"",
       note:{ru:"Цикл прошёл весь слайс и ничего не нашёл. Вот зачем нужен <code>return</code> после цикла: без него было бы <code>missing return</code>.",
             en:"The loop walked the whole slice and found nothing. This is why the <code>return</code> after the loop is needed: without it you would get <code>missing return</code>."}});
   }
   var F = String(found);
   steps.push({line:10, vars:[["x",F,"int"]], out:"",
     note:{ru:found < 0 ? "В <code>x</code> лёг −1 — признак того, что подходящего числа нет."
                        : "В <code>x</code> лёг номер "+F+". Это индекс, а не само число.",
           en:found < 0 ? "A −1 landed in <code>x</code> — the sign that no suitable number exists."
                        : "The index "+F+" landed in <code>x</code>. That is the position, not the number itself."}});
   steps.push({line:11, vars:[["x",F,"int"]], out:F+"\n",
     note:{ru:"Печать ответа. Подвигай порог: чем он выше, тем дольше идёт цикл, а на 5 он проходит весь слайс и возвращает −1.",
           en:"Printing the answer. Move the limit: the higher it is, the longer the loop runs, and at 5 it walks the whole slice and returns −1."}});
   return steps;
 }
},
{
 name:{ru:"Параметр — это копия", en:"A parameter is a copy"},
 params:[
   {key:"x", label:{ru:"x", en:"x"}, min:1, max:20, def:5}
 ],
 code: function(p){
   return ["func addTen(n int) {","\tn = n + 10","\tfmt.Println(n)","}","",
           "func main() {","\tx := " + p.x,"\taddTen(x)","\tfmt.Println(x)","}"];
 },
 steps: function(p){
   var X = String(p.x), N = String(p.x + 10);
   return [
    {line:6, vars:[["x",X,"int"]], out:"",
     note:{ru:"Создали <code>x</code> в <code>main</code>, в нём "+X+".",
           en:"We created <code>x</code> in <code>main</code>, holding "+X+"."}},
    {line:7, vars:[["x",X,"int"],["n",X,"int"]], out:"",
     note:{ru:"При вызове значение <code>x</code> скопировалось в параметр <code>n</code>. Это две разные переменные — просто содержимое пока одинаковое.",
           en:"On the call the value of <code>x</code> was copied into the parameter <code>n</code>. Two different variables — their contents just happen to match right now."}},
    {line:1, vars:[["x",X,"int"],["n",N,"int"]], out:"",
     note:{ru:"Изменился только <code>n</code>: стало "+N+". <code>x</code> не тронут — функция про него ничего не знает и достать его не может.",
           en:"Only <code>n</code> changed: it is now "+N+". <code>x</code> is untouched — the function knows nothing about it and cannot reach it."}},
    {line:2, vars:[["x",X,"int"],["n",N,"int"]], out:N+"\n",
     note:{ru:"Печатаем <code>n</code> — на экране "+N+". Именно здесь возникает обманчивое ощущение, что всё сработало.",
           en:"Printing <code>n</code> gives "+N+" on screen. This is exactly where the false sense that it worked comes from."}},
    {line:8, vars:[["x",X,"int"]], out:N+"\n"+X+"\n",
     note:{ru:"Функция закончилась, <code>n</code> исчез, снаружи по-прежнему "+X+". Чтобы изменение осталось, функция должна была вернуть новое значение, а <code>main</code> — присвоить его: <code>x = addTen(x)</code>.",
           en:"The function ended, <code>n</code> is gone, and outside it is still "+X+". For the change to stick the function should have returned a new value and <code>main</code> should have assigned it: <code>x = addTen(x)</code>."}}
   ];
 }
}
];

/* ================= ЧТО ИЗ ЭТОГО СКЛАДЫВАЕТСЯ ================= */
var OUTRO = {
 ru:`<p>Все семь правил держатся на одном различии: <strong>кому уходит значение</strong>. <code>fmt.Println</code> отдаёт его человеку, и на этом всё кончается. <code>return</code> отдаёт его программе — в ту самую строку, где стоял вызов. Отсюда растут и <code>missing return</code> (пообещал вернуть — верни), и <code>(no value) used as value</code> (брать нечего), и молча потерянная пятёрка в строке <code>sum(2, 3)</code>, и привычка «считает — пусть возвращает, печатает пусть вызвавший».</p>
<p>Вторая связка — про границы. Параметр создаётся при вызове и получает копию, поэтому снаружи ничего не меняется. Переменная живёт до своей закрывающей скобки, поэтому накопитель объявляют до цикла. <code>return</code> заканчивает функцию целиком, поэтому в цикле он стоит либо внутри — когда ответ уже окончательный, либо после — когда ответ известен только в конце. Правила разные, а вопрос за ними один: что и до каких пор существует.</p>
<p>Теперь ты можешь написать функцию с параметрами, вернуть из неё одно значение или несколько, подставить результат прямо в другой вызов и прочитать <code>missing return</code>, <code>assignment mismatch</code>, <code>undefined</code> и <code>no value used as value</code> не как случайную ругань, а как точное указание, что именно не сходится.</p>
<p>Если забудется всё остальное, пусть останется одно: <strong>напечатанное число программа не видит</strong>. Дальше живёт только то, что вернули.</p>`,
 en:`<p>All seven rules rest on one distinction: <strong>who receives the value</strong>. <code>fmt.Println</code> gives it to a human, and there it ends. <code>return</code> gives it to the program — to the very line where the call was written. Out of that grow <code>missing return</code> (you promised a value, hand one over), <code>(no value) used as value</code> (there is nothing to take), the silently dropped 5 in the line <code>sum(2, 3)</code>, and the habit of “if it computes, let it return; let the caller print”.</p>
<p>The second thread is about boundaries. A parameter is created on the call and gets a copy, so nothing changes outside. A variable lives until its closing brace, so the accumulator is declared before the loop. <code>return</code> ends the whole function, so inside a loop it goes either in — when the answer is already final — or after, when the answer is known only at the end. Different rules, one question behind them: what exists, and for how long.</p>
<p>You can now write a function with parameters, return one value or several from it, feed a result straight into another call, and read <code>missing return</code>, <code>assignment mismatch</code>, <code>undefined</code> and <code>no value used as value</code> not as random noise but as a precise statement of what does not add up.</p>
<p>If everything else fades, keep this: <strong>the program never sees a printed number</strong>. Only what was returned lives on.</p>`
};
