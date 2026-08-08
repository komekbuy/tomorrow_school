package main

import "fmt"

func CountDigits(s string) int {
	count := 0
	for _, c := range s {
		if c >= '0' && c <= '9' {
			count++
		}
	}
	return count
}

func main() {
	fmt.Println(CountDigits("a1b2c3"))
	fmt.Println(CountDigits("abc"))
}
