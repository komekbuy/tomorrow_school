var META = {
  n: 6,
  slug: "06-slices",
  eyebrow:{ru:"Go с нуля · тема 6 из 13", en:"Go from zero · topic 6 of 13"},
  title:  {ru:"Слайсы", en:"Slices"},
  lede:{
    ru:"Список, длина которого заранее неизвестна, в Go хранят только так. Пока не ясно, почему <code>append</code> надо присваивать обратно и почему правка копии портит оригинал, любая задача со списком чисел решается наугад.",
    en:"A list whose length isn't known in advance is stored exactly one way in Go. Until it's clear why <code>append</code> must be assigned back and why editing a copy damages the original, any task with a list of numbers is guesswork."
  },
  video:{url:"https://www.youtube.com/watch?v=dpvRDJjUJf8&t=35701s",
    t:{ru:"Курс по Go — глава «Массивы, слайсы, мапы» (9:55:01)", en:"Go course — the “Arrays, slices, maps” chapter (9:55:01)"},
    d:{ru:"Ровно наша тема, плюс мапы сверху.", en:"Exactly this topic, plus maps on top."}},
  folder: "slice1",
  txt: {ru:"go-tema-06-slaysy.txt", en:"go-topic-06-slices.txt"}
};

/* ================= ВВЕДЕНИЕ ================= */
var INTRO = {
 ru:`<p>До этого момента каждое значение жило в отдельной переменной: одно число — одно имя. Пока чисел три, это работает. Как только их становится сто, или, что хуже, заранее непонятно сколько — пять или пятьсот, — имён не напасёшься. Слайс это одно имя, под которым лежит сколько угодно значений одного типа, и обращаешься ты к ним не по имени, а по номеру.</p>
<p>Смотри, что происходит без него. Нужно накопить числа, а сколько их будет — выяснится только при запуске программы:</p>
<pre><code>n1 := 10
n2 := 20
n3 := 30    <span class="cm">// а если их окажется сто?</span></code></pre>
<p>Дальше идти некуда. Количество переменных надо написать буквами в тексте программы, а оно неизвестно, пока программа не запустилась. Со слайсом этого вопроса нет: значения кладут в одну переменную, и она растёт.</p>
<pre><code>nums := []int{10, 20, 30}
nums = append(nums, 40)
fmt.Println(nums, len(nums))   <span class="cm">// [10 20 30 40] 4</span></code></pre>
<p>Освоив тему, ты сможешь держать список неизвестной длины, наращивать его в цикле, брать из него куски, проходить по нему и отдавать в функцию — заранее понимая, что вызвавший код увидит, а что нет.</p>
<p>Разбор идёт от типа вглубь, к памяти. Сначала — чем слайс отличается от массива: это выбор, который делаешь в первой же строке. Потом — как слайс создать и как в него добавлять; тут же вылезет странное правило про <code>append</code>, который надо присваивать обратно. Объяснить это правило можно только одним способом — заглянув под слайс, туда, где лежат сами числа: отсюда <code>len</code> и <code>cap</code>. Дальше всё выводится само. Раз данные лежат одним непрерывным куском — можно взять его часть. Раз к элементам ходят по номеру — надо знать границы. Раз переменная хранит адрес, а не данные — правка внутри функции видна снаружи. Последнее правило собирает это в одну картину.</p>`,
 en:`<p>Up to now every value lived in its own variable: one number, one name. With three numbers that works. Once there are a hundred — or worse, you don't know upfront whether it's five or five hundred — you run out of names. A slice is one name holding any number of values of the same type, reached not by name but by number.</p>
<p>Look at what happens without one. You need to collect numbers, and how many there will be is only settled once the program runs:</p>
<pre><code>n1 := 10
n2 := 20
n3 := 30    <span class="cm">// and if there turn out to be a hundred?</span></code></pre>
<p>There is nowhere to go from here. The number of variables has to be spelled out in the text of the program, and it isn't known until the program starts. With a slice the question disappears: values go into one variable, and it grows.</p>
<pre><code>nums := []int{10, 20, 30}
nums = append(nums, 40)
fmt.Println(nums, len(nums))   <span class="cm">// [10 20 30 40] 4</span></code></pre>
<p>Once this topic is yours you can hold a list of unknown length, grow it in a loop, take pieces out of it, walk it, and hand it to a function knowing in advance what the calling code will see and what it won't.</p>
<p>The walkthrough goes from the type inwards, down to memory. First, how a slice differs from an array — that's the choice you make on the very first line. Then how to create one and how to add to it; that's where the odd rule about assigning <code>append</code> back shows up. There is only one way to explain that rule: look underneath the slice, at the place the numbers actually sit — which gives you <code>len</code> and <code>cap</code>. Everything after that follows on its own. Since the data sits in one continuous block, you can take part of it. Since elements are reached by number, you need to know the bounds. Since the variable holds an address rather than the data, an edit inside a function is visible outside. The last rule pulls all of it into one picture.</p>`
};

