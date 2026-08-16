package main

import "fmt"

func main() {
	var i int
	var f float64
	var s string
	var b bool
	var sl []int
	fmt.Printf("%T: %v\n", i, i)
	fmt.Printf("%T: %v\n", f, f)
	fmt.Printf("%T: %q\n", s, s)
	fmt.Printf("%T: %v\n", b, b)
	fmt.Printf("%T: nil=%v len=%v\n", sl, sl==nil, len(sl))
}
