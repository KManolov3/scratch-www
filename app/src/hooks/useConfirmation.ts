import { useCallback, useState } from 'react';
import { Deferred } from '@lib/deferred';

export function useConfirmation<T = void>() {
  const [confirmation, setConfirmation] = useState<{
    item: T;
    deferred: Deferred<boolean>;
  }>();

  return {
    shouldConfirm: !!confirmation,
    itemToConfirm: confirmation?.item,

    confirm: useCallback(
      (item: T) => {
        if (confirmation) {
          confirmation.deferred.resolve(false);
        }

        const deferred = new Deferred();

        setConfirmation({ item, deferred });

        return deferred.promise;
      },
      [confirmation],
    ),

    accept: useCallback(() => {
      confirmation?.deferred.resolve(true);
      setConfirmation(undefined);
    }, [confirmation]),

    reject: useCallback(() => {
      confirmation?.deferred.resolve(false);
      setConfirmation(undefined);
    }, [confirmation]),
  };
}
