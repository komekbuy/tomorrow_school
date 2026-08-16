var META = {
  n: 9,
  slug: "09-args-files",
  eyebrow:{ru:"Go с нуля · тема 9 из 13", en:"Go from zero · topic 9 of 13"},
  title:  {ru:"Аргументы и файлы", en:"Arguments and files"},
  lede:{
    ru:"Пока программа не умеет брать данные снаружи, она печатает только то, что в неё вписали руками. Аргументы, файлы и <code>stdin</code> — три способа это изменить.",
    en:"Until a program can take data from outside, it prints only what you typed into it. Arguments, files and <code>stdin</code> are the three ways to change that."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=41489s",
    t:{ru:"Курс по Go — глава «Пользовательский ввод» (11:31:29)", en:"Go course — the “User input” chapter (11:31:29)"},
    d:{ru:"Про то, как программа получает данные снаружи.", en:"How a program takes data from the outside."}},
  folder: "args1",
  txt: {ru:"go-tema-09-argumenty-i-fayly.txt", en:"go-topic-09-arguments-and-files.txt"}
};

var INTRO = {
 ru:`<p>Всё, что программа умела до сих пор, она умела с данными, которые вписаны в её текст руками. Число, строка, список — всё это ты набирал прямо в файле с программой. Пока задача маленькая, это незаметно. Проблема вылезает в тот момент, когда те же вычисления нужно повторить на других данных.</p>
<pre><code>package main

import "fmt"

func main() {
	n := 21
	fmt.Println(n * 2)   <span class="cm">// 42. И завтра 42, и всегда 42</span>
}</code></pre>
<p>Чтобы получить <code>100</code>, надо открыть файл, стереть <code>21</code>, написать <code>50</code>, сохранить, запустить заново. Программа не считает удвоение — она печатает один заранее известный ответ. Такую программу нельзя ни передать другому человеку, ни запустить сто раз подряд на ста разных числах, ни соединить с другой программой. Данные и код склеены в одно.</p>
<p>Эта тема их разъединяет. Данные попадают внутрь тремя путями: их дописывают в командную строку при запуске (<code>os.Args</code>), их берут из файла на диске (<code>os.ReadFile</code>), их получают потоком от другой команды (<code>os.Stdin</code>). Освоив тему, ты сможешь написать программу, которой имя файла и числа передают снаружи; читать и записывать файлы; ставить программы в цепочку через <code>|</code>; и сообщать о неудаче так, чтобы это заметил и человек, и запустившая тебя программа.</p>
<p>У всех трёх путей общего больше, чем различий, и разбор построен на этом. Данные снаружи приходят текстом или байтами — числами они не приходят никогда. Данных может не оказаться вовсе, их может быть не столько, сколько ты ждал, и в них может лежать не то, что ты ждал. Поэтому каждый источник обрабатывается по одному и тому же кругу: <b>получил → проверил, что оно есть → превратил в нужный тип → только теперь пользуешься</b>.</p>
<p>Первые три правила проходят этот круг на аргументах: где они лежат, почему сначала считают количество и только потом берут по индексу, почему <code>10</code> из командной строки — это не число. Четвёртое правило вытаскивает наружу то, что появилось в третьем: ошибку, которая приходит вторым значением из вызова. Дальше та же схема ложится на файлы, потом на вывод — куда отдавать результат и куда жалобы, — и последним на поток <code>stdin</code>, где данных заранее нет и читать приходится по строчке.</p>`,
 en:`<p>Everything a program could do so far, it did with data typed into its own text by hand. A number, a string, a list — you wrote all of it right there in the file. While the task is small this goes unnoticed. The problem shows up the moment the same computation has to run on different data.</p>
<pre><code>package main

import "fmt"

func main() {
	n := 21
	fmt.Println(n * 2)   <span class="cm">// 42. And tomorrow 42, and always 42</span>
}</code></pre>
<p>To get <code>100</code> you have to open the file, erase <code>21</code>, write <code>50</code>, save, run again. This program does not double anything — it prints one answer that was decided in advance. You cannot hand it to another person, run it a hundred times over a hundred numbers, or connect it to another program. Data and code are glued together.</p>
<p>This topic pulls them apart. Data gets in by three routes: typed on the command line at startup (<code>os.Args</code>), taken from a file on disk (<code>os.ReadFile</code>), received as a stream from another command (<code>os.Stdin</code>). Once this topic is yours you can write a program that is handed a file name and numbers from outside; read and write files; chain programs together with <code>|</code>; and report a failure so that both a person and the program that started you will notice.</p>
<p>The three routes have more in common than not, and the walkthrough is built on that. Data from outside arrives as text or as bytes — never as numbers. It may not arrive at all, there may be more or less of it than you expected, and what is inside may not be what you expected. So every source goes through the same loop: <b>receive it → check that it is there → convert it to the type you need → only now use it</b>.</p>
<p>The first three rules walk that loop on arguments: where they sit, why you count them before indexing, why <code>10</code> from the command line is not a number. The fourth rule lifts out what appeared in the third — the error that comes back as a second value from a call. Then the same shape is laid over files, then over output — where results go and where complaints go — and last over the <code>stdin</code> stream, where there is no data up front and reading happens line by line.</p>`
};

