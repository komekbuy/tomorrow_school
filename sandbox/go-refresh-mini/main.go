package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) != 3 {
		fmt.Println("usage: go run . <in> <out>")
		return
	}

	input := os.Args[1]
	output := os.Args[2]

	data, err := os.ReadFile(input)
	if err != nil {
		fmt.Println("error:", err)
		return
	}

	text := string(data)

	err = os.WriteFile(output, []byte(text), 0644)
	if err != nil {
		fmt.Println("error:", err)
		return
	}
}
