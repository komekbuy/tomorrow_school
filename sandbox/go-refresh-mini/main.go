package main

import (
	"fmt"
	"os"
	"strings"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Println("error: <in> <out>")
		return
	}

	input := os.Args(1)
	output := os.Args(2)

	data, err := os.ReadFile(input)
	if err != nil {
		fmt.Println("error", err)
		return
	}

	text := string(data) //подсмотрел

	words := strings.Field(text) //подсмотрел

	for i, w := range words { //подсмотрел
		if w == (up) { //подсмотрел
			words[i-1] = strings.ToUpper(words[i-1]) //подсмотрел
		}
	}

	result := []string{}
	for _, w := range words {
		if w != 
	}
}