/* ================= ПРАВИЛА ================= */
var RULES = [
{
 h:{ru:"У массива размер в типе, у слайса — нет",
    en:"An array carries its size in the type, a slice does not"},
 b:{ru:`<p>Список в Go записывают двумя способами, и отличаются они одним символом. Смотри на квадратные скобки: есть число внутри — массив, пусто — слайс.</p>
<pre><code>arr := [3]int{10, 20, 30}   <span class="cm">// массив, тип [3]int</span>
sl  := []int{10, 20, 30}    <span class="cm">// слайс,  тип []int</span></code></pre>
<p>Разница тут не в оформлении. У массива размер — часть типа. Компилятор знает про <code>[3]int</code>, что это ровно три целых числа подряд, то есть значение известной величины. <code>[4]int</code> для него уже другой тип: другое количество, другая величина. Отсюда следует главное: массив нельзя удлинить. Удлинить значит поменять тип, а тип переменной в Go задан навсегда.</p>
<pre><code>arr = append(arr, 40)   <span class="cm">// не соберётся: argument must be a slice</span>
sl  = append(sl, 40)    <span class="cm">// работает</span></code></pre>
<p>По той же причине функция, которая ждёт <code>[3]int</code>, не примет <code>[4]int</code>. Это для неё чужой тип, и «ну почти подходит» тут не бывает. У слайса такой проблемы нет вовсе: тип <code>[]int</code> один на любую длину, поэтому одна функция работает и с тремя элементами, и с тысячей.</p>
<p>Что у них общего: содержимое менять можно у обоих. <code>arr[0] = 99</code> и <code>sl[0] = 99</code> ведут себя одинаково. Фиксировано только <em>количество</em>, а не значения.</p>
<p>Дальше в теме массивов почти не будет. Как только количество заранее неизвестно, выбора нет — берут слайс. Массив остаётся для редкого случая, когда элементов ровно столько, сколько сейчас, и столько же будет всегда.</p>`,
    en:`<p>Go writes a list in two ways, and they differ by a single character. Look at the square brackets: a number inside means an array, empty means a slice.</p>
<pre><code>arr := [3]int{10, 20, 30}   <span class="cm">// array, type [3]int</span>
sl  := []int{10, 20, 30}    <span class="cm">// slice, type []int</span></code></pre>
<p>The difference isn't cosmetic. An array's size is part of its type. The compiler knows that <code>[3]int</code> is exactly three integers in a row — a value of a known size. To it, <code>[4]int</code> is already a different type: different count, different size. From which the main point follows: an array cannot be lengthened. Lengthening it would mean changing its type, and a variable's type in Go is fixed for good.</p>
<pre><code>arr = append(arr, 40)   <span class="cm">// won't compile: argument must be a slice</span>
sl  = append(sl, 40)    <span class="cm">// works</span></code></pre>
<p>For the same reason a function expecting <code>[3]int</code> won't take <code>[4]int</code>. That's a foreign type to it, and there is no "close enough" here. A slice has no such problem: the type <code>[]int</code> is the same for any length, so one function handles three elements and a thousand alike.</p>
<p>What they share: contents can be changed in both. <code>arr[0] = 99</code> and <code>sl[0] = 99</code> behave the same. Only the <em>count</em> is fixed, not the values.</p>
<p>Arrays barely appear again in this topic. The moment the count isn't known upfront there is no choice — you take a slice. An array is left for the rare case where there are exactly as many elements as there are now, and there always will be.</p>`}
},
{
 h:{ru:"Три записи создания — под три разные ситуации", en:"Three ways to create one — for three different situations"},
 b:{ru:`<p>Раз количество не записано в типе, его надо как-то задать при создании. Записей три, и выбирают между ними не по вкусу, а по тому, что ты собираешься делать со слайсом дальше.</p>
<pre><code>var a []int           <span class="cm">// [] len 0 cap 0, и a == nil</span>
b := []int{10, 20}    <span class="cm">// сразу со значениями</span>
c := make([]int, 3)   <span class="cm">// [0 0 0] — три нуля</span></code></pre>
<p><code>var a []int</code> — когда значений пока нет и они будут появляться по одному в цикле. Такой слайс равен <code>nil</code>: заголовок переменной есть, а куска памяти под ним ещё нет. Работать с ним всё равно можно — добавлять разрешено, перебирать циклом разрешено. Нельзя одно: писать по индексу, потому что ячеек не существует.</p>
<p><code>[]int{10, 20}</code> — когда значения известны прямо сейчас, в тексте программы.</p>
<p><code>make([]int, 3)</code> — когда нужно ровно <code>n</code> ячеек и заполнять ты их будешь по индексу, <code>c[0] = ...</code>. Ячейки уже существуют и заполнены нулями, писать в них можно сразу.</p>
<p>У <code>make</code> есть третий, необязательный аргумент — запас места:</p>
<pre><code>d := make([]int, 0, 5)   <span class="cm">// len 0, cap 5 — пустой, но место под 5 уже есть</span></code></pre>
<p>Разница между <code>make([]int, 3)</code> и <code>make([]int, 0, 3)</code> огромная, хотя записи почти одинаковые. В первом уже лежат три нуля, и добавление положит число четвёртым. Второй пуст, и добавление положит число первым. Перепутаешь — получишь <code>[0 0 0 1]</code> вместо <code>[1]</code>, причём молча: ошибки не будет, будет неверный результат.</p>
<p>Зачем нужен этот запас, станет понятно через два правила, когда дойдём до <code>cap</code>. Пока держи в голове только форму записи и то, что <code>make([]int, 5)</code> — это уже пять чисел, а не пустое место под пять.</p>`,
    en:`<p>Since the count isn't written in the type, it has to be set somehow at creation. There are three forms, and you pick between them not by taste but by what you intend to do with the slice next.</p>
<pre><code>var a []int           <span class="cm">// [] len 0 cap 0, and a == nil</span>
b := []int{10, 20}    <span class="cm">// with values right away</span>
c := make([]int, 3)   <span class="cm">// [0 0 0] — three zeros</span></code></pre>
<p><code>var a []int</code> — for when there are no values yet and they will arrive one at a time in a loop. Such a slice equals <code>nil</code>: the variable's header exists, but there is no memory block under it yet. You can still work with it — appending is allowed, looping over it is allowed. Only one thing is not: writing by index, because no cells exist.</p>
<p><code>[]int{10, 20}</code> — for when the values are known right now, in the text of the program.</p>
<p><code>make([]int, 3)</code> — for when you need exactly <code>n</code> cells and will fill them by index, <code>c[0] = ...</code>. The cells already exist and hold zeros, so you can write into them immediately.</p>
<p><code>make</code> takes an optional third argument — reserved room:</p>
<pre><code>d := make([]int, 0, 5)   <span class="cm">// len 0, cap 5 — empty, but room for 5 is ready</span></code></pre>
<p>The gap between <code>make([]int, 3)</code> and <code>make([]int, 0, 3)</code> is huge, even though the two forms look alike. The first already holds three zeros, so an append puts your number fourth. The second is empty, so an append puts it first. Mix them up and you get <code>[0 0 0 1]</code> instead of <code>[1]</code> — silently: no error, just a wrong result.</p>
<p>Why that reserved room exists becomes clear two rules from here, once we reach <code>cap</code>. For now keep only the form in mind, plus the fact that <code>make([]int, 5)</code> is already five numbers, not empty room for five.</p>`}
},
{
 h:{ru:"<code>append</code> возвращает новый слайс — присваивай обратно",
    en:"<code>append</code> returns a new slice — assign it back"},
 b:{ru:`<p>Слайс, созданный через <code>var</code>, пуст, а расти он как-то должен. Растит его одна встроенная функция — <code>append</code>. И у неё правило, на котором спотыкаются все: <strong><code>append</code> ничего не меняет в том слайсе, который ты ему дал.</strong> Он <strong>возвращает результат</strong>, и его надо куда-то положить.</p>
<pre><code>a = append(a, 40)          <span class="cm">// так</span>
append(a, 40)              <span class="cm">// не соберётся: value is not used</span></code></pre>
<p>Вторая строка не просто бесполезна — она не компилируется. Go не даёт вычислить значение и выбросить: раз ты позвал функцию ради результата, результат должен быть использован. Дословно ошибка звучит как <code>append(a, 40) (value of type []int) is not used</code> и означает ровно это.</p>
<p>За один вызов можно добавить несколько значений, а тремя точками — целый слайс:</p>
<pre><code>a = append(a, 40, 50, 60)
a = append(a, b...)        <span class="cm">// приклеили b целиком</span></code></pre>
<p>Присваивать не обязательно в ту же переменную. Положишь результат в другую — исходная останется прежней:</p>
<pre><code>a := []int{1, 2, 3}
b := append(a, 4)
fmt.Println(a, b)          <span class="cm">// [1 2 3] [1 2 3 4]</span></code></pre>
<p>Это тот же самый факт с другой стороны: в <code>a</code> ничего не добавилось, потому что <code>append</code> его и не трогал. Осталось понять, почему функция устроена так, а не меняет слайс на месте. Ответ — в следующем правиле.</p>`,
    en:`<p>A slice made with <code>var</code> is empty, and it has to grow somehow. One built-in function grows it — <code>append</code>. And it comes with the rule everyone trips over: <strong><code>append</code> changes nothing in the slice you hand it.</strong> It <strong>returns a result</strong>, and that result has to go somewhere.</p>
<pre><code>a = append(a, 40)          <span class="cm">// this</span>
append(a, 40)              <span class="cm">// won't compile: value is not used</span></code></pre>
<p>The second line isn't merely useless — it doesn't compile. Go won't let you compute a value and throw it away: if you called a function for its result, the result has to be used. The error reads <code>append(a, 40) (value of type []int) is not used</code>, and it means exactly that.</p>
<p>One call can add several values, and with three dots — a whole slice:</p>
<pre><code>a = append(a, 40, 50, 60)
a = append(a, b...)        <span class="cm">// glued b on as a whole</span></code></pre>
<p>The assignment need not go back into the same variable. Put the result elsewhere and the original stays as it was:</p>
<pre><code>a := []int{1, 2, 3}
b := append(a, 4)
fmt.Println(a, b)          <span class="cm">// [1 2 3] [1 2 3 4]</span></code></pre>
<p>That's the same fact from the other side: nothing was added to <code>a</code> because <code>append</code> never touched it. What's left is why the function is built this way instead of changing the slice in place. The next rule answers that.</p>`}
},
{
 h:{ru:"<code>len</code> — сколько элементов есть, <code>cap</code> — сколько влезет без переезда",
    en:"<code>len</code> is how many there are, <code>cap</code> is how many fit before a move"},
 b:{ru:`<p>Ответ на «почему <code>append</code> возвращает результат» лежит уровнем ниже — там, где хранятся сами числа.</p>
<p>Под слайсом всегда есть непрерывный кусок памяти фиксированного размера, а переменная держит про него два числа. <code>len</code> — сколько ячеек занято. <code>cap</code> — сколько ячеек выделено всего.</p>
<pre><code>a := []int{10, 20, 30}
fmt.Println(len(a), cap(a))   <span class="cm">// 3 3</span>

a = append(a, 40)
fmt.Println(len(a), cap(a))   <span class="cm">// 4 6 — места не было, Go выделил новый кусок</span></code></pre>
<p>Пока <code>len</code> меньше <code>cap</code>, <code>append</code> просто занимает следующую свободную ячейку. Когда <code>len</code> упирается в <code>cap</code>, свободных ячеек нет, а растянуть кусок на месте невозможно: сразу за ним в памяти уже может лежать что-то чужое. Поэтому Go выделяет новый кусок побольше, переносит туда все элементы и возвращает слайс, смотрящий уже на новый адрес.</p>
<p>Вот и причина правила из прошлого пункта. После <code>append</code> на руках может оказаться слайс, указывающий на другое место памяти, а старая переменная про переезд ничего не знает. Не присвоишь результат обратно — останешься со старым куском и старой длиной.</p>
<p>Запас берётся не наугад: при переезде размер примерно удваивается, поэтому <code>cap</code> растёт скачками 1, 2, 4, 8. Выделять память заново под каждый элемент было бы слишком дорого, а так переезды случаются всё реже.</p>
<p>В коде ты почти всегда работаешь с <code>len</code>. <code>cap</code> нужен, чтобы понимать два неочевидных эффекта: скачки числа при добавлении и то, что после переезда два слайса перестают делить данные — до этого дойдём в последних двух правилах.</p>
<p><strong>И главное ограничение: по индексу ходят только в пределах <code>len</code>.</strong> У <code>make([]int, 0, 5)</code> выделено пять ячеек, но <code>a[0]</code> уронит программу — занятых пока ноль, а <code>cap</code> тут никого не спасает.</p>`,
    en:`<p>The answer to "why does <code>append</code> return a result" sits one level down — where the numbers themselves are kept.</p>
<p>Underneath a slice there is always a contiguous block of memory of a fixed size, and the variable keeps two numbers about it. <code>len</code> — how many cells are taken. <code>cap</code> — how many cells were allocated in total.</p>
<pre><code>a := []int{10, 20, 30}
fmt.Println(len(a), cap(a))   <span class="cm">// 3 3</span>

a = append(a, 40)
fmt.Println(len(a), cap(a))   <span class="cm">// 4 6 — no room left, Go allocated a new block</span></code></pre>
<p>While <code>len</code> is below <code>cap</code>, <code>append</code> simply takes the next free cell. When <code>len</code> hits <code>cap</code>, there are no free cells, and the block can't be stretched where it is: something else may already sit right behind it in memory. So Go allocates a bigger block, moves every element there and returns a slice pointing at the new address.</p>
<p>There's the reason for the previous rule. After an <code>append</code> you may be holding a slice that points somewhere else in memory, while the old variable knows nothing about the move. Don't assign the result back and you are left with the old block and the old length.</p>
<p>The spare room isn't arbitrary: on a move the size roughly doubles, which is why <code>cap</code> grows in jumps of 1, 2, 4, 8. Allocating memory again for every single element would be far too expensive; this way moves get rarer and rarer.</p>
<p>In code you almost always work with <code>len</code>. <code>cap</code> is there to explain two non-obvious effects: the jumping number on an append, and the fact that after a move two slices stop sharing data — we get to that in the last two rules.</p>
<p><strong>And the key limit: indexing stays within <code>len</code>.</strong> <code>make([]int, 0, 5)</code> has five cells allocated, yet <code>a[0]</code> crashes the program — zero are taken so far, and <code>cap</code> saves nobody here.</p>`}
},
{
 h:{ru:"Срез <code>a[1:3]</code>: левая граница включается, правая нет",
    en:"Slicing <code>a[1:3]</code>: the left bound is included, the right one is not"},
 b:{ru:`<p>Раз элементы лежат в памяти подряд, одним куском, то часть этого куска — тоже готовый слайс. Взять её можно двоеточием.</p>
<pre><code>a := []int{10, 20, 30, 40, 50}
a[1:3]   <span class="cm">// [20 30] — индексы 1 и 2, третий не входит</span></code></pre>
<p>Первое число — с какого индекса начать, второе — до какого <strong>не доходя</strong>. Сделано так ради счёта: длина куска всегда равна <code>конец - начало</code>, без поправок на единицу. У <code>a[1:3]</code> это 3−1 = 2 элемента. И границы соседних кусков совпадают: <code>a[:2]</code> и <code>a[2:]</code> вместе дают весь слайс, ничего не потеряв и не задвоив.</p>
<p>Любую границу можно не писать — подставится край:</p>
<pre><code>a[:3]    <span class="cm">// [10 20 30]  с начала</span>
a[2:]    <span class="cm">// [30 40 50]  до конца</span>
a[:]     <span class="cm">// весь слайс целиком</span>
a[2:2]   <span class="cm">// [] пусто, когда границы совпали</span></code></pre>
<p>Тут всплывает прошлое правило про границы. По индексу за <code>len</code> выходить нельзя, а срез может доходить до <code>cap</code>: он не читает ячейку, а только отмечает, где кусок кончается. Поэтому <code>a[len(a):]</code> — законная пустота, а <code>a[len(a)]</code> уронит программу.</p>
<p><strong>Срез не копирует данные.</strong> Он возвращает слайс, смотрящий в тот же кусок памяти, просто с другого места и с другой длиной:</p>
<pre><code>b := a[1:3]
b[0] = 99
fmt.Println(a)   <span class="cm">// [10 99 30 40 50] — изменился и a</span></code></pre>
<p>Компилятор на такое ничего не скажет: с его точки зрения всё законно. Это первый случай в теме, когда правка одной переменной меняет другую. Второй, и главный, — в последнем правиле.</p>`,
    en:`<p>Since the elements lie in memory one after another, in a single block, a part of that block is a ready-made slice too. You take it with a colon.</p>
<pre><code>a := []int{10, 20, 30, 40, 50}
a[1:3]   <span class="cm">// [20 30] — indices 1 and 2; the third is out</span></code></pre>
<p>The first number is where to start, the second is where to stop <strong>without reaching it</strong>. It works that way to keep counting simple: the length of a piece is always <code>end - start</code>, with no off-by-one corrections. For <code>a[1:3]</code> that's 3−1 = 2 elements. And the bounds of neighbouring pieces meet exactly: <code>a[:2]</code> and <code>a[2:]</code> together give the whole slice, nothing lost, nothing doubled.</p>
<p>Either bound can be left out — the edge fills in:</p>
<pre><code>a[:3]    <span class="cm">// [10 20 30]  from the start</span>
a[2:]    <span class="cm">// [30 40 50]  to the end</span>
a[:]     <span class="cm">// the whole slice</span>
a[2:2]   <span class="cm">// [] empty when the bounds meet</span></code></pre>
<p>Here the previous rule about bounds resurfaces. Indexing may not go past <code>len</code>, but slicing may reach <code>cap</code>: it doesn't read a cell, it only marks where the piece ends. So <code>a[len(a):]</code> is a legal empty slice, while <code>a[len(a)]</code> crashes the program.</p>
<p><strong>Slicing does not copy data.</strong> It returns a slice looking into the same memory block, just from a different spot and with a different length:</p>
<pre><code>b := a[1:3]
b[0] = 99
fmt.Println(a)   <span class="cm">// [10 99 30 40 50] — a changed as well</span></code></pre>
<p>The compiler has nothing to say about it: as far as it's concerned this is all legal. It's the first case in this topic where editing one variable changes another. The second, and the big one, is in the last rule.</p>`}
},
{
 h:{ru:"Перебор: по индексу или через <code>range</code>", en:"Iterating: by index or with <code>range</code>"},
 b:{ru:`<p>Слайс собрали, куски научились брать — осталось пройти по элементам. Сложить, найти нужный, умножить каждый: всё это перебор. Записей две.</p>
<pre><code>for i := 0; i &lt; len(a); i++ {
	fmt.Println(i, a[i])
}

for i, v := range a {
	fmt.Println(i, v)
}</code></pre>
<p>Оба цикла делают одно и то же. Первый идёт по числам от нуля до <code>len(a)-1</code> — граница берётся из правила про <code>len</code>, и знак «строго меньше» тут принципиален: напишешь <code>i &lt;= len(a)</code> — последний шаг попадёт в несуществующую ячейку и программа упадёт. Второй считает границу сам и промахнуться не даёт.</p>
<p>Разница между ними одна, зато важная: <code>v</code> в <code>range</code> — это <strong>копия</strong> элемента, новая на каждом шаге. Присвоить в неё Go разрешает, но в слайсе от этого ничего не изменится.</p>
<pre><code>for _, v := range a {
	v = v * 10          <span class="cm">// слайс не поменялся</span>
}

for i := range a {
	a[i] = a[i] * 10    <span class="cm">// а вот так поменялся</span>
}</code></pre>
<p>Во втором цикле <code>v</code> не берут вовсе: нужна не копия значения, а номер, чтобы записать по нему прямо в слайс. Первый вариант компилятор не ловит — код собирается и работает, просто ничего не делает. Ошибка выглядит как «цикл почему-то не сработал».</p>
<p>Правило простое: <strong>читаешь — бери <code>v</code>, пишешь — иди через <code>a[i]</code>.</strong></p>
<p>И удобная мелочь: цикл по <code>nil</code>-слайсу не сделает ни шага и не упадёт — он идёт по <code>len</code>, а тот равен нулю. Проверять «а не пустой ли он» перед циклом не нужно.</p>`,
    en:`<p>The slice is built and pieces can be taken — what's left is walking the elements. Summing, finding one, multiplying each: that's all iteration. There are two forms.</p>
<pre><code>for i := 0; i &lt; len(a); i++ {
	fmt.Println(i, a[i])
}

for i, v := range a {
	fmt.Println(i, v)
}</code></pre>
<p>Both loops do the same thing. The first walks the numbers from zero to <code>len(a)-1</code> — the bound comes from the <code>len</code> rule, and the strict "less than" matters: write <code>i &lt;= len(a)</code> and the final step reaches a cell that doesn't exist, crashing the program. The second works the bound out itself and leaves no room to miss.</p>
<p>They differ in one way, and it matters: <code>v</code> in a <code>range</code> is a <strong>copy</strong> of the element, made fresh on every step. Go lets you assign to it, but nothing in the slice changes.</p>
<pre><code>for _, v := range a {
	v = v * 10          <span class="cm">// the slice is untouched</span>
}

for i := range a {
	a[i] = a[i] * 10    <span class="cm">// this one changes it</span>
}</code></pre>
<p>The second loop doesn't take <code>v</code> at all: what's needed isn't a copy of the value but the number, so the write lands in the slice itself. The compiler doesn't catch the first version — the code builds and runs, it just does nothing. The bug looks like "the loop didn't fire for some reason".</p>
<p>Simple rule: <strong>reading — take <code>v</code>; writing — go through <code>a[i]</code>.</strong></p>
<p>One handy detail: a loop over a <code>nil</code> slice takes no steps and doesn't crash — it follows <code>len</code>, and that is zero. No need to check for emptiness before the loop.</p>`}
},
{
 h:{ru:"Слайс передаётся заголовком: элементы общие, длина — нет",
    en:"A slice is passed as a header: elements are shared, the length is not"},
 b:{ru:`<p>Осталось назвать вслух то, что уже дважды мелькало: <code>append</code>, который возвращает результат вместо правки на месте, и срез, который делит память с оригиналом. Причина у обоих одна.</p>
<p>Переменная-слайс хранит не сами числа, а три поля: адрес куска памяти, <code>len</code> и <code>cap</code>. Это и называется заголовком. При <code>b := a</code> и при передаче в функцию копируются ровно эти три поля. Данные не копируются никогда.</p>
<p>Отсюда два разных поведения, которые постоянно путают:</p>
<pre><code>func setFirst(s []int) { s[0] = 99 }       <span class="cm">// видно снаружи</span>
func addItem(s []int)  { s = append(s, 40) } <span class="cm">// снаружи НЕ видно</span></code></pre>
<p><code>s[0] = 99</code> — это запись по адресу, а адрес в копии тот же самый. Функция пишет в тот кусок памяти, который читает вызвавший код, поэтому изменение видят оба.</p>
<p><code>s = append(s, 40)</code> — это запись в поле <code>len</code>, а поле у копии своё. Функция закончилась, копия исчезла вместе с новой длиной. Внутри слайс печатался четырьмя элементами, снаружи остался тремя.</p>
<p>Чинится единственным способом — вернуть результат:</p>
<pre><code>func addItem(s []int) []int { return append(s, 40) }
a = addItem(a)</code></pre>
<p>То же самое объясняет и обычное присваивание. <code>b := a</code> копирует заголовок, а не данные, поэтому правка <code>b[0]</code> портит <code>a</code>. Настоящая копия делается в два шага: выделить свой кусок и перенести в него значения.</p>
<pre><code>c := make([]int, len(a))
copy(c, a)     <span class="cm">// теперь c живёт отдельно</span></code></pre>
<p><code>copy</code> переносит столько элементов, сколько поместится в приёмник, и о нехватке места не сообщает. Забудешь <code>make</code> нужной длины — <code>copy</code> в <code>nil</code>-слайс перенесёт ноль элементов, и не пожалуется ни компилятор, ни запуск. Слайс просто останется пустым, а данные потеряются молча.</p>`,
    en:`<p>What's left is to say out loud what has already surfaced twice: <code>append</code>, which returns a result instead of editing in place, and slicing, which shares memory with the original. Both have the same cause.</p>
<p>A slice variable holds not the numbers themselves but three fields: the address of a memory block, <code>len</code> and <code>cap</code>. That's the header. <code>b := a</code> and passing to a function copy exactly those three fields. The data is never copied.</p>
<p>Hence two different behaviours that constantly get mixed up:</p>
<pre><code>func setFirst(s []int) { s[0] = 99 }         <span class="cm">// visible outside</span>
func addItem(s []int)  { s = append(s, 40) } <span class="cm">// NOT visible outside</span></code></pre>
<p><code>s[0] = 99</code> is a write through the address, and the address in the copy is the same one. The function writes into the very block the calling code reads from, so both see the change.</p>
<p><code>s = append(s, 40)</code> is a write into the <code>len</code> field, and the copy has its own. The function ended, the copy vanished along with the new length. Inside, the slice printed with four elements; outside it stayed at three.</p>
<p>There is exactly one fix — return the result:</p>
<pre><code>func addItem(s []int) []int { return append(s, 40) }
a = addItem(a)</code></pre>
<p>The same reasoning covers plain assignment. <code>b := a</code> copies the header, not the data, so editing <code>b[0]</code> damages <code>a</code>. A real copy takes two steps: allocate your own block and move the values into it.</p>
<pre><code>c := make([]int, len(a))
copy(c, a)     <span class="cm">// now c lives on its own</span></code></pre>
<p><code>copy</code> moves as many elements as fit into the destination and never reports a shortage of room. Forget the <code>make</code> with the right length and <code>copy</code> into a <code>nil</code> slice moves zero elements, with no complaint from the compiler or from the run. The slice simply stays empty and the data is lost in silence.</p>`}
}
];

