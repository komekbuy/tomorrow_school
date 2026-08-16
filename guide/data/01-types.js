var META = {
  n: 1,
  slug: "01-types",
  eyebrow:{ru:"Go с нуля · тема 1 из 13", en:"Go from zero · topic 1 of 13"},
  title:  {ru:"Типы данных", en:"Data types"},
  lede:{
    ru:"С этого начинается всё остальное. Пока непонятно, чем <code>'a'</code> отличается от <code>\"a\"</code>, а массив от слайса, любая задача решается наугад.",
    en:"Everything else builds on this. Until <code>'a'</code> vs <code>\"a\"</code> and array vs slice are clear, every task is guesswork."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=3907s",
    t:{ru:"Курс по Go — глава «Переменные» (1:05:07)", en:"Go course — the “Variables” chapter (1:05:07)"},
    d:{ru:"Там же разбирают типы, целочисленное деление и значения по умолчанию. Перед ней идёт глава про устройство памяти — тоже полезно.", en:"It covers types, integer division and default values. The chapter before it explains memory — worth watching too."}},
  folder: "type1",
  txt: {ru:"go-tema-01-tipy-dannyh.txt", en:"go-topic-01-data-types.txt"}
};

/* ================= ВВЕДЕНИЕ ================= */
var INTRO = {
ru:`<p>Программа хранит данные в переменных. Переменная — это имя, за которым закреплён кусок памяти со значением: строка <code>x := 42</code> создаёт имя <code>x</code>, и в нём лежит 42. Но одного значения мало. Go должен ещё знать, <em>что это за</em> значение: целое число, дробное, кусок текста, набор из трёх чисел. Вот это «что за» и называется типом.</p>
<p>Тип решает, что с данными разрешено делать: сложатся ли два значения, что окажется на экране, чему будет равна длина. Пока тип не виден, код пишется наугад — программа собирается, запускается и печатает не то. Смотри:</p>
<pre><code>fmt.Println('A')     <span class="cm">// 65</span>
fmt.Println("A")     <span class="cm">// A</span>
fmt.Println(7 / 2)   <span class="cm">// 3</span></code></pre>
<p>Ни одна из трёх строк не ошибка, все три собираются. Просто в первой лежит число, а не буква, а в третьей оба числа целые, поэтому дробной части взяться неоткуда. Разобравшись с типами, ты будешь читать такие строки заранее, до запуска, — и сможешь превращать символ в цифру и обратно, считать буквы в тексте на любом языке, собирать строку из числа без готовых функций.</p>
<p>Дальше семь правил, и порядок у них не случайный. Сначала — что тип вообще фиксируется раз и навсегда. Потом первое место, где он меняет привычный результат: деление целых. Потом три правила про текст: символ на самом деле число, поэтому <code>'a'</code> и <code>"a"</code> — разные вещи, поэтому строка внутри устроена как набор байтов. Дальше <code>bool</code> — тип, у которого всего два значения. И в конце массив и слайс, где идея «тип известен заранее» доходит до предела: у массива в тип вшит даже размер.</p>`,
en:`<p>A program keeps its data in variables. A variable is a name attached to a piece of memory holding a value: the line <code>x := 42</code> creates the name <code>x</code> with 42 inside. But the value alone is not enough. Go also has to know <em>what kind of</em> value it is: a whole number, a fractional one, a piece of text, a group of three numbers. That "what kind of" is the type.</p>
<p>The type decides what you are allowed to do with the data: whether two values add up, what appears on screen, what the length comes out to. While the type stays invisible you are writing code by guessing — it compiles, it runs, and it prints the wrong thing. Look:</p>
<pre><code>fmt.Println('A')     <span class="cm">// 65</span>
fmt.Println("A")     <span class="cm">// A</span>
fmt.Println(7 / 2)   <span class="cm">// 3</span></code></pre>
<p>None of these three lines is a mistake, all three compile. The first one simply holds a number rather than a letter, and in the third both numbers are whole, so no fraction can appear. Once types are clear you read lines like these before running them — and you can turn a character into a digit and back, count letters in text of any language, build a string out of a number with no ready-made function.</p>
<p>Seven rules follow, and their order is not random. First: a type is fixed once and for all. Then the first place where it changes a familiar result — integer division. Then three rules about text: a character is really a number, which is why <code>'a'</code> and <code>"a"</code> are different things, and why a string is a set of bytes inside. Then <code>bool</code>, the type with exactly two values. And at the end arrays and slices, where "the type is known upfront" goes as far as it can: an array carries even its size inside the type.</p>`
};

