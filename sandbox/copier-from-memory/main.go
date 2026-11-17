// загружаем пакеты
package main

import (
	"fmt"
	"os"
)

// функция main и первый кусок где ставим условие под 3 значения
func main() {
	if len(os.Args) != 3{
		fmt.Println("error: <in> <out>")
		return
	}

	// второй кусок кода назначаем переменный на вход и вывод
	input := os.Args[1]
	output := os.Args[2]

	// третий кусок кода чтение
	data, err := os.ReadFile(input)
	if err != nil {
		fmt.Println("error", err)
		return
	}

	// четвертый кусок кода писание
	text := string(data)
	err = os.WriteFile(output, []byte(text), 0644)
	if err != nil {
		fmt.Println("error", err)
		return
	}
}