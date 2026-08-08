package main

import "fmt"

func FirstBig(limit int) int{
	for i := 1; i <= 100; i++ {
		if i*i > limit {
			return i
		}
	}
	return 0
}

func main()