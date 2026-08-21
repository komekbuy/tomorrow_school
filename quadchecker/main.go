package main

import (
	"bufio"
	"fmt"
	"os"
)

// quad holds the characters that one drawing function uses.
// quad хранит символы, которыми рисует одна функция.
// Every quad draws the same shape, only the characters are different.
// Все quad рисуют одну и ту же фигуру, отличаются только символы.
type quad struct {
	name string
	tl   rune // top left corner — левый верхний угол
	tr   rune // top right corner — правый верхний угол
	bl   rune // bottom left corner — левый нижний угол
	br   rune // bottom right corner — правый нижний угол
	hor  rune // top and bottom line — верхняя и нижняя линии
	ver  rune // left and right line — левая и правая линии
}

// quads is the list of all five drawing functions.
// quads — список всех пяти рисующих функций.
// The answer is printed in this order, so the order here matters.
// Ответ печатается в этом же порядке, поэтому порядок здесь важен.
var quads = []quad{
	{"quadA", 'o', 'o', 'o', 'o', '-', '|'},
	{"quadB", '/', '\\', '\\', '/', '*', '*'},
	{"quadC", 'A', 'A', 'C', 'C', 'B', 'B'},
	{"quadD", 'A', 'C', 'A', 'C', 'B', 'B'},
	{"quadE", 'A', 'C', 'C', 'A', 'B', 'B'},
}

// cell returns the character for one box of the picture.
// cell возвращает символ одной клетки картинки.
// row and col are the place of the box, w and h are width and height.
// row и col — место клетки, w и h — ширина и высота.
// Corners are asked first, because a corner is also on a line.
// Углы проверяются первыми, потому что угол стоит ещё и на линии.
// A box that is not on a corner and not on a line is empty.
// Клетка, которая не угол и не линия, — пробел.
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

// match draws the picture of quad q and compares it with the input.
// match рисует картинку фигуры q и сравнивает её с введённой.
// It builds one full line, then compares that line with the input line.
// Собирает одну целую строку и сравнивает её со строкой ввода.
// One different line is enough to say no, so it returns false at once.
// Одной несовпавшей строки достаточно для отказа — сразу возвращает false.
// It returns true only after all lines are compared and all are equal.
// true возвращается только после того, как все строки сверены и все совпали.
func match(q quad, lines []string, w, h int) bool {
	for row := 0; row < h; row++ {
		line := make([]rune, w)
		for col := 0; col < w; col++ {
			line[col] = cell(q, row, col, w, h)
		}
		if string(line) != lines[row] {
			return false
		}
	}
	return true
}

func main() {
	// Read the picture from standard input, one line at a time.
	// Читаем картинку со стандартного ввода, по одной строке за раз.
	// Scan returns false when the input is over.
	// Scan возвращает false, когда ввод закончился.
	lines := []string{}
	sc := bufio.NewScanner(os.Stdin)
	for sc.Scan() {
		lines = append(lines, sc.Text())
	}

	// Find the size of the picture.
	// Определяем размер картинки.
	// h is how many lines came in, w is the length of the first line.
	// h — сколько строк пришло, w — длина первой строки.
	// same stays true only if every line has that same length,
	// same останется true только если у всех строк такая же длина,
	// because a quad function always draws a rectangle.
	// потому что функция quad всегда рисует прямоугольник.
	h := len(lines)
	w := 0
	same := true
	if h > 0 {
		w = len(lines[0])
		for _, l := range lines {
			if len(l) != w {
				same = false
			}
		}
	}

	// Try every quad and keep the name of each one that fits.
	// Пробуем каждую фигуру и запоминаем имя каждой подошедшей.
	// A picture can fit more than one quad, so the names are joined by " || ".
	// Картинке может подойти больше одной фигуры, поэтому имена склеиваются через " || ".
	// The separator is added before a name only when res is not empty.
	// Разделитель ставится перед именем только когда res не пуст.
	res := ""
	if h > 0 && w > 0 && same {
		for _, q := range quads {
			if match(q, lines, w, h) {
				if res != "" {
					res += " || "
				}
				res += fmt.Sprintf("[%s] [%d] [%d]", q.name, w, h)
			}
		}
	}

	// An empty res means no quad drew this picture.
	// Пустой res значит, что эту картинку не нарисовала ни одна фигура.
	// The program prints one time only, here.
	// Программа печатает один раз и только здесь.
	if res == "" {
		res = "Not a quad function"
	}
	fmt.Println(res)
}
