import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';

import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';
import NotificationsContainer from '@/components/NotificationsContainer';
import { fetchNotifications } from '@/api/notifications';
import { Notification } from '@/types/interface';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("authToken");
      setToken(storedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          setError('No authentication token found');
          return;
        }
        const data = await fetchNotifications(token);
        console.log(data); // Add this line to inspect the structure

        const notificationsArr = Array.isArray(data) ? data : [];
        
        const mapped: Notification[] = notificationsArr.map((n: any) => {
          const dt = new Date(n.created_at);                // parses "May 19, 2025 13:33"
          const date = dt.toLocaleDateString("en-US", {
            month: "long",    // “May”
            day:   "numeric", // “19”
            year:  "numeric"  // “2025”
          });
          const time = dt.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
          });                                               // e.g. "1:33 PM"

          return {
            id: n.id.toString(),
            title: n.title,
            content: n.message,
            date,
            time,
            is_read: n.is_read,
          };
        });
        setNotifications(mapped);
      } catch (err: any) {
        setError(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      loadNotifications();
    }
  }, [token]);

  const sortedNotifications = [...notifications].sort((a, b) => {
    const dateTimeA = new Date(`${a.date} ${a.time}`).getTime();
    const dateTimeB = new Date(`${b.date} ${b.time}`).getTime();
    return dateTimeB - dateTimeA;
  });

  return (
    <View style={styles.container}>
      <Header screen='Notifications' />
      <View style={styles.notificationsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.gold} />
        ) : error ? (
          <Text style={{ color: 'red' }}>{error}</Text>
        ) : (
          <NotificationsContainer notifications={sortedNotifications} token={token} />
        )}
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
  notificationsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});
