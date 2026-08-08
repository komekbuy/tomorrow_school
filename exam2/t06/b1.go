package main

import "fmt"

func CountLetters(s string) int {
	count := 0
	for _, c := range s {
		if (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') {
			count++
		}
	}
	return count
}

func main() {
	fmt.Println(CountLetters("Hello world"))
	fmt.Println(CountLetters("H e l l o"))
	fmt.Println(CountLetters("w|o|r|l|d"))
}
