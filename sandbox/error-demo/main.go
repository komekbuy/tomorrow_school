package main

import (
	"errors"
	"fmt"
	"os"
	"strconv"
)

// своя функция, которая возвращает ошибку
func divide(a, b int) (int, error) {
	if b == 0 {
		return 0, errors.New("на ноль делить нельзя")
	}
	return a / b, nil
}

func main() {
	// 1. error — это обычное ЗНАЧЕНИЕ, его можно напечатать
	n, err := strconv.Atoi("123")
	fmt.Println("Atoi(\"123\"):", n, "| err =", err)

	n, err = strconv.Atoi("abc")
	fmt.Println("Atoi(\"abc\"):", n, "| err =", err)

	// 2. nil означает "ошибки не было"
	fmt.Println("err == nil ?", err == nil)

	// 3. типовая проверка
	if _, err := strconv.Atoi("77x"); err != nil {
		fmt.Println("поймали ошибку:", err)
	}

	// 4. своя ошибка
	res, err := divide(10, 2)
	fmt.Println("divide(10,2):", res, "| err =", err)
	res, err = divide(10, 0)
	fmt.Println("divide(10,0):", res, "| err =", err)

	// 5. ошибка от файла — которого нет
	f, err := os.Open("нет-такого-файла.txt")
	fmt.Println("os.Open:", f, "| err =", err)

	// 6. что бывает, если ошибку ПРОИГНОРИРОВАТЬ
	bad, _ := strconv.Atoi("abc")
	fmt.Println("проигнорировали err, работаем с", bad, "— тихо неверный результат")
}
