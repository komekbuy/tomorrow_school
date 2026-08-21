package main

import "fmt"

func main() {
	// slice: ключ = индекс, только целое число 0..len-1
	s := []string{"aa", "bb", "cc"}
	fmt.Println("slice:", s, "len:", len(s), "s[1]:", s[1])

	// map: ключ = любое сравнимое значение, здесь строка
	m := map[string]int{"aa": 10, "bb": 20}
	fmt.Println("map:", m, "len:", len(m), "m[\"bb\"]:", m["bb"])

	// 1. отсутствующий ключ НЕ паникует — отдаёт нулевое значение типа
	fmt.Println("m[\"zz\"] =", m["zz"])
	// у слайса тот же выход за границу = паника (закомментировано, иначе программа падает)
	// fmt.Println(s[99])

	// 2. как отличить "нет ключа" от "есть, но 0" — comma ok
	m["zero"] = 0
	v, ok := m["zero"]
	fmt.Println("zero:", v, "есть?", ok)
	v, ok = m["net"]
	fmt.Println("net: ", v, "есть?", ok)

	// 3. добавление: у map просто присваивание, у слайса нужен append
	m["cc"] = 30
	s = append(s, "dd")
	fmt.Println("после добавления:", m, s)

	// 4. удаление: у map есть delete, у слайса нет
	delete(m, "aa")
	fmt.Println("после delete:", m)

	// 5. nil: читать можно у обоих, писать в nil map = паника
	var nilMap map[string]int
	var nilSlice []string
	fmt.Println("nil map читаем:", nilMap["x"], "len:", len(nilMap))
	nilSlice = append(nilSlice, "ok") // append в nil слайс работает
	fmt.Println("nil slice после append:", nilSlice)

	// 6. порядок обхода: слайс всегда по порядку, map — случайно
	fmt.Print("range slice: ")
	for _, x := range s {
		fmt.Print(x, " ")
	}
	fmt.Println()
	for try := 1; try <= 3; try++ {
		fmt.Print("range map, попытка ", try, ": ")
		for k := range m {
			fmt.Print(k, " ")
		}
		fmt.Println()
	}
}
