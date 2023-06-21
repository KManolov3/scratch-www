import EventEmitter from 'eventemitter3';
import { ApolloError } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';

interface EventTypes {
  'search-error': [ApolloError];
  'search-success': [];
  'print-success': [];
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
