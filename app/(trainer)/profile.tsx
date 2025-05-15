import { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
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
  contact_number: string,
  experience: string,
}

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  
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
  
  const [profile, setProfile] = useState<Profile>({
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const API_BASE_URL = 
        Platform.OS === 'web'
          ? 'http://127.0.0.1:8000'
          : 'http://192.168.1.11:8000';

      const token = await AsyncStorage.getItem('authToken');
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
      console.log('Profile API Response:', data);

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

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Refresh profile when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

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
