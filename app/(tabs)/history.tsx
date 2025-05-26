import { Text, View, StyleSheet, Platform } from 'react-native';

import Header from '@/components/HistoryHeader';
import { Colors } from '@/constants/Colors';
import AccessLogsContainer from '@/components/AccessLogsContainer';

import { useCallback, useEffect, useState } from 'react';
import { getItem } from '@/utils/storageUtils';
import Toast from 'react-native-toast-message';
import { Fonts } from '@/constants/Fonts';
import { API_BASE_URL } from '@/constants/ApiConfig';

// Import interface for the access log object
import { AccessLog } from '@/types/interface';
import { useFocusEffect } from 'expo-router';

export default function HistoryScreen() {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch access logs from the API
  const fetchAccessLogs = async () => {
    try {
      const token = await getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/facility/my-access-logs/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          }
        });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
        
      const data = await response.json();
      console.log("Fetched data: ", data)
        
      // Sort the logs in descending order (most recent first)
      setAccessLogs(
        data.sort(
          (a: AccessLog, b: AccessLog) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
      );
    } catch (error) {
      console.error("Error fetching access logs:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load access logs",
        text2: "Please try again later",
        topOffset: 80,
        });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccessLogs();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header userType='member' />

      <View style={styles.logsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading access logs...</Text>
          </View>
        ) : accessLogs.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No access logs found.</Text>
          </View>
        ) : (
          <AccessLogsContainer accessLogs={accessLogs} />
        )}
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
  logsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Fonts.regular,
  },
});
