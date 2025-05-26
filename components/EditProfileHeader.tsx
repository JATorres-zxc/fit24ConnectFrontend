import { router } from 'expo-router';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import AntDesign from '@expo/vector-icons/AntDesign'
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  userType: 'member' | 'trainer';
  onSave: () => void;
  hasUnsavedChanges?: boolean;
}

export default function Header({ userType, onSave, hasUnsavedChanges = false }: HeaderProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const navigateBackBasedOnUserType  = () => {
    if (userType === 'trainer') {
      router.replace('/(trainer)/profile');
    } else {
      router.replace('/(tabs)/profile');
    }
  }

  const handleBackNavigation = () => {
    if (hasUnsavedChanges) {
      setModalVisible(true);
    } else {
      console.log('No unsaved changes, navigating back');
      navigateBackBasedOnUserType();
    }
  };

  const handleDiscard = () => {
    setModalVisible(false);
    console.log('Discarding changes and navigating back');
    navigateBackBasedOnUserType();
  }

  const handleSave = () => {
    setModalVisible(false);
    console.log('Saving changes');
    onSave();
  }

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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Unsaved Changes</Text>
            <Text style={styles.modalMessage}>
              You have unsaved changes. Would you like to save before leaving?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.discardButton]} 
                onPress={handleDiscard}
              >
                <Text style={styles.buttonText}>Discard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    color: Colors.textSecondary,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    marginBottom: 15,
  },
  modalMessage: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  discardButton: {
    backgroundColor: Colors.red,
  },
  saveButton: {
    backgroundColor: Colors.green,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
});