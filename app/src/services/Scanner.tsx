import { ReactNode, useCallback, useEffect, useRef } from 'react';
import {
  InStoreAppsEventEmitter,
  InStoreAppsNative,
  ScannerConfig,
  ScanInfo,
} from 'rtn-in-store-apps';
import { useFocusEffect } from '@react-navigation/native';

export type ScanListener = (scan: ScanInfo) => void;

class ScannerService {
  private eventEmitter = new InStoreAppsEventEmitter();

  addScanListener(listener: ScanListener) {
    return this.eventEmitter.subscribe('scan', listener);
  }
}

const scannerService = new ScannerService();

export function useScanListener(action: ScanListener) {
  const actionRef = useRef(action);
  actionRef.current = action;

  useFocusEffect(
    useCallback(() => {
      const subscription = scannerService.addScanListener(actionRef.current);

      return () => subscription.remove();
    }, []),
  );
}

export interface ScannerProviderProps {
  config: ScannerConfig;
  children: ReactNode;
}

export function ScannerProvider({ config, children }: ScannerProviderProps) {
  useEffect(() => {
    InStoreAppsNative.configureScanner({
      profileName: config.profileName,
      scanIntentCategory: config.scanIntentCategory,
    });
  }, [config.profileName, config.scanIntentCategory]);

  // eslint is wrong here - we need the fragment
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
