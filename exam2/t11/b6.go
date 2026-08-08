package main

import "fmt"

func CountWords(s string) int {
	count := 0
	inGroup := false
	for _, c := range s {
		if c != ' ' {
			if !inGroup {
				count++
			}
			inGroup = true
		} else {
			inGroup = false
		}
	}
	return count
}

func main() {
	fmt.Println(CountWords("Hello how are you"))
	fmt.Println(CountWords("  a  b  "))
}