/* ================= ТАБЛИЦА ТЕМЫ ================= */
var TABLE = {
  title:{ru:"Срезы: что берёт какая запись", en:"Slice expressions: what each one takes"},
  intro:{ru:"Всё для a := []int{10, 20, 30, 40, 50}. Левая граница включается, правая — нет.",
         en:"All for a := []int{10, 20, 30, 40, 50}. The left bound is included, the right one is not."},
  head:{ru:["Запись","Результат","len","cap"], en:["Expression","Result","len","cap"]},
  rows:[["a[1:3]","[20 30]","2","4"],
        ["a[:3]","[10 20 30]","3","5"],
        ["a[2:]","[30 40 50]","3","3"],
        ["a[:]","[10 20 30 40 50]","5","5"],
        ["a[2:2]","[]","0","3"],
        ["a[len(a)-1:]","[50]","1","1"]]
};

/* ================= ГРАБЛИ ================= */
var TRAPS = [
 {ru:"<strong><code>append</code> без присваивания не соберётся.</strong> Строка <code>append(a, 4)</code> сама по себе бесполезна, и Go на неё ругается: <code>append(a, 4) (value of type []int) is not used</code>. Ошибка выглядит непонятно, а смысл простой: результат некуда деть. Пиши <code>a = append(a, 4)</code>.",
  en:"<strong><code>append</code> without an assignment won't compile.</strong> The line <code>append(a, 4)</code> is useless on its own, and Go complains: <code>append(a, 4) (value of type []int) is not used</code>. The message looks cryptic, the meaning is simple: the result has nowhere to go. Write <code>a = append(a, 4)</code>."},
 {ru:"<strong><code>make([]int, 5)</code> — это уже пять нулей, а не пустой слайс.</strong> Дальше <code>append</code> дописывает шестым элементом, и результат выходит <code>[0 0 0 0 0 1]</code>. Если собираешь слайс через <code>append</code>, начинай с <code>var a []int</code> или <code>make([]int, 0, 5)</code>.",
  en:"<strong><code>make([]int, 5)</code> is already five zeros, not an empty slice.</strong> A following <code>append</code> adds a sixth element and you get <code>[0 0 0 0 0 1]</code>. If you're building a slice with <code>append</code>, start from <code>var a []int</code> or <code>make([]int, 0, 5)</code>."},
 {ru:"<strong><code>b := a</code> не делает копию.</strong> Данные остаются общими: правишь <code>b[0]</code> — портится и <code>a</code>. Компилятор молчит, ошибка вылезает где-то дальше и выглядит как «числа сами поменялись». Настоящая копия — <code>c := make([]int, len(a))</code> и <code>copy(c, a)</code>.",
  en:"<strong><code>b := a</code> does not make a copy.</strong> The data stays shared: edit <code>b[0]</code> and <code>a</code> breaks too. The compiler says nothing, the bug surfaces somewhere later and looks like “the numbers changed by themselves”. A real copy is <code>c := make([]int, len(a))</code> plus <code>copy(c, a)</code>."},
 {ru:"<strong><code>append</code> внутри функции снаружи не виден.</strong> Функция получила копию заголовка — длина выросла только у копии. Печатаешь внутри — элемент есть, печатаешь снаружи — нет. При этом <code>s[0] = 99</code> в той же функции сработает и снаружи. Лечится возвратом результата: <code>a = addItem(a)</code>.",
  en:"<strong>An <code>append</code> inside a function is invisible outside.</strong> The function got a copy of the header — only the copy's length grew. Print inside and the element is there; print outside and it isn't. Yet <code>s[0] = 99</code> in the same function does show up outside. The fix is returning the result: <code>a = addItem(a)</code>."},
 {ru:"<strong><code>a[len(a)]</code> роняет программу.</strong> Индексы идут от 0 до <code>len(a)-1</code>, последний элемент — <code>a[len(a)-1]</code>. Классика — цикл <code>for i := 0; i &lt;= len(a); i++</code>: одно лишнее <code>=</code> и <code>panic: index out of range</code>. Компилятор такое не ловит, падает только при запуске.",
  en:"<strong><code>a[len(a)]</code> crashes the program.</strong> Indices run from 0 to <code>len(a)-1</code>, so the last element is <code>a[len(a)-1]</code>. The classic version is <code>for i := 0; i &lt;= len(a); i++</code>: one extra <code>=</code> and you get <code>panic: index out of range</code>. The compiler doesn't catch it; it only blows up at run time."},
 {ru:"<strong><code>a[1:3]</code> — это два элемента, а не три.</strong> Правая граница не входит. Из-за этого <code>a[0:len(a)]</code> — весь слайс и это нормально, а <code>a[0:len(a)+1]</code> — падение. Считай длину куска как <code>конец - начало</code>, а не «от и до».",
  en:"<strong><code>a[1:3]</code> is two elements, not three.</strong> The right bound is excluded. That's why <code>a[0:len(a)]</code> is the whole slice and perfectly fine, while <code>a[0:len(a)+1]</code> crashes. Compute a piece's length as <code>end - start</code>, not “from here to there”."}
];

/* ================= ПРИМЕРЫ ДЛЯ НАБОРА ================= */
var EXAMPLES = [
{
 chg:{ru:"первый, набирай целиком", en:"the first one, type it all"},
 code:`package main

import "fmt"

func main() {
	arr := [3]int{10, 20, 30}
	fmt.Println(arr, len(arr))
}`,
 out:"[10 20 30] 3",
 why:{ru:"Массив: в квадратных скобках стоит размер, и он часть типа. <b>Сломай:</b> добавь <code>arr = append(arr, 40)</code> и прочитай ошибку — это и есть главное отличие темы.",
      en:"An array: the size sits in the square brackets and is part of the type. <b>Break it:</b> add <code>arr = append(arr, 40)</code> and read the error — that's the whole point of this topic."}
},
{
 chg:{ru:"из квадратных скобок убрали число", en:"the number is gone from the brackets"},
 code:`package main

import "fmt"

func main() {
	sl := []int{10, 20, 30}
	fmt.Println(sl, len(sl), cap(sl))
}`,
 out:"[10 20 30] 3 3",
 why:{ru:"Одно изменение — и это уже слайс. Значения те же, на экране почти то же самое, тип другой. <code>cap</code> пока равен <code>len</code>: место выделено ровно под три.",
      en:"One change and it's a slice. Same values, nearly the same screen, different type. <code>cap</code> equals <code>len</code> for now: room was allocated for exactly three."}
},
{
 chg:{ru:"добавили ещё два способа создать слайс", en:"two more ways to create a slice"},
 code:`package main

import "fmt"

func main() {
	var a []int
	b := []int{10, 20, 30}
	c := make([]int, 3)

	fmt.Println(a, len(a), a == nil)
	fmt.Println(b, len(b), b == nil)
	fmt.Println(c, len(c), c == nil)
}`,
 out:"[] 0 true\n[10 20 30] 3 false\n[0 0 0] 3 false",
 why:{ru:"<code>a</code> и <code>c</code> печатаются похоже, но это разные вещи: у <code>a</code> ноль элементов, у <code>c</code> — три нуля. <b>Сломай:</b> добавь <code>a[0] = 1</code> и получишь падение — писать некуда.",
      en:"<code>a</code> and <code>c</code> print alike but are different things: <code>a</code> has zero elements, <code>c</code> has three zeros. <b>Break it:</b> add <code>a[0] = 1</code> and it crashes — there's nowhere to write."}
},
{
 chg:{ru:"появился append", en:"append appeared"},
 code:`package main

import "fmt"

func main() {
	a := []int{10, 20, 30}
	fmt.Println(a, len(a), cap(a))

	a = append(a, 40)
	fmt.Println(a, len(a), cap(a))
}`,
 out:"[10 20 30] 3 3\n[10 20 30 40] 4 6",
 why:{ru:"<code>len</code> вырос на один, а <code>cap</code> сразу до шести: места не было, Go выделил новый кусок с запасом. <b>Сломай:</b> убери <code>a = </code> перед <code>append</code> и прочитай ошибку.",
      en:"<code>len</code> grew by one but <code>cap</code> jumped straight to six: there was no room, so Go allocated a bigger block. <b>Break it:</b> drop the <code>a = </code> in front of <code>append</code> and read the error."}
},
{
 chg:{ru:"append переехал в цикл", en:"append moved into a loop"},
 code:`package main

import "fmt"

func main() {
	var a []int
	for i := 1; i <= 5; i++ {
		a = append(a, i*10)
		fmt.Println(a, len(a), cap(a))
	}
}`,
 out:"[10] 1 1\n[10 20] 2 2\n[10 20 30] 3 4\n[10 20 30 40] 4 4\n[10 20 30 40 50] 5 8",
 why:{ru:"<code>len</code> растёт по единице, <code>cap</code> — скачками 1, 2, 4, 8. Скачок происходит ровно тогда, когда <code>len</code> упёрся в <code>cap</code>. Это и есть переезд данных на новое место.",
      en:"<code>len</code> grows by one, <code>cap</code> jumps 1, 2, 4, 8. The jump happens exactly when <code>len</code> hits <code>cap</code>. That's the data moving to a new place."}
},
{
 chg:{ru:"вместо добавления — перебор", en:"iterating instead of adding"},
 code:`package main

import "fmt"

func main() {
	a := []int{10, 20, 30, 40, 50}

	sum := 0
	for i := 0; i < len(a); i++ {
		sum += a[i]
	}
	fmt.Println(sum)

	for i, v := range a {
		fmt.Println(i, v)
	}
}`,
 out:"150\n0 10\n1 20\n2 30\n3 40\n4 50",
 why:{ru:"Два способа пройти слайс. <b>Сломай:</b> поставь <code>i &lt;= len(a)</code> в первом цикле — получишь <code>panic: index out of range</code>. Последний индекс это <code>len(a)-1</code>.",
      en:"Two ways to walk a slice. <b>Break it:</b> change the first loop to <code>i &lt;= len(a)</code> and you get <code>panic: index out of range</code>. The last index is <code>len(a)-1</code>."}
},
{
 chg:{ru:"взяли куски слайса", en:"taking pieces of the slice"},
 code:`package main

import "fmt"

func main() {
	a := []int{10, 20, 30, 40, 50}

	fmt.Println(a[1:3])
	fmt.Println(a[:3])
	fmt.Println(a[2:])
	fmt.Println(a[:])
	fmt.Println(a[2:2], len(a[2:2]))
}`,
 out:"[20 30]\n[10 20 30]\n[30 40 50]\n[10 20 30 40 50]\n[] 0",
 why:{ru:"<code>a[1:3]</code> даёт два элемента, а не три: правая граница не входит. Длина куска всегда <code>конец - начало</code>. <b>Сломай:</b> напиши <code>a[1:9]</code> и прочитай <code>slice bounds out of range</code>.",
      en:"<code>a[1:3]</code> gives two elements, not three: the right bound is excluded. A piece's length is always <code>end - start</code>. <b>Break it:</b> write <code>a[1:9]</code> and read <code>slice bounds out of range</code>."}
},
{
 chg:{ru:"срез заменили обычным присваиванием", en:"the slicing became a plain assignment"},
 code:`package main

import "fmt"

func main() {
	a := []int{10, 20, 30}

	b := a
	b[0] = 99
	fmt.Println(a, b)

	c := make([]int, len(a))
	copy(c, a)
	c[0] = 7
	fmt.Println(a, c)
}`,
 out:"[99 20 30] [99 20 30]\n[99 20 30] [7 20 30]",
 why:{ru:"Правили <code>b</code>, а изменился и <code>a</code> — данные общие. С <code>c</code> такого нет: <code>make</code> выделил свой кусок, <code>copy</code> перенёс в него значения. <b>Сломай:</b> замени <code>make([]int, len(a))</code> на <code>var c []int</code> — скопируется ноль элементов, и Go не пожалуется.",
      en:"You edited <code>b</code> and <code>a</code> changed too — the data is shared. Not so for <code>c</code>: <code>make</code> allocated its own block and <code>copy</code> moved the values in. <b>Break it:</b> replace <code>make([]int, len(a))</code> with <code>var c []int</code> — zero elements get copied and Go won't complain."}
},
{
 chg:{ru:"слайс ушёл в функцию", en:"the slice went into a function"},
 code:`package main

import "fmt"

func setFirst(s []int) {
	s[0] = 99
}

func main() {
	a := []int{10, 20, 30}
	setFirst(a)
	fmt.Println(a, len(a))
}`,
 out:"[99 20 30] 3",
 why:{ru:"Функция ничего не возвращает, а <code>a</code> снаружи изменился. Заголовок скопировался, но указывает он на тот же кусок памяти — запись по индексу видна всем.",
      en:"The function returns nothing, yet <code>a</code> changed on the outside. The header was copied, but it points at the same memory block — a write by index is visible to everyone."}
},
{
 chg:{ru:"внутри функции вместо записи по индексу — append", en:"inside the function, append instead of an index write"},
 code:`package main

import "fmt"

func addItem(s []int) {
	s = append(s, 99)
	fmt.Println(s, len(s))
}

func main() {
	a := []int{10, 20, 30}
	addItem(a)
	fmt.Println(a, len(a))
}`,
 out:"[10 20 30 99] 4\n[10 20 30] 3",
 why:{ru:"Внутри четыре элемента, снаружи три. <code>append</code> изменил длину у <b>копии заголовка</b>, а она осталась в функции. Сравни с прошлым примером — код почти тот же, поведение противоположное. <b>Почини:</b> верни результат и присвой его снаружи.",
      en:"Four elements inside, three outside. <code>append</code> changed the length of the <b>header copy</b>, and that copy stayed in the function. Compare with the previous example — nearly the same code, opposite behaviour. <b>Fix it:</b> return the result and assign it outside."}
}
];

