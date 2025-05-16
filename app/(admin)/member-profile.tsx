import { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';

import Header from '@/components/NavigateBackHeader';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import MemberProfile interface
import { MemberProfile } from '@/types/interface';

export default function MemberProfileScreen() {
  const { memberId, fullName, membershipType, membershipStartDate, membershipEndDate } = useLocalSearchParams();

  // Function to format membership type from backend format to display format
  const formatMembershipType = (backendType: string): string => {
    if (!backendType) return "";
    
    // Convert e.g., "tier2" to "Tier 2"
    const match = backendType.match(/tier(\d+)/i);
    if (match) {
      return `Tier ${match[1]}`;
    }
    
    // Fallback for other formats - capitalize first letter and add space before any digit
    return backendType
      .replace(/^(.)(.*)$/, (_, first: string, rest: string) => first.toUpperCase() + rest)
      .replace(/(\d+)/, ' $1')
      .trim();
  };

  const [profile, setProfile] = useState<MemberProfile>({
    image: require("@/assets/images/icon.png"),
    username: '',
    fullName: '',
    membershipType: '',
    startDate: '',
    endDate: '',
  });

  // Initialize selectedMembershipType with the correct formatted value from params
  const [selectedMembershipType, setSelectedMembershipType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasMembership, setHasMembership] = useState(false);

  // Reset and update all states when params change
  useEffect(() => {
    console.log('Params updated:', memberId);
    console.log('Full Name:', fullName);
    console.log('Membership Type:', membershipType);
    console.log('Dates:', membershipStartDate, membershipEndDate);
    
    // Reset all state to ensure no data from previous member persists
    setProfile({
      image: require("@/assets/images/icon.png"),
      username: fullName ? String(fullName).split(' ')[0] : '',
      fullName: fullName ? String(fullName) : '',
      membershipType: membershipType ? String(membershipType) : '',
      startDate: membershipStartDate ? String(membershipStartDate) : '',
      endDate: membershipEndDate ? String(membershipEndDate) : '',
    });

    // Update membership type display
    setSelectedMembershipType(
      membershipType ? formatMembershipType(String(membershipType)) : ""
    );
    
    // Update dates
    setStartDate(membershipStartDate ? String(membershipStartDate) : "");
    setEndDate(membershipEndDate ? String(membershipEndDate) : "");

    //Determine if member has current membership
    setHasMembership(
      Boolean(membershipStartDate && membershipEndDate)
    );
  }, [memberId, fullName, membershipStartDate, membershipEndDate, membershipType]);

  const updateMemberDetails = async () => {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    if (startDate && !dateRegex.test(startDate)) {
      Toast.show({
        type: "error",
        text1: "Invalid Date Format",
        text2: "Start date must be in YYYY-MM-DD format",
      });
      return;
    }
    
    if (endDate && !dateRegex.test(endDate)) {
      Toast.show({
        type: "error",
        text1: "Invalid Date Format",
        text2: "End date must be in YYYY-MM-DD format",
      });
      return;
    }

    const API_BASE_URL = 
      Platform.OS === 'web'
        ? 'http://127.0.0.1:8000'
        : 'http://192.168.1.11:8000';
  
    const token = await AsyncStorage.getItem('authToken');
  
    try {
      // Update Membership Type
      if (selectedMembershipType) {
        // Convert e.g., "Tier 2" to "tier2"
        const backendMembershipType = selectedMembershipType
          .toLowerCase()
          .replace(/tier\s*(\d+)/, 'tier$1');

        const typeResponse = await fetch(`${API_BASE_URL}/api/account/admin/update-membership-type/${memberId}/`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type_of_membership: backendMembershipType,
          }),
        });
  
        if (!typeResponse.ok) {
          const err = await typeResponse.text();
          console.error('Membership type update failed:', err);
        }
      }

      if (startDate !== membershipStartDate || endDate !== membershipEndDate) {
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
      Toast.show({
        type: "success",
        text1: "Update Successful",
        text2: `Successfully updated ${profile.fullName}'s subscription details`,
        visibilityTime: 1500
      });
      setTimeout(() => {
        router.push('/(admin)/members');
      }, 1600);
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
          <Text style={styles.username}>{fullName ? (fullName as string).split(' ')[0] : 'User has not set up profile.'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollViewCont}>
        <View style={styles.detailsContainer}>
          {/* Full Name Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{fullName ? fullName : ''}</Text>
          </View>

          {/* Membership Type Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Membership Type</Text>
            <View style={styles.typePicker}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedMembershipType(value)}
                items={[
                  { label: 'Tier 1', value: 'Tier 1' },
                  { label: 'Tier 2', value: 'Tier 2' },
                  { label: 'Tier 3', value: 'Tier 3' },
                ]}
                style={pickerSelectStyles}
                value={selectedMembershipType || (hasMembership ? hasMembership : null)}
                placeholder={{
                  label: "Choose Membership Type",
                  value: null,
                  color: 'gray',
                }}
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
              placeholder={membershipStartDate ? String(membershipStartDate) : "YYYY-MM-DD"}
              placeholderTextColor={Colors.textSecondary}
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>

          {/* Subscription End Date Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Subscription End Date</Text>
            <TextInput
              placeholder={membershipEndDate ? String(membershipEndDate) : "YYYY-MM-DD"}
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
      <Toast />
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