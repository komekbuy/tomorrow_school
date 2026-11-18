package main

import "fmt"

func main() {
	// Go through the list: i is the position, v is the value
	// Идём по списку: i — номер, v — значение
	for i, v := range []int{10, 20} {
		fmt.Println(i, v)
	}
}