/* ================= ЗАДАЧИ ================= */
var TASKS = [
{t:"MakeSlice", lvl:1, e:"[10 20 30] 3 3",
 d:{ru:"Создай слайс из трёх чисел: 10, 20, 30. Напечатай в одну строку сам слайс, его длину и вместимость.",
    en:"Create a slice of three numbers: 10, 20, 30. Print the slice, its length and its capacity on one line."},
 h:{ru:"Слайс — это пустые квадратные скобки: <code>[]int{...}</code>. Длина — <code>len</code>, вместимость — <code>cap</code>.",
    en:"A slice means empty square brackets: <code>[]int{...}</code>. Length is <code>len</code>, capacity is <code>cap</code>."}},

{t:"GrowFromEmpty", lvl:1, e:"0 true\n[1 2 3] 3 false",
 d:{ru:"Объяви пустой слайс через <code>var</code>. Напечатай его длину и является ли он <code>nil</code>. Потом добавь в него 1, 2 и 3 и напечатай слайс, длину и снова проверку на <code>nil</code>.",
    en:"Declare an empty slice with <code>var</code>. Print its length and whether it is <code>nil</code>. Then add 1, 2 and 3 to it and print the slice, its length and the <code>nil</code> check again."},
 h:{ru:"<code>var a []int</code> даёт <code>nil</code>-слайс. Каждый <code>append</code> присваивай обратно: <code>a = append(a, 1)</code>.",
    en:"<code>var a []int</code> gives a <code>nil</code> slice. Assign every <code>append</code> back: <code>a = append(a, 1)</code>."}},

{t:"ThreeCuts", lvl:1, e:"[2 3]\n[1 2]\n[4 5]",
 d:{ru:"Для слайса <code>{1, 2, 3, 4, 5}</code> напечатай на трёх строках: кусок с индексами 1 и 2, первые два элемента, последние два элемента.",
    en:"For the slice <code>{1, 2, 3, 4, 5}</code> print on three lines: the piece at indices 1 and 2, the first two elements, the last two elements."},
 h:{ru:"Правая граница не входит. Первые два — <code>a[:2]</code>. Последние два начинаются с индекса 3.",
    en:"The right bound is excluded. The first two are <code>a[:2]</code>. The last two start at index 3."}},

{t:"SumSlice", lvl:1, e:"20",
 d:{ru:"Посчитай сумму элементов слайса <code>{3, 7, 2, 8}</code> и напечатай её.",
    en:"Compute the sum of the elements in <code>{3, 7, 2, 8}</code> and print it."},
 h:{ru:"Накопитель создавай ДО цикла. Читаешь значения — подойдёт <code>for _, v := range a</code>.",
    en:"Create the accumulator BEFORE the loop. You're only reading values, so <code>for _, v := range a</code> fits."}},

{t:"FirstAndLast", lvl:2, e:"5 21\n26",
 d:{ru:"Для слайса <code>{5, 8, 13, 21}</code> напечатай первый и последний элементы в одну строку, а на следующей строке — их сумму. Индекс последнего вычисли, а не пиши числом.",
    en:"For the slice <code>{5, 8, 13, 21}</code> print the first and last elements on one line, and their sum on the next. Compute the last index, don't hard-code a number."},
 h:{ru:"Индексы идут от 0 до <code>len(a)-1</code>. Последний элемент — <code>a[len(a)-1]</code>.",
    en:"Indices run from 0 to <code>len(a)-1</code>. The last element is <code>a[len(a)-1]</code>."}},

{t:"OnlyEven", lvl:2, e:"[2 4 6 8] 4",
 d:{ru:"Из слайса <code>{1, 2, 3, 4, 5, 6, 7, 8}</code> собери новый слайс только из чётных чисел. Напечатай его и его длину.",
    en:"From the slice <code>{1, 2, 3, 4, 5, 6, 7, 8}</code> build a new slice with only the even numbers. Print it and its length."},
 h:{ru:"Новый слайс объяви через <code>var even []int</code> и наполняй через <code>append</code>. Чётность — <code>v%2 == 0</code>.",
    en:"Declare the new slice as <code>var even []int</code> and fill it with <code>append</code>. Even means <code>v%2 == 0</code>."}},

{t:"ReverseInPlace", lvl:2, e:"[5 4 3 2 1]",
 d:{ru:"Переверни слайс <code>{1, 2, 3, 4, 5}</code> на месте, не создавая второй слайс, и напечатай результат.",
    en:"Reverse the slice <code>{1, 2, 3, 4, 5}</code> in place, without creating a second slice, and print the result."},
 h:{ru:"Меняй местами <code>a[i]</code> и <code>a[len(a)-1-i]</code>. Цикл идёт только до середины: <code>i &lt; len(a)/2</code> — иначе перевернёшь дважды.",
    en:"Swap <code>a[i]</code> with <code>a[len(a)-1-i]</code>. The loop only goes to the middle: <code>i &lt; len(a)/2</code> — otherwise you reverse it twice."}},

{t:"WhatFunctionsSee", lvl:3, e:"[99 2 3]\n[99 2 3 4]\n[99 2 3]",
 d:{ru:"Напиши две функции, обе принимают <code>[]int</code> и ничего не возвращают. Первая ставит нулевому элементу значение 99. Вторая добавляет в конец число 4 и печатает слайс изнутри. В <code>main</code> создай слайс <code>{1, 2, 3}</code>, вызови первую функцию и напечатай слайс, потом вызови вторую и напечатай слайс ещё раз.",
    en:"Write two functions, both taking <code>[]int</code> and returning nothing. The first sets element zero to 99. The second appends 4 and prints the slice from inside. In <code>main</code> create the slice <code>{1, 2, 3}</code>, call the first function and print the slice, then call the second and print the slice again."},
 h:{ru:"Ожидаемый вывод не опечатка: третья строка короче второй. Запись по индексу идёт в общий кусок памяти, а <code>append</code> меняет длину только у копии заголовка внутри функции.",
    en:"The expected output is not a typo: the third line is shorter than the second. An index write goes into the shared memory block, while <code>append</code> changes the length only on the header copy inside the function."}},

{t:"RemoveAt", lvl:3, e:"[10 20 40 50] 4",
 d:{ru:"Из слайса <code>{10, 20, 30, 40, 50}</code> удали элемент с индексом 2. Напечатай результат и его длину.",
    en:"Remove the element at index 2 from the slice <code>{10, 20, 30, 40, 50}</code>. Print the result and its length."},
 h:{ru:"Простой путь: пройди слайс циклом и через <code>append</code> собери новый, пропустив нужный индекс. Короткий путь через срезы: <code>append(a[:2], a[3:]...)</code> — три точки приклеивают второй слайс целиком.",
    en:"The simple way: walk the slice in a loop and build a new one with <code>append</code>, skipping that index. The short way with slicing: <code>append(a[:2], a[3:]...)</code> — the three dots glue the second slice on whole."}},

{t:"IndependentCopy", lvl:3, e:"[9 2 3] [9 2 3]\n[9 2 3] [9 8 3]",
 d:{ru:"Возьми слайс <code>{1, 2, 3}</code>. Сначала покажи, что присваивание не копирует: сделай <code>b := a</code>, поменяй у <code>b</code> нулевой элемент на 9 и напечатай оба слайса в одну строку. Потом сделай настоящую копию <code>c</code>, поменяй у неё элемент с индексом 1 на 8 и снова напечатай оба.",
    en:"Take the slice <code>{1, 2, 3}</code>. First show that assignment doesn't copy: write <code>b := a</code>, set element zero of <code>b</code> to 9 and print both slices on one line. Then make a real copy <code>c</code>, set its element at index 1 to 8 and print both again."},
 h:{ru:"Настоящая копия — два шага: <code>c := make([]int, len(a))</code> и <code>copy(c, a)</code>. Без <code>make</code> нужной длины <code>copy</code> перенесёт ноль элементов и ошибки не будет.",
    en:"A real copy takes two steps: <code>c := make([]int, len(a))</code> and <code>copy(c, a)</code>. Without a <code>make</code> of the right length, <code>copy</code> moves zero elements and reports nothing."}}
];

/* ================= БАНК ВОПРОСОВ ================= */
var NO = {ru:"не соберётся", en:"won't compile"};
var PANIC = {ru:"упадёт при запуске", en:"crashes at run time"};
var Q_OUT = {ru:"Что выведет программа?", en:"What does this print?"};
var Q_HAP = {ru:"Что произойдёт?", en:"What happens?"};

