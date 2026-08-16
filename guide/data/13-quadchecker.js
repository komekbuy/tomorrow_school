var META = {
  n: 13,
  slug: "13-quadchecker",
  eyebrow:{ru:"Go с нуля · тема 13 из 13", en:"Go from zero · topic 13 of 13"},
  title:  {ru:"Проект quadchecker", en:"The quadchecker project"},
  lede:{
    ru:"Программа получает готовый рисунок и говорит, кто его нарисовал. Обратная задача к <code>quad</code> — и решается она тем, что мы повторяем прямую.",
    en:"A program that receives a finished drawing and says who drew it. The reverse of <code>quad</code> — and it is solved by repeating the forward task."
  },
  folder: "quadchecker",
  txt: {ru:"go-tema-13-quadchecker.txt", en:"go-topic-13-quadchecker.txt"}
};

var INTRO = {
ru:`<p><strong>Что за задача.</strong> Программа получает готовый рисунок рамки — не аргументами, а по трубе — и должна назвать, какая из пяти функций <code>quad</code> могла его нарисовать и какого он размера.</p>
<pre><code>$ ./quadA 3 3 | go run .
[quadA] [3] [3]</code></pre>
<p>Слева <code>./quadA 3 3</code> нарисовал рамку. Палка <code>|</code> перекинула этот рисунок нашей программе на вход — то, что первая программа напечатала бы на экран, вместо экрана уехало второй. Наша программа рисунок прочитала и опознала.</p>
<p>Если картинка подошла нескольким фигурам сразу, перечислить все по алфавиту через <code>||</code>. Если не подошла ни одной — напечатать <code>Not a quad function</code>.</p>
<pre><code>$ ./quadC 1 1 | go run .
[quadC] [1] [1] || [quadD] [1] [1] || [quadE] [1] [1]

$ echo 0 0 | go run .
Not a quad function</code></pre>
<p><strong>Как решается.</strong> Соблазн здесь один: разглядывать пришедшие символы и по ним восстанавливать правило. Это тупик — частных случаев быстро становится больше, чем самих фигур. Работающая мысль обратная:</p>
<pre><code>берём квад -> рисуем им картинку ТОГО ЖЕ размера -> сравниваем посимвольно</code></pre>
<p>Совпало — этот квад мог такое нарисовать. Не совпало — не мог. Пять фигур, пять попыток, ни одной догадки. Размеры тоже не угадываются: высота — сколько строк пришло, ширина — длина строки.</p>
<p>Отсюда общий приём, ради которого эту задачу стоит понять: <strong>обратную задачу часто проще решить, повторив прямую</strong>. Не разбирать чужой результат, а воспроизвести свой и сравнить.</p>
<p>Программа получается на девяносто семь строк и раскладывается на четыре куска: описание фигуры, вопрос про одну клетку, сверка целой картинки и обвязка вокруг них. Ровно в таком порядке они и разобраны ниже.</p>`,
en:`<p><strong>The task.</strong> The program receives a finished frame drawing — not as arguments but through a pipe — and has to say which of the five <code>quad</code> functions could have drawn it, and at what size.</p>
<pre><code>$ ./quadA 3 3 | go run .
[quadA] [3] [3]</code></pre>
<p>On the left <code>./quadA 3 3</code> drew a frame. The pipe <code>|</code> handed that drawing to our program as input — what the first program would have printed on screen went to the second one instead. Our program read the drawing and recognised it.</p>
<p>If the picture fits several shapes at once, list them all alphabetically separated by <code>||</code>. If it fits none, print <code>Not a quad function</code>.</p>
<pre><code>$ ./quadC 1 1 | go run .
[quadC] [1] [1] || [quadD] [1] [1] || [quadE] [1] [1]

$ echo 0 0 | go run .
Not a quad function</code></pre>
<p><strong>How it is solved.</strong> There is one temptation here: to stare at the incoming characters and reconstruct the rule from them. That is a dead end — the special cases multiply faster than the shapes. The idea that works runs the other way:</p>
<pre><code>take a quad -> draw a picture of THE SAME size with it -> compare character by character</code></pre>
<p>A match means this quad could have drawn it. No match means it could not. Five shapes, five attempts, not a single guess. The dimensions are not guessed either: the height is how many lines arrived, the width is the length of a line.</p>
<p>Hence the general move worth taking from this task: <strong>a reverse problem is often easier to solve by repeating the forward one</strong>. Do not pick apart someone else's result — reproduce your own and compare.</p>
<p>The program comes out at ninety-seven lines and splits into four pieces: the description of a shape, the question about one cell, the check of a whole picture, and the plumbing around them. That is exactly the order they are taken apart in below.</p>`
};

