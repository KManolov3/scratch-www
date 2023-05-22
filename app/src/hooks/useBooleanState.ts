import { useCallback, useState } from 'react';

export function useBooleanState(defaultStateValue = false) {
  const [state, setState] = useState(defaultStateValue);
  const toggleState = useCallback(() => setState(prevState => !prevState), []);
  return { state, toggleState };
}
