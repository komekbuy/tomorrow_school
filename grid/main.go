package main

import "fmt"

func Frame(x, y int) {
	for row := 0; row < y; row++ {
		for col := 0; col < x; col++ {
			if row == 0 || row == y-1 {
				if col == 0 || col == x-1 {
					fmt.Print("o")
				} else {
					fmt.Print("-")
				}
			} else {
				if col == 0 || col == x-1 {
					fmt.Print("|")
				} else {
					fmt.Print(" ")
				}
			}
		}
		fmt.Println()
	}
}

func main() {
	Frame(1, 3)
	fmt.Println("---")
	Frame(5, 1)
	fmt.Println("---")
	Frame(1, 1)
}