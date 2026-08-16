package main

import (
	"bufio"
	"fmt"
	"os"
)

type quad struct {
	name string
	tl   rune
	tr   rune
	bl   rune
	br   rune
	hor  rune
	ver  rune
}

var quads = []quad{
	{"quadA", 'o', 'o', 'o', 'o', '-', '|'},
	{"quadB", '/', '\\', '\\', '/', '*', '*'},
	{"quadC", 'A', 'A', 'C', 'C', 'B', 'B'},
	{"quadD", 'A', 'C', 'A', 'C', 'B', 'B'},
	{"quadE", 'A', 'C', 'C', 'A', 'B', 'B'},
}

func cell(q quad, row, col, w, h int) rune {
	if row == 0 && col == 0 {
		return q.tl
	}
	if row == 0 && col == w-1 {
		return q.tr
	}
	if row == h-1 && col == 0 {
		return q.bl
	}
	if row == h-1 && col == w-1 {
		return q.br
	}
	if row == 0 || row == h-1 {
		return q.hor
	}
	if col == 0 || col == w-1 {
		return q.ver
	}
	return ' '
}

func match(q quad, lines []string, w, h int) bool {
	for row := 0; row < h; row++ {
		line := make([]rune, w)
		for col := 0; col < w; col++ {
			line[col] = cell(q, row, col, w, h)
		}
		if string(line) != lines[row] {
			return false
		}
	}
	return true
}

func main() {
	lines := []string{}
	sc := bufio.NewScanner(os.Stdin)
	for sc.Scan() {
		lines = append(lines, sc.Text())
	}

	h := len(lines)
	w := 0
	same := true
	if h > 0 {
		w = len(lines[0])
		for _, l := range lines {
			if len(l) != w {
				same = false
			}
		}
	}

	res := ""
	if h > 0 && w > 0 && same {
		for _, q := range quads {
			if match(q, lines, w, h) {
				if res != "" {
					res += " || "
				}
				res += fmt.Sprintf("[%s] [%d] [%d]", q.name, w, h)
			}
		}
	}

	if res == "" {
		res = "Not a quad function"
	}
	fmt.Println(res)
}
