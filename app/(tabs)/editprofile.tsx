import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { 
  Text, View, StyleSheet, Image, 
  TextInput, TouchableOpacity, Platform, 
  ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, 
  Keyboard} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import Header from '@/components/EditProfileHeader';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Profile {
  image: any,
  username: string,
  membershipType: string,
  membershipStatus: string,
  fullName: string,
  email: string,
  address: string,
  phoneNo: string,
}

export default function EditProfileScreen() {
  const [originalProfile, setOriginalProfile] = useState<Profile>({
    image: require("@/assets/images/icon.png"),
    username: 'John',
    membershipType: 'Student',
    membershipStatus: 'Active',
    fullName: 'John Doe',
    email: 'johndoe@gmail.com',
    address: 'Cebu City',
    phoneNo: '0999 999 9999',
  });

  const [formValues, setFormValues] = useState<Profile>(originalProfile);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const storedProfile = await AsyncStorage.getItem('profile');
          if (storedProfile) {
            const parsed = JSON.parse(storedProfile);
            setOriginalProfile(parsed);
            setFormValues({
              ...parsed,
              image: parsed.image && typeof parsed.image === 'string'
                ? { uri: parsed.image }
                : require("@/assets/images/icon.png"),
            });
            setHasUnsavedChanges(false);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      };

      loadProfile();
    }, [])
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('profile');
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          setOriginalProfile(parsed);
          setFormValues({
            ...parsed,
            image: parsed.image && typeof parsed.image === 'string'
              ? { uri: parsed.image }
              : require("@/assets/images/icon.png"),
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    loadProfile();
  }, []);
  
  useEffect(() => {
    if (originalProfile) {
      const isDifferent = JSON.stringify(formValues) !== JSON.stringify(originalProfile);
      setHasUnsavedChanges(isDifferent);
    }
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
      return; // Do nothing if no changes were made
    }
    
    if (!formValues.fullName || !formValues.email || !formValues.address || !formValues.phoneNo) {
      showToast('Please fill out all details before saving.');
      return;
    }
  
    try {

      const profileToSave = {
        ...formValues,
        image:
          formValues.image?.uri || 
          (typeof formValues.image === "string" ? formValues.image : null) || 
          null,
      };
      
      await AsyncStorage.setItem('profile', JSON.stringify(formValues));
      setOriginalProfile({ ...formValues }); // Ensure originalProfile is fully updated
      setHasUnsavedChanges(false); // Reset changes flag

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
    }
  };

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
