export function pluralize(value: number, singular: string, plural: string) {
  return `${value} ${pluralizeLabel(value, singular, plural)}`;
}

export function pluralizeLabel(
  value: number,
  singular: string,
  plural: string,
) {
  return value === 1 ? singular : plural;
}
