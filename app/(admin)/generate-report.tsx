import { Text, View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import Header from '@/components/NavigateBackHeader';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Ionicons } from '@expo/vector-icons';

export default function ReportsFormScreen() {
  const [reportType, setReportType] = useState<string | number | undefined>('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Handle date change for start date
  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
  };

  // Handle date change for end date
  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
  };

  const handleGenerateReport = () => {
    if (!reportType || !startDate || !endDate) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Fields',
        text2: 'Please select a report type',
        topOffset: 100,
      });
      return;
    }

    if (!startDate || !endDate) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Fields',
        text2: 'Please select both dates.',
      });
      return;
    }
  
    if (endDate < startDate) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date Range',
        text2: 'End date cannot be earlier than start date.',
      });
      return;
    }
  
    // Proceed to generate report
    Toast.show({
      type: 'success',
      text1: 'Generating Report',
      text2: 'Your report is being processed...',
    });
  };

  return (
    <View style={styles.container}>
      <Header screen='Generate Report' prevScreen='/(admin)/reports' />

      <View style={styles.formContainer}>
        <Text style={styles.formHeader}> Report Type </Text>
        <View style={styles.reportPicker}>
          <RNPickerSelect
            onValueChange={(value) => setReportType(value)}
            items={[
              { label: 'Memberships', value: 'memberships' },
              { label: 'Access History', value: 'history' },
            ]}
            style={trainerpickerSelectStyles}
            value={reportType}
            placeholder={{ label: 'Select Desired Report Type', value: null }}
            useNativeAndroidPickerStyle={false}
            Icon={() =>
              Platform.OS === "ios" ? (
                <Ionicons name="chevron-down" size={20} color="gray" />
              ) : null
            }
            />
        </View>
        
        <View style={styles.dateForm}>
          <Text style={styles.dateHeader}> Start Date </Text>
          <View style={styles.datePicker}>
            <RNDateTimePicker
              mode="date"
              display="default"
              themeVariant="light"
              value={startDate || new Date()}
              onChange={handleStartDateChange}
            />
          </View>
        </View>
        
        <View style={styles.dateForm}>
          <Text style={styles.dateHeader}> End Date </Text>
          <View style={styles.datePicker}>
            <RNDateTimePicker
              mode="date"
              display="default"
              themeVariant="light"
              value={endDate || new Date()}
              onChange={handleEndDateChange}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateReport}>
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
  dateHeader: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: Fonts.semibold,
    paddingTop: 8,
  },
  dateForm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  datePicker: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
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
