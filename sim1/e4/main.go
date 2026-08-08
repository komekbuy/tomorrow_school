package main

import "fmt"

func SumDigits(n int) int {
	count := 0
	for n > 0 {
		i := n % 10
		count = count+i
		n = n / 10
	}
	return count
}

func main() {
	fmt.Println(SumDigits(123))
	fmt.Println(SumDigits(9))
	fmt.Println(SumDigits(0))
	fmt.Println(SumDigits(1000))
	fmt.Println(SumDigits(99999))
}