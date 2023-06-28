import { useCallback, useEffect, useState } from 'react';
import { localStorage } from '@services/LocalStorageService';

export enum PrinterOptions {
  Counter1 = 'Printer Counter 1',
  Counter2 = 'Printer Counter 2',
  Counter3 = 'Printer Counter 3',
  Portable = 'Portable',
}

export interface DefaultSettings {
  defaultPrinterOption: PrinterOptions;
}

const DefaultSettingValues: DefaultSettings = {
  defaultPrinterOption: PrinterOptions.Counter1,
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
    data: setting ?? DefaultSettingValues[key],
    set,
  };
}
