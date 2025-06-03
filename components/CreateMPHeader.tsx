import { Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { router } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AntDesign from '@expo/vector-icons/AntDesign';

type CreateMealPlanButtonProps = {
  setViewState: (view: string) => void;
  setMealPlan: (mealPlan: null) => void; // Add this to clear mealPlan
  setSelectedMemberData: (selectedMemberData: null) => void;
};

export default function CreateMealPlanButton({ setViewState, setMealPlan, setSelectedMemberData }: CreateMealPlanButtonProps) {

  const handlePress = () => {
    setMealPlan(null); // Clear selected mealPlan when navigating back
    setViewState(""); 
    setSelectedMemberData(null); // Clear selected member data when navigating back
    router.push('/(trainer)/mealplan');
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
            Create Meal Plan
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
