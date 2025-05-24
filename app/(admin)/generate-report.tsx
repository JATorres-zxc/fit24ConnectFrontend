import { Text, View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import Header from '@/components/NavigateBackHeader';
import { API_BASE_URL } from '@/constants/ApiConfig';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { getItem } from '@/utils/storageUtils';


export default function ReportsFormScreen() {
  const [reportType, setReportType] = useState<string | number | undefined>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setReportType('');
      setStartDate('');
      setEndDate('');
    }, [])
  );

  const handleGenerateReport = async () => {
    if (!reportType) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Fields',
        text2: 'Please select a report type',
        topOffset: 80,
      });
      return;
    }

    if (!startDate || !endDate) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Fields',
        text2: 'Please select both dates.',
        topOffset: 80,
      });
      return;
    }
  
    if (endDate < startDate) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date Range',
        text2: 'End date cannot be earlier than start date.',
        topOffset: 80,
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (endDate > today) {
      Toast.show({
        type: 'error',
        text1: 'Invalid End Date',
        text2: 'End date cannot be later than today.',
        topOffset: 80,
      });
      return;
    }
  
    try {
      setIsSubmitting(true);

      const token = await getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      // Map frontend report types to backend values
      const typeMapping: { [key: string]: string } = {
        'memberships': 'membership',
        'history': 'access_logs'
      };

      const reportData = {
        title: `${reportType} Report (${startDate} - ${endDate})`,
        type: typeMapping[reportType],
        start_date: startDate,
        end_date: endDate,
        facility: null // Add facility ID here if needed
      };

      const response = await fetch(`${API_BASE_URL}/api/reports/reports/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create report');
      }

      Toast.show({
        type: 'success',
        text1: 'Report Generated',
        text2: 'Your report has been created successfully',
        topOffset: 80,
        visibilityTime: 2000,
        autoHide: true,
        onHide: () => router.push('/(admin)/reports')
      });

    } catch (error) {
      console.error('Report generation error:', error);
      Toast.show({
        type: 'error',
        text1: 'Generation Failed',
        text2: error instanceof Error ? error.message : 'Failed to create report',
        topOffset: 80,
      });
    } finally {
      setIsSubmitting(false);
    }
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
        
        {/* Date Picker for Start Date */}
        <View style={styles.dateForm}>
          <Text style={styles.dateHeader}> Start Date </Text>
          <DateTimePicker
            value={startDate ? new Date(startDate) : new Date()}
            mode="date"
            display="default"
            themeVariant='light'
            onChange={(event, date) => {
              if (date) setStartDate(date.toISOString().split('T')[0]);
            }}
          />
        </View>
        
        {/* Date Picker for End Date */}
        <View style={styles.dateForm}>
          <Text style={styles.dateHeader}> End Date </Text>
          <DateTimePicker
            value={endDate ? new Date(endDate) : new Date()}
            mode="date"
            display="default"
            themeVariant='light'
            onChange={(event, date) => {
              if (date) setEndDate(date.toISOString().split('T')[0]);
            }}
          />
        </View>

        <TouchableOpacity 
          style={[styles.generateButton, isSubmitting && styles.disabledButton]}
          onPress={handleGenerateReport}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Generating...' : 'Generate Report'}
          </Text>
        </TouchableOpacity>
      </View>
    
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
    marginBottom: 10,
  },
  dateForm: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 20,
  },
  datePicker: {
  borderWidth: 1,
  borderRadius: 8,
  padding: 10,
  backgroundColor: Colors.white,
  width: '100%',
  justifyContent: 'center',
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
  },
  input: {
    marginBottom: 10,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: Fonts.regular,
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
    opacity: 0.7,
  },
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
