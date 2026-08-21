package main

import "fmt"

// меняет элемент — снаружи видно
func changeElem(s []int) { s[0] = 999 }

// добавляет через append — снаружи НЕ видно
func addElem(s []int) { s = append(s, 777) }

func main() {
	// 1. массив против слайса
	var arr [3]int // массив: размер 3 вшит в ТИП
	var sl []int   // слайс: размера в типе нет
	fmt.Printf("массив %T len=%d | слайс %T len=%d nil? %v\n", arr, len(arr), sl, len(sl), sl == nil)

	// 2. len и cap — два разных числа
	s := make([]int, 3, 8)
	fmt.Println("make([]int,3,8):", s, "len:", len(s), "cap:", cap(s))

	// 3. как растёт cap при append
	g := []int{}
	fmt.Println("рост cap:")
	for i := 1; i <= 9; i++ {
		g = append(g, i)
		fmt.Printf("  добавили %d-й: len=%d cap=%d\n", i, len(g), cap(g))
	}

	// 4. слайс — ОКНО в массив. два слайса могут смотреть в одни данные
	base := []int{10, 20, 30, 40, 50}
	window := base[1:3] // элементы с индекса 1 по 2
	fmt.Println("\nbase:", base, "| window = base[1:3]:", window, "len:", len(window), "cap:", cap(window))
	window[0] = 111
	fmt.Println("поменяли window[0] → base стал:", base, "  ← ЧУЖОЙ слайс изменился")

	// 5. копия слайса тоже смотрит в те же данные
	copyBySign := base
	copyBySign[4] = 555
	fmt.Println("после copyBySign[4]=555 → base:", base)

	// настоящая копия делается через copy
	real := make([]int, len(base))
	copy(real, base)
	real[0] = 0
	fmt.Println("после real[0]=0 → base:", base, "| real:", real)

	// 6. передача в функцию
	t := []int{1, 2, 3}
	changeElem(t)
	fmt.Println("\nпосле changeElem:", t, "  ← элемент изменился")
	addElem(t)
	fmt.Println("после addElem:  ", t, "  ← 777 НЕ появился")
}
