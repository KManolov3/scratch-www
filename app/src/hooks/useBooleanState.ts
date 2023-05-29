import { useCallback, useState } from 'react';

export function useBooleanState(defaultStateValue = false) {
  const [state, setState] = useState(defaultStateValue);
  const toggle = useCallback(() => setState(prevState => !prevState), []);
  const disable = useCallback(() => setState(false), []);
  const enable = useCallback(() => setState(true), []);
  return { state, toggle, disable, enable };
}
