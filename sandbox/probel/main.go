package main

import "fmt"

func main() {
	// A — ровно как у тебя в task1: число и строка-пробел
	fmt.Print(42, " ")
	fmt.Print("|конец A\n")

	// B — то же самое, но вторым аргументом ЧИСЛО, а не строка
	fmt.Print(42, 7)
	fmt.Print("|конец B\n")

	// C — три числа подряд, ни одного пробела руками не поставлено
	fmt.Print(1, 2, 3)
	fmt.Print("|конец C\n")
}
