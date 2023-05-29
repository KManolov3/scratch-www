export enum DollarSignPosition {
  PREFIX = 'prefix',
  INFIX = 'infix',
  POSTFIX = 'postfix',
}

export function convertCurrencyToString(
  price: number,
  signPosition: DollarSignPosition = DollarSignPosition.PREFIX,
  digits = 2,
): string {
  const fixedPrice = Math.abs(price).toFixed(digits);
  const sign = price < 0 ? '-' : '';
  const labels = {
    [DollarSignPosition.PREFIX]: `$${sign}${fixedPrice}`,
    [DollarSignPosition.INFIX]: `${sign}$${fixedPrice}`,
    [DollarSignPosition.POSTFIX]: `${sign}${fixedPrice}$`,
  };

  return labels[signPosition];
}
