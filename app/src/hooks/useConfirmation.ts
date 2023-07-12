import { useCallback, useState } from 'react';
import { Deferred } from '@lib/deferred';

export function useConfirmation<T = void>() {
  const [confirmation, setConfirmation] = useState<Deferred<boolean>>();
  const [itemToConfirm, setItemToConfirm] = useState<T>();

  return {
    confirmationRequested: !!confirmation,
    itemToConfirm,

    askForConfirmation: useCallback(
      (item: T) => {
        if (confirmation) {
          confirmation.resolve(false);
        }

        const deferred = new Deferred<boolean>();

        setConfirmation(deferred);
        setItemToConfirm(item);

        return deferred.promise;
      },
      [confirmation],
    ),

    accept: useCallback(() => {
      confirmation?.resolve(true);
      setConfirmation(undefined);
    }, [confirmation]),

    reject: useCallback(() => {
      confirmation?.resolve(false);
      setConfirmation(undefined);
    }, [confirmation]),
  };
}
