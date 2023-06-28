import { useCallback, useState } from 'react';
import { safeParseJson } from '@lib/object';
import { LocalStorageService } from '@services/LocalStorageService';

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
  ...additionalArgs: string[]
): {
  data: DefaultSettings[Key];
  set: (value: DefaultSettings[Key]) => void;
} {
  const set = useCallback(
    (value: DefaultSettings[Key]) => {
      LocalStorageService.set(
        [key, ...additionalArgs].join('.'),
        JSON.stringify(value),
      );
      setSetting(value);
    },
    [additionalArgs, key],
  );

  const [setting, setSetting] = useState<DefaultSettings[Key] | undefined>(
    safeParseJson(LocalStorageService.get([key, ...additionalArgs].join('.'))),
  );

  return {
    data: setting ?? DefaultSettingValues[key],
    set,
  };
}
