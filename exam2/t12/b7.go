package main

import "fmt"

func CountChar(s string, target rune) int {
	count := 0
	for _, c := range s {
		if c == target {
			count++
		}
	}
	return count
}

func main() {
	fmt.Println(CountChar("banana", 'a'))
}
