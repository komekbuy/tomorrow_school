package main

import "fmt"

func main() {
	var i int = 42
	var f float64 = 3.14
	var t string = "hello"
	var b bool = true

	fmt.Printf("%v %T\n", i, i)
	fmt.Printf("%v %T\n", f, f)
	fmt.Printf("%v %T\n", t, t)
	fmt.Printf("%v %T\n", b, b)
}