/* ================= СЕМЬ ПРАВИЛ ================= */
var RULES = [
{
 h:{ru:"Аргументы запуска лежат в <code>os.Args</code> — обычном слайсе строк",
    en:"Startup arguments live in <code>os.Args</code> — an ordinary slice of strings"},
 b:{ru:`<p>Начинаем с самого короткого пути внутрь: дописать данные в командную строку после имени программы. Всё, что там написано, Go складывает в одну переменную — <code>os.Args</code> из пакета <code>os</code>.</p>
<p>Ничего нового в ней нет, и это главное, что про неё надо понять. <code>os.Args</code> — это <code>[]string</code>, обычный слайс строк, такой же, как любой другой: работают <code>len</code>, индекс, <code>range</code>, срез. Отдельного «типа аргументов» в языке не существует, поэтому всё, что ты уже знаешь про слайсы, применимо здесь без единой поправки.</p>
<p>Запуск <code>go run . 10 20</code> даёт вот что:</p>
<pre><code>os.Args        <span class="cm">// [/tmp/.../exe/prog 10 20]</span>
len(os.Args)   <span class="cm">// 3, а не 2</span>
os.Args[0]     <span class="cm">// путь к собранной программе</span>
os.Args[1]     <span class="cm">// "10" — первый настоящий аргумент</span>
os.Args[1:]    <span class="cm">// [10 20] — все настоящие аргументы</span></code></pre>
<p>Смотри на длину: три, хотя передал ты два. Нулевой элемент кладёшь не ты — его кладёт операционная система в момент запуска, и это путь к собранному файлу программы. Твои аргументы становятся в очередь после него, поэтому первый настоящий — под индексом 1, а не 0.</p>
<p>Держать этот сдвиг в голове при каждом обращении неудобно и легко сбиться. Проще один раз отрезать чужой элемент и дальше работать с обычным списком, где индексы совпадают с тем, что ты набрал:</p>
<pre><code>args := os.Args[1:]
fmt.Println(len(args))   <span class="cm">// 2 — столько ты и передал</span></code></pre>
<p>Если этого не сделать, ошибки будут тихие. Цикл <code>for _, a := range os.Args</code> напечатает лишнюю строку с путём к программе, а проверка <code>len(os.Args) == 0</code> не сработает никогда: длина не бывает меньше единицы.</p>
<p>Для <code>os.Args</code> нужен импорт <code>"os"</code>. Дальше он понадобится почти в каждом примере темы: <code>os.ReadFile</code>, <code>os.Stderr</code>, <code>os.Exit</code>, <code>os.Stdin</code> — всё оттуда же.</p>`,
    en:`<p>We start with the shortest route in: type the data on the command line after the program name. Everything written there Go collects into a single variable — <code>os.Args</code> from the <code>os</code> package.</p>
<p>There is nothing new about it, and that is the main thing to understand. <code>os.Args</code> is a <code>[]string</code>, an ordinary slice of strings like any other: <code>len</code>, indexing, <code>range</code> and slicing all work. The language has no separate "argument type", so everything you already know about slices applies here without a single amendment.</p>
<p>Running <code>go run . 10 20</code> gives this:</p>
<pre><code>os.Args        <span class="cm">// [/tmp/.../exe/prog 10 20]</span>
len(os.Args)   <span class="cm">// 3, not 2</span>
os.Args[0]     <span class="cm">// path to the built program</span>
os.Args[1]     <span class="cm">// "10" — the first real argument</span>
os.Args[1:]    <span class="cm">// [10 20] — all real arguments</span></code></pre>
<p>Look at the length: three, though you passed two. Element zero is not yours — the operating system puts it there at startup, and it is the path to the built program file. Your arguments queue up behind it, so the first real one sits at index 1, not 0.</p>
<p>Carrying that offset in your head at every access is awkward and easy to get wrong. It is simpler to cut the foreign element off once and work with an ordinary list afterwards, where the indices match what you actually typed:</p>
<pre><code>args := os.Args[1:]
fmt.Println(len(args))   <span class="cm">// 2 — exactly what you passed</span></code></pre>
<p>Skip that and the mistakes stay quiet. A loop <code>for _, a := range os.Args</code> prints an extra line holding the program path, and a check for <code>len(os.Args) == 0</code> never fires: the length is never below one.</p>
<p><code>os.Args</code> needs the <code>"os"</code> import. You will need it in nearly every example of this topic: <code>os.ReadFile</code>, <code>os.Stderr</code>, <code>os.Exit</code>, <code>os.Stdin</code> all come from the same place.</p>`}
},
{
 h:{ru:"Сначала <code>len</code>, потом индекс",
    en:"Check <code>len</code> first, index second"},
 b:{ru:`<p>Раз <code>os.Args</code> — обычный слайс, у него и обычная беда слайсов: обращение к индексу, которого нет, обрывает программу. Только здесь эта беда опаснее, чем где-либо ещё, потому что длину задаёшь не ты. Её задаёт тот, кто набирает команду запуска. Он может забыть аргумент, может передать три там, где ты ждал один, — код должен пережить оба случая.</p>
<pre><code>name := os.Args[1]
<span class="cm">// panic: runtime error: index out of range [1] with length 1</span></code></pre>
<p>Компилятор такое пропускает молча, и это не его недосмотр. По типам всё безупречно: <code>os.Args</code> — слайс строк, взяли из него строку, положили в строковую переменную. А сколько элементов окажется в слайсе, до запуска не знает никто — это выяснится только в тот момент, когда программу запустят. Поэтому проблема вылезает не при сборке, а при работе: <b>panic</b> и мгновенная остановка.</p>
<p>Отсюда порядок, который дальше в теме уже не меняется: сначала выясняем, сколько данных пришло, и только потом берём по индексу.</p>
<pre><code>if len(os.Args) &lt; 2 {
	fmt.Fprintln(os.Stderr, "нужен аргумент")
	os.Exit(1)
}
name := os.Args[1]   <span class="cm">// сюда доходим, только если аргумент есть</span></code></pre>
<p>Число в проверке считается вместе с нулевым элементом: один аргумент — это <code>len(os.Args) &lt; 2</code>, два — <code>&lt; 3</code>. Сбиться на единицу тут легче лёгкого, поэтому надёжнее сразу взять срез из первого правила и забыть про сдвиг совсем:</p>
<pre><code>args := os.Args[1:]
if len(args) == 0 {
	<span class="cm">// аргументов не передали</span>
}</code></pre>
<p>Что будет, если проверку не писать. Программа соберётся. Ты запустишь её с аргументом, она отработает правильно, и ты решишь, что всё в порядке. Упадёт она в тот единственный запуск, где аргумент не передали, — и упадёт целиком, не напечатав ничего полезного.</p>
<p>Строки <code>fmt.Fprintln(os.Stderr, ...)</code> и <code>os.Exit(1)</code> будут встречаться в каждом следующем правиле. Разбирать их будем в шестом; пока достаточно знать, что первая печатает жалобу, а вторая заканчивает программу с признаком неудачи.</p>`,
    en:`<p>Since <code>os.Args</code> is an ordinary slice, it has the ordinary slice trouble: reaching for an index that is not there stops the program dead. Except here that trouble is more dangerous than anywhere else, because you are not the one setting the length. Whoever types the run command sets it. They may forget an argument, or pass three where you expected one — the code has to survive both.</p>
<pre><code>name := os.Args[1]
<span class="cm">// panic: runtime error: index out of range [1] with length 1</span></code></pre>
<p>The compiler lets this through in silence, and that is not an oversight on its part. Type-wise the line is flawless: <code>os.Args</code> is a slice of strings, a string was taken out of it and put into a string variable. How many elements the slice will actually hold, nobody knows before the program starts — that is settled at the moment it is run. So the problem surfaces not at build time but at run time: a <b>panic</b> and an instant stop.</p>
<p>Hence the order that stays fixed for the rest of the topic: first find out how much data arrived, only then index into it.</p>
<pre><code>if len(os.Args) &lt; 2 {
	fmt.Fprintln(os.Stderr, "an argument is required")
	os.Exit(1)
}
name := os.Args[1]   <span class="cm">// we only get here if the argument exists</span></code></pre>
<p>The number in the check counts element zero too: one argument means <code>len(os.Args) &lt; 2</code>, two means <code>&lt; 3</code>. Being off by one here is the easiest mistake in the topic, so it is safer to take the slice from the first rule and drop the offset entirely:</p>
<pre><code>args := os.Args[1:]
if len(args) == 0 {
	<span class="cm">// no arguments were passed</span>
}</code></pre>
<p>Here is what happens without the check. The program compiles. You run it with an argument, it works correctly, and you conclude everything is fine. It dies on the one run where no argument was given — and it dies whole, printing nothing useful.</p>
<p>The lines <code>fmt.Fprintln(os.Stderr, ...)</code> and <code>os.Exit(1)</code> will appear in every rule from here on. They get their own treatment in rule six; for now it is enough that the first prints a complaint and the second ends the program marked as failed.</p>`}
},
{
 h:{ru:"Аргумент — всегда строка, даже когда выглядит числом",
    en:"An argument is always a string, even when it looks like a number"},
 b:{ru:`<p>Длину проверили, элемент точно есть. Следующий вопрос — что именно в нём лежит. Ответ уже записан в типе: <code>[]string</code>, слайс <b>строк</b>. Не «слайс чего придётся», а строк и только строк. Значит, <code>go run . 10</code> кладёт в <code>os.Args[1]</code> строку <code>"10"</code> — два символа, а не число десять.</p>
<p>Иначе и быть не может. Командная строка передаёт текст, и что <code>10</code> задумано числом, а <code>note.txt</code> — именем файла, программе взяться неоткуда: оба пришли одинаково. Разделять их приходится тебе, в коде.</p>
<pre><code>os.Args[1] + 1
<span class="cm">// invalid operation: mismatched types string and untyped int</span></code></pre>
<p>Число получают разбором строки — этим занимается <code>strconv.Atoi</code>:</p>
<pre><code>n, err := strconv.Atoi(os.Args[1])</code></pre>
<p>Здесь появляется то, чего в теме ещё не было: вызов вернул <b>два</b> значения — число и ошибку. Причина простая: разбор может не удаться. В строке снаружи бывает что угодно, и функция обязана как-то сообщить, что текст ей не подошёл. Она сообщает вторым значением:</p>
<pre><code>strconv.Atoi("42")    <span class="cm">// 42, nil</span>
strconv.Atoi("42x")   <span class="cm">// 0, strconv.Atoi: parsing "42x": invalid syntax</span>
strconv.Atoi("3.5")   <span class="cm">// 0, ошибка — Atoi разбирает только целые</span>
strconv.Atoi(" 7")    <span class="cm">// 0, ошибка — пробел тоже не цифра</span></code></pre>
<p>Смотри на первый столбец. Когда разбор не удался, число не мусорное, а ноль — обычный, ничем не отмеченный ноль. Сам по себе он выглядит безобидно, и в этом вся опасность: если во второе значение не заглянуть, программа спокойно посчитает <code>0 * 2</code>, напечатает <code>0</code> и ни на что не пожалуется. Ответ будет неверным и уверенным.</p>
<p>И худшее: часть таких ошибок компилятор не ловит вообще. <code>os.Args[1] * 2</code> не соберётся — умножать строку нельзя. А <code>os.Args[1] + os.Args[2]</code> соберётся, потому что у строк <code>+</code> — это склейка: передал <code>10</code> и <code>20</code>, получил <code>"1020"</code>. Программа работает, ошибок нет, результат неправильный.</p>
<p>Нужен импорт <code>"strconv"</code>. А второе значение, которое вернул <code>Atoi</code>, — это уже следующее правило: оно устроено одинаково почти во всём, что ты вызовешь дальше.</p>`,
    en:`<p>The length is checked, the element is definitely there. The next question is what exactly is inside it. The answer is already written in the type: <code>[]string</code>, a slice of <b>strings</b>. Not "a slice of whatever" — strings and nothing else. So <code>go run . 10</code> puts the string <code>"10"</code> into <code>os.Args[1]</code>: two characters, not the number ten.</p>
<p>It could not work any other way. The command line carries text, and the program has no way to know that <code>10</code> was meant as a number while <code>note.txt</code> was meant as a file name: both arrived the same way. Telling them apart is your job, in code.</p>
<pre><code>os.Args[1] + 1
<span class="cm">// invalid operation: mismatched types string and untyped int</span></code></pre>
<p>A number comes from parsing the string, and that is what <code>strconv.Atoi</code> is for:</p>
<pre><code>n, err := strconv.Atoi(os.Args[1])</code></pre>
<p>Something new shows up here: the call returned <b>two</b> values — a number and an error. The reason is simple: parsing can fail. A string from outside may hold anything, and the function has to be able to say that the text did not fit. It says so through the second value:</p>
<pre><code>strconv.Atoi("42")    <span class="cm">// 42, nil</span>
strconv.Atoi("42x")   <span class="cm">// 0, strconv.Atoi: parsing "42x": invalid syntax</span>
strconv.Atoi("3.5")   <span class="cm">// 0, an error — Atoi parses whole numbers only</span>
strconv.Atoi(" 7")    <span class="cm">// 0, an error — a space is not a digit either</span></code></pre>
<p>Look at the first column. When parsing fails the number is not garbage but zero — a plain, unmarked zero. On its own it looks harmless, and that is exactly the danger: skip the second value and the program happily computes <code>0 * 2</code>, prints <code>0</code> and complains about nothing. The answer is wrong and confident.</p>
<p>And the worst part: some of these mistakes the compiler does not catch at all. <code>os.Args[1] * 2</code> will not compile — a string cannot be multiplied. But <code>os.Args[1] + os.Args[2]</code> compiles fine, because <code>+</code> on strings means concatenation: pass <code>10</code> and <code>20</code> and you get <code>"1020"</code>. The program runs, there is no error, the result is wrong.</p>
<p>Needs the <code>"strconv"</code> import. And that second value <code>Atoi</code> returned is the next rule: it is shaped the same way in almost everything you will call from here on.</p>`}
},
{
 h:{ru:"Ошибка — это второе возвращаемое значение, и проверяют её сразу",
    en:"An error is just the second return value, and you check it immediately"},
 b:{ru:`<p><code>Atoi</code> вернул ошибку вторым значением не потому, что он какой-то особенный. Так устроено всё, что может не получиться: разбор строки, чтение файла, запись файла. В Go нет отдельного механизма, который сам оборвёт программу при неудаче, — ошибка возвращается как обычное значение, рядом с результатом, и её приходится брать в руки.</p>
<p>Сделано так по конкретной причине. Функция знает, <b>что</b> пошло не так, но не знает, <b>что с этим делать</b>. Одной программе на нечисловой строке надо остановиться. Другой — подставить значение по умолчанию. Третьей — пропустить эту строку и считать дальше по остальным. Решение зависит от задачи, а задачу знает только вызывающий код. Поэтому ошибку отдают ему.</p>
<pre><code>n, err := strconv.Atoi(s)
if err != nil {
	fmt.Fprintln(os.Stderr, "не число:", s)
	os.Exit(1)
}
<span class="cm">// сюда доходим, только если разбор удался</span>
fmt.Println(n * 2)</code></pre>
<p>Из этого следуют три вещи, и все три работают до конца темы.</p>
<ul>
<li><code>if err != nil</code> пишут <b>сразу после вызова</b>, а не в конце функции. Между вызовом и проверкой не должно стоять ни одной строки, которая пользуется результатом: он ещё не подтверждён.</li>
<li>При ошибке первое значение — нулевое: <code>0</code> у <code>Atoi</code>, пустой слайс у <code>os.ReadFile</code>, пустая строка у многих других. Это не данные, а заглушка. Беда в том, что считать по ней можно — <code>0 * 2</code> вычисляется прекрасно.</li>
<li><code>err</code> печатается напрямую. <code>fmt.Println(err)</code> даёт текст вроде <code>open note.txt: no such file or directory</code> — с именем файла и причиной. Когда непонятно, что случилось, это первое, что стоит сделать: чаще всего ответ уже там.</li>
</ul>
<p>Ошибку можно и выбросить — на её месте пишут подчёркивание:</p>
<pre><code>data, _ := os.ReadFile(p)</code></pre>
<p>Это соберётся и запустится. При отсутствующем файле <code>data</code> окажется пустым, программа напечатает пустоту — ровно то же самое, что она напечатала бы для пустого файла. Никакой разницы между «файла нет» и «файл пуст» ты не увидишь и пойдёшь искать ошибку в той части кода, где её нет. Подчёркивание уместно там, где значение действительно не нужно; для <code>err</code> это почти всегда не тот случай.</p>`,
    en:`<p><code>Atoi</code> returned the error as a second value not because it is special. Everything that can fail is built this way: parsing a string, reading a file, writing a file. Go has no separate machinery that halts the program on failure — the error comes back as an ordinary value, right next to the result, and you have to pick it up yourself.</p>
<p>There is a concrete reason for that. The function knows <b>what</b> went wrong, but not <b>what to do about it</b>. One program must stop on a non-numeric line. Another should fall back to a default. A third should skip that line and keep counting the rest. The decision depends on the task, and only the calling code knows the task. So the error is handed to the caller.</p>
<pre><code>n, err := strconv.Atoi(s)
if err != nil {
	fmt.Fprintln(os.Stderr, "not a number:", s)
	os.Exit(1)
}
<span class="cm">// we only get here if parsing succeeded</span>
fmt.Println(n * 2)</code></pre>
<p>Three things follow, and all three hold for the rest of the topic.</p>
<ul>
<li><code>if err != nil</code> goes <b>right after the call</b>, not at the end of the function. Not a single line that uses the result may stand between the call and the check: the result is not confirmed yet.</li>
<li>On an error the first value is the zero value: <code>0</code> for <code>Atoi</code>, an empty slice for <code>os.ReadFile</code>, an empty string for plenty of others. It is not data, it is a placeholder. The trouble is that you can compute with it — <code>0 * 2</code> works perfectly well.</li>
<li><code>err</code> prints directly. <code>fmt.Println(err)</code> gives text like <code>open note.txt: no such file or directory</code> — the file name and the reason. When something is unclear, that is the first thing to do: usually the answer is already in there.</li>
</ul>
<p>You can also throw the error away by writing an underscore in its place:</p>
<pre><code>data, _ := os.ReadFile(p)</code></pre>
<p>This compiles and runs. With the file missing, <code>data</code> comes back empty and the program prints nothing — exactly what it would print for an empty file. You get no way to tell "the file is not there" from "the file is empty", and you go hunting for the bug in the part of the code where it isn't. An underscore belongs where a value truly is not needed; for <code>err</code> that is almost never the case.</p>`}
},
{
 h:{ru:"<code>os.ReadFile</code> отдаёт байты и ошибку",
    en:"<code>os.ReadFile</code> returns bytes and an error"},
 b:{ru:`<p>Аргументом удобно передавать короткое: число, имя, режим работы. Целый текст так не передашь — для этого есть файл. Читается он одним вызовом, и форма записи уже знакомая: два значения, проверка сразу после.</p>
<pre><code>data, err := os.ReadFile("note.txt")   <span class="cm">// data — []byte, err — error</span>
if err != nil {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(1)
}
fmt.Print(string(data))</code></pre>
<p>Новое здесь — тип первого значения. Возвращается <b>не строка</b>, а <code>[]byte</code>: слайс байтов, то есть слайс чисел. Так сделано потому, что файл и есть последовательность байтов, и текстом он является далеко не всегда — картинку или архив превращать в строку незачем. Go отдаёт то, что на самом деле лежит на диске, а решение считать это текстом оставляет тебе.</p>
<pre><code>fmt.Println(data)           <span class="cm">// [111 110 101 10 ...]</span>
fmt.Print(string(data))     <span class="cm">// one</span></code></pre>
<p>Из «это байты» следуют две вещи, на которых спотыкаются чаще всего. Первая: <code>len(data)</code> — количество <b>байтов</b>, а не строк и не слов. Переводы строк — тоже байты, поэтому у файла из <code>one\\ntwo\\n</code> длина 8, а не 6 и не 2. Количество строк из длины не получить, его считают отдельно.</p>
<p>Вторая: печатают через <code>Print</code>, а не <code>Println</code>. Перевод строки в конце файла обычно уже есть, и <code>Println</code> добавит второй — на экране появится лишняя пустая строка.</p>
<p>Обратная операция — запись. Она возвращает только ошибку, потому что возвращать ей больше нечего: результата у записи нет, есть только вопрос, получилось или нет.</p>
<pre><code>err := os.WriteFile("out.txt", []byte("текст\\n"), 0644)</code></pre>
<p>Обрати внимание на второй аргумент: <code>WriteFile</code> принимает <code>[]byte</code> — ровно то, что вернул <code>ReadFile</code>. Значит, чтобы скопировать файл, переводить содержимое в строку и обратно не надо вообще, оно передаётся как есть. Число <code>0644</code> — права доступа для нового файла; пока просто пиши его так.</p>`,
    en:`<p>An argument is good for something short: a number, a name, a mode. A whole text does not fit there — that is what a file is for. It is read in a single call, and the shape is already familiar: two values, a check right after.</p>
<pre><code>data, err := os.ReadFile("note.txt")   <span class="cm">// data is []byte, err is error</span>
if err != nil {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(1)
}
fmt.Print(string(data))</code></pre>
<p>What is new is the type of the first value. What comes back is <b>not a string</b> but a <code>[]byte</code>: a slice of bytes, that is, a slice of numbers. It works this way because a file <em>is</em> a sequence of bytes, and it is not always text — there is no point turning an image or an archive into a string. Go hands you what is really on disk and leaves the decision to treat it as text to you.</p>
<pre><code>fmt.Println(data)           <span class="cm">// [111 110 101 10 ...]</span>
fmt.Print(string(data))     <span class="cm">// one</span></code></pre>
<p>Two consequences of "these are bytes" trip people up most often. First: <code>len(data)</code> is a count of <b>bytes</b>, not of lines and not of words. Newlines are bytes too, so a file holding <code>one\\ntwo\\n</code> has length 8, not 6 and not 2. The number of lines does not follow from the length — you count it separately.</p>
<p>Second: you print with <code>Print</code>, not <code>Println</code>. A file usually already ends with a newline, and <code>Println</code> adds a second one, leaving a blank line on screen.</p>
<p>The reverse operation is writing. It returns only an error, because there is nothing else to return: writing has no result, only the question of whether it worked.</p>
<pre><code>err := os.WriteFile("out.txt", []byte("text\\n"), 0644)</code></pre>
<p>Look at the second argument: <code>WriteFile</code> takes a <code>[]byte</code> — exactly what <code>ReadFile</code> returned. So copying a file needs no conversion to a string and back at all; the content passes through as is. The <code>0644</code> is the access mode for the new file; for now just write it that way.</p>`}
},
{
 h:{ru:"Два потока вывода и код возврата",
    en:"Two output streams and an exit code"},
 b:{ru:`<p>Данные теперь есть откуда взять — и есть чему не получиться: аргумента может не быть, файла может не быть, строка может оказаться не числом. В каждом правиле выше на такой случай стояли две одинаковые строки: <code>fmt.Fprintln(os.Stderr, ...)</code> и <code>os.Exit(1)</code>. Разбираем, что они делают.</p>
<p>У программы не один выход для текста, а два. <b>Stdout</b> — то, ради чего её запускали, результат работы. <b>Stderr</b> — всё, что объясняет, почему результата нет или почему он такой.</p>
<pre><code>fmt.Println("результат")                <span class="cm">// stdout</span>
fmt.Fprintln(os.Stdout, "результат")    <span class="cm">// то же самое, длиннее</span>
fmt.Fprintln(os.Stderr, "файл не найден")</code></pre>
<p>На экране оба потока выглядят одинаково, поэтому разница кажется выдуманной. Видна она в тот момент, когда вывод куда-то направляют:</p>
<pre><code>go run . &gt; out.txt   <span class="cm">// в файл уйдёт только stdout,</span>
                     <span class="cm">// сообщение об ошибке останется на экране</span></code></pre>
<p>Напечатаешь жалобу обычным <code>fmt.Println</code> — она уедет в файл вместе с данными. На экране будет пусто, в <code>out.txt</code> посреди результата окажется русский текст про ненайденный файл, и тот, кто потом станет читать этот файл, получит испорченные данные. Отсюда правило: результат — в stdout, всё остальное — в stderr.</p>
<p>Сообщение читает человек. Но программу часто запускает другая программа, а она текста не разбирает — ей нужно число. Это <b>код возврата</b>, и ставит его <code>os.Exit</code>:</p>
<pre><code>os.Exit(0)   <span class="cm">// всё прошло хорошо (так же заканчивается main сам по себе)</span>
os.Exit(1)   <span class="cm">// завершилась с ошибкой</span></code></pre>
<p>Потому эти две строки и ходят парой: сообщение в stderr — человеку, ненулевой код — тому, кто запустил. Напечатать жалобу и закончиться нулём — значит соврать: снаружи такой запуск выглядит как успешный.</p>
<p>Две особенности <code>os.Exit</code>. Он обрывает программу немедленно: строки ниже не выполнятся, и <code>defer</code> не сработает — отложенные вызовы пропускаются молча. И при <code>go run</code> ненулевой код виден как строка <code>exit status 1</code>: её печатает не твоя программа, а сам <code>go</code>, увидев код возврата. Внутри <code>main</code> для обычного выхода хватает <code>return</code>; <code>os.Exit(1)</code> нужен там, где о неудаче надо сообщить наружу.</p>`,
    en:`<p>There is now somewhere to get data from — and plenty that can go wrong: the argument may be missing, the file may be missing, the string may not be a number. In every rule above, two identical lines stood there for such cases: <code>fmt.Fprintln(os.Stderr, ...)</code> and <code>os.Exit(1)</code>. Time to see what they do.</p>
<p>A program has not one text output but two. <b>Stdout</b> is what it was run for, the result of the work. <b>Stderr</b> is everything explaining why there is no result, or why it looks the way it does.</p>
<pre><code>fmt.Println("result")                <span class="cm">// stdout</span>
fmt.Fprintln(os.Stdout, "result")    <span class="cm">// the same, just longer</span>
fmt.Fprintln(os.Stderr, "file not found")</code></pre>
<p>On screen the two streams look identical, which makes the distinction feel invented. It becomes visible the moment the output is sent somewhere:</p>
<pre><code>go run . &gt; out.txt   <span class="cm">// only stdout goes into the file,</span>
                     <span class="cm">// the error message stays on screen</span></code></pre>
<p>Print a complaint with a plain <code>fmt.Println</code> and it travels into the file along with the data. The screen stays empty, <code>out.txt</code> ends up with a line about a missing file sitting in the middle of the results, and whoever reads that file later gets corrupted data. Hence the rule: results to stdout, everything else to stderr.</p>
<p>A message is read by a person. But a program is often started by another program, and that one does not read text — it needs a number. That number is the <b>exit code</b>, and <code>os.Exit</code> sets it:</p>
<pre><code>os.Exit(0)   <span class="cm">// everything went fine (main ends this way on its own)</span>
os.Exit(1)   <span class="cm">// finished with an error</span></code></pre>
<p>That is why the two lines travel together: the stderr message for a person, the non-zero code for whoever started the program. Printing a complaint and then finishing with zero is a lie — from the outside such a run looks successful.</p>
<p>Two things about <code>os.Exit</code>. It ends the program instantly: the lines below never run, and <code>defer</code> never fires — deferred calls are skipped silently. And under <code>go run</code> a non-zero code shows up as the line <code>exit status 1</code>: that is printed not by your program but by <code>go</code> itself, having seen the exit code. Inside <code>main</code> a plain <code>return</code> is enough for a normal exit; <code>os.Exit(1)</code> is for when the failure must be reported to the outside.</p>`}
},
{
 h:{ru:"Stdin приходит потоком — его читают построчно сканером",
    en:"Stdin arrives as a stream and is read line by line with a scanner"},
 b:{ru:`<p>Остался третий источник, и он отличается от двух первых. Аргументы известны целиком в момент запуска. Файл лежит на диске целиком, его длину можно узнать. А есть данные, которых заранее нет: они идут потоком и кончаются тогда, когда кончаются. Отдаёт их другая команда через <code>|</code>, или файл через <code>&lt;</code>, или ты сам с клавиатуры — всё это приходит в один вход, <code>os.Stdin</code>.</p>
<p>Прочитать поток одним вызовом, как файл, нельзя: неизвестно, сколько его будет. Поэтому читают по кусочку, а кусок здесь — строка.</p>
<pre><code>sc := bufio.NewScanner(os.Stdin)
for sc.Scan() {
	fmt.Println(sc.Text())
}</code></pre>
<p>Работу делают два вызова, и обязанности у них разные:</p>
<ul>
<li><code>sc.Scan()</code> читает очередную строку и возвращает <code>true</code>. Когда читать больше нечего — закрылся конвейер, кончился файл, нажали Ctrl+D — он возвращает <code>false</code>, и цикл останавливается сам. Ни счётчика, ни <code>break</code> писать не надо: условием цикла служит сам факт «удалось прочитать ещё одну».</li>
<li><code>sc.Text()</code> отдаёт прочитанную строку — <b>без перевода строки</b> на конце: он служил разделителем и в текст не попал.</li>
</ul>
<p>Строка хранится ровно до следующего <code>Scan</code>: он подменит её новой, и предыдущая пропадёт. Нужна старая — сохраняй её в свою переменную сам.</p>
<p>И то же самое, что с аргументами: <code>sc.Text()</code> возвращает <code>string</code>. Пришли числа — их снова разбирает <code>strconv.Atoi</code>, снова с проверкой ошибки сразу после вызова. Источник другой, круг тот же.</p>
<pre><code>printf 'one\\ntwo\\n' | go run .    <span class="cm">// данные из другой команды</span>
go run . &lt; note.txt               <span class="cm">// данные из файла</span>
go run .                          <span class="cm">// печатаешь сам, конец ввода — Ctrl+D</span></code></pre>
<p>Нужен импорт <code>"bufio"</code>. И одна вещь, которая в первый раз пугает: запустишь <code>go run .</code> без входных данных — программа будет молчать и выглядеть зависшей. Она не зависла, она ждёт ввода: <code>Scan</code> не может ни прочитать строку, ни сказать «данные кончились», пока ему ничего не дали. Ctrl+D сообщает, что данных больше не будет, <code>Scan</code> возвращает <code>false</code>, и программа спокойно доходит до конца.</p>`,
    en:`<p>One source is left, and it differs from the first two. Arguments are known in full at startup. A file sits on disk in full, and its length can be measured. But some data does not exist in advance: it flows in and ends when it ends. It comes from another command through <code>|</code>, or from a file through <code>&lt;</code>, or from your own keyboard — all of it arrives at one input, <code>os.Stdin</code>.</p>
<p>A stream cannot be read in a single call the way a file is: there is no telling how much of it there will be. So it is read piece by piece, and the piece here is a line.</p>
<pre><code>sc := bufio.NewScanner(os.Stdin)
for sc.Scan() {
	fmt.Println(sc.Text())
}</code></pre>
<p>Two calls do the work, and they have separate jobs:</p>
<ul>
<li><code>sc.Scan()</code> reads the next line and returns <code>true</code>. When there is nothing left to read — the pipe closed, the file ended, Ctrl+D was pressed — it returns <code>false</code> and the loop stops on its own. No counter and no <code>break</code> are needed: the loop condition is the very fact that one more line was read.</li>
<li><code>sc.Text()</code> gives you that line — <b>without the trailing newline</b>: it acted as a separator and never became part of the text.</li>
</ul>
<p>The line is kept only until the next <code>Scan</code>, which replaces it with a new one and loses the old. If you need the previous line, store it in a variable of your own.</p>
<p>And the same story as with arguments: <code>sc.Text()</code> returns a <code>string</code>. If numbers arrived, <code>strconv.Atoi</code> parses them again, with the error checked right after the call again. Different source, same loop.</p>
<pre><code>printf 'one\\ntwo\\n' | go run .    <span class="cm">// data from another command</span>
go run . &lt; note.txt               <span class="cm">// data from a file</span>
go run .                          <span class="cm">// you type it; end input with Ctrl+D</span></code></pre>
<p>Needs the <code>"bufio"</code> import. And one thing that is alarming the first time: start <code>go run .</code> with no input and the program sits silent, looking frozen. It is not frozen, it is waiting: <code>Scan</code> can neither read a line nor declare the input finished until something is given to it. Ctrl+D says there will be no more data, <code>Scan</code> returns <code>false</code>, and the program calmly reaches its end.</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ + ГРАБЛИ ================= */
var TABLE = {
  title:{ru:"Что возвращают вызовы темы", en:"What the calls of this topic return"},
  intro:{ru:"Половина ошибок в этой теме — от неверного представления о том, сколько значений и какого типа приходит из вызова.", en:"Half the bugs here come from a wrong idea of how many values a call returns and of what type."},
  head:{ru:["Вызов","Что возвращает","Что проверить"], en:["Call","Returns","What to check"]},
  rows:[
    ["os.Args", "[]string", "len(os.Args)"],
    ["os.Args[1:]", "[]string", "len(args) == 0"],
    ["strconv.Atoi(s)", "int, error", "err != nil"],
    ["os.ReadFile(path)", "[]byte, error", "err != nil"],
    ["os.WriteFile(path, data, 0644)", "error", "err != nil"],
    ["bufio.NewScanner(os.Stdin)", "*bufio.Scanner", "—"],
    ["sc.Scan()", "bool", "for sc.Scan()"],
    ["sc.Text()", "string", "—"],
    ["os.Exit(1)", {ru:"ничего, программа кончается", en:"nothing, the program ends"}, "—"]
  ]
};

var TRAPS = [
 {ru:"<strong><code>os.Args[1]</code> без проверки длины.</strong> Программа собирается и работает, пока ты запускаешь её с аргументом. Запустил без — <code>panic: runtime error: index out of range [1] with length 1</code>. Проверяй <code>len</code> до первого обращения по индексу, всегда.",
  en:"<strong><code>os.Args[1]</code> with no length check.</strong> It compiles and works as long as you pass an argument. Run it without one and you get <code>panic: runtime error: index out of range [1] with length 1</code>. Check <code>len</code> before the first index, every time."},
 {ru:"<strong>Счёт с нуля вместо единицы.</strong> <code>os.Args[0]</code> — путь к программе, а не первый аргумент. Отсюда две ошибки сразу: цикл <code>for i := 0; i &lt; len(os.Args); i++</code> печатает лишнюю строку с путём, а проверка <code>len(os.Args) == 0</code> не срабатывает никогда — длина не бывает меньше единицы.",
  en:"<strong>Counting from zero instead of one.</strong> <code>os.Args[0]</code> is the program path, not the first argument. That causes two bugs at once: a loop <code>for i := 0; i &lt; len(os.Args); i++</code> prints an extra line with the path, and a check <code>len(os.Args) == 0</code> never fires — the length is never below one."},
 {ru:"<strong>Аргумент считают числом.</strong> <code>os.Args[1] * 2</code> не соберётся, а если рядом окажется строка — склеится текст вместо сложения. Пришло <code>\"10\"</code> и <code>\"20\"</code> — <code>os.Args[1] + os.Args[2]</code> даст <code>\"1020\"</code>. Число получают через <code>strconv.Atoi</code>.",
  en:"<strong>Treating an argument as a number.</strong> <code>os.Args[1] * 2</code> won't compile, and where both sides are strings you get concatenation instead of addition: with <code>\"10\"</code> and <code>\"20\"</code>, <code>os.Args[1] + os.Args[2]</code> gives <code>\"1020\"</code>. Use <code>strconv.Atoi</code> for a number."},
 {ru:"<strong>Ошибку заглушили подчёркиванием.</strong> <code>data, _ := os.ReadFile(name)</code> собирается, но при отсутствующем файле <code>data</code> пустой — и программа честно печатает пустоту, будто файл был пуст. Ты ищешь ошибку в разборе данных, а её там нет. Пиши <code>data, err :=</code> и проверяй.",
  en:"<strong>Silencing the error with an underscore.</strong> <code>data, _ := os.ReadFile(name)</code> compiles, but when the file is missing <code>data</code> is empty — and the program prints emptiness as if the file were empty. You go hunting for a parsing bug that isn't there. Write <code>data, err :=</code> and check it."},
 {ru:"<strong><code>fmt.Println(data)</code> вместо <code>string(data)</code>.</strong> <code>os.ReadFile</code> отдаёт <code>[]byte</code>, поэтому на экран летят числа: <code>[111 110 101 10]</code>. Текст покажет <code>fmt.Print(string(data))</code> — и именно <code>Print</code>, а не <code>Println</code>: перевод строки в конце файла уже есть.",
  en:"<strong><code>fmt.Println(data)</code> instead of <code>string(data)</code>.</strong> <code>os.ReadFile</code> hands back a <code>[]byte</code>, so numbers hit the screen: <code>[111 110 101 10]</code>. For text use <code>fmt.Print(string(data))</code> — <code>Print</code>, not <code>Println</code>: the file already ends with a newline."},
 {ru:"<strong>Сообщение об ошибке ушло в stdout, а код возврата остался нулевым.</strong> На экране всё выглядит правильно, но <code>go run . &gt; out.txt</code> запишет жалобу в файл с данными, а тот, кто запускал программу, увидит код 0 и решит, что всё прошло. Ошибка — в <code>os.Stderr</code>, следом <code>os.Exit(1)</code>.",
  en:"<strong>The error message went to stdout and the exit code stayed zero.</strong> On screen it all looks fine, but <code>go run . &gt; out.txt</code> writes the complaint into your data file, and whoever ran the program sees code 0 and assumes success. Errors go to <code>os.Stderr</code>, followed by <code>os.Exit(1)</code>."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Println(len(os.Args))
	fmt.Println(os.Args[1:])
}`,
 out:"1\n[]",
 why:{ru:"Запустил без аргументов — а длина всё равно 1: внутри лежит путь к программе. Срез <code>[1:]</code> его отрезает, остаётся пустой слайс.<br><b>Запусти иначе:</b> <code>go run . 10 20</code> — увидишь <code>3</code> и <code>[10 20]</code>.",
      en:"You ran it with no arguments, yet the length is 1: the program path is inside. The slice <code>[1:]</code> cuts it off and leaves an empty slice.<br><b>Run it differently:</b> <code>go run . 10 20</code> gives <code>3</code> and <code>[10 20]</code>."}
},
{
 chg:{ru:"аргументы прогнали циклом", en:"the arguments went through a loop"},
 code:`package main

import (
	"fmt"
	"os"
)

func main() {
	args := os.Args[1:]
	for i, a := range args {
		fmt.Println(i, a)
	}
	fmt.Println("всего:", len(args))
}`,
 out:"всего: 0",
 why:{ru:"Цикл не сделал ни шага — слайс пустой, и это не ошибка. <code>range</code> по пустому слайсу просто ничего не выполняет.<br><b>Запусти иначе:</b> <code>go run . go is fun</code>.",
      en:"The loop took no steps — the slice is empty, and that is not an error. <code>range</code> over an empty slice simply does nothing.<br><b>Run it differently:</b> <code>go run . go is fun</code>."}
},
{
 chg:{ru:"добавилась проверка на пустой список", en:"a check for an empty list appeared"},
 code:`package main

import (
	"fmt"
	"os"
)

func main() {
	args := os.Args[1:]
	if len(args) == 0 {
		fmt.Println("аргументов нет")
		return
	}
	fmt.Println("первый:", args[0])
}`,
 out:"аргументов нет",
 why:{ru:"Проверка стоит <b>до</b> обращения к <code>args[0]</code> — только поэтому программа не падает. <b>Сломай:</b> убери <code>if</code> целиком и запусти без аргументов — прочитай текст паники.",
      en:"The check sits <b>before</b> touching <code>args[0]</code> — that alone keeps the program alive. <b>Break it:</b> delete the whole <code>if</code> and run with no arguments — read the panic text."}
},
{
 chg:{ru:"сообщение ушло в os.Stderr", en:"the message moved to os.Stderr"},
 code:`package main

import (
	"fmt"
	"os"
)

func main() {
	args := os.Args[1:]
	if len(args) == 0 {
		fmt.Fprintln(os.Stderr, "аргументов нет")
		return
	}
	fmt.Println("первый:", args[0])
}`,
 out:"аргументов нет",
 why:{ru:"Вывод на экране тот же самый, что и в прошлом примере, — но поток другой. Проверь разницу: запусти оба примера как <code>go run . &gt; out.txt</code>. Прошлый смолчит, этот покажет сообщение на экране.",
      en:"The screen output is identical to the previous example — but the stream is different. Prove it: run both as <code>go run . &gt; out.txt</code>. The previous one goes silent, this one still shows the message."}
},
{
 chg:{ru:"return заменили на os.Exit", en:"return became os.Exit"},
 code:`package main

import (
	"fmt"
	"os"
)

func main() {
	defer fmt.Println("это конец main")
	args := os.Args[1:]
	if len(args) == 0 {
		fmt.Println("аргументов нет, выходим")
		os.Exit(0)
	}
	fmt.Println("первый:", args[0])
}`,
 out:"аргументов нет, выходим",
 why:{ru:"Строка из <code>defer</code> не напечаталась: <code>os.Exit</code> обрывает программу немедленно, отложенные вызовы не выполняются. <b>Сломай:</b> замени <code>os.Exit(0)</code> на <code>return</code> — строка появится.",
      en:"The <code>defer</code> line never printed: <code>os.Exit</code> ends the program instantly and deferred calls do not run. <b>Break it:</b> swap <code>os.Exit(0)</code> for <code>return</code> and the line shows up."}
},
{
 chg:{ru:"аргумент превращаем в число", en:"the argument becomes a number"},
 code:`package main

import (
	"fmt"
	"os"
	"strconv"
)

func main() {
	s := "42"
	if len(os.Args) > 1 {
		s = os.Args[1]
	}
	n, err := strconv.Atoi(s)
	if err != nil {
		fmt.Fprintln(os.Stderr, "не число:", s)
		return
	}
	fmt.Println(n * 2)
}`,
 out:"84",
 why:{ru:"Аргумента нет, поэтому взято значение по умолчанию <code>\"42\"</code> — обычный приём, когда параметр необязательный. <code>Atoi</code> сделал из строки число, и умножение стало возможным.<br><b>Запусти иначе:</b> <code>go run . 7</code> даст 14, а <code>go run . abc</code> — сообщение об ошибке.",
      en:"No argument was passed, so the default <code>\"42\"</code> is used — a normal move for an optional parameter. <code>Atoi</code> turned the string into a number and made multiplication possible.<br><b>Run it differently:</b> <code>go run . 7</code> gives 14, and <code>go run . abc</code> gives the error message."}
},
{
 chg:{ru:"значение по умолчанию стало нечисловым", en:"the default value stopped being a number"},
 code:`package main

import (
	"fmt"
	"os"
	"strconv"
)

func main() {
	s := "42x"
	if len(os.Args) > 1 {
		s = os.Args[1]
	}
	n, err := strconv.Atoi(s)
	if err != nil {
		fmt.Println("n =", n)
		fmt.Println("err =", err)
		return
	}
	fmt.Println(n * 2)
}`,
 out:"n = 0\nerr = strconv.Atoi: parsing \"42x\": invalid syntax",
 why:{ru:"Два вывода сразу. Первый: при ошибке число не мусорное, а нулевое — и если ошибку не проверить, программа спокойно посчитает <code>0 * 2</code>. Второй: <code>err</code> печатается напрямую и сам говорит, что именно не разобралось.",
      en:"Two lessons at once. First: on an error the number is not garbage but zero — and if you skip the check, the program happily computes <code>0 * 2</code>. Second: <code>err</code> prints directly and tells you exactly what failed to parse."}
},
{
 chg:{ru:"вместо аргумента — файл", en:"a file instead of an argument"},
 code:`package main

import (
	"fmt"
	"os"
)

func main() {
	err := os.WriteFile("note.txt", []byte("one\\ntwo\\nthree\\n"), 0644)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return
	}
	data, err := os.ReadFile("note.txt")
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return
	}
	fmt.Println(len(data))
	fmt.Print(string(data))
}`,
 out:"14\none\ntwo\nthree",
 why:{ru:"Программа сама создала файл рядом с собой, затем прочитала его. 14 — это байты вместе с тремя переводами строк, а не количество строк. В конце <code>Print</code>, а не <code>Println</code>: последний перевод строки уже в файле.<br><b>Сломай:</b> замени <code>fmt.Print(string(data))</code> на <code>fmt.Println(data)</code> и посмотри, что на самом деле лежит в <code>data</code>.",
      en:"The program created a file next to itself and then read it back. 14 counts bytes including three newlines, not lines. The last call is <code>Print</code>, not <code>Println</code>: the final newline is already in the file.<br><b>Break it:</b> replace <code>fmt.Print(string(data))</code> with <code>fmt.Println(data)</code> and see what <code>data</code> really holds."}
},
{
 chg:{ru:"файла нет", en:"the file is not there"},
 code:`package main

import (
	"fmt"
	"os"
)

func main() {
	data, err := os.ReadFile("missing.txt")
	if err != nil {
		fmt.Fprintln(os.Stderr, "не прочитал:", err)
		fmt.Fprintln(os.Stderr, "байтов получено:", len(data))
		return
	}
	fmt.Print(string(data))
}`,
 out:"не прочитал: open missing.txt: no such file or directory\nбайтов получено: 0",
 why:{ru:"Текст ошибки называет и файл, и причину — читать его полезнее, чем гадать. Данных при этом ноль: полагаться на <code>data</code> после ошибки нельзя.<br><b>Сломай:</b> напиши <code>data, _ := os.ReadFile(...)</code> и убери <code>if</code> — программа промолчит и напечатает пустоту.",
      en:"The error text names both the file and the reason — reading it beats guessing. Meanwhile there is no data at all: <code>data</code> is worthless after an error.<br><b>Break it:</b> write <code>data, _ := os.ReadFile(...)</code> and drop the <code>if</code> — the program goes silent and prints nothing."}
},
{
 chg:{ru:"источник данных — stdin", en:"the data source is stdin"},
 code:`package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)
	n := 0
	for sc.Scan() {
		n++
		fmt.Println(n, sc.Text())
	}
	fmt.Println("строк:", n)
}`,
 out:"строк: 0",
 why:{ru:"Такой вывод получится, если данных на входе нет. Запустишь просто <code>go run .</code> — программа будет ждать, пока ты печатаешь; нажми Ctrl+D, и она закончит.<br><b>Запусти иначе:</b> <code>printf 'one\\ntwo\\n' | go run .</code> даст три строки, последняя — <code>строк: 2</code>.",
      en:"This is the output when there is nothing on the input. Plain <code>go run .</code> waits while you type; press Ctrl+D and it finishes.<br><b>Run it differently:</b> <code>printf 'one\\ntwo\\n' | go run .</code> prints three lines, the last one <code>строк: 2</code>."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"ArgsCount", lvl:1, e:"$ go run . a b c\n3\n[a b c]",
 d:{ru:"Напечатай, сколько аргументов передали программе, и сам список этих аргументов. Путь к программе считать не надо.",
    en:"Print how many arguments the program was given, plus the list of those arguments. The program path does not count."},
 h:{ru:"Отрежь нулевой элемент сразу: <code>args := os.Args[1:]</code>. Дальше обычные <code>len(args)</code> и <code>fmt.Println(args)</code>.",
    en:"Cut off element zero right away: <code>args := os.Args[1:]</code>. Then plain <code>len(args)</code> and <code>fmt.Println(args)</code>."}},

{t:"FirstArg", lvl:1, e:"$ go run . привет\nпривет\n$ go run .\nнет аргументов",
 d:{ru:"Напечатай первый аргумент. Если аргументов не передали — напечатай <code>нет аргументов</code> и закончи работу.",
    en:"Print the first argument. If no arguments were given, print <code>нет аргументов</code> and stop."},
 h:{ru:"Условие — <code>len(os.Args) &lt; 2</code>, потому что нулевой элемент есть всегда. Выйти из <code>main</code> раньше времени можно через <code>return</code>.",
    en:"The condition is <code>len(os.Args) &lt; 2</code>, because element zero is always there. Leaving <code>main</code> early is just <code>return</code>."}},

{t:"ArgsNumbered", lvl:1, e:"$ go run . go is fun\n1 go\n2 is\n3 fun",
 d:{ru:"Напечатай каждый аргумент на своей строке, пронумеровав их начиная с единицы.",
    en:"Print each argument on its own line, numbered starting from one."},
 h:{ru:"<code>range</code> по <code>os.Args[1:]</code> даёт индексы с нуля — печатай <code>i+1</code>.",
    en:"<code>range</code> over <code>os.Args[1:]</code> gives indices from zero — print <code>i+1</code>."}},

{t:"CatFile", lvl:1, e:"$ printf 'one\\ntwo\\n' > note.txt\n$ go run .\none\ntwo",
 d:{ru:"Прочитай файл <code>note.txt</code> (имя зашей прямо в код) и напечатай его содержимое. Если файл прочитать не удалось — напечатай ошибку в <code>os.Stderr</code>.",
    en:"Read the file <code>note.txt</code> (hard-code the name) and print its contents. If reading fails, print the error to <code>os.Stderr</code>."},
 h:{ru:"<code>os.ReadFile</code> возвращает два значения. Содержимое печатается как <code>fmt.Print(string(data))</code> — <code>Print</code>, потому что перевод строки в файле уже есть.",
    en:"<code>os.ReadFile</code> returns two values. Print the contents with <code>fmt.Print(string(data))</code> — <code>Print</code>, because the newline is already in the file."}},

{t:"CatFromArg", lvl:2, e:"$ printf 'one\\ntwo\\n' > note.txt\n$ go run . note.txt\none\ntwo\n$ go run .\nнужно: go run . <файл>\nexit status 1",
 d:{ru:"То же самое, но имя файла берётся из первого аргумента. Аргумента нет — напечатай подсказку в <code>os.Stderr</code> и заверши программу с кодом 1. Файл не прочитался — тоже код 1.",
    en:"The same, but the file name comes from the first argument. No argument — print a usage hint to <code>os.Stderr</code> and exit with code 1. The file failed to open — code 1 as well."},
 h:{ru:"Проверка длины идёт до <code>os.Args[1]</code>. Строку <code>exit status 1</code> печатает сам <code>go run</code>, увидев ненулевой код возврата, — это не твой вывод.",
    en:"The length check comes before <code>os.Args[1]</code>. The line <code>exit status 1</code> is printed by <code>go run</code> itself when it sees a non-zero exit code — it is not your output."}},

{t:"SumArgs", lvl:2, e:"$ go run . 1 2 3\n6\n$ go run . 1 x 3\nне число: x\nexit status 1",
 d:{ru:"Сложи все аргументы как числа и напечатай сумму. Если хоть один аргумент не число — сообщи об этом в <code>os.Stderr</code> и заверши работу с кодом 1.",
    en:"Add up all the arguments as numbers and print the sum. If any argument is not a number, report it to <code>os.Stderr</code> and exit with code 1."},
 h:{ru:"Накопитель создавай до цикла. Внутри цикла — <code>strconv.Atoi</code> и проверка <code>err != nil</code> сразу после вызова.",
    en:"Create the accumulator before the loop. Inside it, <code>strconv.Atoi</code> and an <code>err != nil</code> check right after the call."}},

{t:"CountLines", lvl:2, e:"$ printf 'one\\ntwo\\nthree\\n' > note.txt\n$ go run . note.txt\n3",
 d:{ru:"Имя файла приходит аргументом. Напечатай количество строк в нём — считай по количеству переводов строки. Нет аргумента или файл не читается — сообщение в <code>os.Stderr</code> и код 1.",
    en:"The file name comes as an argument. Print how many lines it has — count the newline characters. No argument, or the file won't read — message to <code>os.Stderr</code> and exit code 1."},
 h:{ru:"<code>data</code> — это <code>[]byte</code>, по нему можно пройти <code>range</code>. Перевод строки как байт записывается <code>'\\n'</code>.",
    en:"<code>data</code> is a <code>[]byte</code>, so <code>range</code> works over it. A newline byte is written <code>'\\n'</code>."}},

{t:"SumStdin", lvl:3, e:"$ printf '10\\n20\\n5\\n' | go run .\n35\n$ printf '10\\nx\\n' | go run .\nне число: x\nexit status 1",
 d:{ru:"На вход построчно приходят числа. Напечатай их сумму. Пустые строки пропускай, на нечисловой строке сообщи в <code>os.Stderr</code> и заверши работу с кодом 1.",
    en:"Numbers arrive on the input, one per line. Print their sum. Skip empty lines; on a non-numeric line report to <code>os.Stderr</code> and exit with code 1."},
 h:{ru:"<code>bufio.NewScanner(os.Stdin)</code> и <code>for sc.Scan()</code>. Строку берёт <code>sc.Text()</code>, дальше <code>strconv.Atoi</code>. Пустая строка — это <code>line == \"\"</code>, для неё есть <code>continue</code>.",
    en:"<code>bufio.NewScanner(os.Stdin)</code> and <code>for sc.Scan()</code>. Take the line with <code>sc.Text()</code>, then <code>strconv.Atoi</code>. An empty line is <code>line == \"\"</code> — that is what <code>continue</code> is for."}},

{t:"CopyFile", lvl:3, e:"$ printf 'one\\ntwo\\n' > a.txt\n$ go run . a.txt b.txt\nскопировано байтов: 8\n$ go run . a.txt\nнужно: go run . <откуда> <куда>\nexit status 1",
 d:{ru:"Программа получает два аргумента: откуда читать и куда писать. Скопируй содержимое и напечатай, сколько байтов перенесено. На любой неудаче — сообщение в <code>os.Stderr</code> и код 1.",
    en:"The program takes two arguments: where to read from and where to write to. Copy the contents and print how many bytes were moved. On any failure — message to <code>os.Stderr</code> and exit code 1."},
 h:{ru:"Два аргумента — это <code>len(os.Args) &lt; 3</code>. <code>os.WriteFile</code> принимает <code>[]byte</code>, а <code>os.ReadFile</code> ровно его и вернул — переводить в строку и обратно не надо. Проверок здесь три: аргументы, чтение, запись.",
    en:"Two arguments means <code>len(os.Args) &lt; 3</code>. <code>os.WriteFile</code> takes a <code>[]byte</code>, and that is exactly what <code>os.ReadFile</code> returned — no need to convert to a string and back. There are three checks here: arguments, read, write."}},

{t:"ArgStat", lvl:3, e:"$ go run . 10 abc 5 7x 32\nчисел: 3\nне чисел: 2\nсумма: 47\n$ go run .\nнужно: go run . <аргументы>\nexit status 1",
 d:{ru:"Пройди по всем аргументам и напечатай три строки: сколько из них числа, сколько не числа и какова сумма чисел. Нечисловой аргумент не должен прерывать работу. Аргументов нет совсем — подсказка в <code>os.Stderr</code> и код 1.",
    en:"Walk all the arguments and print three lines: how many are numbers, how many are not, and the sum of the numbers. A non-numeric argument must not stop the program. No arguments at all — usage hint to <code>os.Stderr</code> and exit code 1."},
 h:{ru:"Здесь ошибка <code>Atoi</code> не повод выходить: увеличил счётчик и <code>continue</code>. Три накопителя объявляются одной строкой: <code>nums, bad, sum := 0, 0, 0</code>.",
    en:"Here an <code>Atoi</code> error is no reason to quit: bump a counter and <code>continue</code>. Three accumulators fit on one line: <code>nums, bad, sum := 0, 0, 0</code>."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};

var BANK = [
{q:{ru:"Запуск <code>go run .</code> без аргументов. Что выведет?", en:"Run as <code>go run .</code> with no arguments. What does it print?"},
 code:"fmt.Println(len(os.Args))", opts:["1","0","2",{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"Нулевой элемент — путь к программе, его кладёт операционная система. Поэтому длина не бывает меньше единицы, и проверка <code>len(os.Args) == 0</code> не срабатывает никогда.",
      en:"Element zero is the program path, put there by the operating system. So the length is never below one, and a check for <code>len(os.Args) == 0</code> never fires."}},

{q:{ru:"Запуск <code>go run . a b</code>. Что выведет?", en:"Run as <code>go run . a b</code>. What does it print?"},
 code:"fmt.Println(len(os.Args))", opts:["3","2","1","4"], ok:0,
 why:{ru:"Два переданных аргумента плюс путь к программе. Чтобы получить именно два, считают по срезу: <code>len(os.Args[1:])</code>.",
      en:"Two passed arguments plus the program path. To get exactly two, count on the slice: <code>len(os.Args[1:])</code>."}},

{q:{ru:"Запуск <code>go run .</code> без аргументов. Что выведет?", en:"Run as <code>go run .</code> with no arguments. What does it print?"},
 code:"fmt.Println(os.Args[1:])", opts:["[]","[ ]","nil",{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"Срез от единицы до конца пустого хвоста даёт пустой слайс — это законно и не паника. Паника была бы при <code>os.Args[1]</code>, то есть при обращении к элементу.",
      en:"Slicing from one to the end of an empty tail gives an empty slice — legal, not a panic. The panic would come from <code>os.Args[1]</code>, that is from touching an element."}},

{q:{ru:"Запуск <code>go run .</code> без аргументов. Что произойдёт?", en:"Run as <code>go run .</code> with no arguments. What happens?"},
 code:"name := os.Args[1]\nfmt.Println(name)",
 opts:[{ru:"panic: index out of range [1] with length 1",en:"panic: index out of range [1] with length 1"},
       {ru:"напечатает пустую строку",en:"prints an empty line"},
       NO,
       {ru:"напечатает путь к программе",en:"prints the program path"}], ok:0,
 why:{ru:"Компилятор это пропускает: по типам всё верно, а длина слайса известна только при запуске. Поэтому <code>len</code> проверяют до первого обращения по индексу.",
      en:"The compiler lets it through: the types are right, and the slice length is only known at run time. That is why you check <code>len</code> before the first index."}},

{q:Q_OUT, code:"fmt.Println(strconv.Atoi(\"42\"))",
 opts:["42 <nil>","42","42 nil",NO], ok:0,
 why:{ru:"<code>Atoi</code> возвращает два значения, и <code>Println</code> печатает оба. Ошибки нет, поэтому вторым идёт <code>&lt;nil&gt;</code> — так Go показывает пустой <code>error</code>.",
      en:"<code>Atoi</code> returns two values and <code>Println</code> prints both. There is no error, so the second one is <code>&lt;nil&gt;</code> — that is how Go shows an empty <code>error</code>."}},

{q:Q_OUT, code:"n, err := strconv.Atoi(\"3.5\")\nfmt.Println(n, err != nil)",
 opts:["0 true","3 true","3.5 false","0 false"], ok:0,
 why:{ru:"<code>Atoi</code> разбирает только целые числа, точка ему не подходит. При ошибке первое значение нулевое — если ошибку не проверить, программа продолжит считать с нулём.",
      en:"<code>Atoi</code> parses whole numbers only; a dot does not fit. On an error the first value is zero — skip the check and the program keeps computing with zero."}},

{q:{ru:"Аргументы <code>go run . 10 20</code>. Что выведет?", en:"Arguments <code>go run . 10 20</code>. What does it print?"},
 code:"fmt.Println(os.Args[1] + os.Args[2])",
 opts:["1020","30",NO,{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"Аргументы приходят строками, а <code>+</code> у строк — склейка, а не сложение. Ошибки не будет, будет неверный ответ: сначала <code>strconv.Atoi</code>, потом арифметика.",
      en:"Arguments arrive as strings, and <code>+</code> on strings concatenates instead of adding. There is no error, just a wrong answer: run <code>strconv.Atoi</code> first, do arithmetic after."}},

{q:Q_HAP, code:"n := os.Args[1] * 2\nfmt.Println(n)",
 opts:[NO,{ru:"аргумент удвоится",en:"the argument doubles"},{ru:"строка повторится дважды",en:"the string repeats twice"},{ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"<code>invalid operation: mismatched types string and untyped int</code>. Умножать строку нельзя — в отличие от <code>+</code>, здесь компилятор ошибку ловит.",
      en:"<code>invalid operation: mismatched types string and untyped int</code>. A string cannot be multiplied — unlike with <code>+</code>, here the compiler does catch it."}},

{q:Q_OUT, code:"data := []byte(\"hi\")\nfmt.Println(data)",
 opts:["[104 105]","hi","[hi]","[h i]"], ok:0,
 why:{ru:"<code>[]byte</code> — слайс чисел, и печатается он как слайс чисел. Текст даёт <code>string(data)</code>. Ровно это происходит с результатом <code>os.ReadFile</code>.",
      en:"A <code>[]byte</code> is a slice of numbers and prints as one. For text use <code>string(data)</code>. This is exactly what happens to the result of <code>os.ReadFile</code>."}},

{q:{ru:"Файла <code>net.txt</code> не существует. Что выведет?", en:"The file <code>net.txt</code> does not exist. What does it print?"},
 code:"data, err := os.ReadFile(\"net.txt\")\nfmt.Println(len(data), err == nil)",
 opts:["0 false","0 true",{ru:"упадёт при запуске",en:"crashes at run time"},NO], ok:0,
 why:{ru:"Отсутствующий файл — не паника, а ошибка в возвращаемом значении. Данных при этом ноль байтов, поэтому программа без проверки <code>err</code> напечатает пустоту и промолчит.",
      en:"A missing file is not a panic but an error in a return value. Data is zero bytes, so a program that skips the <code>err</code> check prints nothing and says nothing."}},

{q:Q_OUT, code:"defer fmt.Println(\"конец\")\nfmt.Println(\"начало\")\nos.Exit(0)",
 opts:["начало","начало\nконец","конец\nначало",NO], ok:0,
 why:{ru:"<code>os.Exit</code> обрывает программу немедленно, отложенные вызовы не выполняются. Если нужно, чтобы <code>defer</code> отработал, выходи через <code>return</code>.",
      en:"<code>os.Exit</code> ends the program instantly and deferred calls never run. If you need the <code>defer</code>, leave through <code>return</code> instead."}},

{q:{ru:"Файл <code>note.txt</code> содержит <code>one\\ntwo\\n</code>. Что выведет?", en:"The file <code>note.txt</code> holds <code>one\\ntwo\\n</code>. What does it print?"},
 code:"data, _ := os.ReadFile(\"note.txt\")\nfmt.Println(len(data))",
 opts:["8","6","2","7"], ok:0,
 why:{ru:"<code>len</code> считает байты, и переводы строк тоже байты: 3 + 1 + 3 + 1. Количество строк из длины напрямую не получить — его считают отдельно.",
      en:"<code>len</code> counts bytes, and newlines are bytes too: 3 + 1 + 3 + 1. The number of lines does not follow from the length — you count it separately."}},

{q:{ru:"На вход подали <code>printf 'ab\\n' | go run .</code>. Что выведет?", en:"Input given as <code>printf 'ab\\n' | go run .</code>. What does it print?"},
 code:"sc := bufio.NewScanner(os.Stdin)\nsc.Scan()\nfmt.Println(len(sc.Text()))",
 opts:["2","3","1","0"], ok:0,
 why:{ru:"<code>sc.Text()</code> отдаёт строку без перевода строки на конце — он служит разделителем и в текст не попадает.",
      en:"<code>sc.Text()</code> returns the line without the trailing newline — it is a separator and does not become part of the text."}},

{q:{ru:"Сколько значений возвращает <code>os.ReadFile</code>?", en:"How many values does <code>os.ReadFile</code> return?"},
 code:null,
 opts:[{ru:"два: []byte и error",en:"two: []byte and error"},
       {ru:"два: string и error",en:"two: string and error"},
       {ru:"одно: []byte",en:"one: []byte"},
       {ru:"одно: string",en:"one: string"}], ok:0,
 why:{ru:"Именно <code>[]byte</code>, а не строка — поэтому для печати нужен <code>string(data)</code>. И именно два значения: писать <code>data := os.ReadFile(p)</code> нельзя, компилятор потребует принять оба.",
      en:"A <code>[]byte</code>, not a string — hence <code>string(data)</code> for printing. And two values indeed: <code>data := os.ReadFile(p)</code> won't compile, the compiler demands you take both."}},

{q:{ru:"Чем <code>os.Stderr</code> отличается от <code>os.Stdout</code>?", en:"How is <code>os.Stderr</code> different from <code>os.Stdout</code>?"},
 code:null,
 opts:[{ru:"это разные потоки, их можно разделить при запуске",en:"they are separate streams and can be split when running"},
       {ru:"stderr печатает красным",en:"stderr prints in red"},
       {ru:"stderr выводится позже остального",en:"stderr is printed after everything else"},
       {ru:"разницы нет, привычка",en:"no difference, just habit"}], ok:0,
 why:{ru:"На экране они выглядят одинаково, поэтому разница и кажется выдуманной. Но <code>go run . &gt; out.txt</code> заберёт в файл только stdout — ошибки останутся видимыми и не испортят данные.",
      en:"On screen they look the same, which makes the difference feel invented. But <code>go run . &gt; out.txt</code> captures stdout only — errors stay visible and do not spoil the data."}},

{q:{ru:"Что означает <code>os.Exit(1)</code>?", en:"What does <code>os.Exit(1)</code> mean?"},
 code:null,
 opts:[{ru:"программа закончилась с ошибкой",en:"the program finished with an error"},
       {ru:"программа закончилась успешно",en:"the program finished successfully"},
       {ru:"выполнить ещё одну строку и выйти",en:"run one more line and quit"},
       {ru:"перезапустить программу",en:"restart the program"}], ok:0,
 why:{ru:"Ноль означает успех, любое другое число — неудачу. Этот код читают другие программы, чтобы решить, продолжать ли работу. Поэтому <code>os.Exit(0)</code> после сообщения об ошибке — прямая ложь.",
      en:"Zero means success, any other number means failure. Other programs read this code to decide whether to continue. So <code>os.Exit(0)</code> after an error message is a plain lie."}},

{q:{ru:"Чем плохо <code>data, _ := os.ReadFile(name)</code>?", en:"What is wrong with <code>data, _ := os.ReadFile(name)</code>?"},
 code:null,
 opts:[{ru:"при отсутствии файла программа молча работает с пустыми данными",en:"with the file missing the program silently works on empty data"},
       {ru:"программа не соберётся",en:"the program won't compile"},
       {ru:"программа упадёт при запуске",en:"the program crashes at run time"},
       {ru:"файл будет прочитан не полностью",en:"the file will be read only partially"}], ok:0,
 why:{ru:"Подчёркивание выбрасывает ошибку, а <code>data</code> при неудаче пустой. Программа печатает пустоту, и ты ищешь причину где угодно, только не там, где она есть.",
      en:"The underscore throws the error away, and on failure <code>data</code> is empty. The program prints nothing and you go looking for the cause everywhere except where it is."}},

{q:{ru:"Программа ждёт один аргумент. Какая проверка верная?", en:"A program expects one argument. Which check is right?"},
 code:null,
 opts:["if len(os.Args) < 2 { ... }","if len(os.Args) < 1 { ... }","if len(os.Args) == 0 { ... }","if os.Args[1] == \"\" { ... }"], ok:0,
 why:{ru:"Один аргумент — это длина 2, потому что нулевой элемент занят путём к программе. Последний вариант вообще падает: чтобы сравнить <code>os.Args[1]</code>, к нему надо обратиться, а его нет.",
      en:"One argument means length 2, because element zero holds the program path. The last option crashes outright: to compare <code>os.Args[1]</code> you must touch it, and it is not there."}},

{q:{ru:"Когда останавливается цикл <code>for sc.Scan()</code>?", en:"When does the loop <code>for sc.Scan()</code> stop?"},
 code:null,
 opts:[{ru:"когда входные данные кончились",en:"when the input runs out"},
       {ru:"на первой пустой строке",en:"at the first empty line"},
       {ru:"никогда, нужен break",en:"never, it needs a break"},
       {ru:"после десяти строк",en:"after ten lines"}], ok:0,
 why:{ru:"<code>Scan</code> возвращает <code>false</code>, когда читать больше нечего: закрылся конвейер, кончился файл, нажали Ctrl+D. Пустая строка данными считается, её <code>Text()</code> вернёт как <code>\"\"</code>.",
      en:"<code>Scan</code> returns <code>false</code> when there is nothing left: the pipe closed, the file ended, Ctrl+D was pressed. An empty line still counts as data — <code>Text()</code> returns it as <code>\"\"</code>."}},

{q:{ru:"Что возвращает <code>os.WriteFile</code>?", en:"What does <code>os.WriteFile</code> return?"},
 code:null,
 opts:[{ru:"только error",en:"only an error"},
       {ru:"количество записанных байтов и error",en:"the number of bytes written and an error"},
       {ru:"ничего",en:"nothing"},
       {ru:"[]byte и error",en:"a []byte and an error"}], ok:0,
 why:{ru:"Записывать нечего возвращать, кроме сообщения о неудаче: <code>err := os.WriteFile(...)</code>, а не <code>err :=</code> двумя значениями. Сколько байтов ушло в файл, ты и так знаешь — это <code>len(data)</code>.",
      en:"Writing has nothing to return but a report of failure: <code>err := os.WriteFile(...)</code>, not a two-value assignment. How many bytes went in you already know — it is <code>len(data)</code>."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Почему аргументы начинаются с <code>os.Args[1]</code>, а не с нуля?", en:"Why do arguments start at <code>os.Args[1]</code> instead of zero?"},
 a:{ru:`<p>Потому что нулевой элемент кладёт туда не ты, а операционная система: это путь к запущенной программе. Твои аргументы становятся в очередь после него.</p>
<pre><code>go run . 10 20

os.Args[0]   <span class="cm">// /var/folders/.../exe/prog</span>
os.Args[1]   <span class="cm">// "10"</span>
os.Args[2]   <span class="cm">// "20"</span>
len(os.Args) <span class="cm">// 3</span></code></pre>
<p>Из этого следуют две вещи, на которых спотыкаются чаще всего:</p>
<ul>
<li><code>len(os.Args)</code> никогда не равен нулю. Проверка «аргументов не передали» — это <code>len(os.Args) &lt; 2</code>.</li>
<li>Цикл <code>for _, a := range os.Args</code> напечатает лишнюю строку с путём.</li>
</ul>
<p>Проще один раз отрезать лишнее и дальше не думать об этом:</p>
<pre><code>args := os.Args[1:]</code></pre>`,
    en:`<p>Because element zero is put there not by you but by the operating system: it is the path to the running program. Your arguments queue up after it.</p>
<pre><code>go run . 10 20

os.Args[0]   <span class="cm">// /var/folders/.../exe/prog</span>
os.Args[1]   <span class="cm">// "10"</span>
os.Args[2]   <span class="cm">// "20"</span>
len(os.Args) <span class="cm">// 3</span></code></pre>
<p>Two consequences trip people up most often:</p>
<ul>
<li><code>len(os.Args)</code> is never zero. The check for “no arguments given” is <code>len(os.Args) &lt; 2</code>.</li>
<li>A loop <code>for _, a := range os.Args</code> prints an extra line with the path.</li>
</ul>
<p>It is easier to cut the extra part off once and stop thinking about it:</p>
<pre><code>args := os.Args[1:]</code></pre>`}},

{q:{ru:"Почему аргумент нельзя сразу использовать как число?", en:"Why can't an argument be used as a number right away?"},
 a:{ru:`<p>Командная строка передаёт текст. Программа не знает, что <code>10</code> задумывалось числом, а <code>note.txt</code> — именем файла: и то и другое приходит как <code>string</code>.</p>
<p>Опаснее всего то, что часть таких ошибок компилятор не ловит:</p>
<pre><code>os.Args[1] * 2              <span class="cm">// не соберётся — умножать строку нельзя</span>
os.Args[1] + os.Args[2]     <span class="cm">// соберётся! "10" + "20" даст "1020"</span></code></pre>
<p>Первая строка ошибка явная. Вторая — тихая: программа работает, отвечает уверенно и отвечает неверно.</p>
<p>Правильный путь один:</p>
<pre><code>n, err := strconv.Atoi(os.Args[1])
if err != nil {
	fmt.Fprintln(os.Stderr, "не число:", os.Args[1])
	os.Exit(1)
}</code></pre>`,
    en:`<p>The command line passes text. The program has no idea that <code>10</code> was meant as a number and <code>note.txt</code> as a file name: both arrive as a <code>string</code>.</p>
<p>The dangerous part is that the compiler catches only some of these mistakes:</p>
<pre><code>os.Args[1] * 2              <span class="cm">// won't compile — a string can't be multiplied</span>
os.Args[1] + os.Args[2]     <span class="cm">// compiles! "10" + "20" gives "1020"</span></code></pre>
<p>The first line is a loud error. The second is a quiet one: the program runs, answers confidently, and answers wrong.</p>
<p>There is one right way:</p>
<pre><code>n, err := strconv.Atoi(os.Args[1])
if err != nil {
	fmt.Fprintln(os.Stderr, "not a number:", os.Args[1])
	os.Exit(1)
}</code></pre>`}},

{q:{ru:"Что такое <code>error</code> и почему его проверяют вручную?", en:"What is an <code>error</code> and why check it by hand?"},
 a:{ru:`<p><code>error</code> — обычное возвращаемое значение, такое же как число или строка. Оно либо <code>nil</code> (всё прошло), либо содержит описание неудачи.</p>
<p>Go не прерывает выполнение сам: функция сообщает о проблеме, а что с ней делать — решает вызывающий код. Иногда надо остановиться, иногда взять значение по умолчанию, иногда пропустить эту строку и идти дальше. Функция этого знать не может.</p>
<p>Отсюда постоянная форма записи:</p>
<pre><code>data, err := os.ReadFile(name)
if err != nil {
	<span class="cm">// решение принимается здесь</span>
}</code></pre>
<p>Три вещи, которые надо помнить:</p>
<ul>
<li>Проверка идёт сразу после вызова, а не в конце функции.</li>
<li>При ошибке второе значение нулевое: <code>0</code>, пустой слайс, пустая строка. Данными оно не является.</li>
<li><code>err</code> печатается напрямую и обычно сам объясняет причину: <code>open note.txt: no such file or directory</code>.</li>
</ul>`,
    en:`<p>An <code>error</code> is an ordinary return value, like a number or a string. It is either <code>nil</code> (all good) or it carries a description of the failure.</p>
<p>Go does not stop execution on its own: the function reports the problem, and the calling code decides what to do about it. Sometimes you stop, sometimes you fall back to a default, sometimes you skip this line and move on. The function cannot know which.</p>
<p>Hence the shape you write over and over:</p>
<pre><code>data, err := os.ReadFile(name)
if err != nil {
	<span class="cm">// the decision is made here</span>
}</code></pre>
<p>Three things to remember:</p>
<ul>
<li>The check goes right after the call, not at the end of the function.</li>
<li>On an error the other value is the zero value: <code>0</code>, an empty slice, an empty string. It is not data.</li>
<li><code>err</code> prints directly and usually explains itself: <code>open note.txt: no such file or directory</code>.</li>
</ul>`}},

{q:{ru:"Зачем нужен отдельный <code>os.Stderr</code>, если на экране всё одинаково?", en:"Why a separate <code>os.Stderr</code> if everything looks the same on screen?"},
 a:{ru:`<p>Одинаково выглядит только на экране. Разделяются потоки в момент, когда вывод куда-то направляют.</p>
<pre><code>go run . note.txt &gt; result.txt</code></pre>
<p>В <code>result.txt</code> попадёт только stdout. Если сообщение «файл не найден» ты напечатал через <code>fmt.Println</code>, оно уедет в файл вместе с данными: на экране пусто, в файле мусор, и непонятно, что случилось.</p>
<p>Правило простое:</p>
<ul>
<li>Результат работы — <code>fmt.Println(...)</code>, то есть stdout.</li>
<li>Всё, что объясняет проблему, — <code>fmt.Fprintln(os.Stderr, ...)</code>.</li>
</ul>
<p>Рядом с этим живёт код возврата. Сообщение читает человек, код возврата читает другая программа. Поэтому после жалобы в stderr идёт <code>os.Exit(1)</code>.</p>`,
    en:`<p>They look the same on screen only. The streams split the moment the output is sent somewhere.</p>
<pre><code>go run . note.txt &gt; result.txt</code></pre>
<p>Only stdout lands in <code>result.txt</code>. If you printed “file not found” with <code>fmt.Println</code>, it goes into the file along with the data: nothing on screen, garbage in the file, and no clue what happened.</p>
<p>The rule is simple:</p>
<ul>
<li>The result of the work — <code>fmt.Println(...)</code>, that is stdout.</li>
<li>Anything explaining a problem — <code>fmt.Fprintln(os.Stderr, ...)</code>.</li>
</ul>
<p>The exit code lives right next to this. A message is read by a person, an exit code by another program. That is why a complaint to stderr is followed by <code>os.Exit(1)</code>.</p>`}},

{q:{ru:"Что делает <code>os.Exit</code> и какой код ставить?", en:"What does <code>os.Exit</code> do and which code should I use?"},
 a:{ru:`<p><code>os.Exit(code)</code> немедленно заканчивает программу и сообщает системе число — код возврата.</p>
<ul>
<li><code>0</code> — работа выполнена. Так же заканчивается <code>main</code>, дойдя до конца сам по себе.</li>
<li><code>1</code> — не получилось. Годится почти для любой неудачи, пока тебе не нужно различать причины.</li>
</ul>
<p>Две особенности, о которых узнают неприятным способом:</p>
<ul>
<li><code>os.Exit</code> не выполняет отложенные вызовы — <code>defer</code> молча пропускается.</li>
<li>Строку <code>exit status 1</code> печатает <code>go run</code>, а не твоя программа. Это он показывает ненулевой код.</li>
</ul>
<p>Внутри <code>main</code> при простом выходе достаточно <code>return</code>. <code>os.Exit(1)</code> нужен там, где надо именно сообщить о неудаче наружу.</p>`,
    en:`<p><code>os.Exit(code)</code> ends the program immediately and reports a number to the system — the exit code.</p>
<ul>
<li><code>0</code> — the job is done. That is also how <code>main</code> ends when it simply reaches its last line.</li>
<li><code>1</code> — it failed. Good enough for almost any failure until you need to tell causes apart.</li>
</ul>
<p>Two details people learn the hard way:</p>
<ul>
<li><code>os.Exit</code> does not run deferred calls — <code>defer</code> is skipped silently.</li>
<li>The line <code>exit status 1</code> is printed by <code>go run</code>, not by your program. That is how it shows a non-zero code.</li>
</ul>
<p>Inside <code>main</code>, a plain <code>return</code> is enough for a normal exit. <code>os.Exit(1)</code> is for when the failure must be reported to the outside.</p>`}},

{q:{ru:"Почему <code>os.ReadFile</code> отдаёт <code>[]byte</code>, а не строку?", en:"Why does <code>os.ReadFile</code> return a <code>[]byte</code> and not a string?"},
 a:{ru:`<p>Файл — это байты. Не всякий файл вообще является текстом: картинку или архив в строку класть незачем. Поэтому Go отдаёт то, что действительно лежит на диске, а превращение в текст оставляет тебе.</p>
<pre><code>data, err := os.ReadFile("note.txt")
fmt.Println(data)          <span class="cm">// [111 110 101 10 116 119 111 10]</span>
fmt.Print(string(data))    <span class="cm">// one</span>
                           <span class="cm">// two</span></code></pre>
<p>Отсюда три следствия:</p>
<ul>
<li><code>len(data)</code> — байты, вместе с переводами строк. Количество строк надо считать отдельно.</li>
<li>Для печати нужен <code>string(data)</code>, иначе на экране числа.</li>
<li>Печатают через <code>Print</code>, а не <code>Println</code>: перевод строки в конце файла обычно уже есть.</li>
</ul>
<p>При копировании файла превращать в строку не надо вообще: <code>os.WriteFile</code> принимает <code>[]byte</code> — ровно то, что вернул <code>os.ReadFile</code>.</p>`,
    en:`<p>A file is bytes. Not every file is even text — there is no point stuffing an image or an archive into a string. So Go hands you what is actually on disk and leaves the conversion to you.</p>
<pre><code>data, err := os.ReadFile("note.txt")
fmt.Println(data)          <span class="cm">// [111 110 101 10 116 119 111 10]</span>
fmt.Print(string(data))    <span class="cm">// one</span>
                           <span class="cm">// two</span></code></pre>
<p>Three consequences:</p>
<ul>
<li><code>len(data)</code> is bytes, newlines included. Lines must be counted separately.</li>
<li>Printing needs <code>string(data)</code>, otherwise you get numbers.</li>
<li>Use <code>Print</code>, not <code>Println</code>: the file usually ends with a newline already.</li>
</ul>
<p>When copying a file there is no need for a string at all: <code>os.WriteFile</code> takes a <code>[]byte</code> — exactly what <code>os.ReadFile</code> returned.</p>`}},

{q:{ru:"Аргумент, файл или stdin — что когда?", en:"Argument, file or stdin — which one when?"},
 a:{ru:`<p>Три разных источника, и путают их редко, если понять назначение каждого.</p>
<div class="tablewrap"><table>
<tr><th>Источник</th><th>Что через него передают</th><th>Запуск</th></tr>
<tr><td><code>os.Args</code></td><td>короткие настройки: имя файла, число, режим</td><td><code>go run . note.txt 10</code></td></tr>
<tr><td><code>os.ReadFile</code></td><td>данные, которые лежат на диске</td><td><code>go run . note.txt</code></td></tr>
<tr><td><code>os.Stdin</code></td><td>данные, которые пришли от другой команды</td><td><code>cat note.txt | go run .</code></td></tr>
</table></div>
<p>Обрати внимание: имя файла — это аргумент, а его содержимое — уже другой вопрос. Одно не заменяет другое.</p>
<p>Stdin отличается тем, что данные могут идти потоком и не иметь конца заранее. Поэтому его читают построчно сканером, а не одним вызовом, как файл.</p>`,
    en:`<p>Three different sources, and they rarely get confused once you see what each is for.</p>
<div class="tablewrap"><table>
<tr><th>Source</th><th>What goes through it</th><th>How it is run</th></tr>
<tr><td><code>os.Args</code></td><td>short settings: a file name, a number, a mode</td><td><code>go run . note.txt 10</code></td></tr>
<tr><td><code>os.ReadFile</code></td><td>data sitting on disk</td><td><code>go run . note.txt</code></td></tr>
<tr><td><code>os.Stdin</code></td><td>data coming from another command</td><td><code>cat note.txt | go run .</code></td></tr>
</table></div>
<p>Note the split: the file name is an argument, its contents are a separate matter. One does not replace the other.</p>
<p>Stdin differs in that data may arrive as a stream with no known end. That is why it is read line by line with a scanner instead of one call, as a file is.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */

/* Путь к собранной программе: в переменных он показан коротко, в выводе — как его печатает Go. */
var SC_PROG = "/…/exe/prog";
var SC_PATH = "/var/folders/…/exe/prog";

/* символы строки: суррогатная пара считается одним символом */
function scRunes(s){
  var r = [], i = 0;
  while(i < s.length){ var cp = s.codePointAt(i); r.push(cp); i += (cp > 0xFFFF) ? 2 : 1; }
  return r;
}
/* UTF-8 — столько же байтов, сколько положит Go */
function scEnc(cp){
  if(cp < 0x80)    return [cp];
  if(cp < 0x800)   return [0xC0 | (cp >> 6), 0x80 | (cp & 63)];
  if(cp < 0x10000) return [0xE0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63)];
  return [0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 63), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63)];
}
/* то, что ввели в поле: не длиннее десяти символов и без знаков, ломающих разметку */
function scText(v, def){
  var s = String(v === undefined || v === null ? "" : v).replace(/[<>&"'`\\]/g, " ");
  s = scRunes(s).slice(0, 10).map(function(cp){ return String.fromCodePoint(cp); }).join("");
  s = s.replace(/\s+/g, " ").trim();
  return s.length ? s : def;
}
/* поле делится пробелами: для аргументов это отдельные аргументы, для файла и stdin — строки */
function scTokens(v, def, limit){
  var parts = scText(v, def).split(" ").filter(function(x){ return x.length > 0; });
  if(!parts.length) parts = def.split(" ");
  return parts.slice(0, limit || 5);
}
/* ровно то, что примет strconv.Atoi: знак и десятичные цифры */
function scNum(s){ return /^[+-]?[0-9]+$/.test(s); }
function scRu(n, one, few, many){
  var d = n % 10, h = n % 100;
  if(h >= 11 && h <= 14) return many;
  if(d === 1) return one;
  if(d >= 2 && d <= 4) return few;
  return many;
}
function scEn(n, one, many){ return n === 1 ? one : many; }
function scQ(s){ return '"' + String(s).replace(/\n/g, "\\n") + '"'; }
function scSpan(a, b){ var r = []; for(var i = a; i < b; i++) r.push(i); return r; }
/* модель файла: строки, их байты и лента под кодом */
function scFile(v, def){
  var lines = scTokens(v, def, 5), bytes = [], tape = [], letters = 0;
  lines.forEach(function(l){
    scRunes(l).forEach(function(cp){
      var e = scEnc(cp), ch = String.fromCodePoint(cp);
      letters++;
      for(var k = 0; k < e.length; k++){ bytes.push(e[k]); tape.push(ch); }
    });
    bytes.push(10); tape.push("\\n");
  });
  return {lines:lines, text:lines.join("\n") + "\n", bytes:bytes, tape:tape, letters:letters};
}

var SCENARIOS = [
{
 name:{ru:"os.Args по индексам", en:"os.Args by index"},
 params:[{key:"cmd", label:{ru:"аргументы", en:"arguments"}, text:true, max:10, def:"10 20"}],
 code: function(p){
   return ["args := os.Args",
           "fmt.Println(len(args))",
           "fmt.Println(args[0])",
           "fmt.Println(args[1])",
           "fmt.Println(args[1:])"];
 },
 steps: function(p){
   var a = scTokens(p.cmd, "10 20", 5);
   var n = a.length, total = n + 1;
   var full = "[" + SC_PROG + " " + a.join(" ") + "]";
   var tail = "[" + a.join(" ") + "]";
   var cmd  = "go run . " + a.join(" ");
   var av = ["args", full, "[]string"], lv = ["len(args)", String(total), "int"];
   var o1 = total + "\n", o2 = o1 + SC_PATH + "\n", o3 = o2 + a[0] + "\n", o4 = o3 + tail + "\n";
   return [
    {line:0, vars:[av, lv], out:"",
     note:{ru:"Запуск был <code>" + cmd + "</code>. В слайсе " + total + " " + scRu(total, "строка", "строки", "строк") +
              ", хотя передали " + n + ": нулевую положила операционная система.",
           en:"It was started as <code>" + cmd + "</code>. The slice holds " + total + " " + scEn(total, "string", "strings") +
              " although " + n + " " + scEn(n, "was", "were") + " passed: element zero was put there by the operating system."}},
    {line:1, vars:[av, lv], out:o1,
     note:{ru:"<b>" + total + ", а не " + n + ".</b> Проверка «аргументов нет» — это <code>len &lt; 2</code>, а не <code>len == 0</code>.",
           en:"<b>" + total + ", not " + n + ".</b> The “no arguments” check is <code>len &lt; 2</code>, never <code>len == 0</code>."}},
    {line:2, vars:[av, ["args[0]", scQ(SC_PROG), "string"]], out:o2,
     note:{ru:"Нулевой элемент — путь к собранной программе. У тебя он будет свой и при каждом <code>go run</code> другой.",
           en:"Element zero is the path to the built program. Yours will differ, and it changes on every <code>go run</code>."}},
    {line:3, vars:[av, ["args[1]", scQ(a[0]), "string"]], out:o3,
     note:{ru:"Первый настоящий аргумент — под индексом 1: " + scQ(a[0]) + ". " + (scNum(a[0])
             ? "И это <b>строка</b>, а не число, хотя выглядит числом."
             : "Это <b>строка</b> — из командной строки числа не приходят никогда."),
           en:"The first real argument sits at index 1: " + scQ(a[0]) + ". " + (scNum(a[0])
             ? "And it is a <b>string</b>, not a number, however numeric it looks."
             : "It is a <b>string</b> — numbers never arrive from the command line.")}},
    {line:4, vars:[av, ["args[1:]", tail, "[]string"]], out:o4,
     note:{ru:"Срез <code>[1:]</code> отрезал путь: " + scRu(n, "остался", "осталось", "осталось") + " " + n + " " +
              scRu(n, "аргумент", "аргумента", "аргументов") + " — ровно то, что ты набрал. Дальше удобнее работать именно с ним: индексы совпадают с набранным.",
           en:"The slice <code>[1:]</code> cut the path off, leaving " + n + " " + scEn(n, "argument", "arguments") +
              " — exactly what you typed. Working with it is easier from here on: the indices match what you typed."}}
   ];
 }
},
{
 name:{ru:"Запуск с аргументом", en:"Run with an argument"},
 params:[{key:"arg", label:{ru:"аргумент", en:"argument"}, text:true, max:10, def:"21"}],
 code:["args := os.Args[1:]","if len(args) == 0 {","\tfmt.Fprintln(os.Stderr, \"нужен аргумент\")","\tos.Exit(1)","}","n, err := strconv.Atoi(args[0])","if err != nil {","\tfmt.Fprintln(os.Stderr, \"не число:\", args[0])","\tos.Exit(1)","}","fmt.Println(n * 2)"],
 steps: function(p){
   var s = scTokens(p.arg, "21", 1)[0];
   var ok = scNum(s), n = ok ? parseInt(s, 10) : 0;
   var av = ["args", "[" + s + "]", "[]string"], lv = ["len(args)", "1", "int"];
   var st = [
    {line:0, vars:[av, lv], out:"",
     note:{ru:"Запуск <code>go run . " + s + "</code>. Путь к программе отрезан, остался один аргумент — строка " + scQ(s) + ".",
           en:"Started as <code>go run . " + s + "</code>. The program path is cut off, leaving one argument — the string " + scQ(s) + "."}},
    {line:1, vars:[av, lv, ["len(args) == 0", "false", "bool"]], out:"",
     note:{ru:"Строка выполняется всегда: условие считают в любом случае. <code>len(args) == 0</code> — это <code>1 == 0</code>, то есть <b>ложно</b>, поэтому тело <code>if</code> пропускается целиком и следующим шагом подсветка встанет сразу на <code>strconv.Atoi</code>. Проверка длины стоит <b>до</b> обращения к <code>args[0]</code>: без неё запуск без аргументов дал бы панику.",
           en:"This line always runs: the condition is evaluated either way. <code>len(args) == 0</code> is <code>1 == 0</code>, that is <b>false</b>, so the whole <code>if</code> body is skipped and the next step lands straight on <code>strconv.Atoi</code>. The length check comes <b>before</b> touching <code>args[0]</code>: without it a run with no arguments would panic."}}
   ];
   if(ok){
     var ev = ["err", "nil", "error"], nv = ["n", String(n), "int"];
     st.push({line:5, vars:[av, nv, ev], out:"",
       note:{ru:"<code>Atoi</code> вернул сразу два значения: число и ошибку. Строка " + scQ(s) + " превратилась в число " + n + ".",
             en:"<code>Atoi</code> returned two values at once: a number and an error. The string " + scQ(s) + " became the number " + n + "."}});
     st.push({line:6, vars:[nv, ev, ["err != nil", "false", "bool"]], out:"",
       note:{ru:"Условие проверяется и тогда, когда ошибки нет: <code>err != nil</code> — это <code>nil != nil</code>, то есть <b>ложно</b>. Тело пропускается, жалобы не будет, подсветка перепрыгнет на <code>fmt.Println(n * 2)</code>. Проверять ошибку надо всегда сразу после вызова.",
             en:"The condition is evaluated even when there is no error: <code>err != nil</code> is <code>nil != nil</code>, that is <b>false</b>. The body is skipped, nothing is complained about, and the highlight jumps to <code>fmt.Println(n * 2)</code>. Always check the error right after the call."}});
     st.push({line:10, vars:[nv, ev], out:(n * 2) + "\n",
       note:{ru:"Только теперь можно считать: <code>" + n + " * 2</code> — это " + (n * 2) + ". Две проверки прошли, значит данные точно есть и они точно число.",
             en:"Only now can you compute: <code>" + n + " * 2</code> is " + (n * 2) + ". Two checks passed, so the data is definitely there and definitely a number."}});
   } else {
     var errText = "strconv.Atoi: parsing " + scQ(s) + ": invalid syntax";
     var ev2 = ["err", errText, "error"], nv2 = ["n", "0", "int"];
     st.push({line:5, vars:[av, nv2, ev2], out:"",
       note:{ru:"Разбор не удался: " + scQ(s) + " — не десятичное целое. Смотри на первое значение: <code>n</code> равно нулю, обычному нулю. Если ошибку не проверить, программа посчитает <code>0 * 2</code> и уверенно напечатает 0.",
             en:"Parsing failed: " + scQ(s) + " is not a decimal integer. Look at the first value: <code>n</code> is zero, a plain zero. Skip the error check and the program computes <code>0 * 2</code> and confidently prints 0."}});
     st.push({line:6, vars:[nv2, ev2, ["err != nil", "true", "bool"]], out:"",
       note:{ru:"<code>err != nil</code> — <b>истинно</b>: внутри лежит <code>" + errText + "</code>. Заходим в тело <code>if</code>. Проверка стоит сразу после вызова, между ними нет ни одной строки, которая пользовалась бы <code>n</code>.",
             en:"<code>err != nil</code> is <b>true</b>: it holds <code>" + errText + "</code>. We step into the <code>if</code> body. The check sits right after the call, with no line between them touching <code>n</code>."}});
     st.push({line:7, vars:[av], out:"не число: " + s + "\n",
       note:{ru:"Жалоба ушла в <b>stderr</b>, а не в stdout: при <code>go run . &gt; out.txt</code> она останется на экране и не испортит файл с результатом.",
             en:"The complaint went to <b>stderr</b>, not stdout: with <code>go run . &gt; out.txt</code> it stays on screen and does not spoil the result file."}});
     st.push({line:8, vars:[av], out:"не число: " + s + "\nexit status 1\n",
       note:{ru:"<code>os.Exit(1)</code> заканчивает программу здесь же — <code>fmt.Println(n * 2)</code> не выполнится. Вторую строку напечатала не программа, а <code>go run</code>: так он показывает код возврата 1.",
             en:"<code>os.Exit(1)</code> ends the program right here — <code>fmt.Println(n * 2)</code> never runs. The second line was printed not by the program but by <code>go run</code>: that is how it shows exit code 1."}});
   }
   return st;
 }
},
{
 name:{ru:"Тот же код без аргумента", en:"Same code, no argument"},
 params:[{key:"end", label:{ru:"выход", en:"exit"}, values:["os.Exit(1)","return"], def:"os.Exit(1)"}],
 code: function(p){
   var end = (p.end === "return") ? "return" : "os.Exit(1)";
   return ["args := os.Args[1:]","if len(args) == 0 {","\tfmt.Fprintln(os.Stderr, \"нужен аргумент\")","\t" + end,"}","n, err := strconv.Atoi(args[0])","if err != nil {","\tfmt.Fprintln(os.Stderr, \"не число:\", args[0])","\tos.Exit(1)","}","fmt.Println(n * 2)"];
 },
 steps: function(p){
   var quit = (p.end !== "return");
   var av = ["args", "[]", "[]string"], lv = ["len(args)", "0", "int"];
   return [
    {line:0, vars:[av, lv], out:"",
     note:{ru:"Запуск <code>go run .</code> — без аргументов. Срез пустой, но это не ошибка и не паника.",
           en:"Started as <code>go run .</code> — no arguments. The slice is empty, which is neither an error nor a panic."}},
    {line:1, vars:[av, lv, ["len(args) == 0", "true", "bool"]], out:"",
     note:{ru:"Та же строка, что и в прошлом сценарии, но ответ другой: <code>len(args) == 0</code> — это <code>0 == 0</code>, то есть <b>истинно</b>. Заходим в тело <code>if</code>. Именно оно спасает от <code>panic: index out of range</code> строкой ниже.",
           en:"The same line as in the previous scenario, but the answer differs: <code>len(args) == 0</code> is <code>0 == 0</code>, that is <b>true</b>. We step into the <code>if</code> body. It is exactly what saves us from <code>panic: index out of range</code> a few lines below."}},
    {line:2, vars:[av], out:"нужен аргумент\n",
     note:{ru:"Сообщение ушло в <b>stderr</b>. На экране выглядит как обычная строка, но при <code>go run . &gt; out.txt</code> в файл оно не попадёт.",
           en:"The message went to <b>stderr</b>. On screen it looks like any other line, but with <code>go run . &gt; out.txt</code> it will not land in the file."}},
    {line:3, vars:[av], out:quit ? "нужен аргумент\nexit status 1\n" : "нужен аргумент\n",
     note: quit
       ? {ru:"<code>os.Exit(1)</code> заканчивает программу здесь же — и на этом прогон окончен. Шагов дальше нет, потому что дальше ничего не выполняется: ни <code>strconv.Atoi</code>, ни <code>if err != nil</code>, ни <code>fmt.Println(n * 2)</code>. Подсветка на них не встанет никогда. Вторую строку вывода напечатала не программа, а <code>go run</code> — так он показывает код возврата 1.",
          en:"<code>os.Exit(1)</code> ends the program right here — and the run is over. There are no further steps because nothing further executes: not <code>strconv.Atoi</code>, not <code>if err != nil</code>, not <code>fmt.Println(n * 2)</code>. The highlight will never reach them. The second output line was printed not by the program but by <code>go run</code> — that is how it shows exit code 1."}
       : {ru:"<code>return</code> тоже заканчивает <code>main</code>, и прогон обрывается ровно так же: ни <code>strconv.Atoi</code>, ни <code>if err != nil</code>, ни печать не выполнятся — шагов у них поэтому нет. Но код возврата остался нулевым: строки <code>exit status 1</code> нет. Снаружи такой запуск выглядит успешным, хотя работа не сделана: жалобу человек прочтёт, а запустившая программа решит, что всё прошло.",
          en:"<code>return</code> also ends <code>main</code>, and the run stops exactly the same way: neither <code>strconv.Atoi</code>, nor <code>if err != nil</code>, nor the printout will execute — which is why they get no steps. But the exit code stayed zero: there is no <code>exit status 1</code> line. From the outside such a run looks successful although nothing was done: a person reads the complaint, while the program that started this one concludes all went well."}}
   ];
 }
},
{
 name:{ru:"Чтение файла", en:"Reading a file"},
 params:[{key:"text", label:{ru:"файл", en:"file"}, text:true, max:10, def:"one two"}],
 code:["data, err := os.ReadFile(\"note.txt\")","if err != nil {","\tfmt.Fprintln(os.Stderr, err)","\tos.Exit(1)","}","fmt.Println(data[0])","fmt.Println(len(data))","fmt.Print(string(data))"],
 tape: function(p){ return scFile(p.text, "one two").tape; },
 steps: function(p){
   var m = scFile(p.text, "one two");
   var nb = m.bytes.length, nl = m.lines.length, all = scSpan(0, nb);
   var dv = ["data", "[" + m.bytes.join(" ") + "]", "[]byte"], ev = ["err", "nil", "error"];
   var b0 = m.bytes[0], first = scRunes(m.lines[0])[0], wide = scEnc(first).length > 1;
   var ch0 = String.fromCodePoint(first);
   var o1 = b0 + "\n", o2 = o1 + nb + "\n", o3 = o2 + m.text;
   return [
    {line:0, vars:[dv, ev], out:"", tapeOn:all,
     note:{ru:"В файле <code>note.txt</code> лежит " + scQ(m.text) + " — " + nl + " " + scRu(nl, "строка", "строки", "строк") +
              ". Прочитан он целиком одним вызовом, и в <code>data</code> лежат <b>байты</b>, а не строка: внизу видно, какой байт чему соответствует. Пробел в поле над кодом делает новую строку.",
           en:"The file <code>note.txt</code> holds " + scQ(m.text) + " — " + nl + " " + scEn(nl, "line", "lines") +
              ". It was read whole in one call, and <code>data</code> holds <b>bytes</b>, not a string: the panel below shows which byte is which. A space in the field above the code starts a new line."}},
    {line:1, vars:[dv, ev, ["err != nil", "false", "bool"]], out:"", tapeOn:all,
     note:{ru:"Условие считается и тогда, когда всё прошло: <code>err != nil</code> — это <code>nil != nil</code>, то есть <b>ложно</b>. Тело пропускается, подсветка перепрыгнет на <code>fmt.Println(data[0])</code>. Если бы файла не было, <code>data</code> оказался бы пустым, <code>err</code> содержал бы <code>open note.txt: no such file or directory</code> — и мы зашли бы внутрь.",
           en:"The condition is evaluated even when all went well: <code>err != nil</code> is <code>nil != nil</code>, that is <b>false</b>. The body is skipped and the highlight jumps to <code>fmt.Println(data[0])</code>. Had the file been missing, <code>data</code> would be empty, <code>err</code> would hold <code>open note.txt: no such file or directory</code> — and we would step inside."}},
    {line:5, vars:[["data[0]", String(b0), "byte"]], out:o1, tapeOn:[0],
     note:{ru:"Один элемент — это число " + b0 + ". " + (wide
             ? "И это только первая половина буквы «" + ch0 + "»: она занимает два байта, поэтому по одному байту символ не собрать."
             : "Код символа «" + ch0 + "».") + " Именно поэтому <code>fmt.Println(data)</code> печатает список чисел.",
           en:"A single element is the number " + b0 + ". " + (wide
             ? "And it is only the first half of the letter “" + ch0 + "”: that letter takes two bytes, so one byte is not enough to rebuild a character."
             : "The code of the character “" + ch0 + "”.") + " This is exactly why <code>fmt.Println(data)</code> prints a list of numbers."}},
    {line:6, vars:[["len(data)", String(nb), "int"]], out:o2, tapeOn:all,
     note:{ru:"<b>" + nb + ", а не " + m.letters + ".</b> " + (nl === 1
              ? "Перевод строки в конце — тоже байт."
              : "Переводы строк — тоже байты, их здесь " + nl + ".") +
              (nb > m.letters + nl ? " И буквы не латиницы занимают по два байта каждая." : "") +
              " Из длины количество строк напрямую не узнать.",
           en:"<b>" + nb + ", not " + m.letters + ".</b> " + (nl === 1
              ? "The trailing newline is a byte too."
              : "Newlines are bytes too — there are " + nl + " of them.") +
              (nb > m.letters + nl ? " And non-Latin letters take two bytes each." : "") +
              " The number of lines does not follow from the length."}},
    {line:7, vars:[["string(data)", scQ(m.text), "string"]], out:o3, tapeOn:all,
     note:{ru:"<code>string(data)</code> показывает те же байты как текст. Здесь <code>Print</code>, а не <code>Println</code>: перевод строки в конце файла уже есть.",
           en:"<code>string(data)</code> shows the same bytes as text. This is <code>Print</code>, not <code>Println</code>: the file already ends with a newline."}}
   ];
 }
},
{
 name:{ru:"Построчно из stdin", en:"Line by line from stdin"},
 params:[{key:"in", label:{ru:"строки", en:"lines"}, text:true, max:10, def:"one two"}],
 code:["sc := bufio.NewScanner(os.Stdin)","n := 0","for sc.Scan() {","\tn++","\tfmt.Println(n, sc.Text())","}","fmt.Println(\"строк:\", n)"],
 steps: function(p){
   var lines = scTokens(p.in, "one two", 5);
   var cmd = "printf '" + lines.join("\\n") + "\\n' | go run .";
   var st = [], out = "";
   st.push({line:0, vars:[["sc", "сканер готов", "*bufio.Scanner"]], out:"",
     note:{ru:"Запуск <code>" + cmd + "</code>. Сканер создан, но пока ничего не прочитал. Пробел в поле над кодом делает новую строку.",
           en:"Started as <code>" + cmd + "</code>. The scanner exists but has read nothing yet. A space in the field above the code starts a new line."}});
   st.push({line:1, vars:[["sc", "сканер готов", "*bufio.Scanner"], ["n", "0", "int"]], out:"",
     note:{ru:"Счётчик создан до цикла — иначе на каждом шаге он создавался бы заново.",
           en:"The counter is created before the loop — otherwise it would be recreated on every step."}});
   lines.forEach(function(ln, i){
     st.push({line:2, vars:[["sc.Scan()", "true", "bool"], ["sc.Text()", scQ(ln), "string"], ["n", String(i), "int"]], out:out,
       note: i === 0
         ? {ru:"Заголовок цикла — это и есть условие: вызов <code>Scan</code> прочитал первую строку и вернул <code>true</code>, значит заходим в тело. Сам текст лежит отдельно — в <code>sc.Text()</code>, уже без перевода строки.",
            en:"The loop header <em>is</em> the condition: the call to <code>Scan</code> read the first line and returned <code>true</code>, so we go into the body. The text itself lives separately, in <code>sc.Text()</code>, already without the newline."}
         : {ru:"Заход номер " + (i + 1) + ": заголовок цикла выполняется заново — <code>Scan</code> снова вернул <code>true</code> и подменил содержимое <code>Text()</code>, теперь там " + scQ(ln) + ". Предыдущая строка потеряна: если она нужна, сохраняй её сам.",
            en:"Pass number " + (i + 1) + ": the loop header runs again — <code>Scan</code> returned <code>true</code> once more and replaced what <code>Text()</code> gives, which is " + scQ(ln) + " now. The previous line is gone: save it yourself if you need it."}});
     st.push({line:3, vars:[["sc.Text()", scQ(ln), "string"], ["n", String(i + 1), "int"]], out:out,
       note: i === 0
         ? {ru:"Считаем строки сами: у сканера счётчика нет.", en:"We count the lines ourselves: the scanner has no counter."}
         : {ru:"Счётчик стал " + (i + 1) + ".", en:"The counter is now " + (i + 1) + "."}});
     out += (i + 1) + " " + ln + "\n";
     st.push({line:4, vars:[["sc.Text()", scQ(ln), "string"], ["n", String(i + 1), "int"]], out:out,
       note: i === 0
         ? {ru:"Печатаем номер и строку.", en:"Printing the number and the line."}
         : {ru:"Строка " + (i + 1) + " напечатана.", en:"Line " + (i + 1) + " is printed."}});
   });
   st.push({line:2, vars:[["sc.Scan()", "false", "bool"], ["n", String(lines.length), "int"]], out:out,
     note:{ru:"Заголовок цикла выполнился ещё раз — и на этот раз впустую: данные кончились, <code>Scan</code> вернул <code>false</code>. Тело не выполняется, цикл остановился сам. Никакого <code>break</code> писать не надо.",
           en:"The loop header ran one more time — and this time for nothing: the input ran out and <code>Scan</code> returned <code>false</code>. The body does not run, the loop stopped by itself. No <code>break</code> needed."}});
   out += "строк: " + lines.length + "\n";
   st.push({line:6, vars:[["n", String(lines.length), "int"]], out:out,
     note:{ru:"Проходов было " + lines.length + " — по числу строк на входе. Если запустить без входных данных, сюда попадёшь сразу и увидишь <code>строк: 0</code>.",
           en:"There were " + lines.length + " passes — one per input line. Started with no input at all, you land here immediately and see <code>строк: 0</code>."}});
   return st;
 }
}
];

var OUTRO = {
 ru:`<p>Семь правил — это один и тот же круг, пройденный по трём источникам. Аргументы, файл и поток различаются только тем, откуда берутся данные и сколько их приходит за раз. Всё остальное совпадает: данные приходят текстом или байтами, вызов может не получиться, между «получил» и «использую» стоит проверка. Отсюда выводится каждое правило темы. <code>len</code> перед индексом — потому что количество задаёт не твой код. <code>strconv.Atoi</code> вместо арифметики — потому что снаружи пришёл текст, а не число. <code>string(data)</code> перед печатью — потому что из файла пришли байты, а не строка. <code>if err != nil</code> сразу после вызова — потому что до проверки первое значение ничего не значит. Stderr и ненулевой код — потому что о неудаче должны узнать и человек, и запустившая тебя программа.</p>
<p>Что ты теперь умеешь: принимать данные при запуске и не падать, если их не передали; превращать текст в числа и замечать, когда он числом не оказался; читать файл целиком и записывать его обратно; отличать результат работы от сообщения о проблеме и отправлять их в разные места; читать данные, которые приходят потоком и заранее неизвестны по длине. Этого хватает, чтобы программа перестала быть замкнутой на себе и начала работать с чужими данными.</p>
<p>Если из темы забудется всё, кроме одной мысли, пусть останется эта: <strong>всё, что пришло снаружи, — это текст или байты, и оно может оказаться не тем, что ты ждал</strong>. Из неё выводится и проверка длины, и <code>Atoi</code>, и <code>string(data)</code>, и вечное <code>if err != nil</code>. А когда программа с аргументами или файлами ведёт себя странно, первые два вопроса всегда одни и те же: сколько элементов пришло на самом деле и что лежало во втором возвращаемом значении.</p>`,
 en:`<p>The seven rules are one and the same loop, walked over three sources. Arguments, a file and a stream differ only in where the data comes from and how much of it arrives at once. Everything else matches: the data arrives as text or bytes, the call can fail, and a check stands between "received" and "using it". Every rule in the topic follows from that. <code>len</code> before indexing — because the count is set by code that is not yours. <code>strconv.Atoi</code> instead of arithmetic — because what came from outside is text, not a number. <code>string(data)</code> before printing — because what came out of the file is bytes, not a string. <code>if err != nil</code> right after the call — because before the check the first value means nothing. Stderr and a non-zero code — because both a person and the program that started you must learn about the failure.</p>
<p>What you can do now: take data at startup and survive when none was given; turn text into numbers and notice when it was never a number; read a whole file and write one back; tell a result apart from a report of a problem and send them to different places; read data that arrives as a stream of unknown length. That is enough for a program to stop being closed in on itself and start working on somebody else's data.</p>
<p>If everything from this topic fades except one thought, let it be this: <strong>whatever came from outside is text or bytes, and it may not be what you expected</strong>. The length check, <code>Atoi</code>, <code>string(data)</code> and the endless <code>if err != nil</code> all follow from it. And when a program dealing with arguments or files behaves strangely, the first two questions are always the same: how many elements actually arrived, and what was sitting in that second return value.</p>`
};
