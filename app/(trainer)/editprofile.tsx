import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { 
  Text, View, StyleSheet, Image, 
  TextInput, TouchableOpacity, Platform, 
  ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, 
  Keyboard,
  ActivityIndicator} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import Header from '@/components/TrainerEditProfileHeader';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface ProfileBase {
  image: any;
  membershipType: string;
  membershipStatus: string;
}

interface EditableProfile {
  username: string;
  fullName: string;
  email: string;
  address: string;
  phoneNo: string;
  experience: string;
}

type Profile = ProfileBase & EditableProfile;

export default function EditProfileScreen() {
  const [originalProfile, setOriginalProfile] = useState<Profile>({
    image: require("@/assets/images/icon.png"),
    username: '',
    membershipType: '',
    membershipStatus: '',
    fullName: '',
    email: '',
    address: '',
    phoneNo: '',
    experience: '',
  });

  const [formValues, setFormValues] = useState<Profile>(originalProfile);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const API_BASE_URL = 
        Platform.OS === 'web'
          ? 'http://127.0.0.1:8000'
          : 'http://192.168.254.199:8000';
  
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/profilee/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
  
      const data = await response.json();
      
      const profileData = {
        image: data.image 
          ? { uri: `${API_BASE_URL}${data.image}` } // Adjust based on your image URL structure
          : require("@/assets/images/icon.png"),
        username: data.username || '',
        membershipType: data.membership_type || '',
        membershipStatus: data.membership_status || '',
        fullName: data.full_name || '',
        email: data.email || '',
        address: data.address || '',
        phoneNo: data.phone_number || '',
        experience: data.experience || '',
      };
  
      setOriginalProfile(profileData);
      setFormValues(profileData);
      await AsyncStorage.setItem('profile', JSON.stringify(profileData));
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to cached data
      try {
        const cachedProfile = await AsyncStorage.getItem('profile');
        if (cachedProfile) {
          const parsed = JSON.parse(cachedProfile);
          setOriginalProfile(parsed);
          setFormValues(parsed);
        }
      } catch (cacheError) {
        console.error('Error loading cached profile:', cacheError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  useEffect(() => {
    const editableOriginal = {
      fullName: originalProfile.fullName,
      email: originalProfile.email,
      address: originalProfile.address,
      phoneNo: originalProfile.phoneNo,
      experience: originalProfile.experience,
    };
    
    const editableCurrent = {
      fullName: formValues.fullName,
      email: formValues.email,
      address: formValues.address,
      phoneNo: formValues.phoneNo,
      experience: formValues.experience,
    };
  
    setHasUnsavedChanges(
      JSON.stringify(editableOriginal) !== JSON.stringify(editableCurrent)
    );
  }, [formValues, originalProfile]);

  const handleInputChange = (field: keyof Profile, value: string) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const showToast = (message: string) => {
    Toast.show({
      type: 'error',
      text1: 'Missing Details',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
      topOffset: 100,
    });
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) {
      return;
    }
    
    if (!formValues.fullName || !formValues.email || !formValues.address || !formValues.phoneNo) {
      showToast('Please fill out all details before saving.');
      return;
    }
  
    try {
      const API_BASE_URL = 
        Platform.OS === 'web'
          ? 'http://127.0.0.1:8000'
          : 'http://192.168.1.5:8000';
  
      const token = await AsyncStorage.getItem('authToken');
      
      // Prepare the data for API request
      const profileData = {
        full_name: formValues.fullName,
        email: formValues.email,
        address: formValues.address,
        phone_number: formValues.phoneNo,
        // Add other fields as needed by your API
      };
  
      // Make PATCH request to update profile
      const response = await fetch(`${API_BASE_URL}/api/profilee/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
  
      const updatedProfile = await response.json();
      
      // Update local storage and state
      const profileToSave = {
        ...formValues,
        image: formValues.image?.uri || formValues.image,
      };
      
      await AsyncStorage.setItem('profile', JSON.stringify(profileToSave));
      setOriginalProfile({ ...formValues });
      setHasUnsavedChanges(false);
  
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your changes have been saved successfully.',
        position: 'top',
        topOffset: 100,
      });
  
      setTimeout(() => {
        router.replace('/profile');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Could not save changes. Please try again.',
        position: 'top',
        topOffset: 100,
      });
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.bg} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Header onSave={handleSave} hasUnsavedChanges={hasUnsavedChanges} />

        <ScrollView style={styles.scrollViewCont}>
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
            <Image 
              source={typeof formValues.image === "string" ? { uri: formValues.image } : formValues.image} 
              style={styles.profileImage} 
            />
            </View>

            <View style={styles.textContainer}>
              <TextInput
                style={styles.usernameInput}
                value={formValues.username}
                onChangeText={text => handleInputChange('username', text)}
                placeholder={formValues.username}
              />
              <Text style={styles.usernameLabel}>
                Your Username
              </Text>
            </View>
          </View>
        
          <View style={styles.detailsContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formValues.fullName}
                onChangeText={text => handleInputChange('fullName', text)}
                placeholder={formValues.fullName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formValues.email}
                onChangeText={text => handleInputChange('email', text)}
                keyboardType="email-address"
                placeholder={formValues.email}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={formValues.address}
                onChangeText={text => handleInputChange('address', text)}
                placeholder={formValues.address}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formValues.phoneNo}
                onChangeText={text => handleInputChange('phoneNo', text)}
                keyboardType="phone-pad"
                placeholder={formValues.phoneNo}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Experience</Text>
              <TextInput
                style={styles.input}
                value={formValues.experience}
                onChangeText={text => handleInputChange('experience', text)}
                placeholder={formValues.experience}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/editpassword')}>
              <Text style={styles.buttonText}>
                Edit Password
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
          
        <Toast />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    
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
  textContainer: {
    alignItems: 'center',
  },
  usernameLabel: {
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  usernameInput: {
    fontFamily: Fonts.regular,
    fontSize: 20,
  },
  scrollViewCont: {
    width: '85%',
  },
  detailsContainer: {
    flex: 1,
    padding: 10,
  },
  inputGroup: {
    position: 'relative',
    marginBottom: 25,
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 15, 
    backgroundColor: Colors.bg, 
    paddingHorizontal: 5,
    fontFamily: Fonts.regular,
    fontSize: 14,
    zIndex: 1,
  },
  input: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    paddingVertical: 10,
    paddingLeft: 20,
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    color: Colors.textSecondary,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.white,
  },
});
