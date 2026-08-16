var META = {
  n: 8,
  slug: "08-structs",
  eyebrow:{ru:"Go с нуля · тема 8 из 13", en:"Go from zero · topic 8 of 13"},
  title:  {ru:"Структуры и указатели", en:"Structs and pointers"},
  lede:{
    ru:"Одно имя вместо десяти переменных — и первый случай, когда «программа собралась» и «программа работает» расходятся молча: функция меняет поле, а снаружи ничего не меняется.",
    en:"One name instead of ten variables — and the first case where “it compiled” and “it works” quietly part ways: a function changes a field and nothing changes outside."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=29460s",
    t:{ru:"Курс по Go — главы «Указатели» (7:26:30) и «Структуры» (8:11:00)", en:"Go course — the “Pointers” (7:26:30) and “Structs” (8:11:00) chapters"},
    d:{ru:"Ссылка открывает структуры; указатели идут чуть раньше, их полезно посмотреть первыми.", en:"The link opens structs; pointers come a bit earlier and are worth watching first."}},
  folder: "struct1",
  txt: {ru:"go-tema-08-struktury-i-ukazateli.txt", en:"go-topic-08-structs-and-pointers.txt"}
};

var INTRO = {
 ru:`<p>До сих пор одна переменная держала одно значение. Слайс дал много значений под одним именем, но с условием: все одного типа. А вещь, которую описывают несколько значений <em>разных</em> типов — имя строкой, возраст числом, — держать не в чем. Такие значения заводят отдельными переменными, и связывает их только то, что ты сам помнишь про эту связь.</p>
<p>Смотри, что из этого выходит. Два человека — уже четыре переменные:</p>
<pre><code>name1 := "Bob"
age1  := 30
name2 := "Ann"
age2  := 25</code></pre>
<p>Десять человек — двадцать переменных с номерами в именах. Слайсы спасают наполовину: <code>names</code> и <code>ages</code> надо держать одной длины и следить, чтобы индексы не разъехались. А функция, которая должна отдать одного человека, вынуждена возвращать два значения — и три, когда добавится город.</p>
<p>Структура — это способ объявить свой тип, перечислив, из каких полей он состоит. Дальше человек живёт в одной переменной:</p>
<pre><code>type Person struct {
	name string
	age  int
}

p := Person{name: "Bob", age: 30}
fmt.Println(p.name, p.age)   <span class="cm">// Bob 30</span></code></pre>
<p>Один аргумент вместо двух, одно возвращаемое значение, один элемент слайса. Освоив тему, ты сможешь описывать собственные типы, собирать из них слайсы, вкладывать друг в друга, отдавать в функции — и, что важнее всего, писать функции, которые меняют то, что им передали. Последнее в Go само по себе не работает, и на этом тема держится.</p>
<p>Порядок разбора такой. Сначала — как объявить тип и добраться до поля. Потом — что лежит в структуре, созданной без значений. Дальше главный факт темы: структура копируется — при присваивании и при передаче в функцию. Из него выводится всё остальное. Раз копия — функция не может изменить оригинал; раз не может — нужен способ дать ей адрес вместо значения, и отсюда появляются <code>&amp;</code>, <code>*Person</code> и <code>*q</code>. Дальше — что бывает с указателем, которому адрес не дали: это единственное место в теме, где программа не отказывается собираться, а падает на ходу. В конце то же копирование вылезет ещё раз, там, где его не ждёшь — в цикле по слайсу структур.</p>`,
 en:`<p>Until now one variable held one value. A slice gave you many values under one name, but with a condition: all of the same type. A thing described by several values of <em>different</em> types — a name as a string, an age as a number — has nothing to hold it. You end up declaring them as separate variables, and the only thing tying them together is that you remember they belong together.</p>
<p>Look at where that leads. Two people already means four variables:</p>
<pre><code>name1 := "Bob"
age1  := 30
name2 := "Ann"
age2  := 25</code></pre>
<p>Ten people means twenty variables with numbers in their names. Slices only half help: <code>names</code> and <code>ages</code> have to stay the same length, with the indices kept in sync. And a function that must hand back one person is forced to return two values — three once a city is added.</p>
<p>A struct lets you declare your own type by listing the fields it is made of. After that a person lives in a single variable:</p>
<pre><code>type Person struct {
	name string
	age  int
}

p := Person{name: "Bob", age: 30}
fmt.Println(p.name, p.age)   <span class="cm">// Bob 30</span></code></pre>
<p>One argument instead of two, one return value, one slice element. Once this topic is yours you can describe your own types, build slices of them, nest them inside each other, hand them to functions — and, above all, write functions that change what they were given. That last part does not happen by itself in Go, and it is what the topic rests on.</p>
<p>The walkthrough goes in this order. First, how to declare a type and reach a field. Then what sits inside a struct created without values. Then the central fact of the topic: a struct is copied — on assignment and when passed to a function. Everything else follows from it. If it is a copy, a function cannot change the original; if it cannot, you need a way to hand it an address instead of a value — and that is where <code>&amp;</code>, <code>*Person</code> and <code>*q</code> come from. Next, what becomes of a pointer that never got an address: the one place in this topic where the program does not refuse to build but dies while running. And at the end that same copying turns up again where you least expect it — in a loop over a slice of structs.</p>`
};

