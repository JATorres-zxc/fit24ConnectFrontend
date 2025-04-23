import { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  return (
    <View style={styles.container}>
      <Header screen='Update Subscription' prevScreen='/(admin)/members' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
});