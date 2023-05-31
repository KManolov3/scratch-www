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
