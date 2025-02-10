import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FontAwesome from '@expo/vector-icons/FontAwesome'

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Back to the Grind,{' '}
          <Text style={{ fontStyle: 'italic' }}>{name}!</Text>
        </Text>

        <View style={styles.headerIcon}>
            <FontAwesome name='user-circle' color={'black'} size={24} onPress={() => router.push('/profile')} />
            <FontAwesome name='bell-o' color={'black'} size={24} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f9f9f9',
  },
  header: {
    width: '85%',
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});