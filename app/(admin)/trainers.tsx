import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

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

export default function TrainersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trainers, setTrainers] = useState(initialTrainers); // Convert trainers to state
  const [filteredTrainers, setFilteredTrainers] = useState(initialTrainers);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  // Filter trainers when search query changes or when trainers change
  useEffect(() => {
    if (searchQuery) {
      const filtered = trainers.filter(trainer =>
        trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTrainers(filtered);
    } else {
      setFilteredTrainers(trainers);
    }
  }, [searchQuery, trainers]); // Add trainers as dependency

  const handleRemoveTrainer = () => {
    if (selectedTrainer) {
      // Update the trainers state
      const updatedTrainers = trainers.filter(trainer => trainer.trainerId !== selectedTrainer.trainerId);
      setTrainers(updatedTrainers);
      
      // Close the modal
      setModalVisible(false);
      setSelectedTrainer(null);
    }
  };

  const openRemoveModal = (trainer) => {
    setSelectedTrainer(trainer);
    setModalVisible(true);
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
        data={filteredTrainers}
        keyExtractor={(item) => item.trainerId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Left Section - Trainer Name */}
            <View style={styles.leftSection}>
              <Text style={styles.name}>{item.name}</Text>
            </View>

            {/* Right Section - Icon */}
            <TouchableOpacity 
              style={styles.rightSection}
              onPress={() => openRemoveModal(item)}
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
                    "{selectedTrainer?.name}"
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