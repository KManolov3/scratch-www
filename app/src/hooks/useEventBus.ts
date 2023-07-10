import EventEmitter from 'eventemitter3';
import { isArray } from 'lodash-es';
import { useEffect } from 'react';
import { Item } from 'src/__generated__/graphql';
import { ApolloError } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';

interface EventTypes {
  'search-error': [ApolloError];
  'search-success': [Item?];
  'print-success': [];
  'add-new-item': [];
  'updated-item': [];
  'removed-item': [];
}

export const EventBus = new EventEmitter<EventTypes>();

export function useFocusEventBus<T extends EventEmitter.EventNames<EventTypes>>(
  events: T | T[],
  listener: (
    ...args: Parameters<EventEmitter.EventListener<EventTypes, T>>
  ) => void | Promise<unknown>,
) {
  useFocusEffect(() => {
    isArray(events)
      ? events.forEach(event => EventBus.addListener(event, listener))
      : EventBus.addListener(events, listener);

    return () => {
      isArray(events)
        ? events.forEach(event => EventBus.removeListener(event, listener))
        : EventBus.addListener(events, listener);
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
