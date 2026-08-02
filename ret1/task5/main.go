package main

import "fmt"

func CountTo (n int) int {
	for i := 0; i > n; i++ {
	}
	return n
}

func main() {
	fmt.Println(CountTo(5))
	fmt.Println(CountTo(10))
}