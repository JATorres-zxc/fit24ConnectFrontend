import { Text, View, StyleSheet, Platform } from 'react-native';

import Header from '@/components/HistoryHeader';
import { Colors } from '@/constants/Colors';
import AccessLogsContainer from '@/components/AccessLogsContainer';

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Fonts } from '@/constants/Fonts';

// Import interface for the access log object
import { AccessLog } from '@/types/interface';

export default function HistoryScreen() {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch access logs when component mounts
    const fetchAccessLogs = async () => {
      try {
        const API_BASE_URL = 
          Platform.OS === 'web'
            ? 'http://127.0.0.1:8000' // Web uses localhost
            : 'http://192.168.1.5:8000'; // Mobile uses local network IP (adjust as needed)

        const token = await AsyncStorage.getItem('authToken');
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
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccessLogs();
  }, []);

  return (
    <View style={styles.container}>
      <Header userType='trainer' />

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
