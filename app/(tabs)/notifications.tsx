import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Header from '@/components/NotificationsHeader';
import { Colors } from '@/constants/Colors';
import NotificationsContainer from '@/components/NotificationsContainer';
import { fetchNotifications } from '@/api/notifications';
import { getItem } from '@/utils/storageUtils';
import { useNotifications } from '@/context/NotificationContext';

interface RawNotification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<RawNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { unreadCount, markAsRead, refreshUnreadCount } = useNotifications();

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await getItem("authToken");
      setToken(storedToken);
    };
    getToken();
  }, []);

  // Refresh notifications when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshUnreadCount();
    }, [refreshUnreadCount])
  );

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
        const notificationsArr = Array.isArray(data) ? data : [];
        setNotifications(notificationsArr);
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

  // Handle notification read callback
  const handleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id.toString() === id ? { ...n, is_read: true } : n)
    );
    markAsRead(id);
  };

  return (
    <View style={styles.container}>
      <Header userType='member' />
      <View style={styles.notificationsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.gold} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <NotificationsContainer 
            rawNotifications={notifications} 
            token={token}
            onNotificationRead={handleNotificationRead} 
          />
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
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    margin: 16,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    fontWeight: '500',
  },
});
