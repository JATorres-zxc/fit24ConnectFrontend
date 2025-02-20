import { View, Text, StyleSheet, FlatList } from "react-native";

import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface Props {
  announcements: Announcement[];
}

export default function AnnouncementsContainer({ announcements }: Props) {
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
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.postedby}>posted by {item.admin}</Text>
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
    backgroundColor: 'white',
    borderColor: Colors.icongray,
    borderWidth: 1,
    padding: 5,
  },
  content: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
  cardFooter: {
    marginTop: 5,
  },
  postedby: {
    fontSize: 12,
    fontFamily: Fonts.italic,
    textAlign: 'right',
  }
});
