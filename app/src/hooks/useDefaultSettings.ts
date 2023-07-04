import { useCallback, useEffect, useState } from 'react';
import { localStorage } from '@services/LocalStorageService';

// TODO: Move somewhere else?
export const COUNTER_PRINTERS = Object.freeze([
  { id: 1, name: 'Counter Printer 1' },
  { id: 2, name: 'Counter Printer 2' },
  { id: 3, name: 'Counter Printer 3' },
] as const);

export type SelectedPrinter =
  | {
      type: 'portable';
      networkName: string;
    }
  | {
      type: 'counter';
      id: (typeof COUNTER_PRINTERS)[number]['id'];
    };

export interface DefaultSettings {
  defaultPrinter: SelectedPrinter;
  lastUsedPortablePrinter?: string;
}

const DEFAULT_SETTINGS: DefaultSettings = {
  defaultPrinter: { type: 'counter', id: 1 },
};

export function useDefaultSettings<Key extends keyof DefaultSettings>(
  context: string[],
  key: Key,
): {
  data: DefaultSettings[Key];
  set: (value: DefaultSettings[Key]) => void;
} {
  const fullKey = [...context, key].join('.');

  const set = useCallback(
    (value: DefaultSettings[Key]) => {
      localStorage.set(fullKey, value);
      setSetting(value);
    },
    [fullKey],
  );

  const [setting, setSetting] = useState<DefaultSettings[Key] | undefined>(
    localStorage.get(fullKey),
  );

  useEffect(() => {
    const subscription = localStorage.onChange(() => {
      setSetting(localStorage.get(fullKey));
    });

    return () => subscription.remove();
  }, [fullKey]);

  return {
    data: setting ?? DEFAULT_SETTINGS[key],
    set,
  };
}
