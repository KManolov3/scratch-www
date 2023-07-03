import { useCallback, useEffect, useState } from 'react';
import { localStorage } from '@services/LocalStorageService';

export enum PrinterOption {
  Counter1 = 'Counter Printer 1',
  Counter2 = 'Counter Printer 2',
  Counter3 = 'Counter Printer 3',
  Portable = 'Portable',
}

export type SelectedPrinter = {
  printerOption: PrinterOption;
  lastUsedPortablePrinter?: string;
};

export interface DefaultSettings {
  defaultPrinterOption: SelectedPrinter;
}

const DEFAULT_SETTINGS: DefaultSettings = {
  defaultPrinterOption: { printerOption: PrinterOption.Counter1 },
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
