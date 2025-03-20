import { Text, View, StyleSheet, FlatList, TextInput } from 'react-native';

import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Feather, AntDesign } from '@expo/vector-icons';

const trainers = [
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
  return (
    <View style={styles.container}>
      <Header screen="Trainers" />

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={Colors.white}
          />
          <AntDesign name="search1" size={20} color={Colors.white} style={styles.searchIcon} />
        </View>
      </View>

      <FlatList
        data={trainers}
        keyExtractor={(item) => item.trainerId}
        renderItem={({ item }) => (
          <View style={styles.card}>
        {/* Left Section - Trainer Name */}
        <View style={styles.leftSection}>
          <Text style={styles.name}>{item.name}</Text>
        </View>

        {/* Right Section - Icon */}
        <View style={styles.rightSection}>
          <Feather name="user-minus" size={24} color="black" />
        </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
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
});
