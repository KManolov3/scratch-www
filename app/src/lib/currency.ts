export function convertCurrencyToString(price: number, digits = 2): string {
  const fixedPrice = Math.abs(price).toFixed(digits);
  const sign = price < 0 ? '-' : '';

  return `${sign}$${fixedPrice}`;
}
