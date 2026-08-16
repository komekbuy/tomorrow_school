var META = {
  n: 11,
  slug: "11-quad",
  eyebrow:{ru:"Go с нуля · тема 11 из 13", en:"Go from zero · topic 11 of 13"},
  title:  {ru:"Проект quad", en:"The quad project"},
  lede:{
    ru:"Первая законченная программа: задаёшь ширину и высоту — получаешь рамку из символов. Всё держится на двух вложенных циклах и одном вопросе в каждой клетке.",
    en:"The first finished program: give it a width and a height, get a frame made of characters. It all rests on two nested loops and one question per cell."
  },
  folder: "quad",
  txt: {ru:"go-tema-11-quad.txt", en:"go-topic-11-quad.txt"}
};

var INTRO = {
ru:`<p><strong>Что за задача.</strong> Написать функцию, которая печатает прямоугольную рамку заданной ширины и высоты: по краям символы, внутри пусто.</p>
<pre><code>quad(6, 4)  ->  o----o
                |    |
                |    |
                o----o</code></pre>
<p>Вариантов пять — quadA, quadB, quadC, quadD, quadE, — и различаются они <strong>только набором символов</strong>. Циклы и условия во всех пяти совпадают слово в слово, поэтому разбираем одну, а остальные получаются заменой шести значений.</p>
<p><strong>Как решается.</strong> Поле состоит из строк и столбцов, значит нужны два цикла: внешний идёт по строкам сверху вниз, внутренний — по клеткам внутри строки слева направо. В каждой клетке решается один вопрос: <em>что здесь печатать?</em></p>
<p>Ответ на него виден сразу из положения клетки — искать ничего не надо. Первая строка или последняя, первый столбец или последний, угол или середина. Отсюда и вся программа: два цикла, два вложенных вопроса и четыре возможных символа.</p>
<p>Новых языковых конструкций здесь нет ни одной: циклы, условия, функции, печать. Тема про другое — <strong>как из знакомых кусков собрать программу, которая делает работу целиком</strong>. И про две вещи, на которых спотыкаются чаще всего: порядок проверок и границы цикла.</p>
<p>Дальше эта же программа встретится ещё раз, вывернутая наизнанку: в теме <code>quadchecker</code> по готовой картинке надо будет назвать, кто её нарисовал. Разберёшь <code>quad</code> — та задача станет очевидной.</p>`,
en:`<p><strong>The task.</strong> Write a function that prints a rectangular frame of a given width and height: characters around the edges, empty inside.</p>
<pre><code>quad(6, 4)  ->  o----o
                |    |
                |    |
                o----o</code></pre>
<p>There are five variants — quadA, quadB, quadC, quadD, quadE — and they differ <strong>only in their set of characters</strong>. The loops and conditions in all five match word for word, so we take one apart and the rest come from replacing six values.</p>
<p><strong>How it is solved.</strong> A field is made of rows and columns, so two loops are needed: the outer walks the rows top to bottom, the inner walks the cells of a row left to right. Every cell answers one question: <em>what do I print here?</em></p>
<p>The answer follows straight from the cell's position — nothing has to be searched for. First row or last, first column or last, corner or middle. That is the whole program: two loops, two nested questions and four possible characters.</p>
<p>There is not a single new language construct here: loops, conditions, functions, printing. The topic is about something else — <strong>how to assemble a program that does a whole job out of familiar pieces</strong>. And about the two things people trip over most: the order of checks and loop bounds.</p>
<p>This same program returns later, turned inside out: in the <code>quadchecker</code> topic you will have to name who drew a finished picture. Take <code>quad</code> apart and that task becomes obvious.</p>`
};

