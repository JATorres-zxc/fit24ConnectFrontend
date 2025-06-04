import { 
  View, Text, StyleSheet, FlatList
} from "react-native";
import React, { useMemo } from "react";
import { format, parseISO, addHours } from "date-fns";

import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Logs {
  id: string;
  facility_name: string;
  status: string;
  timestamp: string;
}

interface Props {
  accessLogs: Logs[];
}

export default function AccessLogsContainer({ accessLogs }: Props) {
  const formattedLogs = useMemo(() => {
    return accessLogs.map(log => {
      console.log('Original timestamp: ', log.timestamp);

      // Parse the ISO timestamp string to a Date object
      const date = parseISO(log.timestamp);
      console.log('Parsed date: ', date);
      
      // Convert to UTC+8 timezone
      const utc8Date = addHours(date, 8);
      console.log('UTC+8 date: ', utc8Date);
      
      return {
        ...log,
        formattedDate: format(utc8Date, 'MMMM d, yyyy'),
        formattedTime: format(utc8Date, 'h:mm a')
      };
    });
  }, [accessLogs]);

  return (
    <View style={styles.container}>
      <FlatList
        data={formattedLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftSection}>
              <Text style={styles.title}>{item.facility_name}</Text>
              <Text style={styles.content}>
                Access Status:{' '}
                <Text style={[
                  styles.status,
                  { color: item.status === 'success' ? Colors.green : Colors.red }
                ]}>
                  {item.status}
                </Text>
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.rightSection}>
              <Text style={styles.date}>{item.formattedDate}</Text>
              <Text style={styles.time}>{item.formattedTime}</Text>
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
  status: {
    fontFamily: Fonts.italic,
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
});