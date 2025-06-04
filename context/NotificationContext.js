import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchNotifications } from '@/api/notifications';
import { getItem } from '@/utils/storageUtils';
import { useFocusEffect } from '@react-navigation/native';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  // Get token on mount
  useEffect(() => {
    const getToken = async () => {
      const storedToken = await getItem("authToken");
      setToken(storedToken);
    };
    getToken();
  }, []);

  // Function to fetch and update unread count
  const updateUnreadCount = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const data = await fetchNotifications(token);
      const notificationsArr = Array.isArray(data) ? data : [];
      const unread = notificationsArr.filter(n => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Update count when token is available
  useEffect(() => {
    if (token) {
      updateUnreadCount();
    }
  }, [token, updateUnreadCount]);

  // Function to decrease unread count when a notification is read
  const markAsRead = useCallback((notificationId) => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Function to refresh unread count (useful for pull-to-refresh)
  const refreshUnreadCount = useCallback(() => {
    updateUnreadCount();
  }, [updateUnreadCount]);

  const value = {
    unreadCount,
    loading,
    markAsRead,
    refreshUnreadCount,
    updateUnreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};