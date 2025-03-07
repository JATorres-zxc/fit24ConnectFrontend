import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  admin: string;
}

interface Props {
  announcements: Announcement[];
  onDelete: (id:string) => void; // function to handle deletion
}

export default function AdminAnnouncements({ announcements, onDelete }: Props) {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDeletePress = (id: string) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      onDelete(selectedId);
      setModalVisible(false);
      setSelectedId(null);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.headerText}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.content}>{item.content}</Text>

              <View style={styles.contentSettings}>
                <TouchableOpacity onPress={() => router.push({
                  pathname: '/(admin)/edit-announcement',
                  params: { 
                    id: item.id, 
                    title: item.title, 
                    content: item.content 
                  }
                })}>
                  <MaterialCommunityIcons name="pencil-outline" color={Colors.eyeIcon} size={20} />
                </TouchableOpacity>
                  
                <TouchableOpacity onPress={() => handleDeletePress(item.id)}>
                  <MaterialCommunityIcons name="trash-can-outline" color={Colors.eyeIcon} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.postedby}>posted by {item.admin}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Confirmation Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="delete-alert-outline" color={Colors.black} size={30} style={styles.icon} />
              <Text style={styles.modalTitle}> Delete Announcement? </Text>
            </View>

            <Text style={styles.modalText}>You're going to permanently delete "{selectedId ? announcements.find(a => a.id === selectedId)?.title : ''}." Are you sure?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '85%',
  },
  listContainer: {
    paddingBottom: 10,
  },
  card: {
    marginVertical: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 5,
  },
  headerText: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  date: {
    fontSize: 12,
    fontFamily: Fonts.regular,
  },
  cardContent: {
    backgroundColor: Colors.white,
    borderColor: Colors.icongray,
    borderWidth: 1,
    padding: 5,
  },
  content: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  contentSettings: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cardFooter: {
    marginTop: 5,
  },
  postedby: {
    fontSize: 12,
    fontFamily: Fonts.italic,
    textAlign: 'right',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  icon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.gold,
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Fonts.medium,
  },
});
