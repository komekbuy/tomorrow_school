package main

import "fmt"

func Max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func main() {
	fmt.Println(Max(3, 9))
	fmt.Println(Max(10,2))
	fmt.Println(Max(5, 5))
}