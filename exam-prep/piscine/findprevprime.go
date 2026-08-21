package piscine

func findprevprimeIsPrime(nb int) bool {
	if nb < 2 {
		return false
	}
	for i := 2; i*i <= nb; i++ {
		if nb%i == 0 {
			return false
		}
	}
	return true
}

func FindPrevPrime(nb int) int {
	for n := nb; n >= 2; n-- {
		if findprevprimeIsPrime(n) {
			return n
		}
	}
	return 0
}
