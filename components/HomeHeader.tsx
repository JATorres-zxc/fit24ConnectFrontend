import { router } from 'expo-router';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Fonts } from '../constants/Fonts';
import { Colors } from '@/constants/Colors';

import { HeaderPropsUserTypewName } from '@/types/interface';

export default function Header({ userType, name }: HeaderPropsUserTypewName) {
  const [fontSize, setFontSize] = useState(20);
  const [numLines, setNumLines] = useState(1);
  
  // Adjust font size and number of lines based on name length
  useEffect(() => {
    if (name) {
      if (name.length <= 12) {
        setFontSize(20);
        setNumLines(1);
      } else if (name.length <= 20) {
        setFontSize(18);
        setNumLines(1);
      } else {
        setFontSize(16);
        setNumLines(2);
      }
    }
  }, [name]);

  const handleProfilePress = () => {
    if (userType === 'trainer') {
      router.push('/(trainer)/profile');
    } else {
      router.push('/(tabs)/profile');
    }
  };

  const handleNotificationPress = () => {
    if (userType === 'trainer') {
      router.push('/(trainer)/notifications');
    } else {
      router.push('/(tabs)/notifications');
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={styles.headerTextWrapper}>
          <Text 
            style={[styles.headerText, { fontSize }]} 
            numberOfLines={numLines}
            adjustsFontSizeToFit={numLines === 1}
          >
            Back to the Grind,{' '}
            <Text style={{ fontFamily: Fonts.semiboldItalic }}>{name}!</Text>
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <FontAwesome 
            name='user-circle' 
            color={'black'} 
            size={24} 
            onPress={handleProfilePress}
            style={styles.iconSpacing} 
          />
          <FontAwesome 
            name='bell-o' 
            color={'black'} 
            size={24} 
            onPress={handleNotificationPress} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: Colors.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  headerTextWrapper: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'center'
  },
  headerText: {
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5
  },
  iconSpacing: {
    marginRight: Platform.OS === 'ios' ? 8 : 4
  }
});