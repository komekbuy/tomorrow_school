package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"strings"
)

// Call is the JSON the model must reply with.
// Call — JSON, которым должна ответить модель.
type Call struct {
	Tool string            `json:"tool"`
	Args map[string]string `json:"args"`
}

func main() {
	if len(os.Args) != 2 {
		fmt.Println("usage: go run . <file with the model reply>")
		os.Exit(1)
	}
	reply, err := os.ReadFile(os.Args[1])
	if err != nil {
		fail(err)
	}

	// The model only proposes a call. Nothing runs until these checks pass.
	// Модель только предлагает вызов. Пока проверки не пройдены, ничего не запускается.
	var call Call
	if err := json.Unmarshal(reply, &call); err != nil {
		fail(fmt.Errorf("плохой ответ модели: %w", err))
	}
	result, err := run(call)
	if err != nil {
		fail(err)
	}
	show("result", result)
}

// run finds the tool by name. An unknown name is refused.
// run ищет инструмент по имени. Неизвестное имя получает отказ.
func run(call Call) (string, error) {
	switch call.Tool {
	case "go_doc":
		return goDoc(call.Args["symbol"])
	case "atoi_base":
		return atoiTool(call.Args["s"], call.Args["base"])
	case "":
		return "", fmt.Errorf("модель не выбрала инструмент")
	}
	return "", fmt.Errorf("неизвестный инструмент %q", call.Tool)
}

// goDoc runs the real go doc command.
// goDoc запускает настоящую команду go doc.
func goDoc(symbol string) (string, error) {
	// A leading "-" would become a flag, a leading "." or "/" a path on disk.
	// "-" в начале стал бы флагом, а "." или "/" в начале — путём на диске.
	if symbol == "" || strings.IndexAny(symbol, "-./") == 0 {
		return "", fmt.Errorf("плохой аргумент symbol: %q", symbol)
	}
	out, err := exec.Command("go", "doc", symbol).CombinedOutput()
	text := strings.TrimSpace(string(out))
	if err != nil {
		return "", fmt.Errorf("go doc: %v: %s", err, text)
	}
	return text, nil
}

// atoiTool calls AtoiBase and turns its silent 0 into an error.
// atoiTool вызывает AtoiBase и превращает её молчаливый 0 в ошибку.
func atoiTool(s, base string) (string, error) {
	digits := []rune(base)
	if s == "" || len(digits) < 2 {
		return "", fmt.Errorf("нужны число s и алфавит base хотя бы из двух цифр")
	}
	// In a good alphabet the second digit reads as 1. A bad one always gives 0.
	// В хорошем алфавите вторая цифра читается как 1. Плохой всегда даёт 0.
	if AtoiBase(string(digits[1]), base) != 1 {
		return "", fmt.Errorf("плохой алфавит %q", base)
	}
	result := AtoiBase(s, base)
	// The only real 0 is a number made of the first digit alone.
	// Настоящий 0 — это число только из первой цифры алфавита.
	if result == 0 && strings.Trim(s, string(digits[0])) != "" {
		return "", fmt.Errorf("в числе %q есть цифра не из алфавита %q", s, base)
	}
	return strconv.Itoa(result), nil
}

// show prints one field as JSON, ready for the next prompt.
// show печатает одно поле как JSON, готовый для следующего промпта.
func show(key, value string) {
	out := json.NewEncoder(os.Stdout)
	// Without this, < in a Go signature would turn into \u003c.
	// Без этого < в сигнатуре Go превратился бы в \u003c.
	out.SetEscapeHTML(false)
	if err := out.Encode(map[string]string{key: value}); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

// fail reports a refusal as JSON and stops the program.
// fail сообщает об отказе в виде JSON и останавливает программу.
func fail(err error) {
	show("error", err.Error())
	os.Exit(1)
}

// AtoiBase is my function from the piscine, unchanged.
// AtoiBase — моя функция из бассейна, без изменений.
func AtoiBase(s string, base string) int {
	digits := []rune(base)
	size := len(digits)
	if size < 2 {
		return 0
	}
	for i := 0; i < size; i++ {
		if digits[i] == '+' || digits[i] == '-' {
			return 0
		}
		for j := i + 1; j < size; j++ {
			if digits[i] == digits[j] {
				return 0
			}
		}
	}
	result := 0
	for _, c := range s {
		value := -1
		for i, d := range digits {
			if c == d {
				value = i
				break
			}
		}
		if value < 0 {
			return 0
		}
		result = result*size + value
	}
	return result
}
