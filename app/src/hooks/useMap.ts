import { useCallback, useMemo, useState } from 'react';

export function useMap<Key, Value>(initialValue = new Map<Key, Value>()) {
  const [map, setMap] = useState(initialValue);

  const set = useCallback(
    (key: Key, value: Value) => {
      map.set(key, value);
      setMap(new Map(map));
    },
    [map],
  );

  const update = useCallback(
    (key: Key, value: Partial<Value>) => {
      const currentValue = map.get(key);
      if (!currentValue) {
        throw new Error(`Make sure key:${key} exists.`);
      }
      map.set(key, { ...currentValue, ...value });
      setMap(new Map(map));
    },
    [map],
  );

  const remove = useCallback(
    (key: Key) => {
      map.delete(key);
      setMap(new Map(map));
    },
    [map],
  );

  const values = useMemo(() => Array.from(map.values()), [map]);

  return { values, set, remove, update };
}
