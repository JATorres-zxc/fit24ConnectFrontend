import { Text, View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-date-picker';

import Header from '@/components/NavigateBackHeader';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function ReportsFormScreen() {
  const [trainer, setTrainer] = useState<string | number | undefined>('');
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  return (
    <View style={styles.container}>
      <Header screen='Generate Report' prevScreen='/(admin)/reports' />

      <View style={styles.formContainer}>
        <Text style={styles.formHeader}> Report Type </Text>
        <View style={styles.reportPicker}>
          <RNPickerSelect
            onValueChange={(value) => setTrainer(value)}
            items={[
              { label: 'Memberships', value: 'memberships' },
              { label: 'Access History', value: 'history' },
            ]}
            style={trainerpickerSelectStyles}
            value={trainer}
            placeholder={{ label: 'Select Desired Report Type', value: null }}
            useNativeAndroidPickerStyle={false}
            Icon={() =>
              Platform.OS === "ios" ? (
                <Ionicons name="chevron-down" size={20} color="gray" />
              ) : null
            }
            />
        </View>

        <Text style={styles.formHeader}> Start Date </Text>
        <View style={styles.datePicker}>
          <DatePicker
            modal
            open={open}
            date={date}
            onConfirm={(date) => {
              setOpen(false)
              setDate(date)
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
        </View>

        <Text style={styles.formHeader}> End Date </Text>
        <View style={styles.datePicker}>
          <RNPickerSelect
            onValueChange={(value) => setTrainer(value)}
            items={[
              { label: 'Memberships', value: 'memberships' },
              { label: 'Access History', value: 'history' },
            ]}
            style={trainerpickerSelectStyles}
            value={trainer}
            placeholder={{ label: 'Choose End Date', value: null }}
            useNativeAndroidPickerStyle={false}
            Icon={() =>
              Platform.OS === "ios" ? (
                <Ionicons name="chevron-down" size={20} color="gray" />
              ) : null
            }
            />
        </View>

        <TouchableOpacity style={styles.generateButton}>
          <Text style={styles.buttonText}>Generate Report</Text>
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
  formContainer: {
    flex: 1,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formHeader: {
    fontSize: 16,
    marginBottom: 15,
    alignSelf: "flex-start",
    fontFamily: Fonts.semibold,
  },
  reportPicker: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  datePicker: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    width: "50%",
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: Fonts.medium,
  }
});

const trainerpickerSelectStyles = {
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
