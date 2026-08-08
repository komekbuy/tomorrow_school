package main

import "fmt"

func main() {
	for c := 'z'; c >= 'a'; c-- {
		fmt.Print(string(c))
	}
	fmt.Println()
}
