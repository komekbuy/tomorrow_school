# -*- coding: utf-8 -*-
import json, io
RAW='.raw/solutions.json'
d=json.load(open(RAW,encoding='utf-8'))

R = {}

R['options'] = """package main
import ("fmt"; "os"; "unicode")
  unicode нужен ради проверки «это латинская буква».

	if len(os.Args) < 2 {
		fmt.Println("options: abcdefghijklmnopqrstuvwxyz")
		return
	}
  Аргументов нет вовсе — печатается справка со всем алфавитом. Не ошибка, а подсказка.

	var options [32]bool
  Массив из 32 флажков: какие буквы включены. Именно МАССИВ, а не слайс —
  длина известна заранее и не меняется. Все элементы сразу false (нулевое значение).

	for _, v := range os.Args {
  ВНИМАНИЕ: перебираются ВСЕ аргументы, включая нулевой — имя самой программы.
  Это выглядит странно, но так устроен эталон школы, и на его поведение опирается проверка.

		if len(v) < 2 {
			fmt.Println("Invalid Option")
			return
		}
  Любой аргумент короче двух символов — сразу ошибка и выход.

		if v[0] == '-' {
  Разбираются только аргументы, начинающиеся с дефиса. Всё остальное молча пропускается:
  поэтому "40" не считается ошибкой, программа просто напечатает нули.

			if v[1] == 'h' {
				fmt.Println("options: abcdefghijklmnopqrstuvwxyz")
				return
			}
  Флаг -h означает «покажи справку» и завершает работу.

			for _, r := range v[1:] {
				if !unicode.Is(unicode.Latin, r) {
					fmt.Println("Invalid Option")
					return
				}
				options['z'-r+6] = true
			}
  Идём по буквам после дефиса. Не латинская буква — ошибка.
  Выражение 'z'-r+6 переводит букву в номер флажка: для 'z' получается 6,
  для 'a' — 31. То есть алфавит укладывается в старшие разряды задом наперёд.

	for i, v := range options {
		if i%8 == 0 && i != 0 {
			fmt.Print(" ")
		}
		if v { fmt.Print(1) } else { fmt.Print(0) }
	}
	fmt.Println()
  Печать 32 флажков: пробел ставится перед каждым девятым, то есть числа выходят
  четырьмя группами по восемь. В конце — перевод строки."""

R['rpncalc'] = """package main
import ("fmt"; "os"; "strconv"; "strings")

func deleteExtraSpaces(a []string) (res []string) {
	for _, v := range a {
		if v != "" {
			res = append(res, v)
		}
	}
	return
}
  Выбрасывает пустые куски, которые появляются при нескольких пробелах подряд.
  Запись (res []string) в заголовке — именованный возврат: переменная res создаётся
  сама, и голый return в конце возвращает её.

	if len(os.Args) != 2 {
		fmt.Println("Error")
		return
	}
  Ровно один аргумент — вся формула строкой. Иначе Error.

	var values []int
  Стопка чисел. Главная мысль обратной польской записи: числа складываются в стопку,
  а знак действия забирает из неё два верхних и кладёт обратно результат.

	op := strings.Split(os.Args[1], " ")
	op = deleteExtraSpaces(op)
  Режем формулу по пробелам и чистим пустые куски.

	for _, v := range op {
		val, err := strconv.Atoi(v)
		if err == nil {
			values = append(values, val)
			continue
		}
  Кусок разобрался как число — кладём в стопку и идём дальше.
  Не разобрался — значит это знак действия, разбираем ниже.

		n := len(values)
		if n < 2 {
			fmt.Println("Error")
			return
		}
  Для действия нужны два числа. Их нет — формула неверна.

		switch v {
		case "+":
			values[n-2] += values[n-1]
			values = values[:n-1]
  Берём два верхних числа стопки: n-1 это последнее, n-2 предпоследнее.
  Результат записывается на место предпоследнего, а последнее отрезается
  срезом values[:n-1] — стопка становится короче на один.
  Остальные действия (-, *, /, %) устроены точно так же.

		default:
			fmt.Println("Error")
			return
		}
  Кусок не число и не знак действия — ошибка.

	if len(values) == 1 {
		fmt.Println(values[0])
	} else {
		fmt.Println("Error")
	}
  В конце в стопке должно остаться ровно одно число — это и есть ответ.
  Осталось больше или меньше — формула неверна."""

