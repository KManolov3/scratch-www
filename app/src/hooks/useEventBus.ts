import EventEmitter from 'eventemitter3';
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

interface EventTypes {
  'search-error': [{ error: unknown; isNoResultsError: boolean }];
  'search-success': [{ sku: string }];
  'print-success': [];
  'add-item-to-batch-count': [];
}

export const EventBus = new EventEmitter<EventTypes>();

export function useFocusEventBus<T extends EventEmitter.EventNames<EventTypes>>(
  event: T,
  listener: (
    ...args: Parameters<EventEmitter.EventListener<EventTypes, T>>
  ) => void | Promise<unknown>,
) {
  useFocusEffect(() => {
    EventBus.addListener(event, listener);

    return () => {
      EventBus.removeListener(event, listener);
    };
  });
}

export function useEventBus<T extends EventEmitter.EventNames<EventTypes>>(
  event: T,
  listener: (
    ...args: Parameters<EventEmitter.EventListener<EventTypes, T>>
  ) => void | Promise<unknown>,
) {
  useEffect(() => {
    EventBus.addListener(event, listener);

    return () => {
      EventBus.removeListener(event, listener);
    };
  });
}