/* ================= ПРАВИЛА ================= */
var RULES = [
{
 h:{ru:"Структура — несколько значений разных типов под одним именем",
    en:"A struct is several values of different types under one name"},
 b:{ru:`<p>Тип структуры ты объявляешь сам, перечисляя, из чего он состоит. После объявления <code>Person</code> — полноценное имя типа, наравне с <code>int</code> и <code>string</code>: его пишут в объявлении переменной, в параметре функции, в типе слайса.</p>
<pre><code>type Person struct {
	name string
	age  int
}

var p Person</code></pre>
<p>Внутри фигурных скобок — поля: имя и тип, по одному на строку. Типы у полей могут быть разные, и это ровно то, чем структура отличается от слайса: в <code>[]int</code> все элементы обязаны быть числами, а в <code>Person</code> рядом лежат строка и число.</p>
<p>До поля добираешься точкой. Одна и та же запись работает и на чтение, и на запись:</p>
<pre><code>p.name = "Bob"
fmt.Println(p.age)</code></pre>
<p>Обращение к полю — обычное выражение своего типа, ничего особенного в нём нет. <code>p.age</code> ведёт себя как любой <code>int</code>: его можно прибавить, сравнить, отдать в функцию. <code>p.name</code> — как любая строка.</p>
<p>Набор полей задан один раз, в объявлении типа, и дописать поле «на ходу» нельзя. Ошибёшься в имени — программа не соберётся, причём компилятор подскажет, что имелось в виду: <code>p.Name undefined (type Person has no field or method Name, but does have field name)</code>. Это удобно: опечатки в полях ловятся до запуска.</p>
<p>Объявление типа пишут вне функций, рядом с <code>package main</code>. Порядок объявлений при этом не важен — <code>Person</code> можно описать и ниже <code>main</code>. Внутри функции тип объявить тоже можно, но тогда он виден только в ней, и почти всегда это не то, что нужно.</p>`,
    en:`<p>You declare a struct type yourself by listing what it is made of. Once declared, <code>Person</code> is a full type name on a par with <code>int</code> and <code>string</code>: it goes in variable declarations, in function parameters, in slice types.</p>
<pre><code>type Person struct {
	name string
	age  int
}

var p Person</code></pre>
<p>Inside the braces are the fields: a name and a type, one per line. The field types may differ, and that is exactly what separates a struct from a slice: in <code>[]int</code> every element must be a number, while <code>Person</code> holds a string and a number side by side.</p>
<p>A dot gets you to a field. The same notation works for reading and for writing:</p>
<pre><code>p.name = "Bob"
fmt.Println(p.age)</code></pre>
<p>Reaching a field gives you an ordinary expression of that field's type, nothing special about it. <code>p.age</code> behaves like any <code>int</code>: you can add to it, compare it, pass it to a function. <code>p.name</code> behaves like any string.</p>
<p>The set of fields is fixed once, in the type declaration, and you cannot bolt a new one on later. Misspell a name and the program won't build — and the compiler tells you what was meant: <code>p.Name undefined (type Person has no field or method Name, but does have field name)</code>. That is convenient: field typos get caught before the program ever runs.</p>
<p>Type declarations go outside functions, next to <code>package main</code>. Their order doesn't matter — <code>Person</code> may sit below <code>main</code>. You can declare a type inside a function too, but then only that function can see it, and that is almost never what you want.</p>`}
},
{
 h:{ru:"Структура без значений уже готова к работе: все поля нулевые",
    en:"A struct with no values is ready to use: every field is zeroed"},
 b:{ru:`<p>Раз тип объявлен, переменную этого типа можно создать, ничего в неё не положив. Что тогда внутри? Не мусор и не пустота: каждое поле получает нулевое значение своего типа.</p>
<pre><code>var p Person
fmt.Println(p)   <span class="cm">// { 0}</span></code></pre>
<p>В скобках два поля: пустая строка и ноль. Пустая строка печатается как ничего — отсюда пробел между скобкой и нулём. Это не опечатка, это первое поле.</p>
<p>Следствие важнее самого факта: у структуры не бывает состояния «не создана». Проверять её перед использованием не надо, читать и писать поля можно сразу после <code>var</code>. Запомни это — через несколько правил появится указатель, и вот у него всё наоборот.</p>
<p>Задать значения при создании можно двумя записями, и есть третий вариант — не задавать вовсе:</p>
<pre><code>var p Person              <span class="cm">// все поля нулевые</span>
a := Person{"Bob", 30}    <span class="cm">// по порядку — перечислять ВСЕ поля</span>
b := Person{name: "Bob"}  <span class="cm">// по именам — остальные нулевые</span></code></pre>
<p>Разница между второй и третьей строкой не в длине записи. Без имён значения привязаны к порядку полей в объявлении типа, и перечислить надо все до одного: <code>Person{"Bob"}</code> не соберётся — <code>too few values in struct literal of type Person</code>. С именами ты называешь только то, что нужно, а пропущенные поля получают нулевое значение, как в первой строке.</p>
<p>Поэтому запись по именам надёжнее, и дело не в длине. Добавишь потом в тип третье поле — <code>Person{name: "Bob"}</code> продолжит собираться, а <code>Person{"Bob", 30}</code> сломается везде, где встречается. Причём сломаться — это ещё удачный исход. Поменяй в типе местами два поля одинакового типа, и запись по порядку соберётся молча, просто значения лягут не туда.</p>`,
    en:`<p>Since the type is declared, you can create a variable of it without putting anything in. What is inside then? Neither garbage nor emptiness: every field gets the zero value of its own type.</p>
<pre><code>var p Person
fmt.Println(p)   <span class="cm">// { 0}</span></code></pre>
<p>Two fields sit in those braces: an empty string and a zero. The empty string prints as nothing — hence the space between the brace and the zero. Not a typo, that space is the first field.</p>
<p>The consequence matters more than the fact: a struct has no "not created yet" state. You don't check it before use, and you can read and write its fields immediately after <code>var</code>. Remember that — a few rules from here a pointer shows up, and with it everything is the other way round.</p>
<p>Values can be given at creation in two forms, and a third option is to give none at all:</p>
<pre><code>var p Person              <span class="cm">// every field zeroed</span>
a := Person{"Bob", 30}    <span class="cm">// positional — ALL fields required</span>
b := Person{name: "Bob"}  <span class="cm">// by name — the rest are zeroed</span></code></pre>
<p>What separates the second line from the third isn't length. Without names the values are tied to the order of the fields in the type declaration, and every one of them must be listed: <code>Person{"Bob"}</code> won't compile — <code>too few values in struct literal of type Person</code>. With names you mention only what you need, and the skipped fields get their zero value, exactly as in the first line.</p>
<p>That is why naming fields is safer, and length has nothing to do with it. Add a third field to the type later and <code>Person{name: "Bob"}</code> keeps compiling, while <code>Person{"Bob", 30}</code> breaks everywhere it appears. And breaking is the lucky outcome. Swap two fields of the same type in the declaration and the positional form still compiles — the values just land in the wrong places, silently.</p>`}
},
{
 h:{ru:"Структура копируется целиком — при присваивании и при передаче в функцию",
    en:"A struct is copied whole — on assignment and when passed to a function"},
 b:{ru:`<p>Итак, структура — обычное значение, как <code>int</code> или <code>string</code>. Отсюда следует главный факт темы: при присваивании она копируется целиком, поле за полем.</p>
<pre><code>p := Person{"Bob", 30}
q := p
q.age = 31
fmt.Println(p.age)   <span class="cm">// 30 — оригинал не тронут</span></code></pre>
<p>После <code>q := p</code> это две независимые переменные. Со слайсом было иначе: там <code>b := a</code> оставляет данные общими, и правка <code>b[0]</code> портит <code>a</code>. У структуры так не бывает — копируются сами поля, а не ссылка на них.</p>
<p>Передача в функцию — то же самое присваивание, просто записанное иначе. Параметр — новая переменная, в неё копируется аргумент:</p>
<pre><code>func setAge(p Person) {
	p.age = 30       <span class="cm">// меняется копия</span>
}

setAge(p)
fmt.Println(p.age)   <span class="cm">// 0</span></code></pre>
<p>Строка <code>p.age = 30</code> честно выполнилась. Тридцать записалось — в переменную, которая живёт только до конца вызова и вместе с ним исчезает. Снаружи остался ноль.</p>
<p>Заметь, чего здесь нет: ошибки. Компилятор доволен — по типам всё верно, менять поля копии никто не запрещает. Программа собирается, запускается, доходит до конца и делает не то. Это главная ловушка темы и прямая причина, по которой дальше идут указатели: без них функция физически не может дотянуться до твоей переменной.</p>
<p>У копирования есть и полезная сторона. Раз структура — значение, её можно сравнивать целиком: <code>a == b</code> сверяет поле за полем и даёт <code>true</code>, только если совпали все. Работает это, пока все поля сравнимы; появится внутри слайс — <code>==</code> перестанет собираться, слайсы так сравнивать нельзя.</p>`,
    en:`<p>So a struct is an ordinary value, like an <code>int</code> or a <code>string</code>. From that follows the central fact of this topic: on assignment it is copied whole, field by field.</p>
<pre><code>p := Person{"Bob", 30}
q := p
q.age = 31
fmt.Println(p.age)   <span class="cm">// 30 — the original is untouched</span></code></pre>
<p>After <code>q := p</code> these are two independent variables. A slice behaved differently: there <code>b := a</code> leaves the data shared, and editing <code>b[0]</code> damages <code>a</code>. That never happens with a struct — the fields themselves are copied, not a reference to them.</p>
<p>Passing to a function is that same assignment, written differently. The parameter is a new variable, and the argument is copied into it:</p>
<pre><code>func setAge(p Person) {
	p.age = 30       <span class="cm">// the copy changes</span>
}

setAge(p)
fmt.Println(p.age)   <span class="cm">// 0</span></code></pre>
<p>The line <code>p.age = 30</code> honestly ran. Thirty was written — into a variable that lives only until the call ends and disappears with it. Outside, the zero is still there.</p>
<p>Notice what is missing here: an error. The compiler is content — the types are right, and nobody forbids changing the fields of a copy. The program builds, runs, reaches the end and does the wrong thing. This is the main pitfall of the topic and the direct reason pointers come next: without them a function physically cannot reach your variable.</p>
<p>Copying has a useful side too. Since a struct is a value, whole structs can be compared: <code>a == b</code> checks field by field and gives <code>true</code> only if all of them match. That works as long as every field is comparable; put a slice inside and <code>==</code> stops compiling, since slices can't be compared that way.</p>`}
},
{
 h:{ru:"<code>&amp;p</code> — адрес, <code>*Person</code> — тип указателя, <code>*q</code> — значение по адресу",
    en:"<code>&amp;p</code> is an address, <code>*Person</code> is a pointer type, <code>*q</code> is the value at that address"},
 b:{ru:`<p>Копия — тупик: чтобы функция изменила твою переменную, ей нужна сама переменная, а не её значение. Отдать переменную нельзя, зато можно отдать её адрес — место в памяти, где она лежит. Значение по адресу одно на всех, кто этот адрес знает.</p>
<pre><code>p := Person{"Bob", 30}
q := &amp;p              <span class="cm">// q типа *Person, внутри адрес p</span>
fmt.Println(*q)      <span class="cm">// {Bob 30} — сама структура</span>
fmt.Println(q.name)  <span class="cm">// Bob</span></code></pre>
<p>Записей три, и путают их постоянно, потому что символов всего два:</p>
<ul>
<li><code>&amp;p</code> — действие: взять адрес существующей переменной. Результат имеет тип <code>*Person</code>.</li>
<li><code>*Person</code> — <b>тип</b>, «указатель на Person». Стоит там, где вообще пишут типы: в <code>var</code>, в параметре, в возвращаемом значении.</li>
<li><code>*q</code> — действие, обратное первому: взять значение по адресу. Результат имеет тип <code>Person</code>.</li>
</ul>
<p>Два смысла звёздочки различают по месту, и правило тут простое. Стоит перед именем типа — часть типа. Стоит перед переменной в выражении — разыменование, «дай то, что лежит по этому адресу».</p>
<p>Со структурой звёздочку в выражениях почти не пишут. Полная запись поля — <code>(*q).name</code>: сначала достать структуру по адресу, потом взять поле. Она встречалась бы в каждой второй строке, поэтому Go подставляет разыменование сам, и <code>q.name</code> значит ровно то же самое.</p>
<p>А вот <code>*q.name</code> — не сокращение, а ошибка, и по виду её не отличишь. Точка сильнее звёздочки, поэтому Go читает запись как <code>*(q.name)</code>: «разыменуй строку». Разыменовать можно только указатель, отсюда <code>invalid operation: cannot indirect q.name (variable of type string)</code>. Нужна явная запись — ставь скобки.</p>`,
    en:`<p>A copy is a dead end: for a function to change your variable it needs the variable itself, not its value. You can't hand over the variable, but you can hand over its address — the place in memory where it sits. The value at an address is one and the same for everyone who knows that address.</p>
<pre><code>p := Person{"Bob", 30}
q := &amp;p              <span class="cm">// q has type *Person and holds p's address</span>
fmt.Println(*q)      <span class="cm">// {Bob 30} — the struct itself</span>
fmt.Println(q.name)  <span class="cm">// Bob</span></code></pre>
<p>There are three notations, and they get mixed up constantly because there are only two symbols:</p>
<ul>
<li><code>&amp;p</code> — an action: take the address of an existing variable. The result has type <code>*Person</code>.</li>
<li><code>*Person</code> — a <b>type</b>, "pointer to Person". It appears where types appear: in <code>var</code>, in a parameter, in a return value.</li>
<li><code>*q</code> — the action that undoes the first: take the value at an address. The result has type <code>Person</code>.</li>
</ul>
<p>The two meanings of the star are told apart by position, and the rule is simple. In front of a type name — part of the type. In front of a variable in an expression — a dereference, "give me what sits at this address".</p>
<p>With a struct you rarely write the star in expressions at all. The full form for a field is <code>(*q).name</code>: first get the struct at the address, then take the field. It would show up on every other line, so Go inserts the dereference for you, and <code>q.name</code> means precisely the same thing.</p>
<p>But <code>*q.name</code> is not a shorthand — it is an error, and it doesn't look like one. The dot binds tighter than the star, so Go reads it as <code>*(q.name)</code>: "dereference a string". Only a pointer can be dereferenced, hence <code>invalid operation: cannot indirect q.name (variable of type string)</code>. If you want the explicit form, use the parentheses.</p>`}
},
{
 h:{ru:"Чтобы функция изменила структуру, ей нужен указатель",
    en:"To let a function change a struct, give it a pointer"},
 b:{ru:`<p>Теперь у тебя есть всё, чтобы починить функцию из третьего правила. Меняется ровно два символа: тип параметра становится указателем, а на вызове перед переменной появляется амперсанд.</p>
<pre><code>func setAge(p *Person) {
	p.age = 30
}

setAge(&amp;p)
fmt.Println(p.age)   <span class="cm">// 30</span></code></pre>
<p>Копирование при этом никуда не делось — Go по-прежнему копирует аргумент, иначе он не умеет. Копируется теперь адрес. Внутри функции лежит не вторая структура, а тот же самый адрес, что и снаружи, и запись через него попадает в оригинал.</p>
<p>Тело функции не изменилось вообще: <code>p.age = 30</code>, как и было. Звёздочку писать не надо — работает то же автоматическое разыменование из прошлого правила.</p>
<p>Забудешь <code>&amp;</code> на вызове — программа не соберётся: <code>cannot use p (variable of struct type Person) as *Person value in argument to setAge</code>. Это удачный исход, ошибку видно сразу. Обратный случай хуже: оставишь параметр <code>p Person</code>, и всё соберётся, отработает и не сделает ничего — ровно как в третьем правиле.</p>
<p>Отсюда правило выбора, которое работает почти всегда: функция только читает поля — бери значение; функция должна изменить структуру — бери указатель. Не бери указатель «на всякий случай». Значение проще: его нельзя испортить из чужого кода, и оно никогда не бывает пустым. Что значит «пустым» — в следующем правиле.</p>`,
    en:`<p>You now have everything needed to fix the function from the third rule. Exactly two characters change: the parameter type becomes a pointer, and an ampersand appears before the variable at the call.</p>
<pre><code>func setAge(p *Person) {
	p.age = 30
}

setAge(&amp;p)
fmt.Println(p.age)   <span class="cm">// 30</span></code></pre>
<p>Copying hasn't gone anywhere — Go still copies the argument, it knows no other way. What gets copied now is the address. Inside the function there is no second struct, just the same address as outside, and a write through it lands on the original.</p>
<p>The body of the function didn't change at all: <code>p.age = 30</code>, just as before. No star required — the same automatic dereference from the previous rule is doing its work.</p>
<p>Forget the <code>&amp;</code> at the call and the program won't build: <code>cannot use p (variable of struct type Person) as *Person value in argument to setAge</code>. That is the lucky outcome, the error is visible at once. The reverse case is worse: leave the parameter as <code>p Person</code> and everything builds, runs and does nothing — exactly as in the third rule.</p>
<p>Hence the rule for choosing, which holds almost always: if the function only reads fields, take a value; if it must change the struct, take a pointer. Don't take a pointer "just in case". A value is simpler: nobody else's code can spoil it, and it is never empty. What "empty" means comes in the next rule.</p>`}
},
{
 h:{ru:"У указателя свой ноль — <code>nil</code>, и обращение к полю роняет программу",
    en:"A pointer has its own zero — <code>nil</code> — and touching a field crashes the program"},
 b:{ru:`<p>У указателя, как у любой переменной, есть нулевое значение. Но если ноль структуры безобиден — поля пустые, работать можно, — то ноль указателя означает «адреса нет». Зовут его <code>nil</code>.</p>
<pre><code>var q *Person
fmt.Println(q == nil)   <span class="cm">// true</span>
fmt.Println(q.name)     <span class="cm">// panic: nil pointer dereference</span></code></pre>
<p>Вот здесь и вылезает разница, обещанная во втором правиле. <code>var p Person</code> даёт готовую к работе структуру. <code>var q *Person</code> даёт переменную, в которой адреса нет, и идти по нему просто некуда.</p>
<p>Обрати внимание, когда именно происходит падение. Компилятор строку <code>q.name</code> пропускает — по типам она безупречна: <code>q</code> имеет тип <code>*Person</code>, у <code>Person</code> есть поле <code>name</code>. Лежит ли внутри адрес, выясняется только во время работы программы, там же и падение: <code>panic: runtime error: invalid memory address or nil pointer dereference</code>. Это единственное место в теме, где ошибка ждёт запуска.</p>
<p>Само значение <code>nil</code> — не поломка, а полезный ответ: «структуры нет». Это не то же самое, что структура с пустыми полями. Функция, возвращающая <code>*Person</code>, может сказать <code>nil</code> вместо «не нашёл», а вот <code>Person{}</code> от настоящего Боба с пустым именем не отличить.</p>
<p>Не падать помогают две вещи. Первая — давать адрес сразу: <code>q := &amp;p</code>, а если отдельная переменная не нужна, то <code>q := &amp;Person{name: "Bob"}</code> — новая структура и указатель на неё одной записью. Вторая — проверять, когда указатель пришёл извне и мог оказаться пустым:</p>
<pre><code>if q != nil {
	fmt.Println(q.name)
}</code></pre>
<p>Печатать сам указатель безопасно и без всякой проверки: <code>fmt.Println(q)</code> для пустого даст <code>&lt;nil&gt;</code>, а для непустого — <code>&amp;{Bob 30}</code>. Амперсанд в выводе — верный признак, что в руках указатель, а не структура.</p>`,
    en:`<p>A pointer, like any variable, has a zero value. But while a struct's zero is harmless — empty fields, still usable — a pointer's zero means "there is no address". Its name is <code>nil</code>.</p>
<pre><code>var q *Person
fmt.Println(q == nil)   <span class="cm">// true</span>
fmt.Println(q.name)     <span class="cm">// panic: nil pointer dereference</span></code></pre>
<p>Here is the difference promised back in the second rule. <code>var p Person</code> gives you a struct that is ready to work. <code>var q *Person</code> gives you a variable with no address in it, and there is simply nowhere to follow.</p>
<p>Note exactly when the crash happens. The compiler waves the line <code>q.name</code> through — type-wise it is flawless: <code>q</code> has type <code>*Person</code> and <code>Person</code> has a field <code>name</code>. Whether an address is actually inside is only settled while the program runs, and that is where it dies: <code>panic: runtime error: invalid memory address or nil pointer dereference</code>. This is the one place in the topic where the error waits for the run.</p>
<p>The <code>nil</code> value itself is not a defect but a useful answer: "there is no struct". That is not the same as a struct with empty fields. A function returning <code>*Person</code> can say <code>nil</code> for "not found", whereas <code>Person{}</code> is indistinguishable from a real Bob with an empty name.</p>
<p>Two things keep you from crashing. First, give the address right away: <code>q := &amp;p</code>, or when no separate variable is needed, <code>q := &amp;Person{name: "Bob"}</code> — a new struct and a pointer to it in one go. Second, check when the pointer came from elsewhere and might be empty:</p>
<pre><code>if q != nil {
	fmt.Println(q.name)
}</code></pre>
<p>Printing the pointer itself is safe without any check: <code>fmt.Println(q)</code> gives <code>&lt;nil&gt;</code> for an empty one and <code>&amp;{Bob 30}</code> for a real one. An ampersand in the output is a reliable sign you are holding a pointer, not a struct.</p>`}
},
{
 h:{ru:"Поле может быть структурой, а в слайсе копирование возвращается",
    en:"A field can be a struct, and in a slice the copying comes back"},
 b:{ru:`<p>Поле структуры может быть любого типа — в том числе другой структурой. Ничего нового учить не надо, точки просто идут цепочкой:</p>
<pre><code>type Address struct {
	city string
}

type Person struct {
	name string
	addr Address
}

p.addr.city = "Astana"</code></pre>
<p>Вложенная структура лежит внутри внешней, а не отдельно от неё, поэтому всё сказанное раньше действует и вглубь. Нулевое значение раскрывается до самого дна: у <code>Address</code> внутри <code>Person</code> тоже все поля нулевые. Копируется <code>Person</code> целиком, вместе с вложенной <code>Address</code>. В выводе вложенная структура получает свои скобки — <code>{Bob {Astana}}</code>, по ним и читай.</p>
<p>Слайс структур — обычный слайс, в нём самом ничего особенного нет. Особенное начинается, когда идёшь по нему циклом:</p>
<pre><code>for _, v := range people {
	v.age = 0            <span class="cm">// v — копия, слайс не изменится</span>
}

for i := range people {
	people[i].age = 0    <span class="cm">// а так изменится</span>
}</code></pre>
<p>Это третье правило, вернувшееся в другом виде. <code>v</code> — обычная переменная, объявленная циклом; на каждом шаге в неё копируется очередной элемент. Меняешь ты копию, и на следующем шаге её затирает следующий элемент. <code>people[i]</code> — не копия, а сам элемент внутри слайса.</p>
<p>Оба цикла собираются, ни один не выдаёт предупреждения, и на глаз они почти одинаковые. Разница только в том, добираешься ты до элемента или до его копии.</p>
<p>По той же причине функция, которая нашла элемент в слайсе и должна отдать его на изменение, возвращает <code>&amp;people[i]</code>, а не <code>people[i]</code>. Второе скопируется при возврате, и правки вызвавшего кода уйдут в копию — то же самое молчаливое «ничего не произошло», с которого тема началась.</p>`,
    en:`<p>A struct field can be of any type — including another struct. There is nothing new to learn; the dots simply chain:</p>
<pre><code>type Address struct {
	city string
}

type Person struct {
	name string
	addr Address
}

p.addr.city = "Astana"</code></pre>
<p>The nested struct sits inside the outer one rather than off to the side, so everything said earlier applies all the way down. The zero value goes to the very bottom: the <code>Address</code> inside <code>Person</code> has its fields zeroed too. A <code>Person</code> is copied whole, nested <code>Address</code> included. When printed, the nested struct gets its own braces — <code>{Bob {Astana}}</code> — and that is how you read the output.</p>
<p>A slice of structs is an ordinary slice; there is nothing special about the slice itself. The special part starts when you walk it with a loop:</p>
<pre><code>for _, v := range people {
	v.age = 0            <span class="cm">// v is a copy, the slice stays the same</span>
}

for i := range people {
	people[i].age = 0    <span class="cm">// this one does change it</span>
}</code></pre>
<p>This is the third rule coming back in a different shape. <code>v</code> is an ordinary variable declared by the loop; on each step the current element is copied into it. You change the copy, and on the next step the next element overwrites it. <code>people[i]</code> is not a copy but the element itself, inside the slice.</p>
<p>Both loops compile, neither produces a warning, and to the eye they are nearly identical. The only difference is whether you reach the element or a copy of it.</p>
<p>For the same reason, a function that has found an element in a slice and must hand it over for modification returns <code>&amp;people[i]</code>, not <code>people[i]</code>. The latter is copied on return, and the caller's edits go into that copy — the same silent "nothing happened" the topic started with.</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ ================= */
var TABLE = {
  title:{ru:"Звёздочка и амперсанд: где что значит", en:"Star and ampersand: what means what"},
  intro:{ru:"Всё для type Person struct { name string; age int } и p := Person{\"Bob\", 30}.",
         en:"All for type Person struct { name string; age int } and p := Person{\"Bob\", 30}."},
  head:{ru:["Запись","Что это","Тип"], en:["Expression","What it is","Type"]},
  rows:[["Person", {ru:"тип структуры", en:"the struct type"}, "—"],
        ["p", {ru:"сама структура, значение", en:"the struct itself, a value"}, "Person"],
        ["&p", {ru:"адрес переменной p", en:"the address of p"}, "*Person"],
        ["var q *Person", {ru:"указатель без адреса", en:"a pointer with no address"}, "*Person = nil"],
        ["q := &p", {ru:"указатель на p", en:"a pointer to p"}, "*Person"],
        ["*q", {ru:"структура по этому адресу", en:"the struct at that address"}, "Person"],
        ["q.age", {ru:"поле оригинала, звёздочка не нужна", en:"the original's field, no star needed"}, "int"],
        ["(*q).age", {ru:"то же самое, полная запись", en:"the same thing, spelled out"}, "int"],
        ["&Person{age: 1}", {ru:"новая структура и сразу адрес", en:"a new struct plus its address at once"}, "*Person"]]
};

/* ================= ГРАБЛИ ================= */
var TRAPS = [
 {ru:"<strong>Функция поменяла поле, а снаружи всё по-старому.</strong> Ошибки нет, программа собирается, поле просто не изменилось. Причина: параметр <code>p Person</code> — копия, функция правит её и выбрасывает. Лечится двумя символами: <code>func setAge(p *Person)</code> и вызов <code>setAge(&amp;p)</code>.",
  en:"<strong>The function changed a field and nothing changed outside.</strong> No error, the program compiles, the field just stayed the same. The reason: the parameter <code>p Person</code> is a copy, the function edits it and throws it away. Two characters fix it: <code>func setAge(p *Person)</code> and the call <code>setAge(&amp;p)</code>."},
 {ru:"<strong><code>for _, v := range people { v.age = 0 }</code> не меняет слайс.</strong> <code>v</code> — отдельная переменная, куда на каждом шаге копируется элемент. Компилятор молчит, а слайс остаётся прежним. Правильно: <code>for i := range people { people[i].age = 0 }</code>.",
  en:"<strong><code>for _, v := range people { v.age = 0 }</code> does not change the slice.</strong> <code>v</code> is a separate variable that receives a copy of the element on each step. The compiler says nothing and the slice stays as it was. The right way: <code>for i := range people { people[i].age = 0 }</code>."},
 {ru:"<strong><code>var q *Person</code> и сразу <code>q.name</code> — падение при запуске.</strong> Указатель объявлен, но адреса ему не дали: внутри <code>nil</code>. Компилятор такое пропускает, программа умирает с <code>invalid memory address or nil pointer dereference</code>. Проверяй <code>if q != nil</code> либо давай адрес сразу: <code>q := &amp;p</code>.",
  en:"<strong><code>var q *Person</code> followed by <code>q.name</code> crashes at run time.</strong> The pointer is declared but never got an address: inside is <code>nil</code>. The compiler lets it through and the program dies with <code>invalid memory address or nil pointer dereference</code>. Check <code>if q != nil</code>, or give it an address right away: <code>q := &amp;p</code>."},
 {ru:"<strong><code>Person{\"Bob\"}</code> при двух полях не соберётся:</strong> <code>too few values in struct literal</code>. Без имён полей перечислять надо все и по порядку. С именами — сколько хочешь: <code>Person{name: \"Bob\"}</code>, остальные станут нулевыми.",
  en:"<strong><code>Person{\"Bob\"}</code> with two fields won't compile:</strong> <code>too few values in struct literal</code>. Without field names you must list them all, in order. With names you list as many as you like: <code>Person{name: \"Bob\"}</code>, the rest are zeroed."},
 {ru:"<strong><code>fmt.Println(q)</code> для указателя печатает <code>&amp;{Bob 30}</code>, а не <code>{Bob 30}</code>.</strong> Амперсанд в выводе — знак, что печатаешь указатель, а не структуру. У <code>*int</code> будет вообще адрес вроде <code>0xc000012345</code>, и он меняется от запуска к запуску.",
  en:"<strong><code>fmt.Println(q)</code> on a pointer prints <code>&amp;{Bob 30}</code>, not <code>{Bob 30}</code>.</strong> An ampersand in the output means you are printing a pointer, not a struct. For <code>*int</code> you get a bare address like <code>0xc000012345</code>, and it differs on every run."},
 {ru:"<strong><code>*q.age</code> — не то, что кажется.</strong> Точка сильнее звёздочки, и Go читает это как <code>*(q.age)</code>, то есть «разыменуй поле age» — ошибка. Для структуры звёздочка вообще не нужна: пиши <code>q.age</code>. Если очень надо явно — <code>(*q).age</code>.",
  en:"<strong><code>*q.age</code> is not what it looks like.</strong> The dot binds tighter than the star, so Go reads it as <code>*(q.age)</code> — “dereference the age field” — which is an error. With a struct you don't need the star at all: write <code>q.age</code>. If you insist on being explicit, write <code>(*q).age</code>."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

type Person struct {
	name string
	age  int
}

func main() {
	var p Person
	fmt.Println(p)
	fmt.Println(p.name == "", p.age)
}`,
 out:"{ 0}\ntrue 0",
 why:{ru:"Структуру создали, но ничего не положили — внутри не мусор, а нулевые значения полей. Пустая строка печатается как ничего, поэтому в выводе пробел между скобкой и нулём.<br><b>Сломай:</b> добавь в тип третье поле <code>ok bool</code> и посмотри, что появится в выводе.",
      en:"The struct exists and nothing was put in it — inside are zero values, not garbage. An empty string prints as nothing, which is why there is a space between the brace and the zero.<br><b>Break it:</b> add a third field <code>ok bool</code> to the type and see what shows up in the output."}
},
{
 chg:{ru:"структуру создали сразу со значениями", en:"the struct is created with values"},
 code:`package main

import "fmt"

type Person struct {
	name string
	age  int
}

func main() {
	p := Person{"Bob", 30}
	fmt.Println(p)
	fmt.Println(p.name == "", p.age)
}`,
 out:"{Bob 30}\nfalse 30",
 why:{ru:"Значения без имён идут строго по порядку полей типа.<br><b>Сломай:</b> убери <code>30</code>, оставь <code>Person{\"Bob\"}</code> — получишь <code>too few values in struct literal</code>.",
      en:"Values without names go strictly in the order the fields are declared.<br><b>Break it:</b> drop the <code>30</code> and leave <code>Person{\"Bob\"}</code> — you get <code>too few values in struct literal</code>."}
},
{
 chg:{ru:"значения задали по именам полей", en:"values are given by field name"},
 code:`package main

import "fmt"

type Person struct {
	name string
	age  int
}

func main() {
	p := Person{name: "Bob"}
	fmt.Println(p)
	fmt.Println(p.name == "", p.age)
}`,
 out:"{Bob 0}\nfalse 0",
 why:{ru:"С именами можно указать не все поля — пропущенные становятся нулевыми. Такая запись переживает добавление нового поля в тип, а запись из примера 2 — нет.",
      en:"With names you may skip fields — the skipped ones become zero. This form survives a new field being added to the type; the form from example 2 does not."}
},
{
 chg:{ru:"поле поменяли после создания", en:"a field is changed after creation"},
 code:`package main

import "fmt"

type Person struct {
	name string
	age  int
}

func main() {
	p := Person{name: "Bob"}
	p.age = 30
	fmt.Println(p)
	fmt.Println(p.name, p.age)
}`,
 out:"{Bob 30}\nBob 30",
 why:{ru:"Точка одинаково работает и на чтение, и на запись. Запомни этот вывод — следующий пример делает ровно то же самое, но результат будет другим.",
      en:"The dot works the same for reading and writing. Remember this output — the next example does exactly the same thing but gives a different result."}
},
{
 chg:{ru:"то же изменение вынесли в функцию", en:"the same change moved into a function"},
 code:`package main

import "fmt"

type Person struct {
	name string
	age  int
}

func setAge(p Person) {
	p.age = 30
}

func main() {
	p := Person{name: "Bob"}
	setAge(p)
	fmt.Println(p)
	fmt.Println(p.name, p.age)
}`,
 out:"{Bob 0}\nBob 0",
 why:{ru:"Ноль вместо тридцати. Строка <code>p.age = 30</code> выполнилась — но у копии, которая живёт только внутри функции. Ни ошибки, ни предупреждения.<br><b>Сломай:</b> добавь <code>fmt.Println(p)</code> последней строкой внутри <code>setAge</code> — там будет 30.",
      en:"Zero instead of thirty. The line <code>p.age = 30</code> did run — on a copy that lives only inside the function. No error, no warning.<br><b>Break it:</b> add <code>fmt.Println(p)</code> as the last line inside <code>setAge</code> — there it shows 30."}
},
{
 chg:{ru:"параметр функции стал указателем", en:"the parameter became a pointer"},
 code:`package main

import "fmt"

type Person struct {
	name string
	age  int
}

func setAge(p *Person) {
	p.age = 30
}

func main() {
	p := Person{name: "Bob"}
	setAge(&p)
	fmt.Println(p)
	fmt.Println(p.name, p.age)
}`,
 out:"{Bob 30}\nBob 30",
 why:{ru:"Отличие от прошлого примера — два символа: <code>*</code> в объявлении и <code>&amp;</code> в вызове. Внутри функции по-прежнему копия, но копия <b>адреса</b>, а адрес ведёт к оригиналу.<br><b>Сломай:</b> убери <code>&amp;</code> в вызове и прочитай ошибку.",
      en:"Two characters separate this from the previous example: <code>*</code> in the declaration and <code>&amp;</code> at the call. Inside the function it is still a copy — a copy of the <b>address</b>, and the address leads to the original.<br><b>Break it:</b> remove the <code>&amp;</code> at the call and read the error."}
},
{
 chg:{ru:"вместо функции — сам указатель", en:"no function this time, the pointer itself"},
 code:`package main

import "fmt"

type Person struct {
	name string
	age  int
}

func main() {
	p := Person{name: "Bob", age: 30}
	q := &p
	fmt.Println(q == &p)
	fmt.Println(*q)
	fmt.Println(q.name, (*q).name)
	q.age = 31
	fmt.Println(p.age)
}`,
 out:"true\n{Bob 30}\nBob Bob\n31",
 why:{ru:"<code>q.name</code> и <code>(*q).name</code> — одна и та же запись, Go подставляет звёздочку сам. Последняя строка — суть указателя: писали в <code>q</code>, изменилось в <code>p</code>.<br><b>Сломай:</b> напечатай <code>q</code> без звёздочки — увидишь <code>&amp;{Bob 30}</code>.",
      en:"<code>q.name</code> and <code>(*q).name</code> are the same thing — Go inserts the star for you. The last line is the whole point of a pointer: the write went to <code>q</code> and <code>p</code> changed.<br><b>Break it:</b> print <code>q</code> without the star — you'll see <code>&amp;{Bob 30}</code>."}
},
{
 chg:{ru:"появился второй указатель, без адреса", en:"a second pointer appeared, with no address"},
 code:`package main

import "fmt"

type Person struct {
	name string
	age  int
}

func main() {
	p := Person{name: "Bob", age: 30}
	q := &p
	var z *Person
	fmt.Println(q == nil, z == nil)
	fmt.Println(*q)
	fmt.Println(q, z)
}`,
 out:"false true\n{Bob 30}\n&{Bob 30} <nil>",
 why:{ru:"<code>z</code> объявлен, но адреса не получил — внутри <code>nil</code>. Печатать его безопасно, а вот <code>z.name</code> уронит программу.<br><b>Сломай обязательно:</b> добавь <code>fmt.Println(z.name)</code> и прочитай текст падения — это <code>panic</code>, а не ошибка сборки.",
      en:"<code>z</code> is declared but never got an address — inside is <code>nil</code>. Printing it is safe; <code>z.name</code> would kill the program.<br><b>Break it, definitely:</b> add <code>fmt.Println(z.name)</code> and read the crash text — it's a <code>panic</code>, not a build error."}
},
{
 chg:{ru:"внутрь структуры вложили другую", en:"another struct went inside"},
 code:`package main

import "fmt"

type Address struct {
	city string
	zip  int
}

type Person struct {
	name string
	age  int
	addr Address
}

func main() {
	var p Person
	fmt.Println(p)
	p.name = "Bob"
	p.addr.city = "Astana"
	fmt.Println(p)
	fmt.Println(p.addr.city, p.addr.zip)
}`,
 out:"{ 0 { 0}}\n{Bob 0 {Astana 0}}\nAstana 0",
 why:{ru:"Вложенная структура печатается своими скобками — по ним и читай вывод. Нулевое значение раскрывается вглубь: у <code>Address</code> тоже все поля нулевые.",
      en:"A nested struct prints with its own braces — read the output by them. The zero value goes all the way down: <code>Address</code> has all its fields zeroed too."}
},
{
 chg:{ru:"структуры сложили в слайс", en:"the structs went into a slice"},
 code:`package main

import "fmt"

type Person struct {
	name string
	age  int
}

func main() {
	people := []Person{{"Bob", 30}, {"Ann", 25}}

	for _, v := range people {
		v.age = 0
	}
	fmt.Println(people)

	for i := range people {
		people[i].age = 0
	}
	fmt.Println(people)
}`,
 out:"[{Bob 30} {Ann 25}]\n[{Bob 0} {Ann 0}]",
 why:{ru:"Два одинаковых на вид цикла, разный результат. В первом <code>v</code> — копия элемента, обнулили её. Во втором <code>people[i]</code> — сам элемент.<br>Внутри <code>[]Person{...}</code> имя типа можно не повторять: <code>{\"Bob\", 30}</code> вместо <code>Person{\"Bob\", 30}</code>.",
      en:"Two loops that look alike, different results. In the first, <code>v</code> is a copy of the element and you zeroed the copy. In the second, <code>people[i]</code> is the element itself.<br>Inside <code>[]Person{...}</code> the type name may be omitted: <code>{\"Bob\", 30}</code> instead of <code>Person{\"Bob\", 30}</code>."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"ZeroStruct", lvl:1, e:"{0 0}\n0 0",
 d:{ru:"Объяви тип <code>Point</code> с двумя полями <code>x</code> и <code>y</code> типа <code>int</code>. Создай переменную, ничего в неё не кладя. Напечатай сначала структуру целиком, потом оба поля в одну строку.",
    en:"Declare a type <code>Point</code> with two <code>int</code> fields, <code>x</code> and <code>y</code>. Create a variable without giving it any values. Print the whole struct first, then both fields on one line."},
 h:{ru:"Объявление типа пишется вне <code>main</code>. Переменная без значений — <code>var p Point</code>.",
    en:"The type declaration goes outside <code>main</code>. A variable with no values is <code>var p Point</code>."}},

{t:"TwoWays", lvl:1, e:"{3 4}\n{0 7}",
 d:{ru:"С тем же типом <code>Point</code> создай две структуры: первую — перечислив значения по порядку (3 и 4), вторую — по имени поля, задав только <code>y</code> = 7. Напечатай обе, каждую на своей строке.",
    en:"With the same <code>Point</code> type create two structs: the first by listing values in order (3 and 4), the second by field name, setting only <code>y</code> = 7. Print both, each on its own line."},
 h:{ru:"По порядку — <code>Point{3, 4}</code>, по имени — <code>Point{y: 7}</code>. Пропущенное поле становится нулевым.",
    en:"Positional is <code>Point{3, 4}</code>, by name is <code>Point{y: 7}</code>. A skipped field becomes zero."}},

{t:"ChangeField", lvl:1, e:"{1 2}\n{10 2}\n12",
 d:{ru:"Создай <code>Point</code> со значениями 1 и 2, напечатай. Поменяй <code>x</code> на 10, напечатай снова. Третьей строкой напечатай сумму полей.",
    en:"Create a <code>Point</code> with values 1 and 2 and print it. Change <code>x</code> to 10 and print again. On the third line print the sum of the fields."},
 h:{ru:"Точка работает и на запись: <code>p.x = 10</code>. Читаются поля так же.",
    en:"The dot also writes: <code>p.x = 10</code>. Fields are read the same way."}},

{t:"TakeAddress", lvl:1, e:"{3 4}\n3\nfalse",
 d:{ru:"Создай <code>Point{3, 4}</code> и возьми на неё указатель. Напечатай: структуру по указателю, поле <code>x</code> через указатель, и результат сравнения указателя с <code>nil</code>.",
    en:"Create <code>Point{3, 4}</code> and take a pointer to it. Print: the struct through the pointer, the field <code>x</code> through the pointer, and the result of comparing the pointer with <code>nil</code>."},
 h:{ru:"Адрес — <code>q := &amp;p</code>. Структура по адресу — <code>*q</code>. Поле — просто <code>q.x</code>, звёздочка не нужна.",
    en:"The address is <code>q := &amp;p</code>. The struct at that address is <code>*q</code>. The field is just <code>q.x</code>, no star needed."}},

{t:"CopyDoesNothing", lvl:2, e:"{1 2}\n{1 2}",
 d:{ru:"Напиши функцию, которая принимает <code>Point</code> по значению и ставит полю <code>x</code> число 99. В <code>main</code> создай <code>Point{1, 2}</code>, напечатай её, вызови функцию, напечатай снова. Обе строки должны совпасть.",
    en:"Write a function that takes a <code>Point</code> by value and sets field <code>x</code> to 99. In <code>main</code> create <code>Point{1, 2}</code>, print it, call the function, print again. Both lines must match."},
 h:{ru:"Ничего специально ломать не надо — так и работает передача по значению. Задача в том, чтобы увидеть это своими глазами.",
    en:"Nothing needs to be broken on purpose — this is simply how passing by value works. The point of the task is to see it yourself."}},

{t:"PointerChanges", lvl:2, e:"{1 2}\n{99 2}",
 d:{ru:"Тот же код, что в прошлой задаче, но функция должна изменить оригинал. Меняй только объявление параметра и вызов.",
    en:"The same code as the previous task, but the function must change the original. Change only the parameter declaration and the call."},
 h:{ru:"Параметр становится <code>p *Point</code>, вызов — <code>setX(&amp;p)</code>. Внутри функции строка не меняется: <code>p.x = 99</code>.",
    en:"The parameter becomes <code>p *Point</code>, the call becomes <code>setX(&amp;p)</code>. The line inside the function stays the same: <code>p.x = 99</code>."}},

{t:"Nested", lvl:2, e:"{{0 0} {0 0}}\n{{0 0} {5 3}}\n15",
 d:{ru:"Объяви тип <code>Rect</code> с двумя полями <code>min</code> и <code>max</code>, оба типа <code>Point</code>. Создай пустой <code>Rect</code>, напечатай. Задай <code>max.x</code> = 5 и <code>max.y</code> = 3, напечатай снова. Третьей строкой напечатай произведение этих двух чисел.",
    en:"Declare a type <code>Rect</code> with two fields <code>min</code> and <code>max</code>, both of type <code>Point</code>. Create an empty <code>Rect</code> and print it. Set <code>max.x</code> = 5 and <code>max.y</code> = 3, print again. On the third line print the product of those two numbers."},
 h:{ru:"Точки идут цепочкой: <code>r.max.x = 5</code>. Тип <code>Point</code> должен быть объявлен выше <code>Rect</code> — впрочем, порядок объявлений типов Go не важен.",
    en:"Dots chain: <code>r.max.x = 5</code>. <code>Point</code> should be declared above <code>Rect</code> — though the order of type declarations does not actually matter in Go."}},

{t:"SliceOfStructs", lvl:3, e:"[{Bob 31} {Ann 26} {Kim 41}]\n98",
 d:{ru:"Создай слайс из трёх <code>Person</code> (поля <code>name</code> и <code>age</code>): Bob 30, Ann 25, Kim 40. Прибавь каждому по году так, чтобы изменения попали в слайс. Напечатай слайс, а второй строкой — сумму всех возрастов.",
    en:"Create a slice of three <code>Person</code> values (fields <code>name</code> and <code>age</code>): Bob 30, Ann 25, Kim 40. Add one year to each so that the change lands in the slice. Print the slice, then the sum of all ages on the second line."},
 h:{ru:"Цикл <code>for _, v := range</code> здесь не подойдёт — <code>v</code> копия. Иди по индексу: <code>for i := range people</code> и <code>people[i].age++</code>. Для суммы копия годится.",
    en:"A <code>for _, v := range</code> loop won't do — <code>v</code> is a copy. Go by index: <code>for i := range people</code> and <code>people[i].age++</code>. For the sum a copy is fine."}},

{t:"SafeAge", lvl:3, e:"30 -1\n31",
 d:{ru:"Напиши функцию, которая принимает <code>*Person</code> и возвращает возраст, а для <code>nil</code> возвращает −1. В <code>main</code> создай <code>Person{\"Bob\", 30}</code>, возьми на неё указатель, объяви второй указатель без адреса. Напечатай результаты функции для обоих в одну строку. Потом через первый указатель прибавь год и напечатай результат функции снова.",
    en:"Write a function that takes a <code>*Person</code> and returns the age, returning −1 for <code>nil</code>. In <code>main</code> create <code>Person{\"Bob\", 30}</code>, take a pointer to it, and declare a second pointer with no address. Print the function's result for both on one line. Then add a year through the first pointer and print the function's result again."},
 h:{ru:"Первая строка функции — <code>if p == nil { return -1 }</code>. Без неё программа упадёт на втором указателе.",
    en:"The first line of the function is <code>if p == nil { return -1 }</code>. Without it the program crashes on the second pointer."}},

{t:"Oldest", lvl:3, e:"Kim 40\n[{Bob 30} {Ann 25} {Kim 41}]",
 d:{ru:"Напиши функцию, которая получает слайс <code>Person</code> и возвращает <b>указатель</b> на самого старшего. В <code>main</code> вызови её для слайса Bob 30, Ann 25, Kim 40, напечатай имя и возраст найденного. Затем через этот указатель прибавь год и напечатай весь слайс — изменение должно быть видно в слайсе.",
    en:"Write a function that takes a slice of <code>Person</code> and returns a <b>pointer</b> to the oldest one. In <code>main</code> call it for the slice Bob 30, Ann 25, Kim 40 and print the name and age of the one found. Then add a year through that pointer and print the whole slice — the change must show up in the slice."},
 h:{ru:"Возвращать надо <code>&amp;people[i]</code>, а не <code>people[i]</code>: второе — копия, и прибавленный год пропадёт. Тип результата функции — <code>*Person</code>. Начальное значение — <code>&amp;people[0]</code>.",
    en:"Return <code>&amp;people[i]</code>, not <code>people[i]</code>: the latter is a copy and the added year would vanish. The function's result type is <code>*Person</code>. Start from <code>&amp;people[0]</code>."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var PANIC = {ru:"соберётся, но упадёт при запуске", en:"compiles, but crashes at run time"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};
var DECL = "type Person struct{ name string; age int }\n";

var BANK = [
{q:Q_OUT, code:DECL+"var p Person\nfmt.Println(p)",
 opts:["{ 0}","{0}","{\"\" 0}","<nil>"], ok:0,
 why:{ru:"Все поля нулевые: строка пустая, число ноль. Пустая строка печатается как ничего — отсюда пробел между скобкой и нулём. У структуры нулевое значение не <code>nil</code>, а она сама с пустыми полями.",
      en:"All fields are zeroed: an empty string and a zero. The empty string prints as nothing, hence the space between brace and zero. A struct's zero value isn't <code>nil</code> — it is the struct itself with empty fields."}},

{q:Q_OUT, code:DECL+"p := Person{name: \"Bob\"}\nfmt.Println(p.age)",
 opts:["0",{ru:"пустая строка",en:"an empty line"},"<nil>",NO], ok:0,
 why:{ru:"При записи по именам пропущенные поля получают нулевое значение своего типа. <code>age</code> — <code>int</code>, значит 0.",
      en:"With named fields the omitted ones get the zero value of their type. <code>age</code> is <code>int</code>, so 0."}},

{q:Q_OUT, code:DECL+"func setAge(p Person) {\n\tp.age = 30\n}\n\np := Person{\"Bob\", 0}\nsetAge(p)\nfmt.Println(p.age)",
 opts:["0","30",NO,PANIC], ok:0,
 why:{ru:"Аргумент скопировался: внутри функции своя переменная <code>p</code>, она и изменилась. Оригинал функция не видела. Ошибки нет — именно поэтому ловушка живучая.",
      en:"The argument was copied: inside the function there is its own <code>p</code>, and that is what changed. The function never saw the original. There is no error — which is why this trap survives so long."}},

{q:Q_OUT, code:DECL+"func setAge(p *Person) {\n\tp.age = 30\n}\n\np := Person{\"Bob\", 0}\nsetAge(&p)\nfmt.Println(p.age)",
 opts:["30","0",NO,PANIC], ok:0,
 why:{ru:"Скопировался адрес, а не структура. Запись через адрес попадает в оригинал. Отличие от прошлого вопроса — два символа: <code>*</code> и <code>&amp;</code>.",
      en:"The address was copied, not the struct. A write through the address lands on the original. Two characters separate this from the previous question: <code>*</code> and <code>&amp;</code>."}},

{q:Q_OUT, code:DECL+"p := Person{\"Bob\", 30}\nq := p\nq.age = 31\nfmt.Println(p.age, q.age)",
 opts:["30 31","31 31","30 30",NO], ok:0,
 why:{ru:"<code>q := p</code> копирует структуру целиком. Это не как со слайсом, где данные остаются общими: у структуры после присваивания две независимые переменные.",
      en:"<code>q := p</code> copies the whole struct. Unlike a slice, where the data stays shared, a struct assignment leaves you with two independent variables."}},

{q:Q_OUT, code:DECL+"p := Person{\"Bob\", 30}\nq := &p\nfmt.Println(q)",
 opts:["&{Bob 30}","{Bob 30}",{ru:"адрес вида 0xc000012345",en:"an address like 0xc000012345"},NO], ok:0,
 why:{ru:"<code>fmt</code> для указателя на структуру печатает содержимое, но с амперсандом впереди. Амперсанд в выводе — знак, что в руках указатель. Чтобы вывести без него: <code>*q</code>.",
      en:"For a pointer to a struct <code>fmt</code> prints the contents with an ampersand in front. An ampersand in the output means you are holding a pointer. To print without it: <code>*q</code>."}},

{q:Q_OUT, code:DECL+"people := []Person{{\"Bob\", 30}}\nfor _, v := range people {\n\tv.age = 0\n}\nfmt.Println(people)",
 opts:["[{Bob 30}]","[{Bob 0}]","[]",NO], ok:0,
 why:{ru:"<code>v</code> — отдельная переменная, куда скопирован элемент. Обнулили копию, слайс не тронут. Компилятор молчит, потому что по типам всё верно.",
      en:"<code>v</code> is a separate variable holding a copy of the element. You zeroed the copy; the slice is untouched. The compiler stays silent because the types are fine."}},

{q:Q_OUT, code:DECL+"people := []Person{{\"Bob\", 30}}\nfor i := range people {\n\tpeople[i].age = 0\n}\nfmt.Println(people)",
 opts:["[{Bob 0}]","[{Bob 30}]","[]",NO], ok:0,
 why:{ru:"<code>people[i]</code> — сам элемент слайса, а не копия. Разница с прошлым вопросом только в том, как добираешься до элемента.",
      en:"<code>people[i]</code> is the slice element itself, not a copy. The only difference from the previous question is how you reach the element."}},

{q:Q_OUT, code:"type Address struct{ city string }\ntype Person struct {\n\tname string\n\taddr Address\n}\n\nvar p Person\nfmt.Println(p)",
 opts:["{ {}}","{ }","{{}}","<nil>"], ok:0,
 why:{ru:"Нулевое значение раскрывается вглубь: у <code>Address</code> тоже все поля нулевые, и она печатается своими скобками. Пустая строка <code>name</code> даёт пробел перед <code>{}</code>.",
      en:"The zero value goes all the way down: <code>Address</code> has its fields zeroed too and prints with its own braces. The empty <code>name</code> leaves a space before <code>{}</code>."}},

{q:Q_OUT, code:DECL+"fmt.Println(Person{\"Bob\", 30} == Person{\"Bob\", 30})",
 opts:["true","false",NO,PANIC], ok:0,
 why:{ru:"Структуры сравниваются поле за полем, если все поля сравнимы. Со слайсом внутри такое сравнение уже не соберётся — слайсы через <code>==</code> сравнивать нельзя.",
      en:"Structs compare field by field as long as every field is comparable. With a slice inside, the comparison stops compiling — slices can't be compared with <code>==</code>."}},

{q:Q_HAP, code:DECL+"p := Person{\"Bob\"}",
 opts:[NO,{ru:"p станет {Bob 0}",en:"p becomes {Bob 0}"},{ru:"p станет {Bob}",en:"p becomes {Bob}"},PANIC], ok:0,
 why:{ru:"Ошибка: <code>too few values in struct literal</code>. Без имён полей перечислять надо все и строго по порядку. С именем поля так можно: <code>Person{name: \"Bob\"}</code>.",
      en:"The error is <code>too few values in struct literal</code>. Without field names you must list them all, strictly in order. With a name it is allowed: <code>Person{name: \"Bob\"}</code>."}},

{q:Q_HAP, code:DECL+"var q *Person\nfmt.Println(q.name)",
 opts:[PANIC,NO,{ru:"напечатает пустую строку",en:"prints an empty line"},{ru:"напечатает <nil>",en:"prints <nil>"}], ok:0,
 why:{ru:"Указатель объявлен, но адреса не получил — внутри <code>nil</code>. По типам всё в порядке, поэтому компилятор пропускает. Падение при запуске: <code>invalid memory address or nil pointer dereference</code>.",
      en:"The pointer is declared but never got an address — inside is <code>nil</code>. The types are fine, so the compiler lets it through. At run time: <code>invalid memory address or nil pointer dereference</code>."}},

{q:{ru:"Что делает <code>&amp;p</code>?", en:"What does <code>&amp;p</code> do?"}, code:null,
 opts:[{ru:"даёт адрес переменной p, тип результата *Person",en:"gives the address of p, result type *Person"},
       {ru:"делает копию p",en:"makes a copy of p"},
       {ru:"объявляет указатель",en:"declares a pointer"},
       {ru:"достаёт значение по адресу",en:"reads the value at an address"}], ok:0,
 why:{ru:"<code>&amp;</code> берёт адрес существующей переменной. Обратное действие — <code>*q</code>: достать значение по адресу. Объявление указателя выглядит иначе: <code>var q *Person</code>.",
      en:"<code>&amp;</code> takes the address of an existing variable. The opposite is <code>*q</code>: read the value at an address. Declaring a pointer looks different: <code>var q *Person</code>."}},

{q:{ru:"Что значит <code>*Person</code> в строке <code>func f(p *Person)</code>?", en:"What does <code>*Person</code> mean in <code>func f(p *Person)</code>?"}, code:null,
 opts:[{ru:"тип параметра: указатель на Person",en:"the parameter type: pointer to Person"},
       {ru:"параметр разыменовывается при вызове",en:"the parameter is dereferenced at the call"},
       {ru:"параметр можно не передавать",en:"the parameter may be omitted"},
       {ru:"функция вернёт Person",en:"the function returns a Person"}], ok:0,
 why:{ru:"В объявлении звёздочка — часть <b>типа</b>. В выражении та же звёздочка значит другое: <code>*q</code> — «значение по адресу». Одинаковый символ, два разных смысла — по этому месту новички путаются чаще всего.",
      en:"In a declaration the star is part of the <b>type</b>. In an expression the same star means something else: <code>*q</code> is “the value at this address”. Same character, two meanings — this is where beginners trip most."}},

{q:{ru:"Чему равно нулевое значение переменной типа <code>*Person</code>?", en:"What is the zero value of a <code>*Person</code> variable?"}, code:null,
 opts:["nil","{ 0}","0",{ru:"случайный адрес",en:"a random address"}], ok:0,
 why:{ru:"У указателя нулевое значение — <code>nil</code>: переменная есть, адреса в ней нет. У самой структуры <code>Person</code> нулевое значение другое — <code>{ 0}</code>. Это разные типы и разные нули.",
      en:"A pointer's zero value is <code>nil</code>: the variable exists, the address does not. The struct <code>Person</code> has a different zero value — <code>{ 0}</code>. Different types, different zeros."}},

{q:{ru:"Почему функция с параметром <code>p Person</code> не может изменить оригинал?", en:"Why can't a function with a <code>p Person</code> parameter change the original?"}, code:null,
 opts:[{ru:"аргумент копируется, функция работает со своей копией",en:"the argument is copied, the function works on its own copy"},
       {ru:"поля структуры доступны только на чтение",en:"struct fields are read-only"},
       {ru:"поля с маленькой буквы менять нельзя",en:"lowercase fields can't be changed"},
       {ru:"нужно вернуть значение из функции",en:"you must return a value from the function"}], ok:0,
 why:{ru:"Копируется значение аргумента. Внутри функции <code>p</code> — новая переменная, никак не связанная с той, что снаружи. Менять поля копии можно сколько угодно — она умрёт вместе с вызовом.",
      en:"The argument's value is copied. Inside the function <code>p</code> is a new variable with no link to the outer one. You can change the copy's fields all you like — it dies with the call."}},

{q:{ru:"Чем <code>q.age</code> отличается от <code>(*q).age</code>, если <code>q</code> — указатель?", en:"How does <code>q.age</code> differ from <code>(*q).age</code> when <code>q</code> is a pointer?"}, code:null,
 opts:[{ru:"ничем, Go сам подставляет разыменование",en:"not at all, Go inserts the dereference for you"},
       {ru:"первое читает копию, второе — оригинал",en:"the first reads a copy, the second the original"},
       {ru:"первое не соберётся",en:"the first won't compile"},
       {ru:"второе не соберётся",en:"the second won't compile"}], ok:0,
 why:{ru:"Это одна и та же запись, короткая и полная. Поэтому со структурами звёздочку в выражениях почти не пишут. А вот <code>*q.age</code> — уже ошибка: точка сильнее звёздочки, и читается это как <code>*(q.age)</code>.",
      en:"They are the same thing, short and long form. That is why the star rarely appears in expressions with structs. But <code>*q.age</code> is an error: the dot binds tighter, so it reads as <code>*(q.age)</code>."}},

{q:{ru:"Какая подпись годится, если функция должна изменить структуру?", en:"Which signature works if the function must change the struct?"}, code:null,
 opts:["func setAge(p *Person)","func setAge(p Person)","func setAge(p &Person)","func setAge(*p Person)"], ok:0,
 why:{ru:"Звёздочка в объявлении параметра — «сюда придёт адрес». Записи <code>&amp;Person</code> и <code>*p Person</code> не существуют: <code>&amp;</code> ставят только перед переменной в выражении, а имя параметра идёт до типа.",
      en:"The star in a parameter declaration means “an address arrives here”. Neither <code>&amp;Person</code> nor <code>*p Person</code> exists: <code>&amp;</code> only goes before a variable in an expression, and the parameter name comes before the type."}},

{q:{ru:"Как обнулить поле <code>age</code> у всех элементов слайса <code>people</code>?", en:"How do you zero the <code>age</code> field of every element of the slice <code>people</code>?"}, code:null,
 opts:[{ru:"for i := range people { people[i].age = 0 }",en:"for i := range people { people[i].age = 0 }"},
       {ru:"for _, v := range people { v.age = 0 }",en:"for _, v := range people { v.age = 0 }"},
       {ru:"for _, v := range people { people.age = 0 }",en:"for _, v := range people { people.age = 0 }"},
       {ru:"people.age = 0",en:"people.age = 0"}], ok:0,
 why:{ru:"Через индекс ты обращаешься к самому элементу. Переменная <code>v</code> из <code>range</code> — копия, изменения в ней никуда не попадут. Второй вариант при этом прекрасно собирается — потому и ловит.",
      en:"By index you reach the element itself. The <code>v</code> variable from <code>range</code> is a copy and changes to it go nowhere. The second option compiles perfectly — that's why it catches people."}},

{q:{ru:"Функция ищет самого старшего в слайсе и должна вернуть его так, чтобы вызывающий мог изменить элемент. Что возвращать?", en:"A function finds the oldest element of a slice and must return it so the caller can modify that element. What should it return?"}, code:null,
 opts:[{ru:"&people[i] — указатель на элемент слайса",en:"&people[i] — a pointer to the slice element"},
       {ru:"people[i] — сам элемент",en:"people[i] — the element itself"},
       {ru:"копию структуры и её индекс",en:"a copy of the struct and its index"},
       {ru:"весь слайс",en:"the whole slice"}], ok:0,
 why:{ru:"<code>people[i]</code> при возврате копируется, и правки уйдут в никуда. <code>&amp;people[i]</code> — адрес элемента внутри слайса, запись через него меняет слайс.",
      en:"Returning <code>people[i]</code> copies it and edits go nowhere. <code>&amp;people[i]</code> is the address of the element inside the slice, and writing through it changes the slice."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Зачем структура, если можно завести отдельные переменные?", en:"Why use a struct instead of separate variables?"},
 a:{ru:`<p>Потому что связанные значения перестают разъезжаться. Имя, возраст и город одного человека — это одно, а не три.</p>
<pre><code><span class="cm">// без структуры</span>
name := "Bob"
age := 30
city := "Astana"

<span class="cm">// со структурой</span>
p := Person{name: "Bob", age: 30, city: "Astana"}</code></pre>
<p>Разница видна, как только людей становится больше одного. Три слайса <code>names</code>, <code>ages</code>, <code>cities</code> надо держать одной длины и следить, чтобы индексы не разошлись. Один слайс <code>[]Person</code> такой проблемы не создаёт.</p>
<p>Второе: структуру можно передать в функцию одним аргументом и вернуть одним значением.</p>`,
    en:`<p>Because related values stop drifting apart. One person's name, age and city are one thing, not three.</p>
<pre><code><span class="cm">// without a struct</span>
name := "Bob"
age := 30
city := "Astana"

<span class="cm">// with a struct</span>
p := Person{name: "Bob", age: 30, city: "Astana"}</code></pre>
<p>The difference shows the moment you have more than one person. Three slices <code>names</code>, <code>ages</code>, <code>cities</code> must stay the same length with indices in sync. One <code>[]Person</code> has no such problem.</p>
<p>Second: a struct goes into a function as one argument and comes back as one value.</p>`}},

{q:{ru:"Что значит «структура копируется»?", en:"What does “a struct is copied” mean?"},
 a:{ru:`<p>При присваивании и при передаче в функцию создаётся новая переменная, и в неё переписываются <b>все поля</b>. Дальше две переменные живут отдельно.</p>
<pre><code>p := Person{"Bob", 30}
q := p
q.age = 31
fmt.Println(p.age, q.age)   <span class="cm">// 30 31</span></code></pre>
<p>Со слайсом было иначе: <code>b := a</code> оставляет данные общими, и правка <code>b[0]</code> портит <code>a</code>. У структуры так не бывает — она копируется целиком.</p>
<p>Отсюда и главная ловушка темы: функция с параметром <code>p Person</code> получает копию, меняет её, и снаружи ничего не происходит. Компилятор не возражает — по типам всё верно.</p>`,
    en:`<p>On assignment and on a function call a new variable is created and <b>every field</b> is written into it. From then on the two variables live apart.</p>
<pre><code>p := Person{"Bob", 30}
q := p
q.age = 31
fmt.Println(p.age, q.age)   <span class="cm">// 30 31</span></code></pre>
<p>A slice behaves differently: <code>b := a</code> keeps the data shared, and editing <code>b[0]</code> damages <code>a</code>. That never happens with a struct — it is copied whole.</p>
<p>Hence the main pitfall of this topic: a function with a <code>p Person</code> parameter gets a copy, edits it, and nothing happens outside. The compiler does not object — the types are correct.</p>`}},

{q:{ru:"Что такое указатель и зачем он нужен?", en:"What is a pointer and what is it for?"},
 a:{ru:`<p>Указатель — переменная, в которой лежит адрес другой переменной. Не значение, а место, где значение находится.</p>
<pre><code>p := Person{"Bob", 30}
q := &amp;p         <span class="cm">// q типа *Person</span>
q.age = 31      <span class="cm">// меняется p</span></code></pre>
<p>Три записи, три роли:</p>
<ul>
<li><code>&amp;p</code> — взять адрес переменной</li>
<li><code>*Person</code> в объявлении — тип «указатель на Person»</li>
<li><code>*q</code> в выражении — достать значение по адресу</li>
</ul>
<p>Нужен он ровно для одного: дать другому куску кода доступ к твоей переменной, а не к её копии. Без указателя функция физически не может изменить то, что ей передали.</p>`,
    en:`<p>A pointer is a variable holding the address of another variable. Not the value, but where the value lives.</p>
<pre><code>p := Person{"Bob", 30}
q := &amp;p         <span class="cm">// q has type *Person</span>
q.age = 31      <span class="cm">// p changes</span></code></pre>
<p>Three notations, three roles:</p>
<ul>
<li><code>&amp;p</code> — take a variable's address</li>
<li><code>*Person</code> in a declaration — the type “pointer to Person”</li>
<li><code>*q</code> in an expression — read the value at that address</li>
</ul>
<p>It exists for exactly one purpose: to give other code access to your variable rather than to a copy of it. Without a pointer a function physically cannot change what it was handed.</p>`}},

{q:{ru:"Почему <code>q.age</code> работает без звёздочки?", en:"Why does <code>q.age</code> work without a star?"},
 a:{ru:`<p>Полная запись — <code>(*q).age</code>: сначала достать структуру по адресу, потом взять поле. Она встречалась бы в каждой второй строке, поэтому Go подставляет разыменование сам. <code>q.age</code> и <code>(*q).age</code> — одно и то же.</p>
<p>Осторожно с похожей записью: <code>*q.age</code> — <b>не</b> сокращение. Точка сильнее звёздочки, Go читает это как <code>*(q.age)</code>, то есть «разыменуй число» — ошибка.</p>
<pre><code>q.age        <span class="cm">// правильно</span>
(*q).age     <span class="cm">// то же самое, длиннее</span>
*q.age       <span class="cm">// ошибка: читается как *(q.age)</span></code></pre>`,
    en:`<p>The full form is <code>(*q).age</code>: first get the struct at the address, then take the field. It would appear on every other line, so Go inserts the dereference for you. <code>q.age</code> and <code>(*q).age</code> are the same.</p>
<p>Careful with the lookalike: <code>*q.age</code> is <b>not</b> a shorthand. The dot binds tighter than the star, so Go reads it as <code>*(q.age)</code> — “dereference a number” — an error.</p>
<pre><code>q.age        <span class="cm">// correct</span>
(*q).age     <span class="cm">// the same, longer</span>
*q.age       <span class="cm">// error: reads as *(q.age)</span></code></pre>`}},

{q:{ru:"Что такое nil-указатель и как не уронить программу?", en:"What is a nil pointer and how do you avoid crashing?"},
 a:{ru:`<p><code>nil</code> — нулевое значение указателя: переменная создана, адреса в ней нет.</p>
<pre><code>var q *Person
fmt.Println(q == nil)   <span class="cm">// true</span>
fmt.Println(q)          <span class="cm">// &lt;nil&gt; — печатать безопасно</span>
fmt.Println(q.name)     <span class="cm">// panic</span></code></pre>
<p>Компилятор такую строку пропускает: по типам <code>q.name</code> безупречно. Падает уже запущенная программа, с текстом <code>invalid memory address or nil pointer dereference</code>.</p>
<p>Два способа не попасть:</p>
<ul>
<li>давать адрес сразу — <code>q := &amp;p</code> или <code>q := &amp;Person{name: "Bob"}</code>;</li>
<li>проверять перед обращением, если указатель пришёл извне: <code>if q == nil { return }</code> первой строкой функции.</li>
</ul>
<p>Само по себе значение <code>nil</code> удобно: оно означает «структуры нет», и это не то же самое, что структура с пустыми полями.</p>`,
    en:`<p><code>nil</code> is a pointer's zero value: the variable exists, the address does not.</p>
<pre><code>var q *Person
fmt.Println(q == nil)   <span class="cm">// true</span>
fmt.Println(q)          <span class="cm">// &lt;nil&gt; — printing is safe</span>
fmt.Println(q.name)     <span class="cm">// panic</span></code></pre>
<p>The compiler lets that line through: type-wise <code>q.name</code> is flawless. The running program is what dies, with <code>invalid memory address or nil pointer dereference</code>.</p>
<p>Two ways to stay safe:</p>
<ul>
<li>give the address immediately — <code>q := &amp;p</code> or <code>q := &amp;Person{name: "Bob"}</code>;</li>
<li>check before use when the pointer came from outside: <code>if q == nil { return }</code> as the function's first line.</li>
</ul>
<p>The <code>nil</code> value itself is useful: it means “there is no struct”, which is not the same as a struct with empty fields.</p>`}},

{q:{ru:"Когда брать указатель, а когда значение?", en:"When do you take a pointer and when a value?"},
 a:{ru:`<p>Простое правило на первое время:</p>
<div class="tablewrap"><table>
<tr><th>Что делает функция</th><th>Параметр</th></tr>
<tr><td>только читает поля</td><td><code>p Person</code></td></tr>
<tr><td>меняет поля</td><td><code>p *Person</code></td></tr>
<tr><td>структура может отсутствовать</td><td><code>p *Person</code> и проверка на <code>nil</code></td></tr>
</table></div>
<p>Есть и второй довод за указатель — размер. Структура из двадцати полей копируется целиком при каждом вызове, указатель — это один адрес. Но пока структуры маленькие, разница незаметна, и решать стоит по первому признаку: нужно менять или нет.</p>
<p>Не бери указатель «на всякий случай». Значение проще: его нельзя случайно испортить из чужого кода и оно никогда не бывает <code>nil</code>.</p>`,
    en:`<p>A simple rule to start with:</p>
<div class="tablewrap"><table>
<tr><th>What the function does</th><th>Parameter</th></tr>
<tr><td>only reads fields</td><td><code>p Person</code></td></tr>
<tr><td>changes fields</td><td><code>p *Person</code></td></tr>
<tr><td>the struct may be absent</td><td><code>p *Person</code> plus a <code>nil</code> check</td></tr>
</table></div>
<p>There is a second argument for pointers — size. A twenty-field struct is copied whole on every call, while a pointer is a single address. But while your structs are small the difference is invisible, so decide by the first criterion: does it need to change anything.</p>
<p>Don't take a pointer “just in case”. A value is simpler: nobody else's code can quietly break it, and it is never <code>nil</code>.</p>`}},

{q:{ru:"Почему цикл <code>range</code> не меняет слайс структур?", en:"Why doesn't a <code>range</code> loop change a slice of structs?"},
 a:{ru:`<p>Потому что <code>v</code> в <code>for _, v := range people</code> — это отдельная переменная. На каждом шаге в неё копируется очередной элемент.</p>
<pre><code>for _, v := range people {
	v.age = 0            <span class="cm">// правится копия</span>
}
fmt.Println(people)      <span class="cm">// без изменений</span>

for i := range people {
	people[i].age = 0    <span class="cm">// правится элемент</span>
}
fmt.Println(people)      <span class="cm">// изменилось</span></code></pre>
<p>Это та же история, что с функцией: копия против оригинала. Только тут копирование прячется в самой конструкции цикла, и заметить его труднее.</p>
<p>Правило: читаешь — <code>range</code> с <code>v</code> удобнее; меняешь — иди по индексу.</p>`,
    en:`<p>Because <code>v</code> in <code>for _, v := range people</code> is a separate variable. On each step the current element is copied into it.</p>
<pre><code>for _, v := range people {
	v.age = 0            <span class="cm">// the copy is edited</span>
}
fmt.Println(people)      <span class="cm">// unchanged</span>

for i := range people {
	people[i].age = 0    <span class="cm">// the element is edited</span>
}
fmt.Println(people)      <span class="cm">// changed</span></code></pre>
<p>Same story as with functions: copy versus original. Here the copying hides inside the loop construct, which makes it harder to spot.</p>
<p>Rule: reading — <code>range</code> with <code>v</code> is nicer; changing — go by index.</p>`}},

{q:{ru:"Как читать вывод структуры в консоли?", en:"How do you read a struct printed in the console?"},
 a:{ru:`<p><code>fmt.Println</code> печатает поля по порядку через пробел, в фигурных скобках. Имён полей нет.</p>
<pre><code>{Bob 30}          <span class="cm">// name=Bob, age=30</span>
{ 0}              <span class="cm">// пустая строка и ноль</span>
{Bob 0 {Astana 0}} <span class="cm">// вложенная структура — свои скобки</span>
&amp;{Bob 30}         <span class="cm">// это указатель, а не структура</span>
[{Bob 30} {Ann 25}] <span class="cm">// слайс структур</span></code></pre>
<p>Пустая строка печатается как ничего — отсюда лишние на вид пробелы в <code>{ 0}</code>.</p>
<p>Когда полей много и порядок помнить неудобно, есть <code>%+v</code>:</p>
<pre><code>fmt.Printf("%+v\\n", p)   <span class="cm">// {name:Bob age:30}</span></code></pre>`,
    en:`<p><code>fmt.Println</code> prints the fields in order, space-separated, inside braces. Field names are not shown.</p>
<pre><code>{Bob 30}          <span class="cm">// name=Bob, age=30</span>
{ 0}              <span class="cm">// an empty string and a zero</span>
{Bob 0 {Astana 0}} <span class="cm">// a nested struct — its own braces</span>
&amp;{Bob 30}         <span class="cm">// this is a pointer, not a struct</span>
[{Bob 30} {Ann 25}] <span class="cm">// a slice of structs</span></code></pre>
<p>An empty string prints as nothing — that is where the odd-looking spaces in <code>{ 0}</code> come from.</p>
<p>When there are many fields and the order is hard to recall, use <code>%+v</code>:</p>
<pre><code>fmt.Printf("%+v\\n", p)   <span class="cm">// {name:Bob age:30}</span></code></pre>`}}
];

/* ================= ТРЕНАЖЁР ================= */
var SCENARIOS = [
{
 name:{ru:"Нулевая структура", en:"A zero struct"},
 params:[{key:"name", label:{ru:"имя", en:"name"}, text:true, max:10, def:"Bob"},
         {key:"age",  label:{ru:"возраст", en:"age"}, min:1, max:99, def:30}],
 code: function(p){
   return ["type Person struct {",
           "\tname string",
           "\tage  int",
           "}",
           "",
           "var p Person",
           "fmt.Println(p)",
           "p.name = \"" + p.name + "\"",
           "p.age = " + p.age,
           "fmt.Println(p)"];
 },
 steps: function(p){
   var nm = String(p.name), age = String(p.age);
   var zero = "{ 0}", named = "{" + nm + " 0}", full = "{" + nm + " " + age + "}";
   var vz = [["p", zero, "Person"], ["p.name", "\"\"", "string"], ["p.age", "0", "int"]];
   var vn = [["p", named, "Person"], ["p.name", "\"" + nm + "\"", "string"], ["p.age", "0", "int"]];
   var vf = [["p", full, "Person"], ["p.name", "\"" + nm + "\"", "string"], ["p.age", age, "int"]];
   var shown = nm === "" ? {ru:"ничего — строка пустая", en:"nothing — the string is empty"}
                         : {ru:nm, en:nm};
   return [
    {line:5, vars:vz, out:"",
     note:{ru:"Переменная создана, значений не задавали. Внутри не мусор и не <code>nil</code>, а нулевые значения каждого поля: пустая строка и ноль.",
           en:"The variable exists, no values were given. Inside is neither garbage nor <code>nil</code>, but the zero value of each field: an empty string and a zero."}},
    {line:6, vars:vz, out:zero + "\n",
     note:{ru:"Печатается <code>" + zero + "</code> — двумя полями сразу. Пустая строка печатается как ничего, поэтому между скобкой и нулём остаётся пробел. Это не опечатка, это первое поле.",
           en:"It prints <code>" + zero + "</code> — both fields at once. The empty string prints as nothing, hence the space between the brace and the zero. Not a typo, that space is the first field."}},
    {line:7, vars:vn, out:zero + "\n",
     note:{ru:"Точка добирается до поля: в <code>name</code> легло " + shown.ru + ". Слева от <code>=</code> — та же запись, что и справа при чтении. Второе поле пока нулевое.",
           en:"The dot reaches the field: <code>name</code> now holds " + shown.en + ". On the left of <code>=</code> it looks exactly like it does when reading. The second field is still zero."}},
    {line:8, vars:vf, out:zero + "\n",
     note:{ru:"Второе поле стало " + age + ". Поля меняются независимо: строка осталась той же, число заменилось.",
           en:"The second field is now " + age + ". Fields change independently: the string stayed as it was, the number was replaced."}},
    {line:9, vars:vf, out:zero + "\n" + full + "\n",
     note:{ru:"Оба поля на месте: <code>" + full + "</code>. Имён полей в выводе нет — читай по порядку объявления: сначала <code>name</code>, потом <code>age</code>.",
           en:"Both fields in place: <code>" + full + "</code>. The output has no field names — read them in declaration order: <code>name</code> first, then <code>age</code>."}}
   ];
 }
},
{
 name:{ru:"Функция получает копию", en:"The function gets a copy"},
 params:[{key:"name", label:{ru:"имя", en:"name"}, text:true, max:10, def:"Bob"},
         {key:"age",  label:{ru:"пишем", en:"writes"}, min:1, max:99, def:30}],
 code: function(p){
   return ["func setAge(p Person) {",
           "\tp.age = " + p.age,
           "}",
           "",
           "func main() {",
           "\tp := Person{name: \"" + p.name + "\"}",
           "\tsetAge(p)",
           "\tfmt.Println(p.age)",
           "}"];
 },
 steps: function(p){
   var nm = String(p.name), age = String(p.age);
   var was = "{" + nm + " 0}", now = "{" + nm + " " + age + "}";
   var title = {ru:"Оригинал и копия", en:"The original and the copy"};
   return [
    {line:5, vars:[["p (main)", was, "Person"]], out:"",
     stack:["main()"],
     cells:["main: " + was], cellsOn:[0], cellsTitle:title,
     note:{ru:"В <code>main</code> появилась структура. <code>age</code> не задавали — там ноль.",
           en:"A struct appeared in <code>main</code>. <code>age</code> was not set, so it is zero."}},
    {line:6, vars:[["p (main)", was, "Person"], ["p (setAge)", was, "Person"]], out:"",
     stack:["main()", "setAge(" + was + ")"],
     cells:["main: " + was, "setAge: " + was], cellsOn:[1], cellsTitle:title,
     note:{ru:"Вызов. Аргумент <b>скопирован</b>: внутри функции своя переменная с тем же именем и теми же значениями. Одинаковые имена сбивают с толку, но это две разные переменные.",
           en:"The call. The argument is <b>copied</b>: the function has its own variable with the same name and the same values. Identical names are confusing, but these are two different variables."}},
    {line:1, vars:[["p (main)", was, "Person"], ["p (setAge)", now, "Person"]], out:"",
     stack:["main()", "setAge(" + was + ")"],
     cells:["main: " + was, "setAge: " + now], cellsOn:[1], cellsTitle:title,
     note:{ru:"Строка выполнилась — но " + age + " записалось в копию. Смотри на первую строку: в <code>main</code> по-прежнему ноль.",
           en:"The line did run — but " + age + " went into the copy. Look at the first row: <code>main</code> still holds zero."}},
    {line:2, vars:[["p (main)", was, "Person"]], out:"",
     stack:["main()"],
     cells:["main: " + was], cellsTitle:title,
     note:{ru:"Функция закончилась, её копия исчезла вместе с изменением. Никакой ошибки при этом не было.",
           en:"The function ended and its copy vanished along with the change. There was no error anywhere."}},
    {line:7, vars:[["p (main)", was, "Person"]], out:"0\n",
     stack:["main()"],
     cells:["main: " + was], cellsOn:[0], cellsTitle:title,
     note:{ru:"Ноль вместо " + age + ". Подвигай регулятор: что бы функция ни писала, здесь всегда ноль. Программа собралась, отработала и сделала не то — компилятор такое не ловит.",
           en:"Zero instead of " + age + ". Move the slider: whatever the function writes, this line always shows zero. The program compiled, ran, and did the wrong thing — the compiler cannot catch this."}}
   ];
 }
},
{
 name:{ru:"Функция получает адрес", en:"The function gets an address"},
 params:[{key:"name", label:{ru:"имя", en:"name"}, text:true, max:10, def:"Bob"},
         {key:"age",  label:{ru:"пишем", en:"writes"}, min:1, max:99, def:30}],
 code: function(p){
   return ["func setAge(p *Person) {",
           "\tp.age = " + p.age,
           "}",
           "",
           "func main() {",
           "\tp := Person{name: \"" + p.name + "\"}",
           "\tsetAge(&p)",
           "\tfmt.Println(p.age)",
           "}"];
 },
 steps: function(p){
   var nm = String(p.name), age = String(p.age);
   var was = "{" + nm + " 0}", now = "{" + nm + " " + age + "}";
   var title = {ru:"Оригинал и указатель на него", en:"The original and a pointer to it"};
   return [
    {line:5, vars:[["p (main)", was, "Person"]], out:"",
     stack:["main()"],
     cells:["main: " + was], cellsOn:[0], cellsTitle:title,
     note:{ru:"Начало то же самое, что в прошлом сценарии. Отличаются только две строки: объявление параметра и вызов.",
           en:"The start is identical to the previous scenario. Only two lines differ: the parameter declaration and the call."}},
    {line:6, vars:[["p (main)", was, "Person"], ["p (setAge)", "&p (main)", "*Person"]], out:"",
     stack:["main()", "setAge(&p)"],
     cells:["main: " + was, "setAge: →main"], cellsOn:[1], cellsTitle:title,
     note:{ru:"Копирование никуда не делось — но скопировался <b>адрес</b>, а не структура. Внутри функции лежит не вторая структура, а дорога к первой.",
           en:"Copying still happens — but it is the <b>address</b> that was copied, not the struct. The function holds a route to the original, not a second struct."}},
    {line:1, vars:[["p (main)", now, "Person"], ["p (setAge)", "&p (main)", "*Person"]], out:"",
     stack:["main()", "setAge(&p)"],
     cells:["main: " + now, "setAge: →main"], cellsOn:[0], cellsTitle:title,
     note:{ru:"Строка кода та же самая, что в прошлом сценарии, а результат другой: " + age + " попало в переменную <code>main</code>. Звёздочку в <code>p.age</code> писать не надо — Go подставляет её сам.",
           en:"The very same line of code as before, different result: " + age + " landed in the variable in <code>main</code>. No star needed in <code>p.age</code> — Go inserts it for you."}},
    {line:2, vars:[["p (main)", now, "Person"]], out:"",
     stack:["main()"],
     cells:["main: " + now], cellsTitle:title,
     note:{ru:"Функция закончилась, адрес исчез. Изменение осталось — оно было сделано в оригинале.",
           en:"The function ended and the address is gone. The change stayed — it was made on the original."}},
    {line:7, vars:[["p (main)", now, "Person"]], out:age + "\n",
     stack:["main()"],
     cells:["main: " + now], cellsOn:[0], cellsTitle:title,
     note:{ru:"Здесь " + age + ", а не ноль: тот же регулятор, что в прошлом сценарии ничего не менял, теперь управляет выводом. Вся разница — <code>*</code> в объявлении параметра и <code>&amp;</code> в вызове.",
           en:"Here it is " + age + ", not zero: the same slider that changed nothing in the previous scenario now drives the output. The entire difference is <code>*</code> in the parameter and <code>&amp;</code> at the call."}}
   ];
 }
},
{
 name:{ru:"Слайс: range против индекса", en:"Slice: range vs index"},
 params:[{key:"n", label:{ru:"людей", en:"people"}, min:2, max:5, def:2}],
 code: function(p){
   var POOL = [["Bob", 30], ["Ann", 25], ["Kim", 40], ["Lee", 22], ["Max", 35]];
   var lit = [], i;
   for(i = 0; i < p.n; i++) lit.push("{\"" + POOL[i][0] + "\", " + POOL[i][1] + "}");
   return ["people := []Person{" + lit.join(", ") + "}",
           "for _, v := range people {",
           "\tv.age = 0",
           "}",
           "fmt.Println(people)",
           "for i := range people {",
           "\tpeople[i].age = 0",
           "}",
           "fmt.Println(people)"];
 },
 steps: function(p){
   var POOL = [["Bob", 30], ["Ann", 25], ["Kim", 40], ["Lee", 22], ["Max", 35]];
   var n = +p.n, people = [], steps = [], out = "", i;
   for(i = 0; i < n; i++) people.push([POOL[i][0], POOL[i][1]]);
   function one(k){ return "{" + people[k][0] + " " + people[k][1] + "}"; }
   function all(){ var r = [], k; for(k = 0; k < n; k++) r.push(one(k)); return "[" + r.join(" ") + "]"; }
   function cells(){ var r = [], k; for(k = 0; k < n; k++) r.push(one(k)); return r; }
   function every(){ var r = [], k; for(k = 0; k < n; k++) r.push(k); return r; }
   function accRu(k){ return k < 5 ? "элемента" : "элементов"; }  /* «все 4 элемента» / «все 5 элементов» */
   function nEn(k){ return k === 1 ? "element" : "elements"; }
   var title = {ru:"Слайс people", en:"Slice people"};
   var startLine = all();

   steps.push({line:0, vars:[["people", all(), "[]Person"]], out:out,
     cells:cells(), cellsTitle:title,
     note:{ru:"Слайс из " + n + " элементов. Внутри <code>[]Person{...}</code> имя типа можно не повторять.",
           en:"A slice of " + n + " " + nEn(n) + ". Inside <code>[]Person{...}</code> the type name may be omitted."}});

   for(i = 0; i < n; i++){
     steps.push({line:1, vars:[["people", all(), "[]Person"], ["v", one(i), "Person"]], out:out,
       cells:cells(), cellsOn:[i], cellsTitle:title,
       note: i === 0
         ? {ru:"Первый шаг цикла. <code>v</code> — <b>отдельная переменная</b>, в неё скопирован элемент 0.",
            en:"First step of the loop. <code>v</code> is a <b>separate variable</b> holding a copy of element 0."}
         : {ru:"Шаг " + (i + 1) + ": в <code>v</code> легла копия элемента " + i + ", прошлое значение затёрто.",
            en:"Step " + (i + 1) + ": <code>v</code> received a copy of element " + i + ", overwriting the old value."}});
     steps.push({line:2, vars:[["people", all(), "[]Person"], ["v", "{" + people[i][0] + " 0}", "Person"]], out:out,
       cells:cells(), cellsOn:[i], cellsTitle:title,
       note: i === 0
         ? {ru:"Обнулили копию. Слайс — первая строка — не изменился.",
            en:"The copy was zeroed. The slice — the first row — did not change."}
         : {ru:"И снова обнулена копия, а элемент " + i + " в слайсе как был.",
            en:"Again the copy was zeroed, while element " + i + " in the slice is untouched."}});
   }

   out += all() + "\n";
   steps.push({line:4, vars:[["people", all(), "[]Person"]], out:out,
     cells:cells(), cellsOn:every(), cellsTitle:title,
     note:{ru:"Цикл прошёл все " + n + " " + accRu(n) + " и слайс остался как был. Ни ошибки, ни предупреждения.",
           en:"The loop went through all " + n + " " + nEn(n) + " and the slice is as it was. No error, no warning."}});

   for(i = 0; i < n; i++){
     steps.push({line:5, vars:[["people", all(), "[]Person"], ["i", String(i), "int"]], out:out,
       cells:cells(), cellsOn:[i], cellsTitle:title,
       note: i === 0
         ? {ru:"Второй цикл берёт только номер. Копии элемента здесь нет.",
            en:"The second loop takes only the index. There is no copy of the element here."}
         : {ru:"Следующий номер: <code>i</code> = " + i + ".",
            en:"Next index: <code>i</code> = " + i + "."}});
     people[i][1] = 0;
     steps.push({line:6, vars:[["people", all(), "[]Person"], ["i", String(i), "int"]], out:out,
       cells:cells(), cellsOn:[i], cellsTitle:title,
       note: i === 0
         ? {ru:"<code>people[i]</code> — сам элемент слайса. Слайс изменился прямо сейчас.",
            en:"<code>people[i]</code> is the slice element itself. The slice changed right now."}
         : {ru:"Обнулён элемент " + i + " — тот, чей номер лежит в <code>i</code>. Остальные ждут своей очереди.",
            en:"Element " + i + " is zeroed — the one whose index sits in <code>i</code>. The rest wait their turn."}});
   }

   out += all() + "\n";
   steps.push({line:8, vars:[["people", all(), "[]Person"]], out:out,
     cells:cells(), cellsOn:every(), cellsTitle:title,
     note:{ru:"Два почти одинаковых цикла, разный результат: было <code>" + startLine + "</code>, стало <code>" + all() + "</code>. Отличие — обращаешься ты к копии или к элементу.",
           en:"Two nearly identical loops, different results: it was <code>" + startLine + "</code> and became <code>" + all() + "</code>. The difference is whether you touch a copy or the element."}});

   return steps;
 }
},
{
 name:{ru:"Указатель без адреса", en:"A pointer with no address"},
 params:[{key:"name", label:{ru:"имя", en:"name"}, text:true, max:10, def:"Bob"},
         {key:"age",  label:{ru:"возраст", en:"age"}, min:1, max:99, def:30}],
 code: function(p){
   return ["var q *Person",
           "fmt.Println(q == nil)",
           "p := Person{name: \"" + p.name + "\"}",
           "q = &p",
           "fmt.Println(q == nil)",
           "q.age = " + p.age,
           "fmt.Println(p)"];
 },
 steps: function(p){
   var nm = String(p.name), age = String(p.age);
   var was = "{" + nm + " 0}", now = "{" + nm + " " + age + "}";
   return [
    {line:0, vars:[["q", "nil", "*Person"]], out:"",
     note:{ru:"Указатель объявлен, адреса ему не дали. Нулевое значение указателя — <code>nil</code>. Написать сейчас <code>q.name</code> — уронить программу.",
           en:"The pointer is declared and never got an address. A pointer's zero value is <code>nil</code>. Writing <code>q.name</code> now would kill the program."}},
    {line:1, vars:[["q", "nil", "*Person"]], out:"true\n",
     note:{ru:"Сравнить с <code>nil</code> безопасно. Печатать сам указатель тоже можно — выйдет <code>&lt;nil&gt;</code>. Опасно только обращение к полю.",
           en:"Comparing with <code>nil</code> is safe. Printing the pointer itself is fine too — you get <code>&lt;nil&gt;</code>. Only touching a field is dangerous."}},
    {line:2, vars:[["q", "nil", "*Person"], ["p", was, "Person"]], out:"true\n",
     note:{ru:"Появилась настоящая структура <code>" + was + "</code>. Указатель на неё пока не смотрит.",
           en:"A real struct <code>" + was + "</code> appeared. The pointer does not point at it yet."}},
    {line:3, vars:[["q", "&p", "*Person"], ["p", was, "Person"]], out:"true\n",
     note:{ru:"Теперь у указателя есть адрес. Обрати внимание: здесь <code>=</code>, а не <code>:=</code> — переменная <code>q</code> уже существует.",
           en:"Now the pointer has an address. Note the <code>=</code>, not <code>:=</code> — the variable <code>q</code> already exists."}},
    {line:4, vars:[["q", "&p", "*Person"], ["p", was, "Person"]], out:"true\nfalse\n",
     note:{ru:"Больше не <code>nil</code>. С этого момента обращаться к полям безопасно.",
           en:"No longer <code>nil</code>. From this point on, touching fields is safe."}},
    {line:5, vars:[["q", "&p", "*Person"], ["p", now, "Person"]], out:"true\nfalse\n",
     note:{ru:"Писали в <code>q</code>, изменилось <code>p</code>: поле <code>age</code> стало " + age + ". Это и есть весь смысл указателя.",
           en:"The write went to <code>q</code> and <code>p</code> changed: the <code>age</code> field became " + age + ". That is the entire point of a pointer."}},
    {line:6, vars:[["q", "&p", "*Person"], ["p", now, "Person"]], out:"true\nfalse\n" + now + "\n",
     note:{ru:"Печатаем оригинал — <code>" + now + "</code>. Если напечатать <code>q</code>, будет <code>&amp;" + now + "</code>: амперсанд выдаёт указатель.",
           en:"Printing the original — <code>" + now + "</code>. Printing <code>q</code> would give <code>&amp;" + now + "</code>: the ampersand gives away a pointer."}}
   ];
 }
}
];

var OUTRO = {
 ru:`<p>Все семь правил держатся на одной вещи: структура — это значение. Не ссылка, а набор полей прямо внутри переменной. Остальное выводится отсюда. Нулевое значение есть всегда — поля существуют с момента объявления. Присваивание копирует — скопировать поля это единственное, что можно сделать со значением. <code>==</code> сравнивает поле за полем по той же причине. И функция не меняет оригинал не потому, что ей запретили, а потому, что оригинала у неё нет: ей отдали копию полей.</p>
<p>Указатель — ответ ровно на эту одну проблему. Он не «улучшенная структура», а другой тип: внутри лежит адрес, а не поля. Отсюда и всё его поведение: свой ноль <code>nil</code>, которого у структуры не бывает, и свой способ падения — единственный в теме, который ждёт запуска. Три записи переводят одно в другое: <code>&amp;</code> делает из значения адрес, <code>*</code> в выражении возвращает адрес обратно в значение, <code>*</code> в типе сообщает, что здесь хранится адрес.</p>
<p>Что ты теперь умеешь: описывать свои типы, создавать их тремя записями и знать, что окажется внутри, складывать в слайсы и вкладывать друг в друга, передавать в функции — и заранее сказать, увидит вызвавший код изменения или нет. Плюс читать вывод: <code>{Bob 30}</code>, <code>&amp;{Bob 30}</code> и <code>&lt;nil&gt;</code> — три разные вещи.</p>
<p>Если забудется всё, пусть останется одна мысль: <strong>в Go передаётся копия — всегда; вопрос только в том, копия чего</strong>. Копия структуры для изменений бесполезна, копия адреса ведёт к оригиналу. Поэтому, когда поле поменялось внутри и не поменялось снаружи, ищи не ошибку — её там нет, — а место, где сделали копию: параметр функции, присваивание или <code>v</code> в цикле <code>range</code>.</p>`,
 en:`<p>All seven rules rest on one thing: a struct is a value. Not a reference, but a set of fields right inside the variable. The rest follows from that. A zero value always exists — the fields are there from the moment of declaration. Assignment copies — copying the fields is the only thing you can do with a value. <code>==</code> compares field by field for the same reason. And a function doesn't change the original not because it is forbidden to, but because it has no original: it was handed a copy of the fields.</p>
<p>A pointer is the answer to that one problem. It is not an improved struct but a different type: an address inside, not fields. All of its behaviour comes from that: its own zero, <code>nil</code>, which a struct never has, and its own way of failing — the only one in this topic that waits for the run. Three notations convert one into the other: <code>&amp;</code> turns a value into an address, <code>*</code> in an expression turns the address back into a value, <code>*</code> in a type says that an address is stored here.</p>
<p>What you can do now: describe your own types, create them in three forms and know what ends up inside, put them in slices and nest them in each other, pass them to functions — and say in advance whether the calling code will see the changes. Plus read the output: <code>{Bob 30}</code>, <code>&amp;{Bob 30}</code> and <code>&lt;nil&gt;</code> are three different things.</p>
<p>If everything else fades, let one thought remain: <strong>Go always passes a copy; the only question is a copy of what</strong>. A copy of a struct is useless for changing anything, a copy of an address leads to the original. So when a field changed inside and didn't change outside, don't look for a mistake — there isn't one — look for the place where the copy was made: a function parameter, an assignment, or the <code>v</code> in a <code>range</code> loop.</p>`
};
