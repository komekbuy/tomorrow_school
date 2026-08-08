package main

import "fmt"

func CountVowels(s string) int {
	count := 0
	for _, c := range s {
		if c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' || c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U' {
			count++
		}
	}
	return count
}

func main() {
	fmt.Println(CountVowels("Hello World"))
	fmt.Println(CountVowels("xyz"))
	fmt.Println(CountVowels("AEIOU"))
}
