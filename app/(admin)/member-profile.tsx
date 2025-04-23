import { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { router, useFocusEffect } from 'expo-router';

import Header from '@/components/NavigateBackHeader';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Profile {
  image: any,
  username: string,
  fullName: string,
  membershipType: string,
  subscriptionStatus: string,
}

export default function MemberProfileScreen() {
  const [profile, setProfile] = useState<Profile>({
      image: require("@/assets/images/icon.png"),
      username: 'John',
      fullName: 'John Doe',
      membershipType: 'Tier 1',
      subscriptionStatus: 'Active',
  });

  const [membershipType, setMembershipType] = useState<string | undefined>('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | undefined>('');

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
          <Text style={styles.username}>{profile.username}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollViewCont}>
        <View style={styles.detailsContainer}>
          {/* Full Name Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{profile.fullName}</Text>
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

          {/* Subscription Status Details*/}
          <View style={styles.field}>
            <Text style={styles.label}>Subscription Status</Text>
            <View style={styles.typePicker}>
              <RNPickerSelect
                onValueChange={(value) => setSubscriptionStatus(value)}
                items={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
                style={pickerSelectStyles}
                value={subscriptionStatus}
                placeholder={{ label: 'Choose Subscription Status', value: null }}
                useNativeAndroidPickerStyle={false}
                Icon={() =>
                  Platform.OS === "ios" ? (
                    <MaterialCommunityIcons name="chevron-down" size={20} color="gray" />
                  ) : null
                }
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/(admin)/members')}>
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