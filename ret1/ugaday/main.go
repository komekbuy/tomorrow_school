package main

import "fmt"

// ============================================================
// ПРАВИЛА: сначала УГАДАЙ вывод каждого примера и запиши.
// Только потом:  cd ~/Documents/tomorrow_school/ret1
//                go run ./ugaday
// Сравни свои ответы с реальным выводом.
// ============================================================

// --- 1 --- базовый: return отдаёт значение
func p1(n int) int {
	return n + 1
}

// --- 2 --- отличие от 1: ДВА return подряд
func p2(n int) int {
	return n + 1
	return n + 100
}

// --- 3 --- отличие от 2: печать до return и печать после него
func p3(n int) int {
	fmt.Println("   печать ДО return")
	return n + 1
	fmt.Println("   печать ПОСЛЕ return")
	return 0
}

// --- 4 --- отличие от 3: return переехал в цикл
func p4(n int) int {
	for i := 1; i <= n; i++ {
		fmt.Println("   шаг", i)
		return i
	}
	return 0
}

// --- 5 --- отличие от 4: return убрали из цикла
func p5(n int) int {
	x := 0
	for i := 1; i <= n; i++ {
		x = x + i
	}
	return x
}

// --- 6 --- отличие от 5: внутри x = i вместо x = x + i
func p6(n int) int {
	x := 0
	for i := 1; i <= n; i++ {
		x = i
	}
	return x
}

// --- 7 --- отличие от 6: x создаётся ВНУТРИ цикла
func p7(n int) int {
	x := 0
	for i := 1; i <= n; i++ {
		x := 0
		x = x + i
		_ = x
	}
	return x
}

// --- 8 --- отличие от 5: цикл идёт ВНИЗ
func p8(n int) int {
	x := 0
	for i := n; i > 0; i-- {
		x = x + i
	}
	return x
}

// --- 9 --- функция ПЕЧАТАЕТ, а не возвращает
func p9(n int) {
	fmt.Println("   p9 напечатала", n+1)
}

// --- 10 --- return внутри if, без else
func p10(n int) string {
	if n > 0 {
		return "плюс"
	}
	if n < 0 {
		return "минус"
	}
	return "ноль"
}

func main() {
	fmt.Println("1:", p1(5))
	fmt.Println("2:", p2(5))
	fmt.Println("3:", p3(5))
	fmt.Println("4:", p4(4))
	fmt.Println("5:", p5(4))
	fmt.Println("6:", p6(4))
	fmt.Println("7:", p7(4))
	fmt.Println("8:", p8(4))
	fmt.Print("9: ")
	p9(5)
	fmt.Println("10:", p10(7), p10(-7), p10(0))
}
