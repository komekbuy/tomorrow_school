module toolprompts

go 1.26.5

// z01 is not imported: go doc needs this line to find the package. go mod tidy removes it.
// z01 не импортируется: строка нужна, чтобы go doc нашёл пакет. go mod tidy её удалит.
require github.com/01-edu/z01 v0.1.0
