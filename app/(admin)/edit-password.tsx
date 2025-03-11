import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from "react";
import { router, useNavigation } from 'expo-router';
import Toast from 'react-native-toast-message';

import Header from '@/components/NavigateBackHeader';
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

  const navigation = useNavigation();

  // Clear form fields when the component mounts
  useEffect(() => {
    const resetForm = () => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    };

    // Reset form when the screen comes into focus
    const unsubscribe = navigation.addListener('focus', resetForm);

    // Reset form when component mounts
    resetForm();

    // Clean up the listener when component unmounts
    return unsubscribe;
  }, [navigation]);

  const handleSavePassword = () => {
    // Validate inputs
    if (!currentPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Current password is required',
        topOffset: 100,
      });
      return;
    }
  
    if (newPassword.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'New password must be at least 8 characters',
        topOffset: 100,
      });
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords don\'t match',
        topOffset: 100,
      });
      return;
    }
  
    // Here you would typically call an API to verify current password
    // and update with the new password
    // For example:
    // updatePassword(currentPassword, newPassword)
    //   .then(() => {
    //     Toast.show({
    //       type: 'success',
    //       text1: 'Success',
    //       text2: 'Password updated successfully',
    //     });
    //     router.push('/profile');
    //   })
    //   .catch(error => {
    //     if (error.message === 'Current password is incorrect') {
    //       Toast.show({
    //         type: 'error',
    //         text1: 'Error',
    //         text2: 'Current password is incorrect',
    //       });
    //     } else {
    //       Toast.show({
    //         type: 'error',
    //         text1: 'Error',
    //         text2: 'Unable to update password. Please try again later',
    //       });
    //     }
    //   });
  
    // For demo purposes, show success toast and navigate
    Toast.show({
      type: 'success',
      text1: 'Password Updated',
      text2: 'Your password has been saved successfully',
      topOffset: 100,
    });
    
    // Short delay before navigation to allow toast to be seen
    setTimeout(() => {
      router.push('/(admin)/settings');
    }, 1500);
  };

  // Handle cancel action
  const handleCancel = () => {
    // Clear form fields before navigating away
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    router.push('/(admin)/settings');
  };
  

  return (
    <View style={styles.container}>
      <Header screen='Edit Password' prevScreen='/(admin)/settings' />

      <ScrollView style={styles.scrollViewCont}>
        <Text style={styles.title}>
            Create new password
        </Text>
        <Text style={styles.description}>
            Your new password must be different from your current password.          
        </Text>

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
                <FontAwesome name={showCurrentPassword ? "eye" : "eye-slash"} size={20} color={Colors.eyeIcon} />
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
                <FontAwesome name={showNewPassword ? "eye" : "eye-slash"} size={20} color={Colors.eyeIcon} />
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
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(prev => !prev)} style={styles.icon}>
                <FontAwesome name={showConfirmPassword ? "eye" : "eye-slash"} size={20} color={Colors.eyeIcon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.reminder}>
              Both passwords must match.
            </Text>
          </View>

        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancel} onPress={handleCancel}>
            <Text style={styles.buttonText}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.save} onPress={handleSavePassword}>
            <Text style={styles.buttonText}>
              Save Password
            </Text>
          </TouchableOpacity>
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
  scrollViewCont: {
    width: '85%',
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
    borderColor: Colors.border,
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
    justifyContent: 'center',
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
