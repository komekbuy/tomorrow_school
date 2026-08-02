package main

import "github.com/01-edu/z01"

func Grade(n int) {
	if n >= 90 {
		z01.PrintRune('A')
	} else if n >= 70 {
		z01.PrintRune('B')
	} else if n >= 50 {
		z01.PrintRune('C')
	} else {
		z01.PrintRune('F')
	}
	z01.PrintRune('\n')
}

func main() {
	Grade(90)
	Grade(89)
	Grade(70)
	Grade(69)
	Grade(50)
}