/* ================= ПРАВИЛА ================= */
var RULES = [
{
 sec:{ru:"quad — рисуем фигуру по размерам", en:"quad — drawing a shape from its dimensions"},
 secIntro:{ru:`<p><strong>Что за задача.</strong> Написать функцию, которая печатает прямоугольную рамку заданной ширины и высоты. По краям символы, внутри пусто.</p>
<pre><code>quad(5, 4)  ->  o---o
                |   |
                |   |
                o---o</code></pre>
<p><strong>Как решается.</strong> Поле обходится двумя циклами: внешний идёт по строкам сверху вниз, внутренний — по клеткам внутри строки слева направо. В каждой клетке один вопрос: она на краю или внутри? Ответ виден сразу из номеров строки и столбца, искать ничего не надо.</p>
<p>Вариантов фигуры пять — quadA…quadE, — и различаются они только набором символов. Логика у всех одна, поэтому разбираем одну.</p>`,
 en:`<p><strong>The task.</strong> Write a function that prints a rectangular frame of a given width and height. Characters around the edges, empty inside.</p>
<pre><code>quad(5, 4)  ->  o---o
                |   |
                |   |
                o---o</code></pre>
<p><strong>How it is solved.</strong> The field is walked by two loops: the outer one goes down the rows, the inner one across the cells of a row. Every cell asks one question: am I on an edge or inside? The answer follows straight from the row and column numbers — nothing has to be searched for.</p>
<p>There are five variants of the shape — quadA…quadE — and they differ only in which characters they use. The logic is the same for all of them, so we take one apart.</p>`},
 h:{ru:"Фигура — это два вложенных цикла и один вопрос в клетке",
    en:"A shape is two nested loops and one question per cell"},
 b:{ru:`<p>Поле состоит из строк и столбцов, значит нужны два цикла: внешний идёт по строкам, внутренний — по столбцам внутри строки.</p>
<pre><code>for row := 1; row &lt;= y; row++ {
	for col := 1; col &lt;= x; col++ {
		<span class="cm">// что печатать в клетке (row, col)?</span>
	}
	fmt.Print("\\n")
}</code></pre>
<p>Внутри внутреннего цикла решается ровно один вопрос: какой символ идёт в клетку с координатами <code>row</code> и <code>col</code>. Больше там не происходит ничего. Признаков, из которых складывается ответ, всего четыре:</p>
<pre><code>row == 1    <span class="cm">// первая строка</span>
row == y    <span class="cm">// последняя строка</span>
col == 1    <span class="cm">// первый столбец</span>
col == x    <span class="cm">// последний столбец</span></code></pre>
<p>Из этих четырёх собирается вся картинка. Угол — это «край по строке <em>и</em> край по столбцу»: <code>(row == 1 || row == y) &amp;&amp; (col == 1 || col == x)</code>. Горизонтальная линия — край по строке, но не по столбцу. Вертикальная — наоборот. Всё остальное — середина, туда идёт пробел.</p>
<p>Теперь про место, где ошибаются чаще всего. <strong>Перевод строки ставится после внутреннего цикла, но внутри внешнего.</strong> Отступ здесь не украшение, он определяет результат:</p>
<pre><code><span class="cm">// внутри внутреннего цикла — по символу на строку, столбик</span>
for col := 1; col &lt;= x; col++ {
	fmt.Print("*")
	fmt.Print("\\n")
}

<span class="cm">// после внешнего — вся фигура в одну строку</span>
for row := 1; row &lt;= y; row++ {
	for col := 1; col &lt;= x; col++ {
		fmt.Print("*")
	}
}
fmt.Print("\\n")</code></pre>
<p>Ни один из этих вариантов не ошибка для компилятора — оба соберутся. Правильный ровно один: строка кончилась ровно тогда, когда кончился внутренний цикл.</p>
<p>И следствие, которое стоит увидеть заранее: пять разных рамок — это <strong>один и тот же код</strong>. Циклы одинаковые, условия одинаковые, отличаются только символы внутри <code>fmt.Print</code>. Поэтому пятая фигура пишется копированием первой и заменой шести символов, а не сочиняется заново. Таблица этих символов — сразу после правил.</p>`,
    en:`<p>A field is made of rows and columns, so it takes two loops: the outer one walks the rows, the inner one the columns inside a row.</p>
<pre><code>for row := 1; row &lt;= y; row++ {
	for col := 1; col &lt;= x; col++ {
		<span class="cm">// what goes in cell (row, col)?</span>
	}
	fmt.Print("\\n")
}</code></pre>
<p>Inside the inner loop exactly one question is answered: which character belongs in the cell at <code>row</code> and <code>col</code>. Nothing else happens there. There are only four facts the answer is built from:</p>
<pre><code>row == 1    <span class="cm">// first row</span>
row == y    <span class="cm">// last row</span>
col == 1    <span class="cm">// first column</span>
col == x    <span class="cm">// last column</span></code></pre>
<p>The whole picture comes out of those four. A corner is "edge by row <em>and</em> edge by column": <code>(row == 1 || row == y) &amp;&amp; (col == 1 || col == x)</code>. A horizontal line is an edge by row but not by column. A vertical line is the other way round. Everything else is the middle, and a space goes there.</p>
<p>Now the place where people go wrong most. <strong>The newline goes after the inner loop but inside the outer one.</strong> The indentation here is not decoration, it decides the result:</p>
<pre><code><span class="cm">// inside the inner loop — one character per line, a column</span>
for col := 1; col &lt;= x; col++ {
	fmt.Print("*")
	fmt.Print("\\n")
}

<span class="cm">// after the outer loop — the whole shape on one line</span>
for row := 1; row &lt;= y; row++ {
	for col := 1; col &lt;= x; col++ {
		fmt.Print("*")
	}
}
fmt.Print("\\n")</code></pre>
<p>Neither of these is an error to the compiler — both build fine. Exactly one is right: a line ends precisely when the inner loop ends.</p>
<p>And a consequence worth seeing early: five different frames are <strong>one and the same code</strong>. Same loops, same conditions; only the characters inside <code>fmt.Print</code> differ. So the fifth shape is written by copying the first and swapping six characters, not invented from scratch. The table of those characters comes right after the rules.</p>`}
},

{
 h:{ru:"Проверка размеров стоит до всякой работы",
    en:"The size check comes before any work"},
 b:{ru:`<p>Первая строка функции — не цикл, а отказ работать с тем, с чем работать нельзя:</p>
<pre><code>func quad(x, y int) {
	if x &lt;= 0 || y &lt;= 0 {
		return
	}
	<span class="cm">// дальше можно считать, что размеры нормальные</span>
}</code></pre>
<p>Обрати внимание на знак: <code>&lt;=</code>, а не <code>&lt;</code>. Отрицательная ширина бессмысленна очевидно, но <strong>нулевая бессмысленна ровно так же</strong> — а ведёт себя хуже. При <code>x = 0</code> внутренний цикл не сделает ни одного шага, зато внешний честно отработает <code>y</code> раз и напечатает <code>y</code> пустых строк. Программа не упадёт и не пожалуется, просто выдаст мусор, который легко не заметить.</p>
<pre><code>quad(0, 3)   <span class="cm">// без проверки: три пустые строки</span>
quad(0, 3)   <span class="cm">// с проверкой: ничего</span></code></pre>
<p><code>return</code> здесь пустой — без значения. Так и должно быть: функция ничего не возвращает, её работа — печать, и <code>return</code> означает просто «выходим отсюда, делать нечего».</p>
<p>Приём общий, и он не про рисование. <strong>Сначала функция отбрасывает то, с чем работать нельзя, потом работает.</strong> Выигрыш в том, что дальше по коду про странные входы можно не помнить: до цикла дошли — значит, размеры нормальные. Без такой проверки условие «а вдруг ноль» пришлось бы держать в голове в каждой следующей строке.</p>
<p>В судоку тот же приём занимает не три строки, а тридцать — там проверять надо больше, — но смысл ровно тот же, и это седьмое правило темы.</p>`,
    en:`<p>The first line of the function is not a loop but a refusal to work with what cannot be worked with:</p>
<pre><code>func quad(x, y int) {
	if x &lt;= 0 || y &lt;= 0 {
		return
	}
	<span class="cm">// from here on the sizes can be assumed sane</span>
}</code></pre>
<p>Note the operator: <code>&lt;=</code>, not <code>&lt;</code>. A negative width is obviously meaningless, but <strong>a zero width is just as meaningless</strong> — and behaves worse. With <code>x = 0</code> the inner loop takes no steps at all, while the outer one dutifully runs <code>y</code> times and prints <code>y</code> empty lines. The program neither crashes nor complains, it just produces garbage that is easy to miss.</p>
<pre><code>quad(0, 3)   <span class="cm">// without the check: three empty lines</span>
quad(0, 3)   <span class="cm">// with the check: nothing</span></code></pre>
<p>The <code>return</code> here is bare — no value. As it should be: the function returns nothing, its job is printing, and <code>return</code> simply means "leave, there is nothing to do".</p>
<p>The technique is general, and it is not about drawing. <strong>First the function throws out what it cannot handle, then it works.</strong> The gain is that the rest of the code need not remember the odd cases: if you got past the check, the sizes are sane. Without it, "what if it is zero" would have to be carried in your head through every following line.</p>
<p>In sudoku the same move takes thirty lines instead of three — there is more to check — but the meaning is identical, and that is rule seven of this topic.</p>`}
},

{
 h:{ru:"Полный код: quadA целиком",
    en:"The full code: quadA from top to bottom"},
 b:{ru:`<p>Вот вся программа. Остальные четыре фигуры отличаются <strong>только символами</strong> внутри <code>fmt.Print</code> — циклы и условия в них слово в слово те же.</p>
<pre><code>package main

import &quot;fmt&quot;

func QuadA(x, y int) {
	if x &lt;= 0 || y &lt;= 0 {
		return
	}

	for row := 1; row &lt;= y; row++ {
		for col := 1; col &lt;= x; col++ {
			if row == 1 || row == y {
				if col == 1 || col == x {
					fmt.Print(&quot;o&quot;)
				} else {
					fmt.Print(&quot;-&quot;)
				}
			} else {
				if col == 1 || col == x {
					fmt.Print(&quot;|&quot;)
				} else {
					fmt.Print(&quot; &quot;)
				}
			}
		}
		fmt.Print(&quot;\n&quot;)
	}
}</code></pre>
<div class="tablewrap"><table>
<tr><th>кусок</th><th>что делает</th></tr>
<tr><td><code>if x &lt;= 0 || y &lt;= 0</code></td><td>отсечка. На нулевых и отрицательных размерах рисовать нечего — выходим <strong>до</strong> всяких циклов</td></tr>
<tr><td><code>for row := 1; row &lt;= y</code></td><td>внешний цикл: идёт по строкам сверху вниз</td></tr>
<tr><td><code>for col := 1; col &lt;= x</code></td><td>внутренний: по клеткам внутри одной строки, слева направо</td></tr>
<tr><td><code>if row == 1 || row == y</code></td><td>первый вопрос про клетку: строка крайняя?</td></tr>
<tr><td>вложенный <code>if col == 1 || col == x</code></td><td>второй вопрос: столбец крайний? Оба «да» — это угол</td></tr>
<tr><td>перевод строки</td><td>стоит <strong>после</strong> внутреннего цикла: строка картинки закончилась</td></tr>
</table></div>
<p>Заметь деталь, которая пригодится дальше: здесь клетки считаются <strong>с единицы</strong> (<code>row := 1</code>, край это <code>row == y</code>). В quadchecker тот же обход написан <strong>с нуля</strong> (<code>row := 0</code>, край это <code>row == h-1</code>). Обе записи верны, но смешивать их в одной голове опасно — отсюда берутся ошибки на единицу.</p>`,
    en:`<p>Here is the whole program. The other four shapes differ <strong>only in the characters</strong> inside <code>fmt.Print</code> — their loops and conditions are word for word the same.</p>
<pre><code>package main

import &quot;fmt&quot;

func QuadA(x, y int) {
	if x &lt;= 0 || y &lt;= 0 {
		return
	}

	for row := 1; row &lt;= y; row++ {
		for col := 1; col &lt;= x; col++ {
			if row == 1 || row == y {
				if col == 1 || col == x {
					fmt.Print(&quot;o&quot;)
				} else {
					fmt.Print(&quot;-&quot;)
				}
			} else {
				if col == 1 || col == x {
					fmt.Print(&quot;|&quot;)
				} else {
					fmt.Print(&quot; &quot;)
				}
			}
		}
		fmt.Print(&quot;\n&quot;)
	}
}</code></pre>
<div class="tablewrap"><table>
<tr><th>piece</th><th>what it does</th></tr>
<tr><td><code>if x &lt;= 0 || y &lt;= 0</code></td><td>the guard. At zero or negative sizes there is nothing to draw — we leave <strong>before</strong> any loop</td></tr>
<tr><td><code>for row := 1; row &lt;= y</code></td><td>outer loop: walks the rows from top to bottom</td></tr>
<tr><td><code>for col := 1; col &lt;= x</code></td><td>inner loop: the cells of one row, left to right</td></tr>
<tr><td><code>if row == 1 || row == y</code></td><td>the first question about a cell: is the row an edge?</td></tr>
<tr><td>nested <code>if col == 1 || col == x</code></td><td>the second: is the column an edge? Both yes — it is a corner</td></tr>
<tr><td>the newline</td><td>goes <strong>after</strong> the inner loop: a row of the picture has ended</td></tr>
</table></div>
<p>Notice a detail that matters later: here cells are counted <strong>from one</strong> (<code>row := 1</code>, the edge is <code>row == y</code>). In quadchecker the same walk is written <strong>from zero</strong> (<code>row := 0</code>, the edge is <code>row == h-1</code>). Both are correct, but mixing them in your head is where off-by-one errors come from.</p>`}
},

{
 h:{ru:"Вопрос в клетке задаётся в два шага: сначала строка, потом столбец",
    en:"A cell is decided in two steps: the row first, then the column"},
 b:{ru:`<p>В клетке надо выбрать один символ из четырёх: угол, горизонталь, вертикаль или пробел. Соблазн — написать одно длинное условие. Работает лучше другое: <strong>задать два вопроса подряд</strong>.</p>
<pre><code>if row == 1 || row == y {      <span class="cm">// строка крайняя?</span>
	if col == 1 || col == x {  <span class="cm">// и столбец крайний?</span>
		<span class="cm">// оба «да» — это УГОЛ</span>
	} else {
		<span class="cm">// строка крайняя, столбец нет — ГОРИЗОНТАЛЬ</span>
	}
} else {
	if col == 1 || col == x {
		<span class="cm">// строка обычная, столбец крайний — ВЕРТИКАЛЬ</span>
	} else {
		<span class="cm">// ни то ни другое — ПУСТО</span>
	}
}</code></pre>
<p>Получается четыре исхода и ни одного лишнего: каждая клетка попадает ровно в один. Проверить легко — сложи их для картинки 5 на 4: четыре угла, шесть горизонтальных, четыре вертикальных, шесть пустых. Итого двадцать, ровно 5 умножить на 4.</p>
<p><strong>Почему два шага, а не одно условие.</strong> Одним условием «угол» пишется так: <code>(row == 1 || row == y) &amp;&amp; (col == 1 || col == x)</code>. Само по себе верно, но дальше нужны ещё три таких же для остальных исходов, и в каждом снова повторяются те же скобки. Два вложенных вопроса разбирают всё за один проход.</p>
<p>Когда углы становятся разными (quadC, quadD, quadE), внутренний вопрос дробится дальше — на «левый или правый». Логика та же, просто шагов три вместо двух.</p>`,
    en:`<p>A cell needs one character out of four: a corner, a horizontal, a vertical or a space. The temptation is one long condition. Something else works better: <strong>ask two questions in a row</strong>.</p>
<pre><code>if row == 1 || row == y {      <span class="cm">// is the row an edge?</span>
	if col == 1 || col == x {  <span class="cm">// and is the column an edge?</span>
		<span class="cm">// both yes — a CORNER</span>
	} else {
		<span class="cm">// edge row, ordinary column — HORIZONTAL</span>
	}
} else {
	if col == 1 || col == x {
		<span class="cm">// ordinary row, edge column — VERTICAL</span>
	} else {
		<span class="cm">// neither — EMPTY</span>
	}
}</code></pre>
<p>Four outcomes and not one to spare: every cell lands in exactly one. Easy to check — add them up for a 5 by 4 picture: four corners, six horizontals, four verticals, six empties. Twenty in total, exactly 5 times 4.</p>
<p><strong>Why two steps rather than one condition.</strong> As a single condition, "corner" reads <code>(row == 1 || row == y) &amp;&amp; (col == 1 || col == x)</code>. Correct in itself, but you then need three more like it for the other outcomes, each repeating the same brackets. Two nested questions sort everything out in one pass.</p>
<p>When the corners become different (quadC, quadD, quadE) the inner question splits further into "left or right". Same logic, just three steps instead of two.</p>`}
},
{
 h:{ru:"Границы цикла: последняя строка теряется одним знаком",
    en:"Loop bounds: one sign and the last row is gone"},
 b:{ru:`<p>Заголовок цикла в этой программе выглядит так:</p>
<pre><code>for row := 1; row &lt;= y; row++</code></pre>
<p>Счёт идёт <strong>с единицы</strong>, и потому граница записана через <code>&lt;=</code>. Поставь <code>&lt;</code> — и последняя строка картинки пропадёт: при <code>y</code> равном 4 цикл сделает три прохода вместо четырёх, и нижняя сторона рамки не напечатается.</p>
<div class="tablewrap"><table>
<tr><th>запись</th><th>сколько проходов при y = 4</th><th>что выйдет</th></tr>
<tr><td><code>row := 1; row &lt;= y</code></td><td>4 (1, 2, 3, 4)</td><td>правильно</td></tr>
<tr><td><code>row := 1; row &lt; y</code></td><td>3 (1, 2, 3)</td><td>нет нижней стороны</td></tr>
<tr><td><code>row := 0; row &lt; y</code></td><td>4 (0, 1, 2, 3)</td><td>тоже правильно, но края теперь <code>0</code> и <code>y-1</code></td></tr>
</table></div>
<p><strong>Обе записи верны, смешивать их нельзя.</strong> Считаешь с единицы — край это <code>1</code> и <code>y</code>, граница <code>&lt;=</code>. Считаешь с нуля — край это <code>0</code> и <code>y-1</code>, граница <code>&lt;</code>. Взять начало из одной записи, а край из другой — самый частый способ потерять строку или выйти за поле.</p>
<p>Проверка, которая занимает десять секунд и ловит это до запуска: <strong>выпиши первое и последнее значение счётчика и спроси, должны ли они попасть в вывод</strong>. Для <code>row := 1; row &lt; 4</code> последнее значение — тройка, а четвёртая строка нужна. Значит знак не тот.</p>`,
    en:`<p>The loop header in this program looks like this:</p>
<pre><code>for row := 1; row &lt;= y; row++</code></pre>
<p>Counting starts <strong>at one</strong>, which is why the bound uses <code>&lt;=</code>. Change it to <code>&lt;</code> and the last row of the picture disappears: with <code>y</code> equal to 4 the loop makes three passes instead of four and the bottom side of the frame never prints.</p>
<div class="tablewrap"><table>
<tr><th>form</th><th>passes at y = 4</th><th>result</th></tr>
<tr><td><code>row := 1; row &lt;= y</code></td><td>4 (1, 2, 3, 4)</td><td>correct</td></tr>
<tr><td><code>row := 1; row &lt; y</code></td><td>3 (1, 2, 3)</td><td>no bottom side</td></tr>
<tr><td><code>row := 0; row &lt; y</code></td><td>4 (0, 1, 2, 3)</td><td>also correct, but the edges are now <code>0</code> and <code>y-1</code></td></tr>
</table></div>
<p><strong>Both forms are right; mixing them is not.</strong> Count from one and the edges are <code>1</code> and <code>y</code> with a <code>&lt;=</code> bound. Count from zero and the edges are <code>0</code> and <code>y-1</code> with a <code>&lt;</code> bound. Taking the start from one form and the edge from the other is the most common way to lose a row or run off the field.</p>
<p>A ten-second check that catches this before you run anything: <strong>write down the first and the last value of the counter and ask whether both belong in the output</strong>. For <code>row := 1; row &lt; 4</code> the last value is three, but the fourth row is needed. So the sign is wrong.</p>`}
}
];

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
 {ru:"<strong>Перевод строки не на своём месте.</strong> Внутри внутреннего цикла — вся фигура вытянется в столбик по одному символу. После внешнего цикла — сольётся в одну длинную строку. Правильное место одно: после внутреннего цикла, внутри внешнего. Компилятор молчит во всех трёх случаях.",
  en:"<strong>The newline in the wrong place.</strong> Inside the inner loop the whole shape stretches into a one-character column. After the outer loop it collapses into one long line. There is exactly one right place: after the inner loop, inside the outer one. The compiler stays silent in all three cases."},

 {ru:"<strong><code>fmt.Print('o')</code> печатает 111.</strong> Одинарные кавычки — это руна, то есть число (тема 1). Вместо рамки на экране появится столбец кодов символов. Всё, что должно оказаться на экране, пишется в двойных кавычках.",
  en:"<strong><code>fmt.Print('o')</code> prints 111.</strong> Single quotes mean a rune, that is a number (topic 1). Instead of a frame you get a column of character codes. Anything meant for the screen goes in double quotes."},

 {ru:"<strong>Граница цикла на единицу.</strong> Счёт с единицы требует <code>row &lt;= y</code>; поставишь <code>&lt;</code> — потеряется последняя строка, и рамка окажется без низа. Счёт с нуля требует обратного: <code>row &lt; y</code>, а края становятся <code>0</code> и <code>y-1</code>. Обе записи верны, смешивать их нельзя.",
  en:"<strong>The off-by-one loop bound.</strong> Counting from one needs <code>row &lt;= y</code>; use <code>&lt;</code> and the last row is lost, leaving the frame without a bottom. Counting from zero needs the opposite, <code>row &lt; y</code>, with edges at <code>0</code> and <code>y-1</code>. Both are correct; mixing them is not."},

 {ru:"<strong>Пять файлов копипастой.</strong> Пятёрка фигур отличается только шестью символами, и делают их копированием первого файла. Опасность в том, что заменить надо <b>все</b> вхождения: пропустишь одно — получишь quadC с чужим углом, а компилятор промолчит, потому что с обеих сторон строка. Сверяй вывод с примером из задания, а не глазами по коду.",
  en:"<strong>Five files by copy-paste.</strong> The five shapes differ in six characters only, and they are made by copying the first file. The danger is that <b>every</b> occurrence must be replaced: miss one and you get quadC with someone else's corner, and the compiler stays silent because both sides are strings. Check the output against the example in the task, not the code by eye."}
];

