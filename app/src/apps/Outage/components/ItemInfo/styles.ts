import { StyleSheet } from 'react-native';
import { Colors } from '@lib/colors';
import { FontWeight } from '@lib/font';

export const styles = StyleSheet.create({
  container: {
    paddingTop: 19,
    paddingBottom: 12,
    paddingLeft: 23,
    paddingRight: 20,
    borderRadius: 8,
    backgroundColor: Colors.pure,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    color: Colors.advanceVoid,
    fontWeight: FontWeight.Bold,
  },
  content: {
    flexDirection: 'row',
    paddingTop: 9,
    justifyContent: 'space-between',
  },
  property: {
    marginBottom: 8,
  },
});
