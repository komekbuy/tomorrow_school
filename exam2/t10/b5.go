package main

import "fmt"

func CountRunes(s string) int {
	count := 0
	for range s {
		count++
	}
	return count
}

func main() {
	fmt.Println(CountRunes("Hello"))
	fmt.Println(CountRunes("Привет"))
	fmt.Println()
}
