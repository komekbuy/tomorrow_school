package main

import (
	"fmt"
	"os"
)

var g[9][9] int

func canPlace(r, c, n int) bool {
	for i := 0; i < 9; i++ {
		if g[r][i] == n || g[i][c] == n {
			return false
		}
	}

	startRow := r / 3 * 3
	startCol := c / 3 * 3

	for i := startRow; i < startRow + 3; i++ {
		for j := startCol; j < startCol + 3; j++ {
			if g[i][j] == n {
				return false
			}
		}
	}
	return true
}

func solve() bool {
	for r := 0; r < 9; r++ {
		for c := 0; c < 9; c++ {
			if g[r][c] == 0 {
				for n := 1; n <= 9; n++ {
					if canPlace(r, c, n) {
						g[r][c] = n
						if solve() {
							return true
						}
						g[r][c] = 0
					}
				}
				return false
			}
		}
	}
	return true
}

func printGrid() {
	for r := 0; r < 9; r++ {
		for c := 0; c < 9; c++ {
			fmt.Print(g[r][c])
			if c < 8 {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}
}

func main() {
	args := os.Args[1:]

	if len(args) != 9 {
		fmt.Println("Error")
		return
	}

	for r := 0; r < 9; r++ {
		if len(args[r]) != 9 {
			fmt.Println("Error")
			return
		}
		for c := 0; c < 9; c++ {
			symbol := args[r][c]

			if symbol == '.' {
				g[r][c] = 0
			} else if symbol >= '1' && symbol <= '9' {
				g[r][c] = int(symbol - '0')
			} else {
				fmt.Println("Error")
				return
			}
		}
	}

	for r := 0; r < 9; r++ {
		for c := 0; c < 9; c++ {
			if g[r][c] != 0 {
				n := g[r][c]
				g[r][c] = 0
				if !canPlace(r, c, n) {
					fmt.Println("Error")
					return
				}
				g[r][c] = n
			}
		}
	}

	if !solve() {
		fmt.Println("Error")
		return
	}
	printGrid()
}