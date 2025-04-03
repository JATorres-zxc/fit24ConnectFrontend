import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const reports = [
  {id: "1", reportType: "Memberships", startDate: "Jan 1, 2023", endDate: "Dec 31, 2023", generatedDate: "Mar 9, 2025"},
];

export default function HistoryScreen() {
  const [reports, setReports] = useState([
    {id: "1", reportType: "Memberships", startDate: "Jan 1, 2023", endDate: "Dec 31, 2023", generatedDate: "Mar 9, 2025"}
  ]); // Replace with actual data fetching logic

  return (
    <View style={styles.container}>
      <Header screen='Reports' />
      {reports.length > 0 ? (
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
                <MaterialCommunityIcons name="export" size={24} color="black" />
              </View>
              <Text style={styles.label}>Date Interval:{' '}
                <Text style={styles.value}>{item.startDate} to {item.endDate}</Text>
              </Text>
              <Text style={styles.label}>Generated on:{' '}
              <Text style={styles.value}>{item.generatedDate}</Text>
              </Text>
            </View>
          )}
        />
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
    fontFamily: Fonts.medium,
    color: Colors.black,
  },
  headerValue: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.black,
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
    color: Colors.white,
    textAlign: 'center',
    fontFamily: Fonts.medium,
  },
});
