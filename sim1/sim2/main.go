package main

import "fmt"

func CountNonLetters(s string) int {
	count := 0
	for _, c := range s {
		if !((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')) {
			count++
		}
	}
	return count
}

func main() {
	fmt.Println(CountNonLetters("Hello world"))
	fmt.Println(CountNonLetters("a1b2c3"))
	fmt.Println(CountNonLetters("abc"))
	fmt.Println(CountNonLetters("12 34"))
	fmt.Println(CountNonLetters(""))
	fmt.Println(CountNonLetters("Hello, world!"))
}