/* ================= ПРАВИЛА ================= */
var RULES = [
{
 h:{ru:"quadchecker: узнать фигуру, нарисовав её самому",
    en:"quadchecker: recognise a shape by drawing it yourself"},
 b:{ru:`<p>Третья программа решает обратную задачу. Раньше по размерам получали картинку — теперь по картинке надо назвать, кто её нарисовал и какого она размера. Причём картинка приходит не аргументом, а по трубе: в записи <code>./quadA 3 3 | go run .</code> вывод первой программы становится вводом второй.</p>
<p>Соблазн здесь один: разглядывать пришедшие символы и по ним восстанавливать правило. Это тупик — частных случаев быстро становится больше, чем самих фигур. Работающая мысль обратная:</p>
<pre><code>берём квад -> рисуем им картинку ТОГО ЖЕ размера -> сравниваем посимвольно</code></pre>
<p>Совпало — этот квад мог такое нарисовать. Не совпало — не мог. Пять фигур, пять попыток, ни одной догадки. Размеры тоже не угадываются: высота — сколько строк пришло, ширина — длина строки.</p>
<p>Вся разница между фигурами — это шесть символов, поэтому таблица различий целиком влезает в структуру:</p>
<pre><code>type quad struct {
	name string
	tl   rune   <span class="cm">// левый верхний угол</span>
	tr   rune   <span class="cm">// правый верхний</span>
	bl   rune   <span class="cm">// левый нижний</span>
	br   rune   <span class="cm">// правый нижний</span>
	hor  rune   <span class="cm">// горизонтальная сторона</span>
	ver  rune   <span class="cm">// вертикальная</span>
}</code></pre>
<p>Тип <code>rune</code>, а не <code>string</code>, потому что в клетке всегда ровно один символ — со строкой пришлось бы каждый раз доставать нулевой элемент.</p>
<p>А само рисование сводится к одному вопросу: какой символ стоит в клетке (row, col)? И вот здесь <strong>порядок проверок важнее самих проверок</strong>:</p>
<pre><code>if row == 0 &amp;&amp; col == 0   { return q.tl }
if row == 0 &amp;&amp; col == w-1 { return q.tr }
if row == h-1 &amp;&amp; col == 0 { return q.bl }
if row == h-1 &amp;&amp; col == w-1 { return q.br }
if row == 0 || row == h-1 { return q.hor }
if col == 0 || col == w-1 { return q.ver }
return ' '</code></pre>
<p>Смотри, что этот порядок даёт при ширине 1. Там <code>col == 0</code> и <code>col == w-1</code> — одна и та же клетка, оба условия истинны сразу. Побеждает то, что стоит выше, то есть левый угол. Ровно поэтому <code>quadE 1 2</code> печатает <code>A</code>, потом <code>C</code>, а не <code>A</code> и <code>A</code>. Переставь два <code>if</code> местами — и пример из условия перестанет сходиться.</p>
<p>Сама сверка после этого короткая: собрать строку из вызовов <code>cell</code> и сравнить с настоящей. Не совпало — выходим сразу, остальные строки смотреть незачем. <code>return true</code> стоит <strong>после</strong> цикла: сюда попадаем, только если ни одна строка не подвела.</p>`,
    en:`<p>The third program solves the reverse task. Before, dimensions gave you a picture — now a picture has to tell you who drew it and at what size. And the picture does not arrive as an argument but through a pipe: in <code>./quadA 3 3 | go run .</code> the first program's output becomes the second one's input.</p>
<p>There is one temptation here: to stare at the incoming characters and reconstruct the rule from them. That is a dead end — the special cases multiply faster than the shapes themselves. The idea that works runs the other way:</p>
<pre><code>take a quad -> draw a picture of THE SAME size with it -> compare character by character</code></pre>
<p>A match means this quad could have drawn it. No match means it could not. Five shapes, five attempts, not a single guess. The dimensions are not guessed either: the height is how many lines arrived, the width is the length of a line.</p>
<p>The entire difference between the shapes is six characters, so the whole table of differences fits inside a struct:</p>
<pre><code>type quad struct {
	name string
	tl   rune   <span class="cm">// top-left corner</span>
	tr   rune   <span class="cm">// top-right</span>
	bl   rune   <span class="cm">// bottom-left</span>
	br   rune   <span class="cm">// bottom-right</span>
	hor  rune   <span class="cm">// horizontal side</span>
	ver  rune   <span class="cm">// vertical side</span>
}</code></pre>
<p><code>rune</code> rather than <code>string</code>, because a cell always holds exactly one character — with a string you would be pulling out element zero every single time.</p>
<p>The drawing itself comes down to one question: which character sits in cell (row, col)? And here <strong>the order of the checks matters more than the checks</strong>:</p>
<pre><code>if row == 0 &amp;&amp; col == 0   { return q.tl }
if row == 0 &amp;&amp; col == w-1 { return q.tr }
if row == h-1 &amp;&amp; col == 0 { return q.bl }
if row == h-1 &amp;&amp; col == w-1 { return q.br }
if row == 0 || row == h-1 { return q.hor }
if col == 0 || col == w-1 { return q.ver }
return ' '</code></pre>
<p>Look at what this order does when the width is 1. There <code>col == 0</code> and <code>col == w-1</code> are the same cell, and both conditions are true at once. Whichever stands higher wins — the left corner. That is exactly why <code>quadE 1 2</code> prints <code>A</code> and then <code>C</code>, not <code>A</code> and <code>A</code>. Swap those two <code>if</code>s and the example from the task stops matching.</p>
<p>The comparison itself is short after that: build a line out of <code>cell</code> calls and compare it with the real one. No match — leave immediately, the remaining lines are pointless. <code>return true</code> stands <strong>after</strong> the loop: you only get there if not a single line let you down.</p>`}
},

{
 h:{ru:"match: собрать строку и сравнить, выйти на первом расхождении",
    en:"match: build a line, compare it, leave at the first mismatch"},
 b:{ru:`<p><code>cell</code> отвечает про одну клетку. <code>match</code> берёт целую картинку и отвечает на вопрос: <strong>мог ли этот квад её нарисовать?</strong> Да или нет, третьего нет — поэтому тип возврата <code>bool</code>.</p>
<pre><code>func match(q quad, lines []string, w, h int) bool {
	for row := 0; row &lt; h; row++ {
		line := make([]rune, w)
		for col := 0; col &lt; w; col++ {
			line[col] = cell(q, row, col, w, h)
		}
		if string(line) != lines[row] {
			return false
		}
	}
	return true
}</code></pre>
<p>Работа идёт построчно. Для каждой строки картинки собирается то, что <strong>должен был бы</strong> нарисовать этот квад: <code>make([]rune, w)</code> готовит место сразу на всю строку, внутренний цикл заполняет его вызовами <code>cell</code>.</p>
<p>Дальше собранное сравнивается с настоящим: <code>string(line) != lines[row]</code>. Превращение в строку нужно потому, что срез рун со строкой напрямую не сравнивается — это разные типы.</p>
<p><strong>Два <code>return</code> стоят в разных местах, и это не случайность:</strong></p>
<div class="tablewrap"><table>
<tr><th>что говорим</th><th>где стоит</th><th>почему</th></tr>
<tr><td><code>return false</code></td><td><strong>внутри</strong> цикла</td><td>чтобы сказать «не совпало», хватает <strong>одной</strong> непохожей строки. Смотреть остальные незачем</td></tr>
<tr><td><code>return true</code></td><td><strong>после</strong> цикла</td><td>чтобы сказать «совпало», надо проверить <strong>все</strong> строки. Раньше это утверждать нельзя</td></tr>
</table></div>
<p>Поставь <code>return true</code> внутрь цикла — функция согласится на первой же совпавшей строке и начнёт врать. Это ровно та ошибка, из-за которой на экзамене теряют часы: <em>условие проверено не до конца, а результат уже отдан</em>.</p>
<p>Ранний выход ещё и экономит работу: если картинка 9 на 9, а первая же строка не сошлась, мы не станем считать оставшиеся 72 клетки.</p>`,
    en:`<p><code>cell</code> answers about one cell. <code>match</code> takes a whole picture and answers: <strong>could this quad have drawn it?</strong> Yes or no, nothing in between — hence the <code>bool</code> return type.</p>
<pre><code>func match(q quad, lines []string, w, h int) bool {
	for row := 0; row &lt; h; row++ {
		line := make([]rune, w)
		for col := 0; col &lt; w; col++ {
			line[col] = cell(q, row, col, w, h)
		}
		if string(line) != lines[row] {
			return false
		}
	}
	return true
}</code></pre>
<p>The work goes line by line. For every row of the picture we build what this quad <strong>would have</strong> drawn: <code>make([]rune, w)</code> reserves room for the whole line at once, and the inner loop fills it with <code>cell</code> calls.</p>
<p>Then the built line is compared with the real one: <code>string(line) != lines[row]</code>. The conversion is needed because a rune slice cannot be compared with a string directly — different types.</p>
<p><strong>The two <code>return</code>s sit in different places, and that is deliberate:</strong></p>
<div class="tablewrap"><table>
<tr><th>what we claim</th><th>where it sits</th><th>why</th></tr>
<tr><td><code>return false</code></td><td><strong>inside</strong> the loop</td><td>to say "no match" <strong>one</strong> different line is enough. There is no point looking at the rest</td></tr>
<tr><td><code>return true</code></td><td><strong>after</strong> the loop</td><td>to say "it matches" you must check <strong>every</strong> line. You cannot claim it earlier</td></tr>
</table></div>
<p>Put <code>return true</code> inside the loop and the function agrees at the first matching line and starts lying. That is exactly the mistake that costs hours in an exam: <em>the condition was not checked to the end, but the result was already handed out</em>.</p>
<p>The early exit also saves work: if the picture is 9 by 9 and the very first line does not match, the remaining 72 cells are never computed.</p>`}
},

{
 h:{ru:"quadchecker: алфавит без сортировки и разделитель ||",
    en:"quadchecker: alphabetical order without sorting, and the || separator"},
 b:{ru:`<p>Вход читается построчно, и читалка сама снимает переносы:</p>
<pre><code>sc := bufio.NewScanner(os.Stdin)
for sc.Scan() {
	lines = append(lines, sc.Text())
}</code></pre>
<p><code>sc.Text()</code> отдаёт строку <strong>без</strong> символа переноса, поэтому обрезать ничего не надо. Если вход пустой, цикл не сделает ни шага — это нормальный случай, он обработается ниже.</p>
<p>Дальше три условия, без которых программа врала бы: строк должно быть хоть сколько-то, ширина не ноль, и <strong>все строки одной длины</strong>. Последнее — не мелочь. Ширину мы взяли у первой строки; если вторая короче, прямоугольника нет вообще. Пример из условия с <code>o--o</code>, <code>|</code> и <code>o</code> отсекается именно здесь, ещё до перебора.</p>
<p>Перебор идёт по списку, а список записан от A до E:</p>
<pre><code>for _, q := range quads {
	if match(q, lines, w, h) {
		if res != "" {
			res += " || "
		}
		res += fmt.Sprintf("[%s] [%d] [%d]", q.name, w, h)
	}
}</code></pre>
<p>Отсюда бесплатно получается требование «вывести по алфавиту» — <strong>сортировки в коде нет и не нужно</strong>. Совпадения дописываются в том порядке, в каком встретились, а встречаются они по алфавиту, потому что так лежит список. Это общий приём: если данные заранее разложены правильно, сортировать нечего.</p>
<p>Разделитель ставится <strong>перед</strong> очередным куском и только если в строке уже что-то есть. Так между кусками он появляется, а в конце его нет:</p>
<pre><code>res = ""
quadC совпал -> res пустая, разделитель не ставим -> "[quadC] [1] [1]"
quadD совпал -> res не пустая -> " || " -> "[quadC] [1] [1] || [quadD] [1] [1]"</code></pre>
<p>Если ставить <code>" || "</code> после каждого куска, в конце останется лишний хвост, который придётся обрезать отдельной строкой кода.</p>
<p>И последнее: <code>res</code> осталась пустой — значит не подошёл никто, печатаем <code>Not a quad function</code>. Через <code>fmt.Println</code>, а не <code>Print</code>, потому что задание требует перенос строки в конце <em>любого</em> ответа.</p>`,
    en:`<p>The input is read line by line, and the reader strips the newlines itself:</p>
<pre><code>sc := bufio.NewScanner(os.Stdin)
for sc.Scan() {
	lines = append(lines, sc.Text())
}</code></pre>
<p><code>sc.Text()</code> hands back the line <strong>without</strong> its newline character, so there is nothing to trim. If the input is empty the loop takes no steps at all — a normal case, handled below.</p>
<p>Then come three conditions without which the program would lie: there must be at least some lines, the width must not be zero, and <strong>every line must be the same length</strong>. That last one is not a detail. The width was taken from the first line; if the second is shorter there is no rectangle at all. The example from the task with <code>o--o</code>, <code>|</code> and <code>o</code> is rejected right here, before any comparison starts.</p>
<p>The scan walks the list, and the list is written from A to E:</p>
<pre><code>for _, q := range quads {
	if match(q, lines, w, h) {
		if res != "" {
			res += " || "
		}
		res += fmt.Sprintf("[%s] [%d] [%d]", q.name, w, h)
	}
}</code></pre>
<p>That gives you the "print them alphabetically" requirement for free — <strong>there is no sorting in the code and none is needed</strong>. Matches are appended in the order they are met, and they are met alphabetically because that is how the list lies. It is a general move: if the data is laid out right in advance, there is nothing to sort.</p>
<p>The separator goes <strong>before</strong> the next piece, and only if the string already holds something. That way it appears between pieces and never at the end:</p>
<pre><code>res = ""
quadC matched -> res is empty, no separator -> "[quadC] [1] [1]"
quadD matched -> res is not empty -> " || " -> "[quadC] [1] [1] || [quadD] [1] [1]"</code></pre>
<p>Put <code>" || "</code> after every piece instead and you are left with a trailing tail to cut off with an extra line of code.</p>
<p>And finally: <code>res</code> stayed empty means nobody fit, so we print <code>Not a quad function</code>. With <code>fmt.Println</code> rather than <code>Print</code>, because the task requires a newline at the end of <em>every</em> answer.</p>`}
},

{
 h:{ru:"Почему всё названо именно так",
    en:"Why everything is named the way it is"},
 b:{ru:`<p>Имена — это половина понимания чужого кода. Компилятору всё равно, как называются переменные; их читают люди, и читают первый раз в жизни. Ниже — что означает каждое имя в quadchecker и почему выбрано именно оно.</p>
<h3>Поля структуры</h3>
<div class="tablewrap"><table>
<tr><th>поле</th><th>от чего</th><th>что значит</th></tr>
<tr><td><code>tl</code></td><td><b>t</b>op-<b>l</b>eft</td><td>левый верхний угол</td></tr>
<tr><td><code>tr</code></td><td><b>t</b>op-<b>r</b>ight</td><td>правый верхний</td></tr>
<tr><td><code>bl</code></td><td><b>b</b>ottom-<b>l</b>eft</td><td>левый нижний</td></tr>
<tr><td><code>br</code></td><td><b>b</b>ottom-<b>r</b>ight</td><td>правый нижний</td></tr>
<tr><td><code>hor</code></td><td><b>hor</b>izontal</td><td>горизонтальная сторона</td></tr>
<tr><td><code>ver</code></td><td><b>ver</b>tical</td><td>вертикальная сторона</td></tr>
</table></div>
<p>Сокращённо — потому что эти шесть имён повторяются в <code>cell</code> по одному разу подряд, и полные названия раздули бы каждую строку.</p>
<h3>Параметры</h3>
<div class="tablewrap"><table>
<tr><th>имя</th><th>от чего</th><th>что это</th></tr>
<tr><td><code>q</code></td><td><b>q</b>uad</td><td>какой квад спрашиваем</td></tr>
<tr><td><code>row</code>, <code>col</code></td><td>row, <b>col</b>umn</td><td>адрес клетки: строка и столбец</td></tr>
<tr><td><code>w</code>, <code>h</code></td><td><b>w</b>idth, <b>h</b>eight</td><td>размеры всей картинки</td></tr>
<tr><td><code>lines</code></td><td>lines</td><td>картинка, пришедшая на вход: один элемент слайса — одна строка</td></tr>
<tr><td><code>res</code></td><td><b>res</b>ult</td><td>ответ, который собираем по кускам</td></tr>
</table></div>
<p>Правило, по которому выбирается длина: <strong>чем дольше живёт имя и чем менее оно очевидно, тем длиннее</strong>. <code>w</code> и <code>h</code> понимают все и живут внутри одной маленькой функции. А <code>row</code> и <code>col</code> не сокращены до <code>r</code> и <code>c</code> специально: <code>r</code> в Go сплошь и рядом означает <code>rune</code>, и перепутать было бы легко.</p>
<h3>Функции</h3>
<div class="tablewrap"><table>
<tr><th>имя</th><th>почему так</th></tr>
<tr><td><code>cell</code></td><td>«клетка». Функция целиком про одну клетку: дали адрес — вернула содержимое. Возвращает вещь, поэтому названа существительным</td></tr>
<tr><td><code>match</code></td><td>«совпадение». Возвращает да/нет, и вызов читается как утверждение: <code>if match(...)</code> — «совпадает?»</td></tr>
<tr><td><code>canPlace</code> (sudoku)</td><td>«можно поставить?» — тоже да/нет, тоже читается вопросом</td></tr>
<tr><td><code>solve</code>, <code>printBoard</code> (sudoku)</td><td>эти <strong>делают</strong> работу, поэтому названы глаголами</td></tr>
</table></div>
<p>Приём общий: <strong>функция, возвращающая да/нет, называется так, чтобы её вызов читался как утверждение</strong>, а функция, которая что-то делает, — глаголом.</p>
<p>Что было бы хуже для <code>match</code>: <code>check</code> — проверяет что именно? <code>compare</code> — сравнить, а что вернёт, что больше? <code>isQuad</code> — врёт, она не про «квад ли это вообще», а про конкретный квад.</p>
<p><strong>Имена можно поменять под себя</strong> — компилятору всё равно. Но менять надо <em>везде</em>, где имя встречается, иначе программа не соберётся.</p>`,
    en:`<p>Names are half of understanding someone else's code. The compiler does not care what your variables are called; people read them, and they read them for the first time. Below is what every name in quadchecker means and why it was chosen.</p>
<h3>Struct fields</h3>
<div class="tablewrap"><table>
<tr><th>field</th><th>from</th><th>meaning</th></tr>
<tr><td><code>tl</code></td><td><b>t</b>op-<b>l</b>eft</td><td>top-left corner</td></tr>
<tr><td><code>tr</code></td><td><b>t</b>op-<b>r</b>ight</td><td>top-right</td></tr>
<tr><td><code>bl</code></td><td><b>b</b>ottom-<b>l</b>eft</td><td>bottom-left</td></tr>
<tr><td><code>br</code></td><td><b>b</b>ottom-<b>r</b>ight</td><td>bottom-right</td></tr>
<tr><td><code>hor</code></td><td><b>hor</b>izontal</td><td>the horizontal side</td></tr>
<tr><td><code>ver</code></td><td><b>ver</b>tical</td><td>the vertical side</td></tr>
</table></div>
<p>Abbreviated because these six names appear one after another inside <code>cell</code>, and full words would bloat every line.</p>
<h3>Parameters</h3>
<div class="tablewrap"><table>
<tr><th>name</th><th>from</th><th>what it is</th></tr>
<tr><td><code>q</code></td><td><b>q</b>uad</td><td>which quad we are asking about</td></tr>
<tr><td><code>row</code>, <code>col</code></td><td>row, <b>col</b>umn</td><td>the address of a cell</td></tr>
<tr><td><code>w</code>, <code>h</code></td><td><b>w</b>idth, <b>h</b>eight</td><td>the size of the whole picture</td></tr>
<tr><td><code>lines</code></td><td>lines</td><td>the incoming picture: one slice element is one line</td></tr>
<tr><td><code>res</code></td><td><b>res</b>ult</td><td>the answer being assembled piece by piece</td></tr>
</table></div>
<p>The rule that decides the length: <strong>the longer a name lives and the less obvious it is, the longer it should be</strong>. Everyone understands <code>w</code> and <code>h</code>, and they live inside one small function. But <code>row</code> and <code>col</code> are deliberately not shortened to <code>r</code> and <code>c</code>: in Go <code>r</code> very often means <code>rune</code>, and the two would be easy to confuse.</p>
<h3>Functions</h3>
<div class="tablewrap"><table>
<tr><th>name</th><th>why</th></tr>
<tr><td><code>cell</code></td><td>"cell". The function is entirely about one cell: give it an address, it returns the contents. It returns a thing, so it is named with a noun</td></tr>
<tr><td><code>match</code></td><td>"a match". It returns yes/no, and the call reads as a statement: <code>if match(...)</code> — "does it match?"</td></tr>
<tr><td><code>canPlace</code> (sudoku)</td><td>"can it be placed?" — also yes/no, also reads as a question</td></tr>
<tr><td><code>solve</code>, <code>printBoard</code> (sudoku)</td><td>these <strong>do</strong> work, so they are verbs</td></tr>
</table></div>
<p>The general move: <strong>a function returning yes/no is named so that its call reads as a statement</strong>, and a function that does something is named with a verb.</p>
<p>What would be worse for <code>match</code>: <code>check</code> — checks what exactly? <code>compare</code> — compare, and return what, which is bigger? <code>isQuad</code> — it lies, it is not about "is this a quad at all" but about one specific quad.</p>
<p><strong>You can rename anything to suit yourself</strong> — the compiler does not care. But rename it <em>everywhere</em> it appears, or the program will not build.</p>`}
},

{
 h:{ru:"Полный код: quadchecker целиком",
    en:"The full code: quadchecker from top to bottom"},
 b:{ru:`<p>Девяносто семь строк. Порядок в файле не случайный — каждый следующий кусок пользуется предыдущим, поэтому читая сверху вниз ты нигде не встречаешь незнакомого имени.</p>
<pre><code>package main

import (
	&quot;bufio&quot;
	&quot;fmt&quot;
	&quot;os&quot;
)

type quad struct {
	name string
	tl   rune
	tr   rune
	bl   rune
	br   rune
	hor  rune
	ver  rune
}

var quads = []quad{
	{&quot;quadA&quot;, &#x27;o&#x27;, &#x27;o&#x27;, &#x27;o&#x27;, &#x27;o&#x27;, &#x27;-&#x27;, &#x27;|&#x27;},
	{&quot;quadB&quot;, &#x27;/&#x27;, &#x27;\\&#x27;, &#x27;\\&#x27;, &#x27;/&#x27;, &#x27;*&#x27;, &#x27;*&#x27;},
	{&quot;quadC&quot;, &#x27;A&#x27;, &#x27;A&#x27;, &#x27;C&#x27;, &#x27;C&#x27;, &#x27;B&#x27;, &#x27;B&#x27;},
	{&quot;quadD&quot;, &#x27;A&#x27;, &#x27;C&#x27;, &#x27;A&#x27;, &#x27;C&#x27;, &#x27;B&#x27;, &#x27;B&#x27;},
	{&quot;quadE&quot;, &#x27;A&#x27;, &#x27;C&#x27;, &#x27;C&#x27;, &#x27;A&#x27;, &#x27;B&#x27;, &#x27;B&#x27;},
}

func cell(q quad, row, col, w, h int) rune {
	if row == 0 &amp;&amp; col == 0 {
		return q.tl
	}
	if row == 0 &amp;&amp; col == w-1 {
		return q.tr
	}
	if row == h-1 &amp;&amp; col == 0 {
		return q.bl
	}
	if row == h-1 &amp;&amp; col == w-1 {
		return q.br
	}
	if row == 0 || row == h-1 {
		return q.hor
	}
	if col == 0 || col == w-1 {
		return q.ver
	}
	return &#x27; &#x27;
}

func match(q quad, lines []string, w, h int) bool {
	for row := 0; row &lt; h; row++ {
		line := make([]rune, w)
		for col := 0; col &lt; w; col++ {
			line[col] = cell(q, row, col, w, h)
		}
		if string(line) != lines[row] {
			return false
		}
	}
	return true
}

func main() {
	lines := []string{}
	sc := bufio.NewScanner(os.Stdin)
	for sc.Scan() {
		lines = append(lines, sc.Text())
	}

	h := len(lines)
	w := 0
	same := true
	if h &gt; 0 {
		w = len(lines[0])
		for _, l := range lines {
			if len(l) != w {
				same = false
			}
		}
	}

	res := &quot;&quot;
	if h &gt; 0 &amp;&amp; w &gt; 0 &amp;&amp; same {
		for _, q := range quads {
			if match(q, lines, w, h) {
				if res != &quot;&quot; {
					res += &quot; || &quot;
				}
				res += fmt.Sprintf(&quot;[%s] [%d] [%d]&quot;, q.name, w, h)
			}
		}
	}

	if res == &quot;&quot; {
		res = &quot;Not a quad function&quot;
	}
	fmt.Println(res)
}</code></pre>
<div class="tablewrap"><table>
<tr><th>кусок</th><th>что делает</th></tr>
<tr><td><code>type quad struct</code></td><td>описание одной фигуры: имя и шесть символов. Ничего не создаёт, только объявляет тип</td></tr>
<tr><td><code>var quads</code></td><td>таблица всех пяти. Записана от A до E — отсюда алфавитный порядок в ответе без всякой сортировки</td></tr>
<tr><td><code>cell</code></td><td>какой символ стоял бы в клетке (row, col). Смотрит на <strong>адрес</strong>, а не на символы</td></tr>
<tr><td><code>match</code></td><td>мог ли этот квад нарисовать эту картинку. Собирает строку и сравнивает с настоящей</td></tr>
<tr><td><code>main</code></td><td>прочитать вход, посчитать размеры, перебрать пять квадов, собрать ответ</td></tr>
</table></div>
<p>Обрати внимание на три условия перед перебором: <code>h &gt; 0 &amp;&amp; w &gt; 0 &amp;&amp; same</code>. Они отсекают пустой ввод и рваные строки <strong>до</strong> того, как начнётся сравнение. Именно здесь отваливается пример из условия с <code>o--o</code>, <code>|</code>, <code>o</code>.</p>`,
    en:`<p>Ninety-seven lines. The order inside the file is not accidental — each piece uses the one above it, so reading top to bottom you never meet an unfamiliar name.</p>
<pre><code>package main

import (
	&quot;bufio&quot;
	&quot;fmt&quot;
	&quot;os&quot;
)

type quad struct {
	name string
	tl   rune
	tr   rune
	bl   rune
	br   rune
	hor  rune
	ver  rune
}

var quads = []quad{
	{&quot;quadA&quot;, &#x27;o&#x27;, &#x27;o&#x27;, &#x27;o&#x27;, &#x27;o&#x27;, &#x27;-&#x27;, &#x27;|&#x27;},
	{&quot;quadB&quot;, &#x27;/&#x27;, &#x27;\\&#x27;, &#x27;\\&#x27;, &#x27;/&#x27;, &#x27;*&#x27;, &#x27;*&#x27;},
	{&quot;quadC&quot;, &#x27;A&#x27;, &#x27;A&#x27;, &#x27;C&#x27;, &#x27;C&#x27;, &#x27;B&#x27;, &#x27;B&#x27;},
	{&quot;quadD&quot;, &#x27;A&#x27;, &#x27;C&#x27;, &#x27;A&#x27;, &#x27;C&#x27;, &#x27;B&#x27;, &#x27;B&#x27;},
	{&quot;quadE&quot;, &#x27;A&#x27;, &#x27;C&#x27;, &#x27;C&#x27;, &#x27;A&#x27;, &#x27;B&#x27;, &#x27;B&#x27;},
}

func cell(q quad, row, col, w, h int) rune {
	if row == 0 &amp;&amp; col == 0 {
		return q.tl
	}
	if row == 0 &amp;&amp; col == w-1 {
		return q.tr
	}
	if row == h-1 &amp;&amp; col == 0 {
		return q.bl
	}
	if row == h-1 &amp;&amp; col == w-1 {
		return q.br
	}
	if row == 0 || row == h-1 {
		return q.hor
	}
	if col == 0 || col == w-1 {
		return q.ver
	}
	return &#x27; &#x27;
}

func match(q quad, lines []string, w, h int) bool {
	for row := 0; row &lt; h; row++ {
		line := make([]rune, w)
		for col := 0; col &lt; w; col++ {
			line[col] = cell(q, row, col, w, h)
		}
		if string(line) != lines[row] {
			return false
		}
	}
	return true
}

func main() {
	lines := []string{}
	sc := bufio.NewScanner(os.Stdin)
	for sc.Scan() {
		lines = append(lines, sc.Text())
	}

	h := len(lines)
	w := 0
	same := true
	if h &gt; 0 {
		w = len(lines[0])
		for _, l := range lines {
			if len(l) != w {
				same = false
			}
		}
	}

	res := &quot;&quot;
	if h &gt; 0 &amp;&amp; w &gt; 0 &amp;&amp; same {
		for _, q := range quads {
			if match(q, lines, w, h) {
				if res != &quot;&quot; {
					res += &quot; || &quot;
				}
				res += fmt.Sprintf(&quot;[%s] [%d] [%d]&quot;, q.name, w, h)
			}
		}
	}

	if res == &quot;&quot; {
		res = &quot;Not a quad function&quot;
	}
	fmt.Println(res)
}</code></pre>
<div class="tablewrap"><table>
<tr><th>piece</th><th>what it does</th></tr>
<tr><td><code>type quad struct</code></td><td>the description of one shape: a name and six characters. It creates nothing, it only declares a type</td></tr>
<tr><td><code>var quads</code></td><td>the table of all five. Written from A to E — hence the alphabetical answer with no sorting at all</td></tr>
<tr><td><code>cell</code></td><td>which character would sit in cell (row, col). It looks at the <strong>address</strong>, not at characters</td></tr>
<tr><td><code>match</code></td><td>could this quad have drawn this picture. Builds a line and compares it with the real one</td></tr>
<tr><td><code>main</code></td><td>read the input, work out the size, scan the five quads, assemble the answer</td></tr>
</table></div>
<p>Note the three conditions before the scan: <code>h &gt; 0 &amp;&amp; w &gt; 0 &amp;&amp; same</code>. They reject empty input and ragged lines <strong>before</strong> any comparison starts. This is exactly where the example from the task with <code>o--o</code>, <code>|</code>, <code>o</code> falls out.</p>`}
}
];

