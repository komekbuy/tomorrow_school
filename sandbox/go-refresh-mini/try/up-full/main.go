// Step 2 of the go-refresh ladder: the (up) tag, the whole program
// Ступень 2 лесенки go-refresh: тег (up), программа целиком
package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	// Check: the command must have three words — program, input, output
	// Проверка: в команде три слова — программа, вход, выход
	if len(os.Args) != 3 {
		fmt.Println("error: <in> <out>")
		return
	}

	// Names: which file to read and which file to write
	// Имена: какой файл читать и в какой писать
	input := os.Args[1]
	output := os.Args[2]

	// Read the input file
	// Прочитать входной файл
	data, err := os.ReadFile(input)
	if err != nil {
		fmt.Println("error", err)
		return
	}

	// Bytes to text, so we can edit it
	// Байты в текст, чтобы можно было править
	text := string(data)

	// Words: cut the text into words by spaces
	// Слова: порезать текст на слова по пробелам
	words := strings.Fields(text)

	// Uppercase: on the (up) tag, make the word before it uppercase
	// Заглавные: на теге (up) слово перед ним — заглавными
	for i, w := range words {
		if w == "(up)" {
			words[i-1] = strings.ToUpper(words[i-1])
		}
	}

	// Without the tag: move every word except (up) into result
	// Без тега: переложить в result все слова, кроме (up)
	result := []string{}
	for _, w := range words {
		if w != "(up)" {
			result = append(result, w)
		}
	}

	// Glue: join the words back into text with a space between them
	// Склейка: собрать слова обратно в текст, между ними пробел
	text = strings.Join(result, " ")

	// Write the text to the output file
	// Записать текст в выходной файл
	err = os.WriteFile(output, []byte(text), 0644)
	if err != nil {
		fmt.Println("error", err)
		return
	}
}
