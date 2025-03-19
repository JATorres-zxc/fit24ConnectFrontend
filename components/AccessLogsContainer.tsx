import { 
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Modal, TouchableWithoutFeedback
  } from "react-native";
import React, { useState } from "react";

import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Logs {
  id: string;
  facilityName: string;
  accessStatus: string;
  date: string;
  time: string;
}

interface Props {
  accessLogs: Logs[];
}

export default function AccessLogsContainer({ accessLogs }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={accessLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View 
            style={styles.card}
          >
            <View style={styles.leftSection}>
              <Text style={styles.title}>{item.facilityName}</Text>
              <Text style={styles.content}>
                Access Status:{' '}
                <Text style={styles.status}>
                  {item.accessStatus}
                </Text>
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.rightSection}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.time}>{item.time}</Text>
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
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
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