/* ================= ТАБЛИЦА ================= */
var TABLE = {
  title:{ru:"Пять фигур — одна логика", en:"Five shapes, one logic"},
  intro:{ru:"Циклы и условия во всех пяти одинаковые. Отличаются только символы, которые попадают в fmt.Print. Отсюда и способ написать пятую: скопировать первую и заменить шесть значений. Эта же таблица — целиком структура quad в quadchecker: шесть полей, по одному на столбец.",
         en:"The loops and conditions are identical in all five. Only the characters that end up inside fmt.Print differ. Hence the way to write the fifth one: copy the first and replace six values. This same table is the entire quad struct in quadchecker: six fields, one per column."},
  head:{ru:["Фигура","Верх-лево","Верх-право","Низ-лево","Низ-право","Горизонталь","Вертикаль"],
        en:["Shape","Top-left","Top-right","Bottom-left","Bottom-right","Horizontal","Vertical"]},
  rows:[
    ["quadA","o","o","o","o","-","|"],
    ["quadB","/","\\","\\","/","*","*"],
    ["quadC","A","A","C","C","B","B"],
    ["quadD","A","C","A","C","B","B"],
    ["quadE","A","C","C","A","B","B"]
  ]
};

/* ================= ГРАБЛИ ================= */
var TRAPS = [
 {ru:"<strong>Порядок проверок углов в <code>cell</code>.</strong> При ширине 1 условия <code>col == 0</code> и <code>col == w-1</code> истинны одновременно — это одна и та же клетка. Побеждает то, что записано выше. Переставь левый и правый угол местами, и <code>quadE 1 2</code> напечатает <code>C</code> и <code>A</code> вместо <code>A</code> и <code>C</code>. Пример из условия перестанет сходиться.",
  en:"<strong>The order of the corner checks in <code>cell</code>.</strong> At width 1 the conditions <code>col == 0</code> and <code>col == w-1</code> are true at the same time — it is the same cell. Whichever stands higher wins. Swap the left and right corners and <code>quadE 1 2</code> prints <code>C</code> then <code>A</code> instead of <code>A</code> then <code>C</code>. The example from the task stops matching."},

 {ru:"<strong>Ширина берётся у первой строки.</strong> Без проверки «все строки одной длины» программа посчитает ширину по первой, а остальные молча не совпадут. Ответ окажется верным случайно, а не по правилу. Рваный ввод надо отсекать <strong>до</strong> перебора — это и есть пример <code>o--o</code> / <code>|</code> / <code>o</code> из условия.",
  en:"<strong>The width is taken from the first line.</strong> Without an \"all lines are the same length\" check the program measures the width by the first one and the rest silently fail to match. The answer comes out right by accident, not by rule. Ragged input must be rejected <strong>before</strong> the scan — that is the <code>o--o</code> / <code>|</code> / <code>o</code> example from the task."},

 {ru:"<strong><code>sc.Text()</code> уже снял перенос строки.</strong> Обрезать его второй раз нечего, а вот <em>добавить</em> свой <code>\\n</code> к строке — верный способ развалить сравнение: собранная строка окажется на символ длиннее пришедшей, и не совпадёт ни один квад.",
  en:"<strong><code>sc.Text()</code> has already stripped the newline.</strong> There is nothing left to trim, but <em>adding</em> your own <code>\\n</code> to a line is a sure way to break the comparison: the built line ends up one character longer than the incoming one and no quad matches."},

 {ru:"<strong>Разделитель после куска оставляет хвост.</strong> Если писать <code>res += \"[quadC] ... \" + \" || \"</code> после каждого совпадения, в конце строки останется висячее <code>||</code>, которое придётся отдельно обрезать. Ставь разделитель <strong>перед</strong> куском и только если в строке уже что-то есть.",
  en:"<strong>A separator after each piece leaves a tail.</strong> Writing <code>res += \"[quadC] ... \" + \" || \"</code> after every match leaves a dangling <code>||</code> at the end that has to be trimmed separately. Put the separator <strong>before</strong> the piece, and only if the string already holds something."},

 {ru:"<strong><code>len(строки)</code> — это байты, а не символы.</strong> На рамках из <code>o</code>, <code>-</code> и <code>|</code> разницы нет: все они по одному байту. Но стоит подать картинку с кириллицей или юникодом, и ширина посчитается неверно. Здесь это безопасно ровно потому, что все пять фигур состоят из однобайтовых символов — и это стоит понимать, а не считать везде верным.",
  en:"<strong><code>len(string)</code> is bytes, not characters.</strong> For frames made of <code>o</code>, <code>-</code> and <code>|</code> it makes no difference: all are one byte each. But feed in a picture with Cyrillic or any Unicode and the width comes out wrong. It is safe here precisely because all five shapes use single-byte characters — worth understanding rather than assuming it always holds."},

 {ru:"<strong>Пустой ввод — это не ошибка программы.</strong> Если в трубу ничего не пришло, цикл чтения не сделает ни шага, <code>h</code> останется нулём, и правильный ответ — <code>Not a quad function</code>. Забыть проверку <code>h &gt; 0</code> и полезть в <code>lines[0]</code> — это падение на ровном месте.",
  en:"<strong>Empty input is not a program error.</strong> If nothing came through the pipe the read loop takes no steps, <code>h</code> stays zero, and the correct answer is <code>Not a quad function</code>. Forgetting the <code>h &gt; 0</code> check and reaching into <code>lines[0]</code> is a crash for no reason."}
];

