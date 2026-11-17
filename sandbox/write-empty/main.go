package main

import "os"

func main() {
	// Write empty content to keep.txt
	// Записываем пустоту в keep.txt
	os.WriteFile("keep.txt", []byte(""), 0644)
}
