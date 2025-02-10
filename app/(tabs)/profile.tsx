import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // For safe area handling

const ProfileHeader = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <Text style={styles.headerText}>Profile</Text>
      {/* Add other header elements here */}
    </View>
  );
};


export default function ProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ProfileHeader />{/* Include the custom header */}
      <View style={styles.content}>
        <Text>Profile Content</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f9f9f9', // Example header background color
    height: 100, // Example header height
    justifyContent: 'center',
    alignItems: 'center',
    //paddingTop: insets.top, // Add padding for safe area
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});