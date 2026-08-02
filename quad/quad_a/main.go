package main

import "fmt"

func QuadA(x, y int) {
	if x < 0 && y < 0 {
		return
	}

	for row := 0; row < y; row++ {
		for column := 0; column < x; column++ {
			if row == 0 && column == 0 {
			fmt.Print("o")
		} else if row == 0 && column == x-1 {
			fmt.Print("o")
		} else if row == y-1 && column == 0 {
			fmt.Print("o")
		} else if row == y-1 && column == x-1 {
			fmt.Print("o")
		} else {
			fmt.Print('-')
		}
		fmt.Print("-")
		}
		fmt.Println()
	}
}

func main() {
	QuadA(5, 3)
}