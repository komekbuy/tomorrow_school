package main

import "fmt"

func Squares(n int) []int {
	var result []int
	for i := 1; i <= n; i++ {
		result = append(result, i*i)
	}

	return result
}

func main() {
	fmt.Println(Squares(5))
	fmt.Println(Squares(1))
	fmt.Println(Squares(0))
	fmt.Println(Squares(-3))
}
