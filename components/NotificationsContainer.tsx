// NotificationsContainer.tsx
import React, { useState } from "react";
import { 
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Modal, TouchableWithoutFeedback
} from "react-native";
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { FontAwesome } from "@expo/vector-icons";
import { markNotificationAsRead } from '@/api/notifications';

import { Notification } from '@/types/interface';

interface Props {
  notifications: Notification[];
  token?: string | null;
  onNotificationRead?: (id: string) => void;
}

export default function NotificationsContainer({ notifications, token, onNotificationRead }: Props) {
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const [localNotifications, setLocalNotifications] = useState<any[]>(notifications);

  // Update localNotifications if notifications prop changes
  React.useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const openNotificationModal = async (notification: any) => {
    setSelectedNotification(notification);
    if (!notification.is_read && token) {
      try {
        await markNotificationAsRead(token, notification.id);
        // Update local state
        setLocalNotifications((prev) => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
        if (onNotificationRead) onNotificationRead(notification.id);
      } catch (e) {
        // Optionally handle error
      }
    }
  };

  const closeNotificationModal = () => {
    setSelectedNotification(null);
  };

  const renderNotificationModal = () => {
    if (!selectedNotification) return null;
    let date = '', time = '';
    if (selectedNotification.created_at && typeof selectedNotification.created_at === 'string' && selectedNotification.created_at.includes(' ')) {
      [date, time] = selectedNotification.created_at.split(' ');
    }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedNotification}
        onRequestClose={closeNotificationModal}
      >
        <TouchableWithoutFeedback onPress={closeNotificationModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                  <FontAwesome name="close" color={Colors.white} size={24} onPress={closeNotificationModal} />
                </View>
                <View style={styles.modalContentContainer}>
                  <Text style={styles.modalContent}>{selectedNotification.content}</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={localNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const isUnread = !item.is_read;
          return (
            <TouchableOpacity 
              style={[
                styles.card,
                isUnread && styles.unreadCard
              ]}
              onPress={() => openNotificationModal(item)}
            >
              <View style={styles.leftSection}>
                <View style={styles.titleContainer}>
                  <Text style={[
                    styles.title,
                    isUnread && styles.unreadTitle
                  ]}>
                    {item.title}
                  </Text>
                  {isUnread && <View style={styles.unreadDot} />}
                </View>
                <Text style={[
                  styles.content,
                  isUnread && styles.unreadContent
                ]}>
                  {item.content}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.rightSection}>
                <Text style={[
                  styles.date,
                  isUnread && styles.unreadText
                ]}>
                  {item.date}
                </Text>
                <Text style={[
                  styles.time,
                  isUnread && styles.unreadText
                ]}>
                  {item.time}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.listContainer}
      />
      {renderNotificationModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '85%',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  unreadCard: {
    backgroundColor: '#f8f9ff', // Slightly blue-tinted background
    borderColor: Colors.gold || '#FFD700',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flex: 1, 
    paddingRight: 10, 
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: 5,
  },
  unreadTitle: {
    fontFamily: Fonts.semibold,
    color: Colors.textPrimary || '#000',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold || '#FFD700',
    marginLeft: 8,
  },
  content: {
    fontFamily: Fonts.regular,
  },
  unreadContent: {
    fontFamily: Fonts.medium,
    color: Colors.textPrimary || '#000',
  },
  unreadText: {
    fontFamily: Fonts.medium,
    color: Colors.textPrimary || '#000',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.border,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  date: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  time: {
    fontFamily: Fonts.regular,
    fontSize: 12,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: Colors.offishWhite,
    borderRadius: 15,
    alignItems: 'center',
    paddingBottom: 10,
  },
  modalHeader: {
    width: '100%',
    backgroundColor: Colors.gold,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontFamily: Fonts.semibold,
    fontSize: 20,
    color: Colors.white,
  },
  modalContentContainer: {
    width: '100%',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  modalContent: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  modalDetailsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 5,
    gap: 10,
  },
  modalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.textSecondary,
  },
  modalDate: {
    fontFamily: Fonts.italic,
    color: Colors.textSecondary,
  },
  modalTime: {
    fontFamily: Fonts.italic,
    color: Colors.textSecondary,
  },
});