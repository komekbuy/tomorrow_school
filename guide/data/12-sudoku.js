var META = {
  n: 12,
  slug: "12-sudoku",
  eyebrow:{ru:"Go с нуля · тема 12 из 13", en:"Go from zero · topic 12 of 13"},
  title:  {ru:"Проект sudoku", en:"The sudoku project"},
  lede:{
    ru:"Программа получает недорешанную доску и доводит её до конца. Тот же обход по клеткам, что у рамки, но ответ в клетке заранее не знает никто — его приходится искать.",
    en:"A program that takes an unfinished board and fills it in. The same cell-by-cell walk as the frame, but nobody knows the answer in a cell upfront — it has to be searched for."
  },
  folder: "sudoku",
  txt: {ru:"go-tema-12-sudoku.txt", en:"go-topic-12-sudoku.txt"}
};

var INTRO = {
ru:`<p><strong>Что за задача.</strong> Программа получает доску судоку: девять строк, где цифра — уже расставленное число, а точка — пустая клетка. Надо заполнить пустые так, чтобы в каждой строке, каждом столбце и каждом квадрате 3 на 3 цифры не повторялись, и напечатать доску целиком. Вход кривой или решения не существует — печатаем <code>Error</code>.</p>
<pre><code>вход:  ".96.4...1" "1...6...4" ...   ->   вывод: 5 9 6 8 4 3 7 2 1
                                                 1 7 8 2 6 9 5 3 4
                                                 ...</code></pre>
<p><strong>Как решается.</strong> Обход тот же, что у рамки: два цикла, строки снаружи, столбцы внутри. Но вопрос в клетке другой. У рамки ответ был виден сразу из положения — первая строка, последний столбец, угол. Здесь ответа не знает никто: цифра, поставленная сейчас, может оказаться неверной через двадцать клеток.</p>
<p>Отсюда вторая идея темы — <strong>перебор с откатом</strong>:</p>
<pre><code>поставили цифру -> пошли дальше -> упёрлись в тупик -> стёрли -> пробуем следующую</code></pre>
<p>Слово «стёрли» здесь главное. Без него неподошедшая цифра остаётся лежать на доске и портит все дальнейшие проверки.</p>
<p><strong>Почему программа длинная.</strong> Сто двадцать строк против двадцати у рамки — и держится это на разделении. Пять функций, у каждой ровно одна работа: прочитать вход, проверить расстановку, проверить одну клетку, решать, напечатать. Как только работы смешиваются, программа перестаёт быть понятной — и это отдельная вещь, которую стоит вынести из темы.</p>
<p>Новых языковых конструкций тут две: <strong>указатель</strong> (чтобы функции меняли одну и ту же доску, а не свои копии) и <strong>функция, вызывающая саму себя</strong>. Обе разобраны ниже отдельно.</p>`,
en:`<p><strong>The task.</strong> The program receives a sudoku board: nine lines where a digit is an already placed number and a dot is an empty cell. The empty cells must be filled so that no digit repeats in any row, column or 3 by 3 square, and the whole board printed. Bad input, or no solution at all — print <code>Error</code>.</p>
<pre><code>input:  ".96.4...1" "1...6...4" ...   ->   output: 5 9 6 8 4 3 7 2 1
                                                   1 7 8 2 6 9 5 3 4
                                                   ...</code></pre>
<p><strong>How it is solved.</strong> The walk is the same as the frame's: two loops, rows outside, columns inside. But the question in a cell is different. For the frame the answer followed straight from the position — first row, last column, corner. Here nobody knows it: a digit placed now may turn out wrong twenty cells later.</p>
<p>Hence the second idea of this topic — <strong>search with backtracking</strong>:</p>
<pre><code>place a digit -> go deeper -> hit a dead end -> erase it -> try the next</code></pre>
<p>The word "erase" is the key one. Without it a digit that did not work out stays on the board and spoils every later check.</p>
<p><strong>Why the program is long.</strong> A hundred and twenty lines against the frame's twenty — and what holds it together is the split. Five functions, each with exactly one job: read the input, check the layout, check one cell, solve, print. The moment those jobs blur, the program stops being understandable — and that is a separate thing worth taking out of this topic.</p>
<p>There are two new language constructs here: a <strong>pointer</strong> (so that functions change one and the same board rather than their own copies) and <strong>a function that calls itself</strong>. Both are taken apart separately below.</p>`
};

