import { useCallback, useState } from 'react';

export function useMap<Key, Value>(initialValue?: Map<Key, Value>) {
  const [map, setMap] = useState(initialValue ?? new Map<Key, Value>());
  const set = useCallback(
    (key: Key, value: Value) => {
      map.set(key, value);
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
  return { map, set, remove };
}
