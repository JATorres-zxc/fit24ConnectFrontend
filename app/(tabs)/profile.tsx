import { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '@/components/ProfileHeader';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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

export default function ProfileScreen() {
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

  /** 🔹 Load profile data when screen is focused */
  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const storedProfile = await AsyncStorage.getItem('profile');
          if (storedProfile) {
            const parsed = JSON.parse(storedProfile);
            setProfile({
              ...parsed,
              image:
                parsed.image && typeof parsed.image === "string"
                  ? { uri: parsed.image }
                  : require("@/assets/images/icon.png"),
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      };
      loadProfile();
    }, [])
  );

  /** 🔹 Load profile on component mount */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem("profile");
        console.log("Stored Profile:", storedProfile);
  
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          setProfile({
            ...parsed,
            image:
              parsed.image && typeof parsed.image === "string"
                ? { uri: parsed.image } // If stored as a string, set as `uri`
                : require("@/assets/images/icon.png"), // Fallback to local image
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);
  

  /** 🔹 Save profile properly */
  const saveProfile = async (updatedProfile: Profile) => {
    try {
      const profileToSave = {
        ...updatedProfile,
        image:
          updatedProfile.image?.uri || // If image is a URI (remote)
          (typeof updatedProfile.image === "string" ? updatedProfile.image : null) || // If image is already a string
          null, // Default to null if it's an invalid number
      };
  
      await AsyncStorage.setItem("profile", JSON.stringify(profileToSave));
      console.log("Profile saved successfully:", profileToSave);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };
  

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
          <Text style={styles.username}>{profile.username}</Text>
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

          {/* Address Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{profile.address}</Text>
          </View>

          {/* Phone Number Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{profile.phoneNo}</Text>
          </View>
        </View>
      </ScrollView>

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
});
