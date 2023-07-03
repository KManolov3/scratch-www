import EventEmitter from 'eventemitter3';
import { useEffect } from 'react';
import { Item } from 'src/__generated__/graphql';
import { ApolloError } from '@apollo/client';
import { useFocusEffect } from '@react-navigation/native';
import { BatchCountItem } from 'src/types/BatchCount';

interface EventTypes {
  'search-error': [ApolloError];
  'search-success': [Item?];
  'print-success': [];
  'add-new-item': [BatchCountItem];
  'updated-item': [string];
  'removed-item': [string];
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
