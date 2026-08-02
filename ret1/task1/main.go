package main

import "fmt"

func Triple(n int) int {
	return n * 3
}

func main() {
	fmt.Println(Triple(5))
	fmt.Println(Triple(12))
}