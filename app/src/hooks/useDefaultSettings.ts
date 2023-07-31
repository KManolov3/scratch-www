import { useCallback, useEffect, useState } from 'react';
import { localStorage } from '@services/LocalStorageService';
import { Printer, Printers } from '@services/Printers';

export interface DefaultSettings {
  defaultPrinter: Printer;
  lastUsedPortablePrinter?: string;
}

const DEFAULT_SETTINGS: DefaultSettings = {
  defaultPrinter: Printers.initiallySelectedPrinter,
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
