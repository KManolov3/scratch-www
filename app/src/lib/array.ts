import { isNil } from 'lodash-es';

export function filterNotNull<T>(items: T[]) {
  return items.filter(item => !isNil(item)) as NonNullable<T>[];
}
