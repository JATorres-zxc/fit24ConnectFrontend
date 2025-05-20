import { View, StyleSheet, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';

import Header from '@/components/AdminSectionHeaders';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import { API_BASE_URL } from '@/constants/ApiConfig';

export default function SettingsScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState({ full_name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (!authToken) {
          console.error('Access token not found');
          return;
        }
  
        const response = await fetch(`${API_BASE_URL}/api/profilee/profile/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);

  const handleLogout = () => {
    setLogoutModalVisible(true); // open the modal
  };

  const handleConfirmLogout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const accessToken = await AsyncStorage.getItem('authToken');

      if (!refreshToken) {
        console.error('No refresh token found.');
        setLogoutModalVisible(false);
        return;
      }

      if (!accessToken) {
        console.error('No access token found.');
        setLogoutModalVisible(false);
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/account/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ refresh: refreshToken}),
      });
  
      if (response.ok) {
        console.log('Logged out successfully');
      } else {
        const errorData = await response.json();
        console.error('Logout API call failed:', errorData);
      }

      // Clear all authentication tokens from AsyncStorage
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userID');
      
      setLogoutModalVisible(false);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      setLogoutModalVisible(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Header screen="Profile Settings" />
      {loading ? (
        <Text>Loading profile...</Text>
      ) : (
      <View style={styles.detailsContainer}>
        <View style={styles.fields}>
          <Text style={styles.attribute}>
            Full Name
          </Text>
          <Text style={styles.value}>
            {profile.full_name}
          </Text>
        </View>

        <View style={styles.fields}>
          <Text style={styles.attribute}>
            Email
          </Text>
          <Text style={styles.value}>
            {profile.email}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.editPass}
              onPress={() => router.push('/edit-password')}
            >
              <Text style={styles.buttonText}> Edit Password </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.logout}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}> Logout </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      )}

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setLogoutModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <FontAwesome6 name="right-from-bracket" size={36} color={Colors.black} />
                </View>
                <Text style={styles.modalTitle}>Confirm Logout</Text>
                <Text style={styles.modalText}>
                  Are you sure you want to log out?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={() => setLogoutModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.logoutButton]} 
                    onPress={handleConfirmLogout}
                  >
                    <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  detailsContainer: {
    width: '85%',
  },
  fields: {
    marginVertical: 15,
  },
  attribute: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  value: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  buttonContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  button: {
    width: '40%',
  },
  editPass: {
    backgroundColor: Colors.gold,
    borderRadius: 10,
    padding: 10,
  },
  logout: {
    backgroundColor: Colors.black,
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
  },
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
  modalIconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    marginBottom: 15,
  },
  modalText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  selectedMember: {
    fontFamily: Fonts.semiboldItalic,
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
  cancelButton: {
    backgroundColor: Colors.red,
  },
  logoutButton: {
    backgroundColor: Colors.black,
  },
  logoutButtonText: {
    color: Colors.white,
  },
});
