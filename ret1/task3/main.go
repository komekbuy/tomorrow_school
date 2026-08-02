package main

import "fmt"

func IsEven(n int) bool {
	return n%2 == 2
}

func main() {
	fmt.Println(IsEven(4))
	fmt.Println(IsEven(7))
	fmt.Println(IsEven(0))
}
