import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";

import { AntDesign } from '@expo/vector-icons';
import { Fonts } from '../constants/Fonts';

interface HeaderProps {
  screen: string;
  prevScreen: `/${string}`;
}

export default function Header({ screen, prevScreen }: HeaderProps) {

  return (
    <SafeAreaView>
      <View style={styles.header}>

        <View style={styles.leftSection}>
          <AntDesign 
            name='arrowleft' 
            color={'black'} 
            size={24} 
            onPress={() => router.push(prevScreen)}
          />
          <Text style={styles.headerText}>
            {screen}
          </Text>
        </View>

        {/* For spacing purposes */}
        <View style={styles.rightSection}>
          <Text>{''}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    header: {
      width: '85%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    headerText: {
      fontSize: 20,
      fontFamily: Fonts.semibold,
    },
    rightSection: {
      alignItems: 'center',
    },
  });