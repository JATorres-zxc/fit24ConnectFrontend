import { View, StyleSheet, TextInput, Text, TouchableOpacity, Modal, FlatList, TouchableWithoutFeedback, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { AntDesign, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Member = {
  id: string;
  full_name: string;
  membership_type: string,
  membership_start_date: string,
  membership_end_date: string,
};

export default function MembersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [trainers, setTrainers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  
  // 👇 Fetch the trainer list from the API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const API_BASE_URL = 
          Platform.OS === 'web'
            ? 'http://127.0.0.1:8000'
            : 'http://192.168.1.11:8000';
  
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/account/members/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
          setFilteredMembers(data); // initialize both
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
    const filtered = members.filter(member =>
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  const handleAssignTrainer = async () => {
    if (selectedMember) {
      try {
        const API_BASE_URL =
          Platform.OS === 'web'
            ? 'http://127.0.0.1:8000'
            : 'http://192.168.1.11:8000';
  
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
          setSelectedMember(null);
        } else {
          const errorData = await response.json();
          console.error('Failed to assign trainer:', errorData);
          alert(errorData.detail || 'Failed to assign trainer');
        }
      } catch (error) {
        console.error('Error assigning trainer:', error);
        alert('An error occurred while assigning trainer');
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

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Left Section - Member Name */}
            <View style={styles.leftSection}>
              <Text style={styles.name}>{item.full_name}</Text>
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
                    membershipType: item.membership_type,
                    startDate: item.membership_start_date,
                    endDate: item.membership_end_date,
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
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <FontAwesome6 name="dumbbell" size={36} color={Colors.black} />
                </View>
                <Text style={styles.modalTitle}>Assign as Trainer?</Text>
                <Text style={styles.modalText}>
                  You're going to assign{' '}
                  <Text style={styles.selectedMember}>
                    "{selectedMember?.full_name}"
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
