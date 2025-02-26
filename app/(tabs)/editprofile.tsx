import { useState } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

import Header from '@/components/EditProfileHeader';
import { Fonts } from '@/constants/Fonts';

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
  const [profile, setProfile] = useState<Profile>({
    image: require("@/assets/images/icon.png"),
    username: 'John',
    membershipType: 'Student',
    membershipStatus: 'Active',
    fullName: 'John Doe',
    email: 'johndoe@gmail.com',
    address: 'Cebu City',
    phoneNo: '0999 999 9999',
  });

  const handleInputChange = (field: keyof Profile, value: string) => {
    setProfile(prevProfile => ({
      ...prevProfile,
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

  const handleSave = () => {
    if (!profile.fullName || !profile.email || !profile.address || !profile.phoneNo) {
      showToast('Please fill out all details before saving.');
      return;
    }
    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Profile Updated',
      text2: 'Your changes have been saved successfully.',
      position: 'top',
      topOffset: 100,
    });

    // Navigate back to the Profile screen after a short delay
    setTimeout(() => {
      router.replace('/profile'); // or use router.replace('/profile') if needed
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Header onSave={handleSave} />

      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image source={profile.image} style={styles.profileImage} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.username}>{profile.username}</Text>
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
            value={profile.fullName}
            onChangeText={text => handleInputChange('fullName', text)}
            placeholder={profile.fullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profile.email}
            onChangeText={text => handleInputChange('email', text)}
            keyboardType="email-address"
            placeholder={profile.email}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={profile.address}
            onChangeText={text => handleInputChange('address', text)}
            placeholder={profile.address}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={profile.phoneNo}
            onChangeText={text => handleInputChange('phoneNo', text)}
            keyboardType="phone-pad"
            placeholder={profile.phoneNo}
          />
        </View>
      </View>

      <View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Edit Password
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
  username: {
    fontFamily: Fonts.regular,
    fontSize: 20,
  },
  usernameLabel: {
    fontFamily: Fonts.regular,
    color: '#474747'
  },
  detailsContainer: {
    width: '85%',
  },
  inputGroup: {
    position: 'relative',
    marginBottom: 25,
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 15, 
    backgroundColor: '#f9f9f9', 
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
    color: '#474747'
  },
  button: {
    width: "30%",
    backgroundColor: "#d7be69",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "#ffffff"
  },
});
