var META = {
  n: 10,
  slug: "10-func-values",
  eyebrow:{ru:"Go с нуля · тема 10 из 13", en:"Go from zero · topic 10 of 13"},
  title:  {ru:"Функции как значения", en:"Functions as values"},
  lede:{
    ru:"Функцию можно положить в переменную, передать в другую функцию и вернуть из неё. Без этого любое «сделай то же самое, но по другому правилу» превращается в копию кода с одной изменённой строкой.",
    en:"A function can be stored in a variable, passed into another function and returned from one. Without this, every “do the same thing but by a different rule” turns into a copy of the code with one line changed."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=21197s",
    t:{ru:"Курс по Go — глава «Функции» (5:53:17)", en:"Go course — the “Functions” chapter (5:53:17)"},
    d:{ru:"Отдельной главы про функции как значения нет — база в главе про функции.", en:"No separate chapter on functions as values — the base is in the functions chapter."}},
  folder: "fn1",
  txt: {ru:"go-tema-10-funkcii-kak-znacheniya.txt", en:"go-topic-10-functions-as-values.txt"}
};

/* ================= ЗАЧЕМ ЭТА ТЕМА ================= */
var INTRO = {
 ru:`<p>Функция до сих пор была именем, вписанным в текст программы. Написал <code>double(5)</code> — она выполнилась в этом месте. Какая именно функция сработает, решается в тот момент, когда ты набираешь код, и потом уже не меняется. Эта тема снимает ограничение: функция в Go — такое же значение, как число. Её кладут в переменную, передают в другую функцию аргументом, возвращают из функции и складывают в слайс.</p>
<p>Смотри, где без этого упираешься. Две функции обрабатывают слайс чисел по разным правилам:</p>
<pre><code>func doubleAll(nums []int) []int {
	res := []int{}
	for _, n := range nums {
		res = append(res, n*2)   <span class="cm">// вся разница здесь</span>
	}
	return res
}

func squareAll(nums []int) []int {
	res := []int{}
	for _, n := range nums {
		res = append(res, n*n)   <span class="cm">// и здесь</span>
	}
	return res
}</code></pre>
<p>Всё, кроме одной строки, написано дважды слово в слово: и заведение слайса, и цикл, и <code>append</code>, и <code>return</code>. Ошибёшься в цикле — чинить придётся в двух местах. Понадобится третье правило — цикл пишется третий раз. Вытащить правило в параметр нечем: параметром передают число, строку, слайс — но не действие. И выбрать правило во время работы программы тоже нельзя, потому что выбирать не из чего: <code>n*2</code> — это не значение, это кусок текста внутри цикла.</p>
<p>Освоив тему, ты сможешь написать такую обработку один раз, а правило подставлять снаружи; выбрать правило прямо во время работы — в <code>if</code>, по индексу из списка, из другой функции; и написать функцию, которая изготавливает другие функции.</p>
<p>Разбор идёт от одной пары скобок и вширь. Сначала — чем <code>double</code> отличается от <code>double(5)</code>: пока эта разница не видна, дальше двигаться бессмысленно. Из неё сразу выходит вопрос про тип: в переменную кладут значение определённого типа, значит тип есть и у функции — им окажется её сигнатура. Только после этого функцию можно объявить параметром, и появляется то, ради чего тема существует. Дальше выясняется, что имя правилу обычно не нужно — так появляется безымянная функция; а раз функция значение, из функций собирается слайс. Предпоследнее правило самое сильное: функция может ничего не считать, а изготавливать другую функцию, и та помнит переменные того места, где родилась. Последнее правило — четыре готовые обработки, в которых всё разобранное работает вместе.</p>`,
 en:`<p>So far a function has been a name written into the text of the program. You write <code>double(5)</code> and it runs at that spot. Which function runs is decided while you type the code, and it never changes afterwards. This topic removes that limit: a function in Go is a value like any other. You put it in a variable, pass it into another function as an argument, return it from a function, store it in a slice.</p>
<p>Look at where you get stuck without this. Two functions process a slice of numbers by different rules:</p>
<pre><code>func doubleAll(nums []int) []int {
	res := []int{}
	for _, n := range nums {
		res = append(res, n*2)   <span class="cm">// the whole difference is here</span>
	}
	return res
}

func squareAll(nums []int) []int {
	res := []int{}
	for _, n := range nums {
		res = append(res, n*n)   <span class="cm">// and here</span>
	}
	return res
}</code></pre>
<p>Everything but one line is written twice, word for word: creating the slice, the loop, the <code>append</code>, the <code>return</code>. Get the loop wrong and you fix it in two places. Need a third rule and the loop gets written a third time. There is nothing to pull the rule out into: a parameter carries a number, a string, a slice — not an action. And the rule cannot be chosen while the program runs either, because there is nothing to choose between: <code>n*2</code> is not a value, it is a piece of text inside the loop.</p>
<p>Once this topic is yours you can write that processing once and supply the rule from outside; pick the rule while the program is running — in an <code>if</code>, by index from a list, from another function; and write a function that manufactures other functions.</p>
<p>The walkthrough spreads out from a single pair of parentheses. First, how <code>double</code> differs from <code>double(5)</code>: until you can see that difference there is no point in going further. The question of type follows straight from it — a variable holds a value of some type, so a function has a type too, and that type turns out to be its signature. Only then can a function be declared as a parameter, and the thing this topic exists for finally appears. Next it turns out that a rule usually needs no name at all — that is the anonymous function; and since a function is a value, functions go into a slice. The second-to-last rule is the strongest: a function can compute nothing and manufacture another function instead, and the one it makes remembers the variables of the place it was born in. The last rule is four ready-made pieces of processing where everything above works together.</p>`
};

