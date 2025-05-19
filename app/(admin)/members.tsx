import { View, StyleSheet, TextInput, Text, TouchableOpacity, Modal, FlatList, Pressable, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import Toast from "react-native-toast-message";
import { AntDesign, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/constants/ApiConfig';

// Import interface for the member object
import { Member } from '@/types/interface';

export default function MembersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [trainers, setTrainers] = useState<Member[]>([]);
  const hasMissingNames = members.some(member => !member.full_name?.trim());

  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

  // Fetch the member list from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/account/members/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Set members to state
          setAllMembers(data);
          setMembers(data);
          setFilteredMembers(data);
        } else {
          console.error('Failed to fetch members', await response.text());
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const filtered = allMembers.filter(member => {
      const name = String(member.full_name || member.id || '');
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setMembers(filtered);
  }, [searchQuery, allMembers]);

  const handleAssignTrainer = async () => {
    if (selectedMember) {
      try {
        const token = await AsyncStorage.getItem('authToken');
  
        const response = await fetch(`${API_BASE_URL}/api/account/trainer-status/${selectedMember.id}/assign/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Trainer assigned:', data);
  
          // Add to trainers if not already there
          setTrainers(prev => {
            if (!prev.find(t => t.id === selectedMember.id)) {
              return [...prev, selectedMember];
            }
            return prev;
          });
  
          // Remove from members list
          setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
          setModalVisible(false);
          
          // Show success toast
          Toast.show({
            type: 'success',
            text1: 'Trainer Assigned',
            text2: `${selectedMember.full_name || selectedMember.id} has been assigned as a trainer.`,
            position: 'top',
            topOffset: 100,
          });

          
          setSelectedMember(null);
        } else {
          const errorData = await response.json();
          console.error('Failed to assign trainer:', errorData);
          setModalVisible(false);

          // Show error toast
          Toast.show({
            type: 'error',
            text1: 'Assignment Failed',
            text2: errorData.message || 'Failed to assign trainer. Please try again.',
            position: 'top',
            topOffset: 100,
          });
        }
      } catch (error) {
        console.error('Error assigning trainer:', error);
        setModalVisible(false);
        
        // Show error toast for exception
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'An error occurred while assigning the trainer. Please try again.',
          position: 'top',
          topOffset: 100,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header screen='Gym Members' />

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

      {hasMissingNames && (
        <Text style={{ color: 'orange', fontStyle: 'italic', marginHorizontal: 20 }}>
          Some members and/or trainers have not set up their profiles yet.
        </Text>
      )}

      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Left Section - Member Name */}
            <View style={styles.leftSection}>
              <Text style={styles.name}>
                {item.full_name || `Member ID: ${item.id}`}
              </Text>
            </View>

            {/* Right Section - Icons */}
            <View style={styles.rightSection}>
              <TouchableOpacity onPress={() => {
                setSelectedMember(item);
                setModalVisible(true);
              }}>
                  <MaterialCommunityIcons name="medal-outline" size={24} color="black" />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={() => router.push({
                  pathname: `/(admin)/member-profile`,
                  params: {
                    memberId: item.id,
                    fullName: item.full_name,
                    membershipType: item.type_of_membership,
                    membershipStartDate: item.membership_start_date,
                    membershipEndDate: item.membership_end_date,
                  } // Pass the member details to member-profile screen
                })}>
                <MaterialCommunityIcons name="credit-card-edit-outline" size={24} color="black"  />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No members found</Text>
          </View>
        }
      />

      {/* Assign as Trainer Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <Pressable>
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <FontAwesome6 name="dumbbell" size={36} color={Colors.black} />
                </View>
                <Text style={styles.modalTitle}>Assign as Trainer?</Text>
                <Text style={styles.modalText}>
                  You're going to assign{' '}
                  <Text style={styles.selectedMember}>
                    "{selectedMember?.full_name?.trim() || selectedMember?.id}"
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
                    style={[styles.modalButton, styles.assignButton]} 
                    onPress={handleAssignTrainer}
                  >
                    <Text style={[styles.buttonText, styles.assignButtonText]}>Assign</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
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
  selectedMember: {
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
  assignButton: {
    backgroundColor: Colors.green,
  },
  buttonText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
  },
  assignButtonText: {
    color: Colors.white,
  },
});
