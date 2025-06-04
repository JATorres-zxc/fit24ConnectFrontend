import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';

import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';
import NotificationsContainer from '@/components/NotificationsContainer';
import { fetchNotifications } from '@/api/notifications';
import { Notification } from '@/types/interface';
import { getItem } from '@/utils/storageUtils';
import { useNotifications } from '@/context/NotificationContext';
import { useFocusEffect } from '@react-navigation/native';

type MonthMap = {
  [key: string]: string;
};

// Helper function to safely parse dates
const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date();
  
  // Try different parsing approaches
  let date: Date;
  
  // First, try direct parsing
  date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // If that fails, try to clean the string
  // Handle formats like "May 19, 2025 13:33"
  const cleanedString = dateString.replace(/(\w+)\s+(\d+),\s+(\d+)\s+(\d+):(\d+)/, '$1 $2, $3 $4:$5:00');
  date = new Date(cleanedString);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // Try ISO format conversion
  try {
    // Convert "May 19, 2025 13:33" to ISO format
    const parts = dateString.match(/(\w+)\s+(\d+),\s+(\d+)\s+(\d+):(\d+)/);
    if (parts) {
      const [, month, day, year, hour, minute] = parts;
      const monthMap: MonthMap = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
      };
      const monthNum = monthMap[month] || '01';
      const isoString = `${year}-${monthNum}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00.000Z`;
      date = new Date(isoString);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  } catch (e) {
    // Remove console.warn for presentation
  }
  
  // Last resort: return current date
  return new Date();
};

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
        console.log(data); // Add this line to inspect the structure

        const notificationsArr = Array.isArray(data) ? data : [];
        
        const mapped: Notification[] = notificationsArr.map((n: any) => {
          // Parse the date once and store the original timestamp
          const parsedDate = parseDate(n.created_at);
          
          console.log('Original date string:', n.created_at);
          console.log('Parsed date object:', parsedDate);
          
          const date = parsedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          });
          
          const time = parsedDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
          });

          return {
            id: n.id.toString(),
            title: n.title,
            content: n.message,
            date,
            time,
            is_read: n.is_read,
            timestamp: parsedDate.getTime(),
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

  // Handle notification read callback
  const handleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
    markAsRead(id);
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    return (b.timestamp || 0) - (a.timestamp || 0);
  });

  return (
    <View style={styles.container}>
      <Header screen='Notifications' />
      <View style={styles.notificationsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.gold} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <NotificationsContainer 
            notifications={sortedNotifications} 
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
