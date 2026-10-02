export function validMoneyAmount(amount: number) {
  const cents = amount * 100
  return Number.isFinite(amount) && amount >= 0 && Number.isSafeInteger(Math.round(cents)) && Math.abs(cents - Math.round(cents)) <= 0.000001
}
