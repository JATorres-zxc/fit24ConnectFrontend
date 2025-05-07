import { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import Header from '@/components/NavigateBackHeader';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Profile {
  image: any,
  username: string,
  fullName: string,
  membershipType: string,
  startDate?: string,
  endDate?: string,
}

export default function MemberProfileScreen() {
  const [profile, setProfile] = useState<Profile>({
      image: require("@/assets/images/icon.png"),
      username: '',
      fullName: '',
      membershipType: '',
      startDate: '',
      endDate: '',
  });

  const { memberId, fullName, membershipStartDate, membershipEndDate } = useLocalSearchParams();

  const [membershipType, setMembershipType] = useState<string | undefined>('');
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const validateDate = (dateString: string): boolean => {
    // Simple regex check for mm/dd/yyyy format
    return /^\d{2}\/\d{2}\/\d{4}$/.test(dateString);
  };
  
  // Then in your update function:
  if (startDate && !validateDate(startDate)) {
    alert('Please enter start date in MM/DD/YYYY format');
    return;
  }

  const formatDateForBackend = (dateString: string): string => {
    // If the date is already in yyyy-mm-dd format, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
  
    // Try to parse as mm/dd/yyyy
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  
    // If format is unrecognized, return empty string or handle error
    return '';
  };

  useEffect(() => {
    console.log('Member ID:', memberId);
  }, [memberId]);

  const updateMemberDetails = async () => {
    const API_BASE_URL = 
      Platform.OS === 'web'
        ? 'http://127.0.0.1:8000'
        : 'http://192.168.1.11:8000';
  
    const token = await AsyncStorage.getItem('authToken');
  
    try {
      // Update Membership Type
      if (membershipType) {
        const typeResponse = await fetch(`${API_BASE_URL}/api/account/admin/update-membership-type/${memberId}/`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type_of_membership: membershipType.toLowerCase().replace(' ', ''), // e.g., "Tier 1" -> "tier1"
          }),
        });
  
        if (!typeResponse.ok) {
          const err = await typeResponse.text();
          console.error('Membership type update failed:', err);
        }
      }

      // Format dates for backend
      const formattedStartDate = startDate ? formatDateForBackend(startDate) : '';
      const formattedEndDate = endDate ? formatDateForBackend(endDate) : '';

      if (formattedStartDate !== membershipStartDate || formattedEndDate !== membershipEndDate) {
        const datesResponse = await fetch(`${API_BASE_URL}/api/account/admin/members/${memberId}/status/`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            membership_start_date: startDate,
            membership_end_date: endDate,
          }),
        });
  
        if (!datesResponse.ok) {
          throw new Error('Subscription dates update failed');
        }
      }
      // Optional: Navigate or give feedback
      alert('Update successful!');
      router.push('/(admin)/members');
    } catch (error) {
      console.error('Error updating member details:', error);
    }
  };  

  return (
    <View style={styles.container}>
      <Header screen='Update Subscription' prevScreen='/(admin)/members' />

      <View style={styles.profileContainer}>
        <View style={styles.imageContainer}>
          <Image 
            source={typeof profile.image === 'string' ? { uri: profile.image } : profile.image} 
            style={styles.profileImage} 
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.username}>{(fullName as string).split(' ')[0] || ''}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollViewCont}>
        <View style={styles.detailsContainer}>
          {/* Full Name Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{fullName}</Text>
          </View>

          {/* Membership Type Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Membership Type</Text>
            <View style={styles.typePicker}>
              <RNPickerSelect
                onValueChange={(value) => setMembershipType(value)}
                items={[
                  { label: 'Tier 1', value: 'Tier 1' },
                  { label: 'Tier 2', value: 'Tier 2' },
                  { label: 'Tier 3', value: 'Tier 3' },
                ]}
                style={pickerSelectStyles}
                value={membershipType}
                placeholder={{ label: 'Choose Membership Type', value: null }}
                useNativeAndroidPickerStyle={false}
                Icon={() =>
                  Platform.OS === "ios" ? (
                    <MaterialCommunityIcons name="chevron-down" size={20} color="gray" />
                  ) : null
                }
              />
            </View>
          </View>

          {/* Subscription Start Date Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Subscription Start Date</Text>
            <TextInput
              placeholder="MM/DD/YYYY"
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>

          {/* Subscription Start Date Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Subscription End Date</Text>
            <TextInput
              placeholder="MM/DD/YYYY"
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={updateMemberDetails}>
              <Text style={styles.buttonText}>Update Details</Text>
            </TouchableOpacity>
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
  typePicker: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  input: {
    marginBottom: 10,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 5,
    fontFamily: Fonts.regular,
},
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    width: "50%",
  },
  buttonText: {
    fontFamily: Fonts.medium,
    color: Colors.white,
    textAlign: 'center',
  }
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingRight: 30, 
    color: Colors.textSecondary,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingRight: 30, // to ensure the text is never behind the icon
    color: Colors.textSecondary,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
};