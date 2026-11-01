package main

import (
	"fmt"
	"os"
)

func main() {
	// os.Args is the list of words typed after "go run".
	// os.Args — список слов, которые написаны после "go run".
	fmt.Println(os.Args)
	fmt.Println(len(os.Args))
}
