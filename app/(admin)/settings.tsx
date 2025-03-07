import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import Header from '@/components/AdminSectionHeaders';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

export default function HistoryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header screen="Profile Settings" />

      <View style={styles.detailsContainer}>
        <View style={styles.fields}>
          <Text style={styles.attribute}>
            Full Name
          </Text>
          <Text style={styles.value}>
            John Doe
          </Text>
        </View>

        <View style={styles.fields}>
          <Text style={styles.attribute}>
            Email
          </Text>
          <Text style={styles.value}>
            email@example.com
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.editPass}
              onPress={() => router.push('/edit-password')}
            >
              <Text style={styles.buttonText}> Edit Password </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.logout}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.buttonText}> Logout </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  detailsContainer: {
    width: '85%',
  },
  fields: {
    marginVertical: 15,
  },
  attribute: {
    fontFamily: Fonts.semibold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  value: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  buttonContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  button: {
    width: '40%',
  },
  editPass: {
    backgroundColor: Colors.gold,
    borderRadius: 10,
    padding: 10,
  },
  logout: {
    backgroundColor: Colors.black,
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
  },
});