/* ================= ПРАВИЛА ================= */
var RULES = [
{
 h:{ru:"Имя без скобок — сама функция, со скобками — вызов",
    en:"A name without parentheses is the function itself, with parentheses it is a call"},
 b:{ru:`<p>Функция в Go — обычное значение, такое же, как число или строка. Чтобы положить её в переменную, ничего особенного делать не нужно: слева имя переменной, справа имя функции.</p>
<pre><code>func double(x int) int {
	return x * 2
}

f := double      <span class="cm">// в f лежит сама функция</span>
n := double(5)   <span class="cm">// в n лежит число 10</span>

fmt.Println(f(5))   <span class="cm">// 10 — вызвали через переменную</span>
fmt.Println(n)      <span class="cm">// 10 — просто напечатали число</span></code></pre>
<p>Вся разница между этими двумя строками — в круглых скобках. Нет скобок — функция не выполняется, её берут как значение и кладут целиком. Есть скобки — функция выполняется прямо здесь, в этой самой строке, и в переменную попадает то, что она вернула.</p>
<p>После этого <code>f</code> работает как второе имя той же функции: <code>f(5)</code> и <code>double(5)</code> запускают один и тот же код и дают один и тот же результат.</p>
<p>Если перепутать, компилятор ругается не там, где ошибка. Строка <code>f := double(5)</code> совершенно законна — в <code>f</code> просто оказывается число 10. Ломается всё ниже, на первом же вызове:</p>
<pre><code>f := double(5)
fmt.Println(f(2))   <span class="cm">// invalid operation: cannot call f (variable of type int): int is not a function</span></code></pre>
<p>Читай эту ошибку буквально: перед скобками стоит <code>int</code>, а вызывать можно только функцию. Строку компилятор показывает верно, но причина — строкой выше.</p>`,
    en:`<p>A function in Go is an ordinary value, just like a number or a string. Putting one into a variable takes nothing special: the variable name on the left, the function name on the right.</p>
<pre><code>func double(x int) int {
	return x * 2
}

f := double      <span class="cm">// f holds the function itself</span>
n := double(5)   <span class="cm">// n holds the number 10</span>

fmt.Println(f(5))   <span class="cm">// 10 — called through the variable</span>
fmt.Println(n)      <span class="cm">// 10 — just printed a number</span></code></pre>
<p>The whole difference between those two lines is the parentheses. No parentheses — the function does not run, it is taken as a value and stored whole. Parentheses — the function runs right there, on that very line, and what it returned is what lands in the variable.</p>
<p>From then on <code>f</code> works as a second name for the same function: <code>f(5)</code> and <code>double(5)</code> run the same code and give the same result.</p>
<p>Mix the two up and the compiler complains away from the mistake. The line <code>f := double(5)</code> is perfectly legal — <code>f</code> simply ends up holding the number 10. What breaks is further down, at the first call:</p>
<pre><code>f := double(5)
fmt.Println(f(2))   <span class="cm">// invalid operation: cannot call f (variable of type int): int is not a function</span></code></pre>
<p>Read that error literally: what stands in front of the parentheses is an <code>int</code>, and only a function can be called. The line it points at is right; the cause is one line above.</p>`}
},
{
 h:{ru:"Тип функции — это её сигнатура", en:"The type of a function is its signature"},
 b:{ru:`<p>Раз функцию кладут в переменную, у неё обязан быть тип: переменных без типа в Go не бывает. Тип функции складывается из двух вещей — что она принимает и что возвращает. Больше в него не входит ничего: ни имя функции, ни имена параметров, ни то, что написано в теле.</p>
<pre><code>func(int) int          <span class="cm">// берёт int, возвращает int</span>
func(int) bool         <span class="cm">// берёт int, возвращает bool</span>
func(int)              <span class="cm">// берёт int, ничего не возвращает</span>
func() int             <span class="cm">// ничего не берёт, возвращает int</span>
func(int, int) bool    <span class="cm">// берёт два int, возвращает bool</span></code></pre>
<p>Это <strong>пять разных типов</strong> — таких же разных между собой, как <code>int</code> и <code>string</code>. Функцию типа <code>func(int) bool</code> нельзя положить туда, где ждут <code>func(int) int</code>, и правильность тела тут ничего не решает: сверяются только сигнатуры.</p>
<p>А вот <code>func(x int) int</code> и <code>func(y int) int</code> — один и тот же тип. Имя параметра живёт внутри тела функции и наружу не выходит, поэтому в типе его нет.</p>
<p>Посмотреть тип можно тем же <code>%T</code>, что и у чисел:</p>
<pre><code>fmt.Printf("%T\\n", double)      <span class="cm">// func(int) int</span>
fmt.Printf("%T\\n", double(5))   <span class="cm">// int</span></code></pre>
<p>Эти две строки — то же правило про скобки, только теперь его видно на экране. Не уверен, что лежит в переменной, — напечатай её тип. Увидел <code>func(int) int</code> — там функция. Увидел <code>int</code> — там уже результат.</p>
<p>Отсюда же нулевое значение. Переменная-функция, объявленная через <code>var</code>, не содержит никакой функции: в ней <code>nil</code>. Такая строка собирается молча, и это опасно — падает не она, а вызов:</p>
<pre><code>var f func(int) int
fmt.Println(f(5))   <span class="cm">// panic: runtime error: invalid memory address or nil pointer dereference</span></code></pre>`,
    en:`<p>Since a function goes into a variable, it must have a type: there are no typeless variables in Go. A function's type is made of two things — what it takes and what it returns. Nothing else belongs to it: not the function's name, not the parameter names, not what is written in the body.</p>
<pre><code>func(int) int          <span class="cm">// takes int, returns int</span>
func(int) bool         <span class="cm">// takes int, returns bool</span>
func(int)              <span class="cm">// takes int, returns nothing</span>
func() int             <span class="cm">// takes nothing, returns int</span>
func(int, int) bool    <span class="cm">// takes two ints, returns bool</span></code></pre>
<p>These are <strong>five different types</strong> — as different from each other as <code>int</code> and <code>string</code>. A <code>func(int) bool</code> cannot go where a <code>func(int) int</code> is expected, and how correct the body is decides nothing: only the signatures are compared.</p>
<p>But <code>func(x int) int</code> and <code>func(y int) int</code> are the same type. A parameter name lives inside the body and never leaves it, so the type does not carry it.</p>
<p>You can inspect the type with the same <code>%T</code> you use for numbers:</p>
<pre><code>fmt.Printf("%T\\n", double)      <span class="cm">// func(int) int</span>
fmt.Printf("%T\\n", double(5))   <span class="cm">// int</span></code></pre>
<p>Those two lines are the parentheses rule again, only now you can see it on screen. Not sure what a variable holds? Print its type. <code>func(int) int</code> means a function is in there. <code>int</code> means it is already a result.</p>
<p>The zero value follows from the same place. A function variable declared with <code>var</code> holds no function at all: it holds <code>nil</code>. That line compiles in silence, which is what makes it dangerous — it is not the declaration that fails but the call:</p>
<pre><code>var f func(int) int
fmt.Println(f(5))   <span class="cm">// panic: runtime error: invalid memory address or nil pointer dereference</span></code></pre>`}
},
{
 h:{ru:"Функцию передают в функцию как обычный параметр",
    en:"A function is passed to a function like any other parameter"},
 b:{ru:`<p>Тип понадобился не сам по себе. Он нужен, чтобы функцию можно было записать в параметр — а это и есть то, ради чего существует вся тема.</p>
<p>Параметр объявляется как всегда: сначала имя, потом тип. Тип здесь — сигнатура целиком, вместе со словом <code>func</code>.</p>
<pre><code>func apply(f func(int) int, n int) int {
	return f(n)
}

apply(double, 5)   <span class="cm">// 10</span>
apply(square, 5)   <span class="cm">// 25</span></code></pre>
<p>Внутри <code>apply</code> ничего не известно про то, что делает <code>f</code>: удваивает, возводит в квадрат, вычитает — не важно. Известно ровно то, что записано в типе: <code>f</code> берёт один <code>int</code> и отдаёт один <code>int</code>. Этого достаточно, чтобы её вызвать, и большего не требуется.</p>
<p>Вернись к двум функциям из начала темы — <code>doubleAll</code> и <code>squareAll</code>, где совпадало всё, кроме одной строки. С параметром-функцией они схлопываются в одну:</p>
<pre><code>func applyAll(nums []int, f func(int) int) []int {
	res := []int{}
	for _, n := range nums {
		res = append(res, f(n))
	}
	return res
}</code></pre>
<p>Цикл, <code>append</code> и сборка результата написаны один раз. Правило приходит снаружи и меняется без единой правки внутри.</p>
<p>Второе следствие менее заметное, но не менее важное: правило теперь можно выбрать во время работы программы. Оно лежит в переменной, а переменной можно присвоить одно или другое в <code>if</code>, взять её из слайса, получить из другой функции. Имя, вписанное прямо в цикл, так использовать нельзя — оно решается один раз, когда ты пишешь код.</p>
<p>Передашь не то — компилятор остановит сразу и назовёт обе сигнатуры, твою и ожидаемую. <code>func(int) bool</code> вместо <code>func(int) int</code> не пройдёт, даже если внутри всё посчитано верно: смотри на первую строку функции, а не на тело.</p>`,
    en:`<p>The type was not needed for its own sake. It is needed so a function can be written into a parameter — and that is what this whole topic exists for.</p>
<p>The parameter is declared as usual: name first, then type. The type here is the full signature, the word <code>func</code> included.</p>
<pre><code>func apply(f func(int) int, n int) int {
	return f(n)
}

apply(double, 5)   <span class="cm">// 10</span>
apply(square, 5)   <span class="cm">// 25</span></code></pre>
<p>Inside <code>apply</code> nothing is known about what <code>f</code> does: doubles, squares, subtracts — it makes no difference. All that is known is what the type says: <code>f</code> takes one <code>int</code> and gives back one <code>int</code>. That is enough to call it, and nothing more is required.</p>
<p>Go back to the two functions from the start of the topic — <code>doubleAll</code> and <code>squareAll</code>, identical except for one line. With a function parameter they collapse into one:</p>
<pre><code>func applyAll(nums []int, f func(int) int) []int {
	res := []int{}
	for _, n := range nums {
		res = append(res, f(n))
	}
	return res
}</code></pre>
<p>The loop, the <code>append</code> and the result building are written once. The rule comes from outside and changes without touching a single line inside.</p>
<p>The second consequence is quieter but no less important: the rule can now be chosen while the program runs. It sits in a variable, and a variable can be assigned one thing or another in an <code>if</code>, taken from a slice, produced by another function. A name written straight into the loop cannot be used that way — it is settled once, when you type the code.</p>
<p>Pass the wrong thing and the compiler stops you at once, naming both signatures, yours and the expected one. A <code>func(int) bool</code> will not do instead of a <code>func(int) int</code>, however correct its arithmetic: look at the function's first line, not at its body.</p>`}
},
{
 h:{ru:"Безымянная функция пишется прямо на месте",
    en:"An anonymous function is written right where it is needed"},
 b:{ru:`<p>Правило приходит снаружи — но пока под каждое правило приходится заводить отдельную функцию с именем где-то наверху файла. Если правило нужно один раз, имя ему не нужно. Пишешь <code>func</code>, скобки с параметрами, тип возврата и тело — прямо там, где эта функция понадобилась.</p>
<pre><code>apply(func(x int) int { return x * 2 }, 5)   <span class="cm">// 10</span></code></pre>
<p>Смотри на запятую после закрывающей фигурной скобки: это граница между первым аргументом и вторым. Функция целиком, от слова <code>func</code> до <code>}</code>, стоит на месте одного аргумента — точно так же, как стояло бы имя <code>double</code>.</p>
<p>Такую функцию можно и положить в переменную. Получится ровно то же, что в первом правиле, только справа не имя, а сама функция:</p>
<pre><code>square := func(x int) int { return x * x }
fmt.Println(square(6))   <span class="cm">// 36</span></code></pre>
<p>А можно вызвать сразу, дописав скобки с аргументами в конце. Здесь работает то же правило про скобки: тело — само значение, скобки после него — вызов.</p>
<pre><code>fmt.Println(func(a, b int) int { return a + b }(2, 3))   <span class="cm">// 5</span></code></pre>
<p>Никакой новой сущности тут не появилось. Тип у безымянной функции такой же — <code>func(int) int</code>; вызывается она так же, ведёт себя так же. Разница ровно одна: имени нет, поэтому обратиться к ней можно только там, где она написана, или через переменную, в которую её положили.</p>
<p>Есть и то, чего функция с именем не умеет вовсе: безымянная видит переменные, объявленные вокруг неё. Функция с именем объявляется на верхнем уровне файла и до локальных переменных не дотягивается. На этом будет построено предпоследнее правило.</p>`,
    en:`<p>The rule now comes from outside — but so far every rule needs its own named function somewhere at the top of the file. If a rule is used once, it does not need a name. Write <code>func</code>, the parameter parentheses, the return type and the body, right where the function is needed.</p>
<pre><code>apply(func(x int) int { return x * 2 }, 5)   <span class="cm">// 10</span></code></pre>
<p>Watch the comma after the closing brace: it is the border between the first argument and the second. The whole function, from the word <code>func</code> to the <code>}</code>, stands in the place of one argument — exactly where the name <code>double</code> would have stood.</p>
<p>Such a function can also go into a variable. You get precisely what the first rule showed, except that the right-hand side is the function itself instead of a name:</p>
<pre><code>square := func(x int) int { return x * x }
fmt.Println(square(6))   <span class="cm">// 36</span></code></pre>
<p>Or you can call it on the spot by adding the argument parentheses at the end. The parentheses rule applies here too: the body is the value, the parentheses after it are the call.</p>
<pre><code>fmt.Println(func(a, b int) int { return a + b }(2, 3))   <span class="cm">// 5</span></code></pre>
<p>Nothing new has appeared. An anonymous function has the same type — <code>func(int) int</code>; it is called the same way and behaves the same way. There is exactly one difference: it has no name, so you can reach it only where it is written, or through the variable you put it in.</p>
<p>And there is one thing a named function cannot do at all: an anonymous one can see the variables declared around it. A named function is declared at the top level of the file and never reaches local variables. The second-to-last rule is built on this.</p>`}
},
{
 h:{ru:"Функции складывают в слайс и вызывают по индексу",
    en:"Functions go into a slice and are called by index"},
 b:{ru:`<p>Раз функция — значение, её можно не только передать в другую функцию, но и сложить в слайс. Тип элемента — всё та же сигнатура.</p>
<pre><code>rules := []func(int) int{
	func(x int) int { return x * 2 },
	func(x int) int { return x + 100 },
	func(x int) int { return x * x },
}

fmt.Println(rules[0](5))   <span class="cm">// 10</span>
fmt.Println(rules[2](5))   <span class="cm">// 25</span></code></pre>
<p>Запись <code>rules[0](5)</code> читается слева направо, без исключений: <code>rules[0]</code> — элемент слайса, то есть функция; скобки после неё — вызов этой функции с пятёркой. Скобки те же самые, что в первом правиле, просто перед ними стоит не имя, а обращение по индексу.</p>
<p>Здесь видно вживую то, о чём в третьем правиле говорилось отвлечённо: правило выбирается во время работы программы. Индекс — обычное число, его можно посчитать, прочитать со входа, получить из цикла.</p>
<pre><code>for i, f := range rules {
	fmt.Println(i, f(5))
}</code></pre>
<p>Цикл по такому слайсу ничем не отличается от цикла по числам: на каждом шаге в <code>f</code> оказывается очередная функция, и её вызывают. Причём <code>f</code> здесь — обычная переменная, её можно передать дальше, в тот же <code>apply</code>.</p>
<p>Одна мелочь ломает сборку чаще всего: запятая после последней функции в списке обязательна. Строки тут длинные, конец списка не помещается на экран, и без неё получишь <code>syntax error: unexpected newline in composite literal; possibly missing comma or }</code>. Правило общее для всех составных литералов, но спотыкаются об него именно на функциях.</p>`,
    en:`<p>Since a function is a value, you can do more than pass it into another function — you can put it in a slice. The element type is that same signature.</p>
<pre><code>rules := []func(int) int{
	func(x int) int { return x * 2 },
	func(x int) int { return x + 100 },
	func(x int) int { return x * x },
}

fmt.Println(rules[0](5))   <span class="cm">// 10</span>
fmt.Println(rules[2](5))   <span class="cm">// 25</span></code></pre>
<p>The expression <code>rules[0](5)</code> reads left to right, no exceptions: <code>rules[0]</code> is an element of the slice, meaning a function; the parentheses after it are the call to that function with a five. They are the very same parentheses as in the first rule — only what stands before them is an index lookup rather than a name.</p>
<p>Here you can watch the thing rule three described in the abstract: the rule is chosen while the program runs. An index is an ordinary number — it can be computed, read from input, produced by a loop.</p>
<pre><code>for i, f := range rules {
	fmt.Println(i, f(5))
}</code></pre>
<p>Looping over such a slice is no different from looping over numbers: on each step <code>f</code> holds the next function and gets called. And <code>f</code> here is an ordinary variable — you can hand it on further, to that same <code>apply</code>.</p>
<p>One small thing breaks the build more often than anything else: the comma after the last function in the list is mandatory. The lines are long, the end of the list does not fit on screen, and without it you get <code>syntax error: unexpected newline in composite literal; possibly missing comma or }</code>. The rule holds for every composite literal, but it is on functions that people trip over it.</p>`}
},
{
 h:{ru:"Функция может вернуть функцию, и та помнит переменные снаружи",
    en:"A function can return a function, and that one remembers the variables around it"},
 b:{ru:`<p>В четвёртом правиле осталась незакрытая нить: безымянная функция видит переменные вокруг себя. Соедини это с тем, что функцию можно вернуть, — и получится самое сильное место темы.</p>
<p>Если функция возвращает функцию, в её сигнатуре просто стоит другая сигнатура:</p>
<pre><code>func multiplier(k int) func(int) int {
	return func(x int) int {
		return x * k
	}
}

double := multiplier(2)
triple := multiplier(3)

fmt.Println(double(5))   <span class="cm">// 10</span>
fmt.Println(triple(5))   <span class="cm">// 15</span></code></pre>
<p><code>multiplier</code> ничего не считает. Она изготавливает функцию и отдаёт её наружу. Внутренняя функция пользуется <code>k</code>, хотя <code>k</code> объявлена не в ней, а в заголовке <code>multiplier</code>.</p>
<p>Дальше начинается главное. К моменту, когда вызывают <code>double(5)</code>, <code>multiplier</code> давно закончилась — а <code>k</code> всё ещё на месте. Иначе и быть не может: раз возвращённая функция пользуется <code>k</code>, убирать эту переменную нельзя, пока жива сама функция. Функция вместе с переменными, которые она таким образом держит, называется <strong>замыканием</strong>.</p>
<p>Каждый вызов <code>multiplier</code> создаёт собственную <code>k</code>. У <code>double</code> внутри двойка, у <code>triple</code> — тройка; это две разные переменные, и они не мешают друг другу, хотя код внутри у обеих один и тот же.</p>
<p>Переменную можно не только читать, но и менять — тогда она работает как память между вызовами:</p>
<pre><code>func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

next := counter()
fmt.Println(next())   <span class="cm">// 1</span>
fmt.Println(next())   <span class="cm">// 2</span></code></pre>
<p>Смотри, где объявлена <code>n</code>: выше <code>return</code>, внутри <code>counter</code>. Строка <code>n := 0</code> выполняется один раз, при вызове <code>counter()</code>. Перенеси её внутрь возвращаемой функции — и она станет выполняться на каждом вызове, обнуляя счёт: напечатается 1 и 1.</p>
<p>И то, из-за чего ошибаются чаще всего: замыкание помнит <strong>саму переменную</strong>, а не её значение на момент создания функции.</p>
<pre><code>k := 2
f := func(x int) int { return x * k }
k = 10
fmt.Println(f(5))   <span class="cm">// 50, а не 10</span></code></pre>
<p>Странного тут ничего нет — это та же самая <code>k</code>, второй не появилось. Нужно зафиксировать значение — передавай его параметром: параметр получает собственную копию, и она уже ни от чего снаружи не зависит.</p>`,
    en:`<p>Rule four left a thread hanging: an anonymous function can see the variables around it. Join that with the fact that a function can be returned, and you get the strongest part of the topic.</p>
<p>When a function returns a function, its signature simply contains another signature:</p>
<pre><code>func multiplier(k int) func(int) int {
	return func(x int) int {
		return x * k
	}
}

double := multiplier(2)
triple := multiplier(3)

fmt.Println(double(5))   <span class="cm">// 10</span>
fmt.Println(triple(5))   <span class="cm">// 15</span></code></pre>
<p><code>multiplier</code> computes nothing. It manufactures a function and hands it out. The inner function uses <code>k</code>, even though <code>k</code> is declared not inside it but in <code>multiplier</code>'s header.</p>
<p>Now the important part. By the time <code>double(5)</code> is called, <code>multiplier</code> finished long ago — and <code>k</code> is still there. It could not be otherwise: since the returned function uses <code>k</code>, that variable cannot be taken away while the function is alive. A function together with the variables it holds this way is called a <strong>closure</strong>.</p>
<p>Every call to <code>multiplier</code> creates its own <code>k</code>. Inside <code>double</code> it is a two, inside <code>triple</code> a three; they are two separate variables and never interfere, even though the code inside both is identical.</p>
<p>The variable can be changed as well as read — and then it works as memory between calls:</p>
<pre><code>func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

next := counter()
fmt.Println(next())   <span class="cm">// 1</span>
fmt.Println(next())   <span class="cm">// 2</span></code></pre>
<p>Look at where <code>n</code> is declared: above the <code>return</code>, inside <code>counter</code>. The line <code>n := 0</code> runs once, when <code>counter()</code> is called. Move it inside the returned function and it will run on every call, resetting the count: you get 1 and 1.</p>
<p>And here is what people get wrong most often: a closure remembers <strong>the variable itself</strong>, not its value at the moment the function was made.</p>
<pre><code>k := 2
f := func(x int) int { return x * k }
k = 10
fmt.Println(f(5))   <span class="cm">// 50, not 10</span></code></pre>
<p>There is nothing strange about it — it is the same <code>k</code>, no second one appeared. If you need the value frozen, pass it in as a parameter: a parameter gets its own copy, and that copy depends on nothing outside.</p>`}
},
{
 h:{ru:"Четыре применения, из которых состоит почти всё",
    en:"Four uses that cover almost everything"},
 b:{ru:`<p>Все части разобраны. Осталось посмотреть, как они складываются в готовые обработки — и заметить, что обработок этих на удивление мало.</p>
<p>Тело везде устроено одинаково: цикл по слайсу, вызов правила, что-то сделать с ответом. Меняются две вещи — тип правила и одна строка внутри цикла.</p>
<pre><code><span class="cm">// применить ко всем: правило делает новое значение</span>
func applyAll(nums []int, f func(int) int) []int {
	res := []int{}
	for _, n := range nums {
		res = append(res, f(n))
	}
	return res
}

<span class="cm">// отфильтровать: правило отвечает да/нет</span>
func filter(nums []int, ok func(int) bool) []int {
	res := []int{}
	for _, n := range nums {
		if ok(n) {
			res = append(res, n)
		}
	}
	return res
}

<span class="cm">// посчитать подходящие: то же правило, другой ответ</span>
func countIf(nums []int, ok func(int) bool) int {
	c := 0
	for _, n := range nums {
		if ok(n) {
			c++
		}
	}
	return c
}</code></pre>
<p>Тип правила выбирается не по вкусу, а по тому, что правило отвечает про одно число. Делает из числа новое число — <code>func(int) int</code>. Отвечает да или нет — <code>func(int) bool</code>. Сравни <code>filter</code> и <code>countIf</code>: тип правила у них общий, потому что вопрос один и тот же, а внутри <code>if</code> они различаются одной строкой — тем, что делают с подошедшим числом.</p>
<p>Четвёртое — сравнение. Правило берёт два числа и отвечает, какое из них должно стоять раньше; отсюда и тип <code>func(int, int) bool</code>. Сортировка написана один раз, а порядок задаётся снаружи:</p>
<pre><code>func sortBy(nums []int, less func(int, int) bool) []int {
	for i := 0; i < len(nums); i++ {
		for j := 0; j < len(nums)-1-i; j++ {
			if less(nums[j+1], nums[j]) {
				nums[j], nums[j+1] = nums[j+1], nums[j]
			}
		}
	}
	return nums
}

sortBy(a, func(x, y int) bool { return x < y })   <span class="cm">// по возрастанию</span>
sortBy(a, func(x, y int) bool { return x > y })   <span class="cm">// по убыванию</span></code></pre>
<p>Развернуть порядок на обратный — переставить один знак в правиле. Саму сортировку при этом не трогают вообще: два цикла, сравнение и обмен остаются как были.</p>`,
    en:`<p>All the parts are covered. What is left is to see how they assemble into ready-made processing — and to notice how few kinds of processing there actually are.</p>
<p>The body is built the same way every time: loop over the slice, call the rule, do something with the answer. Two things change — the rule's type and one line inside the loop.</p>
<pre><code><span class="cm">// map over all: the rule makes a new value</span>
func applyAll(nums []int, f func(int) int) []int {
	res := []int{}
	for _, n := range nums {
		res = append(res, f(n))
	}
	return res
}

<span class="cm">// filter: the rule answers yes/no</span>
func filter(nums []int, ok func(int) bool) []int {
	res := []int{}
	for _, n := range nums {
		if ok(n) {
			res = append(res, n)
		}
	}
	return res
}

<span class="cm">// count matches: same rule type, different answer</span>
func countIf(nums []int, ok func(int) bool) int {
	c := 0
	for _, n := range nums {
		if ok(n) {
			c++
		}
	}
	return c
}</code></pre>
<p>The rule's type is not a matter of taste — it follows from what the rule answers about one number. Turns a number into a new number: <code>func(int) int</code>. Answers yes or no: <code>func(int) bool</code>. Compare <code>filter</code> and <code>countIf</code>: they share a rule type because they ask the same question, and inside the <code>if</code> they differ by one line — what they do with a number that matched.</p>
<p>The fourth one is comparison. The rule takes two numbers and answers which of them belongs earlier; hence the type <code>func(int, int) bool</code>. The sort is written once and the order comes from outside:</p>
<pre><code>func sortBy(nums []int, less func(int, int) bool) []int {
	for i := 0; i < len(nums); i++ {
		for j := 0; j < len(nums)-1-i; j++ {
			if less(nums[j+1], nums[j]) {
				nums[j], nums[j+1] = nums[j+1], nums[j]
			}
		}
	}
	return nums
}

sortBy(a, func(x, y int) bool { return x < y })   <span class="cm">// ascending</span>
sortBy(a, func(x, y int) bool { return x > y })   <span class="cm">// descending</span></code></pre>
<p>Reversing the order means flipping one sign in the rule. The sort itself is not touched at all: the two loops, the comparison and the swap stay exactly as they were.</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ + ГРАБЛИ ================= */
var TABLE = {
  title:{ru:"Тип правила выбирается по его ответу", en:"The rule type follows from its answer"},
  intro:{ru:"Обработка слайса везде одинаковая. Смотри, что отвечает правило — от этого и зависит его тип.",
         en:"The slice processing is the same everywhere. Look at what the rule answers — that decides its type."},
  head:{ru:["Что делаем","Тип правила","Что отвечает правило","Что возвращает функция"],
        en:["What we do","Rule type","What the rule answers","What the function returns"]},
  rows:[
    ["applyAll","func(int) int",{ru:"новое значение",en:"a new value"},"[]int"],
    ["filter","func(int) bool",{ru:"оставить?",en:"keep it?"},"[]int"],
    ["countIf","func(int) bool",{ru:"подходит?",en:"does it match?"},"int"],
    ["findFirst","func(int) bool",{ru:"подходит?",en:"does it match?"},{ru:"int — индекс или -1",en:"int — index or -1"}],
    ["sortBy","func(int, int) bool",{ru:"x раньше y?",en:"does x come before y?"},"[]int"],
    ["counter",{ru:"нет параметра",en:"no parameter"},{ru:"следующее число",en:"the next number"},"func() int"]
  ]
};

var TRAPS = [
 {ru:"<strong>Лишние скобки превращают функцию в число.</strong> <code>f := double</code> кладёт функцию, <code>f := double(5)</code> — уже число 10. Обе строки собираются, а ломается всё ниже, на <code>f(2)</code>: <code>invalid operation: cannot call f (variable of type int): int is not a function</code>. Одна пара скобок меняет всё.",
  en:"<strong>Extra parentheses turn a function into a number.</strong> <code>f := double</code> stores the function, <code>f := double(5)</code> stores the number 10. Both lines compile; what breaks is further down, at <code>f(2)</code>: <code>invalid operation: cannot call f (variable of type int): int is not a function</code>. One pair of parentheses changes everything."},
 {ru:"<strong>Объявил переменную-функцию и не положил в неё ничего — программа падает при вызове.</strong> Нулевое значение функции — <code>nil</code>. Код <code>var f func(int) int</code> собирается спокойно, а <code>f(5)</code> роняет всё: <code>panic: runtime error: invalid memory address or nil pointer dereference</code>. Компилятор тут не поможет.",
  en:"<strong>Declare a function variable, put nothing in it, and the program crashes on the call.</strong> The zero value of a function is <code>nil</code>. <code>var f func(int) int</code> compiles fine, but <code>f(5)</code> blows up: <code>panic: runtime error: invalid memory address or nil pointer dereference</code>. The compiler won't save you here."},
 {ru:"<strong>Правильное тело с неправильной сигнатурой не подойдёт.</strong> Передать <code>func(int) bool</code> туда, где ждут <code>func(int) int</code>, нельзя, даже если внутри всё верно. Так же не подойдёт <code>func(int, int) int</code> вместо <code>func(int) int</code>. Читай ошибку до конца — там написаны обе сигнатуры, твоя и ожидаемая.",
  en:"<strong>A correct body with the wrong signature won't fit.</strong> You cannot pass a <code>func(int) bool</code> where a <code>func(int) int</code> is expected, however right the body is. Same for <code>func(int, int) int</code> instead of <code>func(int) int</code>. Read the error to the end — it prints both signatures, yours and the expected one."},
 {ru:"<strong>Замыкание помнит переменную, а не её значение.</strong> Часто ждут, что функция запомнит то, что было в момент создания:<br><code>k := 2</code> · <code>f := func(x int) int { return x * k }</code> · <code>k = 10</code> · <code>f(5)</code> даёт <strong>50</strong>, а не 10. Нужно зафиксировать значение — передавай его параметром.",
  en:"<strong>A closure remembers the variable, not its value.</strong> People expect the function to freeze whatever was there at creation time:<br><code>k := 2</code> · <code>f := func(x int) int { return x * k }</code> · <code>k = 10</code> · <code>f(5)</code> gives <strong>50</strong>, not 10. If you need the value frozen, pass it in as a parameter."},
 {ru:"<strong><code>fmt.Println(f)</code> печатает адрес, а не функцию.</strong> На экране будет что-то вроде <code>0x102a3f4c0</code> — заглянуть внутрь функции так нельзя. И сравнивать функции нельзя тоже: <code>f == g</code> не соберётся, функции сравнивают только с <code>nil</code>.",
  en:"<strong><code>fmt.Println(f)</code> prints an address, not the function.</strong> You get something like <code>0x102a3f4c0</code> — there is no way to look inside a function like that. Comparing them is out too: <code>f == g</code> won't compile, functions can only be compared to <code>nil</code>."},
 {ru:"<strong>В списке функций запятая нужна и после последней.</strong> В слайсе, записанном в несколько строк, каждая строка заканчивается запятой — включая последнюю. Забудешь — <code>syntax error: unexpected newline in composite literal; possibly missing comma or }</code>. Правило общее для всех составных литералов, но на функциях об него спотыкаются чаще: строки длинные, конец списка не виден.",
  en:"<strong>In a list of functions the last item needs a comma too.</strong> In a multi-line slice literal every line ends with a comma — the last one included. Forget it and you get <code>syntax error: unexpected newline in composite literal; possibly missing comma or }</code>. The rule holds for all composite literals, but functions trip people up more often: the lines are long and the end of the list is out of sight."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

func double(x int) int {
	return x * 2
}

func main() {
	fmt.Println(double(5))
}`,
 out:"10",
 why:{ru:"Обычная функция и обычный вызов. Дальше меняться будет только то, как до этой функции добираются.<br><b>Заметь:</b> <code>double(5)</code> — это выражение, у которого есть значение 10. Именно его получил <code>Println</code>.",
      en:"An ordinary function and an ordinary call. From here on, only the way we reach this function will change.<br><b>Note:</b> <code>double(5)</code> is an expression with the value 10. That is what <code>Println</code> received."}
},
{
 chg:{ru:"функцию положили в переменную", en:"the function went into a variable"},
 code:`package main

import "fmt"

func double(x int) int {
	return x * 2
}

func main() {
	f := double
	fmt.Println(f(5))
	fmt.Println(double(5))
}`,
 out:"10\n10",
 why:{ru:"<code>double</code> без скобок — сама функция, её просто положили в <code>f</code>. Теперь у одной функции два имени.<br><b>Сломай:</b> напиши <code>f := double(5)</code> и оставь <code>f(5)</code> ниже. Прочитай ошибку — она про то, что число вызвать нельзя.",
      en:"<code>double</code> with no parentheses is the function itself, and it was put into <code>f</code>. Now one function has two names.<br><b>Break it:</b> write <code>f := double(5)</code> and keep <code>f(5)</code> below. Read the error — it says a number cannot be called."}
},
{
 chg:{ru:"печатаем типы", en:"printing the types"},
 code:`package main

import "fmt"

func double(x int) int {
	return x * 2
}

func main() {
	f := double
	fmt.Printf("%T\\n", f)
	fmt.Printf("%T\\n", f(5))
	fmt.Println(f(5))
}`,
 out:"func(int) int\nint\n10",
 why:{ru:"Вот вся разница в одном экране: <code>f</code> имеет тип <code>func(int) int</code>, а <code>f(5)</code> — тип <code>int</code>. Имени параметра <code>x</code> в типе нет, оно на тип не влияет.",
      en:"The whole difference on one screen: <code>f</code> has type <code>func(int) int</code>, while <code>f(5)</code> has type <code>int</code>. The parameter name <code>x</code> is absent from the type — it does not affect it."}
},
{
 chg:{ru:"функцию передали в другую функцию", en:"the function was passed into another function"},
 code:`package main

import "fmt"

func double(x int) int {
	return x * 2
}

func square(x int) int {
	return x * x
}

func apply(f func(int) int, n int) int {
	return f(n)
}

func main() {
	fmt.Println(apply(double, 5))
	fmt.Println(apply(square, 5))
}`,
 out:"10\n25",
 why:{ru:"<code>apply</code> написана один раз, а работает по двум разным правилам. Внутри неё неизвестно, что делает <code>f</code> — известно только, что её можно вызвать с <code>int</code>.<br><b>Сломай:</b> передай <code>double(5)</code> вместо <code>double</code>.",
      en:"<code>apply</code> is written once and works by two different rules. Inside it, nothing is known about what <code>f</code> does — only that it can be called with an <code>int</code>.<br><b>Break it:</b> pass <code>double(5)</code> instead of <code>double</code>."}
},
{
 chg:{ru:"вместо имени — безымянная функция прямо в аргументе", en:"instead of a name — an anonymous function right in the argument"},
 code:`package main

import "fmt"

func apply(f func(int) int, n int) int {
	return f(n)
}

func main() {
	fmt.Println(apply(func(x int) int { return x * 2 }, 5))
	fmt.Println(apply(func(x int) int { return x + 100 }, 5))
}`,
 out:"10\n105",
 why:{ru:"Функции <code>double</code> и <code>square</code> исчезли — правило пишется на месте. Смотри на запятую после закрывающей фигурной скобки: это граница между первым аргументом и вторым.",
      en:"<code>double</code> and <code>square</code> are gone — the rule is written in place. Watch the comma after the closing brace: it separates the first argument from the second."}
},
{
 chg:{ru:"функции сложили в слайс", en:"the functions went into a slice"},
 code:`package main

import "fmt"

func main() {
	rules := []func(int) int{
		func(x int) int { return x * 2 },
		func(x int) int { return x + 100 },
		func(x int) int { return x * x },
	}

	fmt.Println(rules[0](5))

	for i, f := range rules {
		fmt.Println(i, f(5))
	}
}`,
 out:"10\n0 10\n1 105\n2 25",
 why:{ru:"<code>[]func(int) int</code> — слайс, элементы которого функции. <code>rules[0]</code> — функция, <code>rules[0](5)</code> — её вызов.<br><b>Сломай:</b> убери запятую после последней функции в списке.",
      en:"<code>[]func(int) int</code> is a slice whose items are functions. <code>rules[0]</code> is a function, <code>rules[0](5)</code> is a call to it.<br><b>Break it:</b> remove the comma after the last function in the list."}
},
{
 chg:{ru:"правило применили ко всему слайсу чисел", en:"the rule was applied to a whole slice of numbers"},
 code:`package main

import "fmt"

func applyAll(nums []int, f func(int) int) []int {
	res := []int{}
	for _, n := range nums {
		res = append(res, f(n))
	}
	return res
}

func main() {
	nums := []int{1, 2, 3, 4}
	fmt.Println(applyAll(nums, func(x int) int { return x * 2 }))
	fmt.Println(applyAll(nums, func(x int) int { return x * x }))
	fmt.Println(nums)
}`,
 out:"[2 4 6 8]\n[1 4 9 16]\n[1 2 3 4]",
 why:{ru:"Цикл написан один раз, правил два. Третья строка показывает, что исходный слайс не тронут: результат собирали в новый.",
      en:"The loop is written once, the rules are two. The third line shows the original slice is untouched: the result was collected into a new one."}
},
{
 chg:{ru:"правило теперь отвечает да/нет — другой тип", en:"the rule now answers yes/no — a different type"},
 code:`package main

import "fmt"

func countIf(nums []int, ok func(int) bool) int {
	c := 0
	for _, n := range nums {
		if ok(n) {
			c++
		}
	}
	return c
}

func main() {
	nums := []int{1, 2, 3, 4, 5, 6}
	fmt.Println(countIf(nums, func(x int) bool { return x%2 == 0 }))
	fmt.Println(countIf(nums, func(x int) bool { return x > 3 }))
}`,
 out:"3\n3",
 why:{ru:"Тип правила стал <code>func(int) bool</code>, потому что оно отвечает на вопрос, а не считает новое значение. Тело <code>countIf</code> отличается от <code>applyAll</code> одной строкой.<br><b>Сломай:</b> передай сюда <code>func(x int) int { return x * 2 }</code>.",
      en:"The rule type became <code>func(int) bool</code> because it answers a question instead of producing a new value. The body of <code>countIf</code> differs from <code>applyAll</code> by one line.<br><b>Break it:</b> pass <code>func(x int) int { return x * 2 }</code> here."}
},
{
 chg:{ru:"функция возвращает функцию", en:"a function returns a function"},
 code:`package main

import "fmt"

func multiplier(k int) func(int) int {
	return func(x int) int {
		return x * k
	}
}

func main() {
	double := multiplier(2)
	triple := multiplier(3)

	fmt.Println(double(5))
	fmt.Println(triple(5))
	fmt.Printf("%T\\n", double)
}`,
 out:"10\n15\nfunc(int) int",
 why:{ru:"<code>multiplier</code> не считает — она делает функцию. Возвращённая функция пользуется <code>k</code>, хотя <code>multiplier</code> уже закончилась: <code>k</code> живёт вместе с ней. У <code>double</code> и <code>triple</code> свои <code>k</code>, они не пересекаются.",
      en:"<code>multiplier</code> does not compute — it makes a function. The returned function uses <code>k</code> even though <code>multiplier</code> has already finished: <code>k</code> lives on with it. <code>double</code> and <code>triple</code> each have their own <code>k</code>, and they never mix."}
},
{
 chg:{ru:"переменная внутри меняется и живёт между вызовами", en:"the inner variable changes and survives between calls"},
 code:`package main

import "fmt"

func counter() func() int {
	n := 0
	return func() int {
		n++
		return n
	}
}

func main() {
	next := counter()
	fmt.Println(next())
	fmt.Println(next())
	fmt.Println(next())

	other := counter()
	fmt.Println(other())
	fmt.Println(next())
}`,
 out:"1\n2\n3\n1\n4",
 why:{ru:"<code>n</code> создаётся при каждом вызове <code>counter()</code> заново, поэтому <code>other</code> начинает с единицы, а <code>next</code> продолжает с четырёх.<br><b>Сломай обязательно:</b> перенеси <code>n := 0</code> внутрь возвращаемой функции и посмотри, что станет с выводом. Это и есть проверка, понял ли ты, что именно помнит замыкание.",
      en:"<code>n</code> is created afresh on every call to <code>counter()</code>, so <code>other</code> starts at one while <code>next</code> continues at four.<br><b>Break it, definitely:</b> move <code>n := 0</code> inside the returned function and see what happens to the output. That is the test of whether you understood what a closure actually remembers."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"FuncInVar", lvl:1, e:"7\n7",
 d:{ru:"Напиши функцию <code>add(a, b int) int</code>. Положи её в переменную и напечатай результат сложения 3 и 4 двумя способами: через имя функции и через переменную.",
    en:"Write a function <code>add(a, b int) int</code>. Put it in a variable and print the sum of 3 and 4 twice: through the function name and through the variable."},
 h:{ru:"Класть надо имя без скобок: <code>f := add</code>. Со скобками получится число, а не функция.",
    en:"Store the name without parentheses: <code>f := add</code>. With parentheses you get a number, not a function."}},

{t:"FuncTypes", lvl:1, e:"func(int)\nfunc(int) int\nint",
 d:{ru:"Напиши две функции: первая принимает <code>int</code> и ничего не возвращает, вторая принимает <code>int</code> и возвращает <code>int</code>. Напечатай тип первой, тип второй и тип результата вызова второй.",
    en:"Write two functions: the first takes an <code>int</code> and returns nothing, the second takes an <code>int</code> and returns an <code>int</code>. Print the type of the first, the type of the second, and the type of the second one's result."},
 h:{ru:"Тип показывает <code>fmt.Printf(\"%T\\n\", x)</code>. Передай туда имя функции без скобок, а потом — вызов со скобками. Первую функцию вызывать не надо, печатается только её тип.",
    en:"<code>fmt.Printf(\"%T\\n\", x)</code> shows the type. Pass the function name without parentheses, then the call with parentheses. The first function is never called — only its type gets printed."}},

{t:"AnonSquare", lvl:1, e:"16\n81",
 d:{ru:"Создай безымянную функцию прямо в переменной — она возводит число в квадрат. Вызови её для 4 и для 9.",
    en:"Create an anonymous function right in a variable — it squares a number. Call it for 4 and for 9."},
 h:{ru:"<code>square := func(x int) int { return x * x }</code>. Дальше это обычная функция: <code>square(4)</code>.",
    en:"<code>square := func(x int) int { return x * x }</code>. After that it is an ordinary function: <code>square(4)</code>."}},

{t:"PickRule", lvl:1, e:"12\n21",
 d:{ru:"Напиши функции <code>double</code> и <code>triple</code>. Для чисел 6 и 7 выбери правило: чётное — удвоить, нечётное — утроить. Правило сначала положи в переменную, потом вызови её и напечатай результат.",
    en:"Write functions <code>double</code> and <code>triple</code>. For the numbers 6 and 7 pick a rule: even — double it, odd — triple it. Put the rule in a variable first, then call the variable and print the result."},
 h:{ru:"Переменную объяви заранее: <code>var f func(int) int</code>, потом в <code>if</code> положи в неё <code>double</code> или <code>triple</code>, а вызов сделай одной строкой после <code>if</code>.",
    en:"Declare the variable up front: <code>var f func(int) int</code>, then assign <code>double</code> or <code>triple</code> inside the <code>if</code>, and make the call on one line after it."}},

{t:"ApplyAll", lvl:2, e:"[11 12 13]\n[3 6 9]\n[1 2 3]",
 d:{ru:"Напиши функцию <code>applyAll(nums []int, f func(int) int) []int</code>. Примени к слайсу <code>[]int{1, 2, 3}</code> сначала правило «прибавить 10», потом «умножить на 3». Напечатай оба результата и исходный слайс.",
    en:"Write <code>applyAll(nums []int, f func(int) int) []int</code>. Apply to the slice <code>[]int{1, 2, 3}</code> first the rule “add 10”, then “multiply by 3”. Print both results and the original slice."},
 h:{ru:"Внутри собирай новый слайс через <code>append</code>, а не меняй <code>nums</code> — иначе третья строка выведет не то.",
    en:"Build a new slice with <code>append</code> inside, don't modify <code>nums</code> — otherwise the third line prints the wrong thing."}},

{t:"CountIf", lvl:2, e:"3\n4",
 d:{ru:"Напиши функцию <code>countIf(nums []int, ok func(int) bool) int</code>. Для слайса <code>[]int{2, 9, 4, 7, 11, 6}</code> посчитай сначала чётные числа, потом числа больше 5.",
    en:"Write <code>countIf(nums []int, ok func(int) bool) int</code>. For the slice <code>[]int{2, 9, 4, 7, 11, 6}</code> count the even numbers first, then the numbers greater than 5."},
 h:{ru:"Тип правила здесь <code>func(int) bool</code>, потому что оно отвечает да или нет. Внутри — <code>if ok(n) { c++ }</code>.",
    en:"The rule type here is <code>func(int) bool</code> because it answers yes or no. Inside: <code>if ok(n) { c++ }</code>."}},

{t:"Filter", lvl:2, e:"[12 20 18]\n[5 7 3]",
 d:{ru:"Напиши функцию <code>filter(nums []int, ok func(int) bool) []int</code>. Из слайса <code>[]int{5, 12, 7, 20, 3, 18}</code> оставь сначала числа больше 10, потом нечётные. Порядок сохраняй.",
    en:"Write <code>filter(nums []int, ok func(int) bool) []int</code>. From the slice <code>[]int{5, 12, 7, 20, 3, 18}</code> keep the numbers greater than 10 first, then the odd ones. Keep the original order."},
 h:{ru:"От <code>countIf</code> отличается одной строкой: вместо счётчика — <code>res = append(res, n)</code>. Начинай с <code>res := []int{}</code>.",
    en:"It differs from <code>countIf</code> by one line: instead of a counter, <code>res = append(res, n)</code>. Start from <code>res := []int{}</code>."}},

{t:"Counter", lvl:3, e:"1\n2\n3\n1",
 d:{ru:"Напиши функцию <code>counter()</code>, которая возвращает функцию без аргументов. При каждом вызове эта функция даёт следующее число, начиная с 1. Сделай два счётчика: первый вызови три раза, второй — один. Напечатай все четыре числа.",
    en:"Write a function <code>counter()</code> that returns a function taking no arguments. Each call to that function gives the next number, starting from 1. Make two counters: call the first three times, the second once. Print all four numbers."},
 h:{ru:"Тип возврата — <code>func() int</code>. Переменную-счётчик объяви ДО <code>return</code>, внутри самой <code>counter</code>. Если объявить её внутри возвращаемой функции, она будет обнуляться на каждом вызове.",
    en:"The return type is <code>func() int</code>. Declare the counter variable BEFORE the <code>return</code>, inside <code>counter</code> itself. Declared inside the returned function, it would reset on every call."}},

{t:"ApplyChain", lvl:3, e:"6\n60\n57",
 d:{ru:"Собери слайс из трёх правил: прибавить 1, умножить на 10, вычесть 3. Пропусти число 5 через все правила по очереди — результат каждого становится входом следующего. Напечатай значение после каждого правила.",
    en:"Build a slice of three rules: add 1, multiply by 10, subtract 3. Pass the number 5 through all of them in order — each result becomes the input of the next. Print the value after each rule."},
 h:{ru:"Заведи переменную <code>v := 5</code> и в цикле по слайсу пиши <code>v = f(v)</code>. Печатай <code>v</code> сразу после присваивания.",
    en:"Take a variable <code>v := 5</code> and in the loop over the slice write <code>v = f(v)</code>. Print <code>v</code> right after the assignment."}},

{t:"SortByRule", lvl:3, e:"[1 2 5 9]\n[9 5 2 1]",
 d:{ru:"Напиши функцию <code>sortBy(nums []int, less func(int, int) bool) []int</code> — обычная сортировка обменом, но порядок задаёт правило. Отсортируй <code>[]int{5, 2, 9, 1}</code> сначала по возрастанию, потом по убыванию.",
    en:"Write <code>sortBy(nums []int, less func(int, int) bool) []int</code> — a plain exchange sort where the order comes from a rule. Sort <code>[]int{5, 2, 9, 1}</code> ascending first, then descending."},
 h:{ru:"Соседей меняй местами, когда <code>less(nums[j+1], nums[j])</code> — то есть правый должен стоять раньше левого. Правило по возрастанию: <code>func(x, y int) bool { return x < y }</code>.",
    en:"Swap neighbours when <code>less(nums[j+1], nums[j])</code> — that is, when the right one belongs before the left one. The ascending rule: <code>func(x, y int) bool { return x < y }</code>."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};

var BANK = [
{q:Q_OUT, code:"func double(x int) int { return x * 2 }\n\nf := double\nfmt.Println(f(3))",
 opts:["6","double",{ru:"адрес функции",en:"the function's address"},NO], ok:0,
 why:{ru:"<code>double</code> без скобок — сама функция, её положили в <code>f</code>. Дальше <code>f(3)</code> — обычный вызов. Адрес печатается только если написать <code>fmt.Println(f)</code> без скобок.",
      en:"<code>double</code> without parentheses is the function itself, stored in <code>f</code>. Then <code>f(3)</code> is a normal call. An address is printed only by <code>fmt.Println(f)</code> with no parentheses."}},

{q:Q_HAP, code:"func double(x int) int { return x * 2 }\n\nf := double(3)\nfmt.Println(f(2))",
 opts:[NO,"12","6","3"], ok:0,
 why:{ru:"<code>double(3)</code> — это уже число 6, а число вызвать нельзя: <code>cannot call f (variable of type int): int is not a function</code>. Скобки при присваивании решают, что попадёт в переменную — функция или результат.",
      en:"<code>double(3)</code> is already the number 6, and a number cannot be called: <code>cannot call f (variable of type int): int is not a function</code>. The parentheses at assignment decide what lands in the variable — the function or the result."}},

{q:Q_OUT, code:"func double(x int) int { return x * 2 }\n\nf := double\nfmt.Printf(\"%T\", f)",
 opts:["func(int) int","func(x int) int","int","func"], ok:0,
 why:{ru:"Тип функции — её сигнатура: что принимает, что возвращает. Имена параметров в тип не входят, поэтому <code>x</code> в ответе нет.",
      en:"A function's type is its signature: what it takes and what it returns. Parameter names are not part of it, so there is no <code>x</code> in the answer."}},

{q:Q_HAP, code:"func apply(f func(int) int, n int) int { return f(n) }\n\nfmt.Println(apply(func(x int) bool { return x > 0 }, 5))",
 opts:[NO,"true","1","5"], ok:0,
 why:{ru:"<code>func(int) bool</code> и <code>func(int) int</code> — разные типы, тело тут ни при чём. Ошибка называет обе сигнатуры: свою и ожидаемую.",
      en:"<code>func(int) bool</code> and <code>func(int) int</code> are different types; the body is irrelevant. The error names both signatures: yours and the expected one."}},

{q:Q_OUT, code:"var f func(int) int\nfmt.Println(f == nil)",
 opts:["true","false",NO,{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"Нулевое значение переменной-функции — <code>nil</code>. Сравнение с <code>nil</code> разрешено и работает; вот вызов такой переменной уронил бы программу.",
      en:"The zero value of a function variable is <code>nil</code>. Comparing to <code>nil</code> is allowed and works; calling such a variable is what would crash the program."}},

{q:Q_HAP, code:"var f func(int) int\nfmt.Println(f(5))",
 opts:[{ru:"упадёт при запуске: nil pointer dereference",en:"crashes at run time: nil pointer dereference"},"0",NO,"nil"], ok:0,
 why:{ru:"Код собирается — по типам всё верно. Но в <code>f</code> лежит <code>nil</code>, вызывать нечего, и программа падает уже во время работы. Компилятор такое не ловит.",
      en:"The code compiles — the types are fine. But <code>f</code> holds <code>nil</code>, there is nothing to call, and the program dies at run time. The compiler does not catch this."}},

{q:Q_OUT, code:"k := 2\nf := func(x int) int { return x * k }\nk = 10\nfmt.Println(f(5))",
 opts:["50","10","5",NO], ok:0,
 why:{ru:"Замыкание держит саму переменную <code>k</code>, а не её значение на момент создания функции. К моменту вызова там уже 10. Нужно зафиксировать двойку — передавай её параметром.",
      en:"The closure holds the variable <code>k</code> itself, not its value at the moment the function was made. By call time it is already 10. To freeze the two, pass it in as a parameter."}},

{q:Q_OUT, code:"func multiplier(k int) func(int) int {\n\treturn func(x int) int { return x * k }\n}\n\ntriple := multiplier(3)\nfmt.Println(triple(4))",
 opts:["12","3","4",NO], ok:0,
 why:{ru:"<code>multiplier(3)</code> вернула не число, а функцию, которая помнит <code>k = 3</code>. Её вызвали с четвёркой: 4 × 3 = 12.",
      en:"<code>multiplier(3)</code> returned not a number but a function that remembers <code>k = 3</code>. It was called with four: 4 × 3 = 12."}},

{q:Q_OUT, code:"func counter() func() int {\n\tn := 0\n\treturn func() int { n++; return n }\n}\n\na := counter()\nb := counter()\nfmt.Println(a(), a(), b())",
 opts:["1 2 1","1 2 3","1 1 1","3 3 1"], ok:0,
 why:{ru:"Каждый вызов <code>counter()</code> создаёт свою <code>n</code>, поэтому <code>a</code> и <code>b</code> считают независимо. Аргументы <code>Println</code> вычисляются слева направо, отсюда порядок 1, 2, 1.",
      en:"Every call to <code>counter()</code> creates its own <code>n</code>, so <code>a</code> and <code>b</code> count independently. <code>Println</code> arguments are evaluated left to right, hence 1, 2, 1."}},

{q:Q_OUT, code:"rules := []func(int) int{\n\tfunc(x int) int { return x + 1 },\n\tfunc(x int) int { return x * x },\n}\nfmt.Println(rules[1](4))",
 opts:["16","5","4",NO], ok:0,
 why:{ru:"Читай слева направо: <code>rules[1]</code> — вторая функция списка, скобки после неё — вызов с четвёркой. Индекс 1 — это второй элемент, счёт с нуля.",
      en:"Read left to right: <code>rules[1]</code> is the second function in the list, and the parentheses after it are the call with four. Index 1 is the second item — counting starts at zero."}},

{q:Q_OUT, code:"apply := func(f func(int) int, n int) int { return f(n) }\nfmt.Println(apply(func(x int) int { return x * x }, 6))",
 opts:["36","12","6",NO], ok:0,
 why:{ru:"Обе функции безымянные: одна лежит в переменной <code>apply</code>, вторая передана ей аргументом. Имя функции ни на что не влияет — важен только тип.",
      en:"Both functions are anonymous: one sits in the variable <code>apply</code>, the other is passed to it as an argument. A name changes nothing — only the type matters."}},

{q:Q_OUT, code:"fmt.Println(func(a, b int) int { return a + b }(2, 3))",
 opts:["5",NO,"func(int, int) int","2 3"], ok:0,
 why:{ru:"Скобки с аргументами сразу после тела вызывают функцию на месте. Уберёшь <code>(2, 3)</code> — напечатается адрес функции, а не число.",
      en:"The argument parentheses right after the body call the function on the spot. Remove <code>(2, 3)</code> and you print the function's address instead of a number."}},

{q:Q_OUT, code:"func applyAll(nums []int, f func(int) int) []int {\n\tres := []int{}\n\tfor _, n := range nums {\n\t\tres = append(res, f(n))\n\t}\n\treturn res\n}\n\nnums := []int{1, 2, 3}\nfmt.Println(applyAll(nums, func(x int) int { return x + 10 }), nums)",
 opts:["[11 12 13] [1 2 3]","[11 12 13] [11 12 13]","[1 2 3] [1 2 3]",NO], ok:0,
 why:{ru:"Результат собирался в новый слайс <code>res</code>, исходный <code>nums</code> никто не трогал. Если бы внутри писали <code>nums[i] = f(nums[i])</code>, изменился бы и он — слайс передаётся так, что данные общие.",
      en:"The result was collected into a new slice <code>res</code>; nobody touched <code>nums</code>. Had the body written <code>nums[i] = f(nums[i])</code>, the original would change too — a slice is passed with its data shared."}},

{q:Q_OUT, code:"func countIf(nums []int, ok func(int) bool) int {\n\tc := 0\n\tfor _, n := range nums {\n\t\tif ok(n) {\n\t\t\tc++\n\t\t}\n\t}\n\treturn c\n}\n\nfmt.Println(countIf([]int{1, 2, 3, 4, 5}, func(x int) bool { return x%2 == 1 }))",
 opts:["3","2","5","1"], ok:0,
 why:{ru:"Правило отвечает «нечётное?». Подходят 1, 3 и 5 — три числа. Тип правила здесь <code>func(int) bool</code>: оно отвечает на вопрос, а не считает новое значение.",
      en:"The rule answers “is it odd?”. 1, 3 and 5 match — three numbers. The rule type here is <code>func(int) bool</code>: it answers a question rather than producing a new value."}},

{q:{ru:"Что кладёт в переменную строка <code>f := double</code>?", en:"What does the line <code>f := double</code> put in the variable?"}, code:null,
 opts:[{ru:"саму функцию — её можно вызвать как <code>f(5)</code>",en:"the function itself — you can call it as <code>f(5)</code>"},
       {ru:"результат вызова <code>double</code>",en:"the result of calling <code>double</code>"},
       {ru:"копию тела функции в виде текста",en:"a copy of the function body as text"},
       {ru:"ничего, это ошибка",en:"nothing, it is an error"}], ok:0,
 why:{ru:"Имя без скобок — само значение-функция. Со скобками вызов происходит прямо в этой строке, и в переменную попадёт то, что функция вернула.",
      en:"A name without parentheses is the function value itself. With parentheses the call happens right on that line and the variable gets whatever was returned."}},

{q:{ru:"Сколько разных типов среди: <code>func(x int) int</code>, <code>func(y int) int</code>, <code>func(int) bool</code>?",
    en:"How many distinct types among: <code>func(x int) int</code>, <code>func(y int) int</code>, <code>func(int) bool</code>?"}, code:null,
 opts:["2","3","1",{ru:"зависит от того, где они объявлены",en:"depends on where they are declared"}], ok:0,
 why:{ru:"Имена параметров в тип не входят, поэтому первые две — один и тот же тип. Третья отличается тем, что возвращает, — это уже другой тип.",
      en:"Parameter names are not part of the type, so the first two are the same type. The third differs in what it returns, which makes it a different type."}},

{q:{ru:"Какое нулевое значение у переменной типа <code>func(int) int</code>?", en:"What is the zero value of a <code>func(int) int</code> variable?"}, code:null,
 opts:["nil",{ru:"функция, которая ничего не делает",en:"a function that does nothing"},
       {ru:"функция, которая возвращает 0",en:"a function that returns 0"},"0"], ok:0,
 why:{ru:"Как у слайса — <code>nil</code>. Опасность в том, что объявление собирается молча, а падение случается позже, при вызове.",
      en:"Same as a slice — <code>nil</code>. The danger is that the declaration compiles silently and the crash happens later, at the call."}},

{q:{ru:"Зачем передавать функцию в другую функцию?", en:"Why pass a function into another function?"}, code:null,
 opts:[{ru:"чтобы одну и ту же обработку запускать по разным правилам",en:"so one piece of processing can run by different rules"},
       {ru:"чтобы программа работала быстрее",en:"to make the program run faster"},
       {ru:"чтобы не писать <code>return</code>",en:"to avoid writing <code>return</code>"},
       {ru:"чтобы функция стала видна из других файлов",en:"to make the function visible from other files"}], ok:0,
 why:{ru:"Цикл, проверки, сборка результата пишутся один раз. Меняется только правило, которое приходит снаружи. Иначе получаются три функции, отличающиеся одной строкой.",
      en:"The loop, the checks and the result building are written once. Only the rule changes, and it comes from outside. Otherwise you end up with three functions differing by one line."}},

{q:{ru:"Что такое замыкание?", en:"What is a closure?"}, code:null,
 opts:[{ru:"функция, которая помнит переменные того места, где её создали",en:"a function that remembers the variables of the place where it was created"},
       {ru:"любая функция без имени",en:"any function without a name"},
       {ru:"функция, которая вызывает саму себя",en:"a function that calls itself"},
       {ru:"функция, у которой нет параметров",en:"a function with no parameters"}], ok:0,
 why:{ru:"Функция без имени — это литерал, и она замыканием быть не обязана. Функция, вызывающая себя, — рекурсия. Замыкание определяется тем, что оно продолжает держать внешнюю переменную живой.",
      en:"A function without a name is a literal, and it need not be a closure. A function calling itself is recursion. A closure is defined by keeping an outer variable alive."}},

{q:{ru:"Функция оставляет из слайса только подходящие числа. Какой тип у правила?",
    en:"A function keeps only the matching numbers from a slice. What is the rule's type?"}, code:null,
 opts:["func(int) bool","func(int) int","func([]int) []int","func(bool) int"], ok:0,
 why:{ru:"Правило отвечает на вопрос «оставить это число?» — значит, возвращает <code>bool</code>. Тот же тип у правила для подсчёта подходящих: разница не в правиле, а в том, что делает с ответом обработка.",
      en:"The rule answers “keep this number?” — so it returns a <code>bool</code>. A counting rule has the same type: the difference is not in the rule but in what the processing does with the answer."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Что значит «функция — это значение»?", en:"What does “a function is a value” mean?"},
 a:{ru:`<p>То же, что и для числа: её можно положить в переменную, передать в другую функцию, вернуть из функции, положить в слайс.</p>
<pre><code>f := double            <span class="cm">// в переменную</span>
apply(double, 5)       <span class="cm">// в аргумент</span>
return double          <span class="cm">// из функции</span>
[]func(int) int{...}   <span class="cm">// в слайс</span></code></pre>
<p>Единственное, чего с функцией нельзя, — заглянуть внутрь. <code>fmt.Println(f)</code> напечатает адрес, а сравнение <code>f == g</code> не соберётся: функции сравнивают только с <code>nil</code>.</p>
<p>Практический смысл простой. Пока функция — только имя в коде, выбрать правило «на ходу» нельзя, и на каждое правило приходится писать отдельную функцию. Как только функция стала значением, правило можно выбрать в <code>if</code>, взять из слайса, собрать другой функцией.</p>`,
    en:`<p>The same as for a number: it can go into a variable, be passed to another function, be returned from one, or sit in a slice.</p>
<pre><code>f := double            <span class="cm">// into a variable</span>
apply(double, 5)       <span class="cm">// into an argument</span>
return double          <span class="cm">// out of a function</span>
[]func(int) int{...}   <span class="cm">// into a slice</span></code></pre>
<p>The one thing you cannot do is look inside. <code>fmt.Println(f)</code> prints an address, and <code>f == g</code> won't compile: functions can only be compared to <code>nil</code>.</p>
<p>The practical point is simple. While a function is just a name in the code, you cannot pick a rule on the fly and every rule needs its own function. Once a function is a value, the rule can be chosen in an <code>if</code>, taken from a slice, or built by another function.</p>`}},

{q:{ru:"Чем <code>f := double</code> отличается от <code>f := double(5)</code>?", en:"How does <code>f := double</code> differ from <code>f := double(5)</code>?"},
 a:{ru:`<p>Скобками, и это меняет тип переменной целиком.</p>
<pre><code>f := double      <span class="cm">// f имеет тип func(int) int</span>
n := double(5)   <span class="cm">// n имеет тип int, внутри 10</span></code></pre>
<p>Без скобок функция не выполняется — её просто берут как значение. Со скобками она выполняется прямо в этой строке, и в переменную попадает результат.</p>
<p>Ошибка проявляется не сразу: строка <code>f := double(5)</code> собирается спокойно. Всё падает ниже, на <code>f(2)</code>: <code>invalid operation: cannot call f (variable of type int): int is not a function</code>. Читай ошибку буквально — «перед скобками стоит не функция, а int».</p>
<p>Проверка одним движением: <code>fmt.Printf("%T\\n", f)</code>. Увидел <code>func(int) int</code> — лежит функция. Увидел <code>int</code> — лежит результат.</p>`,
    en:`<p>The parentheses, and they change the variable's type entirely.</p>
<pre><code>f := double      <span class="cm">// f has type func(int) int</span>
n := double(5)   <span class="cm">// n has type int, holding 10</span></code></pre>
<p>Without parentheses the function does not run — it is simply taken as a value. With parentheses it runs right on that line and the result lands in the variable.</p>
<p>The mistake does not show up immediately: <code>f := double(5)</code> compiles fine. Things break lower down at <code>f(2)</code>: <code>invalid operation: cannot call f (variable of type int): int is not a function</code>. Read the error literally — “what is in front of the parentheses is an int, not a function”.</p>
<p>One-move check: <code>fmt.Printf("%T\\n", f)</code>. See <code>func(int) int</code> — it holds a function. See <code>int</code> — it holds a result.</p>`}},

{q:{ru:"Что такое тип функции и когда две функции взаимозаменяемы?", en:"What is a function's type and when are two functions interchangeable?"},
 a:{ru:`<p>Тип — это сигнатура: список типов параметров и список типов возврата. Больше в тип ничего не входит.</p>
<div class="tablewrap"><table>
<tr><th>Запись</th><th>Тип</th></tr>
<tr><td><code>func double(x int) int</code></td><td><code>func(int) int</code></td></tr>
<tr><td><code>func isEven(n int) bool</code></td><td><code>func(int) bool</code></td></tr>
<tr><td><code>func show(n int)</code></td><td><code>func(int)</code></td></tr>
<tr><td><code>func next() int</code></td><td><code>func() int</code></td></tr>
<tr><td><code>func less(a, b int) bool</code></td><td><code>func(int, int) bool</code></td></tr>
</table></div>
<p>Две функции взаимозаменяемы, когда их сигнатуры совпадают полностью: то же количество параметров, те же типы, в том же порядке, и тот же возврат. Имена параметров и имя самой функции не считаются.</p>
<p>Отсюда частая ошибка: тело правильное, а тип не тот. <code>func(int) bool</code> в параметр <code>func(int) int</code> не пройдёт, сколько бы ни было верным содержимое.</p>`,
    en:`<p>The type is the signature: the list of parameter types and the list of return types. Nothing else belongs to it.</p>
<div class="tablewrap"><table>
<tr><th>Declaration</th><th>Type</th></tr>
<tr><td><code>func double(x int) int</code></td><td><code>func(int) int</code></td></tr>
<tr><td><code>func isEven(n int) bool</code></td><td><code>func(int) bool</code></td></tr>
<tr><td><code>func show(n int)</code></td><td><code>func(int)</code></td></tr>
<tr><td><code>func next() int</code></td><td><code>func() int</code></td></tr>
<tr><td><code>func less(a, b int) bool</code></td><td><code>func(int, int) bool</code></td></tr>
</table></div>
<p>Two functions are interchangeable when their signatures match completely: same number of parameters, same types, same order, same returns. Parameter names and the function's own name do not count.</p>
<p>Hence the common mistake: right body, wrong type. A <code>func(int) bool</code> will not fit a <code>func(int) int</code> parameter, no matter how correct its contents are.</p>`}},

{q:{ru:"Зачем передавать функцию в функцию — что это даёт?", en:"Why pass a function into a function — what does it buy?"},
 a:{ru:`<p>Обработка и правило разделяются. Смотри, что происходит без этого:</p>
<pre><code>func doubleAll(nums []int) []int { ... }
func squareAll(nums []int) []int { ... }
func addTenAll(nums []int) []int { ... }</code></pre>
<p>Три функции, в которых одинаковы все строки, кроме одной. Каждая ошибка в цикле повторена трижды, каждая правка делается трижды.</p>
<p>С правилом снаружи остаётся одна функция:</p>
<pre><code>func applyAll(nums []int, f func(int) int) []int { ... }

applyAll(nums, func(x int) int { return x * 2 })
applyAll(nums, func(x int) int { return x * x })
applyAll(nums, func(x int) int { return x + 10 })</code></pre>
<p>Второе следствие — правило можно выбрать во время работы программы: положить в переменную в <code>if</code>, взять из слайса по индексу, получить из другой функции. Имя функции, вписанное в код, так использовать нельзя.</p>`,
    en:`<p>It separates the processing from the rule. Look at what happens without it:</p>
<pre><code>func doubleAll(nums []int) []int { ... }
func squareAll(nums []int) []int { ... }
func addTenAll(nums []int) []int { ... }</code></pre>
<p>Three functions where every line is the same except one. Every bug in the loop is repeated three times, every edit is made three times.</p>
<p>With the rule coming from outside, one function is enough:</p>
<pre><code>func applyAll(nums []int, f func(int) int) []int { ... }

applyAll(nums, func(x int) int { return x * 2 })
applyAll(nums, func(x int) int { return x * x })
applyAll(nums, func(x int) int { return x + 10 })</code></pre>
<p>The second consequence: the rule can be chosen while the program runs — assigned in an <code>if</code>, taken from a slice by index, produced by another function. A function name hard-written into the code cannot be used that way.</p>`}},

{q:{ru:"Когда писать безымянную функцию, а когда обычную?", en:"When to write an anonymous function and when a normal one?"},
 a:{ru:`<p>Разница только в имени, поэтому решает одно: нужна эта функция где-то ещё или нет.</p>
<ul>
<li>Правило нужно один раз и умещается в строку — пиши безымянную прямо в аргументе.</li>
<li>Правило используется в нескольких местах или занимает больше пары строк — дай ему имя. Имя ещё и объясняет, что происходит: <code>isPrime</code> читается лучше, чем шесть строк внутри вызова.</li>
</ul>
<pre><code><span class="cm">// один раз, коротко</span>
countIf(nums, func(x int) bool { return x%2 == 0 })

<span class="cm">// используется дважды — лучше с именем</span>
func isEven(x int) bool { return x%2 == 0 }
countIf(nums, isEven)
filter(nums, isEven)</code></pre>
<p>Есть и третий случай, ради которого безымянная функция незаменима: она видит переменные вокруг себя. Обычная функция объявляется на верхнем уровне файла и до локальных переменных не дотянется.</p>`,
    en:`<p>The only difference is the name, so one thing decides: is this function needed anywhere else?</p>
<ul>
<li>The rule is used once and fits on a line — write it anonymously right in the argument.</li>
<li>The rule is used in several places or takes more than a couple of lines — give it a name. A name also explains what is going on: <code>isPrime</code> reads better than six lines inside a call.</li>
</ul>
<pre><code><span class="cm">// once, and short</span>
countIf(nums, func(x int) bool { return x%2 == 0 })

<span class="cm">// used twice — better with a name</span>
func isEven(x int) bool { return x%2 == 0 }
countIf(nums, isEven)
filter(nums, isEven)</code></pre>
<p>There is a third case where an anonymous function is irreplaceable: it can see the variables around it. A normal function is declared at the top level of the file and cannot reach local variables at all.</p>`}},

{q:{ru:"Что такое замыкание и что именно оно помнит?", en:"What is a closure and what exactly does it remember?"},
 a:{ru:`<p>Замыкание — функция, которая пользуется переменной, объявленной снаружи неё, и держит эту переменную живой после того, как окружающая функция закончилась.</p>
<pre><code>func multiplier(k int) func(int) int {
	return func(x int) int {
		return x * k     <span class="cm">// k объявлена не здесь</span>
	}
}

double := multiplier(2)
<span class="cm">// multiplier уже закончилась, но k = 2 никуда не делась</span>
fmt.Println(double(5))   <span class="cm">// 10</span></code></pre>
<p>Ключевое: помнится <strong>переменная</strong>, а не её значение на момент создания функции.</p>
<pre><code>k := 2
f := func(x int) int { return x * k }
k = 10
fmt.Println(f(5))   <span class="cm">// 50, а не 10</span></code></pre>
<p>Отсюда две вещи. Первая: если значение нужно зафиксировать, передавай его параметром — тогда получится собственная копия. Вторая: если переменную менять, она работает как память между вызовами — на этом и построен счётчик.</p>
<p>Каждый вызов внешней функции создаёт свой набор переменных, поэтому <code>multiplier(2)</code> и <code>multiplier(3)</code> дают две независимые функции.</p>`,
    en:`<p>A closure is a function that uses a variable declared outside itself and keeps that variable alive after the surrounding function has finished.</p>
<pre><code>func multiplier(k int) func(int) int {
	return func(x int) int {
		return x * k     <span class="cm">// k is not declared here</span>
	}
}

double := multiplier(2)
<span class="cm">// multiplier is done, but k = 2 has not gone anywhere</span>
fmt.Println(double(5))   <span class="cm">// 10</span></code></pre>
<p>The key point: what is remembered is <strong>the variable</strong>, not its value at the moment the function was created.</p>
<pre><code>k := 2
f := func(x int) int { return x * k }
k = 10
fmt.Println(f(5))   <span class="cm">// 50, not 10</span></code></pre>
<p>Two consequences. First: if you need the value frozen, pass it as a parameter — then you get your own copy. Second: if you change the variable, it works as memory between calls — that is exactly how a counter is built.</p>
<p>Each call of the outer function creates its own set of variables, which is why <code>multiplier(2)</code> and <code>multiplier(3)</code> give two independent functions.</p>`}},

{q:{ru:"Как выбрать тип правила для своей задачи?", en:"How do I choose the rule type for my task?"},
 a:{ru:`<p>Смотри, что правило должно <strong>ответить</strong> на одно число, — тип получится сам.</p>
<ul>
<li>Правило делает из числа новое число → <code>func(int) int</code>. Обработка собирает результаты: получается новый слайс той же длины.</li>
<li>Правило отвечает да или нет → <code>func(int) bool</code>. Дальше по вкусу: подходящие сложить в слайс (фильтр), сосчитать (счётчик) или остановиться на первом (поиск).</li>
<li>Правило сравнивает два числа → <code>func(int, int) bool</code>. Так задают порядок сортировки.</li>
<li>Правило ничего не принимает, а выдаёт следующее значение → <code>func() int</code>. Это счётчик или генератор, и без замыкания он не работает.</li>
</ul>
<p>Тела обработок при этом почти одинаковы. Сравни фильтр и счётчик — они отличаются одной строкой внутри <code>if</code>:</p>
<pre><code>if ok(n) {
	res = append(res, n)   <span class="cm">// фильтр</span>
}

if ok(n) {
	c++                    <span class="cm">// счётчик</span>
}</code></pre>
<p>Набери оба руками подряд — так разница запоминается быстрее, чем от чтения.</p>`,
    en:`<p>Look at what the rule must <strong>answer</strong> about one number — the type follows by itself.</p>
<ul>
<li>The rule turns a number into a new number → <code>func(int) int</code>. The processing collects the results: a new slice of the same length.</li>
<li>The rule answers yes or no → <code>func(int) bool</code>. What happens next is up to you: collect the matches (filter), count them (counter) or stop at the first one (search).</li>
<li>The rule compares two numbers → <code>func(int, int) bool</code>. That is how a sort order is specified.</li>
<li>The rule takes nothing and produces the next value → <code>func() int</code>. That is a counter or a generator, and it does not work without a closure.</li>
</ul>
<p>The processing bodies are nearly identical. Compare a filter and a counter — they differ by one line inside the <code>if</code>:</p>
<pre><code>if ok(n) {
	res = append(res, n)   <span class="cm">// filter</span>
}

if ok(n) {
	c++                    <span class="cm">// counter</span>
}</code></pre>
<p>Type both by hand, one after the other — the difference sticks faster that way than from reading.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */
/* Три правила из списка: имя функции, её тело и тот же счёт словами. */
function fvRule(k){
  if(k === "x+100") return {name:"addHundred", body:"x + 100",
    ru:"прибавляет 100", en:"adds 100",
    calc:function(v){ return v + 100; },
    expr:function(v){ return v + " + 100 = " + (v + 100); }};
  if(k === "x*x") return {name:"square", body:"x * x",
    ru:"возводит в квадрат", en:"squares the number",
    calc:function(v){ return v * v; },
    expr:function(v){ return v + " × " + v + " = " + (v * v); }};
  return {name:"double", body:"x * 2",
    ru:"удваивает", en:"doubles",
    calc:function(v){ return v * 2; },
    expr:function(v){ return v + " × 2 = " + (v * 2); }};
}
var FV_ORD = {ru:["Первый","Второй","Третий","Четвёртый","Пятый","Шестой"],
              en:["First","Second","Third","Fourth","Fifth","Sixth"]};

var SCENARIOS = [
{
 name:{ru:"Со скобками и без", en:"With and without parentheses"},
 params:[{key:"rule", label:{ru:"правило", en:"rule"}, values:["x*2","x+100","x*x"], def:"x*2"},
         {key:"x",    label:{ru:"число",   en:"number"}, min:1, max:9, def:5}],
 code: function(p){
   var r = fvRule(p.rule);
   return ["func " + r.name + "(x int) int { return " + r.body + " }",
           "",
           "f := " + r.name,
           "n := " + r.name + "(" + p.x + ")",
           "fmt.Println(f(" + p.x + "))",
           "fmt.Println(n)",
           "fmt.Printf(\"%T %T\\n\", f, n)"];
 },
 steps: function(p){
   var r = fvRule(p.rule), x = p.x, v = r.calc(x), out = "", s = [];
   var F = ["f", r.name, "func(int) int"], N = ["n", String(v), "int"];
   s.push({line:2, vars:[F], out:out,
     note:{ru:"Имя без скобок — само значение-функция. Функция при этом <b>не выполнялась</b>: <code>f</code> теперь второе имя для <code>" + r.name + "</code>, которая " + r.ru + ".",
           en:"A name with no parentheses is the function value itself. The function has <b>not run</b>: <code>f</code> is now a second name for <code>" + r.name + "</code>, which " + r.en + "."}});
   s.push({line:3, vars:[F, N], out:out,
     note:{ru:"Скобки со значением внутри — вызов. Функция выполнилась прямо здесь (" + r.expr(x) + "), и в <code>n</code> легло число " + v + ".",
           en:"Parentheses with a value inside mean a call. The function ran right here (" + r.expr(x) + ") and the number " + v + " landed in <code>n</code>."}});
   out += v + "\n";
   s.push({line:4, vars:[F, N], out:out,
     note:{ru:"Вызвали через переменную: <code>f(" + x + ")</code> и <code>" + r.name + "(" + x + ")</code> делают одно и то же.",
           en:"Called through the variable: <code>f(" + x + ")</code> and <code>" + r.name + "(" + x + ")</code> do the same thing."}});
   out += v + "\n";
   s.push({line:5, vars:[F, N], out:out,
     note:{ru:"А тут ничего не вызывалось — просто напечатали число, посчитанное строкой <code>n := " + r.name + "(" + x + ")</code>.",
           en:"Nothing was called here — we just printed the number computed by the line <code>n := " + r.name + "(" + x + ")</code>."}});
   out += "func(int) int int\n";
   s.push({line:6, vars:[F, N], out:out,
     note:{ru:"Вот и вся разница: у <code>f</code> тип <code>func(int) int</code>, у <code>n</code> — <code>int</code>. Поменяй правило в списке: тип <code>f</code> не изменится, и <code>x * 2</code>, и <code>x * x</code> дают <code>func(int) int</code>.",
           en:"That is the whole difference: <code>f</code> has type <code>func(int) int</code>, <code>n</code> has <code>int</code>. Switch the rule in the list: the type of <code>f</code> stays the same — <code>x * 2</code> and <code>x * x</code> are both <code>func(int) int</code>."}});
   return s;
 }
},
{
 name:{ru:"Правило в цикле", en:"A rule inside a loop"},
 params:[{key:"rule", label:{ru:"правило", en:"rule"}, values:["x*2","x+100","x*x"], def:"x*2"},
         {key:"n",    label:{ru:"чисел",   en:"numbers"}, min:2, max:6, def:3}],
 code: function(p){
   var r = fvRule(p.rule), nums = [], i;
   for(i = 1; i <= p.n; i++) nums.push(i);
   return [r.name + " := func(x int) int { return " + r.body + " }",
           "nums := []int{" + nums.join(", ") + "}",
           "res := []int{}",
           "for _, n := range nums {",
           "\tres = append(res, " + r.name + "(n))",
           "}",
           "fmt.Println(res)"];
 },
 steps: function(p){
   var r = fvRule(p.rule), nums = [], res = [], s = [], out = "", i;
   for(i = 1; i <= p.n; i++) nums.push(i);
   function sl(a){ return "[" + a.join(" ") + "]"; }
   var FN = [r.name, "func(int) int", "func(int) int"];
   var NUMS = ["nums", sl(nums), "[]int"];
   s.push({line:0, vars:[FN], out:out,
     note:{ru:"Безымянная функция легла в переменную. Имени у неё нет, но тип и вызов такие же, как у обычной: она " + r.ru + ".",
           en:"An anonymous function went into a variable. It has no name, but its type and its call are just like a normal one's: it " + r.en + "."}});
   s.push({line:1, vars:[FN, NUMS], out:out,
     note:{ru:"Числа, к которым будем применять правило — их " + nums.length + ".",
           en:"The numbers the rule will be applied to — " + nums.length + " of them."}});
   s.push({line:2, vars:[FN, NUMS, ["res","[]","[]int"]], out:out,
     note:{ru:"Пустой слайс под результат. Исходный трогать не будем — соберём новый.",
           en:"An empty slice for the result. We won't touch the original — we build a new one."}});
   for(i = 0; i < nums.length; i++){
     var n = nums[i], ord = FV_ORD.ru[i] || (i + 1), ordEn = FV_ORD.en[i] || (i + 1);
     s.push({line:3, vars:[NUMS, ["res", sl(res), "[]int"], ["n", String(n), "int"]], out:out,
       note:{ru:i === 0 ? "Первый шаг цикла: <code>n</code> равно " + n + "."
                        : ord + " шаг" + (i === nums.length - 1 ? ", последний" : "") + ": <code>n</code> равно " + n + ".",
             en:i === 0 ? "First loop step: <code>n</code> is " + n + "."
                        : ordEn + " step" + (i === nums.length - 1 ? ", the last one" : "") + ": <code>n</code> is " + n + "."}});
     res.push(r.calc(n));
     s.push({line:4, vars:[NUMS, ["res", sl(res), "[]int"], ["n", String(n), "int"]], out:out,
       note:{ru:i === 0 ? "<code>" + r.name + "(n)</code> дал " + r.expr(n) + ", результат дописали в <code>res</code>. Обработка не знает, что именно делает правило — только вызывает его."
                        : (i === nums.length - 1 ? "Последний: " + r.expr(n) + ". Результат собран."
                                                 : "Правило то же, число другое: " + r.expr(n) + "."),
             en:i === 0 ? "<code>" + r.name + "(n)</code> gave " + r.expr(n) + " and the result was appended to <code>res</code>. The processing has no idea what the rule does — it just calls it."
                        : (i === nums.length - 1 ? "The last one: " + r.expr(n) + ". The result is complete."
                                                 : "Same rule, different number: " + r.expr(n) + ".")}});
   }
   out += sl(res) + "\n";
   s.push({line:6, vars:[NUMS, ["res", sl(res), "[]int"]], out:out,
     note:{ru:"Чтобы поменять правило, достаточно заменить первую строку — выбери в списке другое и посмотри на <code>res</code>. Цикл остаётся прежним, ради этого функции и передают.",
           en:"To change the rule you only replace the first line — pick another one in the list and watch <code>res</code>. The loop stays as it is; that is exactly why functions get passed around."}});
   return s;
 }
},
{
 name:{ru:"Функция делает функцию", en:"A function makes a function"},
 params:[{key:"a", label:{ru:"первое k", en:"first k"},  min:2, max:9, def:2},
         {key:"b", label:{ru:"второе k", en:"second k"}, min:2, max:9, def:3},
         {key:"x", label:{ru:"число",    en:"number"},   min:1, max:9, def:5}],
 code: function(p){
   return ["func multiplier(k int) func(int) int {",
           "\treturn func(x int) int { return x * k }",
           "}",
           "",
           "f := multiplier(" + p.a + ")",
           "g := multiplier(" + p.b + ")",
           "fmt.Println(f(" + p.x + "))",
           "fmt.Println(g(" + p.x + "))"];
 },
 steps: function(p){
   var a = p.a, b = p.b, x = p.x, out = "", s = [];
   var F = ["f", "func(int) int, k = " + a, "func(int) int"];
   var G = ["g", "func(int) int, k = " + b, "func(int) int"];
   s.push({line:4, vars:[["k", String(a), "int"]], out:out,
     note:{ru:"Вызвали <code>multiplier(" + a + ")</code>. Внутри появилась своя переменная <code>k</code> со значением " + a + ".",
           en:"Called <code>multiplier(" + a + ")</code>. Inside, its own variable <code>k</code> appeared with the value " + a + "."}});
   s.push({line:1, vars:[["k", String(a), "int"]], out:out,
     note:{ru:"Возвращается не число, а функция. Она пользуется <code>k</code>, поэтому <code>k</code> не исчезнет вместе с <code>multiplier</code>.",
           en:"What is returned is not a number but a function. It uses <code>k</code>, so <code>k</code> will not vanish along with <code>multiplier</code>."}});
   s.push({line:4, vars:[F], out:out,
     note:{ru:"В <code>f</code> лежит функция, помнящая своё число " + a + ". Вызовов ещё не было.",
           en:"<code>f</code> holds a function that remembers its own " + a + ". No calls have happened yet."}});
   s.push({line:5, vars:[F, ["k", String(b), "int"]], out:out,
     note:{ru:"Второй вызов <code>multiplier</code> — и <code>k</code> создаётся заново, теперь равна " + b + ". К первой <code>k</code> она отношения не имеет.",
           en:"A second call to <code>multiplier</code> — <code>k</code> is created anew, now " + b + ". It has nothing to do with the first <code>k</code>."}});
   s.push({line:1, vars:[F, ["k", String(b), "int"]], out:out,
     note:{ru:"Возвращается вторая функция, со своим числом " + b + " внутри.",
           en:"A second function is returned, with its own " + b + " inside."}});
   s.push({line:5, vars:[F, G], out:out,
     note:{ru:a === b ? "Две функции одного типа. Числа внутри совпали, но переменных всё равно две — каждый вызов <code>multiplier</code> создаёт свою."
                      : "Две функции одного типа, но с разной памятью. Из кода они выглядят одинаково — различие внутри.",
           en:a === b ? "Two functions of one type. The numbers inside came out equal, yet there are still two variables — every call to <code>multiplier</code> makes its own."
                      : "Two functions of one type but with different memory. In the code they look identical — the difference is inside."}});
   out += (x * a) + "\n";
   s.push({line:6, vars:[F, G], out:out,
     note:{ru:x + " × " + a + " = " + (x * a) + ". Число " + a + " функция взяла из своей памяти, а не из аргумента.",
           en:x + " × " + a + " = " + (x * a) + ". The " + a + " came from the function's own memory, not from the argument."}});
   out += (x * b) + "\n";
   s.push({line:7, vars:[F, G], out:out,
     note:{ru:x + " × " + b + " = " + (x * b) + ". Строка кода внутри одна и та же" + (a === b ? ", и число тоже совпало — но взято оно из другой переменной." : ", а результат разный."),
           en:x + " × " + b + " = " + (x * b) + ". The line of code inside is the same" + (a === b ? ", and the number matched too — but it came from a different variable." : ", the result is different.")}});
   return s;
 }
},
{
 name:{ru:"Счётчик помнит число", en:"The counter remembers its number"},
 params:[{key:"start", label:{ru:"старт",   en:"start"}, min:0, max:5, def:0},
         {key:"calls", label:{ru:"вызовов", en:"calls"}, min:2, max:6, def:2}],
 code: function(p){
   var c = ["func counter() func() int {",
            "\tn := " + p.start,
            "\treturn func() int {",
            "\t\tn++",
            "\t\treturn n",
            "\t}",
            "}",
            "",
            "next := counter()"], i;
   for(i = 0; i < p.calls; i++) c.push("fmt.Println(next())");
   return c;
 },
 steps: function(p){
   var n = p.start, out = "", s = [], i;
   s.push({line:1, vars:[["n", String(n), "int"]], out:out,
     note:{ru:"Вызвали <code>counter()</code>. Внутри создалась переменная <code>n</code> со значением " + n + " — одна на весь будущий счётчик.",
           en:"Called <code>counter()</code>. Inside, the variable <code>n</code> was created holding " + n + " — one for the whole future counter."}});
   s.push({line:2, vars:[["n", String(n), "int"]], out:out,
     note:{ru:"Возвращается функция, которая пользуется <code>n</code>. Обрати внимание: <code>n</code> объявлена ВЫШЕ этой функции, а не внутри неё.",
           en:"A function that uses <code>n</code> is returned. Note: <code>n</code> is declared ABOVE this function, not inside it."}});
   s.push({line:8, vars:[["next", "func() int, n = " + n, "func() int"]], out:out,
     note:{ru:"<code>counter</code> закончилась, но <code>n</code> жива — её держит функция, лежащая теперь в <code>next</code>.",
           en:"<code>counter</code> has finished, but <code>n</code> is alive — it is held by the function now sitting in <code>next</code>."}});
   for(i = 1; i <= p.calls; i++){
     var ord = FV_ORD.ru[i-1] || i, ordEn = FV_ORD.en[i-1] || i, was = n;
     n++;
     s.push({line:3, vars:[["n", String(n), "int"]], out:out,
       note:{ru:i === 1 ? "Первый вызов <code>next()</code>. <code>n++</code> увеличила ту самую переменную, созданную ещё в <code>counter</code>: " + was + " → " + n + "."
                        : (i === 2 ? "Второй вызов. <code>n</code> не обнулилась — строка <code>n := " + p.start + "</code> выполнялась один раз, при вызове <code>counter()</code>: " + was + " → " + n + "."
                                   : ord + " вызов: счёт продолжается с того места, где остановились, " + was + " → " + n + "."),
             en:i === 1 ? "First call to <code>next()</code>. <code>n++</code> incremented that very variable created back in <code>counter</code>: " + was + " → " + n + "."
                        : (i === 2 ? "Second call. <code>n</code> did not reset — the line <code>n := " + p.start + "</code> ran once, when <code>counter()</code> was called: " + was + " → " + n + "."
                                   : ordEn + " call: the count carries on from where it stopped, " + was + " → " + n + ".")}});
     s.push({line:4, vars:[["n", String(n), "int"]], out:out,
       note:{ru:"Возвращается новое значение <code>n</code> — " + n + ". Сама переменная при этом никуда не девается.",
             en:"The new value of <code>n</code> is returned — " + n + ". The variable itself stays where it is."}});
     out += n + "\n";
     s.push({line:8 + i, vars:[["next", "func() int, n = " + n, "func() int"]], out:out,
       note:{ru:i === p.calls
             ? "На экране " + n + ". Переменная пережила выход из функции, в которой была создана. Это и есть замыкание.<br>Если перенести <code>n := " + p.start + "</code> внутрь возвращаемой функции, каждый вызов будет печатать " + (p.start + 1) + "."
             : "На экране " + n + ".",
             en:i === p.calls
             ? "The screen shows " + n + ". The variable outlived the function it was created in. That is a closure.<br>Move <code>n := " + p.start + "</code> inside the returned function and every call will print " + (p.start + 1) + "."
             : "The screen shows " + n + "."}});
   }
   return s;
 }
}
];

/* ================= ЧТО ИЗ ЭТОГО СКЛАДЫВАЕТСЯ ================= */
var OUTRO = {
 ru:`<p>Семь правил — следствия одной строчки: функция в Go это значение. Дальше всё выводится само. У значения есть тип — вот сигнатура, и вот почему <code>func(int) bool</code> не пройдёт вместо <code>func(int) int</code>. Значение кладут в переменную — вот <code>f := double</code> и пара скобок, решающая, попадёт туда функция или её результат. Значение передают параметром — вот обработка, написанная один раз, с правилом снаружи. Значения хранят в слайсе — вот список правил и выбор по индексу. Значение возвращают из функции — вот <code>multiplier</code>, а вместе с ним и замыкание: возвращённая функция пользуется внешней переменной, поэтому переменная и не исчезает.</p>
<p>Что ты теперь умеешь: писать цикл один раз, а правило подставлять снаружи; выбирать правило во время работы программы — в <code>if</code>, по индексу из слайса, из другой функции; писать правило прямо в аргументе, не придумывая ему имени; изготавливать функции другими функциями и держать в них состояние между вызовами. Четыре обработки — применить ко всем, отфильтровать, посчитать, отсортировать по правилу — покрывают почти всё, что делают со списком, и различаются одной строкой внутри цикла.</p>
<p>Если забудется всё, кроме одной мысли, пусть останется эта: <strong>функция — это значение, а скобки — это её выполнение</strong>. Пока скобок нет, с функцией можно делать то же, что с числом: класть, передавать, возвращать, хранить. Как только скобки появились, функции больше нет — есть то, что она вернула. Отсюда выводятся и <code>f := double</code> против <code>f := double(5)</code>, и <code>rules[0](5)</code>, и <code>multiplier(2)</code>, отдающая функцию, а не число.</p>
<p>А когда код с функциями ведёт себя не так, как ожидалось, вопросов ровно два. Первый: что лежит в переменной — функция или её результат? Отвечает одна строка, <code>fmt.Printf("%T\\n", f)</code>. Второй, если дело в замыкании: чему равна внешняя переменная <em>сейчас</em>, в момент вызова, а не в тот момент, когда функцию писали? Замыкание всегда смотрит на текущее значение.</p>`,
 en:`<p>All seven rules follow from one line: a function in Go is a value. Everything else falls out on its own. A value has a type — that is the signature, and that is why a <code>func(int) bool</code> will not do instead of a <code>func(int) int</code>. A value goes into a variable — that is <code>f := double</code>, and the pair of parentheses that decides whether the function or its result lands there. A value is passed as a parameter — that is processing written once with the rule coming from outside. Values are kept in a slice — that is a list of rules and a choice by index. A value is returned from a function — that is <code>multiplier</code>, and with it the closure: the returned function uses an outer variable, which is exactly why that variable does not disappear.</p>
<p>What you can do now: write the loop once and supply the rule from outside; choose the rule while the program runs — in an <code>if</code>, by index from a slice, from another function; write the rule straight into the argument without inventing a name for it; manufacture functions with other functions and keep state inside them between calls. Four kinds of processing — apply to all, filter, count, sort by a rule — cover almost everything done to a list, and they differ by one line inside the loop.</p>
<p>If everything fades except one thought, let it be this: <strong>a function is a value, and the parentheses are it running</strong>. While there are no parentheses you can treat a function like a number: store it, pass it, return it, keep it. The moment parentheses appear there is no function any more — there is what it returned. From this follow <code>f := double</code> versus <code>f := double(5)</code>, <code>rules[0](5)</code>, and <code>multiplier(2)</code> handing back a function rather than a number.</p>
<p>And when function code behaves in a way you did not expect, there are exactly two questions. First: what is in the variable — the function or its result? One line answers it: <code>fmt.Printf("%T\\n", f)</code>. Second, if a closure is involved: what does the outer variable hold <em>now</em>, at the moment of the call, rather than at the moment you wrote the function? A closure always looks at the current value.</p>`
};
