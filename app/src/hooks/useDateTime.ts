import { DateTime } from 'luxon';
import { useMemo } from 'react';

export function useDateTime(isoString: string): DateTime;
export function useDateTime(
  isoString: string | null | undefined,
): DateTime | undefined;
export function useDateTime(
  isoString: string | null | undefined,
): DateTime | undefined {
  return useMemo(
    () => (isoString ? DateTime.fromISO(isoString) : undefined),
    [isoString],
  );
}
