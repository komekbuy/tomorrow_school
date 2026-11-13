// 1 начало кода импорт пакетов
package main

import (
	"fmt"
	"os"
)

// 2 фанкция main проверка на то что количество файлов не равно 3
func main() {
	if len(os.Args) != 3 {
		fmt.Println("usage: go run . <in> <out>") //подсмотрел
		return
	}

	// 3 присвоить переменные входа и выход
	input := os.Args[1]
	output := os.Args[2]

	// 4 чтение файла + ошибка
	data, err := os.ReadFile(input)
	if err != nil {
		fmt.Println("error", err) //подсмотрел
		return
	}

	// 3 запись файлы
		text := string(data)

		err = os.WriteFile(output, []byte(text), 0644) // подсмотрел именно 0644
		if err != nil {
			fmt.Println("error", err)
			return
		}

}