R['romannumbers'] = """package main
import ("fmt"; "os"; "strconv"; "strings")

type roman struct {
	num        int
	romanDigit string
}
  Свой тип: число и его римская запись. Дальше из таких пар собирается таблица.

	if len(os.Args) == 2 {
  Работаем только при ровно одном аргументе. Иначе программа МОЛЧИТ —
  не печатает даже ошибку. Это поведение эталона, и его проверяет бот.

		nbr, err := strconv.Atoi(os.Args[1])
		if err != nil || nbr >= 4000 || nbr == 0 {
			fmt.Println("ERROR: cannot convert to roman digit")
			return
		}
  Не число, ноль или 4000 и больше — сообщение об ошибке.
  Римская система не знает нуля, а выше 3999 не записывается обычными буквами.

		patter := []roman{ {1000,"M"}, {900,"CM"}, {500,"D"}, ... {1,"I"} }
  Таблица от большего к меньшему. В неё включены и «вычитательные» пары
  CM, CD, XC, XL, IX, IV — иначе 9 записалось бы как VIIII вместо IX.

func print(nbr int, patter []roman) (string, string) {
	for _, v := range patter {
		for nbr >= v.num {
			sumRomanDigit += v.romanDigit + "+"
			result += v.romanDigit
			nbr -= v.num
		}
	}
  Жадный разбор: пока число не меньше текущего значения таблицы — вычитаем его
  и дописываем букву. Внутренний цикл нужен потому, что одна и та же буква
  может повторяться (30 = XXX).
  Собираются сразу две строки: разложение через плюсы и само римское число.

func formatsum(a string, patter []roman) string {
	result2 := strings.Split(a, "+")
	for i, v := range result2 {
		if len(v) == 2 {
			result2[i] = fmt.Sprintf("(%s-%s)", string(result2[i][1]), string(result2[i][0]))
		}
	}
  Куски из ДВУХ букв — это вычитательные пары. Они переписываются в скобки
  наоборот: "IX" превращается в "(X-I)", то есть «десять минус один».

		fmt.Println(strings.TrimSuffix(sumRoman, "+"))
		fmt.Println(romandigit)
  Печатаются две строки: сначала разложение (лишний плюс на конце срезается),
  потом само римское число."""

R['piglatin'] = """package main
import ("fmt"; "os"; "strings")

	if len(os.Args) != 2 || os.Args[1] == "" {
		return
	}
  Аргумент не один или пустая строка — программа МОЛЧИТ.
  Не печатает ни ошибки, ни пустой строки. Это важная деталь эталона.

	s := os.Args[1]
	vowel := strings.IndexAny(s, "aeiouAEIOU")
  IndexAny находит позицию ПЕРВОГО символа, входящего в набор гласных.
  Если ни одной гласной нет — вернёт -1.

	if vowel == -1 {
		fmt.Println("No vowels")
	} else {
		fmt.Println(string(s[vowel:]) + string(s[:vowel]) + "ay")
	}
  Правило поросячьей латыни: часть слова от первой гласной ставится вперёд,
  начало слова до неё переезжает в конец, и добавляется "ay".
  s[vowel:] — от гласной до конца, s[:vowel] — начало до гласной."""

R['brackets'] = """package main
import ("fmt"; "os")

func matchBrackets(exp string) bool {
	runes := []rune(exp)
	var opened []rune
	ptr := -1
  opened — стопка открытых скобок. ptr — номер верхней в ней.
  Основная мысль: каждая закрывающая скобка должна закрывать ПОСЛЕДНЮЮ открытую.

	for _, c := range runes {
		if c == '(' || c == '[' || c == '{' {
			opened = append(opened, c)
			ptr++
		}
  Открывающая — кладём в стопку.

		} else if c == ')' {
			if ptr < 0 || opened[ptr] != '(' {
				return false
			}
			opened = opened[:len(opened)-1]
			ptr--
		}
  Закрывающая круглая. Стопка пуста (ptr < 0) либо сверху лежит не круглая —
  значит порядок нарушен, сразу false. Иначе снимаем верхнюю со стопки.
  Для ] и } всё устроено точно так же.

	return len(opened) == 0
  В конце стопка обязана быть пустой. Если что-то осталось — скобка не закрыта.

	if len(os.Args) == 1 {
		fmt.Println()
	} else {
		for _, v := range os.Args[1:] {
			if matchBrackets(v) { fmt.Println("OK") } else { fmt.Println("Error") }
		}
	}
  Аргументов нет — печатается ПУСТАЯ СТРОКА (не молчание!).
  Иначе для каждого аргумента отдельная строка OK или Error."""