var BANK = [
{q:Q_OUT, code:"a := []int{10, 20, 30}\nfmt.Println(len(a), cap(a))",
 opts:["3 3","3 0","3 6","0 3"], ok:0,
 why:{ru:"У литерала выделяется место ровно под указанные элементы, поэтому <code>cap</code> совпадает с <code>len</code>. Запас появится только после первого <code>append</code>.",
      en:"A literal allocates room for exactly the listed elements, so <code>cap</code> equals <code>len</code>. Spare room shows up only after the first <code>append</code>."}},

{q:Q_OUT, code:"var a []int\nfmt.Println(a, len(a), a == nil)",
 opts:["[] 0 true","nil 0 true","[] 0 false",PANIC], ok:0,
 why:{ru:"Нулевое значение слайса — <code>nil</code>, но печатается он как <code>[]</code>. По виду <code>nil</code>-слайс и пустой слайс не различить — различает только сравнение с <code>nil</code>.",
      en:"The zero value of a slice is <code>nil</code>, yet it prints as <code>[]</code>. A <code>nil</code> slice and an empty slice look identical — only a comparison with <code>nil</code> tells them apart."}},

{q:Q_OUT, code:"a := []int{1, 2, 3}\na = append(a, 4)\nfmt.Println(a, len(a), cap(a))",
 opts:["[1 2 3 4] 4 6","[1 2 3 4] 4 4","[1 2 3 4] 3 3","[4] 1 1"], ok:0,
 why:{ru:"Места под четвёртый элемент не было: <code>len</code> упёрся в <code>cap</code>. Go выделил новый кусок с запасом, поэтому <code>cap</code> стал 6, а не 4.",
      en:"There was no room for a fourth element: <code>len</code> had hit <code>cap</code>. Go allocated a bigger block, so <code>cap</code> became 6, not 4."}},

{q:Q_OUT, code:"a := []int{10, 20, 30, 40, 50}\nfmt.Println(a[1:3])",
 opts:["[20 30]","[20 30 40]","[10 20 30]","[2 3]"], ok:0,
 why:{ru:"Левая граница включается, правая — нет. Берутся индексы 1 и 2, длина куска равна <code>3 - 1 = 2</code>.",
      en:"The left bound is included, the right one is not. Indices 1 and 2 are taken, and the length is <code>3 - 1 = 2</code>."}},

{q:Q_OUT, code:"a := []int{1, 2, 3}\nb := a\nb[0] = 9\nfmt.Println(a, b)",
 opts:["[9 2 3] [9 2 3]","[1 2 3] [9 2 3]","[9 2 3] [1 2 3]",NO], ok:0,
 why:{ru:"<code>b := a</code> копирует заголовок, а не данные. Обе переменные смотрят в один кусок памяти, поэтому правка одной видна в другой.",
      en:"<code>b := a</code> copies the header, not the data. Both variables look into the same block, so an edit through one shows up in the other."}},

{q:Q_OUT, code:"a := make([]int, 3)\na = append(a, 1)\nfmt.Println(a, len(a))",
 opts:["[0 0 0 1] 4","[1] 1","[1 0 0] 3","[0 0 1] 3"], ok:0,
 why:{ru:"<code>make([]int, 3)</code> — это уже три нуля, а не пустой слайс. <code>append</code> дописывает четвёртым. Нужен пустой с запасом — пиши <code>make([]int, 0, 3)</code>.",
      en:"<code>make([]int, 3)</code> is already three zeros, not an empty slice. <code>append</code> adds a fourth. For an empty one with room, write <code>make([]int, 0, 3)</code>."}},

{q:Q_HAP, code:"a := make([]int, 0, 5)\nfmt.Println(a[0])",
 opts:[PANIC,"0","[]",NO], ok:0,
 why:{ru:"Место под пять ячеек выделено, но занятых ноль. Обращаться по индексу можно только в пределах <code>len</code>, а он равен нулю: <code>index out of range [0] with length 0</code>.",
      en:"Room for five cells is allocated, but zero are taken. Indexing is allowed only within <code>len</code>, and it is zero: <code>index out of range [0] with length 0</code>."}},

{q:Q_OUT, code:"a := []int{1, 2, 3}\nfor _, v := range a {\n\tv = v * 10\n}\nfmt.Println(a)",
 opts:["[1 2 3]","[10 20 30]","[1 2 3 10 20 30]",NO], ok:0,
 why:{ru:"<code>v</code> в <code>range</code> — копия элемента. Меняешь копию, слайс не трогается. Чтобы записать, нужен индекс: <code>a[i] = a[i] * 10</code>.",
      en:"<code>v</code> in a <code>range</code> is a copy of the element. Changing the copy leaves the slice alone. To write, go through the index: <code>a[i] = a[i] * 10</code>."}},

{q:Q_OUT, code:"a := []int{1, 2, 3}\nb := append(a, 4)\nfmt.Println(a, b)",
 opts:["[1 2 3] [1 2 3 4]","[1 2 3 4] [1 2 3 4]","[1 2 3] [4]",NO], ok:0,
 why:{ru:"<code>append</code> не меняет переданный слайс — он возвращает результат. Присвоили в <code>b</code>, значит <code>a</code> остался прежним.",
      en:"<code>append</code> doesn't modify the slice you pass — it returns a result. It went into <code>b</code>, so <code>a</code> stayed as it was."}},

{q:Q_OUT, code:"a := []int{10, 20, 30}\nb := a[1:1]\nfmt.Println(b, len(b))",
 opts:["[] 0","[20] 1","[20 30] 2",PANIC], ok:0,
 why:{ru:"Когда границы совпали, длина равна <code>1 - 1 = 0</code>. Это законный пустой слайс, а не ошибка.",
      en:"When the bounds meet, the length is <code>1 - 1 = 0</code>. That's a legal empty slice, not an error."}},

{q:{ru:"Какая из строк создаёт слайс, а не массив?", en:"Which line creates a slice, not an array?"}, code:null,
 opts:["a := []int{1, 2, 3}","a := [3]int{1, 2, 3}","var a [3]int","a := [...]int{1, 2, 3}"], ok:0,
 why:{ru:"Решают квадратные скобки: пусто — слайс, число или <code>...</code> внутри — массив. Фигурные скобки со значениями бывают у обоих и ни о чём не говорят.",
      en:"The square brackets decide: empty means slice; a number or <code>...</code> inside means array. Curly braces with values appear in both and prove nothing."}},

{q:{ru:"Что означает <code>cap</code> у слайса?", en:"What does <code>cap</code> mean for a slice?"}, code:null,
 opts:[{ru:"сколько ячеек выделено под данные",en:"how many cells were allocated for the data"},
       {ru:"сколько элементов в слайсе сейчас",en:"how many elements the slice holds right now"},
       {ru:"максимально возможный размер слайса",en:"the maximum size a slice may reach"},
       {ru:"сколько байт занимает один элемент",en:"how many bytes one element takes"}], ok:0,
 why:{ru:"Занятых ячеек — <code>len</code>, выделенных — <code>cap</code>. Когда <code>len</code> догоняет <code>cap</code>, следующий <code>append</code> выделяет новый кусок и переносит туда данные.",
      en:"Taken cells are <code>len</code>, allocated cells are <code>cap</code>. When <code>len</code> catches up with <code>cap</code>, the next <code>append</code> allocates a new block and moves the data there."}},

{q:{ru:"Почему результат <code>append</code> обязательно присваивают обратно?", en:"Why must an <code>append</code> result be assigned back?"}, code:null,
 opts:[{ru:"append может выделить новый кусок памяти и вернуть слайс, смотрящий уже на него",en:"append may allocate a new block and return a slice pointing at it"},
       {ru:"так требует стиль оформления кода",en:"the code style guide demands it"},
       {ru:"иначе слайс станет nil",en:"otherwise the slice becomes nil"},
       {ru:"чтобы обновился cap, len обновится сам",en:"so that cap updates; len updates by itself"}], ok:0,
 why:{ru:"Если места не хватило, данные переезжают, и старая переменная продолжает смотреть на прежний кусок. Даже когда переезда нет, новая длина живёт только в возвращённом заголовке.",
      en:"If there wasn't enough room the data moves, and the old variable keeps pointing at the previous block. Even without a move, the new length exists only in the returned header."}},

{q:{ru:"Сколько элементов в <code>a[2:5]</code>?", en:"How many elements are in <code>a[2:5]</code>?"}, code:null,
 opts:["3","4","2","5"], ok:0,
 why:{ru:"Длина куска — <code>конец - начало</code>, то есть <code>5 - 2 = 3</code>. Берутся индексы 2, 3 и 4; пятый не входит.",
      en:"A piece's length is <code>end - start</code>, that is <code>5 - 2 = 3</code>. Indices 2, 3 and 4 are taken; the fifth is out."}},

{q:{ru:"Чем <code>var a []int</code> отличается от <code>a := []int{}</code>?", en:"How does <code>var a []int</code> differ from <code>a := []int{}</code>?"}, code:null,
 opts:[{ru:"у первого a == nil, у второго нет; длина у обоих 0",en:"the first has a == nil, the second doesn't; both have length 0"},
       {ru:"у первого длина 0, у второго 1",en:"the first has length 0, the second has 1"},
       {ru:"ничем, это одна и та же запись",en:"nothing, they are the same thing"},
       {ru:"во второй нельзя добавлять через append",en:"you cannot append to the second one"}], ok:0,
 why:{ru:"Печатаются они одинаково — <code>[]</code>, и <code>append</code> работает с обоими. Разница видна только при сравнении с <code>nil</code>. Поэтому на пустоту проверяют через <code>len(a) == 0</code>: это работает в обоих случаях.",
      en:"They print the same — <code>[]</code> — and <code>append</code> works on both. The difference shows only in a <code>nil</code> comparison. That's why emptiness is checked with <code>len(a) == 0</code>: it works either way."}},

{q:{ru:"Функция принимает <code>[]int</code> и делает <code>s = append(s, 4)</code>. Что увидит вызвавший её код?",
    en:"A function takes <code>[]int</code> and does <code>s = append(s, 4)</code>. What does the caller see?"}, code:null,
 opts:[{ru:"ничего, снаружи слайс не изменится",en:"nothing, the slice is unchanged outside"},
       {ru:"новый элемент в конце",en:"the new element at the end"},
       {ru:"слайс станет nil",en:"the slice becomes nil"},
       {ru:"такой код не соберётся",en:"such code won't compile"}], ok:0,
 why:{ru:"Функция получила копию заголовка и изменила длину только у копии. Чтобы результат был виден, функция должна вернуть слайс: <code>a = addItem(a)</code>.",
      en:"The function got a copy of the header and changed the length of that copy only. For the result to be visible the function must return the slice: <code>a = addItem(a)</code>."}},

{q:{ru:"Та же функция вместо append делает <code>s[0] = 99</code>. Что увидит вызвавший код?",
    en:"The same function does <code>s[0] = 99</code> instead of append. What does the caller see?"}, code:null,
 opts:[{ru:"нулевой элемент стал 99",en:"element zero is now 99"},
       {ru:"ничего, снаружи слайс не изменится",en:"nothing, the slice is unchanged outside"},
       {ru:"такой код не соберётся",en:"such code won't compile"},
       {ru:"зависит от длины слайса",en:"it depends on the slice length"}], ok:0,
 why:{ru:"Заголовок скопирован, но указывает на тот же кусок памяти. Запись по индексу идёт прямо в него, поэтому видна снаружи. В этом вся разница с <code>append</code>.",
      en:"The header was copied but points at the same memory block. An index write goes straight into it, so it's visible outside. That's the entire difference from <code>append</code>."}},

{q:{ru:"Как сделать копию слайса, которая живёт отдельно от оригинала?", en:"How do you make a slice copy that lives independently?"}, code:null,
 opts:[{ru:"c := make([]int, len(a)) и copy(c, a)",en:"c := make([]int, len(a)) then copy(c, a)"},
       {ru:"c := a",en:"c := a"},
       {ru:"c := a[:]",en:"c := a[:]"},
       {ru:"var c []int и copy(c, a)",en:"var c []int then copy(c, a)"}], ok:0,
 why:{ru:"Первые два варианта только копируют заголовок — данные остаются общими. Последний тоже не работает: <code>copy</code> переносит столько, сколько влезет в приёмник, а в <code>nil</code>-слайс влезает ноль.",
      en:"The first two only copy the header — the data stays shared. The last one fails too: <code>copy</code> moves as much as fits into the destination, and nothing fits into a <code>nil</code> slice."}},

{q:{ru:"Какой индекс у последнего элемента слайса?", en:"What is the index of the last element of a slice?"}, code:null,
 opts:["len(a)-1","len(a)","cap(a)-1",{ru:"зависит от того, как слайс создан",en:"it depends on how the slice was created"}], ok:0,
 why:{ru:"Индексы идут с нуля, поэтому последний — <code>len(a)-1</code>. Обращение к <code>a[len(a)]</code> роняет программу, и компилятор такое не ловит.",
      en:"Indices start at zero, so the last one is <code>len(a)-1</code>. Reaching <code>a[len(a)]</code> crashes the program, and the compiler won't catch it."}},

{q:{ru:"Что произойдёт с циклом <code>for range</code> по <code>nil</code>-слайсу?", en:"What happens to a <code>for range</code> loop over a <code>nil</code> slice?"}, code:null,
 opts:[{ru:"не сделает ни одного шага",en:"it takes no steps at all"},
       {ru:"упадёт при запуске",en:"it crashes at run time"},
       {ru:"сделает один шаг с нулевым значением",en:"it takes one step with a zero value"},
       {ru:"не соберётся",en:"it won't compile"}], ok:0,
 why:{ru:"Длина <code>nil</code>-слайса равна нулю, а цикл идёт по длине. Отдельная проверка на пустоту перед циклом не нужна.",
      en:"A <code>nil</code> slice has length zero, and the loop follows the length. No separate emptiness check is needed before the loop."}}
];

