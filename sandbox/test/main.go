/* package main

import "fmt"

/* - 1 -
func main() {
	fmt.Println(CountAlpha("Hello world"))
	fmt.Println(CountAlpha("H e l l o"))
	fmt.Println(CountAlpha("H1e2l3l4o5"))
}

func CountAlpha(s string) int {
	r := []rune(s)
	count := 0
	for _, ch := range r {
		if ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z' {
			count++
		}
	}
	return count
}
*/

/* - 2 -
func main() {
	fmt.Println(CountChar("Hello world", 'l'))
	fmt.Println(CountChar("5 ballons", 5))
	fmt.Println(CountChar(" ", ' '))
	fmt.Println(CountChar("The 7 deadly sins", '7'))
}

func CountChar(str string, c rune) int {
	s := []rune(str)
	count := 0
	for _, ch := range s {
		if ch == c {
			count++
		}
	}
	return count
}
*/

/* - 3 -
func main() {
	fmt.Print(PrintIf("abcdef"))
	fmt.Print(PrintIf("abc"))
	fmt.Print(PrintIf(""))
	fmt.Print(PrintIf("14"))
}

func PrintIf(str string) string {
	s := []rune(str)
	if len(s) >= 3 {
		return "G\n"
	}

	return "Invalid Input\n"
}
*/

/* - 4 -
func main() {
	fmt.Println(RectPerimeter(10, 2))
	fmt.Println(RectPerimeter(434343, 898989))
	fmt.Println(RectPerimeter(10, -2))
}

func RectPerimeter(w, h int) int {
	if w < 0 && h < 0 {
		return -1
	}

	p := (w+h)*2
	return p
}
*/

/* - 5 -
func main() {
	fmt.Print(FirstWorld("hello there"))
	fmt.Print(FirstWorld(""))
	fmt.Print(FirstWorld("hello ......... buy"))
}

func FirstWorld(s string) string {
	str := []rune(s)
	for i, ch := range str {
		if (ch == ' ') {
			return string(str[:i]) + "\n"
		}
	}
	return string(str) + "\n"
}
*/

/* - 6 -
func main() {
	fmt.Println(RetainFirstHalf("Hello"))
}

func RetainFirstHalf(str string) string {
	if len(str) == 0 {
		return ""
	}
	if len(str) == 1 {
		return str
	}
	s := []rune(str)
	return string(s[:len(str)/2])
}
*/

/* - 7 -
func main() {
	fmt.Println(CheckNumber("Hello"))
	fmt.Println(CheckNumber("H1"))
}

func CheckNumber(arg string) bool {
	s := []rune(arg)
	for _, ch := range s {
		if ch >= '0' && ch <= '9' {
			return true
		}
	}
	return false
}

*/
