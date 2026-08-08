package main

import "fmt"

func main() {
	for c := 'A'; c <= 'Z'; c++ {
		fmt.Print(string(c))
	}
	fmt.Println()
}