/* ================= ПРАВИЛА ================= */
var RULES = [
{
 sec:{ru:"sudoku — перебор с откатом", en:"sudoku — search with backtracking"},
 secIntro:{ru:`<p><strong>Что за задача.</strong> Программа получает доску судоку: девять строк, где цифра — уже расставленное число, а точка — пустая клетка. Надо заполнить пустые так, чтобы в каждой строке, каждом столбце и каждом квадрате цифры не повторялись, и напечатать доску целиком. Вход кривой или решения не существует — печатаем <code>Error</code>.</p>
<p><strong>Как решается.</strong> Обход тот же, по клеткам, но вопрос другой: какая цифра сюда встанет? Заранее этого не знает никто — цифра, поставленная сейчас, может оказаться неверной через двадцать клеток. Поэтому перебор с возвратом: поставили первую подходящую, пошли дальше, упёрлись в тупик — стёрли и пробуем следующую.</p>
<p>Программа длиннее рамки в шесть раз, и держится она на разделении: пять функций, у каждой ровно одна работа — прочитать, проверить вход, проверить одну клетку, решать, напечатать.</p>`,
 en:`<p><strong>The task.</strong> The program receives a sudoku board: nine lines where a digit is an already placed number and a dot is an empty cell. The empty cells must be filled so that no digit repeats in any row, column or square, and the whole board printed. Bad input, or no solution at all — print <code>Error</code>.</p>
<p><strong>How it is solved.</strong> The same cell-by-cell walk, but a different question: which digit fits here? Nobody knows upfront — a digit placed now may turn out wrong twenty cells later. Hence search with backtracking: place the first digit that fits, go on, hit a dead end, erase it and try the next.</p>
<p>The program is six times longer than the frame, and what holds it together is the split: five functions, each with exactly one job — read, check the input, check one cell, solve, print.</p>`},
 h:{ru:"Есть задачи, которые перебором не берутся — там нужен откат",
    en:"Some tasks defeat brute force — those need backtracking"},
 b:{ru:`<p>Судоку выглядит как та же самая доска: девять строк, девять столбцов, обход двумя циклами. Но вопрос в клетке другой, и в лоб он не решается.</p>
<p>Посчитай. Клеток 81, в пустую можно поставить до девяти цифр. Если пробовать все сочетания подряд, вариантов получается число с восемьюдесятью нулями. Такой перебор не закончится никогда — не потому, что компьютер медленный, а потому, что вариантов больше, чем атомов в обозримом пространстве.</p>
<p>Спасает мысль, которая на первый взгляд ничего не меняет: <strong>не надо перебирать всё до конца, надо бросать путь, как только он стал невозможным</strong>. Поставили цифру — пошли дальше. Дальше уперлись в клетку, куда не встаёт ничего — значит, ошибка была раньше. Возвращаемся, стираем, пробуем следующую цифру.</p>
<pre><code>for val := 1; val &lt;= 9; val++ {
	if canPlace(board, row, col, val) {
		board[row][col] = val      <span class="cm">// поставили</span>
		if solve(board) {          <span class="cm">// спросили: получится ли дальше?</span>
			return true            <span class="cm">// получилось — уходим с ответом</span>
		}
		board[row][col] = 0        <span class="cm">// не получилось — стёрли</span>
	}
}
return false                       <span class="cm">// ни одна цифра не подошла</span></code></pre>
<p>Весь откат — вот эти четыре строки. Поставили, спросили, при неудаче вернули как было. Третья строка — та самая рекурсия из темы 7: <code>solve</code> вызывает сам себя, но доска на каждом уровне на одну клетку полнее. Отсюда и остановка: когда пустых клеток не осталось, циклы просто дойдут до конца и функция вернёт <code>true</code>.</p>
<p>Почему это работает быстро: один тупик отсекает не один вариант, а всё дерево под ним. Если после <code>3</code> в первой клетке доска не решается, то отпадают разом все миллиарды продолжений, которые начинались с этой тройки. Число проверок падает с астрономического до нескольких тысяч.</p>
<p>Строка <code>board[row][col] = 0</code> — самая важная и самая забываемая. Без неё стёртая цифра остаётся на доске, следующие проверки видят её и врут, и решение не находится никогда. Ошибка не в том, что программа падает, — она честно работает и честно отвечает «решения нет».</p>`,
    en:`<p>Sudoku looks like the same board: nine rows, nine columns, walked by two loops. But the question in a cell is different, and it cannot be answered head-on.</p>
<p>Do the arithmetic. There are 81 cells and up to nine digits for an empty one. Trying every combination in turn gives a number with eighty zeros in it. Such a search never finishes — not because computers are slow, but because there are more combinations than atoms in the visible universe.</p>
<p>What saves you is an idea that at first sight changes nothing: <strong>you need not search to the end, you need to drop a path the moment it becomes impossible</strong>. Put a digit down, move on. Further along you hit a cell where nothing fits — so the mistake was earlier. Go back, erase, try the next digit.</p>
<pre><code>for val := 1; val &lt;= 9; val++ {
	if canPlace(board, row, col, val) {
		board[row][col] = val      <span class="cm">// placed</span>
		if solve(board) {          <span class="cm">// asked: does the rest work out?</span>
			return true            <span class="cm">// it does — leave with the answer</span>
		}
		board[row][col] = 0        <span class="cm">// it doesn't — erase</span>
	}
}
return false                       <span class="cm">// no digit fitted</span></code></pre>
<p>Backtracking is those four lines and nothing else. Place, ask, restore on failure. The third line is the recursion from topic 7: <code>solve</code> calls itself, but the board is one cell fuller at every level. That is where it stops: with no empty cells left the loops simply run out and the function returns <code>true</code>.</p>
<p>Why it is fast: one dead end cuts off not one option but the entire tree below it. If the board is unsolvable with a <code>3</code> in the first cell, all the billions of continuations starting with that 3 vanish at once. The count of checks drops from astronomical to a few thousand.</p>
<p>The line <code>board[row][col] = 0</code> is the most important and the most often forgotten. Without it the erased digit stays on the board, later checks see it and lie, and the solution is never found. The failure is not a crash — the program runs honestly and honestly reports "no solution".</p>`}
},

{
 h:{ru:"Одна функция — одно правило",
    en:"One function, one rule"},
 b:{ru:`<p>В решателе пять функций, и это не про красоту. Каждая знает ровно одну вещь и ничего не знает про остальные:</p>
<pre><code>main          <span class="cm">// читает вход и проверяет его</span>
isValidBoard  <span class="cm">// проверяет исходную расстановку</span>
canPlace      <span class="cm">// правила игры — и больше ничего</span>
solve         <span class="cm">// перебор с откатом — и больше ничего</span>
printBoard    <span class="cm">// печать</span></code></pre>
<p>Главное здесь — <strong><code>solve</code> не знает правил судоку вообще</strong>. Ни строк, ни столбцов, ни квадратов: он умеет только «спросить и попробовать». Всё, что делает судоку судоку, лежит в одной функции — <code>canPlace</code>. Поменяются правила — правится одна функция, <code>solve</code> не трогается.</p>
<p>Сама <code>canPlace</code> отвечает на вопрос «можно ли поставить <code>val</code> в клетку <code>[row][col]</code>» и проверяет три вещи. Первые две — одним циклом:</p>
<pre><code>for k := 0; k &lt; 9; k++ {
	if board[row][k] == val {   <span class="cm">// row закреплён, k бежит — идём по СТРОКЕ</span>
		return false
	}
	if board[k][col] == val {   <span class="cm">// col закреплён, k бежит — идём по СТОЛБЦУ</span>
		return false
	}
}</code></pre>
<p>Один и тот же <code>k</code>, но в первом случае он стоит вторым индексом, во втором — первым. Отсюда и разные направления обхода. Перепутать эти две строки местами компилятор не помешает: с обеих сторон <code>int</code>, придраться не к чему.</p>
<p>Третья проверка — квадрат 3×3. Найти его начало помогает целочисленное деление из темы 1:</p>
<pre><code>startRow := row / 3 * 3

<span class="cm">// row:        0 1 2   3 4 5   6 7 8
// row / 3:    0 0 0   1 1 1   2 2 2
// * 3:        0 0 0   3 3 3   6 6 6   ← начало квадрата</span></code></pre>
<p>Деление на 3 отбрасывает остаток и превращает номер строки в номер полосы: 0, 1 или 2. Умножение обратно на 3 даёт первую строку этой полосы. Порядок действий тут не случайный: <code>row / 3 * 3</code> считается слева направо — сначала деление, потом умножение. Если написать <code>row / (3 * 3)</code>, получится деление на девять и совсем другие числа.</p>
<p>Дальше два цикла обходят девять клеток квадрата от найденного начала:</p>
<pre><code>for i := startRow; i &lt; startRow+3; i++ {
	for j := startCol; j &lt; startCol+3; j++ {
		if board[i][j] == val {
			return false
		}
	}
}
return true</code></pre>
<p>Ни одна из трёх проверок не нашла <code>val</code> — значит, ставить можно. <code>return true</code> в самом конце: он срабатывает только тогда, когда все выходы через <code>false</code> остались позади.</p>`,
    en:`<p>The solver has five functions, and that is not about beauty. Each knows exactly one thing and nothing about the others:</p>
<pre><code>main          <span class="cm">// reads the input and validates it</span>
isValidBoard  <span class="cm">// checks the starting layout</span>
canPlace      <span class="cm">// the rules of the game — and nothing else</span>
solve         <span class="cm">// search with backtracking — and nothing else</span>
printBoard    <span class="cm">// printing</span></code></pre>
<p>The key point: <strong><code>solve</code> does not know the rules of sudoku at all</strong>. No rows, no columns, no squares — it can only "ask and try". Everything that makes sudoku sudoku sits in one function, <code>canPlace</code>. Change the rules and you edit one function; <code>solve</code> is untouched.</p>
<p><code>canPlace</code> itself answers "can <code>val</code> go into cell <code>[row][col]</code>" and checks three things. The first two share one loop:</p>
<pre><code>for k := 0; k &lt; 9; k++ {
	if board[row][k] == val {   <span class="cm">// row fixed, k moving — walking the ROW</span>
		return false
	}
	if board[k][col] == val {   <span class="cm">// col fixed, k moving — walking the COLUMN</span>
		return false
	}
}</code></pre>
<p>The same <code>k</code>, but in the first case it is the second index and in the second the first. Hence the two different directions. Swapping those lines is something the compiler will not stop: both sides are <code>int</code>, nothing to object to.</p>
<p>The third check is the 3×3 square. Integer division from topic 1 finds where it starts:</p>
<pre><code>startRow := row / 3 * 3

<span class="cm">// row:        0 1 2   3 4 5   6 7 8
// row / 3:    0 0 0   1 1 1   2 2 2
// * 3:        0 0 0   3 3 3   6 6 6   ← start of the square</span></code></pre>
<p>Dividing by 3 drops the remainder and turns a row number into a band number: 0, 1 or 2. Multiplying back by 3 gives the first row of that band. The order matters: <code>row / 3 * 3</code> is evaluated left to right — division first, multiplication second. Written as <code>row / (3 * 3)</code> it becomes a division by nine and gives completely different numbers.</p>
<p>Two loops then walk the nine cells of the square from that start:</p>
<pre><code>for i := startRow; i &lt; startRow+3; i++ {
	for j := startCol; j &lt; startCol+3; j++ {
		if board[i][j] == val {
			return false
		}
	}
}
return true</code></pre>
<p>None of the three checks found <code>val</code>, so placing it is allowed. <code>return true</code> sits at the very end: it fires only once every <code>false</code> exit is behind you.</p>`}
},

{
 h:{ru:"Чтобы спросить про клетку, значение из неё убирают",
    en:"To ask about a cell, take its value out first"},
 b:{ru:`<p>В <code>isValidBoard</code> есть три строки, которые выглядят бессмысленно, пока не задашь себе один вопрос:</p>
<pre><code>board[row][col] = 0
valid := canPlace(board, row, col, val)
board[row][col] = val</code></pre>
<p>Клетку обнулили, спросили, вернули значение обратно. Зачем стирать то, что сейчас же вернём?</p>
<p>Затем, что <code>canPlace</code> отвечает на вопрос «<strong>свободно</strong> ли здесь для <code>val</code>». Она обходит строку, столбец и квадрат и ищет <code>val</code>. И если <code>val</code> уже стоит в самой этой клетке, то она найдёт его — сама себя — и честно ответит «нельзя». Ответ будет «нельзя» для любой заполненной клетки любой доски, даже идеально правильной.</p>
<pre><code>board[0][0] = 5

canPlace(board, 0, 0, 5)   <span class="cm">// false — нашла пятёрку в клетке [0][0]</span>

board[0][0] = 0
canPlace(board, 0, 0, 5)   <span class="cm">// вот теперь настоящий ответ</span></code></pre>
<p>Приём называется «временно убрать и вернуть», и он общий: <strong>изменить состояние, задать вопрос, вернуть состояние как было</strong>. Между обнулением и возвратом не должно быть ничего лишнего — ни печати, ни другого <code>return</code>, иначе доска останется испорченной.</p>
<p>Ту же форму ты уже видел в предыдущем правиле — в <code>solve</code>: <code>board[row][col] = val</code>, попробовали, не вышло, <code>board[row][col] = 0</code>. Разные функции, разная цель, одна и та же пара строк, обнимающая вопрос с двух сторон.</p>
<p>Кстати, почему проверять исходную расстановку вообще нужно. <code>solve</code> заполняет только пустые клетки и никогда не перепроверяет те, что уже стоят. Дай ему полностью заполненную доску с двумя одинаковыми цифрами в строке — он не найдёт ни одной пустой клетки, сразу вернёт <code>true</code>, и неверная доска уедет на печать как решение. <code>isValidBoard</code> существует ровно для этого случая.</p>`,
    en:`<p><code>isValidBoard</code> has three lines that look pointless until you ask yourself one question:</p>
<pre><code>board[row][col] = 0
valid := canPlace(board, row, col, val)
board[row][col] = val</code></pre>
<p>The cell is zeroed, the question asked, the value put back. Why erase something you restore immediately?</p>
<p>Because <code>canPlace</code> answers "is this <strong>free</strong> for <code>val</code>". It walks the row, the column and the square looking for <code>val</code>. And if <code>val</code> is already sitting in that very cell, it finds it — itself — and honestly says "no". The answer would be "no" for every filled cell of every board, even a perfectly correct one.</p>
<pre><code>board[0][0] = 5

canPlace(board, 0, 0, 5)   <span class="cm">// false — it found the 5 in cell [0][0]</span>

board[0][0] = 0
canPlace(board, 0, 0, 5)   <span class="cm">// now that is the real answer</span></code></pre>
<p>The move is called "remove temporarily and restore", and it is general: <strong>change the state, ask the question, put the state back</strong>. Nothing extra may sit between the zeroing and the restore — no printing, no other <code>return</code> — or the board stays damaged.</p>
<p>You have already seen the same shape in the previous rule, in <code>solve</code>: <code>board[row][col] = val</code>, try, fail, <code>board[row][col] = 0</code>. Different functions, different purpose, the same pair of lines hugging a question from both sides.</p>
<p>And why the starting layout must be checked at all. <code>solve</code> fills only empty cells and never re-checks the ones already there. Hand it a completely filled board with two identical digits in a row: it finds no empty cell, returns <code>true</code> at once, and the wrong board goes to print as a solution. <code>isValidBoard</code> exists for exactly that case.</p>`}
},

{
 h:{ru:"Доска ходит по функциям указателем",
    en:"The board travels between functions by pointer"},
 b:{ru:`<p>Все четыре функции решателя принимают <code>*[9][9]int</code>, а не <code>[9][9]int</code>. Звёздочка здесь не украшение — без неё программа собирается и не работает.</p>
<p>Причина в правиле из темы 8: <strong>массив передаётся в функцию копией целиком</strong>. Не ссылкой, не куском — все 81 число копируются в новую память. Функция меняет копию, копия исчезает при выходе, снаружи ничего не изменилось.</p>
<pre><code>func fillCopy(board [2][2]int) {    <span class="cm">// принимает копию</span>
	board[0][0] = 9
}

func fillReal(board *[2][2]int) {   <span class="cm">// принимает адрес</span>
	board[0][0] = 9
}

b := [2][2]int{{1, 2}, {3, 4}}

fillCopy(b)
fmt.Println(b)    <span class="cm">// [[1 2] [3 4]] — не изменилось</span>

fillReal(&amp;b)
fmt.Println(b)    <span class="cm">// [[9 2] [3 4]] — изменилось</span></code></pre>
<p>Для <code>solve</code> это вопрос жизни: он должен ставить цифры в ту самую доску, которую потом напечатает <code>main</code>. Работая с копией, он бы прекрасно решил судоку — и выбросил результат при выходе. Программа напечатала бы исходную доску с точками, не сообщив ни о какой ошибке.</p>
<p>Что меняется в записи: в типе появляется <code>*</code>, при вызове — <code>&amp;</code>. И всё. Обращение к клетке пишется как обычно, <code>board[row][col]</code>: Go сам понимает, что за указателем лежит массив, и разыменовывает его молча.</p>
<pre><code>solve(&amp;board)             <span class="cm">// вызов: передаём адрес</span>
func solve(board *[9][9]int) bool   <span class="cm">// объявление: тип со звёздочкой</span>
board[row][col] = val               <span class="cm">// внутри: как обычно</span></code></pre>
<p>Есть и вторая причина, помимо правильности. <code>solve</code> вызывает сам себя десятки тысяч раз; на каждый вызов копировался бы весь массив. Указатель — это одно число, сколько бы ни было клеток на доске.</p>`,
    en:`<p>All four solver functions take <code>*[9][9]int</code>, not <code>[9][9]int</code>. The star is not decoration — without it the program compiles and does not work.</p>
<p>The reason is the rule from topic 8: <strong>an array is passed into a function as a full copy</strong>. Not a reference, not a slice of it — all 81 numbers are copied into new memory. The function changes the copy, the copy dies at the exit, and outside nothing changed.</p>
<pre><code>func fillCopy(board [2][2]int) {    <span class="cm">// takes a copy</span>
	board[0][0] = 9
}

func fillReal(board *[2][2]int) {   <span class="cm">// takes an address</span>
	board[0][0] = 9
}

b := [2][2]int{{1, 2}, {3, 4}}

fillCopy(b)
fmt.Println(b)    <span class="cm">// [[1 2] [3 4]] — unchanged</span>

fillReal(&amp;b)
fmt.Println(b)    <span class="cm">// [[9 2] [3 4]] — changed</span></code></pre>
<p>For <code>solve</code> this is a matter of life: it must write digits into the very board <code>main</code> will print later. Working on a copy it would solve the sudoku beautifully — and throw the result away on exit. The program would print the original board full of dots without reporting any error at all.</p>
<p>What changes in the writing: a <code>*</code> in the type, an <code>&amp;</code> at the call. That is all. Reaching a cell is written as usual, <code>board[row][col]</code>: Go knows an array sits behind the pointer and dereferences it silently.</p>
<pre><code>solve(&amp;board)             <span class="cm">// call: pass the address</span>
func solve(board *[9][9]int) bool   <span class="cm">// declaration: type with a star</span>
board[row][col] = val               <span class="cm">// inside: as usual</span></code></pre>
<p>There is a second reason besides correctness. <code>solve</code> calls itself tens of thousands of times; each call would copy the whole array. A pointer is one number, however many cells the board has.</p>`}
},

{
 h:{ru:"Вход проверяется отдельно от решения",
    en:"Input is validated separately from solving"},
 b:{ru:`<p><code>main</code> в решателе не решает ничего. Он делает три проверки по порядку и только потом зовёт того, кто решает.</p>
<pre><code>input := os.Args[1:]
if len(input) != 9 {           <span class="cm">// 1. девять строк?</span>
	fmt.Println("Error")
	return
}

line := input[row]
if len(line) != 9 {            <span class="cm">// 2. в строке девять символов?</span>
	fmt.Println("Error")
	return
}

sym := line[col]               <span class="cm">// 3. каждый символ — цифра или точка?</span>
if sym == '.' {
	board[row][col] = 0
} else if sym >= '1' &amp;&amp; sym &lt;= '9' {
	board[row][col] = int(sym - '0')
} else {
	fmt.Println("Error")
	return
}</code></pre>
<p>Проверки идут строго от крупного к мелкому, и порядок не переставить: пока не известно, что строк девять, брать <code>input[3]</code> нельзя — программа упадёт на выходе за границы.</p>
<p>Третья проверка делает сразу два дела: убеждается, что символ допустим, и тут же превращает его в число через <code>int(sym - '0')</code> — переход из темы 1. Это не смешивание обязанностей, а одна работа: «разобрать вход». <code>'.'</code> становится нулём — так пустая клетка выглядит внутри программы.</p>
<p>А вот дальше начинается другая работа, и её мешать с первой нельзя:</p>
<pre><code>if !isValidBoard(&amp;board) {   <span class="cm">// расстановка не нарушает правил?</span>
	fmt.Println("Error")
	return
}
if !solve(&amp;board) {          <span class="cm">// решение вообще существует?</span>
	fmt.Println("Error")
	return
}
printBoard(&amp;board)</code></pre>
<p>Смысл разделения простой. <strong><code>solve</code> написан в предположении, что доска уже корректна</strong> — 9×9, цифры от 0 до 9, повторов нет. Пока это гарантировано снаружи, внутри <code>solve</code> нет ни одной строчки про «а вдруг там буква». Если бы проверки размазали по всей программе, каждая функция либо проверяла бы всё заново, либо не проверяла ничего — и никто бы не знал, кто за что отвечает.</p>
<p>Заодно посмотри, как выглядит цепочка целиком: разобрать вход → проверить расстановку → решить → напечатать. Четыре шага, каждый может сказать «Error» и остановиться, и до печати доходит только то, что прошло все четыре.</p>`,
    en:`<p><code>main</code> in the solver solves nothing. It runs three checks in order and only then calls the part that solves.</p>
<pre><code>input := os.Args[1:]
if len(input) != 9 {           <span class="cm">// 1. nine lines?</span>
	fmt.Println("Error")
	return
}

line := input[row]
if len(line) != 9 {            <span class="cm">// 2. nine characters in the line?</span>
	fmt.Println("Error")
	return
}

sym := line[col]               <span class="cm">// 3. every character a digit or a dot?</span>
if sym == '.' {
	board[row][col] = 0
} else if sym >= '1' &amp;&amp; sym &lt;= '9' {
	board[row][col] = int(sym - '0')
} else {
	fmt.Println("Error")
	return
}</code></pre>
<p>The checks run strictly from coarse to fine, and the order cannot be shuffled: until you know there are nine lines, reaching for <code>input[3]</code> is not allowed — the program would crash on an out-of-range index.</p>
<p>The third check does two things at once: it makes sure the character is allowed and converts it to a number right there with <code>int(sym - '0')</code> — the conversion from topic 1. That is not mixing responsibilities, it is one job: "parse the input". A <code>'.'</code> becomes zero — that is what an empty cell looks like inside the program.</p>
<p>What comes next is a different job, and it must not be blended with the first:</p>
<pre><code>if !isValidBoard(&amp;board) {   <span class="cm">// does the layout break the rules?</span>
	fmt.Println("Error")
	return
}
if !solve(&amp;board) {          <span class="cm">// does a solution exist at all?</span>
	fmt.Println("Error")
	return
}
printBoard(&amp;board)</code></pre>
<p>The point of the split is simple. <strong><code>solve</code> is written assuming the board is already correct</strong> — 9×9, digits 0 to 9, no duplicates. As long as that is guaranteed outside, there is not one line inside <code>solve</code> about "what if there is a letter here". Had the checks been smeared across the program, every function would either re-check everything or check nothing — and nobody would know who is responsible for what.</p>
<p>Look at the whole chain while you are here: parse the input → check the layout → solve → print. Four steps, each able to say "Error" and stop, and only what passed all four reaches the printing.</p>`}
},

{
 h:{ru:"Полный код: sudoku целиком",
    en:"The full code: sudoku from top to bottom"},
 b:{ru:`<p>Сто двадцать строк и пять функций. Держится всё на том, что у каждой ровно одна работа:</p>
<div class="tablewrap"><table>
<tr><th>функция</th><th>её единственная работа</th></tr>
<tr><td><code>main</code></td><td>прочитать аргументы, превратить в доску, вызвать остальных по очереди</td></tr>
<tr><td><code>isValidBoard</code></td><td>не нарушает ли правил <strong>исходная</strong> расстановка</td></tr>
<tr><td><code>canPlace</code></td><td>можно ли поставить цифру в клетку. <strong>Единственное место, где записаны правила судоку</strong></td></tr>
<tr><td><code>solve</code></td><td>перебор с откатом</td></tr>
<tr><td><code>printBoard</code></td><td>печать готовой доски</td></tr>
</table></div>
<pre><code>package main

import (
	&quot;fmt&quot;
	&quot;os&quot;
)

func main() {
	input := os.Args[1:]
	if len(input) != 9 {
		fmt.Println(&quot;Error&quot;)
		return
	}

	var board [9][9]int
	for row := 0; row &lt; 9; row++ {
		line := input[row]
		if len(line) != 9 {
			fmt.Println(&quot;Error&quot;)
			return
		}
		for col := 0; col &lt; 9; col++ {
			sym := line[col]
			if sym == &#x27;.&#x27; {
				board[row][col] = 0
			} else if sym &gt;= &#x27;1&#x27; &amp;&amp; sym &lt;= &#x27;9&#x27; {
				board[row][col] = int(sym - &#x27;0&#x27;)
			} else {
				fmt.Println(&quot;Error&quot;)
				return
			}
		}
	}

	if !isValidBoard(&amp;board) {
		fmt.Println(&quot;Error&quot;)
		return
	}

	if !solve(&amp;board) {
		fmt.Println(&quot;Error&quot;)
		return
	}

	printBoard(&amp;board)
}

func isValidBoard(board *[9][9]int) bool {
	for row := 0; row &lt; 9; row++ {
		for col := 0; col &lt; 9; col++ {
			val := board[row][col]
			if val == 0 {
				continue
			}

			board[row][col] = 0
			valid := canPlace(board, row, col, val)
			board[row][col] = val
			if !valid {
				return false
			}
		}
	}
	return true
}

func canPlace(board *[9][9]int, row int, col int, val int) bool {
	for k := 0; k &lt; 9; k++ {
		if board[row][k] == val {
			return false
		}
		if board[k][col] == val {
			return false
		}
	}

	startRow := row / 3 * 3
	startCol := col / 3 * 3
	for i := startRow; i &lt; startRow+3; i++ {
		for j := startCol; j &lt; startCol+3; j++ {
			if board[i][j] == val {
				return false
			}
		}
	}
	return true
}

func solve(board *[9][9]int) bool {
	for row := 0; row &lt; 9; row++ {
		for col := 0; col &lt; 9; col++ {
			if board[row][col] != 0 {
				continue
			}
			for val := 1; val &lt;= 9; val++ {
				if canPlace(board, row, col, val) {
					board[row][col] = val
					if solve(board) {
						return true
					}
					board[row][col] = 0
				}
			}
			return false
		}
	}
	return true
}

func printBoard(board *[9][9]int) {
	for row := 0; row &lt; 9; row++ {
		for col := 0; col &lt; 9; col++ {
			if col &gt; 0 {
				fmt.Print(&quot; &quot;)
			}
			fmt.Print(board[row][col])
		}
		fmt.Println()
	}
}</code></pre>
<p>Главное в <code>main</code> — цепочка из четырёх шагов, и каждый может сказать <code>Error</code> и остановить программу: разобрать вход, проверить расстановку, решить, напечатать. До печати доходит только то, что прошло все четыре.</p>
<p>Главное в <code>solve</code> — три строки отката: поставили цифру, пошли вглубь, не вышло — стёрли и пробуем следующую. Без последней строки доска остаётся замусоренной неверными цифрами, и следующая попытка идёт по испорченному полю.</p>`,
    en:`<p>A hundred and twenty lines and five functions. What holds it together is that each has exactly one job:</p>
<div class="tablewrap"><table>
<tr><th>function</th><th>its single job</th></tr>
<tr><td><code>main</code></td><td>read the arguments, turn them into a board, call the others in order</td></tr>
<tr><td><code>isValidBoard</code></td><td>does the <strong>initial</strong> layout break the rules</td></tr>
<tr><td><code>canPlace</code></td><td>may this digit go in this cell. <strong>The only place where the rules of sudoku are written down</strong></td></tr>
<tr><td><code>solve</code></td><td>search with backtracking</td></tr>
<tr><td><code>printBoard</code></td><td>print the finished board</td></tr>
</table></div>
<pre><code>package main

import (
	&quot;fmt&quot;
	&quot;os&quot;
)

func main() {
	input := os.Args[1:]
	if len(input) != 9 {
		fmt.Println(&quot;Error&quot;)
		return
	}

	var board [9][9]int
	for row := 0; row &lt; 9; row++ {
		line := input[row]
		if len(line) != 9 {
			fmt.Println(&quot;Error&quot;)
			return
		}
		for col := 0; col &lt; 9; col++ {
			sym := line[col]
			if sym == &#x27;.&#x27; {
				board[row][col] = 0
			} else if sym &gt;= &#x27;1&#x27; &amp;&amp; sym &lt;= &#x27;9&#x27; {
				board[row][col] = int(sym - &#x27;0&#x27;)
			} else {
				fmt.Println(&quot;Error&quot;)
				return
			}
		}
	}

	if !isValidBoard(&amp;board) {
		fmt.Println(&quot;Error&quot;)
		return
	}

	if !solve(&amp;board) {
		fmt.Println(&quot;Error&quot;)
		return
	}

	printBoard(&amp;board)
}

func isValidBoard(board *[9][9]int) bool {
	for row := 0; row &lt; 9; row++ {
		for col := 0; col &lt; 9; col++ {
			val := board[row][col]
			if val == 0 {
				continue
			}

			board[row][col] = 0
			valid := canPlace(board, row, col, val)
			board[row][col] = val
			if !valid {
				return false
			}
		}
	}
	return true
}

func canPlace(board *[9][9]int, row int, col int, val int) bool {
	for k := 0; k &lt; 9; k++ {
		if board[row][k] == val {
			return false
		}
		if board[k][col] == val {
			return false
		}
	}

	startRow := row / 3 * 3
	startCol := col / 3 * 3
	for i := startRow; i &lt; startRow+3; i++ {
		for j := startCol; j &lt; startCol+3; j++ {
			if board[i][j] == val {
				return false
			}
		}
	}
	return true
}

func solve(board *[9][9]int) bool {
	for row := 0; row &lt; 9; row++ {
		for col := 0; col &lt; 9; col++ {
			if board[row][col] != 0 {
				continue
			}
			for val := 1; val &lt;= 9; val++ {
				if canPlace(board, row, col, val) {
					board[row][col] = val
					if solve(board) {
						return true
					}
					board[row][col] = 0
				}
			}
			return false
		}
	}
	return true
}

func printBoard(board *[9][9]int) {
	for row := 0; row &lt; 9; row++ {
		for col := 0; col &lt; 9; col++ {
			if col &gt; 0 {
				fmt.Print(&quot; &quot;)
			}
			fmt.Print(board[row][col])
		}
		fmt.Println()
	}
}</code></pre>
<p>The core of <code>main</code> is a chain of four steps, any of which can say <code>Error</code> and stop the program: parse the input, check the layout, solve, print. Only what passed all four ever reaches the printing.</p>
<p>The core of <code>solve</code> is three lines of backtracking: place a digit, go deeper, and if it did not work out, erase it and try the next. Without that last line the board stays littered with wrong digits and the next attempt runs over a spoiled field.</p>`}
}
];

