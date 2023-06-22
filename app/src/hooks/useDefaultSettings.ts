import { LocalStorageService } from '@services/LocalStorageService';
import { useCallback, useMemo, useState } from 'react';

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

function getValueFromLocalStorageWithDefault<T>(
  key: string,
  defaultValue: T,
): T {
  const value = LocalStorageService.get(key);
  if (!value) {
    LocalStorageService.set(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  if (typeof defaultValue === 'string') {
    return value as T;
  }
  return JSON.parse(value);
}

export function useDefaultSettings<Key extends keyof DefaultSettings>(
  key: Key,
  ...additionalArgs: string[]
): {
  data: DefaultSettings[Key];
  set: (value: DefaultSettings[Key]) => void;
} {
  const keyValue = useMemo(
    () => [key, ...additionalArgs].join('.'),
    [additionalArgs, key],
  );

  const set = useCallback(
    (value: DefaultSettings[Key]) => {
      LocalStorageService.set(keyValue, JSON.stringify(value));
      setSetting(value);
    },
    [keyValue],
  );

  const [setting, setSetting] = useState(
    getValueFromLocalStorageWithDefault(keyValue, DefaultSettingValues[key]),
  );

  return { data: setting, set };
}