/* ================= ВОПРОСЫ И ОТВЕТЫ ================= */
var QA = [
{q:{ru:"Чем слайс отличается от массива?", en:"How does a slice differ from an array?"},
 a:{ru:`<p>Главное отличие: <strong>у массива размер входит в тип</strong>. <code>[3]int</code> и <code>[4]int</code> — разные типы. У слайса размера в типе нет, он один — <code>[]int</code>.</p>
<div class="tablewrap"><table>
<tr><th></th><th>Массив <code>[3]int</code></th><th>Слайс <code>[]int</code></th></tr>
<tr><td>Размер</td><td>в типе, не меняется</td><td>меняется</td></tr>
<tr><td><code>append</code></td><td>нельзя</td><td>можно</td></tr>
<tr><td>Нулевое значение</td><td><code>[0 0 0]</code></td><td><code>nil</code></td></tr>
<tr><td>Передача в функцию</td><td>копируются все данные</td><td>копируется заголовок, данные общие</td></tr>
</table></div>
<p>Последняя строка — источник большинства ошибок с слайсами. Функция, меняющая <code>s[0]</code>, изменит элемент и у вызвавшего кода. С массивом такого не будет: он копируется целиком.</p>
<p>В повседневном коде берут слайс. Массив нужен, когда количество известно заранее и жёстко зафиксировано.</p>`,
    en:`<p>The key difference: <strong>an array's size is part of its type</strong>. <code>[3]int</code> and <code>[4]int</code> are different types. A slice has no size in its type — there is just <code>[]int</code>.</p>
<div class="tablewrap"><table>
<tr><th></th><th>Array <code>[3]int</code></th><th>Slice <code>[]int</code></th></tr>
<tr><td>Size</td><td>in the type, fixed</td><td>changes</td></tr>
<tr><td><code>append</code></td><td>not allowed</td><td>allowed</td></tr>
<tr><td>Zero value</td><td><code>[0 0 0]</code></td><td><code>nil</code></td></tr>
<tr><td>Passed to a function</td><td>all data is copied</td><td>header copied, data shared</td></tr>
</table></div>
<p>That last row is where most slice bugs come from. A function changing <code>s[0]</code> changes the element for the caller too. An array won't behave that way: it is copied whole.</p>
<p>Day-to-day code uses slices. An array is for when the count is known upfront and firmly fixed.</p>`}},

{q:{ru:"Зачем нужен <code>cap</code>, если работаю я всегда с <code>len</code>?", en:"Why does <code>cap</code> exist if I always work with <code>len</code>?"},
 a:{ru:`<p>Под слайсом лежит непрерывный кусок памяти. <code>len</code> — сколько ячеек занято, <code>cap</code> — сколько всего выделено.</p>
<pre><code>a := []int{10, 20, 30}
len(a) <span class="cm">// 3</span>
cap(a) <span class="cm">// 3 — всё занято</span>

a = append(a, 40)
len(a) <span class="cm">// 4</span>
cap(a) <span class="cm">// 6 — Go выделил новый кусок с запасом</span></code></pre>
<p>Когда <code>len</code> упирается в <code>cap</code>, <code>append</code> выделяет кусок побольше, переносит туда данные и возвращает слайс, смотрящий уже на новое место. Запас берётся не из вредности: выделять память под каждый элемент по отдельности слишком дорого, поэтому размер удваивается.</p>
<p>Прямо в коде <code>cap</code> нужен редко. Знать его надо, чтобы понимать две вещи:</p>
<ul><li>почему результат <code>append</code> обязательно присваивают обратно — иначе переменная останется смотреть на старый кусок;</li>
<li>почему два слайса, делившие данные, вдруг перестают их делить — один из них переехал.</li></ul>
<p>Одно практическое применение всё же есть: если заранее знаешь количество, пиши <code>make([]int, 0, n)</code> — переездов не будет вовсе.</p>`,
    en:`<p>Underneath a slice lies a contiguous block of memory. <code>len</code> is how many cells are taken, <code>cap</code> is how many were allocated in total.</p>
<pre><code>a := []int{10, 20, 30}
len(a) <span class="cm">// 3</span>
cap(a) <span class="cm">// 3 — all taken</span>

a = append(a, 40)
len(a) <span class="cm">// 4</span>
cap(a) <span class="cm">// 6 — Go allocated a bigger block</span></code></pre>
<p>When <code>len</code> hits <code>cap</code>, <code>append</code> allocates a larger block, moves the data there and returns a slice pointing at the new place. The spare room isn't arbitrary: allocating memory per element would be far too expensive, so the size doubles.</p>
<p>You rarely need <code>cap</code> in code directly. You need to know it to understand two things:</p>
<ul><li>why an <code>append</code> result must be assigned back — otherwise the variable keeps pointing at the old block;</li>
<li>why two slices that shared data suddenly stop sharing it — one of them moved.</li></ul>
<p>There is one practical use: if you know the count in advance, write <code>make([]int, 0, n)</code> and no moves happen at all.</p>`}},

{q:{ru:"Почему <code>append</code> надо присваивать обратно?", en:"Why does <code>append</code> have to be assigned back?"},
 a:{ru:`<p>Потому что <code>append</code> — это функция, которая <strong>возвращает</strong> слайс, а не меняет переданный.</p>
<pre><code>a = append(a, 4)   <span class="cm">// так</span>
append(a, 4)       <span class="cm">// не соберётся: value is not used</span></code></pre>
<p>Причина в устройстве слайса. Переменная хранит заголовок: адрес куска памяти, <code>len</code> и <code>cap</code>. Функция получает копию этого заголовка. Даже если данные попали в тот же кусок, новая длина записалась только в копию — и вернуть её можно единственным способом: как результат.</p>
<p>А если места не хватило, всё ещё жёстче: данные переехали в новый кусок, и старая переменная указывает на прежний адрес. Без присваивания ты потеряешь не только новый элемент, но и связь с актуальными данными.</p>
<p>Отсюда же следует, что присвоить можно в другую переменную — и получить два независимых результата:</p>
<pre><code>a := []int{1, 2, 3}
b := append(a, 4)
fmt.Println(a, b)  <span class="cm">// [1 2 3] [1 2 3 4]</span></code></pre>`,
    en:`<p>Because <code>append</code> is a function that <strong>returns</strong> a slice rather than modifying the one you pass in.</p>
<pre><code>a = append(a, 4)   <span class="cm">// this</span>
append(a, 4)       <span class="cm">// won't compile: value is not used</span></code></pre>
<p>The reason is how a slice is built. The variable holds a header: the address of a memory block, <code>len</code> and <code>cap</code>. The function receives a copy of that header. Even if the data landed in the same block, the new length was written only into the copy — and the single way to get it back is as the return value.</p>
<p>If there wasn't enough room it's even sharper: the data moved to a new block, and the old variable still points at the previous address. Without the assignment you lose not just the new element but the link to the current data.</p>
<p>It follows that you may assign to a different variable and get two independent results:</p>
<pre><code>a := []int{1, 2, 3}
b := append(a, 4)
fmt.Println(a, b)  <span class="cm">// [1 2 3] [1 2 3 4]</span></code></pre>`}},

{q:{ru:"Что такое <code>nil</code>-слайс и чем он отличается от пустого?", en:"What is a <code>nil</code> slice and how is it different from an empty one?"},
 a:{ru:`<p><code>var a []int</code> даёт <code>nil</code>-слайс: заголовок есть, а куска памяти под ним нет. <code>a := []int{}</code> даёт пустой слайс: кусок выделен, просто в нём ноль элементов.</p>
<pre><code>var a []int
b := []int{}

fmt.Println(a, len(a), a == nil)   <span class="cm">// [] 0 true</span>
fmt.Println(b, len(b), b == nil)   <span class="cm">// [] 0 false</span></code></pre>
<p>На практике разницы почти нет: печатаются они одинаково, <code>len</code> у обоих ноль, <code>append</code> работает с обоими, цикл ни по одному не сделает шага.</p>
<p><strong>Отсюда правило: на пустоту проверяй через <code>len(a) == 0</code>, а не через <code>a == nil</code>.</strong> Первое верно в обоих случаях, второе — только в одном.</p>
<p>Что <code>nil</code>-слайс точно не умеет — принимать запись по индексу. <code>a[0] = 1</code> уронит программу: ячейки нет.</p>`,
    en:`<p><code>var a []int</code> gives a <code>nil</code> slice: the header exists, but there is no memory block under it. <code>a := []int{}</code> gives an empty slice: a block is allocated, it just holds zero elements.</p>
<pre><code>var a []int
b := []int{}

fmt.Println(a, len(a), a == nil)   <span class="cm">// [] 0 true</span>
fmt.Println(b, len(b), b == nil)   <span class="cm">// [] 0 false</span></code></pre>
<p>In practice they barely differ: both print the same, both have <code>len</code> zero, <code>append</code> works on both, and a loop over either takes no steps.</p>
<p><strong>Hence the rule: check emptiness with <code>len(a) == 0</code>, not with <code>a == nil</code>.</strong> The first is right in both cases, the second only in one.</p>
<p>The one thing a <code>nil</code> slice cannot do is accept an index write. <code>a[0] = 1</code> crashes the program: there is no cell.</p>`}},

{q:{ru:"Почему <code>a[1:3]</code> даёт два элемента, а не три?", en:"Why does <code>a[1:3]</code> give two elements, not three?"},
 a:{ru:`<p>Левая граница включается, правая — нет. Берутся индексы 1 и 2, третий остаётся за бортом.</p>
<p>Так сделано ради удобного счёта: длина куска всегда равна <code>конец - начало</code>, без всяких плюс-минус единиц. У <code>a[1:3]</code> это 3−1 = 2.</p>
<p>Второе следствие: границы соседних кусков совпадают и элементы не теряются и не дублируются.</p>
<pre><code>a[:2]   <span class="cm">// первые два</span>
a[2:]   <span class="cm">// все остальные, начиная со второго</span></code></pre>
<p>Третье: <code>a[len(a):]</code> — законный пустой слайс, а не ошибка. Правая граница может доходить до <code>len</code> включительно именно потому, что сам этот индекс не берётся. А вот <code>a[len(a)]</code> без двоеточия — уже обращение к несуществующей ячейке и падение.</p>`,
    en:`<p>The left bound is included, the right one is not. Indices 1 and 2 are taken; the third stays out.</p>
<p>It works that way to make counting easy: a piece's length is always <code>end - start</code>, with no plus-or-minus-one corrections. For <code>a[1:3]</code> that's 3−1 = 2.</p>
<p>A second consequence: the bounds of neighbouring pieces meet exactly, so nothing is lost or duplicated.</p>
<pre><code>a[:2]   <span class="cm">// the first two</span>
a[2:]   <span class="cm">// everything from index two on</span></code></pre>
<p>A third: <code>a[len(a):]</code> is a legal empty slice, not an error. The right bound may reach <code>len</code> precisely because that index is never taken. But <code>a[len(a)]</code> without the colon is a read of a cell that doesn't exist — and a crash.</p>`}},

{q:{ru:"Почему функция изменила элемент слайса, но не смогла его удлинить?", en:"Why did a function change a slice element but fail to lengthen it?"},
 a:{ru:`<p>Переменная-слайс хранит три поля: адрес куска памяти, <code>len</code> и <code>cap</code>. При передаче в функцию копируются эти три поля, а не данные.</p>
<pre><code>func setFirst(s []int) { s[0] = 99 }          <span class="cm">// видно снаружи</span>
func addItem(s []int)  { s = append(s, 40) }  <span class="cm">// НЕ видно</span></code></pre>
<p><code>s[0] = 99</code> идёт по адресу, а адрес в копии тот же самый. Функция пишет в тот же кусок памяти, откуда читает вызвавший код — изменение видят оба.</p>
<p><code>s = append(s, 40)</code> меняет поле <code>len</code>, а оно у копии своё. Функция закончилась, копия исчезла вместе с новой длиной.</p>
<p>Починка одна — вернуть результат:</p>
<pre><code>func addItem(s []int) []int {
	return append(s, 40)
}

a = addItem(a)</code></pre>
<p>То же самое объясняет и <code>b := a</code>: копируется заголовок, данные общие.</p>`,
    en:`<p>A slice variable holds three fields: the address of a memory block, <code>len</code> and <code>cap</code>. Passing it to a function copies those three fields, not the data.</p>
<pre><code>func setFirst(s []int) { s[0] = 99 }          <span class="cm">// visible outside</span>
func addItem(s []int)  { s = append(s, 40) }  <span class="cm">// NOT visible</span></code></pre>
<p><code>s[0] = 99</code> goes through the address, and the address in the copy is the same one. The function writes into the very block the caller reads from — both see the change.</p>
<p><code>s = append(s, 40)</code> changes the <code>len</code> field, and the copy has its own. The function ended and the copy vanished along with the new length.</p>
<p>There's one fix — return the result:</p>
<pre><code>func addItem(s []int) []int {
	return append(s, 40)
}

a = addItem(a)</code></pre>
<p>The same reasoning explains <code>b := a</code>: the header is copied, the data is shared.</p>`}},

{q:{ru:"Как правильно скопировать слайс?", en:"How do you copy a slice properly?"},
 a:{ru:`<p>Два шага: выделить место и перенести значения.</p>
<pre><code>c := make([]int, len(a))
copy(c, a)</code></pre>
<p>Что <strong>не</strong> копирует данные:</p>
<ul><li><code>c := a</code> — копируется заголовок, кусок памяти общий;</li>
<li><code>c := a[:]</code> — то же самое, срез тоже смотрит в исходный кусок;</li>
<li><code>var c []int</code> плюс <code>copy(c, a)</code> — <code>copy</code> переносит столько, сколько влезет в приёмник, а в <code>nil</code>-слайс влезает ноль. Ошибки при этом не будет, слайс просто останется пустым.</li></ul>
<p>Последний пункт — самая тихая ошибка темы: компилятор молчит, программа не падает, данных просто нет. <code>copy</code> возвращает количество перенесённых элементов — если сомневаешься, напечатай его.</p>
<p>Второй рабочий способ, короче:</p>
<pre><code>c := append([]int{}, a...)</code></pre>`,
    en:`<p>Two steps: allocate room and move the values.</p>
<pre><code>c := make([]int, len(a))
copy(c, a)</code></pre>
<p>What does <strong>not</strong> copy the data:</p>
<ul><li><code>c := a</code> — the header is copied, the memory block is shared;</li>
<li><code>c := a[:]</code> — the same thing; a slice expression also looks into the original block;</li>
<li><code>var c []int</code> plus <code>copy(c, a)</code> — <code>copy</code> moves as much as fits into the destination, and nothing fits into a <code>nil</code> slice. No error either; the slice simply stays empty.</li></ul>
<p>That last one is the quietest bug in this topic: the compiler says nothing, the program doesn't crash, the data just isn't there. <code>copy</code> returns the number of elements moved — print it when in doubt.</p>
<p>A second working way, shorter:</p>
<pre><code>c := append([]int{}, a...)</code></pre>`}},

{q:{ru:"Когда перебирать через <code>range</code>, а когда по индексу?", en:"When to iterate with <code>range</code> and when by index?"},
 a:{ru:`<p>Читаешь значения — <code>range</code>. Пишешь в слайс — индекс.</p>
<pre><code>for _, v := range a {   <span class="cm">// читаем</span>
	sum += v
}

for i := range a {      <span class="cm">// пишем</span>
	a[i] = a[i] * 10
}</code></pre>
<p>Причина в том, что <code>v</code> — копия элемента, сделанная на каждом шаге. Присвоить в неё можно, но слайс останется прежним, и компилятор об этом не предупредит. Ошибка выглядит как «цикл ничего не делает».</p>
<p>По индексу приходится идти и тогда, когда нужен доступ к соседям — <code>a[i-1]</code> или <code>a[i+1]</code>. Тут же следи за границами: при обращении к <code>a[i+1]</code> цикл должен заканчиваться на <code>len(a)-1</code>.</p>
<p>Оба вида цикла по <code>nil</code>-слайсу просто не сделают ни шага. Проверять пустоту заранее не нужно.</p>`,
    en:`<p>Reading values — <code>range</code>. Writing into the slice — index.</p>
<pre><code>for _, v := range a {   <span class="cm">// reading</span>
	sum += v
}

for i := range a {      <span class="cm">// writing</span>
	a[i] = a[i] * 10
}</code></pre>
<p>The reason is that <code>v</code> is a copy of the element, made fresh on every step. You may assign to it, but the slice stays as it was and the compiler won't warn you. The bug looks like “the loop does nothing”.</p>
<p>You also need indices when you have to reach neighbours — <code>a[i-1]</code> or <code>a[i+1]</code>. Watch the bounds there: if you touch <code>a[i+1]</code>, the loop must stop at <code>len(a)-1</code>.</p>
<p>Both loop forms over a <code>nil</code> slice simply take no steps. No need to check for emptiness first.</p>`}}
];

