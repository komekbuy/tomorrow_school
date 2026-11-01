// Paper test after the break: 12 questions, the answers come from this run.
// Тест на бумаге после перерыва: 12 вопросов, ответы — из этого запуска.
package main

import "fmt"

// add returns the sum of a and b.
// add возвращает сумму a и b.
func add(a, b int) int {
	return a + b
}

func main() {
	// 1: = puts a new value into x, the old one is gone.
	// 1: = кладёт новое значение в x, старое исчезает.
	fmt.Print("1: ")
	x := 3
	x = x + 2
	fmt.Println(x)

	// 2: integers divide without a fraction; % gives the remainder.
	// 2: целые делятся без дроби; % даёт остаток.
	fmt.Print("2: ")
	fmt.Println(7/2, 7%2)

	// 3: s[0] is a byte — a number, not a letter.
	// 3: s[0] — байт, то есть число, а не буква.
	fmt.Print("3: ")
	s := "Go"
	fmt.Println(len(s), s[0])

	// 4: positions start at 0; len counts the elements.
	// 4: позиции считаются с 0; len считает элементы.
	fmt.Print("4: ")
	nums := []int{4, 5, 6}
	fmt.Println(nums[1], len(nums))

	// 5: Print adds no spaces and no newline.
	// 5: Print не ставит ни пробелов, ни перевода строки.
	fmt.Print("5: ")
	for i := 0; i < 3; i++ {
		fmt.Print(i)
	}
	fmt.Println()

	// 6: range over a slice gives a pair: position and value.
	// 6: range по срезу даёт пару: позицию и значение.
	fmt.Println("6:")
	for i, v := range []string{"a", "b"} {
		fmt.Println(i, v)
	}

	// 7: && joins two checks into one answer: true only when both are true.
	// 7: && склеивает две проверки в один ответ: true, только когда обе true.
	fmt.Print("7: ")
	y := 5
	fmt.Println(y > 3 && y < 5)

	// 8: add gives back 5, then main multiplies it by 2.
	// 8: add отдаёт 5, потом main умножает на 2.
	fmt.Print("8: ")
	fmt.Println(add(2, 3) * 2)

	// 9: a missing key gives the zero value of the type: 0 for int.
	// 9: нет ключа — получаем нулевое значение типа: у int это 0.
	fmt.Print("9: ")
	m := map[string]int{"a": 1}
	fmt.Println(m["b"])

	// 10: 3 != 3 is false, so the else branch runs.
	// 10: 3 != 3 — ложь, поэтому работает ветка else.
	fmt.Print("10: ")
	if 3 != 3 {
		fmt.Println("A")
	} else {
		fmt.Println("B")
	}

	// 11: 'a' is a rune — a number; string('a') turns it into text.
	// 11: 'a' — руна, то есть число; string('a') превращает его в текст.
	fmt.Print("11: ")
	fmt.Println('a', string('a'))

	// 12: := inside the braces creates a new z; the outer z stays 10.
	// 12: := внутри скобок создаёт новую z; внешняя z остаётся 10.
	fmt.Print("12: ")
	z := 10
	if z > 5 {
		z := 1
		z++
	}
	fmt.Println(z)
}
