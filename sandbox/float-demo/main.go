package main

import (
	"fmt"
	"math"
)

func main() {
	// 1. сколько цифр после запятой каждый удерживает
	var a float32 = 1.0 / 3.0
	var b float64 = 1.0 / 3.0
	fmt.Println("одна треть:")
	fmt.Printf("  float32: %.20f\n", a)
	fmt.Printf("  float64: %.20f\n", b)

	// 2. где ломается точность на целых числах
	fmt.Println("\nсчитаем до предела точности:")
	for _, n := range []float64{16777216, 16777217, 9007199254740992, 9007199254740993} {
		var f32 float32 = float32(n)
		fmt.Printf("  %-17.0f → float32: %-20.0f float64: %.0f\n", n, f32, n)
	}

	// 3. накопление ошибки: складываем 0.1 десять раз
	fmt.Println("\n0.1 сложить десять раз:")
	var s32 float32
	var s64 float64
	for i := 0; i < 10; i++ {
		s32 += 0.1
		s64 += 0.1
	}
	fmt.Printf("  float32: %.20f  == 1.0 ? %v\n", s32, s32 == 1.0)
	fmt.Printf("  float64: %.20f  == 1.0 ? %v\n", s64, s64 == 1.0)

	// 4. диапазон: какое самое большое число влезает
	fmt.Println("\nсамое большое число:")
	fmt.Printf("  float32: %g\n", math.MaxFloat32)
	fmt.Printf("  float64: %g\n", math.MaxFloat64)

	// 5. что будет, если выйти за диапазон
	var big64 float64 = 3.5e38 // чуть больше максимума float32
	big32 := float32(big64)    // переводим в float32 уже во время работы
	fmt.Printf("\n3.5e38 в float32: %v   ← Inf, число не влезло\n", big32)
	fmt.Printf("3.5e38 в float64: %g   ← влезло спокойно\n", big64)

	// 6. размер в памяти
	fmt.Printf("\nразмер: float32 = 4 байта, float64 = 8 байт\n")

	// 7. тип по умолчанию в Go
	x := 1.5
	fmt.Printf("x := 1.5 → тип %T   ← Go по умолчанию берёт float64\n", x)
}
