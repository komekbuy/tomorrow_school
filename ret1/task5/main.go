package main

import "fmt"

func CountTo(n int) int {
	x := 0
	for i := 1; i <= n; i++ {
		x = x + i
	}
	return x
}

func main() {
	fmt.Println(CountTo(5))
	fmt.Println(CountTo(10))
}
