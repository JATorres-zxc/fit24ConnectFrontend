import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feedback } from '@/types/interface';

interface Props {
  feedbacks: Feedback[];
}

const WorkoutFeedbackList: React.FC<Props> = ({ feedbacks }) => {
  if (!feedbacks.length) {
    return (
      <View style={styles.noFeedbackContainer}>
        <Text style={styles.noFeedbackText}>No feedback yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.feedbackContainer}>
      <Text style={styles.feedbackHeader}>Workout Feedback</Text>
      {feedbacks.map((item, index) => (
        <View key={index} style={styles.feedbackItem}>
          <Text style={styles.feedbackComment}>“{item.comment}”</Text>
          <Text style={styles.feedbackRating}>
            Rating:{" "}
            {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)} ({item.rating}/5)
          </Text>
          {item.createdAt && (
            <Text style={styles.feedbackTimestamp}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  feedbackHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  feedbackItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  feedbackComment: {
    fontSize: 14,
    color: '#444',
  },
  feedbackRating: {
    fontSize: 14,
    color: '#f1c40f',
    fontWeight: '600',
  },
  feedbackTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  noFeedbackContainer: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  noFeedbackText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default WorkoutFeedbackList;