var TABLE = {
  title:{ru:"Пять функций — пять работ", en:"Five functions, five jobs"},
  intro:{ru:"Программа длинная, но ни одна функция не делает двух дел сразу. Если забыл, где что искать — смотри сюда.",
         en:"The program is long, but no function does two jobs at once. If you forget where to look for something, look here."},
  head:{ru:["Функция","Что делает","Что возвращает"], en:["Function","What it does","What it returns"]},
  rows:[
    ["main",{ru:"читает аргументы, собирает доску, зовёт остальных",en:"reads arguments, builds the board, calls the others"},{ru:"ничего",en:"nothing"}],
    ["isValidBoard",{ru:"исходная расстановка не нарушает правил?",en:"does the initial layout break the rules?"},"bool"],
    ["canPlace",{ru:"можно ли поставить цифру в клетку",en:"may this digit go in this cell"},"bool"],
    ["solve",{ru:"перебор с откатом",en:"search with backtracking"},"bool"],
    ["printBoard",{ru:"печатает готовую доску",en:"prints the finished board"},{ru:"ничего",en:"nothing"}]
  ]
};

/* ================= ГРАБЛИ ================= */
var TRAPS = [
 {ru:"<strong>Забытый откат <code>board[row][col] = 0</code>.</strong> Неподошедшая цифра остаётся на доске, все следующие проверки видят её и врут. Программа не падает — она спокойно доходит до конца и печатает «решения нет» для доски, у которой решение есть.",
  en:"<strong>The forgotten undo, <code>board[row][col] = 0</code>.</strong> The rejected digit stays on the board, every later check sees it and lies. The program does not crash — it calmly runs to the end and prints \"no solution\" for a board that has one."},

 {ru:"<strong>Доска без указателя.</strong> <code>func solve(board [9][9]int)</code> собирается без единой жалобы, работает и выбрасывает результат: массив пришёл копией, копия исчезла на выходе. Снаружи доска осталась с точками. Тип должен быть <code>*[9][9]int</code>, вызов — <code>solve(&amp;board)</code>.",
  en:"<strong>The board without a pointer.</strong> <code>func solve(board [9][9]int)</code> compiles without a murmur, works, and throws the result away: the array arrived as a copy and the copy died at the exit. Outside, the board still has its dots. The type must be <code>*[9][9]int</code> and the call <code>solve(&amp;board)</code>."},

 {ru:"<strong><code>canPlace</code> находит саму себя.</strong> Спросить «можно ли поставить 5» про клетку, где 5 уже стоит, — значит всегда получить «нельзя»: функция ищет пятёрку в строке и находит именно эту. Перед вопросом клетку обнуляют, после вопроса возвращают значение назад.",
  en:"<strong><code>canPlace</code> finds itself.</strong> Asking \"can a 5 go here\" about a cell that already holds a 5 always gives \"no\": the function looks for a five in the row and finds that very one. Zero the cell before the question and restore the value after it."},

 {ru:"<strong><code>row / 3 * 3</code> — не то же самое, что <code>row / (3 * 3)</code>.</strong> Деление и умножение считаются слева направо, поэтому первое даёт начало квадрата (0, 3 или 6), а второе — деление на девять и числа 0 или 1. Скобки здесь меняют смысл выражения целиком.",
  en:"<strong><code>row / 3 * 3</code> is not <code>row / (3 * 3)</code>.</strong> Division and multiplication evaluate left to right, so the first gives the start of the square (0, 3 or 6) and the second a division by nine, yielding 0 or 1. Brackets here change the meaning entirely."}
];