/* ================= СЕМЬ ПРАВИЛ ================= */
var RULES = [
{
 h:{ru:"Тип задаётся при создании и больше не меняется",
    en:"A type is set at creation and never changes"},
 b:{ru:`<p>Тип появляется в тот момент, когда переменная создаётся, и остаётся с ней до конца программы. Записал число — это число навсегда: другое число положить можно, текст уже нет.</p>
<pre><code>x := 42
x = 43        <span class="cm">// нормально: то же самое, значение другое</span>
x = "hello"   <span class="cm">// не соберётся: cannot use "hello" as int value</span></code></pre>
<p>Заметь, где именно ломается: не при запуске, а при сборке. Go проверяет типы заранее, поэтому такая программа просто не превратится в исполняемый файл — запускать будет нечего. В Python или JavaScript эта же строка сработала бы спокойно, а неприятность вылезла бы позже и в другом месте.</p>
<p>Знак <code>:=</code> ничего в этом не смягчает. Он лишь избавляет от написания типа руками: Go смотрит на значение справа и определяет тип сам. <code>x := 42</code> и <code>var x int = 42</code> — одна и та же переменная с одним и тем же типом <code>int</code>. Что получилось на самом деле, всегда можно спросить у программы:</p>
<pre><code>fmt.Printf("%T\\n", x)   <span class="cm">// int</span></code></pre>
<p>Про саму запись: <code>%T</code> — это дырка в тексте, на её место подставляется аргумент, идущий после строки. Дырок может быть несколько — сколько дырок, столько и аргументов, разбираются по порядку. Кроме <code>%T</code> дальше понадобятся ещё две: <code>%v</code> печатает само значение, любого типа, а <code>%q</code> — строку в кавычках. И аргументом можно поставить не только переменную, но и любое выражение — оно посчитается на месте.</p>
<pre><code>s := "Go"
fmt.Printf("%v %T\\n", s, s)                  <span class="cm">// Go string</span>
fmt.Printf("%q\\n", s)                        <span class="cm">// "Go"</span>
fmt.Printf("%v %v\\n", len(s), len(s) == 0)   <span class="cm">// 2 false</span></code></pre>
<p>На этом правиле держится всё остальное в теме: раз тип закреплён и известен заранее, дальше вопрос только один — что именно он разрешает.</p>`,
    en:`<p>A type appears the moment a variable is created and stays with it until the program ends. Put a number in and it is a number for good: another number can go there, text cannot.</p>
<pre><code>x := 42
x = 43        <span class="cm">// fine: same kind of thing, different value</span>
x = "hello"   <span class="cm">// won't compile: cannot use "hello" as int value</span></code></pre>
<p>Notice where it breaks: not while running, but while building. Go checks types upfront, so a program like this never becomes an executable at all — there is nothing to run. In Python or JavaScript that same line would go through fine, and the trouble would surface later, somewhere else.</p>
<p><code>:=</code> softens none of this. It only saves you writing the type by hand: Go reads the value on the right and works the type out itself. <code>x := 42</code> and <code>var x int = 42</code> are one and the same variable with one and the same <code>int</code> type. What you actually got can always be asked of the program:</p>
<pre><code>fmt.Printf("%T\\n", x)   <span class="cm">// int</span></code></pre>
<p>About that line itself: <code>%T</code> is a hole in the text, and the argument following the string is dropped into it. There can be several holes — as many holes, as many arguments, matched in order. Besides <code>%T</code> you will need two more further on: <code>%v</code> prints the value itself, whatever its type, and <code>%q</code> prints a string with quotes. An argument doesn't have to be a variable either — any expression works, it is evaluated on the spot.</p>
<pre><code>s := "Go"
fmt.Printf("%v %T\\n", s, s)                  <span class="cm">// Go string</span>
fmt.Printf("%q\\n", s)                        <span class="cm">// "Go"</span>
fmt.Printf("%v %v\\n", len(s), len(s) == 0)   <span class="cm">// 2 false</span></code></pre>
<p>Everything else in this topic rests on this rule: once the type is fixed and known upfront, the only remaining question is what exactly it allows.</p>`}
},
{
 h:{ru:"Целые числа делятся нацело", en:"Integers divide without a remainder"},
 b:{ru:`<p>Раз тип закреплён за значением, он же решает, как сработают знаки <code>+</code>, <code>-</code>, <code>/</code>. Деление — первое место, где это заметно: если оба числа целые, то и результат обязан быть целым, другому типу взяться неоткуда.</p>
<pre><code>7 / 2    <span class="cm">// 3, а не 3.5 — дробная часть отбрасывается</span>
9 / 2    <span class="cm">// 4, а не 5 — округления здесь нет вообще</span>
1 / 10   <span class="cm">// 0</span>
7 % 2    <span class="cm">// 1 — остаток, то, что не поместилось</span></code></pre>
<p>Слово «отбрасывается» тут важнее, чем кажется: <code>9 / 2</code> даёт 4, хотя по привычке хочется 5. Никакого округления не происходит — дробная часть просто исчезает.</p>
<p>Нужен дробный ответ — дробным должно быть хотя бы одно из чисел: <code>float64(7) / float64(2)</code> даёт 3.5. А вот <code>float64(7 / 2)</code> не спасёт: деление уже случилось по правилам целых, и в дробный тип переводить нечего — там 3.</p>
<p>Отбрасывание — не изъян языка, а рабочий инструмент. В паре с остатком эти два знака разбирают число на цифры: <code>n % 10</code> достаёт последнюю, <code>n / 10</code> её отрезает.</p>
<pre><code>n := 1234
n % 10   <span class="cm">// 4    последняя цифра</span>
n / 10   <span class="cm">// 123  та же цифра отрезана</span></code></pre>
<p>Повторяй это в цикле — и число разложится на цифры до последней. Остаток всегда меньше делителя, поэтому <code>n % 10</code> не может дать больше девяти. Отсюда же берётся проверка чётности: <code>n % 2 == 0</code> читается как «делится на 2 нацело».</p>`,
    en:`<p>Since a type is bound to a value, it also decides how <code>+</code>, <code>-</code> and <code>/</code> behave. Division is the first place you notice it: if both numbers are whole, the result has to be whole too — there is no other type for it to come from.</p>
<pre><code>7 / 2    <span class="cm">// 3, not 3.5 — the fraction is dropped</span>
9 / 2    <span class="cm">// 4, not 5 — there is no rounding here at all</span>
1 / 10   <span class="cm">// 0</span>
7 % 2    <span class="cm">// 1 — the remainder, what didn't fit</span></code></pre>
<p>The word "dropped" matters more than it looks: <code>9 / 2</code> gives 4, even though habit says 5. Nothing is rounded — the fractional part simply disappears.</p>
<p>For a fractional answer at least one of the numbers must be fractional: <code>float64(7) / float64(2)</code> gives 3.5. But <code>float64(7 / 2)</code> saves nothing: the division already happened by integer rules, and there is nothing left to convert — it is 3 by then.</p>
<p>Dropping is not a flaw in the language, it is a working tool. Paired with the remainder, these two operators take a number apart digit by digit: <code>n % 10</code> pulls the last one out, <code>n / 10</code> cuts it off.</p>
<pre><code>n := 1234
n % 10   <span class="cm">// 4    the last digit</span>
n / 10   <span class="cm">// 123  the same digit cut off</span></code></pre>
<p>Repeat that in a loop and the number comes apart down to the last digit. A remainder is always smaller than the divisor, so <code>n % 10</code> can never exceed nine. The even-number check comes from the same place: <code>n % 2 == 0</code> reads as "divides by 2 exactly".</p>`}
},
{
 h:{ru:"Руна и байт — это числа", en:"A rune and a byte are numbers"},
 b:{ru:`<p>С числами разобрались. Отсюда сразу вопрос: а какой тип у буквы? Отдельного «буквенного» типа в Go нет. Символ хранится как число — как его код в общей таблице символов.</p>
<p><code>byte</code> — число от 0 до 255, и именно из байтов сделана строка. <code>rune</code> — число побольше, его хватает на любой символ любого алфавита. Оба — обычные числа, и вся арифметика из прошлого правила работает с ними без оговорок.</p>
<p>Буква появляется только в момент печати, и то если попросить:</p>
<pre><code>fmt.Println('a')           <span class="cm">// 97</span>
fmt.Println(string('a'))   <span class="cm">// a</span></code></pre>
<p><code>string(...)</code> здесь ничего не вычисляет. Это перевод одного и того же значения в другой тип: «покажи число 97 как символ». Само значение не изменилось.</p>
<p>Дальше — почему это вообще нужно. Коды цифр идут подряд: <code>'0'</code> это 48, <code>'1'</code> это 49, и так до <code>'9'</code> — 57. Значит, из символа цифры получается настоящее число обычным вычитанием, а из числа — символ обычным сложением:</p>
<pre><code>'7' - '0'    <span class="cm">// 7    символ стал числом: 55 − 48</span>
'0' + 7      <span class="cm">// 55   число стало кодом символа '7'</span></code></pre>
<p>Без этого перехода не решается ни одна задача, где цифру берут из текста или собирают текст из числа: <code>"8"</code> и число 8 — разные вещи, и между ними надо переходить руками.</p>`,
    en:`<p>Numbers are settled. Which raises the next question: what type is a letter? Go has no separate "letter" type. A character is stored as a number — its code in the common character table.</p>
<p><code>byte</code> is a number from 0 to 255, and a string is made of exactly those. <code>rune</code> is a larger number, enough for any character in any alphabet. Both are ordinary numbers, and all the arithmetic from the previous rule works on them without reservation.</p>
<p>A letter appears only when printed, and only if you ask for it:</p>
<pre><code>fmt.Println('a')           <span class="cm">// 97</span>
fmt.Println(string('a'))   <span class="cm">// a</span></code></pre>
<p><code>string(...)</code> computes nothing here. It converts one and the same value to another type: "show the number 97 as a character". The value itself did not change.</p>
<p>Now why this matters. Digit codes run consecutively: <code>'0'</code> is 48, <code>'1'</code> is 49, up to <code>'9'</code> at 57. So a real number comes out of a digit character by plain subtraction, and a character comes out of a number by plain addition:</p>
<pre><code>'7' - '0'    <span class="cm">// 7    character became a number: 55 − 48</span>
'0' + 7      <span class="cm">// 55   number became the code of '7'</span></code></pre>
<p>No task that pulls a digit out of text — or builds text out of a number — is solvable without this step: <code>"8"</code> and the number 8 are different things, and you cross between them by hand.</p>`}
},
{
 h:{ru:"<code>'a'</code> и <code>\"a\"</code> — разные типы", en:"<code>'a'</code> and <code>\"a\"</code> are different types"},
 b:{ru:`<p>Раз символ внутри — число, то кавычки вокруг буквы решают не оформление, а тип. Одинарные дают руну, то есть число. Двойные — строку.</p>
<pre><code>a := 'A'   <span class="cm">// rune,   значение 65</span>
b := "A"   <span class="cm">// string, длина 1</span></code></pre>
<p>Дальше эти два пути расходятся полностью. У строк <code>+</code> означает склейку, у них есть длина, их печатают как есть. У рун то же самое либо значит другое, либо не работает совсем:</p>
<pre><code>"A" + "B"   <span class="cm">// "AB" — склеились</span>
'A' + 'B'   <span class="cm">// 131  — сложились как числа: 65 + 66</span>
len("A")    <span class="cm">// 1</span>
len('A')    <span class="cm">// не соберётся: у числа нет длины</span></code></pre>
<p>Опаснее всего печать — там компилятор промолчит:</p>
<pre><code>fmt.Print('A')   <span class="cm">// 65  ← напечатано ЧИСЛО</span>
fmt.Print("A")   <span class="cm">// A</span></code></pre>
<p>Программа собирается без единой жалобы, и это не поблажка: по типам всё честно, <code>Print</code> принимает любое значение и печатает число как число. Ошибка не в типах, а в замысле — а замысел компилятор не проверяет.</p>
<p>Отсюда простое разделение: то, что должно оказаться на экране, пиши в двойных кавычках. Одинарные оставь для арифметики над символами — там, где нужны переходы из прошлого правила.</p>`,
    en:`<p>Since a character is a number inside, the quotes around a letter decide not the styling but the type. Single quotes give a rune, that is a number. Double quotes give a string.</p>
<pre><code>a := 'A'   <span class="cm">// rune,   value 65</span>
b := "A"   <span class="cm">// string, length 1</span></code></pre>
<p>From there the two paths part completely. For strings <code>+</code> means joining, they have a length, they print as they are. For runes the same things either mean something else or do not work at all:</p>
<pre><code>"A" + "B"   <span class="cm">// "AB" — joined</span>
'A' + 'B'   <span class="cm">// 131  — added as numbers: 65 + 66</span>
len("A")    <span class="cm">// 1</span>
len('A')    <span class="cm">// won't compile: a number has no length</span></code></pre>
<p>Printing is the dangerous one — there the compiler stays silent:</p>
<pre><code>fmt.Print('A')   <span class="cm">// 65  ← a NUMBER was printed</span>
fmt.Print("A")   <span class="cm">// A</span></code></pre>
<p>The program compiles without a single complaint, and that is not leniency: type-wise everything is honest, <code>Print</code> accepts any value and prints a number as a number. The mistake is not in the types but in the intent — and intent is not what the compiler checks.</p>
<p>Hence a simple split: whatever has to end up on screen goes in double quotes. Leave single quotes for arithmetic on characters — where the conversions from the previous rule are needed.</p>`}
},
{
 h:{ru:"Строка — это байты, и менять её нельзя", en:"A string is bytes, and it cannot be changed"},
 b:{ru:`<p>Теперь понятно, из чего сделана строка: из тех самых байтов. Строка — это лежащие подряд числа от 0 до 255 и их количество. Списка букв внутри нет, и из этого следуют сразу три вещи.</p>
<p>Первое: <code>len</code> считает байты, а не буквы.</p>
<pre><code>len("Hello")     <span class="cm">// 5   латиница — байт на букву</span>
len("Привет")    <span class="cm">// 12  кириллица — два байта на букву, а не 6</span></code></pre>
<p>Второе: обращение по индексу даёт байт — число, а не букву. На латинице это проходит незаметно, потому что байт и буква там совпадают. На кириллице ломается по-настоящему: <code>s[0]</code> вернёт первую половину буквы, а половина буквы не значит ничего.</p>
<pre><code>"Hi"[0]           <span class="cm">// 72</span>
string("Hi"[0])   <span class="cm">// H</span></code></pre>
<p>Нужны буквы, а не байты — есть два пути: цикл <code>range</code>, который шагает буквами, или <code>[]rune(s)</code>, который раскладывает строку на руны из третьего правила.</p>
<p>Третье: строку нельзя менять. Строка <code>s[0] = 'H'</code> не соберётся. Причина в том, как строки хранятся: при присваивании содержимое не копируется, две переменные могут указывать на одни и те же байты — и правка на месте задела бы обе. Поэтому строки не правят, а создают заново:</p>
<pre><code>s := "hello"
r := []rune(s)
r[0] = 'H'
fmt.Println(string(r))   <span class="cm">// Hello</span>
fmt.Println(s)           <span class="cm">// hello — исходная не изменилась</span></code></pre>
<p>Порядок один и тот же в любой задаче на правку текста: разобрать на руны, изменить, собрать обратно. Даже склейка <code>s = s + "!"</code> ничего не дописывает к старой строке — она делает новую и кладёт её в ту же переменную.</p>`,
    en:`<p>Now it is clear what a string is made of: those same bytes. A string is a run of numbers from 0 to 255 plus how many there are. There is no list of letters inside, and three things follow from that at once.</p>
<p>First: <code>len</code> counts bytes, not letters.</p>
<pre><code>len("Hello")     <span class="cm">// 5   Latin — one byte per letter</span>
len("Привет")    <span class="cm">// 12  Cyrillic — two bytes per letter, not 6</span></code></pre>
<p>Second: indexing gives a byte — a number, not a letter. With Latin text it slips by unnoticed, because there byte and letter coincide. With Cyrillic it genuinely breaks: <code>s[0]</code> returns the first half of a letter, and half a letter means nothing.</p>
<pre><code>"Hi"[0]           <span class="cm">// 72</span>
string("Hi"[0])   <span class="cm">// H</span></code></pre>
<p>If you need letters rather than bytes there are two ways: a <code>range</code> loop, which steps letter by letter, or <code>[]rune(s)</code>, which lays the string out as the runes from rule three.</p>
<p>Third: a string cannot be changed. The line <code>s[0] = 'H'</code> won't compile. The reason is how strings are stored: assignment does not copy the contents, two variables can point at the same bytes — and editing in place would hit both. So strings are not edited, they are built anew:</p>
<pre><code>s := "hello"
r := []rune(s)
r[0] = 'H'
fmt.Println(string(r))   <span class="cm">// Hello</span>
fmt.Println(s)           <span class="cm">// hello — the original is unchanged</span></code></pre>
<p>The order is the same in every text-editing task: take it apart into runes, change it, put it back together. Even joining with <code>s = s + "!"</code> appends nothing to the old string — it makes a new one and puts it in the same variable.</p>`}
},
{
 h:{ru:"<code>bool</code> — только <code>true</code> и <code>false</code>", en:"<code>bool</code> is only <code>true</code> and <code>false</code>"},
 b:{ru:`<p>До сих пор речь шла о типах, где значений очень много. <code>bool</code> — обратный случай: значений ровно два, <code>true</code> и <code>false</code>. Ничего третьего, и числа вместо них не подойдут.</p>
<pre><code>var ok bool = true   <span class="cm">// единственный правильный вид</span>
ok = 1               <span class="cm">// не соберётся: cannot use 1 as bool value</span></code></pre>
<p>В некоторых языках ноль считается ложью, а любое ненулевое число — истиной. В Go этого нет вообще: <code>if n { ... }</code> не соберётся, даже если <code>n</code> равно единице — «non-boolean condition in if statement». В условии должно стоять выражение типа <code>bool</code>, и ничто другое.</p>
<p>Отсюда разница, которую легко проскочить. Вернись к остатку из второго правила:</p>
<pre><code>n % 2        <span class="cm">// int:  0 или 1</span>
n % 2 == 0   <span class="cm">// bool: true или false</span></code></pre>
<p>Первое — вычисление, второе — вопрос, у которого ответ «да» или «нет». В <code>if</code> идёт второе. По той же причине функция, объявленная как возвращающая <code>bool</code>, обязана вернуть <code>true</code> или <code>false</code>: <code>return 1</code> в ней не соберётся, хотя единица и кажется «истиной».</p>
<p><code>bool</code> получается сам собой из сравнений <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;=</code> и связок <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>. Отдельную переменную под ответ заводить не обязательно, но если завёл — тип у неё очевиден: <code>ok := n % 2 == 0</code>.</p>`,
    en:`<p>So far the types had a great many possible values. <code>bool</code> is the opposite case: exactly two values, <code>true</code> and <code>false</code>. Nothing third, and numbers will not stand in for them.</p>
<pre><code>var ok bool = true   <span class="cm">// the only correct form</span>
ok = 1               <span class="cm">// won't compile: cannot use 1 as bool value</span></code></pre>
<p>In some languages zero counts as false and any non-zero number as true. In Go there is none of that: <code>if n { ... }</code> won't compile even when <code>n</code> is one — "non-boolean condition in if statement". A condition must be an expression of type <code>bool</code> and nothing else.</p>
<p>Hence a distinction that is easy to skip past. Go back to the remainder from rule two:</p>
<pre><code>n % 2        <span class="cm">// int:  0 or 1</span>
n % 2 == 0   <span class="cm">// bool: true or false</span></code></pre>
<p>The first is a calculation, the second is a question whose answer is yes or no. The <code>if</code> takes the second. For the same reason a function declared to return <code>bool</code> must return <code>true</code> or <code>false</code>: <code>return 1</code> won't compile there, however much one looks like "true".</p>
<p>A <code>bool</code> comes out on its own from comparisons <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;=</code> and from <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>. You need not keep a separate variable for the answer, but if you do its type is obvious: <code>ok := n % 2 == 0</code>.</p>`}
},
{
 h:{ru:"Массив и слайс — разные типы", en:"An array and a slice are different types"},
 b:{ru:`<p>Последнее правило возвращает к первому и доводит его до предела. Когда значений несколько, тип говорит не только «какие они», но у массива ещё и <strong>сколько</strong> их. <code>[3]int</code> и <code>[4]int</code> — два разных типа, разных ровно так же, как <code>int</code> и <code>string</code>.</p>
<pre><code>arr := [3]int{1, 2, 3}    <span class="cm">// массив: в квадратных скобках число</span>
sl  := []int{1, 2, 3}     <span class="cm">// слайс:  в квадратных скобках пусто</span>

sl  = append(sl, 4)       <span class="cm">// сработает</span>
arr = append(arr, 4)      <span class="cm">// не соберётся: argument must be a slice</span></code></pre>
<p>Это не запрет ради запрета. Массив из трёх чисел — это ровно три ячейки памяти, отведённые заранее; четвёртой рядом просто нет, и дописывать некуда. Слайс устроен иначе: он хранит не сами данные, а то, где они лежат и сколько их. Поэтому он может указать на другое место, где элементов больше.</p>
<p>Из этого следует то, на чём чаще всего спотыкаются: <code>append</code> <strong>возвращает</strong> слайс, а не меняет старый. Результат обязательно присваивают обратно.</p>
<pre><code>a = append(a, 7)   <span class="cm">// так</span>
append(a, 7)       <span class="cm">// не соберётся: результат выброшен</span></code></pre>
<p>Различать массив и слайс надо по <strong>квадратным</strong> скобкам, а не по фигурным: значения в <code>{ }</code> бывают и там, и там. Число внутри <code>[ ]</code> — массив, пусто — слайс.</p>
<p>Менять содержимое можно у обоих: <code>arr[0] = 99</code> работает. Неизменно у массива только <em>количество</em> элементов, потому что оно и есть часть типа.</p>
<p>Три способа создать слайс:</p>
<pre><code>var a []int           <span class="cm">// пустой, nil, длина 0</span>
b := []int{1, 2, 3}   <span class="cm">// сразу со значениями</span>
c := make([]int, 3)   <span class="cm">// [0 0 0] — три элемента, все нулевые</span></code></pre>
<p>Первый вариант нужен чаще прочих: там, где результат накапливают в цикле, пустой слайс объявляют до цикла и дописывают в него по одному.</p>`,
    en:`<p>The last rule goes back to the first and takes it as far as it goes. When there are several values, the type says not only what they are but — for an array — <strong>how many</strong>. <code>[3]int</code> and <code>[4]int</code> are two different types, as different as <code>int</code> and <code>string</code>.</p>
<pre><code>arr := [3]int{1, 2, 3}    <span class="cm">// array: a number inside the brackets</span>
sl  := []int{1, 2, 3}     <span class="cm">// slice: brackets are empty</span>

sl  = append(sl, 4)       <span class="cm">// works</span>
arr = append(arr, 4)      <span class="cm">// won't compile: argument must be a slice</span></code></pre>
<p>This is not a ban for the sake of banning. An array of three numbers is exactly three memory cells set aside in advance; there is no fourth one next to them, nowhere to append. A slice is built differently: it holds not the data itself but where the data sits and how much of it there is. That is why it can point at another place where there is room for more.</p>
<p>From which follows the thing people trip over most: <code>append</code> <strong>returns</strong> a slice, it does not change the old one. The result must be assigned back.</p>
<pre><code>a = append(a, 7)   <span class="cm">// like this</span>
append(a, 7)       <span class="cm">// won't compile: the result is thrown away</span></code></pre>
<p>Tell an array from a slice by the <strong>square</strong> brackets, not the curly ones: values inside <code>{ }</code> appear in both. A number inside <code>[ ]</code> means an array, empty means a slice.</p>
<p>Contents can be changed in both: <code>arr[0] = 99</code> works fine. Only the <em>number</em> of items in an array is fixed, because that number is part of the type.</p>
<p>Three ways to create a slice:</p>
<pre><code>var a []int           <span class="cm">// empty, nil, length 0</span>
b := []int{1, 2, 3}   <span class="cm">// with values right away</span>
c := make([]int, 3)   <span class="cm">// [0 0 0] — three items, all zero</span></code></pre>
<p>The first form is needed most often: where a result is accumulated in a loop, you declare an empty slice before the loop and append to it one item at a time.</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ + ГРАБЛИ ================= */
var TABLE = {
  title:{ru:"Нулевые значения",en:"Zero values"},
  intro:{ru:"Переменную создали, но ничего не положили — внутри не пусто и не ошибка, а нулевое значение своего типа.",en:"You created a variable and put nothing in it — inside is neither emptiness nor an error, but the zero value of its type."},
  head:{ru:["Тип","Нулевое значение","Проверка на пустоту"], en:["Type","Zero value","Emptiness check"]},
  rows:[["int","0","n == 0"],["float64","0","f == 0"],["string","\"\"","s == \"\""],
        ["bool","false","!b"],["byte","0","b == 0"],["rune","0","r == 0"],
        ["[]int","nil","len(s) == 0"],["[3]int","[0 0 0]","—"],
        [{ru:"структура",en:"struct"},{ru:"все поля нулевые",en:"all fields zero"},"—"]]
};

var TRAPS = [
 {ru:"<strong>Компилятор проверяет типы, а не смысл.</strong> Он поймает «положил строку в число», но не поймает «взял не тот индекс» или «перепутал <code>i</code> и <code>j</code>» — там с обеих сторон <code>int</code>, придраться не к чему. «Собралось» не значит «работает верно». Единственная настоящая проверка — прогнать пример из условия и сверить вывод.",
  en:"<strong>The compiler checks types, not meaning.</strong> It catches “a string put into a number”, but never “wrong index” or “<code>i</code> instead of <code>j</code>” — both sides are <code>int</code>, nothing to object to. “It compiled” does not mean “it is right”. The only real check is running the example from the task and comparing the output."},
 {ru:"<strong><code>fmt.Print('A')</code> печатает 65.</strong> Программа собирается, но выводит число вместо буквы. С <code>fmt</code> нужны двойные кавычки.",
  en:"<strong><code>fmt.Print('A')</code> prints 65.</strong> The program compiles but prints a number instead of a letter. With <code>fmt</code>, use double quotes."},
 {ru:"<strong><code>s[i]</code> — байт, а не буква.</strong> На латинице проходит незаметно, на кириллице ломается: буква занимает два байта, а половина буквы не значит ничего. Нужны буквы — <code>range</code> или <code>[]rune(s)</code>.",
  en:"<strong><code>s[i]</code> is a byte, not a letter.</strong> With Latin text it slips by; with Cyrillic it breaks — a letter takes two bytes, and half a letter means nothing. If you need letters, use <code>range</code> or <code>[]rune(s)</code>."},
 {ru:"<strong>Числа разных типов не складываются.</strong> <code>int</code> и <code>float64</code> в одном выражении не сойдутся, даже если оба — числа. Приводить явно: <code>float64(a) + b</code>.",
  en:"<strong>Numbers of different types don't mix.</strong> <code>int</code> and <code>float64</code> won't combine in one expression, even though both are numbers. Convert explicitly: <code>float64(a) + b</code>."},
 {ru:"<strong>Созданную переменную обязательно надо использовать.</strong> Иначе программа не соберётся: <code>declared and not used</code>. То же с импортом. Причина не в придирчивости: каждая переменная занимает память, и Go не даёт тратить её впустую. Новичка это ловит в первый же день — если переменная пока не нужна, просто не создавай её.",
  en:"<strong>Every variable you create must be used.</strong> Otherwise the program won't compile: <code>declared and not used</code>. Same for imports. It isn't pedantry: every variable takes memory, and Go refuses to waste it. This catches beginners on day one — if you don't need the variable yet, don't create it."},
 {ru:"<strong><code>append</code> без присваивания бесполезен.</strong> Строка <code>append(a, 7)</code> сама по себе ничего не меняет. Надо: <code>a = append(a, 7)</code>.",
  en:"<strong><code>append</code> without assignment does nothing.</strong> The line <code>append(a, 7)</code> changes nothing on its own. Write <code>a = append(a, 7)</code>."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

func main() {
	x := 42
	fmt.Println(x)
	fmt.Printf("%T\\n", x)
}`,
 out:"42\nint",
 why:{ru:"<code>%T</code> показывает тип. Это самый быстрый способ проверить, что на самом деле лежит в переменной.<br><b>Сломай:</b> добавь строку <code>y := 5</code> и не используй её. Программа не соберётся — Go не разрешает создавать переменную впустую.",
      en:"<code>%T</code> shows the type — the fastest way to check what a variable actually holds.<br><b>Break it:</b> add <code>y := 5</code> and don't use it. The program won't compile — Go doesn't allow unused variables."}
},
{
 chg:{ru:"у числа появилась точка", en:"the number got a dot"},
 code:`package main

import "fmt"

func main() {
	x := 42.0
	fmt.Println(x)
	fmt.Printf("%T\\n", x)
}`,
 out:"42\nfloat64",
 why:{ru:"Ловушка: на экране «42» без нуля, выглядит как в первом примере — а тип уже другой. <b>Судить о типе по тому, что видно, нельзя.</b>",
      en:"A trap: the screen shows “42” with no decimal, looking just like example 1 — but the type is different. <b>You can't judge a type by what you see.</b>"}
},
{
 chg:{ru:"появились двойные кавычки", en:"double quotes appeared"},
 code:`package main

import "fmt"

func main() {
	x := "42"
	fmt.Println(x)
	fmt.Printf("%T\\n", x)
}`,
 out:"42\nstring",
 why:{ru:"На экране снова то же самое, а считать с этим уже нельзя. <b>Сломай:</b> попробуй <code>x + 1</code>.",
      en:"Same thing on screen again, but you can't do arithmetic with it. <b>Break it:</b> try <code>x + 1</code>."}
},
{
 chg:{ru:"кавычки стали одинарными", en:"quotes became single"},
 code:`package main

import "fmt"

func main() {
	x := '4'
	fmt.Println(x)
	fmt.Println(string(x))
	fmt.Printf("%T\\n", x)
}`,
 out:"52\n4\nint32",
 why:{ru:"52 — это код символа «4». <code>rune</code> и <code>int32</code> — одно и то же имя для одного типа.",
      en:"52 is the code of the character “4”. <code>rune</code> and <code>int32</code> are two names for one type."}
},
{
 chg:{ru:"символ минус символ", en:"character minus character"},
 code:`package main

import "fmt"

func main() {
	fmt.Println('7' - '0')
	fmt.Println(string(rune('0' + 7)))
}`,
 out:"7\n7",
 why:{ru:"Первая семёрка — <b>число</b>, вторая — <b>символ</b>. На экране одинаковые, по сути разные. Первая строка переводит символ в цифру, вторая — обратно.",
      en:"The first 7 is a <b>number</b>, the second is a <b>character</b>. Identical on screen, different underneath. Line one turns a character into a digit, line two turns it back."}
},
{
 chg:{ru:"целое деление и остаток", en:"integer division and remainder"},
 code:`package main

import "fmt"

func main() {
	a := 7
	b := 2
	fmt.Println(a / b)
	fmt.Println(a % b)
	fmt.Println(float64(a) / float64(b))
}`,
 out:"3\n1\n3.5",
 why:{ru:"<b>Сломай:</b> убери <code>float64</code> у одного из двух чисел в последней строке и прочитай ошибку.",
      en:"<b>Break it:</b> remove <code>float64</code> from one of the two numbers in the last line and read the error."}
},
{
 chg:{ru:"длина строки: латиница и кириллица", en:"string length: Latin and Cyrillic"},
 code:`package main

import "fmt"

func main() {
	fmt.Println(len("Hello"), len("Привет"))
	fmt.Println("Hi"[0])
	fmt.Println(string("Hi"[0]))
}`,
 out:"5 12\n72\nH",
 why:{ru:"12, а не 6 — <code>len</code> считает байты. 72 — код символа «H».",
      en:"12, not 6 — <code>len</code> counts bytes. 72 is the code of “H”."}
},
{
 chg:{ru:"цикл по строке — следи за номерами", en:"looping a string — watch the numbers"},
 code:`package main

import "fmt"

func main() {
	s := "Привет"
	count := 0
	for i, c := range s {
		fmt.Println(i, string(c))
		count++
	}
	fmt.Println("букв:", count, "байтов:", len(s))
}`,
 out:"0 П\n2 р\n4 и\n6 в\n8 е\n10 т\nбукв: 6 байтов: 12",
 why:{ru:"Номер прыгает через два — единицу «съела» предыдущая буква. Шагов шесть, а <code>len</code> двенадцать: это разные числа.",
      en:"The offset jumps by two — the previous letter took the odd one. Six steps but <code>len</code> is twelve: different numbers."}
},
{
 chg:{ru:"строку менять нельзя — но можно собрать новую", en:"a string can't change — but you can build a new one"},
 code:`package main

import "fmt"

func main() {
	s := "hello"
	r := []rune(s)
	r[0] = 'H'
	fmt.Println(s)
	fmt.Println(string(r))
}`,
 out:"hello\nHello",
 why:{ru:"Исходная строка не изменилась — правили копию, разложенную на руны. <b>Сломай:</b> попробуй <code>s[0] = 'H'</code> напрямую.",
      en:"The original didn't change — you edited a rune copy. <b>Break it:</b> try <code>s[0] = 'H'</code> directly."}
},
{
 chg:{ru:"массив, слайс и нулевые значения", en:"array, slice and zero values"},
 code:`package main

import "fmt"

func main() {
	arr := [3]int{1, 2, 3}
	sl := []int{1, 2, 3}

	sl = append(sl, 4)
	arr[0] = 99

	fmt.Println(arr, len(arr))
	fmt.Println(sl, len(sl))

	var n int
	var s string
	var b bool
	var empty []int
	fmt.Println(n, s == "", b, empty == nil, len(empty))
}`,
 out:"[99 2 3] 3\n[1 2 3 4] 4\n0 true false true 0",
 why:{ru:"<b>Сломай обязательно:</b> добавь строку <code>arr = append(arr, 4)</code> и прочитай текст ошибки — он и есть ответ на вопрос, чем массив отличается от слайса.",
      en:"<b>Break it, definitely:</b> add <code>arr = append(arr, 4)</code> and read the error — it is the answer to how an array differs from a slice."}
},
{
 chg:{ru:"в одной строке печати несколько дырок", en:"several holes in one printed line"},
 code:`package main

import "fmt"

func main() {
	x := 42
	s := "Go"

	fmt.Printf("%v %T\\n", x, x)
	fmt.Printf("%v %q\\n", s, s)
	fmt.Printf("%v %v\\n", len(s), len(s) == 0)
}`,
 out:"42 int\nGo \"Go\"\n2 false",
 why:{ru:"Дырок в строке столько же, сколько аргументов после неё, и разбираются они по порядку. <code>%v</code> печатает любое значение, <code>%q</code> — строку в кавычках, поэтому во второй строке <code>Go</code> и <code>\"Go\"</code> выглядят по-разному. В третьей строке аргументы вообще не переменные, а выражения — считаются на месте. <b>Сломай:</b> убери один аргумент и прочитай, что скажет программа.",
      en:"A line has as many holes as arguments after it, and they are matched in order. <code>%v</code> prints any value, <code>%q</code> prints a string with quotes — which is why <code>Go</code> and <code>\"Go\"</code> look different on the second line. On the third line the arguments aren't variables at all but expressions — evaluated on the spot. <b>Break it:</b> remove one argument and read what the program says."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"PrintType", lvl:1, e:"42 int\n3.14 float64\nhello string\ntrue bool",
 d:{ru:"Создай четыре переменные разных типов: целое, дробное, строку и логическое. Напечатай каждую вместе с её типом.",
    en:"Create four variables of different types: integer, float, string and boolean. Print each one with its type."},
 h:{ru:"<code>fmt.Printf(\"%v %T\\n\", x, x)</code> печатает значение и тип одной строкой.",
    en:"<code>fmt.Printf(\"%v %T\\n\", x, x)</code> prints value and type in one line."}},

{t:"RuneAndString", lvl:1, e:"71\nG\nint32",
 d:{ru:"Возьми руну <code>'G'</code>. Напечатай её как число, затем как символ, затем её тип.",
    en:"Take the rune <code>'G'</code>. Print it as a number, then as a character, then its type."},
 h:{ru:"Показать число как символ — <code>string(r)</code>. Тип покажет <code>%T</code>.",
    en:"To show a number as a character use <code>string(r)</code>. The type comes from <code>%T</code>."}},

{t:"DivMod", lvl:1, e:"3 2 3.4",
 d:{ru:"Для чисел 17 и 5 напечатай в одну строку: частное целых, остаток и результат дробного деления.",
    en:"For 17 and 5, print in one line: the integer quotient, the remainder and the float division result."},
 h:{ru:"Для дробного деления оба числа переводят: <code>float64(a) / float64(b)</code>.",
    en:"For float division convert both numbers: <code>float64(a) / float64(b)</code>."}},

{t:"CountBytesAndRunes", lvl:1, e:"16 10",
 d:{ru:"Для строки <code>\"Привет, Go\"</code> напечатай количество байтов и количество символов — двумя числами в одну строку.",
    en:"For the string <code>\"Привет, Go\"</code> print the number of bytes and the number of characters — two numbers in one line."},
 h:{ru:"Байты даёт <code>len(s)</code>. Символы — цикл <code>range</code> со счётчиком либо <code>len([]rune(s))</code>.",
    en:"Bytes come from <code>len(s)</code>. Characters — a <code>range</code> loop with a counter, or <code>len([]rune(s))</code>."}},

{t:"DigitToNumber", lvl:2, e:"16",
 d:{ru:"Дана строка из одной цифры, например <code>\"8\"</code>. Получи из неё настоящее число и напечатай это число, умноженное на 2.",
    en:"Given a one-digit string, for example <code>\"8\"</code>. Turn it into a real number and print that number times 2."},
 h:{ru:"Возьми байт <code>s[0]</code> и вычти из него <code>'0'</code>.",
    en:"Take the byte <code>s[0]</code> and subtract <code>'0'</code> from it."}},

{t:"ZeroValues", lvl:2, e:"int: 0\nfloat64: 0\nstring: \"\"\nbool: false\n[]int: nil=true len=0",
 d:{ru:"Объяви пять переменных без значений: <code>int</code>, <code>float64</code>, <code>string</code>, <code>bool</code>, <code>[]int</code>. Напечатай каждую на своей строке. Строку покажи в кавычках, для слайса — является ли он nil и какова длина.",
    en:"Declare five variables with no values: <code>int</code>, <code>float64</code>, <code>string</code>, <code>bool</code>, <code>[]int</code>. Print each on its own line. Show the string in quotes; for the slice show whether it is nil and its length."},
 h:{ru:"Кавычки вокруг строки печатает <code>%q</code>. Проверка на nil — обычное сравнение <code>sl == nil</code>.",
    en:"<code>%q</code> prints a string with quotes. The nil check is a plain <code>sl == nil</code>."}},

{t:"ArrayVsSlice", lvl:2, e:"[99 2 3] 3\n[99 2 3 4] 4",
 d:{ru:"Создай массив из трёх чисел и слайс из тех же трёх. Поменяй первый элемент в обоих на 99, к слайсу добавь четвёртое число. Напечатай оба с их длинами.",
    en:"Create an array of three numbers and a slice of the same three. Set the first element of both to 99, append a fourth number to the slice. Print both with their lengths."},
 h:{ru:"Результат <code>append</code> присвой обратно. Массиву <code>append</code> не делай — не соберётся.",
    en:"Assign the <code>append</code> result back. Don't append to the array — it won't compile."}},

{t:"ReverseString", lvl:3, e:"тевирП",
 d:{ru:"Переверни строку <code>\"Привет\"</code> и напечатай результат так, чтобы кириллица не сломалась. <b>Нужен цикл</b> — он разбирается в теме 2. Если её ещё не проходил, вернись к этой задаче после неё.",
    en:"Reverse the string <code>\"Привет\"</code> and print the result without breaking the Cyrillic letters. <b>This needs a loop</b> — loops are covered in topic 2. If you haven't done it yet, come back to this task afterwards."},
 h:{ru:"Через <code>s[i]</code> не выйдет — там байты, буква развалится пополам. Разложи на руны, переставь элементы, собери обратно.",
    en:"<code>s[i]</code> won't work — those are bytes and a letter falls apart. Convert to runes, swap the elements, convert back."}},

{t:"SumDigits", lvl:3, e:"15",
 d:{ru:"Для числа 4821 посчитай сумму его цифр и напечатай её. Циклом, без превращения числа в строку. <b>Нужен цикл</b> — он разбирается в теме 2. Если её ещё не проходил, вернись к этой задаче после неё.",
    en:"For the number 4821 compute the sum of its digits and print it. Use a loop, without turning the number into a string. <b>This needs a loop</b> — loops are covered in topic 2. If you haven't done it yet, come back to this task afterwards."},
 h:{ru:"Пара <code>% 10</code> и <code>/ 10</code>: первая достаёт последнюю цифру, вторая её отрезает. Цикл идёт, пока число не станет нулём. Накопитель создавай ДО цикла.",
    en:"The <code>% 10</code> and <code>/ 10</code> pair: the first pulls the last digit, the second cuts it off. Loop until the number is zero. Create the accumulator BEFORE the loop."}},

{t:"NumberToString", lvl:3, e:"3 507",
 d:{ru:"Не пользуясь <code>strconv</code> и <code>Sprintf</code>, собери из числа 507 строку <code>\"507\"</code> и напечатай её длину и саму строку. <b>Нужен цикл</b> — он разбирается в теме 2. Если её ещё не проходил, вернись к этой задаче после неё.",
    en:"Without <code>strconv</code> or <code>Sprintf</code>, build the string <code>\"507\"</code> from the number 507 and print its length and the string itself. <b>This needs a loop</b> — loops are covered in topic 2. If you haven't done it yet, come back to this task afterwards."},
 h:{ru:"Обратный ход к прошлой задаче: цифра в символ — <code>'0' + d</code>, символ в строку — <code>string(...)</code>. Цифры достаются с конца, поэтому кусок приписывают СЛЕВА.",
    en:"The reverse of the previous task: digit to character is <code>'0' + d</code>, character to string is <code>string(...)</code>. Digits come out backwards, so prepend each piece on the LEFT."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};

var BANK = [
{q:Q_OUT, code:"fmt.Println(7 / 2)", opts:["3","3.5","4",NO], ok:0,
 why:{ru:"Оба числа целые — деление целочисленное, дробная часть отбрасывается, а не округляется. Чтобы получить 3.5: <code>float64(7) / float64(2)</code>.",
      en:"Both are integers, so the division is integer division — the fraction is dropped, not rounded. For 3.5 use <code>float64(7) / float64(2)</code>."}},

{q:Q_OUT, code:"fmt.Println('a')", opts:["97","a","'a'",{ru:"ошибка",en:"an error"}], ok:0,
 why:{ru:"В одинарных кавычках руна — число. Код символа «a» равен 97. Чтобы увидеть букву: <code>string('a')</code>.",
      en:"Single quotes mean a rune — a number. The code of “a” is 97. To see the letter: <code>string('a')</code>."}},

{q:{ru:"Чему равно <code>len(\"Привет\")</code>?", en:"What is <code>len(\"Привет\")</code>?"}, code:null,
 opts:["12","6","7","5"], ok:0,
 why:{ru:"<code>len</code> у строки считает байты. Кириллическая буква занимает два: 6 × 2 = 12.",
      en:"<code>len</code> counts bytes. A Cyrillic letter takes two: 6 × 2 = 12."}},

{q:Q_OUT, code:"fmt.Println(\"Hi\"[0])", opts:["72","H","\"H\"",NO], ok:0,
 why:{ru:"Обращение по индексу даёт байт — число. Код «H» равен 72. Букву покажет <code>string(\"Hi\"[0])</code>.",
      en:"Indexing gives a byte — a number. The code of “H” is 72. <code>string(\"Hi\"[0])</code> shows the letter."}},

{q:{ru:"Какая строка соберётся?", en:"Which line compiles?"}, code:null,
 opts:["var b bool = true","var b bool = 1","var b bool = \"true\"","var b bool = 0"], ok:0,
 why:{ru:"В <code>bool</code> кладут только <code>true</code> или <code>false</code>. Единица не истина, ноль не ложь.",
      en:"A <code>bool</code> takes only <code>true</code> or <code>false</code>. One is not true, zero is not false."}},

{q:Q_HAP, code:"a := [3]int{1, 2, 3}\na = append(a, 4)",
 opts:[NO,{ru:"a станет [1 2 3 4]",en:"a becomes [1 2 3 4]"},{ru:"a останется [1 2 3]",en:"a stays [1 2 3]"},{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"<code>append</code> работает только со слайсами. У массива размер вшит в тип — дописывать некуда. Ошибка: «argument must be a slice».",
      en:"<code>append</code> works on slices only. An array carries its size in the type — there is nowhere to append. Error: “argument must be a slice”."}},

{q:Q_OUT, code:"x := '7' - '0'\nfmt.Println(x)", opts:["7","55","48","'7'"], ok:0,
 why:{ru:"Символы цифр идут подряд: <code>'0'</code> это 48, <code>'7'</code> это 55. Разница даёт настоящее число 7.",
      en:"Digit characters are consecutive: <code>'0'</code> is 48, <code>'7'</code> is 55. The difference gives the real number 7."}},

{q:Q_HAP, code:"var a int = 5\nvar b float64 = 2.0\nfmt.Println(a + b)",
 opts:[NO,"7","7.0","5"], ok:0,
 why:{ru:"Go не смешивает типы молча, даже когда оба — числа. Нужно привести явно: <code>float64(a) + b</code>.",
      en:"Go never mixes types silently, even when both are numbers. Convert explicitly: <code>float64(a) + b</code>."}},

{q:Q_HAP, code:"s := \"hello\"\ns[0] = 'H'",
 opts:[NO,{ru:"s станет \"Hello\"",en:"s becomes \"Hello\""},{ru:"s останется \"hello\"",en:"s stays \"hello\""},{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"Строки неизменяемы. Путь такой: <code>r := []rune(s)</code>, поправить <code>r[0]</code>, затем <code>string(r)</code>.",
      en:"Strings are immutable. The way is: <code>r := []rune(s)</code>, fix <code>r[0]</code>, then <code>string(r)</code>."}},

{q:Q_OUT, code:"type point struct{ x, y int }\nvar p point\nfmt.Println(p)",
 opts:["{0 0}","{}","<nil>",NO], ok:0,
 why:{ru:"Нулевое значение структуры — структура, у которой все поля нулевые. Оба поля <code>int</code>, значит <code>{0 0}</code>.",
      en:"The zero value of a struct is a struct with all fields zeroed. Both fields are <code>int</code>, hence <code>{0 0}</code>."}},

{q:Q_OUT, code:"var s []int\nfmt.Println(s == nil, len(s))",
 opts:["true 0","false 0","true nil",{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"Нулевое значение слайса — <code>nil</code>. При этом <code>len</code> работает и даёт 0, а цикл по нему не сделает ни шага.",
      en:"The zero value of a slice is <code>nil</code>. Still, <code>len</code> works and returns 0, and a loop over it takes no steps."}},

{q:{ru:"Сколько шагов сделает цикл?", en:"How many steps does the loop take?"},
 code:"count := 0\nfor range \"Привет\" {\n\tcount++\n}\nfmt.Println(count)",
 opts:["6","12","1","0"], ok:0,
 why:{ru:"<code>range</code> идёт по буквам, поэтому шагов шесть. А <code>len</code> той же строки даст 12 — считает байты. Разные числа.",
      en:"<code>range</code> walks letters, so six steps. But <code>len</code> of the same string gives 12 — it counts bytes. Different numbers."}},

{q:Q_OUT, code:"fmt.Print('A')", opts:["65","A","'A'",NO], ok:0,
 why:{ru:"Одинарные кавычки — руна, число 65. Программа собирается и печатает число вместо буквы. С <code>fmt</code> нужны двойные кавычки.",
      en:"Single quotes mean a rune, the number 65. The program compiles and prints a number instead of a letter. With <code>fmt</code> use double quotes."}},

{q:Q_HAP, code:"a := []int{1, 2, 3}\nappend(a, 4)\nfmt.Println(a)",
 opts:[NO,"[1 2 3]","[1 2 3 4]","[4]"], ok:0,
 why:{ru:"<code>append</code> возвращает новый слайс, результат надо присвоить: <code>a = append(a, 4)</code>. Вызов с выброшенным результатом Go не пропускает.",
      en:"<code>append</code> returns a new slice and the result must be assigned: <code>a = append(a, 4)</code>. Go rejects a call whose result is discarded."}},

{q:Q_OUT, code:"fmt.Println(9 / 2, 9 % 2)", opts:["4 1","5 1","4.5 1","4 4"], ok:0,
 why:{ru:"Целочисленное деление отбрасывает дробную часть, а не округляет: 9/2 = 4, не 5. Остаток 9 − 2·4 = 1.",
      en:"Integer division drops the fraction, it does not round: 9/2 = 4, not 5. Remainder 9 − 2·4 = 1."}},

{q:Q_OUT, code:"s := \"hello\"\nr := []rune(s)\nr[0] = 'H'\nfmt.Println(s, string(r))",
 opts:["hello Hello","Hello Hello","hello hello",NO], ok:0,
 why:{ru:"<code>[]rune(s)</code> делает копию. Правка копии исходную строку не трогает — она неизменяема.",
      en:"<code>[]rune(s)</code> makes a copy. Editing the copy leaves the original untouched — it is immutable."}},

{q:{ru:"Какой тип у переменной после <code>x := 42</code>?", en:"What type does <code>x</code> have after <code>x := 42</code>?"},
 code:null, opts:["int","float64","int32",{ru:"определится во время работы программы",en:"decided at run time"}], ok:0,
 why:{ru:"Это вывод типа: Go смотрит на значение и подставляет <code>int</code>. Тип фиксируется при сборке — динамической типизации в Go нет.",
      en:"That is type inference: Go reads the value and picks <code>int</code>. The type is fixed at compile time — Go has no dynamic typing."}},

{q:Q_OUT, code:"c := make([]int, 3)\nfmt.Println(c, len(c))",
 opts:["[0 0 0] 3","[] 0","[3] 1","nil 3"], ok:0,
 why:{ru:"<code>make([]int, 3)</code> создаёт слайс из трёх элементов, заполненных нулями. Это не пустой слайс.",
      en:"<code>make([]int, 3)</code> creates a slice of three items filled with zeros. It is not an empty slice."}},

{q:Q_OUT, code:"n := 1234\nfmt.Println(n % 10, n / 10)",
 opts:["4 123","1 234","4 1234","3 124"], ok:0,
 why:{ru:"<code>% 10</code> достаёт последнюю цифру, <code>/ 10</code> её отрезает. На этой паре держатся задачи вроде «сумма цифр».",
      en:"<code>% 10</code> pulls the last digit, <code>/ 10</code> cuts it off. Tasks like “sum of digits” rest on this pair."}},

{q:{ru:"Почему компилятор пропускает <code>board[col][row]</code> вместо <code>board[row][col]</code>?",
    en:"Why does the compiler accept <code>board[col][row]</code> instead of <code>board[row][col]</code>?"},
 code:null,
 opts:[{ru:"обе переменные int, по типам всё сходится",en:"both are int, so the types line up"},
       {ru:"это недоработка компилятора",en:"it is a compiler flaw"},
       {ru:"такой код на самом деле не соберётся",en:"such code actually won't compile"},
       {ru:"не включена проверка",en:"a check is turned off"}], ok:0,
 why:{ru:"Компилятор проверяет согласованность типов, а не смысл. Перепутанные индексы, <code>i</code> вместо <code>j</code>, пустое тело ветки — по типам безупречны. Поэтому «собралось» ничего не доказывает.",
      en:"The compiler checks type consistency, not meaning. Swapped indices, <code>i</code> instead of <code>j</code>, an empty branch body — all flawless type-wise. So “it compiled” proves nothing."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Что такое тип и зачем он нужен?", en:"What is a type and why does it exist?"},
 a:{ru:`<p>Тип — это договор о том, что лежит в переменной и что с этим разрешено делать. Числа можно делить, строки склеивать, а разделить строку на строку нельзя.</p>
<p>Второе назначение — размер. Компилятор должен знать, сколько места занимает значение: <code>byte</code> — один байт, <code>rune</code> — четыре, <code>int</code> — восемь на современных машинах. Отсюда же требование Go использовать каждую созданную переменную: неиспользуемая занимает память впустую.</p>`,
    en:`<p>A type is an agreement about what a variable holds and what may be done with it. Numbers divide, strings concatenate, but a string divided by a string means nothing.</p>
<p>Its second job is size. The compiler must know how much room a value takes: <code>byte</code> is one byte, <code>rune</code> four, <code>int</code> eight on modern machines. This is also why Go insists every variable be used — an unused one wastes memory.</p>`}},

{q:{ru:"Go — статически или динамически типизированный язык?", en:"Is Go statically or dynamically typed?"},
 a:{ru:`<p>Статически. Типы проверяются <strong>до запуска</strong>, при сборке — программа с ошибкой типа просто не соберётся.</p>
<p>В динамических языках (Python, JavaScript) тип принадлежит значению, а не переменной, и проверяется во время работы. Там можно положить в переменную число, а потом строку.</p>
<p>Плюс статической типизации — скорость: программе не нужно на ходу выяснять, какой тип у переменной, это уже известно. Плата — следить за типами приходится самому.</p>
<p><code>:=</code> ничего в этом не меняет. Это <strong>вывод типа</strong>: тип не написан руками, но определён при сборке и зафиксирован. <code>x := 42</code> и <code>var x int = 42</code> — одно и то же.</p>`,
    en:`<p>Statically. Types are checked <strong>before the program runs</strong>, at compile time — code with a type error simply won't build.</p>
<p>In dynamic languages (Python, JavaScript) the type belongs to the value, not the variable, and is checked while running. There you can put a number in a variable and then a string.</p>
<p>The upside of static typing is speed: the program never has to work out a variable's type on the fly, it already knows. The price is that you watch the types yourself.</p>
<p><code>:=</code> changes none of this. It is <strong>type inference</strong>: the type isn't written by hand but is decided at compile time and fixed. <code>x := 42</code> and <code>var x int = 42</code> are the same.</p>`}},

{q:{ru:"Чем <code>byte</code> отличается от <code>rune</code>?", en:"How does <code>byte</code> differ from <code>rune</code>?"},
 a:{ru:`<p>Размером, и из-за этого — назначением.</p>
<ul><li><code>byte</code> — число от 0 до 255. Из байтов физически состоит строка.</li>
<li><code>rune</code> — число до двух с лишним миллиардов. Хватает на любой символ любого алфавита.</li></ul>
<p>Латинская буква помещается в один байт, поэтому байт и символ у неё совпадают. Кириллическая занимает два — и разница становится видна: <code>len("Привет")</code> даёт 12, а букв шесть.</p>
<p>Правило: работаешь с текстом на любом языке — работай рунами.</p>`,
    en:`<p>Size, and therefore purpose.</p>
<ul><li><code>byte</code> — a number from 0 to 255. Strings are physically made of bytes.</li>
<li><code>rune</code> — a number up to about two billion. Enough for any character in any alphabet.</li></ul>
<p>A Latin letter fits in one byte, so byte and character coincide. A Cyrillic letter takes two — and the difference shows: <code>len("Привет")</code> is 12 while there are six letters.</p>
<p>Rule of thumb: if the text can be in any language, work with runes.</p>`}},

{q:{ru:"Почему <code>fmt.Println('a')</code> печатает 97, а не букву?", en:"Why does <code>fmt.Println('a')</code> print 97 instead of a letter?"},
 a:{ru:`<p>Потому что <code>'a'</code> — руна, то есть число 97. Никакой буквы в переменной нет, есть код символа. <code>Println</code> получил число и честно его напечатал.</p>
<p>Чтобы увидеть букву, надо сказать «покажи это число как символ»: <code>string('a')</code>.</p>
<p>Это же — самая частая ошибка в задачах на рисование фигур: <code>fmt.Print('A')</code> печатает 65, и вместо картинки выходит столбик чисел.</p>`,
    en:`<p>Because <code>'a'</code> is a rune, that is the number 97. There is no letter in the variable, only a character code. <code>Println</code> got a number and printed it honestly.</p>
<p>To see the letter, say “show this number as a character”: <code>string('a')</code>.</p>
<p>This is the classic bug in shape-drawing tasks: <code>fmt.Print('A')</code> prints 65, and instead of a picture you get a column of numbers.</p>`}},

{q:{ru:"Почему <code>len(\"Привет\")</code> равно 12?", en:"Why is <code>len(\"Привет\")</code> 12?"},
 a:{ru:`<p><code>len</code> у строки считает байты, а кириллическая буква занимает два. Шесть букв — двенадцать байтов.</p>
<p>Чтобы посчитать именно буквы, есть два пути:</p>
<pre><code><span class="cm">// цикл range идёт по буквам</span>
count := 0
for range s {
	count++
}

<span class="cm">// либо разложить на руны</span>
count := len([]rune(s))</code></pre>`,
    en:`<p><code>len</code> on a string counts bytes, and a Cyrillic letter takes two. Six letters, twelve bytes.</p>
<p>To count letters there are two ways:</p>
<pre><code><span class="cm">// a range loop walks letters</span>
count := 0
for range s {
	count++
}

<span class="cm">// or convert to runes</span>
count := len([]rune(s))</code></pre>`}},

{q:{ru:"В чём разница между массивом и слайсом?", en:"What is the difference between an array and a slice?"},
 a:{ru:`<p>Главное: <strong>у массива размер входит в тип</strong>. <code>[3]int</code> и <code>[4]int</code> — разные типы, и функция, ожидающая один, не примет другой.</p>
<div class="tablewrap"><table>
<tr><th></th><th>Массив <code>[3]int</code></th><th>Слайс <code>[]int</code></th></tr>
<tr><td>Размер</td><td>вшит в тип, неизменен</td><td>меняется</td></tr>
<tr><td><code>append</code></td><td>нельзя</td><td>можно</td></tr>
<tr><td>Нулевое значение</td><td><code>[0 0 0]</code></td><td><code>nil</code></td></tr>
<tr><td>Передача в функцию</td><td>копируется целиком</td><td>копируется заголовок, данные общие</td></tr>
</table></div>
<p>Последняя строка важнее, чем кажется: функция, меняющая элементы слайса, изменит их и у того, кто её вызвал. С массивом такого не будет — функция получит копию.</p>
<p>В обычной работе почти всегда берут слайс. Массив — когда размер действительно фиксирован и известен заранее.</p>`,
    en:`<p>The key point: <strong>an array carries its size in the type</strong>. <code>[3]int</code> and <code>[4]int</code> are different types, and a function expecting one won't take the other.</p>
<div class="tablewrap"><table>
<tr><th></th><th>Array <code>[3]int</code></th><th>Slice <code>[]int</code></th></tr>
<tr><td>Size</td><td>in the type, fixed</td><td>changes</td></tr>
<tr><td><code>append</code></td><td>not allowed</td><td>allowed</td></tr>
<tr><td>Zero value</td><td><code>[0 0 0]</code></td><td><code>nil</code></td></tr>
<tr><td>Passed to a function</td><td>copied entirely</td><td>header copied, data shared</td></tr>
</table></div>
<p>That last row matters more than it looks: a function changing slice elements changes them for the caller too. With an array it won't — the function gets a copy.</p>
<p>In practice you almost always take a slice. An array is for when the size truly is fixed and known upfront.</p>`}},

{q:{ru:"Почему <code>7 / 2</code> даёт 3, и как получить 3.5?", en:"Why is <code>7 / 2</code> equal to 3, and how do I get 3.5?"},
 a:{ru:`<p>Когда оба числа целые, Go выполняет целочисленное деление: дробная часть отбрасывается. Именно отбрасывается, а не округляется — <code>9/2</code> даёт 4, а не 5.</p>
<p>Чтобы получить дробный результат, хотя бы одно число должно быть дробным: <code>float64(a) / float64(b)</code>.</p>
<p>Отбрасывание — не недостаток, а инструмент: на нём держится разбор числа на цифры через <code>/ 10</code>.</p>`,
    en:`<p>When both numbers are integers, Go does integer division: the fraction is dropped. Dropped, not rounded — <code>9/2</code> gives 4, not 5.</p>
<p>For a fractional result at least one number must be a float: <code>float64(a) / float64(b)</code>.</p>
<p>Dropping is not a flaw but a tool: taking a number apart digit by digit with <code>/ 10</code> depends on it.</p>`}},

{q:{ru:"Если компилятор проверяет типы — почему он пропускает ошибки?", en:"If the compiler checks types, why does it let errors through?"},
 a:{ru:`<p>Потому что он проверяет <strong>согласованность типов, а не смысл программы</strong>. Строка <code>board[col][row]</code> вместо <code>board[row][col]</code> с точки зрения типов безупречна: обе переменные <code>int</code>.</p>
<p>Компилятор поймает: строку там, где ждали число · <code>append</code> к массиву · возврат числа из функции с <code>bool</code> · неиспользованную переменную или импорт.</p>
<p>Компилятор не поймает: перепутанные индексы · <code>i</code> вместо <code>j</code> в условии · пустое тело у ветки <code>if</code> · условие, развёрнутое не в ту сторону.</p>
<p>Вывод: <strong>«собралось» ничего не доказывает</strong>. Доказывает только прогон примера из условия задачи и сверка вывода.</p>`,
    en:`<p>Because it checks <strong>type consistency, not the meaning of the program</strong>. The line <code>board[col][row]</code> instead of <code>board[row][col]</code> is flawless type-wise: both variables are <code>int</code>.</p>
<p>The compiler catches: a string where a number was expected · <code>append</code> on an array · returning a number from a <code>bool</code> function · an unused variable or import.</p>
<p>The compiler misses: swapped indices · <code>i</code> instead of <code>j</code> in a condition · an empty <code>if</code> body · a condition written the wrong way round.</p>
<p>Conclusion: <strong>“it compiled” proves nothing</strong>. Only running the example from the task and comparing the output proves anything.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */

/* Разбор строки на символы и байты — нужен нескольким сценариям.
   Префикс sc, чтобы имена не пересекались с остальным файлом. */
function scChars(s){
  var out = [], i = 0;
  while(i < s.length){
    var c = s.charCodeAt(i);
    if(c >= 0xD800 && c <= 0xDBFF && i + 1 < s.length){ out.push(s.substr(i, 2)); i += 2; }
    else { out.push(s.charAt(i)); i += 1; }
  }
  return out;
}
function scCode(ch){
  var c = ch.charCodeAt(0);
  if(c >= 0xD800 && c <= 0xDBFF && ch.length > 1)
    return (c - 0xD800) * 0x400 + (ch.charCodeAt(1) - 0xDC00) + 0x10000;
  return c;
}
function scSize(ch){
  var c = scCode(ch);
  return c < 0x80 ? 1 : (c < 0x800 ? 2 : (c < 0x10000 ? 3 : 4));
}
function scWord(v){
  return String(v === undefined || v === null ? "" : v).replace(/["\\]/g, "").slice(0, 10);
}
function scLayout(w){
  var chars = scChars(w), off = [], tape = [], total = 0;
  for(var i = 0; i < chars.length; i++){
    var n = scSize(chars[i]);
    off.push(total);
    for(var k = 0; k < n; k++) tape.push(chars[i]);
    total += n;
  }
  return {chars:chars, off:off, tape:tape, total:total};
}
function scForm(n, one, few, many){
  var t = n % 10, h = n % 100;
  if(t === 1 && h !== 11) return one;
  if(t >= 2 && t <= 4 && (h < 12 || h > 14)) return few;
  return many;
}
function scBt(n){ return scForm(n, "байт", "байта", "байтов"); }
function scBtEn(n){ return n === 1 ? "byte" : "bytes"; }
function scTimes(n){ return scForm(n, "раз", "раза", "раз"); }
function scItems(n){ return scForm(n, "элемент", "элемента", "элементов"); }

var SCENARIOS = [
{
 name:{ru:"Руна и строка", en:"Rune and string"},
 params:[{key:"ch", label:{ru:"символ", en:"char"}, values:["A","G","a","7","0","Я"], def:"A"}],
 code: function(p){
   return ["r := '" + p.ch + "'",
           "fmt.Println(r)",
           "s := string(r)",
           "fmt.Println(s)",
           "fmt.Printf(\"%T %T\\n\", r, s)"];
 },
 steps: function(p){
   var ch = p.ch, n = String(scCode(ch)), big = scCode(ch) > 255;
   var v1 = [["r", n, "int32 (rune)"]];
   var v2 = [["r", n, "int32 (rune)"], ["s", "\"" + ch + "\"", "string"]];
   var o1 = n + "\n", o2 = o1 + ch + "\n", o3 = o2 + "int32 string\n";
   return [
    {line:0, vars:v1, out:"",
     note:{ru:"Создали руну. В одинарных кавычках лежит <b>число</b> — код символа «" + ch + "» равен " + n + ". Буквы в переменной нет." +
              (big ? " Число больше 255, в один байт оно не помещается — потому и нужен тип пошире." : ""),
           en:"A rune is created. Single quotes hold a <b>number</b> — the code of “" + ch + "” is " + n + ". There is no letter in the variable." +
              (big ? " The number is above 255 and does not fit in one byte — hence the wider type." : "")}},
    {line:1, vars:v1, out:o1,
     note:{ru:"Печатаем руну как есть — на экране " + n + ", число. Отсюда и берётся вывод чисел вместо букв.",
           en:"Printing the rune as is gives " + n + ", a number. This is where “numbers instead of letters” comes from."}},
    {line:2, vars:v2, out:o1,
     note:{ru:"<code>string(r)</code> говорит: «покажи число " + n + " как символ». Получилась строка из одной буквы, значение прежнее.",
           en:"<code>string(r)</code> says “show the number " + n + " as a character”. The result is a one-letter string, same value inside."}},
    {line:3, vars:v2, out:o2,
     note:{ru:"Теперь на экране «" + ch + "». Число никуда не делось — изменился только тип.",
           en:"Now “" + ch + "” appears on screen. The number did not go anywhere — only the type changed."}},
    {line:4, vars:v2, out:o3,
     note:{ru:"<code>rune</code> — это другое имя для <code>int32</code>, поэтому Go пишет именно так. Смени символ вверху: число поменяется, типы останутся те же.",
           en:"<code>rune</code> is another name for <code>int32</code>, which is why Go prints it that way. Change the character above: the number changes, the types stay."}}
   ];
 }
},
{
 name:{ru:"Байты против букв", en:"Bytes vs letters"},
 params:[{key:"word", label:{ru:"строка", en:"string"}, text:true, max:10, def:"Привет"}],
 code: function(p){
   return ["s := \"" + scWord(p.word) + "\"",
           "fmt.Println(len(s))",
           "for i, c := range s {",
           "\tfmt.Println(i, string(c))",
           "}"];
 },
 tape: function(p){
   var L = scLayout(scWord(p.word));
   return L.tape.length ? L.tape : null;
 },
 steps: function(p){
   var w = scWord(p.word), L = scLayout(w), n = L.chars.length, total = L.total;
   var sv = ["s", "\"" + w + "\"", "string"];
   var title = {ru:"Буквы строки", en:"Letters of the string"};
   var steps = [], out = "";

   steps.push({line:0, vars:[sv], out:"", tapeOn:[],
     cells:L.chars, cellsOn:[], cellsTitle:title,
     note:{ru:"Строка создана. Букв в ней " + n + ", а байтов в памяти " + total + " — это разные числа, как только текст перестаёт быть латиницей.",
           en:"The string is created. It has " + n + " letters but takes " + total + " bytes in memory — different numbers as soon as the text is not Latin."}});

   out = total + "\n";
   steps.push({line:1, vars:[sv, ["len(s)", String(total), "int"]], out:out, tapeOn:[],
     cells:L.chars, cellsOn:[], cellsTitle:title,
     note: total === n
       ? {ru:"<b>len считает байты, а не буквы.</b> Здесь каждая буква занимает один байт, поэтому числа совпали: " + total + ".",
          en:"<b>len counts bytes, not letters.</b> Here every letter takes one byte, so the numbers match: " + total + "."}
       : {ru:"<b>len считает байты, а не буквы.</b> Букв " + n + ", а ответ — " + total + ".",
          en:"<b>len counts bytes, not letters.</b> " + n + " letters, but the answer is " + total + "."}});

   for(var i = 0; i < n; i++){
     var ch = L.chars[i], size = scSize(ch), start = L.off[i], on = [];
     for(var k = 0; k < size; k++) on.push(start + k);
     var vs = [sv, ["i", String(start), "int"], ["c", "'" + ch + "'", "rune"]];
     steps.push({line:2, vars:vs, out:out, tapeOn:on,
       cells:L.chars, cellsOn:[i], cellsTitle:title,
       note:{ru:"Шаг " + (i + 1) + ". Буква «" + ch + "» начинается с байта " + start + " и занимает " + size + " " + scBt(size) +
                ". <code>range</code> идёт по буквам, но <code>i</code> — номер байта.",
             en:"Step " + (i + 1) + ". The letter “" + ch + "” starts at byte " + start + " and takes " + size + " " + scBtEn(size) +
                ". <code>range</code> walks letters, but <code>i</code> is the byte offset."}});
     out += start + " " + ch + "\n";
     steps.push({line:3, vars:vs, out:out, tapeOn:on,
       cells:L.chars, cellsOn:[i], cellsTitle:title,
       note:{ru:"Напечатали номер байта и букву: <code>" + start + " " + ch + "</code>." +
                (i + 1 < n ? " Следующий номер будет " + L.off[i + 1] + ", а не " + (start + 1) + "." : ""),
             en:"Printed the byte offset and the letter: <code>" + start + " " + ch + "</code>." +
                (i + 1 < n ? " The next offset will be " + L.off[i + 1] + ", not " + (start + 1) + "." : "")}});
   }

   if(n === 0){
     steps.push({line:4, vars:[sv, ["len(s)", "0", "int"]], out:out, tapeOn:[],
       cells:[], cellsOn:[], cellsTitle:title,
       note:{ru:"Строка пустая — <code>range</code> не сделал ни одного шага, печатать нечего.",
             en:"The string is empty — <code>range</code> took no steps at all, nothing to print."}});
   } else {
     var last = n - 1, lastOn = [];
     for(var m = 0; m < scSize(L.chars[last]); m++) lastOn.push(L.off[last] + m);
     steps.push({line:4, vars:[sv, ["i", String(L.off[last]), "int"], ["c", "'" + L.chars[last] + "'", "rune"]],
       out:out, tapeOn:lastOn, cells:L.chars, cellsOn:[last], cellsTitle:title,
       note:{ru:"Цикл закончился. Шагов " + n + ", последний номер байта " + L.off[last] + ", а <code>len</code> равен " + total +
                ". <b>Это три разных числа.</b>",
             en:"Loop finished. " + n + " steps, last byte offset " + L.off[last] + ", and <code>len</code> is " + total +
                ". <b>Three different numbers.</b>"}});
   }
   return steps;
 }
},
{
 name:{ru:"Деление целых", en:"Integer division"},
 params:[{key:"a", label:{ru:"a", en:"a"}, min:1, max:20, def:7},
         {key:"b", label:{ru:"b", en:"b"}, min:2, max:9,  def:2}],
 code: function(p){
   return ["a := " + (+p.a),
           "b := " + (+p.b),
           "fmt.Println(a / b)",
           "fmt.Println(a % b)",
           "fmt.Println(float64(a) / float64(b))"];
 },
 steps: function(p){
   var a = +p.a, b = +p.b;
   var q = Math.floor(a / b), r = a - q * b, f = String(a / b);
   var v1 = [["a", String(a), "int"]];
   var v2 = [["a", String(a), "int"], ["b", String(b), "int"]];
   var o1 = q + "\n", o2 = o1 + r + "\n", o3 = o2 + f + "\n";
   return [
    {line:0, vars:v1, out:"",
     note:{ru:"Первое число целое — это определит всё дальнейшее.",
           en:"The first number is an integer — that decides everything below."}},
    {line:1, vars:v2, out:"",
     note:{ru:"Второе тоже целое. Оба <code>int</code> — значит, и результату деления неоткуда взять другой тип.",
           en:"The second is an integer too. Both are <code>int</code> — so the division result has nowhere to get another type from."}},
    {line:2, vars:v2, out:o1,
     note: r === 0
       ? {ru:"<b>" + q + "</b>. Здесь " + b + " укладывается в " + a + " ровно " + q + " " + scTimes(q) + ", отбрасывать нечего.",
          en:"<b>" + q + "</b>. Here " + b + " fits into " + a + " exactly " + q + " times, there is nothing to drop."}
       : {ru:"<b>" + q + ", а не " + f + ".</b> " + b + " помещается в " + a + " " + q + " " + scTimes(q) +
             ", дробная часть отбрасывается — не округляется.",
          en:"<b>" + q + ", not " + f + ".</b> " + b + " fits into " + a + " " + q + " times, the fraction is dropped — not rounded."}},
    {line:3, vars:v2, out:o2,
     note:{ru:"Остаток — то, что не поместилось: <code>" + a + " = " + b + "·" + q + " + " + r +
              "</code>. Остаток всегда меньше делителя, поэтому больше " + (b - 1) + " тут не бывает.",
           en:"The remainder is what didn't fit: <code>" + a + " = " + b + "·" + q + " + " + r +
              "</code>. A remainder is always below the divisor, so it never exceeds " + (b - 1) + " here."}},
    {line:4, vars:v2, out:o3,
     note:{ru:"Перевели оба числа в дробный тип — получили " + f + ". <code>float64(a / b)</code> уже не спасло бы: деление к тому моменту прошло по правилам целых, переводить было бы нечего.",
           en:"Convert both numbers to a float type and you get " + f + ". <code>float64(a / b)</code> would not save it: by then the division already ran by integer rules, leaving nothing to convert."}}
   ];
 }
},
{
 name:{ru:"Массив против слайса", en:"Array vs slice"},
 params:[{key:"x", label:{ru:"дописываем", en:"append"}, min:0, max:9, def:4},
         {key:"n", label:{ru:"сколько раз", en:"times"}, min:1, max:4, def:1}],
 code: function(p){
   var c = ["arr := [3]int{1, 2, 3}", "sl := []int{1, 2, 3}"];
   for(var i = 0; i < (+p.n); i++) c.push("sl = append(sl, " + (+p.x) + ")");
   c.push("arr[0] = 99");
   c.push("// arr = append(arr, " + (+p.x) + ")");
   c.push("fmt.Println(arr, len(arr))");
   c.push("fmt.Println(sl, len(sl))");
   return c;
 },
 steps: function(p){
   var x = +p.x, n = +p.n;
   var arr = ["1", "2", "3"], sl = ["1", "2", "3"], steps = [];
   var arrTitle = {ru:"Массив arr — [3]int", en:"Array arr — [3]int"};
   var slTitle  = {ru:"Слайс sl — []int", en:"Slice sl — []int"};
   function show(v){ return "[" + v.join(" ") + "]"; }
   function vars(){ return [["arr", show(arr), "[3]int"], ["sl", show(sl), "[]int"]]; }

   steps.push({line:0, vars:[["arr", show(arr), "[3]int"]], out:"",
     cells:arr.slice(), cellsOn:[], cellsTitle:arrTitle,
     note:{ru:"Массив. В квадратных скобках стоит <b>3</b> — это размер, и он часть типа.",
           en:"An array. The <b>3</b> in the brackets is the size, and it is part of the type."}});
   steps.push({line:1, vars:vars(), out:"",
     cells:sl.slice(), cellsOn:[], cellsTitle:slTitle,
     note:{ru:"Слайс. Скобки пустые — размера в типе нет. Значения те же, а типы разные.",
           en:"A slice. Empty brackets — no size in the type. Same values, different types."}});

   for(var i = 0; i < n; i++){
     sl.push(String(x));
     steps.push({line:2 + i, vars:vars(), out:"",
       cells:sl.slice(), cellsOn:[sl.length - 1], cellsTitle:slTitle,
       note:{ru:"<code>append</code> сработал: дописали " + x + ", в слайсе стало " + sl.length + " " + scItems(sl.length) +
                ". Результат присвоен обратно в <code>sl</code> — без этого не изменилось бы ничего.",
             en:"<code>append</code> worked: " + x + " was added, the slice now holds " + sl.length + " item" + (sl.length === 1 ? "" : "s") +
                ". The result was assigned back to <code>sl</code> — without that nothing would change."}});
   }

   arr[0] = "99";
   steps.push({line:2 + n, vars:vars(), out:"",
     cells:arr.slice(), cellsOn:[0], cellsTitle:arrTitle,
     note:{ru:"<b>Содержимое массива менять можно.</b> Неизменно только количество элементов.",
           en:"<b>Array contents can be changed.</b> Only the number of items is fixed."}});
   steps.push({line:3 + n, vars:vars(), out:"",
     cells:arr.slice(), cellsOn:[], cellsTitle:{ru:"Массив arr — четвёртой ячейки нет", en:"Array arr — there is no fourth cell"},
     note:{ru:"Эта строка закомментирована не случайно: <code>append</code> к массиву не собирается — «argument must be a slice». Дописывать некуда, четвёртой ячейки просто нет.",
           en:"This line is commented out for a reason: <code>append</code> on an array won't compile — “argument must be a slice”. There is nowhere to append, there is no fourth cell."}});

   var o1 = show(arr) + " 3\n", o2 = o1 + show(sl) + " " + sl.length + "\n";
   steps.push({line:4 + n, vars:vars(), out:o1,
     cells:arr.slice(), cellsOn:[], cellsTitle:{ru:"Массив arr — длина 3", en:"Array arr — length 3"},
     note:{ru:"Массив как был из трёх, так и остался — сколько бы раз ни сработал <code>append</code> рядом.",
           en:"The array still holds three items — no matter how many times <code>append</code> ran next to it."}});
   steps.push({line:5 + n, vars:vars(), out:o2,
     cells:sl.slice(), cellsOn:[], cellsTitle:{ru:"Слайс sl — длина " + sl.length, en:"Slice sl — length " + sl.length},
     note:{ru:"А слайс вырос до " + sl.length + ". Вот и вся разница между типами.",
           en:"The slice grew to " + sl.length + ". That is the whole difference between the types."}});
   return steps;
 }
},
{
 name:{ru:"Нулевые значения", en:"Zero values"},
 code:["var n int","var s string","var b bool","var sl []int","fmt.Println(n, s == \"\", b, sl == nil, len(sl))"],
 steps:[
  {line:0, vars:[["n","0","int"]], out:"",
   note:{ru:"Переменная создана, но ничего не положили. Внутри не мусор и не ошибка, а <b>ноль</b>.",
         en:"The variable exists but nothing was put in it. Not garbage, not an error — <b>zero</b>."}},
  {line:1, vars:[["n","0","int"],["s","\"\"","string"]], out:"",
   note:{ru:"У строки нулевое значение — пустая строка.", en:"For a string the zero value is an empty string."}},
  {line:2, vars:[["n","0","int"],["s","\"\"","string"],["b","false","bool"]], out:"",
   note:{ru:"У логического типа — <code>false</code>.", en:"For a boolean it is <code>false</code>."}},
  {line:3, vars:[["n","0","int"],["s","\"\"","string"],["b","false","bool"],["sl","nil","[]int"]], out:"",
   note:{ru:"У слайса — <code>nil</code>. Данных под ним нет, но <code>len</code> работает, и цикл по нему просто не сделает ни шага.",
         en:"For a slice it is <code>nil</code>. No data underneath, yet <code>len</code> works and a loop over it simply takes no steps."}},
  {line:4, vars:[["n","0","int"],["s","\"\"","string"],["b","false","bool"],["sl","nil","[]int"]], out:"0 true false true 0\n",
   note:{ru:"Все четыре нулевых значения. Их стоит знать наизусть — на них строятся проверки «пусто или нет».",
         en:"All four zero values. Worth knowing by heart — emptiness checks are built on them."}}
 ]
}
];

/* ================= СБОРКА КАРТИНЫ ================= */
var OUTRO = {
ru:`<p>Семь правил — это одна мысль, разложенная на части: <strong>у каждого значения есть тип, он известен ещё до запуска и определяет, что с этим значением можно делать</strong>. Целые делятся нацело, потому что результату неоткуда взять другой тип. <code>'a'</code> печатается как 97, потому что руна — это число. <code>len("Привет")</code> равно 12, потому что строка сделана из байтов. Строку нельзя править на месте, потому что те же байты могут быть общими с другой переменной. К массиву нельзя дописать, потому что размер сидит в самом типе.</p>
<p>Из этого складывается небольшой набор переходов между типами — и он одинаков везде, где ты его встретишь: <code>string(r)</code> — число как символ, <code>[]rune(s)</code> — строка по буквам, <code>float64(n)</code> — целое в дробное, <code>'7' - '0'</code> — символ в цифру, <code>'0' + d</code> — цифру в символ. Плюс пара <code>% 10</code> и <code>/ 10</code>, разбирающая число на цифры. Этого хватает, чтобы посчитать буквы в тексте на любом языке, перевернуть строку не сломав кириллицу, собрать строку из числа без единой готовой функции.</p>
<p>Теперь ты можешь посмотреть на строку кода и сказать, какого типа каждое значение в ней и что с ним произойдёт, — не запуская программу. Это и есть навык, который тема даёт.</p>
<p>И одно, что стоит запомнить, даже если забудется всё остальное: <strong>«собралось» не значит «работает верно»</strong>. Компилятор сверяет типы, а не смысл. <code>fmt.Print('A')</code> соберётся и напечатает 65. <code>board[col][row]</code> вместо <code>board[row][col]</code> соберётся, потому что с обеих сторон <code>int</code>. Настоящая проверка одна: запустить и сверить вывод с тем, который ты ждал.</p>`,
en:`<p>The seven rules are one thought taken apart: <strong>every value has a type, the type is known before the program runs, and it decides what may be done with that value</strong>. Integers divide to integers because the result has nowhere else to get a type from. <code>'a'</code> prints as 97 because a rune is a number. <code>len("Привет")</code> is 12 because a string is made of bytes. A string cannot be edited in place because those same bytes may be shared with another variable. An array cannot be appended to because its size sits inside the type.</p>
<p>Out of this comes a small set of conversions, and it is the same set everywhere you meet it: <code>string(r)</code> — a number as a character, <code>[]rune(s)</code> — a string by letters, <code>float64(n)</code> — whole to fractional, <code>'7' - '0'</code> — character to digit, <code>'0' + d</code> — digit to character. Plus the <code>% 10</code> and <code>/ 10</code> pair that takes a number apart. That is enough to count letters in text of any language, reverse a string without breaking Cyrillic, build a string out of a number with no ready-made function at all.</p>
<p>You can now look at a line of code and say what type each value in it has and what will happen to it — without running anything. That is the skill this topic gives you.</p>
<p>And one thing worth keeping even if everything else fades: <strong>"it compiled" does not mean "it is right"</strong>. The compiler checks types, not meaning. <code>fmt.Print('A')</code> compiles and prints 65. <code>board[col][row]</code> instead of <code>board[row][col]</code> compiles, because both sides are <code>int</code>. There is only one real check: run it and compare the output with the one you expected.</p>`
};
