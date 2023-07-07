import { isNil } from 'lodash-es';

export function filterNotNull<T>(items: T[]) {
  return items.filter(item => !isNil(item)) as NonNullable<T>[];
}

export function indexOfEnumValue<EnumType extends object>(
  obj: EnumType,
  key: string,
) {
  return Object.values(obj).indexOf(key);
}

export function findAndPrependItem<T>(arr: T[], item: T): T[] {
  const index = arr.indexOf(item);
  if (index > -1) {
    arr.splice(index, 1); // Remove the item from the array
    arr.unshift(item); // Prepend the item to the array
  }
  return arr;
}
