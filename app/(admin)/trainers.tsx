import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Feather, AntDesign, FontAwesome6 } from '@expo/vector-icons';

// Initial trainers data
const initialTrainers = [
  { trainerId: "1", name: 'John' },
  { trainerId: "2", name: 'Alexis' },
  { trainerId: "3", name: 'Ezra' },
  { trainerId: "4", name: 'Ruel' },
  { trainerId: "5", name: 'Matthew' },
  { trainerId: "6", name: 'Samuel' },
  { trainerId: "7", name: 'Mark' },
  { trainerId: "8", name: 'Paul' },
  { trainerId: "9", name: 'Andres' },
  { trainerId: "10", name: 'Lovely' },
];

type Trainer = {
  id: string;
  full_name: string;
};

export default function TrainersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trainers, setTrainers] = useState<Trainer[]>([]); // Convert trainers to state
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null> (null);

  // 👇 Fetch the trainer list from the API
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const API_BASE_URL = 
          Platform.OS === 'web'
            ? 'http://127.0.0.1:8000'
            : 'http://192.168.1.9:8000';

        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/account/trainers/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API Response:', data);

          // Assuming your API returns something like [{ name: 'John', trainerId: 1 }, ...]
          setTrainers(data);
          setFilteredTrainers(data);
        } else {
          console.error('Failed to fetch trainers', await response.text());
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };

    fetchTrainers();
  }, []);

  // Filter trainers when search query changes or when trainers change
  useEffect(() => {
    if (searchQuery) {
      const filtered = trainers.filter(trainer =>
        trainer.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTrainers(filtered);
    } else {
      setFilteredTrainers(trainers);
    }
  }, [searchQuery, trainers]); // Add trainers as dependency

  const handleRemoveTrainer = async () => {
    if (selectedTrainer) {
      try {
        const API_BASE_URL =
          Platform.OS === 'web'
            ? 'http://127.0.0.1:8000'
            : 'http://192.168.1.9:8000';
  
        const token = await AsyncStorage.getItem('authToken');
  
        const response = await fetch(`${API_BASE_URL}/api/account/trainer-status/${selectedTrainer.id}/remove/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          // Remove from local state
          const updatedTrainers = trainers.filter(trainer => trainer.id !== selectedTrainer.id);
          setTrainers(updatedTrainers);
          setModalVisible(false);
          setSelectedTrainer(null);
        } else {
          console.error('Failed to delete trainer:', await response.text());
        }
      } catch (error) {
        console.error('Error deleting trainer:', error);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Header screen="Trainers" />

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={Colors.white}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <AntDesign name="search1" size={20} color={Colors.white} style={styles.searchIcon} />
        </View>
      </View>

      <FlatList
        data={trainers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Left Section - Trainer Name */}
            <View style={styles.leftSection}>
              <Text style={styles.name}>{item.user.full_name}</Text>
            </View>

            {/* Right Section - Icon */}
            <TouchableOpacity 
              style={styles.rightSection}
              onPress={() => {
                setSelectedTrainer(item);
                setModalVisible(true);
              }}
            >
              <Feather name="user-minus" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trainers found</Text>
          </View>
        }
      />

      {/* Remove Trainer Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <FontAwesome6 name="dumbbell" size={36} color={Colors.black} />
                </View>
                <Text style={styles.modalTitle}>Remove as Trainer?</Text>
                <Text style={styles.modalText}>
                  You're going to remove{' '}
                  <Text style={styles.selectedTrainer}>
                    "{selectedTrainer?.full_name}"
                  </Text> 
                  {' '}as a trainer. Are you sure?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.removeButton]} 
                    onPress={handleRemoveTrainer}
                  >
                    <Text style={[styles.buttonText, styles.removeButtonText]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  searchContainer: {
    width: '85%',
    marginBottom: 10, 
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.black,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontFamily: Fonts.regular,
  },
  searchIcon: {
    marginLeft: 10, 
  },
  listContainer: {
    width: '85%',
    alignSelf: 'center',
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
    width: '100%',
  },
  leftSection: {
    paddingRight: 10,
  },
  name: {
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: Fonts.regular,
    color: Colors.black,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    marginBottom: 15,
  },
  modalText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  selectedTrainer: {
    fontFamily: Fonts.semiboldItalic,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.bg,
  },
  removeButton: {
    backgroundColor: Colors.red,
  },
  buttonText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
  removeButtonText: {
    color: Colors.white,
  },
});