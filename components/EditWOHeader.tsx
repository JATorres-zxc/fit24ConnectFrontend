import { Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { router } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';

type EditWorkoutButtonProps = {
  setViewState: (view: string) => void;
  setWorkout: (workout: null) => void;
  setSelectedMemberData: (selectedMemberData: null) => void;
};

export default function EditWorkoutButton({ setViewState, setWorkout, setSelectedMemberData }: EditWorkoutButtonProps) {

  const handlePress = () => {
    setWorkout(null); // Clear mealPlan when navigating back
    setViewState(""); 
    setSelectedMemberData(null); // Clear selected member data when navigating back
    router.push('/(trainer)/workout');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <AntDesign 
            name='arrowleft' 
            color={'black'} 
            size={24} 
            onPress={handlePress}
          />
          <Text style={styles.headerText}>
            Edit Workout
          </Text>
        </View>

        {/* For spacing purposes */}
        <View style={styles.rightSection}>
          <Text>{''}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.bg,
    marginBottom: 30,
    marginTop: 30,
  },
  header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    headerText: {
      fontSize: 20,
      fontFamily: Fonts.semibold,
    },
    rightSection: {
      alignItems: 'center',
    },
});