/* ================= ПРИМЕРЫ ================= */
var EXAMPLES = [
{
 chg:{ru:"фигуры кончились, началась доска", en:"shapes are done, the board begins"},
 code:`package main

import "fmt"

func printBoard(board *[4][4]int) {
	for row := 0; row < 4; row++ {
		for col := 0; col < 4; col++ {
			if col > 0 {
				fmt.Print(" ")
			}
			fmt.Print(board[row][col])
		}
		fmt.Println()
	}
}

func main() {
	board := [4][4]int{
		{0, 0, 4, 0},
		{0, 3, 0, 0},
		{0, 0, 0, 2},
		{1, 0, 0, 0},
	}
	printBoard(&board)
}`,
 out:"0 0 4 0\n0 3 0 0\n0 0 0 2\n1 0 0 0",
 why:{ru:"Те же два цикла, только теперь печатают не символы, а числа из массива, и нумерация идёт с нуля. Пробел ставится <b>перед</b> числом и только если <code>col &gt; 0</code> — так в конце строки не остаётся лишнего пробела. Ноль на экране означает пустую клетку.",
      en:"The same two loops, except now they print numbers from an array instead of characters, and the numbering starts at zero. The space goes <b>before</b> the number and only when <code>col &gt; 0</code>, so no stray space is left at the end of a line. A zero on screen means an empty cell."}
},

{
 chg:{ru:"доска попала в функцию — двумя способами", en:"the board goes into a function — two ways"},
 code:`package main

import "fmt"

func fillCopy(board [2][2]int) {
	board[0][0] = 9
}

func fillReal(board *[2][2]int) {
	board[0][0] = 9
}

func main() {
	b := [2][2]int{{1, 2}, {3, 4}}

	fillCopy(b)
	fmt.Println(b)

	fillReal(&b)
	fmt.Println(b)
}`,
 out:"[[1 2] [3 4]]\n[[9 2] [3 4]]",
 why:{ru:"Две функции отличаются одной звёздочкой, а результат — противоположный. <code>fillCopy</code> получила копию массива и изменила её; копия исчезла на выходе. <code>fillReal</code> получила адрес и изменила ту самую доску.<br><b>Сломай:</b> убери <code>*</code> у <code>fillReal</code> и <code>&amp;</code> при вызове — обе строки станут одинаковыми.",
      en:"The two functions differ by one star and give opposite results. <code>fillCopy</code> got a copy of the array and changed it; the copy died at the exit. <code>fillReal</code> got an address and changed the board itself.<br><b>Break it:</b> drop the <code>*</code> on <code>fillReal</code> and the <code>&amp;</code> at the call — both lines will read the same."}
},

{
 chg:{ru:"первое правило игры: цифра не повторяется в строке и столбце", en:"the first rule of the game: no repeat in the row or the column"},
 code:`package main

import "fmt"

func canPlace(board *[4][4]int, row, col, val int) bool {
	for k := 0; k < 4; k++ {
		if board[row][k] == val {
			return false
		}
		if board[k][col] == val {
			return false
		}
	}
	return true
}

func main() {
	board := [4][4]int{
		{0, 0, 4, 0},
		{0, 3, 0, 0},
		{0, 0, 0, 2},
		{1, 0, 0, 0},
	}
	fmt.Println(canPlace(&board, 0, 0, 1))
	fmt.Println(canPlace(&board, 0, 0, 2))
	fmt.Println(canPlace(&board, 0, 0, 3))
	fmt.Println(canPlace(&board, 0, 0, 4))
}`,
 out:"false\ntrue\ntrue\nfalse",
 why:{ru:"Спрашиваем про клетку [0][0] четыре раза подряд. Единицу запрещает столбец (внизу стоит 1), четвёрку — строка (справа стоит 4), двойка и тройка проходят. Один цикл по <code>k</code> обходит и строку, и столбец: в первой проверке <code>k</code> — второй индекс, во второй — первый.",
      en:"We ask about cell [0][0] four times in a row. The 1 is blocked by the column (there is a 1 at the bottom), the 4 by the row (there is a 4 to the right); 2 and 3 pass. One loop over <code>k</code> walks both the row and the column: in the first check <code>k</code> is the second index, in the second check the first."}
},

{
 chg:{ru:"добавился квадрат 2×2 — одна вставка", en:"the 2×2 square is added — a single insert"},
 code:`package main

import "fmt"

func canPlace(board *[4][4]int, row, col, val int) bool {
	for k := 0; k < 4; k++ {
		if board[row][k] == val {
			return false
		}
		if board[k][col] == val {
			return false
		}
	}

	startRow := row / 2 * 2
	startCol := col / 2 * 2
	for i := startRow; i < startRow+2; i++ {
		for j := startCol; j < startCol+2; j++ {
			if board[i][j] == val {
				return false
			}
		}
	}
	return true
}

func main() {
	board := [4][4]int{
		{0, 0, 4, 0},
		{0, 3, 0, 0},
		{0, 0, 0, 2},
		{1, 0, 0, 0},
	}
	fmt.Println(canPlace(&board, 0, 0, 1))
	fmt.Println(canPlace(&board, 0, 0, 2))
	fmt.Println(canPlace(&board, 0, 0, 3))
	fmt.Println(canPlace(&board, 0, 0, 4))
}`,
 out:"false\ntrue\nfalse\nfalse",
 why:{ru:"Изменился ровно один ответ: тройка была разрешена, стала запрещена. Строка и столбец её пропускали, а квадрат — нет: тройка стоит в клетке [1][1], то есть в том же квадрате 2×2. <code>row / 2 * 2</code> находит начало квадрата — на доске 4×4 делят на 2, на доске 9×9 делили бы на 3.",
      en:"Exactly one answer changed: the 3 was allowed and is now refused. The row and the column let it through, the square did not — the 3 sits in cell [1][1], the same 2×2 square. <code>row / 2 * 2</code> finds the start of the square — on a 4×4 board you divide by 2, on a 9×9 board you would divide by 3."}
},

{
 chg:{ru:"всё вместе: разбор, проверка, откат, печать", en:"all together: parsing, checking, backtracking, printing"},
 code:`package main

import "fmt"

func main() {
	run([]string{"..4.", ".3..", "...2", "1..."})
	run([]string{"1234", "3412", "2143", "4323"})
}

func run(input []string) {
	var board [4][4]int
	for row := 0; row < 4; row++ {
		line := input[row]
		if len(line) != 4 {
			fmt.Println("Error")
			return
		}
		for col := 0; col < 4; col++ {
			sym := line[col]
			if sym == '.' {
				board[row][col] = 0
			} else if sym >= '1' && sym <= '4' {
				board[row][col] = int(sym - '0')
			} else {
				fmt.Println("Error")
				return
			}
		}
	}

	if !isValid(&board) {
		fmt.Println("Error")
		return
	}
	if !solve(&board) {
		fmt.Println("Error")
		return
	}
	printBoard(&board)
}

func isValid(board *[4][4]int) bool {
	for row := 0; row < 4; row++ {
		for col := 0; col < 4; col++ {
			val := board[row][col]
			if val == 0 {
				continue
			}
			board[row][col] = 0
			ok := canPlace(board, row, col, val)
			board[row][col] = val
			if !ok {
				return false
			}
		}
	}
	return true
}

func canPlace(board *[4][4]int, row, col, val int) bool {
	for k := 0; k < 4; k++ {
		if board[row][k] == val {
			return false
		}
		if board[k][col] == val {
			return false
		}
	}
	startRow := row / 2 * 2
	startCol := col / 2 * 2
	for i := startRow; i < startRow+2; i++ {
		for j := startCol; j < startCol+2; j++ {
			if board[i][j] == val {
				return false
			}
		}
	}
	return true
}

func solve(board *[4][4]int) bool {
	for row := 0; row < 4; row++ {
		for col := 0; col < 4; col++ {
			if board[row][col] != 0 {
				continue
			}
			for val := 1; val <= 4; val++ {
				if canPlace(board, row, col, val) {
					board[row][col] = val
					if solve(board) {
						return true
					}
					board[row][col] = 0
				}
			}
			return false
		}
	}
	return true
}

func printBoard(board *[4][4]int) {
	for row := 0; row < 4; row++ {
		for col := 0; col < 4; col++ {
			if col > 0 {
				fmt.Print(" ")
			}
			fmt.Print(board[row][col])
		}
		fmt.Println()
	}
}`,
 out:"2 1 4 3\n4 3 2 1\n3 4 1 2\n1 2 3 4\nError",
 why:{ru:"Программа целиком, только на доске 4×4 вместо 9×9. Первый вход решается и печатается. Второй заполнен полностью, но в последней строке две тройки — его останавливает <code>isValid</code>.<br><b>Сломай обязательно:</b> замени <code>if !isValid(&amp;board)</code> на <code>if false</code> и запусти снова. Вторая доска напечатается как есть, с двумя тройками: <code>solve</code> не нашёл ни одной пустой клетки и сразу сказал «решено».",
      en:"The whole program, just on a 4×4 board instead of 9×9. The first input is solved and printed. The second is completely filled but has two 3s in the last row — <code>isValid</code> stops it.<br><b>Break it, definitely:</b> replace <code>if !isValid(&amp;board)</code> with <code>if false</code> and run it again. The second board prints as is, two 3s and all: <code>solve</code> found no empty cell and declared it solved on the spot."}
},

{
 chg:{ru:"символ превратили в цифру", en:"a character turned into a digit"},
 code:`package main

import "fmt"

func main() {
	line := "1.4"
	for i := 0; i < len(line); i++ {
		sym := line[i]
		if sym == '.' {
			fmt.Println(0)
		} else {
			fmt.Println(int(sym - '0'))
		}
	}
}`,
 out:"1\n0\n4",
 why:{ru:"<code>line[i]</code> даёт <b>байт</b>, то есть число — код символа. У знака «1» он 49, у «0» — 48. Вычитание <code>sym - '0'</code> убирает сдвиг и оставляет саму цифру. Точка означает пустую клетку, для неё кладём ноль.",
      en:"<code>line[i]</code> gives a <b>byte</b>, that is a number — a character code. For \"1\" it is 49, for \"0\" it is 48. Subtracting <code>sym - '0'</code> removes the offset and leaves the digit itself. A dot means an empty cell, so we store a zero."}
},

{
 chg:{ru:"нашли первую пустую клетку", en:"we found the first empty cell"},
 code:`package main

import "fmt"

func main() {
	board := [4][4]int{
		{2, 1, 4, 3},
		{4, 3, 0, 1},
		{3, 4, 1, 2},
		{1, 2, 3, 4},
	}
	for row := 0; row < 4; row++ {
		for col := 0; col < 4; col++ {
			if board[row][col] == 0 {
				fmt.Println(row, col)
				return
			}
		}
	}
	fmt.Println("full")
}`,
 out:"1 2",
 why:{ru:"Обход тот же, что у рамки: строки снаружи, столбцы внутри. Но выходим сразу, как только нашли — <code>return</code> внутри цикла. Именно так решатель находит, куда ставить следующую цифру.",
      en:"The same walk as the frame: rows outside, columns inside. But we leave the moment we find one — <code>return</code> inside the loop. This is exactly how the solver finds where to put the next digit."}
},

{
 chg:{ru:"деление и умножение подряд дают начало квадрата", en:"a division and a multiplication in a row give the square's start"},
 code:`package main

import "fmt"

func main() {
	for i := 0; i < 4; i++ {
		fmt.Println(i, i/2*2)
	}
}`,
 out:"0 0\n1 0\n2 2\n3 2",
 why:{ru:"Целочисленное деление отбрасывает остаток, а умножение возвращает обратно — но уже без него. Получается «округление вниз до кратного двум»: строки 0 и 1 дают 0, строки 2 и 3 дают 2. Это и есть номер строки, с которой начинается квадрат.<br><b>Сломай:</b> напиши <code>i/(2*2)</code> и сравни — скобки меняют смысл целиком.",
      en:"Integer division drops the remainder and the multiplication brings the scale back — but without it. The result is \"round down to a multiple of two\": rows 0 and 1 give 0, rows 2 and 3 give 2. That is the row a square starts at.<br><b>Break it:</b> write <code>i/(2*2)</code> and compare — the brackets change the meaning entirely."}
},

{
 chg:{ru:"поставили цифру и тут же стёрли", en:"we placed a digit and erased it right away"},
 code:`package main

import "fmt"

func canPlace(board *[4][4]int, row, col, val int) bool {
	for k := 0; k < 4; k++ {
		if board[row][k] == val {
			return false
		}
		if board[k][col] == val {
			return false
		}
	}

	startRow := row / 2 * 2
	startCol := col / 2 * 2
	for i := startRow; i < startRow+2; i++ {
		for j := startCol; j < startCol+2; j++ {
			if board[i][j] == val {
				return false
			}
		}
	}
	return true
}

func main() {
	board := [4][4]int{
		{2, 1, 4, 3},
		{4, 3, 0, 1},
		{3, 4, 1, 2},
		{1, 2, 3, 4},
	}
	for val := 1; val <= 4; val++ {
		if canPlace(&board, 1, 2, val) {
			board[1][2] = val
			fmt.Println(val, board[1][2])
			board[1][2] = 0
			fmt.Println(val, board[1][2])
		}
	}
}`,
 out:"2 2\n2 0",
 why:{ru:"Из четырёх цифр подошла одна — двойка. Мы её поставили, показали доску и <b>вернули клетку в ноль</b>. Вот эта последняя строка и есть откат: без неё неподошедшая цифра осталась бы лежать на доске и испортила все дальнейшие проверки.",
      en:"Out of four digits only one fitted — the two. We placed it, showed the board and <b>reset the cell to zero</b>. That last line is the backtrack: without it a digit that did not work out would stay on the board and spoil every later check."}
},

{
 chg:{ru:"клетку убирают, чтобы спросить про неё саму", en:"a cell is removed so that it can be asked about itself"},
 code:`package main

import "fmt"

func canPlace(board *[4][4]int, row, col, val int) bool {
	for k := 0; k < 4; k++ {
		if board[row][k] == val {
			return false
		}
		if board[k][col] == val {
			return false
		}
	}

	startRow := row / 2 * 2
	startCol := col / 2 * 2
	for i := startRow; i < startRow+2; i++ {
		for j := startCol; j < startCol+2; j++ {
			if board[i][j] == val {
				return false
			}
		}
	}
	return true
}

func main() {
	board := [4][4]int{
		{2, 1, 4, 3},
		{4, 3, 2, 1},
		{3, 4, 1, 2},
		{1, 2, 3, 4},
	}
	val := board[0][0]
	fmt.Println(canPlace(&board, 0, 0, val))
	board[0][0] = 0
	fmt.Println(canPlace(&board, 0, 0, val))
	board[0][0] = val
	fmt.Println(board[0][0])
}`,
 out:"false\ntrue\n2",
 why:{ru:"Первый ответ <b>false</b>, хотя доска верная. Причина: <code>canPlace</code> ищет двойку по всей строке и находит её же саму — клетка ведь занята. Поэтому перед вопросом клетку временно обнуляют, а после ответа возвращают значение назад. Ровно так работает <code>isValidBoard</code>.",
      en:"The first answer is <b>false</b>, although the board is correct. The reason: <code>canPlace</code> looks for a two along the whole row and finds this very cell — it is occupied, after all. So before asking, the cell is temporarily zeroed and the value is put back afterwards. That is exactly how <code>isValidBoard</code> works."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"BlockIndex", lvl:2, e:"0 0 1 1\n0 0 1 1\n2 2 3 3\n2 2 3 3",
 d:{ru:"Доска 4×4 разбита на четыре квадрата 2×2. Напечатай для каждой клетки номер её квадрата: <code>row / 2 * 2 + col / 2</code>. Числа в строке разделяй пробелом.",
    en:"A 4×4 board is split into four 2×2 squares. For every cell print the number of its square: <code>row / 2 * 2 + col / 2</code>. Separate the numbers in a line with a space."},
 h:{ru:"Ничего вычислять не надо, формула дана — важно увидеть, что целочисленное деление склеивает соседние клетки в группы. Пробел ставь перед числом при <code>col &gt; 0</code>.",
    en:"Nothing to invent, the formula is given — the point is to see that integer division glues neighbouring cells into groups. Put the space before the number when <code>col &gt; 0</code>."}},

{t:"FreeDigits", lvl:3, e:"1 2 0 2\n2 0 2 1\n2 1 2 0\n0 2 1 2",
 d:{ru:"Дана доска 4×4 (0 — пустая клетка):<br><code>{0, 0, 4, 0}, {0, 3, 0, 0}, {0, 0, 0, 2}, {1, 0, 0, 0}</code><br>Для каждой клетки напечатай, сколько цифр от 1 до 4 в неё можно поставить по правилам судоку. Для занятой клетки печатай 0.",
    en:"Given a 4×4 board (0 means empty):<br><code>{0, 0, 4, 0}, {0, 3, 0, 0}, {0, 0, 0, 2}, {1, 0, 0, 0}</code><br>For every cell print how many of the digits 1 to 4 can go into it by sudoku rules. For a filled cell print 0."},
 h:{ru:"Понадобится <code>canPlace</code> с тремя проверками: строка, столбец, квадрат 2×2 (<code>row / 2 * 2</code>). Дальше три вложенных цикла: строка, столбец и цифры от 1 до 4 со счётчиком.",
    en:"You will need <code>canPlace</code> with three checks: row, column, 2×2 square (<code>row / 2 * 2</code>). Then three nested loops: rows, columns, and digits 1 to 4 with a counter."}},

{t:"SolveSmall", lvl:3, e:"3 2 4 1\n4 1 2 3\n1 4 3 2\n2 3 1 4",
 d:{ru:"Реши доску 4×4 откатом и напечатай ответ:<br><code>{0, 2, 0, 0}, {0, 0, 0, 3}, {0, 4, 0, 0}, {0, 0, 1, 0}</code><br>Цифры от 1 до 4, квадраты 2×2. Если решения нет — напечатать <code>Error</code>.",
    en:"Solve this 4×4 board by backtracking and print the answer:<br><code>{0, 2, 0, 0}, {0, 0, 0, 3}, {0, 4, 0, 0}, {0, 0, 1, 0}</code><br>Digits 1 to 4, 2×2 squares. If there is no solution, print <code>Error</code>."},
 h:{ru:"Найди первую пустую клетку и перебери в ней цифры: поставил → вызвал себя → не вышло → стёр. Не забудь <code>board[row][col] = 0</code> после неудачного вызова. Если пустых клеток не осталось — <code>return true</code>.",
    en:"Find the first empty cell and try digits in it: place → call yourself → it failed → erase. Don't forget <code>board[row][col] = 0</code> after a failed call. If no empty cells are left, <code>return true</code>."}},

{t:"FourQueens", lvl:3, e:".Q..\n...Q\nQ...\n..Q.",
 d:{ru:"На доске 4×4 расставь четырёх ферзей так, чтобы никакие два не стояли на одной строке, одном столбце или одной диагонали. Напечатай первое найденное расположение: ферзь — <code>Q</code>, пустая клетка — <code>.</code>",
    en:"Place four queens on a 4×4 board so that no two share a row, a column or a diagonal. Print the first arrangement found: a queen is <code>Q</code>, an empty cell is <code>.</code>"},
 h:{ru:"Тот же откат, только доска другая. Ставь по одному ферзю на строку и храни лишь номер столбца: <code>pos[row]</code>. Диагональ проверяется разностями: <code>row - r == col - pos[r]</code> и <code>row - r == pos[r] - col</code>. Дошли до строки 4 — расстановка готова.",
    en:"The same backtracking, a different board. Place one queen per row and store only the column: <code>pos[row]</code>. Diagonals are checked by differences: <code>row - r == col - pos[r]</code> and <code>row - r == pos[r] - col</code>. Reaching row 4 means the arrangement is complete."}},

{t:"SymToDigit", lvl:1, e:"1\n0\n4\n0",
 d:{ru:"Дана строка <code>\"1.4.\"</code>. Пройди её по символам и напечатай для каждого цифру: для точки — ноль, для цифры — саму цифру числом.",
    en:"Given the string <code>\"1.4.\"</code>, walk it character by character and print a digit for each: zero for a dot, the digit itself for a digit."},
 h:{ru:"<code>s[i]</code> даёт байт — код символа. Настоящее число получается вычитанием <code>'0'</code>.",
    en:"<code>s[i]</code> gives a byte — a character code. The real number comes from subtracting <code>'0'</code>."}},

{t:"FirstEmpty", lvl:2, e:"1 2",
 d:{ru:"Дана доска 4×4, где ноль означает пустую клетку:<br><code>{2,1,4,3}, {4,3,0,1}, {3,4,1,2}, {1,2,3,4}</code><br>Найди первую пустую клетку при обходе слева направо сверху вниз и напечатай её строку и столбец.",
    en:"Given a 4×4 board where zero means an empty cell:<br><code>{2,1,4,3}, {4,3,0,1}, {3,4,1,2}, {1,2,3,4}</code><br>find the first empty cell walking left to right, top to bottom, and print its row and column."},
 h:{ru:"Как только нашёл — выходи сразу, иначе найдёшь и все остальные.",
    en:"As soon as you find one, leave immediately, otherwise you will find all the others too."}},

{t:"RowHas", lvl:2, e:"true\nfalse",
 d:{ru:"Напиши функцию, которая отвечает, есть ли заданная цифра в заданной строке доски. Проверь на той же доске: цифру 4 в строке 0 и цифру 4 в строке 3… то есть в строке, где её нет.",
    en:"Write a function that says whether a given digit appears in a given row of the board. Test it on the same board: digit 4 in row 0, and a digit that is absent from row 3."},
 h:{ru:"Строка фиксирована, бежит столбец: <code>board[row][k]</code>. Нашёл — сразу <code>return true</code>.",
    en:"The row is fixed and the column runs: <code>board[row][k]</code>. Found it — <code>return true</code> at once."}},

{t:"ColHas", lvl:2, e:"true\nfalse",
 d:{ru:"То же самое, но по столбцу. Обрати внимание, какой индекс закреплён, а какой бежит — их легко перепутать, и компилятор молчит.",
    en:"The same, but down a column. Note which index is fixed and which one runs — they are easy to swap, and the compiler stays silent."},
 h:{ru:"<code>board[k][col]</code>: закреплён второй индекс, бежит первый. У строки было наоборот.",
    en:"<code>board[k][col]</code>: the second index is fixed and the first runs. For a row it was the other way round."}},

{t:"SquareStart", lvl:1, e:"0 0\n1 0\n2 2\n3 2",
 d:{ru:"Для номеров от 0 до 3 напечатай сам номер и начало квадрата 2×2, к которому он относится: <code>i/2*2</code>.",
    en:"For the numbers 0 to 3 print the number itself and the start of the 2×2 square it belongs to: <code>i/2*2</code>."},
 h:{ru:"Целочисленное деление отбрасывает остаток, умножение возвращает масштаб. Скобки ставить не надо — знаки считаются слева направо.",
    en:"Integer division drops the remainder, the multiplication restores the scale. No brackets needed — the operators are applied left to right."}},

{t:"RemoveAndCheck", lvl:3, e:"false\ntrue",
 d:{ru:"На полностью заполненной верной доске 4×4 спроси, можно ли поставить в клетку (0,0) ту цифру, которая там уже стоит. Потом временно обнули клетку и спроси ещё раз. Напечатай оба ответа.",
    en:"On a completely filled, correct 4×4 board, ask whether the digit already sitting in cell (0,0) may be placed there. Then temporarily zero the cell and ask again. Print both answers."},
 h:{ru:"Первый ответ будет <code>false</code>: проверка находит саму эту клетку. Ради этого её и убирают на время.",
    en:"The first answer will be <code>false</code>: the check finds this very cell. That is exactly why it is removed for a moment."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};
var NO = {ru:"не соберётся", en:"won't compile"};

var BANK = [
{q:{ru:"Чему равно <code>7 / 3 * 3</code>?", en:"What is <code>7 / 3 * 3</code>?"},
 code:null, opts:["6","7","9","2"], ok:0,
 why:{ru:"Слева направо: <code>7 / 3</code> даёт 2 (остаток отброшен), затем <code>2 * 3</code> даёт 6. Так и находится начало квадрата 3×3 для строки 7.",
      en:"Left to right: <code>7 / 3</code> gives 2 (remainder dropped), then <code>2 * 3</code> gives 6. That is how the start of the 3×3 square is found for row 7."}},

{q:{ru:"Чему равно <code>7 / (3 * 3)</code>?", en:"What is <code>7 / (3 * 3)</code>?"},
 code:null, opts:["0","6","2","21"], ok:0,
 why:{ru:"Скобки меняют всё: сначала <code>3 * 3</code> даёт 9, потом <code>7 / 9</code> даёт 0. Начало квадрата так не найти — это уже деление на девять.",
      en:"The brackets change everything: <code>3 * 3</code> is 9 first, then <code>7 / 9</code> is 0. That does not find the start of a square — it is a division by nine."}},

{q:{ru:"Что делает строка <code>board[row][col] = 0</code> в конце цикла по <code>val</code>?",
    en:"What does <code>board[row][col] = 0</code> do at the end of the <code>val</code> loop?"},
 code:null,
 opts:[{ru:"стирает цифру, с которой дальше не получилось",en:"erases the digit that did not work out"},
       {ru:"обнуляет всю доску",en:"clears the whole board"},
       {ru:"завершает функцию",en:"ends the function"},
       {ru:"печатает ноль",en:"prints a zero"}], ok:0,
 why:{ru:"Это и есть откат. Без него неподошедшая цифра остаётся на доске, следующие проверки видят её и врут — решение не найдётся никогда.",
      en:"That is the backtracking step. Without it the rejected digit stays on the board, later checks see it and lie — and no solution is ever found."}},

{q:Q_HAP, code:"// в solve на доске не осталось ни одной пустой клетки",
 opts:[{ru:"циклы дойдут до конца и функция вернёт true",en:"the loops run out and the function returns true"},
       {ru:"функция вернёт false",en:"the function returns false"},
       {ru:"функция вызовет саму себя ещё раз",en:"the function calls itself once more"},
       {ru:"программа зациклится",en:"the program loops forever"}], ok:0,
 why:{ru:"Это условие остановки рекурсии. Каждая занятая клетка пропускается через <code>continue</code>, до <code>return false</code> дело не доходит, и управление доходит до последней строки — <code>return true</code>.",
      en:"That is the recursion's stopping condition. Every filled cell is skipped by <code>continue</code>, <code>return false</code> is never reached, and control arrives at the last line — <code>return true</code>."}},

{q:{ru:"Почему функции решателя принимают <code>*[9][9]int</code>, а не <code>[9][9]int</code>?",
    en:"Why do the solver functions take <code>*[9][9]int</code> rather than <code>[9][9]int</code>?"},
 code:null,
 opts:[{ru:"иначе они меняли бы копию доски, и результат пропадал бы",en:"otherwise they would change a copy and the result would vanish"},
       {ru:"иначе программа не соберётся",en:"otherwise the program won't compile"},
       {ru:"так короче писать",en:"it is shorter to write"},
       {ru:"чтобы функция могла вернуть bool",en:"so the function can return a bool"}], ok:0,
 why:{ru:"Массив передаётся копией целиком — все 81 число. Функция изменила бы копию, копия исчезла бы на выходе, а снаружи доска осталась бы с точками. И собралось бы всё это без единой жалобы.",
      en:"An array is passed as a full copy — all 81 numbers. The function would change the copy, the copy would die at the exit, and outside the board would still hold its dots. And all of it compiles without a murmur."}},

{q:Q_OUT, code:"func fill(board [2][2]int) {\n\tboard[0][0] = 9\n}\n\nb := [2][2]int{{1, 2}, {3, 4}}\nfill(b)\nfmt.Println(b)",
 opts:["[[1 2] [3 4]]","[[9 2] [3 4]]","[9 2 3 4]",{ru:"не соберётся",en:"won't compile"}], ok:0,
 why:{ru:"Функция получила копию массива и изменила её. Оригинал не тронут. Чтобы поменялся он, нужен тип <code>*[2][2]int</code> и вызов <code>fill(&amp;b)</code>.",
      en:"The function got a copy of the array and changed that. The original is untouched. To change it you need the type <code>*[2][2]int</code> and the call <code>fill(&amp;b)</code>."}},

{q:{ru:"Зачем в <code>isValidBoard</code> клетку обнуляют перед вызовом <code>canPlace</code>?",
    en:"Why is the cell zeroed before calling <code>canPlace</code> in <code>isValidBoard</code>?"},
 code:null,
 opts:[{ru:"иначе canPlace найдёт саму эту цифру и всегда ответит «нельзя»",en:"otherwise canPlace finds that very digit and always answers \"no\""},
       {ru:"чтобы очистить доску перед решением",en:"to clear the board before solving"},
       {ru:"чтобы canPlace работала быстрее",en:"to make canPlace faster"},
       {ru:"так требует компилятор",en:"the compiler demands it"}], ok:0,
 why:{ru:"<code>canPlace</code> ищет <code>val</code> в строке, столбце и квадрате. Цифра, стоящая в самой проверяемой клетке, тоже попадёт под поиск. Поэтому её временно убирают, спрашивают и возвращают назад.",
      en:"<code>canPlace</code> looks for <code>val</code> in the row, the column and the square. The digit sitting in the cell under test is caught by that search too. So it is removed temporarily, the question is asked, and it is put back."}},

{q:{ru:"Что проверяет <code>canPlace</code>?", en:"What does <code>canPlace</code> check?"},
 code:null,
 opts:[{ru:"строку, столбец и квадрат 3×3",en:"the row, the column and the 3×3 square"},
       {ru:"только строку и столбец",en:"the row and the column only"},
       {ru:"есть ли у доски решение",en:"whether the board has a solution"},
       {ru:"все 81 клетку доски",en:"all 81 cells of the board"}], ok:0,
 why:{ru:"Три проверки, и в этом вся её работа: правила игры записаны ровно здесь и больше нигде. Про решение и перебор она не знает ничего.",
      en:"Three checks, and that is its entire job: the rules of the game are written here and nowhere else. It knows nothing about solving or searching."}},

{q:{ru:"Знает ли <code>solve</code> правила судоку?", en:"Does <code>solve</code> know the rules of sudoku?"},
 code:null,
 opts:[{ru:"нет, он только перебирает и спрашивает canPlace",en:"no, it only iterates and asks canPlace"},
       {ru:"да, они записаны прямо в нём",en:"yes, they are written inside it"},
       {ru:"да, в части про квадраты 3×3",en:"yes, the part about 3×3 squares"},
       {ru:"знает только правило про строки",en:"it knows the row rule only"}], ok:0,
 why:{ru:"В <code>solve</code> нет ни слова про строки, столбцы и квадраты. Он перебирает цифры, спрашивает разрешения и откатывает неудачные. Поменяются правила — правится одна <code>canPlace</code>.",
      en:"There is not a word about rows, columns or squares in <code>solve</code>. It tries digits, asks permission and rolls back failures. Change the rules and only <code>canPlace</code> is edited."}},

{q:Q_HAP, code:"// доска заполнена полностью, но в строке две одинаковые цифры\n// isValidBoard не вызывали\nsolve(&board)",
 opts:[{ru:"вернёт true, не сделав ни одной проверки",en:"returns true without a single check"},
       {ru:"вернёт false",en:"returns false"},
       {ru:"исправит повтор",en:"fixes the duplicate"},
       {ru:"упадёт при запуске",en:"crashes at run time"}], ok:0,
 why:{ru:"<code>solve</code> работает только с пустыми клетками, а их нет: все занятые он пропускает через <code>continue</code> и доходит до <code>return true</code>. Неверная доска уедет на печать как решение — для этого случая и нужен <code>isValidBoard</code>.",
      en:"<code>solve</code> only works on empty cells and there are none: it skips every filled one with <code>continue</code> and reaches <code>return true</code>. The wrong board goes to print as a solution — that case is why <code>isValidBoard</code> exists."}},

{q:{ru:"Что делает <code>int(sym - '0')</code> при разборе входа?",
    en:"What does <code>int(sym - '0')</code> do while parsing the input?"},
 code:null,
 opts:[{ru:"превращает символ цифры в само число",en:"turns a digit character into the number itself"},
       {ru:"превращает число в символ",en:"turns a number into a character"},
       {ru:"проверяет, что символ — цифра",en:"checks that the character is a digit"},
       {ru:"убирает точку из строки",en:"removes the dot from the string"}], ok:0,
 why:{ru:"Коды цифр идут подряд, поэтому вычитание кода нуля даёт настоящее число: <code>'7' - '0'</code> это 7. Без этого перехода в доску попал бы код символа, а не цифра.",
      en:"Digit codes run consecutively, so subtracting the code of zero gives the real number: <code>'7' - '0'</code> is 7. Without that step the board would hold a character code, not a digit."}},

{q:{ru:"В цикле <code>for k := 0; k &lt; 9; k++</code> строка <code>board[row][k]</code> обходит что?",
    en:"In <code>for k := 0; k &lt; 9; k++</code>, what does <code>board[row][k]</code> walk?"},
 code:null,
 opts:[{ru:"строку row слева направо",en:"row number row, left to right"},
       {ru:"столбец row сверху вниз",en:"column number row, top to bottom"},
       {ru:"квадрат 3×3",en:"the 3×3 square"},
       {ru:"всю доску",en:"the whole board"}], ok:0,
 why:{ru:"Первый индекс закреплён, бежит второй — значит, движение идёт вдоль строки. У соседней строки <code>board[k][col]</code> закреплён второй индекс, и она идёт по столбцу. Перепутать их компилятор не помешает: с обеих сторон <code>int</code>.",
      en:"The first index is fixed and the second moves, so the walk goes along the row. The neighbouring line <code>board[k][col]</code> fixes the second index and walks the column. The compiler will not stop you from swapping them: both are <code>int</code>."}},

{q:Q_OUT, code:"line := \"7\"\nfmt.Println(int(line[0] - '0'))",
 opts:["7","55","'7'",NO], ok:0,
 why:{ru:"<code>line[0]</code> — байт с кодом 55. Вычитание кода нуля (48) убирает сдвиг и оставляет само число семь.",
      en:"<code>line[0]</code> is a byte with code 55. Subtracting the code of zero (48) removes the offset and leaves the number seven."}},

{q:{ru:"Что произойдёт, если убрать строку <code>board[row][col] = 0</code> после неудачного вызова?",
    en:"What happens if the line <code>board[row][col] = 0</code> after a failed call is removed?"},
 code:null,
 opts:[{ru:"неподошедшая цифра останется на доске и испортит следующие проверки",en:"the digit that did not fit stays on the board and spoils later checks"},
       {ru:"программа зациклится",en:"the program loops forever"},
       {ru:"ничего не изменится",en:"nothing changes"},
       {ru:NO.ru,en:NO.en}], ok:0,
 why:{ru:"Откат — это не уборка «для порядка». Оставленная цифра будет считаться расставленной, и все дальнейшие <code>canPlace</code> станут отвечать неверно.",
      en:"Backtracking is not tidying up \"for neatness\". A digit left behind counts as placed, and every later <code>canPlace</code> starts answering wrongly."}},

{q:{ru:"Почему первый вопрос про уже занятую клетку даёт <code>false</code>?",
    en:"Why does the first question about an already occupied cell give <code>false</code>?"},
 code:null,
 opts:[{ru:"проверка находит саму эту клетку в её же строке",en:"the check finds that very cell in its own row"},
       {ru:"доска неверная",en:"the board is invalid"},
       {ru:"ноль считается цифрой",en:"zero counts as a digit"},
       {ru:"это ошибка в canPlace",en:"it is a bug in canPlace"}], ok:0,
 why:{ru:"<code>canPlace</code> просматривает всю строку и столбец, включая саму клетку. Поэтому перед вопросом её обнуляют, а после — возвращают значение обратно.",
      en:"<code>canPlace</code> scans the whole row and column, including the cell itself. So it is zeroed before the question and the value is restored afterwards."}},

{q:{ru:"Сколько правил судоку знает функция <code>solve</code>?", en:"How many sudoku rules does <code>solve</code> know?"},
 code:null,
 opts:[{ru:"ни одного — она только спрашивает canPlace",en:"none — it only asks canPlace"},
       {ru:"три: строка, столбец, квадрат",en:"three: row, column, square"},
       {ru:"одно: цифры от 1 до 9",en:"one: digits from 1 to 9"},
       {ru:"все, они записаны внутри неё",en:"all of them, written inside it"}], ok:0,
 why:{ru:"Правила живут ровно в одном месте — в <code>canPlace</code>. Захочешь поменять размер доски — правишь одну функцию, а не всю программу.",
      en:"The rules live in exactly one place — <code>canPlace</code>. Change the board size and you edit one function, not the whole program."}},

{q:Q_OUT, code:"fmt.Println(5 / 3 * 3)",
 opts:["3","5","1","0"], ok:0,
 why:{ru:"Слева направо: <code>5/3</code> в целых даёт 1, потом <code>1*3</code> даёт 3. Это округление вниз до кратного трём — так и находится начало квадрата.",
      en:"Left to right: <code>5/3</code> in integers gives 1, then <code>1*3</code> gives 3. That is rounding down to a multiple of three — exactly how a square's start is found."}},

{q:{ru:"Что вернёт <code>solve</code>, если на доске не осталось ни одной пустой клетки?",
    en:"What does <code>solve</code> return if no empty cells are left on the board?"},
 code:null,
 opts:["true",{ru:"false",en:"false"},{ru:"ничего, зациклится",en:"nothing, it loops"},{ru:NO.ru,en:NO.en}], ok:0,
 why:{ru:"Оба цикла дойдут до конца, ни одной пустой клетки не найдётся, и выполнится <code>return true</code> после циклов — доска решена. Это дно рекурсии.",
      en:"Both loops run to the end, no empty cell is found, and the <code>return true</code> after the loops fires — the board is solved. That is the bottom of the recursion."}},

{q:{ru:"Зачем проверка входа вынесена в отдельную функцию, а не встроена в solve?",
    en:"Why is the input check a separate function instead of being built into solve?"},
 code:null,
 opts:[{ru:"solve пишется в расчёте, что доска уже верная — иначе в нём была бы проверка на каждом шаге",en:"solve is written assuming the board is already valid — otherwise it would re-check at every step"},
       {ru:"так быстрее работает",en:"it runs faster that way"},
       {ru:"иначе не соберётся",en:"otherwise it will not compile"},
       {ru:"чтобы файл был короче",en:"to make the file shorter"}], ok:0,
 why:{ru:"Одна функция — одна работа. Проверили один раз снаружи, и внутри решателя нет ни строки про «а вдруг тут буква».",
      en:"One function, one job. Check once on the outside and there is not a single line inside the solver about \"what if there is a letter here\"."}},

{q:Q_HAP, code:"func fill(board [4][4]int) {\n\tboard[0][0] = 9\n}\n// вызвали fill(b), печатаем b",
 opts:[{ru:"доска не изменится — функция меняла копию",en:"the board is unchanged — the function changed a copy"},
       {ru:"доска изменится",en:"the board changes"},
       {ru:NO.ru,en:NO.en},
       {ru:"программа упадёт",en:"the program crashes"}], ok:0,
 why:{ru:"Массив передаётся по значению: функция получает свою копию целиком. Чтобы менять настоящую доску, нужен указатель <code>*[4][4]int</code> и вызов через <code>&amp;b</code>.",
      en:"An array is passed by value: the function gets a full copy of its own. To change the real board you need a pointer <code>*[4][4]int</code> and a call with <code>&amp;b</code>."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Что такое откат и почему без него судоку не решить?",
    en:"What is backtracking and why can't sudoku be solved without it?"},
 a:{ru:`<p>Откат — это «поставил, попробовал дальше, не вышло — стёр и пробую следующее».</p>
<p>Без него остаётся полный перебор: 81 клетка, до девяти цифр в каждой. Число сочетаний получается таким, что перебирать их бессмысленно при любой скорости компьютера.</p>
<p>Откат меняет не скорость, а количество работы. Когда путь становится невозможным — есть клетка, куда не встаёт ни одна цифра, — отпадает не один вариант, а всё дерево продолжений под ним. Миллиарды веток исчезают на одном <code>return false</code>.</p>
<p>В коде это четыре строки:</p>
<pre><code>board[row][col] = val
if solve(board) {
	return true
}
board[row][col] = 0</code></pre>
<p>Последняя — самая важная. Она возвращает доску в то состояние, в котором её получили, чтобы следующая попытка началась с чистого места.</p>`,
    en:`<p>Backtracking is "place it, try on, it failed — erase it and try the next".</p>
<p>Without it you are left with an exhaustive search: 81 cells, up to nine digits in each. The number of combinations is such that trying them is pointless at any computer speed.</p>
<p>Backtracking changes not the speed but the amount of work. When a path becomes impossible — there is a cell where no digit fits — it is not one option that falls away but the entire tree of continuations below it. Billions of branches vanish on a single <code>return false</code>.</p>
<p>In code it is four lines:</p>
<pre><code>board[row][col] = val
if solve(board) {
	return true
}
board[row][col] = 0</code></pre>
<p>The last one matters most. It returns the board to the state it arrived in, so the next attempt starts from a clean place.</p>`}},

{q:{ru:"Почему <code>row / 3 * 3</code> даёт начало квадрата?",
    en:"Why does <code>row / 3 * 3</code> give the start of the square?"},
 a:{ru:`<p>Из-за целочисленного деления: остаток отбрасывается, а не округляется.</p>
<pre><code>row:       0 1 2   3 4 5   6 7 8
row / 3:   0 0 0   1 1 1   2 2 2
* 3:       0 0 0   3 3 3   6 6 6</code></pre>
<p>Деление склеивает три соседние строки в одну группу и даёт её номер: 0, 1 или 2. Умножение обратно на 3 превращает номер группы в номер её первой строки: 0, 3 или 6. Со столбцами то же самое.</p>
<p>Порядок действий важен: <code>row / 3 * 3</code> считается слева направо. <code>row / (3 * 3)</code> — это деление на девять, оттуда получаются только нули и единицы.</p>
<p>На доске 4×4 с квадратами 2×2 та же формула выглядит как <code>row / 2 * 2</code>. Меняется только размер квадрата.</p>`,
    en:`<p>Because of integer division: the remainder is dropped, not rounded.</p>
<pre><code>row:       0 1 2   3 4 5   6 7 8
row / 3:   0 0 0   1 1 1   2 2 2
* 3:       0 0 0   3 3 3   6 6 6</code></pre>
<p>The division glues three neighbouring rows into one group and gives its number: 0, 1 or 2. Multiplying back by 3 turns the group number into the number of its first row: 0, 3 or 6. Columns work the same way.</p>
<p>The order matters: <code>row / 3 * 3</code> evaluates left to right. <code>row / (3 * 3)</code> is a division by nine and yields only zeros and ones.</p>
<p>On a 4×4 board with 2×2 squares the same formula reads <code>row / 2 * 2</code>. Only the size of the square changes.</p>`}},

{q:{ru:"Зачем в <code>isValidBoard</code> клетку сначала обнуляют, а потом возвращают?",
    en:"Why does <code>isValidBoard</code> zero a cell and then restore it?"},
 a:{ru:`<p>Потому что <code>canPlace</code> отвечает на вопрос «свободно ли здесь для <code>val</code>», и цифра, уже стоящая в этой клетке, попадёт под её собственный поиск.</p>
<pre><code>board[0][0] = 5
canPlace(board, 0, 0, 5)   <span class="cm">// false — нашла пятёрку в самой клетке [0][0]</span></code></pre>
<p>Такой ответ был бы «нельзя» для любой заполненной клетки любой доски, даже безупречной. Поэтому клетку временно очищают, задают вопрос и кладут значение обратно:</p>
<pre><code>board[row][col] = 0
valid := canPlace(board, row, col, val)
board[row][col] = val</code></pre>
<p>Между этими строками не должно быть ничего лишнего — никакого <code>return</code> посередине, иначе доска останется испорченной.</p>`,
    en:`<p>Because <code>canPlace</code> answers "is this free for <code>val</code>", and the digit already sitting in that cell is caught by its own search.</p>
<pre><code>board[0][0] = 5
canPlace(board, 0, 0, 5)   <span class="cm">// false — it found the 5 in cell [0][0] itself</span></code></pre>
<p>That answer would be "no" for every filled cell of every board, even a flawless one. So the cell is cleared temporarily, the question is asked, and the value goes back:</p>
<pre><code>board[row][col] = 0
valid := canPlace(board, row, col, val)
board[row][col] = val</code></pre>
<p>Nothing extra may sit between those lines — no <code>return</code> in the middle — or the board stays damaged.</p>`}},

{q:{ru:"Почему доска передаётся указателем, а не как есть?",
    en:"Why is the board passed by pointer instead of as it is?"},
 a:{ru:`<p>Массив в Go передаётся в функцию копией целиком. Не ссылкой, не «частично» — все 81 число копируются в новую память.</p>
<p>Для <code>solve</code> это смертельно: он поставил бы все цифры в копию, копия исчезла бы при выходе, а <code>main</code> напечатал бы исходную доску с точками. Программа при этом собирается без единого замечания и не падает — просто печатает не то.</p>
<div class="tablewrap"><table>
<tr><th></th><th><code>[9][9]int</code></th><th><code>*[9][9]int</code></th></tr>
<tr><td>Что приходит в функцию</td><td>копия всех 81 числа</td><td>адрес, одно число</td></tr>
<tr><td>Изменения видны снаружи</td><td>нет</td><td>да</td></tr>
<tr><td>Вызов</td><td><code>solve(board)</code></td><td><code>solve(&amp;board)</code></td></tr>
</table></div>
<p>Внутри функции разницы в записи нет: <code>board[row][col]</code> пишется одинаково, Go разыменовывает указатель сам.</p>`,
    en:`<p>An array in Go is passed to a function as a full copy. Not a reference, not partially — all 81 numbers are copied into new memory.</p>
<p>For <code>solve</code> that is fatal: it would write every digit into the copy, the copy would die at the exit, and <code>main</code> would print the original board full of dots. The program compiles without a single complaint and does not crash — it just prints the wrong thing.</p>
<div class="tablewrap"><table>
<tr><th></th><th><code>[9][9]int</code></th><th><code>*[9][9]int</code></th></tr>
<tr><td>What arrives in the function</td><td>a copy of all 81 numbers</td><td>an address, one number</td></tr>
<tr><td>Changes visible outside</td><td>no</td><td>yes</td></tr>
<tr><td>The call</td><td><code>solve(board)</code></td><td><code>solve(&amp;board)</code></td></tr>
</table></div>
<p>Inside the function the writing is identical: <code>board[row][col]</code> looks the same, Go dereferences the pointer for you.</p>`}},

{q:{ru:"Почему проверку входа не смешивают с решением?",
    en:"Why isn't input validation mixed into the solving?"},
 a:{ru:`<p>Потому что это две разные работы, и у каждой свой вопрос.</p>
<p>Первая: «то ли мне вообще дали?» — девять строк, в каждой девять символов, каждый символ цифра или точка. Вторая: «как это решить?» Пока первая не закончена, вторая не может начаться: нельзя брать <code>input[3]</code>, не зная, что строк хотя бы четыре.</p>
<p>Выигрыш в том, что <code>solve</code> написан в предположении, что доска корректна, и внутри него нет ни строчки про «а вдруг там буква». Если проверки размазать по программе, каждая функция начнёт либо перепроверять всё заново, либо надеяться на соседа.</p>
<p>Порядок в решателе такой: разобрать вход → проверить расстановку → решить → напечатать. Каждый шаг может сказать <code>Error</code> и остановиться, до печати доходит только то, что прошло все четыре.</p>`,
    en:`<p>Because these are two different jobs, each with its own question.</p>
<p>The first: "was I even given the right thing?" — nine lines, nine characters each, every character a digit or a dot. The second: "how do I solve it?" The second cannot start before the first finishes: you cannot reach for <code>input[3]</code> without knowing there are at least four lines.</p>
<p>The gain is that <code>solve</code> is written assuming a correct board, and there is not a line inside it about "what if there is a letter here". Smear the checks across the program and every function starts either re-checking everything or trusting its neighbour.</p>
<p>The order in the solver is: parse the input → check the layout → solve → print. Each step can say <code>Error</code> and stop; only what passed all four reaches the printing.</p>`}},

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
<p>Hence the difference in size: twenty lines against a hundred and twenty. The skeleton is the same.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */
var SCENARIOS = [
{
 name:{ru:"Можно ли поставить цифру", en:"Can this digit go here"},
 params:[
  {key:"col", label:{ru:"столбец", en:"column"}, min:0, max:3, def:0},
  {key:"val", label:{ru:"цифра", en:"digit"}, min:2, max:4, def:3}
 ],
 code: function(p){
   return [
    "// canPlace(&board, 0, " + p.col + ", " + p.val + ")",
    "func canPlace(board *[4][4]int, row, col, val int) bool {",
    "\tfor k := 0; k < 4; k++ {",
    "\t\tif board[row][k] == val {",
    "\t\t\treturn false",
    "\t\t}",
    "\t\tif board[k][col] == val {",
    "\t\t\treturn false",
    "\t\t}",
    "\t}",
    "",
    "\tstartRow := row / 2 * 2",
    "\tstartCol := col / 2 * 2",
    "\tfor i := startRow; i < startRow+2; i++ {",
    "\t\tfor j := startCol; j < startCol+2; j++ {",
    "\t\t\tif board[i][j] == val {",
    "\t\t\t\treturn false",
    "\t\t\t}",
    "\t\t}",
    "\t}",
    "\treturn true",
    "}"
   ];
 },
 steps: function(p){
   var bd = [[0,0,4,0],[0,3,0,0],[0,0,0,2],[1,0,0,0]];
   var row = 0, col = p.col, val = p.val, st = [], k, i, j;

   var boardVars = [];
   for(k = 0; k < 4; k++) boardVars.push(["board[" + k + "]", bd[k].join(" "), "[4]int"]);

   var rowCells = [], colCells = [];
   for(k = 0; k < 4; k++){ rowCells.push(String(bd[row][k])); colCells.push(String(bd[k][col])); }
   var rowTitle = {ru:"Строка 0: бежит k, row закреплён", en:"Row 0: k runs, row stays fixed"};
   var colTitle = {ru:"Столбец " + col + ": бежит k сверху вниз", en:"Column " + col + ": k runs top to bottom"};

   var here = bd[row][col];
   st.push({line:0, vars:boardVars.concat([["row","0","int"],["col",String(col),"int"],["val",String(val),"int"]]),
     out:"", cells:rowCells.slice(), cellsOn:[col], cellsTitle:{ru:"Строка 0 доски: цифру хотим в [0][" + col + "]",
                                                               en:"Board row 0: the digit would go into [0][" + col + "]"},
     note:{ru:"Вызов: можно ли поставить " + val + " в клетку [0][" + col + "]? Доска 4×4, ноль означает пустую клетку. Функция ничего не ставит — она только отвечает «да» или «нет»." +
              (here !== 0 ? " Обрати внимание: в этой клетке уже стоит " + here + ". <code>canPlace</code> об этом не спрашивает — она ищет по доске только " + val + "." : ""),
           en:"The call: can " + val + " go into cell [0][" + col + "]? The board is 4×4 and zero means an empty cell. The function places nothing — it only answers yes or no." +
              (here !== 0 ? " Note that this cell already holds " + here + ". <code>canPlace</code> never asks about that — it only looks for " + val + " on the board." : "")}});

   for(k = 0; k < 4; k++){
     st.push({line:2, vars:[["k", String(k), "int"], ["k < 4", "true", "bool"], ["val", String(val), "int"]],
       out:"", cells:rowCells.slice(), cellsOn:[k], cellsTitle:rowTitle,
       note:{ru:(k === 0
                 ? "Первая выполненная строка тела — заголовок цикла. <code>k := 0</code> сработал один раз, проверка <code>0 &lt; 4</code> — истина, заходим в тело."
                 : "<code>k++</code> сделал <code>k</code> равным " + k + ". Проверка <code>" + k + " &lt; 4</code> — истина, тело выполняется ещё раз."),
             en:(k === 0
                 ? "The first line of the body that runs is the loop header. <code>k := 0</code> fired once, the check <code>0 &lt; 4</code> is true, and we enter the body."
                 : "<code>k++</code> made <code>k</code> equal " + k + ". The check <code>" + k + " &lt; 4</code> is true, so the body runs once more.")}});

     var inRow = bd[row][k];
     st.push({line:3, vars:[["k", String(k), "int"], ["board[row][k]", String(inRow), "int"], ["val", String(val), "int"], ["board[row][k] == val", inRow === val ? "true" : "false", "bool"]],
       out:"", cells:rowCells.slice(), cellsOn:[k], cellsTitle:rowTitle,
       note:{ru:(k === 0 ? "Первая проверка — по строке. <code>row</code> закреплён, бежит <code>k</code>, значит идём вдоль строки 0 слева направо. " : "Шаг <code>k = " + k + "</code> по строке. ") +
                (inRow === val
                  ? "<b>Нашли.</b> В клетке [0][" + k + "] уже стоит " + val + ", условие истинно — заходим в тело <code>if</code>." + (k === col ? " Это и есть та самая клетка, про которую спрашиваем: функция нашла саму себя. Ровно поэтому в <code>isValidBoard</code> клетку перед вопросом обнуляют." : "")
                  : "В клетке [0][" + k + "] стоит " + inRow + (inRow === 0 ? " — пусто" : "") + ", это не " + val + ": условие ложно, тело <code>if</code> пропускаем."),
             en:(k === 0 ? "The first check walks the row. <code>row</code> is fixed and <code>k</code> moves, so we go along row 0 from left to right. " : "Step <code>k = " + k + "</code> along the row. ") +
                (inRow === val
                  ? "<b>Found it.</b> Cell [0][" + k + "] already holds " + val + ", the condition is true — into the <code>if</code> body we go." + (k === col ? " And that is the very cell we are asking about: the function found itself. This is exactly why <code>isValidBoard</code> zeroes the cell before asking." : "")
                  : "Cell [0][" + k + "] holds " + inRow + (inRow === 0 ? " — empty" : "") + ", not " + val + ": the condition is false and the <code>if</code> body is skipped.")}});

     if(inRow === val){
       st.push({line:4, vars:[["row","0","int"],["col",String(col),"int"],["val",String(val),"int"]],
         out:"", cells:rowCells.slice(), cellsOn:[k], cellsTitle:rowTitle,
         note:{ru:"<code>return false</code>. Ответ дала первая проверка, и дальше не смотрят ничего: ни столбец, ни квадрат. Одного совпадения хватает, функция кончается прямо здесь.",
               en:"<code>return false</code>. The first check settled it, and nothing else is looked at — neither the column nor the square. One match is enough and the function ends right here."}});
       return st;
     }

     var inCol = bd[k][col];
     st.push({line:6, vars:[["k", String(k), "int"], ["board[k][col]", String(inCol), "int"], ["val", String(val), "int"], ["board[k][col] == val", inCol === val ? "true" : "false", "bool"]],
       out:"", cells:colCells.slice(), cellsOn:[k], cellsTitle:colTitle,
       note:{ru:(k === 0 ? "Вторая проверка — по столбцу, в том же проходе цикла. Здесь <code>k</code> стоит <b>первым</b> индексом, поэтому движение идёт сверху вниз по столбцу " + col + ". Одна буква разницы — другое направление. " : "Шаг <code>k = " + k + "</code> по столбцу. ") +
                (inCol === val
                  ? "<b>Нашли.</b> В клетке [" + k + "][" + col + "] уже стоит " + val + ", условие истинно." + (k === row ? " Это та самая клетка, про которую спрашиваем: функция нашла саму себя. Поэтому в <code>isValidBoard</code> клетку сначала обнуляют." : "")
                  : "В клетке [" + k + "][" + col + "] стоит " + inCol + (inCol === 0 ? " — пусто" : "") + ", это не " + val + ": условие ложно, идём дальше."),
             en:(k === 0 ? "The second check walks the column, in the same pass of the loop. Here <code>k</code> is the <b>first</b> index, so the movement goes top to bottom down column " + col + ". One letter of difference, a different direction. " : "Step <code>k = " + k + "</code> down the column. ") +
                (inCol === val
                  ? "<b>Found it.</b> Cell [" + k + "][" + col + "] already holds " + val + " and the condition is true." + (k === row ? " That is the very cell we are asking about: the function found itself. This is why <code>isValidBoard</code> zeroes the cell first." : "")
                  : "Cell [" + k + "][" + col + "] holds " + inCol + (inCol === 0 ? " — empty" : "") + ", not " + val + ": the condition is false and we carry on.")}});

     if(inCol === val){
       st.push({line:7, vars:[["row","0","int"],["col",String(col),"int"],["val",String(val),"int"]],
         out:"", cells:colCells.slice(), cellsOn:[k], cellsTitle:colTitle,
         note:{ru:"<code>return false</code>. Ответ дала вторая проверка — по столбцу. До квадрата дело не дошло.",
               en:"<code>return false</code>. The second check settled it — the column. The square was never reached."}});
       return st;
     }
   }

   st.push({line:2, vars:[["k", "4", "int"], ["k < 4", "false", "bool"], ["val", String(val), "int"]],
     out:"", cells:rowCells.slice(), cellsTitle:rowTitle,
     note:{ru:"<code>k++</code> сделал <code>k</code> равным 4. Проверка <code>4 &lt; 4</code> — ложь: условие больше не выполняется, выходим из цикла. За четыре прохода он проверил всю строку и весь столбец — цифры " + val + " там нет.",
           en:"<code>k++</code> made <code>k</code> equal 4. The check <code>4 &lt; 4</code> is false: the condition no longer holds and we leave the loop. In four passes it checked the whole row and the whole column — no " + val + " in either."}});

   var sr = Math.floor(row / 2) * 2, sc = Math.floor(col / 2) * 2;
   var sqCells = [String(bd[sr][sc]), String(bd[sr][sc + 1]), String(bd[sr + 1][sc]), String(bd[sr + 1][sc + 1])];
   var sqTitle = {ru:"Квадрат 2×2: [" + sr + "][" + sc + "] [" + sr + "][" + (sc + 1) + "] [" + (sr + 1) + "][" + sc + "] [" + (sr + 1) + "][" + (sc + 1) + "]",
                  en:"The 2×2 square: [" + sr + "][" + sc + "] [" + sr + "][" + (sc + 1) + "] [" + (sr + 1) + "][" + sc + "] [" + (sr + 1) + "][" + (sc + 1) + "]"};

   st.push({line:11, vars:[["row","0","int"],["startRow", String(sr), "int"]], out:"",
     cells:sqCells.slice(), cellsTitle:sqTitle,
     note:{ru:"Остаётся третья проверка, квадрат. Начало по строке: <code>0 / 2</code> даёт 0, умножаем на 2 — снова 0. Для строк 0 и 1 начало 0, для строк 2 и 3 — двойка.",
           en:"The third check is left, the square. The start by row: <code>0 / 2</code> is 0, times 2 is 0 again. For rows 0 and 1 the start is 0; for rows 2 and 3 it is 2."}});

   st.push({line:12, vars:[["col", String(col), "int"], ["startRow", String(sr), "int"], ["startCol", String(sc), "int"]], out:"",
     cells:sqCells.slice(), cellsTitle:sqTitle,
     note:{ru:"Начало по столбцу считается так же: <code>" + col + " / 2</code> даёт " + Math.floor(col / 2) + ", умножаем на 2 — " + sc + ". Целочисленное деление склеивает соседние столбцы в пары: 0 и 1 дают 0, 2 и 3 дают 2.",
           en:"The start by column is found the same way: <code>" + col + " / 2</code> is " + Math.floor(col / 2) + ", times 2 is " + sc + ". Integer division glues neighbouring columns into pairs: 0 and 1 give 0, 2 and 3 give 2."}});

   for(i = sr; i < sr + 2; i++){
     st.push({line:13, vars:[["i", String(i), "int"], ["startRow", String(sr), "int"], ["i < startRow+2", "true", "bool"]],
       out:"", cells:sqCells.slice(), cellsOn:[(i - sr) * 2, (i - sr) * 2 + 1], cellsTitle:sqTitle,
       note:{ru:(i === sr
                 ? "Заголовок внешнего цикла по квадрату: <code>i := startRow</code> — это " + sr + ". Проверка <code>" + sr + " &lt; " + (sr + 2) + "</code> — истина, берём первую строку квадрата."
                 : "<code>i++</code> сделал <code>i</code> равным " + i + ". Проверка <code>" + i + " &lt; " + (sr + 2) + "</code> — истина, вторая строка квадрата."),
             en:(i === sr
                 ? "The outer loop header of the square: <code>i := startRow</code> is " + sr + ". The check <code>" + sr + " &lt; " + (sr + 2) + "</code> is true, so we take the first row of the square."
                 : "<code>i++</code> made <code>i</code> equal " + i + ". The check <code>" + i + " &lt; " + (sr + 2) + "</code> is true — the second row of the square.")}});

     for(j = sc; j < sc + 2; j++){
       st.push({line:14, vars:[["i", String(i), "int"], ["j", String(j), "int"], ["j < startCol+2", "true", "bool"]],
         out:"", cells:sqCells.slice(), cellsOn:[(i - sr) * 2 + (j - sc)], cellsTitle:sqTitle,
         note:{ru:(j === sc
                   ? "Внутренний цикл квадрата стартует заново: <code>j := startCol</code> — это " + sc + ", проверка <code>" + sc + " &lt; " + (sc + 2) + "</code> — истина."
                   : "<code>j++</code> сделал <code>j</code> равным " + j + ". Проверка <code>" + j + " &lt; " + (sc + 2) + "</code> — истина, вторая клетка в этой строке квадрата."),
               en:(j === sc
                   ? "The inner loop of the square starts afresh: <code>j := startCol</code> is " + sc + ", and the check <code>" + sc + " &lt; " + (sc + 2) + "</code> is true."
                   : "<code>j++</code> made <code>j</code> equal " + j + ". The check <code>" + j + " &lt; " + (sc + 2) + "</code> is true — the second cell in this row of the square.")}});

       var inSq = bd[i][j];
       st.push({line:15, vars:[["i", String(i), "int"], ["j", String(j), "int"], ["board[i][j]", String(inSq), "int"], ["board[i][j] == val", inSq === val ? "true" : "false", "bool"]],
         out:"", cells:sqCells.slice(), cellsOn:[(i - sr) * 2 + (j - sc)], cellsTitle:sqTitle,
         note:{ru:(i === sr && j === sc ? "Пошли по квадрату 2×2 от найденного начала. " : "") +
                  (inSq === val
                    ? "<b>Вот она.</b> В клетке [" + i + "][" + j + "] стоит " + val + " — в том же квадрате 2×2. Ни строка, ни столбец её не видели: она стоит по диагонали от нашей клетки."
                    : "Клетка [" + i + "][" + j + "]: " + inSq + (inSq === 0 ? " — пусто" : "") + ", это не " + val + ", условие ложно."),
               en:(i === sr && j === sc ? "We walk the 2×2 square from that start. " : "") +
                  (inSq === val
                    ? "<b>There it is.</b> Cell [" + i + "][" + j + "] holds " + val + " — in the same 2×2 square. Neither the row nor the column saw it: it sits diagonally from our cell."
                    : "Cell [" + i + "][" + j + "]: " + inSq + (inSq === 0 ? " — empty" : "") + ", not " + val + ", the condition is false.")}});

       if(inSq === val){
         st.push({line:16, vars:[["row","0","int"],["col",String(col),"int"],["val",String(val),"int"]],
           out:"", cells:sqCells.slice(), cellsOn:[(i - sr) * 2 + (j - sc)], cellsTitle:sqTitle,
           note:{ru:"<code>return false</code>. Ответ «нельзя» дала третья проверка — без квадрата функция ответила бы «можно» и соврала. Три проверки нужны все три.",
                 en:"<code>return false</code>. The answer is no, and it came from the third check — without the square the function would have said yes and lied. All three checks are needed."}});
         return st;
       }
     }

     st.push({line:14, vars:[["i", String(i), "int"], ["j", String(sc + 2), "int"], ["j < startCol+2", "false", "bool"]],
       out:"", cells:sqCells.slice(), cellsOn:[(i - sr) * 2, (i - sr) * 2 + 1], cellsTitle:sqTitle,
       note:{ru:"<code>j</code> стал " + (sc + 2) + ", проверка <code>" + (sc + 2) + " &lt; " + (sc + 2) + "</code> — ложь: строка квадрата пройдена, выходим из внутреннего цикла.",
             en:"<code>j</code> became " + (sc + 2) + " and the check <code>" + (sc + 2) + " &lt; " + (sc + 2) + "</code> is false: this row of the square is done, so we leave the inner loop."}});
   }

   st.push({line:13, vars:[["i", String(sr + 2), "int"], ["startRow", String(sr), "int"], ["i < startRow+2", "false", "bool"]],
     out:"", cells:sqCells.slice(), cellsTitle:sqTitle,
     note:{ru:"<code>i</code> стал " + (sr + 2) + ", условие ложно — обе строки квадрата пройдены, выходим. Четыре клетки квадрата проверены, " + val + " среди них нет.",
           en:"<code>i</code> became " + (sr + 2) + " and the condition is false — both rows of the square are done, so we leave. All four cells were checked and there is no " + val + " among them."}});

   st.push({line:20, vars:[["row","0","int"],["col",String(col),"int"],["val",String(val),"int"]], out:"",
     cells:sqCells.slice(), cellsTitle:sqTitle,
     note:{ru:"Все три проверки прошли, " + val + " нигде не встретилась — ставить можно. <code>return true</code> стоит в самом конце: он срабатывает только тогда, когда все выходы через <code>false</code> остались позади.",
           en:"All three checks passed, " + val + " turned up nowhere — placing it is allowed. <code>return true</code> sits at the very end: it fires only once every <code>false</code> exit is behind you."}});
   return st;
 }
},

{
 name:{ru:"Откат: поставил, стёр, поставил", en:"Backtracking: place, erase, place"},
 code:[
  "func solve(board *[4][4]int) bool {",
  "\tfor row := 0; row < 4; row++ {",
  "\t\tfor col := 0; col < 4; col++ {",
  "\t\t\tif board[row][col] != 0 {",
  "\t\t\t\tcontinue",
  "\t\t\t}",
  "\t\t\tfor val := 1; val <= 4; val++ {",
  "\t\t\t\tif canPlace(board, row, col, val) {",
  "\t\t\t\t\tboard[row][col] = val",
  "\t\t\t\t\tif solve(board) {",
  "\t\t\t\t\t\treturn true",
  "\t\t\t\t\t}",
  "\t\t\t\t\tboard[row][col] = 0",
  "\t\t\t\t}",
  "\t\t\t}",
  "\t\t\treturn false",
  "\t\t}",
  "\t}",
  "\treturn true",
  "}"
 ],
 steps: function(){
   var st = [];
   var cur = [".","2",".","1","1",".","2","4",".",".","1","3",".",".",".","2"];
   var title = {ru:"Доска 4×4, индекс = row×4+col", en:"The 4×4 board, index = row×4 + col"};
   var F1 = ["main()","solve() ①"];
   var F2 = ["main()","solve() ①","solve() ②"];
   var DEEP = ["main()","solve() ①","solve() ②","solve() ③","solve() ④","solve() ⑤","solve() ⑥","solve() ⑦","solve() ⑧","solve() ⑨"];

   var rows = function(){
     return [["board[0]", cur.slice(0, 4).join(" "), "[4]int"],
             ["board[1]", cur.slice(4, 8).join(" "), "[4]int"],
             ["board[2]", cur.slice(8, 12).join(" "), "[4]int"],
             ["board[3]", cur.slice(12, 16).join(" "), "[4]int"]];
   };
   var S = function(line, on, stack, extra, ruTxt, enTxt){
     st.push({line:line, vars:rows().concat(extra || []), out:"",
       stack:stack, cells:cur.slice(), cellsOn:on, cellsTitle:title,
       note:{ru:ruTxt, en:enTxt}});
   };

   /* ---- вызов ①: клетка [0][0] ---- */
   S(1, [0], F1, [["row","0","int"],["row < 4","true","bool"]],
     "Заголовок внешнего цикла. <code>row := 0</code> сработал один раз, проверка <code>0 &lt; 4</code> — истина, заходим в тело. Доска 4×4, точка — пустая клетка.",
     "The outer loop header. <code>row := 0</code> fired once, the check <code>0 &lt; 4</code> is true, and we enter the body. The board is 4×4 and a dot means an empty cell.");
   S(2, [0], F1, [["row","0","int"],["col","0","int"],["col < 4","true","bool"]],
     "Заголовок внутреннего цикла: <code>col := 0</code>, проверка <code>0 &lt; 4</code> — истина. Пара циклов ищет первую пустую клетку, начиная с [0][0].",
     "The inner loop header: <code>col := 0</code>, and the check <code>0 &lt; 4</code> is true. The pair of loops is looking for the first empty cell, starting at [0][0].");
   S(3, [0], F1, [["row","0","int"],["col","0","int"],["board[row][col]","0","int"],["board[row][col] != 0","false","bool"]],
     "Клетка занята? <code>board[0][0]</code> — это 0, значит <code>0 != 0</code> — ложь. Клетка пустая, <code>continue</code> пропускаем и остаёмся здесь работать.",
     "Is the cell taken? <code>board[0][0]</code> is 0, so <code>0 != 0</code> is false. The cell is empty, <code>continue</code> is skipped and we stay here to work.");
   S(6, [0], F1, [["row","0","int"],["col","0","int"],["val","1","int"],["val <= 4","true","bool"]],
     "Заголовок цикла по цифрам: <code>val := 1</code>, проверка <code>1 &lt;= 4</code> — истина. Перебор всегда начинается с единицы.",
     "The digit loop header: <code>val := 1</code>, and the check <code>1 &lt;= 4</code> is true. The search always starts at one.");
   S(7, [0, 4], F1, [["val","1","int"],["canPlace(...)","false","bool"]],
     "<code>canPlace</code> ответила <b>false</b>: единица уже стоит в столбце 0 — в клетке [1][0]. Она есть и в строке 0, в клетке [0][3], но функция ушла с первым же совпадением. Тело <code>if</code> пропускаем целиком — ни постановки, ни рекурсии.",
     "<code>canPlace</code> answered <b>false</b>: a one already sits in column 0, in cell [1][0]. There is one in row 0 as well, in cell [0][3], but the function left on the very first match. The whole <code>if</code> body is skipped — no placing, no recursion.");
   S(6, [0], F1, [["row","0","int"],["col","0","int"],["val","2","int"],["val <= 4","true","bool"]],
     "<code>val++</code> сделал <code>val</code> равным 2. Проверка <code>2 &lt;= 4</code> — истина, пробуем двойку.",
     "<code>val++</code> made <code>val</code> equal 2. The check <code>2 &lt;= 4</code> is true, so we try the two.");
   S(7, [0, 1], F1, [["val","2","int"],["canPlace(...)","false","bool"]],
     "Снова <b>false</b>: двойка стоит в той же строке, в клетке [0][1].",
     "<b>false</b> again: the two sits in the same row, in cell [0][1].");
   S(6, [0], F1, [["row","0","int"],["col","0","int"],["val","3","int"],["val <= 4","true","bool"]],
     "<code>val</code> стал 3, проверка <code>3 &lt;= 4</code> — истина.",
     "<code>val</code> became 3 and the check <code>3 &lt;= 4</code> is true.");
   S(7, [0], F1, [["val","3","int"],["canPlace(...)","true","bool"]],
     "<b>true</b>. Тройки нет ни в строке 0, ни в столбце 0, ни в квадрате 2×2 слева сверху. Заходим в тело <code>if</code>.",
     "<b>true</b>. There is no three in row 0, none in column 0, none in the top-left 2×2 square. Into the <code>if</code> body we go.");
   cur[0] = "3";
   S(8, [0], F1, [["val","3","int"]],
     "Поставили тройку. Пока это только предположение — правилам она не противоречит, но верна ли, ещё неизвестно.",
     "The three is placed. So far it is only a guess — it breaks no rule, but whether it is right is still unknown.");
   S(9, [0], F2, [["val","3","int"]],
     "<code>solve</code> вызывает сам себя — это условие <code>if</code>, и чтобы его вычислить, надо сначала выполнить вызов. Доска на одну клетку полнее, вопрос тот же: «решается ли то, что осталось?»",
     "<code>solve</code> calls itself — this is the <code>if</code> condition, and to evaluate it the call must run first. The board is one cell fuller and the question is the same: \"is what remains solvable?\"");

   /* ---- вызов ②: та же программа сначала ---- */
   S(1, [0], F2, [["row","0","int"],["row < 4","true","bool"]],
     "Вложенный вызов начинает с той же первой строки: <code>row := 0</code>, <code>0 &lt; 4</code> — истина. Он ничего не помнит про [0][0] и пойдёт по доске заново.",
     "The nested call starts from the very same first line: <code>row := 0</code>, <code>0 &lt; 4</code> is true. It remembers nothing about [0][0] and will walk the board from scratch.");
   S(2, [0], F2, [["row","0","int"],["col","0","int"],["col < 4","true","bool"]],
     "<code>col := 0</code>, проверка <code>0 &lt; 4</code> — истина.",
     "<code>col := 0</code>, and the check <code>0 &lt; 4</code> is true.");
   S(3, [0], F2, [["col","0","int"],["board[row][col]","3","int"],["board[row][col] != 0","true","bool"]],
     "Теперь в [0][0] стоит тройка: <code>3 != 0</code> — истина. Клетка занята, заходим в тело <code>if</code>.",
     "Now [0][0] holds a three: <code>3 != 0</code> is true. The cell is taken, so we step into the <code>if</code> body.");
   S(4, [0], F2, [["col","0","int"]],
     "<code>continue</code>: тело до конца не доделываем, прыгаем на <code>col++</code> и проверку. Так занятые клетки и пропускаются.",
     "<code>continue</code>: we do not finish the body but jump to <code>col++</code> and the check. That is how taken cells get skipped.");
   S(2, [1], F2, [["row","0","int"],["col","1","int"],["col < 4","true","bool"]],
     "<code>col++</code> сделал <code>col</code> равным 1, проверка <code>1 &lt; 4</code> — истина.",
     "<code>col++</code> made <code>col</code> equal 1 and the check <code>1 &lt; 4</code> is true.");
   S(3, [1], F2, [["col","1","int"],["board[row][col]","2","int"],["board[row][col] != 0","true","bool"]],
     "В [0][1] стоит двойка — <code>2 != 0</code> истина, клетка занята.",
     "[0][1] holds a two — <code>2 != 0</code> is true, the cell is taken.");
   S(4, [1], F2, [["col","1","int"]],
     "Ещё один <code>continue</code>. Заполненные клетки решатель не трогает вообще.",
     "Another <code>continue</code>. The solver never touches filled cells at all.");
   S(2, [2], F2, [["row","0","int"],["col","2","int"],["col < 4","true","bool"]],
     "<code>col</code> стал 2, <code>2 &lt; 4</code> — истина.",
     "<code>col</code> became 2 and <code>2 &lt; 4</code> is true.");
   S(3, [2], F2, [["col","2","int"],["board[row][col]","0","int"],["board[row][col] != 0","false","bool"]],
     "<code>board[0][2]</code> — ноль, условие ложно: вот она, первая пустая клетка для этого вызова.",
     "<code>board[0][2]</code> is zero and the condition is false: here it is, the first empty cell for this call.");
   S(6, [2], F2, [["col","2","int"],["val","1","int"],["val <= 4","true","bool"]],
     "Цикл по цифрам стартует заново: <code>val := 1</code>, <code>1 &lt;= 4</code> — истина.",
     "The digit loop starts afresh: <code>val := 1</code>, and <code>1 &lt;= 4</code> is true.");
   S(7, [2, 10], F2, [["val","1","int"],["canPlace(...)","false","bool"]],
     "<b>false</b>: единица уже есть в столбце 2 — в клетке [2][2].",
     "<b>false</b>: a one is already in column 2, in cell [2][2].");
   S(6, [2], F2, [["col","2","int"],["val","2","int"],["val <= 4","true","bool"]],
     "<code>val</code> стал 2, проверка истинна.",
     "<code>val</code> became 2 and the check is true.");
   S(7, [1, 2], F2, [["val","2","int"],["canPlace(...)","false","bool"]],
     "<b>false</b>: двойка в строке 0, в клетке [0][1].",
     "<b>false</b>: the two is in row 0, in cell [0][1].");
   S(6, [2], F2, [["col","2","int"],["val","3","int"],["val <= 4","true","bool"]],
     "<code>val</code> стал 3, проверка истинна.",
     "<code>val</code> became 3 and the check is true.");
   S(7, [0, 2], F2, [["val","3","int"],["canPlace(...)","false","bool"]],
     "<b>false</b> — и вот это важно: тройку в строку 0 положили мы сами шагом раньше. Предположение верхнего вызова уже мешает нижнему.",
     "<b>false</b> — and this one matters: it was us who put that three into row 0 a step earlier. The guess of the upper call is already in the way of the lower one.");
   S(6, [2], F2, [["col","2","int"],["val","4","int"],["val <= 4","true","bool"]],
     "<code>val</code> стал 4, <code>4 &lt;= 4</code> — истина, последняя цифра.",
     "<code>val</code> became 4 and <code>4 &lt;= 4</code> is true — the last digit.");
   S(7, [2, 7], F2, [["val","4","int"],["canPlace(...)","false","bool"]],
     "<b>false</b>: четвёрка стоит в клетке [1][3] — это тот же квадрат 2×2 справа сверху. Строка и столбец её не видят, квадрат видит.",
     "<b>false</b>: a four sits in cell [1][3] — the same top-right 2×2 square. The row and the column do not see it, the square does.");
   S(6, [2], F2, [["col","2","int"],["val","5","int"],["val <= 4","false","bool"]],
     "<code>val</code> стал 5, проверка <code>5 &lt;= 4</code> — ложь: цифры кончились, выходим из цикла. Ни одна не подошла.",
     "<code>val</code> became 5 and the check <code>5 &lt;= 4</code> is false: the digits ran out and we leave the loop. Not one of them fitted.");
   S(15, [2], F2, [["row","0","int"],["col","2","int"]],
     "<code>return false</code> — тупик. Эта строка стоит сразу после цикла по цифрам: раз перебор дошёл до конца и ничего не поставил, клетку заполнить нечем. Вызов ② заканчивается.",
     "<code>return false</code> — a dead end. This line sits right after the digit loop: if the search ran to the end and placed nothing, there is nothing to fill the cell with. Call ② is over.");

   /* ---- возврат в ①: откат ---- */
   S(9, [0], F1, [["val","3","int"],["solve(board)","false","bool"]],
     "Управление вернулось в вызов ①, на ту же строку с <code>if</code>. Вложенный вызов дал <b>false</b>, условие ложно — <code>return true</code> внутри пропускаем. Значит, тройка была неверной.",
     "Control came back to call ①, to the same <code>if</code> line. The nested call gave <b>false</b>, the condition is false — the <code>return true</code> inside is skipped. The three was wrong, then.");
   cur[0] = ".";
   S(12, [0], F1, [["row","0","int"],["col","0","int"],["val","3","int"]],
     "<b>Откат.</b> Стёрли тройку — доска вернулась ровно в то состояние, в котором была до попытки. Без этой строки тройка осталась бы и врала бы всем следующим проверкам.",
     "<b>The undo.</b> The three is erased and the board is back exactly as it was before the attempt. Without this line the three would stay and lie to every later check.");
   S(6, [0], F1, [["row","0","int"],["col","0","int"],["val","4","int"],["val <= 4","true","bool"]],
     "Тело <code>if</code> кончилось, цикл по цифрам продолжается: <code>val++</code> дал 4, проверка <code>4 &lt;= 4</code> — истина.",
     "The <code>if</code> body ended and the digit loop carries on: <code>val++</code> gave 4 and the check <code>4 &lt;= 4</code> is true.");
   S(7, [0], F1, [["val","4","int"],["canPlace(...)","true","bool"]],
     "<b>true</b>: четвёрки нет ни в строке 0, ни в столбце 0, ни в квадрате. Пробуем.",
     "<b>true</b>: no four in row 0, none in column 0, none in the square. Let's try.");
   cur[0] = "4";
   S(8, [0], F1, [["val","4","int"]],
     "Поставили четвёрку — вторая попытка в той же клетке.",
     "The four is placed — the second attempt in the same cell.");
   S(9, [0], F2, [["val","4","int"]],
     "И снова вызываем <code>solve</code> — та же строка, тот же вопрос, другая доска.",
     "And again we call <code>solve</code> — the same line, the same question, a different board.");

   cur = ["4","2","3","1","1","3","2","4","2","4","1","3","3","1","4","2"];
   S(18, [0,2,5,8,9,12,13,14], DEEP, [],
     "Единственное место, где шаги пришлось сжать: между этим шагом и предыдущим программа прошла по тем же самым строкам ещё несколько сотен раз — семь оставшихся пустых клеток, и ни одна не завела в новый тупик. Всего вызовов <code>solve</code> получилось десять, глубина — девять. Самый глубокий вызов не нашёл ни одной пустой клетки: оба цикла дошли до конца, и выполнилась последняя строка функции — <code>return true</code>.",
     "The one place where steps had to be squeezed: between this step and the previous one the program walked those very same lines a few hundred more times — seven remaining empty cells, and not one of them led into a new dead end. Ten calls to <code>solve</code> in total, nine deep. The deepest call found no empty cell at all: both loops ran to the end and the last line of the function executed — <code>return true</code>.");
   S(9, [0], F1, [["val","4","int"],["solve(board)","true","bool"]],
     "<code>true</code> вернулось в вызов ①, на ту же строку с <code>if</code>. На этот раз условие истинно — заходим в тело.",
     "The <code>true</code> came back to call ①, to the same <code>if</code> line. This time the condition holds and we step into the body.");
   S(10, [0], F1, [["val","4","int"]],
     "<code>return true</code>. Ответ уходит наверх, в <code>main</code>, и доска остаётся решённой — она всё это время менялась через указатель, а не в копии.",
     "<code>return true</code>. The answer travels up to <code>main</code> and the board stays solved — all this time it was changed through the pointer, not in a copy.");
   return st;
 }
},

{
 name:{ru:"Копия или указатель", en:"Copy or pointer"},
 code:[
  "func fillCopy(board [2][2]int) {",
  "\tboard[0][0] = 9",
  "}",
  "",
  "func fillReal(board *[2][2]int) {",
  "\tboard[0][0] = 9",
  "}",
  "",
  "func main() {",
  "\tb := [2][2]int{{1, 2}, {3, 4}}",
  "\tfillCopy(b)",
  "\tfmt.Println(b)",
  "\tfillReal(&b)",
  "\tfmt.Println(b)",
  "}"
 ],
 steps:[
  {line:9, vars:[["b","[[1 2] [3 4]]","[2][2]int"]], out:"",
   stack:["main()"], cells:["1","2","3","4"], cellsTitle:{ru:"b — оригинал, индекс = row×2+col", en:"b — the original, index = row×2 + col"},
   note:{ru:"Первая выполненная строка программы. Создали маленькую доску 2×2. Всё, что дальше произойдёт с ней, произойдёт и с доской 9×9 — размер ничего не меняет.",
         en:"The first line of the program that runs. A small 2×2 board is created. Whatever happens to it next happens to a 9×9 board too — the size changes nothing."}},
  {line:10, vars:[["b","[[1 2] [3 4]]","[2][2]int"]], out:"",
   stack:["main()","fillCopy(b)"], cells:["1","2","3","4"], cellsOn:[0], cellsTitle:{ru:"Копия внутри fillCopy: пока те же числа", en:"The copy inside fillCopy: same numbers so far"},
   note:{ru:"Строка вызова. Тип параметра — <code>[2][2]int</code> без звёздочки, значит в функцию уезжает <b>копия</b> всего массива. Следующим шагом выполнится первая строка тела <code>fillCopy</code>.",
         en:"The call line. The parameter type is <code>[2][2]int</code> with no star, so a <b>copy</b> of the whole array travels into the function. The next step runs the first line of the <code>fillCopy</code> body."}},
  {line:1, vars:[["b","[[1 2] [3 4]]","[2][2]int"],["board","[[9 2] [3 4]]","[2][2]int (копия)"]], out:"",
   stack:["main()","fillCopy(b)"], cells:["9","2","3","4"], cellsOn:[0], cellsTitle:{ru:"board — копия внутри fillCopy", en:"board — the copy inside fillCopy"},
   note:{ru:"Тело функции, одна-единственная строка. Девятка легла на место — но легла она в <code>board</code>, в копию. У <code>b</code> по-прежнему единица.",
         en:"The body of the function, a single line. The nine landed in place — but it landed in <code>board</code>, the copy. <code>b</code> still holds a one."}},
  {line:11, vars:[["b","[[1 2] [3 4]]","[2][2]int"]], out:"[[1 2] [3 4]]\n",
   stack:["main()"], cells:["1","2","3","4"], cellsOn:[0], cellsTitle:{ru:"b — оригинал, копия исчезла", en:"b — the original, the copy is gone"},
   note:{ru:"Тело кончилось, управление вернулось в <code>main</code> на следующую строку, а копия исчезла вместе с девяткой. Печать показывает исходные числа. Ошибки нет, предупреждения нет — просто ничего не поменялось.",
         en:"The body ended, control returned to <code>main</code> on the next line, and the copy vanished, nine and all. The print shows the original numbers. No error, no warning — simply nothing changed."}},
  {line:12, vars:[["b","[[1 2] [3 4]]","[2][2]int"]], out:"[[1 2] [3 4]]\n",
   stack:["main()","fillReal(&b)"], cells:["1","2","3","4"], cellsOn:[0], cellsTitle:{ru:"b — оригинал, в функцию уехал адрес", en:"b — the original, an address went into the function"},
   note:{ru:"Второй вызов отличается двумя знаками: <code>&amp;</code> при передаче и <code>*</code> в типе. Теперь в функцию уезжает адрес, а не копия.",
         en:"The second call differs by two symbols: <code>&amp;</code> at the call and <code>*</code> in the type. Now an address travels into the function, not a copy."}},
  {line:5, vars:[["b","[[9 2] [3 4]]","[2][2]int"],["board","→ b","*[2][2]int"]], out:"[[1 2] [3 4]]\n",
   stack:["main()","fillReal(&b)"], cells:["9","2","3","4"], cellsOn:[0], cellsTitle:{ru:"b через указатель board", en:"b through the pointer board"},
   note:{ru:"Первая строка тела <code>fillReal</code> написана точно так же — <code>board[0][0] = 9</code>. Но меняется теперь та самая доска, а не копия.",
         en:"The first line of the <code>fillReal</code> body is written exactly the same — <code>board[0][0] = 9</code>. But now it changes the board itself, not a copy."}},
  {line:13, vars:[["b","[[9 2] [3 4]]","[2][2]int"]], out:"[[1 2] [3 4]]\n[[9 2] [3 4]]\n",
   stack:["main()"], cells:["9","2","3","4"], cellsOn:[0], cellsTitle:{ru:"b — оригинал, девятка осталась", en:"b — the original, the nine stayed"},
   note:{ru:"Вернулись в <code>main</code>, печатаем ту же переменную второй раз. Две строки вывода из двух почти одинаковых вызовов. Ровно поэтому решатель принимает <code>*[9][9]int</code>: иначе решённая доска исчезла бы вместе с копией.",
         en:"Back in <code>main</code>, printing the same variable a second time. Two lines of output from two nearly identical calls. This is exactly why the solver takes <code>*[9][9]int</code>: otherwise the solved board would vanish along with the copy."}}
 ]
}
];

/* ================= СБОРКА КАРТИНЫ ================= */
var OUTRO = {
ru:`<p>Сто двадцать строк, и в них всего две новые мысли. Всё остальное — знакомый обход по клеткам из темы про рамку.</p>
<p><strong>Первая мысль — откат.</strong> Когда ответ в клетке заранее неизвестен, его перебирают: поставил, пошёл дальше, упёрся — стёр и пробуешь следующее. Строка со стиранием так же важна, как строка с постановкой, хотя выглядит лишней.</p>
<p><strong>Вторая — указатель.</strong> Массив в Go передаётся копией, поэтому функция, меняющая доску, обязана получить на неё указатель. Иначе решённая доска исчезнет вместе с копией, а программа при этом соберётся и запустится.</p>
<p>И третья вещь, которая не про язык, а про то, как вообще писать программы длиннее экрана: <strong>одна функция — одна работа</strong>. Правила судоку записаны ровно в одном месте, проверка входа отделена от решения, печать не знает ничего о переборе. Именно поэтому программу можно объяснить кусками — и именно поэтому её удаётся починить, когда что-то ломается.</p>
<p>Проверить себя просто: возьми любую из пяти функций и скажи одним предложением, что она делает. Если предложение получается с союзом «и» — работы смешаны.</p>`,
en:`<p>A hundred and twenty lines, and only two new ideas in them. Everything else is the familiar cell walk from the frame topic.</p>
<p><strong>The first idea is backtracking.</strong> When the answer in a cell is not known upfront, it is searched for: place it, go deeper, hit a wall — erase it and try the next. The erasing line matters as much as the placing line, although it looks redundant.</p>
<p><strong>The second is the pointer.</strong> An array in Go is passed as a copy, so a function that changes the board must receive a pointer to it. Otherwise the solved board vanishes with the copy — and the program still compiles and runs.</p>
<p>And a third thing, not about the language but about writing programs longer than a screen: <strong>one function, one job</strong>. The rules of sudoku are written in exactly one place, the input check is separate from solving, and printing knows nothing about the search. That is why the program can be explained in pieces — and why it can be fixed when something breaks.</p>
<p>An easy self-test: take any of the five functions and say in one sentence what it does. If the sentence needs an "and", the jobs are blurred.</p>`
};