/* ================= ПРИМЕРЫ ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

type quad struct {
	name string
	tl   rune
}

func main() {
	a := quad{name: "quadA", tl: 'o'}
	fmt.Println(a.name)
}`,
 out:"quadA",
 why:{ru:"<code>type ... struct</code> ничего не создаёт — он объявляет тип. Переменная появляется строкой <code>a := quad{...}</code>. К полю обращаемся через точку: <code>a.name</code>.<br><b>Сломай:</b> напиши <code>a.quad</code> и прочитай ошибку.",
      en:"<code>type ... struct</code> creates nothing — it declares a type. The variable appears at <code>a := quad{...}</code>. Fields are reached through a dot: <code>a.name</code>.<br><b>Break it:</b> write <code>a.quad</code> and read the error."}
},
{
 chg:{ru:"печатаем и второе поле", en:"we print the second field too"},
 code:`package main

import "fmt"

type quad struct {
	name string
	tl   rune
}

func main() {
	a := quad{name: "quadA", tl: 'o'}
	fmt.Println(a.name)
	fmt.Println(a.tl)
}`,
 out:"quadA\n111",
 why:{ru:"Второе поле напечаталось <b>числом</b>. <code>rune</code> — это число, код символа; у буквы «o» он равен 111. Никакой ошибки здесь нет, так и устроено.",
      en:"The second field printed as a <b>number</b>. A <code>rune</code> is a number, the code of a character; for \"o\" it is 111. Nothing is wrong — that is how it works."}
},
{
 chg:{ru:"ту же руну показали символом", en:"the same rune shown as a character"},
 code:`package main

import "fmt"

type quad struct {
	name string
	tl   rune
}

func main() {
	a := quad{name: "quadA", tl: 'o'}
	fmt.Println(a.tl)
	fmt.Println(string(a.tl))
}`,
 out:"111\no",
 why:{ru:"<code>string(...)</code> превращает число в символ с таким кодом. Значение в памяти не изменилось — изменился только способ его показать.",
      en:"<code>string(...)</code> turns the number into the character with that code. The value in memory did not change — only the way it is shown."}
},
{
 chg:{ru:"структур стало несколько — появился слайс", en:"several structs now — a slice appears"},
 code:`package main

import "fmt"

type quad struct {
	name string
	tl   rune
}

func main() {
	quads := []quad{
		{"quadA", 'o'},
		{"quadB", '/'},
	}
	for _, q := range quads {
		fmt.Println(q.name, string(q.tl))
	}
}`,
 out:"quadA o\nquadB /",
 why:{ru:"Имена полей можно не писать, если значения идут <b>в том же порядке</b>, что в объявлении типа. Перебор — обычный <code>range</code>, номер не нужен, поэтому нижнее подчёркивание.",
      en:"Field names may be omitted if the values come <b>in the same order</b> as in the type declaration. The walk is a plain <code>range</code>; the index is not needed, hence the underscore."}
},
{
 chg:{ru:"полей стало шесть — фигура описана целиком", en:"six fields now — the shape is fully described"},
 code:`package main

import "fmt"

type quad struct {
	name string
	tl   rune
	tr   rune
	bl   rune
	br   rune
	hor  rune
	ver  rune
}

func main() {
	a := quad{"quadA", 'o', 'o', 'o', 'o', '-', '|'}
	fmt.Println(string(a.tl), string(a.hor), string(a.ver))
}`,
 out:"o - |",
 why:{ru:"Четыре угла, горизонталь и вертикаль — этих шести символов хватает, чтобы описать любую из пяти фигур. Вся разница между quadA и quadE именно здесь.",
      en:"Four corners, a horizontal and a vertical — those six characters describe any of the five shapes. The whole difference between quadA and quadE lives right here."}
},
{
 chg:{ru:"появилась функция про клетку — пока только углы", en:"a function about a cell appears — corners only so far"},
 code:`package main

import "fmt"

type quad struct {
	name string
	tl   rune
	tr   rune
	bl   rune
	br   rune
	hor  rune
	ver  rune
}

func cell(q quad, row, col, w, h int) rune {
	if row == 0 && col == 0 {
		return q.tl
	}
	if row == 0 && col == w-1 {
		return q.tr
	}
	return ' '
}

func main() {
	a := quad{"quadA", 'o', 'o', 'o', 'o', '-', '|'}
	fmt.Printf("%q %q %q\\n", string(cell(a, 0, 0, 3, 3)), string(cell(a, 0, 2, 3, 3)), string(cell(a, 1, 1, 3, 3)))
}`,
 out:"\"o\" \"o\" \" \"",
 why:{ru:"Функция смотрит на <b>адрес</b> клетки, а не на символы. <code>w-1</code> — последний столбец: счёт с нуля, поэтому в ширине 3 последний это второй. <code>%q</code> печатает в кавычках, чтобы пробел было видно.",
      en:"The function looks at the cell's <b>address</b>, not at characters. <code>w-1</code> is the last column: counting starts at zero, so in width 3 the last one is index 2. <code>%q</code> prints with quotes so the space is visible."}
},
{
 chg:{ru:"добавились нижние углы и обе стороны", en:"the bottom corners and both sides are added"},
 code:`package main

import "fmt"

type quad struct {
	name string
	tl   rune
	tr   rune
	bl   rune
	br   rune
	hor  rune
	ver  rune
}

func cell(q quad, row, col, w, h int) rune {
	if row == 0 && col == 0 {
		return q.tl
	}
	if row == 0 && col == w-1 {
		return q.tr
	}
	if row == h-1 && col == 0 {
		return q.bl
	}
	if row == h-1 && col == w-1 {
		return q.br
	}
	if row == 0 || row == h-1 {
		return q.hor
	}
	if col == 0 || col == w-1 {
		return q.ver
	}
	return ' '
}

func main() {
	a := quad{"quadA", 'o', 'o', 'o', 'o', '-', '|'}
	fmt.Printf("%q %q %q %q\\n", string(cell(a, 0, 1, 3, 3)), string(cell(a, 1, 0, 3, 3)), string(cell(a, 2, 2, 3, 3)), string(cell(a, 1, 1, 3, 3)))
}`,
 out:"\"-\" \"|\" \"o\" \" \"",
 why:{ru:"Шесть проверок идут сверху вниз, срабатывает первая подошедшая. Сначала все четыре угла, потом стороны, в конце пробел.<br><b>Сломай:</b> подними проверку <code>row == 0 || row == h-1</code> выше углов — все углы превратятся в горизонталь.",
      en:"Six checks run top to bottom and the first one that fits wins. All four corners first, then the sides, then the space.<br><b>Break it:</b> move the <code>row == 0 || row == h-1</code> check above the corners — every corner turns into a horizontal character."}
},
{
 chg:{ru:"учимся собирать строку из рун", en:"learning to build a line out of runes"},
 code:`package main

import "fmt"

func main() {
	line := make([]rune, 3)
	for col := 0; col < 3; col++ {
		line[col] = 'x'
	}
	fmt.Println(string(line))
	fmt.Println(len(line))
}`,
 out:"xxx\n3",
 why:{ru:"<code>make([]rune, 3)</code> сразу выделяет место на три символа — длина известна заранее, докладывать через <code>append</code> не надо. <code>string(...)</code> в конце склеивает руны в строку.",
      en:"<code>make([]rune, 3)</code> reserves room for three characters at once — the length is known upfront, so no <code>append</code> is needed. <code>string(...)</code> at the end glues the runes into a string."}
},
{
 chg:{ru:"собираем не иксы, а настоящую строку картинки", en:"building a real picture line instead of x-es"},
 code:`package main

import "fmt"

type quad struct {
	name string
	tl   rune
	tr   rune
	bl   rune
	br   rune
	hor  rune
	ver  rune
}

func cell(q quad, row, col, w, h int) rune {
	if row == 0 && col == 0 {
		return q.tl
	}
	if row == 0 && col == w-1 {
		return q.tr
	}
	if row == h-1 && col == 0 {
		return q.bl
	}
	if row == h-1 && col == w-1 {
		return q.br
	}
	if row == 0 || row == h-1 {
		return q.hor
	}
	if col == 0 || col == w-1 {
		return q.ver
	}
	return ' '
}

func main() {
	a := quad{"quadA", 'o', 'o', 'o', 'o', '-', '|'}
	w, h := 5, 3
	line := make([]rune, w)
	for col := 0; col < w; col++ {
		line[col] = cell(a, 0, col, w, h)
	}
	fmt.Println(string(line))
}`,
 out:"o---o",
 why:{ru:"Это уже верхняя строка настоящей рамки. Цикл прошёл по пяти клеткам, каждую спросил у <code>cell</code> и сложил ответ на своё место.",
      en:"This is already the top line of a real frame. The loop walked five cells, asked <code>cell</code> about each and put the answer in its place."}
},
{
 chg:{ru:"строк стало много — и мы их сравниваем", en:"many lines now — and we compare them"},
 code:`package main

import "fmt"

type quad struct {
	name string
	tl   rune
	tr   rune
	bl   rune
	br   rune
	hor  rune
	ver  rune
}

func cell(q quad, row, col, w, h int) rune {
	if row == 0 && col == 0 {
		return q.tl
	}
	if row == 0 && col == w-1 {
		return q.tr
	}
	if row == h-1 && col == 0 {
		return q.bl
	}
	if row == h-1 && col == w-1 {
		return q.br
	}
	if row == 0 || row == h-1 {
		return q.hor
	}
	if col == 0 || col == w-1 {
		return q.ver
	}
	return ' '
}

func main() {
	a := quad{"quadA", 'o', 'o', 'o', 'o', '-', '|'}
	want := []string{"o---o", "|   |", "o---o"}
	w, h := 5, 3
	same := true
	for row := 0; row < h; row++ {
		line := make([]rune, w)
		for col := 0; col < w; col++ {
			line[col] = cell(a, row, col, w, h)
		}
		fmt.Println(string(line))
		if string(line) != want[row] {
			same = false
		}
	}
	fmt.Println(same)
}`,
 out:"o---o\n|   |\no---o\ntrue",
 why:{ru:"Вот и вся программа в миниатюре: нарисовали своё, сравнили с чужим, сказали да или нет. В настоящем <code>match</code> отличие одно — при первом же расхождении там стоит <code>return false</code>, и остальные строки не считаются вовсе.<br><b>Сломай:</b> поменяй <code>want</code> на <code>{\"o---o\", \"|   |\", \"x---x\"}</code>.",
      en:"Here is the whole program in miniature: we drew our own, compared it with someone else's, said yes or no. In the real <code>match</code> there is one difference — at the first mismatch it does <code>return false</code> and the remaining lines are never computed.<br><b>Break it:</b> change <code>want</code> to <code>{\"o---o\", \"|   |\", \"x---x\"}</code>."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"ShapeCard", lvl:1, e:"quadA o",
 d:{ru:"Объяви структуру с двумя полями: имя (строка) и символ угла (руна). Создай из неё quadA с углом <code>'o'</code> и напечатай оба поля в одну строку через пробел — символ покажи буквой, а не числом.",
    en:"Declare a struct with two fields: a name (string) and a corner character (rune). Build quadA with corner <code>'o'</code> from it and print both fields on one line separated by a space — show the character as a letter, not a number."},
 h:{ru:"Руну показывает буквой <code>string(...)</code>. Два значения в одну строку печатает <code>fmt.Println(a, b)</code>.",
    en:"<code>string(...)</code> shows a rune as a letter. <code>fmt.Println(a, b)</code> prints two values on one line."}},

{t:"RuneTwice", lvl:1, e:"66\nB",
 d:{ru:"Возьми руну <code>'B'</code>. Напечатай её сначала как число, потом как символ — каждое на своей строке.",
    en:"Take the rune <code>'B'</code>. Print it first as a number, then as a character — each on its own line."},
 h:{ru:"Без превращения руна печатается числом. С <code>string(...)</code> — символом.",
    en:"Printed as is, a rune shows a number. With <code>string(...)</code> it shows the character."}},

{t:"ListShapes", lvl:1, e:"quadA\nquadB\nquadC",
 d:{ru:"Сложи три структуры в слайс (имена quadA, quadB, quadC) и напечатай имена по одному на строке, перебрав слайс циклом.",
    en:"Put three structs into a slice (names quadA, quadB, quadC) and print the names one per line by walking the slice with a loop."},
 h:{ru:"Слайс структур объявляется как <code>[]quad{ {...}, {...} }</code>. Номер в переборе не нужен — на его место ставится <code>_</code>.",
    en:"A slice of structs is written <code>[]quad{ {...}, {...} }</code>. The index is not needed in the walk — put <code>_</code> in its place."}},

{t:"IsCorner", lvl:1, e:"true\nfalse\ntrue",
 d:{ru:"Напиши функцию, которая по <code>row</code>, <code>col</code>, <code>w</code>, <code>h</code> отвечает, угловая ли клетка. Проверь её на (0,0) при поле 3×3, на (1,1) при поле 3×3 и на (0,0) при поле 1×1.",
    en:"Write a function that, given <code>row</code>, <code>col</code>, <code>w</code>, <code>h</code>, says whether the cell is a corner. Test it on (0,0) in a 3×3 field, (1,1) in a 3×3 field and (0,0) in a 1×1 field."},
 h:{ru:"Угловая — это когда строка крайняя <b>и</b> столбец крайний. Крайняя строка — нулевая или <code>h-1</code>.",
    en:"A corner is when the row is an edge <b>and</b> the column is an edge. An edge row is zero or <code>h-1</code>."}},

{t:"EdgeMark", lvl:2, e:"eee\ne.e\neee",
 d:{ru:"Напечатай поле 3×3, где каждая клетка на краю обозначена буквой <code>e</code>, а внутренние — точкой.",
    en:"Print a 3×3 field where every cell on the edge is marked with <code>e</code> and inner ones with a dot."},
 h:{ru:"Клетка на краю, если крайняя строка <b>или</b> крайний столбец. Перевод строки — после внутреннего цикла.",
    en:"A cell is on the edge if the row is an edge <b>or</b> the column is. The newline goes after the inner loop."}},

{t:"BuildLine", lvl:2, e:"*****\n5",
 d:{ru:"Собери строку из пяти звёздочек через <code>make([]rune, 5)</code> и цикл — без склейки плюсом. Напечатай строку и её длину.",
    en:"Build a line of five asterisks using <code>make([]rune, 5)</code> and a loop — no plus-concatenation. Print the line and its length."},
 h:{ru:"Заготовка заполняется по индексу: <code>line[i] = '*'</code>. В строку превращает <code>string(line)</code>.",
    en:"Fill the slot by index: <code>line[i] = '*'</code>. <code>string(line)</code> turns it into a string."}},

{t:"DrawFrame", lvl:2, e:"#--#\n|  |\n#--#",
 d:{ru:"Нарисуй рамку шириной 4 и высотой 3: углы <code>#</code>, горизонтальные стороны <code>-</code>, вертикальные <code>|</code>, внутри пробелы.",
    en:"Draw a frame 4 wide and 3 high: corners <code>#</code>, horizontal sides <code>-</code>, vertical sides <code>|</code>, spaces inside."},
 h:{ru:"Сначала спроси про углы, потом про стороны, в конце оставь пробел. Порядок проверок важен.",
    en:"Ask about the corners first, then the sides, and leave the space for last. The order of checks matters."}},

{t:"SameLength", lvl:2, e:"true\nfalse",
 d:{ru:"Напиши функцию, которая по слайсу строк отвечает, все ли они одной длины. Проверь на <code>{\"abc\",\"def\"}</code> и на <code>{\"abc\",\"de\"}</code>.",
    en:"Write a function that, given a slice of strings, says whether they all have the same length. Test it on <code>{\"abc\",\"def\"}</code> and <code>{\"abc\",\"de\"}</code>."},
 h:{ru:"Длину бери у первой строки и сравнивай с ней остальные. Пустой слайс считай подходящим.",
    en:"Take the length from the first line and compare the rest with it. Treat an empty slice as fine."}},

{t:"JoinPieces", lvl:3, e:"aa || bb || cc",
 d:{ru:"Склей три куска <code>aa</code>, <code>bb</code>, <code>cc</code> в одну строку через <code>\" || \"</code>. В конце строки разделителя быть не должно.",
    en:"Join the three pieces <code>aa</code>, <code>bb</code>, <code>cc</code> into one string with <code>\" || \"</code>. There must be no separator at the end."},
 h:{ru:"Ставь разделитель <b>перед</b> куском и только если строка уже не пустая.",
    en:"Put the separator <b>before</b> the piece, and only if the string is not empty yet."}},

{t:"WhichShape", lvl:3, e:"quadA",
 d:{ru:"Даны две фигуры: quadA (углы <code>o</code>, стороны <code>-</code> и <code>|</code>) и quadB (углы <code>/</code> и <code>\\</code>, стороны <code>*</code>). Дана картинка <code>{\"o-o\",\"| |\",\"o-o\"}</code>. Определи, какая фигура её нарисовала, и напечатай имя.",
    en:"Two shapes are given: quadA (corners <code>o</code>, sides <code>-</code> and <code>|</code>) and quadB (corners <code>/</code> and <code>\\</code>, sides <code>*</code>). Given the picture <code>{\"o-o\",\"| |\",\"o-o\"}</code>, work out which shape drew it and print the name."},
 h:{ru:"Для каждой фигуры нарисуй картинку того же размера и сравни построчно. Совпало всё — это она.",
    en:"For each shape draw a picture of the same size and compare line by line. Everything matches — that is the one."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};
var NO = {ru:"не соберётся", en:"won't compile"};

var BANK = [
{q:{ru:"Что делает запись <code>type quad struct {...}</code>?", en:"What does <code>type quad struct {...}</code> do?"},
 code:null,
 opts:[{ru:"объявляет тип — переменных и памяти пока нет",en:"declares a type — no variables and no memory yet"},
       {ru:"создаёт переменную с семью полями",en:"creates a variable with seven fields"},
       {ru:"выделяет память под пять фигур",en:"allocates memory for five shapes"},
       {ru:"вызывает функцию quad",en:"calls the quad function"}], ok:0,
 why:{ru:"Это описание: «существует такой тип». Переменная появляется отдельной строкой — <code>var a quad</code> или <code>a := quad{...}</code>.",
      en:"It is a description: \"such a type exists\". A variable appears on a separate line — <code>var a quad</code> or <code>a := quad{...}</code>."}},

{q:Q_OUT, code:"a := quad{name: \"quadA\", tl: 'o'}\nfmt.Println(a.tl)",
 opts:["111","o","'o'",NO], ok:0,
 why:{ru:"<code>rune</code> — это число, код символа. У буквы «o» он 111. Чтобы увидеть букву, нужно <code>string(a.tl)</code>.",
      en:"A <code>rune</code> is a number, a character code. For \"o\" it is 111. To see the letter use <code>string(a.tl)</code>."}},

{q:Q_HAP, code:"a := quad{name: \"quadA\"}\nfmt.Println(a.quad)",
 opts:[NO,{ru:"напечатает quadA",en:"prints quadA"},{ru:"напечатает пустую строку",en:"prints an empty string"},{ru:"напечатает имя типа",en:"prints the type name"}], ok:0,
 why:{ru:"После точки идёт <b>имя поля</b>, а не имя типа. Поля <code>quad</code> в структуре нет: <code>a.quad undefined (type quad has no field or method quad)</code>.",
      en:"After the dot comes a <b>field name</b>, not the type name. There is no field <code>quad</code>: <code>a.quad undefined (type quad has no field or method quad)</code>."}},

{q:{ru:"При ширине 1 клетка одновременно и первый, и последний столбец. Какой угол вернёт <code>cell</code>?",
    en:"At width 1 a cell is both the first and the last column. Which corner does <code>cell</code> return?"},
 code:null,
 opts:[{ru:"левый — его проверка стоит выше",en:"the left one — its check stands higher"},
       {ru:"правый — он проверяется точнее",en:"the right one — it is checked more precisely"},
       {ru:"оба, вернётся два символа",en:"both, two characters come back"},
       {ru:"пробел, условия конфликтуют",en:"a space, the conditions conflict"}], ok:0,
 why:{ru:"Функция выходит на первой подошедшей проверке. Левый угол записан выше правого, поэтому выигрывает он.",
      en:"The function returns at the first check that fits. The left corner is written above the right one, so it wins."}},

{q:Q_OUT, code:"// quadE: tl=A tr=C bl=C br=A\n./quadE 1 2",
 opts:[{ru:"A и C",en:"A then C"},{ru:"A и A",en:"A then A"},{ru:"C и A",en:"C then A"},{ru:"C и C",en:"C then C"}], ok:0,
 why:{ru:"Ширина 1, значит правые углы не участвуют. Первая клетка — левый верхний (<code>A</code>), вторая — левый нижний (<code>C</code>).",
      en:"Width 1 means the right corners never participate. The first cell is top-left (<code>A</code>), the second is bottom-left (<code>C</code>)."}},

{q:{ru:"Где в <code>match</code> стоит <code>return false</code>?", en:"Where does <code>return false</code> sit in <code>match</code>?"},
 code:null,
 opts:[{ru:"внутри цикла — хватает одного несовпадения",en:"inside the loop — one mismatch is enough"},
       {ru:"после цикла, вместе с true",en:"after the loop, next to true"},
       {ru:"в самом начале функции",en:"at the very start of the function"},
       {ru:"внутри вложенного цикла по столбцам",en:"inside the inner column loop"}], ok:0,
 why:{ru:"Чтобы объявить «не совпало», достаточно одной непохожей строки — остальные смотреть незачем, выходим сразу.",
      en:"To declare \"no match\" one different line is enough — there is no point looking at the rest, so we leave at once."}},

{q:{ru:"Почему <code>return true</code> стоит после цикла, а не внутри?", en:"Why does <code>return true</code> sit after the loop rather than inside?"},
 code:null,
 opts:[{ru:"«совпало» можно сказать, только проверив все строки",en:"\"it matches\" can only be said after checking every line"},
       {ru:"чтобы код был короче",en:"to make the code shorter"},
       {ru:"Go не разрешает return внутри цикла",en:"Go does not allow return inside a loop"},
       {ru:"иначе цикл не остановится",en:"otherwise the loop will not stop"}], ok:0,
 why:{ru:"Поставь его внутрь — функция согласится на первой же совпавшей строке и начнёт врать. Одно несовпадение закрывает вопрос, одно совпадение — нет.",
      en:"Put it inside and the function agrees at the first matching line and starts lying. One mismatch settles the question, one match does not."}},

{q:{ru:"Что возвращает <code>sc.Text()</code>?", en:"What does <code>sc.Text()</code> return?"},
 code:null,
 opts:[{ru:"строку без символа переноса",en:"the line without its newline character"},
       {ru:"строку вместе с переносом",en:"the line including the newline"},
       {ru:"один байт",en:"a single byte"},
       {ru:"весь ввод целиком",en:"the whole input at once"}], ok:0,
 why:{ru:"Перенос уже снят читалкой, поэтому обрезать его отдельно не нужно. А вот <b>добавить</b> свой <code>\\n</code> — верный способ развалить сравнение.",
      en:"The newline is already stripped by the scanner, so there is nothing to trim. <b>Adding</b> your own <code>\\n</code>, however, is a sure way to break the comparison."}},

{q:{ru:"Что напечатает программа, если в трубу ничего не пришло?", en:"What does the program print if nothing came through the pipe?"},
 code:null,
 opts:["Not a quad function",{ru:"пустую строку",en:"an empty line"},{ru:"упадёт с ошибкой",en:"it crashes"},"[quadA] [0] [0]"], ok:0,
 why:{ru:"Цикл чтения не сделает ни шага, <code>h</code> останется нулём, до перебора дело не дойдёт и <code>res</code> останется пустой.",
      en:"The read loop takes no steps, <code>h</code> stays zero, the scan never starts and <code>res</code> stays empty."}},

{q:{ru:"Зачем проверять, что все строки одной длины?", en:"Why check that every line has the same length?"},
 code:null,
 opts:[{ru:"ширина взята у первой строки — рваный ввод надо отсечь до перебора",en:"the width comes from the first line — ragged input must be rejected before the scan"},
       {ru:"иначе программа зациклится",en:"otherwise the program loops forever"},
       {ru:"чтобы ответ вышел по алфавиту",en:"so that the answer comes out alphabetical"},
       {ru:"этого делать не нужно",en:"there is no need to do it"}], ok:0,
 why:{ru:"У квада стороны ровные. Пример из условия — <code>o--o</code>, <code>|</code>, <code>o</code> — отваливается именно здесь.",
      en:"A quad has straight sides. The example from the task — <code>o--o</code>, <code>|</code>, <code>o</code> — falls out right here."}},

{q:{ru:"Где в программе сортировка ответов по алфавиту?", en:"Where is the alphabetical sorting of answers?"},
 code:null,
 opts:[{ru:"её нет — список фигур записан от A до E",en:"there is none — the shape list is written from A to E"},
       {ru:"в конце main, перед печатью",en:"at the end of main, before printing"},
       {ru:"внутри match",en:"inside match"},
       {ru:"её делает fmt.Println",en:"fmt.Println does it"}], ok:0,
 why:{ru:"Перебор идёт по списку сверху вниз, совпадения дописываются в том порядке, в каком встретились. Порядок в списке = порядок в ответе.",
      en:"The scan walks the list top to bottom and matches are appended in the order they are met. The order in the list is the order in the answer."}},

{q:{ru:"Куда ставится разделитель <code>\" || \"</code>?", en:"Where does the <code>\" || \"</code> separator go?"},
 code:null,
 opts:[{ru:"перед куском, и только если строка уже не пуста",en:"before the piece, and only if the string is not empty"},
       {ru:"после каждого куска",en:"after every piece"},
       {ru:"после каждого, кроме последнего — считаем заранее",en:"after every one except the last — counted in advance"},
       {ru:"в самом конце, один раз",en:"once, at the very end"}], ok:0,
 why:{ru:"Так между кусками он есть, а в конце нет, и обрезать хвост не приходится. Вариант «после каждого» оставляет висячее <code>||</code>.",
      en:"That way it appears between pieces and never at the end, so no tail has to be trimmed. \"After every one\" leaves a dangling <code>||</code>."}},

{q:Q_HAP, code:"line := make([]rune, 3)\nfmt.Println(len(line))",
 opts:["3","0",NO,{ru:"печатает пустую строку",en:"prints an empty line"}], ok:0,
 why:{ru:"<code>make</code> сразу создаёт слайс нужной длины, заполненный нулевыми значениями. Длина известна с этого момента, докладывать не надо.",
      en:"<code>make</code> creates a slice of the given length right away, filled with zero values. The length is known from that point; nothing needs appending."}},

{q:{ru:"Зачем в <code>match</code> пишут <code>string(line) != lines[row]</code>, а не <code>line != lines[row]</code>?",
    en:"Why does <code>match</code> write <code>string(line) != lines[row]</code> instead of <code>line != lines[row]</code>?"},
 code:null,
 opts:[{ru:"срез рун и строка — разные типы, напрямую не сравниваются",en:"a rune slice and a string are different types and cannot be compared directly"},
       {ru:"так быстрее",en:"it is faster"},
       {ru:"чтобы не потерять пробелы",en:"so that spaces are not lost"},
       {ru:"разницы нет, обе записи работают",en:"no difference, both work"}], ok:0,
 why:{ru:"Go строго следит за типами: сравнить <code>[]rune</code> со <code>string</code> нельзя, программа не соберётся. Превращение обязательно.",
      en:"Go is strict about types: comparing <code>[]rune</code> with <code>string</code> does not compile. The conversion is required."}},

{q:{ru:"Что означает <code>len(lines)</code> в этой программе?", en:"What does <code>len(lines)</code> mean in this program?"},
 code:null,
 opts:[{ru:"высоту картинки — сколько строк пришло",en:"the height of the picture — how many lines arrived"},
       {ru:"ширину картинки",en:"the width of the picture"},
       {ru:"число байтов во всём вводе",en:"the number of bytes in the whole input"},
       {ru:"число совпавших квадов",en:"the number of matching quads"}], ok:0,
 why:{ru:"<code>lines</code> — слайс строк, один элемент = одна строка картинки. Его длина и есть высота. Ширина берётся как <code>len(lines[0])</code>.",
      en:"<code>lines</code> is a slice of strings, one element per picture row. Its length is the height. The width comes from <code>len(lines[0])</code>."}},

{q:{ru:"Почему последний столбец записан как <code>w-1</code>, а не <code>w</code>?", en:"Why is the last column written <code>w-1</code> and not <code>w</code>?"},
 code:null,
 opts:[{ru:"счёт с нуля: при ширине 5 столбцы 0…4",en:"counting starts at zero: at width 5 the columns are 0…4"},
       {ru:"чтобы оставить место под перенос строки",en:"to leave room for the newline"},
       {ru:"так требует Go",en:"Go requires it"},
       {ru:"чтобы не выйти за границу на единицу",en:"to avoid going one past the end"}], ok:0,
 why:{ru:"Индексы начинаются с нуля, поэтому последний равен длине минус один. Написать <code>w</code> — выйти за границу.",
      en:"Indexes start at zero, so the last one is the length minus one. Writing <code>w</code> means going out of range."}},

{q:{ru:"Что вернёт <code>cell</code> для клетки внутри рамки?", en:"What does <code>cell</code> return for a cell inside the frame?"},
 code:null,
 opts:[{ru:"пробел — последняя строка функции",en:"a space — the last line of the function"},
       {ru:"пустую строку",en:"an empty string"},
       {ru:"ноль",en:"zero"},
       {ru:"ничего, функция ничего не вернёт",en:"nothing, the function returns nothing"}], ok:0,
 why:{ru:"Ни одна из шести проверок не подошла, значит клетка не на краю. Возвращается <code>' '</code> — руна пробела, а не пустая строка <code>\"\"</code>.",
      en:"None of the six checks fitted, so the cell is not on an edge. It returns <code>' '</code> — a space rune, not the empty string <code>\"\"</code>."}},

{q:{ru:"Сколько разных ответов может дать <code>cell</code>?", en:"How many different answers can <code>cell</code> give?"},
 code:null,
 opts:[{ru:"семь: шесть полей структуры и пробел",en:"seven: six struct fields plus a space"},
       {ru:"шесть — по числу полей",en:"six — one per field"},
       {ru:"пять — по числу фигур",en:"five — one per shape"},
       {ru:"четыре — по числу углов",en:"four — one per corner"}], ok:0,
 why:{ru:"Шесть символов приходят из структуры, седьмой — пробел — зашит прямо в код. В структуре его нет, потому что он одинаковый у всех пяти фигур.",
      en:"Six characters come from the struct; the seventh, the space, is hard-coded. It is not in the struct because it is the same for all five shapes."}},

{q:Q_HAP, code:"// проверку про строку подняли ВЫШЕ всех углов:\nif row == 0 || row == h-1 { return q.hor }",
 opts:[{ru:"все углы превратятся в горизонтальный символ",en:"every corner turns into the horizontal character"},
       {ru:"ничего не изменится",en:"nothing changes"},
       {ru:"перестанут работать вертикальные стороны",en:"the vertical sides stop working"},
       {ru:NO.ru,en:NO.en}], ok:0,
 why:{ru:"Угол — это тоже клетка верхней или нижней строки. Проверка сработает раньше углов, и до них дело не дойдёт. Порядок проверок здесь и есть логика.",
      en:"A corner is also a cell of the top or bottom row. This check fires before the corners and they are never reached. The order of checks is the logic here."}},

{q:{ru:"Почему картинку не разбирают по символам, а рисуют свою и сравнивают?",
    en:"Why is the picture not parsed character by character but redrawn and compared?"},
 code:null,
 opts:[{ru:"фигур всего пять и правило каждой известно — проще повторить, чем восстанавливать",en:"there are only five shapes and each rule is known — repeating is easier than reconstructing"},
       {ru:"разбирать символы в Go нельзя",en:"parsing characters is not possible in Go"},
       {ru:"так требует задание",en:"the task demands it"},
       {ru:"чтобы обойтись без циклов",en:"to avoid loops altogether"}], ok:0,
 why:{ru:"Разбор превратился бы в кучу частных случаев: ширина 1, высота 1, совпавшие углы. Генерация закрывает их бесплатно — тем же <code>cell</code>, что рисует настоящий квад.",
      en:"Parsing would become a pile of special cases: width 1, height 1, coinciding corners. Generating covers them for free — with the same <code>cell</code> that draws a real quad."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [

{q:{ru:"quadchecker: почему мы рисуем сами, а не разбираем пришедшую картинку?",
    en:"quadchecker: why draw it ourselves instead of parsing the picture that arrived?"},
 a:{ru:`<p>Потому что фигур всего пять и правило рисования у каждой известно заранее. Проще <b>нарисовать самому и сверить</b>, чем по чужой картинке восстанавливать, какое правило её породило.</p>
<p>Разбор превратился бы в кучу частных случаев: а если ширина 1, а если высота 1, а если углы совпали друг с другом. Генерация все эти случаи закрывает бесплатно — она пользуется тем же <code>cell</code>, который рисует настоящий квад.</p>
<p>Цена такого решения — пять полных проходов по картинке вместо одного. На размерах, которые бывают в задании, это ничего не стоит.</p>`,
    en:`<p>Because there are only five shapes and the drawing rule of each is known in advance. It is simpler to <b>draw it yourself and compare</b> than to reconstruct, from someone else's picture, which rule produced it.</p>
<p>Parsing would turn into a pile of special cases: what if the width is 1, what if the height is 1, what if the corners coincide. Generating covers all of them for free — it uses the very same <code>cell</code> that draws a real quad.</p>
<p>The price is five full passes over the picture instead of one. At the sizes the task deals with, that costs nothing.</p>`}},

{q:{ru:"quadchecker: что будет, если поменять местами проверки углов в <code>cell</code>?",
    en:"quadchecker: what happens if you swap the corner checks in <code>cell</code>?"},
 a:{ru:`<p>Сломается ширина 1 и высота 1 — то есть ровно те случаи, которые стоят примерами в условии.</p>
<p>При <code>w == 1</code> условия <code>col == 0</code> и <code>col == w-1</code> истинны одновременно: единственный столбец является и первым, и последним. Функция выходит на первом подошедшем <code>if</code>, значит побеждает тот, что записан выше.</p>
<p>Сейчас выше левый угол, поэтому <code>quadE 1 2</code> даёт <code>A</code>, потом <code>C</code>. Переставь — получишь <code>C</code> и <code>A</code>, и пример из условия перестанет сходиться. То же самое с высотой 1 и парой «верх/низ».</p>`,
    en:`<p>Widths of 1 and heights of 1 break — exactly the cases the task shows as examples.</p>
<p>When <code>w == 1</code>, the conditions <code>col == 0</code> and <code>col == w-1</code> are true at the same time: the only column is both the first and the last. The function returns at the first matching <code>if</code>, so whichever is written higher wins.</p>
<p>Right now the left corner is higher, which is why <code>quadE 1 2</code> gives <code>A</code> then <code>C</code>. Swap them and you get <code>C</code> and <code>A</code>, and the example from the task stops matching. The same goes for height 1 and the top/bottom pair.</p>`}},

{q:{ru:"quadchecker: ответы выводятся по алфавиту — где сортировка?",
    en:"quadchecker: the answers come out alphabetically — where is the sorting?"},
 a:{ru:`<p>Её нет, и она не нужна. Список <code>quads</code> записан от A до E, перебор идёт сверху вниз, совпадения дописываются в том порядке, в каком встретились. Порядок получается сам.</p>
<p>Это общий приём, который стоит забрать себе: <b>если данные заранее разложены правильно, сортировать нечего</b>. Сортировка появляется там, где порядок не контролировали на входе.</p>
<p>Разделитель при этом ставится <b>перед</b> очередным куском и только если строка уже не пустая — тогда между кусками <code>||</code> есть, а в конце нет и обрезать хвост не приходится.</p>`,
    en:`<p>There is none, and none is needed. The <code>quads</code> list is written from A to E, the scan runs top to bottom, and matches are appended in the order they are met. The order comes out on its own.</p>
<p>This is a general move worth keeping: <b>if the data is laid out correctly in advance, there is nothing to sort</b>. Sorting shows up where the order was not controlled at the input.</p>
<p>The separator, meanwhile, goes <b>before</b> the next piece and only if the string is not empty — so <code>||</code> appears between pieces and never at the end, and no tail has to be trimmed.</p>`}},

{q:{ru:"quadchecker: зачем проверять, что все строки одной длины?",
    en:"quadchecker: why check that every line has the same length?"},
 a:{ru:`<p>Ширину мы берём у первой строки. Если вторая короче, никакого прямоугольника нет — а значит нет и квада, который мог бы это нарисовать.</p>
<p>Формально сравнение всё равно не совпало бы и программа ответила бы верно. Но случайная правильность — не то же самое, что правило. Здесь мы отсекаем рваный ввод <b>до</b> перебора, одной проверкой, а не надеемся, что оно само не сойдётся.</p>
<p>Ровно этот случай стоит примером в условии: <code>o--o</code>, <code>|</code>, <code>o</code> — три строки разной длины, ответ <code>Not a quad function</code>.</p>`,
    en:`<p>The width is taken from the first line. If the second is shorter there is no rectangle at all — and therefore no quad that could have drawn it.</p>
<p>Technically the comparison would fail anyway and the program would answer correctly. But being accidentally right is not the same as having a rule. Here we reject ragged input <b>before</b> the scan, with one check, instead of hoping it will not match by itself.</p>
<p>This is precisely the case shown in the task: <code>o--o</code>, <code>|</code>, <code>o</code> — three lines of different lengths, answer <code>Not a quad function</code>.</p>`}},

{q:{ru:"quadchecker: что будет, если поставить <code>return true</code> внутрь цикла в <code>match</code>?",
    en:"quadchecker: what happens if <code>return true</code> goes inside the loop in <code>match</code>?"},
 a:{ru:`<p>Функция начнёт врать. Она согласится на <b>первой же совпавшей строке</b> и объявит совпадение, не посмотрев остальные.</p>
<p>Смотри на картинке 3 на 3: у quadA и quadB верхние строки разные, а вот у quadC и quadE при некоторых размерах первая строка совпадает, а вторая нет. С <code>return true</code> внутри цикла обе фигуры окажутся в ответе.</p>
<p>Правило общее и стоит его запомнить: <b>«не подходит» можно объявить по одному несовпадению, «подходит» — только проверив всё до конца</b>. Отсюда и разные места двух <code>return</code>.</p>`,
    en:`<p>The function starts lying. It agrees at the <b>first matching line</b> and declares a match without looking at the rest.</p>
<p>On a 3 by 3 picture: quadA and quadB differ in the top line, but quadC and quadE at some sizes share the first line and differ in the second. With <code>return true</code> inside the loop both shapes end up in the answer.</p>
<p>The rule is general and worth keeping: <b>"does not fit" can be declared from a single mismatch; "fits" only after checking everything</b>. Hence the two <code>return</code>s sit in different places.</p>`}},

{q:{ru:"quadchecker: зачем <code>make([]rune, w)</code>, если строку можно склеить плюсом?",
    en:"quadchecker: why <code>make([]rune, w)</code> if a string can be glued with plus?"},
 a:{ru:`<p>Работать будет и так — но это разная работа для машины.</p>
<p>Строки в Go менять нельзя. Значит <code>s = s + \"x\"</code> каждый раз создаёт <b>новую</b> строку и копирует туда всё, что уже накопилось. На строке из ста символов это сто копирований по нарастающей.</p>
<p><code>make([]rune, w)</code> выделяет место сразу на всю строку, потому что длина известна заранее — она равна ширине картинки. Дальше клетки просто кладутся по индексу, ничего не копируется.</p>
<p>На рамке 5 на 3 разницы не заметишь. Смысл не в скорости, а в привычке: <b>если длина известна заранее, место выделяют сразу</b>.</p>`,
    en:`<p>It would work — but it is a different amount of work for the machine.</p>
<p>Strings in Go cannot be changed. So <code>s = s + \"x\"</code> creates a <b>new</b> string every time and copies everything accumulated so far into it. On a hundred-character line that is a hundred ever-growing copies.</p>
<p><code>make([]rune, w)</code> reserves room for the whole line at once, because the length is known upfront — it equals the picture's width. After that cells are simply placed by index, nothing is copied.</p>
<p>On a 5 by 3 frame you will not notice the difference. The point is not speed but the habit: <b>when the length is known in advance, allocate the room in advance</b>.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */
var SCENARIOS = [
{
 name:{ru:"quadchecker: сверка по клеткам", en:"quadchecker: comparing cell by cell"},
 params:[
  {key:"q", label:{ru:"проверяем (1=A 2=B 3=C 4=D 5=E)", en:"testing (1=A 2=B 3=C 4=D 5=E)"}, min:1, max:5, def:3},
  {key:"w", label:{ru:"ширина", en:"width"}, min:1, max:3, def:1},
  {key:"h", label:{ru:"высота", en:"height"}, min:2, max:3, def:2}
 ],
 code: function(p){
   return [
    "func match(q quad, lines []string, w, h int) bool {",
    "\tfor row := 0; row < h; row++ {",
    "\t\tline := make([]rune, w)",
    "\t\tfor col := 0; col < w; col++ {",
    "\t\t\tline[col] = cell(q, row, col, w, h)",
    "\t\t}",
    "\t\tif string(line) != lines[row] {",
    "\t\t\treturn false",
    "\t\t}",
    "\t}",
    "\treturn true",
    "}"
   ];
 },
 steps: function(p){
   var names = ["quadA","quadB","quadC","quadD","quadE"];
   var CH = {
     quadA:["o","o","o","o","-","|"],
     quadB:["/","\\","\\","/","*","*"],
     quadC:["A","A","C","C","B","B"],
     quadD:["A","C","A","C","B","B"],
     quadE:["A","C","C","A","B","B"]
   };
   var name = names[p.q-1], w = p.w, h = p.h;

   var pick = function(cs, r, c){
     if(r === 0 && c === 0) return cs[0];
     if(r === 0 && c === w-1) return cs[1];
     if(r === h-1 && c === 0) return cs[2];
     if(r === h-1 && c === w-1) return cs[3];
     if(r === 0 || r === h-1) return cs[4];
     if(c === 0 || c === w-1) return cs[5];
     return " ";
   };
   var why = function(r, c){
     if(r === 0 && c === 0) return {ru:"строка нулевая и столбец нулевой — <b>левый верхний угол</b>", en:"row zero and column zero — the <b>top-left corner</b>"};
     if(r === 0 && c === w-1) return {ru:"строка нулевая, столбец последний — <b>правый верхний угол</b>", en:"row zero, last column — the <b>top-right corner</b>"};
     if(r === h-1 && c === 0) return {ru:"строка последняя, столбец нулевой — <b>левый нижний угол</b>", en:"last row, column zero — the <b>bottom-left corner</b>"};
     if(r === h-1 && c === w-1) return {ru:"строка последняя и столбец последний — <b>правый нижний угол</b>", en:"last row and last column — the <b>bottom-right corner</b>"};
     if(r === 0 || r === h-1) return {ru:"строка крайняя, столбец в середине — <b>горизонтальная сторона</b>", en:"edge row, middle column — the <b>horizontal side</b>"};
     if(c === 0 || c === w-1) return {ru:"строка в середине, столбец крайний — <b>вертикальная сторона</b>", en:"middle row, edge column — the <b>vertical side</b>"};
     return {ru:"клетка не на краю — <b>пустое место</b>", en:"the cell is not on an edge — <b>empty space</b>"};
   };
   var narrow = (w === 1)
     ? {ru:" При ширине 1 левый и правый углы — одна и та же клетка, и побеждает левый: его <code>if</code> стоит выше.",
        en:" At width 1 the left and right corners are the same cell, and the left one wins: its <code>if</code> stands higher."}
     : {ru:"", en:""};

   var inp = [];
   for(var r0 = 0; r0 < h; r0++){
     var s0 = "";
     for(var c0 = 0; c0 < w; c0++) s0 += pick(CH.quadC, r0, c0);
     inp.push(s0);
   }

   var vis = function(x){ return x === " " ? "␣" : x; };
   var cellsOf = function(r){
     var a = [];
     for(var c = 0; c < w; c++) a.push(vis(inp[r][c]));
     return a;
   };
   var title = function(r){
     return {ru:"Вход, строка " + r + " — её нарисовал quadC",
             en:"Input, row " + r + " — drawn by quadC"};
   };
   var V = function(extra){
     return [["q.name", name, "string"], ["w", String(w), "int"], ["h", String(h), "int"]].concat(extra || []);
   };

   var st = [];
   for(var row = 0; row < h; row++){
     st.push({line:1, vars:V([["row", String(row), "int"], ["row < h", "true", "bool"]]), out:"",
       cells:cellsOf(row), cellsTitle:title(row),
       note:{ru:(row === 0
          ? "Вход нарисовал <b>quadC</b>, а проверяем мы сейчас <b>" + name + "</b>: мог ли он нарисовать то же самое? Заголовок внешнего цикла — <code>row := 0</code>, проверка <code>0 &lt; " + h + "</code> истинна, берёмся за первую строку. Печатать эта функция ничего не будет, она только отвечает да или нет."
          : "<code>row++</code> сделал <code>row</code> равным " + row + ". Проверка <code>" + row + " &lt; " + h + "</code> — истина, берёмся за строку " + row + "."),
             en:(row === 0
          ? "The input was drawn by <b>quadC</b>, and we are now testing <b>" + name + "</b>: could it have drawn the same thing? The outer loop header — <code>row := 0</code>, the check <code>0 &lt; " + h + "</code> is true, so we take on the first row. This function prints nothing at all, it only answers yes or no."
          : "<code>row++</code> made <code>row</code> equal " + row + ". The check <code>" + row + " &lt; " + h + "</code> is true, so we take on row " + row + ".")}});

     st.push({line:2, vars:V([["row", String(row), "int"], ["line", "[]", "[]rune"]]), out:"",
       cells:cellsOf(row), cellsTitle:title(row),
       note:{ru:"<code>make([]rune, " + w + ")</code> — пустая заготовка на " + w + " символ(ов). Сюда сложим то, что <b>должен был бы</b> нарисовать " + name + " в этой строке. Длина известна заранее, поэтому место выделяем сразу, а не склеиваем строку по кусочку.",
             en:"<code>make([]rune, " + w + ")</code> — an empty slot for " + w + " character(s). Into it goes what " + name + " <b>would have</b> drawn on this row. The length is known upfront, so the space is allocated at once instead of gluing a string piece by piece."}});

     var line = "";
     for(var col = 0; col < w; col++){
       st.push({line:3, vars:V([["row", String(row), "int"], ["col", String(col), "int"], ["col < w", "true", "bool"]]), out:"",
         cells:cellsOf(row), cellsOn:[col], cellsTitle:title(row),
         note:{ru:(col === 0
            ? "Внутренний цикл начинается заново для каждой строки: <code>col := 0</code>, проверка <code>0 &lt; " + w + "</code> — истина."
            : "<code>col++</code> сделал <code>col</code> равным " + col + ". Проверка <code>" + col + " &lt; " + w + "</code> — истина, беремся за клетку (" + row + ", " + col + ")."),
               en:(col === 0
            ? "The inner loop starts afresh for every row: <code>col := 0</code>, the check <code>0 &lt; " + w + "</code> is true."
            : "<code>col++</code> made <code>col</code> equal " + col + ". The check <code>" + col + " &lt; " + w + "</code> is true, so we take on cell (" + row + ", " + col + ").")}});

       var want = pick(CH[name], row, col);
       line += want;
       var r1 = why(row, col);
       st.push({line:4, vars:V([["row", String(row), "int"], ["col", String(col), "int"], ["line", "\"" + line + "\"", "[]rune"]]), out:"",
         cells:cellsOf(row), cellsOn:[col], cellsTitle:title(row),
         note:{ru:"<code>cell</code> отвечает на один вопрос: что стояло бы в клетке (" + row + ", " + col + ")? Проверки идут сверху вниз, срабатывает первая подошедшая — " + r1.ru + ", то есть <code>" + vis(want) + "</code>." + narrow.ru,
               en:"<code>cell</code> answers one question: what would sit in cell (" + row + ", " + col + ")? The checks run top to bottom and the first one that fits wins — " + r1.en + ", so <code>" + vis(want) + "</code>." + narrow.en}});
     }

     var same = (line === inp[row]);
     st.push({line:6, vars:V([["row", String(row), "int"], ["string(line)", "\"" + line + "\"", "string"], ["lines[row]", "\"" + inp[row] + "\"", "string"]]), out:"",
       cells:cellsOf(row), cellsTitle:title(row),
       note:{ru:"Строка собрана целиком. Сравниваем: <code>\"" + line + "\"</code> против <code>\"" + inp[row] + "\"</code> — " + (same ? "<b>одинаковые</b>, эта строка " + name + " не подвела, идём к следующей." : "<b>разные</b>. Одного расхождения достаточно, чтобы закрыть вопрос."),
             en:"The line is fully built. Comparing: <code>\"" + line + "\"</code> against <code>\"" + inp[row] + "\"</code> — " + (same ? "<b>identical</b>, this row did not let " + name + " down, on to the next one." : "<b>different</b>. One mismatch is enough to settle the question.")}});

     if(!same){
       st.push({line:7, vars:V([["row", String(row), "int"], ["результат", "false", "bool"]]), out:"",
         cells:cellsOf(row), cellsTitle:title(row),
         note:{ru:"<code>return false</code> — выходим немедленно. Оставшиеся строки смотреть незачем: <b>" + name + "</b> уже не мог нарисовать эту картинку. В <code>main</code> перебор пойдёт к следующему квадру.",
               en:"<code>return false</code> — we leave immediately. There is no point looking at the remaining rows: <b>" + name + "</b> already could not have drawn this picture. Back in <code>main</code> the scan moves on to the next quad."}});
       return st;
     }
   }

   st.push({line:10, vars:V([["результат", "true", "bool"]]), out:"",
     cells:cellsOf(h-1), cellsTitle:title(h-1),
     note:{ru:"Цикл закончился, ни одна строка не подвела — <code>return true</code>. Заметь, что <code>true</code> стоит <b>после</b> цикла: чтобы сказать «совпало», нужно проверить все строки, а чтобы сказать «не совпало» — хватило одной. В <code>main</code> имя <b>" + name + "</b> уйдёт в ответ.",
           en:"The loop is over and not a single row let us down — <code>return true</code>. Notice that <code>true</code> stands <b>after</b> the loop: to say \"it matches\" you must check every row, while to say \"it does not\" one row was enough. Back in <code>main</code> the name <b>" + name + "</b> goes into the answer."}});
   return st;
 }
},

{
 name:{ru:"Как собирается ответ", en:"How the answer is assembled"},
 params:[
  {key:"n", label:{ru:"сколько квадов совпадёт", en:"how many quads will match"}, min:1, max:3, def:2}
 ],
 code: function(p){
   return [
    "res := \"\"",
    "for _, q := range quads {",
    "\tif match(q, lines, w, h) {",
    "\t\tif res != \"\" {",
    "\t\t\tres += \" || \"",
    "\t\t}",
    "\t\tres += fmt.Sprintf(\"[%s] [%d] [%d]\", q.name, w, h)",
    "\t}",
    "}",
    "if res == \"\" {",
    "\tres = \"Not a quad function\"",
    "}",
    "fmt.Println(res)"
   ];
 },
 steps: function(p){
   var names = ["quadA","quadB","quadC","quadD","quadE"];
   var hit = ["quadC","quadD","quadE"].slice(0, p.n);
   var w = 1, h = 1, res = "", st = [];
   var V = function(extra){ return [["res", "\"" + res + "\"", "string"]].concat(extra || []); };

   st.push({line:0, vars:V(), out:"",
     note:{ru:"Ответ начинается с <b>пустой</b> строки. Пустая она не просто так: дальше по ней же проверяется, ставить ли разделитель и не пора ли печатать «ничего не нашли».",
           en:"The answer starts as an <b>empty</b> string. Not by accident: the same emptiness later decides whether to add a separator and whether to print \"nothing found\"."}});

   for(var i = 0; i < names.length; i++){
     var name = names[i];
     var ok = hit.indexOf(name) >= 0;

     st.push({line:1, vars:V([["q.name", name, "string"]]), out:"",
       note:{ru:(i === 0
          ? "Пошли по списку сверху вниз. Список записан от A до E, и это единственное, что задаёт порядок в ответе."
          : "Следующий по списку — <b>" + name + "</b>."),
             en:(i === 0
          ? "We walk the list top to bottom. The list is written from A to E, and that is the only thing deciding the order of the answer."
          : "Next in the list is <b>" + name + "</b>.")}});

     st.push({line:2, vars:V([["q.name", name, "string"], ["match(...)", ok ? "true" : "false", "bool"]]), out:"",
       note:{ru:"<code>match</code> ответил <b>" + (ok ? "true" : "false") + "</b> — " + (ok ? "этот квад мог нарисовать картинку, дописываем его в ответ." : "не мог, идём к следующему, ответ не трогаем."),
             en:"<code>match</code> answered <b>" + (ok ? "true" : "false") + "</b> — " + (ok ? "this quad could have drawn the picture, so it goes into the answer." : "it could not, so we move on and leave the answer alone.")}});

     if(!ok) continue;

     var empty = (res === "");
     st.push({line:3, vars:V([["q.name", name, "string"], ["res != \"\"", empty ? "false" : "true", "bool"]]), out:"",
       note:{ru:(empty
          ? "Ответ пока пуст, значит это <b>первое</b> совпадение — разделитель не нужен, тело <code>if</code> пропускаем."
          : "В ответе уже что-то есть, значит перед новым куском нужен разделитель."),
             en:(empty
          ? "The answer is still empty, so this is the <b>first</b> match — no separator needed, the <code>if</code> body is skipped."
          : "The answer already holds something, so the new piece needs a separator in front of it.")}});

     if(!empty){
       res += " || ";
       st.push({line:4, vars:V([["q.name", name, "string"]]), out:"",
         note:{ru:"Дописали <code>\" || \"</code>. Заметь: разделитель ставится <b>перед</b> куском, а не после — поэтому в конце строки его никогда не останется и обрезать ничего не придётся.",
               en:"We appended <code>\" || \"</code>. Note: the separator goes <b>before</b> the piece, not after — so it never lingers at the end and nothing has to be trimmed."}});
     }

     res += "[" + name + "] [" + w + "] [" + h + "]";
     st.push({line:6, vars:V([["q.name", name, "string"]]), out:"",
       note:{ru:"<code>Sprintf</code> собирает кусок <code>[имя] [ширина] [высота]</code> и возвращает его строкой — не печатает, а именно возвращает. Дописываем к ответу.",
             en:"<code>Sprintf</code> builds the piece <code>[name] [width] [height]</code> and returns it as a string — it does not print, it returns. We append it to the answer."}});
   }

   st.push({line:9, vars:V([["res == \"\"", res === "" ? "true" : "false", "bool"]]), out:"",
     note:{ru:"Список кончился. Проверяем, осталась ли строка пустой: пустая означала бы, что не подошёл ни один квад. Здесь совпадений " + p.n + ", так что не пуста.",
           en:"The list is over. We check whether the string stayed empty: empty would mean no quad fitted. Here there " + (p.n === 1 ? "was 1 match" : "were " + p.n + " matches") + ", so it is not."}});

   st.push({line:12, vars:V(), out:res + "\n",
     note:{ru:"Печатаем ответ через <code>Println</code>, а не <code>Print</code> — задание требует перенос строки в конце любого ответа.",
           en:"We print with <code>Println</code>, not <code>Print</code> — the task requires a newline at the end of every answer."}});
   return st;
 }
},

{
 name:{ru:"Три отсечки перед перебором", en:"The three guards before the scan"},
 params:[
  {key:"kind", label:{ru:"вход: 1 — ровный, 2 — рваный", en:"input: 1 — even, 2 — ragged"}, values:[1,2], def:1}
 ],
 code: function(p){
   return [
    "h := len(lines)",
    "w := 0",
    "same := true",
    "for _, l := range lines {",
    "\tif w == 0 {",
    "\t\tw = len(l)",
    "\t}",
    "\tif len(l) != w {",
    "\t\tsame = false",
    "\t}",
    "}",
    "ok := h > 0 && w > 0 && same",
    "fmt.Println(ok)"
   ];
 },
 steps: function(p){
   var lines = (p.kind === 1) ? ["o-o", "| |", "o-o"] : ["o--o", "|", "o"];
   var h = lines.length, w = 0, same = true, st = [];
   var V = function(extra){
     return [["h", String(h), "int"], ["w", String(w), "int"], ["same", same ? "true" : "false", "bool"]].concat(extra || []);
   };
   var cellsOf = function(i){ return lines[i].split(""); };
   var title = function(i){ return {ru:"Строка " + i + ": «" + lines[i] + "»", en:"Line " + i + ": \"" + lines[i] + "\""}; };

   st.push({line:0, vars:V(), out:"",
     note:{ru:"Высота — это просто количество прочитанных строк, считать нечего. Пришло " + h + ".",
           en:"The height is simply the number of lines read, nothing to compute. " + h + " arrived."}});
   st.push({line:1, vars:V(), out:"",
     note:{ru:"Ширина пока неизвестна, поэтому ноль. Настоящее значение возьмём у первой строки.",
           en:"The width is not known yet, hence zero. The real value will come from the first line."}});
   st.push({line:2, vars:V(), out:"",
     note:{ru:"<code>same</code> — переменная-флаг. Начинается с <code>true</code> и может только упасть в <code>false</code>, если найдётся строка другой длины.",
           en:"<code>same</code> is a flag variable. It starts as <code>true</code> and can only fall to <code>false</code> if a line of a different length turns up."}});

   for(var i = 0; i < lines.length; i++){
     st.push({line:3, vars:V([["l", "\"" + lines[i] + "\"", "string"]]), out:"",
       cells:cellsOf(i), cellsTitle:title(i),
       note:{ru:(i === 0 ? "Пошли по строкам." : "Следующая строка.") + " Длина этой — " + lines[i].length + ".",
             en:(i === 0 ? "We start walking the lines." : "The next line.") + " Its length is " + lines[i].length + "."}});

     var first = (w === 0);
     st.push({line:4, vars:V([["l", "\"" + lines[i] + "\"", "string"], ["w == 0", first ? "true" : "false", "bool"]]), out:"",
       cells:cellsOf(i), cellsTitle:title(i),
       note:{ru:(first
          ? "Ширина ещё нулевая — значит это первая строка, и ширину берём именно у неё."
          : "Ширина уже известна, заново её не берём."),
             en:(first
          ? "The width is still zero, so this is the first line and the width comes from it."
          : "The width is already known, we do not take it again.")}});

     if(first){
       w = lines[i].length;
       st.push({line:5, vars:V([["l", "\"" + lines[i] + "\"", "string"]]), out:"",
         cells:cellsOf(i), cellsTitle:title(i),
         note:{ru:"Ширина стала " + w + ". <b>Именно здесь и появляется риск</b>: всё остальное будет мериться по первой строке, поэтому дальше обязательна проверка, что другие ей равны.",
               en:"The width is now " + w + ". <b>This is where the risk appears</b>: everything else is measured against the first line, so a check that the others match it is mandatory."}});
     }

     var bad = (lines[i].length !== w);
     if(bad) same = false;
     st.push({line:7, vars:V([["l", "\"" + lines[i] + "\"", "string"], ["len(l) != w", bad ? "true" : "false", "bool"]]), out:"",
       cells:cellsOf(i), cellsTitle:title(i),
       note:{ru:(bad
          ? "Длина " + lines[i].length + " против ширины " + w + " — <b>не сходится</b>. Прямоугольника нет, флаг падает в <code>false</code>."
          : "Длина совпадает с шириной, эта строка вопросов не вызывает."),
             en:(bad
          ? "Length " + lines[i].length + " against width " + w + " — <b>they differ</b>. There is no rectangle, the flag falls to <code>false</code>."
          : "The length matches the width, this line raises no questions.")}});
     if(bad){
       st.push({line:8, vars:V([["l", "\"" + lines[i] + "\"", "string"]]), out:"",
         cells:cellsOf(i), cellsTitle:title(i),
         note:{ru:"<code>same = false</code>. Обрати внимание: цикл на этом <b>не останавливается</b> — флаг уже опущен, и поднять его обратно ничто не может.",
               en:"<code>same = false</code>. Note that the loop does <b>not</b> stop here — the flag is already down and nothing can raise it again."}});
     }
   }

   var ok = (h > 0 && w > 0 && same);
   st.push({line:11, vars:V([["ok", ok ? "true" : "false", "bool"]]), out:"",
     note:{ru:"Три условия через <code>&amp;&amp;</code>: строки есть, ширина не ноль, все строки ровные. Годится только то, что прошло <b>все три</b> — " + (ok ? "здесь прошло." : "здесь провалилось на ровности."),
           en:"Three conditions joined by <code>&amp;&amp;</code>: there are lines, the width is not zero, all lines are even. Only input that passes <b>all three</b> qualifies — " + (ok ? "here it did." : "here it failed on evenness.")}});
   st.push({line:12, vars:V([["ok", ok ? "true" : "false", "bool"]]), out:(ok ? "true" : "false") + "\n",
     note:{ru:(ok
        ? "Проверки пройдены — в настоящей программе отсюда начинается перебор пяти квадов."
        : "Проверки не пройдены — перебор даже не начнётся, и программа сразу напечатает <code>Not a quad function</code>. Рваный ввод отсекается <b>до</b> работы, а не по ходу."),
           en:(ok
        ? "The checks passed — in the real program the scan of the five quads starts here."
        : "The checks failed — the scan never begins and the program prints <code>Not a quad function</code> straight away. Ragged input is rejected <b>before</b> the work, not during it.")}});
   return st;
 }
}
];