R['grouping'] = """package main
import ("fmt"; "os"; "strings"; "unicode")

func singleSearch(exp []string, text string) []string {
	items := strings.Split(text, " ")
	for _, item := range items {
		for _, word := range exp {
			if strings.Contains(item, word) {
				result = append(result, item)
			}
		}
	}
  Текст режется на слова ТОЛЬКО по пробелу. Внешний цикл идёт по словам,
  внутренний — по искомым кускам. Порядок именно такой, поэтому слово,
  подходящее под два куска сразу, попадёт в ответ ДВАЖДЫ.

func simpleSearch(runes []rune, text string) []string {
	if !strings.ContainsRune(exp, '|') {
		helper := []string{exp}
		result = append(singleSearch(helper, text))
	} else {
		expWords := strings.Split(exp, "|")
		result = append(result, singleSearch(expWords, text)...)
	}
  Есть ли знак | внутри. Нет — ищем одно выражение целиком.
  Есть — режем по нему и ищем каждую часть.

func brackets(regexp, text string) {
	if text == "" || regexp == "" { return }
  Пустой текст или пустое выражение — молчим.

	if runes[0] == '(' && runes[len(runes)-1] == ')' {
		runes = runes[1 : len(runes)-1]
  Работаем только если выражение в круглых скобках. Скобки срезаются.
  Если их нет — программа просто ничего не делает.

		for i, s := range result {
			if !unicode.IsLetter(rune(s[len(s)-1])) {
				s = s[0 : len(s)-1]
			}
			fmt.Printf("%d: %s\\n", i+1, s)
		}
  Если слово кончается не буквой (запятая, точка) — последний символ отбрасывается.
  Нумерация сквозная, с единицы.

	if len(os.Args) == 3 { brackets(os.Args[1], os.Args[2]) }
  Ровно два аргумента, иначе молчание."""

R['fprime'] = """package main
import ("fmt"; "os"; "strconv")

func fprime(value int) {
	if value == 1 {
		return
	}
  Единица — особый случай: НИЧЕГО не печатается, даже перевода строки.

	divisionIterator := 2
	for value > 1 {
		if value%divisionIterator == 0 {
			fmt.Print(divisionIterator)
			value = value / divisionIterator
			if value > 1 {
				fmt.Print("*")
			}
			divisionIterator--
		}
		divisionIterator++
	}
	fmt.Println()
  Разложение на простые множители делением. Идея: начинаем с двойки и делим,
  пока делится; когда перестало — берём следующее число.
  Хитрость в паре divisionIterator-- и divisionIterator++: после успешного деления
  счётчик сначала уменьшается, потом сразу увеличивается — то есть остаётся
  на месте, и то же число пробуется снова. Так 8 разложится как 2*2*2.
  Звёздочка ставится только если осталось что делить.
  Перевод строки печатается в конце — поэтому для 0 вывод это одна пустая строка.

	if len(os.Args) == 2 {
		if i, err := strconv.Atoi(os.Args[1]); err == nil {
			fprime(i)
		}
	}
  Аргумент не один или не число — программа молчит полностью."""

R['expandstr'] = """package main
import ("fmt"; "os"; "strings")

func deleteExtraSpaces(a []string) (res []string) {
	for _, v := range a {
		if v != "" {
			res = append(res, v)
		}
	}
	return
}
  Выбрасывает пустые куски — они появляются там, где было несколько пробелов подряд.
  Именованный возврат (res []string): переменная создаётся сама, голый return отдаёт её.

	if len(os.Args) == 2 {
		arg := strings.Split(os.Args[1], " ")
		arg = deleteExtraSpaces(arg)
		fmt.Println(strings.Join(arg, "   "))
	}
  Режем по пробелу, чистим пустые, склеиваем обратно ТРЕМЯ пробелами.
  Println добавляет перевод строки — поэтому строка из одних пробелов
  даёт пустую строку с переводом, а не полное молчание.
  Аргументов не один — не печатается ничего вообще."""

R['findpairs'] = """package main
  Полный текст решения смотри выше — здесь разобраны ключевые места.

	if len(os.Args) != 3 { ... "Invalid input." }
  Ровно два аргумента: массив строкой и целевая сумма.

  Проверка формата массива: строка обязана начинаться с [ и заканчиваться ].
  Иначе "Invalid input." — именно так, с точкой на конце.

  Разбор целевой суммы: если она не превращается в число (например "2 5"
  с пробелом внутри) — "Invalid target sum."

  Разбор чисел массива: содержимое между скобками режется по запятым,
  каждый кусок очищается от пробелов и превращается в число.
  Не получилось — "Invalid number: " плюс сам кусок.

  Поиск пар: двойной цикл, внешний i, внутренний j начинается с i+1 —
  так каждая пара берётся один раз и элемент не сравнивается сам с собой.
  Подошла сумма — в ответ кладётся пара НОМЕРОВ (не значений).

  Ничего не нашлось — "No pairs found."
  Нашлось — строка вида "Pairs with sum 6: [[0 4] [1 3]]": сначала сумма,
  потом список пар в квадратных скобках через пробел."""

n=0
for name, txt in R.items():
    if name in d:
        d[name]['line_by_line']=txt
        n+=1
json.dump(d, open(RAW,'w',encoding='utf-8'), ensure_ascii=False, indent=1)
print("переписано разборов по строкам:", n)