/* ================= ТРЕНАЖЁР ================= */
var SCENARIOS = [
{
 name:{ru:"append и рост cap", en:"append and cap growth"},
 params:[{key:"n", label:{ru:"append", en:"appends"}, min:1, max:8, def:3}],
 code: function(p){
   var c = ["var a []int", "fmt.Println(a, len(a), cap(a))"];
   for(var i = 1; i <= p.n; i++){
     c.push("a = append(a, " + (i * 10) + ")");
     c.push("fmt.Println(a, len(a), cap(a))");
   }
   return c;
 },
 steps: function(p){
   var CAP = [0, 1, 2, 4, 4, 8, 8, 8, 8];   /* какой cap выдаёт Go после i-го append в []int */
   var vals = [], seen = [], steps = [], out = "", L = 0, C = 0;
   function sl(){ return "[" + vals.join(" ") + "]"; }
   function vr(){ return [["a", sl(), "[]int"], ["len(a)", String(L), "int"], ["cap(a)", String(C), "int"]]; }
   function cells(){ var r = [], i; for(i = 0; i < C; i++) r.push(i < L ? String(vals[i]) : "·"); return r; }
   function busy(){ var r = [], i; for(i = 0; i < L; i++) r.push(i); return r; }
   function cRu(k){ return k === 1 ? "ячейку" : (k < 5 ? "ячейки" : "ячеек"); }
   function cEn(k){ return k === 1 ? "cell" : "cells"; }

   steps.push({line:0, vars:vr(), out:out,
     note:{ru:"<code>var a []int</code> — заголовок есть, куска памяти под ним нет. Это <code>nil</code>-слайс: <code>len</code> и <code>cap</code> по нулям.",
           en:"<code>var a []int</code> — the header exists, there is no memory block under it. This is a <code>nil</code> slice: <code>len</code> and <code>cap</code> are both zero."}});
   out += sl() + " " + L + " " + C + "\n";
   steps.push({line:1, vars:vr(), out:out,
     note:{ru:"Печатается как <code>[]</code>, хотя внутри <code>nil</code>. По виду <code>nil</code>-слайс от пустого не отличить.",
           en:"It prints as <code>[]</code> even though it is <code>nil</code>. A <code>nil</code> slice looks exactly like an empty one."}});

   for(var i = 1; i <= p.n; i++){
     var was = C, v = i * 10;
     vals.push(v); L = i; C = CAP[i]; seen.push(C);
     var grew = (C !== was), free = C - L, aNote, aTitle;
     if(i === 1){
       aNote = {ru:"Места не было вовсе — Go выделил кусок на один элемент. Результат присвоен обратно в <code>a</code>, иначе он бы просто пропал.",
                en:"There was no room at all — Go allocated a block for one element. The result was assigned back to <code>a</code>; otherwise it would simply vanish."};
       aTitle = {ru:"Кусок памяти под a: len 1, cap 1", en:"Memory block for a: len 1, cap 1"};
     } else if(grew){
       aNote = {ru:"Свободных ячеек не осталось, а растянуть кусок на месте нельзя — Go выделил новый, побольше (<code>cap</code> " + was + " → " + C + "), перенёс туда старые значения и дописал " + v + ".",
                en:"No free cells were left, and the block cannot be stretched where it is — Go allocated a new, bigger one (<code>cap</code> " + was + " → " + C + "), carried the old values over and added " + v + "."};
       aTitle = {ru:"Новый кусок памяти: len " + L + ", cap " + C + (free ? " — свободные ячейки помечены ·" : ""),
                 en:"A new memory block: len " + L + ", cap " + C + (free ? " — free cells are marked ·" : "")};
     } else {
       aNote = {ru:"Переезда нет: занято было " + (L - 1) + " из " + C + ", и <code>append</code> просто занял следующую свободную ячейку. Адрес куска не менялся.",
                en:"No move: " + (L - 1) + " of " + C + " cells were taken, so <code>append</code> simply took the next free one. The block's address did not change."};
       aTitle = {ru:"Тот же кусок памяти: len " + L + ", cap " + C + (free ? " — свободных ячеек: " + free : ""),
                 en:"The same memory block: len " + L + ", cap " + C + (free ? " — free cells: " + free : "")};
     }
     steps.push({line: 2 * i, vars:vr(), out:out, cells:cells(), cellsOn:[L - 1], cellsTitle:aTitle, note:aNote});

     out += sl() + " " + L + " " + C + "\n";
     var pNote;
     if(L === C){
       pNote = {ru:"<code>len</code> и <code>cap</code> равны: всё выделенное занято. Следующий <code>append</code> потребует нового куска.",
                en:"<code>len</code> equals <code>cap</code>: everything allocated is taken. The next <code>append</code> will need a new block."};
     } else {
       pNote = {ru:"<b>Числа разошлись.</b> Элементов " + L + ", а места выделено под " + C + " — запас на " + free + " " + cRu(free) + ". Следующий <code>append</code> переезда не потребует.",
                en:"<b>The numbers diverge.</b> " + L + " elements, room allocated for " + C + " — spare capacity for " + free + " more " + cEn(free) + ". The next <code>append</code> will need no move."};
     }
     if(i === p.n){
       pNote = {ru:pNote.ru + " По шагам <code>cap</code> шёл так: " + seen.join(", ") + ". Выделять память под каждый элемент отдельно было бы слишком дорого, поэтому он растёт скачками.",
                en:pNote.en + " Step by step <code>cap</code> went: " + seen.join(", ") + ". Allocating memory for each element separately would be far too expensive, so it grows in jumps."};
     }
     steps.push({line: 2 * i + 1, vars:vr(), out:out, cells:cells(), cellsOn:busy(),
       cellsTitle:{ru:"Кусок памяти под a: len " + L + ", cap " + C + (free ? " — свободных ячеек: " + free + " (·)" : " — свободных ячеек нет"),
                   en:"Memory block for a: len " + L + ", cap " + C + (free ? " — free cells: " + free + " (·)" : " — no free cells")},
       note:pNote});
   }
   return steps;
 }
},
{
 name:{ru:"Срез делит память", en:"A slice piece shares memory"},
 params:[{key:"x", label:{ru:"начало", en:"start"}, min:0, max:2, def:1},
         {key:"y", label:{ru:"конец",  en:"end"},   min:3, max:5, def:3}],
 code: function(p){
   return ["a := []int{10, 20, 30, 40, 50}",
           "b := a[" + p.x + ":" + p.y + "]",
           "fmt.Println(b, len(b), cap(b))",
           "b[0] = 99",
           "fmt.Println(b)",
           "fmt.Println(a)"];
 },
 steps: function(p){
   var x = +p.x, y = +p.y, a = [10, 20, 30, 40, 50];
   var lb = y - x, cb = a.length - x, out = "", steps = [];
   function sl(arr){ return "[" + arr.join(" ") + "]"; }
   function part(){ return a.slice(x, y); }
   function rng(lo, hi){ var r = [], i; for(i = lo; i < hi; i++) r.push(i); return r; }
   function cells(){ var r = [], i; for(i = 0; i < a.length; i++) r.push(String(a[i])); return r; }
   function eRu(k){ return k === 1 ? "элемент" : (k < 5 ? "элемента" : "элементов"); }
   function cRu(k){ return k === 1 ? "ячейка" : (k < 5 ? "ячейки" : "ячеек"); }
   function cEn(k){ return k === 1 ? "cell" : "cells"; }
   var cellsWord = lb === 1 ? {ru:"ячейка " + x, en:"cell " + x}
                            : {ru:"ячейки с " + x + " по " + (y - 1), en:"cells " + x + " through " + (y - 1)};

   steps.push({line:0, vars:[["a", sl(a), "[]int"], ["len(a)", String(a.length), "int"]], out:out,
     cells:cells(), cellsOn:rng(0, a.length),
     cellsTitle:{ru:"Кусок памяти: a смотрит на все пять ячеек", en:"The memory block: a covers all five cells"},
     note:{ru:"Пять элементов, индексы от 0 до 4.", en:"Five elements, indices 0 through 4."}});

   steps.push({line:1, vars:[["a", sl(a), "[]int"], ["b", sl(part()), "[]int"]], out:out,
     cells:cells(), cellsOn:rng(x, y),
     cellsTitle:{ru:"Тот же кусок: b — это " + cellsWord.ru + ", больше ничего не появилось",
                 en:"The same block: b is " + cellsWord.en + ", nothing new appeared"},
     note:{ru:"Взяли индексы с " + x + " по " + (y - 1) + ": правая граница " + y + " не входит, поэтому элементов " + lb + ", а не " + (lb + 1) + ". Длина куска — это всегда <code>конец − начало</code>, тут " + y + " − " + x + " = " + lb + ". Новой памяти не выделено — <code>b</code> смотрит в тот же кусок.",
           en:"Indices " + x + " through " + (y - 1) + " were taken: the right bound " + y + " is excluded, so there are " + lb + " elements, not " + (lb + 1) + ". A piece's length is always <code>end − start</code>, here " + y + " − " + x + " = " + lb + ". No new memory was allocated — <code>b</code> looks into the same block."}});

   out += sl(part()) + " " + lb + " " + cb + "\n";
   steps.push({line:2, vars:[["a", sl(a), "[]int"], ["b", sl(part()), "[]int"], ["cap(b)", String(cb), "int"]], out:out,
     cells:cells(), cellsOn:rng(x, a.length),
     cellsTitle:{ru:"cap(b) = " + cb + ": от ячейки " + x + " до конца куска. Читать b может только первые " + lb + " из них",
                 en:"cap(b) = " + cb + ": from cell " + x + " to the end of the block. b can only read the first " + lb + " of them"},
     note:{ru:"<code>len(b)</code> равен " + lb + ", а <code>cap(b)</code> — " + cb + ": от индекса " + x + " до конца исходного куска остаётся " + cb + " " + cRu(cb) + ". Конец у обоих слайсов один и тот же, поэтому <code>cap</code> у среза считается не от нуля, а от его начала.",
           en:"<code>len(b)</code> is " + lb + " while <code>cap(b)</code> is " + cb + ": from index " + x + " to the end of the original block there are " + cb + " " + cEn(cb) + ". Both slices end at the same place, so a piece's <code>cap</code> is counted from its own start, not from zero."}});

   a[x] = 99;
   steps.push({line:3, vars:[["a", sl(a), "[]int"], ["b", sl(part()), "[]int"]], out:out,
     cells:cells(), cellsOn:[x],
     cellsTitle:{ru:"b[0] — это ячейка " + x + " общего куска. Она же a[" + x + "]",
                 en:"b[0] is cell " + x + " of the shared block. The same cell is a[" + x + "]"},
     note:{ru:"<b>Изменили только <code>b</code>, а поменялись оба.</b> Ячейка одна, и смотрят в неё две переменные: <code>b[0]</code> и <code>a[" + x + "]</code> — это одно и то же место.",
           en:"<b>Only <code>b</code> was edited, yet both changed.</b> There is one cell and two variables look into it: <code>b[0]</code> and <code>a[" + x + "]</code> are the same spot."}});

   out += sl(part()) + "\n";
   steps.push({line:4, vars:[["a", sl(a), "[]int"], ["b", sl(part()), "[]int"]], out:out,
     cells:cells(), cellsOn:rng(x, y),
     cellsTitle:{ru:"Печатается b — " + cellsWord.ru, en:"Printing b — " + cellsWord.en},
     note:{ru:"Ожидаемо: правили <code>b</code>, в нём " + lb + " " + eRu(lb) + ".",
           en:"As expected: <code>b</code> was the one edited, and it holds " + lb + "."}});

   out += sl(a) + "\n";
   steps.push({line:5, vars:[["a", sl(a), "[]int"], ["b", sl(part()), "[]int"]], out:out,
     cells:cells(), cellsOn:rng(0, a.length),
     cellsTitle:{ru:"Печатается a — весь кусок. Ячейку " + x + " никто в a не трогал, а она уже 99",
                 en:"Printing a — the whole block. Nobody touched cell " + x + " through a, yet it is already 99"},
     note:{ru:"А вот это ловит новичка: 99 вылезло в <code>a</code> на позиции " + x + ". Нужна независимая копия — <code>make</code> плюс <code>copy</code>.",
           en:"This is the one that catches beginners: 99 showed up in <code>a</code> at position " + x + ". If you need an independent copy — <code>make</code> plus <code>copy</code>."}});

   return steps;
 }
},
{
 name:{ru:"Слайс в функции", en:"A slice inside a function"},
 params:[{key:"n", label:{ru:"элементов", en:"elements"}, min:2, max:5, def:3}],
 code: function(p){
   var v = [], i;
   for(i = 1; i <= p.n; i++) v.push(i * 10);
   return ["func setFirst(s []int) {",
           "\ts[0] = 99",
           "}",
           "",
           "func addItem(s []int) {",
           "\ts = append(s, " + ((p.n + 1) * 10) + ")",
           "}",
           "",
           "func main() {",
           "\ta := []int{" + v.join(", ") + "}",
           "\tsetFirst(a)",
           "\tfmt.Println(a)",
           "\taddItem(a)",
           "\tfmt.Println(a)",
           "}"];
 },
 steps: function(p){
   var NEWCAP = {2:4, 3:6, 4:8, 5:10};      /* cap после append к слайсу, где len == cap == n */
   var n = +p.n, add = (n + 1) * 10, nc = NEWCAP[n];
   var a = [], i, out = "", steps = [];
   for(i = 1; i <= n; i++) a.push(i * 10);
   function sl(arr){ return "[" + arr.join(" ") + "]"; }
   function rng(lo, hi){ var r = [], k; for(k = lo; k < hi; k++) r.push(k); return r; }
   function cells(){ var r = [], k; for(k = 0; k < a.length; k++) r.push(String(a[k])); return r; }
   function big(){ var r = cells(), k; r.push(String(add)); for(k = n + 1; k < nc; k++) r.push("·"); return r; }

   steps.push({line:9, vars:[["a", sl(a), "[]int"], ["len(a)", String(n), "int"], ["cap(a)", String(n), "int"]], out:out,
     stack:["main()"], cells:cells(), cellsOn:rng(0, n),
     cellsTitle:{ru:"Кусок памяти под a: len " + n + ", cap " + n, en:"Memory block for a: len " + n + ", cap " + n},
     note:{ru:"Слайс создан из " + n + " чисел. В переменной лежит заголовок: адрес куска памяти, <code>len</code> и <code>cap</code>. У слайса из готовых значений <code>cap</code> равен <code>len</code> — лишнего места не выделяют.",
           en:"A slice of " + n + " numbers is created. The variable holds a header: the address of a memory block, <code>len</code> and <code>cap</code>. For a slice built from ready values <code>cap</code> equals <code>len</code> — no spare room is allocated."}});

   steps.push({line:10, vars:[["a", sl(a), "[]int"], ["s", sl(a), "[]int"]], out:out,
     stack:["main()", "setFirst(s)"], cells:cells(),
     cellsTitle:{ru:"Кусок памяти один: и a, и s смотрят сюда", en:"One memory block: both a and s look here"},
     note:{ru:"Вызов. В <code>s</code> скопировался заголовок — три поля. Данные не копировались: адрес в обеих переменных один и тот же.",
           en:"The call. The header — three fields — was copied into <code>s</code>. The data was not copied: both variables hold the same address."}});

   a[0] = 99;
   steps.push({line:1, vars:[["a", sl(a), "[]int"], ["s", sl(a), "[]int"]], out:out,
     stack:["main()", "setFirst(s)"], cells:cells(), cellsOn:[0],
     cellsTitle:{ru:"Функция пишет в ячейку 0 — а кусок общий с a", en:"The function writes into cell 0 — and the block is shared with a"},
     note:{ru:"Запись идёт по адресу, а адрес общий. <b>Изменение видно и снаружи.</b>",
           en:"The write goes through the address, and the address is shared. <b>The change is visible outside too.</b>"}});

   out += sl(a) + "\n";
   steps.push({line:11, vars:[["a", sl(a), "[]int"], ["len(a)", String(n), "int"]], out:out,
     stack:["main()"], cells:cells(), cellsOn:rng(0, n),
     cellsTitle:{ru:"Функция закончилась, ячейка 0 так и осталась изменённой", en:"The function is over and cell 0 stayed changed"},
     note:{ru:"Функция ничего не возвращала, а слайс изменился.", en:"The function returned nothing, yet the slice changed."}});

   steps.push({line:12, vars:[["a", sl(a), "[]int"], ["s", sl(a), "[]int"], ["cap(s)", String(n), "int"]], out:out,
     stack:["main()", "addItem(s)"], cells:cells(),
     cellsTitle:{ru:"Кусок по-прежнему один: len " + n + ", cap " + n + " — свободной ячейки нет",
                 en:"Still one block: len " + n + ", cap " + n + " — there is no free cell"},
     note:{ru:"Второй вызов. Снова копия заголовка, снова общие данные. Но <code>len</code> у копии свой.",
           en:"The second call. Again a header copy, again shared data. But the copy has its own <code>len</code>."}});

   var grown = a.concat([add]);
   steps.push({line:5, vars:[["a", sl(a), "[]int"], ["s", sl(grown), "[]int"], ["len(s)", String(n + 1), "int"]], out:out,
     stack:["main()", "addItem(s)"], cells:big(), cellsOn:[n],
     cellsTitle:{ru:"ВТОРОЙ кусок памяти — под s: len " + (n + 1) + ", cap " + nc + ". Кусок a остался прежним, из " + n + " ячеек",
                 en:"A SECOND memory block — for s: len " + (n + 1) + ", cap " + nc + ". The block of a stayed as it was, " + n + " cells"},
     note:{ru:"<code>cap</code> был заполнен, поэтому <code>append</code> выделил новый кусок (cap " + n + " → " + nc + ") и перенёс туда данные. <code>s</code> смотрит на новое место, <code>a</code> — на старое. <b>Связь разорвана.</b>",
           en:"<code>cap</code> was full, so <code>append</code> allocated a new block (cap " + n + " → " + nc + ") and moved the data there. <code>s</code> points at the new place, <code>a</code> at the old one. <b>The link is broken.</b>"}});

   out += sl(a) + "\n";
   steps.push({line:13, vars:[["a", sl(a), "[]int"], ["len(a)", String(n), "int"]], out:out,
     stack:["main()"], cells:cells(), cellsOn:rng(0, n),
     cellsTitle:{ru:"Снова кусок a: " + n + " ячеек. Второй кусок исчез вместе с s",
                 en:"The block of a again: " + n + " cells. The second block vanished along with s"},
     note:{ru:"Функция закончилась, <code>s</code> исчез вместе с " + add + ". Обе строки вывода одинаковые, хотя внутри функции слайс был длиннее. Чтобы <code>append</code> был виден снаружи, функция должна вернуть слайс: <code>a = addItem(a)</code>.",
           en:"The function ended and <code>s</code> vanished along with " + add + ". Both output lines are identical, although inside the function the slice was longer. For an <code>append</code> to be visible outside, the function must return the slice: <code>a = addItem(a)</code>."}});

   return steps;
 }
},
{
 name:{ru:"Присваивание против copy", en:"Assignment vs copy"},
 params:[{key:"k", label:{ru:"длина c", en:"len of c"}, min:1, max:5, def:3}],
 code: function(p){
   return ["a := []int{10, 20, 30}",
           "b := a",
           "b[0] = 99",
           "fmt.Println(a, b)",
           "c := make([]int, " + p.k + ")",
           "copy(c, a)",
           "c[0] = 7",
           "fmt.Println(a, c)"];
 },
 steps: function(p){
   var k = +p.k, a = [10, 20, 30], c = [], moved = Math.min(k, a.length);
   var out = "", steps = [], i;
   function sl(arr){ return "[" + arr.join(" ") + "]"; }
   function rng(lo, hi){ var r = [], j; for(j = lo; j < hi; j++) r.push(j); return r; }
   function cells(arr){ var r = [], j; for(j = 0; j < arr.length; j++) r.push(String(arr[j])); return r; }
   function cRu(q){ return q === 1 ? "ячейка" : (q < 5 ? "ячейки" : "ячеек"); }
   function cEn(q){ return q === 1 ? "cell" : "cells"; }

   steps.push({line:0, vars:[["a", sl(a), "[]int"]], out:out,
     cells:cells(a), cellsOn:rng(0, 3),
     cellsTitle:{ru:"Кусок памяти №1 — сюда смотрит a", en:"Memory block #1 — a looks here"},
     note:{ru:"Один кусок памяти на три числа.", en:"One memory block holding three numbers."}});

   steps.push({line:1, vars:[["a", sl(a), "[]int"], ["b", sl(a), "[]int"]], out:out,
     cells:cells(a),
     cellsTitle:{ru:"Кусок памяти №1 — теперь сюда смотрят и a, и b. Второго куска не появилось",
                 en:"Memory block #1 — now both a and b look here. No second block appeared"},
     note:{ru:"Скопирован заголовок, не данные. Адрес у <code>a</code> и <code>b</code> одинаковый.",
           en:"The header was copied, not the data. <code>a</code> and <code>b</code> hold the same address."}});

   a[0] = 99;
   steps.push({line:2, vars:[["a", sl(a), "[]int"], ["b", sl(a), "[]int"]], out:out,
     cells:cells(a), cellsOn:[0],
     cellsTitle:{ru:"b[0] — это ячейка 0 куска №1. Она же a[0]", en:"b[0] is cell 0 of block #1. The same cell is a[0]"},
     note:{ru:"<b>Правили <code>b</code>, изменился и <code>a</code>.</b> Компилятор на это ничего не скажет.",
           en:"<b><code>b</code> was edited and <code>a</code> changed too.</b> The compiler has nothing to say about it."}});

   out += sl(a) + " " + sl(a) + "\n";
   steps.push({line:3, vars:[["a", sl(a), "[]int"], ["b", sl(a), "[]int"]], out:out,
     cells:cells(a), cellsOn:rng(0, 3),
     cellsTitle:{ru:"Кусок №1: и a, и b напечатаны из этих трёх ячеек", en:"Block #1: both a and b were printed from these three cells"},
     note:{ru:"Два слайса, одни данные.", en:"Two slices, one set of data."}});

   for(i = 0; i < k; i++) c.push(0);
   steps.push({line:4, vars:[["a", sl(a), "[]int"], ["c", sl(c), "[]int"], ["len(c)", String(k), "int"]], out:out,
     cells:cells(c), cellsOn:rng(0, k),
     cellsTitle:{ru:"Кусок памяти №2 — новый, пока в нулях, " + k + " " + cRu(k) + ". Смотрит на него только c",
                 en:"Memory block #2 — brand new, zeros so far, " + k + " " + cEn(k) + ". Only c looks at it"},
     note:{ru:"<code>make</code> выделил свой кусок на " + k + " " + cRu(k) + " и заполнил нулями. Это уже второй кусок памяти в программе.",
           en:"<code>make</code> allocated its own block of " + k + " " + cEn(k) + " and filled it with zeros. That is the second memory block in the program."}});

   for(i = 0; i < moved; i++) c[i] = a[i];
   var cpNote;
   if(k < 3){
     cpNote = {ru:"<code>copy</code> перенёс только " + moved + " из 3 — сколько поместилось в приёмник. Об остальном он не сообщает: ни компилятор, ни запуск не пожалуются, данные просто потерялись. Поэтому длину берут от источника: <code>make([]int, len(a))</code>.",
               en:"<code>copy</code> moved only " + moved + " of 3 — as many as fit into the destination. It reports nothing about the rest: neither the compiler nor the run complains, the data is simply lost. That's why the length is taken from the source: <code>make([]int, len(a))</code>."};
   } else if(k === 3){
     cpNote = {ru:"<code>copy</code> перенёс все 3 значения из <code>a</code> в <code>c</code>: длина совпала. В коде её так и пишут — <code>make([]int, len(a))</code>, чтобы совпадала сама. Значения одинаковые, куски памяти разные.",
               en:"<code>copy</code> moved all 3 values from <code>a</code> into <code>c</code>: the lengths matched. In code you write it as <code>make([]int, len(a))</code> so that it matches by itself. Same values, different memory blocks."};
   } else {
     cpNote = {ru:"<code>copy</code> перенёс 3 значения — больше в <code>a</code> и не было. Лишние " + (k - 3) + " " + cRu(k - 3) + " приёмника так и остались нулями: <code>copy</code> идёт по короткому из двух.",
               en:"<code>copy</code> moved 3 values — <code>a</code> had no more. The extra " + (k - 3) + " " + cEn(k - 3) + " of the destination stayed zero: <code>copy</code> follows the shorter of the two."};
   }
   steps.push({line:5, vars:[["a", sl(a), "[]int"], ["c", sl(c), "[]int"]], out:out,
     cells:cells(c), cellsOn:rng(0, moved),
     cellsTitle:{ru:"Кусок №2: copy переписал сюда " + moved + " " + (moved === 1 ? "значение" : (moved < 5 ? "значения" : "значений")) + " из куска №1",
                 en:"Block #2: copy wrote " + moved + " value" + (moved === 1 ? "" : "s") + " from block #1 in here"},
     note:cpNote});

   c[0] = 7;
   steps.push({line:6, vars:[["a", sl(a), "[]int"], ["c", sl(c), "[]int"]], out:out,
     cells:cells(c), cellsOn:[0],
     cellsTitle:{ru:"Пишем в ячейку 0 куска №2. В куске №1 на этом месте так и лежит 99",
                 en:"Writing into cell 0 of block #2. In block #1 that same spot still holds 99"},
     note:{ru:"Изменился только <code>c</code>. Вот теперь копия настоящая: у неё свой кусок памяти.",
           en:"Only <code>c</code> changed. Now the copy is a real one: it has its own memory block."}});

   out += sl(a) + " " + sl(c) + "\n";
   steps.push({line:7, vars:[["a", sl(a), "[]int"], ["c", sl(c), "[]int"]], out:out,
     cells:cells(c), cellsOn:rng(0, k),
     cellsTitle:{ru:"Кусок №2 — это c: " + sl(c) + ". Кусок №1 — это a: " + sl(a) + ", он не менялся",
                 en:"Block #2 is c: " + sl(c) + ". Block #1 is a: " + sl(a) + ", unchanged"},
     note:{ru:"Сравни две строки вывода — в этом вся разница между <code>b := a</code> и <code>make</code> плюс <code>copy</code>.",
           en:"Compare the two output lines — that is the whole difference between <code>b := a</code> and <code>make</code> plus <code>copy</code>."}});

   return steps;
 }
}
];

