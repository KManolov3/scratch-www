import { LookupType } from '@apps/BatchCount/ItemLookup';
import { BatchCountNavigation } from '@apps/BatchCount/navigator';
import { BlockButton } from '@components/Button/Block';
import { Container } from '@components/Container';
import { Text } from '@components/Text';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

interface Props {
  lookupType: LookupType;
  lookupId: string;
}

export function NoResults({ lookupType, lookupId }: Props) {
  const navigation = useNavigation<BatchCountNavigation>();

  return (
    <View style={styles.wrapper}>
      <Container style={styles.container}>
        <Text style={styles.text}>
          No results found for {lookupType} {lookupId}. Please try again!
        </Text>
        <BlockButton
          label="Search again"
          onPress={() =>
            navigation.navigate('Home', {
              shouldFocusSearch: lookupType === 'SKU',
            })
          }
        />
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingTop: 20,
    alignSelf: 'center',
  },
  container: {
    flexDirection: 'column',
    // This is actually 50% of the width of the container,
    // not the height, so it's not actually centered
    marginBottom: '50%',
    marginHorizontal: 20,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});
