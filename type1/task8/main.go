package main

import "fmt"

func main() {
	s := "Привет"
	r := []rune(s)
	rev := []rune{}
	for i := len(r) - 1; i >= 0; i-- {
		rev = append(rev, r[i])
	}
	fmt.Println(string(rev))
}
