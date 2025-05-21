import { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '@/components/ProfileHeader';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { FontAwesome6 } from '@expo/vector-icons';
import { API_BASE_URL } from '@/constants/ApiConfig';

// Import interface for the profile object
import { TrainerProfileDetails } from '@/types/interface';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<TrainerProfileDetails>({
    image: require("@/assets/images/icon.png"),
    username: '',
    membershipType: '',
    membershipStatus: '',
    fullName: '',
    email: '',
    experience: '',
    address: '',
    contact_number: '',
  });
  const params = useLocalSearchParams();    
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    
  useEffect(() => {
    if (params.showToast === "true") {
      setTimeout(() => {
        Toast.show({
          type: "error",
          text1: "Profile Incomplete",
          text2: "Please complete all profile details before proceeding.",
          position: 'bottom'
        });
      }, 4000); // Adding a short delay to ensure Toast renders properly
    }
  }, [params.showToast]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');

      const token = await AsyncStorage.getItem('authToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('Access Token:', token, 'refreshToken:', refreshToken);

      const response = await fetch(`${API_BASE_URL}/api/profilee/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setProfile({
        image: data.image 
          ? { uri: `${API_BASE_URL}${data.image}` } // Assuming image is a URL path
          : require("@/assets/images/icon.png"),
        username: data.username || '',
        membershipType: data.membership_type || '',
        membershipStatus: data.membership_status || '',
        fullName: data.full_name || '',
        email: data.email || '',
        experience: data.experience || '',
        address: data.complete_address || '',
        contact_number: data.contact_number || '',
      });

      // Cache the profile data locally
      await AsyncStorage.setItem('profile', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
      
      // Try to load cached profile if API fails
      try {
        const cachedProfile = await AsyncStorage.getItem('profile');
        if (cachedProfile) {
          const parsed = JSON.parse(cachedProfile);
          setProfile({
            ...parsed,
            image: parsed.image 
              ? { uri: parsed.image }
              : require("@/assets/images/icon.png"),
          });
          setError('Using cached data (offline mode)');
        }
      } catch (cacheError) {
        console.error('Error loading cached profile:', cacheError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh profile when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.bg} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.red }}>{error}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={typeof profile.image === 'string' ? { uri: profile.image } : profile.image} 
            style={styles.profileImage} 
          />

          <View style={styles.editProfile}>
            <MaterialCommunityIcons name={'pencil'} color={'black'} size={24} onPress={() => router.push('/editprofile')} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.username}>{profile.fullName.split(' ')[0] || ''}</Text>
          <Text style={styles.membership}>
            {profile.membershipType}: {' '}
            <Text style={{ fontFamily: Fonts.mediumItalic }}>{profile.membershipStatus}</Text>
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollViewCont}>
        <View style={styles.detailsContainer}>
          {/* Full Name Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{profile.fullName}</Text>
          </View>

          {/* Email Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile.email}</Text>
          </View>

          {/* Experience Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Experience</Text>
            <Text style={styles.value}>{profile.experience}</Text>
          </View>

          {/* Address Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{profile.address}</Text>
          </View>

          {/* Phone Number Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{profile.contact_number}</Text>
          </View>

          {/* Logout Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleLogout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

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
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 175,
    resizeMode: "cover",
  },
  editProfile: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    position: 'absolute',
    bottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.icongray,
  },
  textContainer: {
    alignItems: 'center',
  },
  username: {
    fontFamily: Fonts.regular,
    fontSize: 20,
  },
  membership: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.gold,
  },
  scrollViewCont: {
    flex: 1,
    width: '85%',
  },
  detailsContainer: {
    flex: 1,
  },
  field: {
    padding: 10,
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
  value: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.black,
    padding: 10,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.medium,
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
