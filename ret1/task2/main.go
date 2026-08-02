package main

import "fmt"

func Sum(a int, b int, c int) int {
	return a + b + c
}

func main() {
	fmt.Println(Sum(1, 2, 3))
	fmt.Println(Sum(10, 20, 30))
}