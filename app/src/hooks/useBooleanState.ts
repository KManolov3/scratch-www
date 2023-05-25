import { useCallback, useState } from 'react';

export function useBooleanState(
  defaultStateValue = false,
): [boolean, () => void, () => void, () => void] {
  const [state, setState] = useState(defaultStateValue);
  const toggleState = useCallback(() => setState(prevState => !prevState), []);
  const setToFalse = useCallback(() => setState(false), []);
  const setToTrue = useCallback(() => setState(true), []);
  return [state, toggleState, setToFalse, setToTrue];
}