/* ================= СБОРКА КАРТИНЫ ================= */
var OUTRO = {
ru:`<p>Программа держится на одной мысли: <strong>чтобы узнать чужой результат, повтори его сам и сравни</strong>. Разбирать пришедшую картинку не пришлось ни разу — мы пять раз нарисовали свою.</p>
<p>Всё остальное в программе — обвязка вокруг этой мысли. <code>cell</code> отвечает про одну клетку и смотрит только на адрес. <code>match</code> собирает из клеток строку и сравнивает с настоящей, выходя на первом же расхождении. <code>main</code> читает трубу, считает размеры, отсекает заведомо негодный ввод и склеивает ответ.</p>
<p>Три вещи из этой задачи переносятся дальше и стоят того, чтобы их забрать:</p>
<ul>
<li><strong>Порядок проверок — это тоже логика.</strong> В <code>cell</code> он решает, что будет при ширине 1, и его нельзя переставлять «для красоты».</li>
<li><strong>Правильно разложенные данные убирают код.</strong> Список фигур записан по алфавиту — и требование «вывести по алфавиту» выполнилось само, без единой строки сортировки.</li>
<li><strong>Отсекай негодное до работы, а не по ходу.</strong> Пустой ввод и рваные строки проверяются один раз в начале, поэтому дальше можно ничего не перепроверять.</li>
</ul>
<p>И главное отличие от <code>quad</code>: там ответ в каждой клетке был известен сразу, здесь тоже — но задача перевёрнута. Одна и та же функция <code>cell</code> годится и чтобы рисовать, и чтобы узнавать.</p>`,
en:`<p>The program rests on one idea: <strong>to identify someone else's result, reproduce it yourself and compare</strong>. The incoming picture never had to be parsed — we drew our own five times.</p>
<p>Everything else is plumbing around that idea. <code>cell</code> answers about one cell and looks only at its address. <code>match</code> builds a line out of cells and compares it with the real one, leaving at the first mismatch. <code>main</code> reads the pipe, works out the size, rejects input that cannot possibly qualify, and assembles the answer.</p>
<p>Three things from this task carry over and are worth taking with you:</p>
<ul>
<li><strong>The order of checks is logic too.</strong> In <code>cell</code> it decides what happens at width 1, and it cannot be rearranged "for neatness".</li>
<li><strong>Well-arranged data removes code.</strong> The list of shapes is written alphabetically — and the "print them alphabetically" requirement was met by itself, without a single line of sorting.</li>
<li><strong>Reject the unusable before the work, not during it.</strong> Empty input and ragged lines are checked once at the start, so nothing has to be re-checked later.</li>
</ul>
<p>And the main difference from <code>quad</code>: there the answer in every cell was known immediately, and here it is too — but the task is inverted. The very same <code>cell</code> function works both for drawing and for recognising.</p>`
};
