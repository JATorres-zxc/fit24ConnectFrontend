import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useState } from "react";
import { router } from 'expo-router';

import Header from '@/components/EditPasswordHeader';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

export default function EditPasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State to toggle visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); 
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  return (
    <View style={styles.container}>
      <Header />

      <View>
        <Text style={styles.title}>
            Create new password
        </Text>
        <Text style={styles.description}>
            Your new password must be different from your current password.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.label}>
            Current Password
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TouchableOpacity onPress={() => setShowCurrentPassword(prev => !prev)} style={styles.icon}>
              <FontAwesome name={showCurrentPassword ? "eye" : "eye-slash"} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>  
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>
            New Password
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(prev => !prev)} style={styles.icon}>
              <FontAwesome name={showNewPassword ? "eye" : "eye-slash"} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>
          <Text style={styles.reminder}>
            Must be at least 8 characters.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>
            Confirm Password
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)} style={styles.icon}>
              <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>
          <Text style={styles.reminder}>
            Both passwords must match.
          </Text>
        </View>

      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancel} onPress={() => router.push('/profile')}>
          <Text style={styles.buttonText}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.save} onPress={() => router.push('/profile')}>
          <Text style={styles.buttonText}>
            Save Password
          </Text>
        </TouchableOpacity>
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
  title: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    marginBottom: 10,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    marginBottom: 20,
  },
  formContainer: {
    marginVertical: 10,
    width: '85%',
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  icon: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  reminder: {
    fontFamily: Fonts.italic,
    fontSize: 10,
    paddingTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  cancel: {
    backgroundColor: Colors.red,
    width: 130,
    padding: 10,
    borderRadius: 8,
  },
  save: {
    backgroundColor: Colors.gold,
    width: 130,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
});
