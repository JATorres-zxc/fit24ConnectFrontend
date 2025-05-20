import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { 
  Text, View, StyleSheet, Image, 
  TextInput, TouchableOpacity, Platform, 
  ScrollView, KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import { router } from 'expo-router';
import { saveItem, getItem } from '@/utils/storageUtils';
import Toast from 'react-native-toast-message';

import Header from '@/components/EditProfileHeader';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { API_BASE_URL } from '@/constants/ApiConfig';

// Import interface for the profile object
import { ProfileBase, EditableMemberProfile } from '@/types/interface';

type Profile = ProfileBase & EditableMemberProfile;

export default function EditProfileScreen() {
  const [originalProfile, setOriginalProfile] = useState<Profile>({
    image: require("@/assets/images/icon.png"),
    username: '',
    membershipType: '',
    membershipStatus: '',
    fullName: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    complete_address: '',
    contact_number: '',
  });

  const [formValues, setFormValues] = useState<Profile>(originalProfile);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // References for TextInput fields to improve focus management
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const ageInputRef = useRef<TextInput>(null);
  const heightInputRef = useRef<TextInput>(null);
  const weightInputRef = useRef<TextInput>(null);
  const addressInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);

  const fetchProfile = async () => {
    try {
      const token = await getItem('authToken');
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
          ? { uri: `${API_BASE_URL}${data.image}` }
          : require("@/assets/images/icon.png"),
        username: data.username || '',
        membershipType: data.membership_type || '',
        membershipStatus: data.membership_status || '',
        fullName: data.full_name || '',
        email: data.email || '',
        age: data.age || '',
        height: data.height || '',
        weight: data.weight || '',
        complete_address: data.complete_address || '',
        contact_number: data.contact_number || '',
      };
  
      setOriginalProfile(profileData);
      setFormValues(profileData);
      await saveItem('profile', JSON.stringify(profileData));
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to cached data
      try {
        const cachedProfile = await getItem('profile');
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
      age: originalProfile.age,
      height: originalProfile.height,
      weight: originalProfile.weight,
      complete_address: originalProfile.complete_address,
      contact_number: originalProfile.contact_number
    };
    
    const editableCurrent = {
      fullName: formValues.fullName,
      email: formValues.email,
      age: formValues.age,
      height: formValues.height,
      weight: formValues.weight,
      complete_address: formValues.complete_address,
      contact_number: formValues.contact_number
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
    
    if (!formValues.fullName) {
      showToast('Please fill out Name before saving.');
      return;
    }
    else if (!formValues.email) {
      showToast('Please fill out Email before saving.');
      return;
    }
    else if (!formValues.age) {
      showToast('Please fill out Age before saving.');
      return;
    }
    else if (!formValues.height) {
      showToast('Please fill out Height before saving.');
      return;
    }
    else if (!formValues.weight) {
      showToast('Please fill out Weight before saving.');
      return;
    }
    else if (!formValues.complete_address) {
      showToast('Please fill out Address before saving.');
      return;
    }
    else if (!formValues.contact_number) {
      showToast('Please fill out Phone Number before saving.');
      return;
    }
  
    try {
      const token = await getItem('authToken');
      
      // Prepare the data for API request
      const profileData = {
        full_name: formValues.fullName,
        email: formValues.email,
        age: formValues.age,
        height: formValues.height,
        weight: formValues.weight,
        complete_address: formValues.complete_address,
        contact_number: formValues.contact_number,
      };
  
      // Make PATCH request to update profile
      const response = await fetch(`${API_BASE_URL}/api/profilee/profile/update/`, {
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
      
      await saveItem('profile', JSON.stringify(profileToSave));
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

      const errorMessage = error instanceof Error
        ? error.message
        : 'Could not save changes. Please try again.';

      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
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

  // Improved input rendering function with refs
  const renderInput = (
    label: string, 
    value: string, 
    fieldName: keyof EditableMemberProfile, 
    ref: any,
    keyboardType: 'default' | 'email-address' | 'number-pad' | 'phone-pad' = 'default',
    autoCapitalize: 'none' | 'sentences' | 'words' | 'characters' = 'none',
    returnKeyType: 'next' | 'done' = 'next',
    onSubmitEditing?: () => void
  ) => {
    return (
      <View style={styles.inputContainerOuter}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TouchableWithoutFeedback 
          style={styles.inputWrapper}
          onPress={() => ref.current && ref.current.focus()}
        >
          <TextInput
            ref={ref}
            style={styles.textInput}
            value={value}
            onChangeText={(text) => handleInputChange(fieldName, text)}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            placeholderTextColor="#aaa"
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
          />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Header userType='member' onSave={handleSave} hasUnsavedChanges={hasUnsavedChanges} />
    
        <ScrollView style={styles.scrollViewCont}>
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
              <Image 
                source={typeof formValues.image === "string" ? { uri: formValues.image } : formValues.image} 
                style={styles.profileImage} 
              />
            </View>
    
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{formValues.fullName.split(' ')[0] || ''}</Text>
              <Text style={styles.usernameLabel}>Your Username</Text>
            </View>
          </View>
        
          <View style={styles.formContainer}>
            {renderInput(
              'Full Name', 
              formValues.fullName, 
              'fullName', 
              nameInputRef,
              'default', 
              'words', 
              'next', 
              () => emailInputRef.current && emailInputRef.current.focus()
            )}
            
            {renderInput(
              'Email', 
              formValues.email, 
              'email', 
              emailInputRef,
              'email-address', 
              'none', 
              'next', 
              () => addressInputRef.current && addressInputRef.current.focus()
            )}

            {renderInput(
              'Age', 
              formValues.age, 
              'age', 
              ageInputRef,
              'number-pad', 
              'none', 
              'next', 
              () => heightInputRef.current && heightInputRef.current.focus()
            )}

            {renderInput(
              'Height (in cm)', 
              formValues.height, 
              'height', 
              heightInputRef,
              'default', 
              'none', 
              'next', 
              () => weightInputRef.current && weightInputRef.current.focus()
            )}

            {renderInput(
              'Weight (in kg)', 
              formValues.weight, 
              'weight', 
              weightInputRef,
              'default', 
              'none', 
              'next', 
              () => addressInputRef.current && addressInputRef.current.focus()
            )}
            
            {renderInput(
              'Address', 
              formValues.complete_address, 
              'complete_address', 
              addressInputRef,
              'default', 
              'sentences', 
              'next', 
              () => phoneInputRef.current && phoneInputRef.current.focus()
            )}
            
            {renderInput(
              'Phone Number', 
              formValues.contact_number, 
              'contact_number', 
              phoneInputRef,
              'phone-pad', 
              'none', 
              'done', 
              () => Keyboard.dismiss()
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => router.push('/(tabs)/editpassword')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Edit Password</Text>
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
  backgroundPressable: {
    flex: 1,
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
    textAlign: 'center',
  },
  scrollViewCont: {
    width: '85%',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: '50%',
  },
  buttonText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.white,
  },
  usernameContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  username: {
    fontFamily: Fonts.regular,
    fontSize: 20,
    color: '#333',
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainerOuter: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    marginBottom: 8,
    color: Colors.textSecondary,
  },
  inputWrapper: {
    width: '100%',
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontFamily: Fonts.regular,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
});