/* ================= ЧТО ИЗ ЭТОГО СКЛАДЫВАЕТСЯ ================= */
var OUTRO = {
 ru:`<p>Все семь правил — следствия одного устройства. Слайс это три поля: адрес куска памяти, сколько ячеек занято (<code>len</code>) и сколько выделено (<code>cap</code>). Остальное выводится отсюда. Размера нет в типе — потому что он лежит в <code>len</code>. <code>append</code> возвращает результат — потому что при нехватке места меняется адрес, и новый адрес надо кому-то отдать. Срез не копирует — потому что берёт тот же адрес, только с другого места. Функция меняет элемент, но не длину — потому что адрес у копии заголовка общий, а <code>len</code> свой.</p>
<p>Что ты теперь умеешь: держать список, длина которого заранее неизвестна, наращивать его в цикле, брать из него куски, проходить двумя видами циклов, отдавать в функцию — и заранее понимать, что вызвавший код увидит, а что нет. Плюс делать копию, которая действительно копия, а не второе имя для тех же данных.</p>
<p>Если из темы забудется всё, кроме одной мысли, пусть останется эта: <strong>переменная-слайс не содержит данных, она на них указывает</strong>. Отсюда выводятся и <code>a = append(...)</code>, и <code>make</code> с <code>copy</code>, и разница между <code>s[0] = 99</code> и <code>s = append(s, ...)</code> внутри функции. А когда код со слайсами ведёт себя странно, первый вопрос всегда один: сколько тут кусков памяти — один или два?</p>`,
 en:`<p>All seven rules follow from one piece of machinery. A slice is three fields: the address of a memory block, how many cells are taken (<code>len</code>) and how many were allocated (<code>cap</code>). Everything else falls out of that. There is no size in the type — because the size lives in <code>len</code>. <code>append</code> returns a result — because when room runs out the address changes, and the new address has to be handed to someone. Slicing doesn't copy — because it takes the same address, just from a different spot. A function changes an element but not the length — because the header copy shares the address while <code>len</code> is its own.</p>
<p>What you can do now: hold a list whose length isn't known in advance, grow it in a loop, take pieces out of it, walk it with either kind of loop, hand it to a function — and know in advance what the calling code will see and what it won't. Plus make a copy that really is a copy, not a second name for the same data.</p>
<p>If everything from this topic fades except one thought, let it be this: <strong>a slice variable doesn't contain the data, it points at it</strong>. From there follow <code>a = append(...)</code>, <code>make</code> plus <code>copy</code>, and the difference between <code>s[0] = 99</code> and <code>s = append(s, ...)</code> inside a function. And when slice code behaves strangely, the first question is always the same: how many memory blocks are there — one or two?</p>`
};
