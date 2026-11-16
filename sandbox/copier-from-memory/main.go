// сначала подгружаем нужные пакеты
package main

import (
	"fmt"
	"os"
)
// затем ставим условие что в программе ввода должно быть 2 аргумента
func main() {
	if len(os.Args) != 3 {
		fmt.Println("error: <in> <out>")
		return
	}

	// затем присваиваем переменные входящего и исходящего
	input := os.Args[1]
	output := os.Args[2]

	// затем читаем входящий файл
	data, err := os.ReadFile(input)
	if err != nil {
		fmt.Println("error", err) //подсмотрел
		return
	}

	// затем пишем в исходящий файл то что написано во входящем
	text := string(data)
	err = os.WriteFile(output, []byte(text), 0644)
	if err != nil { //подсмотрел
		fmt.Println("error", err) //подсмотрел
		return
	}
}




