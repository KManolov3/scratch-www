import { isNil } from 'lodash-es';

export function filterNotNull<T>(items: T[]) {
  return items.filter(item => !isNil(item)) as NonNullable<T>[];
}

export function count<T>(items: T[], predicate: (item: T) => boolean) {
  return items.filter(predicate).length;
}
