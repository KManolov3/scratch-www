import { useState } from 'react';
import { safeParseJson } from '@lib/object';
import { LocalStorageService } from '@services/LocalStorageService';

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

const DefaultSettingValues: DefaultSettings = {
  defaultPrinterOption: { printerOption: PrinterOption.Counter1 },
};

export function useDefaultSettings<Key extends keyof DefaultSettings>(
  key: Key,
  ...additionalArgs: string[]
): {
  data: DefaultSettings[Key];
  set: (value: DefaultSettings[Key]) => void;
} {
  const [setting, setSetting] = useState<DefaultSettings[Key] | undefined>(
    safeParseJson(LocalStorageService.get([key, ...additionalArgs].join('.'))),
  );

  return {
    data: setting ?? DefaultSettingValues[key],
    set: (value: DefaultSettings[Key]) => {
      LocalStorageService.set(
        [key, ...additionalArgs].join('.'),
        JSON.stringify(value),
      );
      setSetting(value);
    },
  };
}
