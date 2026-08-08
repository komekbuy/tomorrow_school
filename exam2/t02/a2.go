package main

import "fmt"

func main() {
	for c := 'a'; c <= 'z'; c++ {
		fmt.Print(string(c))
	}
	fmt.Println()
}
