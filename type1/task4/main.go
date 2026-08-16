package main

import "fmt"

func main() {
	text := "Привет, Go"
	count := 0
	for range text {
		count++
	}

	fmt.Println(len(text), count)
}
