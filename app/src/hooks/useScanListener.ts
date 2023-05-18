import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import { ScanListener, scannerService } from 'src/services/Scanner';

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
