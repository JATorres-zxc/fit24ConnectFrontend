// NotificationsContainer.tsx
import React, { useState } from "react";
import { 
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Modal, Pressable
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
        <Pressable onPress={closeNotificationModal}>
          <View style={styles.modalOverlay}>
            <Pressable>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedNotification.title}</Text>
                  <FontAwesome name="close" color={Colors.white} size={24} onPress={closeNotificationModal} />
                </View>
                <View style={styles.modalContentContainer}>
                  <Text style={styles.modalContent}>{selectedNotification.content}</Text>
                </View>
                <View style={styles.modalDetailsContainer}>
                  <Text style={styles.modalDate}>{date}</Text>
                  <View style={styles.modalDivider} />
                  <Text style={styles.modalTime}>{time}</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={localNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => openNotificationModal(item)}
            >
              <View style={styles.leftSection}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.content}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.rightSection}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.time}>{item.time}</Text>
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
  leftSection: {
    flex: 1, 
    paddingRight: 10, 
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    marginBottom: 5,
  },
  content: {
    fontFamily: Fonts.regular,
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