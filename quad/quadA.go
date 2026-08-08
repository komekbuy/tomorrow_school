package main

import "fmt"

func QuadA(x, y int) {
	if x <= 0 || y <= 0 {
		return
	}

	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 || row == y {
				if col == 1 || col == x {
					fmt.Print("o")
				} else {
					fmt.Print("-")
				}
			} else {
				if col == 1 || col == x {
					fmt.Print("|")
				} else {
					fmt.Print(" ")
				}
			}
		}
		fmt.Print("\n")
	}
}
