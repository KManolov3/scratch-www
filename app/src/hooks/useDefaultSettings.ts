import { safeParseJson } from '@lib/object';
import { LocalStorageService } from '@services/LocalStorageService';
import { useCallback, useEffect, useState } from 'react';

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
  key: Key,
): {
  data: DefaultSettings[Key];
  set: (value: DefaultSettings[Key]) => void;
} {
  function getValueFromLocalStorageWithDefault<T>(defaultValue: T): T {
    const value = LocalStorageService.get(key);
    if (!value) {
      LocalStorageService.set(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    const parsed = safeParseJson(value);
    if (parsed) {
      return parsed as T;
    }
    return value as T;
  }

  const set = useCallback(
    (value: DefaultSettings[Key]) => {
      LocalStorageService.set(key, value);
      setSetting(value);
    },
    [key],
  );

  const [setting, setSetting] = useState(
    getValueFromLocalStorageWithDefault(DefaultSettingValues[key]),
  );

  useEffect(() => {
    if (!setting) {
      LocalStorageService.set(key, DefaultSettingValues[key]);
    }
  }, [key, setting]);

  return { data: setting, set };
}
