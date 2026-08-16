package main

import "fmt"

func main() {
	arr := [3]int{1, 2, 3}
	sl := []int{1, 2, 3}

	sl = append(sl, 4)
	arr[0] = 99

	fmt.Println(arr, len(arr))
	fmt.Println(sl, len(sl))

	var n int
	var s string
	var b bool
	var empty []int
	fmt.Println(n, s == "", b, empty == nil, len(empty))
}
