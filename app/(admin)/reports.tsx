import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
  const [reports, setReports] = useState([]); // Replace with actual data fetching logic

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');

  const showExportPopup = async (reportType: string) => {
    setSelectedReportType(reportType);
    setModalVisible(true);

    try {
      const API_BASE_URL =
        Platform.OS === 'web'
          ? 'http://127.0.0.1:8000'
          : 'http://192.168.1.11:8000';
  
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/reports/facility-access-pdf/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportType }),
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);
  
        // Web: open PDF in new tab
        if (Platform.OS === 'web') {
          window.open(fileURL);
        } else {
          // Mobile: use FileSystem API like expo-file-system to save/view file
          console.warn('File preview/download not implemented for mobile.');
        }
      } else {
        console.error('Failed to export report', await response.text());
      }
    } catch (error) {
      console.error('Export failed:', error);
    }

    setTimeout(() => {
      setModalVisible(false);
    }, 2000); // Hide after 2 seconds
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const API_BASE_URL = 
          Platform.OS === 'web'
            ? 'http://127.0.0.1:8000'
            : 'http://192.168.1.11:8000';
  
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/reports/reports/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);
  
          const formattedReports = data.map((item) => ({
            id: item.id.toString(),
            // reportType: item.report_type,
            startDate: formatDate(item.start_date),
            endDate: formatDate(item.end_date),
            generatedDate: formatDate(item.generated_date),
          }));
  
          setReports(formattedReports);
        } else {
          console.error('Failed to fetch reports', await response.text());
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
  
    fetchReports();
  }, []);
  
  const formatDate = (dateString: string) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };  

  return (
    <View style={styles.container}>
      <Header screen='Reports' />
      {reports.length > 0 ? (
        <>
          <TouchableOpacity style={styles.topButton} onPress={() => {router.push('/(admin)/generate-report')}}>
            <Text style={styles.buttonText}>Generate Report</Text>
          </TouchableOpacity>

          <FlatList
            style={styles.reportList}
            data={reports}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.headerLabel}>Report Type:{' '}
                    <Text style={styles.headerValue}>{item.reportType}</Text>
                  </Text>
                  <TouchableOpacity onPress={() => showExportPopup(item.reportType)}>
                    <MaterialCommunityIcons name="export" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.label}>Date Interval:{' '}
                    <Text style={styles.value}>{item.startDate} to {item.endDate}</Text>
                  </Text>
                  <Text style={styles.label}>Generated on:{' '}
                  <Text style={styles.value}>{item.generatedDate}</Text>
                  </Text>
                </View>
              </View>
            )}
          />

          <Modal animationType="fade" transparent={true} visible={isModalVisible}>
            <View style={styles.modalOverlay}>
              <View style={styles.customModal}>
                <MaterialCommunityIcons name="book-open-page-variant-outline" size={100} color={Colors.black} />
                <Text style={styles.modalTitle}>Report exported</Text>
                <Text style={styles.modalSubtitle}>
                  <Text style={styles.modalItalic}>"{selectedReportType}"</Text> was saved to your device.
                </Text>
              </View>
            </View>
          </Modal>

        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.message}>You have not generated any report.</Text>
          <TouchableOpacity style={styles.button} onPress={() => {router.push('/(admin)/generate-report')}}>
            <Text style={styles.buttonText}>Generate Report</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  topButton: {
    backgroundColor: Colors.gold,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '85%',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.black,
    marginBottom: 20,
  },
  reportList: {
    flex: 1,
    width: '85%',
  },
  card: {
    padding: 10,
    paddingBottom: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerLabel: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    color: Colors.black,
  },
  headerValue: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  cardContent: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.black,
    marginBottom: 5,
  },
  value: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.gold,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: Fonts.medium,
  },
  customModal: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    width: 280,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: Fonts.semibold,
    marginTop: 15,
    color: Colors.black,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color: Colors.black,
    fontFamily: Fonts.regular,
  },
  modalItalic: {
    fontFamily: Fonts.italic,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },    
});