/* ================= ПРИМЕРЫ ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

func main() {
	x := 6
	y := 3
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			fmt.Print("*")
		}
		fmt.Println()
	}
}`,
 out:"******\n******\n******",
 why:{ru:"Голый каркас: два цикла и один <code>fmt.Print</code>. Внешний цикл отвечает за строки, внутренний — за символы внутри строки, <code>fmt.Println()</code> закрывает строку.<br><b>Сломай:</b> перенеси <code>fmt.Println()</code> внутрь внутреннего цикла и посмотри, во что превратится прямоугольник.",
      en:"The bare skeleton: two loops and one <code>fmt.Print</code>. The outer loop owns the rows, the inner one the characters inside a row, and <code>fmt.Println()</code> closes the line.<br><b>Break it:</b> move <code>fmt.Println()</code> inside the inner loop and see what the rectangle turns into."}
},

{
 chg:{ru:"в клетке появился вопрос «край или середина»", en:"the cell now asks “edge or middle”"},
 code:`package main

import "fmt"

func main() {
	x := 6
	y := 3
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 || row == y || col == 1 || col == x {
				fmt.Print("*")
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}
}`,
 out:"******\n*    *\n******",
 why:{ru:"Циклы те же, добавилось одно условие. Четыре признака через <code>||</code> покрывают всю границу разом: первая строка, последняя строка, первый столбец, последний столбец.<br><b>Сломай:</b> замени <code>||</code> на <code>&amp;&amp;</code> и объясни, почему остались только углы.",
      en:"Same loops, one condition added. Four facts joined by <code>||</code> cover the whole border at once: first row, last row, first column, last column.<br><b>Break it:</b> swap <code>||</code> for <code>&amp;&amp;</code> and explain why only the corners are left."}
},

{
 chg:{ru:"верх и низ отделили от боков", en:"top and bottom split off from the sides"},
 code:`package main

import "fmt"

func main() {
	x := 6
	y := 4
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 || row == y {
				fmt.Print("-")
			} else if col == 1 || col == x {
				fmt.Print("|")
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}
}`,
 out:"------\n|    |\n|    |\n------",
 why:{ru:"Одно условие разложилось на два: сначала спрашиваем про строку, потом про столбец. Порядок важен — <code>else if</code> до столбцов доходит только тогда, когда строка не крайняя.",
      en:"One condition split in two: ask about the row first, about the column second. Order matters — the <code>else if</code> reaches the columns only when the row is not an edge one."}
},

{
 chg:{ru:"у краёв появились углы", en:"the edges got their corners"},
 code:`package main

import "fmt"

func main() {
	x := 6
	y := 4
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 || row == y {
				if col == 1 || col == x {
					fmt.Print("o")
				} else {
					fmt.Print("-")
				}
			} else {
				if col == 1 || col == x {
					fmt.Print("|")
				} else {
					fmt.Print(" ")
				}
			}
		}
		fmt.Println()
	}
}`,
 out:"o----o\n|    |\n|    |\no----o",
 why:{ru:"Полноценная рамка. Условия вложились: внешнее спрашивает про строку, внутреннее — про столбец. Угол — это единственное место, где оба ответа «край».<br><b>Сломай:</b> поменяй местами <code>\"o\"</code> и <code>\"-\"</code> и посмотри, какая часть картинки поедет.",
      en:"A complete frame. The conditions nest: the outer asks about the row, the inner about the column. A corner is the only place where both answers are \"edge\".<br><b>Break it:</b> swap <code>\"o\"</code> and <code>\"-\"</code> and see which part of the picture shifts."}
},

{
 chg:{ru:"код переехал в функцию, добавилась проверка размеров", en:"the code moved into a function, a size check appeared"},
 code:`package main

import "fmt"

func quad(x, y int) {
	if x <= 0 || y <= 0 {
		return
	}
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 || row == y {
				if col == 1 || col == x {
					fmt.Print("o")
				} else {
					fmt.Print("-")
				}
			} else {
				if col == 1 || col == x {
					fmt.Print("|")
				} else {
					fmt.Print(" ")
				}
			}
		}
		fmt.Println()
	}
}

func main() {
	quad(5, 3)
	quad(0, 4)
	quad(3, -2)
	quad(1, 1)
	quad(2, 2)
}`,
 out:"o---o\n|   |\no---o\no\noo\noo",
 why:{ru:"Пять вызовов подряд. Два из них отсекаются проверкой и не печатают ничего, три остальных — рабочие. Обрати внимание на <code>quad(1, 1)</code> и <code>quad(2, 2)</code>: там первая строка и есть последняя, а первый столбец и есть последний, поэтому вся фигура состоит из углов.<br><b>Сломай:</b> убери проверку и посмотри, что печатает <code>quad(0, 4)</code>.",
      en:"Five calls in a row. Two are cut off by the check and print nothing, the other three work. Look at <code>quad(1, 1)</code> and <code>quad(2, 2)</code>: there the first row is also the last and the first column is also the last, so the whole shape is corners.<br><b>Break it:</b> remove the check and see what <code>quad(0, 4)</code> prints."}
},

{
 chg:{ru:"символы стали параметрами — одна функция вместо пяти", en:"the characters became parameters — one function instead of five"},
 code:`package main

import "fmt"

func quad(x, y int, corner, hor, ver string) {
	if x <= 0 || y <= 0 {
		return
	}
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 || row == y {
				if col == 1 || col == x {
					fmt.Print(corner)
				} else {
					fmt.Print(hor)
				}
			} else {
				if col == 1 || col == x {
					fmt.Print(ver)
				} else {
					fmt.Print(" ")
				}
			}
		}
		fmt.Println()
	}
}

func main() {
	quad(5, 3, "o", "-", "|")
	quad(5, 3, "A", "B", "B")
}`,
 out:"o---o\n|   |\no---o\nABBBA\nB   B\nABBBA",
 why:{ru:"Логика не изменилась ни на строку — изменилось только то, откуда берутся символы. Одна функция теперь рисует любую фигуру, если передать ей нужные знаки.",
      en:"The logic did not change by a single line — only where the characters come from. One function now draws any shape if you hand it the right marks."}
},
{
 chg:{ru:"углы сверху и снизу стали разными", en:"the top and bottom corners became different"},
 code:`package main

import "fmt"

func quad(x, y int, tl, tr, bl, br, hor, ver string) {
	if x <= 0 || y <= 0 {
		return
	}
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 && col == 1 {
				fmt.Print(tl)
			} else if row == 1 && col == x {
				fmt.Print(tr)
			} else if row == y && col == 1 {
				fmt.Print(bl)
			} else if row == y && col == x {
				fmt.Print(br)
			} else if row == 1 || row == y {
				fmt.Print(hor)
			} else if col == 1 || col == x {
				fmt.Print(ver)
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}
}

func main() {
	quad(5, 3, "A", "A", "C", "C", "B", "B")
}`,
 out:"ABBBA\nB   B\nCBBBC",
 why:{ru:"Это quadC. Углы разъехались, поэтому вопрос «край или середина» пришлось разложить на четыре отдельные проверки — по одной на угол. Порядок проверок теперь важен: углы спрашиваются <b>до</b> сторон.",
      en:"This is quadC. The corners diverged, so the \"edge or middle\" question had to be split into four separate checks, one per corner. The order now matters: corners are asked <b>before</b> the sides."}
},
{
 chg:{ru:"та же функция рисует другую фигуру", en:"the same function draws a different shape"},
 code:`package main

import "fmt"

func quad(x, y int, tl, tr, bl, br, hor, ver string) {
	if x <= 0 || y <= 0 {
		return
	}
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 && col == 1 {
				fmt.Print(tl)
			} else if row == 1 && col == x {
				fmt.Print(tr)
			} else if row == y && col == 1 {
				fmt.Print(bl)
			} else if row == y && col == x {
				fmt.Print(br)
			} else if row == 1 || row == y {
				fmt.Print(hor)
			} else if col == 1 || col == x {
				fmt.Print(ver)
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}
}

func main() {
	quad(3, 3, "o", "o", "o", "o", "-", "|")
	quad(3, 3, "/", "\\\\", "\\\\", "/", "*", "*")
}`,
 out:"o-o\n| |\no-o\n/*\\\n* *\n\\*/",
 why:{ru:"Два вызова, две разные фигуры, один и тот же код. Вся разница между пятью вариантами — шесть строк-аргументов.<br><b>Сломай:</b> поменяй местами два аргумента и посмотри, какой угол уедет.",
      en:"Two calls, two different shapes, one and the same code. The whole difference between the five variants is six string arguments.<br><b>Break it:</b> swap two arguments and see which corner moves."}
},
{
 chg:{ru:"размеры ужались до единицы", en:"the sizes shrank to one"},
 code:`package main

import "fmt"

func quad(x, y int, tl, tr, bl, br, hor, ver string) {
	if x <= 0 || y <= 0 {
		return
	}
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 && col == 1 {
				fmt.Print(tl)
			} else if row == 1 && col == x {
				fmt.Print(tr)
			} else if row == y && col == 1 {
				fmt.Print(bl)
			} else if row == y && col == x {
				fmt.Print(br)
			} else if row == 1 || row == y {
				fmt.Print(hor)
			} else if col == 1 || col == x {
				fmt.Print(ver)
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}
}

func main() {
	quad(4, 1, "A", "C", "E", "G", "-", "|")
	quad(1, 4, "A", "C", "E", "G", "-", "|")
	quad(1, 1, "A", "C", "E", "G", "-", "|")
}`,
 out:"A--C\nA\n|\n|\nE\nA",
 why:{ru:"Смотри внимательно. При высоте 1 строка одновременно первая и последняя — побеждает та проверка, что записана выше, поэтому нижние углы не появляются вовсе. При ширине 1 то же самое со столбцами. А при 1 на 1 остаётся один-единственный символ — левый верхний угол.",
      en:"Look closely. At height 1 the row is both the first and the last — the check written higher wins, so the bottom corners never appear. At width 1 the same happens with columns. And at 1 by 1 a single character remains — the top-left corner."}
},
{
 chg:{ru:"посчитали, сколько раз выполнилось тело", en:"we counted how many times the body ran"},
 code:`package main

import "fmt"

func main() {
	x := 5
	y := 3
	count := 0
	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			count++
			if row == 1 || row == y {
				if col == 1 || col == x {
					fmt.Print("o")
				} else {
					fmt.Print("-")
				}
			} else {
				if col == 1 || col == x {
					fmt.Print("|")
				} else {
					fmt.Print(" ")
				}
			}
		}
		fmt.Println()
	}
	fmt.Println(count)
}`,
 out:"o---o\n|   |\no---o\n15",
 why:{ru:"Пятнадцать — это 5 умножить на 3, то есть все клетки поля. Внутренний цикл прогоняется <b>для каждой</b> строки заново, поэтому тело срабатывает столько раз, сколько клеток в картинке.<br><b>Сломай:</b> перенеси <code>count := 0</code> внутрь внешнего цикла и посмотри, что напечатается.",
      en:"Fifteen is 5 times 3, that is every cell of the field. The inner loop runs afresh <b>for every</b> row, so the body fires as many times as there are cells.<br><b>Break it:</b> move <code>count := 0</code> inside the outer loop and see what gets printed."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"FillRect", lvl:1, e:"#######\n#######\n#######",
 d:{ru:"Напечатай заполненный прямоугольник шириной 7 и высотой 3 из символа <code>#</code>.",
    en:"Print a filled rectangle 7 wide and 3 tall made of <code>#</code>."},
 h:{ru:"Два цикла: внешний по строкам, внутренний по столбцам. Перевод строки — после внутреннего цикла.",
    en:"Two loops: outer over rows, inner over columns. The newline goes after the inner loop."}},

{t:"Ladder", lvl:1, e:"*\n**\n***\n****\n*****",
 d:{ru:"Напечатай лесенку из пяти строк: в первой одна звёздочка, во второй две, и так до пяти.",
    en:"Print a five-line ladder: one star in the first line, two in the second, up to five."},
 h:{ru:"Граница внутреннего цикла не обязана быть постоянной. Пусть она зависит от номера строки: <code>col &lt;= row</code>.",
    en:"The inner loop's limit need not be constant. Let it depend on the row number: <code>col &lt;= row</code>."}},

{t:"Frame", lvl:1, e:"######\n#    #\n#    #\n######\n##\n##",
 d:{ru:"Напиши функцию <code>frame(x, y int)</code>: рамка из <code>#</code>, внутри пробелы. Если ширина или высота не больше нуля — не печатать ничего. Вызови её четыре раза: <code>frame(6, 4)</code>, <code>frame(0, 3)</code>, <code>frame(-2, 5)</code>, <code>frame(2, 2)</code>.",
    en:"Write a function <code>frame(x, y int)</code>: a frame of <code>#</code> with spaces inside. If the width or the height is not above zero, print nothing. Call it four times: <code>frame(6, 4)</code>, <code>frame(0, 3)</code>, <code>frame(-2, 5)</code>, <code>frame(2, 2)</code>."},
 h:{ru:"Проверка — первой строкой функции, до всяких циклов: <code>if x &lt;= 0 || y &lt;= 0 { return }</code>. В <code>frame(2, 2)</code> все четыре клетки крайние.",
    en:"The check is the first line of the function, before any loops: <code>if x &lt;= 0 || y &lt;= 0 { return }</code>. In <code>frame(2, 2)</code> all four cells are edge cells."}},

{t:"Checker", lvl:2, e:"#.#.#.#.\n.#.#.#.#\n#.#.#.#.\n.#.#.#.#\n#.#.#.#.\n.#.#.#.#\n#.#.#.#.\n.#.#.#.#",
 d:{ru:"Напечатай доску 8×8: <code>#</code> там, где сумма номеров строки и столбца чётная, <code>.</code> в остальных клетках. Нумерация с нуля.",
    en:"Print an 8×8 board: <code>#</code> where the sum of the row and column numbers is even, <code>.</code> everywhere else. Numbering starts at zero."},
 h:{ru:"Символ зависит не от края, а от самой пары чисел: <code>(row + col) % 2 == 0</code>. Остаток из темы 1.",
    en:"The character depends not on the edges but on the pair of numbers itself: <code>(row + col) % 2 == 0</code>. The remainder from topic 1."}},

{t:"CornerFrame", lvl:2, e:"+-----+\n|     |\n|     |\n+-----+",
 d:{ru:"Рамка 7 в ширину и 4 в высоту с тремя разными символами: углы <code>+</code>, горизонтальные линии <code>-</code>, вертикальные <code>|</code>, внутри пробелы.",
    en:"A frame 7 wide and 4 tall with three different characters: corners <code>+</code>, horizontal lines <code>-</code>, vertical lines <code>|</code>, spaces inside."},
 h:{ru:"Два вложенных условия: внешнее спрашивает про строку, внутреннее про столбец. Угол — там, где оба ответа «край».",
    en:"Two nested conditions: the outer asks about the row, the inner about the column. A corner is where both answers are \"edge\"."}},

{t:"CrossFrame", lvl:2, e:"X#####X\n#X   X#\n# X X #\n#  X  #\n# X X #\n#X   X#\nX#####X",
 d:{ru:"Квадрат 7×7. Обе диагонали — <code>X</code>, граница — <code>#</code>, остальное пробелы. Если клетка и на диагонали, и на границе, побеждает <code>X</code>. Нумерация с нуля.",
    en:"A 7×7 square. Both diagonals are <code>X</code>, the border is <code>#</code>, the rest are spaces. If a cell is both on a diagonal and on the border, <code>X</code> wins. Numbering starts at zero."},
 h:{ru:"Главная диагональ — <code>row == col</code>, побочная — <code>row + col == n - 1</code>. Кто побеждает, решает порядок проверок: диагональ спрашивают первой.",
    en:"The main diagonal is <code>row == col</code>, the anti-diagonal is <code>row + col == n - 1</code>. Who wins is decided by the order of checks: the diagonal is asked first."}},

{t:"SymbolQuad", lvl:2, e:"o-o\n| |\no-o\n#=#\n! !\n#=#",
 d:{ru:"Напиши функцию, которая рисует рамку заданных размеров, но символы угла, горизонтали и вертикали принимает <b>параметрами</b>. Вызови её дважды для поля 3×3: сначала с <code>o - |</code>, потом с <code>#</code>, <code>=</code>, <code>!</code>.",
    en:"Write a function that draws a frame of the given size but takes the corner, horizontal and vertical characters as <b>parameters</b>. Call it twice for a 3×3 field: first with <code>o - |</code>, then with <code>#</code>, <code>=</code>, <code>!</code>."},
 h:{ru:"Логику не меняй вообще — вместо <code>fmt.Print(\"o\")</code> печатай переменную. Тип параметров — <code>string</code>, тогда печатать можно напрямую.",
    en:"Do not change the logic at all — instead of <code>fmt.Print(\"o\")</code> print the variable. Make the parameters <code>string</code> so they can be printed directly."}},

{t:"ThinFrame", lvl:2, e:"o--o\no\n|\no",
 d:{ru:"Той же функцией нарисуй рамку 4 в ширину и 1 в высоту, а следом 1 в ширину и 3 в высоту. Разберись заранее, что должно получиться, и только потом запускай.",
    en:"With the same function draw a frame 4 wide and 1 high, then one 1 wide and 3 high. Work out what should come out before you run it."},
 h:{ru:"При высоте 1 строка одновременно первая и последняя. Какая проверка стоит выше, та и сработает.",
    en:"At height 1 the row is both the first and the last. Whichever check stands higher is the one that fires."}},

{t:"CountBody", lvl:2, e:"o-o\n| |\no-o\n9",
 d:{ru:"Нарисуй рамку 3×3 и посчитай, сколько раз выполнилось тело внутреннего цикла. Число напечатай после картинки.",
    en:"Draw a 3×3 frame and count how many times the inner loop body ran. Print the number after the picture."},
 h:{ru:"Накопитель создаётся <b>до</b> обоих циклов, иначе он обнулится на каждой строке.",
    en:"The counter is created <b>before</b> both loops, otherwise it resets on every row."}},

{t:"HalfFrame", lvl:3, e:"o----o\n|    |\n|    |",
 d:{ru:"Нарисуй только верхние три строки рамки шириной 6 и высотой 5. Нижнюю сторону печатать не надо, но выглядеть строки должны так, как будто рамка целая.",
    en:"Draw only the top three rows of a frame 6 wide and 5 high. The bottom side is not printed, but the rows must look as if the frame were whole."},
 h:{ru:"Рисуй как обычную рамку 6×5, но внешний цикл останови раньше. Условие «последняя строка» при этом всё равно считается от полной высоты.",
    en:"Draw it as a normal 6×5 frame but stop the outer loop early. The \"last row\" condition is still measured against the full height."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};
var NO = {ru:"не соберётся", en:"won't compile"};

var BANK = [
{q:{ru:"Где ставится перевод строки при печати фигуры?", en:"Where does the newline go when printing a shape?"},
 code:null,
 opts:[{ru:"после внутреннего цикла, внутри внешнего",en:"after the inner loop, inside the outer one"},
       {ru:"внутри внутреннего цикла",en:"inside the inner loop"},
       {ru:"после внешнего цикла",en:"after the outer loop"},
       {ru:"перед внешним циклом",en:"before the outer loop"}], ok:0,
 why:{ru:"Строка кончается ровно тогда, когда кончился внутренний цикл. Внутри него — фигура вытянется в столбик, после внешнего — сольётся в одну строку. Все три варианта соберутся.",
      en:"A line ends exactly when the inner loop ends. Inside it the shape becomes a column; after the outer loop it collapses into one line. All three compile."}},

{q:Q_OUT, code:"fmt.Print('o')", opts:["111","o","'o'",{ru:"не соберётся",en:"won't compile"}], ok:0,
 why:{ru:"Одинарные кавычки — руна, то есть число. Код символа «o» равен 111. Для печати нужны двойные кавычки: <code>fmt.Print(\"o\")</code>.",
      en:"Single quotes mean a rune, that is a number. The code of \"o\" is 111. For printing use double quotes: <code>fmt.Print(\"o\")</code>."}},

{q:{ru:"Зачем в начале функции стоит <code>if x &lt;= 0 || y &lt;= 0 { return }</code>?",
    en:"Why does <code>if x &lt;= 0 || y &lt;= 0 { return }</code> sit at the top of the function?"},
 code:null,
 opts:[{ru:"чтобы дальше по коду можно было не думать о бессмысленных размерах",en:"so the rest of the code need not think about meaningless sizes"},
       {ru:"чтобы программа не упала при делении",en:"to keep the program from crashing on a division"},
       {ru:"это требование компилятора",en:"the compiler requires it"},
       {ru:"чтобы ускорить циклы",en:"to make the loops faster"}], ok:0,
 why:{ru:"Функция сначала отбрасывает то, с чем работать нельзя, и только потом работает. Дошли до цикла — значит, размеры нормальные, и вспоминать про них больше не надо.",
      en:"The function first throws out what it cannot handle and only then works. If you reached the loop the sizes are sane, and you never have to think about them again."}},

{q:Q_HAP, code:"quad(0, 3)   // в функции есть проверка размеров",
 opts:[{ru:"не напечатает ничего",en:"prints nothing"},
       {ru:"напечатает три пустые строки",en:"prints three empty lines"},
       {ru:"напечатает одну строку",en:"prints one line"},
       {ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"Ноль не больше нуля, значит условие <code>x &lt;= 0</code> сработает и функция выйдет сразу. Ради этого случая и пишут <code>&lt;=</code>, а не <code>&lt;</code>.",
      en:"Zero is not above zero, so <code>x &lt;= 0</code> fires and the function leaves at once. That case is exactly why you write <code>&lt;=</code> rather than <code>&lt;</code>."}},

{q:Q_HAP, code:"// проверки размеров НЕТ\nx := 0\ny := 3\nfor row := 1; row <= y; row++ {\n\tfor col := 1; col <= x; col++ {\n\t\tfmt.Print(\"*\")\n\t}\n\tfmt.Println()\n}",
 opts:[{ru:"напечатает три пустые строки",en:"prints three empty lines"},
       {ru:"не напечатает ничего",en:"prints nothing"},
       {ru:"упадёт при запуске",en:"crashes at run time"},
       {ru:"не соберётся",en:"won't compile"}], ok:0,
 why:{ru:"Внутренний цикл не сделает ни шага, зато внешний отработает три раза и три раза вызовет <code>fmt.Println()</code>. Программа не жалуется — просто печатает мусор.",
      en:"The inner loop takes no steps, but the outer one runs three times and calls <code>fmt.Println()</code> three times. The program does not complain — it just prints garbage."}},

{q:{ru:"Чем отличаются пять вариантов рамки друг от друга?", en:"How do the five frame variants differ from each other?"},
 code:null,
 opts:[{ru:"только символами, которые попадают в fmt.Print",en:"only by the characters that reach fmt.Print"},
       {ru:"порядком обхода поля",en:"by the order in which the field is walked"},
       {ru:"количеством циклов",en:"by the number of loops"},
       {ru:"типом переменных row и col",en:"by the type of row and col"}], ok:0,
 why:{ru:"Циклы и условия во всех пяти одинаковые. Поэтому пятый вариант пишется копированием первого и заменой шести символов, а не сочиняется заново.",
      en:"The loops and conditions are identical in all five. So the fifth variant is written by copying the first and swapping six characters, not invented from scratch."}},

{q:{ru:"Сколько раз выполнится тело внутреннего цикла при <code>quad(4, 3)</code>?",
    en:"How many times does the inner loop body run for <code>quad(4, 3)</code>?"},
 code:null, opts:["12","7","4","3"], ok:0,
 why:{ru:"Внешний цикл делает 3 шага, внутренний на каждом из них — 4. Тело срабатывает 3 × 4 = 12 раз, по разу на клетку.",
      en:"The outer loop takes 3 steps, the inner one 4 on each of them. The body fires 3 × 4 = 12 times, once per cell."}},

{q:{ru:"Какую клетку описывает условие <code>row == y &amp;&amp; col == x</code>?",
    en:"Which cell does <code>row == y &amp;&amp; col == x</code> describe?"},
 code:null,
 opts:[{ru:"нижний правый угол",en:"the bottom-right corner"},
       {ru:"верхний левый угол",en:"the top-left corner"},
       {ru:"всю последнюю строку",en:"the whole last row"},
       {ru:"весь последний столбец",en:"the whole last column"}], ok:0,
 why:{ru:"<code>row == y</code> — последняя строка, <code>col == x</code> — последний столбец. Связка <code>&amp;&amp;</code> требует обоих сразу, а это одна-единственная клетка.",
      en:"<code>row == y</code> is the last row, <code>col == x</code> the last column. <code>&amp;&amp;</code> demands both at once, and that is one single cell."}},

{q:{ru:"Сколько разных исходов у одной клетки в рамке?", en:"How many different outcomes does one cell of a frame have?"},
 code:null,
 opts:[{ru:"четыре: угол, горизонталь, вертикаль, пусто",en:"four: corner, horizontal, vertical, empty"},
       {ru:"два: край и середина",en:"two: edge and middle"},
       {ru:"три: угол, сторона, пусто",en:"three: corner, side, empty"},
       {ru:"шесть, по числу символов",en:"six, one per character"}], ok:0,
 why:{ru:"Два вопроса подряд — про строку и про столбец — дают ровно четыре сочетания, и каждая клетка попадает в одно из них.",
      en:"Two questions in a row — about the row and about the column — give exactly four combinations, and every cell lands in one of them."}},

{q:Q_OUT, code:"x, y := 5, 4\n// сколько клеток обойдут два цикла?",
 opts:["20","9","16","25"], ok:0,
 why:{ru:"Внутренний цикл прогоняется заново для каждой строки: 5 умножить на 4 равно 20. Тело срабатывает столько раз, сколько клеток в картинке.",
      en:"The inner loop runs afresh for every row: 5 times 4 is 20. The body fires as many times as there are cells."}},

{q:{ru:"Счёт идёт с единицы. Какая граница цикла верна?", en:"Counting starts at one. Which loop bound is right?"},
 code:null,
 opts:[{ru:"row := 1; row <= y",en:"row := 1; row <= y"},
       {ru:"row := 1; row < y",en:"row := 1; row < y"},
       {ru:"row := 0; row <= y",en:"row := 0; row <= y"},
       {ru:"row := 0; row < y-1",en:"row := 0; row < y-1"}], ok:0,
 why:{ru:"С единицы последняя строка равна <code>y</code>, значит она должна попасть в вывод — нужен <code>&lt;=</code>. Со знаком <code>&lt;</code> рамка останется без нижней стороны.",
      en:"Counting from one, the last row equals <code>y</code>, so it must be included — <code>&lt;=</code> is needed. With <code>&lt;</code> the frame is left without its bottom side."}},

{q:{ru:"Счёт идёт с нуля. Как записывается «последняя строка»?", en:"Counting starts at zero. How is \"the last row\" written?"},
 code:null,
 opts:["row == y-1","row == y","row == 0","row == y+1"], ok:0,
 why:{ru:"С нуля строки идут 0…y-1, поэтому последняя это <code>y-1</code>. Взять начало из одной записи, а край из другой — самый частый способ потерять строку.",
      en:"From zero the rows run 0…y-1, so the last one is <code>y-1</code>. Taking the start from one form and the edge from another is the commonest way to lose a row."}},

{q:Q_HAP, code:"// углы проверяются ПОСЛЕ сторон:\nif row == 1 || row == y { fmt.Print(hor) }\nif row == 1 && col == 1 { fmt.Print(tl) }",
 opts:[{ru:"углы не напечатаются — до них не дойдёт",en:"the corners never print — they are never reached"},
       {ru:"ничего не изменится",en:"nothing changes"},
       {ru:"напечатается и угол, и горизонталь",en:"both the corner and the horizontal print"},
       {ru:NO.ru,en:NO.en}], ok:0,
 why:{ru:"Угол — это тоже клетка крайней строки. Проверка про строку сработает раньше и вернёт горизонталь, а до угловой ветки дело не дойдёт. Порядок проверок здесь и есть логика.",
      en:"A corner is also a cell of an edge row. The row check fires first and returns the horizontal; the corner branch is never reached. The order of checks is the logic here."}},

{q:{ru:"Что рисует функция при вызове с шириной 1 и высотой 1?", en:"What does the function draw when called with width 1 and height 1?"},
 code:null,
 opts:[{ru:"один символ — левый верхний угол",en:"one character — the top-left corner"},
       {ru:"четыре угла подряд",en:"four corners in a row"},
       {ru:"ничего",en:"nothing"},
       {ru:"пробел",en:"a space"}], ok:0,
 why:{ru:"Единственная клетка подходит сразу под все четыре угла. Выигрывает тот, чья проверка записана выше — левый верхний.",
      en:"The single cell fits all four corners at once. The one whose check is written higher wins — the top-left."}},

{q:Q_HAP, code:"count := 0\nfor row := 1; row <= 3; row++ {\n\tcount = 0\n\tfor col := 1; col <= 5; col++ {\n\t\tcount++\n\t}\n}\nfmt.Println(count)",
 opts:["5","15","3","0"], ok:0,
 why:{ru:"Строка <code>count = 0</code> стоит внутри внешнего цикла и обнуляет накопитель на каждой строке. До печати доживает только счёт последней строки — пять.",
      en:"The line <code>count = 0</code> sits inside the outer loop and resets the counter on every row. Only the last row's count survives to the print — five."}},

{q:{ru:"Зачем символы фигуры выносят в параметры функции?", en:"Why are the shape's characters moved into function parameters?"},
 code:null,
 opts:[{ru:"чтобы одна функция рисовала все пять фигур",en:"so one function draws all five shapes"},
       {ru:"чтобы программа работала быстрее",en:"to make the program faster"},
       {ru:"этого требует Go",en:"Go requires it"},
       {ru:"чтобы не писать циклы",en:"to avoid writing loops"}], ok:0,
 why:{ru:"Логика у пяти фигур одна и та же, отличаются только шесть символов. Вынес их наружу — и вместо пяти почти одинаковых функций осталась одна.",
      en:"The logic of the five shapes is identical; only six characters differ. Move them outside and five nearly identical functions collapse into one."}},

{q:Q_OUT, code:"for row := 1; row <= 3; row++ {\n\tfor col := 1; col <= 3; col++ {\n\t\tfmt.Print(\"*\")\n\t\tfmt.Println()\n\t}\n}",
 opts:[{ru:"девять строк по одной звёздочке",en:"nine lines with one asterisk each"},
       {ru:"три строки по три звёздочки",en:"three lines of three asterisks"},
       {ru:"одна строка из девяти звёздочек",en:"one line of nine asterisks"},
       {ru:"три звёздочки в столбик",en:"three asterisks in a column"}], ok:0,
 why:{ru:"Перевод строки попал <b>внутрь</b> внутреннего цикла, поэтому он срабатывает после каждой клетки. Фигура вытягивается в столбик.",
      en:"The newline ended up <b>inside</b> the inner loop, so it fires after every cell. The shape stretches into a column."}},

{q:{ru:"Что произойдёт, если убрать проверку размеров и вызвать функцию с шириной 0?",
    en:"What happens if the size check is removed and the function is called with width 0?"},
 code:null,
 opts:[{ru:"напечатается несколько пустых строк",en:"a few empty lines are printed"},
       {ru:"программа упадёт",en:"the program crashes"},
       {ru:"ничего не напечатается",en:"nothing is printed"},
       {ru:"цикл станет бесконечным",en:"the loop runs forever"}], ok:0,
 why:{ru:"Внутренний цикл не сделает ни шага, а вот перевод строки после него сработает — по разу на каждую строку. Вместо «ничего» получаются пустые строки.",
      en:"The inner loop takes no steps, but the newline after it still fires — once per row. Instead of \"nothing\" you get empty lines."}},

{q:{ru:"Почему проверка размеров стоит первой строкой функции?", en:"Why is the size check the first line of the function?"},
 code:null,
 opts:[{ru:"чтобы отсечь негодный ввод до всякой работы",en:"to reject unusable input before any work"},
       {ru:"так требует gofmt",en:"gofmt requires it"},
       {ru:"чтобы функция была короче",en:"to make the function shorter"},
       {ru:"чтобы циклы работали быстрее",en:"to make the loops faster"}], ok:0,
 why:{ru:"Если проверить потом, программа успеет напечатать мусор. Отсечка первой строкой — общий приём: сначала выгоняем то, с чем работать нельзя.",
      en:"Check it later and the program has already printed rubbish. A guard on the first line is a general move: throw out what cannot be worked with first."}},

{q:{ru:"Чем quadD отличается от quadC?", en:"How does quadD differ from quadC?"},
 code:null,
 opts:[{ru:"только набором символов в углах",en:"only by which characters sit in the corners"},
       {ru:"числом циклов",en:"by the number of loops"},
       {ru:"порядком обхода клеток",en:"by the order the cells are walked"},
       {ru:"проверкой размеров",en:"by the size check"}], ok:0,
 why:{ru:"Циклы и условия у всех пяти вариантов совпадают слово в слово. Вся разница — шесть символов: четыре угла, горизонталь и вертикаль.",
      en:"The loops and conditions of all five variants match word for word. The whole difference is six characters: four corners, a horizontal and a vertical."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Почему перевод строки стоит после внутреннего цикла, а не внутри?",
    en:"Why does the newline come after the inner loop rather than inside it?"},
 a:{ru:`<p>Потому что внутренний цикл — это и есть одна строка картинки. Пока он идёт, строка ещё не закончилась; как только он закончился, её пора закрывать.</p>
<p>Три места — три разных результата, и все три собираются:</p>
<pre><code><span class="cm">// внутри внутреннего: столбик по одному символу</span>
<span class="cm">// после внутреннего, внутри внешнего: правильно</span>
<span class="cm">// после внешнего: вся фигура в одну строку</span></code></pre>
<p>Проверить проще всего на прямоугольнике 3×2: правильный вариант даёт две строки по три символа, остальные — шесть строк по одному или одну строку из шести.</p>`,
    en:`<p>Because the inner loop <em>is</em> one line of the picture. While it runs the line is unfinished; the moment it ends, the line must be closed.</p>
<p>Three places, three different results, and all three compile:</p>
<pre><code><span class="cm">// inside the inner loop: a one-character column</span>
<span class="cm">// after the inner, inside the outer: correct</span>
<span class="cm">// after the outer: the whole shape on one line</span></code></pre>
<p>The easiest test is a 3×2 rectangle: the right version gives two lines of three characters, the others give six lines of one or one line of six.</p>`}},

{q:{ru:"Почему в проверке размеров стоит <code>&lt;= 0</code>, а не <code>&lt; 0</code>?",
    en:"Why is the size check <code>&lt;= 0</code> and not <code>&lt; 0</code>?"},
 a:{ru:`<p>Потому что нулевая ширина так же бессмысленна, как отрицательная, — и ведёт себя незаметнее.</p>
<p>При <code>x = 0</code> внутренний цикл не сделает ни шага: условие <code>col &lt;= 0</code> ложно с самого начала. Но внешний-то отработает <code>y</code> раз и <code>y</code> раз напечатает пустую строку. На экране появится несколько пустых строк, программа не пожалуется, и понять, что что-то не так, будет трудно.</p>
<p>Отрицательная ширина ведёт себя так же — тоже ни одного шага внутреннего цикла. Поэтому оба случая отсекают одним условием: <code>x &lt;= 0 || y &lt;= 0</code>.</p>`,
    en:`<p>Because a zero width is just as meaningless as a negative one — and it behaves more quietly.</p>
<p>With <code>x = 0</code> the inner loop takes no steps: <code>col &lt;= 0</code> is false from the start. But the outer one runs <code>y</code> times and prints an empty line <code>y</code> times. A few empty lines appear on screen, the program does not complain, and noticing the problem is hard.</p>
<p>A negative width behaves the same — no inner steps either. So both cases are cut off by one condition: <code>x &lt;= 0 || y &lt;= 0</code>.</p>`}},

{q:{ru:"Что общего у рисования рамки и решения судоку?",
    en:"What do drawing a frame and solving sudoku have in common?"},
 a:{ru:`<p>Каркас. Оба обходят поле двумя вложенными циклами и в каждой клетке решают один вопрос.</p>
<div class="tablewrap"><table>
<tr><th></th><th>Рамка</th><th>Судоку</th></tr>
<tr><td>Обход</td><td>два цикла по строкам и столбцам</td><td>два цикла по строкам и столбцам</td></tr>
<tr><td>Вопрос в клетке</td><td>какой символ печатать</td><td>какая цифра сюда встанет</td></tr>
<tr><td>Откуда ответ</td><td>из положения клетки</td><td>из перебора с откатом</td></tr>
<tr><td>Можно ли ошибиться</td><td>нет, ответ окончателен</td><td>да, поэтому нужен откат</td></tr>
</table></div>
<p>Разница только в том, окончателен ли ответ. У рамки клетка на первой строке — это навсегда первая строка. У судоку поставленная цифра может оказаться неверной через двадцать клеток, и тогда её придётся стереть.</p>
<p>Отсюда и разный размер программ: двадцать строк против ста двадцати. Каркас один и тот же.</p>`,
    en:`<p>The skeleton. Both walk a field with two nested loops and answer one question in every cell.</p>
<div class="tablewrap"><table>
<tr><th></th><th>Frame</th><th>Sudoku</th></tr>
<tr><td>The walk</td><td>two loops over rows and columns</td><td>two loops over rows and columns</td></tr>
<tr><td>The question in a cell</td><td>which character to print</td><td>which digit fits here</td></tr>
<tr><td>Where the answer comes from</td><td>from the cell's position</td><td>from a search with backtracking</td></tr>
<tr><td>Can it be wrong</td><td>no, the answer is final</td><td>yes, hence the backtracking</td></tr>
</table></div>
<p>The only difference is whether the answer is final. For a frame, a cell in the first row is in the first row forever. For sudoku, a digit placed now may turn out wrong twenty cells later, and then it has to be erased.</p>
<p>Hence the difference in size: twenty lines against a hundred and twenty. The skeleton is the same.</p>`}},

{q:{ru:"Почему рамка 1 на 1 печатает один символ, а не четыре угла?",
    en:"Why does a 1 by 1 frame print one character rather than four corners?"},
 a:{ru:`<p>Потому что клетка одна, а углов у неё четыре только на словах. Единственная клетка одновременно и первая строка, и последняя, и первый столбец, и последний — все четыре условия истинны сразу.</p>
<p>Функция выходит на <b>первой подошедшей</b> проверке. Левый верхний угол записан выше остальных, поэтому печатается он, а до трёх других дело не доходит.</p>
<p>Проверить это можно за минуту: поменяй местами проверки левого и правого угла и запусти <code>quad(1, 1)</code> ещё раз. Символ сменится, хотя логика «осталась той же».</p>`,
    en:`<p>Because there is only one cell, and it has four corners only in words. That single cell is at once the first row, the last row, the first column and the last — all four conditions are true simultaneously.</p>
<p>The function returns at the <b>first check that fits</b>. The top-left corner is written above the others, so that is what prints and the other three are never reached.</p>
<p>You can test this in a minute: swap the left and right corner checks and run <code>quad(1, 1)</code> again. The character changes, although the logic "stayed the same".</p>`}},

{q:{ru:"Почему внутренний цикл начинается заново для каждой строки?",
    en:"Why does the inner loop start afresh for every row?"},
 a:{ru:`<p>Потому что <code>col := 1</code> стоит в его заголовке, а заголовок выполняется при каждом входе в цикл. Внешний цикл входит во внутренний столько раз, сколько строк — и каждый раз счётчик столбцов начинается с единицы.</p>
<p>Отсюда и число проходов тела: для картинки 5 на 3 внутреннее тело сработает пятнадцать раз, а не пять.</p>
<p>Если вынести <code>col := 1</code> наружу, во вторую строку столбцы не начнутся сначала — счётчик уже дошёл до конца, и вторая строка окажется пустой.</p>`,
    en:`<p>Because <code>col := 1</code> sits in its header, and the header runs on every entry into the loop. The outer loop enters the inner one once per row, and each time the column counter starts from one.</p>
<p>Hence the number of body runs: for a 5 by 3 picture the inner body fires fifteen times, not five.</p>
<p>Move <code>col := 1</code> outside and the second row never restarts its columns — the counter has already run to the end, and the second row comes out empty.</p>`}},

{q:{ru:"Пять почти одинаковых файлов — почему не одна функция с параметрами?",
    en:"Five nearly identical files — why not one function with parameters?"},
 a:{ru:`<p>С точки зрения кода — можно и нужно, и в примерах этой темы так и сделано: символы вынесены в параметры, одна функция рисует любую фигуру.</p>
<p>Пять отдельных файлов появляются из-за условия задания: каждая функция сдаётся под своим именем и вызывается тестом отдельно. Это требование сдачи, а не устройство программы.</p>
<p>Но понимать разницу важно. <b>Копипаста пяти файлов — источник ошибок</b>: заменить надо все вхождения символа, пропустишь одно — компилятор промолчит, потому что с обеих сторон строка. Поэтому сверять надо вывод с примером из задания, а не код глазами.</p>`,
    en:`<p>From the code's point of view you can and should — and the examples in this topic do exactly that: the characters move into parameters and one function draws any shape.</p>
<p>The five separate files come from the task's own requirements: each function is submitted under its own name and called separately by the test. That is a submission rule, not the program's design.</p>
<p>But the difference matters. <b>Copy-pasting five files is a source of errors</b>: every occurrence of a character has to be replaced, and if you miss one the compiler stays silent because both sides are strings. So check the output against the task's example, not the code by eye.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */
var SCENARIOS = [
{
 name:{ru:"Рамка по клеткам", en:"The frame, cell by cell"},
 params:[
  {key:"x", label:{ru:"ширина x", en:"width x"}, min:1, max:4, def:3},
  {key:"y", label:{ru:"высота y", en:"height y"}, min:3, max:3, def:3}
 ],
 code: function(p){
   return [
    "func quad(x, y int) {          // quad(" + p.x + ", " + p.y + ")",
    "\tif x <= 0 || y <= 0 {",
    "\t\treturn",
    "\t}",
    "\tfor row := 1; row <= y; row++ {",
    "\t\tfor col := 1; col <= x; col++ {",
    "\t\t\tif row == 1 || row == y {",
    "\t\t\t\tif col == 1 || col == x {",
    "\t\t\t\t\tfmt.Print(\"o\")",
    "\t\t\t\t} else {",
    "\t\t\t\t\tfmt.Print(\"-\")",
    "\t\t\t\t}",
    "\t\t\t} else {",
    "\t\t\t\tif col == 1 || col == x {",
    "\t\t\t\t\tfmt.Print(\"|\")",
    "\t\t\t\t} else {",
    "\t\t\t\t\tfmt.Print(\" \")",
    "\t\t\t\t}",
    "\t\t\t}",
    "\t\t}",
    "\t\tfmt.Println()",
    "\t}",
    "}"
   ];
 },
 steps: function(p){
   var x = p.x, y = p.y, st = [], out = "";
   var b  = function(v){ return v ? "true" : "false"; };
   var ru = function(v){ return v ? "истина" : "ложь"; };
   var base = function(extra){
     return [["x", String(x), "int"], ["y", String(y), "int"]].concat(extra || []);
   };

   st.push({line:1, vars:base(), out:"",
     note:{ru:"Вызвали <code>quad(" + x + ", " + y + ")</code>. Первая выполненная строка — не цикл, а проверка размеров. <code>x &lt;= 0</code>: " + x + " &lt;= 0 — ложь. <code>y &lt;= 0</code>: " + y + " &lt;= 0 — ложь. Всё условие <b>false</b>, значит <code>return</code> на следующей строке пропускаем и идём к циклам.",
           en:"We called <code>quad(" + x + ", " + y + ")</code>. The first line that runs is not a loop but a size check. <code>x &lt;= 0</code>: " + x + " &lt;= 0 is false. <code>y &lt;= 0</code>: " + y + " &lt;= 0 is false. The whole condition is <b>false</b>, so the <code>return</code> on the next line is skipped and we go to the loops."}});

   for(var row = 1; row <= y; row++){
     var edgeRow = (row === 1 || row === y);
     var cells = [];
     for(var c = 0; c < x; c++) cells.push("·");
     var rowTitle = {ru:"Строка " + row + " из " + y + ": " + x + " клеток, · — ещё не напечатано",
                     en:"Row " + row + " of " + y + ": " + x + " cells, · = not printed yet"};

     st.push({line:4, vars:base([["row", String(row), "int"], ["row <= y", "true", "bool"]]),
       out:out, cells:cells.slice(), cellsTitle:rowTitle,
       note:{ru:(row === 1
                 ? "Заголовок внешнего цикла. <code>row := 1</code> выполнился один раз, и сразу проверка: <code>1 &lt;= " + y + "</code> — истина, заходим в тело."
                 : "<code>row++</code> сделал <code>row</code> равным " + row + ". Снова проверка: <code>" + row + " &lt;= " + y + "</code> — истина, начинаем строку " + row + "."),
             en:(row === 1
                 ? "The outer loop header. <code>row := 1</code> ran once, and the check follows immediately: <code>1 &lt;= " + y + "</code> is true, so we enter the body."
                 : "<code>row++</code> made <code>row</code> equal " + row + ". The check again: <code>" + row + " &lt;= " + y + "</code> is true, so row " + row + " begins.")}});

     for(var col = 1; col <= x; col++){
       var edgeCol = (col === 1 || col === x);
       var ch = edgeRow ? (edgeCol ? "o" : "-") : (edgeCol ? "|" : " ");
       var ln = edgeRow ? (edgeCol ? 8 : 10) : (edgeCol ? 14 : 16);
       var rowVars = base([["row", String(row), "int"]]);

       st.push({line:5, vars:rowVars.concat([["col", String(col), "int"], ["col <= x", "true", "bool"]]),
         out:out, cells:cells.slice(), cellsOn:[col - 1], cellsTitle:rowTitle,
         note:{ru:(col === 1
                   ? "Заголовок внутреннего цикла. <code>col := 1</code> выполняется заново для каждой строки, проверка <code>1 &lt;= " + x + "</code> — истина."
                   : "<code>col++</code> сделал <code>col</code> равным " + col + ". Проверка <code>" + col + " &lt;= " + x + "</code> — истина, беремся за клетку (" + row + ", " + col + ")."),
               en:(col === 1
                   ? "The inner loop header. <code>col := 1</code> runs afresh for every row, and the check <code>1 &lt;= " + x + "</code> is true."
                   : "<code>col++</code> made <code>col</code> equal " + col + ". The check <code>" + col + " &lt;= " + x + "</code> is true, so we take on cell (" + row + ", " + col + ").")}});

       st.push({line:6, vars:rowVars.concat([["col", String(col), "int"],
                                             ["row == 1 || row == y", b(edgeRow), "bool"]]),
         out:out, cells:cells.slice(), cellsOn:[col - 1], cellsTitle:rowTitle,
         note:{ru:"Первый вопрос про клетку — про строку. <code>row == 1</code>: " + row + " == 1 — " + ru(row === 1) + ". <code>row == y</code>: " + row + " == " + y + " — " + ru(row === y) + ". Через <code>||</code> хватает одной истины, всё условие <b>" + b(edgeRow) + "</b> — " + (edgeRow ? "заходим в тело <code>if</code>." : "тело <code>if</code> пропускаем, работает ветка <code>else</code>."),
               en:"The first question about the cell is about the row. <code>row == 1</code>: " + row + " == 1 is " + b(row === 1) + ". <code>row == y</code>: " + row + " == " + y + " is " + b(row === y) + ". With <code>||</code> one true is enough, so the whole condition is <b>" + b(edgeRow) + "</b> — " + (edgeRow ? "we step into the <code>if</code> body." : "the <code>if</code> body is skipped and the <code>else</code> branch runs.")}});

       st.push({line: edgeRow ? 7 : 13,
         vars:rowVars.concat([["col", String(col), "int"],
                              ["row == 1 || row == y", b(edgeRow), "bool"],
                              ["col == 1 || col == x", b(edgeCol), "bool"]]),
         out:out, cells:cells.slice(), cellsOn:[col - 1], cellsTitle:rowTitle,
         note:{ru:(edgeRow ? "Второй вопрос — про столбец. " : "Внутри <code>else</code> стоит точно такой же вопрос про столбец. ") +
                  "<code>col == 1</code>: " + col + " == 1 — " + ru(col === 1) + ". <code>col == x</code>: " + col + " == " + x + " — " + ru(col === x) + ". Условие <b>" + b(edgeCol) + "</b> — " +
                  (edgeCol ? "идём в тело <code>if</code>." : "идём в <code>else</code>.") +
                  (x === 1 ? " При <code>x</code> равном 1 обе части истинны сразу: единственный столбец и первый, и последний." : ""),
               en:(edgeRow ? "The second question is about the column. " : "Inside the <code>else</code> sits exactly the same question about the column. ") +
                  "<code>col == 1</code>: " + col + " == 1 is " + b(col === 1) + ". <code>col == x</code>: " + col + " == " + x + " is " + b(col === x) + ". The condition is <b>" + b(edgeCol) + "</b> — " +
                  (edgeCol ? "into the <code>if</code> body we go." : "we go to the <code>else</code>.") +
                  (x === 1 ? " With <code>x</code> equal to 1 both parts are true at once: the only column is both the first and the last." : "")}});

       cells[col - 1] = ch;
       out += ch;

       st.push({line:ln,
         vars:rowVars.concat([["col", String(col), "int"],
                              ["row == 1 || row == y", b(edgeRow), "bool"],
                              ["col == 1 || col == x", b(edgeCol), "bool"]]),
         out:out, cells:cells.slice(), cellsOn:[col - 1], cellsTitle:rowTitle,
         note:{ru:"Клетка (" + row + ", " + col + "): " + (
                 edgeRow && edgeCol ? "край по строке <b>и</b> край по столбцу. Оба ответа «край» — печатаем угол <code>\"o\"</code>." +
                                      (x === 1 && y === 1 ? " При размере 1×1 вся фигура из одного угла и состоит." : "") :
                 edgeRow            ? "строка крайняя, столбец нет. Печатаем <code>\"-\"</code> — горизонтальная линия." :
                 edgeCol            ? "строка не крайняя, столбец крайний. Печатаем <code>\"|\"</code> — вертикальная линия." :
                                      "ни строка, ни столбец не крайние. Печатаем пробел — он часть картинки, а не пустота.") +
                 " <code>fmt.Print</code> строку не переводит, поэтому символы копятся в одну строку.",
               en:"Cell (" + row + ", " + col + "): " + (
                 edgeRow && edgeCol ? "edge by row <b>and</b> edge by column. Both answers say edge — we print the corner <code>\"o\"</code>." +
                                      (x === 1 && y === 1 ? " At size 1×1 the whole shape is that one corner." : "") :
                 edgeRow            ? "the row is an edge, the column is not. We print <code>\"-\"</code> — a horizontal line." :
                 edgeCol            ? "the row is not an edge, the column is. We print <code>\"|\"</code> — a vertical line." :
                                      "neither the row nor the column is an edge. We print a space — it is part of the picture, not emptiness.") +
                 " <code>fmt.Print</code> adds no newline, so the characters pile up on one line."}});
     }

     var all = [];
     for(var q = 0; q < x; q++) all.push(q);

     st.push({line:5, vars:base([["row", String(row), "int"], ["col", String(x + 1), "int"], ["col <= x", "false", "bool"]]),
       out:out, cells:cells.slice(), cellsOn:all, cellsTitle:rowTitle,
       note:{ru:"<code>col++</code> сделал <code>col</code> равным " + (x + 1) + ". Проверка <code>" + (x + 1) + " &lt;= " + x + "</code> — ложь: условие больше не выполняется, выходим из внутреннего цикла. Тело в этот раз не работает, клетка номер " + (x + 1) + " не рисуется.",
             en:"<code>col++</code> made <code>col</code> equal " + (x + 1) + ". The check <code>" + (x + 1) + " &lt;= " + x + "</code> is false: the condition no longer holds, so we leave the inner loop. The body does not run this time and cell number " + (x + 1) + " is never drawn."}});

     out += "\n";
     st.push({line:20, vars:base([["row", String(row), "int"]]), out:out,
       cells:cells.slice(), cellsOn:all,
       cellsTitle:{ru:"Строка " + row + " готова: " + x + " клеток — " + x + " символов",
                   en:"Row " + row + " is done: " + x + " cells, " + x + " characters"},
       note:{ru:(row === 1
               ? "<b>Вот оно.</b> Следующая выполненная строка после выхода из внутреннего цикла — перевод строки. Он стоит после внутреннего цикла, но внутри внешнего, поэтому строка картинки кончилась ровно тогда, когда кончились столбцы."
               : row === y
                 ? "Последняя строка закрыта, картинка готова. <code>fmt.Println()</code> сработал " + y + " раз, а строка кода одна."
                 : "Строка " + row + " закрыта — это " + row + "-й вызов <code>fmt.Println()</code> из той же самой строки кода."),
             en:(row === 1
               ? "<b>Here it is.</b> The first line that runs after leaving the inner loop is the newline. It sits after the inner loop but inside the outer one, so the line of the picture ended exactly when the columns ran out."
               : row === y
                 ? "The last line is closed and the picture is done. <code>fmt.Println()</code> fired " + y + " times, from one and the same line of code."
                 : "Row " + row + " is closed — that is call number " + row + " to <code>fmt.Println()</code> from the very same line of code.")}});
   }

   st.push({line:4, vars:base([["row", String(y + 1), "int"], ["row <= y", "false", "bool"]]), out:out,
     note:{ru:"<code>row++</code> сделал <code>row</code> равным " + (y + 1) + ". Проверка <code>" + (y + 1) + " &lt;= " + y + "</code> — ложь, условие больше не выполняется: выходим из внешнего цикла, функция кончилась. Тело внутреннего цикла сработало " + (x * y) + " раз — по разу на клетку (" + x + " × " + y + "). Ни одна клетка не решалась дважды и ни одна не была пропущена: весь порядок задают два цикла.",
           en:"<code>row++</code> made <code>row</code> equal " + (y + 1) + ". The check <code>" + (y + 1) + " &lt;= " + y + "</code> is false, the condition no longer holds: we leave the outer loop and the function is over. The inner loop body fired " + (x * y) + " times — once per cell (" + x + " × " + y + "). No cell was decided twice and none was skipped: the two loops set the whole order."}});
   return st;
 }
},

{
 name:{ru:"Что будет без проверки размеров", en:"What happens without the size check"},
 params:[
  {key:"x", label:{ru:"ширина x", en:"width x"}, min:0, max:3, def:2},
  {key:"y", label:{ru:"высота y", en:"height y"}, min:1, max:3, def:2}
 ],
 code: function(p){
   return [
    "func quad(x, y int) {",
    "\tfor row := 1; row <= y; row++ {",
    "\t\tfor col := 1; col <= x; col++ {",
    "\t\t\tfmt.Print(\"o\")",
    "\t\t}",
    "\t\tfmt.Println()",
    "\t}",
    "}"
   ];
 },
 steps: function(p){
   var x = p.x, y = p.y, st = [], out = "";
   for(var row = 1; row <= y; row++){
     st.push({line:1, vars:[["x",String(x),"int"],["y",String(y),"int"],["row",String(row),"int"]], out:out,
       note:{ru:(row === 1
          ? "Внешний цикл: <code>row := 1</code>, проверка <code>1 &lt;= " + y + "</code> — истина. Проверки размеров в этой версии нет, поэтому в неё заходим при любом <code>x</code>."
          : "<code>row++</code> сделал <code>row</code> равным " + row + ". Проверка истинна, идём в строку " + row + "."),
             en:(row === 1
          ? "The outer loop: <code>row := 1</code>, the check <code>1 &lt;= " + y + "</code> is true. There is no size check in this version, so we enter it for any <code>x</code>."
          : "<code>row++</code> made <code>row</code> equal " + row + ". The check is true, on to row " + row + ".")}});

     for(var col = 1; col <= x; col++){
       st.push({line:2, vars:[["x",String(x),"int"],["row",String(row),"int"],["col",String(col),"int"]], out:out,
         note:{ru:"Внутренний цикл: <code>" + col + " &lt;= " + x + "</code> — истина, печатаем клетку.",
               en:"The inner loop: <code>" + col + " &lt;= " + x + "</code> is true, we print a cell."}});
       out += "o";
       st.push({line:3, vars:[["x",String(x),"int"],["row",String(row),"int"],["col",String(col),"int"]], out:out,
         note:{ru:"Напечатали <code>o</code>.",
               en:"Printed <code>o</code>."}});
     }
     if(x <= 0){
       st.push({line:2, vars:[["x",String(x),"int"],["row",String(row),"int"],["col","1","int"]], out:out,
         note:{ru:"Проверка <code>1 &lt;= " + x + "</code> — <b>ложь</b> сразу. Тело внутреннего цикла не выполнится ни разу, печатать нечего.",
               en:"The check <code>1 &lt;= " + x + "</code> is <b>false</b> right away. The inner body never runs, there is nothing to print."}});
     }
     out += "\n";
     st.push({line:5, vars:[["x",String(x),"int"],["row",String(row),"int"]], out:out,
       note:{ru:(x <= 0
          ? "А вот перевод строки стоит <b>после</b> внутреннего цикла и срабатывает всё равно. Вот она, цена отсутствия проверки: вместо «ничего не напечатать» программа печатает пустую строку — и так на каждой строке."
          : "Строка закончилась — переводим. Перевод стоит после внутреннего цикла, поэтому срабатывает один раз на строку."),
             en:(x <= 0
          ? "But the newline sits <b>after</b> the inner loop and fires anyway. That is the price of the missing guard: instead of printing nothing the program prints an empty line — once per row."
          : "The row is over — newline. It sits after the inner loop, so it fires once per row.")}});
   }
   return st;
 }
},

{
 name:{ru:"Граница цикла: <= или <", en:"The loop bound: <= or <"},
 params:[
  {key:"sign", label:{ru:"1 — row <= y, 2 — row < y", en:"1 — row <= y, 2 — row < y"}, values:[1,2], def:1}
 ],
 code: function(p){
   return [
    "y := 4",
    (p.sign === 1 ? "for row := 1; row <= y; row++ {" : "for row := 1; row < y; row++ {"),
    "\tfmt.Println(row)",
    "}"
   ];
 },
 steps: function(p){
   var y = 4, st = [], out = "";
   var le = (p.sign === 1);
   st.push({line:0, vars:[["y","4","int"]], out:"",
     note:{ru:"Высота четыре. Значит в выводе должны оказаться строки с первой по четвёртую.",
           en:"The height is four. So rows one through four must appear in the output."}});
   for(var row = 1; le ? row <= y : row < y; row++){
     st.push({line:1, vars:[["y","4","int"],["row",String(row),"int"],[le?"row <= y":"row < y","true","bool"]], out:out,
       note:{ru:"Проверка <code>" + row + (le ? " &lt;= " : " &lt; ") + y + "</code> — истина, заходим в тело.",
             en:"The check <code>" + row + (le ? " &lt;= " : " &lt; ") + y + "</code> is true, we enter the body."}});
     out += row + "\n";
     st.push({line:2, vars:[["y","4","int"],["row",String(row),"int"]], out:out,
       note:{ru:"Напечатали " + row + ".",
             en:"Printed " + row + "."}});
   }
   var last = le ? y + 1 : y;
   st.push({line:1, vars:[["y","4","int"],["row",String(last),"int"],[le?"row <= y":"row < y","false","bool"]], out:out,
     note:{ru:"Проверка <code>" + last + (le ? " &lt;= " : " &lt; ") + y + "</code> — <b>ложь</b>, цикл кончился. " + (le
        ? "Напечатались все четыре строки — это верный вариант."
        : "Напечатались только три строки из четырёх. <b>Последняя потерялась</b>, и у рамки не будет нижней стороны. Один знак — и картинка неполная."),
           en:"The check <code>" + last + (le ? " &lt;= " : " &lt; ") + y + "</code> is <b>false</b>, the loop is over. " + (le
        ? "All four rows printed — this is the correct form."
        : "Only three rows out of four printed. <b>The last one is lost</b> and the frame will have no bottom side. One sign, and the picture is incomplete.")}});
   return st;
 }
}
];

/* ================= СБОРКА КАРТИНЫ ================= */
var OUTRO = {
ru:`<p>Двадцать строк кода, и в них уже видно всё, из чего собираются программы побольше.</p>
<p><strong>Поле обходится двумя вложенными циклами.</strong> Внешний по строкам, внутренний по столбцам, перевод строки — между ними. Эта конструкция дальше встретится и в судоку, и в quadchecker, и в любой задаче про таблицу.</p>
<p><strong>В каждой клетке решается один вопрос.</strong> Здесь ответ виден сразу из положения клетки, и это самый простой случай. В судоку тот же обход, но ответ придётся искать перебором — разница только в этом.</p>
<p><strong>Порядок проверок — часть логики, а не оформление.</strong> Углы спрашиваются раньше сторон, иначе углов не будет вовсе. При размере 1 несколько условий истинны одновременно, и выигрывает записанное выше.</p>
<p><strong>Отсечка негодного ввода стоит первой строкой.</strong> Не потому что «так красивее»: без неё программа при нулевой ширине напечатает пустые строки вместо ничего.</p>
<p>И последнее, ради чего стоит вернуться к этой теме перед <code>quadchecker</code>: там задача перевёрнута — по готовой картинке надо назвать фигуру. Решается она тем, что мы <em>повторяем</em> вот эту программу и сравниваем результат.</p>`,
en:`<p>Twenty lines of code, and everything that bigger programs are assembled from is already visible in them.</p>
<p><strong>A field is walked by two nested loops.</strong> The outer one over rows, the inner over columns, the newline between them. This construction turns up again in sudoku, in quadchecker, and in any task about a table.</p>
<p><strong>Every cell answers one question.</strong> Here the answer follows straight from the cell's position, which is the easiest case. Sudoku uses the same walk but the answer has to be searched for — that is the only difference.</p>
<p><strong>The order of checks is logic, not formatting.</strong> Corners are asked before sides, otherwise there are no corners at all. At size 1 several conditions are true at once, and the one written higher wins.</p>
<p><strong>The guard against unusable input is the first line.</strong> Not for neatness: without it the program prints empty lines instead of nothing when the width is zero.</p>
<p>And one last reason to come back here before <code>quadchecker</code>: there the task is inverted — a finished picture must be traced back to its shape. It is solved by <em>repeating</em> this very program and comparing the result.</p>`
};
