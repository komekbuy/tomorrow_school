package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) != 3 { //подсмотрел
		fmt.Println("usage: go run . <in> <out") //подсмотрел
		return //подсмотрел
	}

	input := os.Args[1]
	output := os.Args[2]

	data, err := os.ReadFile(input) //подсмотрел
	if err != nil { //подсмотрел
		fmt.Println("error:", err) //подсмотрел
		return //подсмотрел
	}

	text := string(data) //подсмотрел
	err = os.WriteFile(output, []byte(text), 0644) //подсмотрел
	if err != nil { //подсмотрел
		fmt.Println("error:", err) //подсмотрел
		return //подсмотрел
	}
}

