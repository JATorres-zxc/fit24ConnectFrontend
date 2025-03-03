import { router } from 'expo-router';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AntDesign from '@expo/vector-icons/AntDesign'
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  onSave: () => void;
  hasUnsavedChanges?: boolean;
}

export default function Header({ onSave, hasUnsavedChanges = false }: HeaderProps) {
  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Would you like to save before leaving?",
        [
          {
            text: "Discard",
            onPress: () => router.replace('/profile'),
            style: "cancel"
          },
          { 
            text: "Save", 
            onPress: () => {
              onSave();
              // Navigation will happen in onSave via setTimeout
            } 
          }
        ]
      );
    } else {
      router.replace('/profile');
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>

        <View style={styles.leftSection}>
          <AntDesign 
            name='arrowleft' 
            color={'black'} 
            size={24} 
            onPress={handleBackNavigation} 
          />
          <Text style={styles.headerText}>
            Edit Profile
          </Text>
        </View>

        <View style={styles.rightSection}>
        <Text 
          style={[styles.save, !hasUnsavedChanges && styles.disabledSave]} 
          onPress={hasUnsavedChanges ? onSave : undefined}
        >
          Save
        </Text>
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
  save: {
    fontSize: 16,
    color: Colors.gold,
    fontFamily: Fonts.regular,
  },
  disabledSave: {
    color: Colors.textgray,
  }
});