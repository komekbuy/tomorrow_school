package main

import "fmt"

func FirstThird(str string) string {
	if len(str) == 0 {
		return ""
	}
	if len(str) == 1 {
		return ""
	}

	s := []rune(str)
	return string(s[:len(s)-1])
}

func main() {
	fmt.Println(FirstThird("hello"))
	fmt.Println(FirstThird("ab"))
	fmt.Println(FirstThird("a")) 
}
