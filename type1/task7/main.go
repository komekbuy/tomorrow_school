package main

import "fmt"

func main() {
	arr := [3]int{1, 2, 3}
	sl := []int{1, 2, 3}
	arr[0] = 99
	sl[0] = 99
	sl = append(sl, 4)
	fmt.Println(arr, len(arr))
	fmt.Println(sl, len(sl))
}
