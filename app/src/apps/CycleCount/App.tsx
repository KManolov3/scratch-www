import { useCallback, useEffect, useState } from 'react';
import { cycleCountLDService as launchDarklyService } from 'src/services/LaunchDarkly';
import { Error } from '@components/Error';
import useAppStateChange from '@hooks/useAppStateChange';
import { AppRoot } from '../../AppRoot';

export function CycleCountApp() {
  const [isInitialised, setIsInitiased] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);

  const initializeLaunchDakly = useCallback(async () => {
    try {
      await launchDarklyService.configure({
        applicationName: 'Cycle Count',
        userId: '1',
        storeNumber: '0363',
      });
      setIsInitiased(true);
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
