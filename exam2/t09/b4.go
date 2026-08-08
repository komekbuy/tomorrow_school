package main

import "fmt"

func CountUpper(s string) int {
	count := 0
	for _, c := range s {
		if c >= 'A' && c <= 'Z' {
			count++
		}
	}
	return count
}

func main() {
	fmt.Println(CountUpper("Hello World"))
}
