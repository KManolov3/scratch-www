import { useCallback, useEffect, useState } from 'react';
import { launchDarklyService } from 'src/services/LaunchDarkly';
import { Error } from '@components/Error';
import { useAppStateChange } from '@hooks/useAppStateChange';
import { AppRoot } from '../../AppRoot';

export function CycleCountApp() {
  const [isInitialised, setIsInitialised] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);

  const initializeLaunchDakly = useCallback(async () => {
    try {
      await launchDarklyService.configure({
        applicationName: 'Cycle Count',
        /**
         * TODO: Replace userId and storeNumber with the appropriate values
         * instead of using hardcoded ones once we have access to them
         */
        userId: '1',
        storeNumber: '0363',
      });
      setIsInitialised(true);
    } catch (error) {
      setHasErrorOccurred(true);
    }
  }, []);

  useEffect(() => {
    initializeLaunchDakly();
  }, [initializeLaunchDakly]);

  useAppStateChange(['background'], () => {
    launchDarklyService.flush();
  });

  if (hasErrorOccurred) {
    return <Error />;
  }

  return isInitialised ? <AppRoot initialRoute="CycleCountHome" /> : null;
}
