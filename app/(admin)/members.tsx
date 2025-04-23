import { View, StyleSheet, TextInput, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

// mock members data
const initialMembers = [
  { memberID: "1", name: 'John' },
  { memberID: "2", name: 'Alexis' },
  { memberID: "3", name: 'Ezra' },
  { memberID: "4", name: 'Ruel' },
  { memberID: "5", name: 'Matthew' },
  { memberID: "6", name: 'Samuel' },
  { memberID: "7", name: 'Mark' },
  { memberID: "8", name: 'Paul' },
  { memberID: "9", name: 'Andres' },
  { memberID: "10", name: 'Lovely' },
];

export default function MembersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState(initialMembers);

  useEffect(() => {
    const filtered = initialMembers.filter(member =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setMembers(filtered);
  }, [searchQuery]);

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
        data={members}
        keyExtractor={(item) => item.memberID}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Left Section - Member Name */}
            <View style={styles.leftSection}>
              <Text style={styles.name}>{item.name}</Text>
            </View>

            {/* Right Section - Icons */}
            <View style={styles.rightSection}>
              <TouchableOpacity>
                <MaterialCommunityIcons name="medal-outline" size={24} color="black" />
              </TouchableOpacity>
              
              <TouchableOpacity>
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
});
