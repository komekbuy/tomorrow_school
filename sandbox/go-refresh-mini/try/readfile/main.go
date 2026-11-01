package main

import (
	"fmt"
	"os"
)

func main() {
	// os.ReadFile reads the whole file and returns its bytes and an error.
	// os.ReadFile читает весь файл и возвращает его байты и ошибку.
	data, err := os.ReadFile("sample.txt")
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	// A file is bytes: every letter is a number.
	// Файл — это байты: каждая буква — число.
	fmt.Println(data)
	// string(data) turns the bytes into text.
	// string(data) превращает байты в текст.
	fmt.Println(string(data))
}
