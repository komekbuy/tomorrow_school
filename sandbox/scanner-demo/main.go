package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	sc := bufio.NewScanner(os.Stdin)

	n := 0
	for sc.Scan() {
		n++
		fmt.Printf("вызов Scan №%d вернул: %q — длина %d\n", n, sc.Text(), len(sc.Text()))
	}
	fmt.Printf("всего вызовов, вернувших true: %d\n", n)
}
