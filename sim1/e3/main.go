package main

import "fmt"

func HideDigits(s string) string {
	out := ""
	for _, c := range s {
		if c >= '0' && c <= '9' {
			out = out + "*"
		} else {
			out = out + string(c)
		}
	}
	return out
}
	

func main() {
	fmt.Println(HideDigits("a1b2c3"))
	fmt.Println(HideDigits("abc"))
	fmt.Println(HideDigits("2026"))
	fmt.Println(HideDigits(""))
	fmt.Println(HideDigits("tel: 87071"))
}
