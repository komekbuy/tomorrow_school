package main

import "github.com/01-edu/z01"

func QuadB(x, y int) {
	if x <= 0 || y <= 0 {
		return
	}

	for row := 1; row <= y; row++ {
		for col := 1; col <= x; col++ {
			if row == 1 {
				if col == 1 {
					z01.PrintRune('/')
				} 
				if col == x {
					z01.PrintRune('\')
				} else {
					z01.PrintRune('*')
				}
			}
			if row == y {
				if col == 1 {
					z01.PrintRune('\')
				}
				if col == x {
					z01.PrintRune('/')
				}
				else {
					z01.PrintRune('*')
				}
			} else {
					if col == 1 || col == x {
						z01.PrintRune('*')
					} else {
						z01.PrintRune(' ')
					}
				}
		}
		z01.PrintRune('\n')
	}
}

func main() {
	QuadB(5,3)
}